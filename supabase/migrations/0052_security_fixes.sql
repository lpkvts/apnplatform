-- APN-MED — Biztonsági javítások.
--
-- Két hiba javítása:
--
-- 1. A felhasználó a saját profilját frissíthette, és ezzel a szerepkörét is.
--    A soralapú szabály csak azt nézte, a saját sorát írja-e — azt nem, hogy
--    melyik mezőt. A böngészőből közvetlenül hívva bárki adminná tehette
--    volna magát. A saját kódunk sosem írta a szerepkört, de a védelemnek
--    nem a felületen a helye.
--
-- 2. A kurzus oktatója beadhatta a saját feladatlapját. Mivel a helyes
--    válaszokat is látja, hibátlan eredményt ért volna el, ami a
--    csoportelemzést torzítja.

-- ══ 1. A szerepkör védelme ═══════════════════════════════
/**
 * A szerepkört csak adminisztrátor módosíthatja.
 *
 * A trigger a soralapú szabály fölött áll: az továbbra is engedi a saját
 * profil frissítését, de a szerepkör-mezőt ez visszaállítja. Így a névszerkesztés
 * működik, a jogosultság-emelés viszont nem.
 *
 * Az adminisztrátori szerepkör-változtatás továbbra is az admin_set_role
 * függvényen keresztül történik, ami az utolsó adminisztrátort is védi.
 */
create or replace function public.profile_role_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_admin boolean;
begin
  if new.role is distinct from old.role then
    select exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    ) into v_admin;

    if not v_admin then
      -- A kísérletet nem hibával jelezzük: a mentés többi része legyen érvényes.
      new.role := old.role;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_profile_role_guard on public.profiles;
create trigger trg_profile_role_guard before update on public.profiles
  for each row execute function public.profile_role_guard();

-- ══ 2. Az oktató ne adhassa be a saját feladatát ══════════
create or replace function public.edu_submit(p_assignment uuid, p_answers jsonb)
returns table (submission_id uuid, score int, max_score int, pct int, passed boolean)
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_course uuid;
  v_pass int;
  v_max_attempts int;
  v_attempt int;
  v_sub uuid;
  v_score int := 0;
  v_max int := 0;
  q record;
  v_picked text[];
  v_text text;
  v_correct boolean;
  v_earned int;
  v_helyes text[];
begin
  select a.course_id, a.pass_pct, a.max_attempts into v_course, v_pass, v_max_attempts
  from public.education_assignments a
  where a.id = p_assignment and a.status = 'open';

  if v_course is null then
    raise exception 'A feladat nem érhető el vagy nincs megnyitva.';
  end if;
  if not public.edu_can_view(v_course) then
    raise exception 'Nincs jogosultság a feladathoz.';
  end if;

  -- A kurzus oktatója látja a helyes válaszokat, ezért a beadása értelmetlen
  -- lenne, és torzítaná a csoport eredményeit.
  if public.edu_can_manage(v_course) then
    raise exception 'A kurzus oktatója nem adhatja be a saját feladatát.';
  end if;

  select coalesce(max(s.attempt), 0) + 1 into v_attempt
  from public.education_submissions s
  where s.assignment_id = p_assignment and s.user_id = v_user;

  if v_max_attempts is not null and v_attempt > v_max_attempts then
    raise exception 'A megengedett beadások száma elfogyott.';
  end if;

  insert into public.education_submissions (assignment_id, user_id, attempt, max_score)
  values (p_assignment, v_user, v_attempt, 0)
  returning id into v_sub;

  for q in
    select * from public.education_questions where assignment_id = p_assignment order by ord
  loop
    v_max := v_max + q.points;
    v_picked := coalesce(
      (select array_agg(x) from jsonb_array_elements_text(p_answers -> q.id::text -> 'picked') x),
      '{}'::text[]);
    v_text := p_answers -> q.id::text ->> 'text';
    v_correct := false;

    if q.kind = 'short' then
      v_correct := lower(btrim(coalesce(v_text, ''))) = any (
        select lower(btrim(a)) from unnest(q.accepted) a);
    else
      select coalesce(array_agg(o->>'id'), '{}'::text[]) into v_helyes
      from jsonb_array_elements(q.options) o
      where (o->>'correct')::boolean is true;
      v_correct := v_picked @> v_helyes and v_helyes @> v_picked
                   and array_length(v_picked, 1) is not null;
    end if;

    v_earned := case when v_correct then q.points else 0 end;
    v_score := v_score + v_earned;

    insert into public.education_answers (submission_id, question_id, picked, text_answer, earned, correct)
    values (v_sub, q.id, v_picked, v_text, v_earned, v_correct);
  end loop;

  update public.education_submissions
  set score = v_score, max_score = v_max,
      pct = case when v_max > 0 then round(v_score * 100.0 / v_max) else 0 end,
      passed = (case when v_max > 0 then round(v_score * 100.0 / v_max) else 0 end) >= v_pass
  where id = v_sub;

  return query
  select s.id, s.score, s.max_score, s.pct, s.passed
  from public.education_submissions s where s.id = v_sub;
end $$;

revoke all on function public.edu_submit(uuid, jsonb) from public, anon;
grant execute on function public.edu_submit(uuid, jsonb) to authenticated;

-- ══ 3. A korábbi oktatói beadások kizárása az elemzésből ══
-- Ha korábban került be ilyen beadás, az torzítja a statisztikát. Az elemző
-- lekérdezések ezért csak a beiratkozott hallgatók beadásait veszik számba.

create or replace function public.edu_course_competencies(p_course uuid)
returns table (
  competency_id uuid, code text, name text, domain text,
  valaszok int, helyes int, pct int, hallgatok int
)
language sql stable security definer set search_path = public as $$
  with utolso as (
    select distinct on (s.user_id, s.assignment_id) s.id, s.user_id
    from public.education_submissions s
    join public.education_assignments a on a.id = s.assignment_id
    -- Csak beiratkozott hallgató beadása számít.
    join public.education_enrollments e
      on e.course_id = a.course_id and e.user_id = s.user_id and e.status <> 'dropped'
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
    join public.education_enrollments e
      on e.course_id = a.course_id and e.user_id = s.user_id and e.status <> 'dropped'
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

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- 1. A szerepkör-védő trigger létrejött.
select tgname as trigger_nev
from pg_trigger
where tgname = 'trg_profile_role_guard';

-- 2. Próba: a saját szerepkör átírása nem sikerülhet. Nem adminisztrátorként
--    futtatva a szerepkör változatlan marad.
select id, role as jelenlegi_szerepkor
from public.profiles
where id = auth.uid();
