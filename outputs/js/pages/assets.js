// ============================================================
// pages/assets.js — Asset list pages and action menu
// ============================================================

function renderAssetToolbar(prefix, items, placeholder) {
  const pageKey = `${prefix}-assets`;
  return `<div class="toolbar">
    <div class="search-box">${icon("search")}<input class="input" data-filter="${prefix}-q" value="${esc(state.filters[`${prefix}-q`] || "")}" placeholder="${esc(t(placeholder, placeholder))}"></div>
    <div class="filter-row">
      ${selectFilter(`${prefix}-type`, t("ทุกประเภท", "All Types"), uniqueOptions(items, "type"), "laptop")}
      ${selectFilter(`${prefix}-company`, t("ทุกบริษัท", "All Companies"), uniqueOptions(items, "company"), "building")}
      ${selectFilter(`${prefix}-status`, t("ทุกสถานะ", "All Statuses"), uniqueOptions(items, "status"), "filter")}
      ${renderPageSizeSelector(pageKey)}
      ${resetFilterButton(prefix, pageKey)}
    </div>
  </div>`;
}
function renderAssetPage(group) {
  const isComputer = group === "computer";
  const items = isComputer ? DATA.computerAssets : DATA.otherAssets;
  const prefix = isComputer ? "computer" : "other";
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
  const action = `<button class="primary-btn" data-open-asset="${group}">${icon("plus")} ${t("เพิ่มใหม่", "Add New")}</button>`;
  const pageKey = `${prefix}-assets`;
  return `<section class="panel page-panel">
    ${pageHeading(isComputer ? "laptop" : "network", isComputer ? "Computer Assets" : "IT Equipment", isComputer ? t("คอมพิวเตอร์", "Computer Assets") : t("อุปกรณ์ไอที", "IT Equipment"), action)}
    ${renderAssetToolbar(prefix, items, isComputer ? t("ค้นหา Asset Code, ยี่ห้อ, Serial, ผู้ใช้งาน...", "Search Asset Code, Brand, Serial, User...") : t("ค้นหา Asset Code, ยี่ห้อ, Serial, สถานที่...", "Search Asset Code, Brand, Serial, Location..."))}
    ${renderAssetTable(filtered, group, pageKey)}
    ${renderPagination(filtered.length, pageKey)}
  </section>`;
}
function renderAssetPageByGroup(groupCode) {
  const groupObj = (DATA.master.typeGroups || []).find(g => g.code === groupCode) || { code: groupCode, name: groupCode };
  const typeCodes = (DATA.master.types || [])
    .filter(t => t.groupCode === groupCode)
    .reduce((acc, t) => {
      if (t.name) acc.add(t.name.toLowerCase());
      if (t.code) acc.add(t.code.toLowerCase());
      return acc;
    }, new Set());
  let items = allAssets().filter(a => a.type && typeCodes.has(a.type.toLowerCase()));
  if (groupCode === "IT") items = items.filter(a => !isComputerAssetType(a.type));
  const prefix = "assets-" + groupCode;
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
  const labelTh = (typeof GROUP_FALLBACK_LABEL_TH !== "undefined" && GROUP_FALLBACK_LABEL_TH[groupCode]) || groupObj.name.split(" (")[0];
  const labelEn = (typeof GROUP_FALLBACK_LABEL !== "undefined" && GROUP_FALLBACK_LABEL[groupCode]) || groupCode;
  const groupIcon = (typeof GROUP_ICONS !== "undefined" && GROUP_ICONS[groupCode]) || "box";
  const defaultAssetGroup = "other";
  const action = `<button class="primary-btn" data-open-asset="${defaultAssetGroup}" data-open-type-group="${esc(groupCode)}">${icon("plus")} ${t("เพิ่มใหม่", "Add New")}</button>`;
  const pageKey = `${prefix}-assets`;
  return `<section class="panel page-panel">
    ${pageHeading(groupIcon, labelEn, labelTh, action)}
    ${renderAssetToolbar(prefix, items, t("ค้นหา Asset Code, ยี่ห้อ, Serial...", "Search Asset Code, Brand, Serial..."))}
    ${renderAssetTable(filtered, "other", pageKey)}
    ${renderPagination(filtered.length, pageKey)}
  </section>`;
}
function renderAssetTable(items, group, pageKey) {
  const isComputerRoute = group === "computer";
  const showRustDesk = isComputerRoute;
  
  const page = paged(items, pageKey);
  const headers = `<tr><th>${t("Asset Code ↑", "Asset Code ↑")}</th>${showRustDesk ? `<th>${t("RustDesk ID", "RustDesk ID")}</th>` : ""}<th>${t("ประเภท", "Type")}</th><th>${t("บริษัท", "Company")}</th><th>${t("ผู้ใช้งาน / สถานที่", "User / Location")}</th><th>${t("สถานะ", "Status")}</th><th>${t("แก้ไขล่าสุด", "Last Updated")}</th><th></th></tr>`;
  const rows = page.items.map(item => {
    const assetGroup = item.group || (isComputerRoute ? "computer" : "other");
    const source = listForGroup(assetGroup);
    const index = source.findIndex(x => x.assetCode === item.assetCode);
    const isComputerItem = assetGroup === "computer";
    
    // Display user if exists, otherwise location & room
    const userOrLoc = item.user || [item.location, item.room].filter(Boolean).join(" / ") || "-";
    
    return `<tr>
    <td class="row-title">${esc(item.assetCode)}</td>
    ${showRustDesk ? `<td>${esc(item.rustDeskId || "-")}</td>` : ""}
    <td>${icon(isComputerItem ? "laptop" : "network")} ${esc(item.type)}</td>
    <td>${esc(item.company)}</td>
    <td>${esc(userOrLoc)}</td>
    <td><span class="status-pill ${statusClass(item.status)}">${esc(item.status)}</span></td>
    <td>${item.updatedAt ? esc(new Date(item.updatedAt).toLocaleString(state.lang === "en" ? "en-GB" : "th-TH", { dateStyle: "short", timeStyle: "short" })) : "-"}</td>
    <td class="action-cell">${assetActionButton(assetGroup, index, item.assetCode)}</td>
  </tr>`;
  }).join("");
  return `<div class="table-wrap"><table><thead>${headers}</thead><tbody>${rows || `<tr><td colspan="${showRustDesk ? 8 : 7}"><div class="empty-state">${t("ไม่พบข้อมูลตามเงื่อนไข", "No records match the filters.")}</div></td></tr>`}</tbody></table></div>`;
}

