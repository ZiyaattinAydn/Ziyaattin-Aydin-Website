# Studio Storage Policy Runbook — Hosted Supabase

## Neden ayrı runbook var?

Development project üzerinde SQL Editor oturumu postgres rolüyle çalıştı.
storage.objects relation sahibi supabase_storage_admin olarak doğrulandı ve
postgres bu role geçemedi. Bu nedenle doğrudan CREATE POLICY komutları
SQLSTATE 42501 (must be owner of relation objects) hatası verdi.

Managed storage relation ownership veya role üyeliği değiştirilmez.
Bucket tanımları 202607100004_storage_setup.sql ile kurulur; policy'ler
Supabase Dashboard içindeki Storage → Policies → OBJECTS ekranından eklenir.

## Ortak owner koşulları

Public bucket owner koşulu:

~~~sql
bucket_id = 'public-assets'
and (select private.is_current_user_owner())
and (storage.foldername(name))[1] = (select auth.uid())::text
~~~

Private bucket owner koşulu:

~~~sql
bucket_id = 'private-files'
and (select private.is_current_user_owner())
and (storage.foldername(name))[1] = (select auth.uid())::text
~~~

## Policy matrisi

| Policy | Operation | Roles | Expression |
| --- | --- | --- | --- |
| public_assets_public_read | SELECT | anon, authenticated | USING: bucket_id = 'public-assets' |
| public_assets_owner_insert | INSERT | authenticated | WITH CHECK: public owner koşulu |
| public_assets_owner_update | UPDATE | authenticated | USING + WITH CHECK: public owner koşulu |
| public_assets_owner_delete | DELETE | authenticated | USING: public owner koşulu |
| private_files_owner_read | SELECT | authenticated | USING: private owner koşulu |
| private_files_owner_insert | INSERT | authenticated | WITH CHECK: private owner koşulu |
| private_files_owner_update | UPDATE | authenticated | USING + WITH CHECK: private owner koşulu |
| private_files_owner_delete | DELETE | authenticated | USING: private owner koşulu |

## Bucket doğrulaması

~~~sql
select
  id,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
where id in ('public-assets', 'private-files')
order by id;
~~~

Beklenen:

- public-assets: public, 10485760 byte, JPEG/PNG/WebP/AVIF
- private-files: private, 26214400 byte, onaylı belge ve image MIME listesi

## Policy doğrulaması

~~~sql
select
  policyname,
  cmd,
  roles,
  qual,
  with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname in (
    'public_assets_public_read',
    'public_assets_owner_insert',
    'public_assets_owner_update',
    'public_assets_owner_delete',
    'private_files_owner_read',
    'private_files_owner_insert',
    'private_files_owner_update',
    'private_files_owner_delete'
  )
order by policyname;
~~~

Beklenen sonuç sekiz satırdır.

## Güvenlik sınırları

- storage schema relation ownership değiştirilmez.
- supabase_storage_admin rolü grant veya SET ROLE ile zorlanmaz.
- Service role veya secret key normal upload/download akışında kullanılmaz.
- Public write ve tüm private işlemler active owner allowlist + auth.uid path
  prefix koşulunu geçmelidir.
- Production project için aynı adımlar ayrı kullanıcı onayı olmadan uygulanmaz.
