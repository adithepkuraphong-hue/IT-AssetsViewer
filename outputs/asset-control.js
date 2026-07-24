// ============================================================
// utils.js — Helper functions (icons, text, sorting, UI)
// ============================================================

const iconPaths = {
  box: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M21 8v10l-9 5"/><path d="M3 8v10l9 5"/><path d="M12 13v10"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  briefcase: '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  externalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  monitor: '<rect width="18" height="12" x="3" y="4" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/>',
  laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9"/><path d="M2 20h20"/>',
  network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M12 8v8"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.5-3.5a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.5 3.5Z"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6"/><path d="M9 10h6"/><path d="M9 18h4"/>',
  checkout: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
  bell: '<path d="M10.3 21a2 2 0 0 0 3.4 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
  search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v8"/><path d="M18 9h2a2 2 0 0 1 2 2v11"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  map: '<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  tag: '<path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.58 8.58a2 2 0 0 0 2.83 0L21.17 14a2 2 0 0 0 0-2.83l-8.58-8.58Z"/><path d="M7 7h.01"/>',
  list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  logout: '<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>',
  menu: '<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7H7v7"/><path d="M7 3v5h8"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7C3.58 7.89 7.26 5 12 5s8.42 2.89 9.94 6.65a1 1 0 0 1 0 .7C20.42 16.11 16.74 19 12 19s-8.42-2.89-9.94-6.65Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="m15 18-.7-3.1"/><path d="M8.5 14.5 7 18"/><path d="M12 15v3"/><path d="m2 2 20 20"/><path d="M10.7 5.1A10.8 10.8 0 0 1 12 5c4.74 0 8.42 2.89 9.94 6.65a1 1 0 0 1 0 .7 11.3 11.3 0 0 1-2.1 3.2"/><path d="M6.7 6.7C4.6 7.9 3 9.7 2.06 11.65a1 1 0 0 0 0 .7C3.58 16.11 7.26 19 12 19c1.45 0 2.8-.27 4-.77"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.5 8.8a1 1 0 0 1-1 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.3-2.7a1 1 0 0 1 1.4 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
};

