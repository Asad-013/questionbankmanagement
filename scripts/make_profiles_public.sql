-- Make user profiles readable to everyone in the application
-- This allows features like showing the "Uploader's Name" and "Avatar" on questions to work for students as well!

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;

-- Everyone who is logged in can view basic public profile info of other members
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (true);
