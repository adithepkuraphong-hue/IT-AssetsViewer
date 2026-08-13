// ============================================================
// modals/record-modal.js — Record detail/form modals and shared modal helpers
// ============================================================

function formModal(title, iconName, body, className = "") {
  return `<div class="modal-backdrop"><section class="modal ${className}"><div class="modal-head"><div class="modal-title"><span class="logo-mark">${icon(iconName)}</span>${title}</div><button class="modal-close" data-close-modal>${icon("x")}</button></div><div class="modal-body">${body}</div></section></div>`;
}
function renderLogoutConfirmModal() {
  return `<div class="modal-backdrop center-modal"><section class="modal small"><div class="modal-head"><div class="modal-title"><span class="logo-mark">${icon("alert")}</span>ยืนยันการออกจากระบบ</div><button class="modal-close" data-close-modal>${icon("x")}</button></div><div class="modal-body">
    <div class="info-card">
      <div class="info-title">ต้องการออกจากระบบหรือไม่?</div>
      <p class="subtext">หากยืนยัน ระบบจะกลับไปที่หน้าเข้าสู่ระบบ และต้องกรอก Username/Password ใหม่อีกครั้ง</p>
    </div>
    <div class="modal-footer">
      <button class="ghost-btn" data-close-modal>ยกเลิก</button>
      <button class="primary-btn" data-confirm-logout>${icon("logout")} ยืนยันออกจากระบบ</button>
    </div>
  </div></section></div>`;
}
function renderDeleteAllConfirmModal() {
  return `<div class="modal-backdrop center-modal"><section class="modal small"><div class="modal-head"><div class="modal-title"><span class="logo-mark">${icon("alert")}</span>${t("ยืนยันการลบข้อมูลทั้งหมด", "Confirm Delete All Data")}</div><button class="modal-close" data-close-modal>${icon("x")}</button></div><div class="modal-body">
    <div class="info-card">
      <div class="info-title">${t("ต้องการลบข้อมูลทั้งหมดหรือไม่?", "Do you want to delete all data?")}</div>
      <p class="subtext">${t("การลบนี้จะลบทรัพย์สิน ประวัติ รายการยืมคืน การแจ้งเตือน และ Master Data ทั้งหมด แต่จะคงบัญชีผู้ใช้และการตั้งค่าไว้", "This will delete all assets, records, checkout data, notifications, and master data, while keeping user accounts and settings.")}</p>
    </div>
    <div class="modal-footer">
      <button class="ghost-btn" data-close-modal>${t("ยกเลิก", "Cancel")}</button>
      <button class="primary-btn danger-btn" data-confirm-delete-all>${icon("trash")} ${t("ยืนยันลบข้อมูลทั้งหมด", "Confirm Delete All")}</button>
    </div>
  </div></section></div>`;
}
function renderDeleteConfirmModal(modal) {
  const label = modal.label ? `: ${esc(modal.label)}` : "";
  return `<div class="modal-backdrop center-modal"><section class="modal small"><div class="modal-head"><div class="modal-title"><span class="logo-mark">${icon("alert")}</span>${t("ยืนยันการลบ", "Confirm Delete")}</div><button class="modal-close" data-close-modal>${icon("x")}</button></div><div class="modal-body">
    <div class="info-card">
      <div class="info-title">${t("ต้องการลบข้อมูลนี้หรือไม่?", "Do you want to delete this item?")}</div>
      <p class="subtext">${t("ระบบจะลบข้อมูลนี้หลังจากกดยืนยันเท่านั้น", "The system will delete this item only after you confirm.")}${label}</p>
    </div>
    <div class="modal-footer">
      <button class="ghost-btn" data-close-modal>${t("ยกเลิก", "Cancel")}</button>
      <button class="primary-btn danger-btn" data-confirm-delete>${icon("trash")} ${t("ยืนยันลบ", "Confirm Delete")}</button>
    </div>
  </div></section></div>`;
}
function renderMaintenanceRequestForm(modal) {
  const group = modal.assetGroup || "computer";
  const body = `
    ${formSection("ข้อมูลคำขอ", "", `<div class="form-grid two"><div class="field"><label>หัวข้อ <span class="required">*</span></label><input class="input" data-request-field="title" placeholder="หัวข้อคำขอซ่อม"></div><div class="field"><label>วันที่แจ้ง</label><input type="date" class="input" data-request-field="date" value="${today()}"></div></div>`)}
    ${formSection("ทรัพย์สิน", "", `<div class="segmented"><button class="${group === "computer" ? "active" : ""}" data-modal-asset-group="computer">Assets Computer (${DATA.computerAssets.length})</button><button class="${group === "other" ? "active" : ""}" data-modal-asset-group="other">Assets Other (${DATA.otherAssets.length})</button></div><div class="field compact"><label>ทรัพย์สิน <span class="required">*</span></label><select class="select" data-request-field="asset">${selectedAssetOptions(group)}</select></div>`)}
    ${formSection("ผู้แจ้ง", "", `<div class="form-grid two"><div class="field"><label>ผู้แจ้ง <span class="required">*</span></label><input class="input" data-request-field="requester" value="${esc(state.user.name)}" placeholder="กรอกชื่อผู้แจ้ง"></div><div class="field"><label>แผนกผู้แจ้ง</label><select class="select" data-request-field="requesterDepartment">${optionList((DATA.master.departments || []).map(row => row.name || row.code), state.user.department || "", "-- ไม่ระบุ --")}</select></div></div>`)}
    ${formSection("รายละเอียดปัญหา", "", `<textarea class="textarea large" data-request-field="desc" placeholder="อธิบายปัญหาที่พบ..."></textarea>`)}
    ${formSection("ความเร่งด่วนและราคาซ่อม", "", `<div class="form-grid two"><div class="field"><label>ความเร่งด่วน</label><select class="select" data-request-field="priority">${optionList(["ปานกลาง", "สูง", "เร่งด่วน"], "ปานกลาง")}</select></div><div class="field"><label>ราคาซ่อม (บาท)</label><input type="number" min="0" step="0.01" class="input" data-request-field="cost" placeholder="0.00"></div></div>`)}
    ${modalFooter("สร้างคำขอ", "data-submit-request")}
  `;
  return formModal("แจ้งซ่อมใหม่", "plus", body, "large form-modal");
}
function renderCheckoutFormModal(modal) {
  const group = modal.assetGroup || "computer";
  const source = listForGroup(group);
  const availableForGroup = assetGroup => listForGroup(assetGroup).filter(item => {
    if (assetGroup === "computer") return isAvailableComputer(item);
    const status = normalize(item.status);
    return status.includes("ไม่ได้") || status.includes("ว่าง") || status === "unknown" || status === "ไม่ระบุ";
  });
  const availableByGroup = {
    computer: availableForGroup("computer"),
    other: availableForGroup("other"),
  };
  const available = availableByGroup[group];
  let visible = sortByAlpha(available.length ? available : source, "assetCode").slice(0, 80);
  if (modal.selectedAssetCode) {
    const newlyAddedItem = source.find(item => item.assetCode === modal.selectedAssetCode);
    if (newlyAddedItem && !visible.includes(newlyAddedItem)) {
      visible.unshift(newlyAddedItem);
    }
  }

  const pending = state.pendingCheckout || {};
  const requesterVal = pending.requester !== undefined ? pending.requester : state.user.name;
  const deptVal = pending.department !== undefined ? pending.department : "";
  const dateVal = pending.date !== undefined ? pending.date : today();
  const returnVal = pending.expectedReturn !== undefined ? pending.expectedReturn : "";
  const purposeVal = pending.purpose !== undefined ? pending.purpose : "";

  const body = `
    ${formSection("ข้อมูลทรัพย์สิน", "", `<div class="segmented"><button class="${group === "computer" ? "active" : ""}" data-modal-asset-group="computer">Assets Computer (${availableByGroup.computer.length})</button><button class="${group === "other" ? "active" : ""}" data-modal-asset-group="other">Assets Other (${availableByGroup.other.length})</button></div><div class="field"><label>ทรัพย์สิน <span class="required">*</span></label><div style="display: flex; gap: 8px;"><select class="select" data-checkout-field="asset" style="flex: 1;">${visible.map(item => {
      const val = assetRef(group, source.indexOf(item));
      const sel = (modal.selectedAssetCode && item.assetCode === modal.selectedAssetCode) ? "selected" : "";
      return `<option value="${esc(val)}" ${sel}>${esc(item.assetCode)} - ${esc(item.brand || "-")} ${esc(item.model || item.type || "")}</option>`;
    }).join("")}</select><button type="button" class="primary-btn" data-checkout-add-asset style="flex: 0 0 auto; height: 38px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; background-color: var(--brand); color: #fff; border: 0; border-radius: 6px; padding: 0 12px; gap: 6px;">${icon("plus")} เพิ่มข้อมูลใหม่</button></div><small>แสดงเฉพาะทรัพย์สินที่พร้อมใช้งาน หรือรายการล่าสุดหากไม่มีสถานะว่าง</small></div>`)}
    ${formSection("ข้อมูลผู้ขอใช้งาน", "", `<div class="form-grid two"><div class="field"><label>ผู้ขอใช้งาน <span class="required">*</span></label><input class="input" data-checkout-field="requester" value="${esc(requesterVal)}" placeholder="กรอกชื่อผู้ขอใช้งาน"></div><div class="field"><label>แผนก <span class="required">*</span></label><select class="select" data-checkout-field="department">${optionList((DATA.master.departments || []).map(row => row.name || row.code), deptVal, "เลือกแผนก")}</select></div></div>`)}
    ${formSection("วันที่สำคัญ", "", `<div class="form-grid two"><div class="field"><label>วันที่ขอใช้ <span class="required">*</span></label><input type="date" class="input" data-checkout-field="date" value="${esc(dateVal)}"></div><div class="field"><label>วันที่คาดว่าจะคืน <span class="required">*</span></label><input type="date" class="input" data-checkout-field="expectedReturn" value="${esc(returnVal)}"></div></div>`)}
    ${formSection("วัตถุประสงค์/หมายเหตุ", "", `<textarea class="textarea large" data-checkout-field="purpose" placeholder="วัตถุประสงค์หรือหมายเหตุเพิ่มเติม...">${esc(purposeVal)}</textarea>`)}
    ${modalFooter("บันทึก", "data-checkout-presave")}
  `;
  return formModal("ขอใช้งานอุปกรณ์ใหม่", "plus", body, "large form-modal");
}
function renderRecordFormModal(collection, index) {
  const item = recordSource(collection)[index] || {};
  if (collection === "maintenanceHistory") {
    return formModal("แก้ไขรายการบำรุงรักษา", "edit", `
      ${formSection("ข้อมูลทั่วไป", "", `<div class="form-grid two"><div class="field"><label>รายการ</label><input class="input" data-record-field="title" value="${esc(item.title || "")}"></div><div class="field"><label>ประเภท</label><select class="select" data-record-field="type">${optionList(["ฉุกเฉิน", "ซ่อมแก้ไข", "บำรุงรักษาตามรอบ"], item.type || "")}</select></div></div>`)}
      ${formSection("รายละเอียด", "", `<textarea class="textarea large" data-record-field="desc">${esc(item.desc || "")}</textarea>`)}
      ${formSection("วันที่สำคัญ", "", `<div class="form-grid two"><div class="field"><label>วันที่บำรุงรักษา</label><input type="date" class="input" data-record-field="date" value="${esc(toDateInputValue(item.date))}"></div><div class="field"><label>วันที่เสร็จสิ้น</label><input type="date" class="input" data-record-field="completedDate" value="${esc(toDateInputValue(item.completedDate))}"></div></div>`)}
      ${formSection("ค่าใช้จ่ายและสถานะ", "", `<div class="form-grid two"><div class="field"><label>ค่าใช้จ่าย (บาท)</label><input class="input" data-record-field="cost" value="${esc(String(item.cost || "").replace(/[^\d.]/g, ""))}"></div><div class="field"><label>สถานะ</label><select class="select" data-record-field="status">${optionList(["รอดำเนินการ", "กำลังดำเนินการ", "เสร็จสิ้น"], item.status || "")}</select></div></div>`)}
      ${modalFooter("บันทึก", `data-submit-record="${collection}" data-index="${index}"`)}
    `, "large form-modal");
  }
  if (collection === "maintenanceRequests") {
    return formModal("แก้ไขคำขอซ่อม", "edit", `
      ${formSection("ข้อมูลคำขอ", "", `<div class="form-grid two"><div class="field"><label>หัวข้อ <span class="required">*</span></label><input class="input" data-record-field="title" value="${esc(item.title || "")}"></div><div class="field"><label>วันที่แจ้ง</label><input type="date" class="input" data-record-field="date" value="${esc(toDateInputValue(item.date))}"></div></div>`)}
      ${formSection("ผู้แจ้ง", "", `<div class="form-grid two"><div class="field"><label>ผู้แจ้ง <span class="required">*</span></label><input class="input" data-record-field="requester" value="${esc(item.requester || "")}"></div><div class="field"><label>แผนกผู้แจ้ง</label><select class="select" data-record-field="requesterDepartment">${optionList((DATA.master.departments || []).map(row => row.name || row.code), item.requesterDepartment || "")}</select></div></div>`)}
      ${formSection("รายละเอียดปัญหา", "", `<textarea class="textarea large" data-record-field="desc">${esc(item.desc || "")}</textarea>`)}
      ${formSection("ความเร่งด่วน สถานะ และราคาซ่อม", "", `<div class="form-grid three"><div class="field"><label>ความเร่งด่วน</label><select class="select" data-record-field="priority">${optionList(["ปานกลาง", "สูง", "เร่งด่วน"], item.priority || "")}</select></div><div class="field"><label>สถานะ</label><select class="select" data-record-field="status">${optionList(["รออนุมัติ", "อนุมัติแล้ว", "กำลังดำเนินการ", "เสร็จสิ้น", "ปฏิเสธ"], item.status || "")}</select></div><div class="field"><label>ราคาซ่อม (บาท)</label><input type="number" min="0" step="0.01" class="input" data-record-field="cost" value="${esc(String(item.cost || "").replace(/[^\d.]/g, ""))}" placeholder="0.00"></div></div>`)}
      ${formSection("ข้อมูลการอนุมัติ", "", `<div class="form-grid two"><div class="field"><label>วันที่อนุมัติ</label><input type="date" class="input" data-record-field="approvedDate" value="${esc(toDateInputValue(item.approvedDate))}"></div><div class="field"><label>ความคิดเห็นการอนุมัติ</label><input class="input" data-record-field="approvalNote" value="${esc(item.approvalNote || "")}"></div></div>`)}
      ${modalFooter("บันทึก", `data-submit-record="${collection}" data-index="${index}"`)}
    `, "large form-modal");
  }
  return formModal("แก้ไขรายการขอใช้งาน/คืนอุปกรณ์", "edit", `
    ${formSection("ข้อมูลทรัพย์สิน", "", `<div class="field"><label>สถานะ</label><select class="select" data-record-field="status">${optionList(["กำลังขอใช้งาน", "คืนแล้ว", "เกินกำหนด"], item.status || "")}</select></div>`)}
    ${formSection("วันที่สำคัญ", "", `<div class="form-grid two"><div class="field"><label>วันที่ขอใช้</label><input type="date" class="input" data-record-field="date" value="${esc(toDateInputValue(item.date))}"></div><div class="field"><label>วันที่คืนจริง</label><input type="date" class="input" data-record-field="returnedDate" value="${esc(toDateInputValue(item.returnedDate))}"></div></div>`)}
    ${formSection("วัตถุประสงค์/หมายเหตุ", "", `<textarea class="textarea large" data-record-field="purpose">${esc(item.purpose || "")}</textarea>`)}
    ${modalFooter("บันทึก", `data-submit-record="${collection}" data-index="${index}"`)}
  `, "large form-modal");
}
function renderRecordModal(collection, index) {
  const item = recordSource(collection)[index];
  if (!item) return formModal("รายละเอียด", "clipboard", `<div class="empty-state">ไม่พบข้อมูล</div>`);
  if (collection === "maintenanceHistory") {
    return formModal("รายละเอียดการบำรุงรักษา", "wrench", `
      ${infoCard("ข้อมูลทั่วไป", [["รายการ", item.title], ["ทรัพย์สิน", item.asset || "-"], ["ประเภท", item.type || "-"]])}
      ${infoCard("ข้อมูลคำขอแจ้งซ่อม", [["ผู้แจ้ง", item.requester || "-"], ["แผนกผู้แจ้ง", item.requesterDepartment || "-"], ["วันที่แจ้ง", item.requestDate || item.date || "-"], ["ความเร่งด่วน", item.priority || "-"]])}
      ${infoCard("ข้อมูลทรัพย์สิน", [["ยี่ห้อ", item.brand || "-"], ["รุ่น", item.model || "-"], ["Serial No", item.serial || "-"], ["แผนกทรัพย์สิน", item.assetDepartment || "-"], ["สถานที่ / ห้อง", `${item.location || "-"}${item.room ? ` / ${item.room}` : ""}`]])}
      ${infoCard("ข้อมูลวันที่", [["วันที่บำรุงรักษา", item.date || "-"], ["วันที่เสร็จสิ้น", item.completedDate || "-"], ["สถานะ", item.status || "-"]])}
      ${infoCard("ข้อมูลการอนุมัติ", [["วันที่อนุมัติ", item.approvedDate || "-"], ["ความคิดเห็นการอนุมัติ", item.approvalNote || "-"]])}
      ${infoCard("ข้อมูลผู้ดำเนินการ", [["ผู้ดำเนินการ", item.owner || item.operator || "-"]])}
      ${infoCard("ข้อมูลค่าใช้จ่าย", [["ค่าใช้จ่าย", item.cost || "-"]])}
      ${formSection("รายละเอียด", "", `<div class="detail-note">${esc(item.desc || item.detail || "-")}</div>`)}
    `, "large detail-modal");
  }
  if (collection === "maintenanceRequests") {
    return formModal("รายละเอียดคำขอซ่อม", "clipboard", `
      ${infoCard("ข้อมูลคำขอ", [["หัวข้อ", item.title], ["ทรัพย์สิน", item.asset || `${item.brand || "-"} ${item.type || ""}`.trim()], ["วันที่แจ้ง", item.date || "-"], ["ความเร่งด่วน", item.priority || "-"], ["ราคาซ่อม", item.cost || "-"], ["สถานะ", item.status || "-"]])}
      ${infoCard("ข้อมูลผู้แจ้ง", [["ผู้แจ้ง", item.requester || "-"]])}
      ${formSection("รายละเอียดปัญหา", "", `<div class="detail-note">${esc(item.desc || "-")}</div>`)}
    `, "large detail-modal");
  }
  return formModal("รายละเอียดการขอใช้งาน/คืนอุปกรณ์", "clipboard", `
    ${infoCard("ข้อมูลทรัพย์สิน", [["ชื่อรายการ", item.sub || "-"], ["ทรัพย์สิน", item.asset || "-"], ["สถานะ", item.status || "-"]])}
    ${infoCard("ข้อมูลผู้ขอใช้งาน", [["ผู้ขอใช้งาน", item.requester || "-"], ["แผนกผู้ขอใช้งาน", item.department || "-"]])}
    ${infoCard("วันที่สำคัญ", [["วันที่ขอใช้", item.date || "-"], ["วันที่คืนจริง", item.returnedDate || "-"], ["วันที่คาดว่าจะคืน", item.expectedReturn || "-"]])}
    ${formSection("วัตถุประสงค์/หมายเหตุ", "", `<div class="detail-note">${esc(item.purpose || "-")}</div>`)}
  `, "large detail-modal");
}
function renderCheckoutSaveConfirmModal(snapshot, confirmAttr = "data-confirm-checkout-save") {
  return `<div class="modal-backdrop center-modal"><section class="modal small"><div class="modal-head"><div class="modal-title"><span class="logo-mark">${icon("save")}</span>ยืนยันการบันทึก</div><button class="modal-close" data-close-modal>${icon("x")}</button></div><div class="modal-body">
    <div class="info-card">
      <div class="info-title">ต้องการบันทึกคำขอใช้งานนี้หรือไม่?</div>
      <p class="subtext">กรุณาตรวจสอบข้อมูลก่อนยืนยัน ระบบจะบันทึกข้อมูลผู้ขอใช้งานเข้าสู่ระบบด้วย</p>
      ${snapshot ? `<div style="margin-top:12px;font-size:13px;color:var(--muted);"><b>ผู้ขอใช้งาน:</b> ${esc(snapshot.requester || "-")}<br><b>แผนก:</b> ${esc(snapshot.department || "-")}<br><b>ทรัพย์สิน:</b> ${esc(snapshot.asset || "-")}</div>` : ""}
    </div>
    <div class="modal-footer">
      <button class="ghost-btn" data-close-modal>ยกเลิก</button>
      <button class="primary-btn" ${confirmAttr}>${icon("save")} ยืนยันบันทึก</button>
    </div>
  </div></section></div>`;
}

