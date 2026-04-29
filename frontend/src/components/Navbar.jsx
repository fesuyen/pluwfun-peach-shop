import { useState, useEffect } from 'react'

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    padding: '0 24px',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
  },
  logo: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: '2px',
    color: '#fff',
  },
  links: {
    display: 'flex',
    gap: 28,
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.3s',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  ctaBtn: {
    background: '#E8836B',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: 30,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  mobileBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 28,
    cursor: 'pointer',
  },
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  const navBg = scrolled
    ? 'rgba(45, 80, 22, 0.95)'
    : 'rgba(0,0,0,0.15)'

  return (
    <>
      <nav style={{ ...styles.nav, background: navBg, backdropFilter: scrolled ? 'blur(10px)' : 'none' }}>
        <div style={styles.inner}>
          <div style={styles.logo}>pluwfun</div>
          <div style={styles.links} className="nav-links">
            <button style={styles.link} onClick={() => scrollTo('features')}>產品特色</button>
            <button style={styles.link} onClick={() => scrollTo('story')}>農民故事</button>
            <button style={styles.link} onClick={() => scrollTo('order')}>立即訂購</button>
            <button style={styles.link} onClick={() => scrollTo('membership')}>會員方案</button>
            <button style={styles.link} onClick={() => scrollTo('faq')}>常見問題</button>
            <button style={styles.ctaBtn} onClick={() => scrollTo('order')}>立即選購</button>
          </div>
          <button style={styles.mobileBtn} className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="mobile-menu-overlay" style={{
          position: 'fixed', top: 70, left: 0, right: 0, bottom: 0,
          background: 'rgba(45, 80, 22, 0.97)', zIndex: 999,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 40, gap: 24, animation: 'fadeIn 0.3s ease',
        }}>
          {['features', 'story', 'order', 'membership', 'faq'].map((id, i) => {
            const labels = ['產品特色', '農民故事', '立即訂購', '會員方案', '常見問題']
            return (
              <button key={id} onClick={() => scrollTo(id)} style={{
                ...styles.link, fontSize: 20, padding: '12px 0',
              }}>{labels[i]}</button>
            )
          })}
          <button style={{ ...styles.ctaBtn, fontSize: 18, padding: '14px 40px', marginTop: 16 }} onClick={() => scrollTo('order')}>
            立即選購
          </button>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  )
}
