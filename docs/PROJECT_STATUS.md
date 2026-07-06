# Proje Durumu

Son güncelleme: 2026-07-07

## İşaretler
- `[ ]` Başlamadı
- `[~]` Devam ediyor
- `[x]` Branch içinde tamamlandı
- `[m]` Main'e merge edildi
- `[!]` Blocker / dikkat gerekiyor

## Mevcut Faz

**Faz 2 — Teknik Temel ve Proje İskeleti**

- [x] Proje ana dokümanı PDF olarak hazırlandı
- [x] Next.js + React + TypeScript projesi oluşturuldu
- [x] App Router, Tailwind CSS ve ESLint kuruldu
- [x] Inter ve JetBrains Mono bağlandı
- [x] Palet 2 varsayılan tema token'ları eklendi
- [x] Palet 1 ve Palet 3 alternatif token'ları eklendi
- [x] Public rota iskeletleri oluşturuldu
- [x] Login ve Studio kabuk rotaları oluşturuldu
- [x] Canlı proje takip belgeleri oluşturuldu
- [x] Onaylı tasarım referansları repository'ye eklendi
- [m] GitHub repository oluşturuldu ve yerel `main`, `origin/main` ile senkron doğrulandı
- [m] Bootstrap commit `main` branch'ine gönderildi
- [m] Sprint 01 `feat/core-foundation` branch'i entegrasyon sürecine alındı
- [m] Sprint 01 `feat/public-site` branch'i entegrasyon sürecine alındı
- [m] Sprint 01 `feat/studio-shell` branch'i entegrasyon sürecine alındı
- [m] Sprint 01 Core foundation çalışması `main`e merge edildi
- [m] Sprint 01 Public site çalışması `main`e merge edildi
- [m] Sprint 01 Studio shell çalışması `main`e merge edildi
- [m] Sprint 01 entegrasyonunda `npm run lint`, `npm run typecheck` ve `npm run build` kontrolleri başarılı tamamlandı
- [!] `npm audit` güncel Next.js/PostCSS bağımlılıklarında orta seviye uyarılar gösterebilir; `npm audit fix --force` çalıştırılmayacak, resmi patch takip edilecek
- [!] Core branch içinde yanlışlıkla gelen `dasdasd` dosyası ve encoding bozuk `planlama/g#...` kopyaları entegrasyon aşamasında temizlenmiş olmalı
- [ ] Vercel preview / production deployment doğrulaması henüz tamamlanmadı

## Sprint 01 Entegrasyon Özeti

- Entegrasyon branch'i: `integration/sprint-01`
- Main başlangıç commit'i: `b7255e3`
- Merge sırası:
  1. `feat/core-foundation` (`c27a25d`)
  2. `feat/public-site` (`0c8acac`)
  3. `feat/studio-shell` (`80ef1a1`)
- Public ana menüde Studio görünmemeli; footer'daki küçük yönetici girişi kabul edilebilir.
- Hakkımda portresi doğrulanmış final portre gibi sunulmamalı; aday/doğrulama bekleyen görsel olarak kalmalı.
- Studio hâlâ mock/private çalışma alanı kabuğudur; gerçek Supabase Auth, MFA, PostgreSQL ve Storage sonraki fazlara bırakıldı.

## Sonraki Kilometre Taşı

Sprint 02 öncesinde orkestrasyon penceresi güncel `main`, bu durum dosyası, `docs/WORKSTREAMS.md`, `CHANGELOG.md` ve son handoff kayıtlarını okuyarak yeni iş paketlerini dağıtacak.