// --- Action menu ---
function actionMenuPosition(button, key) {
  const rect = button.getBoundingClientRect();
  const padding = 12;
  const left = Math.min(
    Math.max(padding, rect.right - ACTION_MENU_WIDTH),
    Math.max(padding, window.innerWidth - ACTION_MENU_WIDTH - padding)
  );
  const below = rect.bottom + ACTION_MENU_GAP;
  const above = rect.top - ACTION_MENU_HEIGHT - ACTION_MENU_GAP;
  const shouldOpenAbove = below + ACTION_MENU_HEIGHT > window.innerHeight - padding && above > padding;
  const top = shouldOpenAbove
    ? above
    : Math.min(below, Math.max(padding, window.innerHeight - ACTION_MENU_HEIGHT - padding));
  return { key, left, top };
}
function actionMenuItemsForKey(key) {
  const assetMatch = /^asset-(computer|other)-(\d+)$/.exec(key || "");
  if (assetMatch) {
    const group = assetMatch[1];
    const index = Number(assetMatch[2]);
    const item = listForGroup(group)[index];
    if (!item) return [];
    return [
      `<button class="action-menu-item" data-action="detail" data-entity="asset" data-group="${group}" data-index="${index}" data-code="${esc(item.assetCode)}">${icon("eye")} ดูรายละเอียด</button>`,
      `<button class="action-menu-item" data-action="edit" data-entity="asset" data-group="${group}" data-index="${index}">${icon("edit")} แก้ไข</button>`,
      `<button class="action-menu-item danger" data-action="delete" data-entity="asset" data-group="${group}" data-index="${index}">${icon("trash")} ลบ</button>`,
    ];
  }
  const recordMatch = /^record-(maintenanceHistory|maintenanceRequests|checkoutRecords)-(\d+)$/.exec(key || "");
  if (recordMatch) {
    const collection = recordMatch[1];
    const index = Number(recordMatch[2]);
    if (!recordSource(collection)[index]) return [];
    return [
      `<button class="action-menu-item" data-action="detail" data-entity="record" data-collection="${collection}" data-index="${index}">${icon("eye")} ดูรายละเอียด</button>`,
      `<button class="action-menu-item" data-action="edit" data-entity="record" data-collection="${collection}" data-index="${index}">${icon("edit")} แก้ไข</button>`,
      `<button class="action-menu-item danger" data-action="delete" data-entity="record" data-collection="${collection}" data-index="${index}">${icon("trash")} ลบ</button>`,
    ];
  }
  const userMatch = /^user-(\d+)$/.exec(key || "");
  if (userMatch) {
    const index = Number(userMatch[1]);
    if (!registeredUsers()[index]) return [];
    return [
      `<button class="action-menu-item" data-edit-user="${index}">${icon("edit")} ${t("แก้ไข", "Edit")}</button>`,
      `<button class="action-menu-item" data-reset-user-pw="${index}">${icon("settings")} ${t("รีเซ็ตรหัสผ่าน", "Reset Password")}</button>`,
      `<button class="action-menu-item danger" data-delete-user="${index}">${icon("trash")} ${t("ลบ", "Delete")}</button>`,
    ];
  }
  const masterMatch = /^master-(companies|departments|locations|types|typeGroups)-(\d+)$/.exec(key || "");
  if (masterMatch) {
    const tab = masterMatch[1];
    const index = Number(masterMatch[2]);
    const rows = DATA.master[tab] || [];
    if (!rows[index]) return [];
    return [
      `<button class="action-menu-item" data-master-edit="${index}">${icon("edit")} แก้ไข</button>`,
      `<button class="action-menu-item danger" data-master-delete="${index}">${icon("trash")} ลบ</button>`,
    ];
  }
  return [];
}
function renderActionMenuOverlay() {
  if (!state.actionMenu?.key) return "";
  const items = actionMenuItemsForKey(state.actionMenu.key);
  if (!items.length) return "";
  return `<button class="action-menu-scrim" data-close-action-menu aria-label="Close menu"></button><div class="action-menu action-menu-floating" style="left:${state.actionMenu.left}px;top:${state.actionMenu.top}px">${items.join("")}</div>`;
}
function actionMenuHtml() {
  return "";
}
function assetActionButton(group, index, code) {
  const key = `asset-${group}-${index}`;
  return `<div class="action-wrap">
    <button class="more-btn" data-action-menu="${key}" title="เมนูรายการ" aria-label="เมนูรายการ">${icon("more")}</button>
    ${actionMenuHtml(key, [
      `<button class="action-menu-item" data-action="detail" data-entity="asset" data-group="${group}" data-index="${index}" data-code="${esc(code)}">${icon("eye")} ดูรายละเอียด</button>`,
      `<button class="action-menu-item" data-action="edit" data-entity="asset" data-group="${group}" data-index="${index}">${icon("edit")} แก้ไข</button>`,
      `<button class="action-menu-item danger" data-action="delete" data-entity="asset" data-group="${group}" data-index="${index}">${icon("trash")} ลบ</button>`,
    ])}
  </div>`;
}
function recordActionButton(collection, index) {
  const key = `record-${collection}-${index}`;
  return `<div class="action-wrap">
    <button class="more-btn" data-action-menu="${key}" title="เมนูรายการ" aria-label="เมนูรายการ">${icon("more")}</button>
    ${actionMenuHtml(key, [
      `<button class="action-menu-item" data-action="detail" data-entity="record" data-collection="${collection}" data-index="${index}">${icon("eye")} ดูรายละเอียด</button>`,
      `<button class="action-menu-item" data-action="edit" data-entity="record" data-collection="${collection}" data-index="${index}">${icon("edit")} แก้ไข</button>`,
      `<button class="action-menu-item danger" data-action="delete" data-entity="record" data-collection="${collection}" data-index="${index}">${icon("trash")} ลบ</button>`,
    ])}
  </div>`;
}
function handleAction(button) {
  const action = button.dataset.action;
  state.actionMenu = null;
  if (button.dataset.entity === "asset") {
    const group = button.dataset.group || "computer";
    const index = Number(button.dataset.index);
    const list = listForGroup(group);
    const item = list[index];
    if (!item) return;
    if (action === "detail") {
      state.modal = { type: "asset", group, index, code: item.assetCode };
    }
    if (action === "edit") state.modal = { type: "asset-form", group, index };
    if (action === "delete") {
      state.modal = { type: "delete-confirm", target: "asset", group, index, label: item.assetCode || item.serial || item.model || item.type || "Asset" };
      render();
      return;
    }
    render();
    return;
  }
  const collection = button.dataset.collection;
  const index = Number(button.dataset.index);
  const source = recordSource(collection);
  if (!source[index]) return;
  if (action === "detail") state.modal = { type: "record", collection, index };
  if (action === "edit") state.modal = { type: "record-form", collection, index };
  if (action === "delete") {
    const item = source[index];
    state.modal = { type: "delete-confirm", target: "record", collection, index, label: item.title || item.asset || item.sub || "รายการ" };
    render();
    return;
  }
  render();
}
