ALTER FUNCTION public.make_first_user_admin() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.make_first_user_admin() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;