import React, { useState } from 'react';

const ADMIN_NAME = "達利阿伯"; // 您可以在這裡改成不同管理者的名字

export default function AdminPage() {
  const [orders, setOrders] = useState([
    { id: '1001', name: '王小明', status: '待核帳', total: 5359, lastBy: '' }
  ]);

  const updateOrder = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus, lastBy: ADMIN_NAME } : o));
    alert(`[${ADMIN_NAME}] 已將訂單改為: ${newStatus}`);
  };

  return (
    <div style={{ padding: '40px', background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ color: '#2D5016' }}>後台管理系統 <small style={{fontSize:14, fontWeight:400}}>當前操作者：{ADMIN_NAME}</small></h2>
      
      <div style={{ background: '#fff', padding: 20, borderRadius: 15, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#2D5016', color: '#fff' }}>
            <tr>
              <th style={p10}>編號</th><th style={p10}>客戶</th><th style={p10}>金額</th><th style={p10}>狀態</th><th style={p10}>經手人</th><th style={p10}>動作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={p10}>#{o.id}</td>
                <td style={p10}>{o.name}</td>
                <td style={p10}>${o.total}</td>
                <td style={p10}><span style={badge(o.status)}>{o.status}</span></td>
                <td style={p10}>{o.lastBy || '系統'}</td>
                <td style={p10}>
                  <button onClick={() => updateOrder(o.id, '已收款')} style={actBtn}>對帳成功</button>
                  <button onClick={() => alert('已發放 2000 飛鼠幣！')} style={{...actBtn, background:'#E8836B', marginLeft:5}}>發放2000幣</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const p10 = { padding: 15 };
const badge = (s) => ({ padding: '4px 10px', borderRadius: 5, fontSize: 12, background: s==='待核帳' ? '#FFEBEB' : '#EBFBEE', color: s==='待核帳' ? '#FF4D4D' : '#27AE60' });
const actBtn = { padding: '6px 12px', border: 'none', background: '#2D5016', color: '#fff', borderRadius: 5, cursor: 'pointer' };
