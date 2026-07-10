# Proje Durumu

Son güncelleme: 2026-07-07

## İşaretler
- `[ ]` Başlamadı
- `[~]` Devam ediyor
- `[x]` Branch içinde tamamlandı
- `[m]` Main'e merge edildi
- `[!]` Blocker / dikkat gerekiyor

## Mevcut Faz

**Faz 2 — Teknik Temel, Proje İskeleti ve Deployment Hazırlığı**

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
- [m] Sprint 01 Core Foundation `main`e alındı
- [m] Sprint 01 Public Site `main`e alındı
- [m] Sprint 01 Studio Shell `main`e alındı
- [m] Sprint 01 entegrasyonu ve Studio düzeltmesi `main`e alındı
- [m] Sprint 02 entegrasyonu kullanıcı tarafından verilen bağlama göre tamamlandı
- [m] Sprint 03 Core Deployment hazırlığı `main`e alındı
- [x] Vercel deployment checklist dokümantasyonu hazırlandı ve Sprint 04 otomatik GitHub → Vercel akışına göre güncellendi
- [x] Environment değişken sözleşmesi hazırlandı
- [!] Vercel Preview / Production gerçek URL üzerinden henüz doğrulanmadıysa deployment tamamlandı sayılmamalı
- [!] `npm audit` iki orta seviye uyarı göstermeye devam ediyor: doğrudan `next`, dolaylı `postcss` (`GHSA-qx2v-qp2m-jg93`). `npm audit fix --force` çalıştırılmadı ve çalıştırılmamalı
- [!] Supabase Auth, MFA, PostgreSQL, Storage, RLS ve gerçek route guard henüz başlamadı
- [!] Public ve Studio hâlâ mock veriyle çalışıyor
- [!] Hakkımda portresi ve gerçek iletişim/sosyal linkler kullanıcı onayı olmadan aktif edilmeyecek
- [x] Sprint 03 başlangıç `main` commit'i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `e77d2d1`
- [x] Sprint 04 başlangıç `main` commit'i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `d68fa15`
- [x] GitHub → Vercel otomatik deployment doğrulama kaydı oluşturuldu: `docs/deployment/DEPLOYMENT_VERIFICATION.md`
- [!] Vercel project bağlantısı, production branch, preview URL ve production URL bu ortamda doğrulanamadı; Vercel Dashboard/CLI erişimiyle manual verification required
- [!] Sandbox snapshot içinde `.git` metadata bulunmadığı için Git komutları burada tekrar çalıştırılamadı; gerçek worktree'de handoff öncesi `git rev-parse --short HEAD` ile son commit doğrulanmalı
- [x] Önceki Next.js workspace root / multiple lockfile uyarısı Sprint 02 sonrası yerel build bağlamına göre görünmüyor
- [ ] Vercel preview bağlantısı gerçek URL üzerinden doğrulanacak
- [ ] Vercel production bağlantısı gerçek URL üzerinden doğrulanacak

## Sprint 01 — Core Foundation

- [m] Palet 1, Palet 2 ve Palet 3 token'ları daha düzenli semantik değişkenlerle toparlandı
- [m] Global CSS temel erişilebilirlik, seçim, focus ve responsive overflow kuralları güçlendirildi
- [m] Ortak UI primitive seti genişletildi: `Button`, `LinkButton`, `SectionWrapper`, `EmptyState`, `StatCard`, `StatusBadge`
- [m] Mevcut `Panel`, `Tag` ve `PageIntro` uyumluluğu korunarak küçük geliştirmeler yapıldı
- [m] Public header mobil menü davranışı sade ve erişilebilir şekilde güçlendirildi
- [m] Public footer gerçekliği doğrulanmamış e-posta/GitHub/LinkedIn bilgilerini link olarak uydurmayacak şekilde düzenlendi
- [m] `package-lock.json` içinde özel/internal registry izi aranıp bulunmadı

## Sprint 02 — Core Foundation

