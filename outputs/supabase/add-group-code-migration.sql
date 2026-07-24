-- ============================================================
-- Migration: Add group_code to master_types
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Add group_code column to master_types table
ALTER TABLE public.master_types 
  ADD COLUMN IF NOT EXISTS group_code text NOT NULL DEFAULT '';

-- Step 2: Populate group_code for existing types
UPDATE public.master_types SET group_code = 'IT'  WHERE code IN ('AD','IP','KB','MB','MON','NB','PC','PRT','SR','SRV','TAB');
UPDATE public.master_types SET group_code = 'NET' WHERE code IN ('AP','CAB','CCTV','FW','LB','NET','RT','SWT');
UPDATE public.master_types SET group_code = 'SFT' WHERE code IN ('SL');
UPDATE public.master_types SET group_code = 'OFE' WHERE code IN ('TV');

-- Verify
SELECT code, name, group_code FROM public.master_types ORDER BY group_code, name;
