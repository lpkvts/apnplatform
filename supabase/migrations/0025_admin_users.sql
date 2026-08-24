-- APN Hungary Platform — Admin felhasználó-lista (security definer, RLS-rekurzió nélkül)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

create or replace function public.admin_user_list()
returns table (
  id uuid, email text, full_name text, role text,
  apn_type text, workplace text, specialty text, title text, created_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select p.id, u.email, p.full_name, p.role, p.apn_type, p.workplace, p.specialty, p.title, p.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where public.is_admin()
  order by p.created_at desc
$$;

revoke all on function public.admin_user_list() from public, anon;
grant execute on function public.admin_user_list() to authenticated;
