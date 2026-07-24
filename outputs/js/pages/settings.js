// ============================================================
// pages/settings.js — Settings page
// ============================================================

function renderSettings() {
  const tabs = [
    { id: "general", label: () => t("ทั่วไป", "General"), icon: "database" },
    { id: "notifications", label: () => t("การแจ้งเตือน", "Notifications"), icon: "bell" },
  ];
  if (state.user.role === "admin") {
    tabs.push({ id: "users", label: () => t("จัดการผู้ใช้", "User Management"), icon: "user" });
    tabs.push({ id: "data", label: () => t("ระบบและข้อมูล", "Data & Cloud"), icon: "shield" });
    tabs.push({ id: "login", label: () => t("ประวัติล็อกอิน", "Login History"), icon: "clock" });
    tabs.push({ id: "audit", label: () => t("ประวัติแก้ไข/ลบข้อมูล", "Audit Logs"), icon: "history" });
  }
  const headerAction = state.settingsTab === "notifications" && state.settingsDirty
    ? settingsSaveButtonHtml()
    : "";
  return `${pageHeading("settings", t("Settings", "Settings"), t("การตั้งค่าระบบ", "System Settings"), headerAction)}
    <div class="tabs" style="grid-template-columns: repeat(${tabs.length}, minmax(0, 1fr))">${tabs.map(tab => {
    const tabLabel = typeof tab.label === "function" ? tab.label() : tab.label;
    return `<button class="tab ${state.settingsTab === tab.id ? "active" : ""}" data-settings-tab="${tab.id}">${icon(tab.icon)} ${tabLabel}</button>`;
  }).join("")}</div>
    <section class="panel settings-panel">${renderSettingsBody()}</section>`;
}
function settingsReadOnly(label, value) {
  return `<div class="settings-field-row"><label>${label}</label><input class="input" value="${esc(value || "-")}" readonly></div>`;
}
function settingsSelect(label, key, value, options) {
  return `<div class="settings-field-row"><label>${label}</label><select class="select" data-setting="${key}">
    ${options.map(option => {
    const optionValue = Array.isArray(option) ? option[0] : option;
    const optionLabel = Array.isArray(option) ? option[1] : option;
    return `<option value="${esc(optionValue)}" ${String(value) === String(optionValue) ? "selected" : ""}>${esc(optionLabel)}</option>`;
  }).join("")}
  </select></div>`;
}
function settingsValueSwitch(label, key, value, offValue, onValue, offLabel, onLabel) {
  const isOn = String(value).toLowerCase() === String(onValue).toLowerCase();
  return `<div class="settings-field-row settings-switch-field">
    <label>${label}</label>
    <label class="value-switch">
      <input type="checkbox" data-setting="${key}" data-value-off="${esc(offValue)}" data-value-on="${esc(onValue)}" ${checkedAttr(isOn)}>
      <span class="value-switch-track">
        <span>${offLabel}</span>
        <span>${onLabel}</span>
      </span>
    </label>
  </div>`;
}
function settingsSwitchRow(title, subtitle, key, checked = true) {
  return `<label class="settings-toggle-row"><span><strong>${title}</strong>${subtitle ? `<small>${subtitle}</small>` : ""}</span><span class="switch"><input type="checkbox" data-setting="${key}" ${checkedAttr(settingChecked(key, checked))}><i></i></span></label>`;
}
function settingsActionRow(title, subtitle, control) {
  return `<div class="settings-action-row"><span><strong>${title}</strong>${subtitle ? `<small>${subtitle}</small>` : ""}</span>${control}</div>`;
}
function settingsOverviewCard(iconName, title, body, className = "") {
  return `<section class="settings-overview-card ${className}">
    <div class="settings-card-title"><span>${icon(iconName)}</span><h3>${title}</h3></div>
    ${body}
  </section>`;
}
function renderGeneralSettingsOverview() {
  const user = state.user || {};
  const userIndex = registeredUsers().findIndex(item => item.username === user.username);
  const roleLabel = String(user.role || "user").toUpperCase();
  const languageValue = state.lang || "th";
  return `<div class="settings-overview">
    <div class="settings-overview-head">
      <div>
        <h3>${t("ตั้งค่าทั่วไป", "General Settings")}</h3>
        <p class="subtext">${t("จัดการข้อมูลผู้ใช้ การแสดงผล การแจ้งเตือน และความปลอดภัยของระบบ", "Manage user profile, display, notifications, and system security")}</p>
      </div>
    </div>
    <div class="settings-overview-grid">
      ${settingsOverviewCard("user", t("ข้อมูลบัญชีผู้ใช้", "User Account"), `
        <div class="settings-form-stack">
          <div style="display:flex; align-items:center; gap:16px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--line)">
            <span class="avatar-large" style="width:64px; height:64px; border-radius:50%; background:#f0f0f4; border:2px solid var(--brand); display:grid; place-items:center; overflow:hidden; flex-shrink:0; box-shadow:0 3px 10px rgba(0,0,0,0.08)">
              ${user.avatar ? `<img src="${esc(user.avatar)}" style="width:100%; height:100%; object-fit:cover">` : `<span style="font-size:26px; color:var(--brand)">${icon("user")}</span>`}
            </span>
            <div>
              <strong style="font-size:16px; display:block">${esc(user.name || user.username)}</strong>
              <span class="subtext" style="font-size:13px">${esc(user.email || "-")}</span>
            </div>
          </div>
          ${settingsReadOnly(t("ชื่อผู้ใช้", "Username"), user.username)}
          ${settingsReadOnly(t("ชื่อ-นามสกุล", "Full Name"), user.name || "-")}
          ${settingsReadOnly(t("อีเมล", "Email"), user.email || "-")}
          ${settingsReadOnly(t("แผนก", "Department"), user.department || "-")}
          ${settingsReadOnly(t("บทบาท", "Role"), roleLabel)}
          <div style="margin-top:12px; display:flex; justify-content:flex-end">
            <button class="primary-btn" type="button" ${userIndex >= 0 ? `data-edit-profile="${userIndex}"` : "disabled"} style="padding:6px 12px; font-size:12px; display:inline-flex; align-items:center; gap:6px">
              ${icon("edit")} ${t("แก้ไขข้อมูลโปรไฟล์", "Edit Profile")}
            </button>
          </div>
        </div>
      `)}
      ${settingsOverviewCard("monitor", t("การแสดงผลและความปลอดภัย", "Display & Security"), `
        <div class="settings-combined-stack">
          <section>
            <div class="settings-section-label">${icon("monitor")}<span>${t("การแสดงผล", "Display")}</span></div>
            <div class="settings-form-stack">
              ${settingsValueSwitch(t("ภาษา", "Language"), "lang", languageValue, "th", "en", t("ไทย", "Thai"), t("อังกฤษ", "English"))}
              ${settingsValueSwitch(t("ธีม", "Theme"), "theme", state.settings.theme || "Light", "Light", "Dark", t("สว่าง", "Light"), t("มืด", "Dark"))}
            </div>
          </section>
          <section class="settings-combined-section">
            <div class="settings-section-label">${icon("shield")}<span>${t("ความปลอดภัย", "Security")}</span></div>
            <div class="settings-list compact">
              ${settingsActionRow(t("เปลี่ยนรหัสผ่าน", "Change Password"), "", `<button class="ghost-btn settings-row-btn" type="button" ${userIndex >= 0 ? `data-reset-user-pw="${userIndex}"` : "disabled"}>${icon("edit")} ${t("เปลี่ยนรหัสผ่าน", "Change Password")}</button>`)}
              ${settingsActionRow(t("ออกจากระบบ", "Sign Out"), "", `<button class="primary-btn settings-row-btn" type="button" data-logout>${icon("logout")} ${t("ออกจากระบบ", "Sign Out")}</button>`)}
            </div>
          </section>
        </div>
      `, "settings-display-security-card")}
    </div>
  </div>`;
}

