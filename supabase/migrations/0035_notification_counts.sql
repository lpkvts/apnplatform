-- APN-MED — Az értesítésszám kiszámítása egyetlen lekérdezésben.
--
-- A harangon látható szám eddig úgy állt elő, hogy az alkalmazás minden
-- oldalbetöltésnél összeállította a TELJES értesítéslistát: profil, tárolt
-- értesítések, lejáró tanúsítványok, esedékes felülvizsgálatok, utánkövetések,
-- majd az új szakmai tartalom három táblából. Ez több mint tíz külön lekérdezés
-- volt minden egyes oldalon, pusztán azért, hogy egy szám megjelenjen.
--
-- Ez a függvény ugyanezt egyetlen körben adja vissza. A részletes listát a
-- /ertesitesek oldal továbbra is a régi módon állítja össze — ott indokolt.

create or replace function public.notification_counts()
returns table (
  stored int, certs int, reviews int, followups int,
  new_dz int, new_gl int, new_lab int,
  seen_at timestamptz, seen_version text
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
    -- Olvasatlan, tárolt értesítések
    (select count(*)::int from public.notifications n
      where n.user_id = auth.uid() and n.read = false),
    -- Hatvan napon belül lejáró tanúsítványok
    (select count(*)::int from public.certifications c
      where c.user_id = auth.uid()
        and c.expires_on is not null
        and c.expires_on <= (current_date + 60)),
    -- Esedékes irányelv-felülvizsgálatok (csak szerkesztőknek és adminnak)
    (select case when (select role from me) in ('szerkeszto','lektor','admin')
       then (select count(*)::int from public.guidelines g
              where g.review_due is not null and g.review_due <= current_date)
       else 0 end),
    -- Esedékes utánkövetések a saját klinikai eseteknél
    (select count(*)::int from public.clinical_case_followups f
      join public.clinical_cases cc on cc.id = f.case_id
      where cc.owner_id = auth.uid() and f.done = false
        and f.due_on is not null and f.due_on <= (current_date + 7)),
    -- Új szakmai tartalom a legutóbbi megtekintés óta
    (select count(*)::int from public.diseases d
      where d.status = 'published' and d.created_at > (select since from me)),
    (select count(*)::int from public.guidelines g
      where g.status = 'published' and g.published_at > (select since from me)),
    (select count(*)::int from public.lab_parameters l
      where l.status = 'active' and l.created_at > (select since from me)),
    (select since from me),
    (select ver from me)
$$;

revoke all on function public.notification_counts() from public, anon;
grant execute on function public.notification_counts() to authenticated;

-- Indexek a gyakran szűrt mezőkre. Kis adatmennyiségnél is számítanak, mert
-- így nem kell végigolvasni a táblát minden oldalbetöltésnél.
create index if not exists idx_notif_unread
  on public.notifications(user_id) where read = false;
create index if not exists idx_cert_expiry
  on public.certifications(user_id, expires_on);
create index if not exists idx_dz_published
  on public.diseases(created_at) where status = 'published';

-- Ellenőrzés: a függvény egy sort ad vissza.
select * from public.notification_counts();
