import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = "C:/Users/SuphawadiChampathi/Documents/Codex/2026-06-12/files-mentioned-by-the-user-computerassets-2";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9322;
const htmlUrl = pathToFileURL(path.join(root, "outputs", "asset-control.html")).href;
const profileDir = path.join(root, "work", "chrome-profile");
const shots = {
  desktop: path.join(root, "outputs", "asset-control-desktop-dashboard.png"),
  modal: path.join(root, "outputs", "asset-control-computer-modal.png"),
  mobile: path.join(root, "outputs", "asset-control-mobile-menu.png"),
};

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      let body = "";
      response.on("data", chunk => { body += chunk; });
      response.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function waitFor(fn, timeout = 8000) {
  const start = Date.now();
  let lastError;
  while (Date.now() - start < timeout) {
    try {
      const value = await fn();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw lastError || new Error("Timed out while waiting");
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.ws.addEventListener("message", event => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      } else if (message.method) {
        this.events.push(message);
      }
    });
  }
  async open() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
  }
  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  close() {
    this.ws.close();
  }
}

async function evalValue(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true });
  return result.result.value;
}

async function click(cdp, selector) {
  await cdp.send("Runtime.evaluate", { expression: `document.querySelector(${JSON.stringify(selector)})?.click()` });
}

