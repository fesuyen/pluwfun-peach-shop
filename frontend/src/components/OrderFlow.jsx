import React, { useState, useMemo } from 'react';

// 1. 規格與修正後的價格設定
const PRODUCTS = [
  { id: '6p', name: '6粒裝', price: 750 },
  { id: '8p', name: '8粒裝', price: 650 },
  { id: '10p', name: '10粒裝', price: 550 },
  { id: '12p', name: '12粒裝', price: 450 },
];

const MEMBER_FEE = 1999;

// 2. 運費引擎邏輯
const calcShipping = (count) => {
  if (count === 0) return 0;
  if (count <= 2) return 150;
  if (count <= 4) return 210;
  if (count <= 6) return 270;
  if (count <= 8) return 330;
  return Math.ceil(count / 8) * 330;
};

export default function OrderFlow() {
  const [cart, setCart] = useState({ '6p': 0, '8p': 0, '10p': 0, '12p': 0 });
  const [isMember, setIsMember] = useState(false);
  const [shipMode, setShipMode] = useState('single'); // single, multiple, pickup
  const [destinations, setDestinations] = useState([
    { id: Date.now(), receiver: '', tel: '', addr: '', alloc: { '6p': 0, '8p': 0, '10p': 0, '12p': 0 } }
  ]);

  // 計算邏輯
  const totalOrdered = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const totalAllocated = useMemo(() => destinations.reduce((sum, d) => sum + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0), [destinations]);
  const productSubtotal = useMemo(() => PRODUCTS.reduce((sum, p) => sum + (p.price * cart[p.id]), 0), [cart]);
  const totalShipping = useMemo(() => shipMode === 'pickup' ? 0 : destinations.reduce((sum, d) => sum + calcShipping(Object.values(d.alloc).reduce((a, b) => a + b, 0)), 0), [destinations, shipMode]);
  const finalTotal = productSubtotal + totalShipping + (isMember ? MEMBER_FEE : 0);

  return (
    <section id="order-section" style={{ padding: '80px 20px', backgroundColor: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>
        
        {/* 左側：規格選購與運費說明 */}
        <div>
          <div style={cardStyle}>
            <h3 style={titleStyle}>🍑 規格與價格</h3>
            {PRODUCTS.map(p => (
              <div key={p.id} style={itemRow}>
                <span>{p.name} <b style={{color: '#E8836B'}}>NT${p.price}</b></span>
                <div style={counterStyle}>
                  <button onClick={() => setCart({...cart, [p.id]: Math.max(0, cart[p.id]-1)})} style={btnStyle}>-</button>
                  <span style={{width: 30, textAlign: 'center', fontWeight: 700}}>{cart[p.id]}</span>
                  <button onClick={() => setCart({...cart, [p.id]: cart[p.id]+1})} style={btnStyle}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>📦 運費說明</h3>
            <p style={{fontSize: 14, color: '#666', lineHeight: 1.8}}>
              一箱最多裝 8 盒。依據各配送地址箱數獨立計算：<br/>
              1-2 盒: $150 | 3-4 盒: $210 | 5-6 盒: $270 | 7-8 盒: $330
            </p>
          </div>
        </div>

        {/* 右側：配送分配與結帳 */}
        <div>
          <div style={cardStyle}>
            <h3 style={titleStyle}>📝 配送地址分配</h3>
            <div style={{display: 'flex', gap: 10, marginBottom: 20}}>
              <button onClick={() => setShipMode('single')} style={shipMode==='single'?actBtn:defBtn}>單一地址</button>
              <button onClick={() => setShipMode('multiple')} style={shipMode==='multiple'?actBtn:defBtn}>多點地址</button>
              <button onClick={() => setShipMode('pickup')} style={shipMode==='pickup'?actBtn:defBtn}>自取</button>
            </div>

            {shipMode !== 'pickup' && (
              <>
                <div style={{fontSize: 13, marginBottom: 15, color: totalOrdered === totalAllocated ? '#27AE60' : '#E8836B', fontWeight: 700}}>
                  分配進度：預訂 {totalOrdered} 盒 / 已分配 {totalAllocated} 盒
                </div>
                {destinations.map((dest, idx) => (
                  <div key={dest.id} style={addressBox}>
                    <input type="text" placeholder="收件人姓名" style={inputStyle} />
                    <input type="text" placeholder="收件電話" style={inputStyle} />
                    <input type="text" placeholder="完整收件地址" style={{...inputStyle, width: '100%'}} />
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10}}>
                      {PRODUCTS.filter(p => cart[p.id] > 0).map(p => (
                        <div key={p.id} style={{fontSize: 12}}>
                          {p.name}: <input type="number" style={{width: 45}} onChange={(e) => {
                            const newDests = [...destinations];
                            newDests[idx].alloc[p.id] = parseInt(e.target.value) || 0;
                            setDestinations(newDests);
                          }} /> 盒
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {shipMode === 'multiple' && (
                  <button onClick={() => setDestinations([...destinations, {id: Date.now(), alloc: {'6p':0,'8p':0,'10p':0,'12p':0}}])} style={addBtn}>+ 增加下一個地址</button>
                )}
              </>
            )}
          </div>

          <div style={{...cardStyle, background: '#2D5016', color: '#fff'}}>
            <h3 style={{color: '#fff', fontSize: 20, marginBottom: 20}}>💰 應付總額</h3>
            <div style={priceRow}><span>規格小計</span><span>NT$ {productSubtotal}</span></div>
            <div style={priceRow}><span>運費加總</span><span>NT$ {totalShipping}</span></div>
            <div style={priceRow}>
              <label><input type="checkbox" checked={isMember} onChange={()=>setIsMember(!isMember)} /> 加入會員 1999</label>
              <span>NT$ {isMember ? 1999 : 0}</span>
            </div>
            <div style={{...priceRow, fontSize: 24, fontWeight: 900, marginTop: 15, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 15}}>
              <span>總計</span><span>NT$ {finalTotal}</span>
            </div>
            <p style={{fontSize: 11, marginTop: 15, opacity: 0.8}}>
              ⚠️ 配送日期無法 100% 保證，將依據當天採收數量決定，請見諒。
            </p>
            <button disabled={totalOrdered === 0 || (shipMode !== 'pickup' && totalOrdered !== totalAllocated)} style={submitBtn}>
              {totalOrdered === totalAllocated || shipMode === 'pickup' ? '確認送出訂單' : '請先完成數量分配'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// 樣式
const cardStyle = { background: '#fff', padding: 25, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: 20 };
const titleStyle = { color: '#2D5016', fontSize: 18, fontWeight: 800, marginBottom: 20, borderLeft: '4px solid #E8836B', paddingLeft: 12 };
const itemRow = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5' };
const counterStyle = { display: 'flex', alignItems: 'center', gap: 10 };
const btnStyle = { width: 30, height: 30, borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' };
const inputStyle = { padding: '10px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 8, marginRight: 8, fontSize: 13 };
const defBtn = { flex: 1, padding: 10, borderRadius: 10, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 12 };
const actBtn = { ...defBtn, background: '#E8836B', color: '#fff', borderColor: '#E8836B' };
const addressBox = { padding: 15, border: '1px solid #eee', borderRadius: 12, marginBottom: 15 };
const addBtn = { background: 'none', border: '1px dashed #E8836B', color: '#E8836B', padding: '10px', borderRadius: 10, cursor: 'pointer', width: '100%' };
const priceRow = { display: 'flex', justifyContent: 'space-between', marginBottom: 10 };
const submitBtn = { width: '100%', padding: 18, borderRadius: 50, border: 'none', background: '#E8836B', color: '#fff', fontSize: 18, fontWeight: 800, marginTop: 20, cursor: 'pointer' };
