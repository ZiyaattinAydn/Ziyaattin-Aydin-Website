# Yol Haritası

- [m] Faz 0 — Fonksiyonel planlama
- [x] Faz 1 — Görsel yön ve tasarım referansları
- [~] Faz 2 — Teknik temel, proje iskeleti ve deployment hazırlığı
  - [m] Sprint 01 Core/Public/Studio iskelet entegrasyonu
  - [m] Sprint 02 Core/Public/Studio geliştirmeleri ve entegrasyonu
  - [x] Sprint 03 Core deployment checklist ve environment sözleşmesi branch içinde hazırlandı
  - [!] Vercel preview / production gerçek URL doğrulaması tamamlanmadığı için Faz 2 tamamen kapanmadı
- [ ] Faz 3 — Auth ve güvenlik temeli
  - [ ] Supabase Auth provider kararı
  - [ ] MFA yöntemi kararı
  - [ ] Studio route guard stratejisi
  - [ ] Storage bucket ve RLS yaklaşımı
  - [ ] Public publish workflow kararı
- [ ] Faz 4 — Studio proje çekirdeği
- [ ] Faz 5 — Not ve Bilgi Kütüphanesi
- [ ] Faz 6 — Dosya ve depolama sistemi
- [ ] Faz 7 — Yayın altyapısı ve gerçek public içerik
- [ ] Faz 8 — PWA ve mobil iyileştirme
- [ ] Faz 9 — Export, backup ve operasyon
- [ ] Faz 10 — Test ve güvenlik sertleştirmesi
- [ ] Faz 11 — Production v1.0

## Sprint 02 Sonrası Durum Notu

- Faz 2: `[~]` — Teknik temel ve public/studio mock kabukları ilerledi; Vercel doğrulaması yapılmadıysa faz tamamen kapanmış sayılmamalı.
- Faz 3: `[ ]` — Supabase Auth, MFA, PostgreSQL, Storage, RLS ve route guard kararları henüz başlatılmadı.
- Workspace root uyarısı: `[m]` — `turbopack.root: process.cwd()` sonrası integration build çıktısında multiple lockfile uyarısı görünmedi.

## Sprint 03 Sonrası Durum Notu

- Faz 2: `[~]` — Deployment readiness dokümantasyonu hazırlandı; Vercel gerçek preview / production doğrulaması yapılmadıysa faz tamamen kapanmış sayılmamalı.
- Faz 3: `[ ]` — Supabase Auth, MFA, PostgreSQL, Storage, RLS ve route guard gerçek implementasyonu henüz başlatılmadı.
- Faz 3 karar hazırlığı: `[x]` — Environment contract, public content contract, Studio data model draft ve auth decision başlıkları dokümante edildi.

## Sprint 04 Sonrası Durum Notu

- Faz 2: `[~]` — GitHub → Vercel automatic Preview Deployment doğrulandı; Production Deployment main push sonrasında ayrıca doğrulanmalıdır.
- Faz 3 karar hazırlığı: `[x]` — Public publish flow, Studio Auth karar matrisi, Security/RLS planı ve Studio publish flow hazırlandı.
- Supabase gerçek implementasyonu: `[ ]`
- Auth ve MFA gerçek implementasyonu: `[ ]`
- PostgreSQL, Storage, RLS ve route guard implementasyonu: `[ ]`
- Production URL doğrulaması başarısız veya erişilemezse Faz 2 tamamen kapanmış sayılmamalıdır.

## Sprint 05 — Faz 3 Mimari Hazırlık Notu

- [x] Supabase mimari/environment/server-client/session-guard/runbook sözleşmeleri branch içinde hazırlandı.
- [x] Sprint 06 kullanıcı karar kapısı hazırlandı.
- [ ] Supabase project oluşturma ve gerçek env değerleri kullanıcı onayı bekliyor.
- [ ] Auth/MFA/Proxy/route guard implementasyonu başlamadı.
- [ ] Studio SQL paketi gerçek Supabase project'inde uygulanmadı.
- [ ] Public ve Studio mock veri geçişi başlamadı.

Faz 3 yalnız mimari hazırlık düzeyinde `[~]` kabul edilmelidir; gerçek Auth ve güvenlik implementasyonu tamamlanmış sayılmaz.

## Sprint 05 Sonrası Durum

- Faz 4 mimari hazırlık: `[m]`
- Public database transition sözleşmesi: `[m]`
- Supabase SQL schema/RLS/Storage tasarımı: `[m]`
- SQL gerçek Supabase projesine uygulanması: `[ ]`
- Auth ve MFA implementasyonu: `[ ]`
- RLS gerçek proje testi: `[ ]`
- Storage bucket oluşturma: `[ ]`
- Studio route guard ve CRUD: `[ ]`
- Sprint 06 başlangıcı: `[!] USER_APPROVAL_REQUIRED`
