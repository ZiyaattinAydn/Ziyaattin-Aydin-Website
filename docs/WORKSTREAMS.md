# Çalışma Hatları

## Sprint 01 Entegrasyon Geçmişi
- Core Foundation: `[m]` — `feat/core-foundation`
- Public Site: `[m]` — `feat/public-site`
- Studio Shell: `[m]` — `feat/studio-shell`
- Integration Sprint 01 + Studio Fix: `[m]` — `integration/sprint-01-studio-fix`

## Sprint 02 Entegrasyon Geçmişi
- Core Foundation: `[m]` — `feat/core-foundation-s02`
- Public Site: `[m]` — `feat/public-site-s02`
- Studio Shell: `[m]` — `feat/studio-shell-s02`
- Integration Sprint 02: `[m]` — kullanıcı tarafından verilen bağlama göre son main commit `e77d2d1`

## Sprint 03 — Aktif Çalışma Hatları

### Pencere 1 — Core Foundation / Deployment
- Branch: `feat/core-deployment-s03`
- Durum: `[x]`
- Sahiplik: deployment dokümantasyonu, environment sözleşmesi, audit izleme, Faz 3 karar hazırlığı
- Sprint 03 notu: Vercel checklist ve env sözleşmesi hazırlandı; gerçek Vercel doğrulaması yapılmadı; Supabase/Auth implementasyonu başlatılmadı

### Pencere 2 — Public Content
- Branch: `feat/public-content-s03`
- Durum: `[ ]`
- Sahiplik: public içerik düzeni, mock content genişletme, kullanıcı onayı gerektiren public detaylar

### Pencere 3 — Studio Data
- Branch: `feat/studio-data-s03`
- Durum: `[ ]`
- Sahiplik: Studio mock workflow, veri model kararı hazırlığı, gerçek Supabase başlamadan önce UI/data hazırlığı

### Pencere 4 — Entegrasyon
- Branch: `integration/sprint-03`
- Durum: `[ ]`
- Sorumluluk: Sprint 03 branch'lerini inceleme, conflict çözümü, lint, type-check, build ve merge

### Pencere 5 — Orkestrasyon
- Kod branch'i yok
- Durum: `[ ]`
- Sorumluluk: güncel takip dosyalarını okuyup iş paketlerini bölmek ve diğer pencerelere prompt üretmek

## Ortak Dosya Sahipliği

Aşağıdaki dosyalara aynı anda birden fazla geliştirme branch'i dokunmamalıdır:
- `package.json`
- `package-lock.json`
- `.env.example`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `next.config.*`
- `eslint.config.*`
- `src/components/ui/**`
- `src/components/layout/**`
- `src/lib/site-config.ts`

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

## Sprint 03 Entegrasyon Sonucu

- Core Sprint 03 — `feat/core-deployment-s03`: `[m]`
- Public Sprint 03 — `feat/public-content-s03`: `[m]`
- Studio Sprint 03 — `feat/studio-data-s03`: `[m]`
- Entegrasyon Sprint 03 — `integration/sprint-03`: `[m]`
- Orkestrasyon: `[~]`

Notlar:
- Core deployment checklist, environment contract ve deployment readiness dokümantasyonu main'e alınmaya hazırlandı.
- Public content contract ve mock publish hazırlıkları main'e alınmaya hazırlandı.
- Studio data model draft ve auth decision dokümanları main'e alınmaya hazırlandı.
- Gerçek Auth/Supabase/Storage/CRUD kapsamı Sprint 03'te bilinçli olarak başlatılmadı.

## Sprint 04 Entegrasyon Sonucu

- Core Sprint 04 — `feat/core-vercel-s04`: `[m]`
- Public Sprint 04 — `feat/public-publish-plan-s04`: `[m]`
- Studio Sprint 04 — `feat/studio-auth-plan-s04`: `[m]`
- Entegrasyon Sprint 04 — `integration/sprint-04`: `[m]`
- Orkestrasyon: `[~]`

Notlar:

