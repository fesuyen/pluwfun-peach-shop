import { useState, useEffect } from 'react'

// 自動適應環境變數網址
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

  // 1. 預設文案：解決「載入中」顯示問題，確保網頁一開啟就具備質感
  // 2. 圖片路徑：回歸您本地資料夾的路徑，並附帶高品質備援圖
  const featureData = [
    { 
      title: content.feature_1_title || '職人一生守護：達利阿伯的鮮採承諾', 
      desc: content.feature_1_desc || '來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園。每一顆水蜜桃，都是他親手摘下的驕傲。', 
      img: '/images/feature1.webp',
      icon: '🍑' 
    },
    { 
      title: content.feature_2_title || '完美的「七分熟」：精準鎖住鮮甜時機', 
      desc: content.feature_2_desc || '品味頂級蜜桃，關鍵在於採收時機。我們堅持七分熟採收，確保物流配送過程中果肉鮮美不變色。', 
      img: '/images/feature2.webp',
      icon: '🌿'
    },
    { 
      title: content.feature_3_title || '真誠規格：足重承諾與尊榮禮遇', 
      desc: content.feature_3_desc || '提供 6-12 粒精選規格，每盒淨重保證足 2 斤 4 兩至 2 斤 6 兩。不論送禮或自用，皆展現產地直送的誠信。', 
      img: '/images/feature3.webp',
      icon: '🎁'
    },
    { 
      title: content.feature_4_title || '價值倍增：入會即刻解鎖山林假期', 
      desc: content.feature_4_desc || '入會 $1,999 元，不只是購買蜜桃，更是開啟價值超過 $6,000 元的山林體驗，包含豪華露營平日 0 元入住。', 
      img: '/images/feature4.webp',
      icon: '🏕️'
    }
  ]

  return (
    <section id="features" style={{ padding: '100px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* 標題區：強化呼吸感與品牌感 */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <span style={{ color: '#E8836B', fontWeight: '700', fontSize: '13px', letterSpacing: '3px' }}>QUALITY PROMISE</span>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', color: '#2D5016', marginTop: '10px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '40px', height: '3px', background: '#E8836B', margin: '20px auto' }}></div>
          <p style={{ color: '#666', fontSize: '15px' }}>從果園到餐桌，我們用心守護每一顆水蜜桃的品質</p>
        </div>

        {/* 響應式 2x2 對稱網格 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', // 確保在桌機上呈現穩定的 2 欄位對稱
          gap: '40px' 
        }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 15px 45px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease'
            }}>
              
              {/* 圖片區域：增加左上角浮動 Icon 標籤 */}
              <div style={{ width: '100%', aspectRatio: '16 / 9', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1628489611989-17481b4f2347?auto=format&fit=crop&q=80' }}
                />
                
                {/* 浮動 Icon 標籤 */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  width: '40px',
                  height: '40px',
                  background: '#fff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  {item.icon}
                </div>
              </div>

              {/* 文字內容區：對齊與間距優化 */}
              <div style={{ padding: '35px' }}>
                <h3 style={{ fontSize: '20px', color: '#2D5016', marginBottom: '16px', fontWeight: '700', lineHeight: '1.4' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px', textAlign: 'justify' }}>
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
