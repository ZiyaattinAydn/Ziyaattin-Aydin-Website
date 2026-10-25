begin;

-- Additive, no data rewrite: existing rows remain intact. Private notes have no
-- anonymous policy; this restrictive write policy also prevents accidental
-- promotion through an authenticated client outside the Studio UI.
create policy notes_private_write_boundary on public.notes as restrictive
for all to authenticated using (true)
with check (visibility = 'private' and publish_candidate = false
  and publish_state in ('draft', 'archived'));

create policy files_bucket_visibility_boundary on public.files as restrictive
for all to authenticated using (true)
with check ((storage_bucket = 'private-files' and visibility = 'private')
  or (storage_bucket = 'public-assets' and visibility = 'public'
    and mime_type in ('image/jpeg','image/png','image/webp','image/avif')));

create function private.guard_library_history() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.status = 'archived' then
    raise exception using errcode = '23514', message = 'Archived library record is read only';
  end if;
  if new.owner_id is distinct from old.owner_id then
    raise exception using errcode = '23514', message = 'Library owner is immutable';
  end if;
  if tg_table_name = 'files' then
    if row(new.storage_bucket,new.storage_path,new.original_name,new.mime_type,new.size_bytes)
       is distinct from row(old.storage_bucket,old.storage_path,old.original_name,old.mime_type,old.size_bytes) then
      raise exception using errcode = '23514', message = 'Stored file identity is immutable';
    end if;
    if new.status = 'archived' then new.archived_at := coalesce(old.archived_at,now()); end if;
  end if;
  return new;
end;
$$;
revoke all on function private.guard_library_history() from public,anon,authenticated;
create trigger notes_guard_history before update on public.notes
for each row execute function private.guard_library_history();
create trigger files_guard_history before update on public.files
for each row execute function private.guard_library_history();
commit;
