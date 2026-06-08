import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [cameraError, setCameraError] = useState(null);
  const qrRef = useRef(null);
  const scannerInstance = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // 定时器或直接初始化，防止 DOM 还没有渲染好
    const scannerId = 'qr-reader';
    const html5Qrcode = new Html5Qrcode(scannerId);
    scannerInstance.current = html5Qrcode;

    const startScanning = async () => {
      try {
        await html5Qrcode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.65;
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            // 扫码成功
            handleSuccess(decodedText);
          },
          (errorMessage) => {
            // 静默处理单帧识别失败
          }
        );
      } catch (err) {
        console.error('无法启动摄像头扫描：', err);
        setCameraError('无法调用摄像头权限。请确保使用的是 HTTPS 协议，或者在本地使用下方的模拟扫码按钮。');
      }
    };

    // 稍微延迟确保 DOM 容器已完全挂载
    const timer = setTimeout(() => {
      startScanning();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scannerInstance.current && scannerInstance.current.isScanning) {
        scannerInstance.current.stop().catch((e) => console.log('Stop error', e));
      }
    };
  }, [isOpen]);

  const handleSuccess = (text) => {
    if (scannerInstance.current && scannerInstance.current.isScanning) {
      scannerInstance.current.stop()
        .then(() => {
          onScanSuccess(text);
        })
        .catch((e) => {
          console.log('Error stopping scanner', e);
          onScanSuccess(text);
        });
    } else {
      onScanSuccess(text);
    }
  };

  const handleSimulateSuccess = () => {
    handleSuccess('MOCK_QR_CODE_SUCCESS');
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="glass-panel">
        <div style={styles.header}>
          <h3 style={styles.title}>扫描导视板二维码</h3>
          <p style={styles.desc}>寻找实体点位上的文化印记二维码并扫码打卡</p>
        </div>

        <div style={styles.scannerWrapper}>
          <div id="qr-reader" style={styles.reader}></div>
          
          {/* 装饰用扫描框线与动画 */}
          <div style={styles.scannerOverlay}>
            <div style={styles.scanTarget}>
              <div style={styles.scanLine}></div>
              <div style={{ ...styles.corner, ...styles.topLeft }}></div>
              <div style={{ ...styles.corner, ...styles.topRight }}></div>
              <div style={{ ...styles.corner, ...styles.bottomLeft }}></div>
              <div style={{ ...styles.corner, ...styles.bottomRight }}></div>
            </div>
          </div>

          {cameraError && (
            <div style={styles.errorBanner}>
              <span style={{ fontSize: '20px', marginBottom: '8px' }}>⚠️</span>
              <p style={styles.errorText}>{cameraError}</p>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          {/* 答辩演示的暗门兜底按钮 */}
          <button style={styles.mockBtn} onClick={handleSimulateSuccess}>
            ✨ 模拟扫码成功（答辩/本地测试专用）
          </button>
          
          <button style={styles.cancelBtn} onClick={onClose}>
            取消返回
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    color: 'var(--color-text-primary)',
  },
  header: {
    textAlign: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    fontFamily: 'var(--font-family-serif)',
  },
  desc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    margin: 0,
  },
  scannerWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#000',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  reader: {
    width: '100%',
    height: '100%',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 5,
  },
  scanTarget: {
    width: '65%',
    height: '65%',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: '2px',
    background: 'linear-gradient(to right, transparent, var(--color-accent-green), transparent)',
    animation: 'scanAnimation 2s linear infinite',
  },
  corner: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    borderColor: 'var(--color-accent-green)',
    borderStyle: 'solid',
    borderWidth: '0',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: '3px',
    borderLeftWidth: '3px',
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: '3px',
    borderRightWidth: '3px',
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: '3px',
    borderLeftWidth: '3px',
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: '3px',
    borderRightWidth: '3px',
  },
  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
    zIndex: 10,
  },
  errorText: {
    fontSize: '13px',
    color: '#E57373',
    lineHeight: '1.6',
    margin: 0,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  mockBtn: {
    padding: '12px',
    borderRadius: '24px',
    border: '1px dashed var(--color-accent-green)',
    backgroundColor: 'rgba(74, 185, 142, 0.1)',
    color: 'var(--color-accent-green)',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cancelBtn: {
    padding: '12px',
    borderRadius: '24px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
