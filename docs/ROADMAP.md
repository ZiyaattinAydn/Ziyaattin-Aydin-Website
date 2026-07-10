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
