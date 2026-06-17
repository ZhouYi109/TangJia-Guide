import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function MapLightbox({ isOpen, onClose, imageSrc, children, onClickMap }) {
  if (!isOpen) return null;

  const handleMapClick = (e) => {
    if (!onClickMap) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    onClickMap(xPercent, yPercent);
  };

  return (
    <div style={styles.overlay}>
      {/* 顶部工具栏：关闭按钮 */}
      <div style={styles.toolbar}>
        <div style={styles.hint}>双指缩放 · 单指平移</div>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <TransformWrapper
        initialScale={1}
        minScale={0.8}
        maxScale={5}
        centerOnInit={true}
        limitToBounds={false}
      >
        <TransformComponent wrapperStyle={{ width: "100vw", height: "100vh" }}>
          <div style={styles.mapContainer} onClick={handleMapClick}>
            <img src={imageSrc} alt="全屏导视图" style={styles.mapImage} />
            {/* 子元素（如定位红点）将附着在图片上一起缩放和平移 */}
            {children}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  toolbar: {
    position: 'absolute',
    top: '40px',
    left: '20px',
    right: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10000,
    pointerEvents: 'none', // 让点击穿透到底层地图
  },
  hint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: '4px 12px',
    borderRadius: '12px',
  },
  closeBtn: {
    pointerEvents: 'auto', // 恢复按钮可点击
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
  },
  mapContainer: {
    position: 'relative',
    display: 'inline-block', // 适应图片真实大小
  },
  mapImage: {
    display: 'block',
    maxWidth: '100vw', // 初始最大宽度为屏幕宽度
    height: 'auto',
    objectFit: 'contain',
  }
};
