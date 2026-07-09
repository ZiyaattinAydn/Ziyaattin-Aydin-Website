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
- [m] Sprint 01 Core Foundation `main`e alındı
- [m] Sprint 01 Public Site `main`e alındı
- [m] Sprint 01 Studio Shell `main`e alındı
- [m] Sprint 01 entegrasyonu ve Studio düzeltmesi `main`e alındı
- [x] Sprint 02 Core Foundation branch içinde tamamlandı
- [!] `npm audit` güncel Next.js bağımlılığında iki orta seviye PostCSS uyarısı gösteriyor; resmi patch takip edilecek
- [x] Yerel bootstrap commit oluşturuldu (`dd8ff0b`)
- [x] Sprint 02 başlangıç `main` commit'i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `62d5227`
- [x] `main` / `origin/main` senkron durumu Sprint 02 başlangıç bağlamına göre güncel
- [!] Sandbox snapshot içinde `.git` metadata bulunmadığı için Git komutları burada tekrar çalıştırılamadı; gerçek worktree'de handoff öncesi `git rev-parse --short HEAD` ile son commit doldurulmalı
- [!] Next.js workspace root uyarısı incelendi; repo içinden `next.config.ts` içinde `turbopack.root: process.cwd()` ayarı eklendi ve build worker sayısı `experimental.cpus: 4` ile sınırlandı. Uyarı devam ederse repo dışındaki `C:\Users\ziyaa\package-lock.json` dosyasının gerekliliği kullanıcı tarafından kontrol edilmeli ve gereksizse silinmeli
- [ ] Vercel preview bağlantısı kurulacak

## Sprint 01 — Core Foundation

- [m] Palet 1, Palet 2 ve Palet 3 token'ları daha düzenli semantik değişkenlerle toparlandı
- [m] Global CSS temel erişilebilirlik, seçim, focus ve responsive overflow kuralları güçlendirildi
- [m] Ortak UI primitive seti genişletildi: `Button`, `LinkButton`, `SectionWrapper`, `EmptyState`, `StatCard`, `StatusBadge`
- [m] Mevcut `Panel`, `Tag` ve `PageIntro` uyumluluğu korunarak küçük geliştirmeler yapıldı
- [m] Public header mobil menü davranışı sade ve erişilebilir şekilde güçlendirildi
- [m] Public footer gerçekliği doğrulanmamış e-posta/GitHub/LinkedIn bilgilerini link olarak uydurmayacak şekilde düzenlendi
- [m] `package-lock.json` içinde özel/internal registry izi aranıp bulunmadı

## Sprint 02 — Core Foundation

- [x] Sprint 01 sonrası main başlangıç commit'i `62d5227` olarak kayda geçirildi
- [x] Next.js 16 yerel dokümanlarında Turbopack filesystem root davranışı incelendi
- [x] Workspace root uyarısı için repo içi çözüm olarak `next.config.ts` içinde `turbopack.root` proje köküne sabitlendi ve build worker sayısı `experimental.cpus: 4` ile sınırlandı
- [x] `package-lock.json`, `package.json` ve varsa `.npmrc` içinde özel/internal registry izi arandı; bulunmadı
- [x] Ortak UI primitive setine `ProgressBar` ve `SectionShell` eklendi
- [x] `src/lib/site-config.ts` içinde metadata, navigation, admin entry, contact ve social alanları daha güvenli yapılandırıldı
- [x] Root metadata `siteConfig` ile tutarlı hâle getirildi
- [x] Footer doğrulanmamış contact/social bilgilerini aktif link gibi göstermeyecek şekilde config tabanlı hale getirildi
- [!] `npm config get registry` bu sandbox ortamında `registry option is protected` hatası verdi; gerçek yerel makinede tekrar doğrulanmalı
- [!] Build sırasında workspace root uyarısının gerçek Windows ortamında kaybolup kaybolmadığı yeniden gözlenmeli; repo dışı `C:\Users\ziyaa\package-lock.json` dosyası uyarının muhtemel sebebidir
- [!] `npm run check` bu sandbox ortamında iç build aşamasında zaman aşımına uğradı; `npm run lint`, `npm run typecheck` ve `npm run build` ayrı ayrı başarıyla tamamlandı

## Sonraki Kilometre Taşı

Sprint 02 Core branch entegrasyonundan sonra Public ve Studio Sprint 02 çalışma hatları güncel `main` üzerinden başlatılacak. Vercel kurulmadığı için Faz 2 tamamen kapanmış sayılmamalı.
