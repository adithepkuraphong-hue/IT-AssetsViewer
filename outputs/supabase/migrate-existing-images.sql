-- ============================================================
-- One-time Data Migration: Move image URLs from remark to image_url column
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Migrate computer_assets
UPDATE public.computer_assets
SET 
  image_url = substring(remark from '\[image:\s*([^\s\]]+)\]'),
  remark = trim(regexp_replace(remark, '[\r\n]*\[image:\s*[^\s\]]+\]', ''))
WHERE remark LIKE '%[image:%';

-- 2. Migrate other_assets
UPDATE public.other_assets
SET 
  image_url = substring(remark from '\[image:\s*([^\s\]]+)\]'),
  remark = trim(regexp_replace(remark, '[\r\n]*\[image:\s*[^\s\]]+\]', ''))
WHERE remark LIKE '%[image:%';
