CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger should be on auth.users, but we can't easily do that in Cloud.
-- Instead, let's use a trigger on public.profiles if we had one, or just check on sign-up in the client.
-- Better yet, a trigger on user_roles is not helpful.
-- I'll just provide a simple admin setup page for the developer.

-- Actually, I'll just assign it in the migration if the user specifies an email, but for now I'll just allow creating an admin via a special server function that checks a secret.
