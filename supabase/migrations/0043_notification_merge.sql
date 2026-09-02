-- APN-MED — Az értesítésszám és az adminisztrátori összesítés egy körben.
--
-- Az adminisztrátori számláló külön függvényként minden oldalbetöltésnél
-- lefutott, minden felhasználónál — pedig csak adminisztrátornak ad eredményt.
-- Ez fölösleges adatbázis-kör volt mindenki másnak.
--
-- A két lekérdezés összevonva egy körben ad vissza mindent. Az adminisztrátori
-- mezők nem adminisztrátornál nullák maradnak, a jogosultságot továbbra is az
-- adatbázis érvényesíti, nem a felület.

create or replace function public.notification_counts()
returns table (
  stored int, certs int, reviews int, followups int,
  new_dz int, new_gl int, new_lab int,
  seen_at timestamptz, seen_version text,
  -- Adminisztrátori mezők
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
  )
  select
    (select count(*)::int from public.notifications n
      where n.user_id = auth.uid() and n.read = false),
    (select count(*)::int from public.certifications c
      where c.user_id = auth.uid()
        and c.expires_on is not null
        and c.expires_on <= (current_date + 60)),
    (select case when (select role from me) in ('szerkeszto','lektor','admin')
       then (select count(*)::int from public.guidelines g
              where g.status = 'published'
                and ((g.review_on is not null and g.review_on <= current_date)
                  or (g.expires_on is not null and g.expires_on <= current_date)))
       else 0 end),
    (select count(*)::int from public.clinical_case_followups f
      join public.clinical_cases cc on cc.id = f.case_id
      where cc.owner_id = auth.uid() and f.done = false
        and f.due_on is not null and f.due_on <= (current_date + 7)),
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

revoke all on function public.notification_counts() from public, anon;
grant execute on function public.notification_counts() to authenticated;

-- A külön adminisztrátori számláló már nem kell: a fenti tartalmazza.
drop function if exists public.admin_notification_counts();

-- Ellenőrzés: egy sort ad vissza, az adminisztrátori mezőkkel együtt.
select * from public.notification_counts();
