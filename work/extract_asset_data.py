from __future__ import annotations

import datetime as dt
import json
from pathlib import Path

import openpyxl


ROOT = Path(r"C:\Users\SuphawadiChampathi\Documents\Codex\2026-06-12\files-mentioned-by-the-user-computerassets-2")
SOURCE = Path(r"C:\Users\SuphawadiChampathi\Downloads\Asset Management.xlsx")
OUTPUT = ROOT / "outputs" / "asset-data.js"


def clean(value):
    if value is None:
        return ""
    if isinstance(value, (dt.date, dt.datetime)):
        return value.strftime("%Y-%m-%d")
    if isinstance(value, bool):
        return value
    return str(value).replace("\xa0", " ").strip()


def truthy(value) -> bool:
    if isinstance(value, bool):
        return value
    return clean(value).lower() == "true"


def legacy_asset_code(value: object) -> str:
    """Keep the workbook asset code intact so each row stays uniquely addressable."""
    return clean(value)


def department_from_code(value: object, master: dict) -> str:
    code = clean(value)
    parts = [part for part in code.split("-") if part]
    if len(parts) >= 5:
        dept_code = parts[-4]
        lookup = {row["code"]: row["name"] for row in master.get("departments", [])}
        return lookup.get(dept_code, dept_code)
    return "-"


def sheet_records(workbook, sheet_name: str) -> list[dict]:
    worksheet = workbook[sheet_name]
    rows = list(worksheet.iter_rows(values_only=True))
    header_index = 0
    for index, row in enumerate(rows):
        if any(clean(cell) == "Asset Code" for cell in row):
            header_index = index
            break
    headers = [clean(header) or f"col{index + 1}" for index, header in enumerate(rows[header_index])]
    records = []
    for row in rows[header_index + 1:]:
        record = {
            headers[index]: clean(row[index]) if index < len(row) else ""
            for index in range(len(headers))
        }
        if record.get("Asset Code"):
            records.append(record)
    return records


def master_records(workbook) -> dict:
    worksheet = workbook["Asset Code"]
    companies, types, departments, locations = [], [], [], []
    for row in list(worksheet.iter_rows(values_only=True))[5:]:
        company, company_code = clean(row[0]), clean(row[1])
        asset_type, type_code = clean(row[3]), clean(row[4])
        department, department_code = clean(row[6]), clean(row[7])
        location, location_code = clean(row[9]), clean(row[10])
        if company or company_code:
            companies.append({"name": company, "code": company_code})
        if asset_type or type_code:
            types.append({"name": asset_type, "code": type_code})
        if department or department_code:
            departments.append({"name": department, "code": department_code})
        if location or location_code:
            locations.append({"name": location, "code": location_code})
    return {
        "companies": companies,
        "types": types,
        "departments": departments,
        "locations": locations,
    }


