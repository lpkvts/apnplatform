-- APN Hungary — Clinical Knowledge & Evidence: adatlap-bővítés + governance mezők (additív)
alter table public.diseases add column if not exists epidemiology text;
alter table public.diseases add column if not exists pathophysiology text;
alter table public.diseases add column if not exists ddx jsonb not null default '[]'::jsonb;             -- [{name, slug?}]
alter table public.diseases add column if not exists apn_approach jsonb not null default '{}'::jsonb;    -- {anamnesis, physical, data, thinking, consultation, escalation}
alter table public.diseases add column if not exists evidence_levels text[] not null default '{}';       -- guideline/evidence/expert
alter table public.diseases add column if not exists validation_status text;                             -- draft/review_pending/under_review/approved/update_required/archived
alter table public.diseases add column if not exists reviewers jsonb not null default '[]'::jsonb;        -- [{name, specialty, role, date}]
alter table public.diseases add column if not exists block_sources jsonb not null default '{}'::jsonb;    -- {blokk: forrás}
