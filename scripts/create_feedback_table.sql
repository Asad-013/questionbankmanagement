-- Create Feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'improvement', 'other')),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit feedback
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT TO public WITH CHECK (true);

-- Policy: Only admins/moderators can view feedback
DROP POLICY IF EXISTS "Admin and moderators can read feedback" ON public.feedback;
CREATE POLICY "Admin and moderators can read feedback" ON public.feedback FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at 
BEFORE UPDATE ON public.feedback 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create storage bucket for feedback screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('feedback', 'feedback', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Public can view feedback screenshots
DROP POLICY IF EXISTS "Public can view feedback screenshots" ON storage.objects;
CREATE POLICY "Public can view feedback screenshots" ON storage.objects FOR SELECT TO public USING (bucket_id = 'feedback');

-- Storage policy: Anyone can upload feedback screenshots
DROP POLICY IF EXISTS "Public can upload feedback screenshots" ON storage.objects;
CREATE POLICY "Public can upload feedback screenshots" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'feedback');

