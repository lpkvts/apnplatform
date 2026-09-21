-- APN-MED — Értesítések: beragadás megszüntetése és törlési lehetőség
--
-- Két hiba javítása egyszerre, mert közös a gyökerük.
--
-- 1) BERAGADÁS
--    A harang száma és az értesítések listája KÉT KÜLÖN helyen dőlt el:
--    a szám ebben az SQL függvényben, a lista a lib/notifications.ts-ben.
--    A két oldal feltételei eltértek, ezért a harang olyan tételt is
--    számolt, ami a listában meg sem jelent — a felhasználó pedig hiába
--    nyitotta meg az oldalt, nem volt mit megnyomnia.
--
--    A konkrét eltérések:
--      · lejárt tanúsítvány — a szám a múltbelieket is vitte (nem volt alsó
--        határ), a lista viszont csak a még le nem járt hatvan napot mutatta,
--      · utánkövetés — a szám hét napra előre nézett, a lista egyre.
--
--    Mostantól egyetlen helyen, a notification_items() függvényben van
--    leírva, mi számít értesítésnek. A szám is ebből dolgozik, és a
--    felületi lista is ehhez igazodik.
--
-- 2) NINCS TÖRLÉS
--    Csak „mind olvasott” volt, az is kizárólag a tárolt értesítésekre.
--    A származtatott tételeket — lejáró tanúsítvány, esedékes felülvizsgálat,
--    utánkövetés — semmivel nem lehetett eltüntetni: amíg a mögöttes állapot
--    fennállt, a jelzés maradt. Ez az új notification_dismissals tábla
--    oldja meg: egy tétel kulcs szerint elnémítható anélkül, hogy a mögöttes
--    adat (a tanúsítvány, az eset) sérülne.

/* ─────────── 1. Elnémított tételek ─────────── */

create table if not exists public.notification_dismissals (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  item_key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_key)
);

alter table public.notification_dismissals enable row level security;

drop policy if exists "elnémítás: saját" on public.notification_dismissals;
create policy "elnémítás: saját" on public.notification_dismissals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

comment on table public.notification_dismissals is
  'Elnémított értesítés-tételek. A kulcs a felületi tétel azonosítója (c-…, x-…, fu-…). A mögöttes adat érintetlen marad.';

/* ─────────── 2. Mi számít értesítésnek — egyetlen helyen ─────────── */

-- Ez a függvény a hivatkozási pont. A számláló innen dolgozik, és a
-- lib/notifications.ts listájának ugyanezeket a feltételeket kell használnia.
-- Eltérés esetén a harang olyat mutat, amit a lista nem — ezt ellenőrzi a
-- scripts/ertesites-ellenorzes.mjs.
create or replace function public.notification_items()
returns table (item_key text, kind text)
language sql stable security definer set search_path = public as $$
  with me as (select p.id, p.role from public.profiles p where p.id = auth.uid())
  -- tárolt értesítés
  select 'n-' || n.id::text, 'stored'
    from public.notifications n
   where n.user_id = auth.uid() and n.read = false
  union all
  -- tanúsítvány: hatvan napon belül lejár, VAGY már lejárt
  select 'c-' || c.id::text, 'cert'
    from public.certifications c
   where c.user_id = auth.uid()
     and c.expires_on is not null
     and c.expires_on <= (current_date + 60)
  union all
  -- esedékes felülvizsgálat — szerkesztőnek, lektornak, adminnak
  select 'x-' || g.id::text, 'review'
    from public.guidelines g
   where (select role from me) in ('szerkeszto', 'lektor', 'admin')
     and g.status = 'published'
     and ((g.review_on is not null and g.review_on <= current_date)
       or (g.expires_on is not null and g.expires_on <= current_date))
  union all
  -- saját klinikai eset utánkövetése, hét napra előre
  select 'fu-' || f.id::text, 'followup'
    from public.clinical_case_followups f
    join public.clinical_cases cc on cc.id = f.case_id
   where cc.owner_id = auth.uid()
     and f.done = false
     and f.due_on is not null
     and f.due_on <= (current_date + 7)
$$;

-- Ugyanaz, az elnémítottak nélkül.
create or replace function public.notification_active()
returns table (item_key text, kind text)
language sql stable security definer set search_path = public as $$
  select i.item_key, i.kind
    from public.notification_items() i
   where not exists (
     select 1 from public.notification_dismissals d
      where d.user_id = auth.uid() and d.item_key = i.item_key)
$$;

