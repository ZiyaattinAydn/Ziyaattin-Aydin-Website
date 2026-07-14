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
- [x] Sprint 03 Core Deployment hazırlığı branch içinde tamamlandı
- [x] Vercel deployment checklist dokümantasyonu hazırlandı
- [x] Environment değişken sözleşmesi hazırlandı
- [!] Vercel Preview / Production gerçek URL üzerinden henüz doğrulanmadıysa deployment tamamlandı sayılmamalı
- [!] `npm audit` iki orta seviye uyarı göstermeye devam ediyor: doğrudan `next`, dolaylı `postcss` (`GHSA-qx2v-qp2m-jg93`). `npm audit fix --force` çalıştırılmadı ve çalıştırılmamalı
- [!] Supabase Auth, MFA, PostgreSQL, Storage, RLS ve gerçek route guard henüz başlamadı
- [!] Public ve Studio hâlâ mock veriyle çalışıyor
- [!] Hakkımda portresi ve gerçek iletişim/sosyal linkler kullanıcı onayı olmadan aktif edilmeyecek
- [x] Sprint 03 başlangıç `main` commit'i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `e77d2d1`
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

## Sonraki Kilometre Taşı

Sprint 02 Core branch entegrasyonundan sonra Public ve Studio Sprint 02 çalışma hatları güncel `main` üzerinden başlatılacak. Vercel kurulmadığı için Faz 2 tamamen kapanmış sayılmamalı.

## Sprint 02 Entegrasyon Özeti

- [m] Sprint 02 Core foundation çalışması `integration/sprint-02` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 02 Public site çalışması `integration/sprint-02` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 02 Studio shell çalışması `integration/sprint-02` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 02 entegrasyonunda `npm run lint`, `npm run typecheck` ve `npm run build` kontrolleri başarılı tamamlandı.
- [m] Next.js workspace root / multiple lockfile uyarısı Core Sprint 02 sonrası integration build çıktısında görünmedi.
- [!] Vercel preview / production deployment doğrulaması henüz tamamlanmadı.
- [ ] Faz 3 Auth/Supabase/MFA/PostgreSQL/Storage gerçek implementasyonu henüz başlamadı.

## Sprint 03 Entegrasyon Özeti

- [m] Sprint 03 Core deployment readiness çalışması `integration/sprint-03` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 03 Public content contract çalışması `integration/sprint-03` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 03 Studio data planning çalışması `integration/sprint-03` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 03 entegrasyonunda `npm run lint`, `npm run typecheck` ve `npm run build` kontrolleri başarılı tamamlandı.
- [x] Vercel checklist ve environment contract dokümanları hazırlandı.
- [!] Vercel preview / production gerçek doğrulaması henüz tamamlanmadıysa tamamlandı sayılmamalı.
- [!] `npm audit` çıktısında 2 moderate vulnerability izlenmeye devam ediyor; `npm audit fix --force` çalıştırılmadı ve çalıştırılmamalı.
- [ ] Faz 3 Auth/Supabase/MFA/PostgreSQL/Storage/RLS gerçek implementasyonu henüz başlamadı.
- [!] Hakkımda portresi kullanıcı doğrulaması bekleyen aday portre olarak kalmalı.

## Sprint 04 Entegrasyon Özeti

- [m] Sprint 04 Core Vercel deployment flow çalışması entegrasyona alındı.
- [m] Sprint 04 Public publish planning çalışması entegrasyona alındı.
- [m] Sprint 04 Studio Auth/Security planning çalışması entegrasyona alındı.
- [m] Sprint 04 integration branch kalite kontrollerini geçti.
- [x] Feature branch push → automatic Preview Deployment doğrulandı.
- [x] Preview runtime Node.js 22.x olarak doğrulandı.
- [x] Production branch `main` olarak bildirildi.
- [!] Production Deployment main push sonrasında ayrıca doğrulanmalıdır.
- [!] Production URL açılmadan deployment tamamen tamamlandı sayılmamalıdır.
- [!] `npm audit` 2 moderate vulnerability göstermeye devam ediyor.
- [ ] Supabase/Auth/MFA/PostgreSQL/Storage/RLS gerçek implementasyonu henüz başlamadı.
- [!] Hakkımda portresi ve gerçek linkler kullanıcı onayı bekliyor.

