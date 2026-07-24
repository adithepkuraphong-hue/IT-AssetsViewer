// ============================================================
// modals/asset-modal.js — Asset form and detail modals
// ============================================================

function renderAssetFormModal(modal) {
  const group = modal.group || "computer";
  const isComputer = group === "computer";
  const list = listForGroup(group);
  const isEdit = Number.isInteger(modal.index);
  const item = isEdit ? list[modal.index] : {};
  const defaultCode = isComputer ? "KOCH-IT-NB-26-001" : "KOCH-IT-OT-26-001";
  
  const imageUrls = item.imageUrl ? item.imageUrl.split(",").filter(Boolean) : [];
  const url1 = imageUrls[0] || "";
  const url2 = imageUrls[1] || "";

  // --- Cascading group → type dropdowns ---
  const allTypes = DATA.master.types || [];
  const typeGroups = DATA.master.typeGroups || [];
  const currentTypeObj = allTypes.find(t => (t.name || t.code) === item.type);
  let routeGroupCode = "";
  if (state.route && state.route.startsWith("assets-")) {
    routeGroupCode = state.route.replace("assets-", "");
  }
  const requestedGroupCode = modal.typeGroupCode || routeGroupCode;
  const currentGroupCode = currentTypeObj ? (currentTypeObj.groupCode || "") : requestedGroupCode;
  const currentGroup = typeGroups.find(g => g.code === currentGroupCode);
  const currentGroupLabel = isComputer ? "คอมพิวเตอร์" : currentGroup ? currentGroup.name : currentGroupCode || "ทุกกลุ่มประเภท";
  // Initial type list for current group
  let initialTypes = currentGroupCode
    ? allTypes.filter(t => t.groupCode === currentGroupCode)
    : allTypes;
  if (isComputer) {
    initialTypes = allTypes.filter(t => isComputerAssetType(t.name || t.code));
  } else if (currentGroupCode === "IT") {
    initialTypes = initialTypes.filter(t => !isComputerAssetType(t.name || t.code));
  }
  // Only add extras from asset list when no group is pre-selected
  let extrasFromList = currentGroupCode
    ? []
    : uniqueOptions(list, "type").filter(v => !allTypes.find(t => (t.name || t.code) === v));
  extrasFromList = extrasFromList.filter(v => isComputer ? isComputerAssetType(v) : !isComputerAssetType(v));
  const initialTypeNames = [...new Set([...initialTypes.map(t => t.name || t.code), ...extrasFromList])];
  if (!initialTypeNames.length) initialTypeNames.push(isComputer ? "Notebook" : "Access Point");

  const typeOptsHtml = `<option value="">-- ไม่ระบุ --</option>` +
    initialTypeNames.map(v =>
      `<option value="${esc(v)}"${item.type === v ? " selected" : ""}>${esc(v)}</option>`
    ).join("");

  const companyOptions = (DATA.master.companies || []).map(row => row.code || row.name);
  const departmentOptions = (DATA.master.departments || []).map(row => row.name || row.code);
  const locationOptions = (DATA.master.locations || []).map(row => row.name || row.code);
  const positionOptions = [
    ...new Set([
      ...(DATA.master.positions || []).map(p => p.name || p.code),
      ...allAssets().map(a => a.position).filter(Boolean)
    ])
  ];
  const existingPositionsHtml = positionOptions.map(p => `<option value="${esc(p)}">`).join("");
  const statusOptions = (DATA.master.statuses && DATA.master.statuses.length)
    ? DATA.master.statuses.map(s => s.name)
    : ["ไม่ได้ใช้งาน", "ใช้งาน", "เสีย", "ส่งซ่อม", "ระหว่างสั่งซื้อ", "รอย้าย"];
  const title = isEdit
    ? (isComputer ? "แก้ไขคอมพิวเตอร์" : "แก้ไขอุปกรณ์ไอที")
    : (isComputer ? "เพิ่มคอมพิวเตอร์" : "เพิ่มอุปกรณ์ไอที");
  const existingCodesHtml = allAssets()
    .filter(asset => {
      const assetTypeObj = (DATA.master.types || []).find(t => normalizeAssetType(t.name || t.code) === normalizeAssetType(asset.type));
      const assetGroupCode = assetTypeObj ? assetTypeObj.groupCode : (isComputerAssetType(asset.type) ? "IT" : "");
      if (isComputer) {
        return assetGroupCode === "IT" && isComputerAssetType(asset.type);
      }
      return assetGroupCode === currentGroupCode;
    })
    .map(asset => {
      const desc = [asset.brand, asset.model].filter(Boolean).join(" ") || asset.type || "";
      const label = desc ? `${desc}${asset.user ? ` - ${asset.user}` : ""}` : "";
      return `<option value="${esc(asset.assetCode)}">${esc(label)}</option>`;
    })
    .join("");

  const body = `
    <datalist id="existing-asset-codes">
      ${existingCodesHtml}
    </datalist>
    ${formSection("ข้อมูลพื้นฐาน", "รหัสและประเภททรัพย์สิน", `<div class="form-grid two">
      <div class="field"><label>Asset Code <span class="required">*</span></label><input class="input" data-asset-field="assetCode" list="existing-asset-codes" value="${esc(isEdit ? item.assetCode : "")}" placeholder="${esc(defaultCode)}"></div>
      <div class="field"></div>
      <div class="field">
        <label>กลุ่มประเภท</label>
        <div class="readonly-display asset-type-group-display" id="asset-typegroup-display" data-type-group="${esc(currentGroupCode)}">${esc(currentGroupLabel)}</div>
      </div>
      <div class="field">
        <label>ประเภท</label>
        <select class="select" id="asset-type-select" data-asset-field="type">${typeOptsHtml}</select>
      </div>
      <div class="field"><label>ยี่ห้อ</label><input class="input" data-asset-field="brand" value="${esc(item.brand || "")}" placeholder="เช่น Dell, HP, Lenovo"></div>
      <div class="field"><label>รุ่น</label><input class="input" data-asset-field="model" value="${esc(item.model || "")}" placeholder="เช่น Latitude 5520"></div>
      <div class="field"><label>Serial Number</label><input class="input" data-asset-field="serial" value="${esc(item.serial || "")}" placeholder="เลขซีเรียล"></div>
      <div class="field"><label>สถานะ</label><select class="select" data-asset-field="status">${optionList(statusOptions, item.status, "-- ไม่ระบุ --")}</select></div>
      ${isComputer ? `<div class="field"><label>Windows Version</label><input class="input" data-asset-field="windowsVersion" value="${esc(item.windowsVersion || "")}" placeholder="เช่น Windows 11 Pro"></div><div class="field"><label>RustDesk ID</label><input class="input" data-asset-field="rustDeskId" value="${esc(item.rustDeskId || "")}" placeholder="Remote Desktop ID"></div>` : ""}
      <div id="dynamic-fields-container" class="form-grid two" style="grid-column: span 2; display: contents;">
        ${!isComputer ? getDynamicFormHtml(currentGroupCode, item) : ""}
      </div>
    </div>`)}
    ${formSection("รูปภาพทรัพย์สิน (แนบได้สูงสุด 2 รูป)", "ภาพถ่ายตัวเครื่องจริง", `
      <div class="form-grid two">
        <!-- Image 1 -->
        <div class="image-upload-wrapper" style="display: flex; gap: 12px; align-items: center; background: var(--bg-card); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
          <div id="asset-image-preview-1" style="width: 80px; height: 80px; border-radius: 6px; border: 1px dashed var(--border); display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--bg-hover); flex-shrink: 0;">
            ${url1 ? `<img src="${esc(getImageUrl(url1))}" style="width: 100%; height: 100%; object-fit: cover; cursor: zoom-in;" data-open-lightbox="${esc(url1)}">` : `<span style="font-size: 24px; color: var(--ink-muted);">${icon("image")}</span>`}
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 13px; font-weight: bold;">รูปด้านหน้า</label>
            <span style="font-size: 11px; color: var(--ink-muted); margin-top: -4px;">ควรถ่ายให้เห็นรุ่นหรือยี่ห้อของเครื่อง</span>
            <input type="file" id="asset-image-file-1" accept="image/*" style="display: none;">
            <input type="hidden" data-asset-field="imageUrl1" value="${esc(url1)}">
            <div style="display: flex; gap: 6px;">
              <button type="button" class="button secondary small" id="btn-select-asset-image-1" onclick="document.getElementById('asset-image-file-1').click();" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 12px; height: auto; border: 1px solid var(--border); background: var(--bg-card); color: var(--ink);">
                ${icon("edit")} <span>${url1 ? "เปลี่ยนรูป" : "เลือกรูป"}</span>
              </button>
              <button type="button" class="button danger-light small" id="btn-delete-asset-image-1" style="display: ${url1 ? "inline-flex" : "none"}; align-items: center; gap: 4px; padding: 4px 8px; font-size: 12px; color: var(--red); background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.2); height: auto;">
                ${icon("trash")} ลบ
              </button>
            </div>
          </div>
        </div>

        <!-- Image 2 -->
        <div class="image-upload-wrapper" style="display: flex; gap: 12px; align-items: center; background: var(--bg-card); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
          <div id="asset-image-preview-2" style="width: 80px; height: 80px; border-radius: 6px; border: 1px dashed var(--border); display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--bg-hover); flex-shrink: 0;">
            ${url2 ? `<img src="${esc(getImageUrl(url2))}" style="width: 100%; height: 100%; object-fit: cover; cursor: zoom-in;" data-open-lightbox="${esc(url2)}">` : `<span style="font-size: 24px; color: var(--ink-muted);">${icon("image")}</span>`}
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 13px; font-weight: bold;">รูปด้านหลัง</label>
            <span style="font-size: 11px; color: var(--ink-muted); margin-top: -4px;">ควรถ่ายให้เห็น serialnumber</span>
            <input type="file" id="asset-image-file-2" accept="image/*" style="display: none;">
            <input type="hidden" data-asset-field="imageUrl2" value="${esc(url2)}">
            <div style="display: flex; gap: 6px;">
              <button type="button" class="button secondary small" id="btn-select-asset-image-2" onclick="document.getElementById('asset-image-file-2').click();" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 12px; height: auto; border: 1px solid var(--border); background: var(--bg-card); color: var(--ink);">
                ${icon("edit")} <span>${url2 ? "เปลี่ยนรูป" : "เลือกรูป"}</span>
              </button>
              <button type="button" class="button danger-light small" id="btn-delete-asset-image-2" style="display: ${url2 ? "inline-flex" : "none"}; align-items: center; gap: 4px; padding: 4px 8px; font-size: 12px; color: var(--red); background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.2); height: auto;">
                ${icon("trash")} ลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    `)}
    ${formSection("ข้อมูลหน่วยงาน", "บริษัท แผนก ตำแหน่ง สถานที่ และผู้ใช้งาน", `<div class="form-grid two">
      <datalist id="existing-asset-users">${[...new Set(allAssets().map(a => a.user).filter(Boolean))].map(u => `<option value="${esc(u)}">`).join("")}</datalist>
      <datalist id="existing-asset-positions">${existingPositionsHtml}</datalist>
      <div class="field"><label>บริษัท</label><select class="select" data-asset-field="company">${optionList(companyOptions, item.company, "-- ไม่ระบุ --")}</select></div>
      <div class="field"><label>แผนก</label><select class="select" data-asset-field="department">${optionList(departmentOptions, item.department, "-- ไม่ระบุ --")}</select></div>
      <div class="field"><label>สถานที่</label><select class="select" data-asset-field="location">${optionList(locationOptions, item.location, "-- ไม่ระบุ --")}</select></div>
      <div class="field"><label>ห้อง</label><input class="input" data-asset-field="room" value="${esc(item.room || "")}" placeholder="ระบุห้อง เช่น Server Room, Accounting"></div>
      <div class="field"><label>ผู้ใช้งาน</label><input class="input" data-asset-field="user" list="existing-asset-users" value="${esc(item.user || "")}" placeholder="ชื่อผู้ใช้งาน"></div>
      <div class="field"><label>ตำแหน่ง</label><input class="input" data-asset-field="position" list="existing-asset-positions" value="${esc(item.position || "")}" placeholder="ตำแหน่ง เช่น IT Manager, Accountant"></div>
    </div>`)}
    ${formSection("วันที่สำคัญ", "วันที่ซื้อ วันหมดประกัน และวันส่งซ่อม", `<div class="form-grid three">
      <div class="field"><label>วันที่ซื้อ</label><input type="date" class="input" data-asset-field="purchaseDate" value="${esc(toDateInputValue(item.purchaseDate))}"></div>
      <div class="field"><label>วันหมดประกัน</label><input type="date" class="input" data-asset-field="warrantyExpirationDate" value="${esc(toDateInputValue(item.warrantyExpirationDate))}"></div>
      <div class="field"><label>วันที่ส่งซ่อม</label><input type="date" class="input" data-asset-field="sentForRepairDate" value="${esc(toDateInputValue(item.sentForRepairDate))}"></div>
    </div>`)}
    <div id="dynamic-checklist-container">
      ${isComputer ? formSection("อุปกรณ์เสริม", "อุปกรณ์ที่มาพร้อมกับทรัพย์สิน", `<div class="checkbox-row">
        <label><input type="checkbox" data-asset-check="adapter" ${checkedAttr(item.adapter)}> Adapter</label>
        <label><input type="checkbox" data-asset-check="laptopBag" ${checkedAttr(item.laptopBag)}> Laptop Bag</label>
        <label><input type="checkbox" data-asset-check="mouse" ${checkedAttr(item.mouse)}> Mouse</label>
        <label><input type="checkbox" data-asset-check="syncOneDrive" ${checkedAttr(item.syncOneDrive)}> Sync with OneDrive</label>
      </div>`) : getDynamicChecklistHtml(currentGroupCode, item)}
    </div>
    ${formSection("หมายเหตุ", "", `<textarea class="textarea large" data-asset-field="remark" placeholder="รายละเอียดเพิ่มเติม...">${esc(item.remark || "")}</textarea>`)}
    ${modalFooter("บันทึก", `data-submit-asset="${group}"`)}
  `;
  return formModal(title, isComputer ? "laptop" : "network", body, "large form-modal");
}
function renderAssetDetailModal(modal) {
  const list = listForGroup(modal.group);
  let item = null;
  if (modal.code) {
    item = list.find(x => x.assetCode === modal.code);
  }
  if (!item && Number.isInteger(modal.index)) {
    item = list[modal.index];
  }
  if (!item) {
    item = list[0];
  }
  const isComputer = modal.group === "computer";
  const title = isComputer ? "รายละเอียดคอมพิวเตอร์" : "รายละเอียดอุปกรณ์ไอที";
  if (!item) return formModal(title, isComputer ? "laptop" : "network", `<div class="empty-state">ไม่พบข้อมูล</div>`);
  return `<div class="modal-backdrop"><section class="modal large detail-modal">
    <div class="modal-head"><div class="modal-title"><span class="logo-mark">${icon(isComputer ? "laptop" : "network")}</span> ${title}</div><button class="modal-close" data-close-modal>${icon("x")}</button></div>
    <div class="modal-body">
      <div class="asset-hero"><div class="asset-hero-main"><span class="asset-hero-icon">${icon(isComputer ? "laptop" : "network")}</span><div><h2>${esc(item.assetCode)}</h2><p class="subtext">${esc(item.type)}</p></div></div><span class="status-pill ${statusClass(item.status)}">${esc(item.status)}</span></div>
      ${(() => {
        const urls = item.imageUrl ? item.imageUrl.split(",").filter(Boolean) : [];
        if (!urls.length) return "";
        return `<div class="info-card image-card" style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 10px;">ภาพถ่ายทรัพย์สิน (${urls.length} รูป)</h3>
          <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 10px; overflow-x: hidden;">
            ${urls.map((url, idx) => `
              <div style="flex: 1 1 200px; display: flex; flex-direction: column; gap: 8px;">
                <div style="height: 180px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border); background: var(--bg-hover); display: flex; justify-content: center; align-items: center;">
                  <img src="${esc(getImageUrl(url))}" style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: zoom-in;" data-open-lightbox="${esc(url)}">
                </div>
                <button class="button primary small" data-open-lightbox="${esc(url)}" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; font-size: 12px; justify-content: center; height: auto;">
                  ${icon("image")} ดูรูปที่ ${idx + 1}
                </button>
              </div>
            `).join("")}
          </div>
        </div>`;
      })()}
      ${infoCard("ข้อมูลพื้นฐาน", [["ประเภท", item.type], ["ยี่ห้อ", item.brand], ["รุ่น", item.model], ["Serial No", item.serial]])}
      ${infoCard("ข้อมูลหน่วยงาน", [["บริษัท", item.company], ["แผนก", item.department || "-"], ["ตำแหน่ง", item.position || "-"], ["สถานที่", item.location || "-"], ["ห้อง", item.room || "-"], ["ผู้ใช้งาน", item.user || "-"]])}
      ${infoCard("วันที่สำคัญ", [["วันที่ซื้อ", item.purchaseDate || "-"], ["วันหมดประกัน", item.warrantyExpirationDate || "-"], ["วันที่ส่งซ่อม", item.sentForRepairDate || "-"]])}
      ${isComputer ? infoCard("ข้อมูลเทคนิค", [["RustDesk ID", item.rustDeskId || "-"], ["Windows Version", item.windowsVersion || "-"], ["Sync OneDrive", item.syncOneDrive ? "✓ เปิดใช้งาน" : "-"]]) + accessoryCard(item) : renderCategorySpecificDetails(item)}
      ${infoCard("หมายเหตุ", [["หมายเหตุ", item.remark || "-"]])}
    </div>
  </section></div>`;
}

