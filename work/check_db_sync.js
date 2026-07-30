import fs from "fs";
import path from "path";

const SUPABASE_URL = "https://tzmiavpdslpmpzowabxa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bWlhdnBkc2xwbXB6b3dhYnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODE3MTAsImV4cCI6MjEwMDQ1NzcxMH0.oYobcUzpQRO2OdBvsKmW0aBNaCYDE1f6N1vF5gXkzIk";
const ASSET_CONTROL_API_TOKEN = "ae30e5720054020b4a2525fbf70819e48065e4dcb6d900f5";

const LOCAL_DB_PATH = "./outputs/database/asset-control-database.json";

async function checkSync() {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      console.log("❌ ไม่พบไฟล์ Local Database ในระบบ");
      return;
    }
    const localRaw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    const localDb = JSON.parse(localRaw);

    console.log("🔄 กำลังดึงข้อมูลจาก Supabase Cloud Database...");
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/asset_control_get_database`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_token: ASSET_CONTROL_API_TOKEN
      })
    });

    if (!response.ok) {
      throw new Error(`ดึงข้อมูลไม่สำเร็จ: ${response.status} - ${await response.text()}`);
    }

    const supabaseDb = await response.json();

    console.log("\n================ เปรียบเทียบข้อมูล ================");
    console.log(`ข้อมูล Local ล่าสุด (generatedAt): ${localDb.generatedAt || "ไม่มี"}`);
    console.log(`ข้อมูล Supabase ล่าสุด (generatedAt): ${supabaseDb.generatedAt || "ไม่มี"}`);

    const comparisons = [
      { name: "คอมพิวเตอร์ (computerAssets)", local: localDb.computerAssets?.length || 0, cloud: supabaseDb.computerAssets?.length || 0 },
      { name: "ทรัพย์สินอื่นๆ (otherAssets)", local: localDb.otherAssets?.length || 0, cloud: supabaseDb.otherAssets?.length || 0 },
      { name: "ผู้ใช้งาน (users)", local: localDb.users?.length || 0, cloud: supabaseDb.users?.length || 0 },
      { name: "รายการแจ้งซ่อม (maintenanceRequests)", local: localDb.maintenanceRequests?.length || 0, cloud: supabaseDb.maintenanceRequests?.length || 0 },
      { name: "ประวัติการยืม-คืน (checkoutRecords)", local: localDb.checkoutRecords?.length || 0, cloud: supabaseDb.checkoutRecords?.length || 0 }
    ];

    let allMatch = true;
    comparisons.forEach(c => {
      const match = c.local === c.cloud;
      if (!match) allMatch = false;
      console.log(`${match ? "✅" : "❌"} ${c.name}: Local = ${c.local} รายการ | Cloud = ${c.cloud} รายการ`);
    });

    console.log("==================================================\n");

    if (allMatch) {
      console.log("🎉 ข้อมูลทุกอย่างตรงกัน 100%! บันทึกขึ้น Supabase เรียบร้อยแล้วครับ");
    } else {
      console.log("⚠️ ข้อมูลบางส่วนยังไม่ซิงค์กันกรุณาตรวจสอบเซิร์ฟเวอร์");
    }

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการตรวจสอบ:", error.message);
  }
}

checkSync();
