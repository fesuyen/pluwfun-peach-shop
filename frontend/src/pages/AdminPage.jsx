import { useState, useEffect, useRef, useCallback } from 'react'

const API = '/api/admin'

// ===== Styles =====
const colors = {
  primary: '#2D5016',
  primaryLight: '#4A7C2E',
  peach: '#E8836B',
  gold: '#D4A843',
  bg: '#F5F3EF',
  card: '#FFFFFF',
  text: '#2C2C2C',
  textMid: '#5A5A5A',
  textLight: '#8A8A8A',
  border: '#E8E0D8',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
}

const cardStyle = {
  background: colors.card,
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
}

const btnStyle = {
  padding: '10px 20px',
  borderRadius: 10,
  border: 'none',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: `1.5px solid ${colors.border}`,
  fontSize: 14,
  outline: 'none',
  background: '#FEFCFA',
  boxSizing: 'border-box',
}

const textareaStyle = {
  ...inputStyle,
  minHeight: 80,
  resize: 'vertical',
  fontFamily: 'inherit',
}

// ===== Login =====
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('admin_token', data.token)
        onLogin(data.token)
      } else {
        setErr('密碼錯誤')
      }
    } catch {
      setErr('連線失敗')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: colors.bg,
    }}>
      <form onSubmit={handleLogin} style={{
        ...cardStyle, width: 380, textAlign: 'center', padding: 40,
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🍑</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.primary, marginBottom: 8 }}>
          pluwfun 後台管理
        </h2>
        <p style={{ fontSize: 14, color: colors.textLight, marginBottom: 24 }}>請輸入管理密碼</p>
        {err && <div style={{ color: '#e53935', fontSize: 14, marginBottom: 12 }}>{err}</div>}
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr('') }}
          placeholder="請輸入密碼"
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 12,
            border: `1.5px solid ${colors.border}`, fontSize: 15, outline: 'none',
            marginBottom: 16, background: '#FEFCFA',
          }}
        />
        <button type="submit" style={{
          ...btnStyle, width: '100%', padding: '14px',
          background: colors.primary, color: '#fff', fontSize: 16,
        }}>
          登入
        </button>
      </form>
    </div>
  )
}

// ===== Notification Toast =====
function NotificationToast({ notifications, onDismiss }) {
  if (!notifications.length) return null
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      maxWidth: 380,
    }}>
      {notifications.map((n, i) => (
        <div key={n.id || i} style={{
          background: 'linear-gradient(135deg, #E8836B, #C4604A)',
          color: '#fff', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(232, 131, 107, 0.4)',
          animation: 'fadeInUp 0.4s ease-out',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>🔔</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>新訂單通知</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              {n.order_number} — {n.name} 訂購 {n.spec} × {n.quantity}
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
              金額 NT${n.total?.toLocaleString()}
            </div>
          </div>
          <button onClick={() => onDismiss(n.id || i)} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            borderRadius: 6, width: 24, height: 24, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, flexShrink: 0,
          }}>×</button>
        </div>
      ))}
    </div>
  )
}