/* ─────────── 3. A számláló újraírva ─────────── */

drop function if exists public.notification_counts();

create function public.notification_counts()
returns table (
  stored int, certs int, reviews int, followups int,
  new_dz int, new_gl int, new_lab int,
  seen_at timestamptz, seen_version text,
  is_admin boolean,
  adm_signup int, adm_role int, adm_content int, adm_flags int
)
language sql stable security definer set search_path = public as $$
  with me as (
    select p.id, p.role,
           coalesce(p.updates_seen_at, p.created_at) as since,
           p.updates_seen_version as ver
    from public.profiles p
    where p.id = auth.uid()
  ),
  -- A négy teendő-típus ugyanabból a forrásból, mint a lista.
  akt as (select kind, count(*)::int as n from public.notification_active() group by kind)
  select
    coalesce((select n from akt where kind = 'stored'), 0),
    coalesce((select n from akt where kind = 'cert'), 0),
    coalesce((select n from akt where kind = 'review'), 0),
    coalesce((select n from akt where kind = 'followup'), 0),
    (select count(*)::int from public.diseases d
      where d.status = 'published' and d.created_at > (select since from me)),
    (select count(*)::int from public.guidelines g
      where g.status = 'published' and g.published_at > (select since from me)),
    (select count(*)::int from public.lab_parameters l
      where l.status = 'active' and l.created_at > (select since from me)),
    (select since from me),
    (select ver from me),

    -- ── Adminisztrátori rész ──
    (select (role = 'admin') from me),
    (select case when (select role from me) = 'admin'
       then (select count(*)::int from public.profiles p
              where p.created_at > (select since from me) and p.id <> auth.uid())
       else 0 end),
    (select case when (select role from me) = 'admin'
       then (select count(*)::int from public.audit_log a
              where a.created_at > (select since from me)
                and a.entity = 'profiles' and a.action in ('update','role_change'))
       else 0 end),
    (select case when (select role from me) = 'admin'
       then (select count(*)::int from public.audit_log a
              where a.created_at > (select since from me)
                and a.entity in ('diseases','guidelines','lab_parameters')
                and a.action in ('insert','update'))
       else 0 end),
    (select case when (select role from me) = 'admin'
       then (select count(*)::int from public.audit_log a
              where a.created_at > (select since from me) and a.entity = 'feature_flags')
       else 0 end)
$$;

/* ─────────── 4. Mindent töröl ─────────── */

-- A biztonsági szelep: bármi is ragadt be, ez nullázza.
-- A tárolt értesítéseket valóban törli, a származtatottakat elnémítja, az
-- újdonságokat megtekintettre állítja. Egy körben, hogy ne maradhasson
-- félbeszakadt állapot.
create or replace function public.notification_clear_all(p_version text default null)
returns int
language plpgsql volatile security definer set search_path = public as $$
declare
  v_db int := 0;
  v_el int := 0;
begin
  if auth.uid() is null then return 0; end if;

  delete from public.notifications where user_id = auth.uid();
  get diagnostics v_db = row_count;

  insert into public.notification_dismissals (user_id, item_key)
  select auth.uid(), i.item_key
    from public.notification_items() i
   where i.kind <> 'stored'
  on conflict (user_id, item_key) do nothing;
  get diagnostics v_el = row_count;

  update public.profiles
     set updates_seen_at = now(),
         updates_seen_version = coalesce(p_version, updates_seen_version)
   where id = auth.uid();

  return v_db + v_el;
end $$;

-- Egyetlen származtatott tétel elnémítása.
create or replace function public.notification_dismiss(p_key text)
returns void
language sql volatile security definer set search_path = public as $$
  insert into public.notification_dismissals (user_id, item_key)
  select auth.uid(), p_key
   where auth.uid() is not null
  on conflict (user_id, item_key) do nothing;
$$;

revoke all on function public.notification_items() from public, anon;
revoke all on function public.notification_active() from public, anon;
revoke all on function public.notification_counts() from public, anon;
revoke all on function public.notification_clear_all(text) from public, anon;
revoke all on function public.notification_dismiss(text) from public, anon;
grant execute on function public.notification_items() to authenticated;
grant execute on function public.notification_active() to authenticated;
grant execute on function public.notification_counts() to authenticated;
grant execute on function public.notification_clear_all(text) to authenticated;
grant execute on function public.notification_dismiss(text) to authenticated;

-- Ellenőrzés: egy sort ad vissza, és a tételek listája is lefut.
select * from public.notification_counts();
select * from public.notification_active();
