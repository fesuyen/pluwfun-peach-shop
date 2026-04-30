import { useState, useEffect } from 'react'

// 強制加上時間戳記與 no-cache，確保後台更新後前台立即同步
const API = `${import.meta.env.VITE_API_URL || '/api'}/content?t=${Date.now()}`

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { 
          // 自動解構後台物件資料
          flat[k] = (v && typeof v === 'object' && v.value !== undefined) ? v.value : v 
        })
        setContent(flat)
      })
      .catch(err => console.error('後台資料連線失敗:', err))
  }, [])

  // 根據您的後台截圖 (image_d798af.png) 精準對應資料
  // 圖片路徑固定，文字完全依賴 content 狀態
  const featureItems = [
    { 
      id: 1, 
      img: '/images/feature_farmer.webp', // 阿伯
      title: content.feature_1_title,
      desc: content.feature_1_desc || content.feature_1_description || content.feature_1_content 
    },
    { 
      id: 2, 
      img: '/images/feature_7ripe.jpg', // 七分熟
      title: content.feature_2_title,
      desc: content.feature_2_desc || content.feature_2_description || content.feature_2_content 
    },
    { 
      id: 3, 
      img: '/images/feature_box.jpg', // 禮盒
      title: content.feature_3_title,
      desc: content.feature_3_desc || content.feature_3_description || content.feature_3_content 
    },
    { 
      id: 4, 
      img: '/images/feature_camping.png', // 露營
      title: content.feature_4_title,
      desc: content.feature_4_desc || content.feature_4_description || content.feature_4_content 
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

        {/* 2x2 對稱格線：電腦版強制兩欄，解決排版歪掉問題 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', 
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
              {/* 圖片容器：解決 image_d73af9.jpg 圖片大小不一的關鍵 */}
              <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="Feature Image"
                />
              </div>
              
              <div style={{ padding: '35px', flex: 1 }}>
                {/* 主題標題：完全對應後台 */}
                <h3 style={{ 
                  fontSize: '20px', 
                  color: '#2D5016', 
                  marginBottom: '18px', 
                  fontWeight: '700', 
                  lineHeight: '1.4'
                }}>
                  {item.title || '無標題內容'}
                </h3>
                
                {/* 描述文案：完全對應後台，不設字數限制，保留換行 */}
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.8', 
                  fontSize: '15px', 
                  margin: 0,
                  whiteSpace: 'pre-wrap', // 保留後台輸入的換行
                  textAlign: 'justify'
                }}>
                  {item.desc || '暫無描述內容'}
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
