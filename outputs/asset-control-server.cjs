const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const vm = require("vm");
const { spawn } = require("child_process");

const ROOT = __dirname;
const DB_DIR = path.join(ROOT, "database");
const DB_FILE = path.join(DB_DIR, "asset-control-database.json");
const DATA_JS_FILE = path.join(ROOT, "asset-data.js");
const WORKSPACE_ROOT = path.resolve(ROOT, "..");
const EXPORT_SCRIPT = path.join(WORKSPACE_ROOT, "work", "export_database.mjs");
const PORT = Number(process.env.ASSET_CONTROL_PORT || 8787);
const HOST = process.env.ASSET_CONTROL_HOST || "127.0.0.1";
const SUPABASE_URL = (process.env.SUPABASE_URL || "https://wuaguygiahaiptlamqvt.supabase.co").replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YWd1eWdpYWhhaXB0bGFtcXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTgwOTksImV4cCI6MjA5NzQ3NDA5OX0.cBiVs8-rl9wboPv3TD093ANetJHTc_Q7Ao96ktngPTw";
const ASSET_CONTROL_API_TOKEN = process.env.ASSET_CONTROL_API_TOKEN || "ae30e5720054020b4a2525fbf70819e48065e4dcb6d900f5";
const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_KEY && ASSET_CONTROL_API_TOKEN);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const csvSchemas = {
  metadata: [
    ["sourceFile", data => data.sourceFile],
    ["sourceId", data => data.sourceId],
    ["generatedAt", data => data.generatedAt],
    ["computerAssets", data => data.computerAssets.length],
    ["otherAssets", data => data.otherAssets.length],
  ],
  computerAssets: ["assetCode", "rustDeskId", "company", "type", "brand", "model", "serial", "user", "department", "location", "room", "purchaseDate", "status", "warrantyExpirationDate", "windowsVersion", "sentForRepairDate", "adapter", "mouse", "laptopBag", "syncOneDrive", "remark", "imageUrl"],
  otherAssets: ["assetCode", "company", "type", "brand", "model", "serial", "location", "room", "purchaseDate", "status", "warrantyExpirationDate", "remark", "imageUrl"],
  maintenanceHistory: ["title", "asset", "type", "date", "completedDate", "cost", "status", "operator", "desc"],
  maintenanceRequests: ["title", "asset", "brand", "type", "requester", "date", "priority", "status", "desc", "approvedDate", "approvalNote"],
  checkoutRecords: ["asset", "sub", "brand", "type", "requester", "department", "date", "returnedDate", "purpose", "status"],
  notifications: ["title", "desc", "category", "date", "type", "read"],
  loginHistory: ["name", "role", "time", "ip", "status"],
  auditLogs: ["username", "name", "action", "target", "desc", "time"],
  users: ["username", "email", "password", "name", "department", "role", "active", "avatar"],
  masterCompanies: ["code", "name"],
  masterDepartments: ["code", "name"],
  masterLocations: ["code", "name"],
  masterTypes: ["code", "name"],
  masterTypeGroups: ["code", "name"],
  masterStatuses: ["code", "name"],
  masterPositions: ["code", "name"],
};

function normalizeDatabase(input = {}) {
  const master = input.master || {};
  const database = {
    sourceFile: input.sourceFile || "asset-control-database.json",
    sourceId: input.sourceId || "asset-control-live-database",
    generatedAt: input.generatedAt || new Date().toISOString(),
    computerAssets: Array.isArray(input.computerAssets) ? input.computerAssets : [],
    otherAssets: Array.isArray(input.otherAssets) ? input.otherAssets : [],
    master: {
      companies: Array.isArray(master.companies) ? master.companies : [],
      departments: Array.isArray(master.departments) ? master.departments : [],
      locations: Array.isArray(master.locations) ? master.locations : [],
      types: Array.isArray(master.types) ? master.types : [],
      typeGroups: Array.isArray(master.typeGroups) ? master.typeGroups : [],
      statuses: Array.isArray(master.statuses) ? master.statuses : [],
      positions: Array.isArray(master.positions) ? master.positions : [],
    },
    maintenanceHistory: Array.isArray(input.maintenanceHistory) ? input.maintenanceHistory : [],
    maintenanceRequests: Array.isArray(input.maintenanceRequests) ? input.maintenanceRequests : [],
    checkoutRecords: Array.isArray(input.checkoutRecords) ? input.checkoutRecords : [],
    notifications: Array.isArray(input.notifications) ? input.notifications : [],
    loginHistory: Array.isArray(input.loginHistory) ? input.loginHistory : [],
    auditLogs: Array.isArray(input.auditLogs) ? input.auditLogs : [],
    users: Array.isArray(input.users) && input.users.length ? input.users : [
      { username: "admin", email: "admin@kochpackaging.co.th", password: "admin123", name: "Admin User", department: "IT", role: "admin", active: true },
      { username: "user", email: "user@kochpackaging.co.th", password: "user123", name: "User Name", department: "Accounting", role: "user", active: true },
    ],
  };
  const defaultUsersByName = new Map([
    ["admin", { email: "admin@kochpackaging.co.th", department: "IT" }],
    ["user", { email: "user@kochpackaging.co.th", department: "Accounting" }],
  ]);
  database.users = database.users.map(user => ({
    ...user,
    email: user.email || defaultUsersByName.get(user.username)?.email || "",
    department: user.department || defaultUsersByName.get(user.username)?.department || "",
    avatar: user.avatar || "",
  }));
  return database;
}

