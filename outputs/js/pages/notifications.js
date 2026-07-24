// ============================================================
// pages/notifications.js — Notifications and warranty alerts
// ============================================================

function renderNotifications() {
  const tab = state.notificationTab;
  const unread = DATA.notifications.filter(item => !item.read).length;
  const read = DATA.notifications.filter(item => item.read).length;
  const list = DATA.notifications.filter(item => tab === "all" ? true : tab === "unread" ? !item.read : item.read);
  const pageKey = `notifications-${tab}`;
  const page = paged(list, pageKey, NOTIFICATION_PAGE_SIZE);
  return `${pageHeading("bell", t("การแจ้งเตือน", "Notifications"), t(`มี ${unread} รายการที่ยังไม่ได้อ่าน`, `${unread} unread items`), `<button class="ghost-btn" data-mark-read>${icon("check")} ${t("ทำเครื่องหมายอ่านทั้งหมด", "Mark All as Read")}</button>`)}
    <div class="filter-row" style="margin-bottom:24px">
      <button class="chip-btn ${tab === "all" ? "status-active" : ""}" data-notification-tab="all">${t("ทั้งหมด", "All")} (${DATA.notifications.length})</button>
      <button class="chip-btn ${tab === "unread" ? "status-active" : ""}" data-notification-tab="unread">${t("ยังไม่อ่าน", "Unread")} (${unread})</button>
      <button class="chip-btn ${tab === "read" ? "status-active" : ""}" data-notification-tab="read">${t("อ่านแล้ว", "Read")} (${read})</button>
    </div>
    <section class="notification-list">
      ${page.items.map(item => `<article class="panel notification-card ${item.read ? "read" : ""}">
        <span class="notification-icon ${item.tone}">${icon(item.tone === "green" ? "check" : item.tone === "orange" ? "checkout" : "alert")}</span>
        <div><h3>${esc(item.title)} ${!item.read ? '<span class="dot"></span>' : ""}</h3><p class="subtext">${esc(item.body)}</p></div>
        <div style="text-align:right"><span class="status-pill status-muted">${esc(item.category)}</span><p class="subtext">${esc(item.date)}</p><button class="ghost-btn" data-read-notification="${DATA.notifications.indexOf(item)}">${item.read ? t("อ่านแล้ว", "Read") : t("ทำเครื่องหมายอ่าน", "Mark as Read")}</button></div>
      </article>`).join("")}
    </section>
    ${renderPagination(list.length, pageKey, NOTIFICATION_PAGE_SIZE)}`;
}
function renderWarrantyNotifications() {
  const tab = state.notificationTab;
  const notifications = systemNotifications();
  const unread = notifications.filter(item => !item.read).length;
  const read = notifications.filter(item => item.read).length;
  const list = notifications.filter(item => tab === "all" ? true : tab === "unread" ? !item.read : item.read);
  const pageKey = `notifications-${tab}`;
  const page = paged(list, pageKey, NOTIFICATION_PAGE_SIZE);
  return `${pageHeading("bell", t("การแจ้งเตือน", "Notifications"), t(`มี ${unread} รายการที่ยังไม่ได้อ่าน`, `${unread} unread items`), `<button class="ghost-btn" data-mark-read>${icon("check")} ${t("ทำเครื่องหมายอ่านทั้งหมด", "Mark All as Read")}</button>`)}
    <div class="filter-row" style="margin-bottom:24px">
      <button class="chip-btn ${tab === "all" ? "status-active" : ""}" data-notification-tab="all">${t("ทั้งหมด", "All")} (${notifications.length})</button>
      <button class="chip-btn ${tab === "unread" ? "status-active" : ""}" data-notification-tab="unread">${t("ยังไม่อ่าน", "Unread")} (${unread})</button>
      <button class="chip-btn ${tab === "read" ? "status-active" : ""}" data-notification-tab="read">${t("อ่านแล้ว", "Read")} (${read})</button>
    </div>
    <section class="notification-list">
      ${page.items.length ? "" : `<div class="permission-note">${t("ไม่มีการแจ้งเตือนตามการตั้งค่าปัจจุบัน", "No notifications based on current settings.")}</div>`}
      ${page.items.map(item => `<article class="panel notification-card ${item.read ? "read" : ""}">
        <span class="notification-icon ${item.tone}">${icon(item.tone === "orange" ? "clock" : "alert")}</span>
        <div><h3>${esc(item.title)} ${!item.read ? '<span class="dot"></span>' : ""}</h3><p class="subtext">${esc(item.body)}${Number.isFinite(item.remainingDays) ? ` · ${t(`เหลือ ${item.remainingDays} วัน`, `${item.remainingDays} days left`)}` : ""}</p></div>
        <div style="text-align:right"><span class="status-pill status-muted">${esc(item.category)}</span><p class="subtext">${esc(item.date)}</p><button class="ghost-btn" data-read-notification="${esc(item.key)}">${item.read ? t("อ่านแล้ว", "Read") : t("ทำเครื่องหมายอ่าน", "Mark as Read")}</button></div>
      </article>`).join("")}
    </section>
    ${renderPagination(list.length, pageKey, NOTIFICATION_PAGE_SIZE)}`;
}
