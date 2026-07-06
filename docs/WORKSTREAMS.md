# Çalışma Hatları

## Pencere 1 — Teknik Temel
- Branch: `feat/core-foundation`
- Durum: `[x]`
- Sahiplik: ortak UI, tema, config, kalite araçları, PWA başlangıcı

## Pencere 2 — Public Site
- Branch: `feat/public-site`
- Durum: `[ ]`
- Sahiplik: public rotalar, sayfa blokları, responsive public deneyim

## Pencere 3 — Studio Kabuğu
- Branch: `feat/studio-shell`
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
