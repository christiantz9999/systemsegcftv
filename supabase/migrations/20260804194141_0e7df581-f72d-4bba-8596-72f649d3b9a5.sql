DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Try to find the user in auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'visionario.allpha@gmail.com';
    
    IF v_user_id IS NOT NULL THEN
        -- Insert into user_roles if not already there
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    ELSE
        -- If not found, we can't do much here, but we can log it or let the system know.
        -- For now, let's just finish. The user might not have signed up yet.
    END IF;
END $$;