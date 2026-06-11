// 计算两点之间的绝对方位角（0-360度，0=正北，90=正东）
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

  const φ1 = lat1 * toRad;
  const φ2 = lat2 * toRad;
  const Δλ = (lon2 - lon1) * toRad;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  // 将弧度转为角度，并规范化到 0-360 范围内
  return (θ * toDeg + 360) % 360;
}

// 结合手机朝向和目标方位角，计算 UI 上的旋转角度
export function getRelativeRotation(deviceHeading, targetBearing) {
  if (deviceHeading === null || targetBearing === null) return 0;
  // 手机的 heading 是顺时针相对于正北的角度。目标 Bearing 也是。
  // 箭头在屏幕上的相对旋转角度 = 目标绝对方位 - 手机朝向
  return targetBearing - deviceHeading;
}
