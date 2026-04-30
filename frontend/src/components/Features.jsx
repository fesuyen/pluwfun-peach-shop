import { useState, useEffect } from 'react'

// 強制不使用快取，確保後台一儲存，前台重新整理就更新
const API = `${import.meta.env.VITE_API_URL || '/api'}/content?t=${Date.now()}`

const Features = () => {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetch(API, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const flat = {}
        // 核心修正：深度遍歷後台傳回的所有欄位，並將其扁平化
        Object.entries(data).forEach(([k, v]) => { 
          // 處理後台可能的資料封裝格式
          flat[k] = (v && typeof v === 'object' && v.value !== undefined) ? v.value : v 
        })
        setContent(flat)
      })
      .catch(err => console.error('無法從後台抓取資料:', err))
  }, [])

  // 根據您後台截圖的「特色1~4」精準對應圖片與欄位 Key
  const featureData = [
    { 
      title: content.feature_1_title || content.feature1_title, 
      desc: content.feature_1_desc || content.feature1_desc, 
      img: '/images/職人採收.webp' 
    },
    { 
      title: content.feature_2_title || content.feature2_title, 
      desc: content.feature_2_desc || content.feature2_desc, 
      img: '/images/桃子水份多 7至8分熟.jpg' 
    },
    { 
      title: content.feature_3_title || content.feature3_title, 
      desc: content.feature_3_desc || content.feature3_desc, 
      img: '/images/淨重足重.jpg' 
    },
    { 
      title: content.feature_4_title || content.feature4_title, 
      desc: content.feature_4_desc || content.feature4_desc, 
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

        {/* 2x2 對稱佈局，並強制圖片大小統一 */}
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
              {/* 解決圖片大小不一問題：強制 16:9 且填滿 */}
              <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="產品特色"
                />
              </div>
              
              <div style={{ padding: '30px', flex: 1 }}>
                <h3 style={{ fontSize: '20px', color: '#2D5016', marginBottom: '15px', fontWeight: '700' }}>
                  {item.title || "後台標題抓取中..."}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {item.desc || "後台描述內容抓取中，請確認後台已點擊儲存..."}
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
