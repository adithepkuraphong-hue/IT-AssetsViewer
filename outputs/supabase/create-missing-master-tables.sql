-- ============================================================
-- Migration: Create missing master tables
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create master_statuses table
CREATE TABLE IF NOT EXISTS public.master_statuses (
  code text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create master_type_groups table
CREATE TABLE IF NOT EXISTS public.master_type_groups (
  code text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