- GitHub → Vercel automatic Preview Deployment doğrulandı.
- Node.js runtime 22.x olarak sabitlendi.
- Production Deployment main push sonrasında doğrulanacak.
- Public publish ve Studio Auth/RLS/Publish Flow karar hazırlıkları tamamlandı.
- Gerçek Supabase/Auth/Storage/CRUD implementasyonu Sprint 04 kapsamında yapılmadı.

## Sprint 05 Entegrasyon Sonucu

- Core Sprint 05 — `feat/core-supabase-architecture-s05`: `[m]`
- Public Sprint 05 — `feat/public-data-transition-s05`: `[m]`
- Studio Sprint 05 — `feat/studio-supabase-schema-s05`: `[m]`
- Entegrasyon Sprint 05 — `integration/sprint-05`: `[m]`
- SQL package prepared: `[m]`
- Gerçek Supabase implementasyonu: `[ ]`
- Kullanıcı karar kapısı: `[!]`

Notlar:

- SQL paketi repository içinde hazırlandı fakat gerçek Supabase projesinde çalıştırılmadı.
- Auth, MFA, middleware, route guard, CRUD, Storage upload ve gerçek publish implementasyonu başlamadı.
- Anonymous erişim yalnız published/public project, writing ve journey kayıtlarıyla sınırlandı.
- Sprint 06, `SPRINT_05_FINAL_DECISION_GATE.md` cevaplanmadan başlatılmamalıdır.

## Sprint 06 — Aktif Çalışma Hatları

### Pencere 1 — Core Supabase Runtime
- Branch: `feat/core-supabase-runtime-s06`
- Başlangıç: `main@0c9d1bb`
- Runtime commit: `6d51ff3`
- Durum: `[x]` — tamamlandı ve origin'e pushlandı
- Sahiplik: Supabase paketleri, env validation, browser/server clients, Proxy, ortak Auth/session helpers, runtime tests ve Core handoff

### Pencere 2 — Public Supabase Adapter
- Branch: `feat/public-supabase-adapter-s06`
- Durum: `[~]`
- Sahiplik: mock-first public repository sınırı ve güvenli database adapter hazırlığı

### Pencere 3 — Studio Supabase Uygulaması
- Durum: `[~]`
- Sahiplik: development project kurulumu, SQL/seed, owner Auth, Login/TOTP UI ve Studio entegrasyonu

### Sprint 06 ortak notları
- Production mevcut mock davranışını korur.
- Vercel Preview development Supabase project'e bağlanacaktır.
- Production Supabase env ve migration bu sprintte yapılmaz.
- Core Proxy nihai authorization değildir; Studio server layout ve mutation katmanı ortak helper'ı yeniden kullanmalıdır.

## Sprint 06 — Public Site

### Pencere 2 — Public Supabase Adapter

- Branch: `feat/public-supabase-adapter-s06`
- Başlangıç: `main@0c9d1bb`
- Durum: `[x]` — implementasyon, policy testleri, lint, typecheck, build ve audit incelemesi tamamlandı; commit, push ve Preview doğrulaması bekleniyor
- Sahiplik: `src/app/(public)/**`, `src/components/public/**`, `src/features/public/**`, `docs/content/**`, Public tracking ve handoff
- Production source: `mock`
- Supabase durumu: dependency-free adapter/query-reader sınırı hazır; Core reader entegrasyonu yapılmadı
- Yeni environment ihtiyacı: gelecekte server-only `PUBLIC_CONTENT_SOURCE=mock|supabase`; `.env.example` değiştirilmedi
- Gerçek database cutover: bu sprint kapsamında değil

## Studio Sprint 06 — S06_STUDIO_WORKSTREAM

- Kod: tamamlandı.
- Runtime foundation: Core `02f7c6a`.
- Development Supabase setup/migration/seed: kullanıcı Dashboard adımı bekliyor.
- Preview Auth/MFA/RLS kabul testi: development env sonrasında bekliyor.
- Geniş CRUD ve production cutover kapsam dışı.

## Studio Sprint 06 — S06_STUDIO_WORKSTREAM_OK