function icon(name) {
  if (name === "logout") {
    return `<svg class="icon logout-icon" viewBox="0 -960 960 960" aria-hidden="true">${iconPaths[name]}</svg>`;
  }
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.box}</svg>`;
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
}
function t(thText, enText) {
  return (typeof state !== "undefined" ? state.lang : "th") === "th" ? thText : enText;
}

const UI_TRANSLATIONS = {
  "ระบบควบคุมทรัพย์สิน IT": "IT Asset Control System",
  "จัดการอุปกรณ์ การซ่อมบำรุง การยืมคืน และข้อมูลหลักในระบบเดียว พร้อมสิทธิ์การเข้าถึงแบบ Admin และ User": "Manage assets, maintenance, checkout, and master data in one system with Admin and User access.",
  "เข้าสู่ระบบ": "Sign In",
  "เข้าสู่ระบบด้วย Microsoft": "Sign in with Microsoft",
  "ตั้งค่า Microsoft Client ID ได้ที่ Settings > Data & Cloud > Microsoft Login": "Configure the Microsoft Client ID in Settings > Data & Cloud > Microsoft Login",
  "กรุณาตั้งค่า Microsoft Client ID ก่อน": "Please configure the Microsoft Client ID first",
  "เข้าสู่ระบบด้วย Microsoft สำเร็จ": "Signed in with Microsoft",
  "เข้าสู่ระบบด้วย Microsoft ไม่สำเร็จ": "Microsoft sign-in failed",
  "เลือกสิทธิ์เพื่อดูเมนูและข้อมูลตามบทบาท": "Sign in to view menus and data based on your role.",
  "ถ้าแผนกเป็น IT จะเข้าเป็น Admin, แผนกอื่นจะเข้าเป็น User": "IT department accounts sign in as Admin. Other departments sign in as User.",
  "เห็นทุกเมนู รวม Master Data และประวัติ Login": "Can access all menus, including Master Data and Login History.",
  "กรุณากรอก Username": "Please enter a username.",
  "กรุณากรอกรหัสผ่าน": "Please enter a password.",
  "ไม่พบเมลบริษัทนี้ในฐานข้อมูลผู้ใช้": "This company email was not found in the user database.",
  "หรือ Password ไม่ถูกต้อง": "or the password is incorrect.",
  "Password ไม่ถูกต้อง": "Incorrect password.",
  "ภาษา / Language": "Language",
  "ย่อเมนู": "Collapse Menu",
  "ขยายเมนู": "Expand Menu",
  "Dashboard": "Dashboard",
  "ทรัพย์สิน": "Assets",
  "คอมพิวเตอร์": "Computer",
  "อุปกรณ์อื่น ๆ": "Other Equipment",
  "การบำรุงรักษา": "Maintenance",
  "ประวัติการซ่อม": "Maintenance History",
  "แจ้งซ่อมบำรุง": "Maintenance Request",
  "ยืม-คืนอุปกรณ์": "Check Out",
  "ข้อมูลหลัก (Master)": "Master Data",
  "การแจ้งเตือน": "Notifications",
  "ตั้งค่าระบบ": "Settings",
  "Settings": "Settings",
  "การตั้งค่าระบบ": "System Settings",
  "ทั่วไป": "General",
  "จัดการผู้ใช้": "User Management",
  "ระบบและข้อมูล": "Data & System",
  "ประวัติล็อกอิน": "Login History",
  "ภาพรวมระบบจัดการทรัพย์สิน": "Asset management overview",
  "ทรัพย์สินทั้งหมด": "Total Assets",
  "ใช้งานอยู่": "In Use",
  "พร้อมใช้งาน": "Available",
  "ชำรุด/เสีย": "Broken / Damaged",
  "สัดส่วนทรัพย์สินตามประเภท": "Asset Group Ratio",
  "คำขอซ่อมรอดำเนินการ": "Open Maintenance Requests",
  "กำลังขอใช้งานอยู่": "Active Checkouts",
  "ทรัพย์สินตามประเภท": "Assets by Type",
  "นับเฉพาะประเภทหลักที่ใช้งานบ่อย": "Counts only common primary asset types",
  "ทรัพย์สินตามบริษัท": "Assets by Company",
  "แยกตามบริษัท KOCH / TNB / SPD": "Grouped by KOCH / TNB / SPD",
  "ข้อมูลไม่ครบ": "Incomplete Data",
  "รายการที่ควรตรวจสอบเพิ่มเติม": "Items that need review",
  "ไม่มี Serial": "Missing Serial",
  "ไม่มีผู้ใช้งาน": "Missing User",
  "จากทรัพย์สินทั้งหมด": "of all assets",
  "จาก Computer Assets": "of Computer Assets",
  "แยกตามระบบปฏิบัติการของ Computer Assets": "Grouped by operating system for Computer Assets",
  "อื่น ๆ / ไม่ระบุ": "Other / Unspecified",
  "อื่น ๆ / ไม่ระบุ:": "Other / Unspecified:",
  "ทรัพย์สิน IT": "IT Assets",
  "อุปกรณ์เครือข่าย": "Network Equipment",
  "เพิ่มใหม่": "Add New",
  "ทุกประเภท": "All Types",
  "ทุกบริษัท": "All Companies",
  "ทุกสถานะ": "All Statuses",
  "รีเซ็ตฟิลเตอร์": "Reset Filters",
  "ค้นหา Asset Code, ยี่ห้อ, Serial, ผู้ใช้งาน...": "Search Asset Code, Brand, Serial, User...",
  "ค้นหา Asset Code, ยี่ห้อ, Serial, สถานที่...": "Search Asset Code, Brand, Serial, Location...",
  "ค้นหา Asset Code, ยี่ห้อ, Serial...": "Search Asset Code, Brand, Serial...",
  "ผู้ใช้งาน / สถานที่": "User / Location",
  "ดูรายละเอียด": "View Details",
  "ค้นหา...": "Search...",
  "Asset Code ↑": "Asset Code ↑",
  "ประเภท": "Type",
  "บริษัท": "Company",
  "ผู้ใช้งาน": "User",
  "สถานที่": "Location",
  "สถานะ": "Status",
  "ไม่พบข้อมูลตามเงื่อนไข": "No records match the filters.",
  "ไม่พบข้อมูล": "No data found.",
  "ประวัติการบำรุงรักษา": "Maintenance History",
  "รายการบันทึกการบำรุงรักษาทั้งหมด": "All maintenance records",
  "คำขอซ่อม": "Maintenance Requests",
  "คำขอซ่อมและบำรุงรักษาทรัพย์สิน": "Asset repair and maintenance requests",
  "รอดำเนินการ": "Pending",
  "กำลังดำเนินการ": "In Progress",
  "เสร็จสิ้น": "Completed",
  "รออนุมัติ": "Waiting Approval",
  "อนุมัติแล้ว": "Approved",
  "ปฏิเสธ": "Rejected",
  "แจ้งซ่อมใหม่": "New Maintenance Request",
  "รายการ ↑": "Item ↑",
  "ทรัพย์สิน ↑": "Asset ↑",
  "หัวข้อ ↑": "Title ↑",
  "หัวข้อ": "Title",
  "แบรนด์": "Brand",
  "ผู้แจ้ง": "Requester",
  "วันที่แจ้ง": "Request Date",
  "ความเร่งด่วน": "Priority",
  "ค่าใช้จ่าย": "Cost",
  "ปานกลาง": "Medium",
  "สูง": "High",
  "เร่งด่วน": "Urgent",
  "ฉุกเฉิน": "Emergency",
  "ซ่อมแก้ไข": "Repair",
  "บำรุงรักษาตามรอบ": "Scheduled Maintenance",
  "การขอใช้งานอุปกรณ์/คืนอุปกรณ์": "Equipment Checkout / Return",
  "จัดการคำขอใช้งาน ติดตามการคืน และสถานะอุปกรณ์": "Manage checkout requests, returns, and asset status.",
  "ขอใช้งานอุปกรณ์": "Request Equipment",
  "กำลังขอใช้งาน": "Checked Out",
  "คืนแล้ว": "Returned",
  "เกินกำหนด": "Overdue",
  "ผู้ขอใช้งาน": "Requester",
  "วันที่ขอใช้": "Checkout Date",
  "วัตถุประสงค์": "Purpose",
  "บริษัท": "Company",
  "แผนก": "Department",
  "ตำแหน่ง": "Position",
  "สถานที่": "Location",
  "ประเภท": "Type",
  "กลุ่มประเภท": "Type Groups",
  "สถานะ": "Status",
  "รหัสบริษัท ↑": "Company Code ↑",
  "ชื่อบริษัท": "Company Name",
  "รหัสแผนก ↑": "Department Code ↑",
  "ชื่อแผนก": "Department Name",
  "รหัสตำแหน่ง ↑": "Position Code ↑",
  "ชื่อตำแหน่ง": "Position Name",
  "รหัสสถานที่ ↑": "Location Code ↑",
  "ชื่อสถานที่": "Location Name",
  "รหัสประเภท ↑": "Type Code ↑",
  "ชื่อประเภท": "Type Name",
  "รหัสกลุ่มประเภท ↑": "Type Group Code ↑",
  "ชื่อกลุ่มประเภท": "Type Group Name",
  "รหัสสถานะ ↑": "Status Code ↑",
  "ชื่อสถานะ": "Status Name",
  "วันที่": "Date",
  "ยืนยัน": "Confirm",
  "อนุมัติ": "Approve",
  "แจ้งคืน": "Return",
  "ยืนยันการคืน": "Confirm Return",
  "แจ้งคืนอุปกรณ์": "Return Equipment",
  "รหัสกลุ่ม ↑": "Group Code ↑",
  "ชื่อกลุ่ม": "Group Name",
  "ข้อมูลหลักของระบบ": "System master data",
  "เพิ่ม": "Add",
  "รหัส": "Code",
  "จัดการ": "Actions",
  "ชื่อ": "Name",
  "จัดการ": "Actions",
  "เพิ่ม Master Data": "Add Master Data",
  "แก้ไข Master Data": "Edit Master Data",
  "บันทึก": "Save",
  "ยกเลิก": "Cancel",
  "ลบ": "Delete",
  "แก้ไข": "Edit",
  "รูปโปรไฟล์": "Profile Picture",
  "เลือกรูปโปรไฟล์": "Choose Profile Photo",
  "อัปโหลดรูปโปรไฟล์": "Upload Profile Photo",
  "อัปโหลดรูป": "Upload Photo",
  "ลบรูป": "Remove Photo",
  "แก้ไขข้อมูลโปรไฟล์": "Edit Profile",
  "ดูรายละเอียด": "View Details",
  "เมนูรายการ": "Action Menu",
  "การแจ้งเตือน": "Notifications",
  "ไม่มีการแจ้งเตือนตามการตั้งค่าปัจจุบัน": "No notifications based on current settings.",
  "ทำเครื่องหมายอ่านทั้งหมด": "Mark All as Read",
  "ทำเครื่องหมายอ่าน": "Mark as Read",
  "ทำเครื่องหมายอ่านแล้ว": "Marked as Read",
  "ทั้งหมด": "All",
  "ยังไม่อ่าน": "Unread",
  "อ่านแล้ว": "Read",
  "ไม่มีทรัพย์สินที่วันประกันจะหมดอายุภายใน 30 วัน": "No assets have warranties expiring within 30 days.",
  "ประกัน": "Warranty",
  "การขอใช้งาน": "Checkout",
  "ระบบ": "System",
  "ซ่อมบำรุง": "Maintenance",
  "ข้อมูลเทคนิค": "Technical Details",
  "ข้อมูลพื้นฐาน": "Basic Information",
  "ข้อมูลหน่วยงาน": "Organization Details",
  "วันที่สำคัญ": "Important Dates",
  "อุปกรณ์เสริม": "Accessories",
  "หมายเหตุ": "Notes",
  "ยี่ห้อ": "Brand",
  "รุ่น": "Model",
  "เลขซีเรียล": "Serial Number",
  "วันที่ซื้อ": "Purchase Date",
  "วันหมดประกัน": "Warranty Expiration Date",
  "วันที่ส่งซ่อม": "Sent for Repair Date",
  "กระเป๋า": "Bag",
  "มี": "Yes",
  "ไม่มี": "No",
  "เพิ่มทรัพย์สิน IT": "Add IT Asset",
  "แก้ไขทรัพย์สิน IT": "Edit IT Asset",
  "รายละเอียดทรัพย์สิน IT": "IT Asset Details",
  "รหัสและประเภททรัพย์สิน": "Asset code and type",
  "บริษัท แผนก สถานที่ และผู้ใช้งาน": "Company, department, location, and user",
  "วันที่ซื้อ วันหมดประกัน และวันส่งซ่อม": "Purchase, warranty, and repair dates",
  "อุปกรณ์ที่มาพร้อมกับทรัพย์สิน": "Accessories included with this asset",
  "รายละเอียดเพิ่มเติม...": "Additional details...",
  "เช่น Dell, HP, Lenovo": "e.g. Dell, HP, Lenovo",
  "เช่น Latitude 5520": "e.g. Latitude 5520",
  "เช่น Windows 11 Pro": "e.g. Windows 11 Pro",
  "รายละเอียด": "Details",
  "ข้อมูลคำขอ": "Request Details",
  "ทรัพย์สิน": "Asset",
  "ข้อมูลผู้แจ้ง": "Requester Details",
  "รายละเอียดปัญหา": "Problem Details",
  "อธิบายปัญหาที่พบ...": "Describe the issue...",
  "หัวข้อคำขอซ่อม": "Maintenance request title",
  "สร้างคำขอ": "Create Request",
  "แก้ไขคำขอซ่อม": "Edit Maintenance Request",
  "รายละเอียดคำขอซ่อม": "Maintenance Request Details",
  "ข้อมูลการอนุมัติ": "Approval Details",
  "วันที่อนุมัติ": "Approval Date",
  "ความคิดเห็นการอนุมัติ": "Approval Note",
  "ขอใช้งานอุปกรณ์ใหม่": "New Equipment Checkout",
  "ชื่อรายการ": "Item Name",
  "กรอกชื่อรายการ": "Enter item name",
  "ข้อมูลทรัพย์สิน": "Asset Details",
  "แสดงเฉพาะทรัพย์สินที่พร้อมใช้งาน หรือรายการล่าสุดหากไม่มีสถานะว่าง": "Shows available assets, or recent items if none are available.",
  "ข้อมูลผู้ขอใช้งาน": "Requester Details",
  "แผนกผู้ขอใช้งาน": "Requester Department",
  "กรอกชื่อผู้ขอใช้งาน": "Enter requester name",
  "วันที่คาดว่าจะคืน": "Expected Return Date",
  "วัตถุประสงค์/หมายเหตุ": "Purpose / Notes",
  "วัตถุประสงค์หรือหมายเหตุเพิ่มเติม...": "Purpose or additional notes...",
  "แก้ไขรายการขอใช้งาน/คืนอุปกรณ์": "Edit Checkout / Return Record",
  "รายละเอียดการขอใช้งาน/คืนอุปกรณ์": "Checkout / Return Details",
  "วันที่คืนจริง": "Actual Return Date",
  "ข้อมูลผู้ดำเนินการ": "Handler Details",
  "ผู้ดำเนินการ": "Handled By",
  "ข้อมูลวันที่": "Date Details",
  "ข้อมูลค่าใช้จ่าย": "Cost Details",
  "รายละเอียดการบำรุงรักษา": "Maintenance Details",
  "แก้ไขรายการบำรุงรักษา": "Edit Maintenance Record",
  "ค่าใช้จ่าย (บาท)": "Cost (THB)",
  "ค่าใช้จ่ายและสถานะ": "Cost and Status",
  "วันที่บำรุงรักษา": "Maintenance Date",
  "วันที่เสร็จสิ้น": "Completion Date",
  "ข้อมูลทั่วไป": "General Information",
  "Settings": "Settings",
  "ข้อมูลองค์กรและการตั้งค่า": "Organization & Preferences",
  "ข้อมูลพื้นฐานและการตั้งค่าการแสดงผล": "Basic organization details and display settings",
  "แก้ไขข้อมูล": "Edit Settings",
  "แก้ไขข้อมูลองค์กร": "Edit Organization Info",
  "แก้ไขข้อมูลพื้นฐานและพรีเฟอเรนซ์ของระบบ": "Edit basic system settings and preferences",
  "ชื่อองค์กร": "Organization Name",
  "ที่อยู่": "Address",
  "ภาษาของระบบ": "System Language",
  "ไทย (Thai)": "Thai",
  "อังกฤษ (English)": "English",
  "ระบบจัดการผู้ใช้": "User Management",
  "จัดการสิทธิ์และบัญชีผู้เข้าใช้งานระบบ": "Manage user accounts and access control roles",
  "เพิ่มผู้ใช้ใหม่": "Add New User",
  "ชื่อผู้ใช้": "Username",
  "เมลบริษัท": "Email",
  "บทบาท": "Role",
  "เปิดใช้งาน": "Active",
  "ระงับใช้งาน": "Disabled",
  "แก้ไขบัญชีผู้ใช้": "Edit User Account",
  "ชื่อ-นามสกุล": "Full Name",
  "อีเมลบริษัท": "Company Email",
  "รหัสผ่าน": "Password",
  "รหัสผ่านใหม่": "New Password",
  "รีเซ็ตรหัสผ่าน": "Reset Password",
  "อัปเดตรหัสผ่าน": "Update Password",
  "ประวัติการเข้าสู่ระบบ": "Login History",
  "เวลา": "Time",
  "ระบบและข้อมูลหลัก": "Data & System Controls",
  "สำรองข้อมูล กู้คืนระบบ และเช็คสถานะการเชื่อมต่อคลาวด์": "Backup/restore the database and check cloud connection status.",
  "สำรองและกู้คืนข้อมูล (Backup & Restore)": "Backup & Restore",
  "สำรองข้อมูลทรัพย์สิน ประวัติการซ่อมบำรุง และบัญชีผู้ใช้ทั้งหมดเป็นไฟล์ JSON": "Download or restore the full asset database, maintenance history, and user accounts as a JSON file.",
  "สำรองข้อมูล (Export JSON)": "Export Database",
  "กู้คืนข้อมูล (Import JSON)": "Import Database",
  "การเชื่อมต่อฐานข้อมูล": "Database Connection",
  "รายละเอียดที่อยู่และสถานะการเชื่อมต่อ Cloud Supabase": "Cloud Supabase connection details and status.",
  "โหมดการทำงาน": "System Mode",
  "เซิร์ฟเวอร์ (API)": "Server API",
  "เครื่องเดี่ยว (Standalone)": "Standalone",
  "แหล่งข้อมูลหลัก": "Data Source",
  "ที่อยู่ฐานข้อมูล": "Database Endpoint",
  "สถานะการเชื่อมต่อ": "Connection Status",
  "รอการตรวจสอบ...": "Pending check...",
  "กำลังตรวจสอบ...": "Checking...",
  "ตรวจสอบการเชื่อมต่อ": "Test Connection",
  "เชื่อมต่อสำเร็จ (ออนไลน์)": "Connected (Online)",
  "เชื่อมต่อไม่ได้ (ทำงานในโหมด Standalone)": "Disconnected (Standalone Mode)",
  "ล้มเหลว (เกิดข้อผิดพลาดจากเซิร์ฟเวอร์)": "Failed (Server Error)",
  "ล้มเหลว (ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้)": "Failed (Network Error)",
  "การแจ้งเตือน": "Notifications",
  "ตั้งค่าการแจ้งเตือนต่างๆ ของระบบ": "Configure system notifications and warnings.",
  "แจ้งเตือนบำรุงรักษา": "Maintenance Warnings",
  "แจ้งเตือนเมื่อถึงกำหนดบำรุงรักษาตามรอบ": "Notify when scheduled maintenance is due.",
  "แจ้งเตือนประกัน": "Warranty Warnings",
  "แจ้งเตือนเมื่อใกล้หมดประกัน": "Notify when warranty expiration is near.",
  "แจ้งเตือนล่วงหน้า (วัน)": "Warranty Alert Window (Days)",
  "แจ้งเตือนคืนอุปกรณ์ล่วงหน้า (วัน)": "Return Alert Window (Days)",
  "ยืนยันการออกจากระบบ": "Confirm Logout",
  "ต้องการออกจากระบบหรือไม่?": "Do you want to log out?",
  "หากยืนยัน ระบบจะกลับไปที่หน้าเข้าสู่ระบบ และต้องกรอก Username/Password ใหม่อีกครั้ง": "After logging out, you will return to the sign-in page and need to enter your username/password again.",
  "ยืนยันออกจากระบบ": "Log Out",
  "ใช้งาน": "In Use",
  "ไม่ได้ใช้งาน": "Not In Use",
  "เสีย": "Broken",
  "ส่งซ่อม": "Sent for Repair",
  "ระหว่างสั่งซื้อ": "Ordering",
  "รอย้าย": "Waiting Move",
  "ไม่มีสิทธิ์เข้าถึง Master Data": "Not authorized to access Master Data",
  "ไม่มีสิทธิ์เข้าถึงหน้านี้": "Not authorized to access this page",
  "ไม่มีสิทธิ์ดูประวัติการเข้าสู่ระบบ": "Not authorized to view login history",
  "User ไม่มีสิทธิ์เข้าถึง Master Data": "User is not authorized to access Master Data",
  "User ไม่มีสิทธิ์เข้าถึงหน้านี้": "User is not authorized to access this page",
  "User ไม่มีสิทธิ์ดูประวัติการเข้าสู่ระบบ": "User is not authorized to view login history",
  "ไม่ระบุ": "Unspecified",
  "-- ไม่ระบุ --": "-- Unspecified --",
  "ไม่ระบุ --": "Unspecified --",
  "เลือกแผนก": "Select department",
  "กรอกชื่อผู้แจ้ง": "Enter requester name",
  "กรอกชื่อผู้ขอใช้งาน": "Enter requester name",
  "ใช้งานภายในบริษัท": "Internal company use",
  "เพิ่มจากหน้าเว็บ": "Added from web app",
  "สำเร็จ": "Success",
  "ไม่สำเร็จ": "Failed",
  "เพิ่มทรัพย์สินแล้ว": "Asset added successfully",
  "บันทึกการแก้ไขทรัพย์สินแล้ว": "Asset changes saved",
  "ลบทรัพย์สินแล้ว": "Asset deleted",
  "ส่งคำขอซ่อมแล้ว": "Maintenance request submitted",
  "ส่งคำขอใช้งานแล้ว": "Checkout request submitted",
  "บันทึก Master Data แล้ว": "Master Data saved",
  "ลบข้อมูลหลักแล้ว": "Master Data deleted",
  "ลบข้อมูลทั้งหมด": "Delete All Data",
  "ยืนยันการลบข้อมูลทั้งหมด": "Confirm Delete All Data",
  "ต้องการลบข้อมูลทั้งหมดหรือไม่?": "Do you want to delete all data?",
  "การลบนี้จะลบทรัพย์สิน ประวัติ รายการยืมคืน การแจ้งเตือน และ Master Data ทั้งหมด แต่จะคงบัญชีผู้ใช้และการตั้งค่าไว้": "This will delete all assets, records, checkout data, notifications, and master data, while keeping user accounts and settings.",
  "ยืนยันลบข้อมูลทั้งหมด": "Confirm Delete All",
  "ลบข้อมูลทั้งหมดเรียบร้อยแล้ว": "All data deleted successfully",
  "ยืนยันการลบ": "Confirm Delete",
  "ต้องการลบข้อมูลนี้หรือไม่?": "Do you want to delete this item?",
  "ระบบจะลบข้อมูลนี้หลังจากกดยืนยันเท่านั้น": "The system will delete this item only after you confirm.",
  "ยืนยันลบ": "Confirm Delete",
  "ลบข้อมูลเรียบร้อยแล้ว": "Deleted successfully",
  "ลบรายการแล้ว": "Record deleted",
  "บันทึก Settings แล้ว": "Settings saved",
  "บันทึกข้อมูลองค์กรสำเร็จ": "Organization settings saved",
  "กู้คืนข้อมูลเรียบร้อยแล้ว": "Database restored successfully",
  "ส่งออกข้อมูลสำรองเสร็จสิ้น": "Backup exported successfully",
  "บันทึกฐานข้อมูลไม่สำเร็จ ใช้ข้อมูลในเครื่องไว้ก่อน": "Database save failed. Local data is kept for now.",
  "อัปเดตข้อมูลจากฐานข้อมูลแล้ว": "Database data updated",
  "เพิ่มผู้ใช้ใหม่เรียบร้อย": "New user added successfully",
  "อัปเดตข้อมูลผู้ใช้เรียบร้อย": "User information updated",
  "อัปเดตสถานะผู้ใช้งานแล้ว": "User status updated",
  "ลบผู้ใช้เรียบร้อยแล้ว": "User deleted successfully",
  "รีเซ็ตรหัสผ่านเรียบร้อย": "Password reset successfully",
  "กรุณากรอกรหัสผ่านใหม่": "Please enter a new password.",
  "คุณไม่สามารถลบบัญชีของตัวเองที่กำลังใช้งานได้": "You cannot delete the account currently in use.",
  "คุณต้องการลบผู้ใช้": "Do you want to delete user",
  "นี้มีอยู่แล้ว": "already exists",
  "โครงสร้างไฟล์ข้อมูลสำรองไม่ถูกต้อง (Missing assets arrays)": "Invalid backup file structure (missing asset arrays)",
  "ไม่สามารถอ่านไฟล์สำรองได้:": "Cannot read backup file:",
  "รอ": "Waiting",
  "กำลัง": "In Progress",
  "เกิน": "Overdue",
  "เร่ง": "Urgent",
  "ว่าง": "Available",
  "ก่อนหน้า": "Previous",
  "ถัดไป": "Next",
  "รายการ": "items",
  "วัน": "days",
};

function translateDynamicText(text) {
  const rules = [
    [/^รวม (\d+) รายการ \(Computer: (\d+), Other: (\d+)\)$/u, "Total $1 items (Computer: $2, Other: $3)"],
    [/^ทั้งหมด (\d+) รายการ$/u, "Total $1 items"],
    [/^(\d+) รายการ \/ หน้า$/u, "$1 items / page"],
    [/^(\d+) รายการ$/u, "$1 items"],
    [/^(\d+) จุด$/u, "$1 issues"],
    [/^(\d+)% จากทรัพย์สินทั้งหมด$/u, "$1% of all assets"],
    [/^(\d+)% จาก Computer Assets$/u, "$1% of Computer Assets"],
    [/^อื่น ๆ \/ ไม่ระบุ: (\d+) รายการ$/u, "Other / Unspecified: $1 items"],
    [/^ทั้งหมด \((\d+)\)$/u, "All ($1)"],
    [/^ยังไม่อ่าน \((\d+)\)$/u, "Unread ($1)"],
    [/^อ่านแล้ว \((\d+)\)$/u, "Read ($1)"],
    [/^ทรัพย์สินที่ประกันจะหมดอายุภายใน 30 วัน \((\d+) ยังไม่อ่าน\)$/u, "Assets with warranty expiring within 30 days ($1 unread)"],
    [/^มี (\d+) รายการที่ยังไม่ได้อ่าน$/u, "$1 unread items"],
    [/^เหลือ (\d+) วัน$/u, "$1 days left"],
    [/^(.+) · เหลือ (\d+) วัน$/u, "$1 · $2 days left"],
    [/^Assets Computer \((\d+)\)$/u, "Computer Assets ($1)"],
    [/^Assets Other \((\d+)\)$/u, "Other Assets ($1)"],
    [/^User ไม่มีสิทธิ์(.+)$/u, "User is not authorized$1"],
  ];
  for (const [pattern, replacement] of rules) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }
  return "";
}

function translateTextValue(value) {
  if ((typeof state !== "undefined" ? state.lang : "th") !== "en") return value;
  const text = String(value ?? "");
  const trimmed = text.trim();
  if (!trimmed) return value;
  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  const normalized = trimmed.replace(/\s+/g, " ");
  const translated = UI_TRANSLATIONS[trimmed] || UI_TRANSLATIONS[normalized] || translateDynamicText(normalized);
  return translated ? `${leading}${translated}${trailing}` : value;
}

function translateUi(root = document.body) {
  const lang = typeof state !== "undefined" ? state.lang : "th";
  document.documentElement.lang = lang === "en" ? "en" : "th";
  if (lang !== "en" || !root) return;
  root.querySelectorAll?.("[placeholder], [title], [aria-label]").forEach(element => {
    ["placeholder", "title", "aria-label"].forEach(attr => {
      if (element.hasAttribute(attr)) element.setAttribute(attr, translateTextValue(element.getAttribute(attr)));
    });
  });
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "SVG", "TEXTAREA"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    node.nodeValue = translateTextValue(node.nodeValue);
  });
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}
function sortText(a, b) {
  return String(a || "").localeCompare(String(b || ""), "th", { numeric: true, sensitivity: "base" });
}
function sortByAlpha(items, keyOrSelector = "assetCode") {
  const selector = typeof keyOrSelector === "function" ? keyOrSelector : item => item?.[keyOrSelector];
  return [...items].sort((a, b) => sortText(selector(a), selector(b)));
}
function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "ไม่ระบุ";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}
function percent(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function parseAssetDate(value) {
  if (value === undefined || value === null) return null;
  const raw = String(value).trim();
  if (!raw || raw === "-") return null;
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const excelEpoch = Date.UTC(1899, 11, 30);
    return startOfLocalDay(new Date(excelEpoch + Number(raw) * 86400000));
  }
  const monthMap = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
    may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8,
    september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
  };
  const textDate = raw.match(/^(\d{1,2})[-\s]([A-Za-z]{3,9})[-\s](\d{4})$/);
  if (textDate) {
    const month = monthMap[textDate[2].toLowerCase()];
    if (month !== undefined) return startOfLocalDay(new Date(Number(textDate[3]), month, Number(textDate[1])));
  }
  const slashDate = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slashDate) return startOfLocalDay(new Date(Number(slashDate[3]), Number(slashDate[2]) - 1, Number(slashDate[1])));
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : startOfLocalDay(parsed);
}
function daysUntil(date) {
  const oneDay = 86400000;
  return Math.round((startOfLocalDay(date) - startOfLocalDay(new Date())) / oneDay);
}
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function toDateInputValue(value) {
  const parsed = parseAssetDate(value);
  return parsed ? formatLocalDate(parsed) : "";
}
function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (window.location.protocol === "file:") {
    return "http://127.0.0.1:8788" + url;
  }
  return url;
}
function statusClass(status) {
  const value = normalize(status);
  if (value === "ใช้งาน" || value.includes("ใช้งานอยู่") || value === "เสร็จสิ้น" || value === "อนุมัติแล้ว" || value === "คืนแล้ว") {
    return "status-green";
  }
  if (value === "ไม่ได้ใช้งาน" || value.includes("ไม่ได้")) {
    return "status-blue";
  }
  if (value === "เสีย" || value.includes("ชำรุด") || value === "ปฏิเสธ") {
    return "status-red";
  }
  if (value === "รอย้าย" || value.includes("รอย้าย")) {
    return "status-warn";
  }
  if (value === "ระหว่างสั่งซื้อ" || value.includes("สั่งซื้อ")) {
    return "status-purple";
  }
  if (value === "ส่งซ่อม" || value.includes("ซ่อม")) {
    return "status-orange";
  }
  return "status-gray";
}
function optionList(values, selected = "", placeholder = "") {
  const unique = [...new Set(values.filter(value => value !== undefined && value !== null && String(value).trim() !== ""))];
  const placeholderHtml = placeholder ? `<option value="">${esc(placeholder)}</option>` : "";
  return placeholderHtml + unique.map(value => `<option value="${esc(value)}" ${String(value) === String(selected) ? "selected" : ""}>${esc(value)}</option>`).join("");
}
function checkedAttr(value) {
  return value ? "checked" : "";
}
function checkboxValue(selector) {
  return !!document.querySelector(selector)?.checked;
}
function uniqueOptions(items, key) {
  return [...new Set(items.map(item => item[key]).filter(Boolean))].sort(sortText);
}
function fieldText(item) {
  return Object.values(item).join(" ").toLowerCase();
}
function filterCollection(items, prefix, fields = {}) {
  const query = normalize(state.filters[`${prefix}-q`]);
  const type = state.filters[`${prefix}-type`] || "";
  const status = state.filters[`${prefix}-status`] || "";
  return items.filter(item => {
    const text = fieldText(item);
    const itemType = fields.type ? item[fields.type] : item.type;
    const itemStatus = fields.status ? item[fields.status] : item.status;
    return (!query || text.includes(query))
      && (!type || type === "ทั้งหมด" || itemType === type)
      && (!status || status === "ทั้งหมด" || itemStatus === status);
  });
}
function paginationWindow(current, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set([1, pageCount, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach(page => pages.add(page));
  if (current >= pageCount - 2) [pageCount - 3, pageCount - 2, pageCount - 1].forEach(page => pages.add(page));
  const sorted = [...pages].filter(page => page >= 1 && page <= pageCount).sort((a, b) => a - b);
  return sorted.flatMap((page, index) => {
    if (!index) return [page];
    return page - sorted[index - 1] > 1 ? ["...", page] : [page];
  });
}
function tableFromRows(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function infoCard(title, rows) {
  return `<div class="info-card"><div class="info-title">${title}</div>${rows.map(([label, value]) => `<div class="info-row"><span>${esc(label)}</span><strong>${esc(value || "-")}</strong></div>`).join("")}</div>`;
}
function accessoryCard(item) {
  return `<div class="info-card"><div class="info-title">อุปกรณ์เสริม</div><div class="accessory-grid">${[
    ["Adapter", item.adapter],
    ["Mouse", item.mouse],
    ["กระเป๋า", item.laptopBag],
  ].map(([label, value]) => `<div class="accessory">${label}<small>${value ? "✓ มี" : "-"}</small></div>`).join("")}</div></div>`;
}
function formSection(title, subtitle, body) {
  return `<section class="form-section"><h3>${title}</h3>${subtitle ? `<p class="subtext">${subtitle}</p>` : ""}${body}</section>`;
}
function modalFooter(saveLabel, submitAttr) {
  return `<div class="modal-footer"><button class="ghost-btn" data-close-modal>ยกเลิก</button><button class="primary-btn" ${submitAttr}>${icon("save")} ${saveLabel}</button></div>`;
}
function moreButton(collection, index) {
  return recordActionButton(collection, index);
}
function renderMiniCards(cards, className = "") {
  return `<section class="cards-row ${className}">${cards.map(card => `<article class="panel mini-card ${card.cls || ""}"><span>${icon(card.icon)}</span><div><div>${esc(card.label)}</div><div class="value">${card.value}</div></div></article>`).join("")}</section>`;
}
function renderPageSizeSelector(key) {
  if (!key || key.startsWith("notifications")) return "";
  const perPage = getPageSize(key);
  const sizes = [5, 10, 20, 50];
  const sizeOptions = sizes.map(size => `
    <option value="${size}" ${perPage === size ? "selected" : ""}>${t(`${size} รายการ / หน้า`, `${size} items / page`)}</option>
  `).join("");
  return `<label class="filter-select">${icon("list")}<select class="select page-size-select" data-page-size-key="${key}">
    ${sizeOptions}
  </select></label>`;
}
function renderPagination(total, key, perPage = getPageSize(key)) {
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const current = pageFor(key, total, perPage);
  const pageWindow = paginationWindow(current, pageCount);
  const pageButtons = pageWindow.map(item => item === "..."
    ? `<span class="page-ellipsis">...</span>`
    : `<button class="page-btn ${item === current ? "active" : ""}" data-page-key="${key}" data-page="${item}">${item}</button>`
  ).join("");
  return `<div class="pagination"><span>${t(`ทั้งหมด ${total} รายการ`, `Total ${total} items`)}</span><div class="page-buttons-wrap"><button class="page-btn" data-page-key="${key}" data-page="${Math.max(1, current - 1)}" ${current === 1 ? "disabled" : ""}>${t("ก่อนหน้า", "Previous")}</button>${pageButtons}<button class="page-btn" data-page-key="${key}" data-page="${Math.min(pageCount, current + 1)}" ${current === pageCount ? "disabled" : ""}>${t("ถัดไป", "Next")}</button></div></div>`;
}
function pageHeading(iconName, title, subtitle, action = "") {
  return `<div class="page-title-row">
    <div class="page-heading"><span class="heading-icon">${icon(iconName)}</span><div><h1>${title}</h1><p class="subtext">${subtitle}</p></div></div>
    ${action}
  </div>`;
}
function kpi(label, value, iconName, className = "", dataAttr = "") {
  return `<article class="kpi-card ${className}" ${dataAttr}><div><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div></div><span class="kpi-icon">${icon(iconName)}</span></article>`;
}
function simpleToolbar(prefix, typeOptions = [], statusOptions = []) {
  return `<div class="toolbar">
    <div class="search-box">${icon("search")}<input class="input" data-filter="${prefix}-q" value="${esc(state.filters[`${prefix}-q`] || "")}" placeholder="ค้นหา..."></div>
    <div class="filter-row">
      ${selectFilter(`${prefix}-type`, "ทั้งหมด", typeOptions, "wrench")}
      ${selectFilter(`${prefix}-status`, "ทุกสถานะ", statusOptions, "filter")}
      ${renderPageSizeSelector(prefix)}
      ${resetFilterButton(prefix, prefix)}
    </div>
  </div>`;
}
function selectFilter(key, label, options, iconName) {
  return `<label class="filter-select">${icon(iconName)}<select class="select" data-filter-change="${key}">
    <option value="">${label}</option>
    ${options.map(option => `<option value="${esc(option)}" ${(state.filters[key] || "") === option ? "selected" : ""}>${esc(option)}</option>`).join("")}
  </select></label>`;
}
function resetFilterButton(prefix, pageKey) {
  return `<button class="ghost-btn reset-filter-btn" data-reset-filters="${prefix}" data-reset-page-key="${pageKey}">${icon("x")} รีเซ็ตฟิลเตอร์</button>`;
}
function selectedAssetOptions(group = "computer") {
  const list = listForGroup(group);
  const source = sortByAlpha(list, "assetCode");
  return source.slice(0, 80).map(item => {
    const index = list.indexOf(item);
    return `<option value="${esc(assetRef(group, index))}">${esc(item.assetCode)} - ${esc(item.brand || "-")} ${esc(item.model || item.type || "")}</option>`;
  }).join("");
}
function modalValue(selector, fallback = "") {
  return document.querySelector(selector)?.value?.trim() || fallback;
}



// ============================================================
// data.js — State, DATA, constants, and API/persistence logic
// ============================================================

let DATA = window.ASSET_CONTROL_DATA;
const LOCAL_DATA_KEY = "asset-control-local-data";
const DATA_SCHEMA_VERSION = "asset-code-dedupe-v3-admin-reset";

// Auto-route API requests to local node server if running under file:// protocol
if (window.location.protocol === "file:") {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === "string" && input.startsWith("/api/")) {
      input = "http://127.0.0.1:8788" + input;
    }
    return originalFetch(input, init);
  };
}
const DATABASE_API_ENABLED = true;
let databaseVersion = null;
let databaseSaveTimer = null;
let databaseSaveInFlight = false;
let databaseSaveQueued = false;
const SOURCE_ID = `${DATA.sourceId || DATA.generatedAt || "default-source"}:${DATA_SCHEMA_VERSION}`;
const savedLocal = (() => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_DATA_KEY) || "{}");
  } catch {
    return {};
  }
})();
const hasCurrentLocalData = !DATABASE_API_ENABLED && savedLocal.sourceId === SOURCE_ID && savedLocal.data;
if (hasCurrentLocalData) {
  DATA.computerAssets = savedLocal.data.computerAssets || DATA.computerAssets;
  DATA.otherAssets = savedLocal.data.otherAssets || DATA.otherAssets;
  DATA.master = savedLocal.data.master || DATA.master;
  DATA.maintenanceHistory = savedLocal.data.maintenanceHistory || DATA.maintenanceHistory;
  DATA.maintenanceRequests = savedLocal.data.maintenanceRequests || DATA.maintenanceRequests;
  DATA.checkoutRecords = savedLocal.data.checkoutRecords || DATA.checkoutRecords;
  DATA.notifications = savedLocal.data.notifications || DATA.notifications;
  DATA.loginHistory = savedLocal.data.loginHistory || DATA.loginHistory;
  DATA.auditLogs = savedLocal.data.auditLogs || DATA.auditLogs;
  DATA.users = savedLocal.data.users || DATA.users;
}

const state = {
  user: JSON.parse(localStorage.getItem("asset-control-user") || "null"),
  clientIp: "local",
  route: "dashboard",
  drawerOpen: false,
  modal: null,
  actionMenu: null,
  filters: {},
  masterTab: "companies",
  settingsTab: "general",
  loginFilterStatus: "all",
  loginLimit: "20",
  editingGeneral: false,
  settingsDirty: false,
  lang: localStorage.getItem("asset-control-lang") || "th",
  notificationTab: "unread",
  sidebarCollapsed: false,
  pages: {},
  pageSizes: {},
  toast: null,
  loginError: "",
  settings: {
    orgName: "KOCH PACKAGING AND PACKING SERVICES CO., LTD.",
    address: "Bang Saen, Chonburi",
    warrantyDays: "30",
    returnDays: "3",
    theme: localStorage.getItem("asset-control-theme") === "dark" ? "Dark" : "Light",
    fontSize: "normal",
    defaultPageSize: "5",
    inAppAlerts: true,
    twoFactor: true,
    twoFactorCode: "123456",
    sessionTimeout: "30",
    defaultRole: "User",
    dataSource: DATA.sourceFile || "Asset Management.xlsx",
    microsoftClientId: localStorage.getItem("asset-control-ms-client-id") || "",
    microsoftTenantId: localStorage.getItem("asset-control-ms-tenant-id") || "common",
    microsoftRedirectUri: localStorage.getItem("asset-control-ms-redirect-uri") || window.location.href.split(/[?#]/)[0],
    ...(hasCurrentLocalData ? savedLocal.settings || {} : {}),
  },
};
const PAGE_SIZE = 5;
const NOTIFICATION_PAGE_SIZE = 3;
const ACTION_MENU_WIDTH = 180;
const ACTION_MENU_HEIGHT = 132;
const ACTION_MENU_GAP = 8;
const COMPUTER_ASSET_TYPES = new Set(["notebook", "tablet", "desktop pc", "macbook", "ipad"]);

function normalizeAssetType(value) {
  return String(value || "").trim().toLowerCase();
}

function isComputerAssetType(value) {
  return COMPUTER_ASSET_TYPES.has(normalizeAssetType(value));
}

function assetGroupForType(value) {
  return isComputerAssetType(value) ? "computer" : "other";
}

function assetForGroup(item, group) {
  let remark = item.remark || "";
  let imageUrl = item.imageUrl || "";
  if (!imageUrl && remark) {
    const match = remark.match(/\[image:\s*([^\s\]]+)\]/);
    if (match) {
      imageUrl = match[1];
      remark = remark.replace(/[\r\n]*\[image:\s*[^\s\]]+\]/, "").trim();
    }
  }
  const base = {
    assetCode: item.assetCode || "-",
    company: item.company || "-",
    type: item.type || "-",
    brand: item.brand || "-",
    model: item.model || "-",
    serial: item.serial || "-",
    location: item.location || "-",
    room: item.room || "-",
    purchaseDate: item.purchaseDate || "-",
    status: item.status === "รอย้ายไป WH บ่อวิน" ? "รอย้าย" : (item.status || "-"),
    warrantyExpirationDate: item.warrantyExpirationDate || "-",
    remark: remark,
    imageUrl: imageUrl,
    sourceSheet: item.sourceSheet ?? null,
    sourceRow: item.sourceRow ?? null,
    user: item.user || "-",
    department: item.department || "-",
    position: item.position || "-",
    sentForRepairDate: item.sentForRepairDate || "-",
  };
  if (group === "computer") {
    return {
      ...base,
      rustDeskId: item.rustDeskId || "-",
      windowsVersion: item.windowsVersion || "-",
      adapter: item.adapter === true,
      mouse: item.mouse === true,
      laptopBag: item.laptopBag === true,
      syncOneDrive: item.syncOneDrive === true,
    };
  }

  // Dynamic custom fields for other groups
  const dynamicFields = [
    "material", "dimensions", "machineNumber",
    "licensePlate", "chassisNumber", "startingMileage", "fuelType",
    "powerRating", "voltage", "rpm",
    "maxRating", "maintenanceCycle", "breakerCode",
    "licenseKey", "licenseType", "licenseSeats"
  ];
  dynamicFields.forEach(field => {
    if (item[field] !== undefined) {
      base[field] = item[field];
    }
  });

  const dynamicChecks = [
    "cushion", "cabinetKey", "extensionCord",
    "easyPass", "spareTire", "dashcam",
    "userManual", "toolKit",
    "safetySign", "controlCabinetKey",
    "installManual", "downloadLink"
  ];
  dynamicChecks.forEach(check => {
    if (item[check] !== undefined) {
      base[check] = item[check] === true;
    }
  });
  return base;
}

function normalizeAssetCollections(data = DATA) {
  const computerAssets = [];
  const otherAssets = [];
  [...(data.computerAssets || []), ...(data.otherAssets || [])].forEach(item => {
    const group = assetGroupForType(item.type);
    if (group === "computer") computerAssets.push(assetForGroup(item, "computer"));
    else otherAssets.push(assetForGroup(item, "other"));
  });
  data.computerAssets = computerAssets;
  data.otherAssets = otherAssets;
}

normalizeAssetCollections(DATA);

// --- Asset helpers ---
function allAssets() {
  return [
    ...DATA.computerAssets.map(item => ({ ...item, group: "computer" })),
    ...DATA.otherAssets.map(item => ({ ...item, group: "other" })),
  ];
}
function listForGroup(group) {
  return group === "computer" ? DATA.computerAssets : DATA.otherAssets;
}
function itemForGroupIndex(group, index) {
  return listForGroup(group)[Number(index)];
}
function assetRef(group, index) {
  return `${group}:${index}`;
}
function parseAssetRef(value, fallbackGroup = "computer") {
  const [rawGroup, rawIndex] = String(value || "").split(":");
  const group = rawGroup === "other" || rawGroup === "computer" ? rawGroup : fallbackGroup;
  const index = Number(rawIndex);
  return { group, index: Number.isInteger(index) ? index : -1 };
}
function itemForAssetRef(value, fallbackGroup = "computer") {
  const { group, index } = parseAssetRef(value, fallbackGroup);
  return { group, index, item: itemForGroupIndex(group, index) };
}
function isBlankAssetValue(value) {
  const text = normalize(value);
  return !text || text === "-" || text === "n/a" || text === "null" || text === "undefined";
}
function isRepairOrBrokenStatus(status) {
  const text = normalize(status);
  return text.includes("เสีย") || text.includes("ซ่อม");
}
function isDashboardBrokenAsset(item) {
  const type = normalizeAssetType(item.type);
  return (type === "notebook" || type === "tablet" || type === "macbook" || type === "desktop pc")
    && isRepairOrBrokenStatus(item.status);
}
function isAvailableComputer(item) {
  const status = normalize(item.status);
  const type = normalizeAssetType(item.type);
  return (type === "notebook" || type === "tablet")
    && isBlankAssetValue(item.user)
    && status.includes("ไม่ได้ใช้งาน")
    && !isRepairOrBrokenStatus(status);
}
function stats() {
  const computer = DATA.computerAssets.length;
  const other = DATA.otherAssets.length;
  const total = computer + other;
  const assets = allAssets();
  return {
    computer, other, total,
    inUse: DATA.computerAssets.filter(item => normalize(item.status) === "ใช้งาน").length,
    available: DATA.computerAssets.filter(isAvailableComputer).length,
    broken: assets.filter(isDashboardBrokenAsset).length,
  };
}

// --- User helpers ---
function defaultUsers() {
  return [
    { username: "admin", email: "admin@kochpackaging.co.th", password: "admin123", name: "Admin User", department: "IT", role: "admin", active: true },
    { username: "user", email: "user@kochpackaging.co.th", password: "user123", name: "User Name", department: "Accounting", role: "user", active: true },
  ];
}
function registeredUsers() {
  if (!Array.isArray(DATA.users) || DATA.users.length === 0) DATA.users = defaultUsers();
  const defaults = defaultUsers();
  DATA.users = DATA.users.map(user => {
    const fallback = defaults.find(item => item.username === user.username) || {};
    return { ...user, email: user.email || fallback.email || "", department: user.department || fallback.department || "", avatar: user.avatar || fallback.avatar || "" };
  });
  return DATA.users;
}

// --- Warranty ---
function warrantyNotificationKey(asset, warrantyDate) {
  return `warranty:${asset.assetCode || asset.serial || asset.model}:${warrantyDate}`;
}
function warrantyReadState(key) {
  return DATA.notifications.find(item => item.key === key)?.read === true;
}
function setWarrantyReadState(key, read = true) {
  let item = DATA.notifications.find(notification => notification.key === key);
  if (!item) {
    item = { key, title: key, category: "ประกัน", type: "warranty", read: false };
    DATA.notifications.unshift(item);
  }
  item.read = read;
}
function maintenanceNotificationKey(row) {
  return `maintenance:${row.title || row.asset || "request"}:${row.date || ""}`;
}
function maintenanceRequestNotifications() {
  if (!settingChecked("maintenanceAlerts", true) || !settingChecked("inAppAlerts", true)) return [];
  return sortByAlpha((DATA.maintenanceRequests || [])
    .filter(row => !normalize(row.status).includes("เสร็จ") && !normalize(row.status).includes("ปิด"))
    .map(row => {
      const key = maintenanceNotificationKey(row);
      return {
        key,
        title: `Maintenance Request - ${row.asset || row.title || "Asset"}`,
        body: `${row.title || row.desc || "แจ้งซ่อม"} · ${row.requester || "-"}`.replace(/\s+/g, " ").trim(),
        category: "ซ่อมบำรุง",
        date: row.date || "-",
        tone: normalize(row.priority).includes("สูง") || normalize(row.priority).includes("เร่ง") ? "danger" : "orange",
        read: warrantyReadState(key),
        remainingDays: null,
      };
    }), item => `${item.date}-${item.title}`);
}
function warrantyNotifications() {
  if (!settingChecked("warrantyAlerts", true) || !settingChecked("inAppAlerts", true)) return [];
  const alertDays = Number(state.settings.warrantyDays || 30) || 30;
  return sortByAlpha(allAssets()
    .map(asset => {
      const warrantyDate = parseAssetDate(asset.warrantyExpirationDate);
      if (!warrantyDate) return null;
      const remainingDays = daysUntil(warrantyDate);
      if (remainingDays < 0 || remainingDays > alertDays) return null;
      const dateText = formatLocalDate(warrantyDate);
      const key = warrantyNotificationKey(asset, dateText);
      return {
        key, title: `Warranty Expiring Soon - ${asset.assetCode || asset.model || asset.serial || "Asset"}`,
        body: `${asset.type || "Asset"} ${asset.brand || ""} ${asset.model || ""}`.replace(/\s+/g, " ").trim(),
        category: "ประกัน", date: dateText,
        tone: remainingDays <= 7 ? "danger" : "orange",
        read: warrantyReadState(key), remainingDays,
      };
    })
    .filter(Boolean), item => `${item.date}-${item.title}`);
}
function systemNotifications() {
  return sortByAlpha([
    ...warrantyNotifications(),
    ...maintenanceRequestNotifications(),
  ], item => `${item.date}-${item.category}-${item.title}`);
}

function applyAppPreferences() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const theme = String(state.settings.theme || "Light").toLowerCase();
  root.dataset.theme = theme;
  root.dataset.fontSize = state.settings.fontSize || "normal";
  
  // Sync state.theme and body class for theme consistency
  state.theme = theme;
  localStorage.setItem("asset-control-theme", theme);
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}

// --- Toast ---
function showToast(message) {
  const id = Date.now();
  state.toast = { id, message };
  render();
  window.setTimeout(() => {
    if (state.toast?.id === id) { state.toast = null; render(); }
  }, 2400);
}

// --- Data snapshot & persistence ---
function dataSnapshot() {
  return {
    sourceFile: DATA.sourceFile || state.settings.dataSource || "asset-control-database.json",
    sourceId: DATA.sourceId || "asset-control-live-database",
    generatedAt: DATA.generatedAt || new Date().toISOString(),
    computerAssets: DATA.computerAssets || [],
    otherAssets: DATA.otherAssets || [],
    master: DATA.master || { companies: [], departments: [], locations: [], types: [], typeGroups: [], positions: [] },
    maintenanceHistory: DATA.maintenanceHistory || [],
    maintenanceRequests: DATA.maintenanceRequests || [],
    checkoutRecords: DATA.checkoutRecords || [],
    notifications: DATA.notifications || [],
    loginHistory: DATA.loginHistory || [],
    auditLogs: DATA.auditLogs || [],
    users: registeredUsers(),
  };
}
function recordAuditLog(action, target, desc) {
  if (!Array.isArray(DATA.auditLogs)) {
    DATA.auditLogs = [];
  }
  const username = state.user?.username || state.user?.name || "system";
  const name = state.user?.name || username;
  const now = new Date();
  const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  DATA.auditLogs.unshift({
    username: username,
    name: name,
    action: action,
    target: target,
    desc: desc,
    time: time
  });
  if (DATA.auditLogs.length > 500) {
    DATA.auditLogs.pop();
  }
  persistLocal();
}
window.recordAuditLog = recordAuditLog;

function replaceData(nextData) {
  const next = nextData || {};
  DATA = {
    sourceFile: next.sourceFile || DATA.sourceFile || "asset-control-database.json",
    sourceId: next.sourceId || DATA.sourceId || "asset-control-live-database",
    generatedAt: next.generatedAt || DATA.generatedAt || new Date().toISOString(),
    computerAssets: Array.isArray(next.computerAssets) ? next.computerAssets : [],
    otherAssets: Array.isArray(next.otherAssets) ? next.otherAssets : [],
    master: {
      companies: Array.isArray(next.master?.companies) ? next.master.companies : [],
      departments: Array.isArray(next.master?.departments) ? next.master.departments : [],
      locations: Array.isArray(next.master?.locations) ? next.master.locations : [],
      types: (() => {
        const rawTypes = Array.isArray(next.master?.types) ? next.master.types : [];
        // Fallback groupCode map — used when Supabase table lacks group_code column
        const groupFallback = {
          AD:'IT', IP:'IT', KB:'IT', MB:'IT', MON:'IT',
          NB:'IT', PC:'IT', PRT:'IT', SR:'IT', SRV:'IT', TAB:'IT',
          AP:'NET', CAB:'NET', CCTV:'NET', FW:'NET',
          LB:'NET', NET:'NET', RT:'NET', SWT:'NET',
          SL:'SFT',
          TV:'OFE',
        };
        return rawTypes.map(t => t.groupCode ? t : { ...t, groupCode: groupFallback[t.code] || '' });
      })(),

      typeGroups: Array.isArray(next.master?.typeGroups) ? next.master.typeGroups : [],
      statuses: Array.isArray(next.master?.statuses) ? next.master.statuses : [],
      positions: Array.isArray(next.master?.positions) ? next.master.positions : [],
    },
    maintenanceHistory: Array.isArray(next.maintenanceHistory) ? next.maintenanceHistory : [],
    maintenanceRequests: Array.isArray(next.maintenanceRequests) ? next.maintenanceRequests : [],
    checkoutRecords: Array.isArray(next.checkoutRecords) ? next.checkoutRecords : [],
    notifications: Array.isArray(next.notifications) ? next.notifications : [],
    loginHistory: Array.isArray(next.loginHistory) ? next.loginHistory : [],
    auditLogs: Array.isArray(next.auditLogs) ? next.auditLogs : (DATA && Array.isArray(DATA.auditLogs) ? DATA.auditLogs : []),
    users: Array.isArray(next.users) && next.users.length ? next.users : defaultUsers(),
  };
  normalizeAssetCollections(DATA);
  state.settings.dataSource = DATA.sourceFile || state.settings.dataSource;
}
async function loadServerDatabase({ rerender = false, notify = false } = {}) {
  if (!DATABASE_API_ENABLED) return false;
  try {
    const response = await fetch("/api/database", { cache: "no-store" });
    if (!response.ok) throw new Error(`Database load failed: ${response.status}`);
    const payload = await response.json();
    databaseVersion = payload.version || null;
    replaceData(payload.data);
    if (rerender) render();
    if (notify) showToast("อัปเดตข้อมูลจากฐานข้อมูลแล้ว");
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}
async function pollServerDatabase() {
  if (!DATABASE_API_ENABLED || state.modal || state.actionMenu) return;
  try {
    const response = await fetch("/api/database", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    if (databaseVersion !== null && payload.version && payload.version !== databaseVersion) {
      databaseVersion = payload.version;
      replaceData(payload.data);
      render();
      showToast("อัปเดตข้อมูลจากฐานข้อมูลแล้ว");
    } else if (databaseVersion === null) {
      databaseVersion = payload.version || null;
    }
  } catch (error) {
    console.warn(error);
  }
}
function queueServerSave() {
  if (!DATABASE_API_ENABLED) return;
  window.clearTimeout(databaseSaveTimer);
  databaseSaveTimer = window.setTimeout(saveServerDatabase, 180);
}
async function saveServerDatabase() {
  if (!DATABASE_API_ENABLED) return;
  if (databaseSaveInFlight) { databaseSaveQueued = true; return; }
  databaseSaveInFlight = true;
  try {
    const response = await fetch("/api/database", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataSnapshot()),
    });
    if (!response.ok) throw new Error(`Database save failed: ${response.status}`);
    const payload = await response.json();
    databaseVersion = payload.version || databaseVersion;
  } catch (error) {
    console.warn(error);
    showToast("บันทึกฐานข้อมูลไม่สำเร็จ ใช้ข้อมูลในเครื่องไว้ก่อน");
  } finally {
    databaseSaveInFlight = false;
    if (databaseSaveQueued) { databaseSaveQueued = false; saveServerDatabase(); }
  }
}
function persistLocal() {
  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify({
    sourceId: SOURCE_ID,
    data: {
      computerAssets: DATA.computerAssets,
      otherAssets: DATA.otherAssets,
      master: DATA.master,
      maintenanceHistory: DATA.maintenanceHistory,
      maintenanceRequests: DATA.maintenanceRequests,
      checkoutRecords: DATA.checkoutRecords,
      notifications: DATA.notifications,
      loginHistory: DATA.loginHistory,
      auditLogs: DATA.auditLogs,
      users: registeredUsers(),
    },
    settings: state.settings,
  }));
  queueServerSave();
}

// --- Pagination ---
function getPageSize(key) {
  if (state.pageSizes && state.pageSizes[key]) return state.pageSizes[key];
  if (key && key.startsWith("notifications")) return NOTIFICATION_PAGE_SIZE;
  const configured = Number(state.settings.defaultPageSize || 0);
  if (configured > 0) return configured;
  return window.innerWidth > 900 ? 10 : 5;
}
function setPage(key, page) {
  state.pages[key] = page;
  render();
}
function pageFor(key, total, perPage = getPageSize(key)) {
  const maxPage = Math.max(1, Math.ceil(total / perPage));
  return Math.min(Math.max(1, state.pages[key] || 1), maxPage);
}
function pageKeyForFilter(filterKey) {
  const prefix = String(filterKey || "").replace(/-(q|type|company|status)$/, "");
  if (prefix === "computer" || prefix === "other") return `${prefix}-assets`;
  return prefix || state.route;
}
function resetFilters(prefix, pageKey = state.route) {
  Object.keys(state.filters).forEach(key => {
    if (key.startsWith(`${prefix}-`)) delete state.filters[key];
  });
  state.pages[pageKey] = 1;
  render();
}
function clearFiltersForRoute(route) {
  state.filters = {};
  state.auditFilterSearch = "";
  state.auditFilterAction = "all";
  state.loginFilterStatus = "all";
  if (route) {
    state.pages[route] = 1;
    state.pages[`${route}-assets`] = 1;
  }
}
function paged(items, key, perPage = getPageSize(key)) {
  const page = pageFor(key, items.length, perPage);
  const start = (page - 1) * perPage;
  return { page, items: items.slice(start, start + perPage), perPage };
}

// --- Record helpers ---
function recordSource(collection) {
  return {
    maintenanceHistory: DATA.maintenanceHistory,
    maintenanceRequests: DATA.maintenanceRequests,
    checkoutRecords: DATA.checkoutRecords,
  }[collection] || [];
}


// ============================================================
// auth.js — Login, logout, routing, and user management
// ============================================================

function routeAllowed(route) {
  if (!state.user) return false;
  return !(state.user.role !== "admin" && route === "master");
}
function setRoute(route) {
  const nextRoute = routeAllowed(route) ? route : "dashboard";
  clearFiltersForRoute(nextRoute);
  state.expandedGroups = {};
  if (nextRoute === "master") {
    state.masterTab = "companies";
    state.pages["master-companies"] = 1;
  }
  state.settingsTab = "general";
  state.route = nextRoute;
  state.drawerOpen = false;
  state.modal = null;
  state.actionMenu = null;
  render();
}
function recordLoginAttempt(username, role, status) {
  DATA.loginHistory.unshift({
    name: username || "-",
    role: role || "-",
    time: new Date().toLocaleString("sv-SE"),
    ip: state.clientIp || "local",
    status,
  });
}
function loginIdMatches(user, loginId) {
  const id = String(loginId || "").toLowerCase();
  return [user.username, user.email].some(value => String(value || "").toLowerCase() === id);
}
function departmentRole(user, loginId) {
  const isEmailLogin = String(loginId || "").includes("@");
  if (isEmailLogin) {
    const department = normalize(user.department || "");
    return department === "it" || department.includes("information technology") ? "admin" : "user";
  }
  return String(user.role || "user").toLowerCase() === "admin" ? "admin" : "user";
}

let microsoftAuthClientPromise = null;

function microsoftRedirectUri() {
  return state.settings.microsoftRedirectUri || window.location.href.split(/[?#]/)[0];
}
function microsoftTenantId() {
  return (state.settings.microsoftTenantId || "common").trim() || "common";
}
function microsoftClientId() {
  return (state.settings.microsoftClientId || "").trim();
}
function microsoftAuthConfigured() {
  return Boolean(microsoftClientId());
}
async function microsoftAuthClient() {
  if (!window.msal) {
    throw new Error("MSAL library is not loaded");
  }
  if (!microsoftAuthConfigured()) {
    throw new Error("Microsoft Client ID is not configured");
  }
  if (!microsoftAuthClientPromise) {
    const config = {
      auth: {
        clientId: microsoftClientId(),
        authority: `https://login.microsoftonline.com/${microsoftTenantId()}`,
        redirectUri: microsoftRedirectUri(),
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
      },
    };
    if (window.msal.PublicClientApplication?.createPublicClientApplication) {
      microsoftAuthClientPromise = window.msal.PublicClientApplication.createPublicClientApplication(config);
    } else {
      const client = new window.msal.PublicClientApplication(config);
      microsoftAuthClientPromise = typeof client.initialize === "function"
        ? client.initialize().then(() => client)
        : Promise.resolve(client);
    }
  }
  return microsoftAuthClientPromise;
}
function userFromMicrosoftAccount(account, claims = {}) {
  const email = account?.username || claims.preferred_username || claims.email || "";
  const matched = registeredUsers().find(user => user.active !== false && loginIdMatches(user, email));
  const fallbackRole = String(state.settings.defaultRole || "user").toLowerCase() === "admin" ? "admin" : "user";
  return {
    name: matched?.name || account?.name || claims.name || email || "Microsoft User",
    username: matched?.username || email,
    email: matched?.email || email,
    department: matched?.department || claims.department || "",
    role: matched ? departmentRole(matched, email) : fallbackRole,
    authProvider: "microsoft",
  };
}
async function loginWithMicrosoft() {
  state.loginError = "";
  if (!microsoftAuthConfigured()) {
    showToast(t("กรุณาตั้งค่า Microsoft Client ID ก่อน", "Please configure the Microsoft Client ID first"));
    return;
  }
  try {
    const client = await microsoftAuthClient();
    const result = await client.loginPopup({
      scopes: ["openid", "profile", "email"],
      prompt: "select_account",
      redirectUri: microsoftRedirectUri(),
    });
    state.user = userFromMicrosoftAccount(result.account, result.idTokenClaims);
    state.modal = null;
    state.actionMenu = null;
    state.drawerOpen = false;
    localStorage.setItem("asset-control-user", JSON.stringify(state.user));
    recordLoginAttempt(state.user.email || state.user.name, state.user.role, "สำเร็จ");
    persistLocal();
    state.route = "dashboard";
    render();
    showToast(t("เข้าสู่ระบบด้วย Microsoft สำเร็จ", "Signed in with Microsoft"));
  } catch (err) {
    state.loginError = t("เข้าสู่ระบบด้วย Microsoft ไม่สำเร็จ", "Microsoft sign-in failed");
    recordLoginAttempt("Microsoft", "-", "ไม่สำเร็จ");
    persistLocal();
    render();
    showToast(err?.message || state.loginError);
  }
}
function saveMicrosoftAuthSettings() {
  const clientId = document.querySelector("[data-setting='microsoftClientId']")?.value.trim() || "";
  const tenantId = document.querySelector("[data-setting='microsoftTenantId']")?.value.trim() || "common";
  const redirectUri = document.querySelector("[data-setting='microsoftRedirectUri']")?.value.trim() || window.location.href.split(/[?#]/)[0];
  state.settings.microsoftClientId = clientId;
  state.settings.microsoftTenantId = tenantId;
  state.settings.microsoftRedirectUri = redirectUri;
  localStorage.setItem("asset-control-ms-client-id", clientId);
  localStorage.setItem("asset-control-ms-tenant-id", tenantId);
  localStorage.setItem("asset-control-ms-redirect-uri", redirectUri);
  microsoftAuthClientPromise = null;
  persistLocal();
  render();
  showToast(t("บันทึกการตั้งค่า Microsoft Login แล้ว", "Microsoft login settings saved"));
}
function deleteAllData() {
  const users = registeredUsers();
  replaceData({
    sourceFile: DATA.sourceFile || state.settings.dataSource || "asset-control-database.json",
    sourceId: DATA.sourceId || "asset-control-live-database",
    generatedAt: new Date().toISOString(),
    computerAssets: [],
    otherAssets: [],
    master: { companies: [], departments: [], locations: [], types: [] },
    maintenanceHistory: [],
    maintenanceRequests: [],
    checkoutRecords: [],
    notifications: [],
    loginHistory: [],
    users,
  });
  state.modal = null;
  state.actionMenu = null;
  state.pages = {};
  persistLocal();
  render();
  showToast(t("ลบข้อมูลทั้งหมดเรียบร้อยแล้ว", "All data deleted successfully"));
}
function confirmDelete() {
  const modal = state.modal || {};
  if (modal.type !== "delete-confirm") return;
  let toast = t("ลบข้อมูลเรียบร้อยแล้ว", "Deleted successfully");
  if (modal.target === "asset") {
    const list = listForGroup(modal.group || "computer");
    if (list[modal.index]) {
      const item = list[modal.index];
      recordAuditLog("ลบ", modal.group === "computer" ? "ทรัพย์สินคอมพิวเตอร์" : "ทรัพย์สินอื่นๆ", `ลบทรัพย์สิน Code: ${item.assetCode || item.code || "-"} (${item.brand || ""} ${item.model || ""})`);
      list.splice(modal.index, 1);
      toast = t("ลบทรัพย์สินแล้ว", "Asset deleted");
    }
  } else if (modal.target === "record") {
    const source = recordSource(modal.collection);
    if (source[modal.index]) {
      const item = source[modal.index];
      const categoryName = modal.collection === "maintenanceHistory" ? "ประวัติการซ่อม" : modal.collection === "maintenanceRequests" ? "รายการแจ้งซ่อม" : "รายการยืม-คืน";
      recordAuditLog("ลบ", categoryName, `ลบรายการ: ${item.title || item.asset || "-"} (${item.status || "-"})`);
      if (modal.collection === "maintenanceHistory") {
        removeMaintenanceRequestForHistory(item);
        if (item.sourceRequestId) {
          for (let index = source.length - 1; index >= 0; index -= 1) {
            if (source[index]?.sourceRequestId === item.sourceRequestId) source.splice(index, 1);
          }
        } else {
          source.splice(modal.index, 1);
        }
      } else if (modal.collection === "maintenanceRequests") {
        removeMaintenanceHistoryForRequest(item);
        source.splice(modal.index, 1);
      } else {
        source.splice(modal.index, 1);
      }
      toast = t("ลบรายการแล้ว", "Record deleted");
    }
  } else if (modal.target === "master") {
    const tabName = modal.tab || state.masterTab;
    const rows = DATA.master[tabName] || [];
    if (rows[modal.index]) {
      const item = rows[modal.index];
      recordAuditLog("ลบ", `ข้อมูลหลัก (${tabName})`, `ลบข้อมูลหลัก Code: ${item.code || "-"} (${item.name || "-"})`);
      rows.splice(modal.index, 1);
      toast = t("ลบข้อมูลหลักแล้ว", "Master Data deleted");
    }
  } else if (modal.target === "user") {
    const user = DATA.users[modal.index];
    if (user && user.username !== state.user.username) {
      recordAuditLog("ลบ", "บัญชีผู้ใช้งาน", `ลบบัญชีผู้ใช้ Username: ${user.username} (${user.name || ""})`);
      DATA.users.splice(modal.index, 1);
      toast = t("ลบผู้ใช้เรียบร้อยแล้ว", "User deleted successfully");
    }
  }
  state.modal = null;
  state.actionMenu = null;
  persistLocal();
  render();
  showToast(toast);
}
function login() {
  const username = document.querySelector("[data-login-username]")?.value.trim() || "";
  const password = document.querySelector("[data-login-password]")?.value || "";
  const account = registeredUsers().find(user => loginIdMatches(user, username) && user.active !== false);
  if (!account) {
    state.loginError = username.includes("@") ? "ไม่พบเมลบริษัทนี้ในฐานข้อมูลผู้ใช้" : "Username หรือ Password ไม่ถูกต้อง";
    recordLoginAttempt(username, "-", "ไม่สำเร็จ");
    persistLocal();
    render();
    return;
  }
  if (String(account.password || "") !== password) {
    state.loginError = "Password ไม่ถูกต้อง";
    recordLoginAttempt(username, "-", "ไม่สำเร็จ");
    persistLocal();
    render();
    return;
  }
  state.loginError = "";
  state.modal = null;
  state.actionMenu = null;
  state.drawerOpen = false;
  state.user = {
    name: account.name || account.username,
    username: account.username,
    email: account.email || "",
    department: account.department || "",
    role: departmentRole(account, username),
  };
  localStorage.setItem("asset-control-user", JSON.stringify(state.user));
  recordLoginAttempt(state.user.name, state.user.role, "สำเร็จ");
  persistLocal();
  state.route = "dashboard";
  render();
}
function logout() {
  localStorage.removeItem("asset-control-user");
  state.user = null;
  state.modal = null;
  state.actionMenu = null;
  state.drawerOpen = false;
  render();
}

// --- Form submit functions ---
function submitMaintenanceRequest() {
  const selectedAssetRef = modalValue("[data-request-field='asset']");
  const resolved = itemForAssetRef(selectedAssetRef, state.modal?.assetGroup || "computer");
  const fallback = allAssets()[0];
  const asset = resolved.item || fallback;
  const assetGroup = resolved.item ? resolved.group : fallback?.group || "computer";
  const request = {
    title: modalValue("[data-request-field='title']", `Maintenance Request - ${asset?.assetCode || "Asset"}`),
    desc: modalValue("[data-request-field='desc']", "No additional detail"),
    asset: asset?.assetCode || "-",
    assetGroup, assetIndex: resolved.index,
    brand: asset?.brand || "-",
    model: asset?.model || "-",
    serial: asset?.serial || "-",
    assetDepartment: asset?.department || "-",
    location: asset?.location || "-",
    room: asset?.room || "",
    type: asset?.type || "-",
    requester: modalValue("[data-request-field='requester']", state.user.name),
    requesterDepartment: modalValue("[data-request-field='requesterDepartment']", state.user.department || ""),
    date: modalValue("[data-request-field='date']", today()),
    priority: modalValue("[data-request-field='priority']", "ปานกลาง"),
    cost: formatRepairCost(modalValue("[data-request-field='cost']", "")),
    status: "รออนุมัติ",
  };
  DATA.maintenanceRequests.unshift(request);
  ensureMaintenanceHistoryFromRequest(request, "รอดำเนินการ");
  state.modal = null;
  state.route = "maintenance-request";
  state.pages["maintenance-request"] = 1;
  persistLocal();
  showToast("ส่งคำขอซ่อมแล้ว");
}

function formatRepairCost(value, fallback = "-") {
  const raw = String(value || "").replace(/[^\d.]/g, "");
  if (!raw) return fallback;
  const amount = Number(raw);
  return Number.isFinite(amount) ? `฿${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : fallback;
}

function historyStatusForMaintenanceRequest(request, fallback = "รอดำเนินการ") {
  const status = normalize(request?.status || "");
  if (status.includes("รอ")) return "รอดำเนินการ";
  if (status.includes("อนุมัติ")) return "กำลังดำเนินการ";
  if (status.includes("กำลัง")) return "กำลังดำเนินการ";
  if (status.includes("เสร็จ")) return "เสร็จสิ้น";
  return fallback;
}

function findAssetForMaintenanceRequest(request) {
  if (!request) return {};
  const group = request.assetGroup === "other" ? "other" : "computer";
  const source = listForGroup(group);
  let assetIndex = Number(request.assetIndex);
  if (!Number.isInteger(assetIndex) || assetIndex < 0 || !source[assetIndex]) {
    assetIndex = source.findIndex(item => item.assetCode === request.asset);
  }
  return { group, source, assetIndex, asset: source[assetIndex] };
}

function setAssetSentForRepair(request) {
  const { group, assetIndex, asset } = findAssetForMaintenanceRequest(request);
  if (!asset) return;
  asset.status = "ส่งซ่อม";
  asset.sentForRepairDate = request.approvedDate || today();
  request.assetGroup = group;
  request.assetIndex = assetIndex;
}

function findAssetForMaintenanceHistory(row) {
  if (!row) return {};
  const preferredGroup = row.assetGroup === "other" ? "other" : row.assetGroup === "computer" ? "computer" : "";
  const groups = preferredGroup ? [preferredGroup] : ["computer", "other"];
  for (const group of groups) {
    const source = listForGroup(group);
    let assetIndex = Number(row.assetIndex);
    if (Number.isInteger(assetIndex) && assetIndex >= 0 && source[assetIndex]) {
      return { group, source, assetIndex, asset: source[assetIndex] };
    }
    assetIndex = source.findIndex(item => item.assetCode === row.asset);
    if (assetIndex >= 0) return { group, source, assetIndex, asset: source[assetIndex] };
  }
  return {};
}

function setAssetAvailableAfterRepair(row) {
  const { group, assetIndex, asset } = findAssetForMaintenanceHistory(row);
  if (!asset) return;
  asset.status = "ไม่ได้ใช้งาน";
  row.assetGroup = group;
  row.assetIndex = assetIndex;
}

function removeMaintenanceHistoryForRequest(request) {
  const historyId = request?.maintenanceHistoryId;
  if (!historyId || !Array.isArray(DATA.maintenanceHistory)) return;
  for (let index = DATA.maintenanceHistory.length - 1; index >= 0; index -= 1) {
    if (DATA.maintenanceHistory[index]?.sourceRequestId === historyId) {
      DATA.maintenanceHistory.splice(index, 1);
    }
  }
}

function removeMaintenanceRequestForHistory(row) {
  const historyId = row?.sourceRequestId;
  if (!historyId || !Array.isArray(DATA.maintenanceRequests)) return;
  for (let index = DATA.maintenanceRequests.length - 1; index >= 0; index -= 1) {
    if (DATA.maintenanceRequests[index]?.maintenanceHistoryId === historyId) {
      DATA.maintenanceRequests.splice(index, 1);
    }
  }
}

function ensureMaintenanceHistoryFromRequest(request, historyStatus = historyStatusForMaintenanceRequest(request)) {
  if (!request) return null;
  if (!Array.isArray(DATA.maintenanceHistory)) DATA.maintenanceHistory = [];
  const historyId = request.maintenanceHistoryId || `maintenance-request-${Date.now()}`;
  request.maintenanceHistoryId = historyId;
  const existing = DATA.maintenanceHistory.find(item => item.sourceRequestId === historyId);
  const linkedAsset = findAssetForMaintenanceRequest(request).asset || {};
  const row = {
    sourceRequestId: historyId,
    title: request.title || "คำขอซ่อม",
    desc: request.desc || "-",
    asset: request.asset || `${request.brand || "-"} ${request.type || ""}`.trim(),
    brand: request.brand || linkedAsset.brand || "-",
    model: request.model || linkedAsset.model || "-",
    serial: request.serial || linkedAsset.serial || "-",
    assetDepartment: request.assetDepartment || linkedAsset.department || "-",
    location: request.location || linkedAsset.location || "-",
    room: request.room || linkedAsset.room || "",
    requester: request.requester || "-",
    requesterDepartment: request.requesterDepartment || "-",
    requestDate: request.date || "-",
    approvedDate: request.approvedDate || "",
    approvalNote: request.approvalNote || "",
    assetGroup: request.assetGroup || "",
    assetIndex: request.assetIndex,
    type: request.type || "ซ่อมแก้ไข",
    date: request.approvedDate || today(),
    completedDate: "",
    cost: request.cost || "-",
    status: historyStatus,
    owner: state.user?.name || "IT Support",
    priority: request.priority || "",
  };
  if (existing) {
    Object.assign(existing, row, {
      completedDate: existing.completedDate || row.completedDate,
      cost: existing.cost && existing.cost !== "-" ? existing.cost : row.cost,
    });
    return existing;
  }
  DATA.maintenanceHistory.unshift(row);
  return row;
}

function syncMaintenanceHistoryFromRequests() {
  (DATA.maintenanceRequests || []).forEach(request => {
    const status = normalize(request?.status || "");
    if (status.includes("ปฏิเสธ")) {
      removeMaintenanceHistoryForRequest(request);
      return;
    }
    const historyStatus = historyStatusForMaintenanceRequest(request);
    ensureMaintenanceHistoryFromRequest(request, historyStatus);
    if (historyStatus === "กำลังดำเนินการ") {
      request.approvedDate = request.approvedDate || today();
      setAssetSentForRepair(request);
    }
  });
}

function setMaintenanceRequestStatus(button, status) {
  const indexKey = status === "อนุมัติแล้ว" ? "approveMaintenanceRequest" : "rejectMaintenanceRequest";
  const index = Number(button?.currentTarget?.dataset[indexKey] || button?.dataset?.[indexKey]);
  const request = DATA.maintenanceRequests[index];
  if (!request) {
    showToast("ไม่พบรายการคำขอซ่อม");
    return;
  }
  request.status = status;
  if (status === "อนุมัติแล้ว") {
    request.approvedDate = request.approvedDate || today();
    ensureMaintenanceHistoryFromRequest(request, "กำลังดำเนินการ");
    setAssetSentForRepair(request);
  }
  if (status === "ปฏิเสธ") {
    request.approvalNote = request.approvalNote || "ปฏิเสธคำขอ";
    removeMaintenanceHistoryForRequest(request);
  }
  persistLocal();
  render();
  showToast(status === "อนุมัติแล้ว" ? "อนุมัติคำขอซ่อมแล้ว" : "ปฏิเสธคำขอซ่อมแล้ว");
}

function approveMaintenanceRequest(button) {
  setMaintenanceRequestStatus(button, "อนุมัติแล้ว");
}

function rejectMaintenanceRequest(button) {
  setMaintenanceRequestStatus(button, "ปฏิเสธ");
}

function completeMaintenanceHistory(button) {
  const index = Number(button?.currentTarget?.dataset.completeMaintenanceHistory || button?.dataset?.completeMaintenanceHistory);
  const row = DATA.maintenanceHistory[index];
  if (!row) {
    showToast("ไม่พบรายการประวัติการซ่อม");
    return;
  }
  row.status = "เสร็จสิ้น";
  row.completedDate = row.completedDate || today();
  const request = (DATA.maintenanceRequests || []).find(item => item.maintenanceHistoryId === row.sourceRequestId);
  if (request) {
    request.status = "เสร็จสิ้น";
    request.completedDate = row.completedDate;
  }
  setAssetAvailableAfterRepair(row);
  persistLocal();
  render();
  showToast("ยืนยันซ่อมเสร็จและอัปเดตสถานะอุปกรณ์แล้ว");
}
function submitCheckout() {
  const pending = state.pendingCheckout || {};
  // Resolve asset from pending or from still-visible form
  const selectedAssetRef = pending.selectedAssetCode
    ? null
    : modalValue("[data-checkout-field='asset']");
  const assetGroup = pending.assetGroup || state.modal?.assetGroup || "computer";
  let resolved;
  if (pending.selectedAssetCode) {
    const source = listForGroup(assetGroup);
    const idx = source.findIndex(item => item.assetCode === pending.selectedAssetCode);
    resolved = { item: idx >= 0 ? source[idx] : null, group: assetGroup, index: idx };
  } else {
    resolved = itemForAssetRef(selectedAssetRef, assetGroup);
  }
  const asset = resolved.item;
  const requester = pending.requester || modalValue("[data-checkout-field='requester']", state.user.name);
  const department = pending.department || modalValue("[data-checkout-field='department']", "-");
  const date = pending.date || modalValue("[data-checkout-field='date']", today());
  const expectedReturn = pending.expectedReturn || modalValue("[data-checkout-field='expectedReturn']", "-");
  const purpose = pending.purpose || modalValue("[data-checkout-field='purpose']", "ใช้งานภายในบริษัท");
  DATA.checkoutRecords.unshift({
    asset: asset ? `${asset.brand || ""} ${asset.type || ""}`.trim() || asset.assetCode : "New Asset",
    assetCode: asset?.assetCode || "-",
    assetGroup: resolved.group, assetIndex: resolved.index,
    sub: asset ? `${asset.brand || ""} ${asset.model || asset.type || ""}`.trim() || asset.assetCode : `Checkout - ${requester}`,
    requester,
    department,
    date,
    expectedReturn,
    purpose,
    status: "กำลังขอใช้งาน",
  });
  // Update matching user record with requester name
  if (requester && requester !== state.user.name) {
    const matchedUser = DATA.users.find(u => u.name === requester || u.username === requester);
    if (!matchedUser) {
      // No existing user found — optionally skip or create a note
    } else {
      matchedUser.name = requester;
      if (department && department !== "-") matchedUser.department = matchedUser.department || department;
    }
  } else if (state.user) {
    // Update current user's name if it differs
    const currentUser = DATA.users.find(u => u.username === state.user.username);
    if (currentUser && requester) currentUser.name = requester;
  }
  state.modal = null;
  state.pendingCheckout = null;
  state.route = "checkout";
  state.pages.checkout = 1;
  persistLocal();
  render();
  showToast("ส่งคำขอใช้งานแล้ว");
}

function checkoutRecordSnapshot(record) {
  return {
    requester: record?.requester || "-",
    department: record?.department || "-",
    asset: record?.assetCode && record.assetCode !== "-"
      ? `${record.assetCode} - ${record.sub || record.asset || ""}`.trim()
      : (record?.sub || record?.asset || "-"),
  };
}
function openCheckoutRecordConfirm(button) {
  const index = Number(button?.currentTarget?.dataset.confirmCheckoutRecord || button?.dataset?.confirmCheckoutRecord);
  const record = DATA.checkoutRecords[index];
  if (!record) return;
  state.pendingCheckoutRecord = index;
  state.modal = {
    type: "checkout-record-confirm",
    snapshot: checkoutRecordSnapshot(record),
  };
  render();
}
function confirmCheckoutRecord(button) {
  const fallbackIndex = Number(button?.currentTarget?.dataset.confirmCheckoutRecord || button?.dataset?.confirmCheckoutRecord);
  const index = Number.isInteger(state.pendingCheckoutRecord) ? state.pendingCheckoutRecord : fallbackIndex;
  const record = DATA.checkoutRecords[index];
  if (!record) return;
  const group = record.assetGroup || "computer";
  const source = listForGroup(group);
  let assetIndex = Number(record.assetIndex);
  if (!Number.isInteger(assetIndex) || assetIndex < 0 || !source[assetIndex]) {
    assetIndex = source.findIndex(item => item.assetCode === record.assetCode);
  }
  const asset = source[assetIndex];
  if (!asset) {
    showToast("ไม่พบทรัพย์สินสำหรับยืนยันรายการนี้");
    return;
  }
  asset.status = "ใช้งาน";
  asset.user = record.requester || asset.user || "-";
  asset.department = record.department || asset.department || "-";
  record.assetGroup = group;
  record.assetIndex = assetIndex;
  record.assetCode = asset.assetCode || record.assetCode || "-";
  record.assetConfirmed = true;
  record.status = "ยืนยันแล้ว";
  state.modal = null;
  state.pendingCheckoutRecord = null;
  persistLocal();
  render();
  showToast("ยืนยันรายการขอใช้งานและบันทึกเข้า asset แล้ว");
}

function checkoutAssetForRecord(record) {
  const group = record?.assetGroup || "computer";
  const source = listForGroup(group);
  let assetIndex = Number(record?.assetIndex);
  if (!Number.isInteger(assetIndex) || assetIndex < 0 || !source[assetIndex]) {
    assetIndex = source.findIndex(item => item.assetCode === record?.assetCode);
  }
  return { group, source, assetIndex, asset: source[assetIndex] };
}

function submitCheckoutReturn() {
  const selected = modalValue("[data-return-field='record']");
  const activeGroup = state.modal?.returnGroup || "";
  const selectedChoice = checkoutReturnChoiceFromInput(selected, activeGroup);
  const returnedDate = modalValue("[data-return-field='returnedDate']", today()) || today();
  let record = null;
  let resolved = null;
  if (!selectedChoice) {
    showToast("กรุณาเลือกรายการอุปกรณ์ที่ต้องการคืน");
    return;
  }
  const selectedValue = selectedChoice.value;
  if (selectedValue.startsWith("record:")) {
    const index = Number(selectedValue.split(":")[1]);
    record = DATA.checkoutRecords[index];
    if (!record) {
      showToast("ไม่พบรายการที่ต้องการคืน");
      return;
    }
    if (!checkoutCanReturn(record)) {
      showToast("รายการนี้คืนแล้ว");
      return;
    }
    resolved = checkoutAssetForRecord(record);
  } else if (selectedValue.startsWith("asset:")) {
    const [, group, rawIndex] = selectedValue.split(":");
    const assetIndex = Number(rawIndex);
    const source = listForGroup(group);
    const asset = source[assetIndex];
    if (!asset || !assetCanReturn(asset)) {
      showToast("ไม่พบอุปกรณ์ที่กำลังใช้งาน");
      return;
    }
    resolved = { group, source, assetIndex, asset };
    record = {
      asset: `${asset.brand || ""} ${asset.type || ""}`.trim() || asset.assetCode || "Asset",
      assetCode: asset.assetCode || "-",
      assetGroup: group,
      assetIndex,
      sub: `${asset.brand || ""} ${asset.model || asset.type || ""}`.trim() || asset.assetCode || "-",
      requester: asset.user || "-",
      department: asset.department || "-",
      date: "-",
      expectedReturn: "-",
      purpose: "แจ้งคืนอุปกรณ์",
      status: "คืนแล้ว",
      returnedDate,
      assetConfirmed: true,
    };
    DATA.checkoutRecords.unshift(record);
  } else {
    showToast("ไม่พบรายการที่ต้องการคืน");
    return;
  }
  if (resolved.asset) {
    record.assetGroup = resolved.group;
    record.assetIndex = resolved.assetIndex;
    record.assetCode = resolved.asset.assetCode || record.assetCode || "-";
  }
  record.status = "คืนแล้ว";
  record.returnedDate = returnedDate || today();
  record.assetConfirmed = true;
  state.modal = null;
  persistLocal();
  render();
  showToast("แจ้งคืนอุปกรณ์เรียบร้อยแล้ว");
}

function confirmCheckoutReturn(button) {
  const index = Number(button?.currentTarget?.dataset.confirmCheckoutReturn || button?.dataset?.confirmCheckoutReturn);
  const record = DATA.checkoutRecords[index];
  if (!record) {
    showToast("ไม่พบรายการคืนที่ต้องการยืนยัน");
    return;
  }
  const resolved = checkoutAssetForRecord(record);
  if (resolved.asset) {
    resolved.asset.status = "ไม่ได้ใช้งาน";
    if ("user" in resolved.asset) resolved.asset.user = "";
    if ("department" in resolved.asset) resolved.asset.department = "";
  }
  DATA.checkoutRecords.splice(index, 1);
  state.pages.checkout = 1;
  persistLocal();
  render();
  showToast("ยืนยันการคืนและอัปเดตสถานะอุปกรณ์แล้ว");
}

function assetItemFromForm(group, base = {}) {
  const isComputer = group === "computer";
  const item = {
    ...base,
    assetCode: modalValue("[data-asset-field='assetCode']", isComputer ? "NB-NEW-001" : "OT-NEW-001"),
    company: modalValue("[data-asset-field='company']", "KOCH"),
    type: modalValue("[data-asset-field='type']", isComputer ? "Notebook" : "Access Point"),
    brand: modalValue("[data-asset-field='brand']", "-"),
    model: modalValue("[data-asset-field='model']", "-"),
    serial: modalValue("[data-asset-field='serial']", "-"),
    status: modalValue("[data-asset-field='status']", "ไม่ได้ใช้งาน"),
    department: modalValue("[data-asset-field='department']", "-"),
    location: modalValue("[data-asset-field='location']", "-"),
    room: modalValue("[data-asset-field='room']", "-"),
    user: modalValue("[data-asset-field='user']", "-"),
    position: modalValue("[data-asset-field='position']", "-"),
    purchaseDate: modalValue("[data-asset-field='purchaseDate']", "-"),
    warrantyExpirationDate: modalValue("[data-asset-field='warrantyExpirationDate']", "-"),
    sentForRepairDate: modalValue("[data-asset-field='sentForRepairDate']", "-"),
    remark: modalValue("[data-asset-field='remark']", base.remark || "เพิ่มจากหน้าเว็บ"),
    imageUrl: [
      modalValue("[data-asset-field='imageUrl1']", ""),
      modalValue("[data-asset-field='imageUrl2']", "")
    ].filter(Boolean).join(","),
  };
  if (isComputer) {
    Object.assign(item, {
      rustDeskId: modalValue("[data-asset-field='rustDeskId']", base.rustDeskId || "-"),
      windowsVersion: modalValue("[data-asset-field='windowsVersion']", base.windowsVersion || "-"),
      adapter: checkboxValue("[data-asset-check='adapter']"),
      mouse: checkboxValue("[data-asset-check='mouse']"),
      laptopBag: checkboxValue("[data-asset-check='laptopBag']"),
      syncOneDrive: checkboxValue("[data-asset-check='syncOneDrive']"),
    });
  } else {
    // Dynamic fields for other groups
    const dynamicFields = [
      "material", "dimensions", "machineNumber",
      "licensePlate", "chassisNumber", "startingMileage", "fuelType",
      "powerRating", "voltage", "rpm",
      "maxRating", "maintenanceCycle", "breakerCode",
      "licenseKey", "licenseType", "licenseSeats"
    ];
    dynamicFields.forEach(field => {
      const el = document.querySelector(`[data-asset-field='${field}']`);
      if (el) {
        item[field] = el.value || "-";
      }
    });

    const dynamicChecks = [
      "cushion", "cabinetKey", "extensionCord",
      "easyPass", "spareTire", "dashcam",
      "userManual", "toolKit",
      "safetySign", "controlCabinetKey",
      "installManual", "downloadLink"
    ];
    dynamicChecks.forEach(check => {
      const el = document.querySelector(`[data-asset-check='${check}']`);
      if (el) {
        item[check] = el.checked;
      }
    });
  }
  return item;
}
function assetSavePayload(button) {
  const dataset = button?.currentTarget?.dataset || button?.dataset || {};
  const group = dataset.assetPresave || dataset.submitAsset || state.modal?.group || "computer";
  const list = listForGroup(group);
  const index = Number.isInteger(state.modal?.index) ? state.modal.index : NaN;
  const base = Number.isInteger(index) ? list[index] || {} : {};
  return {
    group,
    index,
    item: assetItemFromForm(group, base),
    fromCheckout: Boolean(state.modal?.fromCheckout || state.pendingCheckout),
    isEdit: Number.isInteger(index) && index >= 0,
  };
}
function presaveAsset(button) {
  const payload = assetSavePayload(button);
  state.pendingAssetSave = payload;
  state.modal = {
    type: "asset-save-confirm",
    snapshot: {
      assetCode: payload.item.assetCode,
      type: payload.item.type,
      modelText: [payload.item.brand, payload.item.model].filter(Boolean).join(" "),
      isEdit: payload.isEdit,
    },
  };
  render();
}
async function commitAssetSave(payload) {
  const { group, index, item, fromCheckout } = payload;
  
  if (state.selectedImageFile1 || state.selectedImageFile2) {
    showToast("กำลังอัปโหลดรูปภาพ...");
    try {
      if (state.selectedImageFile1) {
        const file = state.selectedImageFile1;
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file
        });
        if (response.ok) {
          const result = await response.json();
          if (result.ok && result.url) {
            item.imageUrl1 = result.url;
          }
        }
        state.selectedImageFile1 = null;
      }
      if (state.selectedImageFile2) {
        const file = state.selectedImageFile2;
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file
        });
        if (response.ok) {
          const result = await response.json();
          if (result.ok && result.url) {
            item.imageUrl2 = result.url;
          }
        }
        state.selectedImageFile2 = null;
      }
    } catch (error) {
      console.error(error);
      showToast("อัปโหลดรูปภาพล้มเหลว แต่กำลังบันทึกข้อมูลอื่น...");
    }
  }
  
  const finalUrl1 = item.imageUrl1 || modalValue("[data-asset-field='imageUrl1']", "");
  const finalUrl2 = item.imageUrl2 || modalValue("[data-asset-field='imageUrl2']", "");
  item.imageUrl = [finalUrl1, finalUrl2].filter(Boolean).join(",");
  
  const targetGroup = assetGroupForType(item.type);
  const sourceList = listForGroup(group);
  const targetList = listForGroup(targetGroup);
  const normalizedItem = assetForGroup(item, targetGroup);
  const isComputer = targetGroup === "computer";
  if (Number.isInteger(index) && index >= 0 && group === targetGroup) {
    sourceList[index] = normalizedItem;
  } else {
    if (Number.isInteger(index) && index >= 0) sourceList.splice(index, 1);
    targetList.unshift(normalizedItem);
  }
  const isEditAsset = Number.isInteger(index) && index >= 0;
  recordAuditLog(
    isEditAsset ? "แก้ไข" : "เพิ่ม",
    isComputer ? "ทรัพย์สินคอมพิวเตอร์" : "ทรัพย์สินอื่นๆ",
    `${isEditAsset ? "แก้ไข" : "เพิ่ม"}ข้อมูลทรัพย์สิน Code: ${normalizedItem.assetCode} (${normalizedItem.brand || ""} ${normalizedItem.model || ""})`
  );
  persistLocal();
  state.pendingAssetSave = null;
  if (fromCheckout) {
    state.modal = {
      type: "checkout",
      assetGroup: targetGroup,
      selectedAssetCode: normalizedItem.assetCode
    };
  } else {
    // Stay on current dynamic group route if applicable
    if (state.route && state.route.startsWith("assets-")) {
      // Already on a group page — stay there
      state.pages[`${state.route}-assets`] = 1;
    } else {
      state.route = isComputer ? "computer" : "other";
      state.pages[`${state.route}-assets`] = 1;
    }
    state.modal = null;
  }
  showToast(Number.isInteger(index) ? "บันทึกการแก้ไขทรัพย์สินแล้ว" : "เพิ่มทรัพย์สินแล้ว");
}
async function confirmAssetSave() {
  if (!state.pendingAssetSave) return;
  await commitAssetSave(state.pendingAssetSave);
}
async function submitAsset(button) {
  await commitAssetSave(assetSavePayload(button));
}
function submitMaster(button) {
  const tab = button.currentTarget?.dataset.submitMaster || state.masterTab;
  const rows = DATA.master[tab] || [];
  const row = {
    code: modalValue("[data-master-field='code']", "NEW"),
    name: modalValue("[data-master-field='name']", "New Master Data"),
  };
  const rawIndex = button.currentTarget?.dataset.index;
  const index = rawIndex === "" || rawIndex === undefined ? NaN : Number(rawIndex);
  const isEditMaster = Number.isInteger(index) && index >= 0;
  if (isEditMaster) rows[index] = row;
  else rows.unshift(row);
  recordAuditLog(
    isEditMaster ? "แก้ไข" : "เพิ่ม",
    `ข้อมูลหลัก (${tab})`,
    `${isEditMaster ? "แก้ไข" : "เพิ่ม"}ข้อมูลหลัก Code: ${row.code} (${row.name})`
  );
  state.modal = null;
  state.pages[`master-${tab}`] = 1;
  persistLocal();
  showToast("บันทึก Master Data แล้ว");
}
function submitRecordEdit(button) {
  const target = button?.currentTarget || button;
  const collection = target?.dataset?.submitRecord;
  const index = Number(target?.dataset?.index);
  const source = recordSource(collection);
  const item = source[index];
  if (!item) return;
  if (collection === "maintenanceHistory") {
    item.title = modalValue("[data-record-field='title']", item.title);
    item.type = modalValue("[data-record-field='type']", item.type);
    item.desc = modalValue("[data-record-field='desc']", item.desc || "");
    item.date = modalValue("[data-record-field='date']", item.date);
    item.completedDate = modalValue("[data-record-field='completedDate']", item.completedDate || "");
    const cost = modalValue("[data-record-field='cost']", String(item.cost || "").replace(/[^\d.]/g, ""));
    item.cost = cost ? `฿${Number(cost).toLocaleString("en-US")}` : item.cost;
    item.status = modalValue("[data-record-field='status']", item.status);
  } else if (collection === "maintenanceRequests") {
    item.title = modalValue("[data-record-field='title']", item.title);
    item.date = modalValue("[data-record-field='date']", item.date);
    item.requester = modalValue("[data-record-field='requester']", item.requester);
    item.requesterDepartment = modalValue("[data-record-field='requesterDepartment']", item.requesterDepartment || "");
    item.desc = modalValue("[data-record-field='desc']", item.desc || "");
    item.priority = modalValue("[data-record-field='priority']", item.priority);
    item.cost = formatRepairCost(modalValue("[data-record-field='cost']", String(item.cost || "").replace(/[^\d.]/g, "")), item.cost || "-");
    item.status = modalValue("[data-record-field='status']", item.status);
    item.approvedDate = modalValue("[data-record-field='approvedDate']", item.approvedDate || "");
    item.approvalNote = modalValue("[data-record-field='approvalNote']", item.approvalNote || "");
    if (item.status === "อนุมัติแล้ว") {
      item.approvedDate = item.approvedDate || today();
      ensureMaintenanceHistoryFromRequest(item, "กำลังดำเนินการ");
      setAssetSentForRepair(item);
    } else if (item.status === "ปฏิเสธ") {
      removeMaintenanceHistoryForRequest(item);
    } else {
      ensureMaintenanceHistoryFromRequest(item, historyStatusForMaintenanceRequest(item));
    }
  } else {
    item.sub = modalValue("[data-record-field='sub']", item.sub || "");
    item.status = modalValue("[data-record-field='status']", item.status);
    item.date = modalValue("[data-record-field='date']", item.date);
    item.returnedDate = modalValue("[data-record-field='returnedDate']", item.returnedDate || "");
    item.purpose = modalValue("[data-record-field='purpose']", item.purpose || "");
  }
  const categoryName = collection === "maintenanceHistory" ? "ประวัติการซ่อม" : collection === "maintenanceRequests" ? "รายการแจ้งซ่อม" : "รายการยืม-คืน";
  recordAuditLog("แก้ไข", categoryName, `แก้ไขรายการ: ${item.title || item.asset || "-"} (สถานะ: ${item.status || "-"})`);
  state.modal = null;
  persistLocal();
  showToast("บันทึกการแก้ไขแล้ว");
}
function settingChecked(key, fallback = true) {
  return state.settings[key] === undefined ? fallback : state.settings[key] === true || state.settings[key] === "true";
}
function saveSettings() {
  document.querySelectorAll("[data-setting]").forEach(input => {
    state.settings[input.dataset.setting] = input.type === "checkbox" ? input.checked : input.value;
  });
  persistLocal();
  showToast("บันทึก Settings แล้ว");
}
function submitUser(indexOrNew) {
  const isEdit = indexOrNew !== "new";
  const idx = isEdit ? Number(indexOrNew) : -1;
  const users = registeredUsers();
  const username = modalValue("[data-user-field='username']");
  const name = modalValue("[data-user-field='name']");
  const email = modalValue("[data-user-field='email']");
  const department = modalValue("[data-user-field='department']");
  const role = modalValue("[data-user-field='role']", "user");
  const avatar = modalValue("[data-user-field='avatar']", "");
  if (!username) { showToast(t("กรุณากรอก Username", "Please enter a username")); return; }
  if (!isEdit) {
    const password = modalValue("[data-user-field='password']");
    const passwordConfirm = modalValue("[data-user-field='passwordConfirm']");
    if (!password) { showToast(t("กรุณากรอกรหัสผ่าน", "Please enter a password")); return; }
    if (!passwordConfirm) { showToast(t("กรุณายืนยันรหัสผ่าน", "Please confirm the password")); return; }
    if (password !== passwordConfirm) { showToast(t("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", "Password and confirmation do not match")); return; }
    const existing = users.find(u => u.username === username);
    if (existing) { showToast(t("Username นี้มีอยู่แล้ว", "This username already exists")); return; }
    DATA.users.push({ username, name, email, department, role, password, avatar, active: true });
    recordAuditLog("เพิ่ม", "บัญชีผู้ใช้งาน", `เพิ่มบัญชีผู้ใช้ใหม่ Username: ${username} (${name}) Role: ${role}`);
  } else {
    const user = DATA.users[idx];
    if (!user) return;
    user.name = name;
    user.email = email;
    user.department = department;
    user.role = role;
    user.avatar = avatar;
    recordAuditLog("แก้ไข", "บัญชีผู้ใช้งาน", `แก้ไขข้อมูลบัญชีผู้ใช้ Username: ${user.username} (${name}) Role: ${role}`);
    if (state.user && state.user.username.toLowerCase() === user.username.toLowerCase()) {
      state.user.name = name;
      state.user.email = email;
      state.user.department = department;
      state.user.role = role;
      state.user.avatar = avatar;
      localStorage.setItem("asset-control-user", JSON.stringify(state.user));
    }
  }
  state.modal = null;
  persistLocal();
  render();
  showToast(isEdit ? t("อัปเดตข้อมูลผู้ใช้เรียบร้อย", "User updated successfully") : t("เพิ่มผู้ใช้ใหม่เรียบร้อย", "New user added successfully"));
}
function submitUserPassword(idx) {
  const user = DATA.users[Number(idx)];
  if (!user) return;
  const newPw = modalValue("[data-user-field='password']");
  const confirmPw = modalValue("[data-user-field='passwordConfirm']");
  if (!newPw) { showToast(t("กรุณากรอกรหัสผ่านใหม่", "Please enter a new password")); return; }
  if (!confirmPw) { showToast(t("กรุณายืนยันรหัสผ่านใหม่", "Please confirm the new password")); return; }
  if (newPw !== confirmPw) { showToast(t("รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ไม่ตรงกัน", "New password and confirmation do not match")); return; }
  const isOwnPassword = state.user && String(state.user.username).toLowerCase() === String(user.username).toLowerCase();
  user.password = newPw;
  state.modal = null;
  persistLocal();
  render();
  showToast(isOwnPassword ? t("เปลี่ยนรหัสผ่านเรียบร้อย", "Password changed successfully") : t("รีเซ็ตรหัสผ่านเรียบร้อย", "Password reset successfully"));
}
function backupDatabase() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataSnapshot(), null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `asset-control-backup-${today()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(t("ส่งออกข้อมูลสำรองเสร็จสิ้น", "Backup file exported"));
}
function restoreDatabase(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.computerAssets || !parsed.otherAssets) {
        throw new Error(t("โครงสร้างไฟล์ข้อมูลสำรองไม่ถูกต้อง (Missing assets arrays)", "Invalid backup structure (Missing assets arrays)"));
      }
      replaceData(parsed);
      persistLocal();
      render();
      showToast(t("กู้คืนข้อมูลเรียบร้อยแล้ว", "Database restored successfully"));
    } catch (err) {
      alert(t("ไม่สามารถอ่านไฟล์สำรองได้: ", "Cannot read backup file: ") + err.message);
    }
  };
  reader.readAsText(file);
}
async function testConnection() {
  const statusEl = document.getElementById("supabase-health-status");
  if (!statusEl) return;
  statusEl.textContent = t("กำลังตรวจสอบ...", "Checking...");
  statusEl.style.color = "var(--orange)";

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    statusEl.textContent = t("ออฟไลน์ (ไม่ได้เชื่อมต่ออินเทอร์เน็ต)", "Offline (No Internet Connection)");
    statusEl.style.color = "var(--danger)";
    return;
  }

  if (!DATABASE_API_ENABLED) {
    statusEl.textContent = t("เชื่อมต่อไม่ได้ (ทำงานในโหมด Standalone)", "Disconnected (Standalone Mode)");
    statusEl.style.color = "var(--danger)";
    return;
  }
  try {
    const res = await fetch("/api/status");
    if (res.ok) {
      const data = await res.json();
      if (data.supabaseOnline) {
        statusEl.textContent = t("เชื่อมต่อสำเร็จ (ออนไลน์)", "Connected (Online)");
        statusEl.style.color = "var(--green)";
      } else {
        statusEl.textContent = t("ออฟไลน์ (ไม่สามารถเชื่อมต่อ Supabase คลาวด์ได้)", "Offline (Supabase Cloud Unreachable)");
        statusEl.style.color = "var(--danger)";
      }
    } else {
      statusEl.textContent = t("ล้มเหลว (เกิดข้อผิดพลาดจากเซิร์ฟเวอร์)", "Failed (Server Error)");
      statusEl.style.color = "var(--danger)";
    }
  } catch (err) {
    statusEl.textContent = t("ล้มเหลว (ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้)", "Failed (Network Error)");
    statusEl.style.color = "var(--danger)";
  }
}


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
  const headers = `<tr><th>${t("Asset Code ↑", "Asset Code ↑")}</th>${showRustDesk ? `<th>${t("RustDesk ID", "RustDesk ID")}</th>` : ""}<th>${t("ประเภท", "Type")}</th><th>${t("บริษัท", "Company")}</th><th>${t("ผู้ใช้งาน / สถานที่", "User / Location")}</th><th>${t("สถานะ", "Status")}</th><th></th></tr>`;
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
    <td class="action-cell">${assetActionButton(assetGroup, index, item.assetCode)}</td>
  </tr>`;
  }).join("");
  return `<div class="table-wrap"><table><thead>${headers}</thead><tbody>${rows || `<tr><td colspan="7"><div class="empty-state">${t("ไม่พบข้อมูลตามเงื่อนไข", "No records match the filters.")}</div></td></tr>`}</tbody></table></div>`;
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
  const available = source.filter(item => {
    if (group === "computer") return isAvailableComputer(item);
    const status = normalize(item.status);
    return status.includes("ไม่ได้") || status.includes("ว่าง") || status === "unknown" || status === "ไม่ระบุ";
  });
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
    ${formSection("ข้อมูลทรัพย์สิน", "", `<div class="segmented"><button class="${group === "computer" ? "active" : ""}" data-modal-asset-group="computer">Assets Computer (${available.length || DATA.computerAssets.length})</button><button class="${group === "other" ? "active" : ""}" data-modal-asset-group="other">Assets Other (${available.length || DATA.otherAssets.length})</button></div><div class="field"><label>ทรัพย์สิน <span class="required">*</span></label><div style="display: flex; gap: 8px;"><select class="select" data-checkout-field="asset" style="flex: 1;">${visible.map(item => {
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



// ============================================================
// shell.js — App shell, navigation, login, and event binding
// ============================================================

// Icons for each typeGroup code
const GROUP_ICONS = { IT: "monitor", NET: "network", SFT: "tag", OFE: "building", VEH: "box", MCH: "wrench", FAC: "database" };
const GROUP_FALLBACK_LABEL = { IT: "IT Equipment", NET: "Network", SFT: "Software", OFE: "Office", VEH: "Vehicles", MCH: "Machinery", FAC: "Facility" };
const GROUP_FALLBACK_LABEL_TH = { IT: "คอมพิวเตอร์ & ไอที", NET: "เครือข่าย", SFT: "ซอฟต์แวร์", OFE: "สำนักงาน", VEH: "ยานพาหนะ", MCH: "เครื่องจักร", FAC: "ระบบอาคาร" };

function getNavAssetCount(groupCode) {
  if (!DATA) return 0;
  if (groupCode === "computer") {
    return Array.isArray(DATA.computerAssets) ? DATA.computerAssets.length : 0;
  }
  if (groupCode === "other") {
    return Array.isArray(DATA.otherAssets) ? DATA.otherAssets.length : 0;
  }
  const types = DATA.master?.types || [];
  const typeCodes = types
    .filter(t => t.groupCode === groupCode)
    .reduce((acc, t) => {
      if (t.name) acc.add(t.name.toLowerCase());
      if (t.code) acc.add(t.code.toLowerCase());
      return acc;
    }, new Set());

  const all = typeof allAssets === "function" ? allAssets() : [...(DATA.computerAssets || []), ...(DATA.otherAssets || [])];
  let items = all.filter(a => a.type && typeCodes.has(String(a.type).toLowerCase()));
  if (groupCode === "IT" && typeof isComputerAssetType === "function") {
    items = items.filter(a => !isComputerAssetType(a.type));
  }
  return items.length;
}

function buildAssetNavChildren() {
  const groups = DATA && DATA.master && DATA.master.typeGroups ? DATA.master.typeGroups : [];
  const isAdmin = state.user && state.user.role === "admin";
  let children = [];
  if (!groups.length) {
    children = [
      { id: "computer", label: () => t("คอมพิวเตอร์", "Computer"), icon: "laptop", groupCode: "computer" },
      { id: "other", label: () => t("อุปกรณ์อื่น ๆ", "Other Equipment"), icon: "box", groupCode: "other" },
    ];
  } else {
    children = [
      { id: "computer", label: () => t("คอมพิวเตอร์", "Computer"), icon: "laptop", groupCode: "computer" },
      ...groups.map(g => ({
        id: "assets-" + g.code,
        label: () => {
          const shortTh = g.code === "IT" ? "อุปกรณ์ไอที" : GROUP_FALLBACK_LABEL_TH[g.code] || g.name.split(" (")[0];
          const shortEn = GROUP_FALLBACK_LABEL[g.code] || g.code;
          return t(shortTh, shortEn);
        },
        icon: GROUP_ICONS[g.code] || "box",
        groupCode: g.code,
      }))
    ];
  }

  // Non-admin users see only sub-menus that contain asset items (count > 0)
  if (!isAdmin) {
    children = children.filter(item => getNavAssetCount(item.groupCode || item.id) > 0);
  }

  return children;
}

const navItems = [
  { id: "dashboard", label: () => t("Dashboard", "Dashboard"), icon: "dashboard" },
  {
    id: "assets",
    label: () => t("ทรัพย์สิน", "Assets"),
    icon: "box",
    get children() { return buildAssetNavChildren(); }
  },
  {
    id: "maintenance", label: () => t("การบำรุงรักษา", "Maintenance"), icon: "wrench", children: [
      { id: "maintenance-detail", label: () => t("ประวัติการซ่อม", "Details"), icon: "clock" },
      { id: "maintenance-request", label: () => t("แจ้งซ่อมบำรุง", "Request"), icon: "edit" },
    ]
  },
  { id: "checkout", label: () => t("ยืม-คืนอุปกรณ์", "Check Out"), icon: "checkout" },
  { id: "master", label: () => t("ข้อมูลหลัก (Master)", "Master Data"), icon: "database", adminOnly: true },
  { id: "notifications", label: () => t("การแจ้งเตือน", "Notifications"), icon: "bell" },
  { id: "settings", label: () => t("ตั้งค่าระบบ", "Settings"), icon: "settings" },
];

// ---- Helper: called by typeGroup dropdown onchange in asset form ----
function filterAssetTypesByGroup(groupCode) {
  var typeSel = document.getElementById("asset-type-select");
  var groupSel = document.getElementById("asset-typegroup-select");
  if (!typeSel || !groupSel) return;
  var all = JSON.parse(groupSel.dataset.types || "[]");
  var filtered = groupCode ? all.filter(function(t) { return t.g === groupCode; }) : all;
  if (groupCode === "IT") filtered = filtered.filter(function(t) { return !isComputerAssetType(t.n); });
  var html = "<option value=\"\">-- ไม่ระบุ --</option>";
  filtered.forEach(function(t) {
    html += "<option value=\"" + t.n + "\">" + t.n + "</option>";
  });
  typeSel.innerHTML = html;
}

function filterInputByKey(key) {
  return [...document.querySelectorAll("[data-filter]")].find(input => input.dataset.filter === key);
}
function bindTableEvents(container) {
  container.querySelectorAll("[data-page-key]").forEach(button => button.addEventListener("click", () => {
    setPage(button.dataset.pageKey, Number(button.dataset.page));
  }));
  container.querySelectorAll(".page-size-select").forEach(select => select.addEventListener("change", () => {
    const key = select.dataset.pageSizeKey;
    const size = Number(select.value);
    state.pageSizes[key] = size;
    state.pages[key] = 1;
    render();
  }));
  container.querySelectorAll("[data-action-menu]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    const key = button.dataset.actionMenu;
    if (state.actionMenu?.key === key) {
      state.actionMenu = null;
      render();
      return;
    }
    state.actionMenu = actionMenuPosition(button, key);
    render();
  }));
  container.querySelectorAll("[data-view-asset]").forEach(button => button.addEventListener("click", () => {
    state.modal = { type: "asset", group: button.dataset.group, code: button.dataset.viewAsset };
    render();
  }));
  container.querySelectorAll("[data-view-record]").forEach(button => button.addEventListener("click", () => {
    state.modal = { type: "record", collection: button.dataset.viewRecord, index: Number(button.dataset.index) };
    render();
  }));
  container.querySelectorAll("[data-confirm-checkout-record]").forEach(button => button.addEventListener("click", () => {
    openCheckoutRecordConfirm(button);
  }));
  container.querySelectorAll("[data-approve-maintenance-request]").forEach(button => button.addEventListener("click", () => {
    approveMaintenanceRequest(button);
  }));
  container.querySelectorAll("[data-reject-maintenance-request]").forEach(button => button.addEventListener("click", () => {
    rejectMaintenanceRequest(button);
  }));
  container.querySelectorAll("[data-open-checkout-return]").forEach(button => button.addEventListener("click", () => {
    const rawIndex = button.dataset.openCheckoutReturn;
    state.modal = rawIndex === "" || rawIndex === undefined
      ? { type: "checkout-return" }
      : { type: "checkout-return", index: Number(rawIndex) };
    render();
  }));
  container.querySelectorAll("[data-confirm-checkout-return]").forEach(button => button.addEventListener("click", () => {
    confirmCheckoutReturn(button);
  }));
}
function updateActivePageTable() {
  const container = document.querySelector(".page-panel");
  if (!container) return false;
  const tableWrap = container.querySelector(".table-wrap");
  const pagination = container.querySelector(".pagination");
  if (!tableWrap || !pagination) return false;
  let tableHtml = "";
  let paginationHtml = "";
  if (state.route === "computer" || state.route === "other" || (state.route && state.route.startsWith("assets-"))) {
    const isGroup = state.route.startsWith("assets-");
    const groupCode = isGroup ? state.route.replace("assets-", "") : null;
    let items;
    if (isGroup) {
      const typeCodes = (DATA.master.types || [])
        .filter(t => t.groupCode === groupCode)
        .reduce((acc, t) => {
          if (t.name) acc.add(t.name.toLowerCase());
          if (t.code) acc.add(t.code.toLowerCase());
          return acc;
        }, new Set());
      let itemsList = allAssets().filter(a => a.type && typeCodes.has(a.type.toLowerCase()));
      if (groupCode === "IT") itemsList = itemsList.filter(a => !isComputerAssetType(a.type));
      items = itemsList;
    } else {
      items = state.route === "computer" ? DATA.computerAssets : DATA.otherAssets;
    }
    const prefix = state.route;
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
    const pageKey = `${prefix}-assets`;
    tableHtml = renderAssetTable(filtered, isGroup ? "other" : state.route, pageKey);
    paginationHtml = renderPagination(filtered.length, pageKey);
  } else if (state.route === "maintenance-detail") {
    syncMaintenanceHistoryFromRequests();
    const filtered = sortByAlpha(filterCollection(DATA.maintenanceHistory, "maintenance-detail"), row => row.title || row.asset || row.type);
    const pageKey = "maintenance-detail";
    const page = paged(filtered, pageKey);
    tableHtml = tableFromRows(["รายการ ↑", "ทรัพย์สิน", "ประเภท", "วันที่", "ค่าใช้จ่าย", "สถานะ", ""], page.items.map(row => [
      `<strong>${esc(row.title)}</strong>`,
      esc(row.asset),
      `${icon(row.type.includes("ฉุก") ? "alert" : "wrench")} ${esc(row.type)}`,
      esc(row.date), esc(row.cost),
      `<span class="status-pill ${statusClass(row.status)}">${esc(row.status)}</span>`,
      maintenanceHistoryActions(row),
    ]));
    paginationHtml = renderPagination(filtered.length, pageKey);
  } else if (state.route === "maintenance-request") {
    syncMaintenanceHistoryFromRequests();
    const filtered = sortByAlpha(filterCollection(DATA.maintenanceRequests, "maintenance-request"), row => row.title || row.asset || row.requester);
    const pageKey = "maintenance-request";
    const page = paged(filtered, pageKey);
    tableHtml = tableFromRows(["หัวข้อ ↑", "แบรนด์", "ประเภท", "ผู้แจ้ง", "วันที่แจ้ง", "ความเร่งด่วน", "สถานะ", ""], page.items.map(row => [
      `<strong>${esc(row.title)}</strong><span class="row-sub">${esc(row.desc)}</span>`,
      esc(row.brand), esc(row.type), esc(row.requester), esc(row.date),
      `<span class="priority-pill ${row.priority === "สูง" || row.priority === "เร่งด่วน" ? "status-active" : "status-muted"}">${esc(row.priority)}</span>`,
      `<span class="status-pill ${statusClass(row.status)}">${icon(row.status.includes("รอ") ? "clock" : row.status.includes("กำลัง") ? "alert" : "check")} ${esc(row.status)}</span>`,
      maintenanceRequestActions(row),
    ]));
    paginationHtml = renderPagination(filtered.length, pageKey);
  } else if (state.route === "checkout") {
    const filtered = sortByAlpha(filterCollection(DATA.checkoutRecords, "checkout", { type: "asset" }), row => row.asset || row.sub || row.requester);
    const pageKey = "checkout";
    const page = paged(filtered, pageKey);
    tableHtml = tableFromRows(["ทรัพย์สิน ↑", "ผู้ขอใช้งาน", "วันที่ขอใช้", "วัตถุประสงค์", "สถานะ", ""], page.items.map(row => [
      `<strong>${esc(row.asset)}</strong><span class="row-sub">${esc(row.sub)}</span>`,
      esc(row.requester), esc(row.date), esc(row.purpose),
      `<span class="status-pill ${statusClass(row.status)}">${esc(row.status)}</span>`,
      checkoutRowActions(row),
    ]));
    paginationHtml = renderPagination(filtered.length, pageKey);
  }
  if (tableHtml && paginationHtml) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = tableHtml;
    const newTableWrap = tempDiv.firstElementChild;
    tableWrap.replaceWith(newTableWrap);
    tempDiv.innerHTML = paginationHtml;
    const newPagination = tempDiv.firstElementChild;
    pagination.replaceWith(newPagination);
    translateUi(newTableWrap);
    translateUi(newPagination);
    bindTableEvents(container);
    return true;
  }
  return false;
}
function renderPreservingFilterFocus(input) {
  const key = input?.dataset.filter || "";
  const cursorStart = input?.selectionStart ?? String(input?.value || "").length;
  const cursorEnd = input?.selectionEnd ?? cursorStart;
  render();
  requestAnimationFrame(() => {
    const nextInput = filterInputByKey(key);
    if (!nextInput) return;
    nextInput.focus({ preventScroll: true });
    if (typeof nextInput.setSelectionRange === "function") {
      const max = String(nextInput.value || "").length;
      nextInput.setSelectionRange(Math.min(cursorStart, max), Math.min(cursorEnd, max));
    }
  });
}
function settingsSaveButtonHtml() {
  return `<button class="primary-btn" data-save-settings>${icon("save")} ${t("บันทึก", "Save")}</button>`;
}
function currentSettingsDirty() {
  if (state.route !== "settings" || state.settingsTab !== "notifications") return false;
  return [...document.querySelectorAll(".settings-panel [data-setting]")].some(input => {
    const key = input.dataset.setting;
    if (!key) return false;
    if (input.type === "checkbox") return input.checked !== settingChecked(key, true);
    return String(input.value ?? "") !== String(state.settings[key] ?? "");
  });
}
function bindSettingsSaveButton(button = document.querySelector("[data-save-settings]")) {
  if (!button || button.dataset.boundSettingsSave) return;
  button.addEventListener("click", saveSettings);
  button.dataset.boundSettingsSave = "true";
}
function updateSettingsSaveButton() {
  const existing = document.querySelector("[data-save-settings]");
  if (!state.settingsDirty) {
    existing?.remove();
    return;
  }
  if (existing) {
    bindSettingsSaveButton(existing);
    return;
  }
  document.querySelector(".page-title-row")?.insertAdjacentHTML("beforeend", settingsSaveButtonHtml());
  bindSettingsSaveButton();
}
function markSettingsDirty() {
  state.settingsDirty = currentSettingsDirty();
  updateSettingsSaveButton();
}
function settingInputValue(input) {
  if (input.type === "checkbox" && input.dataset.valueOn !== undefined) {
    return input.checked ? input.dataset.valueOn : input.dataset.valueOff;
  }
  return input.type === "checkbox" ? input.checked : input.value;
}
function applySettingValue(key, value) {
  if (key === "lang") {
    state.lang = value;
    localStorage.setItem("asset-control-lang", state.lang);
    return;
  }
  if (key === "theme") {
    state.settings.theme = value;
    state.theme = String(value || "Light").toLowerCase();
    localStorage.setItem("asset-control-theme", state.theme);
    return;
  }
  state.settings[key] = value;
}
function applyGeneralOverviewSetting(input) {
  if (!input.closest(".settings-overview")) return false;
  const key = input.dataset.setting;
  if (!key) return false;
  applySettingValue(key, settingInputValue(input));
  persistLocal();
  render();
  return true;
}
function renderLogin() {
  const s = stats();
  return `<main class="login-page">
    <section class="login-card">
      <div class="login-art">
        <div>
          <div class="login-logo"><span class="logo-mark">${icon("box")}</span><span>Asset Control</span></div>
          <h1>ระบบควบคุมทรัพย์สิน IT</h1>
          <p>จัดการอุปกรณ์ การซ่อมบำรุง การยืมคืน และข้อมูลหลักในระบบเดียว พร้อมสิทธิ์การเข้าถึงแบบ Admin และ User</p>
          <div class="login-stats">
            <div class="login-stat"><strong>${s.total}</strong><span>Assets</span></div>
            <div class="login-stat"><strong>${s.computer}</strong><span>Computer</span></div>
            <div class="login-stat"><strong>${s.other}</strong><span>Other</span></div>
          </div>
        </div>
      </div>
      <div class="login-form-wrap">
        <div class="login-language">
          <button class="lang-btn" data-set-lang="th" style="opacity:${state.lang === 'th' ? '1' : '0.55'}">TH</button>
          <span>|</span>
          <button class="lang-btn" data-set-lang="en" style="opacity:${state.lang === 'en' ? '1' : '0.55'}">EN</button>
        </div>
        <h2>เข้าสู่ระบบ</h2>
        <p>เลือกสิทธิ์เพื่อดูเมนูและข้อมูลตามบทบาท</p>
        <form class="login-form" data-login-form>
        <div class="field"><label>Username / Company Email</label><input class="input" data-login-username placeholder="${t("กรุณากรอก Username หรืออีเมลบริษัท", "Enter Username or Company Email")}" autocomplete="username" aria-label="Username or Company Email"></div>
        <div class="field"><label>Password</label><input class="input" data-login-password type="password" value="" autocomplete="current-password" aria-label="Password"></div>
        ${state.loginError ? `<div class="login-error">${esc(state.loginError)}</div>` : ""}
        <div class="login-actions">
          <button class="primary-btn" type="submit">${icon("shield")} เข้าสู่ระบบ</button>
          <button class="microsoft-login-btn" type="button" data-microsoft-login>${icon("user")} ${t("เข้าสู่ระบบด้วย Microsoft", "Sign in with Microsoft")}</button>
        </div>
        </form>
        <div class="demo-note"><strong>Email Login</strong> ถ้าแผนกเป็น IT จะเข้าเป็น Admin, แผนกอื่นจะเข้าเป็น User<br><strong>Admin</strong> เห็นทุกเมนู รวม Master Data และประวัติ Login</div>
      </div>
    </section>
  </main>`;
}
function bindLogin() {
  document.querySelector("[data-login-form]")?.addEventListener("submit", event => {
    event.preventDefault();
    login();
  });
  document.querySelector("[data-microsoft-login]")?.addEventListener("click", loginWithMicrosoft);
  document.querySelectorAll("[data-set-lang]").forEach(button => button.addEventListener("click", () => {
    state.lang = button.dataset.setLang;
    localStorage.setItem("asset-control-lang", state.lang);
    render();
  }));
}
function activeGroup(item) {
  return item.id === state.route || (item.children || []).some(child => child.id === state.route);
}
function isGroupExpanded(itemId) {
  if (!state.expandedGroups) state.expandedGroups = {};
  if (state.expandedGroups[itemId] !== undefined) {
    return state.expandedGroups[itemId];
  }
  const item = navItems.find(nav => nav.id === itemId);
  return activeGroup(item);
}
function renderNav() {
  return navItems
    .filter(item => !item.adminOnly || state.user.role === "admin")
    .map(item => {
      const open = isGroupExpanded(item.id);
      const itemLabel = typeof item.label === "function" ? item.label() : item.label;
      if (item.children) {
        return `<div class="nav-section ${open ? "open" : ""}">
          <button class="nav-btn ${activeGroup(item) ? "active" : ""}" data-nav-group="${item.id}">
            ${icon(item.icon)}<span class="label">${itemLabel}</span><span class="chev">${icon("chevronDown")}</span>
          </button>
          <div class="submenu">
            ${item.children.map(child => {
          const childLabel = typeof child.label === "function" ? child.label() : child.label;
          return `<button class="submenu-btn ${state.route === child.id ? "active" : ""}" data-route="${child.id}">${icon(child.icon)}<span class="label">${childLabel}</span></button>`;
        }).join("")}
          </div>
        </div>`;
      }
      return `<div class="nav-section"><button class="nav-btn ${state.route === item.id ? "active" : ""}" data-route="${item.id}">${icon(item.icon)}<span class="label">${itemLabel}</span></button></div>`;
    })
    .join("");
}
function navRenderKey() {
  const groupCount = (DATA && DATA.master && DATA.master.typeGroups) ? DATA.master.typeGroups.length : 0;
  return `${state.lang}:${state.user?.role || ""}:${groupCount}`;
}
function updateNavState(nav = document.querySelector(".nav")) {
  if (!nav) return;
  navItems.forEach(item => {
    const groupButton = nav.querySelector(`[data-nav-group="${item.id}"]`);
    if (groupButton) {
      groupButton.classList.toggle("active", activeGroup(item));
      groupButton.closest(".nav-section")?.classList.toggle("open", isGroupExpanded(item.id));
    }
    nav.querySelectorAll(`[data-route="${item.id}"]`).forEach(button => {
      button.classList.toggle("active", state.route === item.id);
    });
    (item.children || []).forEach(child => {
      nav.querySelectorAll(`[data-route="${child.id}"]`).forEach(button => {
        button.classList.toggle("active", state.route === child.id);
      });
    });
  });
}
function refreshNav(nav = document.querySelector(".nav")) {
  if (!nav) return;
  const key = navRenderKey();
  if (nav.dataset.renderKey !== key) {
    nav.innerHTML = renderNav();
    nav.dataset.renderKey = key;
  } else {
    updateNavState(nav);
  }
}
function renderShell() {
  const unreadWarrantyNotifications = systemNotifications().filter(item => !item.read).length;
  return `<div class="app-shell" data-lang="${state.lang}"><div class="workspace ${state.sidebarCollapsed ? "sidebar-collapsed" : ""}">
    ${state.drawerOpen ? '<div class="drawer-backdrop" data-close-drawer></div>' : ""}
    <aside class="sidebar ${state.drawerOpen ? "open" : ""}">
      <div class="sidebar-head">
        <div class="brand-logo"><span class="logo-mark">${icon("box")}</span><span>Asset Control</span></div>
        <button class="bell-wrap" data-route="notifications" aria-label="notifications">${icon("bell")}${unreadWarrantyNotifications > 0 ? `<span class="badge-count">${unreadWarrantyNotifications}</span>` : ""}</button>
      </div>
      <nav class="nav" data-render-key="${navRenderKey()}">${renderNav()}</nav>
      <div class="sidebar-bottom">
        <div class="lang-strip" style="display:flex; ${state.sidebarCollapsed ? "justify-content:center" : "justify-content:space-between"}; align-items:center; padding:${state.sidebarCollapsed ? "10px 10px" : "10px 22px"}; border-top:1px solid rgba(255,255,255,.14)">
          ${state.sidebarCollapsed ? "" : `<span style="font-size:12px; font-weight:800; opacity:0.8; color:#fff">${t("ภาษา / Language", "Language")}</span>`}
          <div style="display:flex; gap:6px; align-items:center">
            <button class="lang-btn" data-set-lang="th" style="background:transparent; border:0; color:#fff; font-weight:bold; font-size:12px; cursor:pointer; opacity:${state.lang === 'th' ? '1' : '0.5'}">TH</button>
            <span style="opacity:0.5; color:#fff; font-size:12px">|</span>
            <button class="lang-btn" data-set-lang="en" style="background:transparent; border:0; color:#fff; font-weight:bold; font-size:12px; cursor:pointer; opacity:${state.lang === 'en' ? '1' : '0.5'}">EN</button>
          </div>
        </div>
        <button class="sidebar-footer-btn" data-toggle-sidebar>${icon("checkout")}<span>${state.sidebarCollapsed ? t("ขยายเมนู", "Expand Menu") : t("ย่อเมนู", "Collapse Menu")}</span></button>
        <div class="user-strip">
          <span class="avatar" style="overflow:hidden; display:grid; place-items:center">${(registeredUsers().find(u => String(u.username).toLowerCase() === String(state.user?.username).toLowerCase())?.avatar || state.user?.avatar) ? `<img src="${esc(registeredUsers().find(u => String(u.username).toLowerCase() === String(state.user?.username).toLowerCase())?.avatar || state.user?.avatar)}" style="width:100%; height:100%; object-fit:cover; border-radius:50%">` : icon("user")}</span>
          <div style="flex:1"><strong>${esc(state.user.name)}</strong><div class="role-pill">${esc(state.user.role)}</div></div>
          <button class="more-btn" data-logout title="Logout">${icon("logout")}</button>
        </div>
      </div>
    </aside>
    <main class="main">
      <div class="mobile-topbar">
        <button class="hamburger" data-open-drawer>${icon("menu")}</button>
        <div class="brand-logo" style="color:var(--brand)"><span class="logo-mark" style="background:var(--brand)">${icon("box")}</span><span>Asset Control</span></div>
        <button class="hamburger" data-route="notifications">${icon("bell")}</button>
      </div>
      <div class="content ${state.route === "dashboard" ? "dashboard-content" : ""} route-${state.route}">${renderRoute()}</div>
    </main>
  </div></div><div id="action-menu-container">${renderActionMenuOverlay()}</div><div id="modal-container">${state.modal ? renderModal(state.modal) : ""}</div><div id="lightbox-container">${state.previewImageUrl ? renderLightbox(state.previewImageUrl) : ""}</div><div id="toast-container">${state.toast ? `<div class="toast">${icon("check")}<span>${esc(state.toast.message)}</span></div>` : ""}</div>`;
}
function renderRoute() {
  const routes = {
    dashboard: renderDashboard,
    computer: () => renderAssetPage("computer"),
    other: () => renderAssetPage("other"),
    "maintenance-detail": renderMaintenanceDetail,
    "maintenance-request": renderMaintenanceRequest,
    checkout: renderCheckout,
    master: renderMaster,
    notifications: renderWarrantyNotifications,
    settings: renderSettings,
  };
  // Dynamic group routes: assets-IT, assets-NET, etc.
  if (state.route && state.route.startsWith("assets-")) {
    const groupCode = state.route.replace("assets-", "");
    return renderAssetPageByGroup(groupCode);
  }
  return (routes[state.route] || renderDashboard)();
}
function renderLightbox(url) {
  return `<div class="modal-backdrop center-modal" style="background: rgba(0, 0, 0, 0.85); z-index: 11000;" data-close-lightbox>
    <section style="position: relative; max-width: 95vw; max-height: 95vh; display: flex; align-items: center; justify-content: center; padding: 10px;" onclick="if (!event.target.closest('[data-close-lightbox]')) event.stopPropagation();">
      <button class="modal-close" data-close-lightbox style="position: absolute; top: 0px; right: 0px; background: rgba(0,0,0,0.6); color: #fff; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: none; font-size: 20px; cursor: pointer; transition: background 0.2s; z-index: 10;">${icon("x")}</button>
      <img src="${esc(getImageUrl(url))}" style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 8px; border: 2px solid rgba(255,255,255,0.15); background: #111; box-shadow: 0 10px 40px rgba(0,0,0,0.85); cursor: zoom-out;" data-close-lightbox>
    </section>
  </div>`;
}

