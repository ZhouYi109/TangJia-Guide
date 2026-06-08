import React from 'react';

export default function NearbyAlert({ nodeName, onStartScan }) {
  return (
    <div style={styles.alertWrapper} className="glass-panel">
      <div style={styles.alertContent}>
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>📍</span>
        </div>
        <div style={styles.textContainer}>
          <h4 style={styles.title}>已进入【{nodeName}】附近</h4>
          <p style={styles.desc}>检测到您已到达点位！请寻找周边的物理导视牌，扫描二维码完成打卡收集。</p>
        </div>
      </div>
      <button style={styles.scanBtn} onClick={onStartScan}>
        立即扫码
      </button>
    </div>
  );
}

const styles = {
  alertWrapper: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: '400px',
    padding: '16px',
    borderRadius: '16px',
    zIndex: 999,
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  alertContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(74, 185, 142, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: '18px',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-accent-blue)',
    margin: 0,
  },
  desc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
    margin: 0,
  },
  scanBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: '24px',
    border: 'none',
    backgroundColor: 'var(--color-accent-green)',
    color: '#fff',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(74, 185, 142, 0.2)',
    transition: 'all 0.2s',
  },
};
