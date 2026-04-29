const steps = [
  {
    icon: '🛒',
    num: '01',
    title: '選擇規格',
    desc: '挑選喜歡的粒數',
    color: '#E8836B',
  },
  {
    icon: '📝',
    num: '02',
    title: '填寫資料',
    desc: '收件人與地址',
    color: '#D4A843',
  },
  {
    icon: '💳',
    num: '03',
    title: '匯款付款',
    desc: '轉帳並上傳截圖',
    color: '#4A7C2E',
  },
  {
    icon: '✅',
    num: '04',
    title: '確認出貨',
    desc: '專人確認通知',
    color: '#8B5E3C',
  },
  {
    icon: '🍑',
    num: '05',
    title: '新鮮到府',
    desc: '低溫宅配享用',
    color: '#E8836B',
  },
]

export default function OrderFlow() {
  return (
    <section style={{
      padding: '50px 0 20px',
      background: 'linear-gradient(180deg, #FFF 0%, #F5F0E8 100%)',
    }}>
      <div className="container">
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #E8836B20, #D4A84320)',
            padding: '5px 18px', borderRadius: 20, fontSize: 12,
            color: 'var(--peach-dark)', fontWeight: 600, letterSpacing: 2, marginBottom: 12,
          }}>HOW TO ORDER</div>
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
            color: 'var(--green-deep)', marginBottom: 6,
          }}>五步驟輕鬆訂購</h2>
          <p style={{ color: 'var(--text-mid)', fontSize: 14 }}>
            簡單流程，新鮮直送到您手中
          </p>
        </div>

        <div className="animate-on-scroll" style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 0,
          position: 'relative',
        }} id="order-flow-row">
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              flex: i < steps.length - 1 ? '1' : '0 0 auto',
            }}>
              {/* Step card */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minWidth: 90,
                maxWidth: 110,
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${s.color}15, ${s.color}25)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  marginBottom: 8,
                  position: 'relative',
                  border: `2px solid ${s.color}30`,
                }}>
                  {s.icon}
                  <div style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: s.color,
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{s.num}</div>
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: 3,
                }}>{s.title}</div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-light)',
                }}>{s.desc}</div>
              </div>
              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: 28,
                }}>
                  <div style={{
                    height: 2,
                    flex: 1,
                    background: `linear-gradient(90deg, ${s.color}40, ${steps[i+1].color}40)`,
                    position: 'relative',
                    minWidth: 20,
                  }}>
                    <div style={{
                      position: 'absolute',
                      right: -4,
                      top: -4,
                      width: 0,
                      height: 0,
                      borderLeft: `8px solid ${steps[i+1].color}60`,
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                    }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          #order-flow-row {
            flex-wrap: wrap !important;
            gap: 12px !important;
            justify-content: center !important;
          }
          #order-flow-row > div {
            flex: 0 0 auto !important;
          }
        }
      `}</style>
    </section>
  )
}
