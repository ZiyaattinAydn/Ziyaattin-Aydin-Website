# Katkı ve Geliştirme Akışı

**Tek iş, tek branch, tek inceleme.** Önceden kullanılan beş sohbet, ayrı dosya sahipliği ve integration branch modeli kaldırıldı.

1. Güncel main üzerinden kısa ömürlü `feat/...`, `fix/...` veya `chore/...` dalı aç.
2. Gereken UI + API + veri + test + doküman değişikliğini aynı dalda yap.
3. `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build` ve ilgili testleri çalıştır.
4. Vercel Preview'ı kontrol et. Auth/MFA ve RLS etkilendiyse gerçek uygulama kabul testleri yap.
5. Gözden geçirilen değişikliği PR ile `main`e al; Production READY ve temel rotaları doğrula.
6. Birleşmiş kısa ömürlü dalları sil; uzun ömürlü sprint veya orkestrasyon dalları üretme.

Gizli değerler yalnız güvenli environment ayarlarında tutulur. Production Supabase işlemleri öncesi ayrı proje, migration, backup ve erişim kontrolleri şarttır.
