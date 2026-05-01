import React from 'react';
import Navbar from './components/Navbar';
import OrderFlow from './components/OrderFlow';

// 您原本擁有的行銷組件（請確認這些檔案在您的 components 資料夾中）
import Hero from './components/Hero';
import Features from './components/Features';
import FarmerStory from './components/FarmerStory';
import Membership from './components/Membership';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App" style={{ background: '#FDFCFB' }}>
      {/* 1. 導覽列：品牌的第一眼 */}
      <Navbar />
      
      {/* 2. 英雄區：拉拉山大圖與品牌精神 (恢復原本的視覺感) */}
      <section id="home">
        <Hero />
      </section>

      {/* 3. 產品特色：為什麼要選飛鼠不渴 (恢復資訊內容) */}
      <section id="features" style={{ padding: '80px 0' }}>
        <Features />
      </section>

      {/* 4. 農民故事：溫暖的人文連結 */}
      <section id="farmer" style={{ background: '#F5F2ED', padding: '80px 0' }}>
        <FarmerStory />
      </section>

      {/* 5. 核心訂購區：我們剛修好的雲端自動化系統 */}
      <section id="order-section" style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#2D5016', fontSize: '32px', fontWeight: '800' }}>立即訂購新鮮水蜜桃</h2>
          <p style={{ color: '#666' }}>現採現出，產地直送到您的餐桌</p>
        </div>
        <OrderFlow />
      </section>

      {/* 6. 會員方案：飛鼠幣與入會資訊 */}
      <section id="membership" style={{ padding: '80px 0' }}>
        <Membership />
      </section>

      {/* 7. 真實體驗：好評推薦 */}
      <section id="testimonials" style={{ background: '#F5F2ED', padding: '80px 0' }}>
        <Testimonials />
      </section>

      {/* 8. 頁尾：完整版權與資訊 */}
      <Footer />
    </div>
  );
}

export default App;
