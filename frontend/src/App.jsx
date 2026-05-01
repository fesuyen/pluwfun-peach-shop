import React from 'react';
import Navbar from './components/Navbar';
import OrderFlow from './components/OrderFlow';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      {/* 英雄區：首頁大圖 */}
      <div style={{ paddingTop: '80px', textAlign: 'center', background: '#FDFCFB' }}>
        <img src="/assets/hero.png" alt="飛鼠不渴" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
      </div>

      {/* 核心訂購功能：只保留這一個 */}
      <OrderFlow />

      {/* 頁尾 */}
      <footer style={{ padding: '40px', textAlign: 'center', background: '#2D5016', color: '#fff' }}>
        <p>© 2026 pluwfun 飛鼠不渴雲端農場. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
