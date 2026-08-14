-- APN Hungary Platform — eseményvezérelt (tárolt) értesítések

-- Kattintható cél az értesítéshez
alter table public.notifications add column if not exists link text;

-- Irányelv-állapotváltáskor értesítések létrehozása (SECURITY DEFINER: RLS-t megkerüli)
create or replace function public.notify_guideline_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Publikálás → minden felhasználó értesítése
  if NEW.status = 'published' and (OLD.status is distinct from 'published') then
    insert into public.notifications (user_id, kind, title, body, link)
      select id, 'guideline', 'Új irányelv', NEW.title, '/klinika/tudastar/' || NEW.id
      from public.profiles;
  -- Lektorálásra beküldés → staff értesítése
  elsif NEW.status = 'review' and (OLD.status is distinct from 'review') then
    insert into public.notifications (user_id, kind, title, body, link)
      select id, 'review', 'Lektorálásra vár', NEW.title, '/cms'
      from public.profiles
      where role in ('szerkeszto', 'lektor', 'admin');
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_notify_guideline on public.guidelines;
create trigger trg_notify_guideline
  after update on public.guidelines
  for each row execute function public.notify_guideline_change();
