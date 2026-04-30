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
      .catch(err => console.error('抓取產品特色失敗:', err))
  }, [])

  // 整理後台資料成陣列
  const featureData = [
    { title: content.feature_1_title, desc: content.feature_1_desc, img: '/images/feature1.webp' },
    { title: content.feature_2_title, desc: content.feature_2_desc, img: '/images/feature2.webp' },
    { title: content.feature_3_title, desc: content.feature_3_desc, img: '/images/feature3.webp' },
    { title: content.feature_4_title, desc: content.feature_4_desc, img: '/images/feature4.webp' }
  ]

  return (
    <section id="features" style={{ padding: '100px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 標題區 */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <span style={{ color: '#E8836B', fontWeight: '700', fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase' }}>WHY CHOOSE US</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 42px)', color: '#2D5016', marginTop: '15px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '60px', height: '4px', background: '#E8836B', margin: '25px auto' }}></div>
        </div>

        {/* 響應式卡片網格 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '40px' 
        }}>
          {featureData.map((item, index) => (
            <div key={index} className="feature-card" style={{
              background: '#fff',
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 15px 45px rgba(0,0,0,0.05)',
              transition: 'all 0.4s ease'
            }}>
              {/* 圖片高度黃金比例 */}
              <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1628489611989-17481b4f2347?auto=format&fit=crop&q=80' }} // 備用精緻圖
                />
              </div>

              {/* 文字內容區 */}
              <div style={{ padding: '35px' }}>
                <h3 style={{ fontSize: '20px', color: '#2D5016', marginBottom: '18px', fontWeight: '700', lineHeight: '1.4' }}>
                  {item.title || '載入中...'}
                </h3>
                <p style={{ color: '#777', lineHeight: '1.8', fontSize: '15px', textAlign: 'justify' }}>
                  {item.desc || '正在連接後端獲取最新文案...'}
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
