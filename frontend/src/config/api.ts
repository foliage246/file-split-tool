// API 配置 - 根據環境模式決定
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://gleaming-liberation-production-852d.up.railway.app/api/v1'  // 生產環境
  : '/api/v1';  // 開發環境