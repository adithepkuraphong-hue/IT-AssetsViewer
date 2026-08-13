// ============================================================
// auth.js — Login, logout, routing, and user management
// ============================================================

function routeAllowed(route) {
  if (!state.user) return false;
  return !(state.user.role !== "admin" && route === "master");
}
function setRoute(route) {
  const nextRoute = routeAllowed(route) ? route : "dashboard";
  clearFiltersForRoute(nextRoute);
  state.expandedGroups = {};
  if (nextRoute === "master") {
    state.masterTab = "companies";
    state.pages["master-companies"] = 1;
  }
  state.settingsTab = "general";
  state.route = nextRoute;
  state.drawerOpen = false;
  state.modal = null;
  state.actionMenu = null;
  render();
}
function recordLoginAttempt(username, role, status) {
  DATA.loginHistory.unshift({
    name: username || "-",
    role: role || "-",
    time: new Date().toLocaleString("sv-SE"),
    ip: state.clientIp || "local",
    status,
  });
}
function loginIdMatches(user, loginId) {
  const id = String(loginId || "").toLowerCase();
  return [user.username, user.email].some(value => String(value || "").toLowerCase() === id);
}
function departmentRole(user, loginId) {
  const isEmailLogin = String(loginId || "").includes("@");
  if (isEmailLogin) {
    const department = normalize(user.department || "");
    return department === "it" || department.includes("information technology") ? "admin" : "user";
  }
  return String(user.role || "user").toLowerCase() === "admin" ? "admin" : "user";
}

let microsoftAuthClientPromise = null;

