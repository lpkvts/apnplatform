-- APN-MED Education — oktatási alapréteg.
--
-- Az oktatási szerepkör NEM a profiles.role mezőbe kerül. Az a platform
-- tartalomkezelési szerepköre (APN, szerkesztő, lektor, admin), és attól
-- független, hogy valaki egy adott intézményben oktató vagy hallgató —
-- ugyanaz a személy lehet az egyik helyen oktató, a másikon hallgató, és
-- közben APN-ként használja a klinikai modulokat.
--
-- Ezért az oktatási szerepkör intézményhez kötött (education_members).

-- ══ Intézmények ══════════════════════════════════════════
create table if not exists public.education_institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ══ Tagság és szerepkör ══════════════════════════════════
create table if not exists public.education_members (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.education_institutions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('student', 'instructor', 'admin')),
  joined_at timestamptz not null default now(),
  unique (institution_id, user_id)
);
create index if not exists idx_edu_member_user on public.education_members(user_id);
create index if not exists idx_edu_member_inst on public.education_members(institution_id, role);

-- ══ Kurzusok ═════════════════════════════════════════════
create table if not exists public.education_courses (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.education_institutions(id) on delete cascade,
  title text not null,
  description text,
  specialty text,                    -- szakterület
  level text,                        -- pl. „APN MSc”, „szakápoló”
  icon text,                         -- egyetlen jelkép a kártyához
  starts_on date,
  ends_on date,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_edu_course_inst on public.education_courses(institution_id, status);

-- A kurzus célkompetenciái. A meglévő competencies táblára épül, hogy az
-- oktatási és az egyéni kompetencia-követés ugyanazt a keretet használja.
create table if not exists public.education_course_competencies (
  course_id uuid not null references public.education_courses(id) on delete cascade,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  weight int not null default 1 check (weight between 1 and 5),
  primary key (course_id, competency_id)
);

-- ══ Csoportok és beiratkozás ═════════════════════════════
create table if not exists public.education_groups (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.education_courses(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.education_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.education_courses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid references public.education_groups(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'completed', 'dropped')),
  progress_pct int not null default 0 check (progress_pct between 0 and 100),
  enrolled_at timestamptz not null default now(),
  unique (course_id, user_id)
);
create index if not exists idx_edu_enroll_user on public.education_enrollments(user_id, status);
create index if not exists idx_edu_enroll_course on public.education_enrollments(course_id);

-- ══ Segédfüggvények a jogosultsághoz ═════════════════════
-- Security definer, hogy ne okozzanak RLS-rekurziót.

/** Az adott intézményben betöltött oktatási szerepkör. */
create or replace function public.edu_role(p_institution uuid)
returns text language sql stable security definer set search_path = public as $$
  select role from public.education_members
  where institution_id = p_institution and user_id = auth.uid()
$$;

/** Oktató vagy intézményi adminisztrátor-e a kurzusban. */
create or replace function public.edu_can_manage(p_course uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.education_courses c
    join public.education_members m on m.institution_id = c.institution_id
    where c.id = p_course and m.user_id = auth.uid() and m.role in ('instructor', 'admin')
  )
$$;

/** Látja-e a kurzust: oktató, intézményi admin vagy beiratkozott hallgató. */
create or replace function public.edu_can_view(p_course uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.edu_can_manage(p_course) or exists (
    select 1 from public.education_enrollments e
    where e.course_id = p_course and e.user_id = auth.uid() and e.status <> 'dropped'
  )
$$;

revoke all on function public.edu_role(uuid) from public, anon;
revoke all on function public.edu_can_manage(uuid) from public, anon;
revoke all on function public.edu_can_view(uuid) from public, anon;
grant execute on function public.edu_role(uuid) to authenticated;
grant execute on function public.edu_can_manage(uuid) to authenticated;
grant execute on function public.edu_can_view(uuid) to authenticated;

-- ══ Jogosultsági szabályok ═══════════════════════════════
alter table public.education_institutions enable row level security;
drop policy if exists "edu inst: tagok latjak" on public.education_institutions;
create policy "edu inst: tagok latjak" on public.education_institutions for select
  using (exists (select 1 from public.education_members m
                 where m.institution_id = id and m.user_id = auth.uid()));
drop policy if exists "edu inst: admin kezel" on public.education_institutions;
create policy "edu inst: admin kezel" on public.education_institutions for all
  using (public.edu_role(id) = 'admin') with check (public.edu_role(id) = 'admin');

alter table public.education_members enable row level security;
drop policy if exists "edu tag: sajat es intezmenyi" on public.education_members;
create policy "edu tag: sajat es intezmenyi" on public.education_members for select
  using (user_id = auth.uid() or public.edu_role(institution_id) in ('instructor', 'admin'));
drop policy if exists "edu tag: admin kezel" on public.education_members;
create policy "edu tag: admin kezel" on public.education_members for all
  using (public.edu_role(institution_id) = 'admin')
  with check (public.edu_role(institution_id) = 'admin');

alter table public.education_courses enable row level security;
drop policy if exists "edu kurzus: lathato" on public.education_courses;
create policy "edu kurzus: lathato" on public.education_courses for select
  using (public.edu_can_view(id) or public.edu_role(institution_id) in ('instructor', 'admin'));
drop policy if exists "edu kurzus: oktato kezel" on public.education_courses;
create policy "edu kurzus: oktato kezel" on public.education_courses for all
  using (public.edu_role(institution_id) in ('instructor', 'admin'))
  with check (public.edu_role(institution_id) in ('instructor', 'admin'));

alter table public.education_course_competencies enable row level security;
drop policy if exists "edu kurzuskomp: lathato" on public.education_course_competencies;
create policy "edu kurzuskomp: lathato" on public.education_course_competencies for select
  using (public.edu_can_view(course_id));
drop policy if exists "edu kurzuskomp: oktato kezel" on public.education_course_competencies;
create policy "edu kurzuskomp: oktato kezel" on public.education_course_competencies for all
  using (public.edu_can_manage(course_id)) with check (public.edu_can_manage(course_id));

alter table public.education_groups enable row level security;
drop policy if exists "edu csoport: lathato" on public.education_groups;
create policy "edu csoport: lathato" on public.education_groups for select
  using (public.edu_can_view(course_id));
drop policy if exists "edu csoport: oktato kezel" on public.education_groups;
create policy "edu csoport: oktato kezel" on public.education_groups for all
  using (public.edu_can_manage(course_id)) with check (public.edu_can_manage(course_id));

alter table public.education_enrollments enable row level security;
drop policy if exists "edu beiratkozas: sajat vagy oktato" on public.education_enrollments;
create policy "edu beiratkozas: sajat vagy oktato" on public.education_enrollments for select
  using (user_id = auth.uid() or public.edu_can_manage(course_id));
drop policy if exists "edu beiratkozas: oktato kezel" on public.education_enrollments;
create policy "edu beiratkozas: oktato kezel" on public.education_enrollments for all
  using (public.edu_can_manage(course_id)) with check (public.edu_can_manage(course_id));

-- ══ Áttekintő lekérdezés az oktatói kezdőlaphoz ══════════
create or replace function public.edu_instructor_summary(p_institution uuid)
returns table (
  students int, courses_active int, enrollments int, avg_progress int
)
language sql stable security definer set search_path = public as $$
  select
    (select count(*)::int from public.education_members m
      where m.institution_id = p_institution and m.role = 'student'),
    (select count(*)::int from public.education_courses c
      where c.institution_id = p_institution and c.status = 'active'),
    (select count(*)::int from public.education_enrollments e
      join public.education_courses c on c.id = e.course_id
      where c.institution_id = p_institution and e.status = 'active'),
    (select coalesce(round(avg(e.progress_pct)), 0)::int from public.education_enrollments e
      join public.education_courses c on c.id = e.course_id
      where c.institution_id = p_institution and e.status = 'active')
  where exists (select 1 from public.education_members m
                where m.institution_id = p_institution and m.user_id = auth.uid()
                  and m.role in ('instructor', 'admin'))
$$;

revoke all on function public.edu_instructor_summary(uuid) from public, anon;
grant execute on function public.edu_instructor_summary(uuid) to authenticated;

-- ══ Hallgató keresése e-mail alapján ═════════════════════
-- Csak oktató vagy intézményi adminisztrátor hívhatja, és csak az azonosítót
-- adja vissza — így a beiratkozás nem igényel hozzáférést az auth táblához,
-- és nem lehet vele felhasználói címeket felderíteni.
create or replace function public.edu_find_user_by_email(p_email text)
returns table (id uuid)
language sql stable security definer set search_path = public as $$
  select u.id from auth.users u
  where lower(u.email) = lower(p_email)
    and exists (select 1 from public.education_members m
                where m.user_id = auth.uid() and m.role in ('instructor', 'admin'))
$$;

revoke all on function public.edu_find_user_by_email(text) from public, anon;
grant execute on function public.edu_find_user_by_email(text) to authenticated;

-- ══ Funkciókapcsoló ══════════════════════════════════════
insert into public.feature_flags (key, enabled, label) values
  ('education', false, 'Oktatói mód (Education)')
on conflict (key) do nothing;

-- Ellenőrzés: hat tábla és négy függvény.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema = 'public' and table_name like 'education_%'
union all
select 'fuggveny', proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and proname like 'edu\_%'
order by 1, 2;
