-- Applications table for Admin/Moderator hiring flow
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  whatsapp VARCHAR(30) NOT NULL,
  university VARCHAR(200) NOT NULL,
  department VARCHAR(200) NOT NULL,
  session VARCHAR(50) NOT NULL,
  id_card_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policy: Public can submit applications
DROP POLICY IF EXISTS "Anyone can submit application" ON public.applications;
CREATE POLICY "Anyone can submit application" ON public.applications FOR INSERT TO public WITH CHECK (true);

-- Policy: Only admins can view all applications
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
CREATE POLICY "Admins can view all applications" ON public.applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policy: Only admins can update applications
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
CREATE POLICY "Admins can update applications" ON public.applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at 
BEFORE UPDATE ON public.applications 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create storage bucket for ID cards
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('id-cards', 'id-cards', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Public can view ID cards
DROP POLICY IF EXISTS "Public can view id-cards" ON storage.objects;
CREATE POLICY "Public can view id-cards" ON storage.objects FOR SELECT TO public USING (bucket_id = 'id-cards');

-- Storage policy: Anyone can upload ID cards (for public application form)
DROP POLICY IF EXISTS "Authenticated can upload id-cards" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload id-cards" ON storage.objects;
CREATE POLICY "Public can upload id-cards" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'id-cards');
