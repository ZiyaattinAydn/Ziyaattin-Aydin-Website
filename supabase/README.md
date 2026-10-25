# Supabase

Bu klasör Kişisel Sistemim'in SQL dosyalarını içeriyor. Geliştirme projesinin şeması kurulmuş durumda; Production için ayrı bir Supabase projesi henüz hazırlanmadı.

## SQL dosyaları

| Dosya | İçerik |
| --- | --- |
| `migrations/202607100001_initial_schema.sql` | Tablolar ve veri tipleri |
| `migrations/202607100002_database_functions.sql` | Fonksiyonlar ve trigger'lar |
| `migrations/202607100003_rls_policies.sql` | Erişim kuralları |
| `migrations/202607100004_storage_setup.sql` | Dosya bucket'ları |
| `seed/202607100001_development_seed.sql` | Yalnız development örnek kayıtları |
| `rollback/202607100001_rollback_sprint_05.sql` | Veri silen geri alma dosyası |

Başlangıçtaki dört migration belirtilen sırayla uygulanmalı. Daha önce kurulmuş bir projede bu dosyaları körlemesine yeniden çalıştırma; önce canlı şemayı kontrol et. Yeni değişikliklerde ayrı migration kullan.

Ayrıntılı adımlar: [Migration notları](../docs/supabase/MIGRATION_RUNBOOK.md).

## Veriler

`owner_profiles`, `projects`, `writings`, `journey_items`, `tasks`, `notes`, `files` ve `publish_queue` tabloları var.

Giriş yapan herkes Studio sahibi sayılmıyor. Yetki, Supabase Auth kullanıcısına bağlı aktif `owner_profiles` kaydıyla veriliyor. Owner rolünü istemci verisinden atamıyoruz.

Public okuma yalnız yayınlanmış/herkese açık proje, yazı ve yolculuk kayıtları için mümkün. Görev, not ve özel dosyalar yalnız sahibine açık.

## Storage

- `public-assets`: Onaylı görseller. Public okuma; yükleme/değiştirme yalnız owner.
- `private-files`: Kişisel dosyalar. Okuma ve yazma yalnız owner.

Dosya yolları ilgili kullanıcının UUID'siyle başlamalı. Mevcut boyut sınırları public bucket için 10 MiB, private bucket için 25 MiB. Barındırılan Storage policy kurulumu için [Storage notlarına](../docs/studio/STUDIO_STORAGE_POLICY_RUNBOOK.md) bak.

## Owner hesabı

SQL paketinin kendisi bir Auth hesabı oluşturmaz. İlk owner hesabı Supabase Dashboard üzerinden oluşturulduktan sonra `owner_profiles` satırının ilgili UUID'ye ait olduğu doğrulanır. Profil yetkisini yalnız güvenilir yönetim oturumundan ver.

MFA kurtarma adımları [burada](../docs/studio/STUDIO_MFA_RECOVERY_RUNBOOK.md).

## Kontrol

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

```sql
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Production'da migration veya seed çalıştırmadan önce doğru ortamı, verilerin yedeğini ve etkilenebilecek kayıtları doğrula. Geliştirme seed'i Production'a taşınmaz.
