import { useState } from 'react'

const faqs = [
  {
    q: '這是抽獎嗎？',
    a: '不是！入會即 100% 保證獲得所有權益。每一項福利都是確定的，沒有任何抽獎機制。',
  },
  {
    q: '0元入住券怎麼使用？',
    a: '入會後系統自動派發至帳戶，預約平日即可兌換入住。豪華帳篷價值 $3,600，完全免費體驗。',
  },
  {
    q: '飛鼠幣可以用在哪裡？',
    a: '復興區 38 家合作店家皆可使用，等同現金。包含餐廳、民宿、伴手禮店等多元消費場所。',
  },
  {
    q: '桃子什麼時候出貨？',
    a: '現採現出，依訂單順序安排，約 3-5 個工作天送達。我們堅持最新鮮的品質送到您手中。',
  },
  {
    q: '可以指定到貨日嗎？',
    a: '可在備註欄註明希望到貨日，我們盡量配合。但因水蜜桃為鮮果，實際出貨仍以果園採收狀況為準。',
  },
  {
    q: '為什麼比市面上貴？',
    a: '拉拉山海拔 1,500 公尺以上，日夜溫差大，生長期長，甜度自然高。在地農民手工採收，非機器大量採摘。產地直送，不經盤商，品質有保障。每盒淨重足 2 斤 4 兩至 2 斤 6 兩，用料實在。您買到的不只是水蜜桃，更是一份對品質的堅持。',
  },
  {
    q: '收到桃子後如何保存？',
    a: '收到後請先開箱檢查。尚未熟透的桃子放室溫 1-2 天催熟；熟透後放冰箱冷藏，建議 3 天內食用完畢。食用前 30 分鐘取出回溫，風味最佳。',
  },
]

function FAQItem({ q, a, isOpen, onClick }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      transition: 'all 0.3s',
      border: isOpen ? '1px solid #E8836B40' : '1px solid transparent',
    }}>
      <button onClick={onClick} style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
      }}>
        <span style={{
          fontSize: 15,
          fontWeight: 600,
          color: isOpen ? 'var(--peach)' : 'var(--text-dark)',
          transition: 'color 0.3s',
        }}>
          Q: {q}
        </span>
        <span style={{
          fontSize: 20,
          color: 'var(--peach)',
          transition: 'transform 0.3s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          flexShrink: 0,
          marginLeft: 12,
        }}>+</span>
      </button>
      <div style={{
        maxHeight: isOpen ? 300 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease, padding 0.4s ease',
        padding: isOpen ? '0 20px 16px' : '0 20px',
      }}>
        <p style={{
          fontSize: 14,
          color: 'var(--text-mid)',
          lineHeight: 1.8,
        }}>{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <section id="faq" style={{
      padding: '60px 0',
      background: '#fff',
    }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #4A7C2E20, #2D501620)',
            padding: '5px 18px', borderRadius: 20, fontSize: 12,
            color: 'var(--green)', fontWeight: 600, letterSpacing: 2, marginBottom: 12,
          }}>FAQ</div>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800,
            color: 'var(--green-deep)', marginBottom: 8,
          }}>常見問題</h2>
          <p style={{ color: 'var(--text-mid)', fontSize: 15 }}>有任何疑問？我們為您解答</p>
        </div>

        <div className="animate-on-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIdx === i}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
