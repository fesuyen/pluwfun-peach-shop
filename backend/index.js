require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// ============ SUPABASE SETUP ============
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============ EMAIL SETUP ============
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Multer for file uploads (in-memory storage for Render)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ============ HELPER FUNCTIONS ============

async function generateOrderNumber() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  
  const { data, error } = await supabase
    .from('orders')
    .select('order_number')
    .like('order_number', `PF${dateStr}%`)
    .order('order_number', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Order number generation error:', error);
    return `PF${dateStr}001`;
  }

  const count = data && data.length > 0 ? parseInt(data[0].order_number.slice(-3)) + 1 : 1;
  return `PF${dateStr}${String(count).padStart(3, '0')}`;
}

async function sendOrderNotificationEmail(orderInfo) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL || 'pluwfun@gmail.com',
      subject: `🍑 新訂單通知 - ${orderInfo.order_number}`,
      html: `
        <h2>新訂單通知</h2>
        <p><strong>訂單編號：</strong> ${orderInfo.order_number}</p>
        <p><strong>客戶姓名：</strong> ${orderInfo.name}</p>
        <p><strong>聯絡電話：</strong> ${orderInfo.phone}</p>
        <p><strong>規格：</strong> ${orderInfo.spec}</p>
        <p><strong>數量：</strong> ${orderInfo.quantity} 盒</p>
        <p><strong>金額：</strong> NT$${orderInfo.total}</p>
        <p><strong>訂單時間：</strong> ${new Date().toLocaleString('zh-TW')}</p>
        <hr>
        <p>請登入後台管理系統進行確認和出貨處理。</p>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ 訂單通知郵件已寄送：${orderInfo.order_number}`);
  } catch (err) {
    console.error('❌ 郵件寄送失敗:', err);
  }
}

// ============ PUBLIC API ============

// Get site content
app.get('/api/content', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value');

    if (error) throw error;

    const content = {};
    data.forEach(r => { content[r.key] = r.value; });
    res.json(content);
  } catch (err) {
    console.error('Content fetch error:', err);
    res.status(500).json({ error: '無法取得內容' });
  }
});

// Submit order
app.post('/api/orders', upload.single('payment_screenshot'), async (req, res) => {
  try {
    const { name, phone, address, spec, quantity, unit_price, subtotal, box_fee, shipping_fee, total, transfer_last5, note } = req.body;
    
    if (!name || !phone || !address || !spec || !quantity) {
      return res.status(400).json({ error: '請填寫所有必填欄位' });
    }

    const id = uuidv4();
    const order_number = await generateOrderNumber();
    
    // Handle file upload if exists
    let payment_screenshot_url = null;
    if (req.file) {
      try {
        const fileName = `${Date.now()}-${uuidv4().slice(0, 8)}.${req.file.mimetype.split('/')[1]}`;
        const { error: uploadError } = await supabase.storage
          .from('order-screenshots')
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype
          });

        if (!uploadError) {
          const { data } = supabase.storage.from('order-screenshots').getPublicUrl(fileName);
          payment_screenshot_url = data.publicUrl;
        }
      } catch (uploadErr) {
        console.error('Screenshot upload error:', uploadErr);
      }
    }

    const { error } = await supabase
      .from('orders')
      .insert([{
        id,
        order_number,
        name,
        phone,
        address,
        spec,
        quantity: parseInt(quantity),
        unit_price: parseInt(unit_price),
        subtotal: parseInt(subtotal),
        box_fee: parseInt(box_fee),
        shipping_fee: parseInt(shipping_fee),
        total: parseInt(total),
        payment_method: '銀行轉帳',
        payment_screenshot: payment_screenshot_url,
        transfer_last5: transfer_last5 || null,
        note: note || null,
        payment_status: '待確認',
        shipping_status: '待出貨',
        order_status: '待確認'
      }]);

    if (error) throw error;

    // Send notification email
    await sendOrderNotificationEmail({ order_number, name, spec, quantity, total });

    res.json({ success: true, order_number, message: '訂單已成功送出！' });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: '訂單建立失敗，請稍後再試' });
  }
});

// Submit membership
app.post('/api/members', async (req, res) => {
  try {
    const { name, phone, email, note } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: '請填寫姓名與電話' });
    }

    const { error } = await supabase
      .from('members')
      .insert([{
        id: uuidv4(),
        name,
        phone,
        email: email || null,
        note: note || null
      }]);

    if (error) throw error;

    res.json({ success: true, message: '會員申請已送出！我們將盡快與您聯繫。' });
  } catch (err) {
    console.error('Member creation error:', err);
    res.status(500).json({ error: '會員申請失敗，請稍後再試' });
  }
});

