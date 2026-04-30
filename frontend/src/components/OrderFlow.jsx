import React, { useState, useMemo, useEffect } from 'react';
import { db, rtdb } from '../firebase'; // 確保路徑正確指向您的 firebase 設定檔
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
  const [bankInfo, setBankInfo] = useState({ bank_name: '載入中...', bank_code: '', bank_account: '', bank_holder: '' });
  const [dests, setDests] = useState([{ id: Date.now(), name: '', tel: '', addr: '', alloc: { '6p': 0, '8p': 0, '10p': 0, '12p': 0 } }]);

  // 1. 取得雲端即時匯款資訊 (Realtime Database)
  useEffect(() => {
    const bankRef = ref(rtdb, 'siteContent');
    onValue(bankRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBankInfo({
          bank_name: data.bank_name || 'XXX銀行',
          bank_code: data.bank_code || '000',
          bank_account: data.bank_account || 'XXXX-XXXX-XXXX',
          bank_holder: data.bank_holder || '達利阿伯'
        });
      }
    });
  }, []);

  const totalInCart = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  // 2. 自動分配邏輯：切換模式或購物車改變時，自動更新地址 1
  useEffect(() => {
    if (shipMode === 'single' || (shipMode === 'multiple' && dests.length === 1)) {
      setDests(prev => [{ ...prev[0], alloc: { ...cart } }]);
    }
  }, [cart, shipMode]);

  // 3. 計算每個地址的總數與累計總數
  const getAddrSummary = (index) => {
    const thisAddrTotal = Object.values(dests[index].alloc).reduce((a, b) => a + b, 0);
    const cumulativeTotal = dests.slice(0, index + 1).reduce((sum, d) => sum + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0);
    return { thisAddrTotal, cumulativeTotal };
  };

  const totalAllocatedCount = useMemo(() => {
    return dests.reduce((sum, d) => sum + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0);
  }, [dests]);

  // 4. 增加地址並自動填寫剩餘量
  const handleAddDest = () => {
    const currentAlloc = {};
    PRODUCTS.forEach(p => {
      currentAlloc[p.id] = dests.reduce((sum, d) => sum + (d.alloc[p.id] || 0), 0);
    });
    
    const remainder = {};
    PRODUCTS.forEach(p => {
      remainder[p.id] = Math.max(0, cart[p.id] - currentAlloc[p.id]);
    });

    setDests([...dests, { id: Date.now(), name: '', tel: '', addr: '', alloc: remainder }]);
  };

  const productTotal = PRODUCTS.reduce((s, p) => s + (p.price * cart[p.id]), 0);
  const shipTotal = shipMode === 'pickup' ? 0 : dests.reduce((s, d) => s + getShipping(Object.values(d.alloc).reduce((a, b) => a + b, 0)), 0);
  const grandTotal = productTotal + shipTotal + (isMember ? 1999 : 0);

  // 5. 送出訂單至 Firestore 雲端
  const handleSubmit = async () => {
    if (shipMode !== 'pickup' && totalInCart !== totalAllocatedCount) {
      alert(`分配盒數 (${totalAllocatedCount}) 與訂購盒數 (${totalInCart}) 不符，請確認後再送出！`);
      return;
    }

    const orderData = {
      customerName: dests[0].name || "未填寫",
      cart,
      dests,
      shipMode,
      deliveryDate,
      bankDigits,
      isMember,
      finalTotal: grandTotal,
      status: '待核帳',
      createdAt: serverTimestamp(),
      lastAdmin: '系統自動'
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      alert("🎉 訂單已成功送出！請加入 LINE 官方帳號以便對帳。");
      window.location.href = "https://lin.ee/RBc7waf"; 
    } catch (e) {
      console.error("訂單送出失敗", e);
      alert("連線失敗，請檢查網路後再試。");
    }
  };

  return (
    <section id="order-section" style={{ padding: '60px 20px', background: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ color: '#2D5016', fontSize: 32, fontWeight: 800 }}>立即訂購新鮮水蜜桃</h2>
          <p style={{ color: '#666' }}>現採現出，產地直送到您的餐桌</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 15, marginTop: 20 }}>
            <span style={badgeStyle}>🚚 產地直送保證</span>
            <span style={badgeStyle}>❄️ 新竹冷藏物流</span>
            <span style={badgeStyle}>🛡️ 7天鑑賞期</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 30 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={cardStyle}>
              <h3 style={titleStyle}>🍑 規格與價格 (已加50元)</h3>
              {PRODUCTS.map(p => (
                <div key={p.id} style={itemRow}>
                  <span>{p.name} <b style={{color:'#E8836B'}}>NT${p.price}</b></span>
                  <div style={counterStyle}>
                    <button onClick={() => setCart({...cart, [p.id]: Math.max(0, cart[p.id]-1)})} style={btnStyle}>-</button>
                    <b style={{width:30, textAlign:'center'}}>{cart[p.id]}</b>
                    <button onClick={() => setCart({...cart, [p.id]: cart[p.id]+1})} style={btnStyle}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle, background: '#2D5016', color: '#fff' }}>
              <h3 style={{ color: '#fff', borderLeft: '4px solid #D4A843', paddingLeft: 12, marginBottom: 15 }}>💳 匯款帳戶資訊</h3>
              <div style={{ lineHeight: 2, fontSize: 15 }}>
                銀行：{bankInfo.bank_name} ({bankInfo.bank_code})<br/>
                帳號：{bankInfo.bank_account}<br/>
                戶名：{bankInfo.bank_holder}
              </div>
              <p style={{ fontSize: 12, marginTop: 10, color: '#D4A843' }}>* 送出訂單後，填寫末五碼或加入 LINE 傳送截圖即可。</p>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>📝 配送與結帳</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button onClick={() => setShipMode('single')} style={shipMode==='single'?actS:defS}>單一宅配</button>
              <button onClick={() => setShipMode('multiple')} style={shipMode==='multiple'?actS:defS}>多點宅配</button>
              <button onClick={() => setShipMode('pickup')} style={shipMode==='pickup'?actS:defS}>現場自取</button>
            </div>

            {shipMode === 'pickup' ? (
              <div style={addrBox}>
                <p style={{ fontWeight: 700, color: '#2D5016' }}>📍 自取地點：</p>
                <p>桃園市復興區高義里雪霧鬧 7鄰7號</p>
                <a href="https://maps.app.goo.gl/Rc9yKQNqfCyJo5mG8" target="_blank" rel="noreferrer" style={{ color: '#E8836B', textDecoration: 'underline' }}>開啟 Google 地圖導航</a>
              </div>
            ) : (
              dests.map((d, i) => {
                const { thisAddrTotal, cumulativeTotal } = getAddrSummary(i);
                return (
                  <div key={d.id} style={addrBox}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontWeight: 800 }}>📍 收件處 {i+1}</span>
                      <span style={{ fontSize: 12, color: '#E8836B', fontWeight: 700 }}>
                        本處：{thisAddrTotal} 盒 {shipMode === 'multiple' && `(累計：${cumulativeTotal} 盒)`}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <input placeholder="收件姓名" style={inS} value={d.name} onChange={e=>{const n=[...dests]; n[i].name=e.target.value; setDests(n);}} />
                      <input placeholder="電話" style={inS} value={d.tel} onChange={e=>{const n=[...dests]; n[i].tel=e.target.value; setDests(n);}} />
                    </div>
                    <input placeholder="完整地址" style={{ ...inS, width: '100%', marginBottom: 15 }} value={d.addr} onChange={e=>{const n=[...dests]; n[i].addr=e.target.value; setDests(n);}} />
                    
                    {shipMode === 'multiple' && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
                        {PRODUCTS.filter(p => cart[p.id] > 0).map(p => (
                          <label key={p.id} style={{ fontSize: 13, fontWeight: 600 }}>{p.name}: 
                            <input type="number" value={d.alloc[p.id]} style={{ width: 40, marginLeft: 5, border: '1px solid #ddd' }} onChange={e=>{
                              const n=[...dests]; n[i].alloc[p.id] = parseInt(e.target.value)||0; setDests(n);
                            }} />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {shipMode === 'multiple' && totalInCart > totalAllocatedCount && (
              <button onClick={handleAddDest} style={addBtn}>+ 增加下一個地址 (自動填寫剩餘量)</button>
            )}

            <div style={{ marginTop: 25 }}>
              <label style={labelS}>🗓️ 預定收貨日期</label>
              <input type="date" style={{ ...inS, width: '100%', marginBottom: 15 }} value={deliveryDate} onChange={e=>setDeliveryDate(e.target.value)} />
              
              <label style={labelS}>💳 轉帳帳號末五碼</label>
              <input placeholder="五位數字 (選填)" style={{ ...inS, width: '100%', marginBottom: 15 }} value={bankDigits} onChange={e=>setBankDigits(e.target.value)} />
              
              <label style={memberBox}>
                <input type="checkbox" checked={isMember} onChange={()=>setIsMember(!isMember)} style={{ width: 18, height: 18 }} /> 
                <span>加入會員 $1,999 (核發 2000 飛鼠幣)</span>
              </label>

              <div style={summaryBox}>
                <div style={sumRow}><span>商品小計</span><span>NT$ {productTotal}</span></div>
                <div style={sumRow}><span>運費總計</span><span>NT$ {shipTotal}</span></div>
                {isMember && <div style={sumRow}><span>會員費</span><span>NT$ 1,999</span></div>}
                <div style={{ ...sumRow, fontSize: 24, fontWeight: 900, color: '#E8836B', marginTop: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
                  <span>應付總額</span><span>NT$ {grandTotal}</span>
                </div>
              </div>

              {/* 按鈕邏輯：沒選購或分配不均時禁用 */}
              <button 
                onClick={handleSubmit}
                disabled={totalInCart === 0 || (shipMode !== 'pickup' && totalInCart !== totalAllocatedCount)} 
                style={ (totalInCart > 0 && (shipMode === 'pickup' || totalInCart === totalAllocatedCount)) ? submitBtn : disabledBtn}
              >
                {totalInCart === 0 ? "請先選擇規格與數量" : 
                 (shipMode !== 'pickup' && totalInCart !== totalAllocatedCount) ? `尚有 ${totalInCart - totalAllocatedCount} 盒未分配` : 
                 "確認送出訂單 🍑"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 樣式
const badgeStyle = { background: '#fff', padding: '8px 15px', borderRadius: 20, fontSize: 13, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontWeight: 700 };
const cardStyle = { background: '#fff', padding: 25, borderRadius: 20, boxShadow: '0 5px 20px rgba(0,0,0,0.05)' };
const titleStyle = { color: '#2D5016', borderLeft: '4px solid #E8836B', paddingLeft: 12, marginBottom: 20, fontSize: 18, fontWeight: 800 };
const itemRow = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5' };
const counterStyle = { display: 'flex', alignItems: 'center', gap: 10 };
const btnStyle = { width: 30, height: 30, cursor: 'pointer', border: '1px solid #ddd', background: '#fff', borderRadius: 5, fontWeight: 'bold' };
const inS = { padding: 12, borderRadius: 10, border: '1px solid #ddd', fontSize: 15, outline: 'none' };
const addrBox = { padding: 15, border: '1px solid #eee', borderRadius: 12, marginBottom: 15, background: '#fafafa' };
const defS = { flex: 1, padding: 12, cursor: 'pointer', background: '#fff', border: '1px solid #ddd', borderRadius: 10, fontWeight: 700, color: '#666' };
const actS = { ...defS, background: '#E8836B', color: '#fff', borderColor: '#E8836B' };
const addBtn = { width: '100%', padding: 12, border: '2px dashed #E8836B', color: '#E8836B', background: 'none', cursor: 'pointer', borderRadius: 10, fontWeight: 700, marginBottom: 10 };
const labelS = { display: 'block', fontSize: 14, fontWeight: 700, color: '#2D5016', marginBottom: 8 };
const memberBox = { display: 'flex', alignItems: 'center', gap: 10, padding: '15px', background: '#FDFCFB', border: '1px solid #E8E0D8', borderRadius: 10, cursor: 'pointer', marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#2D5016' };
const summaryBox = { background: '#fff', padding: 20, borderRadius: 15, border: '1px solid #eee' };
const sumRow = { display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontWeight: 600, color: '#444' };
const submitBtn = { width: '100%', padding: 18, borderRadius: 50, background: 'linear-gradient(135deg, #E8836B, #D35C41)', color: '#fff', border: 'none', fontSize: 18, fontWeight: 800, marginTop: 20, cursor: 'pointer', boxShadow: '0 5px 15px rgba(232, 131, 107, 0.4)' };
const disabledBtn = { ...submitBtn, background: '#ccc', cursor: 'not-allowed', boxShadow: 'none' };
