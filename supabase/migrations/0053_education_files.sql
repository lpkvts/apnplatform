-- APN-MED Education — kurzushoz csatolt fájlok.
--
-- Előfeltétel: a 0036 (oktatási alapréteg) lefutott.
--
-- A fájlok a Supabase tárolójában kapnak helyet, a nyilvántartás pedig ebben
-- a táblában. Így a jogosultság ugyanaz, mint a többi kurzustartalomnál: a
-- hallgató a közzétett fájlokat látja, az oktató mindet.

create table if not exists public.education_files (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.education_courses(id) on delete cascade,
  /** A tárolóban lévő útvonal — ebből áll elő a letöltési hivatkozás. */
  path text not null unique,
  name text not null,
  /** Fájltípus, ahogy a böngésző küldte. */
  mime text,
  size_bytes bigint,
  description text,
  visible boolean not null default true,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_edu_file_course
  on public.education_files(course_id, created_at desc);

alter table public.education_files enable row level security;

drop policy if exists "edu fajl: lathato" on public.education_files;
create policy "edu fajl: lathato" on public.education_files for select
  using (
    public.edu_can_manage(course_id)
    or (visible and public.edu_can_view(course_id))
  );

drop policy if exists "edu fajl: oktato kezel" on public.education_files;
create policy "edu fajl: oktato kezel" on public.education_files for all
  using (public.edu_can_manage(course_id))
  with check (public.edu_can_manage(course_id));

-- ══ Tároló ═══════════════════════════════════════════════
-- A kurzusfájlok saját, nem nyilvános tárolóba kerülnek. A letöltés
-- rövid élettartamú, aláírt hivatkozással történik, amit a szerver ad ki
-- a jogosultság ellenőrzése után.
insert into storage.buckets (id, name, public)
values ('kurzus-fajlok', 'kurzus-fajlok', false)
on conflict (id) do nothing;

/**
 * A tároló elérése.
 *
 * Az útvonal első szakasza a kurzus azonosítója, így abból derül ki, melyik
 * kurzushoz tartozik a fájl — ez alapján érvényesíthető ugyanaz a jogosultság,
 * mint a nyilvántartásban.
 */
drop policy if exists "kurzus fajl: olvasas" on storage.objects;
create policy "kurzus fajl: olvasas" on storage.objects for select
  using (
    bucket_id = 'kurzus-fajlok'
    and public.edu_can_view((storage.foldername(name))[1]::uuid)
  );

drop policy if exists "kurzus fajl: feltoltes" on storage.objects;
create policy "kurzus fajl: feltoltes" on storage.objects for insert
  with check (
    bucket_id = 'kurzus-fajlok'
    and public.edu_can_manage((storage.foldername(name))[1]::uuid)
  );

drop policy if exists "kurzus fajl: torles" on storage.objects;
create policy "kurzus fajl: torles" on storage.objects for delete
  using (
    bucket_id = 'kurzus-fajlok'
    and public.edu_can_manage((storage.foldername(name))[1]::uuid)
  );

-- Ellenőrzés: a tábla és a tároló létrejött.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema = 'public' and table_name = 'education_files'
union all
select 'tarolo', id from storage.buckets where id = 'kurzus-fajlok';
