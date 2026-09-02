-- APN-MED — Adminisztrátori értesítések.
--
-- Az adminisztrátornak látnia kell, ha új felhasználó regisztrált, vagy ha a
-- platformon olyasmi történt, ami odafigyelést kíván: szerepkör-változás,
-- tartalom közzététele, karbantartási mód kapcsolása.
--
-- Az adatok a meglévő profiles és audit_log táblákból származnak, új tárolás
-- nélkül. A „mikor néztem meg utoljára" időpont a profil updates_seen_at
-- mezőjéből jön, ugyanabból, amit a többi értesítés is használ.

/**
 * Adminisztrátori összesítés a legutóbbi megtekintés óta.
 *
 * Csak adminisztrátor hívhatja; másnak üres eredményt ad. Így a felhasználók
 * száma és a naplóesemények nem szivárognak ki jogosultság nélkül.
 */
create or replace function public.admin_notification_counts()
returns table (
  uj_regisztracio int,
  uj_szerepkor int,
  uj_tartalom int,
  karbantartas_valtas int,
  seen_at timestamptz
)
language sql stable security definer set search_path = public as $$
  with me as (
    select coalesce(p.updates_seen_at, p.created_at) as since, p.role
    from public.profiles p where p.id = auth.uid()
  )
  select
    (select count(*)::int from public.profiles p
      where p.created_at > (select since from me) and p.id <> auth.uid()),
    (select count(*)::int from public.audit_log a
      where a.created_at > (select since from me)
        and a.entity = 'profiles' and a.action in ('update', 'role_change')),
    (select count(*)::int from public.audit_log a
      where a.created_at > (select since from me)
        and a.entity in ('diseases', 'guidelines', 'lab_parameters')
        and a.action in ('insert', 'update')),
    (select count(*)::int from public.audit_log a
      where a.created_at > (select since from me)
        and a.entity = 'feature_flags'),
    (select since from me)
  where (select role from me) = 'admin'
$$;

revoke all on function public.admin_notification_counts() from public, anon;
grant execute on function public.admin_notification_counts() to authenticated;

/**
 * A legutóbb regisztrált felhasználók — az értesítés részleteihez.
 *
 * Nevet és regisztrációs időpontot ad vissza, e-mail címet nem: a listához
 * nincs szükség rá, és így nem is kerül olyan helyre, ahová nem kell.
 */
create or replace function public.admin_recent_signups(p_limit int default 10)
returns table (id uuid, full_name text, specialty text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.full_name, p.specialty, p.created_at
  from public.profiles p
  where exists (
    select 1 from public.profiles me
    where me.id = auth.uid() and me.role = 'admin'
  )
  and p.id <> auth.uid()
  order by p.created_at desc
  limit least(greatest(p_limit, 1), 50)
$$;

revoke all on function public.admin_recent_signups(int) from public, anon;
grant execute on function public.admin_recent_signups(int) to authenticated;

/** A legutóbbi naplóesemények — az értesítés részleteihez. */
create or replace function public.admin_recent_events(p_limit int default 15)
returns table (
  id uuid, action text, entity text, entity_title text,
  actor_email text, created_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select a.id, a.action, a.entity, a.entity_title, a.actor_email, a.created_at
  from public.audit_log a
  where exists (
    select 1 from public.profiles me
    where me.id = auth.uid() and me.role = 'admin'
  )
  order by a.created_at desc
  limit least(greatest(p_limit, 1), 50)
$$;

revoke all on function public.admin_recent_events(int) from public, anon;
grant execute on function public.admin_recent_events(int) to authenticated;

-- A regisztrációk időrendi lekérdezéséhez.
create index if not exists idx_profiles_created on public.profiles(created_at desc);

-- Ellenőrzés: a három függvény létrejött.
select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and proname like 'admin\_%'
order by proname;
