import React, { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, set, onValue } from 'firebase/database';

export default function AdminPage() {
  const [tab, setTab] = useState('features'); // 四個分頁切換
  const [content, setContent] = useState({
    features: { t1: '', d1: '', t2: '', d2: '', t3: '', d3: '', t4: '', d4: '' },
    story: { title: '', p1: '', p2: '' },
    membership: { price: '1999', bonus: '2000', desc: '' },
    bank: { name: '', code: '', account: '', holder: '' }
  });

  // 讀取原本已有的內容
  useEffect(() => {
    onValue(ref(rtdb, 'siteContent'), (snapshot) => {
      if (snapshot.val()) setContent(snapshot.val());
    });
  }, []);

  const handleSave = () => {
    set(ref(rtdb, 'siteContent'), content)
      .then(() => alert('✅ 資料已成功同步至前台！'))
      .catch(() => alert('❌ 儲存失敗，請檢查權限。'));
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ color: '#2D5016' }}>🛠️ 飛鼠不渴 - 網站內容管理</h2>
      
      {/* 四大編輯分頁 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setTab('features')} style={tab==='features'?activeS:btnS}>1. 產品特色</button>
        <button onClick={() => setTab('story')} style={tab==='story'?activeS:btnS}>2. 農民故事</button>
        <button onClick={() => setTab('membership')} style={tab==='membership'?activeS:btnS}>3. 會員方案</button>
        <button onClick={() => setTab('bank')} style={tab==='bank'?activeS:btnS}>4. 匯款資訊</button>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        {/* 編輯區塊 1：產品特色 */}
        {tab === 'features' && (
          <div>
            <h3>🏔️ 四大理由編輯</h3>
            {[1, 2, 3, 4].map(num => (
              <div key={num} style={{ marginBottom: '15px' }}>
                <input placeholder={`特色 ${num} 標題`} style={inputS} value={content.features[`t${num}`]} onChange={e => setContent({...content, features: {...content.features, [`t${num}`]: e.target.value}})} />
                <textarea placeholder={`特色 ${num} 描述內容`} style={inputS} value={content.features[`d${num}`]} onChange={e => setContent({...content, features: {...content.features, [`d${num}`]: e.target.value}})} />
              </div>
            ))}
          </div>
        )}

        {/* 其他區塊以此類推... */}
        {tab === 'bank' && (
          <div>
            <h3>💳 匯款資訊 (即時同步前台綠色卡片)</h3>
            <input placeholder="銀行名稱" style={inputS} value={content.bank.name} onChange={e => setContent({...content, bank: {...content.bank, name: e.target.value}})} />
            <input placeholder="帳號" style={inputS} value={content.bank.account} onChange={e => setContent({...content, bank: {...content.bank, account: e.target.value}})} />
            <input placeholder="戶名" style={inputS} value={content.bank.holder} onChange={e => setContent({...content, bank: {...content.bank, holder: e.target.value}})} />
          </div>
        )}
        
        {/* 會員方案 */}
        {tab === 'membership' && (
          <div>
            <h3>💎 會員方案設定</h3>
            <input placeholder="入會費" style={inputS} value={content.membership.price} onChange={e => setContent({...content, membership: {...content.membership, price: e.target.value}})} />
            <textarea placeholder="方案說明" style={inputS} value={content.membership.desc} onChange={e => setContent({...content, membership: {...content.membership, desc: e.target.value}})} />
          </div>
        )}

        <button onClick={handleSave} style={saveBtn}>確認儲存並發布至前台</button>
      </div>
    </div>
  );
}

const btnS = { padding: '10px', flex: 1, cursor: 'pointer', border: '1px solid #ddd', background: '#eee' };
const activeS = { ...btnS, background: '#2D5016', color: '#fff' };
const inputS = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const saveBtn = { width: '100%', padding: '15px', background: '#E8836B', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