function renderModal(modal) {
  if (modal.type === "user-form") {
    const isEdit = Number.isInteger(modal.index);
    const user = isEdit ? DATA.users[modal.index] : { username: "", name: "", email: "", department: "", role: "user", password: "", avatar: "" };
    return formModal(
      isEdit ? t("แก้ไขบัญชีผู้ใช้", "Edit User Account") : t("เพิ่มผู้ใช้ใหม่", "Add New User"),
      "user",
      `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-bottom:16px; text-align:center">
         <div style="position:relative; width:80px; height:80px; margin-bottom:10px">
           <div id="user-avatar-preview" style="width:80px; height:80px; border-radius:50%; background:#f0f0f4; border:2px solid var(--brand); display:grid; place-items:center; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1)">
             ${user.avatar ? `<img src="${esc(user.avatar)}" style="width:100%; height:100%; object-fit:cover">` : `<span style="font-size:32px; color:var(--brand)">${icon("user")}</span>`}
           </div>
           <label for="user-avatar-file-input" style="position:absolute; bottom:0; right:0; width:26px; height:26px; border-radius:50%; background:var(--brand); color:#fff; display:grid; place-items:center; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.2)" title="${t("เลือกรูปโปรไฟล์", "Choose Profile Photo")}">
             ${icon("camera")}
           </label>
         </div>
         <input type="file" id="user-avatar-file-input" accept="image/*" style="display:none" data-user-avatar-file>
         <input type="hidden" data-user-field="avatar" id="user-avatar-hidden-input" value="${esc(user.avatar || "")}">
         <div style="display:flex; gap:8px">
           <label for="user-avatar-file-input" class="ghost-btn" style="padding:4px 10px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:4px">
             ${icon("upload")} ${t("อัปโหลดรูปโปรไฟล์", "Upload Photo")}
           </label>
           ${user.avatar ? `<button type="button" class="ghost-btn" id="remove-user-avatar-btn" style="padding:4px 10px; font-size:12px; color:#ff3045; display:inline-flex; align-items:center; gap:4px">${icon("trash")} ${t("ลบรูป", "Remove")}</button>` : ""}
         </div>
       </div>
       <div class="field"><label>${t("Username", "Username")}</label><input class="input" data-user-field="username" value="${esc(user.username)}" ${isEdit ? "readonly style='opacity:0.6'" : ""}></div>
       <div class="field"><label>${t("ชื่อ-นามสกุล", "Full Name")}</label><input class="input" data-user-field="name" value="${esc(user.name || "")}"></div>
       <div class="field"><label>${t("อีเมลบริษัท", "Company Email")}</label><input class="input" data-user-field="email" value="${esc(user.email || "")}"></div>
       <div class="field"><label>${t("แผนก", "Department")}</label><input class="input" data-user-field="department" value="${esc(user.department || "")}"></div>
       <div class="field"><label>${t("บทบาท", "Role")}</label>
         ${state.user.role === "admin" ? `
           <select class="select" data-user-field="role">
             <option value="user" ${user.role === "user" ? "selected" : ""}>USER</option>
             <option value="admin" ${user.role === "admin" ? "selected" : ""}>ADMIN</option>
           </select>
         ` : `
           <input class="input" data-user-field="role" value="${esc((user.role || "user").toUpperCase())}" readonly style="opacity:0.6">
         `}
       </div>
       ${isEdit ? "" : `<div class="field"><label>${t("รหัสผ่าน", "Password")}</label><input class="input" data-user-field="password" type="password" value=""></div><div class="field"><label>${t("ยืนยันรหัสผ่าน", "Confirm Password")}</label><input class="input" data-user-field="passwordConfirm" type="password" value=""></div>`}
       <button class="primary-btn" data-submit-user="${isEdit ? modal.index : "new"}">${icon("check")} ${t("บันทึกข้อมูล", "Save User")}</button>`
    );
  }
  if (modal.type === "reset-user-pw") {
    const user = DATA.users[modal.index];
    if (!user) return "";
    const isOwnPassword = state.user && String(state.user.username).toLowerCase() === String(user.username).toLowerCase();
    return formModal(
      isOwnPassword ? t("เปลี่ยนรหัสผ่าน", "Change Password") : t("รีเซ็ตรหัสผ่าน", "Reset Password"), "settings",
      `<h3>${isOwnPassword ? t("บัญชีของคุณ", "Your Account") : t("ผู้ใช้งาน", "User")}: ${esc(user.username)}</h3>
       <div class="field"><label>${t("รหัสผ่านใหม่", "New Password")}</label><input class="input" data-user-field="password" type="password" value=""></div>
       <div class="field"><label>${t("ยืนยันรหัสผ่านใหม่", "Confirm New Password")}</label><input class="input" data-user-field="passwordConfirm" type="password" value=""></div>
       <button class="primary-btn" data-submit-user-pw="${modal.index}">${icon("check")} ${t("อัปเดตรหัสผ่าน", "Update Password")}</button>`
    );
  }
  if (modal.type === "logout-confirm") return renderLogoutConfirmModal();
  if (modal.type === "delete-all-confirm") return renderDeleteAllConfirmModal();
  if (modal.type === "delete-confirm") return renderDeleteConfirmModal(modal);
  if (modal.type === "asset-form") return renderAssetFormModal(modal);
  if (modal.type === "asset-save-confirm") return renderAssetSaveConfirmModal(modal.snapshot);
  if (modal.type === "asset") return renderAssetDetailModal(modal);
  if (modal.type === "record") return renderRecordModal(modal.collection, modal.index);
  if (modal.type === "record-form") return renderRecordFormModal(modal.collection, modal.index);
  if (modal.type === "request") return renderMaintenanceRequestForm(modal);
  if (modal.type === "save-confirm") return renderCheckoutSaveConfirmModal(modal.snapshot);
  if (modal.type === "checkout-record-confirm") return renderCheckoutSaveConfirmModal(modal.snapshot, "data-confirm-checkout-record-save");
  if (modal.type === "checkout-return") return renderCheckoutReturnModal(modal);
  if (modal.type === "checkout") return renderCheckoutFormModal(modal);
  if (modal.type === "master-form") {
    const rows = DATA.master[modal.tab] || [];
    const row = Number.isInteger(modal.index) ? rows[modal.index] : { code: "", name: "" };
    return formModal(Number.isInteger(modal.index) ? "แก้ไข Master Data" : "เพิ่ม Master Data", "database", `<div class="field"><label>Code</label><input class="input" data-master-field="code" value="${esc(row.code)}"></div><div class="field"><label>Name</label><input class="input" data-master-field="name" value="${esc(row.name)}"></div><button class="primary-btn" data-submit-master="${modal.tab}" data-index="${Number.isInteger(modal.index) ? modal.index : ""}">${icon("check")} บันทึก</button>`);
  }
  return "";
}

