import { useParams, useNavigate } from 'react-router-dom';
import { nodes } from '../data/nodes';
import useGeolocation, { getDistance } from '../hooks/useGeolocation';
import useCompass from '../hooks/useCompass';
import { calculateBearing, getRelativeRotation } from '../utils/geoMath';

export default function NodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = nodes.find(n => n.id === id) || nodes[0];
  
  const { position } = useGeolocation();
  const { heading, permissionGranted } = useCompass();
  
  const distance = position ? getDistance(position.latitude, position.longitude, data.coords.latitude, data.coords.longitude) : undefined;
  const bearing = position ? calculateBearing(position.latitude, position.longitude, data.coords.latitude, data.coords.longitude) : undefined;
  const rotation = (heading !== null && bearing !== undefined) ? getRelativeRotation(heading, bearing) : undefined;

  const posterSrc = data.posterImage || '/posters/poster_sanmiao.png';

  return (
    <div style={styles.pageBackground}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ‹ 返回向导
      </button>

      <div style={styles.screenWrapper}>
        <div style={styles.imageWrapper}>
          <img src={posterSrc} alt="导视牌" style={styles.signboardImg} />
          
          <div style={styles.parchmentArea}>
            <h1 style={styles.title}>{data.name}</h1>
            <div style={styles.divider}></div>
            
            <div style={styles.scrollContent}>
              <p style={styles.description}>{data.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.bottomNavContainer}>
        <div style={styles.distanceCard}>
          <div style={styles.distInfo}>
            <span style={styles.distLabel}>距您当前位置</span>
            <span style={styles.distValue}>
              {distance !== undefined ? (
                distance > 1000 
                  ? `${(distance / 1000).toFixed(2)} km` 
                  : `${Math.round(distance)} m`
              ) : '测距中...'}
            </span>
          </div>
          
          <div style={styles.navAction}>
            <span style={styles.navHint}>实时指引</span>
            <div style={styles.compassCircle}>
              {permissionGranted && heading !== null && rotation !== undefined ? (
                <div style={{ ...styles.navArrow, transform: `rotate(${rotation}deg)` }}>↑</div>
              ) : (
                <div style={styles.navArrowDisabled}>-</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#e6ded3', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundImage: 'radial-gradient(circle, #f4ede4 0%, #e6ded3 100%)',
  },
  backBtn: {
    position: 'absolute',
    top: '30px',
    left: '20px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#3e3a35',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    zIndex: 10,
  },
  screenWrapper: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: '85vw',
    maxWidth: '380px',
    aspectRatio: '0.36 / 0.62', // 完美的羊皮纸比例
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
    backgroundColor: '#e6ded3',
  },
  signboardImg: {
    position: 'absolute',
    width: '280%',     // 放大图片以去除木框
    height: '160%',
    top: '-32%',       // 精准定位到羊皮纸区域
    left: '-90%',
    display: 'block',
    filter: 'contrast(1.05) brightness(0.95)',
  },
  parchmentArea: {
    position: 'absolute',
    top: '8%',         // 相对于羊皮纸的顶部留白
    bottom: '38%',     // 彻底避开底部的线稿图，不再重叠
    left: '12%',       // 左右留出安全边距
    right: '12%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 'clamp(20px, 3vh, 28px)', 
    fontWeight: '900',
    color: '#2c2825', 
    margin: '0 0 8px 0',
    fontFamily: '"STKaiti", "KaiTi", serif', 
    letterSpacing: '2px',
    textShadow: '0 1px 1px rgba(255,255,255,0.5)',
  },
  divider: {
    width: '70%',
    height: '1px',
    backgroundColor: '#8c7a61',
    marginBottom: '12px',
    opacity: 0.6,
    flexShrink: 0,
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    width: '100%',
    padding: '0 2px',
    scrollbarWidth: 'none', 
  },
  description: {
    fontSize: 'clamp(14px, 2vh, 18px)', // 稍微放大一点描述文字
    color: '#3a342d',
    lineHeight: '1.8',
    textAlign: 'justify',
    fontFamily: '"STKaiti", "KaiTi", serif',
    fontWeight: '600',
    marginBottom: '12px',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '400px',
    zIndex: 100,
  },
  distanceCard: {
    backgroundColor: 'rgba(230, 222, 211, 0.85)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(140, 122, 97, 0.4)',
    borderRadius: '16px',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
  distInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  distLabel: {
    fontSize: '12px',
    color: '#8c7a61',
    fontWeight: 'bold',
  },
  distValue: {
    fontSize: '20px',
    color: '#3a342d',
    fontWeight: '900',
    fontFamily: 'sans-serif',
  },
  navAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navHint: {
    fontSize: '12px',
    color: '#5c4e3c',
    fontWeight: 'bold',
  },
  compassCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(140, 122, 97, 0.1)',
    border: '1px solid #8c7a61',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrow: {
    fontSize: '20px',
    color: '#2c2825',
    fontWeight: '900',
    transition: 'transform 0.05s ease-out',
  },
  navArrowDisabled: {
    fontSize: '20px',
    color: '#b8a48b',
  }
};
