import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import BottomNav from '../components/BottomNav';
import useGeolocation, { getDistance } from '../hooks/useGeolocation';
import useCompass from '../hooks/useCompass';
import { nodes } from '../data/nodes';
import { calculateBearing, getRelativeRotation } from '../utils/geoMath';

// 修复 Leaflet 默认图标路径问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 地图控制器组件：用于在位置更新时平滑移动地图中心
function MapController({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      // 这里的阈值可以控制是否每次都居中。为了让用户可以自由拖拽，只在初次定位时居中比较好
      // 或者提供一个"回到我的位置"按钮。目前保持默认不强制飞跃，以免打断用户浏览
    }
  }, [position, map]);
  return null;
}

export default function Home() {
  const navigate = useNavigate();
  
  const { position, isMocking, setIsMocking } = useGeolocation();
  const { heading, error: compassError, permissionGranted, requestPermission } = useCompass();

  // 根据当前位置计算距离，并对节点进行排序
  const sortedNodes = useMemo(() => {
    if (!position) return nodes; 
    
    return [...nodes].map(node => {
      const dist = getDistance(
        position.latitude,
        position.longitude,
        node.coords.latitude,
        node.coords.longitude
      );
      
      const bearing = calculateBearing(
        position.latitude,
        position.longitude,
        node.coords.latitude,
        node.coords.longitude
      );

      const rotation = getRelativeRotation(heading, bearing);

      return { ...node, distance: dist, bearing, rotation };
    }).sort((a, b) => a.distance - b.distance);
  }, [position, heading]);


  // 创建自定义景点图标
  const createNodeIcon = (name) => {
    return L.divIcon({
      className: 'custom-node-marker',
      html: `<div class="node-marker-pin"></div><div class="node-marker-label">${name}</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10], // 锚点在图标正中心附近
    });
  };

  // 创建自定义用户位置图标（附带指南针箭头）
  const createUserIcon = (heading) => {
    const transformStyle = heading !== null 
      ? `transform: translate(-50%, -100%) rotate(${heading}deg);` 
      : 'display: none;';
      
    return L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="user-marker-pulse"></div>
        <div class="user-marker-core"></div>
        <div class="map-compass-arrow" style="${transformStyle}"></div>
        <div class="user-marker-label-map">您在这里</div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // 唐家湾镇大致中心点
  const defaultCenter = [22.36100, 113.59600];

  return (
    <>
      <BottomNav />
      <div className="page-content" style={{ paddingTop: 0, paddingBottom: '100px' }}>
        
        {/* 真实的交互式地图面板 */}
        <section style={styles.mapSection}>
          <div style={styles.mapContainer}>
            <MapContainer 
              center={defaultCenter} 
              zoom={16} 
              style={{ width: '100%', height: '100%', zIndex: 1 }}
              zoomControl={false}
              attributionControl={false}
            >
              <MapController position={position} />
              
              {/* 高德地图底图瓦片 - 带有丰富真实的地理POI (餐厅、道路等) */}
              <TileLayer
                url="https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
              />
              
              {/* 渲染8个核心景点 */}
              {nodes.map(node => (
                <Marker 
                  key={node.id} 
                  position={[node.coords.latitude, node.coords.longitude]}
                  icon={createNodeIcon(node.name)}
                  eventHandlers={{
                    click: () => navigate(`/node/${node.id}`),
                  }}
                />
              ))}

              {/* 渲染用户当前位置 */}
              {position && (
                <Marker 
                  position={[position.latitude, position.longitude]}
                  icon={createUserIcon(heading)}
                  zIndexOffset={1000} // 确保用户图标在最上层
                />
              )}
            </MapContainer>
            
            {/* 定制化视觉叠加层：边缘暗角融合与四角传统纹理水印 */}
            <div style={styles.mapVignette}></div>
            <div style={styles.cornerTopLeft}></div>
            <div style={styles.cornerTopRight}></div>
            <div style={styles.cornerBottomLeft}></div>
            <div style={styles.cornerBottomRight}></div>

            <div style={styles.expandHint}>双指缩放查看周边真实店面与街道</div>
          </div>
          
          <div style={styles.mapTextContent}>
            <h2 style={styles.subtitle}>唐家古镇导览系统</h2>
            <p style={styles.description}>
              已接入高德真实地理引擎。点击下方按钮激活罗盘，系统将根据您的手机朝向，为您实时指引每个景点的方向。
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
    </>
  );
}

const styles = {
  mapSection: {
    margin: '0 -20px 16px -20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid var(--color-border)',
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: '300px', // 设定一个固定的高度，方便拖拽交互
    overflow: 'hidden',
  },
  mapVignette: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    boxShadow: 'inset 0 0 60px rgba(100, 70, 40, 0.4)',
    pointerEvents: 'none',
    zIndex: 900,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: '-20px', left: '-20px',
    width: '140px', height: '140px',
    backgroundImage: 'url(/haokeqiang_pattern.png)',
    backgroundSize: 'contain',
    opacity: 0.25,
    mixBlendMode: 'multiply',
    pointerEvents: 'none',
    zIndex: 900,
  },
  cornerTopRight: {
    position: 'absolute',
    top: '-20px', right: '-20px',
    width: '140px', height: '140px',
    backgroundImage: 'url(/gongleyuan_pattern.png)',
    backgroundSize: 'contain',
    opacity: 0.25,
    mixBlendMode: 'multiply',
    pointerEvents: 'none',
    zIndex: 900,
    transform: 'scaleX(-1)',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: '-20px', left: '-20px',
    width: '140px', height: '140px',
    backgroundImage: 'url(/tangjia_sanmiao_pattern.png)',
    backgroundSize: 'contain',
    opacity: 0.25,
    mixBlendMode: 'multiply',
    pointerEvents: 'none',
    zIndex: 900,
    transform: 'scaleY(-1)', 
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: '-20px', right: '-20px',
    width: '140px', height: '140px',
    backgroundImage: 'url(/haokeqiang_pattern.png)',
    backgroundSize: 'contain',
    opacity: 0.25,
    mixBlendMode: 'multiply',
    pointerEvents: 'none',
    zIndex: 900,
    transform: 'scale(-1, -1)', 
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
    zIndex: 1000,
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
