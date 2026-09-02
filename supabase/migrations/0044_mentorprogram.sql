-- APN-MED — Mentorprogram.
--
-- Egy tábla, egyértelmű állapotokkal: a beküldött mentorprofil függőben áll,
-- amíg adminisztrátor jóvá nem hagyja. Csak a jóváhagyott profilok kereshetők.
--
-- A modul kapcsolóval kikapcsolható. Kikapcsolás nem töröl semmit: a profilok
-- a helyükön maradnak, és újbóli bekapcsoláskor minden elérhető.

create table if not exists public.mentor_profiles (
  id uuid primary key default gen_random_uuid(),
  -- Egy felhasználóhoz egy mentorprofil tartozik.
  user_id uuid not null unique references public.profiles(id) on delete cascade,

  title text,                       -- szakmai megnevezés, pl. „Kiterjesztett hatáskörű ápoló”
  workplace text,                   -- munkahely vagy ellátási terület, önkéntes
  specialty text not null,          -- szakterület
  experience_years int check (experience_years between 0 and 60),
  bio text,                         -- rövid bemutatkozás

  topics text[] not null default '{}',     -- mentorálási témák
  interests text[] not null default '{}',  -- érdeklődési területek
  formats text[] not null default '{}',    -- vállalt mentorálási formák

  contact_note text,                -- hogyan keressék, saját szavaival

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'inactive')),
  review_note text,                 -- adminisztrátori megjegyzés az elbíráláshoz
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_mentor_status on public.mentor_profiles(status, updated_at desc);
create index if not exists idx_mentor_spec on public.mentor_profiles(specialty)
  where status = 'approved';

-- ── Jogosultságok ────────────────────────────────────────
alter table public.mentor_profiles enable row level security;

-- Mindenki látja a jóváhagyott profilokat, a sajátját mindig, az
-- adminisztrátor pedig az összeset — elbíráláshoz erre szükség van.
drop policy if exists "mentor: lathato" on public.mentor_profiles;
create policy "mentor: lathato" on public.mentor_profiles for select
  using (
    status = 'approved'
    or user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- A saját profil beküldése és szerkesztése. Az állapotot a felhasználó nem
-- állíthatja: a beküldött profil függőben marad, amíg el nem bírálják.
drop policy if exists "mentor: sajat beküldés" on public.mentor_profiles;
create policy "mentor: sajat beküldés" on public.mentor_profiles for insert
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "mentor: sajat szerkesztés" on public.mentor_profiles;
create policy "mentor: sajat szerkesztés" on public.mentor_profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "mentor: admin kezel" on public.mentor_profiles;
create policy "mentor: admin kezel" on public.mentor_profiles for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

/**
 * Az állapotot csak adminisztrátor módosíthatja.
 *
 * A soralapú szabály önmagában nem elég: a tulajdonos a saját sorát
 * frissítheti, és így az állapotot is átírhatná jóváhagyottra. Ezt a trigger
 * akadályozza meg. Szerkesztéskor a profil visszakerül elbírálásra, mert a
 * jóváhagyás a konkrét tartalomra szólt.
 */
create or replace function public.mentor_status_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_admin boolean;
begin
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
    into v_admin;

  if not v_admin then
    if new.status is distinct from old.status then
      new.status := old.status;          -- állapotváltoztatási kísérlet elvetve
    end if;
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
    new.review_note := old.review_note;

    -- Tartalmi módosítás után újra elbírálandó.
    if old.status = 'approved' and (
      new.bio is distinct from old.bio
      or new.topics is distinct from old.topics
      or new.specialty is distinct from old.specialty
      or new.title is distinct from old.title
    ) then
      new.status := 'pending';
    end if;
  end if;

  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_mentor_status on public.mentor_profiles;
create trigger trg_mentor_status before update on public.mentor_profiles
  for each row execute function public.mentor_status_guard();

-- ── Kereséshez: mentorok névvel együtt ───────────────────
/**
 * Jóváhagyott mentorok listája.
 *
 * A név a profiles táblából jön; e-mail címet nem adunk vissza, mert a
 * kapcsolatfelvétel a platformon belül, a mentor által megadott módon történik.
 */
create or replace function public.mentor_list()
returns table (
  id uuid, user_id uuid, full_name text, title text, workplace text,
  specialty text, experience_years int, bio text,
  topics text[], interests text[], formats text[], contact_note text
)
language sql stable security definer set search_path = public as $$
  select m.id, m.user_id, p.full_name, m.title, m.workplace,
         m.specialty, m.experience_years, m.bio,
         m.topics, m.interests, m.formats, m.contact_note
  from public.mentor_profiles m
  join public.profiles p on p.id = m.user_id
  where m.status = 'approved'
    and auth.uid() is not null
  order by m.updated_at desc
$$;

revoke all on function public.mentor_list() from public, anon;
grant execute on function public.mentor_list() to authenticated;

/** Elbírálásra váró és összes profil — adminisztrátornak. */
create or replace function public.mentor_admin_list()
returns table (
  id uuid, user_id uuid, full_name text, title text, specialty text,
  experience_years int, bio text, topics text[], formats text[],
  contact_note text, status text, review_note text,
  created_at timestamptz, updated_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select m.id, m.user_id, p.full_name, m.title, m.specialty,
         m.experience_years, m.bio, m.topics, m.formats,
         m.contact_note, m.status, m.review_note, m.created_at, m.updated_at
  from public.mentor_profiles m
  join public.profiles p on p.id = m.user_id
  where exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  order by
    case m.status when 'pending' then 0 when 'approved' then 1 else 2 end,
    m.updated_at desc
$$;

revoke all on function public.mentor_admin_list() from public, anon;
grant execute on function public.mentor_admin_list() to authenticated;

-- ── Modulkapcsoló ────────────────────────────────────────
insert into public.feature_flags (key, enabled, label) values
  ('mentorprogram', false, 'Mentorprogram')
on conflict (key) do nothing;

-- Ellenőrzés: a tábla, a két függvény és a kapcsoló.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema = 'public' and table_name = 'mentor_profiles'
union all
select 'fuggveny', proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and proname like 'mentor\_%'
union all
select 'kapcsolo', key from public.feature_flags where key = 'mentorprogram'
order by 1, 2;
