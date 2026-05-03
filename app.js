import { firebaseConfig } from "./firebase-config.js";

let db = null;
let auth = null;
let cloud = null;
let authApi = null;
let firebaseReady = false;
let adminUser = null;
let checkoutConfirmed = false;

const PRODUCTS = [
  { id: "p6", name: "6 粒裝", price: 750, stock: 80 },
  { id: "p8", name: "8 粒裝", price: 650, stock: 80 },
  { id: "p10", name: "10 粒裝", price: 550, stock: 80 },
  { id: "p12", name: "12 粒裝", price: 450, stock: 80 },
];

const SHIPPING_TIERS = [
  { max: 2, fee: 150 },
  { max: 4, fee: 210 },
  { max: 6, fee: 270 },
];

const STATUS_META = {
  new: { label: "未收款", className: "status-new" },
  paid: { label: "確認收款", className: "status-paid" },
  dispatched: { label: "已派單", className: "status-dispatched" },
  shipping: { label: "發貨中", className: "status-shipping" },
  done: { label: "完成配送", className: "status-done" },
  settled: { label: "已分潤", className: "status-settled" },
};

const STATUS_STEPS = ["new", "paid", "dispatched", "shipping", "done", "settled"];

const state = {
  quantities: Object.fromEntries(PRODUCTS.map((product) => [product.id, 0])),
  shipments: [],
  pickupDate: "",
  lastCustomerName: "",
  lastCustomerPhone: "",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function money(value) {
  return `$${Math.round(value).toLocaleString("zh-TW")}`;
}

function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function hasFirebaseConfig() {
  return firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("PASTE_");
}

async function initFirebase() {
  if (!hasFirebaseConfig()) return false;
  try {
    const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
    const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
    const app = appModule.initializeApp(firebaseConfig);
    db = firestoreModule.getFirestore(app);
    auth = authModule.getAuth(app);
    cloud = firestoreModule;
    authApi = authModule;
    firebaseReady = true;
    authModule.onAuthStateChanged(auth, async (user) => {
      adminUser = user;
      if (user) {
        await loadCloudOrders();
      }
      handleRoute();
    });
    return true;
  } catch (error) {
    console.warn("Firebase 初始化失敗，已改用本機 demo。", error);
    firebaseReady = false;
    return false;
  }
}

async function loadCloudData() {
  if (!firebaseReady) return;
  try {
    await loadCloudInventory();
    if (adminUser) await loadCloudOrders();
    renderAll();
    handleRoute();
    showToast(adminUser ? "已連線 Firebase，後台資料會從雲端同步。" : "已連線 Firebase，後台登入後會載入訂單。");
  } catch (error) {
    console.warn("Firebase 資料同步失敗。", error);
    showToast("Firebase 連線未完成，暫時使用本機 demo 資料。");
  }
}

async function loadCloudInventory() {
  const snapshot = await cloud.getDocs(cloud.collection(db, "products"));
  if (snapshot.empty) {
    const initial = getInventory();
    await saveInventoryToCloud(initial);
    return;
  }
  const inventory = {};
  snapshot.forEach((docSnap) => {
    inventory[docSnap.id] = Number(docSnap.data().stock || 0);
  });
  saveInventory(inventory, { skipCloud: true });
}

async function loadCloudOrders() {
  const q = cloud.query(cloud.collection(db, "orders"), cloud.orderBy("createdAt", "desc"));
  const snapshot = await cloud.getDocs(q);
  const orders = snapshot.docs.map((docSnap) => docSnap.data());
  saveOrders(orders, { skipCloud: true });
}

async function saveOrderToCloud(order) {
  if (!firebaseReady) return;
  try {
    await cloud.setDoc(cloud.doc(db, "orders", order.id), sanitizeForFirestore(order), { merge: true });
  } catch (error) {
    console.warn("訂單雲端儲存失敗。", error);
    showToast("訂單已先存在本機；Firebase 權限或設定完成後再同步。");
  }
}

async function saveInventoryToCloud(inventory) {
  if (!firebaseReady) return;
  try {
    await Promise.all(PRODUCTS.map((product) => {
      const data = { name: product.name, price: product.price, stock: Number(inventory[product.id] || 0) };
      return cloud.setDoc(cloud.doc(db, "products", product.id), data, { merge: true });
    }));
  } catch (error) {
    console.warn("庫存雲端儲存失敗。", error);
  }
}

function sanitizeForFirestore(value) {
  return JSON.parse(JSON.stringify(value));
}

function getInventory() {
  const inventory = readStore("pluwfunInventory", null);
  if (inventory) return inventory;
  const initial = Object.fromEntries(PRODUCTS.map((product) => [product.id, product.stock]));
  writeStore("pluwfunInventory", initial);
  return initial;
}

function getOrders() {
  return readStore("pluwfunOrders", []);
}

function saveOrders(orders, options = {}) {
  writeStore("pluwfunOrders", orders);
  if (!options.skipCloud && firebaseReady) {
    orders.forEach((order) => saveOrderToCloud(order));
  }
}

function orderWorkflow(order) {
  if (!order.workflow) {
    order.workflow = Object.fromEntries(STATUS_STEPS.map((status) => [status, false]));
    if (order.status && STATUS_STEPS.includes(order.status)) {
      const index = STATUS_STEPS.indexOf(order.status);
      STATUS_STEPS.slice(0, index + 1).forEach((status) => {
        order.workflow[status] = true;
      });
    }
    if (!order.status || order.status === "new") order.workflow.new = true;
  }
  return order.workflow;
}

function orderDisplayStatus(order) {
  const workflow = orderWorkflow(order);
  if (workflow.settled) return { label: "完成訂單", className: "status-settled" };
  if (!workflow.paid) return { label: "待收款", className: "status-new" };
  return { label: "處理中", className: "status-shipping" };
}

function orderSequenceText(index) {
  return `出貨順序 ${index + 1}`;
}

function saveInventory(inventory, options = {}) {
  writeStore("pluwfunInventory", inventory);
  if (!options.skipCloud) saveInventoryToCloud(inventory);
}

function totalBoxes(quantities = state.quantities) {
  return Object.values(quantities).reduce((sum, qty) => sum + Number(qty || 0), 0);
}

function productSubtotal(quantities = state.quantities) {
  return PRODUCTS.reduce((sum, product) => sum + product.price * Number(quantities[product.id] || 0), 0);
}

function shippingFeeForBoxes(boxes) {
  if (boxes === 0) return 0;
  const tier = SHIPPING_TIERS.find((item) => boxes <= item.max);
  if (tier) return tier.fee;
  return 270 + Math.ceil((boxes - 6) / 2) * 90;
}

function selectedRadio(name) {
  return $(`input[name="${name}"]:checked`)?.value;
}

function canUseCoin() {
  const mode = selectedRadio("memberMode");
  return isPaidMemberMode(mode);
}

function coinDiscount(quantities = state.quantities) {
  return canUseCoin() ? totalBoxes(quantities) * 50 : 0;
}

function groupDiscount(quantities = state.quantities, memberMode = selectedRadio("memberMode")) {
  if (memberMode !== "general") return 0;
  const boxes = totalBoxes(quantities);
  if (boxes >= 10) return 350;
  if (boxes >= 5) return 150;
  return 0;
}

function memberFee() {
  return selectedRadio("memberMode") === "join" ? 1999 : 0;
}

function isPaidMemberMode(mode) {
  return mode === "paid" || mode === "existing" || mode === "join";
}

function memberModeLabel(mode) {
  if (mode === "paid" || mode === "existing") return "付費會員";
  if (mode === "join") return "本次加入會員";
  if (mode === "general") return "一般會員";
  return "非會員";
}

function ensureShipments() {
  const mode = selectedRadio("deliveryMode");
  if (mode === "pickup") {
    state.shipments = [];
    return;
  }

  if (mode === "single") {
    state.shipments = state.shipments.slice(0, 1);
    if (!state.shipments[0]) state.shipments[0] = emptyShipment("地址一", { ...state.quantities });
    state.shipments[0].items = { ...state.quantities };
    fillBlankShipmentContact(state.shipments[0]);
    return;
  }

  if (!state.shipments.length) {
    state.shipments = [emptyShipment("地址一", { ...state.quantities })];
  }

  state.shipments.forEach((shipment, index) => {
    shipment.label = `地址${index + 1}`;
    fillBlankShipmentContact(shipment);
  });
}

function fillBlankShipmentContact(shipment) {
  if (!shipment.recipient) shipment.recipient = $("#customerName")?.value || "";
  if (!shipment.phone) shipment.phone = $("#customerPhone")?.value || "";
}

function allocationText(items) {
  return PRODUCTS.map((product) => `${product.name} ${Number(items[product.id] || 0)} 盒`).join("、");
}

function hasUnallocatedItems() {
  return Object.values(unallocatedItems()).some((qty) => qty > 0);
}

function clampShipmentAllocations() {
  PRODUCTS.forEach((product) => enforceAllocation(product.id));
}

function resetShipmentsToFirstAddress() {
  const mode = selectedRadio("deliveryMode");
  if (mode === "multi") {
    state.shipments = [emptyShipment("地址一", { ...state.quantities })];
  } else if (mode === "single") {
    state.shipments = [emptyShipment("地址一", { ...state.quantities })];
  }
}

function emptyShipment(label, items = null) {
  return {
    label,
    recipient: "",
    phone: "",
    address: "",
    deliveryDate: state.pickupDate || "",
    items: items || Object.fromEntries(PRODUCTS.map((product) => [product.id, 0])),
  };
}

function shipmentTotals() {
  const mode = selectedRadio("deliveryMode");
  if (mode === "pickup") return { fee: 0, boxes: 0 };
  if (mode === "single") return { fee: shippingFeeForBoxes(totalBoxes()), boxes: totalBoxes() };
  const fee = state.shipments.reduce((sum, shipment) => sum + shippingFeeForBoxes(totalBoxes(shipment.items)), 0);
  return { fee, boxes: state.shipments.reduce((sum, shipment) => sum + totalBoxes(shipment.items), 0) };
}

function unallocatedItems() {
  const allocated = Object.fromEntries(PRODUCTS.map((product) => [product.id, 0]));
  state.shipments.forEach((shipment) => {
    PRODUCTS.forEach((product) => {
      allocated[product.id] += Number(shipment.items[product.id] || 0);
    });
  });
  return Object.fromEntries(PRODUCTS.map((product) => [product.id, Math.max(0, state.quantities[product.id] - allocated[product.id])]));
}

function calculateSummary() {
  const itemSubtotal = productSubtotal();
  const coin = coinDiscount();
  const group = groupDiscount();
  const shipping = shipmentTotals().fee;
  const membership = memberFee();
  const total = itemSubtotal + shipping + membership - coin - group;
  return { itemSubtotal, discount: coin + group, coinDiscount: coin, groupDiscount: group, shipping, membership, total, boxes: totalBoxes() };
}

function calculateSettlement(order) {
  const itemSubtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = (order.coinDiscount || 0) + (order.groupDiscount || 0);
  const netProduct = itemSubtotal - discount;
  const farmerShare = netProduct * 0.9;
  const serviceFee = netProduct * 0.1;
  const platformIncome = order.memberFee + serviceFee;
  return { itemSubtotal, discount, netProduct, farmerShare, serviceFee, platformIncome };
}

function orderQuantities(order) {
  return Object.fromEntries(PRODUCTS.map((product) => {
    const item = order.items.find((entry) => entry.id === product.id);
    return [product.id, Number(item?.qty || 0)];
  }));
}

function coinDiscountForOrder(memberMode, quantities) {
  return isPaidMemberMode(memberMode) ? totalBoxes(quantities) * 50 : 0;
}

function groupDiscountForOrder(memberMode, quantities) {
  if (memberMode !== "general") return 0;
  const boxes = totalBoxes(quantities);
  if (boxes >= 10) return 350;
  if (boxes >= 5) return 150;
  return 0;
}

function memberFeeForMode(memberMode) {
  return memberMode === "join" ? 1999 : 0;
}

function shippingFeeForOrder(order, quantities = orderQuantities(order)) {
  if (order.deliveryMode === "pickup") return 0;
  if (order.deliveryMode === "single") return shippingFeeForBoxes(totalBoxes(quantities));
  return order.shipments.reduce((sum, shipment) => sum + shippingFeeForBoxes(totalBoxes(shipment.items)), 0);
}

function recalculateOrder(order) {
  const quantities = orderQuantities(order);
  order.itemSubtotal = productSubtotal(quantities);
  order.memberFee = memberFeeForMode(order.memberMode);
  order.coinDiscount = coinDiscountForOrder(order.memberMode, quantities);
  order.groupDiscount = groupDiscountForOrder(order.memberMode, quantities);
  order.shippingFee = shippingFeeForOrder(order, quantities);
  order.total = order.itemSubtotal + order.memberFee + order.shippingFee - order.coinDiscount - order.groupDiscount;
  return order;
}

function renderProducts() {
  const inventory = getInventory();
  $("#productList").innerHTML = PRODUCTS.map((product) => {
    const qty = state.quantities[product.id] || 0;
    return `
      <div class="product-card">
        <strong>${product.name}</strong>
        <div>每盒 ${money(product.price)}</div>
        <div class="small">可售庫存：${inventory[product.id] ?? 0} 盒</div>
        <div class="qty-row">
          <button type="button" data-qty="${product.id}" data-delta="-1">−</button>
          <input aria-label="${product.name} 數量" value="${qty}" inputmode="numeric" data-product-input="${product.id}" />
          <button type="button" data-qty="${product.id}" data-delta="1">+</button>
        </div>
      </div>
    `;
  }).join("");

  $$("[data-qty]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.qty;
      const inventory = getInventory();
      const next = Math.max(0, state.quantities[productId] + Number(button.dataset.delta));
      state.quantities[productId] = Math.min(next, inventory[productId] ?? 0);
      resetShipmentsToFirstAddress();
      renderAll();
    });
  });

  $$("[data-product-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const productId = input.dataset.productInput;
      const inventory = getInventory();
      state.quantities[productId] = Math.min(Math.max(0, Number(input.value || 0)), inventory[productId] ?? 0);
      resetShipmentsToFirstAddress();
      renderAll();
    });
  });
}

