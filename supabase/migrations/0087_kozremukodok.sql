-- APN-MED — Közreműködők és köszönetnyilvánítás.
--
-- A platform szakmai tartalma nem egyetlen ember munkája: lektorok, orvosok,
-- ápolók és fejlesztők nélkül nem állna össze. Ez a modul azt a helyet adja
-- meg, ahol ez látszik is.
--
-- Az adatszerkezet két dolgot enged meg, amire szükség lesz:
--
--   · egy személy több szerepben is szerepelhet — aki lektorált és fejlesztett
--     is, ne kelljen kétszer felvenni, hanem több szerepcímkét kapjon;
--
--   · a közreműködés köthető szakterülethez, mert a „ki lektorálta ezt?"
--     kérdés a kórkép mellett merül fel, nem a listában.
--
-- A nevek személyes adatok. A felvétel a közreműködő hozzájárulásával
-- történik — ezt a felvevő felelőssége biztosítani, és a CMS felülete
-- emlékeztet rá.

create table if not exists public.contributors (
  id uuid primary key default gen_random_uuid(),

  /** A megjelenő név, ahogy a közreműködő szeretné. */
  name text not null,
  /** Titulus vagy megszólítás: dr., prof., APN, szakápoló. */
  title text,
  /** Intézmény vagy munkahely, ha a közreműködő vállalja. */
  organization text,

  /**
   * Szerepek. Egy személy több szerepben is közreműködhet, ezért tömb.
   *
   * Használt értékek: 'lektor', 'szakerto', 'szerzo', 'fejleszto',
   * 'tanacsado', 'tesztelo'.
   */
  roles text[] not null default '{}',

  /** Szakterületek, amelyekhez a közreműködés kötődik. */
  specialties text[] not null default '{}',

  /** Rövid, egy mondatos leírás arról, miben segített. */
  note text,

  /**
   * Megjelenési sorrend a listán belül.
   *
   * Az azonos sorszámúak névsorban követik egymást — így nem kell minden
   * új felvételnél átszámozni.
   */
  ord int not null default 100,

  /** Kiemelt közreműködő: a lista elején, külön szakaszban jelenik meg. */
  featured boolean not null default false,

  publish_status text not null default 'draft'
    check (publish_status in ('draft', 'published')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contributor_pub
  on public.contributors(publish_status, ord, name);

-- ══ Jogosultságok ════════════════════════════════════════
alter table public.contributors enable row level security;

-- A közzétett lista mindenkinek látható, a bejelentkezés nélküli
-- látogatóknak is: a köszönetnyilvánítás nyilvános.
drop policy if exists "kozremukodo: olvasas" on public.contributors;
create policy "kozremukodo: olvasas" on public.contributors for select
  using (publish_status = 'published' or public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "kozremukodo: kezeles" on public.contributors;
create policy "kozremukodo: kezeles" on public.contributors for all
  using (public.has_role(array['admin', 'szerkeszto']))
  with check (public.has_role(array['admin', 'szerkeszto']));

-- ══ Szerepcímkék ═════════════════════════════════════════
-- A megnevezéseket a kód oldalán tartjuk, hogy a fordítás és a sorrend
-- egy helyen legyen. Itt csak a használt értékeket rögzítjük megjegyzésben:
--
--   lektor     — szakmai lektorálás, tartalom ellenőrzése
--   szakerto   — orvos vagy más szakértő, aki konzultációval segített
--   szerzo     — tartalom írása
--   fejleszto  — a platform fejlesztése
--   tanacsado  — szakmai irány, koncepció
--   tesztelo   — a béta időszak visszajelzései

-- ══ Kapcsoló ═════════════════════════════════════════════
insert into public.feature_flags (key, enabled, label) values
  ('kozremukodok', false, 'Közreműködők oldal')
on conflict (key) do nothing;

-- Ellenőrzés.
select 'tabla' as tipus, table_name as nev
from information_schema.tables
where table_schema = 'public' and table_name = 'contributors'
union all
select 'kapcsolo', key from public.feature_flags where key = 'kozremukodok';
