// ============================================================
// shell.js — App shell, navigation, login, and event binding
// ============================================================

// Icons for each typeGroup code
const GROUP_ICONS = { IT: "monitor", NET: "network", SFT: "tag", OFE: "building", VEH: "box", MCH: "wrench", FAC: "database" };
const GROUP_FALLBACK_LABEL = { IT: "IT Equipment", NET: "Network", SFT: "Software", OFE: "Office", VEH: "Vehicles", MCH: "Machinery", FAC: "Facility" };
const GROUP_FALLBACK_LABEL_TH = { IT: "คอมพิวเตอร์ & ไอที", NET: "เครือข่าย", SFT: "ซอฟต์แวร์", OFE: "สำนักงาน", VEH: "ยานพาหนะ", MCH: "เครื่องจักร", FAC: "ระบบอาคาร" };

function getNavAssetCount(groupCode) {
  if (!DATA) return 0;
  if (groupCode === "computer") {
    return Array.isArray(DATA.computerAssets) ? DATA.computerAssets.length : 0;
  }
  if (groupCode === "other") {
    return Array.isArray(DATA.otherAssets) ? DATA.otherAssets.length : 0;
  }
  const types = DATA.master?.types || [];
  const typeCodes = types
    .filter(t => t.groupCode === groupCode)
    .reduce((acc, t) => {
      if (t.name) acc.add(t.name.toLowerCase());
      if (t.code) acc.add(t.code.toLowerCase());
      return acc;
    }, new Set());

  const all = typeof allAssets === "function" ? allAssets() : [...(DATA.computerAssets || []), ...(DATA.otherAssets || [])];
  let items = all.filter(a => a.type && typeCodes.has(String(a.type).toLowerCase()));
  if (groupCode === "IT" && typeof isComputerAssetType === "function") {
    items = items.filter(a => !isComputerAssetType(a.type));
  }
  return items.length;
}

function buildAssetNavChildren() {
  const groups = DATA && DATA.master && DATA.master.typeGroups ? DATA.master.typeGroups : [];
  const isAdmin = state.user && state.user.role === "admin";
  let children = [];
  if (!groups.length) {
    children = [
      { id: "computer", label: () => t("คอมพิวเตอร์", "Computer"), icon: "laptop", groupCode: "computer" },
      { id: "other", label: () => t("อุปกรณ์อื่น ๆ", "Other Equipment"), icon: "box", groupCode: "other" },
    ];
  } else {
    children = [
      { id: "computer", label: () => t("คอมพิวเตอร์", "Computer"), icon: "laptop", groupCode: "computer" },
      ...groups.map(g => ({
        id: "assets-" + g.code,
        label: () => {
          const shortTh = g.code === "IT" ? "อุปกรณ์ไอที" : GROUP_FALLBACK_LABEL_TH[g.code] || g.name.split(" (")[0];
          const shortEn = GROUP_FALLBACK_LABEL[g.code] || g.code;
          return t(shortTh, shortEn);
        },
        icon: GROUP_ICONS[g.code] || "box",
        groupCode: g.code,
      }))
    ];
  }

  // Non-admin users see only sub-menus that contain asset items (count > 0)
  if (!isAdmin) {
    children = children.filter(item => getNavAssetCount(item.groupCode || item.id) > 0);
  }

  return children;
}

const navItems = [
  { id: "dashboard", label: () => t("Dashboard", "Dashboard"), icon: "dashboard" },
  {
    id: "assets",
    label: () => t("ทรัพย์สิน", "Assets"),
    icon: "box",
    get children() { return buildAssetNavChildren(); }
  },
  {
    id: "maintenance", label: () => t("การบำรุงรักษา", "Maintenance"), icon: "wrench", children: [
      { id: "maintenance-detail", label: () => t("ประวัติการซ่อม", "Details"), icon: "clock" },
      { id: "maintenance-request", label: () => t("แจ้งซ่อมบำรุง", "Request"), icon: "edit" },
    ]
  },
  { id: "checkout", label: () => t("ยืม-คืนอุปกรณ์", "Check Out"), icon: "checkout" },
  { id: "master", label: () => t("ข้อมูลหลัก (Master)", "Master Data"), icon: "database", adminOnly: true },
  { id: "notifications", label: () => t("การแจ้งเตือน", "Notifications"), icon: "bell" },
  { id: "settings", label: () => t("ตั้งค่าระบบ", "Settings"), icon: "settings" },
];

// ---- Helper: called by typeGroup dropdown onchange in asset form ----
function filterAssetTypesByGroup(groupCode) {
  var typeSel = document.getElementById("asset-type-select");
  var groupSel = document.getElementById("asset-typegroup-select");
  if (!typeSel || !groupSel) return;
  var all = JSON.parse(groupSel.dataset.types || "[]");
  var filtered = groupCode ? all.filter(function(t) { return t.g === groupCode; }) : all;
  if (groupCode === "IT") filtered = filtered.filter(function(t) { return !isComputerAssetType(t.n); });
  var html = "<option value=\"\">-- ไม่ระบุ --</option>";
  filtered.forEach(function(t) {
    html += "<option value=\"" + t.n + "\">" + t.n + "</option>";
  });
  typeSel.innerHTML = html;
}

