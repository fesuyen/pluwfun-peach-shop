import { useState, useEffect } from 'react'

// 加入隨機參數，強制每次重整都抓取後台最新的資料，避免緩存
const API = (import.meta.env.VITE_API_URL || '/api') + '/content?t=' + new Date().getTime()

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        // 將後台傳回的物件扁平化處理
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { 
          flat[k] = (v && typeof v === 'object' && 'value' in v) ? v.value : v 
        })
        setContent(flat)
      })
      .catch(err => console.error('後台連線失敗:', err))
  }, [])

  // 1. 精準對應後台 screenshot 的欄位 (feature_1, feature_2 ...)
  // 2. 修正圖片路徑：第一張改回桃子照，不再誤用農民照
  const featureData = [
    { 
      title: content.feature_1_title || '一輩子的果園守護：達利阿伯的親採承諾', 
      desc: content.feature_1_desc || '來自拉拉山雪霧鬧部落的達利阿伯...', 
      img: '/images/feature_box.jpg' // 改用桃子包裝照
    },
    { 
      title: content.feature_2_title || '黃金 70% 熟度：精準掌控甜度與口感的極致關鍵', 
      desc: content.feature_2_desc || '品嚐頂級蜜桃的關鍵，在於採收時機...', 
      img: '/images/feature_7ripe.jpg'
    },
    { 
      title: content.feature_3_title || '分毫比不失：淨重足量，讓您送禮有面子、自用更踏實', 
      desc: content.feature_3_desc || '提供 6、8、10、12 粒等精選規格...', 
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

        {/* 2x2 對稱佈局 */}
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
              display: 'flex',
              flexDirection: 'column',
              height: '100%' // 確保卡片高度一致
            }}>
              {/* 強制所有圖片框為 16:9 比例，解決大小不一問題 */}
              <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#f5f5f5' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="Feature"
                />
              </div>
              
              <div style={{ padding: '35px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '19px', color: '#2D5016', marginBottom: '15px', fontWeight: '700', lineHeight: '1.4' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px', margin: 0 }}>
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
