import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto' 
    }}>
      <h1 style={{ color: '#1976d2' }}>檔案分割工具</h1>
      <p>歡迎使用檔案分割工具！</p>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px' 
      }}>
        <h2>功能特色</h2>
        <ul>
          <li>✅ 支援 CSV 檔案分割</li>
          <li>✅ 免費版：每日 5 個檔案，10MB 限制</li>
          <li>✅ 支援 Big5 編碼</li>
          <li>✅ 按欄位值分割檔案</li>
          <li>✅ ZIP 檔案下載</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button style={{
          background: '#1976d2',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          開始使用
        </button>
        
        <button style={{
          background: '#dc004e',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          了解更多
        </button>
      </div>

      <footer style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        color: '#666',
        borderTop: '1px solid #eee',
        paddingTop: '20px'
      }}>
        <p>檔案分割工具 - 快速、安全、易用</p>
      </footer>
    </div>
  );
}

export default App;