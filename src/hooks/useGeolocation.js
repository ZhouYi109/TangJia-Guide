import { useState, useEffect } from 'react';

// 计算两点之间的距离（米） - Haversine 公式
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 地球半径（米）
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = radLat2 - radLat1;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 节点的真实目标坐标
export const NODE_COORDINATES = {
  'tangjia-sanmiao': { latitude: 22.35824, longitude: 113.59739 }, // 唐家三庙
  'gongleyuan': { latitude: 22.36531, longitude: 113.59392 },       // 共乐园
  'haokeqiang': { latitude: 22.35678, longitude: 113.59912 }        // 蚝壳墙巷道
};

export default function useGeolocation(nodeId) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isNearby, setIsNearby] = useState(false);
  const [mockArrival, setMockArrival] = useState(false); // 允许模拟到达，方便调试/演示

  const targetCoords = NODE_COORDINATES[nodeId];

  useEffect(() => {
    if (mockArrival) {
      setDistance(15); // 模拟距离为15米 (小于50米)
      setIsNearby(true);
      return;
    }

    if (!targetCoords) {
      setDistance(null);
      setIsNearby(false);
      return;
    }

    if (!navigator.geolocation) {
      setError('浏览器不支持地理定位');
      return;
    }

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition({ latitude, longitude });
      
      const dist = getDistance(
        latitude,
        longitude,
        targetCoords.latitude,
        targetCoords.longitude
      );
      setDistance(dist);
      setIsNearby(dist <= 50); // 50米范围内视为到达附近
    };

    const handleError = (err) => {
      console.warn('Geolocation error:', err);
      setError(err.message);
      // 如果定位失败且没有模拟到达，依然设定为 false
      setIsNearby(false);
    };

    // 开启高精度定位并持续监听
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [nodeId, mockArrival]);

  return {
    position,
    error,
    distance,
    isNearby,
    mockArrival,
    setMockArrival
  };
}
