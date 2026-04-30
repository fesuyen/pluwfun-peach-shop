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
      .catch(err => console.error('抓取文案失敗:', err))
  }, [])

  // 根據您的 GitHub 截圖，精準對應圖片檔名
  const featureData = [
    { 
      title: content.feature_1_title || '職人一生守護：達利阿伯的鮮採承諾', 
      desc: content.feature_1_desc || '來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園。', 
      img: '/images/feature_farmer.webp', // 對應截圖中的 feature_farmer.webp
      icon: '🍑' 
    },
    { 
      title: content.feature_2_title || '完美的「七分熟」：精準鎖住鮮甜時機', 
      desc: content.feature_2_desc || '為了確保物流配送過程的品質，我們嚴格執行七分熟採收標準。', 
      img: '/images/feature_7ripe.jpg',   // 對應截圖中的 feature_7ripe.jpg
      icon: '🌿'
    },
    { 
      title: content.feature_3_title || '真誠規格：足重承諾與尊榮禮遇', 
      desc: content.feature_3_desc || '提供 6-12 粒精選規格，每盒淨重保證足 2 斤 4 兩至 2 斤 6 兩。', 
      img: '/images/feature_box.jpg',     // 對應截圖中的 feature_box.jpg
      icon: '🎁'
    },
    { 
      title: content.feature_4_title || '價值倍增：入會即刻解鎖山林假期', 
      desc: content.feature_4_desc || '入會 $1,999 元，不只是購買蜜桃，更是開啟價值超過 $6,000 元的體驗。', 
      img: '/images/feature_camping.png', // 對應截圖中的 feature_camping.png
      icon: '🏕️'
    }
  ]

  return (
    <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#E8836B', fontWeight: '700', fontSize: '13px', letterSpacing: '3px' }}>QUALITY PROMISE</span>
          <h2 style={{ fontSize: '36px', color: '#2D5016', marginTop: '10px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '40px', height: '3px', background: '#E8836B', margin: '20px auto' }}></div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
          gap: '30px' 
        }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#f5f5f5', position: 'relative' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt={item.title}
                />
                <div style={{ position: 'absolute', top: '15px', left: '15px', width: '36px', height: '36px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  {item.icon}
                </div>
              </div>
              <div style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '19px', color: '#2D5016', marginBottom: '15px', fontWeight: '700' }}>{item.title}</h3>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