async function clearLoginHistoryLogs(event) {
  event?.preventDefault?.();
  event?.stopImmediatePropagation?.();
  const msg = t(
    "คุณต้องการล้างประวัติการเข้าสู่ระบบทั้งหมดใช่หรือไม่?",
    "Are you sure you want to clear all login history?"
  );
  if (!window.confirm(msg)) return;
  if (DATABASE_API_ENABLED) {
    try {
      const response = await fetch("/api/login-history/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Clear login history failed: ${response.status}`);
      const payload = await response.json();
      databaseVersion = payload.version || databaseVersion;
      replaceData(payload.data);
      state.pages["login-history"] = 1;
      render();
      showToast(t("ล้างประวัติการเข้าสู่ระบบแล้ว", "Login history cleared"));
      return;
    } catch (error) {
      console.warn(error);
      showToast(t("ล้างประวัติการเข้าสู่ระบบไม่สำเร็จ", "Failed to clear login history"));
      return;
    }
  }
  if (Array.isArray(DATA.loginHistory)) {
    DATA.loginHistory.splice(0, DATA.loginHistory.length);
  } else {
    DATA.loginHistory = [];
  }
  state.pages["login-history"] = 1;
  persistLocal();
  render();
  showToast(t("ล้างประวัติการเข้าสู่ระบบแล้ว", "Login history cleared"));
}
window.clearLoginHistoryLogs = clearLoginHistoryLogs;

async function clearAuditLogs() {
  if (state.user?.role !== "admin") return;
  if (!confirm(t("คุณต้องการล้างประวัติการแก้ไขและลบข้อมูลทั้งหมดใช่หรือไม่?", "Are you sure you want to clear all audit logs?"))) return;
  if (Array.isArray(DATA.auditLogs)) {
    DATA.auditLogs.splice(0, DATA.auditLogs.length);
  } else {
    DATA.auditLogs = [];
  }
  state.pages["audit-logs"] = 1;
  persistLocal();
  render();
  showToast(t("ล้างประวัติการแก้ไขและลบข้อมูลแล้ว", "Audit logs cleared"));
}
window.clearAuditLogs = clearAuditLogs;

function bindShell() {
  console.log("bindShell() called. Current route:", state.route);
  if (!document.body.dataset.boundLoginClearDelegated) {
    document.addEventListener("click", event => {
      const loginBtn = event.target.closest?.("[data-clear-login-logs]");
      if (loginBtn) {
        event.preventDefault();
        clearLoginHistoryLogs();
        return;
      }
      const auditBtn = event.target.closest?.("[data-clear-audit-logs]");
      if (auditBtn) {
        event.preventDefault();
        clearAuditLogs();
        return;
      }
    });
    document.body.dataset.boundLoginClearDelegated = "true";
  }

  function bindEvent(selector, event, handler) {
    const elements = document.querySelectorAll(selector);
    console.log(`bindEvent: selector="${selector}" matched ${elements.length} elements`);
    elements.forEach(el => {
      const key = `bound${event}`; // CamelCase: boundclick
      if (!el.dataset[key]) {
        el.addEventListener(event, (e) => {
          console.log(`Event listener triggered: event="${event}" on element:`, el);
          handler(el, e);
        });
        el.dataset[key] = "true";
      }
    });
  }
  function bindEventEl(el, event, handler) {
    if (!el) {
      console.log(`bindEventEl: element is null for event="${event}"`);
      return;
    }
    const key = `bound${event}`;
    if (!el.dataset[key]) {
      el.addEventListener(event, (e) => {
        console.log(`Event listener triggered: event="${event}" on static element:`, el);
        handler(el, e);
      });
      el.dataset[key] = "true";
    }
  }

  bindEvent("[data-route]", "click", (button) => {
    const route = button.dataset.route;
    console.log(`data-route click handler: route="${route}"`);
    setRoute(route);
  });
  bindEvent("[data-nav-group]", "click", (button) => {
    const groupId = button.dataset.navGroup;
    console.log(`data-nav-group click handler: groupId="${groupId}"`);
    const item = navItems.find(nav => nav.id === groupId);
    const isCurrentlyExpanded = isGroupExpanded(groupId);
    state.expandedGroups = { [groupId]: !isCurrentlyExpanded };
    const isRouteInGroup = (item.children || []).some(child => child.id === state.route);
    if (state.expandedGroups[groupId] && !isRouteInGroup) {
      setRoute(item.children[0].id);
    } else {
      render();
    }
  });

  bindEventEl(document.querySelector("[data-open-drawer]"), "click", () => { state.drawerOpen = true; render(); });
  bindEventEl(document.querySelector("[data-toggle-sidebar]"), "click", () => { state.sidebarCollapsed = !state.sidebarCollapsed; render(); });
  bindEvent("[data-close-drawer]", "click", () => { state.drawerOpen = false; render(); });
  // Handled by event delegation on #action-menu-container
  bindEvent("[data-logout]", "click", () => { state.modal = { type: "logout-confirm" }; render(); });
  bindEventEl(document.querySelector("[data-confirm-logout]"), "click", logout);

  bindEvent("[data-filter]", "input", (input) => {
    state.filters[input.dataset.filter] = input.value;
    state.pages[pageKeyForFilter(input.dataset.filter)] = 1;
    if (!updateActivePageTable()) renderPreservingFilterFocus(input);
  });

  bindEvent("[data-filter-change]", "change", (select) => {
    state.filters[select.dataset.filterChange] = select.value;
    state.pages[pageKeyForFilter(select.dataset.filterChange)] = 1;
    if (!updateActivePageTable()) render();
  });

  bindEvent("[data-reset-filters]", "click", (button) => {
    resetFilters(button.dataset.resetFilters, button.dataset.resetPageKey);
  });

  bindEvent("[data-page-key]", "click", (button) => {
    setPage(button.dataset.pageKey, Number(button.dataset.page));
  });

  bindEvent(".page-size-select", "change", (select) => {
    const key = select.dataset.pageSizeKey;
    const size = Number(select.value);
    state.pageSizes[key] = size;
    state.pages[key] = 1;
    render();
  });

  bindEvent("[data-action-menu]", "click", (button, event) => {
    event.stopPropagation();
    const key = button.dataset.actionMenu;
    if (state.actionMenu?.key === key) { state.actionMenu = null; render(); return; }
    state.actionMenu = actionMenuPosition(button, key);
    render();
  });

  const menuContainer = document.getElementById("action-menu-container");
  if (menuContainer && !menuContainer.dataset.boundClickDelegated) {
    menuContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (button) {
        event.stopPropagation();
        handleAction(button);
        return;
      }
      const scrim = event.target.closest("[data-close-action-menu]");
      if (scrim) {
        state.actionMenu = null;
        render();
      }
    });
    menuContainer.dataset.boundClickDelegated = "true";
  }

  bindEvent("[data-view-asset]", "click", (button) => {
    state.modal = { type: "asset", group: button.dataset.group, code: button.dataset.viewAsset };
    render();
  });

  bindEvent("[data-open-request]", "click", () => {
    state.modal = { type: "request" };
    render();
  });

  bindEvent("[data-open-asset]", "click", (button) => {
    state.modal = { type: "asset-form", group: button.dataset.openAsset, typeGroupCode: button.dataset.openTypeGroup || "" };
    render();
  });

  bindEvent("[data-open-checkout]", "click", (button) => {
    state.pendingCheckout = null;
    state.modal = { type: "checkout", code: button.dataset.code || "" };
    render();
  });

  bindEvent("[data-open-checkout-return]", "click", (button) => {
    const rawIndex = button.dataset.openCheckoutReturn;
    state.modal = rawIndex === "" || rawIndex === undefined
      ? { type: "checkout-return" }
      : { type: "checkout-return", index: Number(rawIndex) };
    render();
  });

  bindEvent("[data-close-modal]", "click", () => {
    if (state.modal?.type === "asset-save-confirm") state.pendingAssetSave = null;
    if (state.modal?.type === "checkout-record-confirm") state.pendingCheckoutRecord = null;
    state.selectedImageFile1 = null;
    state.selectedImageFile2 = null;
    state.modal = null;
    render();
  });

  bindEvent("[data-submit-request]", "click", submitMaintenanceRequest);
  bindEvent("[data-checkout-presave]", "click", () => {
    const selectedRef = modalValue("[data-checkout-field='asset']");
    const resolved = itemForAssetRef(selectedRef, state.modal?.assetGroup || "computer");
    const asset = resolved.item;
    const requester = modalValue("[data-checkout-field='requester']") || state.user.name;
    const dept = modalValue("[data-checkout-field='department']");
    const resolvedCode = asset?.assetCode || state.modal?.selectedAssetCode;
    state.pendingCheckout = {
      requester,
      department: dept,
      date: modalValue("[data-checkout-field='date']"),
      expectedReturn: modalValue("[data-checkout-field='expectedReturn']"),
      purpose: modalValue("[data-checkout-field='purpose']"),
      assetGroup: state.modal?.assetGroup || resolved.group || "computer",
      selectedAssetCode: resolvedCode,
    };
    submitCheckout();
  });
  bindEvent("[data-confirm-checkout-save]", "click", submitCheckout);
  bindEvent("[data-confirm-checkout-record]", "click", openCheckoutRecordConfirm);
  bindEvent("[data-confirm-checkout-record-save]", "click", confirmCheckoutRecord);
  bindEvent("[data-submit-checkout-return]", "click", submitCheckoutReturn);
  bindEvent("[data-confirm-checkout-return]", "click", confirmCheckoutReturn);
  bindEvent("[data-approve-maintenance-request]", "click", approveMaintenanceRequest);
  bindEvent("[data-reject-maintenance-request]", "click", rejectMaintenanceRequest);
  bindEvent("[data-complete-maintenance-history]", "click", completeMaintenanceHistory);
  bindEvent("[data-checkout-add-asset]", "click", () => {
    state.pendingCheckout = {
      requester: modalValue("[data-checkout-field='requester']"),
      department: modalValue("[data-checkout-field='department']"),
      date: modalValue("[data-checkout-field='date']"),
      expectedReturn: modalValue("[data-checkout-field='expectedReturn']"),
      purpose: modalValue("[data-checkout-field='purpose']"),
    };
    state.modal = {
      type: "asset-form",
      group: state.modal?.assetGroup || "computer",
      fromCheckout: true
    };
    render();
  });
  bindEvent("[data-asset-presave]", "click", presaveAsset);
  bindEvent("[data-confirm-asset-save]", "click", confirmAssetSave);
  bindEvent("[data-submit-asset]", "click", submitAsset);
  bindEvent("[data-submit-record]", "click", submitRecordEdit);
  bindEvent("[data-submit-master]", "click", submitMaster);

  function compressImage(file, callback) {
    if (!file.type.startsWith('image/')) {
      callback(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (!blob) {
            callback(file);
            return;
          }
          const newFilename = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
          const compressedFile = new File([blob], newFilename, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          callback(compressedFile);
        }, 'image/jpeg', 0.75);
      };
      img.onerror = () => callback(file);
    };
    reader.onerror = () => callback(file);
  }

  document.addEventListener("change", event => {
    const fileInput = event.target.closest("#asset-image-file-1, #asset-image-file-2");
    if (!fileInput) return;
    const isFirst = fileInput.id === "asset-image-file-1";
    const num = isFirst ? "1" : "2";
    const file = fileInput.files[0];
    if (!file) return;
    
    compressImage(file, compressedFile => {
      if (isFirst) {
        state.selectedImageFile1 = compressedFile;
      } else {
        state.selectedImageFile2 = compressedFile;
      }
      
      const reader = new FileReader();
      reader.onload = e => {
        const preview = document.querySelector(`#asset-image-preview-${num}`);
        if (preview) {
          preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        }
        const btnSelect = document.querySelector(`#btn-select-asset-image-${num} span`);
        if (btnSelect) {
          btnSelect.textContent = "เปลี่ยนรูป";
        }
        const btnDelete = document.querySelector(`#btn-delete-asset-image-${num}`);
        if (btnDelete) {
          btnDelete.style.display = "inline-flex";
        }
      };
      reader.readAsDataURL(compressedFile);
    });
  });

  document.addEventListener("click", event => {
    const btnDelete = event.target.closest("#btn-delete-asset-image-1, #btn-delete-asset-image-2");
    if (!btnDelete) return;
    
    const isFirst = btnDelete.id === "btn-delete-asset-image-1";
    const num = isFirst ? "1" : "2";
    
    if (isFirst) {
      state.selectedImageFile1 = null;
    } else {
      state.selectedImageFile2 = null;
    }
    
    const hiddenInput = document.querySelector(`input[data-asset-field='imageUrl${num}']`);
    if (hiddenInput) {
      hiddenInput.value = "";
    }
    
    const preview = document.querySelector(`#asset-image-preview-${num}`);
    if (preview) {
      preview.innerHTML = `<span style="font-size: 24px; color: var(--ink-muted);">${icon("image")}</span>`;
    }
    
    btnDelete.style.display = "none";
    
    const btnSelect = document.querySelector(`#btn-select-asset-image-${num} span`);
    if (btnSelect) {
      btnSelect.textContent = "เลือกรูป";
    }
    
    const fileInput = document.querySelector(`#asset-image-file-${num}`);
    if (fileInput) {
      fileInput.value = "";
    }
  });

  bindEvent("[data-view-record]", "click", (button) => {
    state.modal = { type: "record", collection: button.dataset.viewRecord, index: Number(button.dataset.index) };
    render();
  });

  bindEvent("[data-master-add]", "click", () => {
    state.actionMenu = null;
    state.modal = { type: "master-form", tab: state.masterTab };
    render();
  });

  bindEvent("[data-master-edit]", "click", (button) => {
    state.actionMenu = null;
    state.modal = { type: "master-form", tab: state.masterTab, index: Number(button.dataset.masterEdit) };
    render();
  });

  bindEvent("[data-master-delete]", "click", (button) => {
    const rows = DATA.master[state.masterTab] || [];
    const index = Number(button.dataset.masterDelete);
    const row = rows[index] || {};
    state.actionMenu = null;
    state.modal = { type: "delete-confirm", target: "master", tab: state.masterTab, index, label: row.name || row.code || "Master Data" };
    render();
  });

  bindEvent("[data-master-tab]", "click", (button) => {
    state.masterTab = button.dataset.masterTab;
    state.filters = {};
    state.pages[`master-${state.masterTab}`] = 1;
    render();
  });

  bindEvent("[data-settings-tab]", "click", (button) => {
    state.settingsTab = button.dataset.settingsTab;
    state.editingGeneral = false;
    state.settingsDirty = false;
    state.auditFilterSearch = "";
    state.auditFilterAction = "all";
    state.loginFilterStatus = "all";
    state.pages["audit-logs"] = 1;
    state.pages["login-history"] = 1;
    render();
  });

  bindEvent("[data-modal-asset-group]", "click", (button) => {
    state.modal = { ...(state.modal || {}), assetGroup: button.dataset.modalAssetGroup };
    render();
  });

  bindEvent("[data-return-type]", "click", (button) => {
    state.modal = {
      ...(state.modal || {}),
      type: "checkout-return",
      returnGroup: button.dataset.returnType,
      returnedDate: modalValue("[data-return-field='returnedDate']", today()),
    };
    render();
  });

  bindEvent("[data-return-field='record']", "input", refreshCheckoutReturnInfo);
  bindEvent("[data-return-field='record']", "change", refreshCheckoutReturnInfo);

  bindEvent("[data-notification-tab]", "click", (button) => {
    state.notificationTab = button.dataset.notificationTab;
    render();
  });

  bindEventEl(document.querySelector("[data-mark-read]"), "click", () => {
    systemNotifications().forEach(item => setWarrantyReadState(item.key, true));
    state.notificationTab = "all";
    persistLocal();
    render();
  });

  bindEvent("[data-read-notification]", "click", (button) => {
    setWarrantyReadState(button.dataset.readNotification, true);
    state.notificationTab = "all";
    persistLocal();
    showToast("ทำเครื่องหมายอ่านแล้ว");
  });

  bindEventEl(document.querySelector("[data-save-settings]"), "click", saveSettings);
  bindEventEl(document.querySelector("[data-save-ms-auth]"), "click", saveMicrosoftAuthSettings);
  bindEvent("[data-setting]", "input", (input) => {
    markSettingsDirty(input);
  });
  bindEvent("[data-setting]", "change", (input) => {
    markSettingsDirty(input);
    applyGeneralOverviewSetting(input);
  });

  bindEvent("[data-login-filter-status]", "change", (select) => {
    // รีเซ็ตหน้ากลับ 1 เมื่อเปลี่ยนฟิลเตอร์
    state.loginFilterStatus = select.value;
    state.pages["login-history"] = 1;
    render();
  });

  bindEvent("[data-audit-filter-action]", "change", (select) => {
    state.auditFilterAction = select.value;
    state.pages["audit-logs"] = 1;
    render();
  });

  bindEvent("[data-audit-search]", "input", (input) => {
    state.auditFilterSearch = input.value;
    state.pages["audit-logs"] = 1;
    render();
  });

  bindEvent("[data-clear-login-logs]", "click", clearLoginHistoryLogs);
  bindEvent("[data-delete-all], [data-delete-all-data], [data-clear-all-data]", "click", () => {
    state.modal = { type: "delete-all-confirm" };
    render();
  });
  bindEvent("[data-confirm-delete-all]", "click", deleteAllData);
  bindEvent("[data-confirm-delete]", "click", confirmDelete);
  bindEventEl(document.querySelector("[data-edit-general]"), "click", () => { state.editingGeneral = true; render(); });
  bindEventEl(document.querySelector("[data-cancel-general]"), "click", () => { state.editingGeneral = false; render(); });

  bindEventEl(document.querySelector("[data-save-general]"), "click", () => {
    document.querySelectorAll(".settings-panel [data-setting]").forEach(input => {
      const key = input.dataset.setting;
      if (!key) return;
      applySettingValue(key, settingInputValue(input));
    });
    persistLocal();
    state.editingGeneral = false;
    state.settingsDirty = false;
    render();
    showToast(t("บันทึกการตั้งค่าสำเร็จ", "Settings saved successfully"));
  });

  bindEvent(".settings-panel [data-setting]", "change", (input) => {
    const key = input.dataset.setting;
    if (!key) return;
    applySettingValue(key, settingInputValue(input));
    persistLocal();
    render();
  });

  bindEvent("[data-set-lang]", "click", (button) => {
    state.lang = button.dataset.setLang;
    localStorage.setItem("asset-control-lang", state.lang);
    render();
  });

  bindEventEl(document.querySelector("[data-open-user-form]"), "click", () => { state.modal = { type: "user-form" }; render(); });

  bindEvent("[data-edit-user]", "click", (button) => {
    state.actionMenu = null;
    state.modal = { type: "user-form", index: Number(button.dataset.editUser) };
    render();
  });

  bindEvent("[data-edit-profile]", "click", (button) => {
    state.modal = { type: "user-form", index: Number(button.dataset.editProfile) };
    render();
  });

  bindEvent("[data-reset-user-pw]", "click", (button) => {
    state.actionMenu = null;
    state.modal = { type: "reset-user-pw", index: Number(button.dataset.resetUserPw) };
    render();
  });

  bindEvent("[data-user-avatar-file]", "change", (input) => {
    const file = input.files && input.files[0];
    if (!file) return;
    compressImage(file, (compressedFile) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const hiddenInput = document.getElementById("user-avatar-hidden-input");
        const preview = document.getElementById("user-avatar-preview");
        if (hiddenInput) hiddenInput.value = dataUrl;
        if (preview) {
          preview.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:cover">`;
        }
      };
      reader.readAsDataURL(compressedFile);
    });
  });

  bindEvent("#remove-user-avatar-btn", "click", () => {
    const hiddenInput = document.getElementById("user-avatar-hidden-input");
    const preview = document.getElementById("user-avatar-preview");
    if (hiddenInput) hiddenInput.value = "";
    if (preview) {
      preview.innerHTML = `<span style="font-size:32px; color:var(--brand)">${icon("user")}</span>`;
    }
  });

  bindEvent("[data-submit-user]", "click", (button) => {
    submitUser(button.dataset.submitUser);
  });

  bindEvent("[data-submit-user-pw]", "click", (button) => {
    submitUserPassword(button.dataset.submitUserPw);
  });

  bindEvent("[data-toggle-user-active]", "click", (button) => {
    const idx = Number(button.dataset.toggleUserActive);
    const user = DATA.users[idx];
    if (user) {
      user.active = user.active === false ? true : false;
      persistLocal();
      render();
      showToast(t("อัปเดตสถานะผู้ใช้งานแล้ว", "User status updated"));
    }
  });

  bindEvent("[data-delete-user]", "click", (button) => {
    state.actionMenu = null;
    const idx = Number(button.dataset.deleteUser);
    const user = DATA.users[idx];
    if (user) {
      if (user.username === state.user.username) {
        render();
        alert(t("คุณไม่สามารถลบบัญชีของตัวเองที่กำลังใช้งานได้", "You cannot delete your own logged-in account"));
        return;
      }
      state.modal = { type: "delete-confirm", target: "user", index: idx, label: user.username || user.name || "User" };
      render();
    }
  });

  bindEventEl(document.querySelector("[data-backup-db]"), "click", backupDatabase);
  bindEventEl(document.getElementById("restore-db-file"), "change", restoreDatabase);
  bindEventEl(document.querySelector("[data-test-connection]"), "click", testConnection);

  if (state.settingsTab === "data") setTimeout(testConnection, 100);
  if (!window.boundNetworkStatusListeners) {
    window.boundNetworkStatusListeners = true;
    window.addEventListener("online", () => { if (state.settingsTab === "data") testConnection(); });
    window.addEventListener("offline", () => { if (state.settingsTab === "data") testConnection(); });
  }
  bindDonutTooltip();
}
function bindDonutTooltip() {
  document.querySelectorAll("[data-donut-chart]").forEach(donut => {
    const key = "boundDonut";
    if (donut.dataset[key]) return;
    donut.dataset[key] = "true";

    const tooltip = donut.querySelector("[data-donut-tooltip]");
    if (!tooltip) return;
    const updateTooltip = event => {
      const rect = donut.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const outer = rect.width / 2;
      const inner = outer * 0.32;
      if (radius < inner || radius > outer) { donut.classList.remove("tooltip-active"); return; }
      const angle = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
      const computerDeg = Number(donut.dataset.computerDeg || 0);
      const isComputer = angle <= computerDeg;
      tooltip.innerHTML = `${isComputer ? "Computer Assets" : "Other Assets"} <strong>${isComputer ? donut.dataset.computerCount : donut.dataset.otherCount}</strong>`;
      donut.style.setProperty("--tip-x", `${Math.min(Math.max(x, 44), rect.width - 44)}px`);
      donut.style.setProperty("--tip-y", `${Math.min(Math.max(y, 26), rect.height - 26)}px`);
      donut.classList.add("tooltip-active");
    };
    donut.addEventListener("pointermove", updateTooltip);
    donut.addEventListener("pointerleave", () => donut.classList.remove("tooltip-active"));
    donut.addEventListener("focus", () => donut.classList.add("tooltip-active"));
    donut.addEventListener("blur", () => donut.classList.remove("tooltip-active"));
  });
}

