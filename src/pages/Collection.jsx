import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import BottomNav from '../components/BottomNav';
import useCollection from '../hooks/useCollection';

export default function Collection() {
  const { getAllPatternsStatus } = useCollection();
  const allPatterns = getAllPatternsStatus();
  const previewRef = useRef(null);
  const richCardRef = useRef(null);
  
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const collectedPatterns = allPatterns.filter(p => p.isCollected);

  const handleStartGenerate = () => {
    if (collectedPatterns.length === 0) return;
    setShowModal(true);
  };

  const confirmGenerate = async () => {
    if (!nickname.trim()) {
      alert('请输入您的昵称');
      return;
    }
    setShowModal(false);
    setIsGenerating(true);

    // 等待 React 渲染隐藏的富设计卡片
    setTimeout(async () => {
      try {
        if (!richCardRef.current) return;
        const canvas = await html2canvas(richCardRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#F7F7F5'
        });
        const imgData = canvas.toDataURL('image/png');
        
        setGeneratedImageUrl(imgData);
        setShowResultModal(true);
      } catch (error) {
        console.error('生成卡片失败:', error);
        alert('生成卡片失败，请稍后重试');
      } finally {
        setIsGenerating(false);
      }
    }, 500); // 延迟以确保 DOM 渲染完成
  };

  const handleSaveImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.download = `唐家古镇_${nickname}的文创卡.png`;
    link.href = generatedImageUrl;
    link.click();
    setShowResultModal(false);
  };

  return (
    <>
      <BottomNav />
      <div className="page-content">
        <h2 style={styles.pageTitle}>我的文创图鉴</h2>
        <p style={styles.pageDesc}>探索古镇节点，收集独特的建筑纹理与视觉符号。</p>
        
        {/* 图鉴展示区 */}
        <div style={styles.grid}>
          {allPatterns.map(pattern => (
            <div key={pattern.id} style={styles.gridItem}>
              <div style={{
                ...styles.imageWrapper,
                filter: pattern.isCollected ? 'none' : 'grayscale(100%) opacity(40%)'
              }}>
                <img src={pattern.image} alt={pattern.name} style={styles.image} />
              </div>
              <span style={styles.patternName}>{pattern.name}</span>
            </div>
          ))}
        </div>

        {/* 预览区 */}
        <h3 style={styles.sectionTitle}>文创卡预览</h3>
        <div ref={previewRef} style={styles.cardPreview} className="town-card">
          <div style={styles.cardHeader}>
            <h4 style={styles.cardTitle}>唐家古镇视觉记忆</h4>
          </div>
          <div style={styles.cardContent}>
            {collectedPatterns.length === 0 ? (
              <p style={styles.emptyText}>您还未收集任何纹样，快去探索吧！</p>
            ) : (
              <div style={styles.collectedPatterns}>
                {collectedPatterns.map(p => (
                  <img key={p.id} src={p.image} alt={p.name} style={styles.cardPatternImage} />
                ))}
              </div>
            )}
          </div>
          <div style={styles.cardFooter}>
            <p>点击下方按钮，生成带签名的正式纪念卡</p>
          </div>
        </div>

        <button 
          style={{...styles.generateBtn, opacity: collectedPatterns.length === 0 ? 0.5 : 1}} 
          onClick={handleStartGenerate}
          disabled={collectedPatterns.length === 0 || isGenerating}
        >
          {isGenerating ? '生成中...' : '生成专属纪念卡'}
        </button>
      </div>

      {/* 昵称输入弹窗 */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="glass-panel">
            <h3 style={styles.modalTitle}>留下您的专属印记</h3>
            <p style={styles.modalDesc}>请输入您的昵称，将作为落款生成在您的文创卡上。</p>
            <input 
              style={styles.input} 
              type="text" 
              placeholder="例如：视觉探索者" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={12}
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>取消</button>
              <button style={styles.confirmBtn} onClick={confirmGenerate}>生成卡片</button>
            </div>
          </div>
        </div>
      )}

      {/* 结果展示弹窗 */}
      {showResultModal && generatedImageUrl && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, width: '90%', maxWidth: '400px', padding: '20px' }} className="glass-panel">
            <h3 style={styles.modalTitle}>您的专属纪念卡已生成</h3>
            <p style={{...styles.modalDesc, marginBottom: '16px'}}>快把这份来自唐家湾的视觉记忆保存下来吧</p>
            
            <div style={styles.resultImageWrapper}>
              <img src={generatedImageUrl} alt="生成的纪念卡" style={styles.resultImage} />
            </div>
            
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowResultModal(false)}>返回</button>
              <button style={styles.confirmBtn} onClick={handleSaveImage}>保存到本地</button>
            </div>
          </div>
        </div>
      )}

      {/* 隐藏的正式纪念卡 DOM (供 html2canvas 渲染) */}
      <div style={styles.hiddenRenderArea}>
        <div ref={richCardRef} style={styles.richCard}>
          <div style={styles.richCardInner}>
            <h1 style={styles.richCardTitle}>唐 家 湾 古 镇</h1>
            <h2 style={styles.richCardSubtitle}>视 觉 记 忆 留 存</h2>
            
            <div style={styles.richCardPatterns}>
              {collectedPatterns.map(p => (
                <div key={p.id} style={styles.richPatternItem}>
                  <img src={p.image} alt={p.name} style={styles.richPatternImg} />
                  <span style={styles.richPatternName}>{p.name}</span>
                </div>
              ))}
            </div>

            <div style={styles.richCardFooter}>
              <div style={styles.richSignatureBox}>
                <p style={styles.richSignatureLabel}>探访者印鉴</p>
                <h3 style={styles.richSignatureName}>{nickname || '游客'}</h3>
              </div>
              <div style={styles.richDateBox}>
                <p style={styles.richDateLabel}>留印时间</p>
                <p style={styles.richDateValue}>{new Date().toLocaleString('zh-CN', { hour12: false })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  pageTitle: {
    fontSize: '24px',
    fontFamily: 'var(--font-family-serif)',
    marginBottom: '8px',
  },
  pageDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'var(--color-primary-warm)',
    marginBottom: '8px',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  patternName: {
    fontSize: '12px',
    color: 'var(--color-text-primary)',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '16px',
    borderLeft: '4px solid var(--color-accent-blue)',
    paddingLeft: '8px',
  },
  cardPreview: {
    width: '100%',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    marginBottom: '24px',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d5cfc4\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
    boxSizing: 'border-box',
  },
  cardHeader: {
    borderBottom: '2px solid var(--color-primary-cool)',
    paddingBottom: '12px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontFamily: 'var(--font-family-serif)',
    fontSize: '20px',
    margin: 0,
    color: 'var(--color-text-primary)',
  },
  cardContent: {
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  collectedPatterns: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  },
  cardPatternImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid var(--color-accent-blue)',
    objectFit: 'cover',
  },
  cardFooter: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    letterSpacing: '1px',
  },
  generateBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'var(--color-text-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modalContent: {
    width: '85%',
    maxWidth: '320px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'popIn 0.3s ease-out forwards',
  },
  modalTitle: {
    fontSize: '18px',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
  },
  modalDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '24px',
    textAlign: 'center',
    outline: 'none',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: '20px',
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
  },
  confirmBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'var(--color-accent-green)',
    border: 'none',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
  },
  resultImageWrapper: {
    width: '100%',
    maxHeight: '55vh',
    overflowY: 'auto',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    border: '1px solid var(--color-border)',
  },
  resultImage: {
    width: '100%',
    display: 'block',
  },
  
  /* 隐藏的富设计卡片样式 */
  hiddenRenderArea: {
    position: 'absolute',
    left: '-9999px',
    top: '-9999px',
  },
  richCard: {
    width: '600px', // 高清输出尺寸
    padding: '32px',
    backgroundColor: '#F7F7F5',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d5cfc4\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
    fontFamily: 'var(--font-family-serif)',
  },
  richCardInner: {
    border: '4px double var(--color-primary-cool)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  richCardTitle: {
    fontSize: '36px',
    color: 'var(--color-text-primary)',
    letterSpacing: '12px',
    margin: '0 0 8px 0',
  },
  richCardSubtitle: {
    fontSize: '18px',
    color: 'var(--color-accent-blue)',
    letterSpacing: '6px',
    margin: '0 0 48px 0',
    fontWeight: 'normal',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
  },
  richCardPatterns: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    flexWrap: 'wrap',
    marginBottom: '64px',
  },
  richPatternItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  richPatternImg: {
    width: '100px',
    height: '100px',
    borderRadius: '16px',
    border: '2px solid var(--color-primary-cool)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    marginBottom: '12px',
    objectFit: 'cover',
  },
  richPatternName: {
    fontSize: '16px',
    color: 'var(--color-text-secondary)',
  },
  richCardFooter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '24px',
  },
  richSignatureBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  richSignatureLabel: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginBottom: '4px',
  },
  richSignatureName: {
    fontSize: '42px',
    color: 'var(--color-text-primary)',
    margin: 0,
    fontFamily: "'Zhi Mang Xing', cursive",
    lineHeight: '1',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  richDateBox: {
    textAlign: 'right',
  },
  richDateLabel: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginBottom: '4px',
  },
  richDateValue: {
    fontSize: '16px',
    color: 'var(--color-text-primary)',
    margin: 0,
    fontFamily: 'monospace',
  }
};
