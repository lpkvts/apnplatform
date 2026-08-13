-- APN Hungary Platform — CMS: felülvizsgálati és lejárati dátumok az irányelvekhez
alter table public.guidelines add column if not exists review_on date;
alter table public.guidelines add column if not exists expires_on date;
