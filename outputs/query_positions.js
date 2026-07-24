const SUPABASE_URL = "https://wuaguygiahaiptlamqvt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YWd1eWdpYWhhaXB0bGFtcXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTgwOTksImV4cCI6MjA5NzQ3NDA5OX0.cBiVs8-rl9wboPv3TD093ANetJHTc_Q7Ao96ktngPTw";

async function queryTable() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/master_positions?select=*`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });
    console.log("Status:", res.status);
    console.log("Response:", await res.text());
  } catch (err) {
    console.error("Error:", err);
  }
}

queryTable();
