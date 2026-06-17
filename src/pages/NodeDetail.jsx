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
  const arrowRotation = (heading !== null && bearing !== undefined) ? getRelativeRotation(heading, bearing) : null;
  const distanceText = {
    value: distance !== undefined ? (distance > 1000 ? (distance / 1000).toFixed(2) : Math.round(distance)) : '--',
    unit: distance !== undefined ? (distance > 1000 ? 'km' : 'm') : ''
  };

  const posterSrc = data.posterImage || '/posters/poster_sanmiao.png';

  return (
    <div style={styles.screenWrapper}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        <span style={{ fontSize: '20px' }}>←</span> 返回地图
      </button>

      <div style={styles.mainContent}>
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

      <div style={styles.bottomBar}>
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
  );
}

const styles = {
  screenWrapper: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f4f0ea',
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute',
    top: '30px',
    left: '20px',
    backgroundColor: 'rgba(255,255,255,0.7)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#3e3a35',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '70px 20px 20px 20px',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    maxHeight: '100%',
    aspectRatio: '0.45 / 0.7',
    overflow: 'hidden',
  },
  signboardImg: {
    position: 'absolute',
    width: '330%',
    height: '180%',
    top: '-40%',
    left: '-115%',
    display: 'block',
  },
  parchmentArea: {
    position: 'absolute',
    top: '8%',
    bottom: '32%',
    left: '8%',
    right: '8%',
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
    fontSize: 'clamp(14px, 2.2vh, 18px)',
    color: '#3a342d',
    lineHeight: '1.8',
    textAlign: 'justify',
    fontFamily: '"STKaiti", "KaiTi", serif',
    fontWeight: '600',
    marginBottom: '12px',
  },
  bottomBar: {
    width: '100%',
    backgroundColor: '#eadecf',
    padding: '16px 24px',
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    borderTop: '1px solid rgba(140, 110, 90, 0.2)',
    boxShadow: '0 -4px 15px rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
