import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [currentAdmin, setCurrentAdmin] = useState("達利阿伯"); // 預設管理者

  // --- 關鍵連動：從資料庫抓訂單 ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data.reverse()); // 最新訂單排前面
      } catch (err) { console.log("抓取失敗"); }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, lastAdmin: currentAdmin }),
      });
      window.location.reload(); // 更新完刷新頁面
    } catch (err) { alert("更新失敗"); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f6' }}>
      {/* 左側選單 */}
      <div style={{ width: 260, background: '#2D5016', color: '#fff', padding: 30 }}>
        <h2 style={{ fontSize: 24, marginBottom: 40 }}>pluwfun 後台</h2>
        <button onClick={()=>setActiveTab('orders')} style={tabBtn(activeTab==='orders')}>📦 訂單管理</button>
        <button onClick={()=>setActiveTab('members')} style={tabBtn(activeTab==='members')}>👥 會員管理</button>
        
        {/* 管理者切換器 */}
        <div style={adminSwitcher}>
          <small>當前操作者：</small>
          <select value={currentAdmin} onChange={e=>setCurrentAdmin(e.target.value)} style={selectStyle}>
            <option value="達利阿伯">達利阿伯 (老闆)</option>
            <option value="行政小美">行政小美 (會計)</option>
            <option value="理貨小張">理貨小張 (出貨)</option>
          </select>
        </div>
      </div>

      {/* 右側內容 */}
      <div style={{ flex: 1, padding: 40 }}>
        <h3 style={{ marginBottom: 30 }}>{activeTab === 'orders' ? '訂單即時監控' : '會員點數核發'}</h3>
        
        <div style={tableCard}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={p15}>客戶資訊</th>
                <th style={p15}>訂購內容</th>
                <th style={p15}>總額</th>
                <th style={p15}>目前狀態</th>
                <th style={p15}>最後經手</th>
                <th style={p15}>管理動作</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center', padding:50, color:'#999'}}>目前尚無訂單資料</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={p15}>{o.customerName}<br/><small>{o.createdAt?.slice(5,16)}</small></td>
                  <td style={p15}>{o.isMember && <span style={memberTag}>含入會</span>} {o.totalBox}盒</td>
                  <td style={p15}><b>${o.finalTotal}</b></td>
                  <td style={p15}><span style={statusBadge(o.status)}>{o.status}</span></td>
                  <td style={p15}>{o.lastAdmin}</td>
                  <td style={p15}>
                    {o.status === '待核帳' && <button onClick={()=>updateStatus(o.id, '已收款')} style={actBtn}>確認收款</button>}
                    {o.status === '已收款' && <button onClick={()=>updateStatus(o.id, '已出貨')} style={shipBtn}>登記出貨</button>}
                    {o.isMember && <button onClick={()=>alert('已通知系統發放2000幣')} style={coinBtn}>發飛鼠幣</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 樣式
const tabBtn = (act) => ({ width: '100%', padding: '15px', marginBottom: 10, background: act ? '#E8836B' : 'transparent', color: '#fff', border: 'none', borderRadius: 10, textAlign: 'left', cursor: 'pointer', fontWeight: 700 });
const adminSwitcher = { marginTop: 60, padding: 15, background: '#1B3510', borderRadius: 10 };
const selectStyle = { width: '100%', marginTop: 5, padding: 5, borderRadius: 5, border: 'none' };
const tableCard = { background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const p15 = { padding: 15, fontSize: 14 };
const memberTag = { background: '#E8836B', color: '#fff', fontSize: 10, padding: '2px 5px', borderRadius: 3, marginRight: 5 };
const statusBadge = (s) => ({ padding: '5px 10px', borderRadius: 5, fontSize: 12, fontWeight: 700, background: s==='待核帳' ? '#FFEBEB' : '#EBFBEE', color: s==='待核帳' ? '#FF4D4D' : '#27AE60' });
const actBtn = { background: '#2D5016', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 5, cursor: 'pointer', marginRight: 5 };
const shipBtn = { ...actBtn, background: '#3498db' };
const coinBtn = { ...actBtn, background: '#f1c40f', color: '#000' };
