import { useState, useRef } from 'react'

const SPECS = [
  { label: '6粒裝 — NT$700', value: '6粒裝', price: 700 },
  { label: '8粒裝 — NT$600', value: '8粒裝', price: 600 },
  { label: '10粒裝 — NT$500', value: '10粒裝', price: 500 },
  { label: '12粒裝 — NT$400', value: '12粒裝', price: 400 },
]

const BOX_FEE = 50

function getShippingFee(qty) {
  if (qty <= 0) return 0
  if (qty <= 2) return 150
  if (qty <= 4) return 210
  if (qty <= 6) return 270
  return 330
}

const trustBadges = [
  { icon: '🚚', label: '產地直送保證', color: '#4A7C2E' },
  { icon: '❄️', label: '專業低溫宅配', color: '#5B8DD9' },
  { icon: '🛡️', label: '7天鑑賞期', color: '#D4A843' },
  { icon: '🔒', label: '安全付款', color: '#8B5E3C' },
]

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1.5px solid #E8E0D8',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.3s',
  background: '#FEFCFA',
  color: '#2C2C2C',
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#5A5A5A',
  marginBottom: 6,
}

export default function OrderSection() {
  const [form, setForm] = useState({
    name: '', phone: '', address: '', spec: '', quantity: 1,
    transfer_last5: '', note: '', payment_method: 'bank_transfer',
  })
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef()

  const selectedSpec = SPECS.find(s => s.value === form.spec)
  const unitPrice = selectedSpec ? selectedSpec.price : 0
  const subtotal = unitPrice * form.quantity
  const boxFee = form.quantity > 0 ? BOX_FEE * form.quantity : 0
  const shippingFee = getShippingFee(form.quantity)
  const total = subtotal + boxFee + shippingFee

  const handleChange = (field) => (e) => {
    let val = e.target.value
    if (field === 'quantity') {
      val = Math.max(1, Math.min(8, parseInt(val) || 1))
    }
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.spec) {
      alert('請填寫所有必填欄位')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('unit_price', unitPrice)
      fd.append('subtotal', subtotal)
      fd.append('box_fee', boxFee)
      fd.append('shipping_fee', shippingFee)
      fd.append('total', total)
      if (file) fd.append('payment_screenshot', file)

      const res = await fetch('/api/orders', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        setResult(data)
        setForm({ name: '', phone: '', address: '', spec: '', quantity: 1, transfer_last5: '', note: '', payment_method: 'bank_transfer' })
        setFile(null)
      } else {
        alert(data.error || '訂單送出失敗')
      }
    } catch (err) {
      alert('網路錯誤，請稍後再試')
    }
    setSubmitting(false)
  }

  if (result) {
    return (
      <section id="order" style={{ padding: '70px 0', background: 'linear-gradient(180deg, #F5F0E8 0%, var(--cream) 100%)' }}>
        <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: '48px 32px',
            boxShadow: '0 8px 36px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--green-deep)', marginBottom: 10 }}>
              訂單已成功送出！
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-mid)', marginBottom: 6 }}>
              訂單編號：<strong style={{ color: 'var(--peach)' }}>{result.order_number}</strong>
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 24 }}>
              我們將盡快確認您的訂單與付款資訊，感謝您的支持！
            </p>
            <button onClick={() => setResult(null)} style={{
              background: 'var(--peach)', color: '#fff', border: 'none',
              padding: '12px 32px', borderRadius: 28, fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>繼續選購</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="order" style={{
      padding: '60px 0',
      background: 'linear-gradient(180deg, #F5F0E8 0%, var(--cream) 100%)',
    }}>
      <div className="container">
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #E8836B20, #D4A84320)',
            padding: '5px 18px', borderRadius: 20, fontSize: 12,
            color: 'var(--peach-dark)', fontWeight: 600, letterSpacing: 2, marginBottom: 12,
          }}>ORDER NOW</div>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800,
            color: 'var(--green-deep)', marginBottom: 8,
          }}>立即訂購新鮮水蜜桃</h2>
          <p style={{ color: 'var(--text-mid)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
            現採現出，產地直送到您的餐桌
          </p>
        </div>

        {/* Trust badges */}
        <div className="animate-on-scroll" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}>
          {trustBadges.map((b, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: '#fff',
              borderRadius: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: `1px solid ${b.color}20`,
            }}>
              <span style={{ fontSize: 16 }}>{b.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: b.color }}>{b.label}</span>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 28,
          alignItems: 'start',
        }} className="order-grid">
          {/* Price table */}
          <div className="animate-on-scroll">
            <div style={{
              background: '#fff', borderRadius: 18, padding: 24,
              boxShadow: '0 3px 16px rgba(0,0,0,0.05)', marginBottom: 18,
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, color: 'var(--green-deep)' }}>
                🍑 規格與價格
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SPECS.map(s => (
                  <div key={s.value} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 16px', borderRadius: 10,
                    background: form.spec === s.value ? '#E8836B10' : '#F9F6F2',
                    border: form.spec === s.value ? '2px solid var(--peach)' : '2px solid transparent',
                    cursor: 'pointer', transition: 'all 0.3s',
                  }} onClick={() => setForm(prev => ({ ...prev, spec: s.value }))}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{s.value}</span>
                    <span style={{ fontWeight: 800, color: 'var(--peach)', fontSize: 18 }}>NT${s.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#fff', borderRadius: 18, padding: 24,
              boxShadow: '0 3px 16px rgba(0,0,0,0.05)', marginBottom: 18,
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, color: 'var(--green-deep)' }}>
                📦 運費說明
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 10 }}>
                一箱最多裝 8 盒，每盒包裝盒費 NT$50
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { range: '1-2 盒', fee: 'NT$150' },
                  { range: '3-4 盒', fee: 'NT$210' },
                  { range: '5-6 盒', fee: 'NT$270' },
                  { range: '7-8 盒', fee: 'NT$330' },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '7px 12px', borderRadius: 6,
                    background: i % 2 === 0 ? '#F9F6F2' : 'transparent',
                    fontSize: 13,
                  }}>
                    <span style={{ color: 'var(--text-mid)' }}>{r.range}</span>
                    <span style={{ fontWeight: 600 }}>{r.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div style={{
              background: '#fff', borderRadius: 18, padding: 24,
              boxShadow: '0 3px 16px rgba(0,0,0,0.05)', marginBottom: 18,
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, color: 'var(--green-deep)' }}>
                💳 付款方式
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  onClick={() => setForm(prev => ({ ...prev, payment_method: 'bank_transfer' }))}
                  style={{
                    padding: '12px 16px', borderRadius: 10,
                    border: form.payment_method === 'bank_transfer' ? '2px solid var(--green)' : '2px solid #E8E0D8',
                    background: form.payment_method === 'bank_transfer' ? '#4A7C2E08' : '#fff',
                    cursor: 'pointer', transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                  <span style={{ fontSize: 18 }}>🏦</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' }}>銀行轉帳</div>
                    <div style={{ fontSize: 11, color: 'var(--text-light)' }}>匯款後上傳截圖</div>
                  </div>
                  {form.payment_method === 'bank_transfer' && (
                    <span style={{ marginLeft: 'auto', color: 'var(--green)', fontWeight: 700 }}>✓</span>
                  )}
                </div>
                <div style={{
                  padding: '12px 16px', borderRadius: 10,
                  border: '2px solid #E8E0D8',
                  background: '#F5F5F5',
                  cursor: 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: 10,
                  opacity: 0.6,
                }}>
                  <span style={{ fontSize: 18 }}>💚</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-mid)' }}>LINE Pay</div>
                    <div style={{ fontSize: 11, color: 'var(--text-light)' }}>即將開放</div>
                  </div>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: 10,
                    background: '#D4A843',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: 8,
                    fontWeight: 600,
                  }}>COMING SOON</span>
                </div>
              </div>
            </div>

            {/* Bank info */}
            <div style={{
              background: 'linear-gradient(135deg, #2D5016, #4A7C2E)', borderRadius: 18, padding: 24,
              color: '#fff',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🏦 匯款資訊</h3>
              <div style={{ fontSize: 14, lineHeight: 1.9 }}>
                <div>銀行：XXX 銀行（代碼 XXX）</div>
                <div>帳號：XXXX-XXXX-XXXX-XXXX</div>
                <div>戶名：XXXXXXXXX</div>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 10 }}>
                匯款後請上傳截圖或填寫帳號末五碼以加速確認
              </p>
            </div>
          </div>

          {/* Order form */}
          <div className="animate-on-scroll">
            <form onSubmit={handleSubmit} style={{
              background: '#fff', borderRadius: 18, padding: 28,
              boxShadow: '0 6px 32px rgba(0,0,0,0.07)',
            }}>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 20, color: 'var(--green-deep)' }}>
                📝 訂購表單
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>姓名 *</label>
                  <input style={inputStyle} value={form.name} onChange={handleChange('name')} placeholder="請輸入收件人姓名" required
                    onFocus={e => e.target.style.borderColor = '#E8836B'}
                    onBlur={e => e.target.style.borderColor = '#E8E0D8'} />
                </div>
                <div>
                  <label style={labelStyle}>電話 *</label>
                  <input style={inputStyle} value={form.phone} onChange={handleChange('phone')} placeholder="請輸入聯絡電話" required
                    onFocus={e => e.target.style.borderColor = '#E8836B'}
                    onBlur={e => e.target.style.borderColor = '#E8E0D8'} />
                </div>
                <div>
                  <label style={labelStyle}>收件地址 *</label>
                  <input style={inputStyle} value={form.address} onChange={handleChange('address')} placeholder="請輸入完整收件地址" required
                    onFocus={e => e.target.style.borderColor = '#E8836B'}
                    onBlur={e => e.target.style.borderColor = '#E8E0D8'} />
                </div>
                <div>
                  <label style={labelStyle}>選擇規格 *</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.spec} onChange={handleChange('spec')} required
                    onFocus={e => e.target.style.borderColor = '#E8836B'}
                    onBlur={e => e.target.style.borderColor = '#E8E0D8'}>
                    <option value="">請選擇規格</option>
                    {SPECS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>數量（1-8盒）</label>
                  <input type="number" min="1" max="8" style={inputStyle} value={form.quantity} onChange={handleChange('quantity')}
                    onFocus={e => e.target.style.borderColor = '#E8836B'}
                    onBlur={e => e.target.style.borderColor = '#E8E0D8'} />
                </div>

                {/* Price calculation */}
                {form.spec && (
                  <div style={{
                    background: '#FFF8F0', borderRadius: 12, padding: 16,
                    border: '1px solid #F0D68A40',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: 'var(--text-mid)' }}>小計（{form.spec} × {form.quantity}）</span>
                      <span style={{ fontWeight: 600 }}>NT${subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: 'var(--text-mid)' }}>包裝盒費（{form.quantity} 盒 × $50）</span>
                      <span style={{ fontWeight: 600 }}>NT${boxFee.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                      <span style={{ color: 'var(--text-mid)' }}>運費</span>
                      <span style={{ fontWeight: 600 }}>NT${shippingFee.toLocaleString()}</span>
                    </div>
                    <div style={{
                      borderTop: '2px solid #E8836B30', paddingTop: 10,
                      display: 'flex', justifyContent: 'space-between',
                    }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-deep)' }}>總金額</span>
                      <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--peach)' }}>NT${total.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>上傳轉帳截圖</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: '2px dashed #E8E0D8', borderRadius: 10, padding: '18px 14px',
                      textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s',
                      background: file ? '#E8836B08' : '#FEFCFA',
                    }}>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => setFile(e.target.files[0])} />
                    {file ? (
                      <span style={{ color: 'var(--peach)', fontWeight: 600, fontSize: 13 }}>📎 {file.name}</span>
                    ) : (
                      <span style={{ color: 'var(--text-light)', fontSize: 13 }}>點擊上傳轉帳截圖（選填）</span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>轉帳帳號末五碼</label>
                  <input style={inputStyle} value={form.transfer_last5} onChange={handleChange('transfer_last5')}
                    placeholder="請輸入轉帳帳號末五碼（選填）" maxLength={5}
                    onFocus={e => e.target.style.borderColor = '#E8836B'}
                    onBlur={e => e.target.style.borderColor = '#E8E0D8'} />
                </div>

                <div>
                  <label style={labelStyle}>備註</label>
                  <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                    value={form.note} onChange={handleChange('note')}
                    placeholder="如需指定到貨日或其他需求，請在此註明"
                    onFocus={e => e.target.style.borderColor = '#E8836B'}
                    onBlur={e => e.target.style.borderColor = '#E8E0D8'} />
                </div>

                <button type="submit" disabled={submitting} style={{
                  background: submitting ? '#ccc' : 'linear-gradient(135deg, #E8836B 0%, #C4604A 100%)',
                  color: '#fff', border: 'none', padding: '16px',
                  borderRadius: 12, fontSize: 16, fontWeight: 700,
                  letterSpacing: 2, cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(232, 131, 107, 0.4)',
                  transition: 'all 0.3s',
                }}>
                  {submitting ? '送出中...' : '🍑 提交訂單'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .order-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
