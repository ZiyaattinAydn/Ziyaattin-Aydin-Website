-- Kişisel Sistemim / Studio — Sprint 05 initial schema
-- Run order: 1 of 4
-- Target: Supabase SQL Editor / PostgreSQL
--
-- IMPORTANT
-- - This migration is intentionally a one-time migration, not an idempotent setup script.
-- - Run it on an empty project after reviewing the SQL and taking a backup when applicable.
-- - The explicit transaction keeps partial object creation from being committed if a statement fails.
-- - Do not rerun after a successful commit. Use a new forward migration for later changes.
-- - This file does not create an auth user and does not assign an owner role.

begin;

-- Private helper functions live outside the Data API-exposed public schema.
create schema if not exists private;
comment on schema private is
  'Non-API helper functions for Studio database security and maintenance.';

create type public.studio_role as enum ('owner', 'admin');
create type public.owner_profile_status as enum ('pending', 'active', 'disabled');
create type public.app_visibility as enum ('private', 'hidden', 'public');
create type public.app_publish_state as enum (
  'draft',
  'review',
  'approved',
  'published',
  'unpublished',
  'archived'
);
create type public.app_approval_state as enum (
  'not_required',
  'pending',
  'approved',
  'rejected'
);
create type public.publish_entity_type as enum (
  'project',
  'writing',
  'journey_item',
  'note'
);
create type public.publish_review_state as enum (
  'requested',
  'in_review',
  'approved',
  'rejected',
  'published',
  'cancelled'
);

-- A row is created in pending state when an Auth user is created by a later trigger.
-- Pending rows have no Studio authority. Activation must be performed deliberately by
-- a trusted operator in SQL Editor after the real owner UUID is known.
create table public.owner_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.studio_role,
  status public.owner_profile_status not null default 'pending',
  display_name text,
  settings jsonb not null default '{}'::jsonb,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint owner_profiles_display_name_length
    check (display_name is null or char_length(btrim(display_name)) between 1 and 120),
  constraint owner_profiles_active_requires_role
    check (
      status <> 'active'
      or (role is not null and activated_at is not null)
    )
);
comment on table public.owner_profiles is
  'Controlled owner/admin allowlist mapped to auth.users. New users remain pending and unauthorized.';
comment on column public.owner_profiles.role is
  'Assigned only by a trusted operator; never trusted from client-provided metadata.';
comment on column public.owner_profiles.status is
  'Only active profiles with owner/admin role pass the Studio owner helper.';

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owner_profiles (user_id) on delete restrict,
  title text not null,
  slug text not null unique,
  summary text not null default '',
  problem text not null default '',
  approach text not null default '',
  highlights text[] not null default '{}'::text[],
  next_steps text[] not null default '{}'::text[],
  status text not null default 'planned',
  visibility public.app_visibility not null default 'private',
  publish_state public.app_publish_state not null default 'draft',
  progress smallint not null default 0,
  is_featured boolean not null default false,
  github_url text,
  demo_url text,
  link_approval_state public.app_approval_state not null default 'pending',
  image_url text,
  image_approval_state public.app_approval_state not null default 'pending',
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_title_not_blank check (char_length(btrim(title)) > 0),
  constraint projects_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_status_valid
    check (status in ('planned', 'active', 'paused', 'completed', 'archived')),
  constraint projects_progress_range check (progress between 0 and 100),
  constraint projects_publication_consistency
    check (
      publish_state <> 'published'
      or (visibility = 'public' and published_at is not null)
    )
);
comment on table public.projects is
  'Owner-managed Studio projects. Anonymous access is granted later only for published/public rows.';

create table public.writings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owner_profiles (user_id) on delete restrict,
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  category text,
  tags text[] not null default '{}'::text[],
  reading_time smallint,
  status text not null default 'draft',
  visibility public.app_visibility not null default 'private',
  publish_state public.app_publish_state not null default 'draft',
  is_featured boolean not null default false,
  cover_image_url text,
  image_approval_state public.app_approval_state not null default 'pending',
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint writings_title_not_blank check (char_length(btrim(title)) > 0),
  constraint writings_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint writings_status_valid
    check (status in ('draft', 'active', 'archived')),
  constraint writings_reading_time_positive
    check (reading_time is null or reading_time > 0),
  constraint writings_publication_consistency
    check (
      publish_state <> 'published'
      or (visibility = 'public' and published_at is not null)
    )
);
comment on table public.writings is
  'Owner-managed writing content. Anonymous access is limited by RLS to published/public rows.';

