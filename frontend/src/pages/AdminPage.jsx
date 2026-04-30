import React, { useState, useEffect } from 'react';

// 模擬當前登入的管理員 (實際應從 Login 狀態取得)
const CURRENT_ADMIN = "達利阿伯"; 

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders'); // orders, members
  const [orders, setOrders] = useState([]);
  const [members, setMembers] = useState([]);

  // --- 邏輯 1: 訂單狀態切換與日誌紀錄 ---
  const handleOrderStatus = (orderId, nextStatus) => {
    const confirmMsg = `確認將訂單 #${orderId.slice(-4)} 更改為 [${nextStatus}] 嗎？`;
    if (!window.confirm(confirmMsg)) return;

    // 這裡會傳送給後端，並附帶 CURRENT_ADMIN 的名字
    console.log(`[審計日誌] ${new Date().toLocaleString()} - 管理員: ${CURRENT_ADMIN} 執行了 ${nextStatus}`);
    
    // 更新本地狀態 (模擬效果)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus, lastAdmin: CURRENT_ADMIN } : o));
  };

  // --- 邏輯 2: 手動核發飛鼠幣 ---
  const grantCoins = (memberId) => {
    const amount = 2000;
    if (window.confirm(`確認為該會員核發 ${amount} 飛鼠幣嗎？此動作將留下管理日誌。`)) {
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, coins: m.coins + amount, lastAdmin: CURRENT_ADMIN } : m));
      alert(`已成功由 ${CURRENT_ADMIN} 核發完畢！`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex' }}>
      {/* 左側簡單導航 */}
      <div style={{ width: '240px', background: '#2D5016', color: '#fff', padding: '30px 20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '40px' }}>pluwfun 後台</h2>
        <button onClick={() => setActiveTab('orders')} style={tabBtn(activeTab === 'orders')}>📦 訂單管理</button>
        <button onClick={() => setActiveTab('members')} style={tabBtn(activeTab === 'members')}>👥 會員/飛鼠幣</button>
        <div style={{ marginTop: '50px', fontSize: '12px', opacity: 0.6 }}>
          當前線上管理員：<br/><b>{CURRENT_ADMIN}</b>
        </div>
      </div>

      {/* 右側內容區 */}
      <div style={{ flex: 1, padding: '40px' }}>
        {activeTab === 'orders' ? (
          <div>
            <h3 style={{ marginBottom: '20px' }}>訂單即時監控</h3>
            <div style={cardStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={thRow}>
                    <th>訂單資訊</th>
                    <th>配送明細</th>
                    <th>總額</th>
                    <th>狀態</th>
                    <th>最後經手</th>
                    <th>快速操作</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 這裡應 map 實際訂單資料 */}
                  <tr>
                    <td style={tdStyle}>王小明<br/><small>0912-345678</small></td>
                    <td style={tdStyle}>地址1: 6粒x1, 10粒x2<br/>地址2: 10粒x1</td>
                    <td style={tdStyle}>NT$ 5,359</td>
                    <td style={tdStyle}><span style={statusTag('待核帳')}>待核帳</span></td>
                    <td style={tdStyle}>{CURRENT_ADMIN}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleOrderStatus('1', '待出貨')} style={actionBtn}>對帳成功</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: '20px' }}>會員點數管理</h3>
            <div style={cardStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={thRow}>
                    <th>會員姓名</th>
                    <th>LINE ID</th>
                    <th>目前幣值</th>
                    <th>核發 2000 幣</th>
                    <th>操作者</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>李大華</td>
                    <td style={tdStyle}>line_dh_88</td>
                    <td style={tdStyle}><b style={{color:'#E8836B'}}>0</b></td>
                    <td style={tdStyle}>
                      <button onClick={() => grantCoins('m1')} style={coinBtn}>手動核發點數</button>
                    </td>
                    <td style={tdStyle}>尚未核發</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 樣式設定 (杜絕複雜，視覺清晰) ---
const tabBtn = (active) => ({
  width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px',
  border: 'none', background: active ? '#E8836B' : 'transparent',
  color: '#fff', textAlign: 'left', cursor: 'pointer', fontWeight: 700
});
const cardStyle = { background: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRow = { textAlign: 'left', borderBottom: '2px solid #eee', color: '#888', fontSize: '13px' };
const tdStyle = { padding: '15px 0', borderBottom: '1px solid #f9f9f9', fontSize: '14px' };
const statusTag = (s) => ({
  padding: '4px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: 700,
  background: s === '待核帳' ? '#FFEBEB' : '#EBFBEE', color: s === '待核帳' ? '#FF4D4D' : '#27AE60'
});
const actionBtn = { background: '#2D5016', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' };
const coinBtn = { background: '#E8836B', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' };
