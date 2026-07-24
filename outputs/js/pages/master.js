// ============================================================
// pages/master.js - Master data page
// ============================================================

function masterRowsForTab(tab) {
  return DATA.master?.[tab] || [];
}

function renderMasterRows(tab, pageItems, rows, masterActionButton) {
  if (tab === "typeGroups") {
    return tableFromRows([t("รหัสกลุ่ม ↑", "Group Code ↑"), t("ชื่อกลุ่ม", "Group Name"), t("จัดการ", "Actions")], pageItems.map(row => [
      esc(row.code),
      esc(row.name),
      masterActionButton(rows.indexOf(row)),
    ]));
  }

  const titleMapTh = { companies: "บริษัท", departments: "แผนก", locations: "สถานที่", types: "ประเภท", typeGroups: "กลุ่มประเภท", statuses: "สถานะ", positions: "ตำแหน่ง" };
  const titleMapEn = { companies: "Company", departments: "Department", locations: "Location", types: "Type", typeGroups: "Type Group", statuses: "Status", positions: "Position" };
  return tableFromRows([t(`รหัส${titleMapTh[tab]} ↑`, `${titleMapEn[tab]} Code ↑`), t(`ชื่อ${titleMapTh[tab]}`, `${titleMapEn[tab]} Name`), t("จัดการ", "Actions")], pageItems.map(row => [
    esc(row.code),
    esc(row.name),
    masterActionButton(rows.indexOf(row)),
  ]));
}

function renderMaster() {
  if (state.user.role !== "admin") return `<div class="permission-note">${t("User ไม่มีสิทธิ์เข้าถึง Master Data", "User is not authorized to access Master Data")}</div>`;
  const tabs = [
    { id: "companies", label: () => t("บริษัท", "Company"), icon: "building" },
    { id: "departments", label: () => t("แผนก", "Department"), icon: "tag" },
    { id: "positions", label: () => t("ตำแหน่ง", "Position"), icon: "briefcase" },
    { id: "locations", label: () => t("สถานที่", "Location"), icon: "map" },
    { id: "types", label: () => t("ประเภท", "Type"), icon: "laptop" },
    { id: "typeGroups", label: () => t("กลุ่มประเภท", "Type Groups"), icon: "list" },
  ];
  const isTypeGroups = state.masterTab === "typeGroups";
  const rows = masterRowsForTab(state.masterTab);
  const sortedRows = sortByAlpha(rows, row => row.code || row.name);
  const pageKey = `master-${state.masterTab}`;
  const page = paged(sortedRows, pageKey);
  const masterActionButton = (index) => `<div class="action-wrap"><button class="more-btn" data-action-menu="master-${state.masterTab}-${index}" title="${t("เมนูรายการ", "Actions")}" aria-label="${t("เมนูรายการ", "Actions")}">${icon("more")}</button></div>`;
  return `${pageHeading("database", "Master Data", t("ข้อมูลหลักของระบบ", "System Master Data"))}
    <div class="tabs master-tabs">${tabs.map(tab => {
      const tabLabel = typeof tab.label === "function" ? tab.label() : tab.label;
      return `<button class="tab ${state.masterTab === tab.id ? "active" : ""}" data-master-tab="${tab.id}">${icon(tab.icon)} ${tabLabel}</button>`;
    }).join("")}</div>
    <section class="panel master-panel">
      <div class="master-actions">
        ${renderPageSizeSelector(pageKey)}
        <button class="primary-btn" data-master-add>${icon("plus")} ${t("เพิ่ม", "Add")}</button>
      </div>
      <div class="master-table ${isTypeGroups ? "master-type-groups-table" : ""}">
        ${renderMasterRows(state.masterTab, page.items, rows, masterActionButton)}
      </div>
      ${renderPagination(sortedRows.length, pageKey)}
    </section>`;
}
