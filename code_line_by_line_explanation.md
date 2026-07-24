# คู่มืออธิบายการทำงานของโค้ดรายบรรทัด (Line-by-Line Code Explanation)

เอกสารฉบับนี้อธิบายชุดคำสั่งทีละบรรทัดและทีละบล็อกของไฟล์หลักในระบบ **Asset Control** เพื่อให้เข้าใจตรรกะเบื้องหลังและการทำงานร่วมกันของโค้ดแต่ละบรรทัดได้ง่ายที่สุด

---

## 1. ไฟล์: [data.js](file:///c:/Users/SuphawadiChampathi/OneDrive%20-%20KOCH%20PACKAGING%20AND%20PACKING%20SERVICES%20CO%20LTD/Desktop/assets/outputs/js/data.js) (จัดการข้อมูลและ State)

ไฟล์นี้ทำหน้าที่กำหนดค่าเริ่มต้นของข้อมูล (`DATA`) และตัวแปรเก็บสถานะการคลิก/เลือก (`state`) รวมถึงฟังก์ชันในการซิงค์ข้อมูลกับฐานข้อมูล Supabase

### บรรทัดที่ 5-8: โหลดและกำหนดเวอร์ชันข้อมูลสำรอง
```javascript
let DATA = window.ASSET_CONTROL_DATA; // ดึงข้อมูลโครงสร้างทรัพย์สินเริ่มต้นที่เก็บอยู่ในไฟล์ asset-data.js
const LOCAL_DATA_KEY = "asset-control-local-data"; // คีย์สำหรับใช้อ้างอิงการเก็บข้อมูลสำรองลงในเครื่องคอมพิวเตอร์ผ่าน LocalStorage
const DATA_SCHEMA_VERSION = "asset-code-dedupe-v3-admin-reset"; // รหัสเวอร์ชันของสคีมาข้อมูล ป้องกันข้อมูลข้ามรุ่นชนกัน
```

### บรรทัดที่ 10-18: ดักจับและเขียนทับการดึงข้อมูลเมื่อเปิดแบบ Local File
```javascript
if (window.location.protocol === "file:") { // ตรวจสอบว่าผู้ใช้เปิดแอปผ่านการดับเบิ้ลคลิกไฟล์ HTML ตรงๆ หรือไม่
  const originalFetch = window.fetch; // สำรองฟังก์ชัน fetch ดั้งเดิมของเบราว์เซอร์ไว้
  window.fetch = function(input, init) { // เขียนทับฟังก์ชัน fetch ใหม่
    if (typeof input === "string" && input.startsWith("/api/")) { // ถ้าปลายทางขึ้นต้นด้วย /api/
      input = "http://127.0.0.1:8788" + input; // ให้แปลงเส้นทางเป็นพอร์ตของเซิร์ฟเวอร์โลคอล (Node.js) ทันที
    }
    return originalFetch(input, init); // เรียกใช้ฟังก์ชัน fetch ที่แปลงค่า URL แล้ว
  };
}
const DATABASE_API_ENABLED = true; // เปิดใช้งานการเก็บข้อมูลผ่านระบบฐานข้อมูล API เสมอ (ไม่ใช้ Standalone LocalStorage)
```

### บรรทัดที่ 45-66: ตัวแปรจัดเก็บสถานะหน้าจอ (Global State)
```javascript
const state = {
  user: JSON.parse(localStorage.getItem("asset-control-user") || "null"), // ดึงข้อมูลผู้ใช้งานที่ล็อกอินล่าสุดจาก LocalStorage (ถ้ามี)
  clientIp: "local", // กำหนดค่าเริ่มต้นของ IP เครื่องผู้เข้าใช้งาน
  route: "dashboard", // เมนูเริ่มต้นที่จะแสดงผลตอนเปิดโปรแกรมคือหน้า Dashboard
  drawerOpen: false, // Status เมนูด้านข้างเปิด/ปิดในหน้าจอมือถือ (เริ่มต้นเป็นปิด)
  modal: null, // ตัวแปรเก็บป๊อปอัปหน้าจอที่กำลังเปิดแสดงอยู่ (เริ่มต้นเป็นไม่มี)
  filters: {}, // ตัวกรองสถานะที่เลือกค้างไว้ในแต่ละหน้าเว็บ
  pages: {}, // ตัวเลขหน้าปัจจุบันของการแบ่งหน้าตาราง (Pagination)
  pageSizes: {}, // ขนาดจำนวนแถวแสดงผลของตารางแต่ละประเภท
  toast: null, // ข้อความแจ้งเตือนป๊อปอัปที่จะแสดงผลด้านล่างของหน้าจอ
  settings: { // โครงสร้างค่ากำหนดระบบทั่วไป
    orgName: "KOCH PACKAGING AND PACKING SERVICES CO., LTD.", // ชื่อองค์กรเริ่มต้น
    defaultPageSize: "5", // จำนวนรายการเริ่มต้นที่จะแสดงผลต่อหน้า (เปลี่ยนล่าสุดตามสั่งคือ 5 รายการ)
  }
};
```

