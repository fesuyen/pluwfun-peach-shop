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
    <section id="farmer" style={{ padding: '120px 24px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '80px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src={content.farmer_image || 'https://images.unsplash.com/photo-1594911776735-263673c68378?auto=format&fit=crop&q=80'} 
            style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: '30px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} 
          />
        </div>
        <div style={{ flex: '1 1 450px' }}>
          <div style={{ color: '#E8836B', fontWeight: '700', marginBottom: '20px', letterSpacing: '2px' }}>THE ORIGIN</div>
          <h2 style={{ fontSize: '42px', color: '#2D5016', marginBottom: '35px', fontWeight: '800', lineHeight: '1.2' }}>
            {content.farmer_title || '載入中...'}
          </h2>
          <div style={{ fontSize: '17px', color: '#555', lineHeight: '2.1', whiteSpace: 'pre-wrap', fontWeight: '300' }}>
            {content.farmer_story || '請至後台編輯內容...'}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FarmerStory
