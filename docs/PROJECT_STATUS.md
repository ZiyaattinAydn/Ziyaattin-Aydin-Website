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

## Public Sprint 05 — Mock Veriden Database İçeriğine Geçiş Sözleşmesi

- [x] Project, writing, journey ve profile/about mock alanları için database mapping sözleşmesi hazırlandı.
- [x] Anonymous public read sınırı `published + public` olarak kesinleştirildi.
- [x] Draft/review/approved/archived/hidden/private kayıtların bilgi sızdırmadan `notFound()` davranışına gitmesi belgelendi.
- [x] Public query, empty/error fallback, link ve portrait approval kuralları tanımlandı.
- [x] Mevcut mock içeriklerin development seed uygunluğu ve kullanıcı onayı bekleyen alanları envantere alındı.
- [ ] Gerçek Supabase sorguları, database bağlantısı, public mapper, API route, publish CRUD ve gerçek database geçişi başlatılmadı.
