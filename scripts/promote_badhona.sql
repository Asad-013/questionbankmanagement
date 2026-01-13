-- Promote a specific user to admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'badhona931@gmail.com';

-- Alternatively, insert them if they don't exist yet (requires their UUID from auth.users though)
-- This is trickier because we need the ID from auth.users.
-- The best approach is:
-- 1. Sign up as 'badhona931@gmail.com' in the app (selecting any role).
-- 2. Run the UPDATE command above in the Supabase SQL Editor.
