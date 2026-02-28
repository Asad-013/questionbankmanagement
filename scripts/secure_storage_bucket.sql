-- Secure the Supabase Storage Bucket ('questions' bucket)
-- By default, buckets might be completely open or completely closed. 
-- We need to ensure malicious users cannot delete other people's images.

-- Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('questions', 'questions', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Allow public read access to the 'questions' bucket
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'questions');

-- 2. Allow authenticated users to upload to the 'questions' bucket
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
CREATE POLICY "Authenticated Upload Access" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'questions');

-- 3. Allow users to update/delete ONLY their own uploaded files OR if they are Admin/Moderator
DROP POLICY IF EXISTS "Users can manage their own files or Admins can manage all" ON storage.objects;
CREATE POLICY "Users can manage their own files or Admins can manage all" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'questions' 
  AND (
    auth.uid() = owner 
    OR 
    public.get_my_role() IN ('admin', 'moderator')
  )
);

-- Note: In Supabase Storage, the 'owner' column is automatically set to the auth.uid() of the person who uploaded the file.
