-- Asset Control seed data generated from current app database

begin;

truncate table public.login_history, public.notifications, public.checkout_records, public.maintenance_requests, public.maintenance_history, public.other_assets, public.computer_assets, public.master_types, public.master_locations, public.master_departments, public.master_companies, public.asset_control_metadata, public.app_users restart identity cascade;

insert into public.asset_control_metadata (key, value) values
('sourceFile', 'Asset Management (2).xlsx'),
('sourceId', 'Asset Management (2).xlsx:1781925095:40982'),
('generatedAt', '2026-06-20T03:19:44.429Z');

insert into public.master_companies (code, name) values
('TNB', 'TNB LOGISTICS CO., LTD.'),
('KOCH', 'KOCH PACKAGING AND PACKING SERVICES CO., LTD.'),
('SPD', 'SIAM PACKAGING AND DEVELOPMENT CO., LTD.');

insert into public.master_departments (code, name) values
('IT', 'IT'),
('ACC', 'Accounting'),
('HR', 'HR'),
('WH', 'Warehouse'),
('OPS', 'Operation'),
('ENG', 'Engineering'),
('SAF', 'Safety');

insert into public.master_locations (code, name) values
('BB', 'Ban Bueng (บ้านบึง)'),
('BS', 'Bang Saen (บางแสน)'),
('BW', 'Bo Win (บ่อวิน)'),
('SRC', 'Siracha (ศรีราชา)'),
('LKB', 'Ladkrabang (ลาดกระบัง)');

insert into public.master_types (code, name) values
('NB', 'Notebook'),
('PC', 'Desktop PC'),
('SRV', 'Server'),
('PRT', 'Printer'),
('NET', 'Network Device'),
('MON', 'Monitor'),
('SW', 'Software License'),
('CCTV', 'CCTV'),
('TAB', 'Tablet'),
('FW', 'Firewall'),
('SL', 'Switch'),
('IP', 'IPAD'),
('TV', 'TV'),
('RT', 'Router'),
('AP', 'Access Point'),
('SR', 'Server Rack'),
('SWT', 'Switch'),
('LB', 'Load Balance'),
('MB', 'MacBook'),
('CAB', 'Cable'),
('AD', 'Adapter'),
('KB', 'Keyboard');

