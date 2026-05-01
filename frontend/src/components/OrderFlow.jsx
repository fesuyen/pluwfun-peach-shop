import React, { useState, useMemo, useEffect } from 'react';
import { db, rtdb } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';

// 1. 產品定義
const PRODUCTS = [
  { id: '6p', name: '6粒裝', price: 750 },
  { id: '8p', name: '8粒裝', price: 650 },
  { id: '10p', name: '10粒裝', price: 550 },
  { id: '12p', name: '12粒裝', price: 450 },
];

// 2. 運費算法
const getShipping = (n) => {
  if (n <= 0) return 0;
  if (n <= 2) return 150;
  if (n <= 4) return 210;
  if (n <= 6) return 270;
  if (n <= 8) return 330;
  return Math.ceil(n / 8) * 330;
};

export default function OrderFlow() {
  const [cart, setCart] = useState({ '6p': 0, '8p': 0, '10p': 0, '12p': 0 });
  const [shipMode, setShipMode] = useState('single'); 
  const [deliveryDate, setDeliveryDate] = useState('');
  const [bankDigits, setBankDigits] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [bankInfo, setBankInfo] = useState({ bank_name: '讀取中...', bank_account: '', bank_holder: '' });
  
  // 地址分配狀態
  const [dests, setDests] = useState([{ 
    id: Date.now(), name: '', tel: '', addr: '', alloc: { '6p': 0, '8p': 0, '10p': 0, '12p': 0 } 
  }]);

  // 3. 雲端同步：自動讀取後台設定的銀行資訊
  useEffect(() => {
    const bankRef = ref(rtdb, 'siteContent');
    return onValue(bankRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setBankInfo(data);
    });
  }, []);

  // 4. 自動化邏輯：計算總盒數與剩餘量
  const totalInCart = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const totalAlloc = useMemo(() => dests.reduce((s, d) => s + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0), [dests]);

  // 當購物車改變時，若為單一地址，自動同步
  useEffect(() => {
    if (shipMode === 'single' || (shipMode === 'multiple' && dests.length === 1)) {
      setDests(prev => [{ ...prev[0], alloc: { ...cart } }]);
    }
  }, [cart, shipMode]);

  const handleAddDest = () => {
    const curAlloc = {};
    PRODUCTS.forEach(p => { curAlloc[p.id] = dests.reduce((s, d) => s + (d.alloc[p.id] || 0), 0); });
    const rem = {};
    PRODUCTS.forEach(p => { rem[p.id] = Math.max(0, cart[p.id] - curAlloc[p.id]); });
    setDests([...dests, { id: Date.now(), name: '', tel: '', addr: '', alloc: rem }]);
  };

  const productTotal = PRODUCTS.reduce((s, p) => s + (p.price * cart[p.id]), 0);
  const shipTotal = shipMode === 'pickup' ? 0 : dests.reduce((s, d) => s + getShipping(Object.values(d.alloc).reduce((a, b) => a + b, 0)), 0);
  const grandTotal = productTotal + shipTotal + (isMember ? 1999 : 0);

  // 5. 提交訂單至雲端
  const handleSubmit = async () => {
    if (totalInCart === 0) return alert("請先選擇購買數量");
    if (shipMode !== 'pickup' && totalInCart !== totalAlloc) return alert("分配數量與總數不符");

    try {
      await addDoc(collection(db, "orders"), {
        customerName: dests[0].name, tel: dests[0].tel,
        cart, dests, shipMode, deliveryDate, bankDigits, isMember,
        finalTotal: grandTotal, status: '待核帳', createdAt: serverTimestamp()
      });
      alert("🎉 訂單成功送出！");
      window.location.href = "https://lin.ee/RBc7waf";
    } catch (e) { alert("雲端連線失敗，請稍後再試"); }
  };

  // --- 樣式設定 (Inline CSS 確保 RWD) ---
  const cardS = { background:'#fff', padding:'25px', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.05)', marginBottom:'20px' };
  const titleS = { color:'#2D5016', borderLeft:'5px solid #E8836B', paddingLeft:'15px', marginBottom:'20px', fontSize:'20px', fontWeight:'800' };
  const inputS = { width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #ddd', marginBottom:'10px', outline:'none' };
  const btnS = { padding:'10px 15px', border:'none', borderRadius:'8px', background:'#E8836B', color:'#fff', fontWeight:'700', cursor:'pointer' };

  return (
    <section style={{ padding: '60px 20px', background: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        
        {/* 左側：規格選擇 */}
        <div>
          <div style={cardS}>
            <h3 style={titleS}>🍑 產品規格 (已含運費加成)</h3>
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontWeight: '700' }}>{p.name} <b style={{ color: '#E8836B' }}>${p.price}</b></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0f0f0', borderRadius: '10px', padding: '5px' }}>
                  <button onClick={() => setCart({ ...cart, [p.id]: Math.max(0, cart[p.id] - 1) })} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: '900' }}>-</button>
                  <span style={{ width: '20px', textAlign: 'center', fontWeight: '800' }}>{cart[p.id]}</span>
                  <button onClick={() => setCart({ ...cart, [p.id]: cart[p.id] + 1 })} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: '900' }}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardS, background: '#2D5016', color: '#fff' }}>
            <h3 style={{ ...titleS, color: '#fff', borderLeftColor: '#D4A843' }}>💳 匯款資訊</h3>
            <p style={{ lineHeight: '1.8' }}>
              銀行：{bankInfo.bank_name}<br />
              帳號：{bankInfo.bank_account}<br />
              戶名：{bankInfo.bank_holder}
            </p>
          </div>
        </div>

        {/* 右側：配送表單 */}
        <div style={cardS}>
          <h3 style={titleS}>📝 配送與結帳</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => setShipMode('single')} style={{ ...btnS, background: shipMode === 'single' ? '#E8836B' : '#eee', color: shipMode === 'single' ? '#fff' : '#666', flex: 1 }}>單一宅配</button>
            <button onClick={() => setShipMode('multiple')} style={{ ...btnS, background: shipMode === 'multiple' ? '#E8836B' : '#eee', color: shipMode === 'multiple' ? '#fff' : '#666', flex: 1 }}>多點配送</button>
            <button onClick={() => setShipMode('pickup')} style={{ ...btnS, background: shipMode === 'pickup' ? '#E8836B' : '#eee', color: shipMode === 'pickup' ? '#fff' : '#666', flex: 1 }}>現場自取</button>
          </div>

          {shipMode === 'pickup' ? (
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '15px' }}>
              <p>📍 自取：桃園市復興區高義里雪霧鬧 7鄰7號</p>
              <a href="https://maps.app.goo.gl/Rc9yKQNqfCyJo5mG8" target="_blank" style={{ color: '#E8836B' }}>導航至農場</a>
            </div>
          ) : (
            dests.map((d, i) => (
              <div key={d.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '15px', marginBottom: '15px', background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '800' }}>🏠 地址 {i + 1}</span>
                  <span style={{ color: '#E8836B', fontSize: '13px' }}>本處: {Object.values(d.alloc).reduce((a, b) => a + b, 0)} 盒</span>
                </div>
                <input placeholder="收件姓名" style={inputS} value={d.name} onChange={e => { const n = [...dests]; n[i].name = e.target.value; setDests(n); }} />
                <input placeholder="電話" style={inputS} value={d.tel} onChange={e => { const n = [...dests]; n[i].tel = e.target.value; setDests(n); }} />
                <input placeholder="收件地址" style={inputS} value={d.addr} onChange={e => { const n = [...dests]; n[i].addr = e.target.value; setDests(n); }} />
                {shipMode === 'multiple' && (
                  <div style={{ fontSize: '12px', marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {PRODUCTS.filter(p => cart[p.id] > 0).map(p => (
                      <label key={p.id}>{p.name}: <input type="number" value={d.alloc[p.id]} style={{ width: '40px' }} onChange={e => { const n = [...dests]; n[i].alloc[p.id] = parseInt(e.target.value) || 0; setDests(n); }} /></label>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {shipMode === 'multiple' && totalInCart > totalAlloc && (
            <button onClick={handleAddDest} style={{ width: '100%', padding: '10px', border: '2px dashed #E8836B', color: '#E8836B', background: 'none', borderRadius: '10px', cursor: 'pointer', marginBottom: '20px' }}>+ 新增配送地址 (自動帶入剩餘數)</button>
          )}

          <div style={{ background: '#eee', padding: '15px', borderRadius: '15px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span>商品合計</span><span>${productTotal}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span>運費</span><span>${shipTotal}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '20px', fontWeight: '900', color: '#E8836B' }}><span>應付總額</span><span>${grandTotal}</span></div>
          </div>

          <button onClick={handleSubmit} style={{ width: '100%', padding: '18px', background: '#E8836B', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: '800', marginTop: '20px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(232,131,107,0.3)' }}>確認送出訂單 🍑</button>
        </div>
      </div>
    </section>
  );
}
