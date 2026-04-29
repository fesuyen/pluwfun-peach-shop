# 🚀 Pluwfun Peach Shop 雲端部署完整指南

本文件詳細說明如何將 Pluwfun 拉拉山五月桃銷售平台部署到雲端。

## 📋 部署架構

```
┌─────────────────────────────────────────────────────────────┐
│                        用戶訪問                              │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   ┌────▼──────┐                   ┌─────▼──────┐
   │  Vercel   │                   │   Render   │
   │ (前端)    │                   │  (後端)    │
   └────┬──────┘                   └─────┬──────┘
        │                                 │
        │                          ┌──────▼──────────┐
        │                          │   Supabase      │
        │                          │ - PostgreSQL    │
        │                          │ - Storage       │
        │                          └─────────────────┘
        │
   ┌────▼──────────────┐
   │  Email Service    │
   │ (Gmail + Node)    │
   └───────────────────┘
```

## 🔧 前置準備

### 1. GitHub 帳號設定

- **GitHub Username**：fesuyen
- **Repository**：pluwfun-peach-shop
- **Email**：chowearyean@gmail.com

**步驟**：
1. 登入 GitHub 帳號
2. 建立新的 Repository：`pluwfun-peach-shop`
3. 設定為 Public（方便 Vercel 和 Render 連接）

### 2. Supabase 帳號設定

1. 訪問 https://supabase.com
2. 使用 GitHub 帳號登入
3. 建立新的 Project
   - Project Name：`pluwfun-peach`
   - Region：選擇最近的地區（如 Singapore）
   - Password：設定安全密碼

### 3. Vercel 帳號設定

1. 訪問 https://vercel.com
2. 使用 GitHub 帳號登入
3. 授權 Vercel 存取 GitHub

### 4. Render 帳號設定

1. 訪問 https://render.com
2. 使用 GitHub 帳號登入
3. 授權 Render 存取 GitHub

### 5. Gmail 應用程式密碼

為了讓 Nodemailer 安全地寄送郵件：

1. 訪問 https://myaccount.google.com/security
2. 啟用「兩步驟驗證」（如未啟用）
3. 在「應用程式密碼」中建立新密碼
   - 應用程式：Mail
   - 裝置：Windows PC（或其他）
4. 複製生成的 16 字元密碼

---

## 📦 步驟 1：上傳程式碼到 GitHub

### 1.1 初始化本地 Git 倉庫

```bash
cd pluwfun-cloud-deploy
git init
git add .
git commit -m "Initial commit: Pluwfun Peach Shop"
```

### 1.2 推送到 GitHub

```bash
git remote add origin https://github.com/fesuyen/pluwfun-peach-shop.git
git branch -M main
git push -u origin main
```

---

## 🗄️ 步驟 2：設定 Supabase 資料庫

### 2.1 建立資料庫表

1. 登入 Supabase 控制台
2. 進入 SQL Editor
3. 複製 [supabase-setup.sql](supabase-setup.sql) 的內容
4. 貼入 SQL Editor 並執行

### 2.2 建立 Storage Bucket

1. 進入 Storage 頁面
2. 建立新 Bucket：`order-screenshots`
3. 設定為 **Public**（允許公開訪問上傳的截圖）

### 2.3 取得 API 金鑰

1. 進入 Settings → API
2. 複製以下資訊：
   - **Project URL**：`SUPABASE_URL`
   - **anon public key**：`SUPABASE_KEY`

---

## 🎯 步驟 3：部署後端到 Render

### 3.1 連接 GitHub Repository

1. 登入 Render
2. 點擊「New +」→ 「Web Service」
3. 選擇「Connect a repository」
4. 授權並選擇 `pluwfun-peach-shop` Repository
5. 選擇 Branch：`main`

### 3.2 設定部署參數

| 欄位 | 值 |
|------|-----|
| Name | `pluwfun-peach-backend` |
| Root Directory | `backend` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |

### 3.3 設定環境變數

在 Render 控制台的 Environment 中添加以下變數：

```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
EMAIL_USER=pluwfun@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
NOTIFY_EMAIL=pluwfun@gmail.com
ADMIN_PASSWORD=pluwfun2025
```

### 3.4 部署

