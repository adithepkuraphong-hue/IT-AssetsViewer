-- ============================================================
-- Migration: Add custom_fields support for dynamic category fields and position
-- Run this script in the Supabase SQL Editor
-- ============================================================

-- Step 1: Add custom_fields jsonb column to public.computer_assets and public.other_assets
ALTER TABLE public.computer_assets 
  ADD COLUMN IF NOT EXISTS custom_fields jsonb;

ALTER TABLE public.other_assets 
  ADD COLUMN IF NOT EXISTS custom_fields jsonb;


-- Step 2: Redefine the get_database function to merge custom_fields into the asset JSON objects
CREATE OR REPLACE FUNCTION asset_control_private.get_database(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'asset_control_private', 'pg_temp'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  PERFORM asset_control_private.assert_token(p_token);

  SELECT jsonb_build_object(
    'sourceFile', COALESCE((SELECT value FROM public.asset_control_metadata WHERE key = 'sourceFile'), ''),
    'sourceId', COALESCE((SELECT value FROM public.asset_control_metadata WHERE key = 'sourceId'), ''),
    'generatedAt', COALESCE((SELECT value FROM public.asset_control_metadata WHERE key = 'generatedAt'), ''),
    'computerAssets', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', id,
          'assetCode', asset_code,
          'rustDeskId', rust_desk_id,
          'company', company,
          'type', type,
          'brand', brand,
          'model', model,
          'serial', serial,
          'user', assigned_user,
          'department', department,
          'location', location,
          'room', room,
          'purchaseDate', purchase_date,
          'status', status,
          'warrantyExpirationDate', warranty_expiration_date,
          'windowsVersion', windows_version,
          'sentForRepairDate', sent_for_repair_date,
          'adapter', adapter,
          'mouse', mouse,
          'laptopBag', laptop_bag,
          'syncOneDrive', sync_one_drive,
          'remark', remark,
          'imageUrl', image_url,
          'sourceSheet', source_sheet,
          'sourceRow', source_row
        ) || COALESCE(custom_fields, '{}'::jsonb)
      ) FROM public.computer_assets
    ), '[]'::jsonb),
    'otherAssets', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', id,
          'assetCode', asset_code,
          'company', company,
          'type', type,
          'brand', brand,
          'model', model,
          'serial', serial,
          'location', location,
          'room', room,
          'purchaseDate', purchase_date,
          'status', status,
          'warrantyExpirationDate', warranty_expiration_date,
          'remark', remark,
          'imageUrl', image_url,
          'sourceSheet', source_sheet,
          'sourceRow', source_row
        ) || COALESCE(custom_fields, '{}'::jsonb)
      ) FROM public.other_assets
    ), '[]'::jsonb),
    'master', jsonb_build_object(
      'companies', COALESCE((SELECT jsonb_agg(jsonb_build_object('code', code, 'name', name)) FROM public.master_companies), '[]'::jsonb),
      'departments', COALESCE((SELECT jsonb_agg(jsonb_build_object('code', code, 'name', name)) FROM public.master_departments), '[]'::jsonb),
      'locations', COALESCE((SELECT jsonb_agg(jsonb_build_object('code', code, 'name', name)) FROM public.master_locations), '[]'::jsonb),
      'types', COALESCE((SELECT jsonb_agg(jsonb_build_object('code', code, 'name', name, 'groupCode', group_code)) FROM public.master_types), '[]'::jsonb),
      'typeGroups', COALESCE((SELECT jsonb_agg(jsonb_build_object('code', code, 'name', name)) FROM public.master_type_groups), '[]'::jsonb),
      'statuses', COALESCE((SELECT jsonb_agg(jsonb_build_object('code', code, 'name', name)) FROM public.master_statuses), '[]'::jsonb)
    ),
    'maintenanceHistory', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'title', title,
        'asset', asset,
        'type', type,
        'date', date,
        'completedDate', completed_date,
        'cost', cost,
        'status', status,
        'operator', operator,
        'details', details
      )) FROM public.maintenance_history
    ), '[]'::jsonb),
    'maintenanceRequests', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'title', title,
        'desc', description,
        'asset', asset,
        'brand', brand,
        'type', type,
        'requester', requester,
        'date', date,
        'priority', priority,
        'status', status,
        'approvedDate', approved_date,
        'approvalNote', approval_note
      )) FROM public.maintenance_requests
    ), '[]'::jsonb),
    'checkoutRecords', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'asset', asset,
        'sub', subtitle,
        'requester', requester,
        'department', department,
        'date', date,
        'expectedReturn', expected_return,
        'returnedDate', returned_date,
        'purpose', purpose,
        'status', status
      )) FROM public.checkout_records
    ), '[]'::jsonb),
    'notifications', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'key', notification_key,
        'title', title,
        'body', body,
        'category', category,
        'date', date,
        'read', read,
        'tone', tone,
        'type', type,
        'remainingDays', remaining_days
      )) FROM public.notifications
    ), '[]'::jsonb),
    'loginHistory', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'name', name,
        'role', role,
        'time', time,
        'ip', ip,
        'status', status
      )) FROM public.login_history
    ), '[]'::jsonb),
    'users', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'username', username,
        'email', email,
        'password', password,
        'name', name,
        'department', department,
        'role', role,
        'active', active
      )) FROM public.app_users
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;


