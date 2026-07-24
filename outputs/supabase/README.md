# Asset Control Supabase Database

ใช้ไฟล์ `asset-control-full.sql` ใน Supabase SQL Editor เพื่อสร้างตารางและนำเข้าข้อมูลเริ่มต้นทั้งหมด
จากฐานข้อมูลปัจจุบันของแอป Asset Control

## ไฟล์

- `asset-control-schema.sql` - สร้าง tables, triggers และ RLS policies
- `asset-control-seed.sql` - นำเข้าข้อมูลเริ่มต้น
- `asset-control-full.sql` - รวม schema + seed ในไฟล์เดียว

## วิธีใช้งานใน Supabase

1. เปิด Supabase project
2. ไปที่ SQL Editor
3. เปิดไฟล์ `asset-control-full.sql`
4. คัดลอก SQL ทั้งหมดไปวางแล้วกด Run
5. ตรวจตารางหลัก:
   - `computer_assets` ต้องมี 56 รายการ
   - `other_assets` ต้องมี 51 รายการ
   - `maintenance_history`, `maintenance_requests`, `checkout_records` ต้องเป็น 0 รายการ

## Security

ทุก table เปิด Row Level Security แล้ว และ policy เริ่มต้นอนุญาตเฉพาะ role `authenticated`
อ่าน/เพิ่ม/แก้ไข/ลบข้อมูลได้

ถ้าจะให้หน้าเว็บนี้เชื่อมกับ Supabase โดยตรง ควรใช้ Supabase Auth หรือ Edge Function
แทนการเปิดสิทธิ์ `anon` ให้แก้ไขข้อมูลได้ทั้งหมด