function microsoftRedirectUri() {
  return state.settings.microsoftRedirectUri || window.location.href.split(/[?#]/)[0];
}
function microsoftTenantId() {
  return (state.settings.microsoftTenantId || "common").trim() || "common";
}
function microsoftClientId() {
  return (state.settings.microsoftClientId || "").trim();
}
function microsoftAuthConfigured() {
  return Boolean(microsoftClientId());
}
async function microsoftAuthClient() {
  if (!window.msal) {
    throw new Error("MSAL library is not loaded");
  }
  if (!microsoftAuthConfigured()) {
    throw new Error("Microsoft Client ID is not configured");
  }
  if (!microsoftAuthClientPromise) {
    const config = {
      auth: {
        clientId: microsoftClientId(),
        authority: `https://login.microsoftonline.com/${microsoftTenantId()}`,
        redirectUri: microsoftRedirectUri(),
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
      },
    };
    if (window.msal.PublicClientApplication?.createPublicClientApplication) {
      microsoftAuthClientPromise = window.msal.PublicClientApplication.createPublicClientApplication(config);
    } else {
      const client = new window.msal.PublicClientApplication(config);
      microsoftAuthClientPromise = typeof client.initialize === "function"
        ? client.initialize().then(() => client)
        : Promise.resolve(client);
    }
  }
  return microsoftAuthClientPromise;
}
function userFromMicrosoftAccount(account, claims = {}) {
  const email = account?.username || claims.preferred_username || claims.email || "";
  const matched = registeredUsers().find(user => user.active !== false && loginIdMatches(user, email));
  const fallbackRole = String(state.settings.defaultRole || "user").toLowerCase() === "admin" ? "admin" : "user";
  return {
    name: matched?.name || account?.name || claims.name || email || "Microsoft User",
    username: matched?.username || email,
    email: matched?.email || email,
    department: matched?.department || claims.department || "",
    role: matched ? departmentRole(matched, email) : fallbackRole,
    authProvider: "microsoft",
  };
}
async function loginWithMicrosoft() {
  state.loginError = "";
  if (!microsoftAuthConfigured()) {
    showToast(t("กรุณาตั้งค่า Microsoft Client ID ก่อน", "Please configure the Microsoft Client ID first"));
    return;
  }
  try {
    const client = await microsoftAuthClient();
    const result = await client.loginPopup({
      scopes: ["openid", "profile", "email"],
      prompt: "select_account",
      redirectUri: microsoftRedirectUri(),
    });
    state.user = userFromMicrosoftAccount(result.account, result.idTokenClaims);
    state.modal = null;
    state.actionMenu = null;
    state.drawerOpen = false;
    localStorage.setItem("asset-control-user", JSON.stringify(state.user));
    recordLoginAttempt(state.user.email || state.user.name, state.user.role, "สำเร็จ");
    persistLocal();
    state.route = "dashboard";
    render();
    showToast(t("เข้าสู่ระบบด้วย Microsoft สำเร็จ", "Signed in with Microsoft"));
  } catch (err) {
    state.loginError = t("เข้าสู่ระบบด้วย Microsoft ไม่สำเร็จ", "Microsoft sign-in failed");
    recordLoginAttempt("Microsoft", "-", "ไม่สำเร็จ");
    persistLocal();
    render();
    showToast(err?.message || state.loginError);
  }
}
function saveMicrosoftAuthSettings() {
  const clientId = document.querySelector("[data-setting='microsoftClientId']")?.value.trim() || "";
  const tenantId = document.querySelector("[data-setting='microsoftTenantId']")?.value.trim() || "common";
  const redirectUri = document.querySelector("[data-setting='microsoftRedirectUri']")?.value.trim() || window.location.href.split(/[?#]/)[0];
  state.settings.microsoftClientId = clientId;
  state.settings.microsoftTenantId = tenantId;
  state.settings.microsoftRedirectUri = redirectUri;
  localStorage.setItem("asset-control-ms-client-id", clientId);
  localStorage.setItem("asset-control-ms-tenant-id", tenantId);
  localStorage.setItem("asset-control-ms-redirect-uri", redirectUri);
  microsoftAuthClientPromise = null;
  persistLocal();
  render();
  showToast(t("บันทึกการตั้งค่า Microsoft Login แล้ว", "Microsoft login settings saved"));
}
function deleteAllData() {
  const users = registeredUsers();
  replaceData({
    sourceFile: DATA.sourceFile || state.settings.dataSource || "asset-control-database.json",
    sourceId: DATA.sourceId || "asset-control-live-database",
    generatedAt: new Date().toISOString(),
    computerAssets: [],
    otherAssets: [],
    master: { companies: [], departments: [], locations: [], types: [] },
    maintenanceHistory: [],
    maintenanceRequests: [],
    checkoutRecords: [],
    notifications: [],
    loginHistory: [],
    users,
  });
  state.modal = null;
  state.actionMenu = null;
  state.pages = {};
  persistLocal();
  render();
  showToast(t("ลบข้อมูลทั้งหมดเรียบร้อยแล้ว", "All data deleted successfully"));
}
function confirmDelete() {
  const modal = state.modal || {};
  if (modal.type !== "delete-confirm") return;
  let toast = t("ลบข้อมูลเรียบร้อยแล้ว", "Deleted successfully");
  if (modal.target === "asset") {
    const list = listForGroup(modal.group || "computer");
    if (list[modal.index]) {
      const item = list[modal.index];
      recordAuditLog("ลบ", modal.group === "computer" ? "ทรัพย์สินคอมพิวเตอร์" : "ทรัพย์สินอื่นๆ", `ลบทรัพย์สิน Code: ${item.assetCode || item.code || "-"} (${item.brand || ""} ${item.model || ""})`);
      list.splice(modal.index, 1);
      toast = t("ลบทรัพย์สินแล้ว", "Asset deleted");
    }
  } else if (modal.target === "record") {
    const source = recordSource(modal.collection);
    if (source[modal.index]) {
      const item = source[modal.index];
      const categoryName = modal.collection === "maintenanceHistory" ? "ประวัติการซ่อม" : modal.collection === "maintenanceRequests" ? "รายการแจ้งซ่อม" : "รายการยืม-คืน";
      recordAuditLog("ลบ", categoryName, `ลบรายการ: ${item.title || item.asset || "-"} (${item.status || "-"})`);
      if (modal.collection === "maintenanceHistory") {
        removeMaintenanceRequestForHistory(item);
        if (item.sourceRequestId) {
          for (let index = source.length - 1; index >= 0; index -= 1) {
            if (source[index]?.sourceRequestId === item.sourceRequestId) source.splice(index, 1);
          }
        } else {
          source.splice(modal.index, 1);
        }
      } else if (modal.collection === "maintenanceRequests") {
        removeMaintenanceHistoryForRequest(item);
        source.splice(modal.index, 1);
      } else {
        source.splice(modal.index, 1);
      }
      toast = t("ลบรายการแล้ว", "Record deleted");
    }
  } else if (modal.target === "master") {
    const tabName = modal.tab || state.masterTab;
    const rows = DATA.master[tabName] || [];
    if (rows[modal.index]) {
      const item = rows[modal.index];
      recordAuditLog("ลบ", `ข้อมูลหลัก (${tabName})`, `ลบข้อมูลหลัก Code: ${item.code || "-"} (${item.name || "-"})`);
      rows.splice(modal.index, 1);
      toast = t("ลบข้อมูลหลักแล้ว", "Master Data deleted");
    }
  } else if (modal.target === "user") {
    const user = DATA.users[modal.index];
    if (user && user.username !== state.user.username) {
      recordAuditLog("ลบ", "บัญชีผู้ใช้งาน", `ลบบัญชีผู้ใช้ Username: ${user.username} (${user.name || ""})`);
      DATA.users.splice(modal.index, 1);
      toast = t("ลบผู้ใช้เรียบร้อยแล้ว", "User deleted successfully");
    }
  }
  state.modal = null;
  state.actionMenu = null;
  persistLocal();
  render();
  showToast(toast);
}
function login() {
  const username = document.querySelector("[data-login-username]")?.value.trim() || "";
  const password = document.querySelector("[data-login-password]")?.value || "";
  const account = registeredUsers().find(user => loginIdMatches(user, username) && user.active !== false);
  if (!account) {
    state.loginError = username.includes("@") ? "ไม่พบเมลบริษัทนี้ในฐานข้อมูลผู้ใช้" : "Username หรือ Password ไม่ถูกต้อง";
    recordLoginAttempt(username, "-", "ไม่สำเร็จ");
    persistLocal();
    render();
    return;
  }
  if (String(account.password || "") !== password) {
    state.loginError = "Password ไม่ถูกต้อง";
    recordLoginAttempt(username, "-", "ไม่สำเร็จ");
    persistLocal();
    render();
    return;
  }
  state.loginError = "";
  state.modal = null;
  state.actionMenu = null;
  state.drawerOpen = false;
  state.user = {
    name: account.name || account.username,
    username: account.username,
    email: account.email || "",
    department: account.department || "",
    role: departmentRole(account, username),
  };
  localStorage.setItem("asset-control-user", JSON.stringify(state.user));
  recordLoginAttempt(state.user.name, state.user.role, "สำเร็จ");
  persistLocal();
  state.route = "dashboard";
  render();
}
function logout() {
  localStorage.removeItem("asset-control-user");
  state.user = null;
  state.modal = null;
  state.actionMenu = null;
  state.drawerOpen = false;
  render();
}

// --- Form submit functions ---
function submitMaintenanceRequest() {
  const selectedAssetRef = modalValue("[data-request-field='asset']");
  const resolved = itemForAssetRef(selectedAssetRef, state.modal?.assetGroup || "computer");
  const fallback = allAssets()[0];
  const asset = resolved.item || fallback;
  const assetGroup = resolved.item ? resolved.group : fallback?.group || "computer";
  const request = {
    title: modalValue("[data-request-field='title']", `Maintenance Request - ${asset?.assetCode || "Asset"}`),
    desc: modalValue("[data-request-field='desc']", "No additional detail"),
    asset: asset?.assetCode || "-",
    assetGroup, assetIndex: resolved.index,
    brand: asset?.brand || "-",
    model: asset?.model || "-",
    serial: asset?.serial || "-",
    assetDepartment: asset?.department || "-",
    location: asset?.location || "-",
    room: asset?.room || "",
    type: asset?.type || "-",
    requester: modalValue("[data-request-field='requester']", state.user.name),
    requesterDepartment: modalValue("[data-request-field='requesterDepartment']", state.user.department || ""),
    date: modalValue("[data-request-field='date']", today()),
    priority: modalValue("[data-request-field='priority']", "ปานกลาง"),
    cost: formatRepairCost(modalValue("[data-request-field='cost']", "")),
    status: "รออนุมัติ",
  };
  DATA.maintenanceRequests.unshift(request);
  ensureMaintenanceHistoryFromRequest(request, "รอดำเนินการ");
  state.modal = null;
  state.route = "maintenance-request";
  state.pages["maintenance-request"] = 1;
  persistLocal();
  showToast("ส่งคำขอซ่อมแล้ว");
}

function formatRepairCost(value, fallback = "-") {
  const raw = String(value || "").replace(/[^\d.]/g, "");
  if (!raw) return fallback;
  const amount = Number(raw);
  return Number.isFinite(amount) ? `฿${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : fallback;
}

function historyStatusForMaintenanceRequest(request, fallback = "รอดำเนินการ") {
  const status = normalize(request?.status || "");
  if (status.includes("รอ")) return "รอดำเนินการ";
  if (status.includes("อนุมัติ")) return "กำลังดำเนินการ";
  if (status.includes("กำลัง")) return "กำลังดำเนินการ";
  if (status.includes("เสร็จ")) return "เสร็จสิ้น";
  return fallback;
}

function findAssetForMaintenanceRequest(request) {
  if (!request) return {};
  const group = request.assetGroup === "other" ? "other" : "computer";
  const source = listForGroup(group);
  let assetIndex = Number(request.assetIndex);
  if (!Number.isInteger(assetIndex) || assetIndex < 0 || !source[assetIndex]) {
    assetIndex = source.findIndex(item => item.assetCode === request.asset);
  }
  return { group, source, assetIndex, asset: source[assetIndex] };
}

function setAssetSentForRepair(request) {
  const { group, assetIndex, asset } = findAssetForMaintenanceRequest(request);
  if (!asset) return;
  asset.status = "ส่งซ่อม";
  asset.sentForRepairDate = request.approvedDate || today();
  request.assetGroup = group;
  request.assetIndex = assetIndex;
}

function findAssetForMaintenanceHistory(row) {
  if (!row) return {};
  const preferredGroup = row.assetGroup === "other" ? "other" : row.assetGroup === "computer" ? "computer" : "";
  const groups = preferredGroup ? [preferredGroup] : ["computer", "other"];
  for (const group of groups) {
    const source = listForGroup(group);
    let assetIndex = Number(row.assetIndex);
    if (Number.isInteger(assetIndex) && assetIndex >= 0 && source[assetIndex]) {
      return { group, source, assetIndex, asset: source[assetIndex] };
    }
    assetIndex = source.findIndex(item => item.assetCode === row.asset);
    if (assetIndex >= 0) return { group, source, assetIndex, asset: source[assetIndex] };
  }
  return {};
}

function setAssetAvailableAfterRepair(row) {
  const { group, assetIndex, asset } = findAssetForMaintenanceHistory(row);
  if (!asset) return;
  asset.status = "ไม่ได้ใช้งาน";
  row.assetGroup = group;
  row.assetIndex = assetIndex;
}

function removeMaintenanceHistoryForRequest(request) {
  const historyId = request?.maintenanceHistoryId;
  if (!historyId || !Array.isArray(DATA.maintenanceHistory)) return;
  for (let index = DATA.maintenanceHistory.length - 1; index >= 0; index -= 1) {
    if (DATA.maintenanceHistory[index]?.sourceRequestId === historyId) {
      DATA.maintenanceHistory.splice(index, 1);
    }
  }
}

function removeMaintenanceRequestForHistory(row) {
  const historyId = row?.sourceRequestId;
  if (!historyId || !Array.isArray(DATA.maintenanceRequests)) return;
  for (let index = DATA.maintenanceRequests.length - 1; index >= 0; index -= 1) {
    if (DATA.maintenanceRequests[index]?.maintenanceHistoryId === historyId) {
      DATA.maintenanceRequests.splice(index, 1);
    }
  }
}

function ensureMaintenanceHistoryFromRequest(request, historyStatus = historyStatusForMaintenanceRequest(request)) {
  if (!request) return null;
  if (!Array.isArray(DATA.maintenanceHistory)) DATA.maintenanceHistory = [];
  const historyId = request.maintenanceHistoryId || `maintenance-request-${Date.now()}`;
  request.maintenanceHistoryId = historyId;
  const existing = DATA.maintenanceHistory.find(item => item.sourceRequestId === historyId);
  const linkedAsset = findAssetForMaintenanceRequest(request).asset || {};
  const row = {
    sourceRequestId: historyId,
    title: request.title || "คำขอซ่อม",
    desc: request.desc || "-",
    asset: request.asset || `${request.brand || "-"} ${request.type || ""}`.trim(),
    brand: request.brand || linkedAsset.brand || "-",
    model: request.model || linkedAsset.model || "-",
    serial: request.serial || linkedAsset.serial || "-",
    assetDepartment: request.assetDepartment || linkedAsset.department || "-",
    location: request.location || linkedAsset.location || "-",
    room: request.room || linkedAsset.room || "",
    requester: request.requester || "-",
    requesterDepartment: request.requesterDepartment || "-",
    requestDate: request.date || "-",
    approvedDate: request.approvedDate || "",
    approvalNote: request.approvalNote || "",
    assetGroup: request.assetGroup || "",
    assetIndex: request.assetIndex,
    type: request.type || "ซ่อมแก้ไข",
    date: request.approvedDate || today(),
    completedDate: "",
    cost: request.cost || "-",
    status: historyStatus,
    owner: state.user?.name || "IT Support",
    priority: request.priority || "",
  };
  if (existing) {
    Object.assign(existing, row, {
      completedDate: existing.completedDate || row.completedDate,
      cost: existing.cost && existing.cost !== "-" ? existing.cost : row.cost,
    });
    return existing;
  }
  DATA.maintenanceHistory.unshift(row);
  return row;
}

function syncMaintenanceHistoryFromRequests() {
  (DATA.maintenanceRequests || []).forEach(request => {
    const status = normalize(request?.status || "");
    if (status.includes("ปฏิเสธ")) {
      removeMaintenanceHistoryForRequest(request);
      return;
    }
    const historyStatus = historyStatusForMaintenanceRequest(request);
    ensureMaintenanceHistoryFromRequest(request, historyStatus);
    if (historyStatus === "กำลังดำเนินการ") {
      request.approvedDate = request.approvedDate || today();
      setAssetSentForRepair(request);
    }
  });
}

function setMaintenanceRequestStatus(button, status) {
  const indexKey = status === "อนุมัติแล้ว" ? "approveMaintenanceRequest" : "rejectMaintenanceRequest";
  const index = Number(button?.currentTarget?.dataset[indexKey] || button?.dataset?.[indexKey]);
  const request = DATA.maintenanceRequests[index];
  if (!request) {
    showToast("ไม่พบรายการคำขอซ่อม");
    return;
  }
  request.status = status;
  if (status === "อนุมัติแล้ว") {
    request.approvedDate = request.approvedDate || today();
    ensureMaintenanceHistoryFromRequest(request, "กำลังดำเนินการ");
    setAssetSentForRepair(request);
  }
  if (status === "ปฏิเสธ") {
    request.approvalNote = request.approvalNote || "ปฏิเสธคำขอ";
    removeMaintenanceHistoryForRequest(request);
  }
  persistLocal();
  render();
  showToast(status === "อนุมัติแล้ว" ? "อนุมัติคำขอซ่อมแล้ว" : "ปฏิเสธคำขอซ่อมแล้ว");
}

function approveMaintenanceRequest(button) {
  setMaintenanceRequestStatus(button, "อนุมัติแล้ว");
}

function rejectMaintenanceRequest(button) {
  setMaintenanceRequestStatus(button, "ปฏิเสธ");
}

function completeMaintenanceHistory(button) {
  const index = Number(button?.currentTarget?.dataset.completeMaintenanceHistory || button?.dataset?.completeMaintenanceHistory);
  const row = DATA.maintenanceHistory[index];
  if (!row) {
    showToast("ไม่พบรายการประวัติการซ่อม");
    return;
  }
  row.status = "เสร็จสิ้น";
  row.completedDate = row.completedDate || today();
  const request = (DATA.maintenanceRequests || []).find(item => item.maintenanceHistoryId === row.sourceRequestId);
  if (request) {
    request.status = "เสร็จสิ้น";
    request.completedDate = row.completedDate;
  }
  setAssetAvailableAfterRepair(row);
  persistLocal();
  render();
  showToast("ยืนยันซ่อมเสร็จและอัปเดตสถานะอุปกรณ์แล้ว");
}
function submitCheckout() {
  const pending = state.pendingCheckout || {};
  // Resolve asset from pending or from still-visible form
  const selectedAssetRef = pending.selectedAssetCode
    ? null
    : modalValue("[data-checkout-field='asset']");
  const assetGroup = pending.assetGroup || state.modal?.assetGroup || "computer";
  let resolved;
  if (pending.selectedAssetCode) {
    const source = listForGroup(assetGroup);
    const idx = source.findIndex(item => item.assetCode === pending.selectedAssetCode);
    resolved = { item: idx >= 0 ? source[idx] : null, group: assetGroup, index: idx };
  } else {
    resolved = itemForAssetRef(selectedAssetRef, assetGroup);
  }
  const asset = resolved.item;
  const requester = pending.requester || modalValue("[data-checkout-field='requester']", state.user.name);
  const department = pending.department || modalValue("[data-checkout-field='department']", "-");
  const date = pending.date || modalValue("[data-checkout-field='date']", today());
  const expectedReturn = pending.expectedReturn || modalValue("[data-checkout-field='expectedReturn']", "-");
  const purpose = pending.purpose || modalValue("[data-checkout-field='purpose']", "ใช้งานภายในบริษัท");
  DATA.checkoutRecords.unshift({
    asset: asset ? `${asset.brand || ""} ${asset.type || ""}`.trim() || asset.assetCode : "New Asset",
    assetCode: asset?.assetCode || "-",
    assetGroup: resolved.group, assetIndex: resolved.index,
    sub: asset ? `${asset.brand || ""} ${asset.model || asset.type || ""}`.trim() || asset.assetCode : `Checkout - ${requester}`,
    requester,
    department,
    date,
    expectedReturn,
    purpose,
    status: "กำลังขอใช้งาน",
  });
  // Update matching user record with requester name
  if (requester && requester !== state.user.name) {
    const matchedUser = DATA.users.find(u => u.name === requester || u.username === requester);
    if (!matchedUser) {
      // No existing user found — optionally skip or create a note
    } else {
      matchedUser.name = requester;
      if (department && department !== "-") matchedUser.department = matchedUser.department || department;
    }
  } else if (state.user) {
    // Update current user's name if it differs
    const currentUser = DATA.users.find(u => u.username === state.user.username);
    if (currentUser && requester) currentUser.name = requester;
  }
  state.modal = null;
  state.pendingCheckout = null;
  state.route = "checkout";
  state.pages.checkout = 1;
  persistLocal();
  render();
  showToast("ส่งคำขอใช้งานแล้ว");
}

function checkoutRecordSnapshot(record) {
  return {
    requester: record?.requester || "-",
    department: record?.department || "-",
    asset: record?.assetCode && record.assetCode !== "-"
      ? `${record.assetCode} - ${record.sub || record.asset || ""}`.trim()
      : (record?.sub || record?.asset || "-"),
  };
}
function openCheckoutRecordConfirm(button) {
  const index = Number(button?.currentTarget?.dataset.confirmCheckoutRecord || button?.dataset?.confirmCheckoutRecord);
  const record = DATA.checkoutRecords[index];
  if (!record) return;
  state.pendingCheckoutRecord = index;
  state.modal = {
    type: "checkout-record-confirm",
    snapshot: checkoutRecordSnapshot(record),
  };
  render();
}
function confirmCheckoutRecord(button) {
  const fallbackIndex = Number(button?.currentTarget?.dataset.confirmCheckoutRecord || button?.dataset?.confirmCheckoutRecord);
  const index = Number.isInteger(state.pendingCheckoutRecord) ? state.pendingCheckoutRecord : fallbackIndex;
  const record = DATA.checkoutRecords[index];
  if (!record) return;
  const group = record.assetGroup || "computer";
  const source = listForGroup(group);
  let assetIndex = Number(record.assetIndex);
  if (!Number.isInteger(assetIndex) || assetIndex < 0 || !source[assetIndex]) {
    assetIndex = source.findIndex(item => item.assetCode === record.assetCode);
  }
  const asset = source[assetIndex];
  if (!asset) {
    showToast("ไม่พบทรัพย์สินสำหรับยืนยันรายการนี้");
    return;
  }
  asset.status = "ใช้งาน";
  asset.user = record.requester || asset.user || "-";
  asset.department = record.department || asset.department || "-";
  record.assetGroup = group;
  record.assetIndex = assetIndex;
  record.assetCode = asset.assetCode || record.assetCode || "-";
  record.assetConfirmed = true;
  record.status = "ยืนยันแล้ว";
  state.modal = null;
  state.pendingCheckoutRecord = null;
  persistLocal();
  render();
  showToast("ยืนยันรายการขอใช้งานและบันทึกเข้า asset แล้ว");
}

function checkoutAssetForRecord(record) {
  const group = record?.assetGroup || "computer";
  const source = listForGroup(group);
  let assetIndex = Number(record?.assetIndex);
  if (!Number.isInteger(assetIndex) || assetIndex < 0 || !source[assetIndex]) {
    assetIndex = source.findIndex(item => item.assetCode === record?.assetCode);
  }
  return { group, source, assetIndex, asset: source[assetIndex] };
}

function submitCheckoutReturn() {
  const selected = modalValue("[data-return-field='record']");
  const activeGroup = state.modal?.returnGroup || "";
  const selectedChoice = checkoutReturnChoiceFromInput(selected, activeGroup);
  const returnedDate = modalValue("[data-return-field='returnedDate']", today()) || today();
  let record = null;
  let resolved = null;
  if (!selectedChoice) {
    showToast("กรุณาเลือกรายการอุปกรณ์ที่ต้องการคืน");
    return;
  }
  const selectedValue = selectedChoice.value;
  if (selectedValue.startsWith("record:")) {
    const index = Number(selectedValue.split(":")[1]);
    record = DATA.checkoutRecords[index];
    if (!record) {
      showToast("ไม่พบรายการที่ต้องการคืน");
      return;
    }
    if (!checkoutCanReturn(record)) {
      showToast("รายการนี้คืนแล้ว");
      return;
    }
    resolved = checkoutAssetForRecord(record);
  } else if (selectedValue.startsWith("asset:")) {
    const [, group, rawIndex] = selectedValue.split(":");
    const assetIndex = Number(rawIndex);
    const source = listForGroup(group);
    const asset = source[assetIndex];
    if (!asset || !assetCanReturn(asset)) {
      showToast("ไม่พบอุปกรณ์ที่กำลังใช้งาน");
      return;
    }
    resolved = { group, source, assetIndex, asset };
    record = {
      asset: `${asset.brand || ""} ${asset.type || ""}`.trim() || asset.assetCode || "Asset",
      assetCode: asset.assetCode || "-",
      assetGroup: group,
      assetIndex,
      sub: `${asset.brand || ""} ${asset.model || asset.type || ""}`.trim() || asset.assetCode || "-",
      requester: asset.user || "-",
      department: asset.department || "-",
      date: "-",
      expectedReturn: "-",
      purpose: "แจ้งคืนอุปกรณ์",
      status: "คืนแล้ว",
      returnedDate,
      assetConfirmed: true,
    };
    DATA.checkoutRecords.unshift(record);
  } else {
    showToast("ไม่พบรายการที่ต้องการคืน");
    return;
  }
  if (resolved.asset) {
    record.assetGroup = resolved.group;
    record.assetIndex = resolved.assetIndex;
    record.assetCode = resolved.asset.assetCode || record.assetCode || "-";
  }
  record.status = "คืนแล้ว";
  record.returnedDate = returnedDate || today();
  record.assetConfirmed = true;
  state.modal = null;
  persistLocal();
  render();
  showToast("แจ้งคืนอุปกรณ์เรียบร้อยแล้ว");
}

function confirmCheckoutReturn(button) {
  const index = Number(button?.currentTarget?.dataset.confirmCheckoutReturn || button?.dataset?.confirmCheckoutReturn);
  const record = DATA.checkoutRecords[index];
  if (!record) {
    showToast("ไม่พบรายการคืนที่ต้องการยืนยัน");
    return;
  }
  const resolved = checkoutAssetForRecord(record);
  if (resolved.asset) {
    resolved.asset.status = "ไม่ได้ใช้งาน";
    if ("user" in resolved.asset) resolved.asset.user = "";
    if ("department" in resolved.asset) resolved.asset.department = "";
  }
  DATA.checkoutRecords.splice(index, 1);
  state.pages.checkout = 1;
  persistLocal();
  render();
  showToast("ยืนยันการคืนและอัปเดตสถานะอุปกรณ์แล้ว");
}

function assetItemFromForm(group, base = {}) {
  const isComputer = group === "computer";
  const item = {
    ...base,
    assetCode: modalValue("[data-asset-field='assetCode']", isComputer ? "NB-NEW-001" : "OT-NEW-001"),
    company: modalValue("[data-asset-field='company']", "KOCH"),
    type: modalValue("[data-asset-field='type']", isComputer ? "Notebook" : "Access Point"),
    brand: modalValue("[data-asset-field='brand']", "-"),
    model: modalValue("[data-asset-field='model']", "-"),
    serial: modalValue("[data-asset-field='serial']", "-"),
    status: modalValue("[data-asset-field='status']", "ไม่ได้ใช้งาน"),
    department: modalValue("[data-asset-field='department']", "-"),
    location: modalValue("[data-asset-field='location']", "-"),
    room: modalValue("[data-asset-field='room']", "-"),
    user: modalValue("[data-asset-field='user']", "-"),
    position: modalValue("[data-asset-field='position']", "-"),
    purchaseDate: modalValue("[data-asset-field='purchaseDate']", "-"),
    warrantyExpirationDate: modalValue("[data-asset-field='warrantyExpirationDate']", "-"),
    sentForRepairDate: modalValue("[data-asset-field='sentForRepairDate']", "-"),
    remark: modalValue("[data-asset-field='remark']", base.remark || "เพิ่มจากหน้าเว็บ"),
    imageUrl: [
      modalValue("[data-asset-field='imageUrl1']", ""),
      modalValue("[data-asset-field='imageUrl2']", "")
    ].filter(Boolean).join(","),
  };
  if (isComputer) {
    Object.assign(item, {
      rustDeskId: modalValue("[data-asset-field='rustDeskId']", base.rustDeskId || "-"),
      windowsVersion: modalValue("[data-asset-field='windowsVersion']", base.windowsVersion || "-"),
      adapter: checkboxValue("[data-asset-check='adapter']"),
      mouse: checkboxValue("[data-asset-check='mouse']"),
      laptopBag: checkboxValue("[data-asset-check='laptopBag']"),
      syncOneDrive: checkboxValue("[data-asset-check='syncOneDrive']"),
    });
  } else {
    // Dynamic fields for other groups
    const dynamicFields = [
      "material", "dimensions", "machineNumber",
      "licensePlate", "chassisNumber", "startingMileage", "fuelType",
      "powerRating", "voltage", "rpm",
      "maxRating", "maintenanceCycle", "breakerCode",
      "licenseKey", "licenseType", "licenseSeats"
    ];
    dynamicFields.forEach(field => {
      const el = document.querySelector(`[data-asset-field='${field}']`);
      if (el) {
        item[field] = el.value || "-";
      }
    });

    const dynamicChecks = [
      "cushion", "cabinetKey", "extensionCord",
      "easyPass", "spareTire", "dashcam",
      "userManual", "toolKit",
      "safetySign", "controlCabinetKey",
      "installManual", "downloadLink"
    ];
    dynamicChecks.forEach(check => {
      const el = document.querySelector(`[data-asset-check='${check}']`);
      if (el) {
        item[check] = el.checked;
      }
    });
  }
  return item;
}
function assetSavePayload(button) {
  const dataset = button?.currentTarget?.dataset || button?.dataset || {};
  const group = dataset.assetPresave || dataset.submitAsset || state.modal?.group || "computer";
  const list = listForGroup(group);
  const index = Number.isInteger(state.modal?.index) ? state.modal.index : NaN;
  const base = Number.isInteger(index) ? list[index] || {} : {};
  return {
    group,
    index,
    item: assetItemFromForm(group, base),
    fromCheckout: Boolean(state.modal?.fromCheckout || state.pendingCheckout),
    isEdit: Number.isInteger(index) && index >= 0,
  };
}
function presaveAsset(button) {
  const payload = assetSavePayload(button);
  state.pendingAssetSave = payload;
  state.modal = {
    type: "asset-save-confirm",
    snapshot: {
      assetCode: payload.item.assetCode,
      type: payload.item.type,
      modelText: [payload.item.brand, payload.item.model].filter(Boolean).join(" "),
      isEdit: payload.isEdit,
    },
  };
  render();
}
async function commitAssetSave(payload) {
  const { group, index, item, fromCheckout } = payload;
  
  if (state.selectedImageFile1 || state.selectedImageFile2) {
    showToast("กำลังอัปโหลดรูปภาพ...");
    try {
      if (state.selectedImageFile1) {
        const file = state.selectedImageFile1;
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file
        });
        if (response.ok) {
          const result = await response.json();
          if (result.ok && result.url) {
            item.imageUrl1 = result.url;
          }
        }
        state.selectedImageFile1 = null;
      }
      if (state.selectedImageFile2) {
        const file = state.selectedImageFile2;
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file
        });
        if (response.ok) {
          const result = await response.json();
          if (result.ok && result.url) {
            item.imageUrl2 = result.url;
          }
        }
        state.selectedImageFile2 = null;
      }
    } catch (error) {
      console.error(error);
      showToast("อัปโหลดรูปภาพล้มเหลว แต่กำลังบันทึกข้อมูลอื่น...");
    }
  }
  
  const finalUrl1 = item.imageUrl1 || modalValue("[data-asset-field='imageUrl1']", "");
  const finalUrl2 = item.imageUrl2 || modalValue("[data-asset-field='imageUrl2']", "");
  item.imageUrl = [finalUrl1, finalUrl2].filter(Boolean).join(",");
  
  const targetGroup = assetGroupForType(item.type);
  const sourceList = listForGroup(group);
  const targetList = listForGroup(targetGroup);
  item.updatedAt = new Date().toISOString();
  const normalizedItem = assetForGroup(item, targetGroup);
  const isComputer = targetGroup === "computer";
  if (Number.isInteger(index) && index >= 0 && group === targetGroup) {
    sourceList[index] = normalizedItem;
  } else {
    if (Number.isInteger(index) && index >= 0) sourceList.splice(index, 1);
    targetList.unshift(normalizedItem);
  }
  const isEditAsset = Number.isInteger(index) && index >= 0;
  recordAuditLog(
    isEditAsset ? "แก้ไข" : "เพิ่ม",
    isComputer ? "ทรัพย์สินคอมพิวเตอร์" : "ทรัพย์สินอื่นๆ",
    `${isEditAsset ? "แก้ไข" : "เพิ่ม"}ข้อมูลทรัพย์สิน Code: ${normalizedItem.assetCode} (${normalizedItem.brand || ""} ${normalizedItem.model || ""})`
  );
  persistLocal();
  state.pendingAssetSave = null;
  if (fromCheckout) {
    state.modal = {
      type: "checkout",
      assetGroup: targetGroup,
      selectedAssetCode: normalizedItem.assetCode
    };
  } else {
    // Stay on current dynamic group route if applicable
    if (state.route && state.route.startsWith("assets-")) {
      // Already on a group page — stay there
      state.pages[`${state.route}-assets`] = 1;
    } else {
      state.route = isComputer ? "computer" : "other";
      state.pages[`${state.route}-assets`] = 1;
    }
    state.modal = null;
  }
  showToast(Number.isInteger(index) ? "บันทึกการแก้ไขทรัพย์สินแล้ว" : "เพิ่มทรัพย์สินแล้ว");
}
async function confirmAssetSave() {
  if (!state.pendingAssetSave) return;
  await commitAssetSave(state.pendingAssetSave);
}
async function submitAsset(button) {
  await commitAssetSave(assetSavePayload(button));
}
function submitMaster(button) {
  const tab = button.currentTarget?.dataset.submitMaster || state.masterTab;
  const rows = DATA.master[tab] || [];
  const row = {
    code: modalValue("[data-master-field='code']", "NEW"),
    name: modalValue("[data-master-field='name']", "New Master Data"),
  };
  const rawIndex = button.currentTarget?.dataset.index;
  const index = rawIndex === "" || rawIndex === undefined ? NaN : Number(rawIndex);
  const isEditMaster = Number.isInteger(index) && index >= 0;
  if (isEditMaster) rows[index] = row;
  else rows.unshift(row);
  recordAuditLog(
    isEditMaster ? "แก้ไข" : "เพิ่ม",
    `ข้อมูลหลัก (${tab})`,
    `${isEditMaster ? "แก้ไข" : "เพิ่ม"}ข้อมูลหลัก Code: ${row.code} (${row.name})`
  );
  state.modal = null;
  state.pages[`master-${tab}`] = 1;
  persistLocal();
  showToast("บันทึก Master Data แล้ว");
}
function submitRecordEdit(button) {
  const target = button?.currentTarget || button;
  const collection = target?.dataset?.submitRecord;
  const index = Number(target?.dataset?.index);
  const source = recordSource(collection);
  const item = source[index];
  if (!item) return;
  if (collection === "maintenanceHistory") {
    item.title = modalValue("[data-record-field='title']", item.title);
    item.type = modalValue("[data-record-field='type']", item.type);
    item.desc = modalValue("[data-record-field='desc']", item.desc || "");
    item.date = modalValue("[data-record-field='date']", item.date);
    item.completedDate = modalValue("[data-record-field='completedDate']", item.completedDate || "");
    const cost = modalValue("[data-record-field='cost']", String(item.cost || "").replace(/[^\d.]/g, ""));
    item.cost = cost ? `฿${Number(cost).toLocaleString("en-US")}` : item.cost;
    item.status = modalValue("[data-record-field='status']", item.status);
  } else if (collection === "maintenanceRequests") {
    item.title = modalValue("[data-record-field='title']", item.title);
    item.date = modalValue("[data-record-field='date']", item.date);
    item.requester = modalValue("[data-record-field='requester']", item.requester);
    item.requesterDepartment = modalValue("[data-record-field='requesterDepartment']", item.requesterDepartment || "");
    item.desc = modalValue("[data-record-field='desc']", item.desc || "");
    item.priority = modalValue("[data-record-field='priority']", item.priority);
    item.cost = formatRepairCost(modalValue("[data-record-field='cost']", String(item.cost || "").replace(/[^\d.]/g, "")), item.cost || "-");
    item.status = modalValue("[data-record-field='status']", item.status);
    item.approvedDate = modalValue("[data-record-field='approvedDate']", item.approvedDate || "");
    item.approvalNote = modalValue("[data-record-field='approvalNote']", item.approvalNote || "");
    if (item.status === "อนุมัติแล้ว") {
      item.approvedDate = item.approvedDate || today();
      ensureMaintenanceHistoryFromRequest(item, "กำลังดำเนินการ");
      setAssetSentForRepair(item);
    } else if (item.status === "ปฏิเสธ") {
      removeMaintenanceHistoryForRequest(item);
    } else {
      ensureMaintenanceHistoryFromRequest(item, historyStatusForMaintenanceRequest(item));
    }
  } else {
    item.sub = modalValue("[data-record-field='sub']", item.sub || "");
    item.status = modalValue("[data-record-field='status']", item.status);
    item.date = modalValue("[data-record-field='date']", item.date);
    item.returnedDate = modalValue("[data-record-field='returnedDate']", item.returnedDate || "");
    item.purpose = modalValue("[data-record-field='purpose']", item.purpose || "");
  }
  const categoryName = collection === "maintenanceHistory" ? "ประวัติการซ่อม" : collection === "maintenanceRequests" ? "รายการแจ้งซ่อม" : "รายการยืม-คืน";
  recordAuditLog("แก้ไข", categoryName, `แก้ไขรายการ: ${item.title || item.asset || "-"} (สถานะ: ${item.status || "-"})`);
  state.modal = null;
  persistLocal();
  showToast("บันทึกการแก้ไขแล้ว");
}
function settingChecked(key, fallback = true) {
  return state.settings[key] === undefined ? fallback : state.settings[key] === true || state.settings[key] === "true";
}
function saveSettings() {
  document.querySelectorAll("[data-setting]").forEach(input => {
    state.settings[input.dataset.setting] = input.type === "checkbox" ? input.checked : input.value;
  });
  persistLocal();
  showToast("บันทึก Settings แล้ว");
}
function submitUser(indexOrNew) {
  const isEdit = indexOrNew !== "new";
  const idx = isEdit ? Number(indexOrNew) : -1;
  const users = registeredUsers();
  const username = modalValue("[data-user-field='username']");
  const name = modalValue("[data-user-field='name']");
  const email = modalValue("[data-user-field='email']");
  const department = modalValue("[data-user-field='department']");
  const role = modalValue("[data-user-field='role']", "user");
  const avatar = modalValue("[data-user-field='avatar']", "");
  if (!username) { showToast(t("กรุณากรอก Username", "Please enter a username")); return; }
  if (!isEdit) {
    const password = modalValue("[data-user-field='password']");
    const passwordConfirm = modalValue("[data-user-field='passwordConfirm']");
    if (!password) { showToast(t("กรุณากรอกรหัสผ่าน", "Please enter a password")); return; }
    if (!passwordConfirm) { showToast(t("กรุณายืนยันรหัสผ่าน", "Please confirm the password")); return; }
    if (password !== passwordConfirm) { showToast(t("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", "Password and confirmation do not match")); return; }
    const existing = users.find(u => u.username === username);
    if (existing) { showToast(t("Username นี้มีอยู่แล้ว", "This username already exists")); return; }
    DATA.users.push({ username, name, email, department, role, password, avatar, active: true });
    recordAuditLog("เพิ่ม", "บัญชีผู้ใช้งาน", `เพิ่มบัญชีผู้ใช้ใหม่ Username: ${username} (${name}) Role: ${role}`);
  } else {
    const user = DATA.users[idx];
    if (!user) return;
    user.name = name;
    user.email = email;
    user.department = department;
    user.role = role;
    user.avatar = avatar;
    recordAuditLog("แก้ไข", "บัญชีผู้ใช้งาน", `แก้ไขข้อมูลบัญชีผู้ใช้ Username: ${user.username} (${name}) Role: ${role}`);
    if (state.user && state.user.username.toLowerCase() === user.username.toLowerCase()) {
      state.user.name = name;
      state.user.email = email;
      state.user.department = department;
      state.user.role = role;
      state.user.avatar = avatar;
      localStorage.setItem("asset-control-user", JSON.stringify(state.user));
    }
  }
  state.modal = null;
  persistLocal();
  render();
  showToast(isEdit ? t("อัปเดตข้อมูลผู้ใช้เรียบร้อย", "User updated successfully") : t("เพิ่มผู้ใช้ใหม่เรียบร้อย", "New user added successfully"));
}
function submitUserPassword(idx) {
  const user = DATA.users[Number(idx)];
  if (!user) return;
  const newPw = modalValue("[data-user-field='password']");
  const confirmPw = modalValue("[data-user-field='passwordConfirm']");
  if (!newPw) { showToast(t("กรุณากรอกรหัสผ่านใหม่", "Please enter a new password")); return; }
  if (!confirmPw) { showToast(t("กรุณายืนยันรหัสผ่านใหม่", "Please confirm the new password")); return; }
  if (newPw !== confirmPw) { showToast(t("รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ไม่ตรงกัน", "New password and confirmation do not match")); return; }
  const isOwnPassword = state.user && String(state.user.username).toLowerCase() === String(user.username).toLowerCase();
  user.password = newPw;
  state.modal = null;
  persistLocal();
  render();
  showToast(isOwnPassword ? t("เปลี่ยนรหัสผ่านเรียบร้อย", "Password changed successfully") : t("รีเซ็ตรหัสผ่านเรียบร้อย", "Password reset successfully"));
}
function backupDatabase() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataSnapshot(), null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `asset-control-backup-${today()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(t("ส่งออกข้อมูลสำรองเสร็จสิ้น", "Backup file exported"));
}
function restoreDatabase(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.computerAssets || !parsed.otherAssets) {
        throw new Error(t("โครงสร้างไฟล์ข้อมูลสำรองไม่ถูกต้อง (Missing assets arrays)", "Invalid backup structure (Missing assets arrays)"));
      }
      replaceData(parsed);
      persistLocal();
      render();
      showToast(t("กู้คืนข้อมูลเรียบร้อยแล้ว", "Database restored successfully"));
    } catch (err) {
      alert(t("ไม่สามารถอ่านไฟล์สำรองได้: ", "Cannot read backup file: ") + err.message);
    }
  };
  reader.readAsText(file);
}
async function testConnection() {
  const statusEl = document.getElementById("supabase-health-status");
  if (!statusEl) return;
  statusEl.textContent = t("กำลังตรวจสอบ...", "Checking...");
  statusEl.style.color = "var(--orange)";

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    statusEl.textContent = t("ออฟไลน์ (ไม่ได้เชื่อมต่ออินเทอร์เน็ต)", "Offline (No Internet Connection)");
    statusEl.style.color = "var(--danger)";
    return;
  }

  if (!DATABASE_API_ENABLED) {
    statusEl.textContent = t("เชื่อมต่อไม่ได้ (ทำงานในโหมด Standalone)", "Disconnected (Standalone Mode)");
    statusEl.style.color = "var(--danger)";
    return;
  }
  try {
    const res = await fetch("/api/status");
    if (res.ok) {
      const data = await res.json();
      if (data.supabaseOnline) {
        statusEl.textContent = t("เชื่อมต่อสำเร็จ (ออนไลน์)", "Connected (Online)");
        statusEl.style.color = "var(--green)";
      } else {
        statusEl.textContent = t("ออฟไลน์ (ไม่สามารถเชื่อมต่อ Supabase คลาวด์ได้)", "Offline (Supabase Cloud Unreachable)");
        statusEl.style.color = "var(--danger)";
      }
    } else {
      statusEl.textContent = t("ล้มเหลว (เกิดข้อผิดพลาดจากเซิร์ฟเวอร์)", "Failed (Server Error)");
      statusEl.style.color = "var(--danger)";
    }
  } catch (err) {
    statusEl.textContent = t("ล้มเหลว (ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้)", "Failed (Network Error)");
    statusEl.style.color = "var(--danger)";
  }
}
