import { useParams, useNavigate } from 'react-router-dom';
import { nodes } from '../data/nodes';
import useGeolocation, { getDistance } from '../hooks/useGeolocation';
import useCompass from '../hooks/useCompass';
import { calculateBearing, getRelativeRotation } from '../utils/geoMath';

export default function NodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = nodes.find((n) => n.id === id);

  const { position } = useGeolocation();
  const { heading } = useCompass();

  if (!data) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>节点未找到</div>;
  }

  const distance = position ? getDistance(position.latitude, position.longitude, data.coords.latitude, data.coords.longitude) : undefined;
  const bearing = position ? calculateBearing(position.latitude, position.longitude, data.coords.latitude, data.coords.longitude) : undefined;
  const arrowRotation = (heading !== null && bearing !== undefined) ? getRelativeRotation(heading, bearing) : null;
  
  const distanceText = {
    value: distance !== undefined ? (distance > 1000 ? (distance / 1000).toFixed(2) : Math.round(distance)) : '--',
    unit: distance !== undefined ? (distance > 1000 ? 'km' : 'm') : ''
  };

  const posterSrc = data.posterImage || '/posters/poster_sanmiao.png';

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        <span style={{ fontSize: '18px', marginRight: '4px' }}>←</span> 返回地图
      </button>

      {/* 顶部头图（使用原先底图中最精彩的线稿部分） */}
      <div style={styles.heroSection}>
        <img src={posterSrc} alt={data.name} style={styles.heroImage} />
        <div style={styles.heroGradient}></div>
      </div>

      {/* 核心内容区（自适应滚动，图文分离） */}
      <div style={styles.contentSection}>
        <div style={styles.contentContainer}>
          <h1 style={styles.title}>{data.name}</h1>
          <div style={styles.tags}>
            {data.tags && data.tags.map(tag => (
              <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
          
          <div style={styles.card} className="town-card">
            <h3 style={styles.cardTitle}>景点介绍</h3>
            <p style={styles.description}>{data.description}</p>
            {data.feature && <p style={styles.description}>{data.feature}</p>}
          </div>
        </div>
      </div>

      {/* 底部固定的导航栏 */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomBarInner}>
          <div>
            <div style={{ fontSize: '11px', color: '#8c7a61', marginBottom: '4px', fontWeight: 'bold' }}>距您当前位置</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#3a342d', fontFamily: 'Impact, sans-serif' }}>
                {distanceText.value}
              </span>
              <span style={{ fontSize: '12px', color: '#5c4e3c', fontWeight: 'bold' }}>{distanceText.unit}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#5c4e3c', fontWeight: 'bold' }}>实时指引</span>
            <div style={styles.compassCircle}>
              {arrowRotation !== null ? (
                <div 
                  style={{
                    ...styles.navArrow,
                    transform: `rotate(${arrowRotation}deg)`
                  }}
                >↑</div>
              ) : (
                <span style={{ color: '#8c7a61' }}>-</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#faf7f2', // 柔和的米白色背景
    fontFamily: '"STKaiti", "KaiTi", serif',
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute',
    top: 'max(20px, env(safe-area-inset-top))',
    left: '20px',
    backgroundColor: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(140, 110, 90, 0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#3e3a35',
    cursor: 'pointer',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  heroSection: {
    position: 'relative',
    width: '100%',
    height: '35vh',
    minHeight: '260px',
    flexShrink: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 85%', // 精准展示原底图底部的漂亮线稿
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '70%',
    background: 'linear-gradient(to top, #faf7f2 0%, rgba(250, 247, 242, 0) 100%)',
    pointerEvents: 'none',
  },
  contentSection: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 24px 24px 24px',
    marginTop: '-60px', // 内容上浮，与头图渐变融合
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    scrollbarWidth: 'none',
  },
  contentContainer: {
    width: '100%',
    maxWidth: '600px', // 完美适配宽屏电脑
  },
  title: {
    fontSize: '32px',
    color: '#3a342d',
    margin: '0 0 12px 0',
    fontWeight: '900',
    textShadow: '0 2px 4px rgba(255,255,255,0.8)', // 确保在头图上清晰可见
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  },
  tag: {
    padding: '4px 12px',
    backgroundColor: 'rgba(140, 110, 90, 0.1)',
    color: '#8c7a61',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 'bold',
    border: '1px solid rgba(140, 110, 90, 0.2)',
  },
  card: {
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(80,60,40,0.06)',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#8c7a61',
    margin: '0 0 16px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(140, 110, 90, 0.15)',
    fontWeight: 'bold',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.9',
    color: '#4a443d',
    textAlign: 'justify',
    marginBottom: '16px',
  },
  bottomBar: {
    width: '100%',
    backgroundColor: '#fff',
    borderTop: '1px solid rgba(140, 110, 90, 0.15)',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  bottomBarInner: {
    width: '100%',
    maxWidth: '600px',
    padding: '16px 24px',
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compassCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(140, 110, 90, 0.05)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid rgba(140, 110, 90, 0.2)',
  },
  navArrow: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8c7a61',
    transition: 'transform 0.1s ease-out',
  },
};
