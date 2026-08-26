-- APN Hungary Platform — Újdonság-jelzés: per-user "utoljára megtekintett" időbélyeg.
-- Ehhez mérjük, hogy a felhasználó óta milyen új szakmai tartalom került fel
-- (betegségleírás, irányelv, labor paraméter), illetve melyik platform-verziót látta már.

alter table public.profiles
  add column if not exists updates_seen_at timestamptz,
  add column if not exists updates_seen_version text;

-- A meglévő felhasználók ne kapják meg visszamenőleg az összes eddigi tartalmat újdonságként.
update public.profiles
set updates_seen_at = now()
where updates_seen_at is null;

-- Új felhasználónál a profil létrejöttének ideje a kiindulópont (a lekérdezés
-- coalesce(updates_seen_at, created_at) szerint számol), ezért itt nincs default.

comment on column public.profiles.updates_seen_at is
  'A felhasználó eddig az időpontig látta az újdonságokat. A friss tartalmak ehhez képest számítanak újnak.';
comment on column public.profiles.updates_seen_version is
  'A felhasználó által utoljára megtekintett platform-verzió (lib/changelog/data.ts APP_VERSION).';
