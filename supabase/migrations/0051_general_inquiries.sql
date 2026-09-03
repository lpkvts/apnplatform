-- APN-MED — A megkeresések általánosítása.
--
-- Előfeltétel: a 0050 lefutott.
--
-- A tábla eredetileg csak képzőhelyi érdeklődésre készült. Most bármilyen
-- megkeresést fogad: általános kérdés, hibajelzés, javaslat, képzőhelyi
-- érdeklődés. Ezért az intézmény neve nem kötelező többé, és bekerül egy
-- mező, ami megmondja, miről szól a levél.

alter table public.institution_inquiries
  add column if not exists kind text not null default 'general';

-- A korábbi sorok mind képzőhelyi érdeklődések voltak.
update public.institution_inquiries
set kind = 'institution'
where kind = 'general' and institution is not null and institution <> '';

alter table public.institution_inquiries
  drop constraint if exists institution_inquiries_kind_check;
alter table public.institution_inquiries
  add constraint institution_inquiries_kind_check
  check (kind in ('general', 'institution', 'bug', 'suggestion'));

-- Az intézmény neve csak képzőhelyi érdeklődésnél kell.
alter table public.institution_inquiries
  alter column institution drop not null;

create index if not exists idx_inq_kind
  on public.institution_inquiries(kind, created_at desc);

/** A megkeresések listája — adminisztrátornak, az újak elöl. */
create or replace function public.inquiry_list()
returns table (
  id uuid, kind text, institution text, contact_name text, email text, phone text,
  student_count text, message text, status text, admin_note text,
  created_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select i.id, i.kind, i.institution, i.contact_name, i.email, i.phone,
         i.student_count, i.message, i.status, i.admin_note, i.created_at
  from public.institution_inquiries i
  where exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  order by
    case i.status when 'new' then 0 when 'contacted' then 1 else 2 end,
    i.created_at desc
$$;

revoke all on function public.inquiry_list() from public, anon;
grant execute on function public.inquiry_list() to authenticated;

-- Ellenőrzés: a mező létrejött, és a lista visszaadja.
select kind, count(*) as db
from public.institution_inquiries
group by kind
order by kind;
