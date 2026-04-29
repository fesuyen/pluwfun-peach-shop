import { useState, useEffect } from 'react'

const testimonials = [
  {
    name: '阿赫',
    title: '斑馬線文庫社長',
    avatar: '/images/avatar_ahe.png',
    color: '#4A7C2E',
    content: '平常關在辦公室跟文字打交道，腦袋其實很僵硬。這次看到達利跟李花親手遞來的桃子，那種土地的敦厚感真的很暖。我本來想說 1,999 元這種方案是不是噱頭，結果平日 0 元入住券真的直接發下來，在山上安安靜靜睡一晚，感覺比看十本書還能療癒靈魂。最讓我驚訝的是，宅配寄到家竟然一顆都沒壓壞，看來果農堅持 7 分熟採收是真的有專業考量，收到的時候熟度剛剛好。',
  },
  {
    name: 'amy',
    title: '麗京國際精品美學',
    avatar: '/images/avatar_amy.png',
    color: '#E8836B',
    content: '我對生活質感一向很挑剔，原本以為露營會很克難，結果完全被顛覆。粉嫩水蜜桃撕開皮那一刻，香氣真的大療癒了。我覺得最聰明的是那個飛鼠幣，我帶著入會送的 2,000 點來到角板山的米安咖啡折抵，真的有種在山林裡逛精品的錯覺。雖然我是為了桃子入會，但一算平日 0 元住加上這堆福利，價值早就超過六千。這對我來說不是消費，而是給自己的一場質感投資。',
  },
  {
    name: '水母熊',
    title: '藝術創作者',
    avatar: '/images/avatar_jellyfish.png',
    color: '#D4A843',
    content: '藝行創作快窒息了，上山吹一口桃子簡直是靈魂救贖，那個甜度真的會讓人大腦瞬間當機三秒，完全是療癒炸彈！我特別愛那個平日 0 元住的計畫，不用跟觀光客擠，拿著飛鼠去合作的小店晃一圈，隨便找個角落坐著畫畫都很爽。城裡的萬年月薪，說真的不如山裡這一口鮮甜跟一晚星空。這口桃子我先鎖定一年份了。身為創作者，這份土地的禮物我絕對配得上！',
  },
]

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="testimonials" style={{
      padding: '60px 0',
      background: 'linear-gradient(180deg, #F5F0E8 0%, #FFF 100%)',
      overflow: 'hidden',
    }}>
      <div className="container">
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #E8836B20, #D4A84320)',
            padding: '5px 18px', borderRadius: 20, fontSize: 12,
            color: 'var(--peach-dark)', fontWeight: 600, letterSpacing: 2, marginBottom: 12,
          }}>TESTIMONIALS</div>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800,
            color: 'var(--green-deep)', marginBottom: 8,
          }}>真實體驗，好評推薦</h2>
          <p style={{ color: 'var(--text-mid)', fontSize: 15 }}>聽聽他們怎麼說</p>
        </div>

        <div className="animate-on-scroll" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }} id="testimonials-grid">
          {testimonials.map((t, i) => (
            <div
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '28px 22px',
                boxShadow: activeIdx === i
                  ? `0 12px 40px ${t.color}25`
                  : '0 3px 16px rgba(0,0,0,0.04)',
                transition: 'all 0.5s ease',
                cursor: 'pointer',
                border: activeIdx === i
                  ? `2px solid ${t.color}40`
                  : '2px solid transparent',
                transform: activeIdx === i ? 'translateY(-4px)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Quote mark */}
              <div style={{
                position: 'absolute',
                top: 12,
                right: 16,
                fontSize: 52,
                color: `${t.color}12`,
                fontFamily: 'Georgia, serif',
                lineHeight: 1,
                fontWeight: 700,
              }}>"</div>

              {/* Avatar & info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 14,
              }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: `2px solid ${t.color}30`,
                  boxShadow: `0 2px 8px ${t.color}20`,
                }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: 1,
                  }}>{t.name}</div>
                  <div style={{
                    fontSize: 12,
                    color: t.color,
                    fontWeight: 500,
                  }}>{t.title}</div>
                </div>
              </div>

              {/* Stars */}
              <div style={{ marginBottom: 10, letterSpacing: 2 }}>
                {'★★★★★'.split('').map((s, j) => (
                  <span key={j} style={{ color: '#F0D68A', fontSize: 14 }}>{s}</span>
                ))}
              </div>

              {/* Content */}
              <p style={{
                fontSize: 13.5,
                color: 'var(--text-mid)',
                lineHeight: 1.8,
                position: 'relative',
              }}>{t.content}</p>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginTop: 28,
        }}>
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: activeIdx === i ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: activeIdx === i ? t.color : '#E0DCD6',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          #testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
