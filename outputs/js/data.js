// ============================================================
// data.js — State, DATA, constants, and API/persistence logic
// ============================================================

let DATA = window.ASSET_CONTROL_DATA;
const LOCAL_DATA_KEY = "asset-control-local-data";
const DATA_SCHEMA_VERSION = "asset-code-dedupe-v3-admin-reset";

// Auto-route API requests to local node server if running under file:// protocol
if (window.location.protocol === "file:") {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === "string" && input.startsWith("/api/")) {
      input = "http://127.0.0.1:8788" + input;
    }
    return originalFetch(input, init);
  };
}
const DATABASE_API_ENABLED = true;
let databaseVersion = null;
let databaseSaveTimer = null;
let databaseSaveInFlight = false;
let databaseSaveQueued = false;
const SOURCE_ID = `${DATA.sourceId || DATA.generatedAt || "default-source"}:${DATA_SCHEMA_VERSION}`;
const savedLocal = (() => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_DATA_KEY) || "{}");
  } catch {
    return {};
  }
})();
const hasCurrentLocalData = !DATABASE_API_ENABLED && savedLocal.sourceId === SOURCE_ID && savedLocal.data;
if (hasCurrentLocalData) {
  DATA.computerAssets = savedLocal.data.computerAssets || DATA.computerAssets;
  DATA.otherAssets = savedLocal.data.otherAssets || DATA.otherAssets;
  DATA.master = savedLocal.data.master || DATA.master;
  DATA.maintenanceHistory = savedLocal.data.maintenanceHistory || DATA.maintenanceHistory;
  DATA.maintenanceRequests = savedLocal.data.maintenanceRequests || DATA.maintenanceRequests;
  DATA.checkoutRecords = savedLocal.data.checkoutRecords || DATA.checkoutRecords;
  DATA.notifications = savedLocal.data.notifications || DATA.notifications;
  DATA.loginHistory = savedLocal.data.loginHistory || DATA.loginHistory;
  DATA.auditLogs = savedLocal.data.auditLogs || DATA.auditLogs;
  DATA.users = savedLocal.data.users || DATA.users;
}

