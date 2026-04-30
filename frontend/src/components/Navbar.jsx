import React from 'react';

export default function Navbar() {
  const logoUrl = "https://cdn.phototourl.com/free/2026-04-04-bb9388dc-1fdd-40db-bd77-1c117183e3a1.png";

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
      padding: '12px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        
        {/* Logo 位置：左上角 */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src={logoUrl} 
            alt="pluwfun logo" 
            style={{ height: '45px', width: 'auto', objectFit: 'contain' }} 
          />
        </a>

        {/* 導覽選單 */}
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600' }}>
          <a href="#features" style={navLink}>產品特色</a>
          <a href="#farmer" style={navLink}>農民故事</a>
          <a href="#order-section" style={navLink}>立即訂購</a>
          <a href="#membership" style={navLink}>會員方案</a>
          <a href="/admin" style={{ ...navLink, color: '#E8836B' }}>管理後台</a>
        </div>
      </div>
    </nav>
  );
}

const navLink = { color: '#2D5016', textDecoration: 'none', transition: '0.3s' };
