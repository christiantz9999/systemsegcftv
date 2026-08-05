-- Re-define a função has_role para garantir que ela funcione corretamente
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Garante que o administrador visionario.allpha@gmail.com tenha a role na tabela se o usuário existir
do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = 'visionario.allpha@gmail.com';
  
  if v_user_id is not null then
    insert into public.user_roles (user_id, role)
    values (v_user_id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
end $$;