### บรรทัดที่ 366-381: ฟังก์ชันโหลดข้อมูลจากฐานข้อมูล Supabase (`loadServerDatabase`)
```javascript
async function loadServerDatabase({ rerender = false, notify = false } = {}) {
  if (!DATABASE_API_ENABLED) return false; // ตรวจสอบว่าระบบรองรับฐานข้อมูลหรือไม่ (ในระบบเราเปิดเป็น true เสมอ)
  try {
    const response = await fetch("/api/database", { cache: "no-store" }); // ส่งคำขอ GET ไปที่ API ดึงข้อมูลสดใหม่แบบไม่บันทึกแคช
    if (!response.ok) throw new Error(`Database load failed: ${response.status}`); // ถ้าเซิร์ฟเวอร์ตอบกลับไม่สำเร็จ ให้โยนข้อผิดพลาดออกมา
    const payload = await response.json(); // แปลงการตอบรับของเซิร์ฟเวอร์ให้อยู่ในรูปตัวแปร JSON Object
    databaseVersion = payload.version || null; // เก็บข้อมูลรุ่นประวัติเวอร์ชันของ Supabase ไว้เปรียบเทียบในภายหลัง
    replaceData(payload.data); // นำข้อมูลที่ได้จากเซิร์ฟเวอร์ไปใส่แทนที่ตัวแปร DATA หลักในหน้าจอ
    if (rerender) render(); // ถ้ากำหนดค่า rerender ให้ทำการอัปเดตหน้าจอเพื่อเปลี่ยนสถิติทันที
    if (notify) showToast("อัปเดตข้อมูลจากฐานข้อมูลแล้ว"); // แสดงข้อความป๊อปอัปแจ้งผลสำเร็จแก่ผู้ใช้
    return true;
  } catch (error) {
    console.warn(error); // แสดงแจ้งเตือนข้อผิดพลาดลงในหน้าต่าง Console ของผู้พัฒนา
    return false;
  }
}
```

---

## 2. ไฟล์: [utils.js](file:///c:/Users/SuphawadiChampathi/OneDrive%20-%20KOCH%20PACKAGING%20AND%20PACKING%20SERVICES%20CO%20LTD/Desktop/assets/outputs/js/utils.js) (เครื่องมือและตัวช่วย)

ทำหน้าที่จัดเตรียมโครงสร้างข้อมูลไอเวคเตอร์ SVG การแปลภาษาข้อความ และตัวช่วยคัดเลือกสีให้แก่แถบสถานะเพื่อความสวยงาม

