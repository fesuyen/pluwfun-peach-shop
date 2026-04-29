-- ============ ORDERS TABLE ============
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  spec TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  box_fee INTEGER NOT NULL,
  shipping_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  payment_method TEXT DEFAULT '銀行轉帳',
  payment_screenshot TEXT,
  transfer_last5 TEXT,
  note TEXT,
  payment_status TEXT DEFAULT '待確認',
  shipping_status TEXT DEFAULT '待出貨',
  order_status TEXT DEFAULT '待確認'
);

-- ============ MEMBERS TABLE ============
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  note TEXT
);

-- ============ SITE CONTENT TABLE ============
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ SYSTEM SETTINGS TABLE ============
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ INSERT DEFAULT CONTENT ============
INSERT INTO site_content (key, value) VALUES
  ('hero_title', '拉拉山五月桃'),
  ('hero_title_highlight', 'SSS級生化甜度'),
  ('hero_title_suffix', '產地直送'),
  ('hero_subtitle', '飛鼠嚴選 · 雪霧鬧部落達利阿伯親手採收'),
  ('hero_badge', '🍑 2026 限量預購中'),
  ('feature1_title', '拉拉山雪霧鬧：達利阿伯的鮮採承諾'),
  ('feature1_desc', '來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園。每一顆水蜜桃，都是他親手摘下、嚴格挑選的驕傲。我們堅持產地直送，不經過層層盤商，將這份帶著晨露的新鮮與清甜，直接送到您的手中。這不僅是拉拉山最道地的滋味，更是我們對品質最真誠的保證。'),
  ('feature2_title', '堅持「七分熟」職人採收標準，鎖住拉拉山最完美的鮮甜'),
  ('feature2_desc', '品味 SSS 級五月桃，關鍵在於「採收時機」。我們堅持七分熟採收，確保宅配過程中果肉熟實不變色。若採收達八、九分熟，經過一天物流配送，極易軟爛甚至變質損壞。買桃再享點數折抵，把最安心的高品質帶回家！'),
  ('feature3_title', '超級規格任選，送禮自用的尊榮首選'),
  ('feature3_desc', '提供 6、8、10、12 粒精選規格，每盒淨重足 2 斤 4 兩至 2 斤 6 兩，展現產地直送的誠信品質。不論尊榮送禮或自用皆宜，會員預購每盒可扣抵 50 飛鼠幣，讓這份來自拉拉山的鮮甜，成為您解鎖 38 家名店的消費燃料！'),
  ('feature4_title', '1,999 元入會享六千回饋，保證解鎖豪華露營 0 元入住！'),
  ('feature4_desc', '品嚐 SSS 級五月桃，入會享六千回饋：豪華露營平日 0 元住、二千元消費金通行 38 家名店。買桃每盒扣 50 元，假日入住折 399 元。限 200 名，即刻入會領取山林通行證！'),
  ('farmer_title', '拉拉山雪霧鬧：達利阿伯的鮮採承諾'),
  ('farmer_story', '來自拉拉山雪霧鬧部落的達利阿伯，用一輩子的經驗守護這片果園。每一顆水蜜桃，都是他親手摘下、嚴格挑選的驕傲。我們堅持產地直送，不經過層層盤商，將這份帶著晨露的新鮮與清甜，直接送到您的手中。'),
  ('product_short_summary', '挑戰味蕾極限！拉拉山產地直送五月桃，保證品質。6 到 12 粒多種規格任選，立即加入會員，解鎖超值專屬回饋，享受頂級水蜜桃與尊榮禮遇的完美結合。'),
  ('product_long_summary', '品嚐真正的頂級水蜜桃，就從 pluwfun 開始！來自拉拉山雪霧鬧部落，由在地農民達利阿伯嚴格把關、親手採收。產地新鮮直送，保證每一口都是爆汁甜美。無論您需要 6 粒裝的精緻，還是 12 粒裝的澎湃，多種規格完美滿足送禮與自用需求。這不僅是一盒水蜜桃，更是一把開啟尊榮體驗的鑰匙。加入會員，立即享有超過六千元價值的超狂回饋，包含飛鼠不渴豪華帳篷平日入住券與豐富飛鼠幣，讓頂級果香與奢華露營體驗一次擁有！'),
  ('product_why_choose', 'pluwfun 重新定義了農產品的價值！我們拒絕妥協，堅持由雪霧鬧部落的達利阿伯親手採收，產地直採確保無可挑剔的品質。但我們給您的遠不止於此——這是一個限量 200 席的專屬俱樂部。加入會員，您不僅買到頂級水蜜桃，更直接獲得豪華露營體驗，以及串聯復興區 38 家店家的飛鼠幣生態圈。這是一場結合頂級農產、深度旅遊與在地消費的全新體驗。名額極度稀缺，選擇 pluwfun，就是選擇最聰明、最具價值的品味生活！'),
  ('faq1_q', '這是抽獎嗎？'),
  ('faq1_a', '不是！入會即 100% 保證獲得所有權益。每一項福利都是確定的，沒有任何抽獎機制。'),
  ('faq2_q', '0元入住券怎麼使用？'),
  ('faq2_a', '入會後系統自動派發至帳戶，預約平日即可兌換入住。豪華帳篷價值 $3,600，完全免費體驗。'),
  ('faq3_q', '飛鼠幣可以用在哪裡？'),
  ('faq3_a', '復興區 38 家合作店家皆可使用，等同現金。包含餐廳、民宿、伴手禮店等多元消費場所。'),
  ('faq4_q', '桃子什麼時候出貨？'),
  ('faq4_a', '現採現出，依訂單順序安排，約 3-5 個工作天送達。我們堅持最新鮮的品質送到您手中。'),
  ('faq5_q', '可以指定到貨日嗎？'),
  ('faq5_a', '可在備註欄註明希望到貨日，我們盡量配合。但因水蜜桃為鮮果，實際出貨仍以果園採收狀況為準。')
ON CONFLICT (key) DO NOTHING;

-- ============ INSERT DEFAULT SYSTEM SETTINGS ============
INSERT INTO system_settings (key, value) VALUES
  ('linepay_channel_id', ''),
  ('linepay_channel_secret', ''),
  ('linepay_enabled', 'false'),
  ('line_channel_access_token', ''),
  ('line_notify_enabled', 'false')
ON CONFLICT (key) DO NOTHING;

-- ============ CREATE STORAGE BUCKET ============
-- 在 Supabase 控制台手動建立 "order-screenshots" bucket，設為公開
