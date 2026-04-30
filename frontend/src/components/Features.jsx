import { useState, useEffect } from 'react'

// 加入時間戳記，確保後台一儲存，前台重整即刻更新，不讀取舊快取
const API = `${import.meta.env.VITE_API_URL || '/api'}/content?t=${Date.now()}`

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { 
          // 支援後台不同層級的資料格式
          flat[k] = (v && typeof v === 'object' && v.value !== undefined) ? v.value : v 
        })
        setContent(flat)
      })
      .catch(err => console.error('連動失敗:', err))
  }, [])

  // 完全依照您提供的「圖片名稱」與「後台文案」進行對接
  const featureItems = [
    { 
      img: '/images/職人採收.webp', 
      title: content.feature_1_title || '一輩子的果園守護：達利阿伯的職人手採承諾', 
      desc: content.feature_1_desc 
    },
    { 
      img: '/images/桃子水份多 7至8分熟.jpg', 
      title: content.feature_2_title || '黃金 70% 熟度：精準鎖住從枝頭到指尖的極致鮮甜', 
      desc: content.feature_2_desc 
    },
    { 
      img: '/images/淨重足重.jpg', 
      title: content.feature_3_title || '分級不馬虎：淨重足重，讓送禮有面子、自用更踏實', 
      desc: content.feature_3_desc 
    },
    { 
      img: '/images/cta-加入會員.png', 
      title: content.feature_4_title || '不只是買桃：1,999 元入會，開啟您山林奢華露營季', 
      desc: content.feature_4_desc 
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', 
          gap: '40px' 
        }}>
          {featureItems.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              border: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 圖片規格統一：強制 16:9 比例，解決大小不一問題 */}
              <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="Feature"
                  onError={(e) => { e.target.src = '/images/hero-peach.webp' }} // 備援路徑
                />
              </div>
              
              <div style={{ padding: '35px', flex: 1 }}>
                <h3 style={{ fontSize: '20px', color: '#2D5016', marginBottom: '18px', fontWeight: '700', lineHeight: '1.4' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {item.desc || '請於後台編輯完整描述文案內容...'}
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
