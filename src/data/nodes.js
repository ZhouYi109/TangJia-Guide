export const nodes = [
  {
    id: 'tangjia-sanmiao', category: 'attraction',
    name: '唐家三庙',
    tags: ['宗族礼制', '清代建筑', '灰塑纹样'],
    description: '唐家三庙由圣堂庙、文武帝庙和金花庙组成，是唐家湾古镇的信仰中心。这里的建筑立面保留了大量的传统灰塑与木雕细节。',
    feature: '屋脊上的灰塑瑞兽呈现出高级的青砖黛灰色调，是岭南建筑中极具代表性的现象学视觉元素。',
    coords: { latitude: 22.35824, longitude: 113.59739 },
    mapImage: '/node_map.png',
    posterImage: '/posters/poster_sanmiao.png'
  },
  {
    id: 'gongleyuan', category: 'attraction',
    name: '共乐园 (满洲窗老宅)',
    tags: ['中西合璧', '民国风情', '铁艺花窗'],
    description: '原为唐绍仪的私人花园，其建筑风格体现了晚清民国时期唐家湾作为“买办故里”的开放包容。',
    feature: '建筑中大量使用了进口水泥（红毛泥）与西式铸铁花窗，形成了传统与近代工业材料交融的独特美学。',
    coords: { latitude: 22.36531, longitude: 113.59392 },
    mapImage: '/node_map.png',
    posterImage: '/posters/poster_gongleyuan.png'
  },
  {
    id: 'haokeqiang', category: 'attraction',
    name: '蚝壳墙巷道',
    tags: ['天然肌理', '生态美学', '光影变化'],
    description: '利用成千上万个天然蚝壳呈45度角交错垒砌而成，不仅防潮，更在阳光下呈现出波浪起伏的鱼鳞状阴影。',
    feature: '这种粗粝的天然生态障壁，在强烈的岭南阳光下形成了高对比度的纯粹黑白光影效果，极具视觉冲击力。',
    coords: { latitude: 22.35678, longitude: 113.59912 },
    mapImage: '/node_map.png',
    posterImage: '/posters/poster_haokeqiang.png'
  },
  {
    id: 'ruizhi-ci', category: 'attraction',
    name: '瑞芝唐公祠',
    tags: ['宗族礼制', '木雕工艺'],
    description: '唐家湾现存规模宏大的清代祠堂，展现了古镇深厚的宗族文化底蕴。',
    feature: '精美的木雕与砖雕，体现了当时极高的工艺水平。',
    coords: { latitude: 22.35900, longitude: 113.59850 },
    mapImage: '/node_map.png',
    posterImage: '/posters/poster_ruizhici.png'
  },
  {
    id: 'wangci-shanfang', category: 'attraction',
    name: '望慈山房',
    tags: ['私家园林', '静谧空间'],
    description: '隐藏在古镇深处的一处清幽别院，适合静思与游赏。',
    feature: '空间布局曲径通幽，植被与建筑完美融合。',
    coords: { latitude: 22.36150, longitude: 113.59550 },
    mapImage: '/node_map.png',
    posterImage: '/posters/poster_wangci.png'
  },
  {
    id: 'shanfang-lu', category: 'attraction',
    name: '山房路',
    tags: ['古镇街巷', '生活气息'],
    description: '唐家古镇的主轴线之一，两侧林立着百年老屋与现代文创小店。',
    feature: '长条石板铺就的路面，散发着迷人的历史岁月光泽。',
    coords: { latitude: 22.36050, longitude: 113.59700 },
    mapImage: '/node_map.png',
    posterImage: '/posters/poster_shanfanglu.png'
  },
  {
    id: 'tangshaoyi-guju', category: 'attraction',
    name: '唐绍仪故居',
    tags: ['历史名人', '民初洋楼'],
    description: '民国首任内阁总理唐绍仪的故居，见证了中国近代的风云变幻。',
    feature: '洋楼式的建筑风格，是中西建筑文化碰撞的实体档案。',
    coords: { latitude: 22.36300, longitude: 113.59620 },
    mapImage: '/node_map.png',
    posterImage: '/posters/poster_tangshaoyi.png'
  },
  {
    id: 'chaguo-feiyi', category: 'attraction',
    name: '茶果非遗摊位',
    tags: ['非遗美食', '民俗体验'],
    description: '在这里可以品尝和体验制作唐家湾传统的非遗小吃“茶果”。',
    feature: '色彩丰富的民间糕点，也是极佳的视觉素材。',
    coords: { latitude: 22.35850, longitude: 113.59680 },
    mapImage: '/node_map.png',
    posterImage: '/posters/poster_chaguo.png'
  },

  // 餐饮美食节点
  { id: 'd1', category: 'dining', name: '三号私房菜', tags: ['唐家菜', '老字号'], description: '招牌唐家湾特色菜，环境优雅。', rating: 4.8, coords: { latitude: 22.3615, longitude: 113.5960 }, mapImage: '/node_map.png' },
  { id: 'd2', category: 'dining', name: '共乐吧', tags: ['下午茶', '西餐'], description: '共乐园旁的浪漫休闲吧。', rating: 4.6, coords: { latitude: 22.3635, longitude: 113.5945 }, mapImage: '/node_map.png' },
  { id: 'd3', category: 'dining', name: '牛记冬瓜店', tags: ['老火靓汤', '必吃榜'], description: '原盅冬瓜盅，清热解暑。', rating: 4.9, coords: { latitude: 22.3595, longitude: 113.5950 }, mapImage: '/node_map.png' },
  { id: 'd4', category: 'dining', name: '明达农庄', tags: ['农家菜', '量大实惠'], description: '地道农家风味，特色走地鸡。', rating: 4.7, coords: { latitude: 22.3575, longitude: 113.5930 }, mapImage: '/node_map.png' },
  { id: 'd5', category: 'dining', name: '钟姐螺蛳粉', tags: ['特色小吃', '排队王'], description: '地道柳州风味，隐藏在古镇的网红店。', rating: 4.8, coords: { latitude: 22.3580, longitude: 113.5980 }, mapImage: '/node_map.png' },
  { id: 'd6', category: 'dining', name: '唐家三公子火锅食吧', tags: ['夜宵首选', '火锅'], description: '朋友聚餐首选，新鲜食材。', rating: 4.5, coords: { latitude: 22.3565, longitude: 113.5975 }, mapImage: '/node_map.png' },

  // 公共卫生间节点 (依据实际大型停车场及游客中心映射)
  { id: 'r1', category: 'restroom', name: '公共卫生间 (共乐园1号停车场)', tags: ['免费开放', '无障碍设施'], description: '位于共乐园地上停车场入口旁。', coords: { latitude: 22.3650, longitude: 113.5930 }, mapImage: '/node_map.png' },
  { id: 'r2', category: 'restroom', name: '公共卫生间 (山房路文化广场)', tags: ['免费开放', '游客中心旁'], description: '位于古镇核心文化广场游客休息点。', coords: { latitude: 22.3605, longitude: 113.5970 }, mapImage: '/node_map.png' },
  { id: 'r3', category: 'restroom', name: '公共卫生间 (唐中路停车场)', tags: ['免费开放', '停车场旁'], description: '位于唐中路大型停车场边缘。', coords: { latitude: 22.3560, longitude: 113.5960 }, mapImage: '/node_map.png' },
];

