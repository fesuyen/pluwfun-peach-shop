# Pluwfun Firebase 建置步驟

這份文件照順序做即可。完成後，網站會從本機 demo 升級成雲端資料庫。

## 1. 建立或開啟 Firebase 專案

進入 Firebase Console：

```text
https://console.firebase.google.com/
```

選擇你的專案：

```text
pluwfun-peach-shop
```

如果還沒有，就新增一個專案。

## 2. 建立 Firestore Database

在左側選單進入：

```text
建構 > Firestore Database
```

點選：

```text
建立資料庫
```

建議先選：

```text
Production mode
```

地區可選離台灣較近的區域，例如亞洲區。

## 3. 貼上安全規則

到 Firestore 的「規則」頁籤，把本專案的 `firestore.rules` 內容貼上。

目前規則設計：

- 商品庫存可以被前台讀取
- 客人只能新增訂單
- 讀取訂單、修改訂單、庫存管理，需要管理員登入

注意：下一階段要加上 Firebase Authentication 管理員登入，後台才會正式安全可用。

## 4. 取得網站 Firebase 設定

Firebase Console 左側點：

```text
專案設定
```

找到：

```text
你的應用程式
```

新增 Web App，名稱可填：

```text
pluwfun-peach-shop-web
```

Firebase 會給你一段設定，類似：

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## 5. 貼到本專案

打開：

```text
firebase-config.js
```

把 `PASTE_...` 的值換成 Firebase 給你的設定。

## 6. 測試

重新整理網站後，進入後台。

如果看到：

```text
目前已連線 Firebase
```

就代表雲端資料庫已接上。

接著從前台送出一筆測試訂單，再到 Firebase Firestore 檢查是否出現：

```text
orders
products
```

## 7. 下一階段

接下來要做：

- Firebase Authentication 管理員登入
- 後台只有管理員可進入
- Firestore 規則正式鎖定
- 部署到 Vercel
