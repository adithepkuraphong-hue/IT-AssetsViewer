const fs = require('fs');
const path = require('path');

const server = require('../outputs/asset-control-server.cjs');

// Test dataset with audit logs
const sampleInput = {
  computerAssets: [],
  otherAssets: [],
  master: { companies: [], departments: [], locations: [], types: [], typeGroups: [], positions: [] },
  maintenanceHistory: [],
  maintenanceRequests: [],
  checkoutRecords: [],
  notifications: [],
  loginHistory: [],
  auditLogs: [
    {
      username: "admin",
      name: "Admin User",
      action: "เพิ่ม",
      target: "ทรัพย์สินคอมพิวเตอร์",
      desc: "เพิ่มทรัพย์สินใหม่ Code: KOCH-IT-NB-26-006 (Lenovo ThinkPad)",
      time: "2026-07-22 10:00:00"
    },
    {
      username: "admin",
      name: "Admin User",
      action: "แก้ไข",
      target: "ข้อมูลหลัก (positions)",
      desc: "แก้ไขข้อมูลหลัก Code: ACCM (Accounting Manager)",
      time: "2026-07-22 10:05:00"
    },
    {
      username: "admin",
      name: "Admin User",
      action: "ลบ",
      target: "ทรัพย์สินคอมพิวเตอร์",
      desc: "ลบทรัพย์สิน Code: KOCH-IT-NB-26-001 (Dell Latitude)",
      time: "2026-07-22 10:10:00"
    }
  ],
  users: []
};

const normalized = server.normalizeDatabase ? server.normalizeDatabase(sampleInput) : sampleInput;
console.log("Audit Logs Normalized Length:", normalized.auditLogs.length);
console.log("Sample Log Entry:", JSON.stringify(normalized.auditLogs[0], null, 2));
