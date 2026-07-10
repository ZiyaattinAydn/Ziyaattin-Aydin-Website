-- Kişisel Sistemim / Studio — Sprint 05 database functions and triggers
-- Run order: 2 of 4
--
-- Security model:
-- - Trigger helpers are stored in the non-exposed private schema.
-- - SECURITY DEFINER is used only where the function must read/write across RLS boundaries.
-- - Every SECURITY DEFINER function uses an empty search_path and fully qualified names.
-- - New Auth users are NOT made owner/admin automatically.

begin;

-- Generic updated_at maintenance. SECURITY INVOKER is sufficient because the
-- trigger runs as part of an already-authorized table statement.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
comment on function private.set_updated_at() is
  'Maintains updated_at on Studio tables. Security invoker; no privilege escalation.';

-- Synchronizes publication timestamps for records that have publish_state,
-- published_at and archived_at columns. Unpublishing keeps the previous
-- published_at timestamp as audit context; later schema revisions may add a
-- dedicated publication history table.
create or replace function private.sync_publish_metadata()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.publish_state = 'published'::public.app_publish_state then
      new.published_at := coalesce(new.published_at, now());
    end if;

    if new.publish_state = 'archived'::public.app_publish_state
       and new.archived_at is null then
      new.archived_at := now();
    end if;
  else
    if new.publish_state = 'published'::public.app_publish_state
       and old.publish_state is distinct from 'published'::public.app_publish_state then
      new.published_at := coalesce(new.published_at, now());
    end if;

    if new.publish_state = 'archived'::public.app_publish_state
       and new.archived_at is null then
      new.archived_at := now();
    elsif new.publish_state <> 'archived'::public.app_publish_state
          and old.publish_state = 'archived'::public.app_publish_state then
      new.archived_at := null;
    end if;
  end if;

  return new;
end;
$$;
comment on function private.sync_publish_metadata() is
  'Sets publication/archive timestamps when publish_state changes; it does not perform publishing.';

-- Owner authorization helper used by RLS policies. It reads the controlled
-- allowlist table using definer privileges to avoid recursive owner_profiles RLS.
-- It never trusts JWT/client metadata roles.
create or replace function private.is_current_user_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.owner_profiles as profile
    where profile.user_id = (select auth.uid())
      and profile.status = 'active'::public.owner_profile_status
      and profile.role in (
        'owner'::public.studio_role,
        'admin'::public.studio_role
      )
  );
$$;
comment on function private.is_current_user_owner() is
  'Returns true only when auth.uid() has an active owner/admin allowlist row.';

-- Creates a pending profile row for a newly created Supabase Auth user.
-- IMPORTANT: role remains NULL and status remains pending. A trusted operator
-- must explicitly activate the single owner after verifying the real UUID.
create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.owner_profiles (
    user_id,
    role,
    status,
    display_name
  )
  values (
    new.id,
    null,
    'pending'::public.owner_profile_status,
    nullif(btrim(new.raw_user_meta_data ->> 'display_name'), '')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;
comment on function private.handle_new_auth_user() is
  'Creates an unauthorized pending owner_profiles row; never auto-promotes a new Auth user.';

-- Keep helpers callable only where required.
revoke all on function private.set_updated_at() from public;
revoke all on function private.sync_publish_metadata() from public;
revoke all on function private.handle_new_auth_user() from public;
revoke all on function private.is_current_user_owner() from public;

grant usage on schema private to authenticated;
grant execute on function private.is_current_user_owner() to authenticated;

-- Auth trigger: profile creation only, with no owner/admin assignment.
create trigger on_auth_user_created_create_pending_owner_profile
after insert on auth.users
for each row execute function private.handle_new_auth_user();

-- updated_at triggers.
create trigger owner_profiles_set_updated_at
before update on public.owner_profiles
for each row execute function private.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function private.set_updated_at();

create trigger writings_set_updated_at
before update on public.writings
for each row execute function private.set_updated_at();

create trigger journey_items_set_updated_at
before update on public.journey_items
for each row execute function private.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function private.set_updated_at();

create trigger notes_set_updated_at
before update on public.notes
for each row execute function private.set_updated_at();

create trigger files_set_updated_at
before update on public.files
for each row execute function private.set_updated_at();

create trigger publish_queue_set_updated_at
before update on public.publish_queue
for each row execute function private.set_updated_at();

-- Publication metadata triggers. These only maintain columns; they do not copy
-- records, expose private data, upload files or change public routes.
create trigger projects_sync_publish_metadata
before insert or update of publish_state, published_at, archived_at
on public.projects
for each row execute function private.sync_publish_metadata();

create trigger writings_sync_publish_metadata
before insert or update of publish_state, published_at, archived_at
on public.writings
for each row execute function private.sync_publish_metadata();

create trigger journey_items_sync_publish_metadata
before insert or update of publish_state, published_at, archived_at
on public.journey_items
for each row execute function private.sync_publish_metadata();

create trigger notes_sync_publish_metadata
before insert or update of publish_state, published_at, archived_at
on public.notes
for each row execute function private.sync_publish_metadata();

commit;
