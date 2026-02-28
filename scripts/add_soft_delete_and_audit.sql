-- Implement Soft Deletion for Questions (Recycle Bin)
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Drop and recreate RLS policies to ignore soft-deleted questions
DROP POLICY IF EXISTS "Public read approved questions" ON public.questions;
CREATE POLICY "Public read approved questions" ON public.questions 
FOR SELECT TO public 
USING (status = 'approved' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users see own questions" ON public.questions;
CREATE POLICY "Users see own questions" ON public.questions 
FOR SELECT TO authenticated 
USING (created_by = auth.uid() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Admin see all questions" ON public.questions;
CREATE POLICY "Admin see all questions" ON public.questions 
FOR SELECT TO authenticated 
USING (get_my_role() IN ('admin', 'moderator')); 
-- Admins and Moderators can still see soft-deleted stuff in some contexts, but let's hide them from general lists.
-- Actually, let's let admins see them, but we will filter `deleted_at IS NULL` in the Next.js queries for most screens.

-- Let's create an Audit Logging Table to keep track of admin and moderation actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    performed_by UUID REFERENCES public.users(id),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read audit logs" ON public.audit_logs;
CREATE POLICY "Admins can read audit logs" ON public.audit_logs
FOR SELECT TO authenticated
USING (get_my_role() = 'admin');

-- Admins and up can insert audit logs
DROP POLICY IF EXISTS "Authed users can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authed users can insert audit logs" ON public.audit_logs
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = performed_by);
