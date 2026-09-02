-- APN-MED Education — hallgatói haladás, teendők és csoportok.
--
-- Előfeltétel: a 0045 (feladatok) és a 0048 (tananyagok) lefutott.
--
-- A haladást nem tároljuk, hanem lekérdezéskor számoljuk. A tárolt érték
-- elavulna: ha az oktató új feladatot nyit meg, minden korábbi haladás
-- érvénytelenné válik, és valakinek frissítenie kellene őket. A számított
-- érték mindig a pillanatnyi állapotot tükrözi.

/**
 * A hallgató kurzusai valós haladással.
 *
 * A haladás a beadott és a megnyitott feladatok aránya. Feladat nélküli
 * kurzusnál nincs értelmezhető haladás — ilyenkor null, és a felület nem
 * mutat félrevezető nulla százalékot.
 */
create or replace function public.edu_my_courses()
returns table (
  id uuid, institution_id uuid, institution_name text,
  title text, description text, specialty text, level text, icon text,
  starts_on date, ends_on date, status text,
  feladatok int, beadott int, teljesitett int, haladas int, atlag int
)
language sql stable security definer set search_path = public as $$
  with kurzusok as (
    select c.*, i.name as inst_name
    from public.education_courses c
    join public.education_enrollments e on e.course_id = c.id
    join public.education_institutions i on i.id = c.institution_id
    where e.user_id = auth.uid() and e.status <> 'dropped' and c.status <> 'draft'
  ),
  feladat as (
    select a.course_id, count(*)::int as db
    from public.education_assignments a
    where a.status <> 'draft'
    group by a.course_id
  ),
  sajat as (
    -- Feladatonként a legutolsó beadás: az ismételt beadás célja a javítás.
    select distinct on (s.assignment_id) a.course_id, s.pct, s.passed
    from public.education_submissions s
    join public.education_assignments a on a.id = s.assignment_id
    where s.user_id = auth.uid()
    order by s.assignment_id, s.attempt desc
  )
  select k.id, k.institution_id, k.inst_name,
         k.title, k.description, k.specialty, k.level, k.icon,
         k.starts_on, k.ends_on, k.status,
         coalesce(f.db, 0),
         coalesce(count(sa.course_id), 0)::int,
         coalesce(count(*) filter (where sa.passed), 0)::int,
         case when coalesce(f.db, 0) = 0 then null
              else round(count(sa.course_id) * 100.0 / f.db)::int end,
         coalesce(round(avg(sa.pct)), 0)::int
  from kurzusok k
  left join feladat f on f.course_id = k.id
  left join sajat sa on sa.course_id = k.id
  group by k.id, k.institution_id, k.inst_name, k.title, k.description,
           k.specialty, k.level, k.icon, k.starts_on, k.ends_on, k.status, f.db
  order by k.title
$$;

revoke all on function public.edu_my_courses() from public, anon;
grant execute on function public.edu_my_courses() to authenticated;

/**
 * A hallgató teendői — mi van hátra, és mi sürgős.
 *
 * Csak a be nem adott, megnyitott feladatokat adja vissza. A már beadott
 * feladat akkor sem jelenik meg, ha újra beadható: a teendőlista arról szól,
 * mi hiányzik, nem arról, mit lehetne javítani.
 */
create or replace function public.edu_my_todo()
returns table (
  assignment_id uuid, course_id uuid, course_title text,
  title text, due_at timestamptz, lejart boolean
)
language sql stable security definer set search_path = public as $$
  select a.id, c.id, c.title, a.title, a.due_at,
         (a.due_at is not null and a.due_at < now())
  from public.education_assignments a
  join public.education_courses c on c.id = a.course_id
  join public.education_enrollments e on e.course_id = c.id and e.user_id = auth.uid()
  where a.status = 'open'
    and e.status <> 'dropped'
    and not exists (
      select 1 from public.education_submissions s
      where s.assignment_id = a.id and s.user_id = auth.uid()
    )
  order by a.due_at nulls last, a.created_at
$$;

revoke all on function public.edu_my_todo() from public, anon;
grant execute on function public.edu_my_todo() to authenticated;

-- ══ Csoportok kezelése ═══════════════════════════════════
-- A tábla a 0036-ban létrejött, de nem volt hozzá felület. A csoport a
-- nagyobb évfolyamoknál kell: a feladat egy csoportnak is kiadható.

/** Egy kurzus csoportjai a létszámmal. */
create or replace function public.edu_course_groups(p_course uuid)
returns table (id uuid, name text, letszam int)
language sql stable security definer set search_path = public as $$
  select g.id, g.name, count(e.id)::int
  from public.education_groups g
  left join public.education_enrollments e
    on e.group_id = g.id and e.status <> 'dropped'
  where g.course_id = p_course and public.edu_can_view(p_course)
  group by g.id, g.name
  order by g.name
$$;

revoke all on function public.edu_course_groups(uuid) from public, anon;
grant execute on function public.edu_course_groups(uuid) to authenticated;

-- A haladás mező már nem használatos: a számított érték lépett a helyébe.
comment on column public.education_enrollments.progress_pct is
  'Nem használt. A haladást az edu_my_courses() számolja a beadásokból, '
  'mert a tárolt érték elavulna új feladat megnyitásakor.';

-- Ellenőrzés: három függvény.
select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and proname in ('edu_my_courses', 'edu_my_todo', 'edu_course_groups')
order by proname;
