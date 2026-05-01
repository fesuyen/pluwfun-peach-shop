import React, { useState, useMemo, useEffect } from 'react';
import { db, rtdb } from '../firebase'; // 連向您的雲端鑰匙
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';

const PRODUCTS = [
  { id: '6p', name: '6粒裝', price: 750 },
  { id: '8p', name: '8粒裝', price: 650 },
  { id: '10p', name: '10粒裝', price: 550 },
  { id: '12p', name: '12粒裝', price: 450 },
];

const getShipping = (n) => {
  if (n <= 0) return 0;
  if (n <= 2) return 150; if (n <= 4) return 210;
  if (n <= 6) return 270; if (n <= 8) return 330;
  return Math.ceil(n / 8) * 330;
};

export default function OrderFlow() {
  const [cart, setCart] = useState({ '6p': 0, '8p': 0, '10p': 0, '12p': 0 });
  const [shipMode, setShipMode] = useState('single'); 
  const [deliveryDate, setDeliveryDate] = useState('');
  const [bankDigits, setBankDigits] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [bankInfo, setBankInfo] = useState({ bank_name: '讀取中...', bank_account: '', bank_holder: '' });
  const [dests, setDests] = useState([{ id: Date.now(), name: '', tel: '', addr: '', alloc: { '6p': 0, '8p': 0, '10p': 0, '12p': 0 } }]);

  // 1. 即時讀取雲端銀行資訊
  useEffect(() => {
    const bankRef = ref(rtdb, 'siteContent');
    return onValue(bankRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setBankInfo(data);
    });
  }, []);

  const totalInCart = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  useEffect(() => {
    if (shipMode === 'single' || (shipMode === 'multiple' && dests.length === 1)) {
      setDests(prev => [{ ...prev[0], alloc: { ...cart } }]);
    }
  }, [cart, shipMode]);

  const getAddrSummary = (i) => ({
    thisAddrTotal: Object.values(dests[i].alloc).reduce((a, b) => a + b, 0),
    cumulativeTotal: dests.slice(0, i + 1).reduce((s, d) => s + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0)
  });

  const handleAddDest = () => {
    const cur = {}; 
    PRODUCTS.forEach(p => { cur[p.id] = dests.reduce((s, d) => s + (d.alloc[p.id] || 0), 0); });
    const rem = {};
    PRODUCTS.forEach(p => { rem[p.id] = Math.max(0, cart[p.id] - cur[p.id]); });
    setDests([...dests, { id: Date.now(), name: '', tel: '', addr: '', alloc: rem }]);
  };

  const productTotal = PRODUCTS.reduce((s, p) => s + (p.price * cart[p.id]), 0);
  const totalAlloc = dests.reduce((s, d) => s + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0);
  const shipTotal = shipMode === 'pickup' ? 0 : dests.reduce((s, d) => s + getShipping(Object.values(d.alloc).reduce((a, b) => a + b, 0)), 0);

  // 2. 核心送出功能
  const handleSubmit = async () => {
    if (totalInCart === 0) return alert("請選擇數量");
    if (shipMode !== 'pickup' && totalInCart !== totalAlloc) return alert("分配數量不符");

    try {
      const orderData = {
        customerName: dests[0].name, tel: dests[0].tel,
        cart, dests, shipMode, deliveryDate, bankDigits, isMember,
        finalTotal: productTotal + shipTotal + (isMember ? 1999 : 0),
        status: '待核帳', createdAt: serverTimestamp()
      };
      await addDoc(collection(db, "orders"), orderData);
      alert("🎉 訂單已送出！");
      window.location.href = "https://lin.ee/RBc7waf";
    } catch (e) { alert("雲端連線失敗，請稍後再試"); }
  };

  return (
    <section style={{ padding: '60px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        <div>
          <div style={cardS}><h3 style={tlS}>🍑 規格</h3>
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>{p.name} <b>${p.price}</b></span>
                <div>
                  <button onClick={() => setCart({...cart, [p.id]: Math.max(0, cart[p.id]-1)})}>-</button>
                  <span style={{margin:'0 10px'}}>{cart[p.id]}</span>
                  <button onClick={() => setCart({...cart, [p.id]: cart[p.id]+1})}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{...cardS, background:'#2D5016', color:'#fff', marginTop:20}}>
            <h3 style={{color:'#fff'}}>💳 匯款資訊</h3>
            <p>銀行：{bankInfo.bank_name}<br/>帳號：{bankInfo.bank_account}<br/>戶名：{bankInfo.bank_holder}</p>
          </div>
        </div>
        <div style={cardS}><h3 style={tlS}>📝 配送</h3>
          <div style={{display:'flex', gap:10, marginBottom:15}}>
            <button onClick={()=>setShipMode('single')}>單一</button>
            <button onClick={()=>setShipMode('multiple')}>多點</button>
            <button onClick={()=>setShipMode('pickup')}>自取</button>
          </div>
          {shipMode !== 'pickup' && dests.map((d, i) => (
            <div key={d.id} style={{border:'1px solid #eee', padding:10, marginBottom:10}}>
              <span>地址 {i+1} (本處:{getAddrSummary(i).thisAddrTotal}盒)</span>
              <input placeholder="姓名" style={{width:'100%'}} value={d.name} onChange={e=>{const n=[...dests]; n[i].name=e.target.value; setDests(n);}} />
              <input placeholder="地址" style={{width:'100%'}} value={d.addr} onChange={e=>{const n=[...dests]; n[i].addr=e.target.value; setDests(n);}} />
            </div>
          ))}
          <button onClick={handleSubmit} style={{width:'100%', padding:15, background:'#E8836B', color:'#fff', border:'none', borderRadius:50, fontWeight:800, fontSize:18, cursor:'pointer'}}>確認送出訂單 🍑</button>
        </div>
      </div>
    </section>
  );
}
const cardS = { background:'#fff', padding:20, borderRadius:15, boxShadow:'0 5px 15px rgba(0,0,0,0.05)' };
const tlS = { borderLeft:'4px solid #E8836B', paddingLeft:10 };