## Sprint 05 Entegrasyon Özeti

- [m] Core Sprint 05 Supabase mimari sınırları entegrasyona alındı.
- [m] Public Sprint 05 database transition sözleşmesi entegrasyona alındı.
- [m] Studio Sprint 05 çalıştırılabilir SQL paketi entegrasyona alındı.
- [m] Integration Sprint 05 SQL güvenlik ve sözleşme denetimi tamamlandı.
- [m] SQL package prepared.
- [ ] Supabase project created.
- [ ] SQL applied.
- [ ] Auth implemented.
- [ ] RLS applied/tested on a real project.
- [ ] Storage created.
- [!] Final kullanıcı karar kapısı `USER_APPROVAL_REQUIRED`.
- [!] Sprint 06 ve gerçek SQL uygulaması karar kapısı tamamlanana kadar başlamamalı.
- [x] Gerçek secret, Supabase URL/key veya owner UUID repository'ye eklenmedi.
- [x] Production uygulaması mock davranışını koruyor.

## Sprint 06 — Core Supabase Runtime

- [x] Branch: `feat/core-supabase-runtime-s06`
- [x] Başlangıç main commit'i: `0c9d1bb`
- [x] Runtime foundation commit'i: `6d51ff3`
- [x] `@supabase/supabase-js@2.110.2` ve `@supabase/ssr@0.12.0` eklendi.
- [x] Canonical env adı `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` olarak uygulandı.
- [x] Browser, server ve Proxy Supabase client factory'leri eklendi.
- [x] Next.js 16 `src/proxy.ts` session refresh ve erken redirect sınırı eklendi.
- [x] Güvenli redirect, trusted user, active owner ve current `aal2` helper'ları eklendi.
- [x] Env yokken Public mock production build'i başarılı.
- [x] Env yokken Auth ve Studio fail closed.
- [x] Runtime test, lint, typecheck ve build başarılı.
- [x] Branch `origin/feat/core-supabase-runtime-s06` üzerine pushlandı; Vercel Preview runtime env değerleri bekleniyor.
- [!] `npm audit`: 2 moderate, `GHSA-qx2v-qp2m-jg93`; force fix uygulanmadı.
- [x] Gerçek Supabase URL, key, password veya owner UUID repository'ye eklenmedi.
- [ ] Development Supabase project ve gerçek Preview runtime env kurulumu Core repository değişikliği dışında tamamlanacak.
- [ ] SQL uygulaması, seed, owner Auth hesabı, Login/TOTP UI, Studio route entegrasyonu, CRUD ve Storage ayrı işlerde tamamlanacak.
- [ ] Production Supabase project/env/migration ayrıca onay bekliyor.

## Sprint 06 — Public Repository Boundary

- [x] Public branch `feat/public-supabase-adapter-s06`, `main@0c9d1bb` tabanından açıldı.
- [x] Project, writing, journey ve profile için ortak server-side repository sözleşmesi eklendi.
- [x] Mevcut mock içerik repository arkasına alındı; production mock davranışı korundu.
- [x] Public route ve component'lerin doğrudan `@/data/mock-content` bağımlılığı kaldırıldı.
- [x] Dependency-free Supabase `PublicQueryReader` ve explicit-select adapter sınırı hazırlandı.
- [x] Anonymous query filtreleri `published + public + published_at` olarak hem request hem mapper katmanında uygulandı.
- [x] Link, image ve portrait approval filtreleri publish state'ten bağımsız tutuldu.
- [x] Candidate About portresi final görsel gibi render edilmiyor; ana sayfa portresi değişmedi.
- [x] Empty list ve featured sonuçları güvenli nötr state ile ele alındı.
- [x] Node built-in runner policy testleri 7/7 başarılı.
- [x] `npm ci`, 7/7 policy testi, `npm run lint`, `npm run typecheck` ve `npm run build` başarılı.
- [x] Build 14/14 static page üretti; project ve writing detail rotaları dynamic server route olarak korundu.
- [!] `npm audit` bilinen 2 moderate `next` / dolaylı `postcss` uyarısını gösteriyor; önerilen force çözüm breaking downgrade yaptığı için uygulanmadı.
- [!] Preview Deployment branch push sonrasında doğrulanacak.
- [x] Core Sprint 06 runtime branch'i `origin/feat/core-supabase-runtime-s06@02f7c6a` olarak mevcut; Public branch'e merge edilmedi veya kodu kopyalanmadı.
- [x] Yeni dependency, gerçek Supabase URL/key/JWT veya service-role secret eklenmedi.

