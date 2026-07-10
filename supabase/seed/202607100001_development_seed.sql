-- Kişisel Sistemim / Studio — Sprint 05 DEVELOPMENT/PREVIEW SEED
-- OPTIONAL: run only after all four migrations and after creating/activating the
-- real owner Auth account.
--
-- SQL Editor instructions:
-- 1. Replace the exact text REPLACE_WITH_OWNER_UUID below with the real Auth UUID.
-- 2. Confirm the UUID exists in auth.users.
-- 3. Confirm public.owner_profiles has status='active' and role='owner'/'admin'.
-- 4. Run the complete file once in a development or preview project.
--
-- Safety:
-- - This file never inserts into auth.users.
-- - It contains no secret, real link, contact/social URL or portrait.
-- - If the placeholder is unchanged, invalid, unknown or inactive, the
--   transaction raises an exception and commits no seed data.
-- - Deterministic seed IDs plus ON CONFLICT DO NOTHING make reruns non-overwriting.

begin;

create temporary table s05_seed_context (
  owner_id uuid not null
) on commit drop;

do $$
declare
  owner_uuid_text constant text := 'REPLACE_WITH_OWNER_UUID';
  parsed_owner_uuid uuid;
begin
  if owner_uuid_text = 'REPLACE_WITH_OWNER_UUID' then
    raise exception
      'Seed aborted: replace REPLACE_WITH_OWNER_UUID with the real Supabase Auth owner UUID.';
  end if;

  begin
    parsed_owner_uuid := owner_uuid_text::uuid;
  exception
    when invalid_text_representation then
      raise exception 'Seed aborted: owner UUID is not a valid UUID.';
  end;

  if not exists (
    select 1
    from auth.users as auth_user
    where auth_user.id = parsed_owner_uuid
  ) then
    raise exception
      'Seed aborted: owner UUID does not exist in auth.users. This seed never creates Auth users.';
  end if;

  if not exists (
    select 1
    from public.owner_profiles as profile
    where profile.user_id = parsed_owner_uuid
      and profile.status = 'active'::public.owner_profile_status
      and profile.role in (
        'owner'::public.studio_role,
        'admin'::public.studio_role
      )
  ) then
    raise exception
      'Seed aborted: owner profile must be explicitly activated before seeding.';
  end if;

  insert into pg_temp.s05_seed_context (owner_id)
  values (parsed_owner_uuid);
end;
$$;

insert into public.projects (
  id,
  owner_id,
  title,
  slug,
  summary,
  problem,
  approach,
  highlights,
  next_steps,
  status,
  visibility,
  publish_state,
  progress,
  is_featured,
  github_url,
  demo_url,
  link_approval_state,
  image_url,
  image_approval_state
)
select
  '51000000-0000-4000-8000-000000000001'::uuid,
  context.owner_id,
  'Studio Supabase Hazırlığı',
  'studio-supabase-hazirligi',
  'Development seed ile oluşturulan private hazırlık projesi.',
  'Studio verilerinin owner-only güvenlik modeliyle gerçek veritabanına taşınması.',
  'Şema, RLS, Storage ve publish queue sözleşmelerini önce SQL paketi olarak doğrulamak.',
  array[
    'Anonymous write kapalı',
    'Owner-only Studio erişimi',
    'SQL henüz production ortamına uygulanmadı'
  ]::text[],
  array[
    'Auth karar kapısını tamamla',
    'SQL paketini ayrı test projesinde doğrula'
  ]::text[],
  'active',
  'private'::public.app_visibility,
  'draft'::public.app_publish_state,
  35,
  false,
  null,
  null,
  'not_required'::public.app_approval_state,
  null,
  'not_required'::public.app_approval_state
from pg_temp.s05_seed_context as context
on conflict (id) do nothing;

insert into public.writings (
  id,
  owner_id,
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  reading_time,
  status,
  visibility,
  publish_state,
  is_featured,
  cover_image_url,
  image_approval_state,
  published_at
)
select
  '51000000-0000-4000-8000-000000000002'::uuid,
  context.owner_id,
  'Supabase Güvenlik Hazırlık Notları',
  'supabase-guvenlik-hazirlik-notlari',
  'Development ortamında anonymous public read politikasını doğrulamak için güvenli örnek yazı.',
  'Bu içerik yalnız geliştirme ve RLS doğrulaması içindir. Gerçek kişisel bilgi, bağlantı veya secret içermez.',
  'Geliştirme',
  array['supabase', 'rls', 'development-seed']::text[],
  2,
  'active',
  'public'::public.app_visibility,
  'published'::public.app_publish_state,
  false,
  null,
  'not_required'::public.app_approval_state,
  now()
from pg_temp.s05_seed_context as context
on conflict (id) do nothing;

insert into public.tasks (
  id,
  owner_id,
  project_id,
  title,
  description,
  status,
  priority,
  due_at,
  completed_at,
  sort_order
)
select
  '51000000-0000-4000-8000-000000000003'::uuid,
  context.owner_id,
  '51000000-0000-4000-8000-000000000001'::uuid,
  'RLS test senaryolarını çalıştır',
  'Anon, authenticated owner ve allowlist dışı kullanıcı davranışlarını ayrı ayrı doğrula.',
  'todo',
  'high',
  null,
  null,
  10
from pg_temp.s05_seed_context as context
on conflict (id) do nothing;

insert into public.notes (
  id,
  owner_id,
  project_id,
  title,
  excerpt,
  content,
  category,
  tags,
  status,
  visibility,
  publish_state,
  publish_candidate
)
select
  '51000000-0000-4000-8000-000000000004'::uuid,
  context.owner_id,
  '51000000-0000-4000-8000-000000000001'::uuid,
  'Owner aktivasyon kontrol listesi',
  'Owner UUID, aktif profil ve MFA kararı doğrulanmadan Studio Auth sprintine geçme.',
  'Bu private development notu anonymous kullanıcı tarafından okunamamalıdır.',
  'Güvenlik',
  array['owner', 'auth', 'mfa']::text[],
  'active',
  'private'::public.app_visibility,
  'draft'::public.app_publish_state,
  false
from pg_temp.s05_seed_context as context
on conflict (id) do nothing;

commit;