-- Step 3: Redefine the replace_database function to map and save the original record JSON as custom_fields
CREATE OR REPLACE FUNCTION asset_control_private.replace_database(p_token text, p_database jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'asset_control_private', 'pg_temp'
AS $$
BEGIN
  PERFORM asset_control_private.assert_token(p_token);

  -- Truncate all tables to overwrite with latest state
  TRUNCATE TABLE public.login_history, public.notifications, public.checkout_records, 
                 public.maintenance_requests, public.maintenance_history, public.other_assets, 
                 public.computer_assets, public.master_types, public.master_locations, 
                 public.master_departments, public.master_companies, public.asset_control_metadata, 
                 public.app_users RESTART IDENTITY CASCADE;

  -- Insert metadata
  INSERT INTO public.asset_control_metadata (key, value)
  VALUES 
    ('sourceFile', p_database->>'sourceFile'),
    ('sourceId', p_database->>'sourceId'),
    ('generatedAt', p_database->>'generatedAt');

  -- Insert master tables
  INSERT INTO public.master_companies (code, name)
  SELECT code, name FROM jsonb_to_recordset(p_database->'master'->'companies') AS x(code text, name text);

  INSERT INTO public.master_departments (code, name)
  SELECT code, name FROM jsonb_to_recordset(p_database->'master'->'departments') AS x(code text, name text);

  INSERT INTO public.master_locations (code, name)
  SELECT code, name FROM jsonb_to_recordset(p_database->'master'->'locations') AS x(code text, name text);

  INSERT INTO public.master_types (code, name, group_code)
  SELECT code, name, COALESCE("groupCode", '') FROM jsonb_to_recordset(p_database->'master'->'types') AS x(code text, name text, "groupCode" text);

  -- Insert computer_assets
  INSERT INTO public.computer_assets (
    asset_code, rust_desk_id, company, type, brand, model, serial,
    assigned_user, department, location, room, purchase_date, status,
    warranty_expiration_date, windows_version, sent_for_repair_date, adapter,
    mouse, laptop_bag, sync_one_drive, remark, image_url, source_sheet, source_row,
    custom_fields
  )
  SELECT
    "assetCode", "rustDeskId", company, type, brand, model, serial,
    "user", department, location, room, "purchaseDate", status,
    "warrantyExpirationDate", "windowsVersion", "sentForRepairDate", COALESCE(adapter, false),
    COALESCE(mouse, false), COALESCE("laptopBag", false), COALESCE("syncOneDrive", false), remark, "imageUrl", source_sheet, "sourceRow",
    -- Extract all other custom keys into a custom_fields jsonb
    (r.val - 'id' - 'assetCode' - 'rustDeskId' - 'company' - 'type' - 'brand' - 'model' - 'serial' - 'user' - 'department' - 'location' - 'room' - 'purchaseDate' - 'status' - 'warrantyExpirationDate' - 'windowsVersion' - 'sentForRepairDate' - 'adapter' - 'mouse' - 'laptopBag' - 'syncOneDrive' - 'remark' - 'imageUrl' - 'sourceSheet' - 'sourceRow')
  FROM jsonb_to_recordset(p_database->'computerAssets') AS x(
    "assetCode" text, "rustDeskId" text, company text, type text, brand text, model text, serial text,
    "user" text, department text, location text, room text, "purchaseDate" text, status text,
    "warrantyExpirationDate" text, "windowsVersion" text, "sentForRepairDate" text, adapter boolean,
    mouse boolean, "laptopBag" boolean, "syncOneDrive" boolean, remark text, "imageUrl" text, source_sheet text, "sourceRow" integer
  )
  CROSS JOIN LATERAL (
    SELECT (elem - 'id') AS val 
    FROM jsonb_array_elements(p_database->'computerAssets') AS elem
    WHERE (elem->>'assetCode') = x."assetCode"
    LIMIT 1
  ) r;

  -- Insert other_assets
  INSERT INTO public.other_assets (
    asset_code, company, type, brand, model, serial, location, room, 
    purchase_date, status, warranty_expiration_date, remark, image_url, source_sheet, source_row,
    custom_fields
  )
  SELECT
    "assetCode", company, type, brand, model, serial, location, room, 
    "purchaseDate", status, "warrantyExpirationDate", remark, "imageUrl", source_sheet, "sourceRow",
    -- Extract all other custom keys into custom_fields jsonb
    (r.val - 'id' - 'assetCode' - 'company' - 'type' - 'brand' - 'model' - 'serial' - 'location' - 'room' - 'purchaseDate' - 'status' - 'warrantyExpirationDate' - 'remark' - 'imageUrl' - 'sourceSheet' - 'sourceRow')
  FROM jsonb_to_recordset(p_database->'otherAssets') AS x(
    "assetCode" text, company text, type text, brand text, model text, serial text, location text, room text, 
    "purchaseDate" text, status text, "warrantyExpirationDate" text, remark text, "imageUrl" text, source_sheet text, "sourceRow" integer
  )
  CROSS JOIN LATERAL (
    SELECT (elem - 'id') AS val 
    FROM jsonb_array_elements(p_database->'otherAssets') AS elem
    WHERE (elem->>'assetCode') = x."assetCode"
    LIMIT 1
  ) r;

  -- Insert maintenance_history
  INSERT INTO public.maintenance_history (title, asset, type, date, completed_date, cost, status, operator, details)
  SELECT title, asset, type, date, "completedDate", cost, status, operator, details FROM jsonb_to_recordset(p_database->'maintenanceHistory') AS x(
    title text, asset text, type text, date text, "completedDate" text, cost text, status text, operator text, details text
  );

  -- Insert maintenance_requests
  INSERT INTO public.maintenance_requests (title, description, asset, brand, type, requester, date, priority, status, approved_date, approval_note)
  SELECT title, "desc", asset, brand, type, requester, date, priority, status, "approvedDate", "approvalNote" FROM jsonb_to_recordset(p_database->'maintenanceRequests') AS x(
    title text, "desc" text, asset text, brand text, type text, requester text, date text, priority text, status text, "approvedDate" text, "approvalNote" text
  );

  -- Insert checkout_records
  INSERT INTO public.checkout_records (asset, subtitle, requester, department, date, expected_return, returned_date, purpose, status)
  SELECT asset, sub, requester, department, date, "expectedReturn", "returnedDate", purpose, status FROM jsonb_to_recordset(p_database->'checkoutRecords') AS x(
    asset text, sub text, requester text, department text, date text, "expectedReturn" text, "returnedDate" text, purpose text, status text
  );

  -- Insert notifications
  INSERT INTO public.notifications (notification_key, title, body, category, date, read, tone, type, remaining_days)
  SELECT key, title, body, category, date, COALESCE(read, false), tone, type, "remainingDays" FROM jsonb_to_recordset(p_database->'notifications') AS x(
    key text, title text, body text, category text, date text, read boolean, tone text, type text, "remainingDays" integer
  );

  -- Insert login_history
  INSERT INTO public.login_history (name, role, time, ip, status)
  SELECT name, role, time, ip, status FROM jsonb_to_recordset(p_database->'loginHistory') AS x(
    name text, role text, time text, ip text, status text
  );

  -- Insert users
  INSERT INTO public.app_users (username, email, password, name, department, role, active)
  SELECT username, email, password, name, department, role, COALESCE(active, true) FROM jsonb_to_recordset(p_database->'users') AS x(
    username text, email text, password text, name text, department text, role text, active boolean
  );

  RETURN asset_control_private.get_database(p_token);
END;
$$;
