-- Storage Public Access Fix

-- 1. Ensure the bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'questions';

-- 2. Drop existing SELECT policies to ensure no conflicts or restrictions
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read storage" ON storage.objects;

-- 3. Create a truly public SELECT policy
-- allowing 'anon' and 'authenticated' to read ANY object in the 'questions' bucket
CREATE POLICY "Public read storage"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'questions' );

-- 4. Verify Database Public Access (Just in case)
DROP POLICY IF EXISTS "Public read approved questions" ON public.questions;

CREATE POLICY "Public read approved questions" 
ON public.questions FOR SELECT 
TO public 
USING (status = 'approved');

-- 5. Grant Usage on schema (sometimes needed for anon)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON TABLE public.questions TO anon;
GRANT SELECT ON TABLE public.questions TO authenticated;

GRANT SELECT ON TABLE public.departments TO anon;
GRANT SELECT ON TABLE public.departments TO authenticated;

GRANT SELECT ON TABLE public.courses TO anon;
GRANT SELECT ON TABLE public.courses TO authenticated;

GRANT SELECT ON TABLE public.exam_names TO anon;
GRANT SELECT ON TABLE public.exam_names TO authenticated;