function renderShipments() {
  ensureShipments();
  const mode = selectedRadio("deliveryMode");
  $("#pickupInfo").hidden = mode !== "pickup";
  const area = $("#shipmentArea");

  if (mode === "pickup") {
    area.innerHTML = `
      <div class="shipment-card">
        <div class="shipment-title">
          <h4>自取安排</h4>
          <span>運費 ${money(0)}</span>
        </div>
        <label>希望自取日期
          <input type="date" id="pickupDate" value="${state.pickupDate}" />
        </label>
        <p class="small">實際自取時間會由 Pluwfun LINE 官方帳號確認。</p>
      </div>
    `;
    $("#pickupDate").addEventListener("change", (event) => {
      state.pickupDate = event.target.value;
      renderSummary();
    });
    return;
  }

  if (mode === "single") {
    const shipment = state.shipments[0];
    area.innerHTML = shipmentForm(shipment, 0, false);
    bindShipmentFields();
    return;
  }

  clampShipmentAllocations();
  const remaining = unallocatedItems();
  area.innerHTML = `
    <div class="notice ${hasUnallocatedItems() ? "" : "success"}">尚未分配：${allocationText(remaining)}</div>
    ${state.shipments.map((shipment, index) => shipmentForm(shipment, index, true)).join("")}
    <button class="button ghost" type="button" id="addShipment">新增收件地址</button>
  `;
  $("#addShipment")?.addEventListener("click", () => {
    const nextShipment = emptyShipment(`地址${state.shipments.length + 1}`, unallocatedItems());
    nextShipment.deliveryDate = state.shipments[0]?.deliveryDate || "";
    fillBlankShipmentContact(nextShipment);
    state.shipments.push(nextShipment);
    renderAll();
  });
  bindShipmentFields();
}