create table public.journey_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owner_profiles (user_id) on delete restrict,
  title text not null,
  slug text not null unique,
  period_label text,
  summary text not null default '',
  content text not null default '',
  occurred_on date,
  sort_order integer not null default 0,
  status text not null default 'active',
  visibility public.app_visibility not null default 'private',
  publish_state public.app_publish_state not null default 'draft',
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journey_items_title_not_blank check (char_length(btrim(title)) > 0),
  constraint journey_items_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint journey_items_status_valid
    check (status in ('active', 'archived')),
  constraint journey_items_publication_consistency
    check (
      publish_state <> 'published'
      or (visibility = 'public' and published_at is not null)
    )
);
comment on table public.journey_items is
  'Owner-managed timeline records; only published/public rows may be exposed anonymously.';

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owner_profiles (user_id) on delete restrict,
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'todo',
  priority text not null default 'medium',
  due_at timestamptz,
  completed_at timestamptz,
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_title_not_blank check (char_length(btrim(title)) > 0),
  constraint tasks_status_valid
    check (status in ('todo', 'in_progress', 'blocked', 'done', 'archived')),
  constraint tasks_priority_valid
    check (priority in ('low', 'medium', 'high', 'urgent')),
  constraint tasks_done_timestamp_consistency
    check (status <> 'done' or completed_at is not null)
);
comment on table public.tasks is
  'Private owner-only task workflow. No anonymous read policy is created.';

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owner_profiles (user_id) on delete restrict,
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text,
  tags text[] not null default '{}'::text[],
  status text not null default 'active',
  visibility public.app_visibility not null default 'private',
  publish_state public.app_publish_state not null default 'draft',
  publish_candidate boolean not null default false,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_title_not_blank check (char_length(btrim(title)) > 0),
  constraint notes_status_valid check (status in ('active', 'archived'))
);
comment on table public.notes is
  'Private knowledge-library notes. Public writing is produced through a reviewed publish flow, not anonymous note reads.';

create table public.files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owner_profiles (user_id) on delete restrict,
  project_id uuid references public.projects (id) on delete set null,
  storage_bucket text not null,
  storage_path text not null,
  original_name text not null,
  mime_type text,
  size_bytes bigint,
  status text not null default 'active',
  visibility public.app_visibility not null default 'private',
  upload_status text not null default 'pending',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint files_storage_location_unique unique (storage_bucket, storage_path),
  constraint files_original_name_not_blank check (char_length(btrim(original_name)) > 0),
  constraint files_size_non_negative check (size_bytes is null or size_bytes >= 0),
  constraint files_status_valid check (status in ('active', 'archived')),
  constraint files_upload_status_valid
    check (upload_status in ('pending', 'uploaded', 'failed', 'deleted')),
  constraint files_known_bucket
    check (storage_bucket in ('public-assets', 'private-files')),
  constraint files_public_bucket_visibility
    check (storage_bucket <> 'public-assets' or visibility = 'public')
);
comment on table public.files is
  'Owner-only metadata for Supabase Storage objects. Public object delivery is governed separately by Storage bucket and object policies.';

create table public.publish_queue (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owner_profiles (user_id) on delete restrict,
  entity_type public.publish_entity_type not null,
  entity_id uuid not null,
  requested_by uuid not null references public.owner_profiles (user_id) on delete restrict,
  review_state public.publish_review_state not null default 'requested',
  reviewed_by uuid references public.owner_profiles (user_id) on delete restrict,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  rejection_reason text,
  payload_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publish_queue_review_consistency
    check (
      review_state not in ('approved', 'rejected', 'published')
      or (reviewed_by is not null and reviewed_at is not null)
    ),
  constraint publish_queue_rejection_reason
    check (
      review_state <> 'rejected'
      or (rejection_reason is not null and char_length(btrim(rejection_reason)) > 0)
    )
);
comment on table public.publish_queue is
  'Owner-only polymorphic review queue. entity_id is validated by application/service logic because it can target multiple tables.';

-- Ownership and relationship indexes.
create index projects_owner_id_idx on public.projects (owner_id);
create index projects_public_listing_idx
  on public.projects (publish_state, visibility, published_at desc)
  where publish_state = 'published' and visibility = 'public';
create index projects_updated_at_idx on public.projects (updated_at desc);

create index writings_owner_id_idx on public.writings (owner_id);
create index writings_public_listing_idx
  on public.writings (publish_state, visibility, published_at desc)
  where publish_state = 'published' and visibility = 'public';
create index writings_updated_at_idx on public.writings (updated_at desc);

create index journey_items_owner_id_idx on public.journey_items (owner_id);
create index journey_items_public_listing_idx
  on public.journey_items (publish_state, visibility, sort_order, published_at desc)
  where publish_state = 'published' and visibility = 'public';

create index tasks_owner_id_idx on public.tasks (owner_id);
create index tasks_project_id_idx on public.tasks (project_id);
create index tasks_status_due_at_idx on public.tasks (status, due_at);

create index notes_owner_id_idx on public.notes (owner_id);
create index notes_project_id_idx on public.notes (project_id);
create index notes_publish_candidate_idx on public.notes (publish_candidate, updated_at desc);

create index files_owner_id_idx on public.files (owner_id);
create index files_project_id_idx on public.files (project_id);
create index files_bucket_path_idx on public.files (storage_bucket, storage_path);

create index publish_queue_owner_id_idx on public.publish_queue (owner_id);
create index publish_queue_entity_idx on public.publish_queue (entity_type, entity_id);
create index publish_queue_review_state_idx on public.publish_queue (review_state, requested_at);
create unique index publish_queue_one_open_request_idx
  on public.publish_queue (owner_id, entity_type, entity_id)
  where review_state in ('requested', 'in_review', 'approved');

commit;
