-- Additive public profile publishing store; no existing rows are changed.
begin;
create table public.site_profiles (
  owner_id uuid primary key references public.owner_profiles(user_id) on delete restrict,
  headline text not null default '',
  description text not null default '',
  email text,
  github_url text,
  linkedin_url text,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_profiles_status check (status in ('draft', 'published')),
  constraint site_profiles_publication check ((status = 'published') = (published_at is not null)),
  constraint site_profiles_headline_length check (char_length(headline) <= 200),
  constraint site_profiles_description_length check (char_length(description) <= 3000),
  constraint site_profiles_email_length check (email is null or char_length(email) <= 254),
  constraint site_profiles_github_length check (github_url is null or char_length(github_url) <= 500),
  constraint site_profiles_linkedin_length check (linkedin_url is null or char_length(linkedin_url) <= 500),
  constraint site_profiles_published_content check (status <> 'published' or
    (char_length(btrim(headline)) > 0 and char_length(btrim(description)) > 0))
);
alter table public.site_profiles enable row level security;
alter table public.site_profiles force row level security;
revoke all privileges on table public.site_profiles from anon, authenticated;
grant select on table public.site_profiles to anon;
grant select, insert, update on table public.site_profiles to authenticated;
create policy site_profiles_public_read on public.site_profiles
for select to anon using (status = 'published' and published_at is not null);
create policy site_profiles_owner_read on public.site_profiles
for select to authenticated using (owner_id = (select auth.uid()) and
  (select private.is_current_user_owner()));
create policy site_profiles_owner_insert on public.site_profiles
for insert to authenticated with check (owner_id = (select auth.uid()) and
  (select private.is_current_user_owner()));
create policy site_profiles_owner_update on public.site_profiles
for update to authenticated using (owner_id = (select auth.uid()) and
  (select private.is_current_user_owner()))
with check (owner_id = (select auth.uid()) and
  (select private.is_current_user_owner()));
create trigger site_profiles_set_updated_at before update on public.site_profiles
for each row execute function private.set_updated_at();
comment on table public.site_profiles is
  'Public personal profile is private until explicitly reviewed and published by an AAL2 owner.';
commit;