function filterInputByKey(key) {
  return [...document.querySelectorAll("[data-filter]")].find(input => input.dataset.filter === key);
}
function bindTableEvents(container) {
  container.querySelectorAll("[data-page-key]").forEach(button => button.addEventListener("click", () => {
    setPage(button.dataset.pageKey, Number(button.dataset.page));
  }));
  container.querySelectorAll(".page-size-select").forEach(select => select.addEventListener("change", () => {
    const key = select.dataset.pageSizeKey;
    const size = Number(select.value);
    state.pageSizes[key] = size;
    state.pages[key] = 1;
    render();
  }));
  container.querySelectorAll("[data-action-menu]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    const key = button.dataset.actionMenu;
    if (state.actionMenu?.key === key) {
      state.actionMenu = null;
      render();
      return;
    }
    state.actionMenu = actionMenuPosition(button, key);
    render();
  }));
  container.querySelectorAll("[data-view-asset]").forEach(button => button.addEventListener("click", () => {
    state.modal = { type: "asset", group: button.dataset.group, code: button.dataset.viewAsset };
    render();
  }));
  container.querySelectorAll("[data-view-record]").forEach(button => button.addEventListener("click", () => {
    state.modal = { type: "record", collection: button.dataset.viewRecord, index: Number(button.dataset.index) };
    render();
  }));
  container.querySelectorAll("[data-confirm-checkout-record]").forEach(button => button.addEventListener("click", () => {
    openCheckoutRecordConfirm(button);
  }));
  container.querySelectorAll("[data-approve-maintenance-request]").forEach(button => button.addEventListener("click", () => {
    approveMaintenanceRequest(button);
  }));
  container.querySelectorAll("[data-reject-maintenance-request]").forEach(button => button.addEventListener("click", () => {
    rejectMaintenanceRequest(button);
  }));
  container.querySelectorAll("[data-open-checkout-return]").forEach(button => button.addEventListener("click", () => {
    const rawIndex = button.dataset.openCheckoutReturn;
    state.modal = rawIndex === "" || rawIndex === undefined
      ? { type: "checkout-return" }
      : { type: "checkout-return", index: Number(rawIndex) };
    render();
  }));
  container.querySelectorAll("[data-confirm-checkout-return]").forEach(button => button.addEventListener("click", () => {
    confirmCheckoutReturn(button);
  }));
}
function updateActivePageTable() {
  const container = document.querySelector(".page-panel");
  if (!container) return false;
  const tableWrap = container.querySelector(".table-wrap");
  const pagination = container.querySelector(".pagination");
  if (!tableWrap || !pagination) return false;
  let tableHtml = "";
  let paginationHtml = "";
  if (state.route === "computer" || state.route === "other" || (state.route && state.route.startsWith("assets-"))) {
    const isGroup = state.route.startsWith("assets-");
    const groupCode = isGroup ? state.route.replace("assets-", "") : null;
    let items;
    if (isGroup) {
      const typeCodes = (DATA.master.types || [])
        .filter(t => t.groupCode === groupCode)
        .reduce((acc, t) => {
          if (t.name) acc.add(t.name.toLowerCase());
          if (t.code) acc.add(t.code.toLowerCase());
          return acc;
        }, new Set());
      let itemsList = allAssets().filter(a => a.type && typeCodes.has(a.type.toLowerCase()));
      if (groupCode === "IT") itemsList = itemsList.filter(a => !isComputerAssetType(a.type));
      items = itemsList;
    } else {
      items = state.route === "computer" ? DATA.computerAssets : DATA.otherAssets;
    }
    const prefix = state.route;
    const query = state.filters[`${prefix}-q`] || "";
    const type = state.filters[`${prefix}-type`] || "";
    const company = state.filters[`${prefix}-company`] || "";
    const status = state.filters[`${prefix}-status`] || "";
    const filtered = sortByAlpha(items.filter(item => {
      const text = Object.values(item).join(" ").toLowerCase();
      return (!query || text.includes(query.toLowerCase()))
        && (!type || item.type === type)
        && (!company || item.company === company)
        && (!status || item.status === status);
    }), "assetCode");
    const pageKey = `${prefix}-assets`;
    tableHtml = renderAssetTable(filtered, isGroup ? "other" : state.route, pageKey);
    paginationHtml = renderPagination(filtered.length, pageKey);
  } else if (state.route === "maintenance-detail") {
    syncMaintenanceHistoryFromRequests();
    const filtered = sortByAlpha(filterCollection(DATA.maintenanceHistory, "maintenance-detail"), row => row.title || row.asset || row.type);
    const pageKey = "maintenance-detail";
    const page = paged(filtered, pageKey);
    tableHtml = tableFromRows(["รายการ ↑", "ทรัพย์สิน", "ประเภท", "วันที่", "ค่าใช้จ่าย", "สถานะ", ""], page.items.map(row => [
      `<strong>${esc(row.title)}</strong>`,
      esc(row.asset),
      `${icon(row.type.includes("ฉุก") ? "alert" : "wrench")} ${esc(row.type)}`,
      esc(row.date), esc(row.cost),
      `<span class="status-pill ${statusClass(row.status)}">${esc(row.status)}</span>`,
      maintenanceHistoryActions(row),
    ]));
    paginationHtml = renderPagination(filtered.length, pageKey);
  } else if (state.route === "maintenance-request") {
    syncMaintenanceHistoryFromRequests();
    const filtered = sortByAlpha(filterCollection(DATA.maintenanceRequests, "maintenance-request"), row => row.title || row.asset || row.requester);
    const pageKey = "maintenance-request";
    const page = paged(filtered, pageKey);
    tableHtml = tableFromRows(["หัวข้อ ↑", "แบรนด์", "ประเภท", "ผู้แจ้ง", "วันที่แจ้ง", "ความเร่งด่วน", "สถานะ", ""], page.items.map(row => [
      `<strong>${esc(row.title)}</strong><span class="row-sub">${esc(row.desc)}</span>`,
      esc(row.brand), esc(row.type), esc(row.requester), esc(row.date),
      `<span class="priority-pill ${row.priority === "สูง" || row.priority === "เร่งด่วน" ? "status-active" : "status-muted"}">${esc(row.priority)}</span>`,
      `<span class="status-pill ${statusClass(row.status)}">${icon(row.status.includes("รอ") ? "clock" : row.status.includes("กำลัง") ? "alert" : "check")} ${esc(row.status)}</span>`,
      maintenanceRequestActions(row),
    ]));
    paginationHtml = renderPagination(filtered.length, pageKey);
  } else if (state.route === "checkout") {
    const filtered = sortByAlpha(filterCollection(DATA.checkoutRecords, "checkout", { type: "asset" }), row => row.asset || row.sub || row.requester);
    const pageKey = "checkout";
    const page = paged(filtered, pageKey);
    tableHtml = tableFromRows(["ทรัพย์สิน ↑", "ผู้ขอใช้งาน", "วันที่ขอใช้", "วัตถุประสงค์", "สถานะ", ""], page.items.map(row => [
      `<strong>${esc(row.asset)}</strong><span class="row-sub">${esc(row.sub)}</span>`,
      esc(row.requester), esc(row.date), esc(row.purpose),
      `<span class="status-pill ${statusClass(row.status)}">${esc(row.status)}</span>`,
      checkoutRowActions(row),
    ]));
    paginationHtml = renderPagination(filtered.length, pageKey);
  }
  if (tableHtml && paginationHtml) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = tableHtml;
    const newTableWrap = tempDiv.firstElementChild;
    tableWrap.replaceWith(newTableWrap);
    tempDiv.innerHTML = paginationHtml;
    const newPagination = tempDiv.firstElementChild;
    pagination.replaceWith(newPagination);
    translateUi(newTableWrap);
    translateUi(newPagination);
    bindTableEvents(container);
    return true;
  }
  return false;
}
function renderPreservingFilterFocus(input) {
  const key = input?.dataset.filter || "";
  const cursorStart = input?.selectionStart ?? String(input?.value || "").length;
  const cursorEnd = input?.selectionEnd ?? cursorStart;
  render();
  requestAnimationFrame(() => {
    const nextInput = filterInputByKey(key);
    if (!nextInput) return;
    nextInput.focus({ preventScroll: true });
    if (typeof nextInput.setSelectionRange === "function") {
      const max = String(nextInput.value || "").length;
      nextInput.setSelectionRange(Math.min(cursorStart, max), Math.min(cursorEnd, max));
    }
  });
}
function settingsSaveButtonHtml() {
  return `<button class="primary-btn" data-save-settings>${icon("save")} ${t("บันทึก", "Save")}</button>`;
}
function currentSettingsDirty() {
  if (state.route !== "settings" || state.settingsTab !== "notifications") return false;
  return [...document.querySelectorAll(".settings-panel [data-setting]")].some(input => {
    const key = input.dataset.setting;
    if (!key) return false;
    if (input.type === "checkbox") return input.checked !== settingChecked(key, true);
    return String(input.value ?? "") !== String(state.settings[key] ?? "");
  });
}
function bindSettingsSaveButton(button = document.querySelector("[data-save-settings]")) {
  if (!button || button.dataset.boundSettingsSave) return;
  button.addEventListener("click", saveSettings);
  button.dataset.boundSettingsSave = "true";
}
function updateSettingsSaveButton() {
  const existing = document.querySelector("[data-save-settings]");
  if (!state.settingsDirty) {
    existing?.remove();
    return;
  }
  if (existing) {
    bindSettingsSaveButton(existing);
    return;
  }
  document.querySelector(".page-title-row")?.insertAdjacentHTML("beforeend", settingsSaveButtonHtml());
  bindSettingsSaveButton();
}
function markSettingsDirty() {
  state.settingsDirty = currentSettingsDirty();
  updateSettingsSaveButton();
}
function settingInputValue(input) {
  if (input.type === "checkbox" && input.dataset.valueOn !== undefined) {
    return input.checked ? input.dataset.valueOn : input.dataset.valueOff;
  }
  return input.type === "checkbox" ? input.checked : input.value;
}
function applySettingValue(key, value) {
  if (key === "lang") {
    state.lang = value;
    localStorage.setItem("asset-control-lang", state.lang);
    return;
  }
  if (key === "theme") {
    state.settings.theme = value;
    state.theme = String(value || "Light").toLowerCase();
    localStorage.setItem("asset-control-theme", state.theme);
    return;
  }
  state.settings[key] = value;
}
function applyGeneralOverviewSetting(input) {
  if (!input.closest(".settings-overview")) return false;
  const key = input.dataset.setting;
  if (!key) return false;
  applySettingValue(key, settingInputValue(input));
  persistLocal();
  render();
  return true;
}
function renderLogin() {
  const s = stats();
  return `<main class="login-page">
    <section class="login-card">
      <div class="login-art">
        <div>
          <div class="login-logo"><span class="logo-mark">${icon("box")}</span><span>Asset Control</span></div>
          <h1>ระบบควบคุมทรัพย์สิน IT</h1>
          <p>จัดการอุปกรณ์ การซ่อมบำรุง การยืมคืน และข้อมูลหลักในระบบเดียว พร้อมสิทธิ์การเข้าถึงแบบ Admin และ User</p>
          <div class="login-stats">
            <div class="login-stat"><strong>${s.total}</strong><span>Assets</span></div>
            <div class="login-stat"><strong>${s.computer}</strong><span>Computer</span></div>
            <div class="login-stat"><strong>${s.other}</strong><span>Other</span></div>
          </div>
        </div>
      </div>
      <div class="login-form-wrap">
        <div class="login-language">
          <button class="lang-btn" data-set-lang="th" style="opacity:${state.lang === 'th' ? '1' : '0.55'}">TH</button>
          <span>|</span>
          <button class="lang-btn" data-set-lang="en" style="opacity:${state.lang === 'en' ? '1' : '0.55'}">EN</button>
        </div>
        <h2>เข้าสู่ระบบ</h2>
        <p>เลือกสิทธิ์เพื่อดูเมนูและข้อมูลตามบทบาท</p>
        <form class="login-form" data-login-form>
        <div class="field"><label>Username / Company Email</label><input class="input" data-login-username placeholder="${t("กรุณากรอก Username หรืออีเมลบริษัท", "Enter Username or Company Email")}" autocomplete="username" aria-label="Username or Company Email"></div>
        <div class="field"><label>Password</label><input class="input" data-login-password type="password" value="" autocomplete="current-password" aria-label="Password"></div>
        ${state.loginError ? `<div class="login-error">${esc(state.loginError)}</div>` : ""}
        <div class="login-actions">
          <button class="primary-btn" type="submit">${icon("shield")} เข้าสู่ระบบ</button>
          <button class="microsoft-login-btn" type="button" data-microsoft-login>${icon("user")} ${t("เข้าสู่ระบบด้วย Microsoft", "Sign in with Microsoft")}</button>
        </div>
        </form>
        <div class="demo-note"><strong>Email Login</strong> ถ้าแผนกเป็น IT จะเข้าเป็น Admin, แผนกอื่นจะเข้าเป็น User<br><strong>Admin</strong> เห็นทุกเมนู รวม Master Data และประวัติ Login</div>
      </div>
    </section>
  </main>`;
}
function bindLogin() {
  document.querySelector("[data-login-form]")?.addEventListener("submit", event => {
    event.preventDefault();
    login();
  });
  document.querySelector("[data-microsoft-login]")?.addEventListener("click", loginWithMicrosoft);
  document.querySelectorAll("[data-set-lang]").forEach(button => button.addEventListener("click", () => {
    state.lang = button.dataset.setLang;
    localStorage.setItem("asset-control-lang", state.lang);
    render();
  }));
}
function activeGroup(item) {
  return item.id === state.route || (item.children || []).some(child => child.id === state.route);
}
function isGroupExpanded(itemId) {
  if (!state.expandedGroups) state.expandedGroups = {};
  if (state.expandedGroups[itemId] !== undefined) {
    return state.expandedGroups[itemId];
  }
  const item = navItems.find(nav => nav.id === itemId);
  return activeGroup(item);
}
function renderNav() {
  return navItems
    .filter(item => !item.adminOnly || state.user.role === "admin")
    .map(item => {
      const open = isGroupExpanded(item.id);
      const itemLabel = typeof item.label === "function" ? item.label() : item.label;
      if (item.children) {
        return `<div class="nav-section ${open ? "open" : ""}">
          <button class="nav-btn ${activeGroup(item) ? "active" : ""}" data-nav-group="${item.id}">
            ${icon(item.icon)}<span class="label">${itemLabel}</span><span class="chev">${icon("chevronDown")}</span>
          </button>
          <div class="submenu">
            ${item.children.map(child => {
          const childLabel = typeof child.label === "function" ? child.label() : child.label;
          return `<button class="submenu-btn ${state.route === child.id ? "active" : ""}" data-route="${child.id}">${icon(child.icon)}<span class="label">${childLabel}</span></button>`;
        }).join("")}
          </div>
        </div>`;
      }
      return `<div class="nav-section"><button class="nav-btn ${state.route === item.id ? "active" : ""}" data-route="${item.id}">${icon(item.icon)}<span class="label">${itemLabel}</span></button></div>`;
    })
    .join("");
}
function navRenderKey() {
  const groupCount = (DATA && DATA.master && DATA.master.typeGroups) ? DATA.master.typeGroups.length : 0;
  return `${state.lang}:${state.user?.role || ""}:${groupCount}`;
}
function updateNavState(nav = document.querySelector(".nav")) {
  if (!nav) return;
  navItems.forEach(item => {
    const groupButton = nav.querySelector(`[data-nav-group="${item.id}"]`);
    if (groupButton) {
      groupButton.classList.toggle("active", activeGroup(item));
      groupButton.closest(".nav-section")?.classList.toggle("open", isGroupExpanded(item.id));
    }
    nav.querySelectorAll(`[data-route="${item.id}"]`).forEach(button => {
      button.classList.toggle("active", state.route === item.id);
    });
    (item.children || []).forEach(child => {
      nav.querySelectorAll(`[data-route="${child.id}"]`).forEach(button => {
        button.classList.toggle("active", state.route === child.id);
      });
    });
  });
}
function refreshNav(nav = document.querySelector(".nav")) {
  if (!nav) return;
  const key = navRenderKey();
  if (nav.dataset.renderKey !== key) {
    nav.innerHTML = renderNav();
    nav.dataset.renderKey = key;
  } else {
    updateNavState(nav);
  }
}
function renderShell() {
  const unreadWarrantyNotifications = systemNotifications().filter(item => !item.read).length;
  return `<div class="app-shell" data-lang="${state.lang}"><div class="workspace ${state.sidebarCollapsed ? "sidebar-collapsed" : ""}">
    ${state.drawerOpen ? '<div class="drawer-backdrop" data-close-drawer></div>' : ""}
    <aside class="sidebar ${state.drawerOpen ? "open" : ""}">
      <div class="sidebar-head">
        <div class="brand-logo"><span class="logo-mark">${icon("box")}</span><span>Asset Control</span></div>
        <button class="bell-wrap" data-route="notifications" aria-label="notifications">${icon("bell")}${unreadWarrantyNotifications > 0 ? `<span class="badge-count">${unreadWarrantyNotifications}</span>` : ""}</button>
      </div>
      <nav class="nav" data-render-key="${navRenderKey()}">${renderNav()}</nav>
      <div class="sidebar-bottom">
        <div class="lang-strip" style="display:flex; ${state.sidebarCollapsed ? "justify-content:center" : "justify-content:space-between"}; align-items:center; padding:${state.sidebarCollapsed ? "10px 10px" : "10px 22px"}; border-top:1px solid rgba(255,255,255,.14)">
          ${state.sidebarCollapsed ? "" : `<span style="font-size:12px; font-weight:800; opacity:0.8; color:#fff">${t("ภาษา / Language", "Language")}</span>`}
          <div style="display:flex; gap:6px; align-items:center">
            <button class="lang-btn" data-set-lang="th" style="background:transparent; border:0; color:#fff; font-weight:bold; font-size:12px; cursor:pointer; opacity:${state.lang === 'th' ? '1' : '0.5'}">TH</button>
            <span style="opacity:0.5; color:#fff; font-size:12px">|</span>
            <button class="lang-btn" data-set-lang="en" style="background:transparent; border:0; color:#fff; font-weight:bold; font-size:12px; cursor:pointer; opacity:${state.lang === 'en' ? '1' : '0.5'}">EN</button>
          </div>
        </div>
        <button class="sidebar-footer-btn" data-toggle-sidebar>${icon("checkout")}<span>${state.sidebarCollapsed ? t("ขยายเมนู", "Expand Menu") : t("ย่อเมนู", "Collapse Menu")}</span></button>
        <div class="user-strip">
          <span class="avatar" style="overflow:hidden; display:grid; place-items:center">${(registeredUsers().find(u => String(u.username).toLowerCase() === String(state.user?.username).toLowerCase())?.avatar || state.user?.avatar) ? `<img src="${esc(registeredUsers().find(u => String(u.username).toLowerCase() === String(state.user?.username).toLowerCase())?.avatar || state.user?.avatar)}" style="width:100%; height:100%; object-fit:cover; border-radius:50%">` : icon("user")}</span>
          <div style="flex:1"><strong>${esc(state.user.name)}</strong><div class="role-pill">${esc(state.user.role)}</div></div>
          <button class="more-btn" data-logout title="Logout">${icon("logout")}</button>
        </div>
      </div>
    </aside>
    <main class="main">
      <div class="mobile-topbar">
        <button class="hamburger" data-open-drawer>${icon("menu")}</button>
        <div class="brand-logo" style="color:var(--brand)"><span class="logo-mark" style="background:var(--brand)">${icon("box")}</span><span>Asset Control</span></div>
        <button class="hamburger" data-route="notifications">${icon("bell")}</button>
      </div>
      <div class="content ${state.route === "dashboard" ? "dashboard-content" : ""} route-${state.route}">${renderRoute()}</div>
    </main>
  </div></div><div id="action-menu-container">${renderActionMenuOverlay()}</div><div id="modal-container">${state.modal ? renderModal(state.modal) : ""}</div><div id="lightbox-container">${state.previewImageUrl ? renderLightbox(state.previewImageUrl) : ""}</div><div id="toast-container">${state.toast ? `<div class="toast">${icon("check")}<span>${esc(state.toast.message)}</span></div>` : ""}</div>`;
}
function renderRoute() {
  const routes = {
    dashboard: renderDashboard,
    computer: () => renderAssetPage("computer"),
    other: () => renderAssetPage("other"),
    "maintenance-detail": renderMaintenanceDetail,
    "maintenance-request": renderMaintenanceRequest,
    checkout: renderCheckout,
    master: renderMaster,
    notifications: renderWarrantyNotifications,
    settings: renderSettings,
  };
  // Dynamic group routes: assets-IT, assets-NET, etc.
  if (state.route && state.route.startsWith("assets-")) {
    const groupCode = state.route.replace("assets-", "");
    return renderAssetPageByGroup(groupCode);
  }
  return (routes[state.route] || renderDashboard)();
}
function renderLightbox(url) {
  return `<div class="modal-backdrop center-modal" style="background: rgba(0, 0, 0, 0.85); z-index: 11000;" data-close-lightbox>
    <section style="position: relative; max-width: 95vw; max-height: 95vh; display: flex; align-items: center; justify-content: center; padding: 10px;" onclick="if (!event.target.closest('[data-close-lightbox]')) event.stopPropagation();">
      <button class="modal-close" data-close-lightbox style="position: absolute; top: 0px; right: 0px; background: rgba(0,0,0,0.6); color: #fff; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: none; font-size: 20px; cursor: pointer; transition: background 0.2s; z-index: 10;">${icon("x")}</button>
      <img src="${esc(getImageUrl(url))}" style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 8px; border: 2px solid rgba(255,255,255,0.15); background: #111; box-shadow: 0 10px 40px rgba(0,0,0,0.85); cursor: zoom-out;" data-close-lightbox>
    </section>
  </div>`;
}

