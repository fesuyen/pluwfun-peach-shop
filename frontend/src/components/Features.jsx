import { useState, useEffect } from 'react'

// 強制不緩存 API，確保後台更新後，前台重整立刻看到結果
const API = `${import.meta.env.VITE_API_URL || '/api'}/content?v=${new Date().getTime()}`

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const flat = {}
        // 深度掃描後台資料，確保抓到最新的標題與描述
        Object.entries(data).forEach(([k, v]) => {
          flat[k] = (v && typeof v === 'object' && v.value !== undefined) ? v.value : v
        })
        setContent(flat)
      })
      .catch(err => console.error('無法連線後台:', err))
  }, [])

  // 1. 圖片路徑：完全對應您 GitHub 截圖中的「中文檔名」
  // 2. 資料 Key 值：對應後台 feature_1, feature_2...
  const featureItems = [
    { 
      id: 1, 
      img: '/images/職人採收.webp', 
      title: content.feature_1_title, 
      desc: content.feature_1_desc 
    },
    { 
      id: 2, 
      img: '/images/桃子水份多 7至8分熟.jpg', 
      title: content.feature_2_title, 
      desc: content.feature_2_desc 
    },
    { 
      id: 3, 
      img: '/images/淨重足重.jpg', 
      title: content.feature_3_title, 
      desc: content.feature_3_desc 
    },
    { 
      id: 4, 
      img: '/images/飛鼠camping.png', 
      title: content.feature_4_title, 
      desc: content.feature_4_desc 
    }
  ]

  return (
    <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', color: '#2D5016', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '40px', height: '3px', background: '#E8836B', margin: '15px auto' }}></div>
        </div>

        {/* 2x2 對稱佈局：強制格線 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
          gap: '40px' 
        }}>
          {featureItems.map((item) => (
            <div key={item.id} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 圖片區域：固定高度 + object-fit，解決圖片大小不一問題 */}
              <div style={{ width: '100%', height: '260px', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="產品特色圖片"
                />
              </div>
              
              <div style={{ padding: '30px', flex: 1 }}>
                {/* 標題：若後台有填寫則顯示 */}
                <h3 style={{ fontSize: '20px', color: '#2D5016', marginBottom: '15px', fontWeight: '700', lineHeight: '1.4' }}>
                  {item.title || "請於後台輸入標題"}
                </h3>
                {/* 描述：若後台有填寫則顯示，保留換行符號 */}
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {item.desc || "請於後台輸入描述內容"}
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