async function loadFromAssetData() {
  const source = await fs.promises.readFile(DATA_JS_FILE, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: DATA_JS_FILE });
  return normalizeDatabase(sandbox.window.ASSET_CONTROL_DATA || {});
}

async function ensureDatabase() {
  await fs.promises.mkdir(DB_DIR, { recursive: true });
  try {
    await fs.promises.access(DB_FILE, fs.constants.R_OK);
  } catch {
    const data = await loadFromAssetData();
    await saveDatabase(data);
  }
}

async function readDatabase() {
  if (SUPABASE_ENABLED) {
    try {
      const rawFromSupabase = await readSupabaseDatabase();
      let fileAuditLogs = [];
      try {
        const rawFile = await fs.promises.readFile(DB_FILE, "utf8");
        fileAuditLogs = JSON.parse(rawFile).auditLogs || [];
      } catch {}
      const mergedSupabaseData = {
        ...rawFromSupabase,
        auditLogs: Array.isArray(rawFromSupabase?.auditLogs) ? rawFromSupabase.auditLogs : fileAuditLogs
      };
      const data = normalizeDatabase(mergedSupabaseData);
      return {
        data,
        source: "supabase",
        version: Date.parse(data.generatedAt) || Date.now(),
      };
    } catch (error) {
      console.warn("Supabase load failed (offline?), falling back to local file database:", error.message);
    }
  }

  await ensureDatabase();
  const raw = await fs.promises.readFile(DB_FILE, "utf8");
  const data = normalizeDatabase(JSON.parse(raw));
  const stat = await fs.promises.stat(DB_FILE);
  await refreshSidecarFilesIfNeeded(data, stat.mtimeMs);
  return { data, version: stat.mtimeMs, source: "local-file-fallback" };
}

async function saveDatabase(input) {
  let oldData = null;
  try {
    const raw = await fs.promises.readFile(DB_FILE, "utf8");
    oldData = normalizeDatabase(JSON.parse(raw));
  } catch {}

  const mergedAuditLogs = Array.isArray(input.auditLogs) ? input.auditLogs : (oldData?.auditLogs || []);
  const newData = normalizeDatabase({ ...input, auditLogs: mergedAuditLogs, generatedAt: new Date().toISOString() });

  if (SUPABASE_ENABLED) {
    try {
      const rawSupabaseResult = await writeSupabaseDatabase(newData);
      const data = normalizeDatabase({
        ...rawSupabaseResult,
        auditLogs: Array.isArray(rawSupabaseResult?.auditLogs) ? rawSupabaseResult.auditLogs : mergedAuditLogs
      });
      await fs.promises.mkdir(DB_DIR, { recursive: true });
      await fs.promises.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
      await writeSidecarFiles(data);
      await exportWorkbook();
      
      if (oldData) {
        deleteReplacedImages(oldData, data).catch(err => console.error("Cleanup error:", err));
      }
      
      return {
        data,
        source: "supabase",
        version: Date.parse(data.generatedAt) || Date.now(),
      };
    } catch (error) {
      console.warn("Supabase save failed (offline?), falling back to local file database:", error.message);
    }
  }

  await fs.promises.mkdir(DB_DIR, { recursive: true });
  await fs.promises.writeFile(DB_FILE, JSON.stringify(newData, null, 2), "utf8");
  await writeSidecarFiles(newData);
  await exportWorkbook();
  
  if (oldData) {
    deleteReplacedImages(oldData, newData).catch(err => console.error("Cleanup error:", err));
  }
  
  const stat = await fs.promises.stat(DB_FILE);
  return { data: newData, version: stat.mtimeMs, source: "local-file-fallback" };
}

async function checkSupabaseHealth() {
  if (!SUPABASE_ENABLED) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: "GET",
      headers: { apikey: SUPABASE_KEY },
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok || res.status === 401;
  } catch (e) {
    return false;
  }
}

