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
