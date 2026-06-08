import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import UnlockModal from '../components/UnlockModal';
import useCollection from '../hooks/useCollection';
import useGeolocation from '../hooks/useGeolocation';
import NearbyAlert from '../components/NearbyAlert';
import QRScannerModal from '../components/QRScannerModal';

export default function NodeDetail() {
  const { id } = useParams();
  const { unlockPattern, getAllPatternsStatus } = useCollection();
  const [modalOpen, setModalOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  // GPS 地理定位 Hook
  const {
    position,
    error,
    distance,
    isNearby,
    mockArrival,
    setMockArrival
  } = useGeolocation(id);

  // 模拟节点数据
  const nodeData = {
    'tangjia-sanmiao': {
      name: '唐家三庙',
      tags: ['宗族礼制', '清代建筑', '灰塑纹样'],
      image: 'https://via.placeholder.com/480x320/EBEBE9/4A4F54?text=%E5%94%90%E5%AE%B6%E4%B8%89%E5%BA%99%E5%9B%BE%E7%89%87',
      description: '唐家三庙由圣堂庙、文武帝庙和金花庙组成，是唐家湾古镇的信仰中心。这里的建筑立面保留了大量的传统灰塑与木雕细节。',
      feature: '屋脊上的灰塑瑞兽呈现出高级的青砖黛灰色调，是岭南建筑中极具代表性的现象学视觉元素。'
    },
    'gongleyuan': {
      name: '共乐园',
      tags: ['中西合璧', '民国风情', '铁艺花窗'],
      image: 'https://via.placeholder.com/480x320/EBEBE9/4A4F54?text=%E5%85%B1%E4%B9%90%E5%9B%AD%E5%9B%BE%E7%89%87',
      description: '原为唐绍仪的私人花园，其建筑风格体现了晚清民国时期唐家湾作为“买办故里”的开放包容。',
      feature: '建筑中大量使用了进口水泥（红毛泥）与西式铸铁花窗，形成了传统与近代工业材料交融的独特美学。'
    },
    'haokeqiang': {
      name: '蚝壳墙巷道',
      tags: ['天然肌理', '生态美学', '光影变化'],
      image: 'https://via.placeholder.com/480x320/EBEBE9/4A4F54?text=%E8%9A%9D%E5%A3%B3%E5%A2%99%E5%9B%BE%E7%89%87',
      description: '利用成千上万个天然蚝壳呈45度角交错垒砌而成，不仅防潮，更在阳光下呈现出波浪起伏的鱼鳞状阴影。',
      feature: '这种粗粝的天然生态障壁，在强烈的岭南阳光下形成了高对比度的纯粹黑白光影效果，极具视觉冲击力。'
    }
  };

  const data = nodeData[id] || nodeData['tangjia-sanmiao'];
  
  // 查找当前节点对应的纹样数据
  const allPatterns = getAllPatternsStatus();
  const currentPattern = allPatterns.find(p => p.id === id);
  const isCollected = currentPattern?.isCollected;

  const handleStartScan = () => {
    if (isCollected) {
      alert('您已经收集过这个纹样啦！去图鉴里看看吧。');
      return;
    }
    setScannerOpen(true);
  };

  const handleScanSuccess = (decodedText) => {
    setScannerOpen(false);
    // 扫码成功，解锁纹样并打开解锁成功弹窗
    const newlyUnlocked = unlockPattern(id);
    if (newlyUnlocked) {
      setModalOpen(true);
    } else {
      alert('您已经解锁过该纹样！');
    }
  };

  // 格式化距离显示
  const getDistanceText = () => {
    if (mockArrival) return '已到达附近 (模拟)';
    if (distance === null || distance === undefined) {
      return error ? '获取定位失败' : '检测中...';
    }
    if (distance > 1000) {
      return `距离您 ${(distance / 1000).toFixed(2)} 公里`;
    }
    return `距离您 ${distance.toFixed(1)} 米`;
  };

  return (
    <>
      <BottomNav />
      
      {/* 当用户进入50米且尚未收集时，展示顶部悬浮提示 */}
      {isNearby && !isCollected && (
        <NearbyAlert 
          nodeName={data.name} 
          onStartScan={handleStartScan} 
        />
      )}

      <div className="page-content" style={{ ...styles.container, paddingTop: 0 }}>
        {/* 节点导视图 */}
        <div style={styles.mapBox}>
          <img src="/node_map.png" alt="节点导视图" style={styles.nodeMap} />
          <div style={styles.tagList}>
            {data.tags.map((tag, idx) => (
              <span key={idx} style={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <h2 style={styles.title}>{data.name}</h2>
        
        {/* 演示与调试用的 GPS 工具栏 */}
        <div style={styles.debugPanel} className="glass-panel">
          <div style={styles.debugInfo}>
            <span style={{ fontSize: '13px' }}>📍 定位状态：<strong>{getDistanceText()}</strong></span>
            {!isNearby && !isCollected && (
              <span style={styles.debugHint}>（距离小于 50 米即可开启扫码）</span>
            )}
          </div>
          <button 
            style={{
              ...styles.debugToggle, 
              backgroundColor: mockArrival ? 'var(--color-accent-blue)' : 'var(--color-primary-cool)'
            }}
            onClick={() => setMockArrival(!mockArrival)}
          >
            {mockArrival ? '恢复真机GPS' : '模拟到达点位'}
          </button>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>历史背景</h4>
          <p style={styles.text}>{data.description}</p>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>视觉密码提取</h4>
          <p style={styles.text}>{data.feature}</p>
        </div>

        {/* 悬浮操作台：打卡/扫码操作 */}
        <div style={styles.actionBar} className="glass-panel">
          <div style={styles.actionText}>
            <span style={styles.actionHint}>{isCollected ? '已收集' : '在此处发现'}</span>
            <strong>{currentPattern?.name || '专属建筑纹样'}</strong>
          </div>
          <button 
            style={{
              ...styles.unlockBtn, 
              backgroundColor: isCollected 
                ? 'var(--color-border)' 
                : isNearby 
                  ? 'var(--color-accent-green)' 
                  : '#A0A0A0'
            }} 
            onClick={isNearby ? handleStartScan : null}
            disabled={isCollected || !isNearby}
          >
            {isCollected ? '已解锁' : isNearby ? '扫码打卡' : '请前往点位附近'}
          </button>
        </div>
      </div>

      <UnlockModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        patternData={currentPattern} 
      />

      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
}

const styles = {
  container: {
    paddingBottom: '120px', // 留出悬浮操作台的空间
  },
  mapBox: {
    margin: '0 -20px 20px -20px',
    position: 'relative',
  },
  nodeMap: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    display: 'block',
  },
  tagList: {
    position: 'absolute',
    bottom: '-12px',
    left: '20px',
    display: 'flex',
    gap: '8px',
  },
  tag: {
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-secondary)',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid var(--color-border)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    marginTop: '16px',
    fontFamily: 'var(--font-family-serif)',
  },
  debugPanel: {
    padding: '12px 16px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
  debugInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  debugHint: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  debugToggle: {
    border: 'none',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
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
  },
  actionBar: {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 40px)',
    maxWidth: '440px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  actionText: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionHint: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  unlockBtn: {
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s',
  }
};
