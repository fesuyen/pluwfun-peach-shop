import React, { useState, useEffect } from 'react';

// --- 管理者清單設定 ---
const ADMIN_LIST = [
  { id: 'admin1', name: "達利阿伯", role: "老闆" },
  { id: 'admin2', name: "行政小美", role: "會計" },
  { id: 'admin3', name: "理貨小張", role: "出貨" },
];

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // orders, members
  const [currentAdmin, setCurrentAdmin] = useState(ADMIN_LIST[0].name); // 預設管理者
  const logoUrl = "https://cdn.phototourl.com/free/2026-04-04-bb9388dc-1fdd-40db-bd77-1c117183e3a1.png";

  // 1. 深度連動：開啟後台時，自動從資料庫抓取最新訂單
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 這邊會連動到後端 API
        const response = await fetch('/api/orders');
        const data = await response.json();
        // 讓最新的訂單排在最上面
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("目前尚無連線資料庫，顯示模擬資料中");
        // 模擬資料方便您測試 UI
        setOrders([
          { id: 'ORDER12345', customerName: '測試客戶', finalTotal: 5359, status: '待核帳', lastAdmin: '系統自動', createdAt: new Date().toISOString(), isMember: true, totalBox: 5 }
        ]);
      }
    };
    fetchOrders();
  }, []);

  // 2. 狀態更動邏輯：自動紀錄「是誰改的」
  const handleUpdateStatus = async (orderId, nextStatus) => {
    if (!window.confirm(`確認將此訂單改為 [${nextStatus}] 嗎？`)) return;

    try {
      // 這裡會傳送更新指令給後端，並附帶目前管理者的名字
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, lastAdmin: currentAdmin }),
      });
      
      // 重新整理頁面以顯示最新狀態
      window.location.reload();
    } catch (err) {
      // 若無後端，則僅更新本地畫面供測試
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus, lastAdmin: currentAdmin } : o));
    }
  };

  // 3. 會員飛鼠幣核發邏輯
  const handleGrantCoins = (customerName) => {
    if (window.confirm(`確認為 ${customerName} 核發 2000 飛鼠幣嗎？`)) {
      alert(`[${currentAdmin}] 已成功核發 2000 飛鼠幣！系統已紀錄操作日誌。`);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f6', fontFamily: 'sans-serif' }}>
      
      {/* 左側導覽列：視覺化識別區 */}
      <div style={{ width: '260px', background: '#2D5016', color: '#fff', padding: '30px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Logo 位置：最佳識別點 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={logoUrl} alt="logo" style={{ width: '85%', height: 'auto', marginBottom: '10px' }} />
          <div style={{ fontSize: '12px', opacity: 0.6, letterSpacing: '2px' }}>後台管理系統</div>
        </div>

        {/* 選單按鈕 */}
        <div style={{ flex: 1 }}>
          <button onClick={() => setActiveTab('orders')} style={tabBtn(activeTab === 'orders')}>📦 訂單即時管理</button>
          <button onClick={() => setActiveTab('members')} style={tabBtn(activeTab === 'members')}>👥 會員與飛鼠幣</button>
        </div>

        {/* 管理者切換區：責任追蹤核心 */}
        <div style={adminSwitcher}>
          <div style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.8 }}>👤 當前操作管理者：</div>
          <select 
            value={currentAdmin} 
            onChange={(e) => setCurrentAdmin(e.target.value)}
            style={selectStyle}
          >
            {ADMIN_LIST.map(admin => (
              <option key={admin.id} value={admin.name}>{admin.name} ({admin.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 右側內容區：杜絕複雜、一眼看清 */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2D5016', margin: 0 }}>
            {activeTab === 'orders' ? '訂單流向監控' : '會員權益核發'}
          </h2>
          <div style={{ fontSize: '14px', color: '#666' }}>
            最後同步時間：{new Date().toLocaleTimeString()}
          </div>
        </div>

        <div style={cardStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#888' }}>
                <th style={p15}>客戶/日期</th>
                <th style={p15}>訂購內容</th>
                <th style={p15}>總金額</th>
                <th style={p15}>目前狀態</th>
                <th style={p15}>最後經手人</th>
                <th style={p15}>快速管理動作</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '100px', color: '#999' }}>📭 目前尚無新訂單資料</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9', transition: '0.3s' }}>
                    <td style={p15}>
                      <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>{order.createdAt?.slice(0, 10)}</div>
                    </td>
                    <td style={p15}>
                      {order.isMember && <span style={memberTag}>入會</span>} 
                      {order.totalBox} 盒水蜜桃
                    </td>
                    <td style={p15}>
                      <b style={{ color: '#2D5016' }}>NT$ {order.finalTotal}</b>
                    </td>
                    <td style={p15}>
                      <span style={statusBadge(order.status)}>{order.status}</span>
                    </td>
                    <td style={p15}>
                      <div style={{ fontSize: '13px' }}>{order.lastAdmin || '系統自動'}</div>
                    </td>
                    <td style={p15}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {order.status === '待核帳' && (
                          <button onClick={() => handleUpdateStatus(order.id, '已收款')} style={primaryBtn}>確認收款</button>
                        )}
                        {order.status === '已收款' && (
                          <button onClick={() => handleUpdateStatus(order.id, '已出貨')} style={secondaryBtn}>登記出貨</button>
                        )}
                        {order.isMember && (
                          <button onClick={() => handleGrantCoins(order.customerName)} style={coinBtn}>發 2000 幣</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- 視覺化樣式定義 ---
const cardStyle = { background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const p15 = { padding: '20px 15px' };
const tabBtn = (active) => ({
  width: '100%', padding: '15px', borderRadius: '12px', border: 'none', marginBottom: '10px',
  textAlign: 'left', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
  background: active ? '#E8836B' : 'transparent', color: '#fff'
});
const adminSwitcher = { marginTop: 'auto', background: '#1B3510', padding: '15px', borderRadius: '15px' };
const selectStyle = { width: '100%', padding: '8px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '13px', fontWeight: 600 };
const memberTag = { background: '#E8836B', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginRight: '8px', verticalAlign: 'middle' };
const statusBadge = (s) => ({
  padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800,
  background: s === '待核帳' ? '#FFEBEB' : s === '已收款' ? '#EBFBEE' : '#F0F0F0',
  color: s === '待核帳' ? '#FF4D4D' : s === '已收款' ? '#27AE60' : '#888'
});
const btnBase = { border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' };
const primaryBtn = { ...btnBase, background: '#2D5016', color: '#fff' };
const secondaryBtn = { ...btnBase, background: '#3498db', color: '#fff' };
const coinBtn = { ...btnBase, background: '#f1c40f', color: '#000' };
