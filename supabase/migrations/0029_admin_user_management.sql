-- APN Hungary Platform — Admin felhasználókezelés (0029)
--
-- ÖNHORDÓ ÉS ÚJRAFUTTATHATÓ: akkor is végigfut, ha a 0012 / 0025 / 0027 migráció
-- kimaradt, és többször is lefuttatható következmény nélkül.
--
-- Futtatás: Supabase → SQL Editor → beilleszt → Run.
-- A végén egy ellenőrző lekérdezés kiírja, mi jött létre.

-- ══ 0. Előfeltételek biztosítása ═══════════════════════════

-- Az újdonságjelzés oszlopai (0027) — az admin_user_get hivatkozik rájuk.
alter table public.profiles
  add column if not exists updates_seen_at timestamptz,
  add column if not exists updates_seen_version text;

-- Audit napló (0012) — az admin_log ide ír.
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid, actor_email text, action text not null, entity text not null,
  entity_id uuid, entity_title text, details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Admin-ellenőrző segédfüggvény (0025). Security definer, ezért nem okoz RLS-rekurziót.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ══ 1. Egy felhasználó adatlapja ═══════════════════════════
-- A visszatérési típus változhatott, ezért előbb eldobjuk.
drop function if exists public.admin_user_get(uuid);

create function public.admin_user_get(p_id uuid)
returns table (
  id uuid, email text, email_confirmed_at timestamptz, last_sign_in_at timestamptz,
  full_name text, role text, apn_type text, title text, workplace text,
  specialty text, qualification text, qual_year int, registration_no text, phone text,
  created_at timestamptz, updates_seen_at timestamptz, updates_seen_version text
)
language sql stable security definer set search_path = public as $$
  select p.id, u.email::text, u.email_confirmed_at, u.last_sign_in_at,
         p.full_name, p.role, p.apn_type, p.title, p.workplace,
         p.specialty, p.qualification, p.qual_year, p.registration_no, p.phone,
         p.created_at, p.updates_seen_at, p.updates_seen_version
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.id = p_id and public.is_admin()
$$;

revoke all on function public.admin_user_get(uuid) from public, anon;
grant execute on function public.admin_user_get(uuid) to authenticated;

-- ══ 2. Admin szerkesztheti bármely profilt ═════════════════
alter table public.profiles enable row level security;

drop policy if exists "profil: admin olvasás" on public.profiles;
create policy "profil: admin olvasás" on public.profiles
  for select using (public.is_admin());

drop policy if exists "profil: admin frissítés" on public.profiles;
create policy "profil: admin frissítés" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- ══ 3. Szerepkör módosítása, az utolsó admin védelmével ════
drop function if exists public.admin_set_role(uuid, text);

create function public.admin_set_role(p_id uuid, p_role text)
returns text language plpgsql security definer set search_path = public as $$
declare v_old text; v_admins int;
begin
  if not public.is_admin() then
    return 'Nincs jogosultság.';
  end if;
  if p_role not in ('apn','szerkeszto','lektor','admin') then
    return 'Ismeretlen szerepkör.';
  end if;

  select role into v_old from public.profiles where id = p_id;
  if v_old is null then
    return 'A felhasználó nem található.';
  end if;
  if v_old = p_role then
    return 'ok';
  end if;

  -- Az utolsó adminisztrátor nem fokozható le: különben a rendszer kezelhetetlenné válna.
  if v_old = 'admin' and p_role <> 'admin' then
    select count(*) into v_admins from public.profiles where role = 'admin';
    if v_admins <= 1 then
      return 'Ez az utolsó adminisztrátor — előbb jelölj ki másikat.';
    end if;
  end if;

  update public.profiles set role = p_role, updated_at = now() where id = p_id;
  return 'ok';
end;
$$;

revoke all on function public.admin_set_role(uuid, text) from public, anon;
grant execute on function public.admin_set_role(uuid, text) to authenticated;

-- ══ 4. Audit bejegyzés admin műveletekhez ══════════════════
-- A jelszó értékét SOHA nem naplózzuk, csak a művelet tényét.
drop function if exists public.admin_log(text, text, uuid, text, jsonb);

create function public.admin_log(
  p_action text, p_entity text, p_entity_id uuid, p_entity_title text, p_details jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
declare v_actor uuid := auth.uid(); v_email text;
begin
  if not public.is_admin() then
    raise exception 'Nincs jogosultság.';
  end if;
  select email into v_email from auth.users where id = v_actor;
  insert into public.audit_log (actor_id, actor_email, action, entity, entity_id, entity_title, details)
  values (v_actor, v_email, p_action, p_entity, p_entity_id, p_entity_title, coalesce(p_details, '{}'::jsonb));
end;
$$;

revoke all on function public.admin_log(text, text, uuid, text, jsonb) from public, anon;
grant execute on function public.admin_log(text, text, uuid, text, jsonb) to authenticated;

-- ══ 5. Ellenőrzés ══════════════════════════════════════════
-- Sikeres futás esetén négy sort ad vissza: admin_log, admin_set_role,
-- admin_user_get, is_admin.
select p.proname as fuggveny, pg_get_function_identity_arguments(p.oid) as parameterek
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('is_admin','admin_user_get','admin_set_role','admin_log')
order by p.proname;
