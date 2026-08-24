-- APN Hungary Platform — Audit Trail
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid, actor_email text, action text not null, entity text not null,
  entity_id uuid, entity_title text, details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_created on public.audit_log(created_at desc);
create index if not exists idx_audit_entity on public.audit_log(entity, created_at desc);

create or replace function public.audit_capture()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_actor uuid := auth.uid(); v_email text; newj jsonb; oldj jsonb;
  v_entity text; v_title text; v_id uuid; v_action text; v_details jsonb := '{}'::jsonb;
begin
  select email into v_email from auth.users where id = v_actor;
  v_entity := case TG_TABLE_NAME when 'guidelines' then 'guideline' when 'diseases' then 'disease' when 'career_items' then 'career' else TG_TABLE_NAME end;
  if TG_OP = 'DELETE' then
    oldj := to_jsonb(OLD); v_id := (oldj->>'id')::uuid; v_title := coalesce(oldj->>'title', oldj->>'name'); v_action := 'delete';
  else
    newj := to_jsonb(NEW); v_id := (newj->>'id')::uuid; v_title := coalesce(newj->>'title', newj->>'name');
    if TG_OP = 'UPDATE' then
      oldj := to_jsonb(OLD);
      if (oldj->>'status') is distinct from (newj->>'status') then v_action := 'status_change'; v_details := jsonb_build_object('from', oldj->>'status', 'to', newj->>'status');
      else v_action := 'update'; end if;
    else v_action := 'insert'; end if;
  end if;
  insert into public.audit_log(actor_id, actor_email, action, entity, entity_id, entity_title, details)
    values (v_actor, v_email, v_action, v_entity, v_id, v_title, v_details);
  return null;
end; $$;

drop trigger if exists trg_audit_guidelines on public.guidelines;
create trigger trg_audit_guidelines after insert or update or delete on public.guidelines for each row execute function public.audit_capture();
drop trigger if exists trg_audit_diseases on public.diseases;
create trigger trg_audit_diseases after insert or update or delete on public.diseases for each row execute function public.audit_capture();
drop trigger if exists trg_audit_career on public.career_items;
create trigger trg_audit_career after insert or update or delete on public.career_items for each row execute function public.audit_capture();

alter table public.audit_log enable row level security;
drop policy if exists "audit: staff olvasás" on public.audit_log;
create policy "audit: staff olvasás" on public.audit_log for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('szerkeszto','lektor','admin')));
