-- Allow Admins to UPDATE questions (Crucial for moderation)
-- Previously, we only had policies for SELECT and INSERT for users.
-- Admins need UPDATE permission to change status from 'pending' to 'approved'.

-- DROP existing update policy if any (unlikely based on my view)
DROP POLICY IF EXISTS "Admin update questions" ON public.questions;
DROP POLICY IF EXISTS "Users update own questions" ON public.questions;

-- Create comprehensive UPDATE policy for Admins
CREATE POLICY "Admin update questions" 
ON public.questions 
FOR UPDATE 
TO authenticated 
USING (get_my_role() IN ('admin', 'moderator'));

-- Verify and Fix SELECT policy as well (ensure admins can SEE the pending questions they want to update)
DROP POLICY IF EXISTS "Admin see all questions" ON public.questions;

CREATE POLICY "Admin see all questions" 
ON public.questions 
FOR SELECT 
TO authenticated 
USING (
  get_my_role() IN ('admin', 'moderator') 
  OR created_by = auth.uid()
);
