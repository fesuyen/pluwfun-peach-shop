import React from 'react';
import { Link } from 'react-router-dom'; // 這是關鍵！

export default function Navbar() {
  return (
    <nav style={{ 
      position: 'fixed', top: 0, width: '100%', height: '70px',
      background: 'rgba(255,255,255,0.95)', display: 'flex', 
      justifyContent: 'space-between', alignItems: 'center',
      padding: '0 5%', zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="https://pluwfun-peach-shop.vercel.app/assets/logo.png" alt="logo" style={{ height: '40px' }} />
        <span style={{ fontWeight: 900, color: '#2D5016', fontSize: '20px' }}>飛鼠不渴</span>
      </div>
      
      <div style={{ display: 'flex', gap: '25px', fontWeight: '700', fontSize: '15px' }}>
        <Link to="/" style={linkS}>首頁</Link>
        <a href="#features" style={linkS}>產品特色</a>
        <a href="#order-section" style={linkS}>立即訂購</a>
        <Link to="/admin" style={{ ...linkS, color: '#E8836B' }}>管理後台</Link>
      </div>
    </nav>
  );
}

const linkS = { textDecoration: 'none', color: '#666', cursor: 'pointer' };
