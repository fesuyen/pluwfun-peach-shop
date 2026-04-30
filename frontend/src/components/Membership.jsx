import { useState } from 'react'

const benefits = [
  { icon: '💰', text: '2,000 點飛鼠幣', detail: '入會即送，1:1 全額折抵消費', highlight: true },
  { icon: '⛺', text: '豪華帳篷平日入住券', detail: '價值 $3,600，保證兌換 0 元入住' },
  { icon: '🍑', text: '五月桃 SSS 級優先預購權', detail: '搶先預購，保證有桃不落空' },
  { icon: '🎁', text: '每購一盒回饋 50 點', detail: '飛鼠幣買越多省越多' },
  { icon: '⭐', text: '限量 200 位名額', detail: '專屬服務，額滿即停止招募' },
]

export default function Membership() {
  const lineUrl = "https://lin.ee/RBc7waf"; // 您的 LINE OA 連結

  return (
    <section id="membership" style={{
      padding: '80px 0',
      background: 'linear-gradient(180deg, #FDFCFB 0%, #F5F0E8 100%)',
    }}>
      <div className="container">
        
        {/* 頂部標語 */}
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #E8836B20, #D4A84320)',
            padding: '6px 20px', borderRadius: 20, fontSize: 13,
            color: '#E8836B', fontWeight: 600, letterSpacing: 2, marginBottom: 16,
          }}>
            EXCLUSIVE MEMBERSHIP
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
            color: '#2D5016', marginBottom: 12,
          }}>
            入會 $1,999 → 開啟您的山林奢華季
          </h2>
          <p style={{ color: '#666', fontSize: 17, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            不僅是購買蜜桃，更是開啟一場價值超值的山林體驗。<br/>
            加入 LINE 官方帳號，由專人為您核發 2,000 飛鼠幣。
          </p>
        </div>

        {/* 權益清單格線 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
          marginBottom: 50,
        }}>
          {benefits.map((b, i) => (
            <div key={i} className="animate-on-scroll" style={{
              background: b.highlight ? '#2D5016' : '#fff',
              borderRadius: 24,
              padding: '35px 28px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              textAlign: 'center',
              border: b.highlight ? 'none' : '1px solid #eee',
              transition: 'transform 0.3s',
            }}>
              <div style={{ fontSize: 40, marginBottom: 15 }}>{b.icon}</div>
              <div style={{
                fontSize: 18, fontWeight: 700, marginBottom: 8,
                color: b.highlight ? '#fff' : '#2D5016',
              }}>{b.text}</div>
              <div style={{
                fontSize: 14,
                color: b.highlight ? 'rgba(255,255,255,0.8)' : '#888',
                lineHeight: 1.5
              }}>{b.detail}</div>
            </div>
          ))}
        </div>

        {/* 行動按鈕區 */}
        <div className="animate-on-scroll" style={{ 
          textAlign: 'center', 
          background: '#fff', 
          padding: '50px 30px', 
          borderRadius: 30,
          boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#2D5016', marginBottom: 15 }}>
            準備好加入我們了嗎？
          </h3>
          <p style={{ color: '#666', marginBottom: 35 }}>
            點擊下方按鈕加入 LINE 官方帳號，完成入會申請後<br/>
            管理員將於 24 小時內手動核發 <b>2,000 飛鼠幣</b> 至您的帳戶。
          </p>
          
          <a href={lineUrl} target="_blank" rel="noreferrer" style={{
            display: 'inline-block',
            background: '#06C755', // LINE 品牌綠
            color: '#fff',
            padding: '20px 60px',
            borderRadius: 50,
            fontSize: 20,
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 10px 25px rgba(6, 199, 85, 0.3)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            透過 LINE 立即入會 →
          </a>
          
          <div style={{ marginTop: 20, fontSize: 13, color: '#AAA' }}>
            * 加入後請主動傳送「我要加入會員」訊息給我們
          </div>
        </div>

      </div>
    </section>
  )
}
