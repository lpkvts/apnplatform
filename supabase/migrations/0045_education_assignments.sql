-- APN-MED Education — feladatok, beadások, eredmények.
--
-- Előfeltétel: a 0036 (oktatási alapréteg) lefutott.
--
-- Négy tábla:
--   education_assignments · egy feladat a kurzushoz (határidő, pontszám, állapot)
--   education_questions   · a feladat kérdései, típussal és pontértékkel
--   education_submissions · egy hallgató egy beadása
--   education_answers     · az egyes válaszok
--
-- A pontozás a beadáskor dől el és tárolódik: a kérdés utólagos módosítása így
-- nem írja át visszamenőleg a már értékelt beadásokat. Ez fontos, mert az
-- eredmény bizonyítéka annak, mit tudott a hallgató az adott pillanatban.

-- ══ Feladatok ════════════════════════════════════════════
create table if not exists public.education_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.education_courses(id) on delete cascade,
  title text not null,
  description text,
  /** Melyik csoportnak szól; üresen a kurzus minden hallgatójának. */
  group_id uuid references public.education_groups(id) on delete set null,
  due_at timestamptz,
  /** Hányszor adható be; null esetén korlátlan. */
  max_attempts int check (max_attempts is null or max_attempts between 1 and 20),
  /** Ennyi százaléktól számít teljesítettnek. */
  pass_pct int not null default 60 check (pass_pct between 0 and 100),
  /** Beadás után rögtön látja-e a hallgató a helyes válaszokat. */
  show_answers boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_edu_assign_course
  on public.education_assignments(course_id, status);

-- ══ Kérdések ═════════════════════════════════════════════
create table if not exists public.education_questions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.education_assignments(id) on delete cascade,
  ord int not null default 0,
  kind text not null default 'single'
    check (kind in ('single', 'multi', 'truefalse', 'short')),
  prompt text not null,
  /** Válaszlehetőségek: [{ id, label, correct }] — rövid válasznál üres. */
  options jsonb not null default '[]'::jsonb,
  /** Rövid válasznál az elfogadott alakok, kisbetűsítve. */
  accepted text[] not null default '{}',
  points int not null default 1 check (points between 1 and 20),
  explanation text,
  /** Melyik kompetenciához tartozik — az eredmény ide számít be. */
  competency_id uuid references public.competencies(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_edu_q_assign
  on public.education_questions(assignment_id, ord);

-- ══ Beadások ═════════════════════════════════════════════
create table if not exists public.education_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.education_assignments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  attempt int not null default 1,
  /** A beadáskor kiszámolt és rögzített eredmény. */
  score int not null default 0,
  max_score int not null default 0,
  pct int not null default 0 check (pct between 0 and 100),
  passed boolean not null default false,
  /** Oktatói szöveges visszajelzés — kézzel, később. */
  feedback text,
  submitted_at timestamptz not null default now(),
  unique (assignment_id, user_id, attempt)
);
create index if not exists idx_edu_sub_user
  on public.education_submissions(user_id, submitted_at desc);
create index if not exists idx_edu_sub_assign
  on public.education_submissions(assignment_id, submitted_at desc);

create table if not exists public.education_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.education_submissions(id) on delete cascade,
  question_id uuid not null references public.education_questions(id) on delete cascade,
  /** A választott azonosítók, vagy rövid válasznál a beírt szöveg. */
  picked text[] not null default '{}',
  text_answer text,
  earned int not null default 0,
  correct boolean not null default false
);
create index if not exists idx_edu_ans_sub on public.education_answers(submission_id);

-- ══ Jogosultságok ════════════════════════════════════════
alter table public.education_assignments enable row level security;
drop policy if exists "edu feladat: lathato" on public.education_assignments;
-- A hallgató csak a megnyitott feladatot látja; a piszkozat az oktatóé.
create policy "edu feladat: lathato" on public.education_assignments for select
  using (
    public.edu_can_manage(course_id)
    or (status <> 'draft' and public.edu_can_view(course_id))
  );
drop policy if exists "edu feladat: oktato kezel" on public.education_assignments;
create policy "edu feladat: oktato kezel" on public.education_assignments for all
  using (public.edu_can_manage(course_id)) with check (public.edu_can_manage(course_id));

alter table public.education_questions enable row level security;
-- A kérdések láthatók, de a helyes válasz nem szivároghat ki: a hallgatói
-- lekérdezés ezért függvényen keresztül megy, ami levágja a megoldást.
drop policy if exists "edu kerdes: oktato" on public.education_questions;
create policy "edu kerdes: oktato" on public.education_questions for all
  using (exists (select 1 from public.education_assignments a
                 where a.id = assignment_id and public.edu_can_manage(a.course_id)))
  with check (exists (select 1 from public.education_assignments a
                      where a.id = assignment_id and public.edu_can_manage(a.course_id)));

