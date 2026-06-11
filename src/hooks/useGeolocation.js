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

// 模拟演示时的虚拟位置：唐家湾镇中心某处
const MOCK_POSITION = { latitude: 22.36100, longitude: 113.59600 };

export default function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isMocking, setIsMocking] = useState(false);

  useEffect(() => {
    if (isMocking) {
      setPosition(MOCK_POSITION);
      return;
    }

    if (!navigator.geolocation) {
      setError('浏览器不支持地理定位');
      return;
    }

    const handleSuccess = (pos) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });
      setError(null);
    };

    const handleError = (err) => {
      console.warn('Geolocation error:', err);
      setError(err.message);
    };

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
  }, [isMocking]);

  return {
    position,
    error,
    isMocking,
    setIsMocking
  };
}
