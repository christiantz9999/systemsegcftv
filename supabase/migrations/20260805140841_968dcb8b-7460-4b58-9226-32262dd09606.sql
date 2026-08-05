-- 1. Proteger a tabela migration_logs com RLS (somente admins podem ler)
ALTER TABLE public.migration_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.migration_logs FROM anon;
REVOKE ALL ON public.migration_logs FROM authenticated;
GRANT SELECT ON public.migration_logs TO authenticated;
GRANT ALL ON public.migration_logs TO service_role;

CREATE POLICY "Admins can view migration logs"
ON public.migration_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Restringir execução das funções SECURITY DEFINER
-- has_role: necessária para políticas RLS de usuários autenticados, mas não para anônimos
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Funções de gatilho: não devem ser executáveis via API
REVOKE EXECUTE ON FUNCTION public.handle_first_user_admin() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.make_first_user_admin() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM public, anon, authenticated;