function shipmentForm(shipment, index, editableItems) {
  const boxCount = totalBoxes(editableItems ? shipment.items : state.quantities);
  const shippingFee = shippingFeeForBoxes(boxCount);
  const dateHint = index === 0 ? "地址一填入後，新增地址會自動帶入同一天" : "可依此地址需求修改";
  return `
    <div class="shipment-card">
      <div class="shipment-title">
        <h4>${shipment.label}</h4>
        <span>本地址累計 ${boxCount} 盒，運費 ${money(shippingFee)}</span>
      </div>
      <div class="field-grid">
        <label>收件人<input data-ship-field="recipient" data-ship-index="${index}" value="${shipment.recipient}" required /></label>
        <label>電話<input data-ship-field="phone" data-ship-index="${index}" value="${shipment.phone}" required /></label>
        <label>希望收件日期<input type="date" data-ship-field="deliveryDate" data-ship-index="${index}" value="${shipment.deliveryDate || ""}" aria-describedby="ship-date-note-${index}" /></label>
        <label>地址<input data-ship-field="address" data-ship-index="${index}" value="${shipment.address}" required placeholder="可改成代收件地址" /></label>
      </div>
      <p class="small" id="ship-date-note-${index}">${dateHint}，實際到貨仍依採收、出貨與低溫宅配安排。</p>
      <div class="shipment-products">
        ${PRODUCTS.map((product) => `
          <label>${product.name}
            <input data-ship-product="${product.id}" data-ship-index="${index}" value="${editableItems ? shipment.items[product.id] : state.quantities[product.id]}" ${editableItems ? "" : "readonly"} inputmode="numeric" />
          </label>
        `).join("")}
      </div>
      <div class="allocation-note">此地址配送：${allocationText(editableItems ? shipment.items : state.quantities)}</div>
      ${editableItems && state.shipments.length > 1 ? `<button class="button ghost" type="button" data-remove-shipment="${index}">移除此地址</button>` : ""}
    </div>
  `;
}

function bindShipmentFields() {
  $$("[data-ship-field]").forEach((input) => {
    input.addEventListener("input", () => {
      state.shipments[Number(input.dataset.shipIndex)][input.dataset.shipField] = input.value;
      if (input.dataset.shipField === "deliveryDate" && Number(input.dataset.shipIndex) === 0) {
        state.shipments.slice(1).forEach((shipment) => {
          if (!shipment.deliveryDate) shipment.deliveryDate = input.value;
        });
        renderShipments();
      }
    });
  });

  $$("[data-ship-product]").forEach((input) => {
    input.addEventListener("input", () => {
      const shipment = state.shipments[Number(input.dataset.shipIndex)];
      const productId = input.dataset.shipProduct;
      shipment.items[productId] = Math.max(0, Number(input.value || 0));
      enforceAllocation(productId);
      renderAll();
    });
  });

  $$("[data-remove-shipment]").forEach((button) => {
    button.addEventListener("click", () => {
      state.shipments.splice(Number(button.dataset.removeShipment), 1);
      renderAll();
    });
  });
}

function enforceAllocation(productId) {
  let remaining = state.quantities[productId];
  state.shipments.forEach((shipment) => {
    const qty = Number(shipment.items[productId] || 0);
    const allowed = Math.min(qty, remaining);
    shipment.items[productId] = allowed;
    remaining -= allowed;
  });
}

function renderSummary() {
  const summary = calculateSummary();
  const mode = selectedRadio("memberMode");
  const remainingCoins = mode === "join" ? Math.max(0, 2000 - summary.coinDiscount) : null;
  const nextDiscountText = memberUpsellText(summary.boxes, mode);
  $("#summaryContent").innerHTML = `
    <div class="summary-line"><span>商品小計</span><strong>${money(summary.itemSubtotal)}</strong></div>
    <div class="summary-line"><span>年度會員費</span><strong>${money(summary.membership)}</strong></div>
    <div class="summary-line"><span>免費會員折扣</span><strong>-${money(summary.groupDiscount)}</strong></div>
    <div class="summary-line"><span>付費會員飛鼠幣折抵</span><strong>-${money(summary.coinDiscount)}</strong></div>
    <div class="summary-line"><span>低溫宅配費</span><strong>${money(summary.shipping)}</strong></div>
    <div class="summary-line summary-total"><span>應付總額</span><strong>${money(summary.total)}</strong></div>
    <p class="small">總盒數 ${summary.boxes} 盒。${canUseCoin() ? "付費會員已套用每盒 50 飛鼠幣折抵。" : "一般會員與非會員尚不套用飛鼠幣折抵，平台確認付費會員資格後可於後台調整。"}</p>
    ${nextDiscountText ? `<p class="notice">${nextDiscountText}</p>` : ""}
    ${remainingCoins !== null ? `<p class="notice">會員開通後發放飛鼠幣：2000 - ${summary.coinDiscount} = ${remainingCoins} 飛鼠幣，本次專案活動飛鼠幣使用期限為 1.5 年。</p>` : ""}
  `;
}