// ============================================================
// Dynamic Category Fields & Checklists Helpers
// ============================================================

function getDynamicFormHtml(groupCode, item = {}) {
  if (groupCode === "OFE") {
    return `
      <div class="field"><label>วัสดุ (ไม้/เหล็ก/ผ้า)</label><input class="input" data-asset-field="material" value="${esc(item.material || "")}" placeholder="เช่น ไม้, เหล็ก, ผ้า"></div>
      <div class="field"><label>ขนาด (กว้าง x ยาว)</label><input class="input" data-asset-field="dimensions" value="${esc(item.dimensions || "")}" placeholder="เช่น 120x60 ซม."></div>
      <div class="field"><label>เลขเครื่อง (กรณีเป็นแอร์/เครื่องพิมพ์)</label><input class="input" data-asset-field="machineNumber" value="${esc(item.machineNumber || "")}" placeholder="เลขเครื่องแอร์/เครื่องพิมพ์"></div>
    `;
  }
  if (groupCode === "VEH") {
    return `
      <div class="field"><label>เลขทะเบียนรถ</label><input class="input" data-asset-field="licensePlate" value="${esc(item.licensePlate || "")}" placeholder="เช่น กข 1234 กรุงเทพ"></div>
      <div class="field"><label>เลขตัวถัง (Chassis No.)</label><input class="input" data-asset-field="chassisNumber" value="${esc(item.chassisNumber || "")}" placeholder="เลขตัวถังรถ"></div>
      <div class="field"><label>เลขไมล์เริ่มต้น</label><input type="number" class="input" data-asset-field="startingMileage" value="${esc(item.startingMileage || "")}" placeholder="เลขไมล์ ณ วันที่รับรถ"></div>
      <div class="field"><label>ประเภทเชื้อเพลิง</label><input class="input" data-asset-field="fuelType" value="${esc(item.fuelType || "")}" placeholder="เช่น ดีเซล, แก๊สโซฮอล์ 95"></div>
    `;
  }
  if (groupCode === "MCH") {
    return `
      <div class="field"><label>กำลังไฟฟ้า (Watt/HP)</label><input class="input" data-asset-field="powerRating" value="${esc(item.powerRating || "")}" placeholder="เช่น 1500W หรือ 2HP"></div>
      <div class="field"><label>แรงดันไฟ (Volt)</label><input class="input" data-asset-field="voltage" value="${esc(item.voltage || "")}" placeholder="เช่น 220V, 380V"></div>
      <div class="field"><label>รอบการทำงาน (RPM)</label><input class="input" data-asset-field="rpm" value="${esc(item.rpm || "")}" placeholder="เช่น 1450 RPM"></div>
    `;
  }
  if (groupCode === "FAC") {
    return `
      <div class="field"><label>พิกัดกำลังสูงสุด</label><input class="input" data-asset-field="maxRating" value="${esc(item.maxRating || "")}" placeholder="พิกัดกำลังสูงสุด"></div>
      <div class="field"><label>รอบการตรวจเช็กมาตรฐาน</label><input class="input" data-asset-field="maintenanceCycle" value="${esc(item.maintenanceCycle || "")}" placeholder="เช่น ทุก 6 เดือน, ทุก 1 ปี"></div>
      <div class="field"><label>รหัสเบรกเกอร์</label><input class="input" data-asset-field="breakerCode" value="${esc(item.breakerCode || "")}" placeholder="รหัสเบรกเกอร์ควบคุม"></div>
    `;
  }
  if (groupCode === "SFT") {
    return `
      <div class="field"><label>License Key</label><input class="input" data-asset-field="licenseKey" value="${esc(item.licenseKey || "")}" placeholder="รหัสสิทธิ์การใช้งาน"></div>
      <div class="field"><label>ประเภทสิทธิ์</label><select class="select" data-asset-field="licenseType">
        <option value="">-- เลือกประเภทสิทธิ์ --</option>
        <option value="Perpetual"${item.licenseType === "Perpetual" ? " selected" : ""}>Perpetual (ซื้อขาด)</option>
        <option value="Subscription"${item.licenseType === "Subscription" ? " selected" : ""}>Subscription (รายปี/รายเดือน)</option>
      </select></div>
      <div class="field"><label>จำนวนสิทธิ์ที่ใช้ได้ (Seats)</label><input type="number" class="input" data-asset-field="licenseSeats" value="${esc(item.licenseSeats || "")}" placeholder="จำนวนสิทธิ์"></div>
    `;
  }
  return "";
}