- Branch: feat/studio-auth-mfa-s06
- Core base: 02f7c6a
- Durum: [x] — development ve Preview kabulü tamamlandı
- Supabase development schema/RLS/Storage/seed: tamamlandı
- Owner email/password + zorunlu TOTP AAL2: tamamlandı
- Local ve Vercel Preview kabul testleri: tamamlandı
- Production Supabase/env/migration: kapsam dışı ve uygulanmadı
- Geniş CRUD, upload manager ve public cutover: kapsam dışı

## Sprint 06 Integration — S06_INTEGRATION_WORKSTREAM

- Branch entegrasyonu: tamamlandı
- Conflict çözümü: tamamlandı
- Birleşik kalite kapıları: tamamlandı
- Integration handoff: tamamlandı
- Continuity belgesi: tamamlandı
- Integration branch push: bu kapanış commit'inden sonra
- Main merge: kullanıcı onayı bekliyor
- Production doğrulaması: main push sonrasında

## Sprint 07 — Aktif Çalışma Hatları

Marker: `S07_WORKSTREAMS`

### Pencere 1 — Core Project Domain
- Branch: `feat/core-project-domain-s07`
- Base: `main@a870f02`
- Durum: `[x]` — ortak domain, validation, transition ve mutation sınırı branch içinde tamamlandı
- Sahiplik: `src/features/projects/**`, Project verifier, Core domain belgesi ve handoff

### Pencere 2 — Public Project Read
- Branch: `feat/public-project-read-s07`
- Base: `main@a870f02`
- Durum: `[~]`
- Sahiplik: Development Supabase Project read doğrulaması; Production source mock kalır

### Pencere 3 — Studio Project CRUD
- Branch: `feat/studio-project-crud-s07`
- Base: `main@a870f02`
- Durum: `[ ]` — Core tamamlandıktan sonra Core branch merge edilerek başlamalı
- Sahiplik: liste/create/edit UI, Server Actions ve mutation result feedback

### Pencere 4 — Integration
- Branch: `integration/sprint-07`
- Merge sırası: Core → Public → Studio → Integration
- Main merge/push öncesi açık kullanıcı onayı zorunlu

<!-- S07_STUDIO_PROJECTS_WORKSTREAM -->

## Sprint 07 — Public Project Read

### Pencere 2 — Public Site

- Branch: `feat/public-project-read-s07`
- Başlangıç: `main@a870f02`
- Core önkoşulu: `origin/feat/core-project-domain-s07@3a6cd87` — `S07_CORE_OK`
- Durum: `[x]` — implementation, hosted development kabulü, kalite kapıları, commit ve push tamamlandı; Preview doğrulaması Integration aşamasına devredildi
- Sahiplik: Public project read adapter wiring, project list/detail, policy/repository tests, development verification runbook ve Public handoff
- Production source: zorunlu `mock`
- Non-production source: yalnız `PUBLIC_CONTENT_SOURCE=supabase` ve iki mevcut public Supabase env değeri tam ise development project
- Kapsam dışı: mutation, Studio UI, writings/journey cutover, Storage, hard delete, slug history ve production database

## Studio Workstream — Sprint 07 Projects

- Branch: `feat/studio-project-crud-s07`
- Base: `a870f02`
- Core merge: `ffbe5fb`
- Implementation: `729e556`
- Durum: `[x] Branch içinde tamamlandı`
- Başarı: `S07_STUDIO_OK`

Tamamlanan:

- Project list
- Create draft
- Edit
- State transition controls
- Published slug lock
- Archive confirmation ve soft archive
- Local + Preview acceptance
- Secret ve hard-delete taraması

Integration merge sırası Core → Public → Studio olarak korunmalıdır.


## Sprint 07 Integration — S07_INTEGRATION_WORKSTREAM

- Core merge: tamamlandı
- Public merge: tamamlandı
- Studio merge: tamamlandı
- Conflict çözümü: tamamlandı
- Otomatik kalite kapıları: tamamlandı
- Hosted development kabulü: tamamlandı
- Preview kabulü: tamamlandı
- Integration handoff: tamamlandı
- Main merge: kullanıcı onayı bekliyor
