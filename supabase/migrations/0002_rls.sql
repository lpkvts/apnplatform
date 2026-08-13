-- APN Hungary Platform — Row Level Security
-- Elv: mindenki csak a SAJÁT rekordjait látja/írja; a katalógusok olvashatók
-- minden bejelentkezettnek; a tartalmat (irányelvek) csak jóváhagyás után látják.

alter table public.profiles              enable row level security;
alter table public.competencies          enable row level security;
alter table public.competency_progress   enable row level security;
alter table public.certifications        enable row level security;
alter table public.cpd_activity_types    enable row level security;
alter table public.cpd_entries           enable row level security;
alter table public.cpd_goals             enable row level security;
alter table public.courses               enable row level security;
alter table public.sources               enable row level security;
alter table public.guidelines            enable row level security;
alter table public.notifications         enable row level security;

-- ---- PROFILOK ----
create policy "profil: saját olvasás" on public.profiles
  for select using (id = auth.uid() or public.has_role(array['admin','szerkeszto']));
create policy "profil: saját frissítés" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ---- SAJÁT REKORDOK (progress / cert / cpd / goals / notif) ----
create policy "kompetencia-haladás: saját" on public.competency_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tanúsítvány: saját" on public.certifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cpd bejegyzés: saját" on public.cpd_entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cpd cél: saját" on public.cpd_goals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "értesítés: saját" on public.notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- KATALÓGUSOK: bejelentkezett olvas, szerkesztő/admin ír ----
create policy "kompetenciák: olvasás" on public.competencies
  for select using (auth.role() = 'authenticated');
create policy "kompetenciák: kezelés" on public.competencies
  for all using (public.has_role(array['admin','szerkeszto'])) with check (public.has_role(array['admin','szerkeszto']));

create policy "cpd típusok: olvasás" on public.cpd_activity_types
  for select using (auth.role() = 'authenticated');
create policy "cpd típusok: kezelés" on public.cpd_activity_types
  for all using (public.has_role(array['admin','szerkeszto'])) with check (public.has_role(array['admin','szerkeszto']));

create policy "kurzusok: olvasás" on public.courses
  for select using (auth.role() = 'authenticated');
create policy "kurzusok: kezelés" on public.courses
  for all using (public.has_role(array['admin','szerkeszto'])) with check (public.has_role(array['admin','szerkeszto']));

create policy "források: olvasás" on public.sources
  for select using (auth.role() = 'authenticated');
create policy "források: kezelés" on public.sources
  for all using (public.has_role(array['admin','szerkeszto','lektor'])) with check (public.has_role(array['admin','szerkeszto','lektor']));

-- ---- IRÁNYELVEK (CMS): publikált mindenkinek; piszkozat csak szerzőnek/lektornak ----
create policy "irányelv: publikált olvasható" on public.guidelines
  for select using (
    status = 'published'
    or created_by = auth.uid()
    or public.has_role(array['admin','szerkeszto','lektor'])
  );
create policy "irányelv: szerző létrehoz" on public.guidelines
  for insert with check (public.has_role(array['admin','szerkeszto','lektor']));
create policy "irányelv: szerző/lektor módosít" on public.guidelines
  for update using (
    created_by = auth.uid() or public.has_role(array['admin','szerkeszto','lektor'])
  ) with check (
    created_by = auth.uid() or public.has_role(array['admin','szerkeszto','lektor'])
  );
-- Megjegyzés: az AI-generált tartalom státusza kötelezően 'draft' → lektorálás → 'published';
-- a publikálásra váltást az alkalmazás- vagy trigger-szinten a szerkeszto/admin szerephez kötjük.
