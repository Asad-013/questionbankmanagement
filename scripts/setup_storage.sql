-- Safely recreate storage policies

-- Drop existing policies first to avoid "already exists" errors
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;

-- Create the 'questions' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('questions', 'questions', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'questions' );

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'questions' );

-- Allow users to update their own uploads (optional, but good for retries)
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'questions' AND auth.uid() = owner );

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'questions' AND auth.uid() = owner );