function memberUpsellText(boxes, mode) {
  if (mode === "general" && boxes > 0 && boxes < 5) return `再加購 ${5 - boxes} 盒，可享滿 5 盒折 150 元。`;
  if (mode === "general" && boxes >= 5 && boxes < 10) return `再加購 ${10 - boxes} 盒，可享滿 10 盒折 350 元。`;
  if (mode === "none" && boxes > 0 && boxes < 5) return `加入免費會員後，再加購 ${5 - boxes} 盒可享滿 5 盒折 150 元。`;
  if (mode === "none" && boxes >= 5 && boxes < 10) return `加入免費會員後，本單可折 150 元；再加購 ${10 - boxes} 盒可折 350 元。`;
  if (mode === "none" && boxes >= 10) return "加入免費會員後，本單可直接享滿 10 盒折 350 元。";
  return "";
}

function checkoutAdvice() {
  const boxes = totalBoxes();
  const mode = selectedRadio("memberMode");
  if (mode === "none") {
    return {
      title: "加入免費會員，這筆訂單可以更划算",
      text: "免費加入 Pluwfun LINE 會員，即可享桃子季揪團優惠：滿 5 盒折 150 元，滿 10 盒折 350 元。",
      primary: "加入免費會員並套用優惠",
      secondary: "先不加入，直接結帳",
      primaryAction: () => {
        setMemberMode("general");
        checkoutConfirmed = true;
        $("#orderForm").requestSubmit();
      },
    };
  }
  if (mode === "general" && boxes < 5) {
    return {
      title: "差一點就能享揪團優惠",
      text: `再加購 ${5 - boxes} 盒，即可享滿 5 盒折 150 元。`,
      primary: "回去加購",
      secondary: "不加購，謝謝你支持在地果農",
      primaryAction: returnToProducts,
    };
  }
  if (mode === "general" && boxes < 10) {
    return {
      title: "已享滿 5 盒優惠，再加購更划算",
      text: `再加購 ${10 - boxes} 盒，滿 10 盒可折 350 元。`,
      primary: "回去加購",
      secondary: "不加購，謝謝你支持在地果農",
      primaryAction: returnToProducts,
    };
  }
  if (mode === "general") {
    return {
      title: "高盒數訂購，升級會員可能更划算",
      text: `免費會員本單可折 350 元。若升級 1999 會員，${boxes} 盒可折 ${boxes * 50} 飛鼠幣，另享 2000 飛鼠幣與飛鼠不渴豪華帳篷平日 0 元入住一次。`,
      primary: "升級 1999 會員",
      secondary: "使用免費會員優惠結帳",
      primaryAction: () => {
        setMemberMode("paid");
        renderAll();
        closeCheckoutModal();
      },
    };
  }
  return {
    title: "已套用付費會員飛鼠幣優惠",
    text: "本次桃子每盒可折抵 50 飛鼠幣，系統將依訂購盒數自動計算可折抵金額。送出訂單後，請到 Pluwfun LINE 官方帳號補傳付款或會員申請截圖，方便平台確認。",
    primary: "確認送出訂單",
    secondary: "返回檢查",
    primaryAction: () => {
      checkoutConfirmed = true;
      $("#orderForm").requestSubmit();
    },
    secondaryAction: closeCheckoutModal,
  };
}

function setMemberMode(mode) {
  const input = $(`input[name="memberMode"][value="${mode}"]`);
  if (input) input.checked = true;
  renderAll();
}

