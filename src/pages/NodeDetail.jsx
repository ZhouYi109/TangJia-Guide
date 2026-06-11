import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MapLightbox from '../components/MapLightbox';
import { nodes } from '../data/nodes';

export default function NodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);

  // 查找对应节点数据
  const data = nodes.find(n => n.id === id) || nodes[0];

  return (
    <>
      <BottomNav />
      
      {/* 顶部返回导航 */}
      <div style={styles.topNav}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ‹ 返回向导
        </button>
      </div>

      <div className="page-content" style={{ ...styles.container, paddingTop: 0 }}>
        
        {/* 节点导视图区域 (无遮挡设计) */}
        <div style={styles.mapBox}>
          <div style={styles.inlineMapContainer} onClick={() => setMapOpen(true)}>
            <img src={data.mapImage} alt={`${data.name}导视图`} style={styles.nodeMap} />
            <div style={styles.expandHint}>点击放大导视图</div>
          </div>
          
          {/* 标签放在图片下方，彻底解决遮挡 */}
          <div style={styles.tagList}>
            {data.tags.map((tag, idx) => (
              <span key={idx} style={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <h2 style={styles.title}>{data.name}</h2>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>向导信息与背景</h4>
          <p style={styles.text}>{data.description}</p>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>视觉密码导视</h4>
          <p style={styles.text}>{data.feature}</p>
        </div>
      </div>

      {/* 节点专用导视图的全屏互动模式 */}
      <MapLightbox 
        isOpen={mapOpen} 
        onClose={() => setMapOpen(false)} 
        imageSrc={data.mapImage}
      />
    </>
  );
}

const styles = {
  container: {
    paddingBottom: '80px', // 因为没有了悬浮操作台，底部留白可以变小
  },
  topNav: {
    padding: '12px 20px',
    backgroundColor: '#fff',
  },
  backBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-accent-blue)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '4px 0',
  },
  mapBox: {
    margin: '0 -20px 20px -20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
  },
  inlineMapContainer: {
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  nodeMap: {
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
  tagList: {
    display: 'flex',
    gap: '8px',
    padding: '12px 20px 0', // 放置于图片下方，左右与主体对齐
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text-secondary)',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    border: '1px solid var(--color-border)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    marginTop: '16px',
    fontFamily: 'var(--font-family-serif)',
  },
  card: {
    backgroundColor: 'var(--color-primary-warm)',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid rgba(255,255,255,0.4)',
  },
  cardTitle: {
    fontSize: '14px',
    color: 'var(--color-accent-blue)',
    marginBottom: '8px',
    fontWeight: '600',
  },
  text: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
  }
};
