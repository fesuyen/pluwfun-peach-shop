export default function FarmerStory() {
  return (
    <section id="story" style={{
      padding: '60px 0',
      background: 'linear-gradient(180deg, #fff 0%, #F5F0E8 100%)',
      overflow: 'hidden',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          alignItems: 'center',
        }} className="story-grid">
          {/* Image */}
          <div className="animate-on-scroll" style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
              position: 'relative',
            }}>
              <img
                src="/images/farmer.webp"
                alt="達利阿伯在拉拉山果園採收水蜜桃"
                style={{
                  width: '100%',
                  height: 420,
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                background: 'rgba(45, 80, 22, 0.9)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
              }}>
                📍 拉拉山 · 雪霧鬧部落
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: -16,
              left: -16,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8836B30, #D4A84330)',
              zIndex: -1,
            }} />
          </div>

          {/* Text */}
          <div className="animate-on-scroll">
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #4A7C2E20, #2D501620)',
              padding: '5px 18px',
              borderRadius: 20,
              fontSize: 12,
              color: 'var(--green)',
              fontWeight: 600,
              letterSpacing: 2,
              marginBottom: 14,
            }}>OUR FARMER</div>
            <h2 style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 800,
              color: 'var(--green-deep)',
              lineHeight: 1.4,
              marginBottom: 16,
            }}>
              拉拉山雪霧鬧：<br />達利阿伯的鮮採承諾
            </h2>
            <p style={{
              fontSize: 15,
              color: 'var(--text-mid)',
              lineHeight: 1.9,
              marginBottom: 24,
            }}>
              來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園。每一顆水蜜桃，都是他親手摘下、嚴格挑選的驕傲。我們堅持產地直送，不經過層層盤商，將這份帶著晨露的新鮮與清甜，直接送到您的手中。
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
            }}>
              {[
                { num: '30+', label: '年種植經驗' },
                { num: '1,500m', label: '海拔高度' },
                { num: '48hr', label: '產地直送' },
              ].map((s, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  padding: '14px 0',
                  borderRadius: 14,
                  background: '#fff',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: 'var(--peach)',
                    marginBottom: 2,
                  }}>{s.num}</div>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--text-light)',
                    fontWeight: 500,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .story-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .story-grid img {
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  )
}
