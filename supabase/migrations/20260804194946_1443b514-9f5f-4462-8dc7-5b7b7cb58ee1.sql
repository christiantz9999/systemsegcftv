
-- Remove a permissão de execução do public para a função has_role
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;

-- Garante execução apenas para o service_role e usuários autenticados (conforme necessário pelas RLS)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
