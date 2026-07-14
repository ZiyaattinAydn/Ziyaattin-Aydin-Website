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

## Sprint 06 Core Sonrası Durum

- Faz 3 Auth ve güvenlik temeli: `[~]`
- Supabase SSR/runtime foundation: `[x]`
- Environment fail-closed sınırı: `[x]`
- Browser/server/Proxy client altyapısı: `[x]`
- Studio trusted user + active owner + current `aal2` helper'ı: `[x]`
- Development Supabase project kurulumu: `[ ]`
- SQL migration ve development seed: `[ ]`
- Login/password ve TOTP UI: `[ ]`
- Studio server layout entegrasyonu: `[ ]`
- Public database adapter/cutover: `[ ]`
- Production Supabase project/env/migration: `[!] ayrı onay gerekli`

## Sprint 06 — Public Data Access Hazırlığı

- [x] Public repository interface ve canonical DTO sınırı
- [x] Mock repository adapter ve mevcut production mock davranışının korunması
- [x] Dependency-free Supabase query-reader ve explicit query mapping
- [x] Visibility/notFound/approval policy testleri
- [x] Production source'un mock'a kilitlenmesi
- [ ] Core Supabase reader ile Integration wiring
- [ ] Public profile/contact/social/portrait için kesin database şeması
- [ ] Gerçek Public database cutover
- [ ] Cache/revalidation ve slug history/redirect implementasyonu

## Sprint 06 Studio — S06_STUDIO_ROADMAP

Auth/MFA kodu hazır. Sprint kapanışı için development Supabase migration + seed,
owner activation, RLS matrisi ve Vercel Preview login/TOTP/logout testleri gerekir.
Production Supabase ve geniş Studio CRUD sonraki onaylı fazlara bırakılmıştır.



## Sprint 06 Studio Auth/MFA sonucu — S06_STUDIO_OK

- [x] Development Supabase project, schema, RLS ve Storage baseline
- [x] Owner email/password ve zorunlu TOTP MFA
- [x] Server-side current AAL2 Studio route guard
- [x] Local ve Vercel Preview kabul testleri
- [x] MFA recovery/reset ve ikinci faktör yaklaşımı
- [~] Faz 3 devam ediyor: production cutover ve geniş CRUD sonraki sprintlerde

## Sprint 06 Integration Sonrası — S06_INTEGRATION_ROADMAP

Sıradaki zorunlu adımlar:

1. Kullanıcı main merge onayı
2. Integration branch'in main'e kontrollü merge'i
3. Main final kalite kapıları
4. Main push
5. Production deployment doğrulaması

Sonraki sprint adayları:

- Production Supabase hazırlığı
- Public database cutover
- Geniş Studio CRUD
- PWA
- Audit advisory için güvenli upstream güncelleme

## Sprint 07 — Public Project Read Doğrulaması

- [x] Core project domain teslim önkoşulu
- [x] Core server Supabase client → PublicQueryReader wiring
- [x] Project-only non-production source activation
- [x] Explicit project list/detail query ve public-safe mapper testleri
- [x] Generic database unavailable UI sınırı
- [x] Development verification runbook ve hosted verifier
- [x] Local development hosted Supabase kabul sonucu
- [ ] Vercel Preview project list/detail kabul sonucu — Integration aşamasına devredildi
- [ ] Production Public database cutover — kapsam dışı
- [ ] Writings/journey/profile database cutover — kapsam dışı
