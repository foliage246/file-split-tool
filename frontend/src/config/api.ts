// API 配置 - 直接根據環境模式決定
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://gleaming-liberation-production-852d.up.railway.app/api/v1'  // 生產環境直接硬編碼
  : '/api/v1';  // 開發環境使用相對路徑

// 調試信息
console.log('Environment mode:', import.meta.env.MODE);
console.log('Is production:', import.meta.env.PROD);
console.log('Using API_BASE_URL:', API_BASE_URL);
console.log('Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');