### บรรทัดที่ 517-538: ฟังก์ชันแยกสีของป้ายสถานะทรัพย์สิน (`statusClass`)
```javascript
function statusClass(status) {
  const value = normalize(status); // ปรับค่าภาษาไทยและข้อความให้อยู่ในมาตรฐานเดียวกัน (ไม่มีช่องว่างตัดขอบ)
  
  // ตรวจสอบสถานะเพื่อคืนชื่อคลาส CSS ประจำตัวสีนั้นๆ:
  if (value === "ใช้งาน" || value.includes("ใช้งานอยู่") || value === "เสร็จสิ้น" || value === "อนุมัติแล้ว" || value === "คืนแล้ว") {
    return "status-green"; // แสดงผลเป็นป้าย สีเขียว
  }
  if (value === "ไม่ได้ใช้งาน" || value.includes("ไม่ได้")) {
    return "status-blue"; // แสดงผลเป็นป้าย สีน้ำเงิน
  }
  if (value === "เสีย" || value.includes("ชำรุด") || value === "ปฏิเสธ") {
    return "status-red"; // แสดงผลเป็นป้าย สีแดง
  }
  if (value === "รอย้าย" || value.includes("รอย้าย")) {
    return "status-warn"; // แสดงผลเป็นป้าย สีเหลือง (ปรับล่าสุดตามคำสั่ง)
  }
  if (value === "ระหว่างสั่งซื้อ" || value.includes("สั่งซื้อ")) {
    return "status-purple"; // แสดงผลเป็นป้าย สีม่วง
  }
  if (value === "ส่งซ่อม" || value.includes("ซ่อม")) {
    return "status-orange"; // แสดงผลเป็นป้าย สีส้ม (ปรับล่าสุดตามคำสั่ง)
  }
  return "status-gray"; // หากไม่ตรงกับสถานะใดเลย ให้แสดงผลเป็นป้าย สีเทา
}
```

---

## 3. ไฟล์: [auth.js](file:///c:/Users/SuphawadiChampathi/OneDrive%20-%20KOCH%20PACKAGING%20AND%20PACKING%20SERVICES%20CO%20LTD/Desktop/assets/outputs/js/auth.js) (ความปลอดภัยและการล็อกอิน)

จัดการสิทธิ์ผู้ดูแลระบบ ความถูกต้องของรหัสผ่าน ตลอดจนสิทธิ์การเข้าถึงข้อมูล

### บรรทัดที่ 907-921: ฟังก์ชันอัปเดตและยืนยันรหัสผ่านใหม่ (`submitUserPassword`)
```javascript
function submitUserPassword(idx) {
  const user = DATA.users[Number(idx)]; // ค้นหาบัญชีผู้ใช้ในระบบตามลำดับ (Index) ที่ได้รับมา
  if (!user) return; // หากไม่พบผู้ใช้งานให้ยุติการทำงานของฟังก์ชันทันที
  
  const newPw = modalValue("[data-user-field='password']"); // ดึงค่ารหัสผ่านใหม่จากช่องกรอกข้อมูลตัวแรก
  const confirmPw = modalValue("[data-user-field='passwordConfirm']"); // ดึงค่ารหัสผ่านยืนยันจากช่องกรอกข้อมูลตัวที่สอง
  
  if (!newPw) { showToast(t("กรุณากรอกรหัสผ่านใหม่", "Please enter a new password")); return; } // ตรวจสอบความว่างเปล่าของช่องรหัสใหม่
  if (!confirmPw) { showToast(t("กรุณายืนยันรหัสผ่านใหม่", "Please confirm the new password")); return; } // ตรวจสอบความว่างเปล่าของช่องยืนยันรหัสใหม่
  
  if (newPw !== confirmPw) { // นำค่าที่กรอกมาเปรียบเทียบกัน
    showToast(t("รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ไม่ตรงกัน", "New password and confirmation do not match")); // ส่งเสียงเตือนกรณีพิมพ์ไม่ตรงกัน
    return; // ยุติกระบวนการ ไม่บันทึกค่าลงเซิร์ฟเวอร์
  }
  
  const isOwnPassword = state.user && String(state.user.username).toLowerCase() === String(user.username).toLowerCase(); // เช็คว่าเป็นรหัสผ่านของบัญชีที่ล็อกอินอยู่ปัจจุบันหรือไม่
  user.password = newPw; // เขียนทับรหัสผ่านเดิมด้วยรหัสผ่านใหม่ที่ยืนยันแล้ว
  state.modal = null; // ปิดป๊อปอัปหน้าต่างแก้ไขรหัสผ่านลงทันที
  persistLocal(); // เซฟข้อมูลใหม่ลงเครื่อง (ส่งคำสั่งบันทึกเข้าเซิร์ฟเวอร์และ Supabase โดยอัตโนมัติ)
  render(); // อัปเดตตารางรายชื่อผู้ใช้ที่อยู่ด้านหลัง
  showToast(isOwnPassword ? t("เปลี่ยนรหัสผ่านเรียบร้อย", "Password changed successfully") : t("รีเซ็ตรหัสผ่านเรียบร้อย", "Password reset successfully")); // แสดงความยินดีแก่ผู้ใช้งาน
}
```

