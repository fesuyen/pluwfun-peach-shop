# ✅ Pluwfun Peach Shop 部署檢查清單

使用此清單確保部署過程中不遺漏任何步驟。

---

## 📋 部署前準備

- [ ] 已有 GitHub 帳號（username: `fesuyen`）
- [ ] 已有 Supabase 帳號
- [ ] 已有 Vercel 帳號
- [ ] 已有 Render 帳號
- [ ] 已有 Gmail 帳號
- [ ] 已取得 Gmail 應用程式密碼

---

## 🔧 步驟 1：GitHub 設定

- [ ] 建立新 Repository：`pluwfun-peach-shop`
- [ ] Repository 設定為 Public
- [ ] 初始化本地 Git 倉庫
- [ ] 推送程式碼到 GitHub

**命令**：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/fesuyen/pluwfun-peach-shop.git
git branch -M main
git push -u origin main
```

---

## 🗄️ 步驟 2：Supabase 設定

### 建立 Project

- [ ] 登入 Supabase
- [ ] 建立新 Project
- [ ] 選擇地區（建議 Singapore）
- [ ] 設定安全密碼

### 建立資料庫表

- [ ] 進入 SQL Editor
- [ ] 複製 `docs/supabase-setup.sql` 內容
- [ ] 執行 SQL 腳本
- [ ] 確認所有表已建立

### 建立 Storage Bucket

- [ ] 進入 Storage 頁面
- [ ] 建立 Bucket：`order-screenshots`
- [ ] 設定為 **Public**

### 取得 API 金鑰

- [ ] 進入 Settings → API
- [ ] 複製 **Project URL** → 記為 `SUPABASE_URL`
- [ ] 複製 **anon public key** → 記為 `SUPABASE_KEY`

---

## 🎯 步驟 3：後端部署（Render）

### 連接 GitHub

- [ ] 登入 Render
- [ ] 建立 Web Service
- [ ] 選擇 `pluwfun-peach-shop` Repository
- [ ] 授權 Render 存取 GitHub

### 設定部署參數

- [ ] Name：`pluwfun-peach-backend`
- [ ] Root Directory：`backend`
- [ ] Runtime：`Node`
- [ ] Build Command：`npm install`
- [ ] Start Command：`npm start`

### 設定環境變數

在 Render 環境變數中添加：

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3001`
- [ ] `SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `SUPABASE_KEY` = `your-anon-key`
- [ ] `EMAIL_USER` = `pluwfun@gmail.com`
- [ ] `EMAIL_PASSWORD` = `your-gmail-app-password`
- [ ] `NOTIFY_EMAIL` = `pluwfun@gmail.com`
- [ ] `ADMIN_PASSWORD` = `pluwfun2025`

### 部署

- [ ] 點擊「Create Web Service」
- [ ] 等待部署完成（2-3 分鐘）
- [ ] 複製後端 URL → 記為 `BACKEND_URL`

---

## 🌐 步驟 4：前端部署（Vercel）

### 連接 GitHub

- [ ] 登入 Vercel
- [ ] 建立 Project
- [ ] 選擇 `pluwfun-peach-shop` Repository
- [ ] 授權 Vercel 存取 GitHub

### 設定部署參數

- [ ] Framework：`Vite`
- [ ] Root Directory：`frontend`
- [ ] Build Command：`npm run build`
- [ ] Output Directory：`dist`

### 設定環境變數

- [ ] `VITE_API_URL` = `https://pluwfun-peach-backend.onrender.com`（或您的 Render URL）

### 部署

- [ ] 點擊「Deploy」
- [ ] 等待部署完成
- [ ] 複製前端 URL → 記為 `FRONTEND_URL`

---

## 🧪 步驟 5：測試

### 前台測試

- [ ] 訪問 `FRONTEND_URL`
- [ ] 檢查所有區塊是否正常顯示
- [ ] 檢查圖片是否載入
- [ ] 測試導航和滾動動畫

### 訂單提交測試

- [ ] 填寫訂購表單
- [ ] 提交訂單
- [ ] 檢查是否看到成功訊息
- [ ] 檢查 `pluwfun@gmail.com` 是否收到 Email 通知

### 後台測試

- [ ] 訪問 `FRONTEND_URL/admin`
- [ ] 輸入密碼：`pluwfun2025`
- [ ] 檢查儀表板統計是否更新
- [ ] 查看剛提交的訂單
- [ ] 測試訂單狀態更新
- [ ] 檢查會員列表
- [ ] 測試內容管理功能

### API 測試

- [ ] 測試 GET `/api/content`
- [ ] 測試 POST `/api/orders`
- [ ] 測試 GET `/api/admin/stats`（需認證）

---

## 📝 部署後配置

### 更新重要資訊

- [ ] 修改後台管理密碼（`ADMIN_PASSWORD`）
- [ ] 確認 Email 通知地址正確
- [ ] 檢查匯款帳號資訊是否需要更新

### 監控和維護

- [ ] 設定 Vercel 部署通知
- [ ] 設定 Render 部署通知
- [ ] 定期檢查 Logs
- [ ] 監控 Supabase 使用量

---

## 🔐 安全檢查

- [ ] 確認 `.env` 檔案未提交到 Git
- [ ] 確認 Supabase Storage Bucket 設定正確
- [ ] 確認後台密碼已修改
- [ ] 確認 Email 密碼已正確設定
- [ ] 啟用 GitHub 兩步驟驗證

---

## 📞 常見問題排查

### 前端無法連接後端

- [ ] 檢查 Vercel 環境變數 `VITE_API_URL`
- [ ] 檢查 Render 後端是否運行
- [ ] 檢查 CORS 設定
- [ ] 查看瀏覽器 Console 錯誤

### Email 通知未收到

- [ ] 檢查 Gmail 應用程式密碼
- [ ] 檢查 `NOTIFY_EMAIL` 環境變數
- [ ] 查看 Render Logs
- [ ] 檢查 Gmail 垃圾郵件資料夾

### 資料庫連接失敗

- [ ] 檢查 `SUPABASE_URL` 和 `SUPABASE_KEY`
- [ ] 確認 Supabase Project 已啟動
- [ ] 查看 Render Logs 中的錯誤

---

## 📊 部署完成檢查表

部署完成後，確認以下項目：

| 項目 | 狀態 | 備註 |
|------|------|------|
| 前台頁面正常顯示 | ✅/❌ | |
| 後台管理可訪問 | ✅/❌ | |
| 訂單提交功能 | ✅/❌ | |
| Email 通知 | ✅/❌ | |
| 會員申請功能 | ✅/❌ | |
| 內容管理功能 | ✅/❌ | |
| 系統設定頁面 | ✅/❌ | |
| 所有圖片載入 | ✅/❌ | |
| 響應式設計 | ✅/❌ | 手機、平板、桌面 |

---

## 🎉 部署完成

恭喜！您已成功部署 Pluwfun Peach Shop。

### 後續步驟

1. **分享您的網站**
   - 前台：`FRONTEND_URL`
   - 後台：`FRONTEND_URL/admin`

2. **定期維護**
   - 監控訂單和會員
   - 更新網站內容
   - 檢查系統日誌

3. **進階功能**
   - 整合 LINE Pay 金流
   - 整合 LINE 官方帳號
   - 新增 AI 聊天機器人

---

## 📞 支援

如有問題，請參考：
- [快速開始指南](docs/QUICK_START.md)
- [完整部署指南](docs/DEPLOYMENT.md)
- [API 文件](docs/API.md)

或聯絡：pluwfun@gmail.com

---

**最後更新**：2026 年 4 月 29 日
