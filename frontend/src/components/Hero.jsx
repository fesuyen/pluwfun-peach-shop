const Hero = () => {
  const scrollToOrder = () => {
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" style={{
      position: 'relative',
      height: '100vh',
      minHeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/images/hero-peach.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.7)',
      }} />
      
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(45,80,22,0.6) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: 900,
        animation: 'fadeInUp 1s ease-out',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(232, 131, 107, 0.9)',
          color: '#fff',
          padding: '8px 24px',
          borderRadius: 30,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 2,
          marginBottom: 24,
          backdropFilter: 'blur(10px)',
        }}>
          🍑 2026 限量預購中
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1.3,
          marginBottom: 20,
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          拉拉山五月桃
          <br />
          <span style={{ color: '#F0D68A' }}>SSS級生化甜度</span>產地直送
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          color: 'rgba(255,255,255,0.9)',
          fontWeight: 300,
          marginBottom: 40,
          lineHeight: 1.6,
          textShadow: '0 1px 10px rgba(0,0,0,0.3)',
        }}>
          飛鼠嚴選 · 雪霧鬧部落達利阿伯親手採收
        </p>

        <button onClick={scrollToOrder} style={{
          background: 'linear-gradient(135deg, #E8836B 0%, #C4604A 100%)',
          color: '#fff',
          border: 'none',
          padding: '18px 48px',
          borderRadius: 50,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 2,
          boxShadow: '0 8px 30px rgba(232, 131, 107, 0.5)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'translateY(-3px)'
          e.target.style.boxShadow = '0 12px 40px rgba(232, 131, 107, 0.6)'
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 8px 30px rgba(232, 131, 107, 0.5)'
        }}>
          立即選購 →
        </button>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 14,
          animation: 'pulse 2s infinite',
        }}>
          <div style={{ marginBottom: 8 }}>向下探索</div>
          <div style={{ fontSize: 24 }}>↓</div>
        </div>
      </div>
    </section>
  )
}

export default Hero
