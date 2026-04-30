import { useState, useEffect } from 'react'

// 修正後的 API，確保連動後台
const API = (import.meta.env.VITE_API_URL || '/api') + '/content'

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { flat[k] = v.value || v })
        setContent(flat)
      })
      .catch(err => console.error('抓取失敗:', err))
  }, [])

  const featureData = [
    { title: content.feature_1_title, desc: content.feature_1_desc, img: '/images/feature1.webp' },
    { title: content.feature_2_title, desc: content.feature_2_desc, img: '/images/feature2.webp' },
    { title: content.feature_3_title, desc: content.feature_3_desc, img: '/images/feature3.webp' },
    { title: content.feature_4_title, desc: content.feature_4_desc, img: '/images/feature4.webp' }
  ]

  return (
    <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#E8836B', fontWeight: '700', fontSize: '13px', letterSpacing: '3px' }}>QUALITY PROMISE</span>
          <h2 style={{ fontSize: '36px', color: '#2D5016', marginTop: '10px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '50px', height: '3px', background: '#E8836B', margin: '20px auto' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ width: '100%', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt="Feature"
                />
              </div>
              <div style={{ padding: '25px' }}>
                <h3 style={{ fontSize: '18px', color: '#2D5016', marginBottom: '12px', fontWeight: '700' }}>
                  {item.title || '載入中...'}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.7', fontSize: '14px' }}>
                  {item.desc || '請至後台編輯內容...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
