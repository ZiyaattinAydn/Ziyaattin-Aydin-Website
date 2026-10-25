-- Synthetic, rollback-only. This must NEVER run on a live database.
begin;
do $$ begin
  if current_setting('studio.test_database',true) is distinct from 'isolated' then
    raise exception 'Refusing to test profile policies outside isolated Postgres';
  end if;
end $$;
insert into auth.users(id) values
  ('10000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000002');
update public.owner_profiles set role='owner',status='active',activated_at=now()
  where user_id in ('10000000-0000-4000-8000-000000000001',
                    '10000000-0000-4000-8000-000000000002');

select set_config('request.jwt.claims',
  '{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal1"}',true);
set local role authenticated;
do $$ begin
  begin
    insert into public.site_profiles(owner_id,headline,description)
    values ('10000000-0000-4000-8000-000000000001','Denied','AAL1');
    raise exception 'AAL1 wrote profile';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

select set_config('request.jwt.claims',
  '{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal2"}',true);
set local role authenticated;
insert into public.site_profiles(owner_id,headline,description)
values ('10000000-0000-4000-8000-000000000001','Synthetic test headline','Synthetic biography');
do $$ begin
  if (select count(*) from public.site_profiles) <> 1 then
    raise exception 'Owner cannot see draft'; end if;
end $$;
reset role;

set local role anon;
do $$ begin
  if (select count(*) from public.site_profiles) <> 0 then
    raise exception 'Anonymous user can read draft'; end if;
end $$;
reset role;

select set_config('request.jwt.claims',
  '{"sub":"10000000-0000-4000-8000-000000000002","aal":"aal2"}',true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.site_profiles) <> 0 then
    raise exception 'Different owner can read private profile'; end if;
  update public.site_profiles set headline = 'Stolen'
    where owner_id='10000000-0000-4000-8000-000000000001';
  if found then raise exception 'Different owner edited private profile'; end if;
end $$;
reset role;

select set_config('request.jwt.claims',
  '{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal2"}',true);
set local role authenticated;
update public.site_profiles set status='published',published_at=now()
  where owner_id='10000000-0000-4000-8000-000000000001';
reset role;
set local role anon;
do $$ begin
  if (select count(*) from public.site_profiles where status='published') <> 1 then
    raise exception 'Published profile missing for anonymous read'; end if;
end $$;
reset role;

select set_config('request.jwt.claims',
  '{"sub":"10000000-0000-4000-8000-000000000001","aal":"aal2"}',true);
set local role authenticated;
update public.site_profiles set status='draft',published_at=null
  where owner_id='10000000-0000-4000-8000-000000000001';
reset role;
set local role anon;
do $$ begin
  if (select count(*) from public.site_profiles) <> 0 then
    raise exception 'Unpublished profile remains public'; end if;
end $$;
reset role;
rollback;
