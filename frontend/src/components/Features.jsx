import { useState, useEffect } from 'react'

// 加入更強的隨機參數防止快取
const API = (import.meta.env.VITE_API_URL || '/api') + '/content?v=' + Date.now()

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { 
          // 支援多種資料格式解析
          flat[k] = (v && typeof v === 'object' && v.value !== undefined) ? v.value : v 
        })
        console.log("資料對接檢查:", flat) // 您可以按 F12 檢查控制台
        setContent(flat)
      })
      .catch(err => console.error('API 連線失敗:', err))
  }, [])

  // 1. 文案：支援兩種可能的 Key (desc 或 description)，移除所有 ... 預設文字
  // 2. 圖片：還原原始設計順序 (阿伯 -> 七分熟 -> 禮盒 -> 露營)
  const featureData = [
    { 
      title: content.feature_1_title || '一輩子的果園守護：達利阿伯的親採承諾', 
      desc: content.feature_1_desc || content.feature_1_description || '正在讀取後台完整內容，請稍候...', 
      img: '/images/feature_farmer.webp' 
    },
    { 
      title: content.feature_2_title || '黃金 70% 熟度：精準掌控甜度與口感的極致關鍵', 
      desc: content.feature_2_desc || content.feature_2_description || '正在讀取後台完整內容，請稍候...', 
      img: '/images/feature_7ripe.jpg'
    },
    { 
      title: content.feature_3_title || '分毫不差：淨重足量，讓您送禮有面子、自用更踏實', 
      desc: content.feature_3_desc || content.feature_3_description || '正在讀取後台完整內容，請稍候...', 
      img: '/images/feature_box.jpg' 
    },
    { 
      title: content.feature_4_title || '不只是蜜桃：1,999 元入會，開啟您的山林豪華饗宴', 
      desc: content.feature_4_desc || content.feature_4_description || '正在讀取後台完整內容，請稍候...', 
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

        {/* 2x2 對稱格線：在電腦版強制均分兩欄 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
          gap: '40px' 
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
              {/* 圖片區域：強制固定高度與比例，解決 image_d79130.jpg 的對齊問題 */}
              <div style={{ width: '100%', height: '280px', backgroundColor: '#f9f9f9' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  alt="Feature"
                />
              </div>
              
              <div style={{ padding: '35px', flex: 1 }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  color: '#2D5016', 
                  marginBottom: '18px', 
                  fontWeight: '700', 
                  lineHeight: '1.4',
                  minHeight: '2.8em' // 確保標題高度一致
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.8', 
                  fontSize: '15px', 
                  margin: 0,
                  whiteSpace: 'pre-wrap' // 保留後台輸入的換行
                }}>
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