insert into public.computer_assets (asset_code, rust_desk_id, company, type, brand, model, serial, assigned_user, department, location, room, purchase_date, status, warranty_expiration_date, windows_version, sent_for_repair_date, adapter, mouse, laptop_bag, sync_one_drive, remark, source_sheet, source_row) values
('KOCH-IT-MON-26-001', '-', 'KOCH', 'Monitor', 'AOC', '22B30HM2', '230RAHA002519', '-', '-', 'Bang Saen (บางแสน)', '-', '-', 'ไม่ได้ใช้งาน', '-', '-', '-', true, false, false, false, 'มีสาย adapter', 'Computer', 4),
('KOCH-IT-MON-26-002', '-', 'KOCH', 'Monitor', 'AOC', '22B30HM2', '230RAHA002558', 'Siwapat Kaewmanorom', 'IT', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', '-', '-', true, false, false, false, '', 'Computer', 5),
('KOCH-IT-NB-26-001', '188592957', 'KOCH', 'Notebook', 'HP', 'ZBOOK', '5CG2031G1N', 'Chananchida Jueama', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, true, false, true, '', 'Computer', 6),
('KOCH-IT-NB-26-002', '1992994605', 'KOCH', 'Notebook', 'HP', 'ZBOOK', '351602800227306', 'Sawitree Pavaree', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', '-', '-', true, false, false, true, '', 'Computer', 7),
('KOCH-IT-NB-26-003', '9487041', 'KOCH', 'Notebook', 'DELL', 'Latitude 7320', '5VHWYD3', 'Sittisak', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'windows 11 Pro', '-', true, false, false, true, 'มีสายชาร์จ', 'Computer', 8),
('KOCH-IT-NB-26-004', '112852387', 'KOCH', 'Notebook', 'HP', 'ZBOOK', '5CG2070VMM', 'Nutthawat Promin', 'HR', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, false, false, true, 'มีสายชาร์จ', 'Computer', 9),
('KOCH-IT-NB-26-005', '-', 'KOCH', 'MacBook', 'Apple', 'Pro 16-inch', 'C02ZRP90MD6M', 'Narinpron Nuanmanee', 'IT', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'MAC OS', '-', true, false, false, false, '', 'Computer', 10),
('KOCH-IT-NB-26-006', '-', 'KOCH', 'Notebook', 'DELL', '-', '-', 'wiphaporn', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', '-', '-', false, false, false, false, '', 'Computer', 11),
('KOCH-IT-NB-26-007', '1269242398', 'KOCH', 'MacBook', 'Apple', 'Air M.2', 'J7793CY9P4', 'Monton Raliew', 'IT', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'MAC OS', '-', true, true, true, true, '', 'Computer', 12),
('KOCH-IT-NB-26-008', '510 538 106', 'KOCH', 'Notebook', 'ASUS', 'Vivobook', '-', 'Phatarapong Klayjinda', 'IT', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', '-', '-', false, false, false, false, '', 'Computer', 13),
('KOCH-IT-NB-26-009', '92283841', 'KOCH', 'Notebook', 'DELL', 'Pro 14', 'GDRXBH4', 'Chinanan', 'Sale', 'Bang Saen (บางแสน)', '-', '2026-04-17', 'ใช้งาน', '2029-04-17', '-', '-', true, true, true, true, '', 'Computer', 14),
('KOCH-IT-NB-26-010', '92347581', 'KOCH', 'Notebook', 'DELL', 'Pro 14', '7FRXBH4', 'Suphawadi Champathi', 'IT', 'Bang Saen (บางแสน)', '-', '2026-04-17', 'ใช้งาน', '2029-04-17', 'Windows 11 Pro', '-', true, true, true, true, '', 'Computer', 15),
('KOCH-IT-NB-26-011', '324809450', 'KOCH', 'Notebook', 'HP', 'EliteBook 840', '5CG2151KNY', 'Pornlaphat Kongsri', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', false, false, false, false, '', 'Computer', 16),
('KOCH-IT-NB-26-012', '58532682', 'KOCH', 'Notebook', 'acer', 'Aspire A515-47', 'NXK86ST00924203E9C3400', 'Thanatorn Saikaew', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', '-', '-', false, false, false, false, '', 'Computer', 17),
('KOCH-IT-NB-26-013', '221292934', 'KOCH', 'Notebook', 'HP', 'ProBOOK', '5CD151JD99', 'Thanakorn', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', '-', '-', false, false, false, false, '', 'Computer', 18),
('KOCH-IT-NB-26-014', '265960946', 'KOCH', 'Notebook', 'acer', 'Aspire A515-47', 'NXKHGST004327024E93400', 'Settawoot', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', '-', '-', false, false, false, false, '', 'Computer', 19),
('KOCH-IT-NB-26-015', '300117128', 'KOCH', 'Notebook', 'acer', 'Aspire A315-24P', 'NXKDEST0144150745D3400', 'Anantaya T.', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', false, false, false, false, '', 'Computer', 20),
('KOCH-IT-NB-26-016', '488845147', 'KOCH', 'Notebook', 'acer', 'Aspire 7', 'NHQMYST00233606EF67600', 'Suriyan', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', '-', '-', false, false, false, false, '', 'Computer', 21),
('KOCH-IT-NB-26-017', '59319841', 'KOCH', 'Notebook', 'ASUS', 'Vivobook', 'S8N0CV14H10734C', 'Thanayoot.d', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', false, false, false, false, '', 'Computer', 22),
('KOCH-IT-NB-26-018', '295732022', 'KOCH', 'Notebook', 'Acer', 'Aspire A315-24P', 'NXKDEST0144130988E3400', 'Wichayapong', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', false, false, false, false, '', 'Computer', 23),
('KOCH-IT-NB-26-019', '347090707', 'KOCH', 'Notebook', 'Lenovo', 'ThinkBook 21AS', 'PW06QSXL', 'Nattapong Jankin', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', false, false, false, false, '', 'Computer', 24),
('KOCH-IT-NB-26-020', '122900793', 'KOCH', 'Notebook', 'HP', 'EliteBook 830', '5CG1201T3Z', 'issaret.p', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', false, false, false, false, '', 'Computer', 25),
('KOCH-IT-NB-26-021', '58669809', 'KOCH', 'Notebook', 'acer', 'Aspire A515-47', 'NXK86ST00924501BA63400', 'Thanakorn.P', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', false, false, false, false, '', 'Computer', 26),
('KOCH-IT-NB-26-022', '1971991849', 'KOCH', 'Notebook', 'DELL', 'Vostro 14 3430', 'G19F1Z3', 'Chitranut Thongdee', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', true, false, false, false, 'มีสายชาร์จ', 'Computer', 27),
('KOCH-IT-NB-26-023', '1072825654', 'KOCH', 'Notebook', 'DELL', 'Pro 14', '1L8MSF4', 'Pitcha Jantarasut', 'HR', 'Bang Saen (บางแสน)', '-', '2026-04-17', 'ใช้งาน', '2029-04-17', 'Windows 11 Pro', '-', true, true, true, true, '', 'Computer', 28),
('KOCH-IT-NB-26-024', '1775293106', 'KOCH', 'Notebook', 'acer', 'aspire 3 15', 'NXKDEST014415077053400', '-', '-', 'Siracha (ศรีราชา)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', true, false, true, false, 'มีสายชาร์จ', 'Computer', 29),
('KOCH-IT-NB-26-025', '10032526', 'KOCH', 'Notebook', 'HP', 'ZBOOK', '5CG131C2FD', 'Chayawat Sosiriruang', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, false, false, true, '', 'Computer', 30),
('KOCH-IT-NB-26-026', '-', 'KOCH', 'Notebook', 'acer', 'Aspire 3', 'NXKDEST00P30205A283400', '-', '-', 'Bang Saen (บางแสน)', '-', '-', 'เสีย', '-', '-', '-', false, false, false, false, 'แป้นพิมพ์เสีย แป้นพิมพ์ส่วนใหญ่พิมพ์ไม่ได้', 'Computer', 31),
('KOCH-IT-NB-26-027', '-', 'KOCH', 'Notebook', 'Acer', 'Aspire AL14-51M', 'NXKTXST00242202BE34500', '-', '-', 'Bang Saen (บางแสน)', '-', '-', 'เสีย', '-', 'Windows 11 Home', '-', false, false, false, false, 'Windows มีปัญหา Boot ไม่ได้', 'Computer', 32),
('KOCH-IT-NB-26-028', '472500824', 'KOCH', 'Notebook', 'HP', 'ZBOOK', '5CG2271LZN', 'Thanaphat Sarthephan', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, true, true, true, 'มีสายชาร์จ , กระเป๋า, เมาส์', 'Computer', 33),
('KOCH-IT-NB-26-029', '1620233711', 'KOCH', 'Notebook', 'HP', 'ZBOOK', '5CG2523KWW', '-', '-', 'Bang Saen (บางแสน)', '-', '-', 'ไม่ได้ใช้งาน', '-', '-', '-', true, false, false, false, '', 'Computer', 34),
('KOCH-IT-NB-26-030', '391458622', 'KOCH', 'MacBook', 'Apple', 'Air M.2', '-', 'Siwapat Kaewmanorom', 'IT', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'MAC OS', '-', true, false, false, false, '', 'Computer', 35),
('KOCH-IT-NB-26-031', '519919861', 'KOCH', 'Notebook', 'HP', 'ZBOOK', '5CG2523HCR', 'ittiphol.s', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', false, false, false, false, '', 'Computer', 36),
('KOCH-IT-PC-26-001', '1095010039', 'KOCH', 'Desktop PC', 'Lenovo', 'ThinkCentre', 'GM0THBH2', '-', '-', 'Bang Saen (บางแสน)', '-', '-', 'ไม่ได้ใช้งาน', '-', 'Windows 11 Home', '-', true, true, false, false, 'มีสาย Power, เมาส์, คีย์บอร์ด', 'Computer', 37),
('KOCH-IT-PC-26-002', '4664979', 'KOCH', 'Desktop PC', 'HP', 'ProOne 400', '8CN13009D1', 'Chitranut T.', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, false, false, false, '', 'Computer', 38),
('KOCH-IT-PC-26-003', '139431', 'KOCH', 'Desktop PC', 'HP', 'ProOne 600', '8CN049005M', 'Pronchita', '-', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, false, false, false, '', 'Computer', 39),
('KOCH-IT-PC-26-004', '11305487', 'KOCH', 'Desktop PC', 'HP', 'ProOne 600', '8CN13008QQ', 'Wararuk.p', '-', 'Bo Win (บ่อวิน)', '-', '-', 'ใช้งาน', '-', 'windows 11 Pro', '-', true, true, false, false, 'มีสาย Power, เมาส์, คีย์บอร์ด', 'Computer', 40),
('KOCH-IT-PC-26-005', '1564115464', 'KOCH', 'Desktop PC', 'Acer', 'Aspire c24-1300', 'DQBKSST0014490065F6B01', 'Thida Dithamma', 'HR', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', true, true, false, true, '', 'Computer', 41),
('KOCH-IT-TAB-26-001', '1685652780', 'KOCH', 'Tablet', 'Samsung', 'Galaxy Tab S10 Lite 5G', 'R5GL41GMFXE', 'Mongkol Raliew', 'MD', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Android 16', '-', true, false, false, true, 'มีปากกา คีบอร์ด KOCH-IT-KB-26-001', 'Computer', 42),
('KOCH-IT-TAB-26-002', '1364879927', 'KOCH', 'Tablet', 'Samsung', 'Galaxy Tab S10 Lite 5G', 'R5GL41GMBMP', 'Wiphaporn S', 'Accounting  Director', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Android 16', '-', true, false, false, true, 'มีปากกา คีบอร์ด KOCH-IT-KB-26-002', 'Computer', 43),
('KOCH-IT-TAB-26-003', '1330534183', 'KOCH', 'Tablet', 'Huawei', 'Huawei MatePad 11.5S 2026', '6RGUN26119G04567', '-', '-', 'Bang Saen (บางแสน)', '-', '2026-06-16', 'ไม่ได้ใช้งาน', '2027-06-11', 'HarmonyOS V.4.3.0', '-', true, false, false, false, 'คีย์บอร์ด KOCH-IT-KB-26-003, ผ้าเช็ดทำความสะอาด, หัวชาร์จ, สายชาร์จ USB Type-C /SECURECODE : ZDEJSIQ9', 'Computer', 44),
('KOCH-IT-TAB-26-004', '1700882447', 'KOCH', 'Tablet', 'Huawei', 'Huawei MatePad 11.5S 2026', '6RGUN26119G05075', '-', '-', 'Bang Saen (บางแสน)', '-', '2026-06-16', 'ไม่ได้ใช้งาน', '2027-06-11', 'HarmonyOS V.4.3.0', '-', true, false, false, false, 'คีย์บอร์ด KOCH-IT-KB-26-004, ผ้าเช็ดทำความสะอาด, หัวชาร์จ, สายชาร์จ USB Type-C /SECURECODE : LOW2FMV3', 'Computer', 45),
('TNB-IT-NB-26-001', '279146737', 'TNB', 'Notebook', 'HP', 'ZBOOK', '355444402026919', '-', '-', '-', '-', '-', 'ใช้งาน', '-', '-', '-', false, false, false, false, '', 'Computer', 46),
('TNB-IT-NB-26-002', '263910557', 'TNB', 'Notebook', 'HP', 'ZBOOK', '5CD151JDCV', '-', '-', '-', '-', '-', 'ส่งซ่อม', '-', '-', '2026-04-21', true, false, true, false, 'alisa.j เปลี่ยนไปใช้เครื่อง TNB-IT-NB-26-005', 'Computer', 47),
('TNB-IT-NB-26-003', '1501240046', 'TNB', 'Notebook', 'Lenovo', 'ThinkPad 20 SDS1BV00 X390', 'PC-1KVYZV', 'Adithep', 'IT', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, true, true, true, 'มีสายชาร์จ', 'Computer', 48),
('TNB-IT-NB-26-004', '509122887', 'TNB', 'Notebook', 'DELL', 'Pro 14', '8K8MSF4', 'alisa.j', '-', 'Bang Saen (บางแสน)', '-', '2026-04-17', 'ใช้งาน', '2029-04-17', 'Windows 11 Pro', '-', true, true, true, true, '', 'Computer', 49),
('TNB-IT-NB-26-005', '263907824', 'TNB', 'Notebook', 'HP', 'ProBOOK 450 G8', '5CD151JD92', 'Pattaneeya K', 'Transpot', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, false, false, true, 'มีสายชาร์จ', 'Computer', 50),
('TNB-IT-NB-26-006', '13825333', 'TNB', 'Notebook', 'acer', 'Swift SFG14-41', 'NXKG3ST002304016F72N00', 'Techapon.c', '-', 'Siracha (ศรีราชา)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', true, false, true, true, 'มีสายชาร์จ ใช้ของ KOCH-IT-AD-26-002', 'Computer', 51),
('TNB-IT-NB-26-007', '347090777', 'TNB', 'Notebook', 'Lenovo', 'ThinkBook 13s G4 ARB', 'PW06QSX3', 'Orachun Konamsai', 'HR', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, true, true, false, 'ภาษาของระบบเป็นภาษาไทย เชื่อม onedrive ไม่ได้ ใช้สายชาร์จของ KOCH-IT-AD-26-004', 'Computer', 52),
('TNB-IT-NB-26-008', '58747427', 'TNB', 'Notebook', 'acer', 'Nitro AN515-58', 'NHQFHST005245001403400', 'Chanonthananan', 'IT', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', true, true, true, true, 'มีสายชาร์จ ใช้สายชาร์จของ KOCH-IT-AD-26-005', 'Computer', 53),
('TNB-IT-NB-26-009', '1072435919', 'TNB', 'Notebook', 'acer', 'Aspire A515-47', 'NXK86ST00924203E7A3400', 'Pakjira Muenthaisong', 'Transpot', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', true, false, true, true, 'มีสายชาร์จ  กระเป๋า', 'Computer', 54),
('TNB-IT-NB-26-010', '413987619', 'TNB', 'Notebook', 'ASUS', 'Vivobook', 'T5N0CX01W72819A', 'Chonthicha.s', 'Transpot', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', true, true, true, true, 'มีสายชาร์ต เมาส์ กระเป๋า', 'Computer', 55),
('TNB-IT-NB-26-011', '413991707', 'TNB', 'Notebook', 'ASUS', 'Vivobook', 'T5N0CX01W775198', 'Krittiphum', 'Transpot', 'Bang Saen (บางแสน)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Home', '-', true, false, true, true, 'มีสายชาร์ต กระเป๋า', 'Computer', 56),
('TNB-IT-NB-26-012', '188138302', 'TNB', 'Notebook', 'HP', 'ZBOOK', '5CG2031D7F', 'Likhit Praditwong', '-', 'Siracha (ศรีราชา)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, false, false, true, '', 'Computer', 57),
('TNB-IT-NB-26-013', '1384596593', 'TNB', 'Notebook', 'DELL', 'Pro 14', 'FBRXBH4', 'Poonna Tangtuanjai', '-', 'Bang Saen (บางแสน)', '-', '2026-04-17', 'ใช้งาน', '2029-04-17', 'Windows 11 Pro', '-', true, true, true, true, '', 'Computer', 58),
('TNB-IT-NB-26-014', '221153064', 'TNB', 'Notebook', 'HP', 'ProBOOK 450 G8', '5CD151JDCV', 'Alongkon Srinon', '-', 'Siracha (ศรีราชา)', '-', '-', 'ใช้งาน', '-', 'Windows 11 Pro', '-', true, true, false, true, 'มีสายชาร์จ เมาส์ แผ่นรองเมาส์', 'Computer', 59);

insert into public.other_assets (asset_code, company, type, brand, model, serial, location, room, purchase_date, status, warranty_expiration_date, remark, source_sheet, source_row) values
('KOCH-IT-RT-26-001', 'KOCH', 'router', 'ZTE', 'ZTE F6201B', 'D-SN:ZTEEQNMR9B02385', 'บางแสน ห้อง Costing', 'ห้อง Costing', '-', 'ใช้งาน', '-', '', 'Other', 2),
('KOCH-IT-SWT-26-001', 'KOCH', 'switch', 'TP-link', 'SG2210MP 10-Port', 'S/N:2257906000672', 'บางแสน ห้อง Costing', 'ห้อง Costing', '-', 'ใช้งาน', '-', '', 'Other', 3),
('KOCH-IT-AP-26-001', 'KOCH', 'Access Point', 'TP-link', 'AC1350 Wireless Dual Band EAP225', 'S/N:22580RB001935', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ไม่ได้ใช้งาน', '-', '', 'Other', 4),
('KOCH-IT-SR-26-001', 'KOCH', 'Server Rack', '19"GERMANY Export Rack', '-', '-', 'บางแสน ห้อง Costing', 'ห้อง Costing', '-', 'ไม่ได้ใช้งาน', '-', '', 'Other', 5),
('KOCH-IT-AP-26-002', 'KOCH', 'Access Point', 'TP-link', 'Access Point Outdoor TP-LINK (EAP225-Outdoor) Wireless AC1200 Gigabit', '-', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'รอย้าย', '-', '', 'Other', 6),
('KOCH-IT-SR-26-002', 'KOCH', 'Server Rack', 'MAP', '-', '-', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'รอย้าย', '-', '', 'Other', 7),
('KOCH-IT-SWT-26-002', 'KOCH', 'switch', 'TP-link', 'SG2210MP 10-Port', 'S/N:2249782002830', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'รอย้าย', '-', '', 'Other', 8),
('KOCH-IT-AP-26-003', 'KOCH', 'Access Point', 'TP-link', '-', '-', 'บางแสน SPD ห้องใหญ่', 'SPD ห้องใหญ่', '-', 'ใช้งาน', '-', '', 'Other', 9),
('KOCH-IT-AP-26-004', 'KOCH', 'Access Point', 'TP-link', '-', '-', 'บางแสน SPD ห้อง Engineer', 'SPD ห้อง Engineer', '-', 'ใช้งาน', '-', '', 'Other', 10),
('KOCH-IT-AP-26-005', 'KOCH', 'Access Point', 'TP-link', 'Access Point TP-LINK (EAP653) Wireless AX3000 Dual Band Gigabit WiFi 6', '-', 'บางแสน SPD ห้องใหญ่', 'SPD ห้องใหญ่', '-', 'ระหว่างสั่งซื้อ', '-', '', 'Other', 11),
('KOCH-IT-AP-26-006', 'KOCH', 'Access Point', 'TP-link', 'Access Point TP-LINK (EAP653) Wireless AX3000 Dual Band Gigabit WiFi 6', '-', 'บางแสน ห้องประชุม', 'ห้องประชุม', '-', 'ระหว่างสั่งซื้อ', '-', '', 'Other', 12),
('KOCH-IT-SWT-LB-001', 'KOCH', 'Load Balance', 'TP-link', 'VPN Router TP-LINK (ER605) Gigabit', '-', 'บ่อวิน WH', 'WH', '-', 'ระหว่างสั่งซื้อ', '-', '', 'Other', 13),
('KOCH-IT-RT-26-002', 'KOCH', 'router', 'D-link', '4G Router D-LINK (DWR-953V2) Wireless AC1200', '-', 'บ่อวิน WH', 'WH', '-', 'ระหว่างสั่งซื้อ', '-', '', 'Other', 14),
('KOCH-IT-RT-26-003', 'KOCH', 'router', 'D-link', '4G Router D-LINK (DWR-953V2) Wireless AC1200', '-', 'บ่อวิน WH', 'WH', '-', 'ระหว่างสั่งซื้อ', '-', '', 'Other', 15),
('KOCH-IT-AP-26-007', 'KOCH', 'Access Point', 'TP-link', 'Access Point Outdoor TP-LINK (EAP225-Outdoor) Wireless AC1200 Gigabit', '-', 'บ่อวิน WH', 'WH', '-', 'ระหว่างสั่งซื้อ', '-', '', 'Other', 16),
('TNB-IT-CCTV-26-001', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2622380110673', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 17),
('TNB-IT-CCTV-26-002', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2622380110674', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 18),
('TNB-IT-CCTV-26-003', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2522371212006', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 19),
('TNB-IT-CCTV-26-004', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2522371212005', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 20),
('TNB-IT-CCTV-26-005', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2522371212004', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 21),
('TNB-IT-CCTV-26-006', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2522371212003', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 22),
('TNB-IT-CCTV-26-007', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2522371212008', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 23),
('TNB-IT-CCTV-26-008', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2522371212007', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 24),
('TNB-IT-CCTV-26-009', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2622380110676', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 25),
('TNB-IT-CCTV-26-010', 'TNB', 'CCTV', 'Eagle Eye', 'Eagle Eye Duo Lens Wifi Smart Camera', 'S/N:2622380110675', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ใช้งาน', '-', '', 'Other', 26),
('TNB-IT-NET-26-001', 'TNB', 'NET', 'AIS FiberHome', 'AIS 3BB Fiber Wifi BE3600 HGU HG6142HT', 'GPON SN: FHTTC24AC827', 'ศรีราชา', '-', '2026-04-25', 'ใช้งาน', '2028-04-25', 'หมายเลขอินเทอร์เน็ต : 8806803905 เบอร์ช่าง: 0848219946 (อุปกรณ์เช่า)', 'Other', 27),
('TNB-IT-NET-26-002', 'TNB', 'NET', 'AIS FiberHome', 'AIS 3BB Fiber Wifi BE3600 HGU HG6142HT', 'GPON SN: FHTTC24AC7B3', 'ศรีราชา', '-', '2026-04-25', 'ใช้งาน', '2028-04-25', 'หมายเลขอินเทอร์เน็ต : 8806803905 เบอร์ช่าง: 0848219946 (อุปกรณ์เช่า)', 'Other', 28),
('TNB-IT-NET-26-003', 'TNB', 'NET', 'AIS FiberHome', 'AIS 3BB Fiber Wifi BE3600 HGU HG6142HT', 'GPON SN: FHTTC235D9BE', 'บางแสน เครื่องปริ้น konica bitzub c227', 'เครื่องปริ้น konica bitzub c227', '2026-04-30', 'ใช้งาน', '2028-04-30', 'หมายเลขอินเทอร์เน็ต : 8806816909 (อุปกรณ์เช่า)', 'Other', 29),
('TNB-IT-NET-26-004', 'TNB', 'NET', 'AIS FiberHome', 'AIS 3BB Fiber Wifi BE3600 HGU HG6142HT', 'GPON SN: FHTTC235DA83', 'บางแสน', '-', '2026-04-30', 'เสีย', '2028-04-30', 'หมายเลขอินเทอร์เน็ต : 8806816909 (อุปกรณ์เช่า) เปลี่ยนไปใช้ TNB-IT-NET-26-007', 'Other', 30),
('TNB-IT-NET-26-005', 'SPD', 'NET', 'AIS FiberHome', 'AIS 3BB Fiber Wifi BE3600 HGU HG6142HT', 'GPON SN: FHTTC235DA1F', 'บางแสน', '-', '2026-04-30', 'ใช้งาน', '2028-04-30', 'SPD-BS SPDBS#9898 หมายเลขอินเทอร์เน็ต : 8806817068 (อุปกรณ์เช่า)', 'Other', 31),
('TNB-IT-NET-26-006', 'SPD', 'NET', 'AIS FiberHome', 'AIS 3BB Fiber Wifi BE3600 HGU HG6142HT', 'GPON SN: FHTTC235DA75', 'บางแสน', '-', '2026-04-30', 'ไม่ระบุ', '2028-04-30', 'หมายเลขอินเทอร์เน็ต : 8806817068 (อุปกรณ์เช่า)', 'Other', 32),
('KOCH-IT-CAB-26-001', 'KOCH', 'Cable', '8K HDTV CABLE', '8K HDTV CABLE HD2.1V Premium High Speed HDTV CABLE', 'Appearance patent no: ZL202230178877.5', 'บางแสน ห้องประชุม', 'ห้องประชุม', '-', 'ใช้งาน', '-', '', 'Other', 33),
('KOCH-IT-CAB-26-002', 'KOCH', 'Cable', 'Sun CAT6', 'Sun CAT6 OUTDOOR PE DOUBLE JACKET UTP ENHANCED CABLE', 'Packing No:0477042084104001', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'ไม่ระบุ', '-', '', 'Other', 34),
('KOCH-IT-AD-26-001', 'KOCH', 'Adapter', 'Acer', 'LITE-ON PA-1650-02', 'S/N:879322733', 'บางแสน ห้อง IT', 'ห้อง IT', '-', 'เสีย', '-', '', 'Other', 35),
('KOCH-IT-AP-26-008', 'KOCH', 'Access Point', 'TP-link', 'AX1800 Indoor/Outdoor Wi-Fi 6 Access Point EAP610-Outdoor', 'S/N: 225C09J000515', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 36),
('KOCH-IT-AP-26-009', 'KOCH', 'Access Point', 'TP-link', 'AX1800 Indoor/Outdoor Wi-Fi 6 Access Point EAP610-Outdoor', 'S/N: 225C09J000523', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 37),
('KOCH-IT-AP-26-010', 'KOCH', 'Access Point', 'TP-link', 'Wirless Bridge 5GHz Mbps Long-Range PtP for Indoor/Outdoor EAP215-Bridge KIT', 'S/N: 225B0EU003372', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 38),
('KOCH-IT-AP-26-011', 'KOCH', 'Access Point', 'TP-link', 'Wirless Bridge 5GHz Mbps Long-Range PtP for Indoor/Outdoor EAP215-Bridge KIT', 'S/N: 225B0EU003157', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 39),
('KOCH-IT-AP-26-012', 'KOCH', 'Access Point', 'TP-link', 'Wirless Bridge 5GHz Mbps Long-Range PtP for Indoor/Outdoor EAP215-Bridge KIT', 'S/N: 225B0EU001419', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 40),
('KOCH-IT-AP-26-013', 'KOCH', 'Access Point', 'TP-link', 'Wirless Bridge 5GHz Mbps Long-Range PtP for Indoor/Outdoor EAP215-Bridge KIT', 'S/N: 225B0EU001463', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 41),
('KOCH-IT-AP-26-014', 'KOCH', 'Access Point', 'TP-link', 'AX3000 Ceiling Mount Wi-Fi 6 Access Point EAP653', 'S/N: 22630JU004300', '-', '-', '-', 'ไม่ระบุ', '-', 'Device Key: 1132-6062-DA27-BD33-0000', 'Other', 42),
('KOCH-IT-AD-26-002', 'KOCH', 'Adapter', 'Acer', 'acer AC  adapter W21-065N2D TYPE-C', 'S/N: KP0650301784503A00ESHM', 'บางแสน', '-', '2026-05-25', 'ไม่ระบุ', '-', '', 'Other', 43),
('KOCH-IT-AD-26-003', 'KOCH', 'Adapter', 'ASUS', 'Asus ADP-65DWA', '-', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 44),
('KOCH-IT-AD-26-004', 'KOCH', 'Adapter', 'Lenovo', 'Lenovo ADLX65YLC3D', 'S/N: 8SSA10R16872L1CZ', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 45),
('KOCH-IT-AD-26-005', 'KOCH', 'Adapter', 'Lenovo', 'Lenovo ADLX65YLC3D', 'S/N: 8SSA10R16872L1CZ', '-', '-', '-', 'ไม่ระบุ', '-', '', 'Other', 46),
('KOCH-IT-AP-26-015', 'KOCH', 'Access Point', 'TP-link', 'Archer C50 AC1200 Dual Band Wi-Fi Router', 'S/N: 225507E002554', 'บ้านบึง', '-', '-', 'ไม่ได้ใช้งาน', '-', 'พี่เอ้นำกลับไปบ้านบึงแล้ว', 'Other', 47),
('TNB-IT-NET-26-007', 'TNB', 'NET', 'AIS FiberHome', 'AIS 3BB Fiber Wifi BE3600 HGU HG6142HT', 'GPON SN: FHTTC24ACE40', 'บางแสน ห้องหลังเครื่องปริ้น', 'ห้องหลังเครื่องปริ้น', '-', 'ใช้งาน', '-', 'หมายเลขอินเทอร์เน็ต : 8806816909 (อุปกรณ์เช่า)', 'Other', 48),
('KOCH-IT-KB-26-001', 'KOCH', 'Keyboard', 'Samsung', 'DK Non-detachabel Bluetooth Keyboard Cover EB132', 'S/N: DK260057197', 'บางแสน', '-', '2026-06-01', 'ใช้งาน', '-', '', 'Other', 49),
('KOCH-IT-KB-26-002', 'KOCH', 'Keyboard', 'Samsung', 'DK Non-detachabel Bluetooth Keyboard Cover EB133', 'S/N: DK260065902', 'บางแสน', '-', '2026-06-01', 'ใช้งาน', '-', '', 'Other', 50),
('KOCH-IT-KB-26-003', 'KOCH', 'Keyboard', 'Huawei', 'Huawei Smart Magnetic Keyboard TGR-KB11', 'S/N: 36PWY25C11002424', 'บางแสน', '-', '2026-06-16', 'ไม่ได้ใช้งาน', '-', '', 'Other', 51),
('KOCH-IT-KB-26-004', 'KOCH', 'Keyboard', 'Huawei', 'Huawei Smart Magnetic Keyboard TGR-KB12', 'S/N: 36PWY25C11002520', 'บางแสน', '-', '2026-06-16', 'ไม่ได้ใช้งาน', '-', '', 'Other', 52);

-- maintenance_history: no rows to seed

-- maintenance_requests: no rows to seed

-- checkout_records: no rows to seed

insert into public.notifications (notification_key, title, body, category, date, read, tone, type, remaining_days) values
(null, 'Overdue Return Reminder', 'Asset NB-002 (Lenovo ThinkPad) is overdue. Expected return: 2025-05-17', 'การขอใช้งาน', '23 พฤษภาคม 2568', false, 'orange', null, null),
(null, 'Warranty Expiring Soon', 'Asset PR-001 (Canon Printer) warranty expires in 30 days on 2026-11-10', 'ประกัน', '23 พฤษภาคม 2568', false, 'pink', null, null),
(null, 'Asset Available for Checkout', 'Asset NB-001 (HP Laptop) is now available for checkout', 'ระบบ', '23 พฤษภาคม 2568', false, 'green', null, null),
(null, 'Maintenance Request Approved', 'Computer Won''t Boot request has been approved by IT admin', 'ซ่อมบำรุง', '21 พฤษภาคม 2568', true, 'blue', null, null),
(null, 'New Asset Imported', 'Inventory assets were synced from the latest workbook', 'ระบบ', '20 พฤษภาคม 2568', true, 'green', null, null);

insert into public.login_history (name, role, time, ip, status) values
('User Name', 'user', '2026-06-20 10:19:44', 'local', 'สำเร็จ'),
('User Name', 'user', '2026-06-20 10:18:53', 'local', 'สำเร็จ'),
('Admin User', 'admin', '2026-06-20 08:47:53', 'local', 'สำเร็จ'),
('Admin User', 'admin', '2026-06-20 08:47:27', 'local', 'สำเร็จ'),
('admin', '-', '2026-06-20 08:47:14', 'local', 'ไม่สำเร็จ'),
('Admin User', 'admin', '2026-06-20 08:32:55', 'local', 'สำเร็จ'),
('Admin User', 'admin', '2026-06-20 08:32:43', 'local', 'สำเร็จ'),
('admin', '-', '2026-06-20 08:32:33', 'local', 'ไม่สำเร็จ'),
('Admin User', 'admin', '2026-06-20 08:29:56', 'local', 'สำเร็จ'),
('User Name', 'user', '2026-06-16 11:00:16', 'local', 'สำเร็จ'),
('Admin User', 'admin', '2026-06-12 09:15', '192.168.1.21', 'สำเร็จ'),
('IT User', 'user', '2026-06-11 16:42', '192.168.1.34', 'สำเร็จ'),
('Admin User', 'admin', '2026-06-10 08:05', '192.168.1.21', 'สำเร็จ');

insert into public.app_users (username, email, password, name, department, role, active) values
('admin', 'admin@kochpackaging.co.th', 'admin123', 'Admin User', 'IT', 'admin', true),
('user', 'user@kochpackaging.co.th', 'user123', 'User Name', 'Accounting', 'user', true);

commit;

