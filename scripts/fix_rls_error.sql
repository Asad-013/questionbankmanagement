-- Fix for 500 Error (RLS Infinite Recursion)

-- 1. Create a SECURITY DEFINER function to check role without triggering RLS loops
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop problematic policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Admin write departments" ON public.departments;
DROP POLICY IF EXISTS "Admin write exam_names" ON public.exam_names;
DROP POLICY IF EXISTS "Admin write courses" ON public.courses;
DROP POLICY IF EXISTS "Admin see all questions" ON public.questions;

-- 3. Re-create policies using the safe function
-- Users Table
CREATE POLICY "Admins can read all profiles" ON public.users 
FOR SELECT TO authenticated 
USING (get_my_role() = 'admin');

-- Departments
CREATE POLICY "Admin write departments" ON public.departments 
FOR ALL TO authenticated 
USING (get_my_role() = 'admin');

-- Exam Names
CREATE POLICY "Admin write exam_names" ON public.exam_names 
FOR ALL TO authenticated 
USING (get_my_role() = 'admin');

-- Courses
CREATE POLICY "Admin write courses" ON public.courses 
FOR ALL TO authenticated 
USING (get_my_role() = 'admin');

-- Questions (Admins and Moderators)
CREATE POLICY "Admin see all questions" ON public.questions 
FOR SELECT TO authenticated 
USING (get_my_role() IN ('admin', 'moderator'));
