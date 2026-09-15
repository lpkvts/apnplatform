-- APN-MED — Közreműködő jelölése a regisztrált felhasználók közül.
--
-- A lektorok és a szakértők többsége használja is a platformot, ezért a
-- nevük kézi begépelése fölösleges munka és hibaforrás. Ez a migráció
-- összeköti a két nyilvántartást.
--
-- Fontos szempont, ami a szerkezetet meghatározta: a kapcsolat laza marad.
-- A közreműködő neve a felvételkor átmásolódik, de utána önálló — mert a
-- megjelenített név nem feltétlenül azonos a profilban szereplővel. Van, aki
-- titulussal szeretne megjelenni, van, aki a leánykori nevén, és van, aki a
-- profilját később átírja anélkül, hogy a köszönetnyilvánítás változna.
--
-- A regisztráció nem jelent hozzájárulást a nyilvános megjelenéshez. Ezt a
-- felületnek külön kell kérnie, és a szerkesztői felület emlékeztet rá.

alter table public.contributors
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_contributor_user
  on public.contributors(user_id);

-- Egy felhasználó csak egyszer szerepelhet a listán.
create unique index if not exists idx_contributor_user_egyedi
  on public.contributors(user_id) where user_id is not null;

-- ══ Választható felhasználók a jelöléshez ════════════════
/**
 * A közreműködőnek jelölhető felhasználók.
 *
 * Csak a szükséges adatot adja vissza — nevet, e-mailt, munkahelyet —, és
 * kihagyja azokat, akik már szerepelnek a listán. Szerkesztői és
 * adminisztrátori jogosultságot igényel.
 *
 * Azért külön függvény, és nem az admin_user_list, mert az kizárólag
 * adminisztrátoroknak elérhető — a közreműködőket viszont a szerkesztő is
 * kezeli.
 */
create or replace function public.contributor_candidates(p_kereses text default null)
returns table (
  user_id uuid,
  full_name text,
  email text,
  title text,
  workplace text,
  specialty text
)
language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public.has_role(array['admin', 'szerkeszto']) then
    raise exception 'Nincs jogosultság a felhasználók listázásához.';
  end if;

  return query
  select p.id, p.full_name, u.email::text, p.title, p.workplace, p.specialty
  from public.profiles p
  join auth.users u on u.id = p.id
  where not exists (
    select 1 from public.contributors c where c.user_id = p.id
  )
  and (
    p_kereses is null
    or p_kereses = ''
    or p.full_name ilike '%' || p_kereses || '%'
    or u.email ilike '%' || p_kereses || '%'
  )
  order by p.full_name nulls last, u.email
  limit 50;
end;
$$;

revoke all on function public.contributor_candidates(text) from public, anon;
grant execute on function public.contributor_candidates(text) to authenticated;

-- ══ Ellenőrzés ═══════════════════════════════════════════
select
  column_name as oszlop,
  data_type as tipus
from information_schema.columns
where table_schema = 'public' and table_name = 'contributors'
  and column_name = 'user_id'
union all
select 'fuggveny: contributor_candidates', routine_type
from information_schema.routines
where routine_schema = 'public' and routine_name = 'contributor_candidates';
