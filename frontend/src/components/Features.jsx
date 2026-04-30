import { useState, useEffect } from 'react'

// 加入 v= 參數強制刷新快取
const API = `${import.meta.env.VITE_API_URL || '/api'}/content?v=${Date.now()}`

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const flat = {}
        Object.entries(data).forEach(([k, v]) => { 
          flat[k] = (v && typeof v === 'object' && v.value !== undefined) ? v.value : v 
        })
        setContent(flat)
      })
  }, [])

  // 1. 文案：同時嘗試 desc、description、content 確保連動
  // 2. 圖片：精準對應您 GitHub 中的中文檔名
  const featureData = [
    { 
      title: content.feature_1_title, 
      desc: content.feature_1_desc || content.feature_1_description || content.feature_1_content, 
      img: '/images/職人採收.webp' 
    },
    { 
      title: content.feature_2_title, 
      desc: content.feature_2_desc || content.feature_2_description || content.feature_2_content, 
      img: '/images/桃子水份多 7至8分熟.jpg' 
    },
    { 
      title: content.feature_3_title, 
      desc: content.feature_3_desc || content.feature_3_description || content.feature_3_content, 
      img: '/images/淨重足重.jpg' 
    },
    { 
      title: content.feature_4_title, 
      desc: content.feature_4_desc || content.feature_4_description || content.feature_4_content, 
      img: '/images/cta-加入會員.png' 
    }
  ]

  return (
    <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', color: '#2D5016', fontWeight: '800' }}>四大理由，非買不可</h2>
          <div style={{ width: '40px', height: '3px', background: '#E8836B', margin: '20px auto' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>
          {featureData.map((item, index) => (
            <div key={index} style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
              {/* 圖片統一高度：16:9 比例 */}
              <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="特色圖片" />
              </div>
              <div style={{ padding: '35px', flex: 1 }}>
                <h3 style={{ fontSize: '19px', color: '#2D5016', marginBottom: '15px', fontWeight: '700' }}>{item.title || '請至後台編輯標題'}</h3>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {item.desc || '請至後台編輯完整文案內容...'}
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
