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
| `src/features/public/content` | Public içerik okuma ve filtreleme |
| `src/lib/auth`, `src/lib/supabase` | Oturum, yetki ve veritabanı bağlantısı |
| `supabase/migrations` | Veritabanı şeması, fonksiyonlar, RLS, Storage |

## Veri ve erişim

Studio işlemleri sunucuda oturum ve TOTP doğrulamasından geçiyor; Supabase RLS de sahiplik kontrolünü uyguluyor. Normal kayıt işlemlerinde service-role anahtarı kullanılmıyor.

Public site yalnız yayınlanmış/herkese açık veriyi alabiliyor. Gizli notlar ve görevler public içerik kaynağı değil. Production'da örnek içeriklerden gerçek veriye geçiş henüz tamamlanmadı.

## Ortamlar

- **Yerel ve Preview:** Geliştirme Supabase projesi.
- **Production:** Vercel'de dağıtım var; ayrı Production Supabase henüz kurulmadı.

Deployment başarılı olması, Production'da Studio girişinin çalıştığı anlamına gelmiyor. Ortam değişkenleri [burada](deployment/ENVIRONMENT.md), veritabanı adımları [burada](../supabase/README.md).
