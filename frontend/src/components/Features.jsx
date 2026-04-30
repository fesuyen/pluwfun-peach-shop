import { useState, useEffect } from 'react'

const API = (import.meta.env.VITE_API_URL || '/api') + '/content'

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API).then(res => res.json()).then(data => {
      const flat = {}
      Object.entries(data).forEach(([k, v]) => { flat[k] = v.value || v })
      setContent(flat)
    }).catch(() => {})
  }, [])

  // 1. 我們暫時使用高品質圖片網址，確保畫面不會破圖。
  // 2. 您之後可以將這裡的網址換成您 Google 雲端轉出來的「直接連結」。
  const featureData = [
    { 
      title: content.feature_1_title || '職人一生守護：達利阿伯的鮮採承諾', 
      desc: content.feature_1_desc || '來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園。', 
      img: 'https://images.unsplash.com/photo-1628489611989-17481b4f2347?auto=format&fit=crop&q=80' 
    },
    { 
      title: content.feature_2_title || '完美的「七分熟」：精準鎖住鮮甜時機', 
      desc: content.feature_2_desc || '為了確保物流配送過程的品質，我們嚴格執行七分熟採收標準。', 
      img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80' 
    },
    { 
      title: content.feature_3_title || '真誠規格：足重承諾與尊榮禮遇', 
      desc: content.feature_3_desc || '提供 6-12 粒精選規格，每盒淨重保證足 2 斤 4 兩至 2 斤 6 兩。', 
      img: 'https://images.unsplash.com/photo-1595121404120-749e75529f79?auto=format&fit=crop&q=80' 
    },
    { 
      title: content.feature_4_title || '價值倍增：入會即刻解鎖山林假期', 
      desc: content.feature_4_desc || '入會 $1,999 元，不只是購買蜜桃，更是開啟價值超過 $6,000 元體驗。', 
      img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80' 
    }
  ]

  return (
    <section id="features" style={{ padding: '100px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#E8836B', fontWeight: '700', fontSize: '13px', letterSpacing: '3px' }}>QUALITY PROMISE</span>
          <h2 style={{ fontSize: '36px', color: '#2D5016', marginTop: '10px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '40px', height: '3px', background: '#E8836B', margin: '20px auto' }}></div>
        </div>

        {/* 強制 2x2 對稱排版 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', // 增加最小寬度，強迫它在一般螢幕呈現 2x2
          gap: '40px' 
        }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 15px 45px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt="Feature"
                />
              </div>
              <div style={{ padding: '30px', flex: 1 }}>
                <h3 style={{ fontSize: '20px', color: '#2D5016', marginBottom: '15px', fontWeight: '700', lineHeight: '1.4' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px' }}>
                  {item.desc}
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
