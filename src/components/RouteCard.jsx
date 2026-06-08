import { useNavigate } from 'react-router-dom';

export default function RouteCard({ title, duration, nodes, targetNodeId }) {
  const navigate = useNavigate();

  return (
    <div 
      className="glass-panel" 
      style={styles.card}
      onClick={() => navigate(`/node/${targetNodeId}`)}
    >
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <span style={styles.duration}>{duration}</span>
      </div>
      <div style={styles.nodes}>
        {nodes.map((node, index) => (
          <span key={index} style={styles.nodeItem}>
            {node}
            {index < nodes.length - 1 && <span style={styles.arrow}>→</span>}
          </span>
        ))}
      </div>
      <div style={styles.action}>
        <span style={styles.actionText}>开始导览</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: '20px',
    marginBottom: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    backgroundColor: 'var(--color-primary-warm)', // 暖砂岩灰底色
    border: '1px solid rgba(255,255,255,0.4)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '18px',
    margin: 0,
    color: 'var(--color-text-primary)',
  },
  duration: {
    fontSize: '12px',
    color: 'var(--color-accent-blue)',
    backgroundColor: 'rgba(26, 91, 127, 0.1)',
    padding: '4px 8px',
    borderRadius: '12px',
    fontWeight: '500',
  },
  nodes: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '16px',
  },
  nodeItem: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    marginTop: '4px',
  },
  arrow: {
    margin: '0 6px',
    color: 'var(--color-border)',
    fontSize: '12px',
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'var(--color-accent-green)',
    fontSize: '14px',
    fontWeight: '500',
  },
  actionText: {
    marginRight: '4px',
  }
};
