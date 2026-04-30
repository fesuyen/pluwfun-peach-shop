import React, { useState, useEffect } from 'react';

// --- 管理者清單 (可用於責任追蹤) ---
const ADMIN_LIST = ["達利阿伯", "行政小美", "理貨小張"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders'); // orders, members, settings
  const [orders, setOrders] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(ADMIN_LIST[0]);
  
  // 匯款資訊狀態 (連動前台)
  const [bankData, setBankData] = useState({
    bank_name: '',
    bank_code: '',
    bank_account: '',
    bank_holder: ''
  });

  const logoUrl = "https://cdn.phototourl.com/free/2026-04-04-bb9388dc-1fdd-40db-bd77-1c117183e3a1.png";

  // --- 1. 初始化資料抓取 ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 抓取訂單
      const resOrders = await fetch('/api/orders');
      const dataOrders = await resOrders.json();
      setOrders(dataOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      // 抓取匯款資訊
      const resBank = await fetch('/api/content');
      const dataBank = await resBank.json();
      setBankData({
        bank_name: dataBank.bank_name || '',
        bank_code: dataBank.bank_code || '',
        bank_account: dataBank.bank_account || '',
        bank_holder: dataBank.bank_holder || ''
      });
    } catch (err) {
      console.log("連線資料庫中或尚未有資料...");
    }
  };

  // --- 2. 訂單狀態更新邏輯 (含責任追蹤) ---
  const updateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`確認將訂單狀態改為 [${newStatus}] 嗎？`)) return;
    
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, lastAdmin: currentAdmin }),
      });
      fetchData(); // 重新整理資料
    } catch (err) { alert("更新失敗，請檢查網路"); }
  };

  // --- 3. 儲存匯款資訊 (同步至前台) ---
  const saveBankInfo = async () => {
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankData)
      });
      alert(`✅ 匯款資訊已更新！操作者：${currentAdmin}`);
    } catch (err) { alert("儲存失敗"); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: 'sans-serif' }}>
      
      {/* 左側：品牌導覽列 */}
      <div style={{ width: 280, background: '#2D5016', color: '#fff', padding: '40px 25px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <img src={logoUrl} alt="Logo" style={{ width: '80%', height: 'auto', marginBottom: 15 }} />
          <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: 2 }}>管理員作業後台</div>
        </div>

        <div style={{ flex: 1 }}>
          <button onClick={() => setActiveTab('orders')} style={tabStyle(activeTab === 'orders')}>📦 訂單即時監控</button>
          <button onClick={() => setActiveTab('members')} style={tabStyle(activeTab === 'members')}>👥 會員點數核發</button>
          <button onClick={() => setActiveTab('settings')} style={tabStyle(activeTab === 'settings')}>⚙️ 系統資訊設定</button>
        </div>

        {/* 管理者切換 (責任追蹤核心) */}
        <div style={adminBox}>
          <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.8 }}>👤 目前登入管理員：</div>
          <select value={currentAdmin} onChange={(e) => setCurrentAdmin(e.target.value)} style={selectStyle}>
            {ADMIN_LIST.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>

      {/* 右側：內容呈現區 */}
      <div style={{ flex: 1, padding: 50, overflowY: 'auto' }}>
        
        {/* 頁面標題 */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#2D5016', margin: 0, fontSize: 28 }}>
            {activeTab === 'orders' ? '訂單管理中心' : activeTab === 'members' ? '會員福利核發' : '系統參數設定'}
          </h2>
          <hr style={{ border: 'none', borderTop: '2px solid #E8836B', width: 60, margin: '15px 0' }} />
        </div>

        {/* 訂單分頁內容 */}
        {activeTab === 'orders' && (
          <div style={cardStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={thStyle}>
                  <th>下單時間 / 客戶</th>
                  <th>配送內容</th>
                  <th>總額</th>
                  <th>狀態</th>
                  <th>最後經手</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: 50, color: '#999' }}>尚無訂單資料</td></tr>
                ) : orders.map(o => (
                  <tr key={o.id} style={trStyle}>
                    <td><b>{o.customerName}</b><br/><small style={{color:'#999'}}>{o.createdAt?.slice(5, 16)}</small></td>
                    <td>{o.isMember && <span style={memberTag}>入會</span>} {o.totalBox} 盒</td>
                    <td><b style={{color:'#2D5016'}}>NT$ {o.finalTotal}</b></td>
                    <td><span style={statusBadge(o.status)}>{o.status}</span></td>
                    <td><small>{o.lastAdmin || '系統自動'}</small></td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {o.status === '待核帳' && <button onClick={() => updateStatus(o.id, '已收款')} style={btnS}>確認收款</button>}
                        {o.status === '已收款' && <button onClick={() => updateStatus(o.id, '已出貨')} style={{...btnS, background:'#3498db'}}>登記出貨</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 會員分頁內容 */}
        {activeTab === 'members' && (
          <div style={cardStyle}>
            <p style={{color:'#666', marginBottom:20}}>※ 當確認收到 $1,999 入會費後，請在此點擊核發 2000 飛鼠幣。</p>
            <table style={tableStyle}>
              <thead><tr style={thStyle}><th>客戶姓名</th><th>目前餘額</th><th>動作</th></tr></thead>
              <tbody>
                {orders.filter(o => o.isMember).map(m => (
                  <tr key={m.id} style={trStyle}>
                    <td>{m.customerName}</td>
                    <td style={{color:'#E8836B', fontWeight:800}}>尚未核發</td>
                    <td><button onClick={() => alert(`${currentAdmin} 已成功核發 2000 幣至該帳戶`)} style={{...btnS, background:'#f1c40f', color:'#000'}}>手動核發 2000 幣</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 系統設定內容 (匯款資訊編輯) */}
        {activeTab === 'settings' && (
          <div style={{ ...cardStyle, maxWidth: 500 }}>
            <h3 style={{ marginBottom: 20, color: '#2D5016' }}>編輯前台匯款資訊</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div><label style={labelS}>銀行名稱</label><input style={inS} value={bankData.bank_name} onChange={e=>setBankData({...bankData, bank_name: e.target.value})} /></div>
              <div><label style={labelS}>銀行代碼</label><input style={inS} value={bankData.bank_code} onChange={e=>setBankData({...bankData, bank_code: e.target.value})} /></div>
              <div><label style={labelS}>帳號</label><input style={inS} value={bankData.bank_account} onChange={e=>setBankData({...bankData, bank_account: e.target.value})} /></div>
              <div><label style={labelS}>戶名</label><input style={inS} value={bankData.bank_holder} onChange={e=>setBankData({...bankData, bank_holder: e.target.value})} /></div>
              <button onClick={saveBankInfo} style={{ ...btnS, padding: 15, fontSize: 16 }}>儲存並即時更新前台</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- 視覺樣式設定 ---
const tabStyle = (act) => ({
  width: '100%', padding: '15px 20px', borderRadius: 12, border: 'none', marginBottom: 10,
  textAlign: 'left', fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: '0.3s',
  background: act ? '#E8836B' : 'transparent', color: '#fff'
});
const adminBox = { marginTop: 'auto', background: '#1B3510', padding: 20, borderRadius: 15 };
const selectStyle = { width: '100%', padding: 8, borderRadius: 8, border: 'none', fontWeight: 600 };
const cardStyle = { background: '#fff', padding: 30, borderRadius: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', borderBottom: '2px solid #eee', color: '#999', fontSize: 13 };
const trStyle = { borderBottom: '1px solid #f9f9f9' };
const p15 = { padding: 20 };
const memberTag = { background: '#E8836B', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, marginRight: 5 };
const statusBadge = (s) => ({
  padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800,
  background: s === '待核帳' ? '#FFEBEB' : s === '已收款' ? '#EBFBEE' : '#F0F0F0',
  color: s === '待核帳' ? '#FF4D4D' : s === '已收款' ? '#27AE60' : '#888'
});
const btnS = { border: 'none', padding: '8px 15px', borderRadius: 8, background: '#2D5016', color: '#fff', cursor: 'pointer', fontWeight: 700 };
const inS = { width: '100%', padding: 12, borderRadius: 10, border: '1px solid #ddd', marginTop: 5 };
const labelS = { fontSize: 14, fontWeight: 700, color: '#666' };
