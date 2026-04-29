# 📡 Pluwfun Peach Shop API 文件

## 基礎資訊

- **基礎 URL**（生產）：`https://pluwfun-peach-backend.onrender.com`
- **基礎 URL**（開發）：`http://localhost:3001`
- **認證方式**：Bearer Token（後台 API）

---

## 🔓 公開 API

### 1. 取得網站內容

**端點**：`GET /api/content`

**描述**：取得所有前台頁面的文案和設定

**回應**：
```json
{
  "hero_title": "拉拉山五月桃",
  "hero_title_highlight": "SSS級生化甜度",
  "feature1_title": "拉拉山雪霧鬧：達利阿伯的鮮採承諾",
  "feature1_desc": "...",
  ...
}
```

---

### 2. 提交訂單

**端點**：`POST /api/orders`

**Content-Type**：`multipart/form-data`

**請求參數**：
| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | ✅ | 客戶姓名 |
| phone | string | ✅ | 聯絡電話 |
| address | string | ✅ | 收貨地址 |
| spec | string | ✅ | 規格（如 "6粒裝"） |
| quantity | number | ✅ | 數量 |
| unit_price | number | ✅ | 單價 |
| subtotal | number | ✅ | 小計 |
| box_fee | number | ✅ | 禮盒費 |
| shipping_fee | number | ✅ | 運費 |
| total | number | ✅ | 總金額 |
| transfer_last5 | string | ❌ | 轉帳末五碼 |
| note | string | ❌ | 備註 |
| payment_screenshot | file | ❌ | 匯款截圖 |

**成功回應**（201）：
```json
{
  "success": true,
  "order_number": "PF20260429001",
  "message": "訂單已成功送出！"
}
```

**錯誤回應**（400）：
```json
{
  "error": "請填寫所有必填欄位"
}
```

**觸發事件**：
- 寄送 Email 通知到 `pluwfun@gmail.com`
- 更新後台儀表板統計

---

### 3. 提交會員申請

**端點**：`POST /api/members`

**Content-Type**：`application/json`

**請求參數**：
| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| name | string | ✅ | 姓名 |
| phone | string | ✅ | 電話 |
| email | string | ❌ | Email |
| note | string | ❌ | 備註 |

**成功回應**（200）：
```json
{
  "success": true,
  "message": "會員申請已送出！我們將盡快與您聯繫。"
}
```

---

## 🔐 後台管理 API

所有後台 API 需在 Header 中提供認證 Token：

```
Authorization: Bearer pluwfun2025
```

### 1. 管理員登入

**端點**：`POST /api/admin/login`

**請求**：
```json
{
  "password": "pluwfun2025"
}
```

**成功回應**：
```json
{
  "success": true,
  "token": "pluwfun2025"
}
```

---

### 2. 取得儀表板統計

**端點**：`GET /api/admin/stats`

**認證**：需要

**回應**：
```json
{
  "todayOrders": 5,
  "totalRevenue": 49950,
  "pendingOrders": 2,
  "totalOrders": 15,
  "totalMembers": 8
}
```

---

### 3. 取得所有訂單

**端點**：`GET /api/admin/orders`

**認證**：需要

**查詢參數**：無

**回應**：
```json
[
  {
    "id": "uuid-string",
    "order_number": "PF20260429001",
    "created_at": "2026-04-29T10:30:00Z",
    "name": "王小明",
    "phone": "0912345678",
    "address": "台北市中山區...",
    "spec": "6粒裝",
    "quantity": 2,
    "unit_price": 1999,
    "subtotal": 3998,
    "box_fee": 100,
    "shipping_fee": 150,
    "total": 4248,
    "payment_method": "銀行轉帳",
    "payment_screenshot": "https://...",
    "transfer_last5": "12345",
    "note": "請盡快出貨",
    "payment_status": "已確認",
    "shipping_status": "已出貨",
    "order_status": "已確認"
  },
  ...
]
```

---

### 4. 取得單筆訂單

**端點**：`GET /api/admin/orders/:id`

**認證**：需要

**回應**：同上（單筆訂單）

---

### 5. 更新訂單狀態

**端點**：`PATCH /api/admin/orders/:id`

**認證**：需要

**請求**：
```json
{
  "order_status": "已確認",
  "payment_status": "已確認",
  "shipping_status": "已出貨"
}
```

**回應**：
```json
{
  "success": true,
  "message": "狀態已更新"
}
```

---

### 6. 取得所有會員

**端點**：`GET /api/admin/members`

**認證**：需要

