# 🍑 Pluwfun Peach Shop - 拉拉山五月桃銷售平台

專業的農產品電商網站，展示拉拉山雪霧鬧部落達利阿伯的頂級五月桃。

## 📋 專案結構

```
pluwfun-cloud-deploy/
├── frontend/              # React 前端（Vercel 部署）
│   ├── src/              # 源代碼
│   ├── public/           # 靜態資源
│   ├── vite.config.js    # Vite 設定
│   ├── vercel.json       # Vercel 部署設定
│   ├── package.json      # 依賴管理
│   └── .env.example      # 環境變數範本
├── backend/              # Node.js 後端（Render 部署）
│   ├── index.js          # 主程式
│   ├── package.json      # 依賴管理
│   ├── render.yaml       # Render 部署設定
│   ├── .env.example      # 環境變數範本
│   └── .gitignore
├── docs/                 # 文件
│   ├── DEPLOYMENT.md     # 部署步驟說明
│   ├── supabase-setup.sql # Supabase 資料庫初始化
│   └── API.md            # API 文件
└── README.md             # 本檔案
```

## 🚀 快速開始

### 本地開發

1. **克隆專案**
```bash
git clone https://github.com/fesuyen/pluwfun-peach-shop.git
cd pluwfun-peach-shop
```

2. **安裝依賴**
```bash
# 前端
cd frontend
npm install

# 後端（另開終端）
cd backend
npm install
```

3. **設定環境變數**
```bash
# 前端
cd frontend
cp .env.example .env.local
# 編輯 .env.local，設定 VITE_API_URL=http://localhost:3001

# 後端
cd backend
cp .env.example .env
# 編輯 .env，填入 Supabase 和 Email 設定
```

4. **啟動開發伺服器**
```bash
# 後端（終端 1）
cd backend
npm start

# 前端（終端 2）
cd frontend
npm run dev
```

訪問 http://localhost:5173

## 🌐 雲端部署

詳細部署步驟請見 [DEPLOYMENT.md](docs/DEPLOYMENT.md)

### 部署架構

- **前端**：Vercel（免費）
- **後端**：Render（免費）
- **資料庫**：Supabase PostgreSQL（免費）
- **檔案存儲**：Supabase Storage（免費）
- **Email 通知**：Gmail + Nodemailer

## 📝 功能特性

### 前台（銷售落地頁）
- ✅ Hero 首圖區
- ✅ 產品特色展示（4 大特色）
- ✅ 農民故事介紹
- ✅ 品質承諾說明
- ✅ 訂購流程展示
- ✅ 線上訂購表單
- ✅ 顧客評價展示
- ✅ 會員方案介紹
- ✅ FAQ 常見問題
- ✅ 響應式設計（RWD）

### 後台管理系統
- ✅ 儀表板（統計數據）
- ✅ 訂單管理（列表、詳情、狀態更新）
- ✅ 會員管理
- ✅ 內容管理（可編輯所有前台文案和圖片）
- ✅ 系統設定（LINE Pay、LINE 官方帳號）
- ✅ 新訂單 Email 通知

## 🔐 安全性

- 後端 API 使用密碼認證
- 環境變數管理敏感資訊
- 檔案上傳大小限制
- CORS 跨域設定

## 📞 聯絡資訊

- **GitHub**：https://github.com/fesuyen/pluwfun-peach-shop
- **Email**：pluwfun@gmail.com

## 📄 授權

MIT License

---

**最後更新**：2026 年 4 月
