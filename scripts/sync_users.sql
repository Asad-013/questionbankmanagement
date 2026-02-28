-- Fix Missing Users Sync Script
-- This script does TWO things:
-- 1. Sets up an automatic backend trigger so future signups ALWAYS sync to public.users.
-- 2. Backfills any currently missing users from auth.users into public.users.

-- ----------------------------------------------------
-- STEP 1: Define the trigger function
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into the public.users table from the auth.users signup
  INSERT INTO public.users (id, email, role, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    -- Default role to student, safe fallback
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------
-- STEP 2: Bind the trigger to the auth.users table
-- ----------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ----------------------------------------------------
-- STEP 3: Backfill any stranded users that didn't get synced
-- ----------------------------------------------------
INSERT INTO public.users (id, email, role)
SELECT 
    au.id, 
    au.email, 
    COALESCE(au.raw_user_meta_data->>'role', 'student') as role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