async function supabaseRpc(functionName, payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase RPC ${functionName} failed (${response.status}): ${detail}`);
  }
  return response.json();
}

async function readSupabaseDatabase() {
  return supabaseRpc("asset_control_get_database", {
    p_token: ASSET_CONTROL_API_TOKEN,
  });
}

async function writeSupabaseDatabase(data) {
  return supabaseRpc("asset_control_replace_database", {
    p_token: ASSET_CONTROL_API_TOKEN,
    p_database: data,
  });
}

async function clearSupabaseLoginHistory() {
  return supabaseRpc("asset_control_clear_login_history", {
    p_token: ASSET_CONTROL_API_TOKEN,
  });
}

async function clearLoginHistoryDatabase() {
  if (SUPABASE_ENABLED) {
    const data = normalizeDatabase(await clearSupabaseLoginHistory());
    await fs.promises.mkdir(DB_DIR, { recursive: true });
    await fs.promises.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    await writeSidecarFiles(data);
    await exportWorkbook();
    return {
      data,
      source: "supabase",
      version: Date.parse(data.generatedAt) || Date.now(),
    };
  }

  const current = (await readDatabase()).data;
  current.loginHistory = [];
  return saveDatabase(current);
}

async function refreshSidecarFilesIfNeeded(data, dbMtimeMs) {
  let shouldRefresh = false;
  for (const file of [DATA_JS_FILE, path.join(DB_DIR, "metadata.csv")]) {
    try {
      const stat = await fs.promises.stat(file);
      if (stat.mtimeMs + 1 < dbMtimeMs) shouldRefresh = true;
    } catch {
      shouldRefresh = true;
    }
  }
  if (shouldRefresh) await writeSidecarFiles(data);
}

function exportWorkbook() {
  if (!fs.existsSync(EXPORT_SCRIPT)) return Promise.resolve();
  return new Promise(resolve => {
    const child = spawn(process.execPath, [EXPORT_SCRIPT], {
      cwd: WORKSPACE_ROOT,
      stdio: "ignore",
      windowsHide: true,
    });
    child.on("error", resolve);
    child.on("exit", resolve);
  });
}

async function writeSidecarFiles(data) {
  const dataJs = `window.ASSET_CONTROL_DATA = ${JSON.stringify(data, null, 2)};\n`;
  await fs.promises.writeFile(DATA_JS_FILE, dataJs, "utf8");
  await writeCsvFiles(data);
}

async function writeCsvFiles(data) {
  const collections = {
    metadata: [data],
    computerAssets: data.computerAssets,
    otherAssets: data.otherAssets,
    maintenanceHistory: data.maintenanceHistory,
    maintenanceRequests: data.maintenanceRequests,
    checkoutRecords: data.checkoutRecords,
    notifications: data.notifications,
    loginHistory: data.loginHistory,
    auditLogs: data.auditLogs || [],
    users: data.users,
    masterCompanies: data.master.companies,
    masterDepartments: data.master.departments,
    masterLocations: data.master.locations,
    masterTypes: data.master.types,
    masterTypeGroups: data.master.typeGroups,
    masterStatuses: data.master.statuses,
    masterPositions: data.master.positions || [],
  };
  await Promise.all(Object.entries(collections).map(([name, rows]) => {
    const csv = toCsv(rows, csvSchemas[name]);
    return fs.promises.writeFile(path.join(DB_DIR, `${name}.csv`), `\uFEFF${csv}`, "utf8");
  }));
}

function toCsv(rows, schema) {
  const headers = schema.map(col => Array.isArray(col) ? col[0] : col);
  const body = rows.map(row => schema.map(col => csvCell(Array.isArray(col) ? col[1](row) : row[col])).join(","));
  return [headers.map(csvCell).join(","), ...body].join("\r\n");
}

function csvCell(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (Array.isArray(value)) return `"${value.join("; ").replace(/"/g, '""')}"`;
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(body));
}

