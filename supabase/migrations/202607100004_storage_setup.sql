-- Kişisel Sistemim / Studio — Sprint 06 hosted Storage bucket setup
-- Run order: 4 of 4
--
-- Hosted Supabase note:
-- storage.objects is owned by the managed supabase_storage_admin role. In the
-- development project, Dashboard SQL Editor ran as postgres and could not
-- create policies on that relation (SQLSTATE 42501).
--
-- This migration therefore installs only the two bucket definitions.
-- Install and verify the eight storage.objects policies through:
-- docs/studio/STUDIO_STORAGE_POLICY_RUNBOOK.md
--
-- Bucket model:
-- - public-assets: public downloads; owner-only writes under <owner_uuid>/...
-- - private-files: no anonymous reads; owner-only access under <owner_uuid>/...
--
-- This file uploads no object and stores no owner UUID or secret.

begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'public-assets',
    'public-assets',
    true,
    10485760,
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif'
    ]::text[]
  ),
  (
    'private-files',
    'private-files',
    false,
    26214400,
    array[
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif'
    ]::text[]
  )
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

commit;
