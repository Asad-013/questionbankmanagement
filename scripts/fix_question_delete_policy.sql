-- Fix for Question Deletion (Missing RLS Policy)

-- 1. Drop existing delete policy if any
DROP POLICY IF EXISTS "Admin delete questions" ON public.questions;
DROP POLICY IF EXISTS "Users delete own pending questions" ON public.questions;

-- 2. Create policy for Admins and Moderators to delete ANY question
CREATE POLICY "Admin delete questions" 
ON public.questions 
FOR DELETE 
TO authenticated 
USING (get_my_role() IN ('admin', 'moderator'));

-- 3. (Optional) Create policy for Users to delete their own PENDING questions
CREATE POLICY "Users delete own pending questions" 
ON public.questions 
FOR DELETE 
TO authenticated 
USING (
    created_by = auth.uid() 
    AND status = 'pending'
);

-- 4. Verify that 'Admin write questions' actually exists for UPDATE too
-- (Required for moderation actions like approve/reject)
DROP POLICY IF EXISTS "Admin update questions" ON public.questions;
CREATE POLICY "Admin update questions" 
ON public.questions 
FOR UPDATE 
TO authenticated 
USING (get_my_role() IN ('admin', 'moderator'));