function getDynamicChecklistHtml(groupCode, item = {}) {
  if (groupCode === "OFE") {
    return formSection("อุปกรณ์เสริม", "อุปกรณ์ที่มาพร้อมกับทรัพย์สิน", `
      <div class="checkbox-row">
        <label><input type="checkbox" data-asset-check="cushion" ${checkedAttr(item.cushion)}> เบาะรองนั่ง</label>
        <label><input type="checkbox" data-asset-check="cabinetKey" ${checkedAttr(item.cabinetKey)}> กุญแจตู้</label>
        <label><input type="checkbox" data-asset-check="extensionCord" ${checkedAttr(item.extensionCord)}> สายต่อพ่วง</label>
      </div>
    `);
  }
  if (groupCode === "VEH") {
    return formSection("อุปกรณ์เสริม", "อุปกรณ์ที่มาพร้อมกับทรัพย์สิน", `
      <div class="checkbox-row">
        <label><input type="checkbox" data-asset-check="easyPass" ${checkedAttr(item.easyPass)}> คีย์การ์ดทางด่วน (Easy Pass)</label>
        <label><input type="checkbox" data-asset-check="spareTire" ${checkedAttr(item.spareTire)}> ยางอะไหล่</label>
        <label><input type="checkbox" data-asset-check="dashcam" ${checkedAttr(item.dashcam)}> กล้องหน้ารถ</label>
      </div>
    `);
  }
  if (groupCode === "MCH") {
    return formSection("อุปกรณ์เสริม", "อุปกรณ์ที่มาพร้อมกับทรัพย์สิน", `
      <div class="checkbox-row">
        <label><input type="checkbox" data-asset-check="userManual" ${checkedAttr(item.userManual)}> คู่มือการใช้งาน</label>
        <label><input type="checkbox" data-asset-check="toolKit" ${checkedAttr(item.toolKit)}> ชุดเครื่องมือซ่อมประจำเครื่อง</label>
      </div>
    `);
  }
  if (groupCode === "FAC") {
    return formSection("อุปกรณ์เสริม", "อุปกรณ์ที่มาพร้อมกับทรัพย์สิน", `
      <div class="checkbox-row">
        <label><input type="checkbox" data-asset-check="safetySign" ${checkedAttr(item.safetySign)}> ป้ายเตือนความปลอดภัย</label>
        <label><input type="checkbox" data-asset-check="controlCabinetKey" ${checkedAttr(item.controlCabinetKey)}> กุญแจตู้ควบคุม</label>
      </div>
    `);
  }
  if (groupCode === "SFT") {
    return formSection("อุปกรณ์เสริม", "อุปกรณ์ที่มาพร้อมกับทรัพย์สิน", `
      <div class="checkbox-row">
        <label><input type="checkbox" data-asset-check="installManual" ${checkedAttr(item.installManual)}> คู่มือติดตั้ง</label>
        <label><input type="checkbox" data-asset-check="downloadLink" ${checkedAttr(item.downloadLink)}> ลิงก์ดาวน์โหลด Installer</label>
      </div>
    `);
  }
  return "";
}

