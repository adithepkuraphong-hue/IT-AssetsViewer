// ============================================================
// pages/checkout.js — Checkout/return page
// ============================================================

function renderCheckout() {
  const counts = countBy(DATA.checkoutRecords, "status");
  const filtered = sortByAlpha(filterCollection(DATA.checkoutRecords, "checkout", { type: "asset" }), row => row.asset || row.sub || row.requester);
  const pageKey = "checkout";
  const page = paged(filtered, pageKey);
  const headingActions = `<div class="page-actions">
    <button class="ghost-btn checkout-return-open-btn" data-open-checkout-return>${icon("checkout")} ${t("แจ้งคืนอุปกรณ์", "Return Item")}</button>
    <button class="primary-btn" data-open-checkout>${icon("plus")} ${t("ขอใช้งานอุปกรณ์", "Request Item")}</button>
  </div>`;
  return `${renderMiniCards([
    { label: t("กำลังขอใช้งาน", "Requested"), value: counts["กำลังขอใช้งาน"] || 0, icon: "clock", cls: "checkout-active" },
    { label: t("คืนแล้ว", "Returned"), value: counts["คืนแล้ว"] || 0, icon: "check", cls: "checkout-returned" },
    { label: t("เกินกำหนด", "Overdue"), value: counts["เกินกำหนด"] || 0, icon: "alert", cls: "checkout-overdue" },
  ], "three checkout-summary")}
  <section class="panel page-panel checkout-panel">
    ${pageHeading("checkout", t("Check Out & Return", "Check Out & Return"), t("การขอใช้งานอุปกรณ์/คืนอุปกรณ์", "Equipment checkout & return management"), headingActions)}
    ${simpleToolbar("checkout", uniqueOptions(DATA.checkoutRecords, "asset"), uniqueOptions(DATA.checkoutRecords, "status"))}
    ${tableFromRows([t("ทรัพย์สิน ↑", "Asset ↑"), t("ผู้ขอใช้งาน", "Requester"), t("วันที่ขอใช้", "Request Date"), t("วัตถุประสงค์", "Purpose"), t("สถานะ", "Status"), ""], page.items.map(row => [
      `<strong>${esc(row.asset)}</strong><span class="row-sub">${esc(row.sub)}</span>`,
      esc(row.requester),
      esc(row.date),
      esc(row.purpose),
      `<span class="status-pill ${statusClass(row.status)}">${esc(row.status)}</span>`,
      checkoutRowActions(row),
    ]))}
    ${renderPagination(filtered.length, pageKey)}
  </section>`;
}
function checkoutNeedsConfirm(row) {
  const status = normalize(row?.status);
  return row && row.assetConfirmed !== true && !status.includes("ยืนยันแล้ว") && !status.includes("คืนแล้ว");
}
function checkoutCanReturn(row) {
  const status = normalize(row?.status);
  return row && !status.includes("คืนแล้ว");
}
function checkoutNeedsReturnConfirm(row) {
  return normalize(row?.status).includes("คืนแล้ว");
}
function assetCanReturn(item) {
  return normalize(item?.status) === "ใช้งาน";
}
function checkoutRowActions(row) {
  const index = DATA.checkoutRecords.indexOf(row);
  const confirmButton = checkoutNeedsConfirm(row)
    ? `<button type="button" class="checkout-confirm-btn" data-confirm-checkout-record="${index}">${icon("check")} ${t("ยืนยัน", "Confirm")}</button>`
    : "";
  const returnButton = checkoutCanReturn(row)
    ? `<button type="button" class="checkout-return-btn" data-open-checkout-return="${index}">${icon("checkout")} ${t("แจ้งคืน", "Return")}</button>`
    : "";
  const returnConfirmButton = checkoutNeedsReturnConfirm(row)
    ? `<button type="button" class="checkout-return-confirm-btn" data-confirm-checkout-return="${index}">${icon("check")} ${t("ยืนยันการคืน", "Confirm Return")}</button>`
    : "";
  return `<div class="checkout-row-actions">${confirmButton}${returnButton}${returnConfirmButton}${moreButton("checkoutRecords", index)}</div>`;
}
