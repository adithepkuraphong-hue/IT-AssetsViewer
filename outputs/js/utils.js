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

