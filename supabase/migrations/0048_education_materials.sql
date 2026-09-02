-- APN-MED Education — tananyagok és klinikai esetek.
--
-- Előfeltétel: a 0036 (oktatási alapréteg) lefutott.
--
-- Egy tábla, három tartalomtípussal:
--   case   · klinikai eset: helyzet, betegadatok, kérdés, megoldás
--   note   · szöveges tananyag vagy összefoglaló
--   module · hivatkozás a platform meglévő moduljára (score, EKG, vérgáz)
--
-- A modulhivatkozás azért fontos, mert így az oktatási tartalom nem duplikálja
-- a platform klinikai eszközeit, hanem rájuk mutat: az esethez tartozó
-- pontozó ugyanaz, amit a hallgató a napi munkában is használ.

create table if not exists public.education_materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.education_courses(id) on delete cascade,
  kind text not null default 'case' check (kind in ('case', 'note', 'module')),
  title text not null,
  ord int not null default 0,

  /** Klinikai helyzet — az eset felvezetése. */
  vignette text,
  /**
   * Betegadatok és leletek: [{ label, value, flag }].
   * A `flag` értéke 'high' vagy 'low', ha az érték eltér a szokásostól —
   * kivetítve így egy pillantással látszik, mi a kóros.
   */
  data jsonb not null default '[]'::jsonb,
  /** A csoportnak feltett kérdés. */
  question text,
  /** A megoldás — az oktató dönti el, mikor mutatja meg. */
  answer text,

  /** Modulhivatkozás: a platform saját eszközére mutat. */
  module_href text,
  module_label text,

  /** Látják-e a hallgatók. Az oktató előkészítheti láthatatlanul. */
  visible boolean not null default false,

  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_edu_mat_course
  on public.education_materials(course_id, ord);

alter table public.education_materials enable row level security;

drop policy if exists "edu tananyag: lathato" on public.education_materials;
-- A hallgató csak a közzétett tartalmat látja; az előkészítés alatt lévő az oktatóé.
create policy "edu tananyag: lathato" on public.education_materials for select
  using (
    public.edu_can_manage(course_id)
    or (visible and public.edu_can_view(course_id))
  );

drop policy if exists "edu tananyag: oktato kezel" on public.education_materials;
create policy "edu tananyag: oktato kezel" on public.education_materials for all
  using (public.edu_can_manage(course_id))
  with check (public.edu_can_manage(course_id));

/**
 * A tananyag a hallgatónak — megoldás nélkül.
 *
 * A klinikai eset megoldását az oktató mutatja meg a megbeszélésen. Ha a
 * hallgatói lekérdezés visszaadná, a hálózati válaszban látszana, és a
 * kérdésnek nem lenne értelme.
 */
create or replace function public.edu_materials_for_student(p_course uuid)
returns table (
  id uuid, kind text, title text, ord int,
  vignette text, data jsonb, question text,
  module_href text, module_label text
)
language sql stable security definer set search_path = public as $$
  select m.id, m.kind, m.title, m.ord,
         m.vignette, m.data, m.question,
         m.module_href, m.module_label
  from public.education_materials m
  where m.course_id = p_course
    and m.visible
    and public.edu_can_view(p_course)
  order by m.ord, m.created_at
$$;

revoke all on function public.edu_materials_for_student(uuid) from public, anon;
grant execute on function public.edu_materials_for_student(uuid) to authenticated;

-- Ellenőrzés: a tábla és a függvény.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema = 'public' and table_name = 'education_materials'
union all
select 'fuggveny', proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and proname = 'edu_materials_for_student'
order by 1;