def build_data() -> dict:
    workbook = openpyxl.load_workbook(SOURCE, data_only=True, read_only=True)
    computer_rows = sheet_records(workbook, "Computer")
    other_rows = sheet_records(workbook, "Other")
    master = master_records(workbook)

    computer_assets = []
    for row in computer_rows:
        computer_assets.append(
            {
                "assetCode": legacy_asset_code(row.get("Asset Code")),
                "rustDeskId": clean(row.get("RustDesk ID")) or "-",
                "company": clean(row.get("Company")),
                "type": clean(row.get("Type")),
                "brand": clean(row.get("Brand")),
                "model": clean(row.get("Model")),
                "serial": clean(row.get("Serial")) or clean(row.get("Serial No.")),
                "user": clean(row.get("User")) or "-",
                "department": clean(row.get("Department")) or department_from_code(row.get("Asset Code"), master),
                "location": clean(row.get("Location")) or "-",
                "room": clean(row.get("Room")) or "-",
                "purchaseDate": clean(row.get("Purchase Date")) or "-",
                "status": clean(row.get("Status")) or "ไม่ระบุ",
                "warrantyExpirationDate": clean(row.get("หมดประกัน")) or clean(row.get("Warranty Expiration Date")) or "-",
                "windowsVersion": clean(row.get("OS")) or clean(row.get("Windows Version")) or "-",
                "sentForRepairDate": clean(row.get("วันที่ส่งซ่อม")) or clean(row.get("Sent for Repair Date")) or "-",
                "adapter": truthy(row.get("สายชาร์จ (Adapter)")) or truthy(row.get("Adapter")),
                "mouse": truthy(row.get("Mouse")),
                "laptopBag": truthy(row.get("Laptop Bag")),
                "syncOneDrive": truthy(row.get("เชื่อมต่อ OneDrive")) or truthy(row.get("Sync with OneDrive")),
                "remark": clean(row.get("หมายเหตุ")) or clean(row.get("Remark")),
            }
        )

    other_assets = []
    for row in other_rows:
        location = " ".join(part for part in [clean(row.get("Location")), clean(row.get("col8"))] if part)
        other_assets.append(
            {
                "assetCode": legacy_asset_code(row.get("Asset Code")),
                "company": clean(row.get("Company")),
                "type": clean(row.get("Type")),
                "brand": clean(row.get("Brand")),
                "model": clean(row.get("Model")),
                "serial": clean(row.get("Serial")),
                "location": location or "-",
                "purchaseDate": clean(row.get("Purchase Date")) or "-",
                "status": clean(row.get("Status")) or "ไม่ระบุ",
                "warrantyExpirationDate": clean(row.get("วันหมดประกัน")) or clean(row.get("Warranty Expiration Date")) or "-",
                "remark": clean(row.get("หมายเหตุ")) or clean(row.get("Remark")),
            }
        )

    return {
        "sourceFile": SOURCE.name,
        "sourceId": f"{SOURCE.name}:{int(SOURCE.stat().st_mtime)}:{SOURCE.stat().st_size}",
        "generatedAt": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "computerAssets": computer_assets,
        "otherAssets": other_assets,
        "master": master,
        "maintenanceHistory": [
            {"title": "Emergency Power Supply Fix - NB-001", "asset": "HP Laptop", "type": "ฉุกเฉิน", "date": "2025-05-22", "cost": "฿1,800", "status": "รอดำเนินการ"},
            {"title": "Screen Repair - NB-002", "asset": "Lenovo ThinkPad", "type": "ซ่อมแก้ไข", "date": "2025-05-15", "cost": "฿8,500", "status": "กำลังดำเนินการ"},
            {"title": "Printer Cartridge Replacement - PR-001", "asset": "Canon Printer", "type": "บำรุงรักษาตามรอบ", "date": "2025-04-20", "cost": "฿1,200", "status": "เสร็จสิ้น"},
            {"title": "Hard Drive Upgrade - PC-001", "asset": "Dell Desktop Computer", "type": "ซ่อมแก้ไข", "date": "2025-03-05", "cost": "฿3,500", "status": "เสร็จสิ้น"},
            {"title": "Preventive Maintenance - PC-001", "asset": "Dell Desktop Computer", "type": "บำรุงรักษาตามรอบ", "date": "2025-01-10", "cost": "฿500", "status": "เสร็จสิ้น"},
        ],
        "maintenanceRequests": [
            {"title": "Laptop Keyboard Malfunction", "desc": "Several keys not responding on laptop keyboard", "brand": "HP", "type": "Notebook", "requester": "Anucha Saetang", "date": "2025-05-23", "priority": "สูง", "status": "รออนุมัติ"},
            {"title": "Monitor Color Issue", "desc": "Monitor displays incorrect colors", "brand": "LG", "type": "Monitor", "requester": "Somchai Prasert", "date": "2025-05-22", "priority": "ปานกลาง", "status": "รออนุมัติ"},
            {"title": "Computer Won't Boot", "desc": "Desktop computer won't start after power outage", "brand": "Dell", "type": "Computer", "requester": "Krit Tanawat", "date": "2025-05-20", "priority": "สูง", "status": "อนุมัติแล้ว"},
            {"title": "Printer Paper Jam", "desc": "Printer frequently jams with paper", "brand": "Canon", "type": "Printer", "requester": "Pimchanok Srisai", "date": "2025-05-18", "priority": "ปานกลาง", "status": "เสร็จสิ้น"},
            {"title": "Laptop Screen Cracked", "desc": "Laptop screen has visible crack and flicking", "brand": "Lenovo", "type": "Notebook", "requester": "Nattaya Wongsa", "date": "2025-05-14", "priority": "เร่งด่วน", "status": "กำลังดำเนินการ"},
        ],
        "checkoutRecords": [
            {"asset": "HP Laptop", "sub": "Laptop Checkout - Somchai Prasert", "requester": "Somchai Prasert", "date": "2025-05-22", "purpose": "Business trip to regional office", "status": "กำลังขอใช้งาน"},
            {"asset": "LG Monitor", "sub": "Monitor Checkout - Pimchanok Srisai", "requester": "Pimchanok Srisai", "date": "2025-05-20", "purpose": "For temporary office setup", "status": "กำลังขอใช้งาน"},
            {"asset": "HP Laptop", "sub": "Laptop Checkout - Krit Tanawat", "requester": "Krit Tanawat", "date": "2025-05-15", "purpose": "Returned in good condition", "status": "คืนแล้ว"},
            {"asset": "Lenovo ThinkPad", "sub": "Laptop Checkout - Anucha Saetang", "requester": "Anucha Saetang", "date": "2025-05-10", "purpose": "Overdue - needs follow up", "status": "เกินกำหนด"},
            {"asset": "Canon Printer", "sub": "Printer Checkout - Nattaya Wongsa", "requester": "Nattaya Wongsa", "date": "2025-04-01", "purpose": "Used for event, returned early", "status": "คืนแล้ว"},
        ],
        "notifications": [
            {"title": "Overdue Return Reminder", "body": "Asset NB-002 (Lenovo ThinkPad) is overdue. Expected return: 2025-05-17", "category": "การขอใช้งาน", "date": "23 พฤษภาคม 2568", "read": False, "tone": "orange"},
            {"title": "Warranty Expiring Soon", "body": "Asset PR-001 (Canon Printer) warranty expires in 30 days on 2026-11-10", "category": "ประกัน", "date": "23 พฤษภาคม 2568", "read": False, "tone": "pink"},
            {"title": "Asset Available for Checkout", "body": "Asset NB-001 (HP Laptop) is now available for checkout", "category": "ระบบ", "date": "23 พฤษภาคม 2568", "read": False, "tone": "green"},
            {"title": "Maintenance Request Approved", "body": "Computer Won't Boot request has been approved by IT admin", "category": "ซ่อมบำรุง", "date": "21 พฤษภาคม 2568", "read": True, "tone": "blue"},
            {"title": "New Asset Imported", "body": "Inventory assets were synced from the latest workbook", "category": "ระบบ", "date": "20 พฤษภาคม 2568", "read": True, "tone": "green"},
        ],
        "loginHistory": [
            {"name": "Admin User", "role": "admin", "time": "2026-06-12 09:15", "ip": "192.168.1.21", "status": "สำเร็จ"},
            {"name": "IT User", "role": "user", "time": "2026-06-11 16:42", "ip": "192.168.1.34", "status": "สำเร็จ"},
            {"name": "Admin User", "role": "admin", "time": "2026-06-10 08:05", "ip": "192.168.1.21", "status": "สำเร็จ"},
        ],
    }


def main() -> None:
    data = build_data()
    OUTPUT.write_text(
        "window.ASSET_CONTROL_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(json.dumps({"output": str(OUTPUT), "computer": len(data["computerAssets"]), "other": len(data["otherAssets"])}, ensure_ascii=False))


if __name__ == "__main__":
    main()
