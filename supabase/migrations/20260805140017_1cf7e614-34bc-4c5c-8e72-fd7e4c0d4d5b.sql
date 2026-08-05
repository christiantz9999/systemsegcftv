CREATE TABLE IF NOT EXISTS public.migration_logs (
    id serial PRIMARY KEY,
    message text,
    created_at timestamptz DEFAULT now()
);

DO $$
DECLARE
    user_count int;
    target_user_id uuid;
    user_email text := 'visionario.allpha@gmail.com';
BEGIN
    SELECT count(*) INTO user_count FROM auth.users;
    INSERT INTO public.migration_logs (message) VALUES ('Total users in auth.users: ' || user_count);
    
    SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
    
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.migration_logs (message) VALUES ('Found user ID: ' || target_user_id);
        
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        UPDATE auth.users 
        SET email_confirmed_at = NOW(),
            updated_at = NOW()
        WHERE id = target_user_id;
        
        INSERT INTO public.migration_logs (message) VALUES ('Assigned admin role to ' || user_email);
    ELSE
        INSERT INTO public.migration_logs (message) VALUES ('User NOT found: ' || user_email);
    END IF;
END$$;
