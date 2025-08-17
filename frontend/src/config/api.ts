// API 配置
const getApiBaseUrl = (): string => {
  // 優先使用 Railway 環境變數
  if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
    return 'https://gleaming-liberation-production-852d.up.railway.app/api/v1';
  }
  
  // 開發環境使用環境變數
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // 本地開發 fallback
  return '/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

// 調試信息
console.log('API_BASE_URL:', API_BASE_URL);
console.log('hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('All env vars:', import.meta.env);