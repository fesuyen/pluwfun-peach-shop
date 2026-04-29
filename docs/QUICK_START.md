# ⚡ Pluwfun Peach Shop 快速開始指南

本指南幫助您快速上手 Pluwfun 拉拉山五月桃銷售平台。

---

## 📦 檔案清單

解壓後您會看到以下結構：

```
pluwfun-cloud-deploy/
├── frontend/              # React 前端程式碼
├── backend/              # Node.js 後端程式碼
├── docs/                 # 文件
│   ├── DEPLOYMENT.md     # 完整部署指南 ⭐ 必讀
│   ├── API.md            # API 文件
│   ├── supabase-setup.sql # 資料庫初始化腳本
│   └── QUICK_START.md    # 本檔案
└── README.md             # 專案概述
```

---

## 🚀 5 分鐘快速部署

### 前置條件

- GitHub 帳號（username: `fesuyen`）
- Supabase 帳號
- Vercel 帳號
- Render 帳號
- Gmail 帳號（用於 Email 通知）

### 步驟 1：上傳程式碼到 GitHub（2 分鐘）

```bash
# 1. 初始化 Git
cd pluwfun-cloud-deploy
git init
git add .
git commit -m "Initial commit"

# 2. 推送到 GitHub
git remote add origin https://github.com/fesuyen/pluwfun-peach-shop.git
git branch -M main
git push -u origin main
```

### 步驟 2：設定 Supabase（2 分鐘）

1. 登入 https://supabase.com
2. 建立新 Project
3. 進入 SQL Editor，複製 `docs/supabase-setup.sql` 並執行
4. 建立 Storage Bucket：`order-screenshots`（設為 Public）
5. 複製 Project URL 和 anon key

### 步驟 3：部署後端到 Render（1 分鐘）

1. 登入 https://render.com
2. 建立 Web Service，連接 GitHub Repository
3. 設定 Root Directory：`backend`
4. 添加環境變數（見下表）
5. 部署

**環境變數**：
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
EMAIL_USER=pluwfun@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
NOTIFY_EMAIL=pluwfun@gmail.com
ADMIN_PASSWORD=pluwfun2025
```

### 步驟 4：部署前端到 Vercel（1 分鐘）

1. 登入 https://vercel.com
2. 建立 Project，連接 GitHub Repository
3. 設定 Root Directory：`frontend`
4. 添加環境變數：
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
5. 部署

✅ **完成！** 訪問 Vercel 提供的 URL 查看您的網站。

---

## 🔧 本地開發

### 安裝依賴

```bash
# 前端
cd frontend
npm install

# 後端
cd ../backend
npm install
```

### 配置環境變數

**前端** (`frontend/.env.local`)：
```env
VITE_API_URL=http://localhost:3001
```

**後端** (`backend/.env`)：
```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
EMAIL_USER=pluwfun@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
NOTIFY_EMAIL=pluwfun@gmail.com
ADMIN_PASSWORD=pluwfun2025
```

### 啟動開發伺服器

```bash
# 終端 1：後端
cd backend
npm start

# 終端 2：前端
cd frontend
npm run dev
```

訪問 http://localhost:5173

---

## 📝 常用命令

### 前端

```bash
cd frontend

# 開發模式
npm run dev

# 構建生產版本
npm run build

# 預覽構建結果
npm run preview

# 代碼檢查
npm run lint
```

### 後端

```bash
cd backend

# 啟動伺服器
npm start

# 開發模式（需安裝 nodemon）
npm install -D nodemon
npx nodemon index.js
```

---

## 🔐 重要提醒

### 密碼和 API 金鑰

- **後台管理密碼**：`pluwfun2025`（建議部署後修改）
- **Supabase Key**：不要洩露，僅在後端使用
- **Gmail 應用程式密碼**：不要洩露，僅在後端使用

### 環境變數

- 永遠不要將 `.env` 檔案提交到 Git
- 使用 `.env.example` 作為範本
- 在雲端平台（Vercel/Render）中設定實際的環境變數

---

## 🧪 測試功能

### 測試訂單提交

1. 訪問前台頁面
2. 填寫訂購表單
3. 提交訂單
4. 檢查 `pluwfun@gmail.com` 是否收到 Email 通知

### 測試後台管理

1. 訪問 `/admin`
2. 輸入密碼：`pluwfun2025`
3. 檢查儀表板統計
4. 查看剛提交的訂單

### 測試 API

```bash
# 取得網站內容
curl https://your-backend-url/api/content

# 取得統計（需認證）
curl https://your-backend-url/api/admin/stats \
  -H "Authorization: Bearer pluwfun2025"
```

---

## 🆘 常見問題

### Q：部署後前端無法連接後端

**A**：檢查 Vercel 環境變數 `VITE_API_URL` 是否指向正確的 Render 後端 URL。

### Q：Email 通知未收到

**A**：
1. 檢查 Gmail 應用程式密碼是否正確
2. 檢查 `NOTIFY_EMAIL` 環境變數
3. 查看 Render Logs 中的錯誤信息

### Q：Supabase 連接失敗

**A**：檢查 `SUPABASE_URL` 和 `SUPABASE_KEY` 是否正確，以及 Supabase Project 是否已啟動。

### Q：上傳的截圖無法訪問

**A**：確認 Supabase Storage Bucket `order-screenshots` 已設定為 Public。

---

## 📚 進階文件

- **完整部署指南**：見 [DEPLOYMENT.md](DEPLOYMENT.md)
- **API 文件**：見 [API.md](API.md)
- **資料庫設定**：見 [supabase-setup.sql](supabase-setup.sql)

---

## 📞 支援

如有問題，請：
1. 查看本指南的常見問題部分
2. 閱讀 [DEPLOYMENT.md](DEPLOYMENT.md) 的詳細說明
3. 聯絡：pluwfun@gmail.com

---

**祝您部署順利！** 🍑

最後更新：2026 年 4 月 29 日