**回應**：
```json
[
  {
    "id": "uuid-string",
    "created_at": "2026-04-29T09:00:00Z",
    "name": "李美麗",
    "phone": "0987654321",
    "email": "li@example.com",
    "note": "推薦朋友"
  },
  ...
]
```

---

### 7. 取得網站內容（後台編輯用）

**端點**：`GET /api/admin/content`

**認證**：需要

**回應**：
```json
{
  "hero_title": {
    "value": "拉拉山五月桃",
    "updated_at": "2026-04-29T10:00:00Z"
  },
  ...
}
```

---

### 8. 更新網站內容

**端點**：`PUT /api/admin/content`

**認證**：需要

**請求**：
```json
{
  "hero_title": "拉拉山五月桃 - 新標題",
  "feature1_desc": "新的特色描述..."
}
```

**回應**：
```json
{
  "success": true,
  "message": "內容已更新"
}
```

---

### 9. 上傳圖片

**端點**：`POST /api/admin/upload-image`

**認證**：需要

**Content-Type**：`multipart/form-data`

**請求參數**：
| 欄位 | 類型 | 說明 |
|------|------|------|
| image | file | 圖片檔案 |
| key | string | 可選，site_content 的 key |

**回應**：
```json
{
  "success": true,
  "url": "https://supabase-storage-url/...",
  "filename": "1234567890-abc12345.jpg"
}
```

---

### 10. 取得系統設定

**端點**：`GET /api/admin/settings`

**認證**：需要

**回應**：
```json
{
  "linepay_channel_id": "",
  "linepay_channel_secret": "",
  "linepay_enabled": "false",
  "line_channel_access_token": "",
  "line_notify_enabled": "false"
}
```

---

### 11. 更新系統設定

**端點**：`PUT /api/admin/settings`

**認證**：需要

**請求**：
```json
{
  "linepay_channel_id": "1234567890",
  "linepay_channel_secret": "secret-key",
  "linepay_enabled": "true"
}
```

**回應**：
```json
{
  "success": true,
  "message": "系統設定已更新"
}
```

---

### 12. 輪詢新訂單（實時通知）

**端點**：`GET /api/admin/poll`

**認證**：需要

**查詢參數**：
| 參數 | 類型 | 說明 |
|------|------|------|
| since | string | ISO 8601 時間戳，取得此時間後的訂單 |

**回應**：
```json
{
  "newOrders": [
    {
      "id": "uuid",
      "order_number": "PF20260429001",
      "name": "王小明",
      "spec": "6粒裝",
      "quantity": 2,
      "total": 4248,
      "created_at": "2026-04-29T10:30:00Z"
    }
  ],
  "pendingCount": 2,
  "serverTime": "2026-04-29T10:35:00Z"
}
```

---

## 🔗 預留接口（未實裝）

### LINE Pay 金流

**端點**：`POST /api/payment/linepay`

**說明**：預留接口，待實裝 LINE Pay 整合

---

### LINE 推播通知

**端點**：`POST /api/webhooks/line-notify`

**說明**：預留接口，待實裝 LINE 官方帳號通知

---

### AI 聊天機器人

**端點**：`POST /api/chatbot`

**說明**：預留接口，待實裝 AI 自動回覆

---

## 📝 錯誤碼

| 狀態碼 | 說明 |
|--------|------|
| 200 | 成功 |
| 201 | 建立成功 |
| 400 | 請求參數錯誤 |
| 401 | 未授權（認證失敗） |
| 404 | 資源不存在 |
| 500 | 伺服器錯誤 |

---

## 🧪 測試工具

### 使用 cURL

```bash
# 取得內容
curl https://pluwfun-peach-backend.onrender.com/api/content

# 提交訂單
curl -X POST https://pluwfun-peach-backend.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試用戶",
    "phone": "0912345678",
    "address": "台北市",
    "spec": "6粒裝",
    "quantity": 1,
    "unit_price": 1999,
    "subtotal": 1999,
    "box_fee": 100,
    "shipping_fee": 150,
    "total": 2249
  }'

# 後台登入
curl -X POST https://pluwfun-peach-backend.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "pluwfun2025"}'

# 取得統計（需認證）
curl https://pluwfun-peach-backend.onrender.com/api/admin/stats \
  -H "Authorization: Bearer pluwfun2025"
```

### 使用 Postman

1. 建立新的 Collection
2. 設定 Base URL：`https://pluwfun-peach-backend.onrender.com`
3. 在 Authorization 標籤設定 Bearer Token
4. 逐一測試各個端點

---

## 📞 支援

如有 API 相關問題，請聯絡：pluwfun@gmail.com

**最後更新**：2026 年 4 月 29 日
