import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = path.resolve(".");
const outputDir = path.join(root, "outputs");
const databaseDir = path.join(outputDir, "database");
const dataPath = path.join(outputDir, "asset-data.js");

const source = await fs.readFile(dataPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: dataPath });
const DATA = sandbox.window.ASSET_CONTROL_DATA;

const tables = {
  metadata: [
    { key: "sourceFile", value: DATA.sourceFile || "" },
    { key: "sourceId", value: DATA.sourceId || "" },
    { key: "generatedAt", value: DATA.generatedAt || "" },
  ],
  computerAssets: DATA.computerAssets || [],
  otherAssets: DATA.otherAssets || [],
  maintenanceHistory: DATA.maintenanceHistory || [],
  maintenanceRequests: DATA.maintenanceRequests || [],
  checkoutRecords: DATA.checkoutRecords || [],
  notifications: DATA.notifications || [],
  loginHistory: DATA.loginHistory || [],
  users: DATA.users || [],
  masterCompanies: DATA.master?.companies || [],
  masterDepartments: DATA.master?.departments || [],
  masterLocations: DATA.master?.locations || [],
  masterTypes: DATA.master?.types || [],
};

const sheetNames = {
  metadata: "Metadata",
  computerAssets: "Computer Assets",
  otherAssets: "Other Assets",
  maintenanceHistory: "Maintenance History",
  maintenanceRequests: "Maintenance Requests",
  checkoutRecords: "Checkout Records",
  notifications: "Notifications",
  loginHistory: "Login History",
  users: "Users",
  masterCompanies: "Master Companies",
  masterDepartments: "Master Departments",
  masterLocations: "Master Locations",
  masterTypes: "Master Types",
};

function cellValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function headersFor(rows) {
  const keys = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!keys.includes(key)) keys.push(key);
    }
  }
  return keys.length ? keys : ["value"];
}

function rowsToMatrix(rows) {
  const headers = headersFor(rows);
  return [headers, ...rows.map(row => headers.map(header => cellValue(row[header])))];
}

function csvEscape(value) {
  const text = String(cellValue(value));
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowsToCsv(rows) {
  const matrix = rowsToMatrix(rows);
  return "\uFEFF" + matrix.map(row => row.map(csvEscape).join(",")).join("\r\n");
}

function columnLetter(columnNumber) {
  let value = columnNumber;
  let letters = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    value = Math.floor((value - 1) / 26);
  }
  return letters;
}

function estimatedWidth(header, values) {
  const maxText = Math.max(
    String(header).length,
    ...values.slice(0, 80).map(value => String(cellValue(value)).length)
  );
  return Math.max(12, Math.min(42, Math.ceil(maxText * 1.15)));
}

await fs.mkdir(databaseDir, { recursive: true });

await fs.writeFile(
  path.join(databaseDir, "asset-control-database.json"),
  JSON.stringify(DATA, null, 2),
  "utf8"
);

for (const [name, rows] of Object.entries(tables)) {
  await fs.writeFile(path.join(databaseDir, `${name}.csv`), rowsToCsv(rows), "utf8");
}

const workbook = Workbook.create();
for (const [name, rows] of Object.entries(tables)) {
  const sheet = workbook.worksheets.add(sheetNames[name] || name);
  sheet.showGridLines = false;
  const matrix = rowsToMatrix(rows);
  const rowCount = matrix.length;
  const colCount = matrix[0].length;
  const endColumn = columnLetter(colCount);
  const range = sheet.getRange(`A1:${endColumn}${rowCount}`);
  range.values = matrix;
  range.format = {
    font: { color: "#111827" },
    borders: { preset: "all", style: "thin", color: "#E5D1D6" },
    wrapText: false,
  };
  const header = sheet.getRange(`A1:${endColumn}1`);
  header.format = {
    fill: "#A3072A",
    font: { bold: true, color: "#FFFFFF" },
    borders: { preset: "all", style: "thin", color: "#A3072A" },
  };
  sheet.freezePanes.freezeRows(1);
  if (rowCount > 1 && colCount > 0) {
    sheet.tables.add(`A1:${endColumn}${rowCount}`, true, `${name}Table`);
  }
  matrix[0].forEach((headerName, index) => {
    const values = rows.map(row => row[headerName]);
    sheet.getRange(`${columnLetter(index + 1)}:${columnLetter(index + 1)}`).format.columnWidth = estimatedWidth(headerName, values);
  });
}

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(path.join(outputDir, "asset-control-database.xlsx"));

console.log(JSON.stringify({
  workbook: path.join(outputDir, "asset-control-database.xlsx"),
  json: path.join(databaseDir, "asset-control-database.json"),
  csvDir: databaseDir,
  tables: Object.fromEntries(Object.entries(tables).map(([key, rows]) => [key, rows.length])),
}, null, 2));
