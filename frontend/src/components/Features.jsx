import { useState, useEffect } from 'react'

// 加上隨機參數避免瀏覽器快取舊文案
const API = (import.meta.env.VITE_API_URL || '/api') + '/content?v=' + new Date().getTime()

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { 
          flat[k] = (v && typeof v === 'object' && 'value' in v) ? v.value : v 
        })
        setContent(flat)
      })
      .catch(err => console.error('連動後台失敗:', err))
  }, [])

  // 整理資料：確保對應後台 feature_1, feature_2...
  const featureData = [
    { 
      title: content.feature_1_title || '職人一生守護：達利阿伯的親採承諾', 
      desc: content.feature_1_desc || '來自拉拉山雪霧鬧部落的達利阿伯...', 
      img: '/images/feature_farmer.webp' 
    },
    { 
      title: content.feature_2_title || '完美的「七分熟」：精準鎖住鮮甜時機', 
      desc: content.feature_2_desc || '品嚐頂級蜜桃的關鍵，在於採收時機...', 
      img: '/images/feature_7ripe.jpg'
    },
    { 
      title: content.feature_3_title || '真誠規格：足重承諾與尊榮禮遇', 
      desc: content.feature_3_desc || '提供 6-12 粒精選規格，每盒淨重保證足...', 
      img: '/images/feature_box.jpg'
    },
    { 
      title: content.feature_4_title || '價值倍增：入會即刻解鎖山林假期', 
      desc: content.feature_4_desc || '入會 $1,999 元，不只是購買蜜桃...', 
      img: '/images/feature_camping.png'
    }
  ]

  return (
    <section id="features" style={{ padding: '100px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 標題與裝飾線 */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ color: '#E8836B', fontWeight: 700, fontSize: '14px', letterSpacing: '4px' }}>QUALITY PROMISE</span>
          <h2 style={{ fontSize: '38px', color: '#2D5016', marginTop: '15px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '50px', height: '4px', background: '#E8836B', margin: '25px auto' }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>從果園到餐桌，我們用心守護每一顆水蜜桃的品質</p>
        </div>

        {/* 2x2 格線系統：強制對齊 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', // 桌機強制兩列
          gap: '50px 40px', // 上下間距 50px，左右 40px
        }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              border: '1px solid #f2f2f2'
            }}>
              {/* 圖片區：解決大小不一的關鍵 */}
              <div style={{ 
                width: '100%', 
                aspectRatio: '4 / 3', // 強制所有圖片都是 4:3 比例
                overflow: 'hidden',
                backgroundColor: '#f5f5f5'
              }}>
                <img 
                  src={item.img} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', // 圖片會自動填滿並裁切多餘部分，不會變形
                    display: 'block'
                  }} 
                  alt="Feature"
                />
              </div>
              
              {/* 文字區：增加層次感 */}
              <div style={{ padding: '40px' }}>
                <h3 style={{ 
                  fontSize: '22px', 
                  color: '#2D5016', 
                  marginBottom: '20px', 
                  fontWeight: '700', 
                  lineHeight: '1.4' 
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.8', 
                  fontSize: '16px', 
                  margin: 0,
                  textAlign: 'justify'
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 手機版適應：在寬度小於 768px 時改為單欄 (CSS 寫法) */}
      <style>{`
        @media (max-width: 992px) {
          #features > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

export default Features
