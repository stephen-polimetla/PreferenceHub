export function getBrowserName() {
  if (typeof navigator === 'undefined') {
    return 'Unknown';
  }
  const userAgent = navigator.userAgent;
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/chrome|chromium|crios/i.test(userAgent)) return 'Chrome';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/opera|opr/i.test(userAgent)) return 'Opera';
  return 'Browser';
}

export function getDeviceType() {
  if (typeof navigator === 'undefined') {
    return 'Unknown';
  }
  const ua = navigator.userAgent.toLowerCase();
  if (/(mobile|iphone|ipod|android|blackberry|windows phone)/i.test(ua)) {
    return 'Mobile';
  }
  if (/(tablet|ipad|playbook|silk)/i.test(ua)) {
    return 'Tablet';
  }
  return 'Desktop';
}
