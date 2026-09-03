-- APN-MED — Képzőhelyi érdeklődések.
--
-- A nyitóoldalról érkező megkeresések tárolása. Bejelentkezés nélkül is
-- beküldhető, ezért a beszúrás nyitva áll — az olvasás viszont csak
-- adminisztrátornak.
--
-- Személyes adatot csak annyit kérünk, amennyi a visszahíváshoz kell:
-- név, e-mail, intézmény. Telefonszám nem kötelező.

create table if not exists public.institution_inquiries (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  contact_name text not null,
  email text not null,
  phone text,
  /** Hány hallgatót érintene — a méret befolyásolja a választ. */
  student_count text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  admin_note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_inq_status
  on public.institution_inquiries(status, created_at desc);

alter table public.institution_inquiries enable row level security;

-- Beküldés bárkinek: az érdeklődő jellemzően nincs bejelentkezve.
drop policy if exists "erdeklodes: bekuldes" on public.institution_inquiries;
create policy "erdeklodes: bekuldes" on public.institution_inquiries for insert
  with check (status = 'new');

-- Olvasás és kezelés csak adminisztrátornak: a megkeresés kapcsolattartói
-- adatokat tartalmaz, ezek nem tartoznak másra.
drop policy if exists "erdeklodes: admin" on public.institution_inquiries;
create policy "erdeklodes: admin" on public.institution_inquiries for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

/**
 * Az érdeklődések listája — adminisztrátornak.
 *
 * Az újak elöl: azokkal kell foglalkozni.
 */
create or replace function public.inquiry_list()
returns table (
  id uuid, institution text, contact_name text, email text, phone text,
  student_count text, message text, status text, admin_note text,
  created_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select i.id, i.institution, i.contact_name, i.email, i.phone,
         i.student_count, i.message, i.status, i.admin_note, i.created_at
  from public.institution_inquiries i
  where exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  order by
    case i.status when 'new' then 0 when 'contacted' then 1 else 2 end,
    i.created_at desc
$$;

revoke all on function public.inquiry_list() from public, anon;
grant execute on function public.inquiry_list() to authenticated;

-- Ellenőrzés.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema = 'public' and table_name = 'institution_inquiries'
union all
select 'fuggveny', proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and proname = 'inquiry_list';
