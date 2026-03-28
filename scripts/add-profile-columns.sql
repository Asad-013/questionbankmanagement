-- Migration: Add profile columns to users table
-- Run this in Supabase SQL Editor if your users table already exists

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name VARCHAR(200);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
