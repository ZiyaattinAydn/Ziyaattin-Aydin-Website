-- Kişisel Sistemim / Studio — Sprint 05 RLS policies
-- Run order: 3 of 4
--
-- Access baseline:
-- - anon: SELECT only on published + public projects, writings and journey items.
-- - authenticated verified owner/admin: owner-scoped CRUD on Studio content.
-- - owner_profiles: authenticated users may read only their own profile row; no client writes.
-- - tasks, notes, files and publish_queue: never readable by anon.
-- - no policy trusts a client-provided role or owner_id without auth.uid() validation.
-- - service_role is not part of normal Studio CRUD and no service-role policy is created.

begin;

-- Enable and force RLS on every application table.
alter table public.owner_profiles enable row level security;
alter table public.owner_profiles force row level security;
alter table public.projects enable row level security;
alter table public.projects force row level security;
alter table public.writings enable row level security;
alter table public.writings force row level security;
alter table public.journey_items enable row level security;
alter table public.journey_items force row level security;
alter table public.tasks enable row level security;
alter table public.tasks force row level security;
alter table public.notes enable row level security;
alter table public.notes force row level security;
alter table public.files enable row level security;
alter table public.files force row level security;
alter table public.publish_queue enable row level security;
alter table public.publish_queue force row level security;

-- Start from explicit least-privilege grants. RLS policies cannot grant an SQL
-- privilege that the role does not already have.
revoke all privileges on table public.owner_profiles from anon, authenticated;
revoke all privileges on table public.projects from anon, authenticated;
revoke all privileges on table public.writings from anon, authenticated;
revoke all privileges on table public.journey_items from anon, authenticated;
revoke all privileges on table public.tasks from anon, authenticated;
revoke all privileges on table public.notes from anon, authenticated;
revoke all privileges on table public.files from anon, authenticated;
revoke all privileges on table public.publish_queue from anon, authenticated;

-- Anonymous/public API can only attempt reads on public content tables.
grant select on table public.projects to anon;
grant select on table public.writings to anon;
grant select on table public.journey_items to anon;

-- Authenticated users can read public content; only RLS-verified owner/admin can
-- see private rows or mutate application data.
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.writings to authenticated;
grant select, insert, update, delete on table public.journey_items to authenticated;
grant select, insert, update, delete on table public.tasks to authenticated;
grant select, insert, update, delete on table public.notes to authenticated;
grant select, insert, update, delete on table public.files to authenticated;
grant select, insert, update, delete on table public.publish_queue to authenticated;
grant select on table public.owner_profiles to authenticated;

-- owner_profiles -------------------------------------------------------------
create policy owner_profiles_select_own
on public.owner_profiles
for select
to authenticated
using (user_id = (select auth.uid()));
comment on policy owner_profiles_select_own on public.owner_profiles is
  'An authenticated user may inspect only their own pending/active/disabled profile. No client write policy exists.';

-- projects -------------------------------------------------------------------
create policy projects_public_read
on public.projects
for select
to anon, authenticated
using (
  visibility = 'public'::public.app_visibility
  and publish_state = 'published'::public.app_publish_state
  and published_at is not null
);
comment on policy projects_public_read on public.projects is
  'Allows anonymous and authenticated public-site reads only for published/public projects.';

create policy projects_owner_read
on public.projects
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy projects_owner_read on public.projects is
  'Verified owner/admin can read only rows whose owner_id equals auth.uid().';

create policy projects_owner_insert
on public.projects
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy projects_owner_insert on public.projects is
  'Verified owner/admin can insert only rows owned by auth.uid().';

create policy projects_owner_update
on public.projects
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
)
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy projects_owner_update on public.projects is
  'Verified owner/admin can update own rows and cannot transfer owner_id.';

create policy projects_owner_delete
on public.projects
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy projects_owner_delete on public.projects is
  'Verified owner/admin can delete only own project rows.';

-- writings -------------------------------------------------------------------
create policy writings_public_read
on public.writings
for select
to anon, authenticated
using (
  visibility = 'public'::public.app_visibility
  and publish_state = 'published'::public.app_publish_state
  and published_at is not null
);
comment on policy writings_public_read on public.writings is
  'Allows anonymous and authenticated public-site reads only for published/public writings.';

create policy writings_owner_read
on public.writings
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy writings_owner_read on public.writings is
  'Verified owner/admin can read only own writing rows.';

create policy writings_owner_insert
on public.writings
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy writings_owner_insert on public.writings is
  'Verified owner/admin can insert only writing rows owned by auth.uid().';

create policy writings_owner_update
on public.writings
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
)
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy writings_owner_update on public.writings is
  'Verified owner/admin can update own writings and cannot transfer owner_id.';

create policy writings_owner_delete
on public.writings
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy writings_owner_delete on public.writings is
  'Verified owner/admin can delete only own writing rows.';

-- journey_items --------------------------------------------------------------
create policy journey_items_public_read
on public.journey_items
for select
to anon, authenticated
using (
  visibility = 'public'::public.app_visibility
  and publish_state = 'published'::public.app_publish_state
  and published_at is not null
);
comment on policy journey_items_public_read on public.journey_items is
  'Allows anonymous and authenticated reads only for published/public journey records.';

