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

## Pencere 2 — Public Site
- Branch: `feat/public-data-transition-s05`
- Durum: `[x]`
- Sahiplik: public database mapping, anonymous visibility, query/fallback, approval ve mock migration sözleşmeleri
- Not: Sprint 05 dokümantasyon sözleşmesi branch içinde tamamlandı; gerçek database geçişi, Supabase sorgusu ve publish CRUD `[ ]`.