function checkoutReturnOptionLabel(row) {
  const assetText = row?.assetCode && row.assetCode !== "-"
    ? `${row.assetCode} - ${row.sub || row.asset || ""}`.trim()
    : (row?.sub || row?.asset || "-");
  const requesterText = row?.requester ? ` / ${row.requester}` : "";
  return `${assetText}${requesterText}`;
}

function checkoutReturnAssetLabel(item, group) {
  const prefix = group === "computer" ? "Computer" : "Other";
  const details = [item.brand, item.model || item.type].filter(value => value && value !== "-").join(" ");
  const userText = item.user && item.user !== "-" ? ` / ${item.user}` : "";
  return `${prefix}: ${item.assetCode || "-"}${details ? ` - ${details}` : ""}${userText}`;
}

function checkoutReturnChoiceGroup(choice) {
  if (choice?.group) return choice.group;
  if (choice?.record?.assetGroup) return choice.record.assetGroup;
  const resolved = choice?.record ? checkoutAssetForRecord(choice.record) : null;
  return resolved?.group || "computer";
}

function checkoutReturnChoices(group = "") {
  const filterGroup = group;
  const choices = [];
  DATA.checkoutRecords.forEach((row, index) => {
    if (!checkoutCanReturn(row)) return;
    const resolved = checkoutAssetForRecord(row);
    const choiceGroup = row.assetGroup || resolved.group || "computer";
    if (filterGroup && choiceGroup !== filterGroup) return;
    choices.push({
      value: `record:${index}`,
      label: checkoutReturnOptionLabel(row),
      record: row,
      asset: resolved.asset,
      group: choiceGroup,
    });
  });
  ["computer", "other"].forEach(group => {
    if (filterGroup && group !== filterGroup) return;
    listForGroup(group).forEach((asset, index) => {
      if (!assetCanReturn(asset)) return;
      const alreadyListed = choices.some(choice => choice.asset === asset);
      if (alreadyListed) return;
      choices.push({
        value: `asset:${group}:${index}`,
        label: checkoutReturnAssetLabel(asset, group),
        record: null,
        asset,
        group,
        index,
      });
    });
  });
  return choices;
}

