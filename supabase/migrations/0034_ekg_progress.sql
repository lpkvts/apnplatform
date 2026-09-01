-- APN-MED — EKG fejlődéskövetés: válaszok mentése és kompetencia-számítás.
--
-- Két szint:
--   ekg_attempts  — egy elvégzett feladat (vezetett elemzés, önálló elemzés
--                   vagy gyakorló kérdés)
--   ekg_answers   — az egyes válaszok, kompetencia-területhez rendelve
--
-- A kompetencia-százalékot nem tároljuk, hanem a válaszokból számoljuk. Így egy
-- terület átsorolása vagy új eset felvétele nem igényel adatmigrációt, és nem
-- keletkezhet eltérés a tárolt összeg és a részletek között.

create table if not exists public.ekg_attempts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null check (mode in ('guided','solo','practice','exam')),
  case_id text,                          -- eset vagy atlasz-elem azonosítója
  answered int not null default 0,
  correct_count int not null default 0,
  partial_count int not null default 0,
  hint_count int not null default 0,
  score_pct int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_ekg_att_owner on public.ekg_attempts(owner_id, created_at desc);

create table if not exists public.ekg_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.ekg_attempts(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  competence text not null,              -- lib/ekg/analysis.ts EKG_COMPETENCES id
  verdict text not null check (verdict in ('ok','partial','off')),
  used_hint boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_ekg_ans_owner on public.ekg_answers(owner_id, competence, created_at desc);

alter table public.ekg_attempts enable row level security;
drop policy if exists "ekg attempt: saját" on public.ekg_attempts;
create policy "ekg attempt: saját" on public.ekg_attempts for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

alter table public.ekg_answers enable row level security;
drop policy if exists "ekg answer: saját" on public.ekg_answers;
create policy "ekg answer: saját" on public.ekg_answers for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- ── Kompetencia-összesítés ────────────────────────────────
-- A részben helyes válasz fél értéket ér, ahogy a felületen is.
-- Területenként az utolsó 40 válasz számít, hogy a régi hibák ne rontsák
-- örökre az arányt — a fejlődésnek látszania kell.
create or replace function public.ekg_competence_summary()
returns table (competence text, total int, pct int, last_at timestamptz)
language sql stable security definer set search_path = public as $$
  with ranked as (
    select a.competence, a.verdict, a.created_at,
           row_number() over (partition by a.competence order by a.created_at desc) as rn
    from public.ekg_answers a
    where a.owner_id = auth.uid()
  )
  select competence,
         count(*)::int,
         round(sum(case verdict when 'ok' then 1 when 'partial' then 0.5 else 0 end)
               * 100.0 / count(*))::int,
         max(created_at)
  from ranked where rn <= 40
  group by competence
$$;

revoke all on function public.ekg_competence_summary() from public, anon;
grant execute on function public.ekg_competence_summary() to authenticated;

-- ── Áttekintés a kezdőkártyához ───────────────────────────
create or replace function public.ekg_progress_summary()
returns table (attempts int, avg_pct int, last_at timestamptz, streak_days int)
language sql stable security definer set search_path = public as $$
  select
    (select count(*)::int from public.ekg_attempts where owner_id = auth.uid()),
    (select coalesce(round(avg(score_pct)), 0)::int from public.ekg_attempts where owner_id = auth.uid()),
    (select max(created_at) from public.ekg_attempts where owner_id = auth.uid()),
    (select count(distinct created_at::date)::int from public.ekg_attempts
      where owner_id = auth.uid() and created_at > now() - interval '30 days')
$$;

revoke all on function public.ekg_progress_summary() from public, anon;
grant execute on function public.ekg_progress_summary() to authenticated;

-- Ellenőrzés: két tábla és két függvény.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema='public' and table_name in ('ekg_attempts','ekg_answers')
union all
select 'fuggveny', proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and proname in ('ekg_competence_summary','ekg_progress_summary')
order by 1,2;
