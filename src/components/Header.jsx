import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header style={styles.header} className="glass-panel">
      {!isHome && (
        <button 
          style={styles.iconBtn} 
          onClick={() => navigate(-1)}
          aria-label="返回"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      )}
      {isHome && <div style={styles.placeholder}></div>}
      
      <h1 style={styles.title}>唐家古镇导览</h1>
      
      <button 
        style={styles.iconBtn} 
        onClick={() => navigate('/collection')}
        aria-label="我的图鉴"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      </button>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    maxWidth: '480px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 100,
    borderRadius: '0 0 16px 16px', // 仅底部圆角
    borderTop: 'none',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    margin: 0,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
  },
  placeholder: {
    width: '40px',
  }
};