function renderSettingsBody() {
  if (state.settingsTab === "general") {
    return renderGeneralSettingsOverview();
  }
  if (state.settingsTab === "login") {
    if (state.user.role !== "admin") return `<div class="permission-note">${t("User ไม่มีสิทธิ์ดูประวัติการเข้าสู่ระบบ", "User is not authorized to view login history")}</div>`;

    const statusVal = state.loginFilterStatus || "all";
    let filteredRows = (DATA.loginHistory || [])
      .slice()
      .sort((a, b) => String(b.time || "").localeCompare(String(a.time || "")));

    if (statusVal !== "all") {
      filteredRows = filteredRows.filter(row => row.status === statusVal);
    }

    const pageKey = "login-history";
    const page = paged(filteredRows, pageKey);

    const toolbarHtml = `
      <div class="toolbar" style="display:flex; gap:12px; align-items:flex-end; margin-bottom:16px; flex-wrap:wrap">
        <div style="display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap">
          <div class="field compact" style="margin:0">
            <label>${t("สถานะ", "Status")}</label>
            <select class="select" data-login-filter-status style="min-width:130px; height:38px">
              <option value="all" ${statusVal === "all" ? "selected" : ""}>${t("ทั้งหมด", "All")} (${(DATA.loginHistory || []).length})</option>
              <option value="สำเร็จ" ${statusVal === "สำเร็จ" ? "selected" : ""}>${t("สำเร็จ", "Success")}</option>
              <option value="ไม่สำเร็จ" ${statusVal === "ไม่สำเร็จ" ? "selected" : ""}>${t("ไม่สำเร็จ", "Failed")}</option>
            </select>
          </div>
          <div class="field compact" style="margin:0">
            <label>${t("แสดง", "Show")}</label>
            ${renderPageSizeSelector(pageKey)}
          </div>
        </div>
      </div>`;

    const tableHtml = page.items.length > 0
      ? tableFromRows(
        [t("ผู้ใช้งาน", "User"), "Role", t("เวลา", "Time"), "IP", t("สถานะ", "Status")],
        page.items.map(row => [
          esc(row.name),
          esc(row.role),
          esc(row.time),
          esc(row.ip),
          `<span class="status-pill ${row.status === "สำเร็จ" ? "status-ok" : "status-danger"}">${esc(row.status)}</span>`,
        ])
      )
      : `<div class="empty-state" style="padding:32px; text-align:center; opacity:0.5">${t("ไม่พบประวัติการเข้าสู่ระบบ", "No login history found")}</div>`;

    return `<h3>${t("ประวัติการเข้าสู่ระบบ", "Login History")} <span style="font-size:14px; font-weight:400; opacity:0.6">${t(`(ทั้งหมด ${filteredRows.length} รายการ)`, `(${filteredRows.length} records)`)}</span></h3>
      ${toolbarHtml}
      ${tableHtml}
      ${renderPagination(filteredRows.length, pageKey)}`;
  }
  if (state.settingsTab === "audit") {
    if (state.user.role !== "admin") return `<div class="permission-note">${t("User ไม่มีสิทธิ์ดูประวัติการแก้ไขข้อมูล", "User is not authorized to view audit logs")}</div>`;

    const actionFilter = state.auditFilterAction || "all";
    const searchFilter = (state.auditFilterSearch || "").toLowerCase();

    let logs = (DATA.auditLogs || [])
      .slice()
      .sort((a, b) => String(b.time || "").localeCompare(String(a.time || "")));

    if (actionFilter !== "all") {
      logs = logs.filter(row => row.action === actionFilter);
    }

    if (searchFilter) {
      logs = logs.filter(row =>
        String(row.username || "").toLowerCase().includes(searchFilter) ||
        String(row.name || "").toLowerCase().includes(searchFilter) ||
        String(row.target || "").toLowerCase().includes(searchFilter) ||
        String(row.desc || "").toLowerCase().includes(searchFilter)
      );
    }

    const pageKey = "audit-logs";
    const page = paged(logs, pageKey);

    const toolbarHtml = `
      <div class="toolbar" style="display:flex; gap:12px; align-items:flex-end; margin-bottom:16px; flex-wrap:wrap">
        <div class="search-box" style="margin:0; flex:1; min-width:220px; height:38px">${icon("search")}<input class="input" data-audit-search value="${esc(state.auditFilterSearch || "")}" placeholder="${t("ค้นหาผู้ใช้, การดำเนินการ, รายละเอียด...", "Search user, action, detail...")}" style="height:38px"></div>
        <div style="display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap">
          <div class="field compact" style="margin:0">
            <label>${t("การดำเนินการ", "Action")}</label>
            <select class="select" data-audit-filter-action style="min-width:130px; height:38px">
              <option value="all" ${actionFilter === "all" ? "selected" : ""}>${t("ทั้งหมด", "All")} (${(DATA.auditLogs || []).length})</option>
              <option value="เพิ่ม" ${actionFilter === "เพิ่ม" ? "selected" : ""}>${t("เพิ่ม", "Add")}</option>
              <option value="แก้ไข" ${actionFilter === "แก้ไข" ? "selected" : ""}>${t("แก้ไข", "Edit")}</option>
              <option value="ลบ" ${actionFilter === "ลบ" ? "selected" : ""}>${t("ลบ", "Delete")}</option>
            </select>
          </div>
          <div class="field compact" style="margin:0">
            <label>${t("แสดง", "Show")}</label>
            ${renderPageSizeSelector(pageKey)}
          </div>
          <button class="ghost-btn reset-filter-btn" type="button" data-clear-audit-logs style="color:#ff3045; height:38px; min-height:38px; display:inline-flex; align-items:center; gap:6px; margin:0">${icon("trash-2")} ${t("ล้างประวัติ", "Clear Logs")}</button>
        </div>
      </div>`;

    const actionBadge = (act) => {
      if (act === "ลบ") return `<span class="status-pill status-danger">${icon("trash-2")} ลบ</span>`;
      if (act === "แก้ไข") return `<span class="status-pill status-warning" style="background:#fff3cd; color:#856404">${icon("edit")} แก้ไข</span>`;
      return `<span class="status-pill status-ok">${icon("plus")} เพิ่ม</span>`;
    };

    const tableHtml = page.items.length > 0
      ? tableFromRows(
        [t("เวลา", "Time"), t("ผู้ใช้งาน (Username)", "Username"), t("การดำเนินการ", "Action"), t("หมวดหมู่", "Target"), t("รายละเอียด", "Description")],
        page.items.map(row => [
          esc(row.time),
          `<strong>${esc(row.username || row.name)}</strong> <small style="opacity:0.6">(${esc(row.name)})</small>`,
          actionBadge(row.action),
          `<span class="status-pill status-muted">${esc(row.target)}</span>`,
          esc(row.desc)
        ])
      )
      : `<div class="empty-state" style="padding:32px; text-align:center; opacity:0.5">${t("ไม่พบประวัติการแก้ไข/ลบข้อมูล", "No audit log history found")}</div>`;

    return `<h3>${t("ประวัติการแก้ไขและลบข้อมูล (Audit Logs)", "Audit Logs")} <span style="font-size:14px; font-weight:400; opacity:0.6">${t(`(ทั้งหมด ${logs.length} รายการ)`, `(${logs.length} records)`)}</span></h3>
      ${toolbarHtml}
      ${tableHtml}
      ${renderPagination(logs.length, pageKey)}`;
  }
  if (state.settingsTab === "notifications") {
    return `<h3>${t("การแจ้งเตือน", "Notifications")}</h3><p class="subtext">${t("ตั้งค่าการแจ้งเตือนต่างๆ ของระบบ", "Configure system notifications and warnings")}</p>
      <div class="settings-list">
        <label class="setting-row"><span><strong>${t("แจ้งเตือนบำรุงรักษา", "Maintenance Warnings")}</strong><small>${t("แจ้งเตือนเมื่อถึงกำหนดบำรุงรักษาตามรอบ", "Notify when scheduled maintenance is due")}</small></span><span class="switch"><input type="checkbox" data-setting="maintenanceAlerts" ${checkedAttr(settingChecked("maintenanceAlerts", true))}><i></i></span></label>
        <label class="setting-row"><span><strong>${t("แจ้งเตือนประกัน", "Warranty Warnings")}</strong><small>${t("แจ้งเตือนเมื่อใกล้หมดประกัน", "Notify when warranty expiration date is near")}</small></span><span class="switch"><input type="checkbox" data-setting="warrantyAlerts" ${checkedAttr(settingChecked("warrantyAlerts", true))}><i></i></span></label>
        <div class="field compact"><label>${t("แจ้งเตือนล่วงหน้า (วัน)", "Warranty Alert Window (Days)")}</label><input class="input" data-setting="warrantyDays" value="${esc(state.settings.warrantyDays || 7)}"></div>
        <div class="field compact"><label>${t("แจ้งเตือนคืนอุปกรณ์ล่วงหน้า (วัน)", "Return Alert Window (Days)")}</label><input class="input" data-setting="returnDays" value="${esc(state.settings.returnDays || 3)}"></div>
      </div>`;
  }
  if (state.settingsTab === "users") {
    if (state.user.role !== "admin") return `<div class="permission-note">${t("User ไม่มีสิทธิ์เข้าถึงหน้านี้", "User is not authorized to access this page")}</div>`;
    const userRows = registeredUsers();
    return `<h3>${t("ระบบจัดการผู้ใช้", "User Management")}</h3>
      <p class="subtext">${t("จัดการสิทธิ์และบัญชีผู้เข้าใช้งานระบบ", "Manage user accounts and access control roles")}</p>
      <div style="margin: 14px 0; display:flex; justify-content:flex-end">
        <button class="primary-btn" data-open-user-form>${icon("plus")} ${t("เพิ่มผู้ใช้ใหม่", "Add New User")}</button>
      </div>
      ${tableFromRows([t("ชื่อผู้ใช้", "Username"), t("เมลบริษัท", "Email"), t("แผนก", "Department"), t("บทบาท", "Role"), t("สถานะ", "Status"), t("จัดการ", "Actions")], userRows.map((user, idx) => [
      `<div style="display:flex; align-items:center; gap:10px"><span class="avatar-small" style="width:32px; height:32px; border-radius:50%; background:#f0f0f4; border:1px solid var(--line); display:grid; place-items:center; overflow:hidden; flex-shrink:0">${user.avatar ? `<img src="${esc(user.avatar)}" style="width:100%; height:100%; object-fit:cover">` : `<span style="font-size:14px; color:var(--brand)">${icon("user")}</span>`}</span><div><strong>${esc(user.username)}</strong><small style="display:block; opacity:0.6; font-size:11px">${esc(user.name || "")}</small></div></div>`,
      esc(user.email || "-"),
      esc(user.department || "-"),
      `<span class="status-pill ${user.role === "admin" ? "status-active" : "status-muted"}">${esc(user.role.toUpperCase())}</span>`,
      `<button class="chip-btn ${user.active !== false ? "status-ok" : "status-danger"}" data-toggle-user-active="${idx}" style="min-height:28px; padding:2px 8px">${user.active !== false ? t("เปิดใช้งาน", "Active") : t("ระงับใช้งาน", "Disabled")}</button>`,
      `<div class="action-wrap"><button class="more-btn" data-action-menu="user-${idx}" title="${t("เมนูรายการ", "Actions")}" aria-label="${t("เมนูรายการ", "Actions")}">${icon("more")}</button></div>`
    ]))}`;
  }
  if (state.settingsTab === "data") {
    if (state.user.role !== "admin") return `<div class="permission-note">${t("User ไม่มีสิทธิ์เข้าถึงหน้านี้", "User is not authorized to access this page")}</div>`;
    const dbSource = DATABASE_API_ENABLED ? (typeof SUPABASE_ENABLED !== "undefined" && SUPABASE_ENABLED ? "Supabase Cloud" : "Local NodeJS Server") : "Local Browser Storage (LocalStorage)";
    const connectionHtml = `
      <div class="info-card" style="margin-top:18px">
        <div class="info-row"><span>${t("โหมดการทำงาน", "System Mode")}</span><strong>${DATABASE_API_ENABLED ? t("เซิร์ฟเวอร์ (API)", "Server API Connected") : t("เครื่องเดี่ยว (Standalone)", "Local Standalone")}</strong></div>
        <div class="info-row"><span>${t("แหล่งข้อมูลหลัก", "Data Source")}</span><strong>${dbSource}</strong></div>
        <div class="info-row"><span>${t("ที่อยู่ฐานข้อมูล", "Database Endpoint")}</span><strong style="word-break:break-all">${DATABASE_API_ENABLED ? "/api/database" : "localStorage"}</strong></div>
        <div class="info-row"><span>${t("สถานะการเชื่อมต่อ", "Connection Status")}</span>
          <strong id="supabase-health-status" style="color:var(--orange)">${t("รอการตรวจสอบ...", "Pending check...")}</strong>
        </div>
      </div>
      <div style="margin-top:12px; display:flex; gap:10px">
        <button class="ghost-btn" data-test-connection>${t("ตรวจสอบการเชื่อมต่อ", "Test Connection")}</button>
      </div>`;
    return `<h3>${t("ระบบและข้อมูลหลัก", "Data & System Controls")}</h3>
      <p class="subtext">${t("สำรองข้อมูล กู้คืนระบบ และเช็คสถานะการเชื่อมต่อคลาวด์", "Backup/Restore database and check Cloud connection health")}</p>
      <div class="form-section" style="margin-top:20px; padding: 18px">
        <h3>${t("สำรองและกู้คืนข้อมูล (Backup & Restore)", "Backup & Restore")}</h3>
        <p class="subtext">${t("สำรองข้อมูลทรัพย์สิน ประวัติการซ่อมบำรุง และบัญชีผู้ใช้ทั้งหมดเป็นไฟล์ JSON", "Download or restore the entire asset database as a JSON backup file")}</p>
        <div style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap">
          <button class="primary-btn" data-backup-db>${icon("save")} ${t("สำรองข้อมูล (Export JSON)", "Export Database")}</button>
          <label class="ghost-btn" style="display:inline-flex; align-items:center; gap:8px; cursor:pointer">
            ${icon("plus")} ${t("กู้คืนข้อมูล (Import JSON)", "Import Database")}
            <input type="file" id="restore-db-file" accept=".json" style="display:none">
          </label>
        </div>
      </div>
      <div class="form-section" style="margin-top:20px; padding: 18px">
        <h3>${t("การเชื่อมต่อฐานข้อมูล", "Database Connection")}</h3>
        <p class="subtext">${t("รายละเอียดที่อยู่และสถานะการเชื่อมต่อ Cloud Supabase", "Details and status of the Cloud Supabase data service")}</p>
        ${connectionHtml}
      </div>`;
  }
  return renderGeneralSettingsOverview();
}
