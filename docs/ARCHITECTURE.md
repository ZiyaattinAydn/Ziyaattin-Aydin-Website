# Mimari

Next.js App Router kullanıyorum. Herkese açık site ve özel çalışma alanı aynı projede.

| Konum | İçerik |
| --- | --- |
| `src/app/(public)` | Portföy, projeler, yazılar, hakkımda |
| `src/app/(auth)` | Giriş, MFA, çıkış |
| `src/app/(studio)` | Özel çalışma alanı |
| `src/features/projects` | Proje veri modeli ve işlemleri |
| `src/features/writings` | Yazı yönetimi |
| `src/features/studio/tasks` | Görev takibi |
| `src/features/studio/journey` | Yolculuğum kayıtları, taslak/yayın yönetimi |
| `src/features/studio/profile` | Özel profil taslağı, onaylı biyografi ve iletişim yönetimi |
| `src/features/studio/library` | Özel not, dosya ve medya araçları |
| `src/features/public/content` | Public içerik okuma ve filtreleme |
| `src/lib/auth`, `src/lib/supabase` | Oturum, yetki ve veritabanı bağlantısı |
| `supabase/migrations` | Veritabanı şeması, fonksiyonlar, RLS, Storage |

## Veri ve erişim

Studio işlemleri sunucuda oturum ve TOTP doğrulamasından geçiyor; Supabase RLS de sahiplik kontrolünü uyguluyor. Normal kayıt işlemlerinde service-role anahtarı kullanılmıyor.

Public site yalnız yayınlanmış/herkese açık veriyi alabiliyor. Gizli notlar ve görevler public içerik kaynağı değil. Public sorgular oturum çerezi almayan anonim bir istemci kullanır; yalnız public + published + yayın tarihi olan kayıtlar okunur. Bilinen geliştirme kayıtları ayrıca dışlanır. Eksik yapılandırma örnek veri üretmez.

Public Hakkımda ve footer profili ayrı anonim Supabase istemcisiyle okur; Studio çerezleri public sorgulara geçmez. `site_profiles` kaydı yalnız owner+AAL2 oturumuyla düzenlenir ve açık yayın onayına kadar anonimlere görünmez.

## Ortamlar

- **Yerel, Preview ve Production:** Aynı Supabase projesi; ortamlar için ayrı bir proje açılmadı.

Studio 1.0 giriş/TOTP/çıkış akışı Preview ve Production’da kullanıcı tarafından doğrulandı. Ortam değişkenleri [burada](deployment/ENVIRONMENT.md), veritabanı adımları [burada](../supabase/README.md).
