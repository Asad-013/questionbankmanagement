-- =============================================================================
-- Clerk Auth Migration
-- Run this in your Supabase Dashboard → SQL Editor
-- =============================================================================

-- 1. Add clerk_id column to public.users
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- 2. Index for fast lookups by clerk_id (used in every server action)
CREATE INDEX IF NOT EXISTS idx_users_clerk_id
    ON public.users (clerk_id);

-- =============================================================================
-- STEP 2 (run AFTER signing up via Clerk for the first time):
--
-- If the webhook is not yet configured, manually link your Clerk user ID
-- to the existing admin row. Get your Clerk user ID from:
--   Clerk Dashboard → Users → click your user → copy the "User ID" (user_xxx...)
--
-- Replace 'user_XXXX' below with your actual Clerk user ID.
-- =============================================================================

-- Link existing admin account (badhona931@gmail.com) to Clerk identity
-- Run this once after signing up via Clerk, replacing user_XXXX with your real Clerk user ID:
--
-- UPDATE public.users
-- SET clerk_id = 'user_XXXX'
-- WHERE email = 'badhona931@gmail.com';
--
-- This preserves your role = 'admin' and all existing data.
-- The webhook will do this automatically once configured.

-- =============================================================================
-- Summary:
-- - Existing rows keep all their data (role, full_name, etc.)
-- - clerk_id = NULL until sign-up via Clerk links them
-- - badhona931@gmail.com remains admin — role is NEVER changed by the webhook
-- =============================================================================