// ===== Dashboard =====
function Dashboard({ token, stats }) {
  if (!stats) return <div style={{ padding: 40, textAlign: 'center', color: colors.textLight }}>載入中...</div>

  const statCards = [
    { label: '今日訂單', value: stats.todayOrders, icon: '📋', color: colors.peach },
    { label: '總營收', value: `$${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: colors.gold },
    { label: '待處理訂單', value: stats.pendingOrders, icon: '⏳', color: colors.warning },
    { label: '總訂單數', value: stats.totalOrders, icon: '📦', color: colors.info },
    { label: '會員數', value: stats.totalMembers, icon: '👥', color: colors.success },
  ]

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: colors.primary }}>儀表板</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            ...cardStyle, textAlign: 'center', padding: '24px 16px',
            borderTop: `4px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.text, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: colors.textLight, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== Orders =====
function Orders({ token }) {
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setOrders(d); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [token])

  const updateStatus = async (id, field, value) => {
    await fetch(`${API}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: value }),
    })
    fetchOrders()
    if (selected?.id === id) {
      setSelected(prev => ({ ...prev, [field]: value }))
    }
  }

  const statusColors = {
    '待確認': '#FF9800', '已確認': '#2196F3', '已出貨': '#9C27B0',
    '已完成': '#4CAF50', '待出貨': '#FF9800',
  }

  const StatusBadge = ({ status }) => (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      background: `${statusColors[status] || '#999'}18`,
      color: statusColors[status] || '#999',
    }}>
      {status}
    </span>
  )

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>載入中...</div>

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{
          ...btnStyle, background: '#f0f0f0', color: colors.text, marginBottom: 20,
        }}>
          ← 返回列表
        </button>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>
              訂單 {selected.order_number}
            </h3>
            <StatusBadge status={selected.order_status} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              ['姓名', selected.name], ['電話', selected.phone],
              ['地址', selected.address], ['規格', selected.spec],
              ['數量', `${selected.quantity} 盒`], ['小計', `NT$${selected.subtotal}`],
              ['包裝盒費', `NT$${selected.box_fee}`], ['運費', `NT$${selected.shipping_fee}`],
              ['總金額', `NT$${selected.total}`], ['下單時間', selected.created_at],
              ['轉帳末五碼', selected.transfer_last5 || '未填寫'], ['備註', selected.note || '無'],
            ].map(([label, val], i) => (
              <div key={i}>
                <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{val}</div>
              </div>
            ))}
          </div>

          {selected.payment_screenshot && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 8 }}>付款截圖</div>
              <img src={`/uploads/${selected.payment_screenshot}`} alt="付款截圖" style={{
                maxWidth: 300, borderRadius: 12, border: `1px solid ${colors.border}`,
              }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: 12, color: colors.textLight, display: 'block', marginBottom: 4 }}>訂單狀態</label>
              <select value={selected.order_status} onChange={e => updateStatus(selected.id, 'order_status', e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 14 }}>
                {['待確認', '已確認', '已出貨', '已完成'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textLight, display: 'block', marginBottom: 4 }}>付款狀態</label>
              <select value={selected.payment_status} onChange={e => updateStatus(selected.id, 'payment_status', e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 14 }}>
                {['待確認', '已確認'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textLight, display: 'block', marginBottom: 4 }}>出貨狀態</label>
              <select value={selected.shipping_status} onChange={e => updateStatus(selected.id, 'shipping_status', e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 14 }}>
                {['待出貨', '已出貨', '已送達'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: colors.primary }}>訂單管理</h2>
      {orders.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: 60, color: colors.textLight }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <div>尚無訂單</div>
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F9F6F2' }}>
                {['訂單編號', '日期', '姓名', '電話', '規格', '數量', '金額', '訂單狀態', '付款', '出貨', '操作'].map(h => (
                  <th key={h} style={{
                    padding: '14px 12px', textAlign: 'left', fontWeight: 600,
                    color: colors.textMid, borderBottom: `1px solid ${colors.border}`,
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: colors.primary }}>{o.order_number}</td>
                  <td style={{ padding: '12px', color: colors.textLight, whiteSpace: 'nowrap' }}>{o.created_at?.slice(0, 10)}</td>
                  <td style={{ padding: '12px' }}>{o.name}</td>
                  <td style={{ padding: '12px', color: colors.textMid }}>{o.phone}</td>
                  <td style={{ padding: '12px' }}>{o.spec}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{o.quantity}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: colors.peach }}>NT${o.total}</td>
                  <td style={{ padding: '12px' }}><StatusBadge status={o.order_status} /></td>
                  <td style={{ padding: '12px' }}><StatusBadge status={o.payment_status} /></td>
                  <td style={{ padding: '12px' }}><StatusBadge status={o.shipping_status} /></td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => setSelected(o)} style={{
                      ...btnStyle, padding: '6px 14px', fontSize: 13,
                      background: `${colors.primary}12`, color: colors.primary,
                    }}>查看</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ===== Members =====
function Members({ token }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/members`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setMembers(d); setLoading(false) }).catch(() => setLoading(false))
  }, [token])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>載入中...</div>

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: colors.primary }}>會員列表</h2>
      {members.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: 60, color: colors.textLight }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <div>尚無會員</div>
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F9F6F2' }}>
                {['#', '加入日期', '姓名', '電話', 'Email', '備註'].map(h => (
                  <th key={h} style={{
                    padding: '14px 12px', textAlign: 'left', fontWeight: 600,
                    color: colors.textMid, borderBottom: `1px solid ${colors.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '12px', color: colors.textLight }}>{i + 1}</td>
                  <td style={{ padding: '12px', color: colors.textLight }}>{m.created_at?.slice(0, 10)}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: '12px', color: colors.textMid }}>{m.phone}</td>
                  <td style={{ padding: '12px', color: colors.textMid }}>{m.email || '-'}</td>
                  <td style={{ padding: '12px', color: colors.textLight }}>{m.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ===== Content Management =====
function ContentManager({ token }) {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const fileInputRef = useRef(null)
  const [uploadingKey, setUploadingKey] = useState(null)

  useEffect(() => {
    fetch(`${API}/content`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        const flat = {}
        Object.entries(d).forEach(([k, v]) => { flat[k] = v.value || v })
        setContent(flat)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token])

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      alert('儲存失敗')
    }
    setSaving(false)
  }

  const handleImageUpload = async (key) => {
    setUploadingKey(key)
    fileInputRef.current?.click()
  }

  const onFileSelected = async (e) => {
    const file = e.target.files[0]
    if (!file || !uploadingKey) return
    const fd = new FormData()
    fd.append('image', file)
    fd.append('key', uploadingKey)
    try {
      const res = await fetch(`${API}/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        handleChange(uploadingKey, data.url)
        alert('圖片上傳成功！')
      }
    } catch {
      alert('圖片上傳失敗')
    }
    setUploadingKey(null)
    e.target.value = ''
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>載入中...</div>

  const sections = [
    { id: 'hero', label: 'Hero 首圖', icon: '🖼️' },
    { id: 'features', label: '產品特色', icon: '⭐' },
    { id: 'farmer', label: '農民故事', icon: '👨‍🌾' },
    { id: 'product', label: '產品摘要', icon: '📝' },
    { id: 'faq', label: '常見問題', icon: '❓' },
  ]

  const Field = ({ label, fieldKey, multiline = false }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 6 }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          style={textareaStyle}
          value={content[fieldKey] || ''}
          onChange={e => handleChange(fieldKey, e.target.value)}
          rows={4}
        />
      ) : (
        <input
          style={inputStyle}
          value={content[fieldKey] || ''}
          onChange={e => handleChange(fieldKey, e.target.value)}
        />
      )}
    </div>
  )

  const ImageField = ({ label, fieldKey }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {content[fieldKey] && (
          <img src={content[fieldKey]} alt="" style={{
            width: 80, height: 60, objectFit: 'cover', borderRadius: 8,
            border: `1px solid ${colors.border}`,
          }} />
        )}
        <button onClick={() => handleImageUpload(fieldKey)} style={{
          ...btnStyle, background: `${colors.primary}12`, color: colors.primary,
        }}>
          {content[fieldKey] ? '更換圖片' : '上傳圖片'}
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>內容管理</h2>
        <button onClick={handleSave} disabled={saving} style={{
          ...btnStyle,
          background: saved ? colors.success : saving ? '#ccc' : colors.primary,
          color: '#fff', padding: '12px 28px', fontSize: 15,
        }}>
          {saved ? '✓ 已儲存' : saving ? '儲存中...' : '💾 儲存所有變更'}
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileSelected} />

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            ...btnStyle,
            background: activeSection === s.id ? colors.primary : '#fff',
            color: activeSection === s.id ? '#fff' : colors.text,
            border: `1px solid ${activeSection === s.id ? colors.primary : colors.border}`,
            padding: '10px 18px',
          }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div style={cardStyle}>
        {activeSection === 'hero' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 20 }}>Hero 首圖區設定</h3>
            <Field label="徽章文字" fieldKey="hero_badge" />
            <Field label="主標題" fieldKey="hero_title" />
            <Field label="主標題高亮文字" fieldKey="hero_title_highlight" />
            <Field label="主標題後綴" fieldKey="hero_title_suffix" />
            <Field label="副標題" fieldKey="hero_subtitle" />
            <ImageField label="Hero 背景圖片" fieldKey="hero_bg_image" />
          </div>
        )}

        {activeSection === 'features' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 20 }}>產品特色設定</h3>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{
                padding: 20, marginBottom: 16, borderRadius: 12,
                background: '#F9F6F2', border: `1px solid ${colors.border}`,
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.peach, marginBottom: 12 }}>
                  特色 {n}
                </div>
                <Field label="標題" fieldKey={`feature${n}_title`} />
                <Field label="描述" fieldKey={`feature${n}_desc`} multiline />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'farmer' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 20 }}>農民故事設定</h3>
            <Field label="標題" fieldKey="farmer_title" />
            <Field label="故事內容" fieldKey="farmer_story" multiline />
            <ImageField label="農民照片" fieldKey="farmer_image" />
          </div>
        )}

        {activeSection === 'product' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 20 }}>產品摘要設定</h3>
            <Field label="產品短摘要" fieldKey="product_short_summary" multiline />
            <Field label="產品長摘要" fieldKey="product_long_summary" multiline />
            <Field label="為何選擇我們" fieldKey="product_why_choose" multiline />
          </div>
        )}

        {activeSection === 'faq' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 20 }}>常見問題設定</h3>
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} style={{
                padding: 20, marginBottom: 16, borderRadius: 12,
                background: '#F9F6F2', border: `1px solid ${colors.border}`,
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.gold, marginBottom: 12 }}>
                  FAQ {n}
                </div>
                <Field label="問題" fieldKey={`faq${n}_q`} />
                <Field label="回答" fieldKey={`faq${n}_a`} multiline />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <button onClick={handleSave} disabled={saving} style={{
          ...btnStyle,
          background: saved ? colors.success : saving ? '#ccc' : colors.primary,
          color: '#fff', padding: '12px 28px', fontSize: 15,
        }}>
          {saved ? '✓ 已儲存' : saving ? '儲存中...' : '💾 儲存所有變更'}
        </button>
      </div>
    </div>
  )
}

