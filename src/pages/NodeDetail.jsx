import { useParams, useNavigate } from 'react-router-dom';
import { nodes } from '../data/nodes';

export default function NodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = nodes.find(n => n.id === id) || nodes[0];
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
            
            <div style={styles.tagList}>
              {data.tags && data.tags.map((tag, idx) => (
                <span key={idx} style={styles.tag}>{tag}</span>
              ))}
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
    top: '24.5%',      // 避开顶部飞檐和玉石
    bottom: '31%',     // 避开底部青砖和专属线稿图
    left: '35.5%',     // 完美锁定在 1:1 图片中间的羊皮纸区域
    right: '35.5%',
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
  tagList: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '8px',
    flexShrink: 0,
  },
  tag: {
    fontSize: 'clamp(10px, 1.4vh, 12px)',
    padding: '3px 8px',
    backgroundColor: 'rgba(140, 122, 97, 0.1)',
    border: '1px solid #8c7a61',
    color: '#5c4e3c',
    borderRadius: '12px',
    whiteSpace: 'nowrap',
  }
};