const state = {
  user: JSON.parse(localStorage.getItem("asset-control-user") || "null"),
  clientIp: "local",
  route: "dashboard",
  drawerOpen: false,
  modal: null,
  actionMenu: null,
  filters: {},
  masterTab: "companies",
  settingsTab: "general",
  loginFilterStatus: "all",
  loginLimit: "20",
  editingGeneral: false,
  settingsDirty: false,
  lang: localStorage.getItem("asset-control-lang") || "th",
  notificationTab: "unread",
  sidebarCollapsed: false,
  pages: {},
  pageSizes: {},
  toast: null,
  loginError: "",
  settings: {
    orgName: "KOCH PACKAGING AND PACKING SERVICES CO., LTD.",
    address: "Bang Saen, Chonburi",
    warrantyDays: "30",
    returnDays: "3",
    theme: localStorage.getItem("asset-control-theme") === "dark" ? "Dark" : "Light",
    fontSize: "normal",
    defaultPageSize: "5",
    inAppAlerts: true,
    twoFactor: true,
    twoFactorCode: "123456",
    sessionTimeout: "30",
    defaultRole: "User",
    dataSource: DATA.sourceFile || "Asset Management.xlsx",
    microsoftClientId: localStorage.getItem("asset-control-ms-client-id") || "",
    microsoftTenantId: localStorage.getItem("asset-control-ms-tenant-id") || "common",
    microsoftRedirectUri: localStorage.getItem("asset-control-ms-redirect-uri") || window.location.href.split(/[?#]/)[0],
    ...(hasCurrentLocalData ? savedLocal.settings || {} : {}),
  },
};
const PAGE_SIZE = 5;
const NOTIFICATION_PAGE_SIZE = 3;
const ACTION_MENU_WIDTH = 180;
const ACTION_MENU_HEIGHT = 132;
const ACTION_MENU_GAP = 8;
const COMPUTER_ASSET_TYPES = new Set(["notebook", "tablet", "desktop pc", "macbook", "ipad"]);

function normalizeAssetType(value) {
  return String(value || "").trim().toLowerCase();
}

function isComputerAssetType(value) {
  return COMPUTER_ASSET_TYPES.has(normalizeAssetType(value));
}

function assetGroupForType(value) {
  return isComputerAssetType(value) ? "computer" : "other";
}

function assetForGroup(item, group) {
  let remark = item.remark || "";
  let imageUrl = item.imageUrl || "";
  if (!imageUrl && remark) {
    const match = remark.match(/\[image:\s*([^\s\]]+)\]/);
    if (match) {
      imageUrl = match[1];
      remark = remark.replace(/[\r\n]*\[image:\s*[^\s\]]+\]/, "").trim();
    }
  }
  const base = {
    assetCode: item.assetCode || "-",
    company: item.company || "-",
    type: item.type || "-",
    brand: item.brand || "-",
    model: item.model || "-",
    serial: item.serial || "-",
    location: item.location || "-",
    room: item.room || "-",
    purchaseDate: item.purchaseDate || "-",
    status: item.status === "รอย้ายไป WH บ่อวิน" ? "รอย้าย" : (item.status || "-"),
    warrantyExpirationDate: item.warrantyExpirationDate || "-",
    remark: remark,
    imageUrl: imageUrl,
    updatedAt: item.updatedAt || "",
    sourceSheet: item.sourceSheet ?? null,
    sourceRow: item.sourceRow ?? null,
    user: item.user || "-",
    department: item.department || "-",
    position: item.position || "-",
    sentForRepairDate: item.sentForRepairDate || "-",
  };
  if (group === "computer") {
    return {
      ...base,
      rustDeskId: item.rustDeskId || "-",
      windowsVersion: item.windowsVersion || "-",
      adapter: item.adapter === true,
      mouse: item.mouse === true,
      laptopBag: item.laptopBag === true,
      syncOneDrive: item.syncOneDrive === true,
    };
  }

  // Dynamic custom fields for other groups
  const dynamicFields = [
    "material", "dimensions", "machineNumber",
    "licensePlate", "chassisNumber", "startingMileage", "fuelType",
    "powerRating", "voltage", "rpm",
    "maxRating", "maintenanceCycle", "breakerCode",
    "licenseKey", "licenseType", "licenseSeats"
  ];
  dynamicFields.forEach(field => {
    if (item[field] !== undefined) {
      base[field] = item[field];
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
    if (item[check] !== undefined) {
      base[check] = item[check] === true;
    }
  });
  return base;
}

function normalizeAssetCollections(data = DATA) {
  const computerAssets = [];
  const otherAssets = [];
  [...(data.computerAssets || []), ...(data.otherAssets || [])].forEach(item => {
    const group = assetGroupForType(item.type);
    if (group === "computer") computerAssets.push(assetForGroup(item, "computer"));
    else otherAssets.push(assetForGroup(item, "other"));
  });
  data.computerAssets = computerAssets;
  data.otherAssets = otherAssets;
}

normalizeAssetCollections(DATA);

// --- Asset helpers ---
function allAssets() {
  return [
    ...DATA.computerAssets.map(item => ({ ...item, group: "computer" })),
    ...DATA.otherAssets.map(item => ({ ...item, group: "other" })),
  ];
}
function listForGroup(group) {
  return group === "computer" ? DATA.computerAssets : DATA.otherAssets;
}
function itemForGroupIndex(group, index) {
  return listForGroup(group)[Number(index)];
}
function assetRef(group, index) {
  return `${group}:${index}`;
}
function parseAssetRef(value, fallbackGroup = "computer") {
  const [rawGroup, rawIndex] = String(value || "").split(":");
  const group = rawGroup === "other" || rawGroup === "computer" ? rawGroup : fallbackGroup;
  const index = Number(rawIndex);
  return { group, index: Number.isInteger(index) ? index : -1 };
}
function itemForAssetRef(value, fallbackGroup = "computer") {
  const { group, index } = parseAssetRef(value, fallbackGroup);
  return { group, index, item: itemForGroupIndex(group, index) };
}
function isBlankAssetValue(value) {
  const text = normalize(value);
  return !text || text === "-" || text === "n/a" || text === "null" || text === "undefined";
}
function isRepairOrBrokenStatus(status) {
  const text = normalize(status);
  return text.includes("เสีย") || text.includes("ซ่อม");
}
function isDashboardBrokenAsset(item) {
  const type = normalizeAssetType(item.type);
  return (type === "notebook" || type === "tablet" || type === "macbook" || type === "desktop pc")
    && isRepairOrBrokenStatus(item.status);
}
function isAvailableComputer(item) {
  const status = normalize(item.status);
  const type = normalizeAssetType(item.type);
  return (type === "notebook" || type === "tablet")
    && isBlankAssetValue(item.user)
    && status.includes("ไม่ได้ใช้งาน")
    && !isRepairOrBrokenStatus(status);
}
function stats() {
  const computer = DATA.computerAssets.length;
  const other = DATA.otherAssets.length;
  const total = computer + other;
  const assets = allAssets();
  return {
    computer, other, total,
    inUse: DATA.computerAssets.filter(item => normalize(item.status) === "ใช้งาน").length,
    available: DATA.computerAssets.filter(isAvailableComputer).length,
    broken: assets.filter(isDashboardBrokenAsset).length,
  };
}

// --- User helpers ---
function defaultUsers() {
  return [
    { username: "admin", email: "admin@kochpackaging.co.th", password: "admin123", name: "Admin User", department: "IT", role: "admin", active: true },
    { username: "user", email: "user@kochpackaging.co.th", password: "user123", name: "User Name", department: "Accounting", role: "user", active: true },
  ];
}
function registeredUsers() {
  if (!Array.isArray(DATA.users) || DATA.users.length === 0) DATA.users = defaultUsers();
  const defaults = defaultUsers();
  DATA.users = DATA.users.map(user => {
    const fallback = defaults.find(item => item.username === user.username) || {};
    return { ...user, email: user.email || fallback.email || "", department: user.department || fallback.department || "", avatar: user.avatar || fallback.avatar || "" };
  });
  return DATA.users;
}

// --- Warranty ---
function warrantyNotificationKey(asset, warrantyDate) {
  return `warranty:${asset.assetCode || asset.serial || asset.model}:${warrantyDate}`;
}
function warrantyReadState(key) {
  return DATA.notifications.find(item => item.key === key)?.read === true;
}
function setWarrantyReadState(key, read = true) {
  let item = DATA.notifications.find(notification => notification.key === key);
  if (!item) {
    item = { key, title: key, category: "ประกัน", type: "warranty", read: false };
    DATA.notifications.unshift(item);
  }
  item.read = read;
}
function maintenanceNotificationKey(row) {
  return `maintenance:${row.title || row.asset || "request"}:${row.date || ""}`;
}
function maintenanceRequestNotifications() {
  if (!settingChecked("maintenanceAlerts", true) || !settingChecked("inAppAlerts", true)) return [];
  return sortByAlpha((DATA.maintenanceRequests || [])
    .filter(row => !normalize(row.status).includes("เสร็จ") && !normalize(row.status).includes("ปิด"))
    .map(row => {
      const key = maintenanceNotificationKey(row);
      return {
        key,
        title: `Maintenance Request - ${row.asset || row.title || "Asset"}`,
        body: `${row.title || row.desc || "แจ้งซ่อม"} · ${row.requester || "-"}`.replace(/\s+/g, " ").trim(),
        category: "ซ่อมบำรุง",
        date: row.date || "-",
        tone: normalize(row.priority).includes("สูง") || normalize(row.priority).includes("เร่ง") ? "danger" : "orange",
        read: warrantyReadState(key),
        remainingDays: null,
      };
    }), item => `${item.date}-${item.title}`);
}
function warrantyNotifications() {
  if (!settingChecked("warrantyAlerts", true) || !settingChecked("inAppAlerts", true)) return [];
  const alertDays = Number(state.settings.warrantyDays || 30) || 30;
  return sortByAlpha(allAssets()
    .map(asset => {
      const warrantyDate = parseAssetDate(asset.warrantyExpirationDate);
      if (!warrantyDate) return null;
      const remainingDays = daysUntil(warrantyDate);
      if (remainingDays < 0 || remainingDays > alertDays) return null;
      const dateText = formatLocalDate(warrantyDate);
      const key = warrantyNotificationKey(asset, dateText);
      return {
        key, title: `Warranty Expiring Soon - ${asset.assetCode || asset.model || asset.serial || "Asset"}`,
        body: `${asset.type || "Asset"} ${asset.brand || ""} ${asset.model || ""}`.replace(/\s+/g, " ").trim(),
        category: "ประกัน", date: dateText,
        tone: remainingDays <= 7 ? "danger" : "orange",
        read: warrantyReadState(key), remainingDays,
      };
    })
    .filter(Boolean), item => `${item.date}-${item.title}`);
}
function systemNotifications() {
  return sortByAlpha([
    ...warrantyNotifications(),
    ...maintenanceRequestNotifications(),
  ], item => `${item.date}-${item.category}-${item.title}`);
}

function applyAppPreferences() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const theme = String(state.settings.theme || "Light").toLowerCase();
  root.dataset.theme = theme;
  root.dataset.fontSize = state.settings.fontSize || "normal";
  
  // Sync state.theme and body class for theme consistency
  state.theme = theme;
  localStorage.setItem("asset-control-theme", theme);
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}

