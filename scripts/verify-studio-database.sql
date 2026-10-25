-- LOCAL/ISOLATED DATABASE ONLY. All fixtures are synthetic and rolled back.
begin;
do $$ begin
  if current_setting('studio.test_database', true) is distinct from 'isolated' then
    raise exception 'Refusing to run outside an isolated test database';
  end if;
end $$;
insert into auth.users(id, raw_user_meta_data) values
 ('10000000-0000-4000-8000-000000000001','{}'),
 ('10000000-0000-4000-8000-000000000002','{}'),
 ('10000000-0000-4000-8000-000000000003','{}');
update public.owner_profiles set status='active',role='owner',activated_at=now()
 where user_id in ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002');
insert into public.projects(id,owner_id,title,slug,status) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Test project','isolated-test-1','active'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','Other owner','isolated-test-2','active');
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal1"}',true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.projects) <> 0 then raise exception 'AAL1 private read'; end if;
  if (select count(*) from public.owner_profiles) <> 1 then raise exception 'AAL1 enrollment profile unavailable'; end if;
  begin
    insert into public.tasks(owner_id,title) values ('10000000-0000-4000-8000-000000000001','Denied');
    raise exception 'AAL1 write allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal2"}',true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.projects) <> 1 then raise exception 'Owner isolation'; end if;
  begin
    insert into public.tasks(owner_id,project_id,title) values ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','Denied link');
    raise exception 'Cross-owner link allowed';
  exception when insufficient_privilege or check_violation then null; end;
end $$;
insert into public.tasks(id,owner_id,project_id,title,starts_at,due_at) values
 ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Test task','2026-10-25T00:00:00+03','2026-10-26T23:59:59+03');
do $$ begin
  begin
    update public.projects set status='completed' where id='20000000-0000-4000-8000-000000000001';
    raise exception 'Completed project with open task';
  exception when check_violation then null; end;
  begin
    update public.tasks set starts_at='2026-11-01' where id='30000000-0000-4000-8000-000000000001';
    raise exception 'Invalid date accepted';
  exception when check_violation then null; end;
end $$;
update public.tasks set title='Edited',description='Next step',priority='urgent',status='done'
 where id='30000000-0000-4000-8000-000000000001';
do $$ begin
  if not exists(select 1 from public.tasks where title='Edited' and description='Next step' and priority='urgent' and completed_at is not null) then raise exception 'Task update/completion failed'; end if;
end $$;
update public.projects set status='completed' where id='20000000-0000-4000-8000-000000000001';
update public.tasks set status='todo', completed_at='2000-01-01'
 where id='30000000-0000-4000-8000-000000000001';
do $$ begin
  if not exists(select 1 from public.tasks where completed_at is null) then raise exception 'Reopen completion not cleared'; end if;
  if not exists(select 1 from public.projects where status='active') then raise exception 'Completed project not reopened'; end if;
end $$;
update public.tasks set project_id=null where id='30000000-0000-4000-8000-000000000001';
update public.tasks set project_id='20000000-0000-4000-8000-000000000001',status='done'
 where id='30000000-0000-4000-8000-000000000001';
create temporary table completion_snapshot as select completed_at from public.tasks where id='30000000-0000-4000-8000-000000000001';
update public.tasks set description='Still done',completed_at='2000-01-01' where id='30000000-0000-4000-8000-000000000001';
do $$ begin
  if (select completed_at from public.tasks where id='30000000-0000-4000-8000-000000000001') is distinct from (select completed_at from completion_snapshot) then raise exception 'Done timestamp changed'; end if;
end $$;
update public.tasks set status='archived' where id='30000000-0000-4000-8000-000000000001';
do $$ begin
  if not exists(select 1 from public.tasks where archived_at is not null and completed_at is not null) then raise exception 'Archive history lost'; end if;
  begin
    update public.tasks set status='todo' where id='30000000-0000-4000-8000-000000000001';
    raise exception 'Archived task edited';
  exception when check_violation then null; end;
end $$;
update public.projects set publish_state='archived',visibility='private' where id='20000000-0000-4000-8000-000000000001';
do $$ begin
  if not exists(select 1 from public.projects where status='archived' and archived_at is not null) then raise exception 'Archive not synchronized'; end if;
  begin
    insert into public.tasks(owner_id,project_id,title) values ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','New archived link');
    raise exception 'Archived project accepted new task';
  exception when check_violation then null; end;
end $$;
reset role;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000003","aal":"aal2"}',true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.tasks) <> 0 or (select count(*) from public.projects) <> 0 then raise exception 'Pending owner sees private data'; end if;
end $$;
reset role;
update public.owner_profiles set status='disabled' where user_id='10000000-0000-4000-8000-000000000001';
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal2"}',true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.tasks) <> 0 then raise exception 'Disabled owner sees private data'; end if;
end $$;
reset role;
insert into public.projects(owner_id,title,slug,visibility,publish_state,published_at) values
 ('10000000-0000-4000-8000-000000000002','Published fixture','isolated-public','public','published',now());
set local role anon;
do $$ begin
  if (select count(*) from public.projects) <> 1 then raise exception 'Public visibility regression'; end if;
  begin perform count(*) from public.tasks; raise exception 'Anonymous task read allowed';
  exception when insufficient_privilege then null; end;
  if has_function_privilege('anon','public.rls_auto_enable()','EXECUTE') then raise exception 'Definer executable by anon'; end if;
  if has_function_privilege('authenticated','public.rls_auto_enable()','EXECUTE') then raise exception 'Definer executable by authenticated'; end if;
end $$;
reset role;
rollback;
