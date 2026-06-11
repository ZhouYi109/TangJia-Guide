import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MapLightbox from '../components/MapLightbox';
import useGeolocation, { getDistance } from '../hooks/useGeolocation';
import useCompass from '../hooks/useCompass';
import { nodes, getMapPositionPercent } from '../data/nodes';
import { calculateBearing, getRelativeRotation } from '../utils/geoMath';

export default function Home() {
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);
  
  const { position, isMocking, setIsMocking } = useGeolocation();
  const { heading, error: compassError, permissionGranted, requestPermission } = useCompass();

  // 根据当前位置计算距离，并对节点进行排序
  const sortedNodes = useMemo(() => {
    if (!position) return nodes; 
    
    return [...nodes].map(node => {
      // 1. 计算距离
      const dist = getDistance(
        position.latitude,
        position.longitude,
        node.coords.latitude,
        node.coords.longitude
      );
      
      // 2. 计算绝对方位角
      const bearing = calculateBearing(
        position.latitude,
        position.longitude,
        node.coords.latitude,
        node.coords.longitude
      );

      // 3. 计算 UI 上的相对旋转角度（手机朝向 vs 目标方位）
      const rotation = getRelativeRotation(heading, bearing);

      return { ...node, distance: dist, bearing, rotation };
    }).sort((a, b) => a.distance - b.distance);
  }, [position, heading]);

  // 计算当前用户在手绘地图上的投影百分比位置
  const mapPercent = position ? getMapPositionPercent(position.latitude, position.longitude) : null;

  const renderUserMarker = () => {
    if (!mapPercent) return null;
    return (
      <div 
        style={{
          ...styles.userMarkerWrapper,
          left: `${mapPercent.x}%`,
          top: `${mapPercent.y}%`,
        }}
      >
        <div style={styles.userMarkerPulse}></div>
        <div style={styles.userMarkerCore}></div>
        {heading !== null && (
          <div style={{
            ...styles.mapCompassArrow,
            transform: `translate(-50%, -100%) rotate(${heading}deg)`,
            transformOrigin: 'bottom center'
          }}></div>
        )}
        <div style={styles.userMarkerLabel}>您在这里</div>
      </div>
    );
  };

  return (
    <>
      <BottomNav />
      <div className="page-content" style={{ paddingTop: 0, paddingBottom: '100px' }}>
        
        {/* 全局手绘地图导视图 */}
        <section style={styles.mapSection}>
          <div style={styles.inlineMapContainer} onClick={() => setMapOpen(true)}>
            <img src="/global_map.png" alt="全局地图" style={styles.globalMap} />
            {renderUserMarker()}
            <div style={styles.expandHint}>点击全屏查看向导地图</div>
          </div>
          
          <div style={styles.mapTextContent}>
            <h2 style={styles.subtitle}>唐家古镇导览系统</h2>
            <p style={styles.description}>
              实时定位系统已开启。点击下方按钮激活罗盘，系统将根据您的手机朝向，为您实时指引每个景点的方向。
            </p>
          </div>
        </section>

        {/* GPS 与 罗盘 工具栏 */}
        <div style={styles.debugPanel} className="glass-panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px' }}>
              📍 定位：{position ? (isMocking ? '漫游模式' : '真实定位') : '获取中...'}
            </span>
            <span style={{ fontSize: '12px', color: compassError ? '#D32F2F' : 'inherit' }}>
              🧭 罗盘：{permissionGranted ? (heading !== null ? '工作正常 (实时刷新)' : '校准中...') : '未开启'}
            </span>
            {compassError && <span style={{ fontSize: '10px', color: '#D32F2F' }}>{compassError}</span>}
          </div>

          <div style={styles.btnGroup}>
            <button 
              style={{
                ...styles.debugToggle, 
                backgroundColor: isMocking ? 'var(--color-accent-blue)' : 'var(--color-primary-cool)'
              }}
              onClick={() => setIsMocking(!isMocking)}
            >
              {isMocking ? '关闭漫游' : '漫游演示'}
            </button>
            {!permissionGranted && (
              <button style={styles.compassBtn} onClick={requestPermission}>
                开启向导罗盘
              </button>
            )}
          </div>
        </div>

        {/* 动态排序的景点列表 */}
        <section style={styles.routes}>
          <h3 style={styles.sectionTitle}>附近向导点位 ({sortedNodes.length})</h3>
          <div style={styles.nodeList}>
            {sortedNodes.map((node) => (
              <div 
                key={node.id} 
                style={styles.nodeCard} 
                className="glass-panel"
                onClick={() => navigate(`/node/${node.id}`)}
              >
                <div style={styles.nodeInfo}>
                  <h4 style={styles.nodeName}>{node.name}</h4>
                  <div style={styles.nodeTags}>
                    {node.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div style={styles.distanceWrapper}>
                  <span style={styles.distanceBadge}>
                    {node.distance !== undefined ? (
                      node.distance > 1000 
                        ? `${(node.distance / 1000).toFixed(2)} 公里` 
                        : `${Math.round(node.distance)} 米`
                    ) : '测距中...'}
                  </span>
                  
                  {/* 高性能实时渲染的方向标 */}
                  {permissionGranted && heading !== null && node.rotation !== undefined && (
                    <div 
                      style={{
                        ...styles.navArrow,
                        // 使用 transform 开启 GPU 加速，确保高帧率顺滑旋转
                        transform: `rotate(${node.rotation}deg)` 
                      }}
                    >
                      ↑
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <MapLightbox 
        isOpen={mapOpen} 
        onClose={() => setMapOpen(false)} 
        imageSrc="/global_map.png"
      >
        {/* 全屏模式下，手绘图被放大，定位点随之缩放跟随 */}
        {renderUserMarker()}
      </MapLightbox>
    </>
  );
}

const styles = {
  mapSection: {
    margin: '0 -20px 16px -20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid var(--color-border)',
  },
  inlineMapContainer: {
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  globalMap: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    display: 'block',
  },
  expandHint: {
    position: 'absolute',
    right: '12px',
    bottom: '12px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '12px',
    backdropFilter: 'blur(4px)',
    pointerEvents: 'none',
  },
  userMarkerWrapper: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  userMarkerPulse: {
    position: 'absolute',
    width: '32px',
    height: '32px',
    backgroundColor: 'rgba(239, 83, 80, 0.4)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  userMarkerCore: {
    width: '12px',
    height: '12px',
    backgroundColor: '#EF5350',
    border: '2px solid #fff',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    position: 'relative',
    zIndex: 2,
  },
  mapCompassArrow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderBottom: '12px solid rgba(239, 83, 80, 0.8)',
    transformOrigin: 'bottom center',
    zIndex: 3,
  },
  userMarkerLabel: {
    marginTop: '6px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#D32F2F',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '8px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  mapTextContent: {
    padding: '16px 20px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '8px',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family-serif)',
  },
  description: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  debugPanel: {
    padding: '12px 16px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.6)',
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  debugToggle: {
    border: 'none',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  compassBtn: {
    border: 'none',
    backgroundColor: 'var(--color-accent-green)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(30, 98, 90, 0.3)',
  },
  routes: {
    marginTop: '10px',
  },
  sectionTitle: {
    fontSize: '16px',
    marginBottom: '16px',
    color: 'var(--color-text-primary)',
    borderLeft: '4px solid var(--color-accent-blue)',
    paddingLeft: '8px',
  },
  nodeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  nodeCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    fontSize: '16px',
    margin: '0 0 6px 0',
    color: 'var(--color-text-primary)',
  },
  nodeTags: {
    display: 'flex',
    gap: '6px',
  },
  tag: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-bg-secondary)',
    padding: '2px 8px',
    borderRadius: '8px',
  },
  distanceWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  distanceBadge: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  navArrow: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent-blue)',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(26, 91, 127, 0.4)',
    transition: 'transform 0.05s ease-out', 
  }
};
