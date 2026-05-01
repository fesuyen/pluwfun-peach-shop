import React, { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, set, onValue } from 'firebase/database';

const activeB = { padding: '12px', flex: 1, cursor: 'pointer', border: 'none', background: '#2D5016', color: '#fff', fontWeight: '800' };
const normalB = { padding: '12px', flex: 1, cursor: 'pointer', border: 'none', background: '#eee', color: '#666', fontWeight: '800' };
const inputS = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' };

export default function AdminPage() {
  const [tab, setTab] = useState('features');
  const [content, setContent] = useState({
    features: { t1:'', d1:'', t2:'', d2:'', t3:'', d3:'', t4:'', d4:'' },
    story: { title:'', p1:'', p2:'' },
    membership: { price:'1999', desc:'' },
    bank: { name:'', account:'', holder:'' }
  });

  useEffect(() => {
    onValue(ref(rtdb, 'siteContent'), (snap) => {
      if (snap.val()) setContent(snap.val());
    });
  }, []);

  const save = () => {
    set(ref(rtdb, 'siteContent'), content).then(() => alert('✅ 內容已同步更新！'));
  };

  return (
    <div style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#2D5016', marginBottom: '20px' }}>🛠️ 飛鼠不渴 - 網站內容管理</h2>
      <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden' }}>
        <button onClick={()=>setTab('features')} style={tab==='features'?activeB:normalB}>1. 產品特色</button>
        <button onClick={()=>setTab('story')} style={tab==='story'?activeB:normalB}>2. 農民故事</button>
        <button onClick={()=>setTab('membership')} style={tab==='membership'?activeB:normalB}>3. 會員方案</button>
        <button onClick={()=>setTab('bank')} style={tab==='bank'?activeB:normalB}>4. 匯款資訊</button>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        {tab === 'features' && (
          <div>
            <h3>🏔️ 產品特色 (四大理由)</h3>
            {[1,2,3,4].map(i => (
              <div key={i} style={{marginBottom:15}}>
                <input style={inputS} value={content.features[`t${i}`]} placeholder={`標題 ${i}`} onChange={e=>setContent({...content, features:{...content.features, [`t${i}`]:e.target.value}})} />
                <textarea style={inputS} value={content.features[`d${i}`]} placeholder={`描述 ${i}`} onChange={e=>setContent({...content, features:{...content.features, [`d${i}`]:e.target.value}})} />
              </div>
            ))}
          </div>
        )}
        {tab === 'bank' && (
          <div>
            <h3>💳 匯款資訊</h3>
            <input style={inputS} value={content.bank.name} placeholder="銀行名稱" onChange={e=>setContent({...content, bank:{...content.bank, name:e.target.value}})} />
            <input style={inputS} value={content.bank.account} placeholder="帳號" onChange={e=>setContent({...content, bank:{...content.bank, account:e.target.value}})} />
            <input style={inputS} value={content.bank.holder} placeholder="戶名" onChange={e=>setContent({...content, bank:{...content.bank, holder:e.target.value}})} />
          </div>
        )}
        {/* 會員方案與故事區塊同理... */}
        <button onClick={save} style={{ width:'100%', padding:'15px', background:'#E8836B', color:'#fff', border:'none', borderRadius:'50px', fontWeight:'800', cursor:'pointer' }}>發布變更至前台</button>
      </div>
    </div>
  );
}