function renderCategorySpecificDetails(item) {
  const allTypes = DATA.master.types || [];
  const typeObj = allTypes.find(t => (t.name || t.code) === item.type);
  const groupCode = typeObj ? (typeObj.groupCode || "") : "";
  
  if (groupCode === "OFE") {
    const fields = [
      ["วัสดุ (ไม้/เหล็ก/ผ้า)", item.material || "-"],
      ["ขนาด (กว้าง x ยาว)", item.dimensions || "-"],
      ["เลขเครื่อง", item.machineNumber || "-"]
    ];
    const checklist = [];
    if (item.cushion) checklist.push("เบาะรองนั่ง");
    if (item.cabinetKey) checklist.push("กุญแจตู้");
    if (item.extensionCord) checklist.push("สายต่อพ่วง");
    
    let html = infoCard("รายละเอียดสำนักงาน", fields);
    if (checklist.length) {
      html += infoCard("อุปกรณ์เสริม", [[ "รายการ", checklist.join(", ") ]]);
    }
    return html;
  }
  if (groupCode === "VEH") {
    const fields = [
      ["เลขทะเบียนรถ", item.licensePlate || "-"],
      ["เลขตัวถัง (Chassis No.)", item.chassisNumber || "-"],
      ["เลขไมล์เริ่มต้น", item.startingMileage || "-"],
      ["ประเภทเชื้อเพลิง", item.fuelType || "-"]
    ];
    const checklist = [];
    if (item.easyPass) checklist.push("คีย์การ์ดทางด่วน (Easy Pass)");
    if (item.spareTire) checklist.push("ยางอะไหล่");
    if (item.dashcam) checklist.push("กล้องหน้ารถ");
    
    let html = infoCard("ข้อมูลยานพาหนะ", fields);
    if (checklist.length) {
      html += infoCard("อุปกรณ์เสริม", [[ "รายการ", checklist.join(", ") ]]);
    }
    return html;
  }
  if (groupCode === "MCH") {
    const fields = [
      ["กำลังไฟฟ้า (Watt/HP)", item.powerRating || "-"],
      ["แรงดันไฟ (Volt)", item.voltage || "-"],
      ["รอบการทำงาน (RPM)", item.rpm || "-"]
    ];
    const checklist = [];
    if (item.userManual) checklist.push("คู่มือการใช้งาน");
    if (item.toolKit) checklist.push("ชุดเครื่องมือซ่อมประจำเครื่อง");
    
    let html = infoCard("ข้อมูลเครื่องจักร", fields);
    if (checklist.length) {
      html += infoCard("อุปกรณ์เสริม", [[ "รายการ", checklist.join(", ") ]]);
    }
    return html;
  }
  if (groupCode === "FAC") {
    const fields = [
      ["พิกัดกำลังสูงสุด", item.maxRating || "-"],
      ["รอบการตรวจเช็กมาตรฐาน", item.maintenanceCycle || "-"],
      ["รหัสเบรกเกอร์", item.breakerCode || "-"]
    ];
    const checklist = [];
    if (item.safetySign) checklist.push("ป้ายเตือนความปลอดภัย");
    if (item.controlCabinetKey) checklist.push("กุญแจตู้ควบคุม");
    
    let html = infoCard("ข้อมูลระบบอาคาร", fields);
    if (checklist.length) {
      html += infoCard("อุปกรณ์เสริม", [[ "รายการ", checklist.join(", ") ]]);
    }
    return html;
  }
  if (groupCode === "SFT") {
    const fields = [
      ["License Key", item.licenseKey || "-"],
      ["ประเภทสิทธิ์", item.licenseType || "-"],
      ["จำนวนสิทธิ์ที่ใช้ได้ (Seats)", item.licenseSeats || "-"]
    ];
    const checklist = [];
    if (item.installManual) checklist.push("คู่มือติดตั้ง");
    if (item.downloadLink) checklist.push("ลิงก์ดาวน์โหลด Installer");
    
    let html = infoCard("ข้อมูลซอฟต์แวร์", fields);
    if (checklist.length) {
      html += infoCard("อุปกรณ์เสริม", [[ "รายการ", checklist.join(", ") ]]);
    }
    return html;
  }
  return "";
}