---

## 4. ไฟล์: [shell.js](file:///c:/Users/SuphawadiChampathi/OneDrive%20-%20KOCH%20PACKAGING%20AND%20PACKING%20SERVICES%20CO%20LTD/Desktop/assets/outputs/js/shell.js) (โครงสร้างหน้าจอหลักและฟอร์ม)

กำหนดองค์ประกอบหลักของระบบ เช่น แถบเมนูด้านซ้าย หน้าต่างยืนยันการทำรายการ และแบบฟอร์มแก้ไขผู้ใช้งาน

### บรรทัดที่ 493-503: ฟอร์มป๊อปอัปเปลียนรหัสผ่าน (`reset-user-pw`)
```javascript
  if (modal.type === "reset-user-pw") { // เมื่อผู้ใช้คลิกปุ่มขอเปลี่ยนรหัสผ่าน
    const user = DATA.users[modal.index]; // ดึงข้อมูลรายละเอียดของเป้าหมายผู้ใช้รายนั้น
    if (!user) return ""; // ป้องกันข้อผิดพลาดกรณีไม่มีผู้ใช้
    const isOwnPassword = state.user && String(state.user.username).toLowerCase() === String(user.username).toLowerCase(); // ค้นหาว่าเป้าหมายคือเจ้าตัวที่ล็อกอินอยู่หรือไม่
    return formModal( // สั่งการแสดงผลหน้าต่างย่อย (Modal)
      isOwnPassword ? t("เปลี่ยนรหัสผ่าน", "Change Password") : t("รีเซ็ตรหัสผ่าน", "Reset Password"), "settings", // กำหนดชื่อหัวข้อป๊อปอัป
      `<h3>${isOwnPassword ? t("บัญชีของคุณ", "Your Account") : t("ผู้ใช้งาน", "User")}: ${esc(user.username)}</h3> <!-- แสดงชื่อ Username ที่กำลังจะถูกแก้ไข -->
       <div class="field"><label>${t("รหัสผ่านใหม่", "New Password")}</label><input class="input" data-user-field="password" type="password" value=""></div> <!-- ช่องรหัสผ่านใหม่ -->
       <div class="field"><label>${t("ยืนยันรหัสผ่านใหม่", "Confirm New Password")}</label><input class="input" data-user-field="passwordConfirm" type="password" value=""></div> <!-- ช่องยืนยันรหัสผ่านใหม่ (เพิ่มล่าสุด) -->
       <button class="primary-btn" data-submit-user-pw="${modal.index}">${icon("check")} ${t("อัปเดตรหัสผ่าน", "Update Password")}</button>` // ปุ่มกดส่งบันทึกค่าใหม่
    );
  }
```

---

## 5. ไฟล์: [asset-control-server.cjs](file:///c:/Users/SuphawadiChampathi/OneDrive%20-%20KOCH%20PACKAGING%20AND%20PACKING%20SERVICES%20CO%20LTD/Desktop/assets/outputs/asset-control-server.cjs) (เซิร์ฟเวอร์หลังบ้าน API Node.js)

ควบคุมกระบวนการดึงข้อมูลและการบันทึกทั้งหมดระหว่าง Client เบราว์เซอร์กับฐานข้อมูลหลักในระบบ Supabase Cloud

### บรรทัดที่ 280-290: CORS Headers สำหรับรับส่งข้อความข้ามโปรโตคอล
```javascript
res.writeHead(200, {
  "Content-Type": "application/json", // กำหนดลักษณะข้อมูลตอบกลับเป็น JSON
  "Access-Control-Allow-Origin": "*", // อนุญาตให้คำขอเข้าถึงจากทุกต้นทาง (เช่น file://) เพื่อแก้ปัญหาระบบถูกบล็อกจากนโยบายความปลอดภัยเบราว์เซอร์
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // ระบุประเภทคำขอที่ยินยอมให้เรียกใช้งานได้
  "Access-Control-Allow-Headers": "Content-Type", // ระบุว่ายินยอมให้ส่ง Content-Type เข้ามาในระบบได้
});
```
