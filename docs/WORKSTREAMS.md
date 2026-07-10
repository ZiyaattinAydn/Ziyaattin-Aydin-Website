<<<<<<< HEAD
# Çalışma Hatları

## Sprint 01 Entegrasyon Geçmişi
- Core Foundation: `[m]` — `feat/core-foundation`
- Public Site: `[m]` — `feat/public-site`
- Studio Shell: `[m]` — `feat/studio-shell`
- Integration Sprint 01 + Studio Fix: `[m]` — `integration/sprint-01-studio-fix`

## Pencere 1 — Teknik Temel
- Branch: `feat/core-foundation-s02`
- Durum: `[x]`
- Sahiplik: ortak UI, tema, config, kalite araçları, PWA başlangıcı
- Sprint 02 notu: workspace root uyarısı incelendi, metadata/site config düzenlendi, `ProgressBar` ve `SectionShell` eklendi

## Pencere 2 — Public Site
- Branch: `feat/public-content-s03`
- Durum: `[x]`
- Sahiplik: public rotalar, mock içerik modeli, yayın/görünürlük sözleşmesi, link güvenliği
- Not: Sprint 03 branch içinde tamamlandı; gerçek database/publish akışı başlatılmadı.

## Pencere 2 — Public Site
- Branch: `feat/public-site-s02`
- Durum: `[ ]`
- Sahiplik: public rotalar, sayfa blokları, responsive public deneyim

## Pencere 3 — Studio Kabuğu
- Branch: `feat/studio-shell-s02`
- Durum: `[ ]`
- Sahiplik: login, Studio layout, dashboard ve modül kabukları

## Pencere 4 — Entegrasyon
- Branch: `main` veya kısa ömürlü `integration/*`
- Durum: `[ ]`
- Sorumluluk: inceleme, conflict çözümü, lint, type-check, build ve merge

## Pencere 5 — Orkestrasyon
- Kod branch'i yok
- Durum: `[ ]`
- Sorumluluk: güncel takip dosyalarını okuyup iş paketlerini bölmek ve diğer pencerelere prompt üretmek

## Ortak Dosya Sahipliği

Aşağıdaki dosyalara aynı anda birden fazla geliştirme branch'i dokunmamalıdır:
- `package.json`
- `package-lock.json`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `next.config.*`
- `eslint.config.*`
- `src/components/ui/**`
- `src/components/layout/**`
- `src/lib/site-config.ts`
=======
# Çalışma Hatları

## Pencere 1 — Teknik Temel
- Branch: `feat/core-foundation`
- Durum: `[m]`
- Sahiplik: ortak UI, tema, config, kalite araçları, PWA başlangıcı
- Sprint 01 sonucu: tema token'ları, layout/header/footer iyileştirmeleri ve ortak UI primitive'leri main'e alındı

## Pencere 2 — Public Site
- Branch: `feat/public-site`
- Durum: `[m]`
- Sahiplik: public rotalar, sayfa blokları, responsive public deneyim
- Sprint 01 sonucu: public ana sayfa, proje/yazı liste ve detay sayfaları, journey/about düzenlemeleri main'e alındı

## Pencere 3 — Studio Kabuğu
- Branch: `feat/studio-shell`
- Durum: `[m]`
- Sahiplik: login, Studio layout, dashboard ve modül kabukları
- Sprint 01 sonucu: login placeholder'ı, Studio dashboard ve modül kabukları mock workflow seviyesinde main'e alındı

## Pencere 4 — Entegrasyon
- Branch: `integration/sprint-01`
- Durum: `[m]`
- Sorumluluk: inceleme, conflict çözümü, lint, type-check, build ve merge
- Sprint 01 sonucu: Core, Public ve Studio branch'leri merge sırasına göre entegre edildi

## Pencere 5 — Orkestrasyon
- Kod branch'i yok
- Durum: `[~]`
- Sorumluluk: güncel takip dosyalarını okuyup iş paketlerini bölmek ve diğer pencerelere prompt üretmek
- Sonraki adım: Sprint 02 için Core/Public/Studio/Entegrasyon görev prompt'larını güncel `main` üzerinden hazırlamak

## Ortak Dosya Sahipliği

Aşağıdaki dosyalara aynı anda birden fazla geliştirme branch'i dokunmamalıdır:
- `package.json`
- `package-lock.json`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `next.config.*`
- `eslint.config.*`

## Sprint 02 İçin Dikkat

- Public içerik geliştirmeleri `src/app/(public)`, `src/components/public` ve `src/data/mock-content.ts` çevresinde tutulmalı.
- Studio geliştirmeleri `src/app/(studio)`, `src/components/studio` ve `src/features/studio` çevresinde tutulmalı.
- Core değişiklikleri ortak UI primitive, tema token'ları, layout ve config sınırında kalmalı.
- Supabase/Auth/MFA/PostgreSQL/Storage gerçek implementasyonu ayrı sprint kararı olmadan başlatılmamalı.
- Hakkımda portresi kullanıcı tarafından doğrulanmadan final kabul edilmemeli.
>>>>>>> origin/feat/public-site-s02

## Sprint 02 Entegrasyon Sonucu

- Core Sprint 02 — `feat/core-foundation-s02`: `[m]`
- Public Sprint 02 — `feat/public-site-s02`: `[m]`
- Studio Sprint 02 — `feat/studio-shell-s02`: `[m]`
- Entegrasyon Sprint 02 — `integration/sprint-02`: `[m]`
- Orkestrasyon: `[~]`

Notlar:
- Core ortak config, site config ve UI primitive güncellemeleri main'e alınmaya hazırlandı.
- Public mock content modeli ve detay sayfası render akışı main'e alınmaya hazırlandı.
- Studio mock workflow veri katmanı ve modül sayfaları main'e alınmaya hazırlandı.
- Gerçek Auth/Supabase/Storage/CRUD kapsamı Sprint 02'de bilinçli olarak başlatılmadı.
