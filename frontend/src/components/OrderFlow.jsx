import React, { useState, useMemo, useEffect } from 'react';
import { db, rtdb } from '../firebase'; 
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

  const totalAlloc = dests.reduce((s, d) => s + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0);
  const productTotal = PRODUCTS.reduce((s, p) => s + (p.price * cart[p.id]), 0);
  const shipTotal = shipMode === 'pickup' ? 0 : dests.reduce((s, d) => s + getShipping(Object.values(d.alloc).reduce((a, b) => a + b, 0)), 0);

  const handleSubmit = async () => {
    if (totalInCart === 0) return alert("請先選購商品數量！");
    if (shipMode !== 'pickup' && totalInCart !== totalAlloc) return alert("分配盒數不符");

    try {
      await addDoc(collection(db, "orders"), {
        customerName: dests[0].name, tel: dests[0].tel,
        cart, dests, shipMode, deliveryDate, bankDigits, isMember,
        finalTotal: productTotal + shipTotal + (isMember ? 1999 : 0),
        status: '待核帳', createdAt: serverTimestamp()
      });
      alert("🎉 訂單成功送出！");
      window.location.href = "https://lin.ee/RBc7waf";
    } catch (e) { alert("雲端連線失敗，請稍後再試！"); }
  };

  return (
    <section style={{ padding: '60px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
        <div>
          <div style={cardS}><h3 style={tlS}>🍑 規格選擇</h3>
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9f9f9' }}>
                <span style={{fontWeight:600}}>{p.name} <b style={{color:'#E8836B'}}>${p.price}</b></span>
                <div style={{display:'flex', alignItems:'center', background:'#F5F5F5', borderRadius:8}}>
                  <button onClick={() => setCart({...cart, [p.id]: Math.max(0, cart[p.id]-1)})} style={cntBtn}>-</button>
                  <span style={{padding:'0 15px', fontWeight:800}}>{cart[p.id]}</span>
                  <button onClick={() => setCart({...cart, [p.id]: cart[p.id]+1})} style={cntBtn}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{...cardS, background:'#2D5016', color:'#fff', marginTop:20}}>
            <h3 style={{color:'#fff', borderLeft:'4px solid #D4A843', paddingLeft:10}}>💳 匯款資訊</h3>
            <p style={{lineHeight:1.8}}>銀行：{bankInfo.bank_name}<br/>帳號：{bankInfo.bank_account}<br/>戶名：{bankInfo.bank_holder}</p>
          </div>
        </div>
        <div style={cardS}><h3 style={tlS}>📝 配送資訊</h3>
          <div style={{display:'flex', gap:10, marginBottom:20}}>
            <button onClick={()=>setShipMode('single')} style={shipMode==='single'?actB:defB}>單一</button>
            <button onClick={()=>setShipMode('multiple')} style={shipMode==='multiple'?actB:defB}>多點</button>
            <button onClick={()=>setShipMode('pickup')} style={shipMode==='pickup'?actB:defB}>自取</button>
          </div>
          {shipMode !== 'pickup' && dests.map((d, i) => (
            <div key={d.id} style={{border:'1px solid #eee', padding:15, borderRadius:12, marginBottom:15, background:'#FAFAFA'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                <span style={{fontWeight:800}}>📍 地址 {i+1}</span>
                <span style={{fontSize:12, color:'#E8836B'}}>本處：{Object.values(d.alloc).reduce((a,b)=>a+b,0)}盒</span>
              </div>
              <input placeholder="收件姓名" style={inS} value={d.name} onChange={e=>{const n=[...dests]; n[i].name=e.target.value; setDests(n);}} />
              <input placeholder="電話" style={inS} value={d.tel} onChange={e=>{const n=[...dests]; n[i].tel=e.target.value; setDests(n);}} />
              <input placeholder="收件地址" style={{...inS, width:'100%'}} value={d.addr} onChange={e=>{const n=[...dests]; n[i].addr=e.target.value; setDests(n);}} />
            </div>
          ))}
          <button onClick={handleSubmit} style={subBtn}>確認送出訂單 🍑</button>
        </div>
      </div>
    </section>
  );
}
const cardS = { background:'#fff', padding:25, borderRadius:20, boxShadow:'0 5px 20px rgba(0,0,0,0.05)' };
const tlS = { color:'#2D5016', borderLeft:'4px solid #E8836B', paddingLeft:12, marginBottom:20 };
const cntBtn = { padding:'8px 12px', border:'none', background:'none', cursor:'pointer', fontSize:18, fontWeight:800 };
const inS = { padding:10, borderRadius:8, border:'1px solid #ddd', marginBottom:8, marginRight:'2%', width:'48%' };
const defB = { flex:1, padding:10, borderRadius:8, border:'1px solid #ddd', background:'#fff', cursor:'pointer' };
const actB = { ...defB, background:'#E8836B', color:'#fff', borderColor:'#E8836B' };
const subBtn = { width:'100%', padding:18, background:'#E8836B', color:'#fff', border:'none', borderRadius:50, fontWeight:800, fontSize:18, cursor:'pointer', marginTop:20 };