// Document-level delegated event listeners for Image Lightbox (Preview)
document.addEventListener("click", event => {
  const openLightbox = event.target.closest("[data-open-lightbox]");
  if (openLightbox) {
    event.preventDefault();
    state.previewImageUrl = openLightbox.dataset.openLightbox;
    render();
    return;
  }

  const closeLightbox = event.target.closest("[data-close-lightbox]");
  if (closeLightbox) {
    event.preventDefault();
    state.previewImageUrl = null;
    render();
    return;
  }
});

// Document-level delegated change event listener for type dropdown
document.addEventListener("change", event => {
  if (event.target.id === "asset-type-select") {
    const selectedType = event.target.value;
    const allTypes = DATA.master.types || [];
    const typeObj = allTypes.find(t => (t.name || t.code) === selectedType);
    const groupCode = typeObj ? (typeObj.groupCode || "") : "";
    
    // Update the Group label
    const typeGroups = DATA.master.typeGroups || [];
    const groupObj = typeGroups.find(g => g.code === groupCode);
    const groupLabel = groupObj ? groupObj.name : groupCode || "ทุกกลุ่มประเภท";
    
    const displayEl = document.getElementById("asset-typegroup-display");
    if (displayEl) {
      displayEl.textContent = groupLabel;
      displayEl.dataset.typeGroup = groupCode;
    }
    
    // Update dynamic fields and checklist
    const dynamicFieldsContainer = document.getElementById("dynamic-fields-container");
    if (dynamicFieldsContainer) {
      dynamicFieldsContainer.innerHTML = typeof getDynamicFormHtml === "function" ? getDynamicFormHtml(groupCode, {}) : "";
    }
    
    const dynamicChecklistContainer = document.getElementById("dynamic-checklist-container");
    if (dynamicChecklistContainer) {
      dynamicChecklistContainer.innerHTML = typeof getDynamicChecklistHtml === "function" ? getDynamicChecklistHtml(groupCode, {}) : "";
    }
  }
});



