import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MapLightbox from '../components/MapLightbox';
import useGeolocation, { getDistance } from '../hooks/useGeolocation';
import useCompass from '../hooks/useCompass';
import { nodes, getMapPositionPercent, getCoordsFromMapPercent } from '../data/nodes';
import { calculateBearing, getRelativeRotation } from '../utils/geoMath';

export default function Home() {
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('attraction');
  
  const { position, isMocking, setIsMocking, setMockPosition } = useGeolocation();
  const { heading, error: compassError, permissionGranted, requestPermission } = useCompass();

  // 根据当前位置计算距离，并对节点进行排序
  const sortedNodes = useMemo(() => {
    let filtered = nodes.filter(n => n.category === activeCategory);
    
    if (!position) return filtered; 
    
    return filtered.map(node => {
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
        
        {/* 新版特色定位标：不规则有机水滴形 */}
        <div style={styles.customPinWrapper}>
          <div style={styles.customPinBody}>
            <img src="/user_marker.png" alt="定位标" style={styles.customPinImage} />
          </div>
        </div>
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
            <h2 style={styles.subtitle}>唐家古镇 智能导览</h2>
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

        {/* 动态排序的分类列表 */}
        <section style={styles.routes}>
          <div style={styles.tabsContainer}>
            <button 
              style={activeCategory === 'attraction' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveCategory('attraction')}
            >🏞️ 景点</button>
            <button 
              style={activeCategory === 'dining' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveCategory('dining')}
            >🍜 餐饮</button>
            <button 
              style={activeCategory === 'parking' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveCategory('parking')}
            >🚗 停车</button>
            <button 
              style={activeCategory === 'restroom' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveCategory('restroom')}
            >🚻 卫生间</button>
          </div>

          {/* 同步导视牌：推荐游览线路 */}
          <div style={styles.boardSection}>
            <h3 style={styles.sectionTitle}>推荐线路</h3>
            <div style={styles.routeCard}>
              <div style={styles.routeHeader}>
                <span style={styles.routeName}>线路A 自然景观线</span>
                <span style={styles.routeTime}>20 min</span>
              </div>
              <div style={styles.routePath}>共乐园 ➔ 唐家三庙 ➔ 梁氏大宗祠</div>
            </div>
            
            <div style={styles.routeCard}>
              <div style={styles.routeHeader}>
                <span style={styles.routeName}>线路B 历史文化线</span>
                <span style={styles.routeTime}>45 min</span>
              </div>
              <div style={styles.routePath}>望慈山房 ➔ 唐绍仪故居 ➔ 珠海留学文化馆 ➔ 唐涤生大剧院 ➔ 唐家湾乡思馆 ➔ 瑞芝祠</div>
            </div>

            <div style={styles.routeCard}>
              <div style={styles.routeHeader}>
                <span style={styles.routeName}>线路C 休闲漫游线</span>
                <span style={styles.routeTime}>30 min</span>
              </div>
              <div style={styles.routePath}>山房路 ➔ 共乐园</div>
            </div>
          </div>

          {/* 同步导视牌：智能体验 */}
          <div style={styles.boardSection}>
            <h3 style={styles.sectionTitle}>智能体验</h3>
            <div style={styles.experienceGrid}>
              <div style={styles.expItem}>
                <h4 style={{margin: '0 0 4px 0'}}>📱 扫码导览</h4>
                <p style={{margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)'}}>开启语音导览与智能路线规划</p>
              </div>
              <div style={styles.expItem}>
                <h4 style={{margin: '0 0 4px 0'}}>📍 节点打卡</h4>
                <p style={{margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)'}}>探访特色景点，打卡记录精彩瞬间</p>
              </div>
              <div style={styles.expItem}>
                <h4 style={{margin: '0 0 4px 0'}}>💠 纹样收集</h4>
                <p style={{margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)'}}>发现古镇纹样，收集特色图鉴</p>
              </div>
            </div>
          </div>

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h4 style={styles.nodeName}>{node.name}</h4>
                    {node.rating && (
                      <span style={styles.ratingBadge}>⭐ {node.rating}分</span>
                    )}
                  </div>
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

      {/* 随手机自动旋转且支持缩放的沉浸模式 */}
      <MapLightbox 
        isOpen={mapOpen} 
        onClose={() => setMapOpen(false)} 
        imageSrc="/global_map.png"
        onClickMap={(xPercent, yPercent) => {
          if (isMocking) {
            const coords = getCoordsFromMapPercent(xPercent, yPercent);
            setMockPosition(coords);
          }
        }}
      >
        {/* 定位点随之缩放跟随 */}
        {renderUserMarker()}
        {isMocking && (
          <div style={styles.mockHintOverlay}>
            漫游模式已开启：请点击地图任意位置模拟巡游
          </div>
        )}
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
    height: 'auto',
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
    width: '36px',
    height: '36px',
    backgroundColor: 'rgba(180, 100, 50, 0.4)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  customPinWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, calc(-50% - 15px))',
    zIndex: 2,
    pointerEvents: 'none',
  },
  customPinBody: {
    width: '22px',
    height: '22px',
    borderRadius: '50% 60% 50% 2px',
    border: '2px solid rgba(100, 80, 60, 0.85)',
    overflow: 'hidden',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
    transform: 'rotate(-45deg)',
  },
  customPinImage: {
    width: '160%',
    height: '160%',
    objectFit: 'cover',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    filter: 'sepia(0.4) contrast(0.9) brightness(0.85)',
  },
  mapCompassArrow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderBottom: '14px solid rgba(139, 0, 0, 0.8)',
    transformOrigin: 'bottom center',
    zIndex: 3,
  },
  userMarkerLabel: {
    marginTop: '12px',
    backgroundColor: 'rgba(240,230,215,0.9)',
    color: '#8B0000',
    border: '1px solid rgba(140,110,90,0.5)',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 3,
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
  tabsContainer: {
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '16px',
    border: '1px solid rgba(255,255,255,0.8)',
  },
  tabActive: {
    flex: 1,
    padding: '8px',
    border: 'none',
    backgroundColor: '#fff',
    color: 'var(--color-primary-cool)',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabInactive: {
    flex: 1,
    padding: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
    margin: '0',
    color: 'var(--color-text-primary)',
  },
  ratingBadge: {
    backgroundColor: '#FFF8E1',
    color: '#FF8F00',
    fontSize: '11px',
    padding: '2px 6px',
    borderRadius: '8px',
    fontWeight: 'bold',
    border: '1px solid #FFE082'
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
  },
  fullscreenOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenMapContainer: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenMap: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  closeHint: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    pointerEvents: 'none',
    zIndex: 10000,
  },
  boardSection: {
    marginBottom: '20px',
  },
  routeCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '10px',
    borderLeft: '4px solid var(--color-accent-blue)',
    border: '1px solid rgba(255,255,255,0.8)'
  },
  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
    fontWeight: 'bold',
    color: 'var(--color-text-primary)'
  },
  routeTime: {
    color: 'var(--color-text-secondary)',
    fontSize: '12px'
  },
  routePath: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6'
  },
  experienceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px'
  },
  expItem: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)'
  },
  mockHintOverlay: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--color-accent-blue)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 10,
    animation: 'pulse 2s infinite',
  }
};
