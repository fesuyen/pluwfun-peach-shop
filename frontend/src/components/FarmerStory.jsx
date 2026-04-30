import { useState, useEffect } from 'react'

const API = (import.meta.env.VITE_API_URL || '') + '/api/content'

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
    <section id="farmer" style={{ padding: '80px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src={content.farmer_image || '/images/farmer.webp'} 
            alt="農民照片" 
            style={{ width: '100%', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
          />
        </div>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ color: '#2D5016', fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>OUR FARMER</div>
          <h2 style={{ fontSize: 32, color: '#2D5016', marginBottom: 24, fontWeight: 800 }}>
            {content.farmer_title || '拉拉山雪霧鬧：達利阿伯的鮮採承諾'}
          </h2>
          <p style={{ fontSize: 16, color: '#5A5A5A', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {content.farmer_story || '來自拉拉山雪霧鬧部落的達利阿伯...'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default FarmerStory
