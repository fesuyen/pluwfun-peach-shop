import { useState, useEffect } from 'react'

const Hero = () => {
  return (
    <div style={{
      width: '100%',
      height: '90vh',
      position: 'relative',
      backgroundImage: 'url("/images/首頁圖.webp")', // 修正為您的檔案名稱
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)' }}></div>
      
      <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', maxWidth: '900px' }}>
        <div style={{ backgroundColor: '#E8836B', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', marginBottom: '24px', fontWeight: '700' }}>
          🔥 2026 產季首波預購（剩餘200盒）
        </div>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: '1.1', fontWeight: '900', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          拉拉山五月桃 | 職人現採直送<br/>
          <span style={{ color: '#FFD700' }}>頂級蜜香・極致純甜</span>產地直送
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', marginTop: '30px', opacity: '0.9', fontWeight: '400' }}>
          飛鼠嚴選・雪霧鬧部落達利阿伯深耕 40 年的驕傲，每一口都是高山的精華。
        </p>
        <button style={{ marginTop: '40px', padding: '16px 48px', backgroundColor: '#E8836B', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 25px rgba(232, 131, 107, 0.4)' }}>
          立即選購 →
        </button>
      </div>
    </div>
  )
}

export default Hero
