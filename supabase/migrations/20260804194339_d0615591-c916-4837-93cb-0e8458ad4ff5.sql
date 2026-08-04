DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- This search runs inside the database environment where auth schema is accessible to the migrator
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'visionario.allpha@gmail.com';
    
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    ELSE
        -- No error, just no action if user isn't found
    END IF;
END $$;