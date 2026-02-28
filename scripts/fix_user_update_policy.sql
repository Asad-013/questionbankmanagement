-- Fix User Role Update Policy
-- Administrators must have the ability to update user records (changing roles)
-- This policy grants users with the 'admin' role permission to run UPDATE on any auth record in public.users.

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;

CREATE POLICY "Admins can update all profiles" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (get_my_role() = 'admin');
