-- Additive Studio 1.0 migration. No existing application rows are rewritten.
begin;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- The profile SELECT policy stays available at AAL1 for TOTP enrollment.
-- Every private content/storage policy already calls this helper.
create or replace function private.is_current_user_owner()
returns boolean language sql stable security definer set search_path = ''
as $$
  select coalesce((select auth.jwt()->>'aal') = 'aal2', false)
    and exists (
      select 1 from public.owner_profiles p
      where p.user_id = (select auth.uid())
        and p.status = 'active'::public.owner_profile_status
        and p.role in ('owner'::public.studio_role, 'admin'::public.studio_role)
    );
$$;
revoke all on function private.is_current_user_owner() from public, anon;
grant execute on function private.is_current_user_owner() to authenticated;

alter table public.tasks add column starts_at timestamptz;
alter table public.tasks add constraint tasks_date_order
  check (starts_at is null or due_at is null or starts_at <= due_at);
create index tasks_owner_due_open_idx on public.tasks (owner_id, due_at)
  where status not in ('done', 'archived');
create index tasks_project_status_idx on public.tasks (project_id, status);

create function private.sync_task_workflow()
returns trigger language plpgsql set search_path = '' as $$
declare linked public.projects%rowtype;
begin
  if tg_op = 'UPDATE' and old.status = 'archived' then
    raise check_violation using message = 'Archived tasks are read-only';
  end if;
  if new.project_id is not null then
    select * into linked from public.projects where id = new.project_id for update;
    if not found or linked.owner_id <> new.owner_id then
      raise check_violation using message = 'Task project must belong to its owner';
    end if;
    if (linked.publish_state = 'archived' or linked.status = 'archived')
       and (tg_op = 'INSERT' or old.project_id is distinct from new.project_id) then
      raise check_violation using message = 'Cannot link a new task to an archived project';
    end if;
  end if;
  if new.status = 'done' then
    if tg_op = 'UPDATE' and old.status = 'done' then
      new.completed_at := coalesce(old.completed_at, now());
    else
      new.completed_at := now();
    end if;
  elsif new.status = 'archived' then
    if tg_op = 'UPDATE' then new.completed_at := old.completed_at;
    else new.completed_at := null;
    end if;
  else new.completed_at := null;
  end if;
  if new.status = 'archived' then new.archived_at := now();
  else new.archived_at := null;
  end if;
  return new;
end;
$$;
revoke all on function private.sync_task_workflow() from public, anon, authenticated;
create trigger tasks_sync_workflow before insert or update on public.tasks
  for each row execute function private.sync_task_workflow();

create function private.reopen_project_for_open_task()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.project_id is not null and new.status not in ('done', 'archived') then
    update public.projects set status = 'active'
      where id = new.project_id and owner_id = new.owner_id
        and status = 'completed' and publish_state <> 'archived';
  end if;
  return new;
end;
$$;
revoke all on function private.reopen_project_for_open_task() from public, anon, authenticated;
create trigger tasks_reopen_project after insert or update on public.tasks
  for each row execute function private.reopen_project_for_open_task();

create function private.guard_project_completion()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.publish_state = 'archived' then new.status := 'archived';
  elsif new.status = 'archived' and (tg_op = 'INSERT' or old.status is distinct from 'archived') then
    raise check_violation using message = 'Use the archive workflow';
  end if;
  if new.status = 'completed' and exists (
    select 1 from public.tasks where project_id = new.id
      and status not in ('done', 'archived')
  ) then raise check_violation using message = 'Project still has open tasks';
  end if;
  return new;
end;
$$;
revoke all on function private.guard_project_completion() from public, anon, authenticated;
create trigger projects_guard_completion before insert or update on public.projects
  for each row execute function private.guard_project_completion();
commit;
