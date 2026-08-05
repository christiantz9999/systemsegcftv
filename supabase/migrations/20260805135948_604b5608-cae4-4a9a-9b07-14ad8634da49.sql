-- Create enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END$$;

-- Ensure user_roles table exists with correct permissions
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Fix permissions for user_roles
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Re-enable RLS just in case
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create or replace has_role function with security definer to bypass RLS for internal check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Assign admin role to the specific email
-- Also confirm their email just in case they are stuck at 'Email not confirmed'
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'visionario.allpha@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Insert role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Confirm email if not confirmed
        UPDATE auth.users 
        SET email_confirmed_at = NOW(),
            updated_at = NOW()
        WHERE id = target_user_id AND email_confirmed_at IS NULL;
    END IF;
END$$;