// ============================================================
// app.js — Entry point: render loop and boot
// ============================================================

function render() {
  applyAppPreferences();
  const app = document.getElementById("app");
  if (!state.user) {
    app.innerHTML = renderLogin();
    translateUi(app);
    bindLogin();
    return;
  }
  if (!routeAllowed(state.route)) state.route = "dashboard";

  let shell = app.querySelector(".app-shell");
  if (shell && shell.dataset.lang !== state.lang) {
    shell = null;
  }
  if (!shell) {
    app.innerHTML = renderShell();
  } else {
    // 1. Update Workspace class
    const workspace = shell.querySelector(".workspace");
    if (workspace) {
      workspace.className = `workspace ${state.sidebarCollapsed ? "sidebar-collapsed" : ""}`;

      // Update drawer backdrop
      let backdrop = workspace.querySelector(".drawer-backdrop");
      if (state.drawerOpen) {
        if (!backdrop) {
          workspace.insertAdjacentHTML("afterbegin", '<div class="drawer-backdrop" data-close-drawer></div>');
        }
      } else if (backdrop) {
        backdrop.remove();
      }
    }

    // 2. Update Sidebar drawer open class
    const sidebar = shell.querySelector(".sidebar");
    if (sidebar) {
      sidebar.className = `sidebar ${state.drawerOpen ? "open" : ""}`;
    }

    // 3. Update Nav
    const nav = shell.querySelector(".nav");
    if (nav) {
      refreshNav(nav);
    }

    // 4. Update Sidebar bottom
    const sidebarBottom = shell.querySelector(".sidebar-bottom");
    if (sidebarBottom) {
      const currentUser = registeredUsers().find(u => String(u.username).toLowerCase() === String(state.user?.username).toLowerCase()) || state.user || {};
      const userAvatar = currentUser.avatar || state.user?.avatar || "";
      const langStripHtml = `
      <div class="lang-strip" style="display:flex; ${state.sidebarCollapsed ? "justify-content:center" : "justify-content:space-between"}; align-items:center; padding:${state.sidebarCollapsed ? "10px 10px" : "10px 22px"}; border-top:1px solid rgba(255,255,255,.14)">
        ${state.sidebarCollapsed ? "" : `<span style="font-size:12px; font-weight:800; opacity:0.8; color:#fff">${t("ภาษา / Language", "Language")}</span>`}
        <div style="display:flex; gap:6px; align-items:center">
          <button class="lang-btn" data-set-lang="th" style="background:transparent; border:0; color:#fff; font-weight:bold; font-size:12px; cursor:pointer; opacity:${state.lang === 'th' ? '1' : '0.5'}">TH</button>
          <span style="opacity:0.5; color:#fff; font-size:12px">|</span>
          <button class="lang-btn" data-set-lang="en" style="background:transparent; border:0; color:#fff; font-weight:bold; font-size:12px; cursor:pointer; opacity:${state.lang === 'en' ? '1' : '0.5'}">EN</button>
        </div>
      </div>
      `;
      sidebarBottom.innerHTML = `
        ${langStripHtml}
        <button class="sidebar-footer-btn" data-toggle-sidebar>${icon("checkout")}<span>${state.sidebarCollapsed ? t("ขยายเมนู", "Expand Menu") : t("ย่อเมนู", "Collapse Menu")}</span></button>
        <div class="user-strip">
          <span class="avatar" style="overflow:hidden; display:grid; place-items:center">${userAvatar ? `<img src="${esc(userAvatar)}" style="width:100%; height:100%; object-fit:cover; border-radius:50%">` : icon("user")}</span>
          <div style="flex:1"><strong>${esc(state.user.name)}</strong><div class="role-pill">${esc(state.user.role)}</div></div>
          <button class="more-btn" data-logout title="Logout">${icon("logout")}</button>
        </div>
      `;
    }

    // 5. Update Content
    const content = shell.querySelector(".content");
    if (content) {
      content.className = `content ${state.route === "dashboard" ? "dashboard-content" : ""} route-${state.route}`;
      content.innerHTML = renderRoute();
    }

    // 6. Update badge count
    const unreadWarrantyNotifications = systemNotifications().filter(item => !item.read).length;
    const bellWrap = shell.querySelector(".bell-wrap");
    if (bellWrap) {
      const badge = bellWrap.querySelector(".badge-count");
      if (unreadWarrantyNotifications > 0) {
        if (badge) {
          badge.textContent = unreadWarrantyNotifications;
        } else {
          bellWrap.insertAdjacentHTML("beforeend", `<span class="badge-count">${unreadWarrantyNotifications}</span>`);
        }
      } else if (badge) {
        badge.remove();
      }
    }

    // 7. Update overlay containers
    const actionMenuContainer = document.getElementById("action-menu-container");
    if (actionMenuContainer) {
      actionMenuContainer.innerHTML = renderActionMenuOverlay();
    }

    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) {
      modalContainer.innerHTML = state.modal ? renderModal(state.modal) : "";
    }

    const lightboxContainer = document.getElementById("lightbox-container");
    if (lightboxContainer) {
      lightboxContainer.innerHTML = state.previewImageUrl ? renderLightbox(state.previewImageUrl) : "";
    }

    const toastContainer = document.getElementById("toast-container");
    if (toastContainer) {
      toastContainer.innerHTML = state.toast ? `<div class="toast">${icon("check")}<span>${esc(state.toast.message)}</span></div>` : "";
    }
  }
  translateUi(app);
  bindShell();
}

