-- 1. First, ensuring the RLS fix is active (crucial)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Upsert the user to ensure they exist in public table and are admin
INSERT INTO public.users (id, email, role, email_verified)
VALUES (
  '23abe070-8d61-4812-8e75-871f1433bd04', -- ID from your error log
  'badhona931@gmail.com',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin', email = EXCLUDED.email;
