import { useState, useEffect } from 'react'

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
  }, [])

  // 這裡建議您將雲端連結轉為直連後，填入下方預設值
  const featureData = [
    { title: content.feature_1_title, desc: content.feature_1_desc, img: content.feature_1_img || 'https://images.unsplash.com/photo-1628489611989-17481b4f2347?auto=format&fit=crop&q=80' },
    { title: content.feature_2_title, desc: content.feature_2_desc, img: content.feature_2_img || 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80' },
    { title: content.feature_3_title, desc: content.feature_3_desc, img: content.feature_3_img || 'https://images.unsplash.com/photo-1595121404120-749e75529f79?auto=format&fit=crop&q=80' },
    { title: content.feature_4_title, desc: content.feature_4_desc, img: content.feature_4_img || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80' }
  ]

  return (
    <section id="features" style={{ padding: '100px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <span style={{ color: '#E8836B', fontWeight: '700', fontSize: '14px', letterSpacing: '3px' }}>PEACH PERFECTION</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 42px)', color: '#2D5016', marginTop: '15px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '40px', height: '3px', background: '#E8836B', margin: '20px auto' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              transition: 'transform 0.3s ease'
            }}>
              {/* 完美比例容器 */}
              <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '19px', color: '#2D5016', marginBottom: '15px', fontWeight: '700', lineHeight: '1.4' }}>
                  {item.title || '讀取中...'}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px' }}>
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