async function getClientIPv4() {
  // 1. Try public IPv4 only service to force IPv4 lookup
  try {
    const ipRes = await fetch("https://api4.ipify.org?format=json");
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.ip && !ipData.ip.includes(":")) {
        return ipData.ip;
      }
    }
  } catch (err) {
    console.warn("api4.ipify.org lookup failed:", err);
  }

  // 2. Try secondary public IPv4 only service
  try {
    const ipRes = await fetch("https://ipv4.icanhazip.com");
    if (ipRes.ok) {
      const text = await ipRes.text();
      const ip = text.trim();
      if (ip && !ip.includes(":")) {
        return ip;
      }
    }
  } catch (err) {
    console.warn("ipv4.icanhazip.com lookup failed:", err);
  }

  // 3. Fallback to server's IP resolver (which maps local addresses correctly)
  if (DATABASE_API_ENABLED) {
    try {
      const ipRes = await fetch("/api/ip");
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        return ipData.ip;
      }
    } catch (err) {
      console.warn("Backend IP lookup failed:", err);
    }
  }

  return "127.0.0.1";
}

async function boot() {
  state.clientIp = await getClientIPv4();

  if (DATABASE_API_ENABLED) {
    await loadServerDatabase();
    window.setInterval(pollServerDatabase, 4000);
  }
  render();
}

boot();
