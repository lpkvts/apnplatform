-- APN-MED Education — csoportanalitika.
--
-- Előfeltétel: a 0045 (feladatok) lefutott.
--
-- Három nézőpont ugyanarra az adatra:
--   kompetenciánként · mely szakmai területen áll gyengén a csoport
--   kérdésenként     · hol akadnak el a legtöbben
--   hallgatónként    · ki van lemaradva
--
-- Mindegyik a legutolsó beadást veszi hallgatónként. Az ismételt beadás célja
-- a javítás, ezért az utolsó tükrözi a jelenlegi tudást; ha az összes beadást
-- átlagolnánk, a fejlődés elrejtőzne a korai hibák mögött.

/**
 * Kompetenciánkénti eredmény egy kurzuson.
 *
 * Csak azok a kérdések számítanak, amelyekhez az oktató kompetenciát rendelt.
 * A besorolatlan kérdések a százalékos eredménybe beleszámítanak, a szakmai
 * bontásba nem — erre a felület külön figyelmeztet.
 */
create or replace function public.edu_course_competencies(p_course uuid)
returns table (
  competency_id uuid, code text, name text, domain text,
  valaszok int, helyes int, pct int, hallgatok int
)
language sql stable security definer set search_path = public as $$
  with utolso as (
    -- Hallgatónként és feladatonként a legutolsó beadás.
    select distinct on (s.user_id, s.assignment_id) s.id, s.user_id
    from public.education_submissions s
    join public.education_assignments a on a.id = s.assignment_id
    where a.course_id = p_course
    order by s.user_id, s.assignment_id, s.attempt desc
  )
  select c.id, c.code, c.name, c.domain,
         count(*)::int,
         count(*) filter (where ans.correct)::int,
         round(count(*) filter (where ans.correct) * 100.0 / nullif(count(*), 0))::int,
         count(distinct u.user_id)::int
  from public.education_answers ans
  join utolso u on u.id = ans.submission_id
  join public.education_questions q on q.id = ans.question_id
  join public.competencies c on c.id = q.competency_id
  where public.edu_can_manage(p_course)
  group by c.id, c.code, c.name, c.domain, c.sort_order
  order by 7 asc, c.sort_order
$$;

revoke all on function public.edu_course_competencies(uuid) from public, anon;
grant execute on function public.edu_course_competencies(uuid) to authenticated;

/**
 * Kérdésenkénti elemzés — hol akadnak el a legtöbben.
 *
 * A leggyengébb kérdések elöl. Ez kétféle információt hordoz: vagy a téma nem
 * ment át, vagy maga a kérdés félreérthető. A kettő elkülönítése az oktató
 * dolga, ezért a nyers arányt mutatjuk, értelmezés nélkül.
 */
create or replace function public.edu_course_questions(p_course uuid)
returns table (
  question_id uuid, assignment_id uuid, assignment_title text,
  prompt text, kind text, points int,
  valaszok int, helyes int, pct int, competency_name text
)
language sql stable security definer set search_path = public as $$
  with utolso as (
    select distinct on (s.user_id, s.assignment_id) s.id
    from public.education_submissions s
    join public.education_assignments a on a.id = s.assignment_id
    where a.course_id = p_course
    order by s.user_id, s.assignment_id, s.attempt desc
  )
  select q.id, a.id, a.title, q.prompt, q.kind, q.points,
         count(*)::int,
         count(*) filter (where ans.correct)::int,
         round(count(*) filter (where ans.correct) * 100.0 / nullif(count(*), 0))::int,
         c.name
  from public.education_answers ans
  join utolso u on u.id = ans.submission_id
  join public.education_questions q on q.id = ans.question_id
  join public.education_assignments a on a.id = q.assignment_id
  left join public.competencies c on c.id = q.competency_id
  where a.course_id = p_course and public.edu_can_manage(p_course)
  group by q.id, a.id, a.title, q.prompt, q.kind, q.points, c.name
  order by 9 asc
$$;

revoke all on function public.edu_course_questions(uuid) from public, anon;
grant execute on function public.edu_course_questions(uuid) to authenticated;

/**
 * Hallgatónkénti áttekintés a kurzuson.
 *
 * Megmutatja, hány feladatot adott be a hallgató a megnyitottakból — a hiányzó
 * beadás gyakran fontosabb jelzés, mint a gyenge eredmény.
 */
create or replace function public.edu_course_students(p_course uuid)
returns table (
  user_id uuid, full_name text,
  beadott int, osszes_feladat int, atlag int, teljesitett int,
  utolso_beadas timestamptz
)
language sql stable security definer set search_path = public as $$
  with nyitott as (
    select count(*)::int as db from public.education_assignments
    where course_id = p_course and status <> 'draft'
  ),
  utolso as (
    select distinct on (s.user_id, s.assignment_id)
           s.user_id, s.assignment_id, s.pct, s.passed, s.submitted_at
    from public.education_submissions s
    join public.education_assignments a on a.id = s.assignment_id
    where a.course_id = p_course
    order by s.user_id, s.assignment_id, s.attempt desc
  )
  select e.user_id, p.full_name,
         coalesce(count(x.assignment_id), 0)::int,
         (select db from nyitott),
         coalesce(round(avg(x.pct)), 0)::int,
         coalesce(count(*) filter (where x.passed), 0)::int,
         max(x.submitted_at)
  from public.education_enrollments e
  join public.profiles p on p.id = e.user_id
  left join utolso x on x.user_id = e.user_id
  where e.course_id = p_course and e.status <> 'dropped'
    and public.edu_can_manage(p_course)
  group by e.user_id, p.full_name
  order by 5 asc, p.full_name
$$;

revoke all on function public.edu_course_students(uuid) from public, anon;
grant execute on function public.edu_course_students(uuid) to authenticated;

/** A kurzus összesített mutatói. */
create or replace function public.edu_course_summary(p_course uuid)
returns table (
  hallgatok int, feladatok int, beadasok int, atlag int,
  besorolatlan_kerdes int
)
language sql stable security definer set search_path = public as $$
  select
    (select count(*)::int from public.education_enrollments
      where course_id = p_course and status <> 'dropped'),
    (select count(*)::int from public.education_assignments
      where course_id = p_course and status <> 'draft'),
    (select count(*)::int from public.education_submissions s
      join public.education_assignments a on a.id = s.assignment_id
      where a.course_id = p_course),
    (select coalesce(round(avg(s.pct)), 0)::int from public.education_submissions s
      join public.education_assignments a on a.id = s.assignment_id
      where a.course_id = p_course),
    -- Kompetencia nélküli kérdések: ezek hiányoznak a szakmai bontásból.
    (select count(*)::int from public.education_questions q
      join public.education_assignments a on a.id = q.assignment_id
      where a.course_id = p_course and q.competency_id is null)
  where public.edu_can_manage(p_course)
$$;

revoke all on function public.edu_course_summary(uuid) from public, anon;
grant execute on function public.edu_course_summary(uuid) to authenticated;

-- Ellenőrzés: négy függvény.
select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and proname like 'edu\_course\_%'
order by proname;