## Sprint 06 Studio Auth/MFA — S06_STUDIO_CODE_STATUS

Kod implementasyonu tamamlandı: gerçek password login, active owner doğrulaması,
TOTP enrollment/challenge, current AAL2 Studio guard, güvenli logout ve recovery
runbook. Development Supabase project, migration, seed, owner activation ve Preview
runtime kabul testleri dış ortam adımı olarak bekliyor.



## Sprint 06 Studio Auth/MFA — S06_STUDIO_OK

- [x] Development Supabase project Singapore region'da oluşturuldu.
- [x] Schema, functions ve application RLS development project'e uygulandı.
- [x] İki Storage bucket ve sekiz Storage policy doğrulandı.
- [x] Tek active owner Auth/profile modeli doğrulandı.
- [x] Development seed 1/1/1/1 sonucu verdi.
- [x] Password login, TOTP enrollment/challenge ve current AAL2 guard çalışıyor.
- [x] Logout, direct Studio, wrong password/TOTP, outsider ve ikinci faktör
  testleri geçti.
- [x] Anonymous/outsider/owner RLS kabul matrisi geçti.
- [x] Vercel Preview development Supabase env ile Ready ve kabul testleri geçti.
- [x] Production Supabase env/migration uygulanmadı; mock davranışı korunuyor.
- [!] Yaklaşık 8 saat session time-box Free plan/Dashboard sınırlaması nedeniyle
  uygulanmadı; per-request AAL2 guard ve 15 dakikalık AAL1 sınırı aktif.
- [!] npm audit iki moderate GHSA-qx2v-qp2m-jg93 uyarısını izlemeye devam ediyor.

## Sprint 06 Integration — S06_INTEGRATION_STATUS

Durum: `READY_FOR_MAIN_APPROVAL`

Core, Public ve Studio Sprint 06 feature branch'leri `integration/sprint-06` üzerinde birleşmiştir. Birleşik statik testler, lint, typecheck, env'siz build ve security source taramaları başarılıdır.

Main merge ve Production deployment henüz yapılmamıştır.

## Sprint 07 — Public Development Project Reads

- [x] Branch `feat/public-project-read-s07`, `main@a870f02` tabanından açıldı.
- [x] Core Sprint 07 `origin/feat/core-project-domain-s07@3a6cd87` teslimi doğrulandı; Public branch Core mutation kodunu merge etmedi.
- [x] Existing `PublicQueryReader`, Core `createServerSupabaseClient()` factory'sine server-only adapter ile bağlandı.
- [x] Yalnız `/projects` list/detail vertical slice local development ve Vercel Preview'da kontrollü Supabase source kullanabilir.
- [x] Production source her koşulda mock kalır.
- [x] Writings, journey, profile/about ve ana sayfadaki genel repository akışı mock-first kalır.
- [x] Project list/detail anonymous sınırı `published + public + published_at IS NOT NULL` olarak request ve mapper katmanında korunur.
- [x] Draft, review, approved, unpublished, archived, hidden, private ve `published_at = null` detail kayıtları public için aynı null/notFound sınırına gider.
- [x] Service role, `select *`, private project kolonları, gerçek URL/key/JWT ve yeni environment adı eklenmedi.
- [x] Hosted development anonymous read doğrulaması başarılı: 1 published/public kayıt list/detail içinde görünürken draft/private kayıt public read sınırının dışında kaldı.
- [x] Verification kaydı hard delete edilmeden `archived + private` durumuna getirildi; cleanup sonrası anonymous project sorgusu boş döndü.
- [x] Public policy testleri 8/8, project repository testleri 14/14, lint, typecheck ve gerçek env'siz production build başarılı.
- [x] Secret/select/scope taramaları temiz; yalnız mevcut placeholder, dokümantasyon ve test fixture eşleşmeleri bulundu.
- [x] Branch origin'e pushlandı; Vercel Preview kabulü deployment akışı nedeniyle Integration aşamasına devredildi.
- [!] Production Supabase ve Public production cutover Sprint 07 kapsamı dışındadır.