1. 點擊「Create Web Service」
2. 等待部署完成（通常 2-3 分鐘）
3. 複製生成的 URL：`https://pluwfun-peach-backend.onrender.com`

⚠️ **注意**：Render 免費方案會在 15 分鐘無流量後休眠，首次訪問會有延遲。

---

## 🌐 步驟 4：部署前端到 Vercel

### 4.1 連接 GitHub Repository

1. 登入 Vercel
2. 點擊「Add New...」→ 「Project」
3. 選擇 `pluwfun-peach-shop` Repository
4. 點擊「Import」

### 4.2 設定部署參數

| 欄位 | 值 |
|------|-----|
| Framework | `Vite` |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 4.3 設定環境變數

在 Vercel 控制台的 Environment Variables 中添加：

```env
VITE_API_URL=https://pluwfun-peach-backend.onrender.com
```

### 4.4 部署

1. 點擊「Deploy」
2. 等待部署完成
3. 複製生成的 URL：`https://pluwfun-peach-shop.vercel.app`

---

## ✅ 步驟 5：測試部署

### 5.1 測試前台

1. 訪問 Vercel 前端 URL
2. 檢查所有區塊是否正常顯示
3. 測試訂購表單提交

### 5.2 測試後台

1. 訪問 `/admin` 路由
2. 輸入密碼：`pluwfun2025`
3. 檢查儀表板、訂單、會員等功能

### 5.3 測試 Email 通知

1. 在前台提交一份測試訂單
2. 檢查 `pluwfun@gmail.com` 是否收到通知郵件

---

## 🔄 後續維護

### 更新程式碼

```bash
# 本地修改後推送到 GitHub
git add .
git commit -m "Update: 描述變更內容"
git push origin main

# Vercel 和 Render 會自動部署
```

### 更新環境變數

**Vercel**：
1. 進入 Project Settings → Environment Variables
2. 修改或新增變數
3. 重新部署（Deployments → Redeploy）

**Render**：
1. 進入 Service → Environment
2. 修改或新增變數
3. 自動重新部署

### 監控和調試

**Vercel Logs**：
- 進入 Deployments 查看構建日誌
- 進入 Functions 查看運行時日誌

**Render Logs**：
- 進入 Service → Logs 查看實時日誌

---

## 🆘 常見問題

### Q1：部署後前端無法連接後端

**解決**：
1. 檢查 Vercel 環境變數 `VITE_API_URL` 是否正確
2. 檢查 Render 後端是否正常運行
3. 檢查 CORS 設定（後端應已啟用）

### Q2：Email 通知未收到

**解決**：
1. 檢查 Gmail 應用程式密碼是否正確
2. 檢查 `NOTIFY_EMAIL` 環境變數
3. 查看 Render Logs 中的 Email 相關錯誤

### Q3：Supabase 連接失敗

**解決**：
1. 檢查 `SUPABASE_URL` 和 `SUPABASE_KEY` 是否正確
2. 確認 Supabase Project 已啟動
3. 檢查防火牆設定

### Q4：上傳的訂單截圖無法訪問

**解決**：
1. 確認 Supabase Storage Bucket 設定為 Public
2. 檢查檔案上傳是否成功（查看 Render Logs）

---

## 📊 成本估算

| 服務 | 免費額度 | 成本 |
|------|--------|------|
| Vercel | 無限制 | **$0** |
| Render | 750 小時/月 | **$0** |
| Supabase | 500MB 存儲 | **$0** |
| Gmail | 無限制 | **$0** |
| **總計** | | **$0/月** |

---

## 🔐 安全建議

1. **定期更新密碼**
   - 後台管理密碼：`ADMIN_PASSWORD`
   - Supabase 密碼

2. **啟用 GitHub 兩步驟驗證**
   - 防止帳號被盜

3. **定期備份資料**
   - Supabase 提供自動備份

4. **監控 Email 配額**
   - Gmail 免費帳號有每日發送限制（通常 500 封）

---

## 📞 技術支援

如有問題，請：
1. 查看 [常見問題](#常見問題) 部分
2. 檢查 Vercel/Render 的官方文件
3. 聯絡：pluwfun@gmail.com

---

**最後更新**：2026 年 4 月 29 日
