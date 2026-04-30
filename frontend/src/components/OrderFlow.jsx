import React, { useState, useMemo, useEffect } from 'react';

// --- 1. 產品與價格設定 (已加50元) ---
const PRODUCTS = [
  { id: '6p', name: '6粒裝', price: 750 },
  { id: '8p', name: '8粒裝', price: 650 },
  { id: '10p', name: '10粒裝', price: 550 },
  { id: '12p', name: '12粒裝', price: 450 },
];

// --- 2. 運費計算 (新竹冷藏物流) ---
const getShipping = (n) => {
  if (n <= 0) return 0;
  if (n <= 2) return 150;
  if (n <= 4) return 210;
  if (n <= 6) return 270;
  if (n <= 8) return 330;
  return Math.ceil(n / 8) * 330;
};

export default function OrderFlow() {
  // --- 狀態管理 ---
  const [cart, setCart] = useState({ '6p': 0, '8p': 0, '10p': 0, '12p': 0 });
  const [shipMode, setShipMode] = useState('single'); 
  const [isMember, setIsMember] = useState(false);
  const [bankDigits, setBankDigits] = useState('');
  const [note, setNote] = useState('');
  
  // 地址清單 (預設帶入全部購物車數量)
  const [dests, setDests] = useState([{ 
    id: Date.now(), name: '', tel: '', addr: '', alloc: { '6p': 0, '8p': 0, '10p': 0, '12p': 0 } 
  }]);

  // --- 自動化算力引擎 ---
  const totalBox = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  
  // 計算目前已分配的總數量
  const currentAllocated = useMemo(() => {
    const alloc = { '6p': 0, '8p': 0, '10p': 0, '12p': 0 };
    dests.forEach(d => {
      PRODUCTS.forEach(p => { alloc[p.id] += (d.alloc[p.id] || 0); });
    });
    return alloc;
  }, [dests, cart]);

  const totalAllocBox = Object.values(currentAllocated).reduce((a, b) => a + b, 0);

  // 計算剩餘未分配數量 (魔法核心)
  const getRemainder = () => {
    const rem = { '6p': 0, '8p': 0, '10p': 0, '12p': 0 };
    PRODUCTS.forEach(p => { rem[p.id] = Math.max(0, cart[p.id] - currentAllocated[p.id]); });
    return rem;
  };

  // 當購物車改變，且為單一地址時，自動同步數量
  useEffect(() => {
    if (shipMode === 'single' && dests.length === 1) {
      setDests([{ ...dests[0], alloc: { ...cart } }]);
    }
  }, [cart, shipMode]);

  // --- 結算金額 ---
  const prodSub = PRODUCTS.reduce((s, p) => s + (p.price * cart[p.id]), 0);
  const shipSub = shipMode === 'pickup' ? 0 : dests.reduce((s, d) => s + getShipping(Object.values(d.alloc).reduce((a, b) => a + b, 0)), 0);
  const finalTotal = prodSub + shipSub + (isMember ? 1999 : 0);

  // --- 互動邏輯 ---
  const handleAddDest = () => {
    const rem = getRemainder();
    const remCount = Object.values(rem).reduce((a, b) => a + b, 0);
    if (remCount === 0) {
      alert("✅ 已經全部分配完畢囉，不需再新增地址！");
      return;
    }
    // 神級 UX: 自動將剩下的數量填入新地址
    setDests([...dests, { id: Date.now(), name: '', tel: '', addr: '', alloc: rem }]);
  };

  const handleSubmit = async () => {
    if (shipMode !== 'pickup' && totalBox !== totalAllocBox) {
      alert("分配數量與訂購總數不符，請確認！"); return;
    }
    if (shipMode !== 'pickup' && dests.some(d => !d.name || !d.tel || !d.addr)) {
      alert("請填寫完整的收件人姓名、電話與地址"); return;
    }

    const orderData = {
      customerName: dests[0].name,
      cart, dests, isMember, finalTotal, bankDigits, note,
      status: '待核帳', createdAt: new Date().toISOString(), lastAdmin: '系統自動'
    };

    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
      if (response.ok) {
        alert("🎉 訂單已送出！請加入 LINE 官方帳號以便為您對帳與服務。");
        window.location.href = "https://lin.ee/RBc7waf"; 
      }
    } catch (e) { alert("系統連線異常，請稍後再試"); }
  };

  return (
    <section id="order-section" style={{ padding: '60px 20px', background: '#FDFCFB' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>
        
        {/* ================= 左側：資訊與選購區 ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* 購物車 */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>🍑 選擇規格 <small style={{fontSize:13, color:'#888', fontWeight:400}}>(已包含原價+50元)</small></h3>
            {PRODUCTS.map(p => (
              <div key={p.id} style={itemRow}>
                <span style={{fontSize:16, fontWeight:700}}>{p.name} <b style={{color: '#E8836B'}}>NT${p.price}</b></span>
                <div style={counterStyle}>
                  <button onClick={() => setCart({...cart, [p.id]: Math.max(0, cart[p.id]-1)})} style={btnStyle}>-</button>
                  <b style={{width: 35, textAlign: 'center', fontSize: 18}}>{cart[p.id]}</b>
                  <button onClick={() => setCart({...cart, [p.id]: cart[p.id]+1})} style={btnStyle}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* 運費與物流說明 */}
          <div style={cardStyle}>
            <h3 style={titleStyle}>📦 專業冷藏物流運費說明</h3>
            <p style={{fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 15}}>
              為確保水蜜桃鮮度，全程採用 <b style={{color:'#2D5016'}}>新竹冷藏物流</b> 配送。<br/>
              單一地址最多裝 8 盒，多個地址將依各別箱數獨立計算：
            </p>
            <div style={{ background:'#f9f9f9', padding:15, borderRadius:10, fontSize:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>1-2 盒：NT$ 150</div><div>3-4 盒：NT$ 210</div>
              <div>5-6 盒：NT$ 270</div><div>7-8 盒：NT$ 330</div>
            </div>
          </div>

          {/* 匯款資訊 */}
          <div style={{...cardStyle, background:'#2D5016', color:'#fff'}}>
            <h3 style={{...titleStyle, color:'#fff', borderLeftColor:'#D4A843'}}>💳 匯款帳戶資訊</h3>
            <div style={{ fontSize: 15, lineHeight: 1.8, opacity: 0.9 }}>
              銀行：XXX 銀行 (代碼 XXX)<br/>
              帳號：XXXX-XXXX-XXXX-XXXX<br/>
              戶名：達利阿伯<br/>
              <div style={{ marginTop: 10, fontSize: 13, color: '#D4A843' }}>* 請於送出訂單後，填寫右方「轉帳末五碼」或加入 LINE 傳送截圖。</div>
            </div>
          </div>
        </div>

        {/* ================= 右側：分配與結帳表單 ================= */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>📝 配送與結帳表單</h3>
          
          <div style={{display:'flex', gap:10, marginBottom:20}}>
            <button onClick={()=>{setShipMode('single'); setDests([dests[0]]);}} style={shipMode==='single'?actS:defS}>寄單一地址</button>
            <button onClick={()=>{setShipMode('multiple'); if(dests.length===1) setDests([{...dests[0], alloc:{...cart}}]);}} style={shipMode==='multiple'?actS:defS}>寄多點地址</button>
          </div>

          {totalBox === 0 ? (
            <div style={{textAlign:'center', padding:'40px 0', color:'#aaa'}}>請先於左側選擇欲購買的水蜜桃數量 🍑</div>
          ) : (
            <>
              {/* 多點配送時的進度提示 */}
              {shipMode === 'multiple' && (
                <div style={{ padding:12, borderRadius:8, marginBottom:20, background: totalBox === totalAllocBox ? '#EBFBEE' : '#FFF5F2', color: totalBox === totalAllocBox ? '#27AE60' : '#E8836B', fontWeight:700, fontSize:14, textAlign:'center' }}>
                  {totalBox === totalAllocBox ? '✅ 數量已全部分配完畢' : `⚠️ 尚有 ${totalBox - totalAllocBox} 盒尚未分配地址`}
                </div>
              )}

              {/* 地址填寫區塊 */}
              {dests.map((d, i) => (
                <div key={d.id} style={addrBox}>
                  {shipMode === 'multiple' && <div style={{fontWeight:800, color:'#2D5016', marginBottom:10}}>📍 收件地址 {i+1}</div>}
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10}}>
                    <input placeholder="收件人姓名 *" style={inS} value={d.name} onChange={e=>{const n=[...dests]; n[i].name=e.target.value; setDests(n);}} />
                    <input placeholder="聯絡電話 *" style={inS} value={d.tel} onChange={e=>{const n=[...dests]; n[i].tel=e.target.value; setDests(n);}} />
                  </div>
                  <input placeholder="完整收件地址 *" style={{...inS, width:'100%', marginBottom:15}} value={d.addr} onChange={e=>{const n=[...dests]; n[i].addr=e.target.value; setDests(n);}} />
                  
                  {/* 多址模式才顯示數量分配，單址模式隱藏以保持畫面乾淨 */}
                  {shipMode === 'multiple' ? (
                    <div style={{ background:'#f9f9f9', padding:10, borderRadius:8 }}>
                      <div style={{fontSize:12, color:'#888', marginBottom:8}}>此地址欲寄送的數量分配：</div>
                      <div style={{display:'flex', flexWrap:'wrap', gap:15}}>
                        {PRODUCTS.filter(p => cart[p.id] > 0).map(p => (
                          <label key={p.id} style={{fontSize:13, fontWeight:600, display:'flex', alignItems:'center'}}>{p.name} 
                            <input type="number" min="0" value={d.alloc[p.id]} style={numIn} onChange={(e)=>{
                              const n=[...dests]; n[i].alloc[p.id]=parseInt(e.target.value)||0; setDests(n);
                            }} /> 盒 
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{fontSize:13, color:'#2D5016', background:'#EBFBEE', padding:10, borderRadius:8}}>📦 配送內容：與左側選購數量一致</div>
                  )}
                </div>
              ))}

              {/* 多點配送的新增按鈕 */}
              {shipMode === 'multiple' && totalBox > totalAllocBox && (
                <button onClick={handleAddDest} style={addBtn}>+ 新增下一個地址 (自動帶入剩餘數量)</button>
              )}

              <hr style={{ border:'0.5px solid #eee', margin:'30px 0' }} />

              {/* 結帳資訊表單 */}
              <input placeholder="匯款轉帳末五碼 (選填，可稍後至 LINE 提供)" style={{...inS, width:'100%', marginBottom:15}} value={bankDigits} onChange={e=>setBankDigits(e.target.value)} />
              <textarea placeholder="如需指定到貨日或其他需求，請在此註明 (採收受天候影響，無法100%保證日期)" style={{...inS, width:'100%', height:80, resize:'none', marginBottom:20}} value={note} onChange={e=>setNote(e.target.value)} />
              
              <label style={{display:'flex', alignItems:'center', gap:10, padding:15, background:'#FEFCFA', border:'1px solid #E8E0D8', borderRadius:10, cursor:'pointer', marginBottom:25}}>
                <input type="checkbox" checked={isMember} onChange={()=>setIsMember(!isMember)} style={{width:18, height:18}} /> 
                <span style={{fontWeight:700, color:'#2D5016'}}>加入會員 $1,999 (將由專人為您核發 2000 飛鼠幣)</span>
              </label>

              {/* 總結區塊 */}
              <div style={{ background:'#FDFCFB', padding:20, borderRadius:15, border:'2px solid #E8836B' }}>
                <div style={sumRow}><span>商品小計</span><span>NT$ {prodSub}</span></div>
                <div style={sumRow}><span>低溫運費</span><span>NT$ {shipSub}</span></div>
                {isMember && <div style={sumRow}><span>會員費</span><span>NT$ 1,999</span></div>}
                <div style={{...sumRow, fontSize:26, fontWeight:900, color:'#E8836B', marginTop:15, borderTop:'1px dashed #ccc', paddingTop:15}}>
                  <span>應付總額</span><span>NT$ {finalTotal}</span>
                </div>
              </div>

              <button disabled={totalBox !== totalAllocBox} onClick={handleSubmit} style={totalBox === totalAllocBox ? submitBtn : disabledBtn}>
                {totalBox === totalAllocBox ? '🍑 確認送出訂單' : '請先完成所有水蜜桃的地址分配'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// --- 樣式設定 ---
const cardStyle = { background:'#fff', padding:'30px', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.04)' };
const titleStyle = { color:'#2D5016', borderLeft:'5px solid #E8836B', paddingLeft:12, marginBottom:25, fontSize:19, fontWeight:800 };
const itemRow = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 0', borderBottom:'1px dashed #eee' };
const counterStyle = { display:'flex', alignItems:'center', gap:8, background:'#F5F5F5', padding:5, borderRadius:12 };
const btnStyle = { width:32, height:32, cursor:'pointer', background:'#fff', border:'none', borderRadius:8, fontWeight:800, fontSize:16, boxShadow:'0 2px 5px rgba(0,0,0,0.05)' };
const defS = { flex:1, padding:15, cursor:'pointer', border:'1px solid #ddd', background:'#fff', borderRadius:10, fontSize:15, fontWeight:700, color:'#666' };
const actS = { ...defS, background:'#E8836B', color:'#fff', borderColor:'#E8836B' };
const addrBox = { padding:20, border:'1px solid #E8E0D8', borderRadius:15, marginBottom:20, background:'#fff', boxShadow:'0 4px 15px rgba(0,0,0,0.02)' };
const inS = { padding:14, borderRadius:10, border:'1px solid #ddd', outline:'none', fontSize:15, fontFamily:'inherit' };
const numIn = { width:45, padding:'5px', marginLeft:8, borderRadius:6, border:'1px solid #ccc', textAlign:'center' };
const addBtn = { width:'100%', padding:15, border:'2px dashed #E8836B', color:'#E8836B', background:'#FFF5F2', cursor:'pointer', borderRadius:12, fontWeight:700, fontSize:15 };
const sumRow = { display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:16, color:'#444', fontWeight:600 };
const submitBtn = { width:'100%', padding:20, marginTop:25, background:'linear-gradient(135deg, #E8836B, #D35C41)', color:'#fff', border:'none', borderRadius:50, fontWeight:800, cursor:'pointer', fontSize:20, boxShadow:'0 10px 20px rgba(232, 131, 107, 0.3)' };
const disabledBtn = { ...submitBtn, background:'#ccc', cursor:'not-allowed', boxShadow:'none', color:'#888' };
