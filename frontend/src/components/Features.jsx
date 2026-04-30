import { useState, useEffect } from 'react'

const API = (import.meta.env.VITE_API_URL || '/api') + '/content?t=' + new Date().getTime()

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        const flat = {}
        // 深度解析資料，確保無論資料層級多深都能抓到
        Object.entries(data).forEach(([k, v]) => { 
          flat[k] = (v && typeof v === 'object' && v.value !== undefined) ? v.value : v 
        })
        setContent(flat)
      })
      .catch(err => console.error('API 連線失敗:', err))
  }, [])

  // 1. 這裡的 Key 完全對齊後台欄位：feature_1_title, feature_1_desc 等
  // 2. 圖片路徑重新配置，第一張確保不是農民照
  const featureData = [
    { 
      title: content.feature_1_title || '一輩子的果園守護：達利阿伯的親採承諾', 
      desc: content.feature_1_desc || '來自拉拉山雪霧鬧部落的達利阿伯...', 
      img: '/images/feature_box.jpg' 
    },
    { 
      title: content.feature_2_title || '黃金 70% 熟度：精準掌控甜度與口感的極致關鍵', 
      desc: content.feature_2_desc || '品嚐頂級蜜桃的關鍵，在於採收時機...', 
      img: '/images/feature_7ripe.jpg'
    },
    { 
      title: content.feature_3_title || '分毫不差：淨重足量，讓您送禮有面子、自用更踏實', 
      desc: content.feature_3_desc || '提供 6-12 粒精選規格...', 
      img: '/images/feature_box.jpg' 
    },
    { 
      title: content.feature_4_title || '不只是蜜桃：1,999 元入會，開啟您的山林豪華饗宴', 
      desc: content.feature_4_desc || '入會 $1,999 元，不只是購買蜜桃...', 
      img: '/images/feature_camping.png'
    }
  ]

  return (
    <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#E8836B', fontWeight: 700, fontSize: '13px', letterSpacing: '3px' }}>QUALITY PROMISE</span>
          <h2 style={{ fontSize: '36px', color: '#2D5016', marginTop: '10px', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '40px', height: '3px', background: '#E8836B', margin: '20px auto' }}></div>
        </div>

        {/* 2x2 對稱佈局：強制格線 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', // 在桌機強制平均分為兩欄
          gap: '40px',
        }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 圖片區域：使用固定高度 + object-fit，解決大小不一問題 */}
              <div style={{ width: '100%', height: '260px', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="Feature"
                />
              </div>
              
              {/* 文字區域：固定高度確保底部對齊 */}
              <div style={{ padding: '35px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  color: '#2D5016', 
                  marginBottom: '18px', 
                  fontWeight: '700', 
                  lineHeight: '1.4',
                  minHeight: '2.8em' // 確保標題就算換行也維持一樣高度
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.8', 
                  fontSize: '15px', 
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

      {/* 手機版適應：寬度小於 992px 時自動變單欄 */}
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
