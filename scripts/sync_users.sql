-- Ensure the public.users table has the current user
-- This is a generic fix that triggers on question insertion failure if possible, but triggers are complex.
-- Instead, let's just make sure we are syncing users.

-- The error "foreign key constraint questions_created_by_fkey" means 
-- the user ID we are trying to insert into 'created_by' does not exist in the 'public.users' table to reference.

-- We should run a sync to ensure all auth.users are in public.users
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;
