import React, { useState, useMemo } from 'react';

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
  const [isMember, setIsMember] = useState(false);
  const [shipMode, setShipMode] = useState('single'); 
  const [dests, setDests] = useState([{ id: Date.now(), name: '', tel: '', addr: '', alloc: { '6p': 0, '8p': 0, '10p': 0, '12p': 0 } }]);

  const totalBox = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const totalAlloc = useMemo(() => dests.reduce((s, d) => s + Object.values(d.alloc).reduce((a, b) => a + b, 0), 0), [dests]);
  const prodSub = useMemo(() => PRODUCTS.reduce((s, p) => s + (p.price * cart[p.id]), 0), [cart]);
  const shipSub = useMemo(() => shipMode === 'pickup' ? 0 : dests.reduce((s, d) => s + getShipping(Object.values(d.alloc).reduce((a, b) => a + b, 0)), 0), [dests, shipMode]);
  const finalTotal = prodSub + shipSub + (isMember ? 1999 : 0);

  // --- 關鍵連動：送出資料至後台 ---
  const handleSubmit = async () => {
    const orderData = {
      customerName: dests[0].name,
      cart,
      dests,
      isMember,
      finalTotal,
      status: '待核帳',
      createdAt: new Date().toISOString(),
      lastAdmin: '系統自動'
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("🎉 預訂成功！請前往 LINE OA 告知轉帳末五碼。\n(若有加入會員，管理員將手動核發2000飛鼠幣)");
        window.location.href = "https://lin.ee/RBc7waf"; // 送出後跳轉 LINE
      } else {
        alert("系統儲存失敗，請聯繫管理員");
      }
    } catch (error) {
      alert("連線失敗，請檢查網路狀態");
    }
  };

  return (
    <section style={{ padding: '60px 20px', background: '#FDFCFB' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>🍑 選擇規格 (已加50元)</h3>
          {PRODUCTS.map(p => (
            <div key={p.id} style={itemRow}>
              <span>{p.name} <b style={{color: '#E8836B'}}>NT${p.price}</b></span>
              <div style={counterStyle}>
                <button onClick={() => setCart({...cart, [p.id]: Math.max(0, cart[p.id]-1)})} style={btnStyle}>-</button>
                <b style={{width: 30, textAlign: 'center'}}>{cart[p.id]}</b>
                <button onClick={() => setCart({...cart, [p.id]: cart[p.id]+1})} style={btnStyle}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>📝 配送與分配</h3>
          <div style={{display:'flex', gap:10, marginBottom:15}}>
            <button onClick={()=>setShipMode('single')} style={shipMode==='single'?actS:defS}>寄單一地址</button>
            <button onClick={()=>setShipMode('multiple')} style={shipMode==='multiple'?actS:defS}>寄多點地址</button>
          </div>
          
          {shipMode !== 'pickup' && dests.map((d, i) => (
            <div key={d.id} style={addrBox}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
                <input placeholder="收件姓名" style={inS} onChange={e=>{const n=[...dests]; n[i].name=e.target.value; setDests(n);}} />
                <input placeholder="聯絡電話" style={inS} onChange={e=>{const n=[...dests]; n[i].tel=e.target.value; setDests(n);}} />
              </div>
              <input placeholder="完整地址" style={{...inS, width:'100%', marginTop:10}} onChange={e=>{const n=[...dests]; n[i].addr=e.target.value; setDests(n);}} />
              <div style={{marginTop:15, fontSize:12, color:'#666'}}>
                {PRODUCTS.filter(p => cart[p.id] > 0).map(p => (
                  <label key={p.id} style={{marginRight:10}}>{p.name}: <input type="number" style={{width:40}} onChange={(e)=>{
                    const newD = [...dests]; newD[i].alloc[p.id] = parseInt(e.target.value)||0; setDests(newD);
                  }} /> 盒 </label>
                ))}
              </div>
            </div>
          ))}
          {shipMode==='multiple' && <button onClick={()=>setDests([...dests, {id:Date.now(), name:'', tel:'', addr:'', alloc:{'6p':0,'8p':0,'10p':0,'12p':0}}])} style={addBtn}>+ 增加下一個地址</button>}

          <div style={{marginTop:30, background:'#2D5016', color:'#fff', padding:25, borderRadius:20}}>
            <div style={pRow}><span>應付總額</span><span>NT$ {finalTotal}</span></div>
            <label style={{fontSize:13, display:'flex', gap:8, marginTop:15, cursor:'pointer'}}>
              <input type="checkbox" checked={isMember} onChange={()=>setIsMember(!isMember)} /> 加入會員 1999 (獲得2000飛鼠幣)
            </label>
            <button 
              disabled={totalBox===0 || (shipMode!=='pickup' && totalBox!==totalAlloc)} 
              onClick={handleSubmit}
              style={totalBox===totalAlloc || shipMode==='pickup' ? submitBtn : disabledBtn}
            >
              {totalBox===totalAlloc || shipMode==='pickup' ? '確認送出訂單' : `尚有 ${totalBox-totalAlloc} 盒未分配`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// 樣式
const cardStyle = { background:'#fff', padding:25, borderRadius:20, boxShadow:'0 5px 20px rgba(0,0,0,0.05)' };
const titleStyle = { color:'#2D5016', borderLeft:'5px solid #E8836B', paddingLeft:12, marginBottom:20, fontSize:18, fontWeight:800 };
const itemRow = { display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid #eee' };
const counterStyle = { display:'flex', alignItems:'center', gap:10 };
const btnStyle = { width:32, height:32, cursor:'pointer', background:'#fff', border:'1px solid #ddd', borderRadius:5 };
const inS = { padding:10, borderRadius:8, border:'1px solid #eee', outline:'none' };
const addrBox = { padding:20, border:'1px solid #f0f0f0', borderRadius:15, marginBottom:15, background:'#fafafa' };
const defS = { flex:1, padding:12, cursor:'pointer', border:'1px solid #ddd', background:'#fff', borderRadius:10 };
const actS = { ...defS, background:'#E8836B', color:'#fff', borderColor:'#E8836B' };
const pRow = { display:'flex', justifyContent:'space-between', fontSize:22, fontWeight:900 };
const addBtn = { width:'100%', padding:12, border:'2px dashed #E8836B', color:'#E8836B', background:'none', cursor:'pointer', borderRadius:10, fontWeight:700 };
const submitBtn = { width:'100%', padding:20, marginTop:20, background:'#E8836B', color:'#fff', border:'none', borderRadius:50, fontWeight:800, cursor:'pointer', fontSize:18 };
const disabledBtn = { ...submitBtn, background:'#ccc', cursor:'not-allowed' };