function renderModal(modal) {
  if (modal.type === "user-form") {
    const isEdit = Number.isInteger(modal.index);
    const user = isEdit ? DATA.users[modal.index] : { username: "", name: "", email: "", department: "", role: "user", password: "", avatar: "" };
    return formModal(
      isEdit ? t("แก้ไขบัญชีผู้ใช้", "Edit User Account") : t("เพิ่มผู้ใช้ใหม่", "Add New User"),
      "user",
      `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-bottom:16px; text-align:center">
         <div style="position:relative; width:80px; height:80px; margin-bottom:10px">
           <div id="user-avatar-preview" style="width:80px; height:80px; border-radius:50%; background:#f0f0f4; border:2px solid var(--brand); display:grid; place-items:center; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1)">
             ${user.avatar ? `<img src="${esc(user.avatar)}" style="width:100%; height:100%; object-fit:cover">` : `<span style="font-size:32px; color:var(--brand)">${icon("user")}</span>`}
           </div>
           <label for="user-avatar-file-input" style="position:absolute; bottom:0; right:0; width:26px; height:26px; border-radius:50%; background:var(--brand); color:#fff; display:grid; place-items:center; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.2)" title="${t("เลือกรูปโปรไฟล์", "Choose Profile Photo")}">
             ${icon("camera")}
           </label>
         </div>
         <input type="file" id="user-avatar-file-input" accept="image/*" style="display:none" data-user-avatar-file>
         <input type="hidden" data-user-field="avatar" id="user-avatar-hidden-input" value="${esc(user.avatar || "")}">
         <div style="display:flex; gap:8px">
           <label for="user-avatar-file-input" class="ghost-btn" style="padding:4px 10px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:4px">
             ${icon("upload")} ${t("อัปโหลดรูปโปรไฟล์", "Upload Photo")}
           </label>
           ${user.avatar ? `<button type="button" class="ghost-btn" id="remove-user-avatar-btn" style="padding:4px 10px; font-size:12px; color:#ff3045; display:inline-flex; align-items:center; gap:4px">${icon("trash")} ${t("ลบรูป", "Remove")}</button>` : ""}
         </div>
       </div>
       <div class="field"><label>${t("Username", "Username")}</label><input class="input" data-user-field="username" value="${esc(user.username)}" ${isEdit ? "readonly style='opacity:0.6'" : ""}></div>
       <div class="field"><label>${t("ชื่อ-นามสกุล", "Full Name")}</label><input class="input" data-user-field="name" value="${esc(user.name || "")}"></div>
       <div class="field"><label>${t("อีเมลบริษัท", "Company Email")}</label><input class="input" data-user-field="email" value="${esc(user.email || "")}"></div>
       <div class="field"><label>${t("แผนก", "Department")}</label><input class="input" data-user-field="department" value="${esc(user.department || "")}"></div>
       <div class="field"><label>${t("บทบาท", "Role")}</label>
         ${state.user.role === "admin" ? `
           <select class="select" data-user-field="role">
             <option value="user" ${user.role === "user" ? "selected" : ""}>USER</option>
             <option value="admin" ${user.role === "admin" ? "selected" : ""}>ADMIN</option>
           </select>
         ` : `
           <input class="input" data-user-field="role" value="${esc((user.role || "user").toUpperCase())}" readonly style="opacity:0.6">
         `}
       </div>
       ${isEdit ? "" : `<div class="field"><label>${t("รหัสผ่าน", "Password")}</label><input class="input" data-user-field="password" type="password" value=""></div><div class="field"><label>${t("ยืนยันรหัสผ่าน", "Confirm Password")}</label><input class="input" data-user-field="passwordConfirm" type="password" value=""></div>`}
       <button class="primary-btn" data-submit-user="${isEdit ? modal.index : "new"}">${icon("check")} ${t("บันทึกข้อมูล", "Save User")}</button>`
    );
  }
  if (modal.type === "reset-user-pw") {
    const user = DATA.users[modal.index];
    if (!user) return "";
    const isOwnPassword = state.user && String(state.user.username).toLowerCase() === String(user.username).toLowerCase();
    return formModal(
      isOwnPassword ? t("เปลี่ยนรหัสผ่าน", "Change Password") : t("รีเซ็ตรหัสผ่าน", "Reset Password"), "settings",
      `<h3>${isOwnPassword ? t("บัญชีของคุณ", "Your Account") : t("ผู้ใช้งาน", "User")}: ${esc(user.username)}</h3>
       <div class="field"><label>${t("รหัสผ่านใหม่", "New Password")}</label><input class="input" data-user-field="password" type="password" value=""></div>
       <div class="field"><label>${t("ยืนยันรหัสผ่านใหม่", "Confirm New Password")}</label><input class="input" data-user-field="passwordConfirm" type="password" value=""></div>
       <button class="primary-btn" data-submit-user-pw="${modal.index}">${icon("check")} ${t("อัปเดตรหัสผ่าน", "Update Password")}</button>`
    );
  }
  if (modal.type === "logout-confirm") return renderLogoutConfirmModal();
  if (modal.type === "delete-all-confirm") return renderDeleteAllConfirmModal();
  if (modal.type === "delete-confirm") return renderDeleteConfirmModal(modal);
  if (modal.type === "asset-form") return renderAssetFormModal(modal);
  if (modal.type === "asset-save-confirm") return renderAssetSaveConfirmModal(modal.snapshot);
  if (modal.type === "asset") return renderAssetDetailModal(modal);
  if (modal.type === "record") return renderRecordModal(modal.collection, modal.index);
  if (modal.type === "record-form") return renderRecordFormModal(modal.collection, modal.index);
  if (modal.type === "request") return renderMaintenanceRequestForm(modal);
  if (modal.type === "save-confirm") return renderCheckoutSaveConfirmModal(modal.snapshot);
  if (modal.type === "checkout-record-confirm") return renderCheckoutSaveConfirmModal(modal.snapshot, "data-confirm-checkout-record-save");
  if (modal.type === "checkout-return") return renderCheckoutReturnModal(modal);
  if (modal.type === "checkout") return renderCheckoutFormModal(modal);
  if (modal.type === "master-form") {
    const rows = DATA.master[modal.tab] || [];
    const row = Number.isInteger(modal.index) ? rows[modal.index] : { code: "", name: "" };
    return formModal(Number.isInteger(modal.index) ? "แก้ไข Master Data" : "เพิ่ม Master Data", "database", `<div class="field"><label>Code</label><input class="input" data-master-field="code" value="${esc(row.code)}"></div><div class="field"><label>Name</label><input class="input" data-master-field="name" value="${esc(row.name)}"></div><button class="primary-btn" data-submit-master="${modal.tab}" data-index="${Number.isInteger(modal.index) ? modal.index : ""}">${icon("check")} บันทึก</button>`);
  }
  return "";
}

