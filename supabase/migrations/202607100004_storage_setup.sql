-- Kişisel Sistemim / Studio — Sprint 05 Storage buckets and policies
-- Run order: 4 of 4
--
-- Bucket model:
-- - public-assets: public downloads; owner-only writes under <owner_uuid>/...
-- - private-files: no anonymous reads; verified owner-only access under <owner_uuid>/...
--
-- Path contract:
--   <owner_uuid>/<domain>/<filename>
-- Examples:
--   <owner_uuid>/projects/project-cover.webp
--   <owner_uuid>/documents/project-brief.pdf
--
-- Bucket limits below reflect the approved Sprint 06 development baseline.
-- The Supabase project-wide Storage limit or Dashboard configuration can impose
-- a stricter cap. This migration creates policies only; it uploads no object.

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
  );

-- Public assets: anyone may read objects from the public bucket. This does not
-- authorize listing or reading private-files.
create policy public_assets_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'public-assets');
comment on policy public_assets_public_read on storage.objects is
  'Public read for approved assets stored in the public-assets bucket.';

create policy public_assets_owner_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'public-assets'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
comment on policy public_assets_owner_insert on storage.objects is
  'Verified owner/admin can upload public assets only inside the auth.uid() path prefix.';

create policy public_assets_owner_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'public-assets'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'public-assets'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
comment on policy public_assets_owner_update on storage.objects is
  'Verified owner/admin can update/rename only public assets inside the owner path.';

create policy public_assets_owner_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'public-assets'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
comment on policy public_assets_owner_delete on storage.objects is
  'Verified owner/admin can delete only public assets inside the owner path.';

-- Private files: every operation, including downloads, requires the verified
-- owner and the auth.uid() folder prefix. No anon policy is created.
create policy private_files_owner_read
on storage.objects
for select
to authenticated
using (
  bucket_id = 'private-files'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
comment on policy private_files_owner_read on storage.objects is
  'Private downloads/listing are limited to the verified owner path.';

create policy private_files_owner_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'private-files'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
comment on policy private_files_owner_insert on storage.objects is
  'Verified owner/admin can upload private files only under auth.uid().';

create policy private_files_owner_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'private-files'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'private-files'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
comment on policy private_files_owner_update on storage.objects is
  'Verified owner/admin can update/rename private files only inside the owner path.';

create policy private_files_owner_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'private-files'
  and (select private.is_current_user_owner())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
comment on policy private_files_owner_delete on storage.objects is
  'Verified owner/admin can delete only private objects inside the owner path.';

-- Safe deletion guidance:
-- 1. Verify the object belongs to the current owner path.
-- 2. Delete the Storage object through the authenticated Storage API.
-- 3. Only after success, remove or mark the matching public.files metadata row.
-- Cross-service object + metadata deletion is not a single PostgreSQL transaction,
-- so the application must handle retries and partial failures explicitly.

commit;
