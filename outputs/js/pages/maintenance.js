// ============================================================
// pages/maintenance.js — Maintenance history & request pages
// ============================================================

function renderMaintenanceDetail() {
  syncMaintenanceHistoryFromRequests();
  const counts = countBy(DATA.maintenanceHistory, "status");
  const filtered = sortByAlpha(filterCollection(DATA.maintenanceHistory, "maintenance-detail"), row => row.title || row.asset || row.type);
  const pageKey = "maintenance-detail";
  const page = paged(filtered, pageKey);
  return `${renderMiniCards([
    { label: t("รอดำเนินการ", "Pending"), value: counts["รอดำเนินการ"] || 0, icon: "clock" },
    { label: t("กำลังดำเนินการ", "In Progress"), value: counts["กำลังดำเนินการ"] || 0, icon: "wrench", cls: "blue" },
    { label: t("เสร็จสิ้น", "Completed"), value: counts["เสร็จสิ้น"] || 0, icon: "check", cls: "green" },
  ], "three")}
  <section class="panel page-panel">
    ${pageHeading("clock", t("ประวัติการบำรุงรักษา", "Maintenance History"), t("รายการบันทึกการบำรุงรักษาทั้งหมด", "All maintenance records"))}
    ${simpleToolbar("maintenance-detail", uniqueOptions(DATA.maintenanceHistory, "type"), uniqueOptions(DATA.maintenanceHistory, "status"))}
    ${tableFromRows([t("รายการ ↑", "Item ↑"), t("ทรัพย์สิน", "Asset"), t("ประเภท", "Type"), t("วันที่", "Date"), t("ค่าใช้จ่าย", "Cost"), t("สถานะ", "Status"), ""], page.items.map(row => [
      `<strong>${esc(row.title)}</strong>`,
      esc(row.asset),
      `${icon(row.type.includes("ฉุก") ? "alert" : "wrench")} ${esc(row.type)}`,
      esc(row.date),
      esc(row.cost),
      `<span class="status-pill ${statusClass(row.status)}">${esc(row.status)}</span>`,
      maintenanceHistoryActions(row),
    ]))}
    ${renderPagination(filtered.length, pageKey)}
  </section>`;
}
function maintenanceHistoryActions(row) {
  const index = DATA.maintenanceHistory.indexOf(row);
  const inProgress = normalize(row?.status).includes("กำลังดำเนินการ");
  const completeButton = inProgress
    ? `<button type="button" class="maintenance-complete-btn" data-complete-maintenance-history="${index}">${icon("check")} ${t("ยืนยัน", "Confirm")}</button>`
    : "";
  return `<div class="maintenance-row-actions">${completeButton}${moreButton("maintenanceHistory", index)}</div>`;
}
function maintenanceRequestActions(row) {
  const index = DATA.maintenanceRequests.indexOf(row);
  const pending = normalize(row?.status).includes("รออนุมัติ");
  const decisionButtons = pending
    ? `<button type="button" class="maintenance-approve-btn" data-approve-maintenance-request="${index}">${icon("check")} ${t("ยืนยัน", "Confirm")}</button>
       <button type="button" class="maintenance-reject-btn" data-reject-maintenance-request="${index}">${icon("x")} ${t("ปฏิเสธ", "Reject")}</button>`
    : "";
  return `<div class="maintenance-row-actions">${decisionButtons}${moreButton("maintenanceRequests", index)}</div>`;
}
function renderMaintenanceRequest() {
  syncMaintenanceHistoryFromRequests();
  const counts = countBy(DATA.maintenanceRequests, "status");
  const filtered = sortByAlpha(filterCollection(DATA.maintenanceRequests, "maintenance-request"), row => row.title || row.asset || row.requester);
  const pageKey = "maintenance-request";
  const page = paged(filtered, pageKey);
  const cards = [
    { label: t("รออนุมัติ", "Pending Approval"), value: counts["รออนุมัติ"] || 0, icon: "clock" },
    { label: t("อนุมัติแล้ว", "Approved"), value: counts["อนุมัติแล้ว"] || 0, icon: "check" },
    { label: t("ปฏิเสธ", "Rejected"), value: counts["ปฏิเสธ"] || 0, icon: "x", cls: "red" },
  ];
  return `${renderMiniCards(cards, "three")}
  <section class="panel page-panel">
    ${pageHeading("edit", t("คำขอซ่อม", "Maintenance Requests"), t("คำขอซ่อมและบำรุงรักษาทรัพย์สิน", "Asset repair and maintenance requests"), `<button class="primary-btn" data-open-request>${icon("plus")} ${t("แจ้งซ่อมใหม่", "New Request")}</button>`)}
    ${simpleToolbar("maintenance-request", uniqueOptions(DATA.maintenanceRequests, "type"), uniqueOptions(DATA.maintenanceRequests, "status"))}
    ${tableFromRows([t("หัวข้อ ↑", "Title ↑"), t("แบรนด์", "Brand"), t("ประเภท", "Type"), t("ผู้แจ้ง", "Requester"), t("วันที่แจ้ง", "Request Date"), t("ความเร่งด่วน", "Priority"), t("สถานะ", "Status"), ""], page.items.map(row => [
      `<strong>${esc(row.title)}</strong><span class="row-sub">${esc(row.desc)}</span>`,
      esc(row.brand),
      esc(row.type),
      esc(row.requester),
      esc(row.date),
      `<span class="priority-pill ${row.priority === "สูง" || row.priority === "เร่งด่วน" ? "status-active" : "status-muted"}">${esc(row.priority)}</span>`,
      `<span class="status-pill ${statusClass(row.status)}">${icon(row.status.includes("รอ") ? "clock" : row.status.includes("กำลัง") ? "alert" : "check")} ${esc(row.status)}</span>`,
      maintenanceRequestActions(row),
    ]))}
    ${renderPagination(filtered.length, pageKey)}
  </section>`;
}
