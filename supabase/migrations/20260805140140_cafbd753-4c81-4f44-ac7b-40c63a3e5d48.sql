-- Trigger function to assign admin role to the first user
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_count int;
BEGIN
    SELECT count(*) INTO user_count FROM auth.users;
    
    -- If this is the only user, make them admin
    IF user_count = 1 THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users (requires migration privileges)
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_admin();