function checkoutReturnChoiceFromInput(value, group = "") {
  const text = normalize(value);
  const choices = checkoutReturnChoices(group);
  if (!text) return null;
  return choices.find(item => item.value === value)
    || choices.find(item => item.label === value)
    || choices.find(item => normalize(item.asset?.assetCode) === text)
    || choices.find(item => normalize(item.label).includes(text))
    || null;
}

function renderCheckoutReturnInfo(choice) {
  const selectedRecord = choice?.record || {};
  const selectedAsset = choice?.asset || {};
  return infoCard("ข้อมูลรายการ", [
    ["ผู้ใช้งาน", selectedRecord.requester || selectedAsset.user || "-"],
    ["แผนก", selectedRecord.department || selectedAsset.department || "-"],
    ["วันที่ขอใช้", selectedRecord.date || "-"],
    ["วันที่คาดว่าจะคืน", selectedRecord.expectedReturn || "-"],
    ["สถานะ", selectedRecord.status || selectedAsset.status || "-"],
  ]);
}

function refreshCheckoutReturnInfo() {
  const input = document.querySelector("[data-return-field='record']");
  const infoEl = document.querySelector("[data-return-info]");
  if (!input || !infoEl) return;
  const activeGroup = document.querySelector("[data-return-type].active")?.dataset.returnType || state.modal?.returnGroup || "";
  infoEl.innerHTML = renderCheckoutReturnInfo(checkoutReturnChoiceFromInput(input.value, activeGroup));
}

