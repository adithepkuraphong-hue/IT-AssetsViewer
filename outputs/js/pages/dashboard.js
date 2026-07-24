// ============================================================
// pages/dashboard.js — Dashboard page
// ============================================================

function isBlankValue(value) {
  const text = normalize(value);
  return !text || text === "-" || text === "n/a" || text === "null" || text === "undefined";
}

function countMatching(items, predicate) {
  return items.reduce((total, item) => total + (predicate(item) ? 1 : 0), 0);
}

function normalizeOs(value) {
  const text = normalize(value).replace(/\s+/g, " ");
  if (text.includes("windows 11 pro")) return "Windows 11 Pro";
  if (text.includes("windows 11 home")) return "Windows 11 Home";
  if (text.includes("mac os") || text.includes("macos")) return "Mac OS";
  return "อื่น ๆ / ไม่ระบุ";
}

function buildInsightRows(labels, items, key) {
  return labels.map(label => ({
    label,
    value: countMatching(items, item => normalize(item[key]) === normalize(label)),
  }));
}

function renderInsightRows(rows, total) {
  return rows.map(row => {
    const ratio = percent(row.value, total);
    const tooltip = `${ratio}%`;
    return `<div class="insight-row" title="${esc(tooltip)}" aria-label="${esc(tooltip)}">
      <div class="insight-row-top">
        <span class="insight-label">${esc(row.label)}</span>
        <span class="insight-value">${row.value}</span>
      </div>
      <div class="insight-bar" style="--bar-width:${ratio}%" title="${esc(tooltip)}"><span></span></div>
    </div>`;
  }).join("");
}

function renderInsightPanel(title, subtitle, rows, total, tone, note = "") {
  return `<article class="panel insight-panel ${tone}">
    <div class="insight-head">
      <div><h3>${title}</h3><p>${subtitle}</p></div>
      <span class="insight-total">${total} รายการ</span>
    </div>
    <div class="insight-list">${renderInsightRows(rows, total)}</div>
    ${note ? `<p class="insight-note">${note}</p>` : ""}
  </article>`;
}

function renderDashboard() {
  const s = stats();
  const assets = allAssets();
  const typeRows = buildInsightRows(["Notebook", "Macbook", "Tablet", "Monitor", "Access Point", "Keyboard", "Adapter", "CCTV"], assets, "type");
  const companyRows = buildInsightRows(["KOCH", "TNB", "SPD"], assets, "company");

  const osLabels = ["Windows 11 Pro", "Windows 11 Home", "Mac OS"];
  const osRows = osLabels.map(label => ({
    label,
    value: countMatching(DATA.computerAssets, item => normalizeOs(item.windowsVersion) === label),
  }));
  const osOther = countMatching(DATA.computerAssets, item => normalizeOs(item.windowsVersion) === "อื่น ๆ / ไม่ระบุ");
  const computerDegValue = s.total ? (s.computer / s.total * 360) : 0;
  const deg = `${computerDegValue.toFixed(2)}deg`;
  const openRequests = DATA.maintenanceRequests.filter(item => item.status !== "เสร็จสิ้น").length;
  const activeCheckout = DATA.checkoutRecords.filter(item => item.status === "กำลังขอใช้งาน").length;
  return `<div class="page-title-row dashboard-title-row"><div><h1>Dashboard</h1><p class="subtext">ภาพรวมระบบจัดการทรัพย์สิน</p></div><span class="summary-badge">${icon("database")} รวม ${s.total} รายการ (Computer: ${s.computer}, Other: ${s.other})</span></div>
  <section class="kpi-grid">
    ${kpi("ทรัพย์สินทั้งหมด", s.total, "database")}
    ${kpi("ใช้งานอยู่", s.inUse, "check", "green")}
    ${kpi("พร้อมใช้งาน", s.available, "monitor", "amber")}
    ${kpi("ชำรุด/เสีย", s.broken, "alert", "red")}
  </section>
  <section class="dashboard-grid">
    <div class="panel chart-panel">
      <h3>สัดส่วนทรัพย์สินตามประเภท</h3>
      <div class="donut-wrap">
        <div class="donut" style="--computerDeg:${deg}" data-donut-chart data-computer-count="${s.computer}" data-other-count="${s.other}" data-computer-deg="${computerDegValue.toFixed(2)}" tabindex="0" aria-label="Asset type chart"><div class="donut-badge" data-donut-tooltip>Computer Assets <strong>${s.computer}</strong></div><div class="donut-center">${s.total}<span>รายการ</span></div></div>
        <div class="asset-legend">
          <div class="legend-card"><span class="legend-icon purple">${icon("monitor")}</span><div><strong>Computer Assets</strong><span>${s.computer} รายการ</span></div><span class="legend-percent">${percent(s.computer, s.total)}%</span></div>
          <div class="legend-card"><span class="legend-icon teal">${icon("box")}</span><div><strong>Other Assets</strong><span>${s.other} รายการ</span></div><span class="legend-percent" style="color:#15bfa8;background:#e6fbf7">${percent(s.other, s.total)}%</span></div>
        </div>
      </div>
    </div>
    <div class="side-metrics">
      <div class="panel metric-wide orange"><div class="metric-title"><span class="metric-icon">${icon("clipboard")}</span><span>คำขอซ่อมรอดำเนินการ</span></div><div><div class="big-number" style="color:var(--orange)">${openRequests}</div><span>รายการ</span></div></div>
      <div class="panel metric-wide purple"><div class="metric-title"><span class="metric-icon">${icon("clock")}</span><span>กำลังขอใช้งานอยู่</span></div><div><div class="big-number" style="color:var(--purple)">${activeCheckout}</div><span>รายการ</span></div></div>
    </div>
  </section>
  <section class="dashboard-insights">
    <div class="insight-col">
      ${renderInsightPanel("ทรัพย์สินตามประเภท", "นับเฉพาะประเภทหลักที่ใช้งานบ่อย", typeRows, assets.length, "type")}
    </div>
    <div class="insight-col">
      ${renderInsightPanel("ทรัพย์สินตามบริษัท", "แยกตามบริษัท KOCH / TNB / SPD", companyRows, assets.length, "company")}
      ${renderInsightPanel("Windows / OS Breakdown", "แยกตามระบบปฏิบัติการของ Computer Assets", osRows, DATA.computerAssets.length, "os", `อื่น ๆ / ไม่ระบุ: ${osOther} รายการ`)}
    </div>
  </section>`;
}
