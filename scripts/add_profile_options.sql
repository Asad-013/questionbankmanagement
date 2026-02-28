-- Add additional profile fields to public.users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
