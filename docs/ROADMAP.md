# Yol Haritası

- [m] Faz 0 — Fonksiyonel planlama
- [x] Faz 1 — Görsel yön ve tasarım referansları
- [~] Faz 2 — Teknik temel ve proje iskeleti
  - [m] Sprint 01 Core/Public/Studio iskelet entegrasyonu
  - [x] Sprint 02 Core workspace root, metadata ve UI primitive düzeni branch içinde tamamlandı
  - [!] Vercel preview bağlantısı henüz kurulmadığı için Faz 2 tamamen kapanmadı
- [ ] Faz 3 — Auth ve güvenlik temeli
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
