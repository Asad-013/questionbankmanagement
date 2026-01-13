-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'moderator', 'admin')),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Exam Names table
CREATE TABLE IF NOT EXISTS public.exam_names (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  exam_year INTEGER NOT NULL,
  session VARCHAR(50) CHECK (session IN ('Spring', 'Summer', 'Fall', 'Winter')),
  department_id UUID REFERENCES public.departments(id),
  course_id UUID REFERENCES public.courses(id),
  exam_name_id UUID REFERENCES public.exam_names(id),
  course_code VARCHAR(20),
  description TEXT,
  tags TEXT[],
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  rejection_reason TEXT,
  created_by UUID REFERENCES public.users(id),
  reviewed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Helper function to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-running script
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

DROP POLICY IF EXISTS "Public read departments" ON public.departments;
DROP POLICY IF EXISTS "Admin write departments" ON public.departments;

DROP POLICY IF EXISTS "Public read exam_names" ON public.exam_names;
DROP POLICY IF EXISTS "Admin write exam_names" ON public.exam_names;

DROP POLICY IF EXISTS "Public read courses" ON public.courses;
DROP POLICY IF EXISTS "Admin write courses" ON public.courses;

DROP POLICY IF EXISTS "Public read approved questions" ON public.questions;
DROP POLICY IF EXISTS "Users see own questions" ON public.questions;
DROP POLICY IF EXISTS "Admin see all questions" ON public.questions;
DROP POLICY IF EXISTS "Users insert own questions" ON public.questions;

-- RLS Policies
-- Users
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
-- FIXED: Use security definer function
CREATE POLICY "Admins can read all profiles" ON public.users FOR SELECT TO authenticated USING (get_my_role() = 'admin');
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Departments
CREATE POLICY "Public read departments" ON public.departments FOR SELECT TO public USING (true);
CREATE POLICY "Admin write departments" ON public.departments FOR ALL TO authenticated USING (get_my_role() = 'admin');

-- Exam Names
CREATE POLICY "Public read exam_names" ON public.exam_names FOR SELECT TO public USING (true);
CREATE POLICY "Admin write exam_names" ON public.exam_names FOR ALL TO authenticated USING (get_my_role() = 'admin');

-- Courses
CREATE POLICY "Public read courses" ON public.courses FOR SELECT TO public USING (true);
CREATE POLICY "Admin write courses" ON public.courses FOR ALL TO authenticated USING (get_my_role() = 'admin');

-- Questions
CREATE POLICY "Public read approved questions" ON public.questions FOR SELECT TO public USING (status = 'approved');
CREATE POLICY "Users see own questions" ON public.questions FOR SELECT TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Admin see all questions" ON public.questions FOR SELECT TO authenticated USING (get_my_role() IN ('admin', 'moderator'));
CREATE POLICY "Users insert own questions" ON public.questions FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON public.questions;
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
