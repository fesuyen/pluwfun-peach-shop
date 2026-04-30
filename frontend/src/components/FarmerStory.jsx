import { useState, useEffect } from 'react'

const API = (import.meta.env.VITE_API_URL || '/api') + '/content'

const FarmerStory = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API).then(res => res.json()).then(data => {
      const flat = {}
      Object.entries(data).forEach(([k, v]) => { flat[k] = v.value || v })
      setContent(flat)
    })
  }, [])

  return (
    <section id="farmer" style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
      <div style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        display: 'flex', 
        gap: '60px', 
        alignItems: 'center', // 垂直居中對齊
        flexWrap: 'wrap' 
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src={content.farmer_image || '/images/farmer.webp'} 
            style={{ 
              width: '100%', 
              height: '520px', // 固定適中高度，解決圖片過長問題
              objectFit: 'cover', 
              borderRadius: '24px', 
              boxShadow: '0 25px 50px rgba(0,0,0,0.08)' 
            }} 
            alt="Farmer"
          />
        </div>
        <div style={{ flex: '1 1 450px' }}>
          <div style={{ color: '#E8836B', fontWeight: '700', marginBottom: '15px', letterSpacing: '2px', fontSize: '13px' }}>THE ORIGIN</div>
          <h2 style={{ fontSize: '38px', color: '#2D5016', marginBottom: '25px', fontWeight: '800', lineHeight: '1.3' }}>
            {content.farmer_title || '載入中...'}
          </h2>
          <div style={{ fontSize: '16px', color: '#555', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}>
            {content.farmer_story || '請至後台編輯內容...'}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FarmerStory
