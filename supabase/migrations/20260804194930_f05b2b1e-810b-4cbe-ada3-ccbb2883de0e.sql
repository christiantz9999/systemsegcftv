
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Procura o ID do usuário na tabela auth.users via SQL (o que o agente tem permissão para fazer em migrações)
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'visionario.allpha@gmail.com';

    IF target_user_id IS NOT NULL THEN
        -- Insere na user_roles se não existir
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;
