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

// 全局模拟状态
let globalIsMocking = false;
let globalMockPosition = { latitude: 22.36100, longitude: 113.59600 };
const listeners = new Set();

export function setGlobalMockState(isMocking, position = null) {
  globalIsMocking = isMocking;
  if (position) globalMockPosition = position;
  listeners.forEach(fn => fn());
}

export default function useGeolocation() {
  const [position, setPosition] = useState(globalIsMocking ? globalMockPosition : null);
  const [error, setError] = useState(null);
  const [isMocking, setIsMockingState] = useState(globalIsMocking);
  const [mockPosition, setMockPositionState] = useState(globalMockPosition);

  // 同步全局状态
  useEffect(() => {
    const update = () => {
      setIsMockingState(globalIsMocking);
      setMockPositionState(globalMockPosition);
    };
    listeners.add(update);
    return () => listeners.delete(update);
  }, []);

  const setIsMocking = (val) => setGlobalMockState(val, globalMockPosition);
  const setMockPosition = (pos) => setGlobalMockState(globalIsMocking, pos);

  useEffect(() => {
    if (isMocking) {
      setPosition(mockPosition);
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
  }, [isMocking, mockPosition]);

  return {
    position,
    error,
    isMocking,
    setIsMocking,
    setMockPosition
  };
}
