-- APN Hungary Platform — Admin felhasználókezelés.
--
-- Amit ez a migráció ad:
--   1. admin_user_get(uuid) — egy felhasználó teljes adatlapja (profil + auth adatok)
--   2. profiles: admin szerkesztheti bármely profilt (RLS policy)
--   3. admin_set_role(uuid, text) — szerepkör módosítása, az utolsó admin védelmével
--   4. admin_log(...) — audit bejegyzés írása admin műveletekhez
--
-- A jelszó és az e-mail módosítása NEM itt történik: azt a Supabase Auth Admin API
-- végzi szerver oldalon, service role kulccsal (lib/supabase/admin.ts).

-- ── 1. Egy felhasználó adatlapja ─────────────────────────
create or replace function public.admin_user_get(p_id uuid)
returns table (
  id uuid, email text, email_confirmed_at timestamptz, last_sign_in_at timestamptz,
  full_name text, role text, apn_type text, title text, workplace text,
  specialty text, qualification text, qual_year int, registration_no text, phone text,
  created_at timestamptz, updates_seen_at timestamptz, updates_seen_version text
)
language sql stable security definer set search_path = public as $$
  select p.id, u.email, u.email_confirmed_at, u.last_sign_in_at,
         p.full_name, p.role, p.apn_type, p.title, p.workplace,
         p.specialty, p.qualification, p.qual_year, p.registration_no, p.phone,
         p.created_at, p.updates_seen_at, p.updates_seen_version
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.id = p_id and public.is_admin()
$$;

revoke all on function public.admin_user_get(uuid) from public, anon;
grant execute on function public.admin_user_get(uuid) to authenticated;

-- ── 2. Admin szerkesztheti bármely profilt ───────────────
-- Az is_admin() security definer, ezért nincs RLS-rekurzió.
drop policy if exists "profil: admin olvasás" on public.profiles;
create policy "profil: admin olvasás" on public.profiles
  for select using (public.is_admin());

drop policy if exists "profil: admin frissítés" on public.profiles;
create policy "profil: admin frissítés" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- ── 3. Szerepkör módosítása, utolsó admin védelmével ─────
create or replace function public.admin_set_role(p_id uuid, p_role text)
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

-- ── 4. Audit bejegyzés admin műveletekhez ────────────────
-- A jelszó értékét SOHA nem naplózzuk, csak a művelet tényét.
create or replace function public.admin_log(
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
