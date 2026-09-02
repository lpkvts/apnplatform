-- APN-MED Education — az első intézmény és oktató beállítása.
--
-- Az intézmények és a tagságok kezelésére még nincs felület — az a következő
-- fejlesztési szakaszban készül el. Addig ez a szkript állítja be az elsőt.
--
-- HASZNÁLAT
--   1. Írd át az alábbi két értéket a sajátodra.
--   2. Futtasd le a Supabase SQL Editorban, tiszta lapon.
--   3. Kapcsold be az „Oktatói mód” kapcsolót: Tartalomkezelés → Beállítások.

do $$
declare
  -- ── ÁTÍRANDÓ ──────────────────────────────────────────
  v_intezmeny text := 'Somogy Vármegyei Kaposi Mór Oktató Kórház';
  v_rovid     text := 'Kaposi Mór';
  v_email     text := 'ide@ird.be';        -- az első oktató e-mail címe
  -- ──────────────────────────────────────────────────────
  v_user uuid;
  v_inst uuid;
begin
  select id into v_user from auth.users where lower(email) = lower(v_email);
  if v_user is null then
    raise exception 'Nincs felhasználó ezzel a címmel: %. Előbb regisztrálj a platformon.', v_email;
  end if;

  -- Ha már létezik ilyen nevű intézmény, azt használjuk.
  select id into v_inst from public.education_institutions where name = v_intezmeny;
  if v_inst is null then
    insert into public.education_institutions (name, short_name, created_by)
    values (v_intezmeny, v_rovid, v_user)
    returning id into v_inst;
  end if;

  -- Intézményi adminisztrátor: kurzusokat és tagokat is kezelhet.
  insert into public.education_members (institution_id, user_id, role)
  values (v_inst, v_user, 'admin')
  on conflict (institution_id, user_id) do update set role = 'admin';

  raise notice 'Kész. Intézmény: % (%), adminisztrátor: %', v_intezmeny, v_inst, v_email;
end $$;

-- Ellenőrzés: az intézmény és a tagság létrejött.
select i.name as intezmeny, m.role as szerepkor, u.email
from public.education_members m
join public.education_institutions i on i.id = m.institution_id
join auth.users u on u.id = m.user_id
order by i.name, m.role;