// ===== System Settings =====
function SystemSettings({ token }) {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`${API}/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setSettings(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      alert('儲存失敗')
    }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>載入中...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>系統設定</h2>
        <button onClick={handleSave} disabled={saving} style={{
          ...btnStyle,
          background: saved ? colors.success : saving ? '#ccc' : colors.primary,
          color: '#fff', padding: '12px 28px', fontSize: 15,
        }}>
          {saved ? '✓ 已儲存' : saving ? '儲存中...' : '💾 儲存設定'}
        </button>
      </div>

      {/* LINE Pay */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>💳</span>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 2 }}>LINE Pay 設定</h3>
            <p style={{ fontSize: 13, color: colors.textLight }}>串接 LINE Pay 金流服務</p>
          </div>
        </div>

        <div style={{
          background: '#FFF8F0', borderRadius: 12, padding: 16, marginBottom: 20,
          border: '1px solid #F0D68A40',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.gold, marginBottom: 8 }}>💡 如何取得 LINE Pay API 金鑰</div>
          <ol style={{ fontSize: 13, color: colors.textMid, lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
            <li>前往 <a href="https://pay.line.me/tw/developers/main/main" target="_blank" rel="noopener" style={{ color: colors.primaryLight, fontWeight: 600 }}>LINE Pay 開發者平台</a></li>
            <li>建立或登入您的商家帳號</li>
            <li>在「管理付款連結」中取得 Channel ID 與 Channel Secret Key</li>
            <li>將取得的金鑰填入下方欄位即可啟用</li>
          </ol>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 6 }}>
              Channel ID
            </label>
            <input
              style={inputStyle}
              value={settings.linepay_channel_id || ''}
              onChange={e => handleChange('linepay_channel_id', e.target.value)}
              placeholder="請輸入 LINE Pay Channel ID"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 6 }}>
              Channel Secret Key
            </label>
            <input
              style={inputStyle}
              type="password"
              value={settings.linepay_channel_secret || ''}
              onChange={e => handleChange('linepay_channel_secret', e.target.value)}
              placeholder="請輸入 Channel Secret Key"
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMid }}>啟用 LINE Pay</label>
          <button
            onClick={() => handleChange('linepay_enabled', settings.linepay_enabled === 'true' ? 'false' : 'true')}
            style={{
              width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
              background: settings.linepay_enabled === 'true' ? colors.success : '#ccc',
              position: 'relative', transition: 'background 0.3s',
            }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3,
              left: settings.linepay_enabled === 'true' ? 25 : 3,
              transition: 'left 0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
          <span style={{ fontSize: 12, color: settings.linepay_enabled === 'true' ? colors.success : colors.textLight }}>
            {settings.linepay_enabled === 'true' ? '已啟用' : '未啟用'}
          </span>
        </div>
      </div>

      {/* LINE Official Account */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>💬</span>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 2 }}>LINE 官方帳號設定</h3>
            <p style={{ fontSize: 13, color: colors.textLight }}>串接 LINE 官方帳號推播通知</p>
          </div>
        </div>

        <div style={{
          background: '#F0F7FF', borderRadius: 12, padding: 16, marginBottom: 20,
          border: '1px solid #2196F320',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.info, marginBottom: 8 }}>💡 如何取得 LINE Channel Access Token</div>
          <ol style={{ fontSize: 13, color: colors.textMid, lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
            <li>前往 <a href="https://developers.line.biz/console/" target="_blank" rel="noopener" style={{ color: colors.info, fontWeight: 600 }}>LINE Developers Console</a></li>
            <li>選擇您的 Messaging API Channel</li>
            <li>在「Messaging API」頁籤中發行 Channel Access Token</li>
            <li>將 Token 填入下方欄位，新訂單時將自動發送 LINE 通知</li>
          </ol>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 6 }}>
            Channel Access Token
          </label>
          <input
            style={inputStyle}
            type="password"
            value={settings.line_channel_access_token || ''}
            onChange={e => handleChange('line_channel_access_token', e.target.value)}
            placeholder="請輸入 Channel Access Token"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMid }}>啟用 LINE 通知</label>
          <button
            onClick={() => handleChange('line_notify_enabled', settings.line_notify_enabled === 'true' ? 'false' : 'true')}
            style={{
              width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
              background: settings.line_notify_enabled === 'true' ? colors.success : '#ccc',
              position: 'relative', transition: 'background 0.3s',
            }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3,
              left: settings.line_notify_enabled === 'true' ? 25 : 3,
              transition: 'left 0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
          <span style={{ fontSize: 12, color: settings.line_notify_enabled === 'true' ? colors.success : colors.textLight }}>
            {settings.line_notify_enabled === 'true' ? '已啟用' : '未啟用'}
          </span>
        </div>
      </div>

      {/* API Status */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 16 }}>🔌 API 狀態</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { name: 'LINE Pay 金流', enabled: settings.linepay_enabled === 'true' && settings.linepay_channel_id },
            { name: 'LINE 推播通知', enabled: settings.line_notify_enabled === 'true' && settings.line_channel_access_token },
            { name: 'AI 自動回覆', enabled: false },
            { name: 'LINE Pay 自動對帳', enabled: false },
          ].map((api, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 10,
              background: api.enabled ? '#4CAF5008' : '#F5F5F5',
              border: `1px solid ${api.enabled ? '#4CAF5030' : '#E0E0E0'}`,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: api.enabled ? '#4CAF50' : '#ccc',
              }} />
              <span style={{ fontSize: 14, color: colors.text }}>{api.name}</span>
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                color: api.enabled ? '#4CAF50' : colors.textLight,
              }}>
                {api.enabled ? '已連接' : '未連接'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <button onClick={handleSave} disabled={saving} style={{
          ...btnStyle,
          background: saved ? colors.success : saving ? '#ccc' : colors.primary,
          color: '#fff', padding: '12px 28px', fontSize: 15,
        }}>
          {saved ? '✓ 已儲存' : saving ? '儲存中...' : '💾 儲存設定'}
        </button>
      </div>
    </div>
  )
}

// ===== Main Admin =====
export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [tab, setTab] = useState('dashboard')
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState(null)
  const lastPollTime = useRef(new Date().toISOString())
  const pollIntervalRef = useRef(null)

  // Fetch stats
  const fetchStats = useCallback(() => {
    if (!token) return
    fetch(`${API}/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) { setToken(''); localStorage.removeItem('admin_token'); return null }
        return r.json()
      })
      .then(d => { if (d) setStats(d) })
      .catch(() => {})
  }, [token])

  // Poll for new orders
  const pollNewOrders = useCallback(() => {
    if (!token) return
    fetch(`${API}/poll?since=${encodeURIComponent(lastPollTime.current)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.newOrders && data.newOrders.length > 0) {
          // Add notifications
          const newNotifs = data.newOrders.map(o => ({
            ...o,
            id: o.id + '_' + Date.now(),
          }))
          setNotifications(prev => [...newNotifs, ...prev].slice(0, 5))

          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            data.newOrders.forEach(o => {
              new Notification('🍑 pluwfun 新訂單', {
                body: `${o.order_number} — ${o.name} 訂購 ${o.spec} × ${o.quantity}，金額 NT$${o.total}`,
                icon: '/favicon.svg',
              })
            })
          }

          // Refresh stats
          fetchStats()
        }
        if (data.serverTime) {
          lastPollTime.current = data.serverTime
        }
        // Update pending count in stats
        if (data.pendingCount !== undefined && stats) {
          setStats(prev => prev ? { ...prev, pendingOrders: data.pendingCount } : prev)
        }
      })
      .catch(() => {})
  }, [token, fetchStats, stats])

  // Verify token & fetch initial stats
  useEffect(() => {
    if (token) {
      fetchStats()
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [token, fetchStats])

  // Start polling every 10 seconds
  useEffect(() => {
    if (!token) return
    pollIntervalRef.current = setInterval(pollNewOrders, 10000)
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [token, pollNewOrders])

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => (n.id || '') !== id))
  }

  if (!token) return <LoginScreen onLogin={setToken} />

  const tabs = [
    { id: 'dashboard', label: '儀表板', icon: '📊' },
    { id: 'orders', label: '訂單管理', icon: '📋' },
    { id: 'members', label: '會員列表', icon: '👥' },
    { id: 'content', label: '內容管理', icon: '✏️' },
    { id: 'settings', label: '系統設定', icon: '⚙️' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg }}>
      {/* Notification toasts */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />

      {/* Sidebar */}
      <aside style={{
        width: 240, background: colors.primary, color: '#fff',
        padding: '24px 0', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
      }} className="admin-sidebar">
        <div style={{ padding: '0 20px', marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>pluwfun</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>後台管理系統</div>
        </div>
        <nav style={{ flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 20px', border: 'none', cursor: 'pointer',
              background: tab === t.id ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: '#fff', fontSize: 15, fontWeight: tab === t.id ? 600 : 400,
              textAlign: 'left', transition: 'all 0.2s',
              borderLeft: tab === t.id ? '3px solid #F0D68A' : '3px solid transparent',
              position: 'relative',
            }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.id === 'orders' && stats?.pendingOrders > 0 && (
                <span style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: colors.peach, color: '#fff', borderRadius: 10,
                  padding: '2px 8px', fontSize: 11, fontWeight: 700,
                  minWidth: 20, textAlign: 'center',
                }}>
                  {stats.pendingOrders}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding: '0 20px' }}>
          <button onClick={() => { setToken(''); localStorage.removeItem('admin_token') }} style={{
            width: '100%', padding: '12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer',
          }}>
            登出
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {tab === 'dashboard' && <Dashboard token={token} stats={stats} />}
        {tab === 'orders' && <Orders token={token} />}
        {tab === 'members' && <Members token={token} />}
        {tab === 'content' && <ContentManager token={token} />}
        {tab === 'settings' && <SystemSettings token={token} />}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 60px !important;
          }
          .admin-sidebar span:last-child {
            display: none;
          }
          .admin-sidebar > div:first-child > div:last-child {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