async function clearLoginHistoryLogs(event) {
  event?.preventDefault?.();
  event?.stopImmediatePropagation?.();
  const msg = t(
    "คุณต้องการล้างประวัติการเข้าสู่ระบบทั้งหมดใช่หรือไม่?",
    "Are you sure you want to clear all login history?"
  );
  if (!window.confirm(msg)) return;
  if (DATABASE_API_ENABLED) {
    try {
      const response = await fetch("/api/login-history/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Clear login history failed: ${response.status}`);
      const payload = await response.json();
      databaseVersion = payload.version || databaseVersion;
      replaceData(payload.data);
      state.pages["login-history"] = 1;
      render();
      showToast(t("ล้างประวัติการเข้าสู่ระบบแล้ว", "Login history cleared"));
      return;
    } catch (error) {
      console.warn(error);
      showToast(t("ล้างประวัติการเข้าสู่ระบบไม่สำเร็จ", "Failed to clear login history"));
      return;
    }
  }
  if (Array.isArray(DATA.loginHistory)) {
    DATA.loginHistory.splice(0, DATA.loginHistory.length);
  } else {
    DATA.loginHistory = [];
  }
  state.pages["login-history"] = 1;
  persistLocal();
  render();
  showToast(t("ล้างประวัติการเข้าสู่ระบบแล้ว", "Login history cleared"));
}
window.clearLoginHistoryLogs = clearLoginHistoryLogs;

async function clearAuditLogs() {
  if (state.user?.role !== "admin") return;
  if (!confirm(t("คุณต้องการล้างประวัติการแก้ไขและลบข้อมูลทั้งหมดใช่หรือไม่?", "Are you sure you want to clear all audit logs?"))) return;
  if (Array.isArray(DATA.auditLogs)) {
    DATA.auditLogs.splice(0, DATA.auditLogs.length);
  } else {
    DATA.auditLogs = [];
  }
  state.pages["audit-logs"] = 1;
  persistLocal();
  render();
  showToast(t("ล้างประวัติการแก้ไขและลบข้อมูลแล้ว", "Audit logs cleared"));
}
window.clearAuditLogs = clearAuditLogs;

function bindShell() {
  console.log("bindShell() called. Current route:", state.route);
  if (!document.body.dataset.boundLoginClearDelegated) {
    document.addEventListener("click", event => {
      const loginBtn = event.target.closest?.("[data-clear-login-logs]");
      if (loginBtn) {
        event.preventDefault();
        clearLoginHistoryLogs();
        return;
      }
      const auditBtn = event.target.closest?.("[data-clear-audit-logs]");
      if (auditBtn) {
        event.preventDefault();
        clearAuditLogs();
        return;
      }
    });
    document.body.dataset.boundLoginClearDelegated = "true";
  }

  function bindEvent(selector, event, handler) {
    const elements = document.querySelectorAll(selector);
    console.log(`bindEvent: selector="${selector}" matched ${elements.length} elements`);
    elements.forEach(el => {
      const key = `bound${event}`; // CamelCase: boundclick
      if (!el.dataset[key]) {
        el.addEventListener(event, (e) => {
          console.log(`Event listener triggered: event="${event}" on element:`, el);
          handler(el, e);
        });
        el.dataset[key] = "true";
      }
    });
  }
  function bindEventEl(el, event, handler) {
    if (!el) {
      console.log(`bindEventEl: element is null for event="${event}"`);
      return;
    }
    const key = `bound${event}`;
    if (!el.dataset[key]) {
      el.addEventListener(event, (e) => {
        console.log(`Event listener triggered: event="${event}" on static element:`, el);
        handler(el, e);
      });
      el.dataset[key] = "true";
    }
  }

  bindEvent("[data-route]", "click", (button) => {
    const route = button.dataset.route;
    console.log(`data-route click handler: route="${route}"`);
    setRoute(route);
  });
  bindEvent("[data-nav-group]", "click", (button) => {
    const groupId = button.dataset.navGroup;
    console.log(`data-nav-group click handler: groupId="${groupId}"`);
    const item = navItems.find(nav => nav.id === groupId);
    const isCurrentlyExpanded = isGroupExpanded(groupId);
    state.expandedGroups = { [groupId]: !isCurrentlyExpanded };
    const isRouteInGroup = (item.children || []).some(child => child.id === state.route);
    if (state.expandedGroups[groupId] && !isRouteInGroup) {
      setRoute(item.children[0].id);
    } else {
      render();
    }
  });

  bindEventEl(document.querySelector("[data-open-drawer]"), "click", () => { state.drawerOpen = true; render(); });
  bindEventEl(document.querySelector("[data-toggle-sidebar]"), "click", () => { state.sidebarCollapsed = !state.sidebarCollapsed; render(); });
  bindEvent("[data-close-drawer]", "click", () => { state.drawerOpen = false; render(); });
  // Handled by event delegation on #action-menu-container
  bindEvent("[data-logout]", "click", () => { state.modal = { type: "logout-confirm" }; render(); });
  bindEventEl(document.querySelector("[data-confirm-logout]"), "click", logout);

  bindEvent("[data-filter]", "input", (input) => {
    state.filters[input.dataset.filter] = input.value;
    state.pages[pageKeyForFilter(input.dataset.filter)] = 1;
    if (!updateActivePageTable()) renderPreservingFilterFocus(input);
  });

  bindEvent("[data-filter-change]", "change", (select) => {
    state.filters[select.dataset.filterChange] = select.value;
    state.pages[pageKeyForFilter(select.dataset.filterChange)] = 1;
    if (!updateActivePageTable()) render();
  });

  bindEvent("[data-reset-filters]", "click", (button) => {
    resetFilters(button.dataset.resetFilters, button.dataset.resetPageKey);
  });

  bindEvent("[data-page-key]", "click", (button) => {
    setPage(button.dataset.pageKey, Number(button.dataset.page));
  });

  bindEvent(".page-size-select", "change", (select) => {
    const key = select.dataset.pageSizeKey;
    const size = Number(select.value);
    state.pageSizes[key] = size;
    state.pages[key] = 1;
    render();
  });

  bindEvent("[data-action-menu]", "click", (button, event) => {
    event.stopPropagation();
    const key = button.dataset.actionMenu;
    if (state.actionMenu?.key === key) { state.actionMenu = null; render(); return; }
    state.actionMenu = actionMenuPosition(button, key);
    render();
  });

  const menuContainer = document.getElementById("action-menu-container");
  if (menuContainer && !menuContainer.dataset.boundClickDelegated) {
    menuContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (button) {
        event.stopPropagation();
        handleAction(button);
        return;
      }
      const scrim = event.target.closest("[data-close-action-menu]");
      if (scrim) {
        state.actionMenu = null;
        render();
      }
    });
    menuContainer.dataset.boundClickDelegated = "true";
  }

  bindEvent("[data-view-asset]", "click", (button) => {
    state.modal = { type: "asset", group: button.dataset.group, code: button.dataset.viewAsset };
    render();
  });

  bindEvent("[data-open-request]", "click", () => {
    state.modal = { type: "request" };
    render();
  });

  bindEvent("[data-open-asset]", "click", (button) => {
    state.modal = { type: "asset-form", group: button.dataset.openAsset, typeGroupCode: button.dataset.openTypeGroup || "" };
    render();
  });

  bindEvent("[data-open-checkout]", "click", (button) => {
    state.pendingCheckout = null;
    state.modal = { type: "checkout", code: button.dataset.code || "" };
    render();
  });

  bindEvent("[data-open-checkout-return]", "click", (button) => {
    const rawIndex = button.dataset.openCheckoutReturn;
    state.modal = rawIndex === "" || rawIndex === undefined
      ? { type: "checkout-return" }
      : { type: "checkout-return", index: Number(rawIndex) };
    render();
  });

  bindEvent("[data-close-modal]", "click", () => {
    if (state.modal?.type === "asset-save-confirm") state.pendingAssetSave = null;
    if (state.modal?.type === "checkout-record-confirm") state.pendingCheckoutRecord = null;
    state.selectedImageFile1 = null;
    state.selectedImageFile2 = null;
    state.modal = null;
    render();
  });

  bindEvent("[data-submit-request]", "click", submitMaintenanceRequest);
  bindEvent("[data-checkout-presave]", "click", () => {
    const selectedRef = modalValue("[data-checkout-field='asset']");
    const resolved = itemForAssetRef(selectedRef, state.modal?.assetGroup || "computer");
    const asset = resolved.item;
    const requester = modalValue("[data-checkout-field='requester']") || state.user.name;
    const dept = modalValue("[data-checkout-field='department']");
    const resolvedCode = asset?.assetCode || state.modal?.selectedAssetCode;
    state.pendingCheckout = {
      requester,
      department: dept,
      date: modalValue("[data-checkout-field='date']"),
      expectedReturn: modalValue("[data-checkout-field='expectedReturn']"),
      purpose: modalValue("[data-checkout-field='purpose']"),
      assetGroup: state.modal?.assetGroup || resolved.group || "computer",
      selectedAssetCode: resolvedCode,
    };
    submitCheckout();
  });
  bindEvent("[data-confirm-checkout-save]", "click", submitCheckout);
  bindEvent("[data-confirm-checkout-record]", "click", openCheckoutRecordConfirm);
  bindEvent("[data-confirm-checkout-record-save]", "click", confirmCheckoutRecord);
  bindEvent("[data-submit-checkout-return]", "click", submitCheckoutReturn);
  bindEvent("[data-confirm-checkout-return]", "click", confirmCheckoutReturn);
  bindEvent("[data-approve-maintenance-request]", "click", approveMaintenanceRequest);
  bindEvent("[data-reject-maintenance-request]", "click", rejectMaintenanceRequest);
  bindEvent("[data-complete-maintenance-history]", "click", completeMaintenanceHistory);
  bindEvent("[data-checkout-add-asset]", "click", () => {
    state.pendingCheckout = {
      requester: modalValue("[data-checkout-field='requester']"),
      department: modalValue("[data-checkout-field='department']"),
      date: modalValue("[data-checkout-field='date']"),
      expectedReturn: modalValue("[data-checkout-field='expectedReturn']"),
      purpose: modalValue("[data-checkout-field='purpose']"),
    };
    state.modal = {
      type: "asset-form",
      group: state.modal?.assetGroup || "computer",
      fromCheckout: true
    };
    render();
  });
  bindEvent("[data-asset-presave]", "click", presaveAsset);
  bindEvent("[data-confirm-asset-save]", "click", confirmAssetSave);
  bindEvent("[data-submit-asset]", "click", submitAsset);
  bindEvent("[data-submit-record]", "click", submitRecordEdit);
  bindEvent("[data-submit-master]", "click", submitMaster);

  function compressImage(file, callback) {
    if (!file.type.startsWith('image/')) {
      callback(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (!blob) {
            callback(file);
            return;
          }
          const newFilename = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
          const compressedFile = new File([blob], newFilename, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          callback(compressedFile);
        }, 'image/jpeg', 0.75);
      };
      img.onerror = () => callback(file);
    };
    reader.onerror = () => callback(file);
  }

  document.addEventListener("change", event => {
    const fileInput = event.target.closest("#asset-image-file-1, #asset-image-file-2");
    if (!fileInput) return;
    const isFirst = fileInput.id === "asset-image-file-1";
    const num = isFirst ? "1" : "2";
    const file = fileInput.files[0];
    if (!file) return;
    
    compressImage(file, compressedFile => {
      if (isFirst) {
        state.selectedImageFile1 = compressedFile;
      } else {
        state.selectedImageFile2 = compressedFile;
      }
      
      const reader = new FileReader();
      reader.onload = e => {
        const preview = document.querySelector(`#asset-image-preview-${num}`);
        if (preview) {
          preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        }
        const btnSelect = document.querySelector(`#btn-select-asset-image-${num} span`);
        if (btnSelect) {
          btnSelect.textContent = "เปลี่ยนรูป";
        }
        const btnDelete = document.querySelector(`#btn-delete-asset-image-${num}`);
        if (btnDelete) {
          btnDelete.style.display = "inline-flex";
        }
      };
      reader.readAsDataURL(compressedFile);
    });
  });

  document.addEventListener("click", event => {
    const btnDelete = event.target.closest("#btn-delete-asset-image-1, #btn-delete-asset-image-2");
    if (!btnDelete) return;
    
    const isFirst = btnDelete.id === "btn-delete-asset-image-1";
    const num = isFirst ? "1" : "2";
    
    if (isFirst) {
      state.selectedImageFile1 = null;
    } else {
      state.selectedImageFile2 = null;
    }
    
    const hiddenInput = document.querySelector(`input[data-asset-field='imageUrl${num}']`);
    if (hiddenInput) {
      hiddenInput.value = "";
    }
    
    const preview = document.querySelector(`#asset-image-preview-${num}`);
    if (preview) {
      preview.innerHTML = `<span style="font-size: 24px; color: var(--ink-muted);">${icon("image")}</span>`;
    }
    
    btnDelete.style.display = "none";
    
    const btnSelect = document.querySelector(`#btn-select-asset-image-${num} span`);
    if (btnSelect) {
      btnSelect.textContent = "เลือกรูป";
    }
    
    const fileInput = document.querySelector(`#asset-image-file-${num}`);
    if (fileInput) {
      fileInput.value = "";
    }
  });

  bindEvent("[data-view-record]", "click", (button) => {
    state.modal = { type: "record", collection: button.dataset.viewRecord, index: Number(button.dataset.index) };
    render();
  });

  bindEvent("[data-master-add]", "click", () => {
    state.actionMenu = null;
    state.modal = { type: "master-form", tab: state.masterTab };
    render();
  });

  bindEvent("[data-master-edit]", "click", (button) => {
    state.actionMenu = null;
    state.modal = { type: "master-form", tab: state.masterTab, index: Number(button.dataset.masterEdit) };
    render();
  });

  bindEvent("[data-master-delete]", "click", (button) => {
    const rows = DATA.master[state.masterTab] || [];
    const index = Number(button.dataset.masterDelete);
    const row = rows[index] || {};
    state.actionMenu = null;
    state.modal = { type: "delete-confirm", target: "master", tab: state.masterTab, index, label: row.name || row.code || "Master Data" };
    render();
  });

  bindEvent("[data-master-tab]", "click", (button) => {
    state.masterTab = button.dataset.masterTab;
    state.filters = {};
    state.pages[`master-${state.masterTab}`] = 1;
    render();
  });

  bindEvent("[data-settings-tab]", "click", (button) => {
    state.settingsTab = button.dataset.settingsTab;
    state.editingGeneral = false;
    state.settingsDirty = false;
    state.auditFilterSearch = "";
    state.auditFilterAction = "all";
    state.loginFilterStatus = "all";
    state.pages["audit-logs"] = 1;
    state.pages["login-history"] = 1;
    render();
  });

  bindEvent("[data-modal-asset-group]", "click", (button) => {
    state.modal = { ...(state.modal || {}), assetGroup: button.dataset.modalAssetGroup };
    render();
  });

  bindEvent("[data-return-type]", "click", (button) => {
    state.modal = {
      ...(state.modal || {}),
      type: "checkout-return",
      returnGroup: button.dataset.returnType,
      returnedDate: modalValue("[data-return-field='returnedDate']", today()),
    };
    render();
  });

  bindEvent("[data-return-field='record']", "input", refreshCheckoutReturnInfo);
  bindEvent("[data-return-field='record']", "change", refreshCheckoutReturnInfo);

  bindEvent("[data-notification-tab]", "click", (button) => {
    state.notificationTab = button.dataset.notificationTab;
    render();
  });

  bindEventEl(document.querySelector("[data-mark-read]"), "click", () => {
    systemNotifications().forEach(item => setWarrantyReadState(item.key, true));
    state.notificationTab = "all";
    persistLocal();
    render();
  });

  bindEvent("[data-read-notification]", "click", (button) => {
    setWarrantyReadState(button.dataset.readNotification, true);
    state.notificationTab = "all";
    persistLocal();
    showToast("ทำเครื่องหมายอ่านแล้ว");
  });

  bindEventEl(document.querySelector("[data-save-settings]"), "click", saveSettings);
  bindEventEl(document.querySelector("[data-save-ms-auth]"), "click", saveMicrosoftAuthSettings);
  bindEvent("[data-setting]", "input", (input) => {
    markSettingsDirty(input);
  });
  bindEvent("[data-setting]", "change", (input) => {
    markSettingsDirty(input);
    applyGeneralOverviewSetting(input);
  });

  bindEvent("[data-login-filter-status]", "change", (select) => {
    // รีเซ็ตหน้ากลับ 1 เมื่อเปลี่ยนฟิลเตอร์
    state.loginFilterStatus = select.value;
    state.pages["login-history"] = 1;
    render();
  });

  bindEvent("[data-audit-filter-action]", "change", (select) => {
    state.auditFilterAction = select.value;
    state.pages["audit-logs"] = 1;
    render();
  });

  bindEvent("[data-audit-search]", "input", (input) => {
    state.auditFilterSearch = input.value;
    state.pages["audit-logs"] = 1;
    render();
  });

  bindEvent("[data-clear-login-logs]", "click", clearLoginHistoryLogs);
  bindEvent("[data-delete-all], [data-delete-all-data], [data-clear-all-data]", "click", () => {
    state.modal = { type: "delete-all-confirm" };
    render();
  });
  bindEvent("[data-confirm-delete-all]", "click", deleteAllData);
  bindEvent("[data-confirm-delete]", "click", confirmDelete);
  bindEventEl(document.querySelector("[data-edit-general]"), "click", () => { state.editingGeneral = true; render(); });
  bindEventEl(document.querySelector("[data-cancel-general]"), "click", () => { state.editingGeneral = false; render(); });

  bindEventEl(document.querySelector("[data-save-general]"), "click", () => {
    document.querySelectorAll(".settings-panel [data-setting]").forEach(input => {
      const key = input.dataset.setting;
      if (!key) return;
      applySettingValue(key, settingInputValue(input));
    });
    persistLocal();
    state.editingGeneral = false;
    state.settingsDirty = false;
    render();
    showToast(t("บันทึกการตั้งค่าสำเร็จ", "Settings saved successfully"));
  });

  bindEvent(".settings-panel [data-setting]", "change", (input) => {
    const key = input.dataset.setting;
    if (!key) return;
    applySettingValue(key, settingInputValue(input));
    persistLocal();
    render();
  });

  bindEvent("[data-set-lang]", "click", (button) => {
    state.lang = button.dataset.setLang;
    localStorage.setItem("asset-control-lang", state.lang);
    render();
  });

  bindEventEl(document.querySelector("[data-open-user-form]"), "click", () => { state.modal = { type: "user-form" }; render(); });

  bindEvent("[data-edit-user]", "click", (button) => {
    state.actionMenu = null;
    state.modal = { type: "user-form", index: Number(button.dataset.editUser) };
    render();
  });

  bindEvent("[data-edit-profile]", "click", (button) => {
    state.modal = { type: "user-form", index: Number(button.dataset.editProfile) };
    render();
  });

  bindEvent("[data-reset-user-pw]", "click", (button) => {
    state.actionMenu = null;
    state.modal = { type: "reset-user-pw", index: Number(button.dataset.resetUserPw) };
    render();
  });

  bindEvent("[data-user-avatar-file]", "change", (input) => {
    const file = input.files && input.files[0];
    if (!file) return;
    compressImage(file, (compressedFile) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const hiddenInput = document.getElementById("user-avatar-hidden-input");
        const preview = document.getElementById("user-avatar-preview");
        if (hiddenInput) hiddenInput.value = dataUrl;
        if (preview) {
          preview.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:cover">`;
        }
      };
      reader.readAsDataURL(compressedFile);
    });
  });

  bindEvent("#remove-user-avatar-btn", "click", () => {
    const hiddenInput = document.getElementById("user-avatar-hidden-input");
    const preview = document.getElementById("user-avatar-preview");
    if (hiddenInput) hiddenInput.value = "";
    if (preview) {
      preview.innerHTML = `<span style="font-size:32px; color:var(--brand)">${icon("user")}</span>`;
    }
  });

  bindEvent("[data-submit-user]", "click", (button) => {
    submitUser(button.dataset.submitUser);
  });

  bindEvent("[data-submit-user-pw]", "click", (button) => {
    submitUserPassword(button.dataset.submitUserPw);
  });

  bindEvent("[data-toggle-user-active]", "click", (button) => {
    const idx = Number(button.dataset.toggleUserActive);
    const user = DATA.users[idx];
    if (user) {
      user.active = user.active === false ? true : false;
      persistLocal();
      render();
      showToast(t("อัปเดตสถานะผู้ใช้งานแล้ว", "User status updated"));
    }
  });

  bindEvent("[data-delete-user]", "click", (button) => {
    state.actionMenu = null;
    const idx = Number(button.dataset.deleteUser);
    const user = DATA.users[idx];
    if (user) {
      if (user.username === state.user.username) {
        render();
        alert(t("คุณไม่สามารถลบบัญชีของตัวเองที่กำลังใช้งานได้", "You cannot delete your own logged-in account"));
        return;
      }
      state.modal = { type: "delete-confirm", target: "user", index: idx, label: user.username || user.name || "User" };
      render();
    }
  });

  bindEventEl(document.querySelector("[data-backup-db]"), "click", backupDatabase);
  bindEventEl(document.getElementById("restore-db-file"), "change", restoreDatabase);
  bindEventEl(document.querySelector("[data-test-connection]"), "click", testConnection);

  if (state.settingsTab === "data") setTimeout(testConnection, 100);
  if (!window.boundNetworkStatusListeners) {
    window.boundNetworkStatusListeners = true;
    window.addEventListener("online", () => { if (state.settingsTab === "data") testConnection(); });
    window.addEventListener("offline", () => { if (state.settingsTab === "data") testConnection(); });
  }
  bindDonutTooltip();
}
function bindDonutTooltip() {
  document.querySelectorAll("[data-donut-chart]").forEach(donut => {
    const key = "boundDonut";
    if (donut.dataset[key]) return;
    donut.dataset[key] = "true";

    const tooltip = donut.querySelector("[data-donut-tooltip]");
    if (!tooltip) return;
    const updateTooltip = event => {
      const rect = donut.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const outer = rect.width / 2;
      const inner = outer * 0.32;
      if (radius < inner || radius > outer) { donut.classList.remove("tooltip-active"); return; }
      const angle = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
      const computerDeg = Number(donut.dataset.computerDeg || 0);
      const isComputer = angle <= computerDeg;
      tooltip.innerHTML = `${isComputer ? "Computer Assets" : "Other Assets"} <strong>${isComputer ? donut.dataset.computerCount : donut.dataset.otherCount}</strong>`;
      donut.style.setProperty("--tip-x", `${Math.min(Math.max(x, 44), rect.width - 44)}px`);
      donut.style.setProperty("--tip-y", `${Math.min(Math.max(y, 26), rect.height - 26)}px`);
      donut.classList.add("tooltip-active");
    };
    donut.addEventListener("pointermove", updateTooltip);
    donut.addEventListener("pointerleave", () => donut.classList.remove("tooltip-active"));
    donut.addEventListener("focus", () => donut.classList.add("tooltip-active"));
    donut.addEventListener("blur", () => donut.classList.remove("tooltip-active"));
  });
}

