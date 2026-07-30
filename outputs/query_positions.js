const SUPABASE_URL = "https://tzmiavpdslpmpzowabxa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bWlhdnBkc2xwbXB6b3dhYnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODE3MTAsImV4cCI6MjEwMDQ1NzcxMH0.oYobcUzpQRO2OdBvsKmW0aBNaCYDE1f6N1vF5gXkzIk";

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
