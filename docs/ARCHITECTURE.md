# Mimari ve Operasyon Özeti

## Yerleşim
- `src/app/(public)`: herkese açık marka/portföy rotaları.
- `src/app/(auth)`: login, MFA ve çıkış.
- `src/app/(studio)`: yalnız owner kullanımı için Studio arayüzleri.
- `src/features/projects`, `src/features/writings`: doğrulama, yayın durumları, server mutation.
- `src/features/studio/tasks`: özel görev okuma, oluşturma, tamamlama ve arşiv.
- `src/features/public/content`: Public veri kaynağı seçimi ve güvenli görünürlük filtresi.
- `src/lib/auth` ve `src/lib/supabase`: tek kullanıcı, AAL2, SSR auth ve güvenli veri istemcileri.
- `supabase/migrations`: şema, fonksiyon, RLS ve Storage sözleşmesi.

## Güvenlik
Studio her işlemde güvenilir server user, aktif owner profili, current `aal2`, owner filtreleri ve veritabanı RLS ile korunur. Proxy tek başına yetkilendirme değildir. Browser bundle'a secret taşınmaz. Public içerik yalnız onaylanmış ve yayınlanmış alanlardan türetilir.

## Dağıtım
GitHub `main` -> Vercel Production; kısa ömürlü PR dalı -> Preview.
Development Supabase: `atrphakkgpqtoqdigggt`; development/Preview için kullanılır. Production Supabase **ayrı** kurulmalıdır. Vercel'in başarılı build durumu, Studio veya login'in Production'da çalıştığı anlamına gelmez.

## Ürün sınırı
- Görevler yalnız kişisel Studio verisidir.
- Not ve dosya ekranları hâlâ mock; şema mevcut olsa da CRUD yok.
- Public site üzerinde örnek içerik üretim anlatısı yerine gerçek içerik geçişi gereklidir.
- PWA henüz uygulanmadı.
- Eski handoff belgeleri kod deposundan çıkarılmıştır; gerektiğinde git history üzerinden bulunur.

Yeni ekip düzeni yok: işi alan tek akış tüm gerekli katmanları birlikte bitirir.