function returnToProducts() {
  closeCheckoutModal();
  $("#productList")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function addBoxesToTarget(targetBoxes) {
  const needed = targetBoxes - totalBoxes();
  if (needed <= 0) return;
  const inventory = getInventory();
  let remaining = needed;
  for (const product of PRODUCTS) {
    const available = Math.max(0, (inventory[product.id] ?? 0) - state.quantities[product.id]);
    const add = Math.min(available, remaining);
    state.quantities[product.id] += add;
    remaining -= add;
    if (remaining === 0) break;
  }
  if (remaining > 0) {
    showToast("目前庫存不足，無法自動加到優惠門檻。");
  }
  resetShipmentsToFirstAddress();
  renderAll();
  closeCheckoutModal();
}

function showCheckoutModal() {
  const advice = checkoutAdvice();
  const modal = $("#checkoutModal");
  $("#checkoutModalTitle").textContent = advice.title;
  $("#checkoutModalText").textContent = advice.text;
  $("#checkoutPrimaryAction").textContent = advice.primary;
  $("#checkoutSecondaryAction").textContent = advice.secondary;
  modal.hidden = false;
  modal.style.display = "grid";
  $("#checkoutPrimaryAction").onclick = advice.primaryAction;
  $("#checkoutSecondaryAction").onclick = advice.secondaryAction || (() => {
    checkoutConfirmed = true;
    closeCheckoutModal();
    $("#orderForm").requestSubmit();
  });
  document.body.classList.add("modal-open");
}

function closeCheckoutModal() {
  const modal = $("#checkoutModal");
  modal.hidden = true;
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

function showOrderSubmittedModal(order) {
  const needsProof = order.memberMode === "paid" || order.memberMode === "join" || order.memberMode === "general";
  const modal = $("#checkoutModal");
  $("#checkoutModalTitle").textContent = `訂單已送出：${order.id}`;
  $("#checkoutModalText").textContent = needsProof
    ? "請到 Pluwfun LINE 官方帳號傳送付款截圖、會員申請截圖或會員資料，平台確認後會協助安排出貨；若資料已補傳，請等待工作人員回覆。"
    : "謝謝你支持在地果農。訂單已建立，Pluwfun 會依訂購順序與採收狀況安排通知。";
  $("#checkoutPrimaryAction").textContent = "到 LINE 補傳截圖";
  $("#checkoutSecondaryAction").textContent = "我知道了";
  modal.hidden = false;
  modal.style.display = "grid";
  document.body.classList.add("modal-open");
  $("#checkoutPrimaryAction").onclick = () => {
    window.open("https://lin.ee/5vs3GWy", "_blank", "noopener");
    closeCheckoutModal();
  };
  $("#checkoutSecondaryAction").onclick = closeCheckoutModal;
}

function renderAll() {
  renderProducts();
  renderShipments();
  renderSummary();
  renderMemberSavingsHint();
  if (location.hash === "#admin") renderAdmin();
  if (location.hash === "#farmer") renderFarmer();
}

function renderMemberSavingsHint() {
  const hint = $("#memberSavingsHint");
  if (!hint) return;
  const boxes = totalBoxes();
  const mode = selectedRadio("memberMode");
  if (boxes === 0) {
    hint.textContent = "選擇盒數後，系統會即時提醒你是否已達會員優惠門檻。";
    return;
  }
  if (mode === "paid") {
    hint.textContent = `付費會員已套用桃子每盒 50 飛鼠幣折抵，本單可折抵 ${money(coinDiscount())}。`;
    return;
  }
  if (mode === "none") {
    const next = boxes < 5 ? 5 - boxes : boxes < 10 ? 10 - boxes : 0;
    hint.textContent = next > 0
      ? `加入免費會員後，再加購 ${next} 盒即可享揪團優惠。`
      : "加入免費會員即可套用本單揪團優惠。";
    return;
  }
  if (boxes < 5) {
    hint.textContent = `小提醒：免費會員單筆滿 5 盒可折 150 元。再加購 ${5 - boxes} 盒，就能享揪團優惠。`;
  } else if (boxes < 10) {
    hint.textContent = `已達免費會員揪團優惠：本單可折 150 元。再加購 ${10 - boxes} 盒，滿 10 盒可升級折 350 元。`;
  } else {
    hint.textContent = "你已達免費會員最高揪團優惠，本單可折 350 元。如果今年也想上山住一晚，升級 1999 會員更划算。";
  }
}

function validateMultiShipment() {
  const mode = selectedRadio("deliveryMode");
  if (mode !== "multi") return true;
  const remaining = unallocatedItems();
  const missing = PRODUCTS.filter((product) => remaining[product.id] > 0);
  if (missing.length) {
    showToast(`多點寄送尚未分配完成：${missing.map((product) => `${product.name} ${remaining[product.id]} 盒`).join("、")}`);
    return false;
  }
  return true;
}

async function fileToProof(inputId) {
  const file = $(`#${inputId}`)?.files?.[0];
  if (!file) return null;
  if (!file.type.startsWith("image/")) {
    showToast("佐證檔案請上傳圖片格式。");
    return null;
  }
  const dataUrl = await resizeImageFile(file);
  if (dataUrl.length > 320000) {
    showToast("圖片檔案較大，請先用 LINE 補傳，訂單仍可送出。");
    return { name: file.name, tooLarge: true };
  }
  return { name: file.name, type: file.type, dataUrl };
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 900;
        const ratio = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.68));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function createOrder(event) {
  event.preventDefault();
  if (!event.currentTarget.checkValidity()) {
    closeCheckoutModal();
    event.currentTarget.reportValidity();
    return;
  }
  if (totalBoxes() === 0) {
    showToast("請先選擇五月桃規格與盒數。");
    return;
  }
  if (!validateMultiShipment()) return;

  if (!checkoutConfirmed) {
    showCheckoutModal();
    return;
  }

  const inventory = getInventory();
  const hasEnoughStock = PRODUCTS.every((product) => state.quantities[product.id] <= (inventory[product.id] ?? 0));
  if (!hasEnoughStock) {
    showToast("庫存不足，請重新整理數量。");
    return;
  }

  PRODUCTS.forEach((product) => {
    inventory[product.id] -= state.quantities[product.id];
  });
  saveInventory(inventory);

  const summary = calculateSummary();
  const items = PRODUCTS
    .filter((product) => state.quantities[product.id] > 0)
    .map((product) => ({ id: product.id, name: product.name, price: product.price, qty: state.quantities[product.id] }));

  const order = {
    id: `PF${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    customerName: $("#customerName").value,
    customerPhone: $("#customerPhone").value,
    customerEmail: $("#customerEmail").value,
    lineName: $("#lineName").value,
    lineMemberPhone: $("#lineMemberPhone").value,
    memberMode: selectedRadio("memberMode"),
    deliveryMode: selectedRadio("deliveryMode"),
    items,
    shipments: selectedRadio("deliveryMode") === "pickup" ? [] : structuredClone(state.shipments),
    pickupDate: selectedRadio("deliveryMode") === "pickup" ? state.pickupDate : "",
    itemSubtotal: summary.itemSubtotal,
    memberFee: summary.membership,
    shippingFee: summary.shipping,
    coinDiscount: summary.coinDiscount,
    groupDiscount: summary.groupDiscount,
    total: summary.total,
    status: "new",
    workflow: {
      new: true,
      paid: false,
      dispatched: false,
      shipping: false,
      done: false,
      settled: false,
    },
    proofs: {
      payment: null,
      member: null,
      note: "付款與會員佐證以 Pluwfun LINE 官方帳號補傳為主。",
    },
    emailNotice: {
      to: $("#customerEmail").value,
      status: "pending",
      note: "正式自動寄信需接 EmailJS 或 Firebase Trigger Email；目前以 LINE 官方帳號通知為主。",
    },
    termsVersion: "2026-05-01-v1",
    termsAgreedAt: new Date().toISOString(),
  };

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  saveOrderToCloud(order);
  checkoutConfirmed = false;
  resetOrderForm();
  location.hash = "#top";
  showOrderSubmittedModal(order);
}

function resetOrderForm() {
  state.quantities = Object.fromEntries(PRODUCTS.map((product) => [product.id, 0]));
  state.shipments = [];
  state.pickupDate = "";
  $("#orderForm").reset();
  renderAll();
}

function renderInventory() {
  const inventory = getInventory();
  $("#inventoryTable").innerHTML = `
    <table class="table">
      <thead><tr><th>規格</th><th>價格</th><th>可售庫存</th></tr></thead>
      <tbody>
        ${PRODUCTS.map((product) => `
          <tr><td>${product.name}</td><td>${money(product.price)}</td><td>${inventory[product.id] ?? 0} 盒</td></tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderFinanceCards() {
  const orders = getOrders();
  const totals = orders.reduce((acc, order) => {
    const settlement = calculateSettlement(order);
    acc.sales += order.total;
    acc.farmer += settlement.farmerShare;
    acc.platform += settlement.platformIncome;
    acc.memberFees += order.memberFee;
    return acc;
  }, { sales: 0, farmer: 0, platform: 0, memberFees: 0 });

  $("#financeCards").innerHTML = `
    <div class="finance-card"><span>訂單總額</span><strong>${money(totals.sales)}</strong></div>
    <div class="finance-card"><span>農民分潤</span><strong>${money(totals.farmer)}</strong></div>
    <div class="finance-card"><span>平台收入</span><strong>${money(totals.platform)}</strong></div>
  `;
}

function renderAdminOrders() {
  if (firebaseReady && !adminUser) {
    $("#adminOrders").innerHTML = `
      <p class="demo-note">Firebase 已連線。為了保護訂單個資，請先登入管理員帳號，後台才會載入雲端訂單。</p>
    `;
    return;
  }

  const orders = getOrders();
  if (!orders.length) {
    $("#adminOrders").innerHTML = `
      <p class="demo-note">${dataModeNote()}</p>
      <p class="small">目前尚無訂單。你可以先回前台送出一筆測試訂單。</p>
    `;
    return;
  }

  $("#adminOrders").innerHTML = `
    <p class="demo-note">${dataModeNote()}</p>
    ${orders.map((order, index) => {
    const meta = orderDisplayStatus(order);
    const settlement = calculateSettlement(order);
    const memberLabel = memberModeLabel(order.memberMode);
    const workflow = orderWorkflow(order);
    return `
      <article class="order-card">
        <div class="order-card-header">
          <div>
            <div class="sequence-pill">${orderSequenceText(index)}</div>
            <h3>${order.id}｜${order.customerName}</h3>
            <div class="small">${new Date(order.createdAt).toLocaleString("zh-TW")}｜${order.customerPhone}｜${order.customerEmail || "未填 Gmail"}｜LINE：${order.lineName}</div>
          </div>
          <span class="badge ${meta.className}">${meta.label}</span>
        </div>
        <div class="status-line"><span>會員狀態</span><strong>${memberLabel}</strong></div>
        <div class="status-line"><span>LINE 登記電話</span><strong>${order.lineMemberPhone || "未填寫"}</strong></div>
        <div class="status-line"><span>商品</span><strong>${order.items.map((item) => `${item.name} ${item.qty} 盒`).join("、")}</strong></div>
        <div class="status-line"><span>配送</span><strong>${deliveryLabel(order.deliveryMode)}</strong></div>
        <div class="status-line"><span>配送日期</span><strong>${deliveryDateText(order)}</strong></div>
        ${adminShipmentOverview(order)}
        <div class="status-line"><span>應收總額</span><strong>${money(order.total)}</strong></div>
        <div class="status-line"><span>農民分潤</span><strong>${money(settlement.farmerShare)}</strong></div>
        <div class="status-line"><span>平台收入</span><strong>${money(settlement.platformIncome)}</strong></div>
        <details>
          <summary>查看出貨與分潤明細</summary>
          <p class="small">商品原價 ${money(settlement.itemSubtotal)}，免費會員折扣 -${money(order.groupDiscount || 0)}，付費會員飛鼠幣折抵 -${money(order.coinDiscount || 0)}，行政服務費 ${money(settlement.serviceFee)}，會員費 ${money(order.memberFee)}。</p>
          <p class="small">${shipmentText(order)}</p>
          ${proofsMarkup(order)}
        </details>
        <details class="edit-order">
          <summary>異動編輯訂單</summary>
          ${orderEditForm(order)}
        </details>
        <div class="admin-actions">
          ${STATUS_STEPS.map((status) => statusButton(order.id, status, workflow[status])).join("")}
          <button type="button" data-copy="${order.id}">複製農民出貨明細</button>
        </div>
      </article>
    `;
  }).join("")}
  `;

  $$("[data-status]").forEach((button) => {
    button.addEventListener("click", () => updateOrderStatus(button.dataset.orderId, button.dataset.status));
  });
  $$("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyFarmerMessage(button.dataset.copy));
  });
  $$("[data-edit-order]").forEach((button) => {
    button.addEventListener("click", () => saveOrderEdit(button.dataset.editOrder));
  });
  $$("[data-first-date]").forEach((input) => {
    input.addEventListener("change", () => {
      const orderId = input.dataset.firstDate;
      $$(`[data-edit-date="${orderId}"]`).slice(1).forEach((dateInput) => {
        if (!dateInput.value) dateInput.value = input.value;
      });
    });
  });
}

function dataModeNote() {
  if (firebaseReady && adminUser) return "目前已連線 Firebase：訂單、庫存與後台異動會同步到雲端資料庫。";
  if (firebaseReady) return "目前已連線 Firebase：前台可新增訂單；後台需要管理員登入後才會讀取雲端訂單。";
  if (hasFirebaseConfig()) return "已填 Firebase 設定，但目前尚未連線成功。請確認網路、Firebase 專案設定與 Firestore 規則。";
  return "目前這版是本機 demo：訂單暫存在這台電腦的瀏覽器。填入 Firebase 設定後，資料會改走雲端資料庫。";
}

function adminShipmentOverview(order) {
  if (order.deliveryMode === "pickup") {
    return `
      <div class="admin-shipment-list">
        <div class="admin-shipment-card">
          <strong>自取</strong>
          <span>希望自取日期：${order.pickupDate || "尚未填寫"}</span>
          <span>地點：桃園市復興區高義里雪霧鬧 7鄰7號</span>
          <span>品項：${order.items.map((item) => `${item.name} ${item.qty} 盒`).join("、")}</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="admin-shipment-list">
      ${order.shipments.map((shipment) => `
        <div class="admin-shipment-card">
          <strong>${shipment.label}｜${totalBoxes(shipment.items)} 盒｜${shipment.deliveryDate || "尚未填寫日期"}</strong>
          <span>${shipment.recipient || "未填收件人"}　${shipment.phone || "未填電話"}</span>
          <span>${shipment.address || "未填地址"}</span>
          <span>${allocationText(shipment.items)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function statusButton(orderId, status, isActive) {
  const meta = STATUS_META[status];
  const active = isActive ? " active" : "";
  return `<button type="button" class="workflow-button ${meta.className}${active}" data-order-id="${orderId}" data-status="${status}">${meta.label}</button>`;
}

function proofsMarkup(order) {
  const proofs = order.proofs || {};
  const entries = [
    ["付款截圖", proofs.payment],
    ["會員截圖", proofs.member],
  ].filter(([, proof]) => proof);
  if (!entries.length) return `<p class="small">付款與會員佐證以 LINE 官方帳號補傳為主。請核對 LINE 訊息中的訂單編號與付款截圖。</p>`;
  return `
    <div class="proof-grid">
      ${entries.map(([label, proof]) => `
        <div class="proof-card">
          <strong>${label}</strong>
          ${proof.dataUrl ? `<img src="${proof.dataUrl}" alt="${label}" />` : `<span class="small">${proof.name || "檔案過大，請由 LINE 補傳"}</span>`}
        </div>
      `).join("")}
    </div>
  `;
}

function deliveryLabel(mode) {
  return ({ pickup: "自取", single: "宅配單點", multi: "宅配多點" })[mode] || mode;
}

function shipmentText(order) {
  if (order.deliveryMode === "pickup") return "自取：桃園市復興區高義里雪霧鬧 7鄰7號。";
  return order.shipments.map((shipment) => {
    const items = PRODUCTS.map((product) => `${product.name} ${shipment.items[product.id] || 0} 盒`).join("、");
    const date = shipment.deliveryDate ? `，配送日期 ${shipment.deliveryDate}` : "";
    return `${shipment.label}：${shipment.recipient} ${shipment.phone}，${shipment.address}${date}，${items}`;
  }).join(" / ");
}

function deliveryDateText(order) {
  if (order.deliveryMode === "pickup") return order.pickupDate || "尚未指定";
  const dates = order.shipments.map((shipment) => `${shipment.label}：${shipment.deliveryDate || "尚未指定"}`);
  return dates.join("、");
}

function orderEditForm(order) {
  const quantities = orderQuantities(order);
  const firstDate = order.shipments[0]?.deliveryDate || "";
  return `
    <div class="edit-grid">
      <label>訂單日期
        <input type="datetime-local" data-edit-field="createdAt" data-order-id="${order.id}" value="${toDateTimeInput(order.createdAt)}" />
      </label>
      <label>會員狀態
        <select data-edit-field="memberMode" data-order-id="${order.id}">
          <option value="general" ${order.memberMode === "general" ? "selected" : ""}>一般會員</option>
          <option value="paid" ${isPaidMemberMode(order.memberMode) ? "selected" : ""}>付費會員</option>
          <option value="none" ${order.memberMode === "none" ? "selected" : ""}>非會員</option>
        </select>
      </label>
      <label>配送方式
        <select data-edit-field="deliveryMode" data-order-id="${order.id}">
          <option value="pickup" ${order.deliveryMode === "pickup" ? "selected" : ""}>自取</option>
          <option value="single" ${order.deliveryMode === "single" ? "selected" : ""}>宅配單點</option>
          <option value="multi" ${order.deliveryMode === "multi" ? "selected" : ""}>宅配多點</option>
        </select>
      </label>
    </div>
    <div class="edit-products">
      ${PRODUCTS.map((product) => `
        <label>${product.name}
          <input data-edit-product="${product.id}" data-order-id="${order.id}" value="${quantities[product.id]}" inputmode="numeric" />
        </label>
      `).join("")}
    </div>
    ${order.deliveryMode === "pickup" ? pickupEditForm(order) : shipmentsEditForm(order, firstDate)}
    <button class="button primary" type="button" data-edit-order="${order.id}">儲存並重新計算</button>
  `;
}

function pickupEditForm(order) {
  return `
    <div class="edit-grid">
      <label>自取日期
        <input type="date" data-edit-field="pickupDate" data-order-id="${order.id}" value="${order.pickupDate || ""}" />
      </label>
    </div>
  `;
}

function shipmentsEditForm(order, firstDate) {
  return `
    <div class="edit-shipments">
      ${order.shipments.map((shipment, index) => `
        <div class="edit-shipment-card">
          <h4>${shipment.label}｜${totalBoxes(shipment.items)} 盒</h4>
          <div class="edit-grid">
            <label>配送日期
              <input type="date" ${index === 0 ? `data-first-date="${order.id}"` : ""} data-edit-date="${order.id}" data-ship-index="${index}" value="${shipment.deliveryDate || firstDate}" />
            </label>
            <label>收件人
              <input data-edit-ship-field="recipient" data-order-id="${order.id}" data-ship-index="${index}" value="${shipment.recipient || ""}" />
            </label>
            <label>電話
              <input data-edit-ship-field="phone" data-order-id="${order.id}" data-ship-index="${index}" value="${shipment.phone || ""}" />
            </label>
            <label class="wide-field">地址
              <input data-edit-ship-field="address" data-order-id="${order.id}" data-ship-index="${index}" value="${shipment.address || ""}" />
            </label>
          </div>
          <div class="edit-products">
            ${PRODUCTS.map((product) => `
              <label>${product.name}
                <input data-edit-ship-product="${product.id}" data-order-id="${order.id}" data-ship-index="${index}" value="${shipment.items[product.id] || 0}" inputmode="numeric" />
              </label>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function toDateTimeInput(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) return;
  const workflow = orderWorkflow(order);
  if (status === "new") {
    workflow.new = true;
    workflow.paid = false;
  } else {
    workflow[status] = !workflow[status];
    if (workflow[status]) workflow.new = false;
  }
  const activeStatuses = STATUS_STEPS.filter((step) => workflow[step]);
  order.status = activeStatuses.at(-1) || "new";
  saveOrders(orders);
  if (location.hash === "#farmer") renderFarmer();
  else renderAdmin();
}

function saveOrderEdit(orderId) {
  const orders = getOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) return;

  const oldQuantities = orderQuantities(order);
  const nextQuantities = Object.fromEntries(PRODUCTS.map((product) => {
    const input = $(`[data-edit-product="${product.id}"][data-order-id="${orderId}"]`);
    return [product.id, Math.max(0, Number(input?.value || 0))];
  }));

  const inventory = getInventory();
  const canSave = PRODUCTS.every((product) => {
    const availableAfterRestore = (inventory[product.id] ?? 0) + oldQuantities[product.id];
    return nextQuantities[product.id] <= availableAfterRestore;
  });
  if (!canSave) {
    showToast("庫存不足，無法儲存這次異動。");
    return;
  }

  PRODUCTS.forEach((product) => {
    inventory[product.id] = (inventory[product.id] ?? 0) + oldQuantities[product.id] - nextQuantities[product.id];
  });
  saveInventory(inventory);

  order.createdAt = new Date($(`[data-edit-field="createdAt"][data-order-id="${orderId}"]`)?.value || order.createdAt).toISOString();
  order.memberMode = $(`[data-edit-field="memberMode"][data-order-id="${orderId}"]`)?.value || order.memberMode;
  const nextDeliveryMode = $(`[data-edit-field="deliveryMode"][data-order-id="${orderId}"]`)?.value || order.deliveryMode;
  order.deliveryMode = nextDeliveryMode;
  order.items = PRODUCTS
    .filter((product) => nextQuantities[product.id] > 0)
    .map((product) => ({ id: product.id, name: product.name, price: product.price, qty: nextQuantities[product.id] }));

  if (nextDeliveryMode === "pickup") {
    order.pickupDate = $(`[data-edit-field="pickupDate"][data-order-id="${orderId}"]`)?.value || order.pickupDate || "";
    order.shipments = [];
  } else {
    const editedShipments = order.shipments.length ? order.shipments : [emptyShipment("地址一", { ...nextQuantities })];
    order.shipments = editedShipments.map((shipment, index) => {
      const dateInput = $(`[data-edit-date="${orderId}"][data-ship-index="${index}"]`);
      const fieldValue = (field) => $(`[data-edit-ship-field="${field}"][data-order-id="${orderId}"][data-ship-index="${index}"]`)?.value || shipment[field] || "";
      const items = Object.fromEntries(PRODUCTS.map((product) => {
        const input = $(`[data-edit-ship-product="${product.id}"][data-order-id="${orderId}"][data-ship-index="${index}"]`);
        return [product.id, Math.max(0, Number(input?.value ?? shipment.items[product.id] ?? 0))];
      }));
      return {
        ...shipment,
        label: `地址${index + 1}`,
        recipient: fieldValue("recipient"),
        phone: fieldValue("phone"),
        address: fieldValue("address"),
        deliveryDate: dateInput?.value || order.shipments[0]?.deliveryDate || "",
        items,
      };
    });
    if (nextDeliveryMode === "single") {
      order.shipments = order.shipments.slice(0, 1);
      order.shipments[0].items = { ...nextQuantities };
    }
    normalizeOrderShipments(order, nextQuantities);
  }

  recalculateOrder(order);
  saveOrders(orders);
  renderAdmin();
  showToast("訂單已儲存，金額、運費、分潤與庫存都已重新計算。");
}

function normalizeOrderShipments(order, quantities) {
  if (order.deliveryMode !== "multi") return;
  PRODUCTS.forEach((product) => {
    let remaining = quantities[product.id];
    order.shipments.forEach((shipment) => {
      const allowed = Math.min(Number(shipment.items[product.id] || 0), remaining);
      shipment.items[product.id] = allowed;
      remaining -= allowed;
    });
    if (remaining > 0 && order.shipments.length) {
      order.shipments[order.shipments.length - 1].items[product.id] += remaining;
    }
  });
}

async function copyFarmerMessage(orderId) {
  const order = getOrders().find((item) => item.id === orderId);
  if (!order) return;
  const message = [
    `Pluwfun 出貨通知 ${order.id}`,
    `品項：${order.items.map((item) => `${item.name} ${item.qty} 盒`).join("、")}`,
    `配送：${deliveryLabel(order.deliveryMode)}`,
    shipmentText(order),
  ].join("\n");
  await navigator.clipboard.writeText(message);
  showToast("已複製農民出貨明細。");
}

function renderFarmer() {
  const container = $("#farmerOrders");
  if (!container) return;
  if (firebaseReady && !adminUser) {
    container.innerHTML = `
      <p class="demo-note">請先使用提供給農民的帳號登入，登入後即可查看出貨順序並更新配送狀態。</p>
      <div class="admin-login-form farmer-login-form">
        <label>Email
          <input id="adminEmail" type="email" autocomplete="username" list="adminEmailList" placeholder="農民或管理員信箱" />
          <datalist id="adminEmailList">${savedAdminEmails().map((email) => `<option value="${email}"></option>`).join("")}</datalist>
        </label>
        <label>密碼<input id="adminPassword" type="password" autocomplete="current-password" placeholder="登入密碼" /></label>
        <button class="button primary" type="button" id="adminLogin">登入查看出貨清單</button>
      </div>
    `;
    $("#adminLogin").addEventListener("click", loginAdmin);
    return;
  }
  const orders = getOrders();
  if (!orders.length) {
    container.innerHTML = `<p class="demo-note">目前尚無出貨訂單。</p>`;
    return;
  }
  container.innerHTML = orders.map((order, index) => {
    const workflow = orderWorkflow(order);
    const meta = orderDisplayStatus(order);
    return `
      <article class="order-card farmer-card">
        <div class="order-card-header">
          <div>
            <div class="sequence-pill">${orderSequenceText(index)}</div>
            <h3>${order.id}｜${order.customerName}</h3>
            <div class="small">${deliveryLabel(order.deliveryMode)}｜${deliveryDateText(order)}</div>
          </div>
          <span class="badge ${meta.className}">${meta.label}</span>
        </div>
        ${adminShipmentOverview(order)}
        <div class="admin-actions farmer-actions">
          ${["dispatched", "shipping", "done"].map((status) => statusButton(order.id, status, workflow[status])).join("")}
          <button type="button" data-copy="${order.id}">複製出貨明細</button>
        </div>
      </article>
    `;
  }).join("");
  $$("[data-status]").forEach((button) => {
    button.addEventListener("click", () => updateOrderStatus(button.dataset.orderId, button.dataset.status));
  });
  $$("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyFarmerMessage(button.dataset.copy));
  });
}

function renderAdmin() {
  renderAdminLogin();
  const locked = firebaseReady && !adminUser;
  $("#adminMainGrid").hidden = locked;
  $("#adminOrderPanel").hidden = locked;
  if (locked) return;
  renderInventory();
  renderFinanceCards();
  renderAdminOrders();
}

function renderAdminLogin() {
  let loginPanel = $("#adminLoginPanel");
  if (!loginPanel) {
    loginPanel = document.createElement("section");
    loginPanel.id = "adminLoginPanel";
    loginPanel.className = "panel admin-login-panel";
    $(".admin-header").insertAdjacentElement("afterend", loginPanel);
  }

  if (!firebaseReady) {
    loginPanel.innerHTML = `
      <h2>Firebase 尚未連線</h2>
      <p class="small">請用本機網址開啟網站，並確認 Firebase 專案、Firestore Database 與規則已設定完成。</p>
    `;
    return;
  }

  if (adminUser) {
    loginPanel.innerHTML = `
      <div class="admin-login-row">
        <div>
          <h2>管理員已登入</h2>
          <p class="small">${adminUser.email}，目前可讀取與管理雲端訂單。</p>
        </div>
        <button class="button ghost" type="button" id="adminLogout">登出</button>
      </div>
    `;
    $("#adminLogout").addEventListener("click", async () => {
      await authApi.signOut(auth);
      adminUser = null;
      renderAdmin();
    });
    return;
  }

  loginPanel.innerHTML = `
    <h2>管理員登入</h2>
    <p class="small">前台可以送出訂單；後台讀取、修改訂單前，需要先用 Firebase Authentication 管理員帳號登入。</p>
    <div class="admin-login-form">
      <label>Email
        <input id="adminEmail" type="email" autocomplete="username" list="adminEmailList" placeholder="管理員信箱" />
        <datalist id="adminEmailList">${savedAdminEmails().map((email) => `<option value="${email}"></option>`).join("")}</datalist>
      </label>
      <label>密碼<input id="adminPassword" type="password" autocomplete="current-password" placeholder="管理員密碼" /></label>
      <button class="button primary" type="button" id="adminLogin">登入後台</button>
    </div>
  `;
  $("#adminLogin").addEventListener("click", loginAdmin);
}

async function loginAdmin() {
  const email = $("#adminEmail").value.trim();
  const password = $("#adminPassword").value;
  if (!email || !password) {
    showToast("請輸入管理員 Email 與密碼。");
    return;
  }
  try {
    await authApi.signInWithEmailAndPassword(auth, email, password);
    saveAdminEmail(email);
    showToast("管理員登入成功。");
  } catch (error) {
    console.warn("管理員登入失敗。", error);
    showToast("登入失敗，請確認 Firebase Authentication 已建立管理員帳號。");
  }
}

function savedAdminEmails() {
  return readStore("pluwfunAdminEmails", []);
}

function saveAdminEmail(email) {
  const emails = savedAdminEmails().filter((item) => item !== email);
  emails.unshift(email);
  writeStore("pluwfunAdminEmails", emails.slice(0, 5));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

function resetDemoData() {
  localStorage.removeItem("pluwfunOrders");
  localStorage.removeItem("pluwfunInventory");
  getInventory();
  renderAll();
  renderAdmin();
  showToast("示範資料已重設。");
}

function handleRoute() {
  const isAdmin = location.hash === "#admin";
  const isFarmer = location.hash === "#farmer";
  $("main").hidden = isAdmin;
  $("main").hidden = isAdmin || isFarmer;
  $("#admin").hidden = !isAdmin;
  $("#farmer").hidden = !isFarmer;
  if (isAdmin) renderAdmin();
  if (isFarmer) renderFarmer();
}

function bindEvents() {
  $("#orderForm").addEventListener("submit", createOrder);
  $("#resetDemo").addEventListener("click", resetDemoData);
  $$('input[name="memberMode"], input[name="deliveryMode"]').forEach((input) => {
    input.addEventListener("change", renderAll);
  });
  ["#customerName", "#customerPhone"].forEach((selector) => {
    $(selector).addEventListener("input", () => {
      const nextName = $("#customerName").value;
      const nextPhone = $("#customerPhone").value;
      state.shipments.forEach((shipment) => {
        if (!shipment.recipient || shipment.recipient === state.lastCustomerName) shipment.recipient = nextName;
        if (!shipment.phone || shipment.phone === state.lastCustomerPhone) shipment.phone = nextPhone;
      });
      state.lastCustomerName = nextName;
      state.lastCustomerPhone = nextPhone;
      renderShipments();
      renderSummary();
    });
  });
  window.addEventListener("hashchange", handleRoute);
}

bindEvents();
renderAll();
handleRoute();
initFirebase().then(loadCloudData);
