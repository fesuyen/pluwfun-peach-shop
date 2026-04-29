import { useState } from 'react'

const notices = [
  {
    icon: '🍑',
    title: '七分熟採收說明',
    content: '我們堅持在七分熟時採收，這是為了確保桃子在宅配過程中不會過熟軟爛。收到時桃子可能還稍硬，請在室溫下靜置 1-2 天，待自然熟成後風味最佳。',
    color: '#E8836B',
  },
  {
    icon: '🌱',
    title: '自然農產品差異',
    content: '水蜜桃為自然農產品，每顆的甜度、大小、外觀會因天候、日照等自然因素而有些微差異，這是大自然的正常現象，並非品質瑕疵。',
    color: '#4A7C2E',
  },
  {
    icon: '📦',
    title: '運送風險提醒',
    content: '水蜜桃為嬌貴水果，雖然我們採用專業包裝與低溫宅配，但運送過程中仍可能因碰撞造成輕微壓傷，收到後請盡快開箱確認。',
    color: '#D4A843',
  },
  {
    icon: '🔄',
    title: '退換貨政策',
    content: '如收到時有明顯損壞（非自然熟成軟化），請於收貨當日拍照聯繫客服，我們將盡速處理。',
    color: '#2196F3',
  },
  {
    icon: '📋',
    title: '免責聲明',
    content: '因個人口感偏好差異、未依建議方式保存（如直接冷藏未熟果實），或超過建議食用期限所導致的風味不如預期，恕不在退換範圍內。',
    color: '#8B5E3C',
  },
]

export default function QualityNotice() {
  const [expandedIdx, setExpandedIdx] = useState(null)

  return (
    <section id="quality" style={{
      padding: '50px 0',
      background: 'linear-gradient(180deg, #FFF 0%, #FFF8F0 100%)',
    }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #D4A84320, #4A7C2E20)',
            padding: '6px 20px',
            borderRadius: 20,
            fontSize: 13,
            color: 'var(--green)',
            fontWeight: 600,
            letterSpacing: 2,
            marginBottom: 16,
          }}>
            QUALITY PROMISE
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 3.5vw, 36px)',
            fontWeight: 800,
            color: 'var(--green-deep)',
            marginBottom: 12,
          }}>
            品質承諾與溫馨提醒
          </h2>
          <p style={{ color: 'var(--text-mid)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            我們珍視每一位顧客的信任，以下是關於水蜜桃的重要說明，請在訂購前詳閱
          </p>
        </div>

        <div className="animate-on-scroll" style={{
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid rgba(212, 168, 67, 0.15)',
        }}>
          {/* Header banner */}
          <div style={{
            background: 'linear-gradient(135deg, #2D5016, #4A7C2E)',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>🤝</span>
            <div>
              <div style={{ color: '#F0D68A', fontWeight: 700, fontSize: 17 }}>
                我們的承諾
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>
                透明誠信，讓您安心享用每一口鮮甜
              </div>
            </div>
          </div>

          {/* Notice items */}
          <div style={{ padding: '8px 0' }}>
            {notices.map((n, i) => (
              <div key={i} style={{
                borderBottom: i < notices.length - 1 ? '1px solid #F0EDE8' : 'none',
              }}>
                <button
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '18px 28px',
                    background: expandedIdx === i ? '#FEFCF8' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.3s',
                  }}
                >
                  <span style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${n.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}>
                    {n.icon}
                  </span>
                  <span style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: 600,
                    color: expandedIdx === i ? n.color : 'var(--text-dark)',
                    transition: 'color 0.3s',
                  }}>
                    {n.title}
                  </span>
                  <span style={{
                    fontSize: 20,
                    color: n.color,
                    transition: 'transform 0.3s',
                    transform: expandedIdx === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                  }}>
                    ▾
                  </span>
                </button>
                <div style={{
                  maxHeight: expandedIdx === i ? 200 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease, padding 0.4s ease',
                  padding: expandedIdx === i ? '0 28px 18px 82px' : '0 28px 0 82px',
                }}>
                  <p style={{
                    fontSize: 15,
                    color: 'var(--text-mid)',
                    lineHeight: 1.85,
                  }}>
                    {n.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{
            background: '#FFF8F0',
            padding: '16px 28px',
            borderTop: '1px solid #F0EDE8',
          }}>
            <p style={{
              fontSize: 13,
              color: 'var(--text-light)',
              lineHeight: 1.7,
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
              下單即表示您已閱讀並同意以上品質說明與退換貨政策。感謝您的理解與支持！
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