function readRequestJson(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", chunk => {
      raw += chunk;
      if (raw.length > 20 * 1024 * 1024) {
        reject(new Error("Request body is too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

async function deleteReplacedImages(oldData, newData) {
  if (!SUPABASE_ENABLED) return;
  try {
    const oldFiles = new Set();
    const newFiles = new Set();
    
    const parseUrl = (urlStr, set) => {
      if (!urlStr) return;
      urlStr.split(",").forEach(url => {
        const trimmed = url.trim();
        if (trimmed) {
          set.add(path.basename(trimmed));
        }
      });
    };
    
    if (oldData) {
      oldData.computerAssets.forEach(a => parseUrl(a.imageUrl, oldFiles));
      oldData.otherAssets.forEach(a => parseUrl(a.imageUrl, oldFiles));
    }
    
    if (newData) {
      newData.computerAssets.forEach(a => parseUrl(a.imageUrl, newFiles));
      newData.otherAssets.forEach(a => parseUrl(a.imageUrl, newFiles));
    }
    
    const filesToDelete = Array.from(oldFiles).filter(f => !newFiles.has(f));
    
    if (filesToDelete.length === 0) return;
    
    console.log("Automatically deleting replaced/removed images:", filesToDelete);
    
    const deleteRes = await fetch(`${SUPABASE_URL}/storage/v1/object/asset-images`, {
      method: "DELETE",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prefixes: filesToDelete })
    });
    
    if (deleteRes.ok) {
      console.log(`Successfully deleted ${filesToDelete.length} files from Supabase Storage.`);
      const uploadDir = path.join(ROOT, "uploads");
      for (const filename of filesToDelete) {
        const localPath = path.join(uploadDir, filename);
        try {
          await fs.promises.unlink(localPath);
          console.log("Deleted local copy:", filename);
        } catch {}
      }
    } else {
      console.warn("Failed to delete files from Supabase Storage:", deleteRes.status, await deleteRes.text());
    }
  } catch (error) {
    console.error("Error during image cleanup:", error.message);
  }
}

async function serveStatic(request, response, pathname) {
  const safePath = pathname === "/" ? "/asset-control.html" : pathname;
  const filePath = path.resolve(ROOT, `.${safePath}`);
  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  try {
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = http.createServer(async (request, response) => {
  const pathname = decodeURIComponent(url.parse(request.url).pathname || "/");
  try {
    if (request.method === "OPTIONS") {
      sendJson(response, 204, {});
      return;
    }
    if (pathname === "/api/ip") {
      const cfIp = request.headers["cf-connecting-ip"];
      const xff = request.headers["x-forwarded-for"];
      let ip = cfIp || (xff ? xff.split(",")[0].trim() : request.socket.remoteAddress) || "127.0.0.1";
      if (ip.startsWith("::ffff:")) {
        ip = ip.substring(7);
      }
      if (ip === "::1") {
        ip = "127.0.0.1";
      }
      sendJson(response, 200, { ip });
      return;
    }

    if (pathname === "/api/status") {
      const supabaseOnline = await checkSupabaseHealth();
      sendJson(response, 200, {
        ok: true,
        serverOnline: true,
        supabaseOnline,
        source: (SUPABASE_ENABLED && supabaseOnline) ? "supabase" : "local-file",
        database: (SUPABASE_ENABLED && supabaseOnline) ? `${SUPABASE_URL}/rest/v1` : DB_FILE,
      });
      return;
    }
    if (pathname === "/api/database" && request.method === "GET") {
      sendJson(response, 200, await readDatabase());
      return;
    }
    if (pathname === "/api/database" && request.method === "POST") {
      const body = await readRequestJson(request);
      sendJson(response, 200, { ok: true, ...(await saveDatabase(body)) });
      return;
    }
    if (pathname === "/api/upload" && request.method === "POST") {
      const parsedUrl = url.parse(request.url, true);
      let filename = parsedUrl.query.filename || "image.jpg";
      filename = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFilename = `img_${Date.now()}_${filename}`;
      
      const chunks = [];
      for await (const chunk of request) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);
      
      let imageUrlResult = `/uploads/${uniqueFilename}`;
      
      const uploadDir = path.join(ROOT, "uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });
      const targetPath = path.join(uploadDir, uniqueFilename);
      await fs.promises.writeFile(targetPath, fileBuffer);
      
      if (SUPABASE_ENABLED) {
        try {
          console.log(`Uploading ${uniqueFilename} to Supabase Storage...`);
          await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
            method: "POST",
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: "asset-images", name: "asset-images", public: true })
          }).catch(() => {});
          
          const uploadUrl = `${SUPABASE_URL}/storage/v1/object/asset-images/${uniqueFilename}`;
          const res = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": `Bearer ${SUPABASE_KEY}`,
              "Content-Type": request.headers["content-type"] || "image/jpeg"
            },
            body: fileBuffer
          });
          
          if (res.ok) {
            imageUrlResult = `${SUPABASE_URL}/storage/v1/object/public/asset-images/${uniqueFilename}`;
            console.log("Supabase storage upload success:", imageUrlResult);
          } else {
            console.warn("Supabase storage upload failed, status:", res.status, await res.text());
          }
        } catch (err) {
          console.warn("Supabase storage upload error, falling back to local:", err.message);
        }
      }
      
      sendJson(response, 200, { ok: true, url: imageUrlResult });
      return;
    }
    if (pathname === "/api/login-history/clear" && request.method === "POST") {
      sendJson(response, 200, { ok: true, ...(await clearLoginHistoryDatabase()) });
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      sendJson(response, 405, { ok: false, error: "Method not allowed" });
      return;
    }
    await serveStatic(request, response, pathname);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { ok: false, error: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Asset Control server: http://${HOST}:${PORT}/asset-control.html`);
  console.log(`Database source: ${SUPABASE_ENABLED ? `${SUPABASE_URL}/rest/v1` : DB_FILE}`);
});