async function setValue(cdp, selector, value) {
  await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector(${JSON.stringify(selector)}).value = ${JSON.stringify(value)}`,
  });
}

async function waitSelector(cdp, selector) {
  await waitFor(async () => evalValue(cdp, `!!document.querySelector(${JSON.stringify(selector)})`));
}

async function screenshot(cdp, file) {
  const result = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await fs.writeFile(file, Buffer.from(result.data, "base64"));
}

async function main() {
  await fs.rm(profileDir, { recursive: true, force: true });
  await fs.mkdir(profileDir, { recursive: true });
  const browser = spawn(chrome, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--window-size=1512,820",
    "about:blank",
  ], { stdio: "ignore" });

  let cdp;
  try {
    const target = await waitFor(async () => {
      const list = await getJson(`http://127.0.0.1:${port}/json/list`);
      return list.find(item => item.type === "page");
    });
    cdp = new Cdp(target.webSocketDebuggerUrl);
    await cdp.open();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 970, deviceScaleFactor: 1, mobile: false });
    await cdp.send("Page.navigate", { url: htmlUrl });
    await waitFor(async () => evalValue(cdp, "document.readyState === 'complete'"));

    const title = await evalValue(cdp, "document.title");
    await click(cdp, "[data-login='admin']");
    await waitSelector(cdp, ".workspace");

    const dashboardAlertRemoved = await evalValue(cdp, "!document.querySelector('[data-dismiss-alert]') && !document.querySelector('.alert-bar')");
    const dashboardFitsViewport = await evalValue(cdp, "document.documentElement.scrollHeight <= window.innerHeight + 8");
    await click(cdp, "[data-toggle-sidebar]");
    const sidebarCollapsed = await evalValue(cdp, "document.querySelector('.workspace').classList.contains('sidebar-collapsed')");
    await click(cdp, "[data-toggle-sidebar]");
    await screenshot(cdp, shots.desktop);
    const routesToFit = ["dashboard", "computer", "other", "maintenance-detail", "maintenance-request", "checkout", "master", "notifications", "settings"];
    const pageFitResults = {};
    for (const route of routesToFit) {
      await click(cdp, `[data-route='${route}']`);
      pageFitResults[route] = await evalValue(cdp, "(() => { const content = document.querySelector('.content'); return content ? content.scrollHeight <= content.clientHeight + 8 : false; })()");
    }
    const pagesFitViewport = Object.values(pageFitResults).every(Boolean);

    await click(cdp, "[data-route='computer']");
    await waitSelector(cdp, "[data-open-asset='computer']");
    await click(cdp, "[data-open-asset='computer']");
    await waitSelector(cdp, "[data-submit-asset]");
    await setValue(cdp, "[data-asset-field='assetCode']", "NB-QA-001");
    await click(cdp, "[data-submit-asset]");
    await waitFor(async () => evalValue(cdp, "window.ASSET_CONTROL_DATA.computerAssets.some(item => item.assetCode === 'NB-QA-001')"));
    const assetSubmitWorks = await evalValue(cdp, "document.body.innerText.includes('NB-QA-001')");

    await click(cdp, "[data-page-key='computer-assets'][data-page='2']");
    const paginationWorks = await evalValue(cdp, "document.querySelector('.page-btn.active')?.textContent.trim() === '2'");
    await click(cdp, "[data-page-key='computer-assets'][data-page='1']");
    await waitFor(async () => evalValue(cdp, "document.querySelector('.page-btn.active')?.textContent.trim() === '1'"));
    await click(cdp, "[data-action-menu^='asset-computer-']");
    await waitSelector(cdp, ".action-menu");
    const assetActionMenuWorks = await evalValue(cdp, "!!document.querySelector('[data-action=\"edit\"][data-entity=\"asset\"]') && !document.querySelector('[data-action=\"qr\"][data-entity=\"asset\"]')");
    await click(cdp, "[data-action='detail'][data-entity='asset']");
    await waitSelector(cdp, ".modal");
    const assetModalWorks = await evalValue(cdp, "!!document.querySelector('.asset-hero')");
    await screenshot(cdp, shots.modal);
    await click(cdp, "[data-close-modal]");
    await click(cdp, "[data-action-menu^='asset-computer-']");
    await waitSelector(cdp, ".action-menu");
    await click(cdp, "[data-action-menu^='asset-computer-']");
    await waitSelector(cdp, ".action-menu");
    await click(cdp, "[data-action='edit'][data-entity='asset']");
    await waitSelector(cdp, "[data-submit-asset]");
    await setValue(cdp, "[data-asset-field='brand']", "QA Brand Edited");
    await click(cdp, "[data-submit-asset]");
    const assetEditWorks = await evalValue(cdp, "window.ASSET_CONTROL_DATA.computerAssets.some(item => item.assetCode === 'NB-QA-001' && item.brand === 'QA Brand Edited')");
    await click(cdp, "[data-action-menu^='asset-computer-']");
    await waitSelector(cdp, ".action-menu");
    await click(cdp, "[data-action='delete'][data-entity='asset']");
    const assetDeleteWorks = await evalValue(cdp, "!window.ASSET_CONTROL_DATA.computerAssets.some(item => item.assetCode === 'NB-QA-001')");

    await click(cdp, "[data-route='maintenance-request']");
    await click(cdp, "[data-open-request]");
    await waitSelector(cdp, "[data-submit-request]");
    await setValue(cdp, "[data-request-field='title']", "QA Maintenance Request");
    await click(cdp, "[data-submit-request]");
    await waitFor(async () => evalValue(cdp, "window.ASSET_CONTROL_DATA.maintenanceRequests.some(item => item.title === 'QA Maintenance Request')"));
    const requestSubmitWorks = await evalValue(cdp, "document.body.innerText.includes('QA Maintenance Request')");
    await click(cdp, "[data-action-menu^='record-maintenanceRequests-']");
    await waitSelector(cdp, ".action-menu");
    await click(cdp, "[data-action='edit'][data-entity='record']");
    await waitSelector(cdp, "[data-submit-record]");
    await setValue(cdp, "[data-record-field='title']", "QA Maintenance Request Edited");
    await click(cdp, "[data-submit-record]");
    const requestEditWorks = await evalValue(cdp, "window.ASSET_CONTROL_DATA.maintenanceRequests.some(item => item.title === 'QA Maintenance Request Edited')");

    await click(cdp, "[data-route='checkout']");
    await click(cdp, "[data-open-checkout]");
    await waitSelector(cdp, "[data-submit-checkout]");
    await setValue(cdp, "[data-checkout-field='purpose']", "QA checkout flow");
    await click(cdp, "[data-submit-checkout]");
    await waitFor(async () => evalValue(cdp, "window.ASSET_CONTROL_DATA.checkoutRecords.some(item => item.purpose === 'QA checkout flow')"));
    const checkoutSubmitWorks = await evalValue(cdp, "document.body.innerText.includes('QA checkout flow')");
    await click(cdp, "[data-action-menu^='record-checkoutRecords-']");
    await waitSelector(cdp, ".action-menu");
    await click(cdp, "[data-action='edit'][data-entity='record']");
    await waitSelector(cdp, "[data-submit-record]");
    await setValue(cdp, "[data-record-field='purpose']", "QA checkout flow edited");
    await click(cdp, "[data-submit-record]");
    const checkoutEditWorks = await evalValue(cdp, "window.ASSET_CONTROL_DATA.checkoutRecords.some(item => item.purpose === 'QA checkout flow edited')");

    await click(cdp, "[data-route='master']");
    await waitSelector(cdp, "[data-master-add]");
    const adminMasterVisible = await evalValue(cdp, "!!document.querySelector('[data-master-add]')");
    await click(cdp, "[data-master-add]");
    await waitSelector(cdp, "[data-submit-master]");
    await setValue(cdp, "[data-master-field='code']", "QA");
    await setValue(cdp, "[data-master-field='name']", "QA Company");
    await click(cdp, "[data-submit-master]");
    await waitFor(async () => evalValue(cdp, "window.ASSET_CONTROL_DATA.master.companies.some(item => item.code === 'QA')"));
    const masterAddWorks = await evalValue(cdp, "document.body.innerText.includes('QA Company')");
    await click(cdp, "[data-master-edit='0']");
    await waitSelector(cdp, "[data-submit-master]");
    await setValue(cdp, "[data-master-field='name']", "QA Company Edited");
    await click(cdp, "[data-submit-master]");
    const masterEditWorks = await evalValue(cdp, "window.ASSET_CONTROL_DATA.master.companies[0].name === 'QA Company Edited'");
    await click(cdp, "[data-master-delete='0']");
    const masterDeleteWorks = await evalValue(cdp, "!window.ASSET_CONTROL_DATA.master.companies.some(item => item.code === 'QA')");

    await click(cdp, "[data-route='settings']");
    await waitSelector(cdp, "[data-save-settings]");
    await setValue(cdp, "[data-setting='orgName']", "QA Org");
    await click(cdp, "[data-save-settings]");
    const settingsSaveWorks = await evalValue(cdp, "state.settings.orgName === 'QA Org'");

    await click(cdp, "[data-route='notifications']");
    await waitSelector(cdp, "[data-read-notification]");
    await click(cdp, "[data-read-notification]");
    const notificationReadWorks = await evalValue(cdp, "window.ASSET_CONTROL_DATA.notifications.some(item => item.read)");

    await click(cdp, "[data-route='maintenance-detail']");
    await waitSelector(cdp, "[data-action-menu^='record-maintenanceHistory-']");
    await click(cdp, "[data-action-menu^='record-maintenanceHistory-']");
    await waitSelector(cdp, ".action-menu");
    await click(cdp, "[data-action='detail'][data-entity='record']");
    await waitSelector(cdp, ".modal");
    const recordModalWorks = await evalValue(cdp, "!!document.querySelector('.info-card')");
    await click(cdp, "[data-close-modal]");
    await click(cdp, "[data-action-menu^='record-maintenanceHistory-']");
    await waitSelector(cdp, ".action-menu");
    await click(cdp, "[data-action='edit'][data-entity='record']");
    await waitSelector(cdp, "[data-submit-record]");
    await setValue(cdp, "[data-record-field='title']", "QA Maintenance History Edited");
    await click(cdp, "[data-submit-record]");
    const maintenanceEditWorks = await evalValue(cdp, "window.ASSET_CONTROL_DATA.maintenanceHistory.some(item => item.title === 'QA Maintenance History Edited')");

    await click(cdp, "[data-logout]");
    await click(cdp, "[data-login='user']");
    await waitSelector(cdp, ".workspace");
    const userMasterHidden = await evalValue(cdp, "[...document.querySelectorAll('button')].every(button => !button.textContent.includes('Master Data'))");

    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await click(cdp, "[data-open-drawer]");
    await waitSelector(cdp, ".sidebar.open");
    const mobileDrawerWorks = await evalValue(cdp, "!!document.querySelector('.sidebar.open')");
    await screenshot(cdp, shots.mobile);

    const consoleMessages = cdp.events
      .filter(event => ["Runtime.exceptionThrown", "Log.entryAdded"].includes(event.method))
      .map(event => event.params);

    console.log(JSON.stringify({
      url: htmlUrl,
      title,
      notBlank: await evalValue(cdp, "document.body.innerText.length > 100"),
      dashboardAlertRemoved,
      dashboardFitsViewport,
      pagesFitViewport,
      pageFitResults,
      sidebarCollapsed,
      assetSubmitWorks,
      assetActionMenuWorks,
      paginationWorks,
      assetModalWorks,
      assetEditWorks,
      assetDeleteWorks,
      requestSubmitWorks,
      requestEditWorks,
      checkoutSubmitWorks,
      checkoutEditWorks,
      adminMasterVisible,
      masterAddWorks,
      masterEditWorks,
      masterDeleteWorks,
      settingsSaveWorks,
      notificationReadWorks,
      recordModalWorks,
      maintenanceEditWorks,
      userMasterHidden,
      mobileDrawerWorks,
      consoleMessages,
      screenshots: shots,
    }, null, 2));
  } finally {
    if (cdp) cdp.close();
    browser.kill();
  }
}

await main();
