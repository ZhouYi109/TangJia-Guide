export const nodes = [
  {
    id: 'tangjia-sanmiao',
    name: '唐家三庙',
    tags: ['宗族礼制', '清代建筑', '灰塑纹样'],
    description: '唐家三庙由圣堂庙、文武帝庙和金花庙组成，是唐家湾古镇的信仰中心。这里的建筑立面保留了大量的传统灰塑与木雕细节。',
    feature: '屋脊上的灰塑瑞兽呈现出高级的青砖黛灰色调，是岭南建筑中极具代表性的现象学视觉元素。',
    coords: { latitude: 22.35824, longitude: 113.59739 },
    mapImage: '/node_map.png' // 具体的导视图
  },
  {
    id: 'gongleyuan',
    name: '共乐园 (满洲窗老宅)',
    tags: ['中西合璧', '民国风情', '铁艺花窗'],
    description: '原为唐绍仪的私人花园，其建筑风格体现了晚清民国时期唐家湾作为“买办故里”的开放包容。',
    feature: '建筑中大量使用了进口水泥（红毛泥）与西式铸铁花窗，形成了传统与近代工业材料交融的独特美学。',
    coords: { latitude: 22.36531, longitude: 113.59392 },
    mapImage: '/node_map.png'
  },
  {
    id: 'haokeqiang',
    name: '蚝壳墙巷道',
    tags: ['天然肌理', '生态美学', '光影变化'],
    description: '利用成千上万个天然蚝壳呈45度角交错垒砌而成，不仅防潮，更在阳光下呈现出波浪起伏的鱼鳞状阴影。',
    feature: '这种粗粝的天然生态障壁，在强烈的岭南阳光下形成了高对比度的纯粹黑白光影效果，极具视觉冲击力。',
    coords: { latitude: 22.35678, longitude: 113.59912 },
    mapImage: '/node_map.png'
  },
  {
    id: 'ruizhi-ci',
    name: '瑞芝唐公祠',
    tags: ['宗族礼制', '木雕工艺'],
    description: '唐家湾现存规模宏大的清代祠堂，展现了古镇深厚的宗族文化底蕴。',
    feature: '精美的木雕与砖雕，体现了当时极高的工艺水平。',
    coords: { latitude: 22.35900, longitude: 113.59850 },
    mapImage: '/node_map.png'
  },
  {
    id: 'wangci-shanfang',
    name: '望慈山房',
    tags: ['私家园林', '静谧空间'],
    description: '隐藏在古镇深处的一处清幽别院，适合静思与游赏。',
    feature: '空间布局曲径通幽，植被与建筑完美融合。',
    coords: { latitude: 22.36150, longitude: 113.59550 },
    mapImage: '/node_map.png'
  },
  {
    id: 'shanfang-lu',
    name: '山房路',
    tags: ['古镇街巷', '生活气息'],
    description: '唐家古镇的主轴线之一，两侧林立着百年老屋与现代文创小店。',
    feature: '长条石板铺就的路面，散发着迷人的历史岁月光泽。',
    coords: { latitude: 22.36050, longitude: 113.59700 },
    mapImage: '/node_map.png'
  },
  {
    id: 'tangshaoyi-guju',
    name: '唐绍仪故居',
    tags: ['历史名人', '民初洋楼'],
    description: '民国首任内阁总理唐绍仪的故居，见证了中国近代的风云变幻。',
    feature: '洋楼式的建筑风格，是中西建筑文化碰撞的实体档案。',
    coords: { latitude: 22.36300, longitude: 113.59620 },
    mapImage: '/node_map.png'
  },
  {
    id: 'chaguo-feiyi',
    name: '茶果非遗摊位',
    tags: ['非遗美食', '民俗体验'],
    description: '在这里可以品尝和体验制作唐家湾传统的非遗小吃“茶果”。',
    feature: '色彩丰富的民间糕点，也是极佳的视觉素材。',
    coords: { latitude: 22.35850, longitude: 113.59680 },
    mapImage: '/node_map.png'
  }
];

// 全局地图的虚拟边界极点 (用于换算定位在图片上的相对位置)
export const MAP_BOUNDS = {
  topLeft: { latitude: 22.37000, longitude: 113.58500 },
  bottomRight: { latitude: 22.35000, longitude: 113.60500 }
};

// 工具函数：获取某坐标在全局地图中的百分比位置
export function getMapPositionPercent(lat, lon) {
  const { topLeft, bottomRight } = MAP_BOUNDS;
  
  const xPercent = ((lon - topLeft.longitude) / (bottomRight.longitude - topLeft.longitude)) * 100;
  const yPercent = ((topLeft.latitude - lat) / (topLeft.latitude - bottomRight.latitude)) * 100;
  
  return {
    x: Math.max(0, Math.min(100, xPercent)),
    y: Math.max(0, Math.min(100, yPercent))
  };
}