alter table public.education_submissions enable row level security;
drop policy if exists "edu beadas: sajat vagy oktato" on public.education_submissions;
create policy "edu beadas: sajat vagy oktato" on public.education_submissions for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.education_assignments a
               where a.id = assignment_id and public.edu_can_manage(a.course_id))
  );
drop policy if exists "edu beadas: sajat letrehozas" on public.education_submissions;
create policy "edu beadas: sajat letrehozas" on public.education_submissions for insert
  with check (user_id = auth.uid());
drop policy if exists "edu beadas: oktato kezel" on public.education_submissions;
create policy "edu beadas: oktato kezel" on public.education_submissions for update
  using (exists (select 1 from public.education_assignments a
                 where a.id = assignment_id and public.edu_can_manage(a.course_id)));

alter table public.education_answers enable row level security;
drop policy if exists "edu valasz: sajat vagy oktato" on public.education_answers;
create policy "edu valasz: sajat vagy oktato" on public.education_answers for all
  using (exists (select 1 from public.education_submissions s
                 where s.id = submission_id
                   and (s.user_id = auth.uid()
                     or exists (select 1 from public.education_assignments a
                                where a.id = s.assignment_id and public.edu_can_manage(a.course_id)))))
  with check (exists (select 1 from public.education_submissions s
                      where s.id = submission_id and s.user_id = auth.uid()));

-- ══ Kitöltéshez: kérdések a helyes válasz nélkül ═════════
/**
 * A feladat kérdései a hallgatónak.
 *
 * A `correct` jelölést kivágjuk a válaszlehetőségekből, és a magyarázatot sem
 * adjuk vissza. Enélkül a megoldás a hálózati válaszban látszana — a felület
 * elrejtése ilyenkor nem védelem.
 */
create or replace function public.edu_questions_for_student(p_assignment uuid)
returns table (id uuid, ord int, kind text, prompt text, options jsonb, points int)
language sql stable security definer set search_path = public as $$
  select q.id, q.ord, q.kind, q.prompt,
         (select coalesce(jsonb_agg(jsonb_build_object('id', o->>'id', 'label', o->>'label')
                                    order by ord2), '[]'::jsonb)
          from jsonb_array_elements(q.options) with ordinality t(o, ord2)),
         q.points
  from public.education_questions q
  join public.education_assignments a on a.id = q.assignment_id
  where q.assignment_id = p_assignment
    and a.status = 'open'
    and public.edu_can_view(a.course_id)
  order by q.ord
$$;

revoke all on function public.edu_questions_for_student(uuid) from public, anon;
grant execute on function public.edu_questions_for_student(uuid) to authenticated;

/**
 * A beadás kiértékelése és rögzítése.
 *
 * A pontozás az adatbázisban történik, mert a helyes válasz sosem kerül a
 * kliensre. A bemenet kérdésenként a választott azonosítók vagy a beírt szöveg.
 */
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
      -- Kisbetűsítve, a fölösleges szóközök nélkül hasonlítunk.
      v_correct := lower(btrim(coalesce(v_text, ''))) = any (
        select lower(btrim(a)) from unnest(q.accepted) a);
    else
      select coalesce(array_agg(o->>'id'), '{}'::text[]) into v_helyes
      from jsonb_array_elements(q.options) o
      where (o->>'correct')::boolean is true;
      -- Több helyes válasznál pontosan a helyes halmaz kell: a részleges
      -- egyezés nem ér pontot, mert a hiányzó felismerés ugyanúgy hiba.
      v_correct := v_picked @> v_helyes and v_helyes @> v_picked and array_length(v_picked, 1) is not null;
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

/** Egy feladat eredményei — oktatói nézethez. */
create or replace function public.edu_assignment_results(p_assignment uuid)
returns table (
  user_id uuid, full_name text, attempt int, score int, max_score int,
  pct int, passed boolean, submitted_at timestamptz, feedback text
)
language sql stable security definer set search_path = public as $$
  select distinct on (s.user_id)
         s.user_id, p.full_name, s.attempt, s.score, s.max_score,
         s.pct, s.passed, s.submitted_at, s.feedback
  from public.education_submissions s
  join public.profiles p on p.id = s.user_id
  join public.education_assignments a on a.id = s.assignment_id
  where s.assignment_id = p_assignment and public.edu_can_manage(a.course_id)
  order by s.user_id, s.attempt desc
$$;

revoke all on function public.edu_assignment_results(uuid) from public, anon;
grant execute on function public.edu_assignment_results(uuid) to authenticated;

-- Ellenőrzés: négy tábla és négy függvény.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema = 'public'
    and table_name in ('education_assignments','education_questions',
                       'education_submissions','education_answers')
union all
select 'fuggveny', proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and proname in ('edu_questions_for_student','edu_submit','edu_assignment_results')
order by 1, 2;
