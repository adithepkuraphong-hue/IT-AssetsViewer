-- ============================================================
-- Migration: Add missing group_code column to master_types table
-- Run this in the Supabase SQL Editor
-- ============================================================

ALTER TABLE public.master_types 
  ADD COLUMN IF NOT EXISTS group_code text;
