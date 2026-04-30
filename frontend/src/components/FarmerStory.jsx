import { useState, useEffect } from 'react'

// 修正後的 API 路徑，確保能抓到您在後台改的「四十年的約定」
const API = (import.meta.env.VITE_API_URL || '/api') + '/content'

const FarmerStory = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { flat[k] = v.value || v })
        setContent(flat)
      })
      .catch(err => console.error('抓取農民故事失敗:', err))
  }, [])

  return (
    <section id="farmer" style={{ padding: '100px 24px', background: '#fff' }}>
      <div style={{ 
        maxWidth: 1100, 
        margin: '0 auto', 
        display: 'flex', 
        gap: '60px', 
        alignItems: 'center', // 讓圖片與文字垂直置中對齊
        flexWrap: 'wrap' 
      }}>
        {/* 圖片區塊：限制高度並修圓角 */}
        <div style={{ flex: '1 1 450px', position: 'relative' }}>
          <img 
            src={content.farmer_image || '/images/farmer.webp'} 
            alt="農民照片" 
            style={{ 
              width: '100%', 
              height: '500px', // 固定高度，避免圖片過長
              objectFit: 'cover', // 自動裁切圖片以填滿空間而不變形
              borderRadius: '24px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)' 
            }} 
          />
        </div>

        {/* 文字區塊 */}
        <div style={{ flex: '1 1 450px' }}>
          <div style={{ 
            color: '#2D5016', 
            fontWeight: 700, 
            fontSize: '14px',
            marginBottom: '16px', 
            letterSpacing: '2px',
            opacity: 0.8
          }}>
            OUR FARMER
          </div>
          
          <h2 style={{ 
            fontSize: 'clamp(28px, 4vw, 36px)', 
            color: '#2D5016', 
            marginBottom: '32px', 
            fontWeight: 800,
            lineHeight: 1.3
          }}>
            {content.farmer_title || '拉拉山雪霧鬧：達利阿伯的鮮採承諾'}
          </h2>
          
          <div style={{ 
            fontSize: '17px', 
            color: '#5A5A5A', 
            lineHeight: '2', // 加大行高，讓閱讀更舒適
            whiteSpace: 'pre-wrap' 
          }}>
            {content.farmer_story || '來自拉拉山雪霧鬧部落的達利阿伯...'}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FarmerStory
