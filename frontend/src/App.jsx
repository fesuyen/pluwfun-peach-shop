import React from 'react';
import Navbar from './components/Navbar';
import OrderFlow from './components/OrderFlow';

function App() {
  return (
    <div className="App" style={{ background: '#FDFCFB', minHeight: '100vh' }}>
      <Navbar />
      
      {/* 英雄區 (Hero Section) */}
      <div style={{ paddingTop: '80px', textAlign: 'center' }}>
        <img src="/assets/hero.png" alt="飛鼠不渴" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
      </div>

      {/* 只保留這一個最新版的訂購流程 */}
      <OrderFlow />

      <footer style={{ padding: '50px 20px', textAlign: 'center', background: '#2D5016', color: '#fff', marginTop: '60px' }}>
        <p>© 2026 pluwfun 飛鼠不渴雲端農場 | 來自拉拉山的誠意</p>
      </footer>
    </div>
  );
}

export default App;
