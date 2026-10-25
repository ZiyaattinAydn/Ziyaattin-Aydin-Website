# Veritabanı değişiklikleri

Geliştirme veritabanı daha önce SQL Editor üzerinden kurulmuş. Şema mevcut olsa da Supabase migration geçmişi boş görünebilir; bu nedenle dosyaları tekrar çalıştırmadan önce gerçek şemayla karşılaştırmak gerekiyor.

## Çalışma sırası

1. Hedef projenin development mı Production mı olduğunu kontrol et.
2. Mevcut şema ve kritik verileri yedekle. Production'da backup alınmadan ilerleme.
3. `supabase/migrations/` dosyalarını sırayla incele. İlk kurulum sırası:
   - `202607100001_initial_schema.sql`
   - `202607100002_database_functions.sql`
   - `202607100003_rls_policies.sql`
   - `202607100004_storage_setup.sql`
4. Yeni değişiklik için daha önce çalıştırılmış SQL'i değiştirmek yerine yeni migration ekle.
5. RLS, izinler, owner Auth hesabı, MFA ve Storage policy'lerini doğrula.
6. Preview uygulamasında gerçek kayıt oluşturma/okuma/değiştirme ve yetkisiz erişim testleri yap.
7. Production'a yalnız doğrulanmış migration ve geri dönüş planıyla geç.

Storage policies bazı barındırılan Supabase kurulumlarında SQL Editor'dan uygulanamayabilir; ayrıntılar `docs/studio/STUDIO_STORAGE_POLICY_RUNBOOK.md` dosyasında.

## Güvenlik

- `tasks`, `notes`, `files` ve `publish_queue` herkese açık değil.
- Public okuma yalnız `published + public` içeriklerde.
- Normal Studio işlemleri kullanıcı oturumu ve RLS kullanır.
- Service-role anahtarı normal CRUD için kullanılmaz.
- `supabase/rollback/` içindeki dosya veri kaybına yol açabilir; Production'da deneme amaçlı çalıştırılmaz.

## Not ve dosya korumaları

`studio_library_guards` migration'ı mevcut kayıtları değiştirmez; özel not yazımını, dosya görünürlüğünü ve arşiv geçmişini koruyan ek policy/trigger'lar kurar. Öncesinde not/dosya satırları ile mevcut policy/trigger tanımları repo dışındaki özel yerel yedeğe alındı. İzole PGlite testinde sentetik not ve dosya metadata'sının yedekten geri kurulması doğrulanır; canlı verilerle restore testi yapılmaz.

Ücretsiz planda düzenli `supabase db dump` çıktısı ve Storage dosyalarının ayrı bir kopyası kullanıcı kontrolünde, repo dışında saklanmalı. Veritabanı yedeği Storage nesnelerinin içeriğini kapsamaz. Bu görevde ücretli yedekleme veya PITR açılmaz. Canlı arşivleri geri almak için veri silen rollback kullanılmaz; gerekirse yeni bir düzeltme migration'ı hazırlanır.