// --- Toast ---
function showToast(message) {
  const id = Date.now();
  state.toast = { id, message };
  render();
  window.setTimeout(() => {
    if (state.toast?.id === id) { state.toast = null; render(); }
  }, 2400);
}

// --- Data snapshot & persistence ---
function dataSnapshot() {
  return {
    sourceFile: DATA.sourceFile || state.settings.dataSource || "asset-control-database.json",
    sourceId: DATA.sourceId || "asset-control-live-database",
    generatedAt: DATA.generatedAt || new Date().toISOString(),
    computerAssets: DATA.computerAssets || [],
    otherAssets: DATA.otherAssets || [],
    master: DATA.master || { companies: [], departments: [], locations: [], types: [], typeGroups: [], positions: [] },
    maintenanceHistory: DATA.maintenanceHistory || [],
    maintenanceRequests: DATA.maintenanceRequests || [],
    checkoutRecords: DATA.checkoutRecords || [],
    notifications: DATA.notifications || [],
    loginHistory: DATA.loginHistory || [],
    auditLogs: DATA.auditLogs || [],
    users: registeredUsers(),
  };
}
function recordAuditLog(action, target, desc) {
  if (!Array.isArray(DATA.auditLogs)) {
    DATA.auditLogs = [];
  }
  const username = state.user?.username || state.user?.name || "system";
  const name = state.user?.name || username;
  const now = new Date();
  const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  DATA.auditLogs.unshift({
    username: username,
    name: name,
    action: action,
    target: target,
    desc: desc,
    time: time
  });
  if (DATA.auditLogs.length > 500) {
    DATA.auditLogs.pop();
  }
  persistLocal();
}
window.recordAuditLog = recordAuditLog;

