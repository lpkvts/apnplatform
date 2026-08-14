-- APN Hungary Platform — APN Career modul

create table public.career_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('allas','kepzes','konferencia','palyazat','publikacio','kutatas','mentor')),
  title text not null,
  org text,
  location text,
  url text,
  description text,
  tags text[] not null default '{}',
  specialty text[] not null default '{}',
  deadline date,
  status text not null default 'published' check (status in ('draft','published','expired')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_career_cat on public.career_items(category, status);

alter table public.career_items enable row level security;

create policy "career: olvasás" on public.career_items for select
  using (status = 'published' or has_role(array['szerkeszto','lektor','admin']) or created_by = auth.uid());
create policy "career: staff felvitel" on public.career_items for insert
  with check (has_role(array['szerkeszto','lektor','admin']));
create policy "career: staff módosítás" on public.career_items for update
  using (has_role(array['szerkeszto','lektor','admin']));
create policy "career: staff törlés" on public.career_items for delete
  using (has_role(array['szerkeszto','lektor','admin']));

-- Induló (példa) tartalom — a szerkesztők bővítik/cserélik
insert into public.career_items (category, title, org, location, description, tags, specialty) values
  ('kepzes', 'APN mesterképzés (ápolás MSc, APN szakirány)', 'Hazai egyetemek', 'Országos',
   'Az Advanced Practice Nurse szerephez kapcsolódó mesterszintű képzés. Tájékozódj az aktuális felvételi feltételekről a választott egyetemen.',
   '{mesterképzés,APN,egyetem}', '{általános}'),
  ('konferencia', 'Ápolásszakmai kongresszus', 'Szakmai szervezetek', 'Országos',
   'Éves szakmai konferencia előadásokkal, workshopokkal és továbbképzési lehetőségekkel.',
   '{konferencia,továbbképzés}', '{általános}'),
  ('kepzes', 'Sürgősségi betegellátás továbbképzés', 'Akkreditált képzőhelyek', 'Országos',
   'Sürgősségi felismerés és ellátás APN-fókusszal; gyakorlati készségfejlesztéssel.',
   '{sürgősségi,készségfejlesztés}', '{sürgősségi}'),
  ('palyazat', 'Szakmai fejlődési / ösztöndíj pályázatok', 'Kamarai és intézményi kiírók', 'Országos',
   'Rendszeresen megjelenő továbbképzési és kutatási ösztöndíjak. Figyeld a kiírók aktuális felhívásait.',
   '{ösztöndíj,pályázat}', '{általános}'),
  ('kutatas', 'APN szerepkör kutatási együttműködések', 'Egyetemi kutatócsoportok', 'Országos',
   'Részvételi lehetőség ápolástudományi és APN-szerepkört vizsgáló kutatásokban.',
   '{kutatás,ápolástudomány}', '{általános}'),
  ('mentor', 'APN mentorprogram', 'APN közösség', 'Országos',
   'Tapasztalt APN-ek mentorálják a pályakezdőket a szerepkörbe való beilleszkedésben.',
   '{mentor,pályakezdő}', '{általános}'),
  ('publikacio', 'Publikációs lehetőségek ápolási szaklapokban', 'Szakmai folyóiratok', 'Országos',
   'Esettanulmányok, jó gyakorlatok és kutatási eredmények közlési lehetőségei.',
   '{publikáció,szaklap}', '{általános}');
