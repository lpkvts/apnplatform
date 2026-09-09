-- APN-MED — Oktatási tagságkezelés: e-mail alapú keresés és taglista.
--
-- A felhasználók e-mail-címe az auth.users táblában van, amit a kliens
-- közvetlenül nem érhet el. A profiles tábla nem tartalmazza — szándékosan,
-- mert az e-mail a hitelesítés adata, nem a profilé.
--
-- A tagságkezeléshez viszont kell: a felvétel e-mail alapján történik, és a
-- listán is ez azonosítja a személyt, ha nincs megadva teljes név. Ezért két
-- biztonsági definíciós függvény, amely csak intézményi adminisztrátornak ad
-- adatot — a jogosultságot maga a függvény ellenőrzi.

-- ══ 1. Felhasználó keresése e-mail alapján ═══════════════
-- Csak az azonosítót adja vissza, egyéb adatot nem: a hívónak elég ennyi a
-- tagság létrehozásához, és így nem lesz belőle e-mail-cím ellenőrzésére
-- alkalmas eszköz.
create or replace function public.edu_find_user(p_institution uuid, p_email text)
returns table (user_id uuid, full_name text)
language plpgsql stable security definer set search_path = public, auth as $$
begin
  -- A hívó legyen az adott intézmény adminisztrátora.
  if public.edu_role(p_institution) is distinct from 'admin' then
    raise exception 'Nincs jogosultság az intézmény tagjainak kezeléséhez.';
  end if;

  return query
  select p.id, p.full_name
  from auth.users u
  join public.profiles p on p.id = u.id
  where lower(u.email) = lower(trim(p_email))
  limit 1;
end;
$$;

revoke all on function public.edu_find_user(uuid, text) from public, anon;
grant execute on function public.edu_find_user(uuid, text) to authenticated;

-- ══ 2. Az intézmény tagjai, e-maillel ════════════════════
create or replace function public.edu_members(p_institution uuid)
returns table (
  id uuid, user_id uuid, role text, joined_at timestamptz,
  full_name text, email text
)
language plpgsql stable security definer set search_path = public, auth as $$
begin
  -- Oktató is láthatja a névsort, de módosítani csak az admin tud — azt a
  -- táblán lévő szabály érvényesíti.
  if public.edu_role(p_institution) not in ('instructor', 'admin') then
    raise exception 'Nincs jogosultság az intézmény tagjainak megtekintéséhez.';
  end if;

  return query
  select m.id, m.user_id, m.role, m.joined_at, p.full_name, u.email::text
  from public.education_members m
  join public.profiles p on p.id = m.user_id
  join auth.users u on u.id = m.user_id
  where m.institution_id = p_institution
  order by p.full_name nulls last, u.email;
end;
$$;

revoke all on function public.edu_members(uuid) from public, anon;
grant execute on function public.edu_members(uuid) to authenticated;

-- Ellenőrzés: mindkét függvény létrejött.
select routine_name
from information_schema.routines
where routine_schema = 'public' and routine_name in ('edu_find_user', 'edu_members')
order by routine_name;
