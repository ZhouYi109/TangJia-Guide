import { useState, useEffect } from 'react';

// 初始化收集册数据，这与我们在 NodeDetail 里定义的数据应保持一致
const ALL_PATTERNS = [
  {
    id: 'tangjia-sanmiao',
    name: '灰塑瑞兽纹',
    image: '/tangjia_sanmiao_pattern.png',
  },
  {
    id: 'gongleyuan',
    name: '满洲窗格纹',
    image: '/gongleyuan_pattern.png',
  },
  {
    id: 'haokeqiang',
    name: '蚝壳鱼鳞纹',
    image: '/haokeqiang_pattern.png',
  }
];

export default function useCollection() {
  const [collectedIds, setCollectedIds] = useState(() => {
    const saved = localStorage.getItem('tangjia_collection');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tangjia_collection', JSON.stringify(collectedIds));
  }, [collectedIds]);

  const unlockPattern = (id) => {
    if (!collectedIds.includes(id)) {
      setCollectedIds(prev => [...prev, id]);
      return true; // 返回 true 表示新解锁
    }
    return false; // 返回 false 表示已解锁过
  };

  const getCollectedPatterns = () => {
    return ALL_PATTERNS.filter(p => collectedIds.includes(p.id));
  };

  const getAllPatternsStatus = () => {
    return ALL_PATTERNS.map(p => ({
      ...p,
      isCollected: collectedIds.includes(p.id)
    }));
  };

  const clearCollection = () => {
    setCollectedIds([]);
    localStorage.removeItem('tangjia_collection');
  };

  return {
    collectedIds,
    unlockPattern,
    getCollectedPatterns,
    getAllPatternsStatus,
    clearCollection
  };
}
