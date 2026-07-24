import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire("C:/Users/SuphawadiChampathi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/noop.js");
const { chromium } = require("playwright");

const root = "C:/Users/SuphawadiChampathi/Documents/Codex/2026-06-12/files-mentioned-by-the-user-computerassets-2";
const htmlUrl = pathToFileURL(path.join(root, "outputs", "asset-control.html")).href;
const shots = {
  desktop: path.join(root, "outputs", "asset-control-desktop-dashboard.png"),
  modal: path.join(root, "outputs", "asset-control-computer-modal.png"),
  mobile: path.join(root, "outputs", "asset-control-mobile-menu.png"),
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 820 } });
const page = await context.newPage();
const messages = [];
page.on("console", msg => {
  if (["error", "warning"].includes(msg.type())) messages.push({ type: msg.type(), text: msg.text() });
});
page.on("pageerror", error => messages.push({ type: "pageerror", text: error.message }));

await page.goto(htmlUrl);
const title = await page.title();
await page.getByRole("button", { name: /Login Admin/i }).click();
await page.waitForSelector("text=Dashboard");
await page.screenshot({ path: shots.desktop, fullPage: false });

await page.getByRole("button", { name: /Computer/i }).click();
await page.waitForSelector("text=IT Assets");
await page.locator("[data-view-asset]").first().click();
await page.waitForSelector("text=รายละเอียดทรัพย์สิน IT");
await page.screenshot({ path: shots.modal, fullPage: false });
await page.locator("[data-close-modal]").click();

await page.getByRole("button", { name: /Master Data/i }).click();
await page.waitForSelector("text=ข้อมูลหลักของระบบ");
const adminMasterVisible = await page.getByText("Master Data").first().isVisible();

await page.locator("[data-logout]").click();
await page.getByRole("button", { name: /Login User/i }).click();
await page.waitForSelector("text=Dashboard");
const userMasterCount = await page.getByRole("button", { name: /Master Data/i }).count();

await page.setViewportSize({ width: 390, height: 844 });
await page.locator("[data-open-drawer]").click();
await page.waitForSelector(".sidebar.open");
await page.screenshot({ path: shots.mobile, fullPage: false });

const dashboardText = await page.locator("body").innerText();
await browser.close();

console.log(JSON.stringify({
  url: htmlUrl,
  title,
  notBlank: dashboardText.includes("Dashboard") || dashboardText.includes("Asset Control"),
  adminMasterVisible,
  userMasterHidden: userMasterCount === 0,
  consoleMessages: messages,
  screenshots: shots,
}, null, 2));
