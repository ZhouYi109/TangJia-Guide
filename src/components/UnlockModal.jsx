import React, { useEffect } from 'react';

export default function UnlockModal({ isOpen, onClose, patternData }) {
  if (!isOpen || !patternData) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="glass-panel">
        <h3 style={styles.title}>🎉 收集成功</h3>
        <p style={styles.subtitle}>恭喜您解锁了专属建筑纹样</p>
        
        <div style={styles.imageWrapper}>
          <img src={patternData.image} alt={patternData.name} style={styles.image} />
        </div>
        
        <h4 style={styles.patternName}>{patternData.name}</h4>
        
        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={onClose}>收入囊中</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '300px',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
  },
  title: {
    fontSize: '22px',
    color: 'var(--color-accent-green)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginBottom: '24px',
  },
  imageWrapper: {
    width: '120px',
    height: '120px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    marginBottom: '16px',
    border: '2px solid rgba(255,255,255,0.8)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  patternName: {
    fontSize: '18px',
    color: 'var(--color-text-primary)',
    marginBottom: '24px',
    fontWeight: '600',
  },
  actions: {
    width: '100%',
  },
  primaryBtn: {
    width: '100%',
    padding: '12px 0',
    backgroundColor: 'var(--color-text-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};