function renderCheckoutReturnModal(modal = {}) {
  const allReturnable = checkoutReturnChoices();
  if (!allReturnable.length) {
    return formModal("แจ้งคืนอุปกรณ์", "checkout", `
      <div class="empty-state" style="padding: 28px 12px;">ไม่มีรายการอุปกรณ์ที่รอแจ้งคืน</div>
      <div class="modal-footer"><button class="ghost-btn" data-close-modal>ปิด</button></div>
    `, "small form-modal");
  }
  const requestedIndex = Number(modal.index);
  const requestedValue = Number.isInteger(requestedIndex) ? `record:${requestedIndex}` : "";
  const requestedChoice = allReturnable.find(item => item.value === requestedValue);
  const activeGroup = modal.returnGroup || (requestedChoice ? checkoutReturnChoiceGroup(requestedChoice) : (checkoutReturnChoices("computer").length ? "computer" : "other"));
  const returnable = checkoutReturnChoices(activeGroup);
  const selectedChoice = requestedValue ? returnable.find(item => item.value === requestedValue) : null;
  const selectedRecord = selectedChoice?.record || {};
  return formModal("แจ้งคืนอุปกรณ์", "checkout", `
    ${formSection("เลือกรายการที่ต้องการคืน", "", `
      <div class="segmented return-type-switch">
        <button type="button" class="${activeGroup === "computer" ? "active" : ""}" data-return-type="computer">Computer</button>
        <button type="button" class="${activeGroup === "other" ? "active" : ""}" data-return-type="other">Other</button>
      </div>
      <div class="field">
        <label>รายการอุปกรณ์</label>
        <input class="input" data-return-field="record" list="return-asset-options" value="${esc(selectedChoice?.label || "")}" placeholder="พิมพ์รหัสทรัพย์สิน ยี่ห้อ รุ่น หรือผู้ใช้งาน">
        <datalist id="return-asset-options">
          ${returnable.map(item => `<option value="${esc(item.label)}"></option>`).join("")}
        </datalist>
      </div>
      <div class="field">
        <label>วันที่คืนจริง</label>
        <input type="date" class="input" data-return-field="returnedDate" value="${esc(modal.returnedDate || toDateInputValue(selectedRecord.returnedDate) || today())}">
      </div>
    `)}
    <div data-return-info>${renderCheckoutReturnInfo(selectedChoice)}</div>
    <div class="modal-footer">
      <button class="ghost-btn" data-close-modal>ยกเลิก</button>
      <button class="primary-btn" data-submit-checkout-return>${icon("check")} ยืนยันการคืน</button>
    </div>
  `, "large form-modal");
}