- [m] Sprint 01 sonrası main başlangıç commit'i `62d5227` olarak kayda geçirildi
- [m] Next.js 16 yerel dokümanlarında Turbopack filesystem root davranışı incelendi
- [m] Workspace root uyarısı için repo içi çözüm olarak `next.config.ts` içinde `turbopack.root` proje köküne sabitlendi ve build worker sayısı `experimental.cpus: 4` ile sınırlandı
- [m] `package-lock.json`, `package.json` ve varsa `.npmrc` içinde özel/internal registry izi arandı; bulunmadı
- [m] Ortak UI primitive setine `ProgressBar` ve `SectionShell` eklendi
- [m] `src/lib/site-config.ts` içinde metadata, navigation, admin entry, contact ve social alanları daha güvenli yapılandırıldı
- [m] Root metadata `siteConfig` ile tutarlı hâle getirildi
- [m] Footer doğrulanmamış contact/social bilgilerini aktif link gibi göstermeyecek şekilde config tabanlı hale getirildi
- [!] `npm audit` çıktısındaki 2 moderate vulnerability izleniyor; zorla major downgrade/upgrade yapılmadı

## Sprint 03 — Core Deployment Hazırlığı

- [x] Sprint 03 başlangıç main commit'i kullanıcı tarafından verilen bağlama göre `e77d2d1` olarak kayda geçirildi
- [x] Vercel deployment doğrulama checklist'i oluşturuldu: `docs/deployment/VERCEL_CHECKLIST.md`
- [x] Environment değişken sözleşmesi oluşturuldu: `docs/deployment/ENVIRONMENT.md`
- [x] `.env.example` güvenli placeholder env değerleri ve service role uyarısıyla güncellendi
- [x] Supabase/Auth/Storage/RLS implementasyonu yapılmadan karar başlıkları `docs/DECISIONS.md` içine eklendi
- [x] `npm audit` sonucu belgelendi; `npm audit fix --force` çalıştırılmadı
- [x] `npm run lint`, `npm run typecheck` ve `npm run build` bu sandbox snapshot üzerinde başarılı çalıştı
- [!] Vercel gerçek Preview / Production doğrulaması yapılmadı; checklist hazırlandı ama deployment tamamlandı denemez
- [!] Build çıktısında workspace root uyarısı bu sandbox çalıştırmasında görünmedi; Turbopack `experimental.cpus: 4` bilgisi, ilk build için build cache uyarısı ve Next.js telemetry bilgilendirmesi görüldü; blocker sayılmadı

## Sprint 04 — Core Vercel Otomatik Deployment Doğrulama

- [x] Sprint 04 başlangıç main commit'i kullanıcı tarafından verilen bağlama göre `d68fa15` olarak kayda geçirildi
- [x] GitHub → Vercel otomatik deployment modeli dokümante edildi: feature branch push → Preview, integration main merge/push → Production
- [x] `docs/deployment/DEPLOYMENT_VERIFICATION.md` oluşturuldu ve doğrulama alanları `verified` / `not verified` şeklinde ayrıldı
- [x] `docs/deployment/VERCEL_CHECKLIST.md` manuel CLI deploy ağırlığı yerine GitHub integration / automatic deployments akışına göre güncellendi
- [x] `.env.example` ve `docs/deployment/ENVIRONMENT.md` güvenli env kapısını koruyacak şekilde gözden geçirildi
- [x] `npm run lint`, `npm run typecheck`, `npm run build` bu sandbox snapshot üzerinde başarılı çalıştı
- [x] `npm audit` çalıştırıldı; `npm audit fix --force` çalıştırılmadı
- [!] GitHub remote ve `main` ↔ `origin/main` senkronu sandbox içinde `.git` metadata olmadığı için yeniden doğrulanamadı; gerçek worktree'de doğrulanmalı
- [!] Vercel Dashboard/CLI erişimi olmadığı için Vercel project bağlantısı, production branch, Preview Deployment ve Production Deployment gerçek URL üzerinden doğrulanmadı
- [!] `npm audit` iki orta seviye uyarı göstermeye devam ediyor: `next` üzerinden `postcss <8.5.10` (`GHSA-qx2v-qp2m-jg93`). `npm audit fix --force` çalıştırılmadı

## Sonraki Kilometre Taşı

Sprint 04 entegrasyonunda GitHub → Vercel otomatik deployment bağlantısı gerçek Vercel Dashboard/CLI erişimiyle doğrulanmalı. Preview ve Production URL doğrulanmadan Faz 2 tamamen kapanmış sayılmamalı. Faz 3 Auth/Supabase kararları kullanıcı onayı sonrası başlatılmalı.
