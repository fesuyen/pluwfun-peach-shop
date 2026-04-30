import { useState, useEffect } from 'react'

// 確保 API 路徑正確
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
      .catch(err => console.error('API 連線失敗，使用預設文案:', err))
  }, [])

  // 將優化後的文案設為預設值，解決「載入中」的問題
  const featureData = [
    { 
      title: content.feature_1_title || '職人一生守護：達利阿伯的鮮採承諾', 
      desc: content.feature_1_desc || '來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園。', 
      img: '/images/feature1.webp' 
    },
    { 
      title: content.feature_2_title || '完美的「七分熟」：精準鎖住鮮甜時機', 
      desc: content.feature_2_desc || '為了確保物流配送過程的品質，我們嚴格執行七分熟採收標準。', 
      img: '/images/feature2.webp' 
    },
    { 
      title: content.feature_3_title || '真誠規格：足重承諾與尊榮禮遇', 
      desc: content.feature_3_desc || '提供 6-12 粒精選規格，每盒淨重保證足 2 斤 4 兩至 2 斤 6 兩。', 
      img: '/images/feature3.webp' 
    },
    { 
      title: content.feature_4_title || '價值倍增：入會即刻解鎖山林假期', 
      desc: content.feature_4_desc || '入會 $1,999 元，不只是購買蜜桃，更是開啟價值超過 $6,000 元的山林體驗。', 
      img: '/images/feature4.webp' 
    }
  ]

  return (
    <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#E8836B', fontWeight: '700', fontSize: '13px', letterSpacing: '3px' }}>QUALITY PROMISE</span>
          <h2 style={{ fontSize: '36px', color: '#2D5016', marginTop: '10px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '50px', height: '3px', background: '#E8836B', margin: '20px auto' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ width: '100%', aspectRatio: '4 / 3', background: '#f5f5f5' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.opacity = '0.5' }} // 圖片不存在時優雅顯示
                />
              </div>
              <div style={{ padding: '25px' }}>
                <h3 style={{ fontSize: '18px', color: '#2D5016', marginBottom: '12px', fontWeight: '700' }}>{item.title}</h3>
                <p style={{ color: '#666', lineHeight: '1.7', fontSize: '14px' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