// Document-level delegated event listeners for Image Lightbox (Preview)
document.addEventListener("click", event => {
  const openLightbox = event.target.closest("[data-open-lightbox]");
  if (openLightbox) {
    event.preventDefault();
    state.previewImageUrl = openLightbox.dataset.openLightbox;
    render();
    return;
  }

  const closeLightbox = event.target.closest("[data-close-lightbox]");
  if (closeLightbox) {
    event.preventDefault();
    state.previewImageUrl = null;
    render();
    return;
  }
});

// Document-level delegated change event listener for type dropdown
document.addEventListener("change", event => {
  if (event.target.id === "asset-type-select") {
    const selectedType = event.target.value;
    const allTypes = DATA.master.types || [];
    const typeObj = allTypes.find(t => (t.name || t.code) === selectedType);
    const groupCode = typeObj ? (typeObj.groupCode || "") : "";
    
    // Update the Group label
    const typeGroups = DATA.master.typeGroups || [];
    const groupObj = typeGroups.find(g => g.code === groupCode);
    const groupLabel = groupObj ? groupObj.name : groupCode || "ทุกกลุ่มประเภท";
    
    const displayEl = document.getElementById("asset-typegroup-display");
    if (displayEl) {
      displayEl.textContent = groupLabel;
      displayEl.dataset.typeGroup = groupCode;
    }
    
    // Update dynamic fields and checklist
    const dynamicFieldsContainer = document.getElementById("dynamic-fields-container");
    if (dynamicFieldsContainer) {
      dynamicFieldsContainer.innerHTML = typeof getDynamicFormHtml === "function" ? getDynamicFormHtml(groupCode, {}) : "";
    }
    
    const dynamicChecklistContainer = document.getElementById("dynamic-checklist-container");
    if (dynamicChecklistContainer) {
      dynamicChecklistContainer.innerHTML = typeof getDynamicChecklistHtml === "function" ? getDynamicChecklistHtml(groupCode, {}) : "";
    }
  }
});

