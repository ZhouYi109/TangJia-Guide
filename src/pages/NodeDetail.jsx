import { useParams, useNavigate } from 'react-router-dom';
import { nodes } from '../data/nodes';

export default function NodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // 查找对应节点数据
  const data = nodes.find(n => n.id === id) || nodes[0];
  
  // 如果没有专门的海报，使用通用底图
  const posterSrc = data.posterImage || '/posters/poster_sanmiao.png';

  return (
    <div style={styles.pageBackground}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ‹ 返回向导
      </button>

      <div style={styles.signboardWrapper}>
        <img src={posterSrc} alt="导视牌" style={styles.signboardImg} />
        
        {/* 高清文字完美叠加在羊皮纸区域 */}
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
  );
}

const styles = {
  pageBackground: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#e6ded3', // 古朴的墙面色
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
  signboardWrapper: {
    position: 'relative',
    height: '92vh', // 适配绝大多数手机屏幕高度
    maxHeight: '900px',
    display: 'inline-block',
  },
  signboardImg: {
    height: '100%',
    width: 'auto',
    display: 'block',
    filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.2))',
  },
  parchmentArea: {
    position: 'absolute',
    top: '23%',      // 避开顶部飞檐和玉石
    bottom: '28%',   // 避开底部青砖和线稿
    left: '17%',     // 在木框内部
    right: '17%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '900',
    color: '#2c2825', 
    margin: '0 0 8px 0',
    fontFamily: '"STKaiti", "KaiTi", serif', // 楷体展现古典韵味
    letterSpacing: '2px',
    textShadow: '0 1px 1px rgba(255,255,255,0.5)',
  },
  divider: {
    width: '60%',
    height: '1px',
    backgroundColor: '#8c7a61',
    marginBottom: '16px',
    opacity: 0.6,
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    width: '100%',
    padding: '0 5px',
    scrollbarWidth: 'none', // 隐藏滚动条
  },
  description: {
    fontSize: '16px',
    color: '#3a342d',
    lineHeight: '1.7',
    textAlign: 'justify',
    fontFamily: '"STKaiti", "KaiTi", serif',
    fontWeight: '600',
    marginBottom: '12px',
  },
  feature: {
    fontSize: '14px',
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
    marginTop: '12px',
  },
  tag: {
    fontSize: '12px',
    padding: '3px 10px',
    backgroundColor: 'rgba(140, 122, 97, 0.1)',
    border: '1px solid #8c7a61',
    color: '#5c4e3c',
    borderRadius: '12px',
  }
};