create policy journey_items_owner_read
on public.journey_items
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy journey_items_owner_read on public.journey_items is
  'Verified owner/admin can read only own journey rows.';

create policy journey_items_owner_insert
on public.journey_items
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy journey_items_owner_insert on public.journey_items is
  'Verified owner/admin can insert only journey rows owned by auth.uid().';

create policy journey_items_owner_update
on public.journey_items
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
)
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy journey_items_owner_update on public.journey_items is
  'Verified owner/admin can update own journey rows and cannot transfer owner_id.';

create policy journey_items_owner_delete
on public.journey_items
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy journey_items_owner_delete on public.journey_items is
  'Verified owner/admin can delete only own journey rows.';

-- tasks ----------------------------------------------------------------------
create policy tasks_owner_read
on public.tasks
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy tasks_owner_read on public.tasks is
  'Tasks are private; only the verified owner/admin can read own rows.';

create policy tasks_owner_insert
on public.tasks
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
  and (
    project_id is null
    or exists (
      select 1
      from public.projects as project
      where project.id = tasks.project_id
        and project.owner_id = (select auth.uid())
    )
  )
);
comment on policy tasks_owner_insert on public.tasks is
  'Verified owner/admin can create own tasks; linked project must also be owned by auth.uid().';

create policy tasks_owner_update
on public.tasks
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
)
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
  and (
    project_id is null
    or exists (
      select 1
      from public.projects as project
      where project.id = tasks.project_id
        and project.owner_id = (select auth.uid())
    )
  )
);
comment on policy tasks_owner_update on public.tasks is
  'Verified owner/admin can update own tasks without changing owner_id or linking another owner project.';

create policy tasks_owner_delete
on public.tasks
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy tasks_owner_delete on public.tasks is
  'Verified owner/admin can delete only own tasks.';

-- notes ----------------------------------------------------------------------
create policy notes_owner_read
on public.notes
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy notes_owner_read on public.notes is
  'Notes remain private even when publish_candidate is true; no anon policy exists.';

create policy notes_owner_insert
on public.notes
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
  and (
    project_id is null
    or exists (
      select 1
      from public.projects as project
      where project.id = notes.project_id
        and project.owner_id = (select auth.uid())
    )
  )
);
comment on policy notes_owner_insert on public.notes is
  'Verified owner/admin can create own notes; linked project must be owner-scoped.';

create policy notes_owner_update
on public.notes
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
)
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
  and (
    project_id is null
    or exists (
      select 1
      from public.projects as project
      where project.id = notes.project_id
        and project.owner_id = (select auth.uid())
    )
  )
);
comment on policy notes_owner_update on public.notes is
  'Verified owner/admin can update own notes without owner transfer.';

create policy notes_owner_delete
on public.notes
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy notes_owner_delete on public.notes is
  'Verified owner/admin can delete only own notes.';

-- files metadata -------------------------------------------------------------
create policy files_owner_read
on public.files
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy files_owner_read on public.files is
  'File metadata remains owner-only; public object delivery is governed by Storage policies.';

create policy files_owner_insert
on public.files
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
  and storage_path like (select auth.uid())::text || '/%'
  and (
    project_id is null
    or exists (
      select 1
      from public.projects as project
      where project.id = files.project_id
        and project.owner_id = (select auth.uid())
    )
  )
);
comment on policy files_owner_insert on public.files is
  'Verified owner/admin can create metadata only under the auth.uid() path prefix.';

create policy files_owner_update
on public.files
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
)
with check (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
  and storage_path like (select auth.uid())::text || '/%'
  and (
    project_id is null
    or exists (
      select 1
      from public.projects as project
      where project.id = files.project_id
        and project.owner_id = (select auth.uid())
    )
  )
);
comment on policy files_owner_update on public.files is
  'Verified owner/admin can update own metadata without owner/path-prefix transfer.';

create policy files_owner_delete
on public.files
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy files_owner_delete on public.files is
  'Verified owner/admin can delete only own file metadata. Object deletion is separately guarded.';

-- publish_queue --------------------------------------------------------------
create policy publish_queue_owner_read
on public.publish_queue
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy publish_queue_owner_read on public.publish_queue is
  'Publish review data is owner-only and never anonymously readable.';

create policy publish_queue_owner_insert
on public.publish_queue
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and requested_by = (select auth.uid())
  and reviewed_by is null
  and review_state = 'requested'::public.publish_review_state
  and (select private.is_current_user_owner())
);
comment on policy publish_queue_owner_insert on public.publish_queue is
  'Owner can request review only as auth.uid(); client cannot self-mark a request reviewed/published on insert.';

create policy publish_queue_owner_update
on public.publish_queue
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
)
with check (
  owner_id = (select auth.uid())
  and requested_by = (select auth.uid())
  and (reviewed_by is null or reviewed_by = (select auth.uid()))
  and (select private.is_current_user_owner())
);
comment on policy publish_queue_owner_update on public.publish_queue is
  'Verified owner/admin can review own queue; owner_id/requested_by cannot be transferred.';

create policy publish_queue_owner_delete
on public.publish_queue
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and (select private.is_current_user_owner())
);
comment on policy publish_queue_owner_delete on public.publish_queue is
  'Verified owner/admin can delete only own queue records.';

commit;