// ============ ADMIN API ============

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pluwfun2025';

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: '未授權' });
  }
  next();
}

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: '密碼錯誤' });
  }
});

// Get all orders
app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ error: '無法取得訂單列表' });
  }
});

// Get single order
app.get('/api/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: '訂單不存在' });
    res.json(data);
  } catch (err) {
    console.error('Order fetch error:', err);
    res.status(500).json({ error: '無法取得訂單' });
  }
});

// Update order status
app.patch('/api/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const { order_status, payment_status, shipping_status } = req.body;

    const { error } = await supabase
      .from('orders')
      .update({
        order_status: order_status || undefined,
        payment_status: payment_status || undefined,
        shipping_status: shipping_status || undefined
      })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: '狀態已更新' });
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ error: '狀態更新失敗' });
  }
});

// Get all members
app.get('/api/admin/members', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Members fetch error:', err);
    res.status(500).json({ error: '無法取得會員列表' });
  }
});

// Dashboard stats
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const { data: todayData } = await supabase
      .from('orders')
      .select('id')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    const { data: revenueData } = await supabase
      .from('orders')
      .select('total');

    const { data: pendingData } = await supabase
      .from('orders')
      .select('id')
      .eq('order_status', '待確認');

    const { data: allOrdersData } = await supabase
      .from('orders')
      .select('id');

    const { data: membersData } = await supabase
      .from('members')
      .select('id');

    const todayOrders = todayData ? todayData.length : 0;
    const totalRevenue = revenueData ? revenueData.reduce((sum, o) => sum + (o.total || 0), 0) : 0;
    const pendingOrders = pendingData ? pendingData.length : 0;
    const totalOrders = allOrdersData ? allOrdersData.length : 0;
    const totalMembers = membersData ? membersData.length : 0;

    res.json({ todayOrders, totalRevenue, pendingOrders, totalOrders, totalMembers });
  } catch (err) {
    console.error('Stats fetch error:', err);
    res.status(500).json({ error: '無法取得統計數據' });
  }
});

// Poll for new orders
app.get('/api/admin/poll', adminAuth, async (req, res) => {
  try {
    const since = req.query.since || '2000-01-01';

    const { data: newOrders } = await supabase
      .from('orders')
      .select('id, order_number, name, spec, quantity, total, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    const { data: pendingData } = await supabase
      .from('orders')
      .select('id')
      .eq('order_status', '待確認');

    res.json({
      newOrders: newOrders || [],
      pendingCount: pendingData ? pendingData.length : 0,
      serverTime: new Date().toISOString()
    });
  } catch (err) {
    console.error('Poll error:', err);
    res.status(500).json({ error: '無法取得新訂單' });
  }
});

// ============ CONTENT MANAGEMENT API ============

// Get all content
app.get('/api/admin/content', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value, updated_at')
      .order('key');

    if (error) throw error;

    const content = {};
    data.forEach(r => { content[r.key] = { value: r.value, updated_at: r.updated_at }; });
    res.json(content);
  } catch (err) {
    console.error('Content fetch error:', err);
    res.status(500).json({ error: '無法取得內容' });
  }
});

// Update content
app.put('/api/admin/content', adminAuth, async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      await supabase
        .from('site_content')
        .upsert({ key, value }, { onConflict: 'key' });
    }

    res.json({ success: true, message: '內容已更新' });
  } catch (err) {
    console.error('Content update error:', err);
    res.status(500).json({ error: '內容更新失敗' });
  }
});

// ============ SYSTEM SETTINGS API ============

// Get system settings
app.get('/api/admin/settings', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .order('key');

    if (error) throw error;

    const settings = {};
    data.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err) {
    console.error('Settings fetch error:', err);
    res.status(500).json({ error: '無法取得系統設定' });
  }
});

// Update system settings
app.put('/api/admin/settings', adminAuth, async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      await supabase
        .from('system_settings')
        .upsert({ key, value: String(value) }, { onConflict: 'key' });
    }

    res.json({ success: true, message: '系統設定已更新' });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ error: '系統設定更新失敗' });
  }
});

// ============ HEALTH CHECK ============

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ START SERVER ============

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🍑 Pluwfun Peach Backend running on port ${PORT}`);
});
