-- We must trick Supabase by becoming the true superuser role.
-- Note: Replace this script content and try running it via anon keys vs dashboard.

-- Usually, Postgres roles in standard Supabase SQL execution are limited. 
-- We can bypass this by simply making sure we refer correctly or do it by UI.

-- This issue arises because the `storage` schema is tightly locked down by the `supabase_storage_admin` or `supabase_admin` role.
-- When you execute SQL via the web editor, you execute it as the `postgres` role, which strangely might not own the `storage.objects` table.

-- Workaround: We can temporarily assume the correct role.
BEGIN;
GRANT ALL ON TABLE storage.objects TO postgres;
COMMIT;