function replaceData(nextData) {
  const next = nextData || {};
  DATA = {
    sourceFile: next.sourceFile || DATA.sourceFile || "asset-control-database.json",
    sourceId: next.sourceId || DATA.sourceId || "asset-control-live-database",
    generatedAt: next.generatedAt || DATA.generatedAt || new Date().toISOString(),
    computerAssets: Array.isArray(next.computerAssets) ? next.computerAssets : [],
    otherAssets: Array.isArray(next.otherAssets) ? next.otherAssets : [],
    master: {
      companies: Array.isArray(next.master?.companies) ? next.master.companies : [],
      departments: Array.isArray(next.master?.departments) ? next.master.departments : [],
      locations: Array.isArray(next.master?.locations) ? next.master.locations : [],
      types: (() => {
        const rawTypes = Array.isArray(next.master?.types) ? next.master.types : [];
        // Fallback groupCode map — used when Supabase table lacks group_code column
        const groupFallback = {
          AD:'IT', IP:'IT', KB:'IT', MB:'IT', MON:'IT',
          NB:'IT', PC:'IT', PRT:'IT', SR:'IT', SRV:'IT', TAB:'IT',
          AP:'NET', CAB:'NET', CCTV:'NET', FW:'NET',
          LB:'NET', NET:'NET', RT:'NET', SWT:'NET',
          SL:'SFT',
          TV:'OFE',
        };
        return rawTypes.map(t => t.groupCode ? t : { ...t, groupCode: groupFallback[t.code] || '' });
      })(),

      typeGroups: Array.isArray(next.master?.typeGroups) ? next.master.typeGroups : [],
      statuses: Array.isArray(next.master?.statuses) ? next.master.statuses : [],
      positions: Array.isArray(next.master?.positions) ? next.master.positions : [],
    },
    maintenanceHistory: Array.isArray(next.maintenanceHistory) ? next.maintenanceHistory : [],
    maintenanceRequests: Array.isArray(next.maintenanceRequests) ? next.maintenanceRequests : [],
    checkoutRecords: Array.isArray(next.checkoutRecords) ? next.checkoutRecords : [],
    notifications: Array.isArray(next.notifications) ? next.notifications : [],
    loginHistory: Array.isArray(next.loginHistory) ? next.loginHistory : [],
    auditLogs: Array.isArray(next.auditLogs) ? next.auditLogs : (DATA && Array.isArray(DATA.auditLogs) ? DATA.auditLogs : []),
    users: Array.isArray(next.users) && next.users.length ? next.users : defaultUsers(),
  };
  normalizeAssetCollections(DATA);
  state.settings.dataSource = DATA.sourceFile || state.settings.dataSource;
}
async function loadServerDatabase({ rerender = false, notify = false } = {}) {
  if (!DATABASE_API_ENABLED) return false;
  try {
    const response = await fetch("/api/database", { cache: "no-store" });
    if (!response.ok) throw new Error(`Database load failed: ${response.status}`);
    const payload = await response.json();
    databaseVersion = payload.version || null;
    replaceData(payload.data);
    if (rerender) render();
    if (notify) showToast("อัปเดตข้อมูลจากฐานข้อมูลแล้ว");
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}
async function pollServerDatabase() {
  if (!DATABASE_API_ENABLED || state.modal || state.actionMenu) return;
  try {
    const response = await fetch("/api/database", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    if (databaseVersion !== null && payload.version && payload.version !== databaseVersion) {
      databaseVersion = payload.version;
      replaceData(payload.data);
      render();
      showToast("อัปเดตข้อมูลจากฐานข้อมูลแล้ว");
    } else if (databaseVersion === null) {
      databaseVersion = payload.version || null;
    }
  } catch (error) {
    console.warn(error);
  }
}
function queueServerSave() {
  if (!DATABASE_API_ENABLED) return;
  window.clearTimeout(databaseSaveTimer);
  databaseSaveTimer = window.setTimeout(saveServerDatabase, 180);
}
async function saveServerDatabase() {
  if (!DATABASE_API_ENABLED) return;
  if (databaseSaveInFlight) { databaseSaveQueued = true; return; }
  databaseSaveInFlight = true;
  try {
    const response = await fetch("/api/database", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataSnapshot()),
    });
    if (!response.ok) throw new Error(`Database save failed: ${response.status}`);
    const payload = await response.json();
    databaseVersion = payload.version || databaseVersion;
  } catch (error) {
    console.warn(error);
    showToast("บันทึกฐานข้อมูลไม่สำเร็จ ใช้ข้อมูลในเครื่องไว้ก่อน");
  } finally {
    databaseSaveInFlight = false;
    if (databaseSaveQueued) { databaseSaveQueued = false; saveServerDatabase(); }
  }
}
function persistLocal() {
  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify({
    sourceId: SOURCE_ID,
    data: {
      computerAssets: DATA.computerAssets,
      otherAssets: DATA.otherAssets,
      master: DATA.master,
      maintenanceHistory: DATA.maintenanceHistory,
      maintenanceRequests: DATA.maintenanceRequests,
      checkoutRecords: DATA.checkoutRecords,
      notifications: DATA.notifications,
      loginHistory: DATA.loginHistory,
      auditLogs: DATA.auditLogs,
      users: registeredUsers(),
    },
    settings: state.settings,
  }));
  queueServerSave();
}

