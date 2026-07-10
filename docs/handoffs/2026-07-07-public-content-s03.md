# Branch Handoff

- Tarih: 2026-07-07
- Sohbet / çalışma hattı: Pencere 2 — Public Site
- Branch: `feat/public-content-s03`
- Main başlangıç commit'i: Beklenen `e77d2d1`; sandbox zip/patch ortamında gerçek git geçmişi bulunmadığı için yerelde doğrulanmalı.
- Son commit: Sandbox ortamında commit hash oluşturulmadı. Yerel `feat/public-content-s03` worktree'inde commit sonrası doldurulmalı.

## Tamamlanan Görevler

- Public içerik sözleşmesi `docs/content/PUBLIC_CONTENT_MODEL.md` olarak oluşturuldu.
- Project, writing, journey item ve profile/about content tipleri için mevcut mock alanlar, gelecekteki database alanları, görünürlük kuralları, draft/published ayrımı, link alanları, image/portrait onay durumu ve Studio publish ilişkisi belgelendi.
- `src/data/mock-content.ts` içinde public içeriklere `visibility`, `publishState`, `isFeatured` ve `sourceNote` alanları eklendi.
- Proje linkleri `links.demo` ve `links.github` olarak netleştirildi; bilinmeyen linkler `null` kaldı.
- Yazı içeriklerine `externalLinks` alanı eklendi; boşsa detay sayfasında aktif link yerine pasif kaynak durumu gösterildi.
- Proje detay sayfasında demo/GitHub linki yoksa aktif link render edilmemesi korundu ve kaynak/görünürlük notları güçlendirildi.
- Hakkımda içeriği `profileContent` mock sözleşmesine bağlandı; `about-portrait.png` aday/doğrulama bekleyen portre olarak kaldı.
- Journey kartları publish/görünürlük/source notlarını gösterecek şekilde public-safe polish aldı.

## Değiştirilen Ana Dosyalar

- `docs/content/PUBLIC_CONTENT_MODEL.md`
- `src/data/mock-content.ts`
- `src/app/(public)/page.tsx`
- `src/app/(public)/projects/[slug]/page.tsx`
- `src/app/(public)/writings/page.tsx`
- `src/app/(public)/writings/[slug]/page.tsx`
- `src/app/(public)/journey/page.tsx`
- `src/app/(public)/about/page.tsx`
- `src/components/public/project-card.tsx`
- `src/components/public/project-explorer.tsx`
- `src/components/public/writing-card.tsx`
- `src/components/public/writing-explorer.tsx`
- `src/components/public/timeline-card.tsx`
- `docs/PROJECT_STATUS.md`
- `docs/WORKSTREAMS.md`
- `CHANGELOG.md`
- `docs/handoffs/2026-07-07-public-content-s03.md`

## Eklenen Bağımlılıklar

- Yok.

## Yeni Environment Değişkenleri

- Yok.

## Çalıştırılan Kontroller

- `npm run lint` — başarılı
- `npm run typecheck` — başarılı
- `npm run build` — başarılı

## Kontrol Edilen Rotalar

Build çıktısında doğrulanan rotalar:

- `/`
- `/about`
- `/journey`
- `/projects`
- `/projects/[slug]`
- `/writings`
- `/writings/[slug]`

Manuel kontrol listesi yerelde uygulanmalı:

- `/projects/next-ai-dashboard`
- `/writings/yapay-zeka-caginda-yazilim-gelistirici-olmak`
- bilinmeyen proje slug için `notFound()`
- bilinmeyen yazı slug için `notFound()`
- 360px mobil genişlikte yatay scroll
- aktif olmayan linklerin gerçekten aktif link olmaması

## Bilinen Eksikler

- Gerçek database, Supabase publish akışı, Auth/MFA, Storage ve RLS implementasyonu yapılmadı.
- Public içerikler hâlâ mock/taslak seviyesinde.
- Gerçek GitHub/demo/social/contact linkleri kullanıcı onayı olmadan aktif edilmedi.
- Hakkımda portresi kullanıcı tarafından doğrulanmış final portre değildir.
- Vercel durumu bu branch kapsamında doğrulanmadı.
- `npm audit` çıktısındaki 2 moderate vulnerability izlenmeye devam etmeli; `npm audit fix --force` çalıştırılmadı.

## Merge Sırasında Dikkat Edilecekler

- Bu branch Core Sprint 03 sonrası merge edilmelidir.
- `src/data/mock-content.ts` içindeki alan değişiklikleri Studio publish sözleşmesiyle uyumlandırılmalı.
- Core `site-config` veya layout değişiklikleriyle sosyal/iletişim linkleri çakışırsa Core sahipliği korunmalı.
- `docs/content/PUBLIC_CONTENT_MODEL.md` Faz 3 karar dokümanlarıyla birlikte okunmalı.
