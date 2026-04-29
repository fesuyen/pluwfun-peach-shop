const features = [
  {
    icon: '🍑',
    title: '拉拉山雪霧鬧：達利阿伯的鮮採承諾',
    desc: '來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園。每一顆水蜜桃，都是他親手摘下、嚴格挑選的驕傲。我們堅持產地直送，不經過層層盤商，將這份帶著晨露的新鮮與清甜，直接送到您的手中。這不僅是拉拉山最道地的滋味，更是我們對品質最真誠的保證。',
    color: '#E8836B',
    image: '/images/feature_farmer.webp',
  },
  {
    icon: '🌿',
    title: '堅持「七分熟」職人採收標準，鎖住拉拉山最完美的鮮甜',
    desc: '品味 SSS 級五月桃，關鍵在於「採收時機」。我們堅持七分熟採收，確保宅配過程中果肉熟實不變色。若採收達八、九分熟，經過一天物流配送，極易軟爛甚至變質損壞。買桃再享點數折抵，把最安心的高品質帶回家！',
    color: '#4A7C2E',
    image: '/images/feature_7ripe.jpg',
  },
  {
    icon: '🎁',
    title: '超級規格任選，送禮自用的尊榮首選',
    desc: '提供 6、8、10、12 粒精選規格，每盒淨重足 2 斤 4 兩至 2 斤 6 兩，展現產地直送的誠信品質。不論尊榮送禮或自用皆宜，會員預購每盒可扣抵 50 飛鼠幣，讓這份來自拉拉山的鮮甜，成為您解鎖 38 家名店的消費燃料！',
    color: '#D4A843',
    image: '/images/feature_box.jpg',
  },
  {
    icon: '⛺',
    title: '1,999 元入會享六千回饋，保證解鎖豪華露營 0 元入住！',
    desc: '品嚐 SSS 級五月桃，入會享六千回饋：豪華露營平日 0 元住、二千元消費金通行 38 家名店。買桃每盒扣 50 元，假日入住折 399 元。限 200 名，即刻入會領取山林通行證！',
    color: '#8B5E3C',
    image: '/images/feature_camping.png',
  },
]

export default function Features() {
  return (
    <section id="features" style={{
      padding: '70px 0 60px',
      background: 'linear-gradient(180deg, var(--cream) 0%, #FFF 100%)',
    }}>
      <div className="container">
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #E8836B20, #D4A84320)',
            padding: '5px 18px', borderRadius: 20, fontSize: 12,
            color: 'var(--peach-dark)', fontWeight: 600, letterSpacing: 2, marginBottom: 12,
          }}>WHY CHOOSE US</div>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800,
            color: 'var(--green-deep)', marginBottom: 8,
          }}>四大理由，非買不可</h2>
          <p style={{ color: 'var(--text-mid)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
            從果園到餐桌，我們用心守護每一顆水蜜桃的品質
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
        }} className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="animate-on-scroll" style={{
              background: '#fff',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              transition: 'all 0.4s ease',
              cursor: 'default',
              border: '1px solid rgba(0,0,0,0.04)',
              transitionDelay: `${i * 0.08}s`,
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              {/* Image */}
              <div style={{
                width: '100%',
                height: 180,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <img src={f.image} alt={f.title} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.92)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                  {f.icon}
                </div>
              </div>
              {/* Content */}
              <div style={{ padding: '20px 22px 24px' }}>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: 10,
                  lineHeight: 1.5,
                }}>{f.title}</h3>
                <p style={{
                  fontSize: 13.5,
                  color: 'var(--text-mid)',
                  lineHeight: 1.8,
                }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  )
}
