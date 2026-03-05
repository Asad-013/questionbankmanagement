-- =============================================================
-- COMPLETE UPLOAD FIX
-- Run this in Supabase SQL Editor to fix all upload issues
-- =============================================================

-- STEP 1: Ensure the 'questions' storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'questions',
  'questions',
  true,
  10485760,  -- 10 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- STEP 2: Enable RLS on storage.objects (safe to run even if already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- STEP 3: Drop ALL existing storage policies for this bucket to avoid conflicts
-- (various scripts created policies with different names)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their own files or Admins can manage all" ON storage.objects;

-- STEP 4: Recreate clean storage policies
-- 4a. Public read (anyone can view uploaded images)
CREATE POLICY "questions_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'questions');

-- 4b. Authenticated users can upload
CREATE POLICY "questions_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'questions');

-- 4c. Users can update their own files; admins/moderators can update any
CREATE POLICY "questions_owner_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'questions'
  AND (
    auth.uid() = owner
    OR public.get_my_role() IN ('admin', 'moderator')
  )
);

-- 4d. Users can delete their own files; admins/moderators can delete any
CREATE POLICY "questions_owner_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'questions'
  AND (
    auth.uid() = owner
    OR public.get_my_role() IN ('admin', 'moderator')
  )
);

-- STEP 5: Ensure questions table RLS is correct for INSERT
-- Drop and recreate the user insert policy cleanly
DROP POLICY IF EXISTS "Users insert own questions" ON public.questions;
CREATE POLICY "Users insert own questions"
ON public.questions FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- STEP 6: Verify the get_my_role() function is NOT affected by RLS loops
-- (Recreate it to be safe)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- STEP 7: Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT INSERT ON TABLE public.questions TO authenticated;
GRANT SELECT ON TABLE public.questions TO authenticated;

-- Done! Verify your storage bucket exists by running:
-- SELECT * FROM storage.buckets WHERE id = 'questions';
-- And verify policies by running:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- STEP 8: Fix academic_years RLS (uses unsafe subquery on users, replace with get_my_role)
DROP POLICY IF EXISTS "Academic years are readable by everyone" ON public.academic_years;
DROP POLICY IF EXISTS "Admins can manage academic years" ON public.academic_years;

CREATE POLICY "Academic years are readable by everyone"
ON public.academic_years FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage academic years"
ON public.academic_years FOR ALL
TO authenticated
USING (public.get_my_role() = 'admin')
WITH CHECK (public.get_my_role() = 'admin');

-- STEP 9: Ensure all required tables are readable by anon/authenticated
GRANT SELECT ON TABLE public.academic_years TO anon;
GRANT SELECT ON TABLE public.academic_years TO authenticated;

