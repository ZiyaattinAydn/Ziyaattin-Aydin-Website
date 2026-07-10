-- Kişisel Sistemim / Studio — Sprint 05 DESTRUCTIVE ROLLBACK
--
-- DANGER: THIS FILE DELETES ALL DATA IN THE SPRINT 05 APPLICATION TABLES.
-- - Never run in production without explicit user approval.
-- - Take and verify a database + Storage backup first.
-- - This is not a routine migration step and must not be run after every deploy.
-- - The transaction aborts if either Sprint 05 Storage bucket still contains objects.
-- - Rollback removes schema objects, policies and empty buckets; it cannot restore data.

begin;

-- Refuse to remove buckets while objects remain. Export/delete objects through a
-- reviewed process first; direct bucket deletion would otherwise be unsafe.
do $$
begin
  if exists (
    select 1
    from storage.objects
    where bucket_id in ('public-assets', 'private-files')
  ) then
    raise exception
      'Rollback aborted: public-assets/private-files contains objects. Back up and remove objects first.';
  end if;
end;
$$;

-- Storage policies.
drop policy if exists public_assets_public_read on storage.objects;
drop policy if exists public_assets_owner_insert on storage.objects;
drop policy if exists public_assets_owner_update on storage.objects;
drop policy if exists public_assets_owner_delete on storage.objects;
drop policy if exists private_files_owner_read on storage.objects;
drop policy if exists private_files_owner_insert on storage.objects;
drop policy if exists private_files_owner_update on storage.objects;
drop policy if exists private_files_owner_delete on storage.objects;

-- Empty Sprint 05 buckets.
delete from storage.buckets
where id in ('public-assets', 'private-files');

-- Application RLS policies.
drop policy if exists owner_profiles_select_own on public.owner_profiles;

drop policy if exists projects_public_read on public.projects;
drop policy if exists projects_owner_read on public.projects;
drop policy if exists projects_owner_insert on public.projects;
drop policy if exists projects_owner_update on public.projects;
drop policy if exists projects_owner_delete on public.projects;

drop policy if exists writings_public_read on public.writings;
drop policy if exists writings_owner_read on public.writings;
drop policy if exists writings_owner_insert on public.writings;
drop policy if exists writings_owner_update on public.writings;
drop policy if exists writings_owner_delete on public.writings;

drop policy if exists journey_items_public_read on public.journey_items;
drop policy if exists journey_items_owner_read on public.journey_items;
drop policy if exists journey_items_owner_insert on public.journey_items;
drop policy if exists journey_items_owner_update on public.journey_items;
drop policy if exists journey_items_owner_delete on public.journey_items;

drop policy if exists tasks_owner_read on public.tasks;
drop policy if exists tasks_owner_insert on public.tasks;
drop policy if exists tasks_owner_update on public.tasks;
drop policy if exists tasks_owner_delete on public.tasks;

drop policy if exists notes_owner_read on public.notes;
drop policy if exists notes_owner_insert on public.notes;
drop policy if exists notes_owner_update on public.notes;
drop policy if exists notes_owner_delete on public.notes;

drop policy if exists files_owner_read on public.files;
drop policy if exists files_owner_insert on public.files;
drop policy if exists files_owner_update on public.files;
drop policy if exists files_owner_delete on public.files;

drop policy if exists publish_queue_owner_read on public.publish_queue;
drop policy if exists publish_queue_owner_insert on public.publish_queue;
drop policy if exists publish_queue_owner_update on public.publish_queue;
drop policy if exists publish_queue_owner_delete on public.publish_queue;

-- Auth and table triggers.
drop trigger if exists on_auth_user_created_create_pending_owner_profile on auth.users;

drop trigger if exists owner_profiles_set_updated_at on public.owner_profiles;
drop trigger if exists projects_set_updated_at on public.projects;
drop trigger if exists writings_set_updated_at on public.writings;
drop trigger if exists journey_items_set_updated_at on public.journey_items;
drop trigger if exists tasks_set_updated_at on public.tasks;
drop trigger if exists notes_set_updated_at on public.notes;
drop trigger if exists files_set_updated_at on public.files;
drop trigger if exists publish_queue_set_updated_at on public.publish_queue;

drop trigger if exists projects_sync_publish_metadata on public.projects;
drop trigger if exists writings_sync_publish_metadata on public.writings;
drop trigger if exists journey_items_sync_publish_metadata on public.journey_items;
drop trigger if exists notes_sync_publish_metadata on public.notes;

-- Tables in dependency order. No CASCADE is used so unexpected dependencies stop
-- the rollback for review instead of being silently destroyed.
drop table if exists public.publish_queue;
drop table if exists public.tasks;
drop table if exists public.notes;
drop table if exists public.files;
drop table if exists public.journey_items;
drop table if exists public.writings;
drop table if exists public.projects;
drop table if exists public.owner_profiles;

-- Helper functions after all triggers/tables that depend on them are gone.
drop function if exists private.handle_new_auth_user();
drop function if exists private.is_current_user_owner();
drop function if exists private.sync_publish_metadata();
drop function if exists private.set_updated_at();

-- Sprint 05 enum types.
drop type if exists public.publish_review_state;
drop type if exists public.publish_entity_type;
drop type if exists public.app_approval_state;
drop type if exists public.app_publish_state;
drop type if exists public.app_visibility;
drop type if exists public.owner_profile_status;
drop type if exists public.studio_role;

-- The private schema is intentionally retained because future migrations may use
-- it for other non-exposed helpers. Drop it manually only after confirming empty.

commit;