// 全局地图的虚拟边界极点 (用于换算定位在图片上的相对位置)
export const MAP_BOUNDS = {
  topLeft: { latitude: 22.37000, longitude: 113.58500 },
  bottomRight: { latitude: 22.35000, longitude: 113.60500 }
};

// 新版实体导视牌图片中，真正地图区域所占的百分比范围（经过视觉估算校验）
export const IMAGE_MAP_AREA = {
  minX: 18, // 地图左边缘约占整张图片宽度的 18%
  maxX: 82, // 地图右边缘约占整张图片宽度的 82%
  minY: 23, // 地图上边缘约占整张图片高度的 23%
  maxY: 57  // 地图下边缘约占整张图片高度的 57%
};

// 工具函数：获取某坐标在全局地图中的百分比位置
export function getMapPositionPercent(lat, lon) {
  const { topLeft, bottomRight } = MAP_BOUNDS;
  
  // 地理极点相对位置 (0 到 1)
  const rawXPercent = (lon - topLeft.longitude) / (bottomRight.longitude - topLeft.longitude);
  const rawYPercent = (topLeft.latitude - lat) / (topLeft.latitude - bottomRight.latitude);
  
  // 强制映射到导视牌图片内部的真实矩形框中
  const xPercent = IMAGE_MAP_AREA.minX + rawXPercent * (IMAGE_MAP_AREA.maxX - IMAGE_MAP_AREA.minX);
  const yPercent = IMAGE_MAP_AREA.minY + rawYPercent * (IMAGE_MAP_AREA.maxY - IMAGE_MAP_AREA.minY);
  
  return {
    x: Math.max(0, Math.min(100, xPercent)),
    y: Math.max(0, Math.min(100, yPercent))
  };
}
