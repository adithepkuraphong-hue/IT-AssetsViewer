const SUPABASE_URL = "https://wuaguygiahaiptlamqvt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YWd1eWdpYWhhaXB0bGFtcXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTgwOTksImV4cCI6MjA5NzQ3NDA5OX0.cBiVs8-rl9wboPv3TD093ANetJHTc_Q7Ao96ktngPTw";
const TOKEN = "ae30e5720054020b4a2525fbf70819e48065e4dcb6d900f5";

async function testGet() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/asset_control_get_database`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ p_token: TOKEN })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Master keys:", Object.keys(data.master || {}));
    console.log("Positions:", data.master?.positions);
  } catch (err) {
    console.error("Error:", err);
  }
}

testGet();
