-- Synthetic fixtures only. Invoked by the in-memory PGlite runner.
begin;
do $$ begin if current_setting('studio.test_database',true) is distinct from 'isolated' then raise exception 'Not isolated'; end if; end $$;
insert into auth.users(id) values ('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002'),('10000000-0000-4000-8000-000000000003');
update public.owner_profiles set role='owner',status='active',activated_at=now() where user_id in ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002');
insert into public.projects(id,owner_id,title,slug) values ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Synthetic','library-test'),('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','Other','other-library-test');
-- Mirror the eight hosted Storage policies, without touching a remote service.
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1,'/') $$;
grant usage on schema storage to anon,authenticated;
grant select,insert,update,delete on storage.objects to anon,authenticated;
alter table storage.objects enable row level security;
create policy public_assets_public_read on storage.objects for select to anon,authenticated using(bucket_id='public-assets');
do $$ declare op text; bucket text; predicate text; begin
 foreach bucket in array array['private-files','public-assets'] loop
  predicate := format('bucket_id=%L and (select private.is_current_user_owner()) and (storage.foldername(name))[1]=(select auth.uid())::text',bucket);
  foreach op in array array['select','insert','update','delete'] loop
   if bucket='public-assets' and op='select' then continue; end if;
   execute format('create policy %I on storage.objects for %s to authenticated %s',replace(bucket,'-','_')||'_owner_'||op,op,case when op='insert' then 'with check ('||predicate||')' when op='update' then 'using ('||predicate||') with check ('||predicate||')' else 'using ('||predicate||')' end);
  end loop;
 end loop;
end $$;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal2"}',true);
set local role authenticated;
insert into public.notes(id,owner_id,project_id,title,content,category,tags) values ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Synthetic note','Text','Category',array['tag']);
update public.notes set title='Edited',content='Edited body',project_id=null where id='30000000-0000-4000-8000-000000000001';
insert into public.files(id,owner_id,storage_bucket,storage_path,original_name,mime_type,size_bytes) values ('40000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','private-files','10000000-0000-4000-8000-000000000001/file.pdf','file.pdf','application/pdf',12);
insert into storage.objects(bucket_id,name) values ('private-files','10000000-0000-4000-8000-000000000001/file.pdf');
update public.files set upload_status='uploaded',project_id='20000000-0000-4000-8000-000000000001' where id='40000000-0000-4000-8000-000000000001';
do $$ begin
 if not exists(select 1 from public.notes where title='Edited' and content='Edited body' and project_id is null and updated_at is not null) then raise exception 'Note CRUD failed'; end if;
 if not exists(select 1 from public.files where upload_status='uploaded') or (select count(*) from storage.objects)<>1 then raise exception 'File read failed'; end if;
 begin update public.notes set visibility='public';raise exception 'Public note write allowed';exception when insufficient_privilege then null;end;
 begin update public.notes set project_id='20000000-0000-4000-8000-000000000002';raise exception 'Cross-owner note link';exception when insufficient_privilege then null;end;
 begin update public.files set project_id='20000000-0000-4000-8000-000000000002';raise exception 'Cross-owner file link';exception when insufficient_privilege then null;end;
 begin update public.files set visibility='public';raise exception 'Private file exposed';exception when insufficient_privilege then null;end;
 begin update public.files set storage_path='other/path';raise exception 'File identity changed';exception when check_violation then null;end;
 begin insert into storage.objects(bucket_id,name) values('private-files','10000000-0000-4000-8000-000000000002/stolen.pdf');raise exception 'Cross-owner upload';exception when insufficient_privilege then null;end;
end $$;
update public.notes set status='archived',publish_state='archived' where id='30000000-0000-4000-8000-000000000001';
update public.files set status='archived' where id='40000000-0000-4000-8000-000000000001';
do $$ begin
 if not exists(select 1 from public.notes where archived_at is not null) or not exists(select 1 from public.files where archived_at is not null) then raise exception 'Missing archive time';end if;
 begin update public.notes set content='Lost history';raise exception 'Archived note changed';exception when check_violation then null;end;
 begin update public.files set status='active';raise exception 'Archived file changed';exception when check_violation then null;end;
end $$;
reset role;
-- Authenticated AAL1, pending owner, and a different active owner cannot read
-- these records or upload into the first owner's Storage namespace.
do $$ declare claims text; begin
 foreach claims in array array['{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal1"}','{"sub":"10000000-0000-4000-8000-000000000002","aal":"aal2"}','{"sub":"10000000-0000-4000-8000-000000000003","aal":"aal2"}'] loop
 perform set_config('request.jwt.claims',claims,true);set local role authenticated;
 if (select count(*) from public.notes)<>0 or (select count(*) from public.files)<>0 or (select count(*) from storage.objects)<>0 then raise exception 'Private read leaked';end if;
 begin insert into storage.objects(bucket_id,name) values('private-files','10000000-0000-4000-8000-000000000001/denied.pdf');raise exception 'Unauthorized storage write';exception when insufficient_privilege then null;end;
 begin insert into public.notes(owner_id,title) values('10000000-0000-4000-8000-000000000001','Denied');raise exception 'Unauthorized note write';exception when insufficient_privilege then null;end;
 reset role;
 end loop;
end $$;
select set_config('request.jwt.claims','{}',true);set local role anon;
do $$ begin
 begin perform * from public.notes;raise exception 'Anonymous notes grant';exception when insufficient_privilege then null;end;
 begin perform * from public.files;raise exception 'Anonymous files grant';exception when insufficient_privilege then null;end;
 if (select count(*) from storage.objects)<>0 then raise exception 'Anonymous private download';end if;
 begin insert into storage.objects(bucket_id,name) values('public-assets','public.png');raise exception 'Anonymous public upload';exception when insufficient_privilege then null;end;
end $$;
reset role;
-- Synthetic backup/restore rehearsal: archived rows can be exported and
-- reconstructed without losing their text, file location or archive history.
create temporary table note_snapshot as select * from public.notes;
create temporary table file_snapshot as select * from public.files;
delete from public.notes; delete from public.files;
insert into public.notes select * from note_snapshot;
insert into public.files select * from file_snapshot;
do $$ begin
 if (select content from public.notes)<>'Edited body' or (select storage_path from public.files)<>'10000000-0000-4000-8000-000000000001/file.pdf' or not exists(select 1 from public.notes where archived_at is not null) then raise exception 'Restored snapshot mismatch';end if;
end $$;
rollback;
