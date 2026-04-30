import { useState, useEffect } from 'react'

const API = `${import.meta.env.VITE_API_URL || '/api'}/content?v=${Date.now()}`

const FarmerStory = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API, { cache: 'no-store' }).then(res => res.json()).then(data => {
      const flat = {}
      Object.entries(data).forEach(([k, v]) => { 
        flat[k] = (v && typeof v === 'object' && v.value !== undefined) ? v.value : v 
      })
      setContent(flat)
    })
  }, [])

  return (
    <section id="farmer" style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src="/images/農民故事.webp" 
            style={{ width: '100%', height: '520px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.08)' }} 
            alt="農民故事"
            onError={(e) => { e.target.src = '/images/職人採收.webp' }} // 備援圖片
          />
        </div>
        <div style={{ flex: '1 1 450px' }}>
          <div style={{ color: '#E8836B', fontWeight: 700, marginBottom: '15px', letterSpacing: '2px', fontSize: '13px' }}>THE ORIGIN</div>
          <h2 style={{ fontSize: '38px', color: '#2D5016', marginBottom: '25px', fontWeight: '800', lineHeight: '1.3' }}>
            {content.farmer_title || '載入中...'}
          </h2>
          <div style={{ fontSize: '16px', color: '#555', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}>
            {content.farmer_story || '請至後台編輯農民故事內容...'}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FarmerStory
