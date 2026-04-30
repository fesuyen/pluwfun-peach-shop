import { useState, useEffect } from 'react'

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
  }, [])

  return (
    <section id="farmer" style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src={content.farmer_image || '/images/farmer.webp'} 
            style={{ width: '100%', height: '520px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.08)' }} 
          />
        </div>
        <div style={{ flex: '1 1 450px' }}>
          <div style={{ color: '#E8836B', fontWeight: '700', marginBottom: '15px', letterSpacing: '2px', fontSize: '13px' }}>THE ORIGIN</div>
          <h2 style={{ fontSize: '38px', color: '#2D5016', marginBottom: '25px', fontWeight: '800', lineHeight: '1.3' }}>
            {content.farmer_title || '雲霧裡的守候：達利阿伯與果園的四十年的約定'}
          </h2>
          <div style={{ fontSize: '16px', color: '#555', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}>
            {content.farmer_story || '在拉拉山雪霧鬧部落，當晨霧還未散去，達利阿伯已經穿梭在果樹間...'}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FarmerStory
