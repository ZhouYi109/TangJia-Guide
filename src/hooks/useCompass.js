import { useState, useEffect, useCallback } from 'react';

export default function useCompass() {
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handleOrientation = useCallback((event) => {
    let compassHeading = null;
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      // 苹果设备独有的原生指南针属性
      compassHeading = event.webkitCompassHeading;
    } else if (event.alpha !== null) {
      // 安卓设备通常使用基于绝对朝向的 alpha 值
      // 标准 web api 中，alpha 绕 Z 轴，0 通常指北（absolute情况下），顺时针减少，因此 360 - alpha
      compassHeading = 360 - event.alpha;
    }
    
    if (compassHeading !== null) {
      setHeading(compassHeading);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setError('指南针权限被拒绝');
        }
      } catch (err) {
        setError('必须在 HTTPS 环境下才能调用罗盘');
      }
    } else {
      // 非 iOS 13+ 设备，直接开启
      setPermissionGranted(true);
      if ('ondeviceorientationabsolute' in window) {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }
  };

  useEffect(() => {
    // 组件卸载时清理
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    };
  }, [handleOrientation]);

  return { heading, error, permissionGranted, requestPermission };
}
