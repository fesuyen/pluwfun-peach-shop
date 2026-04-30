import { useState, useEffect } from 'react'

// 加入時間戳記避免瀏覽器讀取舊資料，確保後台儲存後前台能即時更新
const API = (import.meta.env.VITE_API_URL || '/api') + '/content?t=' + Date.now()

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { 
          flat[k] = v.value !== undefined ? v.value : v 
        })
        setContent(flat)
      })
      .catch(err => console.error('抓取資料失敗:', err))
  }, [])

  // 1. 移除 Icon 設定
  // 2. 確保讀取後台欄位名稱 (feature_1_title, feature_1_desc ...)
  const featureData = [
    { 
      title: content.feature_1_title || '一輩子的果園守護：達利阿伯的親採承諾', 
      desc: content.feature_1_desc || '來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園...', 
      img: '/images/feature_farmer.webp'
    },
    { 
      title: content.feature_2_title || '黃金 70% 熟度：精準掌控甜度與口感的極致關鍵', 
      desc: content.feature_2_desc || '品嚐頂級蜜桃的關鍵，在於採收時機...', 
      img: '/images/feature_7ripe.jpg'
    },
    { 
      title: content.feature_3_title || '分毫比不失：淨重足量，讓您送禮有面子、自用更踏實', 
      desc: content.feature_3_desc || '提供 6-12 粒精選規格，每盒淨重保證足 2 斤 4 兩至 2 斤 6 兩...', 
      img: '/images/feature_box.jpg'
    },
    { 
      title: content.feature_4_title || '不只是蜜桃：1,999 元入會，開啟您的山林豪華饗宴', 
      desc: content.feature_4_desc || '入會 $1,999 元，不只是購買蜜桃，更是開啟一場體驗山林假期...', 
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

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', // 確保對稱排版
          gap: '40px' 
        }}>
          {featureData.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 圖片區域：移除 Icon 標籤，使用 aspectRatio 統一高度 */}
              <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#f5f5f5' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="Feature"
                />
              </div>
              
              <div style={{ padding: '35px', flex: 1 }}>
                <h3 style={{ fontSize: '19px', color: '#2D5016', marginBottom: '18px', fontWeight: '700', lineHeight: '1.4' }}>
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
