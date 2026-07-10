# Branch Handoff — Public Supabase Adapter Sprint 06

- Tarih: 2026-07-10
- Çalışma hattı: Pencere 2 — Public Site
- Branch: `feat/public-supabase-adapter-s06`
- Main başlangıç commit'i: `0c9d1bb`
- Son commit: push sonrası teslim raporunda `git rev-parse --short HEAD` ile doğrulanacak
- Durum: `IMPLEMENTATION_COMPLETE_PUSH_PENDING`

## Tamamlanan işler

- Public route'lar mock veri dosyasından ayrılarak `PublicContentRepository` üzerinden beslenmeye başladı.
- Projects, writings, journey ve profile için ortak Public DTO/domain modeli oluşturuldu.
- Mevcut mock veri production görünümü korunarak mock repository arkasına alındı.
- Dependency-free Supabase query-reader ve adapter sınırı eklendi.
- Project, writing ve journey sorguları explicit public-safe kolon listeleriyle tanımlandı.
- Anonymous filtreler request ve mapper katmanında `published + public + published_at` olarak uygulandı.
- Detail repository sonucu `null` olduğunda route'lar ortak `notFound()` davranışını koruyor.
- Empty list/featured sonuçları güvenli nötr state ile render ediliyor.
- Link, image ve portrait approval publish state'ten bağımsız tutuldu.
- Candidate About portrait gizlendi; ana sayfadaki onaylı portre değiştirilmedi.

## Repository interface

`PublicContentRepository` şu operasyonları sağlar:

- project list/detail/featured,
- writing list/detail/featured/related,
- journey list,
- public profile read.

Route component'leri repository source'un mock veya Supabase olduğunu bilmez.

## Mock repository durumu

- Aktif ve Production default kaynağıdır.
- Mevcut mock sayfa/kart içeriğini korur.
- Pending/missing linkleri aktif anchor'a dönüştürmez.
- Candidate portrait'i approved image DTO'suna dönüştürmez.
- Gerçek database boşluğunu gizleyen runtime database fallback değildir.

## Supabase adapter durumu

- Adapter ve public-safe mapper hazırdır.
- Supabase npm SDK import edilmedi.
- Core helper kopyalanmadı veya Core branch merge edilmedi.
- Integration sonrasında Core hattı `PublicQueryReader` sağlayabilir.
- `select *` yoktur.
- Database query error mock fallback yapmaz; kontrollü unavailable error üretir.
- Public profile tablosu kesinleşmediği için Supabase profile read bilinçli olarak unavailable bırakıldı.

## Environment

Gelecek non-production seçim değişkeni:

```text
PUBLIC_CONTENT_SOURCE=mock|supabase
```

- Default: `mock`
- Eksik/geçersiz: `mock`
- Production: her zaman `mock`
- `.env.example`: değiştirilmedi
- Gerçek environment değeri: eklenmedi

## Bağımlılıklar ve secret durumu

- Eklenen bağımlılık: yok
- Gerçek Supabase URL: yok
- Gerçek anon/publishable key: yok
- Gerçek service-role key: yok
- Gerçek JWT: yok
- `SUPABASE_SERVICE_ROLE_KEY` eşleşmeleri yalnız boş placeholder ve dokümantasyon metnidir.
- `supabase.co` eşleşmeleri yalnız resmi dokümantasyon bağlantılarıdır.
- `eyJ` eşleşmesi package-lock integrity/binary içeriğidir; secret değildir.

## Testler

Node 22 built-in runner:

- Published/public/published_at görünür: başarılı
- Draft görünmez: başarılı
- Private görünmez: başarılı
- Published_at null görünmez: başarılı
- Legacy unlisted -> hidden: başarılı
- Onaysız/geçersiz link render verisinden çıkar: başarılı
- Onaysız portrait/image render verisinden çıkar: başarılı
- Production/default source mock: başarılı
- Explicit non-production Supabase seçimi: başarılı

Toplam: 7 test, 7 başarılı.

## Kalite kontrolleri

- `git diff --check`: başarılı
- `npm ci`: başarılı; 357 package kuruldu, package dosyaları değişmedi
- Node 22 built-in policy tests: 7/7 başarılı
- `npm run lint`: başarılı
- `npm run typecheck`: başarılı
- `npm run build`: başarılı
- Build sonucu: 14/14 static page; `/projects/[slug]` ve `/writings/[slug]` dynamic server route
- `npm audit`: 2 moderate vulnerability
- Audit zinciri: mevcut `next` bağımlılığı üzerinden dolaylı `postcss`
- Force çözüm breaking `next@9.3.3` değişimi önerdiği için `npm audit fix --force` çalıştırılmadı
- Node test runner deneysel type-stripping/module-type warning üretti; test sonucu ve production build etkilenmedi

## Preview ve production

- Feature branch henüz push edilmediği için Preview Deployment doğrulanmadı.
- Push sonrası automatic Vercel Preview beklenir.
- Manuel `vercel --prod` kullanılmayacak.
- Production mock davranışı korunmuştur.

## Yapılmayan işler

- Production'ı Supabase'e geçirmek
- Gerçek Supabase env eklemek
- SQL çalıştırmak veya migration değiştirmek
- Auth/MFA/Studio route veya CRUD implementasyonu
- About portre assetini değiştirmek
- Sahte GitHub/demo/contact/social link eklemek
- Slug history/redirect sistemi
- Cache/revalidation cutover
- PWA
- Dependency veya package dosyası değişikliği

## Core / Integration notları

- Core Sprint 06 runtime branch'i `origin/feat/core-supabase-runtime-s06@02f7c6a` noktasında mevcuttur.
- Public branch Core branch'ini merge etmedi ve Core client/helper kodunu kopyalamadı.
- Integration, Core runtime çıktısını inceleyerek uygun reader'ı `PublicQueryReader` interface'ine bağlayabilir.
- Projects SQL şemasındaki tek `link_approval_state`, demo ve GitHub için link başına approval hedefini tam karşılamaz.
- Public profile/contact/social/portrait için ayrı public-safe şema kararı gerekir.
- Gerçek Supabase reader aktive edilmeden `PUBLIC_CONTENT_SOURCE=supabase` yalnız configuration fallback davranışı üretir.

## Blockerlar

Branch completion için kod blocker'ı yoktur. Gerçek Supabase aktivasyonu için:

- Core query reader wiring,
- development Supabase doğrulaması,
- public profile şema kararı,
- link başına approval şema genişlemesi

gereklidir.

## Başarı etiketi

Kod, policy ve kalite kapısı: `S06_PUBLIC_OK`

Kalan operasyonel doğrulama: branch push ve automatic Vercel Preview sonucu.
