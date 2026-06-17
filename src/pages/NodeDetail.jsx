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
              {data.feature && <p style={styles.feature}>{data.feature}</p>}
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
    height: '96vh', // 适配屏幕高度，留出一点上下边距
    aspectRatio: '1 / 1', // 强制绑定 AI 生成图的 1024x1024 原始比例，极其关键
    flexShrink: 0,
  },
  signboardImg: {
    width: '100%',
    height: '100%',
    display: 'block',
    filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.2))',
  },
  parchmentArea: {
    position: 'absolute',
    top: '26%',        // 增加顶部间距，避开内框
    bottom: '36%',     // 增加底部间距，完全避开线稿
    left: '39%',       // 收缩左右边距，防止碰到内框线
    right: '39%',
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
    fontSize: 'clamp(14px, 1.8vh, 16px)',
    color: '#3a342d',
    lineHeight: '1.7',
    textAlign: 'justify',
    fontFamily: '"STKaiti", "KaiTi", serif',
    fontWeight: '600',
    marginBottom: '12px',
  },
  feature: {
    fontSize: 'clamp(12px, 1.6vh, 14px)',
    color: '#5c4e3c',
    lineHeight: '1.6',
    textAlign: 'justify',
    fontFamily: '"STKaiti", "KaiTi", serif',
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