// --- Pagination ---
function getPageSize(key) {
  if (state.pageSizes && state.pageSizes[key]) return state.pageSizes[key];
  if (key && key.startsWith("notifications")) return NOTIFICATION_PAGE_SIZE;
  const configured = Number(state.settings.defaultPageSize || 0);
  if (configured > 0) return configured;
  return window.innerWidth > 900 ? 10 : 5;
}
function setPage(key, page) {
  state.pages[key] = page;
  render();
}
function pageFor(key, total, perPage = getPageSize(key)) {
  const maxPage = Math.max(1, Math.ceil(total / perPage));
  return Math.min(Math.max(1, state.pages[key] || 1), maxPage);
}
function pageKeyForFilter(filterKey) {
  const prefix = String(filterKey || "").replace(/-(q|type|company|status)$/, "");
  if (prefix === "computer" || prefix === "other") return `${prefix}-assets`;
  return prefix || state.route;
}
function resetFilters(prefix, pageKey = state.route) {
  Object.keys(state.filters).forEach(key => {
    if (key.startsWith(`${prefix}-`)) delete state.filters[key];
  });
  state.pages[pageKey] = 1;
  render();
}
function clearFiltersForRoute(route) {
  state.filters = {};
  state.auditFilterSearch = "";
  state.auditFilterAction = "all";
  state.loginFilterStatus = "all";
  if (route) {
    state.pages[route] = 1;
    state.pages[`${route}-assets`] = 1;
  }
}
function paged(items, key, perPage = getPageSize(key)) {
  const page = pageFor(key, items.length, perPage);
  const start = (page - 1) * perPage;
  return { page, items: items.slice(start, start + perPage), perPage };
}

// --- Record helpers ---
function recordSource(collection) {
  return {
    maintenanceHistory: DATA.maintenanceHistory,
    maintenanceRequests: DATA.maintenanceRequests,
    checkoutRecords: DATA.checkoutRecords,
  }[collection] || [];
}
