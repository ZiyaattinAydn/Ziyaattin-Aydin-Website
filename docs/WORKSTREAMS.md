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

## Sprint 03 Entegrasyon Geçmişi

### Pencere 1 — Core Foundation / Deployment
- Branch: `feat/core-deployment-s03`
- Durum: `[m]`
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
- `docs/deployment/**`


## Sprint 04 — Aktif Çalışma Hatları

### Pencere 1 — Core Foundation / Vercel
- Branch: `feat/core-vercel-s04`
- Durum: `[x]`
- Sahiplik: GitHub → Vercel otomatik deployment doğrulama kaydı, Vercel checklist güncellemesi, güvenli env kapısı, audit izleme
- Sprint 04 notu: Vercel Dashboard/CLI erişimi olmadığı için deployment bağlantısı `not verified`; gerçek Preview/Production URL doğrulaması entegrasyon/kullanıcı erişimi bekliyor

### Pencere 2 — Public Content
- Branch: Sprint 04 public branch'i orkestrasyon tarafından atanacak
- Durum: `[ ]`
- Sahiplik: public içerik/deployment sonrası route doğrulama notları; Core deployment dosyalarına gereksiz dokunmamalı

### Pencere 3 — Studio Data
- Branch: Sprint 04 studio branch'i orkestrasyon tarafından atanacak
- Durum: `[ ]`
- Sahiplik: Studio mock workflow doğrulama ve Faz 3 karar hazırlığı; gerçek Supabase/Auth implementasyonu yok

### Pencere 4 — Entegrasyon
- Branch: `integration/sprint-04`
- Durum: `[ ]`
- Sorumluluk: Sprint 04 branch'lerini inceleme, Vercel doğrulama durumunu takip etme, lint, type-check, build ve merge

### Pencere 5 — Orkestrasyon
- Kod branch'i yok
- Durum: `[ ]`
- Sorumluluk: Sprint 04 çalışma hatlarını güncel takip dosyalarına göre bölmek ve prompt üretmek
