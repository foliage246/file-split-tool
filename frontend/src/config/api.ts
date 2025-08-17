// API 配置 - 直接根據環境模式決定
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://gleaming-liberation-production-852d.up.railway.app/api/v1'  // 生產環境直接硬編碼
  : '/api/v1';  // 開發環境使用相對路徑

// 強制調試信息 - 顯示在頁面上
if (typeof window !== 'undefined') {
  // 創建調試信息顯示
  const debugInfo = document.createElement('div');
  debugInfo.id = 'debug-info';
  debugInfo.style.cssText = `
    position: fixed; 
    top: 0; 
    right: 0; 
    background: rgba(0,0,0,0.8); 
    color: white; 
    padding: 10px; 
    font-family: monospace; 
    font-size: 12px; 
    z-index: 9999;
    max-width: 400px;
  `;
  debugInfo.innerHTML = `
    <div>Mode: ${import.meta.env.MODE}</div>
    <div>PROD: ${import.meta.env.PROD}</div>
    <div>API_BASE_URL: ${API_BASE_URL}</div>
    <div>Hostname: ${window.location.hostname}</div>
    <div>Build Time: ${new Date().toISOString()}</div>
  `;
  
  // 延遲添加到確保 DOM 已載入
  setTimeout(() => {
    document.body.appendChild(debugInfo);
  }, 1000);
}

// 控制台調試信息
console.log('=== API Configuration Debug ===');
console.log('Environment mode:', import.meta.env.MODE);
console.log('Is production:', import.meta.env.PROD);
console.log('Using API_BASE_URL:', API_BASE_URL);
console.log('Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');
console.log('All env vars:', import.meta.env);

// 強制驗證 URL 正確性
if (typeof window !== 'undefined' && API_BASE_URL.includes('file-split-tool-production')) {
  console.error('❌ CRITICAL ERROR: API_BASE_URL is using frontend domain!');
  console.error('Expected: gleaming-liberation-production');
  console.error('Got:', API_BASE_URL);
} else {
  console.log('✅ API_BASE_URL looks correct');
}