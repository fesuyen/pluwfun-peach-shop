import React, { useState, useMemo, useEffect } from 'react';
// 請確認您已經按照前面的指引，在 frontend/src/ 資料夾下建立了包含金鑰的 firebase.js
import { db, rtdb } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';

// 產品與價格設定
const PRODUCTS = [
  { id: '6p', name: '6粒裝', price: 750, desc: '（已含原價+50元）' },
  { id: '8p', name: '8粒裝', price: 650, desc: '（已含原價+50元）' },
  { id: '10p', name: '10粒裝', price: 550, desc: '（已含原價+50元）' },
  { id: '12p', name: '12粒裝', price: 450, desc: '（已含原價+50元）' },
];

// 運費計算 (新竹冷藏物流)
const getShipping = (n) => {
  if (n <= 0) return 0;
  if (n <= 2) return 150;
  if (n <= 4) return 210;
  if (n <= 6) return 270;
  if (n <= 8) return 330;
  return Math.ceil(n / 8) * 330; // 超過8盒每8盒加收330
};

export default function OrderFlow() {
  const [cart, setCart] = useState({ '6p': 0, '8p': 0, '10p': 0, '12p': 0 });
  const [shipMode, setShipMode] = useState('single'); 
  const [deliveryDate, setDeliveryDate] = useState('');
  const [bankDigits, setBankDigits] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [note, setNote] = useState('');

  // 1. 初始化銀行資訊狀態 (避免卡在「讀取中」)
  const [bankInfo, setBankInfo] = useState({ 
    bank_name: '系統連線中...', bank_account: '請至後台設定...', bank_holder: '王小明' 
  });

  // 當購物車數量增減
  const updateCart = (id, change) => {
    setCart(prev => ({ ...prev, [id]: Math.max(0, prev[id] + change) }));
  };

  // 地址清單狀態
  const [dests, setDests] = useState([{ 
    id: Date.now(), name: '', tel: '', addr: '', alloc: { '6p': 0, '8p': 0, '10p': 0, '12p': 0 } 
  }]);

  // --- 連動與自動化邏輯 ---

  // 從雲端Realtime Database即時同步匯款資訊
  useEffect(() => {
    const bankRef = ref(rtdb, 'siteContent');
    return onValue(bankRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBankInfo(data);
      } else {
        // 如果資料庫沒資料，顯示提示
        setBankInfo({ bank_name: '尚未設定(請至後台編輯)', bank_account: '尚未設定', bank_holder: '管理員' });
      }
    });
  }, []);

  const totalInCart = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  
  // 計算已分配的總數
  const currentAllocatedTotal = useMemo(() => {
    return dests.reduce((sum, d) => sum + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0);
  }, [dests]);

  // UX魔法：自動同步數量
  useEffect(() => {
    if (shipMode === 'single' || (shipMode === 'multiple' && dests.length === 1)) {
      setDests(prev => [{ ...prev[0], alloc: { ...cart } }]);
    }
  }, [cart, shipMode]);

  const handleAddDest = () => {
    // UX魔法：自動填寫剩餘量
    const currentAlloc = {}; 
    PRODUCTS.forEach(p => { cur[p.id] = dests.reduce((s, d) => s + (d.alloc[p.id] || 0), 0); });
    const rem = {};
    PRODUCTS.forEach(p => { rem[p.id] = Math.max(0, cart[p.id] - currentAlloc[p.id]); });
    
    if (Object.values(rem).reduce((a, b) => a + b, 0) === 0) {
      alert("✅ 數量已分配完畢，不需要再新增地址囉！"); return;
    }

    setDests([...dests, { id: Date.now(), name: '', tel: '', addr: '', alloc: rem }]);
  };

  // --- 金額結算 ---
  const productTotal = PRODUCTS.reduce((s, p) => s + (p.price * cart[p.id]), 0);
  const shipTotal = shipMode === 'pickup' ? 0 : dests.reduce((s, d) => s + getShipping(Object.values(d.alloc).reduce((a, b) => a + b, 0)), 0);
  const grandTotal = productTotal + shipTotal + (isMember ? 1999 : 0);

  // --- 送出訂單至 Firestore 雲端 ---
  const handleSubmit = async () => {
    if (totalInCart === 0) { alert("請先選購商品數量！"); return; }
    if (shipMode !== 'pickup' && totalInCart !== currentAllocatedTotal) {
      alert(`分配盒數(${currentAllocatedTotal})與選購總量(${totalInCart})不符，請檢查！`);
      return;
    }
    if (shipMode !== 'pickup' && !deliveryDate) { alert("請選擇預定收貨日期"); return; }

    try {
      const orderData = {
        customerName: dests[0].name || "未填寫",
        tel: dests[0].tel || "未填寫",
        cart, dests, shipMode, deliveryDate, bankDigits, isMember, note,
        finalTotal: grandTotal,
        status: '待核帳', createdAt: serverTimestamp(), lastAdmin: '系統自動'
      };
      await addDoc(collection(db, "orders"), orderData);
      alert("🎉 訂單已成功傳送到雲端資料庫！請加入 LINE 完成核帳。");
      window.location.href = "https://lin.ee/RBc7waf"; 
    } catch (e) {
      console.error("錯誤:", e);
      alert("送出失敗，請檢查網路連線或 Firebase 設定！");
    }
  };

  // --- RWD Inline CSS 樣式定義 ---
  const containerStyle = { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px' };
  const cardS = { background:'#fff', padding:25, borderRadius:20, boxShadow:'0 5px 20px rgba(0,0,0,0.05)', position:'relative', marginBottom:'30px' };
  const titleStyle = { color:'#2D5016', borderLeft:'4px solid #E8836B', paddingLeft:12, marginBottom:20, fontSize:19, fontWeight:800 };
  const badge = { fontSize:12, color:'#999', fontWeight:400, display:'block' };
  const itemRow = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #f5f5f5' };
  const btnStyle = { width:30, height:30, cursor:'pointer', border:'1px solid #ddd', background:'#fff', borderRadius:5, color:'#E8836B', fontWeight:800 };
  const defB = { flex:1, padding:12, cursor:'pointer', background:'#fff', border:'1px solid #ddd', borderRadius:10, fontWeight:700, color:'#666', fontSize:15 };
  const actB = { ...defB, background:'#E8836B', color:'#fff', borderColor:'#E8836B' };
  const addrBox = { padding:20, border:'1px solid #eee', borderRadius:15, marginBottom:15, background:'#fafafa' };
  const inS = { width:'100%', padding:12, borderRadius:10, border:'1px solid #ddd', outline:'none', fontSize:15, marginBottom:10 };
  const sumRow = { display:'flex', justifyContent:'space-between', marginBottom:8, color:'#444', fontWeight:600 };
  const submitBtn = { width:'100%', padding:18, borderRadius:50, background:'linear-gradient(135deg, #E8836B, #D35C41)', color:'#fff', border:'none', fontSize:19, fontWeight:900, marginTop:20, cursor:'pointer', boxShadow:'0 5px 15px rgba(232, 131, 107, 0.4)' };

  return (
    <section id="order-section" style={{ padding: '60px 20px', background: '#FDFCFB' }}>
      <div style={containerStyle}>
        
        {/* ================= 左側：規格與資訊 ================= */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={cardS}>
            <h3 style={titleStyle}>🍑 規格與價格 <small style={badge}>※ 單價已含原價+50元</small></h3>
            {PRODUCTS.map(p => (
              <div key={p.id} style={itemRow}>
                <span style={{fontSize:16, fontWeight:700}}>{p.name} <b style={{color:'#E8836B'}}>NT${p.price}</b></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => updateCart(p.id, -1)} style={btnStyle}>-</button>
                  <b style={{width:25, textAlign:'center'}}>{cart[p.id]}</b>
                  <button onClick={() => updateCart(p.id, 1)} style={btnStyle}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardS, background: '#2D5016', color: '#fff' }}>
            <h3 style={{ color: '#fff', borderLeft: '4px solid #D4A843', paddingLeft: 12, marginBottom: 15 }}>💳 匯款帳戶資訊</h3>
            <div style={{ lineHeight: 2, fontSize: 15, opacity: 0.9 }}>
              銀行：{bankInfo.bank_name} ({bankInfo.bank_code})<br/>
              帳號：{bankInfo.bank_account}<br/>
              戶名：{bankInfo.bank_holder}
            </div>
            <p style={{ fontSize: 12, marginTop: 10, color: '#D4A843', opacity:0.8 }}>* 送出訂單後，請加入 LINE 傳送截圖或填寫末五碼。</p>
          </div>
        </div>

        {/* ================= 右側：配送與結帳 ================= */}
        <div style={cardS}>
          <h3 style={titleStyle}>📝 配送與結帳</h3>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button onClick={() => setShipMode('single')} style={shipMode==='single'?actB:defB}>單一宅配</button>
            <button onClick={() => setShipMode('multiple')} style={shipMode==='multiple'?actB:defB}>寄送多點</button>
            <button onClick={() => setShipMode('pickup')} style={shipMode==='pickup'?actB:defB}>現場自取</button>
          </div>

          {totalInCart === 0 ? (
            <div style={{textAlign:'center', padding:'50px 0', color:'#aaa'}}>請先於左側選購您想要的水蜜桃盒數 🍑</div>
          ) : (
            <>
              {shipMode === 'multiple' && (
                <div style={{ background: totalInCart === currentAllocatedTotal ? '#EBFBEE' : '#FFEBEB', color: totalInCart === currentAllocatedTotal ? '#27AE60' : '#E8836B', padding:10, borderRadius:8, fontWeight:700, textAlign:'center', marginBottom:15, fontSize:14 }}>
                  {totalInCart === currentAllocatedTotal ? `✅ 已全部分配完畢 (共 ${totalInCart} 盒)` : `⚠️ 尚有 ${totalInCart - currentAllocatedTotal} 盒未分配地址`}
                </div>
              )}

              {shipMode === 'pickup' ? (
                <div style={addrBox}>
                  <p style={{ fontWeight: 700, color: '#2D5016' }}>📍 自取地點：</p>
                  <p>桃園市復興區高義里雪霧鬧 7鄰7號</p>
                  <a href="https://maps.app.goo.gl/Rc9yKQNqfCyJo5mG8" target="_blank" rel="noreferrer" style={{ color: '#E8836B', textDecoration: 'underline', fontSize:14 }}>開啟 Google 地圖導航</a>
                </div>
              ) : (
                dests.map((d, i) => (
                  <div key={d.id} style={addrBox}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                      <b style={{color:'#2D5016'}}>🏠 收件地址 {i+1}</b>
                      <span style={{fontSize:12, color:'#E8836B'}}>本處：{Object.values(d.alloc).reduce((a, b) => a + b, 0)} 盒</span>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
                      <input placeholder="姓名 *" style={inS} value={d.name} onChange={e=>{const n=[...dests]; n[i].name=e.target.value; setDests(n);}} />
                      <input placeholder="電話 *" style={inS} value={d.tel} onChange={e=>{const n=[...dests]; n[i].tel=e.target.value; setDests(n);}} />
                    </div>
                    <input placeholder="完整地址 *" style={inS} value={d.addr} onChange={e=>{const n=[...dests]; n[i].addr=e.target.value; setDests(n);}} />
                    
                    {shipMode === 'multiple' && (
                      <div style={{display:'flex', flexWrap:'wrap', gap:10, borderTop:'1px solid #eee', marginTop:10, paddingTop:10}}>
                        {PRODUCTS.filter(p => cart[p.id]>0).map(p => (
                          <label key={p.id} style={{fontSize:13, color:'#555', fontWeight:600}}>{p.name}: 
                            <input type="number" value={d.alloc[p.id]} style={{width:35, textAlign:'center', marginLeft:5, border:'1px solid #ddd'}} onChange={e=>{
                              const n=[...dests]; n[i].alloc[p.id]=parseInt(e.target.value)||0; setDests(n);
                            }}/>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}

              {shipMode === 'multiple' && totalInCart > currentAllocatedTotal && (
                <button onClick={handleAddDest} style={{ width:'100%', padding:12, border:'2px dashed #E8836B', color:'#E8836B', background:'#FFF5F2', cursor:'pointer', borderRadius:10, fontWeight:700, marginBottom:20 }}>+ 新增下一個地址 (自動填寫剩餘量)</button>
              )}

              <hr style={{ border:'none', borderTop:'1px dashed #eee', margin:'30px 0' }}/>
              
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <label style={labelStyle}><small>🗓️</small> 預定收貨日期 *</label>
                <input type="date" style={inS} value={deliveryDate} onChange={e=>setDeliveryDate(e.target.value)} />
                <input placeholder="匯款帳號末五碼 (選填)" style={inS} value={bankDigits} onChange={e=>setBankDigits(e.target.value)} />
              </div>
              
              <div style={summaryBox}>
                <div style={sumRow}><span>商品小計</span><span>NT$ {productTotal}</span></div>
                <div style={sumRow}><span>低溫運費</span><span>NT$ {shipTotal}</span></div>
                <div style={{ ...sumRow, fontSize: 24, fontWeight: 900, color: '#E8836B', marginTop: 10, borderTop: '1px dashed #eee', paddingTop: 10 }}>
                  <span>應付總額</span><span>NT$ {grandTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={totalInCart===0 || (shipMode!=='pickup' && totalInCart!==currentAllocatedTotal)}
                style={submitBtn}
              >
                確認送出訂單 🍑
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// 樣式
const labelStyle = { fontSize:14, color:'#666', fontWeight:700 };
const summaryBox = { background: '#fff', padding: 20, borderRadius: 15, border: '1px solid #eee', marginTop:25 };
