import { useState } from 'react'

const benefits = [
  { icon: '⛺', text: '飛鼠不渴豪華帳篷平日 0 元入住券', detail: '價值 $3,600，保證兌換', highlight: true },
  { icon: '💰', text: '2,000 點飛鼠幣', detail: '可用於復興區 38 家合作店家' },
  { icon: '🍑', text: '五月桃 SSS 級優先預購權', detail: '搶先預購，保證有桃' },
  { icon: '🎁', text: '每購一盒桃子回饋 50 飛鼠幣', detail: '買越多省越多' },
  { icon: '⭐', text: '限量 200 位', detail: '額滿即止，手刀搶購' },
]

export default function Membership() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) { alert('請填寫姓名與電話'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setDone(true)
      } else {
        alert(data.error || '申請失敗')
      }
    } catch { alert('網路錯誤') }
    setSubmitting(false)
  }

  return (
    <section id="membership" style={{
      padding: '60px 0',
      background: 'linear-gradient(180deg, var(--cream) 0%, #F5F0E8 100%)',
    }}>
      <div className="container">
        {/* CTA Banner */}
        <div className="animate-on-scroll" style={{
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          marginBottom: 32,
        }}>
          <img src="/images/cta-membership.png" alt="會員方案 CTA" style={{
            width: '100%',
            display: 'block',
          }} />
        </div>

        {/* Benefits */}
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #D4A84320, #E8836B20)',
            padding: '6px 20px', borderRadius: 20, fontSize: 13,
            color: '#D4A843', fontWeight: 600, letterSpacing: 2, marginBottom: 16,
          }}>
            MEMBERSHIP
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
            color: 'var(--green-deep)', marginBottom: 12,
          }}>
            入會 $1,999 → 解鎖 $6,000 權益
          </h2>
          <p style={{ color: 'var(--text-mid)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
            超值回饋，限量 200 位，額滿即止
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}>
          {benefits.map((b, i) => (
            <div key={i} className="animate-on-scroll" style={{
              background: b.highlight ? 'linear-gradient(135deg, #E8836B, #C4604A)' : '#fff',
              borderRadius: 20,
              padding: '28px 24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              textAlign: 'center',
              transition: 'transform 0.3s',
              cursor: 'default',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{b.icon}</div>
              <div style={{
                fontSize: 16, fontWeight: 700, marginBottom: 6,
                color: b.highlight ? '#fff' : 'var(--text-dark)',
              }}>{b.text}</div>
              <div style={{
                fontSize: 13,
                color: b.highlight ? 'rgba(255,255,255,0.8)' : 'var(--text-light)',
              }}>{b.detail}</div>
            </div>
          ))}
        </div>

        {/* CTA / Form */}
        <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
          {done ? (
            <div style={{
              background: '#fff', borderRadius: 20, padding: '40px',
              maxWidth: 500, margin: '0 auto',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--green-deep)', marginBottom: 12 }}>
                會員申請已送出！
              </h3>
              <p style={{ color: 'var(--text-mid)' }}>我們將盡快與您聯繫，感謝您的支持！</p>
            </div>
          ) : !showForm ? (
            <button onClick={() => setShowForm(true)} style={{
              background: 'linear-gradient(135deg, #D4A843 0%, #B8922E 100%)',
              color: '#fff', border: 'none', padding: '20px 56px',
              borderRadius: 50, fontSize: 20, fontWeight: 700,
              letterSpacing: 2, cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(212, 168, 67, 0.4)',
              transition: 'all 0.3s',
              animation: 'pulse 2s infinite',
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.animation = 'none'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.animation = 'pulse 2s infinite'
            }}>
              立即加入會員 →
            </button>
          ) : (
            <form onSubmit={handleSubmit} style={{
              background: '#fff', borderRadius: 20, padding: 36,
              maxWidth: 500, margin: '0 auto',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
              textAlign: 'left',
            }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: 'var(--green-deep)', textAlign: 'center' }}>
                加入飛鼠會員
              </h3>
              {['name', 'phone', 'email'].map(field => (
                <div key={field} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#5A5A5A', marginBottom: 6 }}>
                    {field === 'name' ? '姓名 *' : field === 'phone' ? '電話 *' : 'Email'}
                  </label>
                  <input
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      border: '1.5px solid #E8E0D8', fontSize: 15, outline: 'none',
                      background: '#FEFCFA',
                    }}
                    value={form[field]}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={field === 'name' ? '請輸入姓名' : field === 'phone' ? '請輸入電話' : '請輸入 Email（選填）'}
                    required={field !== 'email'}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#5A5A5A', marginBottom: 6 }}>備註</label>
                <textarea
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1.5px solid #E8E0D8', fontSize: 15, outline: 'none',
                    background: '#FEFCFA', minHeight: 60, resize: 'vertical',
                  }}
                  value={form.note}
                  onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="有任何問題歡迎留言"
                />
              </div>
              <button type="submit" disabled={submitting} style={{
                width: '100%',
                background: submitting ? '#ccc' : 'linear-gradient(135deg, #D4A843 0%, #B8922E 100%)',
                color: '#fff', border: 'none', padding: '16px',
                borderRadius: 12, fontSize: 17, fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                letterSpacing: 1,
              }}>
                {submitting ? '送出中...' : '確認加入會員'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
