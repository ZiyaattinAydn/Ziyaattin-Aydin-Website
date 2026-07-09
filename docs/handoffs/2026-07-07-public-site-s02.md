# Branch Handoff

- Tarih: 2026-07-07
- Sohbet / çalışma hattı: Pencere 2 — Public Site
- Branch: `feat/public-site-s02`
- Main başlangıç commit'i: Beklenen `62d5227`; sandbox zip kopyasında `.git` bulunmadığı için burada doğrulanamadı. Yerel worktree'de `git rev-parse --short HEAD` ile doğrulanmalı.
- Son commit: Sandbox çalışmasında `.git` bulunmadığı için commit hash oluşturulamadı. Yerel `feat/public-site-s02` worktree'inde commit atılmalı.

## Yapılan İşler
- Public mock içerik modeli Sprint 02 için genişletildi.
- Proje modeline `statusLabel`, `contentState`, `visibilityNote`, `highlights`, `technicalNotes` ve açık pasif link durumu eklendi.
- Yazı modeline `tags`, `updatedLabel`, `isDraft`, `placeholderNote` ve `codeLanguage` alanları eklendi.
- Proje kartları durum etiketi, görünürlük notu ve responsive kırılım açısından iyileştirildi.
- Proje detay sayfası özet, problem, yaklaşım, öne çıkanlar, teknik notlar, öğrenilenler ve sıradaki adımlar bölümlerini mock modelden render edecek şekilde düzenlendi.
- Gerçek demo/GitHub linki olmayan proje bağlantıları aktif link gibi gösterilmedi; pasif/yakında durumları açıkça belirtildi.
- Yazı kartları tag, taslak durumu, tarih ve okuma süresiyle daha okunabilir hâle getirildi.
- Yazı detay sayfası section verilerinden render edilen okunabilir makale düzeni, taslak notu, tagler, içindekiler ve kod dili etiketiyle iyileştirildi.
- Ana sayfa istatistikleri `PublicStatCard`, yolculuk özetleri `TimelineCard` ile public alanına özel componentlere ayrıldı.
- Journey sayfası mock timeline düzeniyle hafif polish edildi.
- Hakkımda içeriğinde yeni kişisel bilgi veya onaylanmamış portre kararı eklenmedi; ana sayfa portresine dokunulmadı.

## Değiştirilen Ana Dosyalar
- `src/data/mock-content.ts`
- `src/app/(public)/page.tsx`
- `src/app/(public)/projects/page.tsx`
- `src/app/(public)/projects/[slug]/page.tsx`
- `src/app/(public)/writings/page.tsx`
- `src/app/(public)/writings/[slug]/page.tsx`
- `src/app/(public)/journey/page.tsx`
- `src/components/public/project-card.tsx`
- `src/components/public/project-explorer.tsx`
- `src/components/public/writing-card.tsx`
- `src/components/public/writing-explorer.tsx`
- `src/components/public/detail-section.tsx`
- `src/components/public/public-stat-card.tsx`
- `src/components/public/timeline-card.tsx`
- `docs/PROJECT_STATUS.md`
- `docs/WORKSTREAMS.md`
- `CHANGELOG.md`
- `docs/handoffs/2026-07-07-public-site-s02.md`

## Eklenen Bağımlılıklar
- Yok

## Yeni Environment Değişkenleri
- Yok

## Çalıştırılan Kontroller
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [ ] `npm run dev` manuel tarayıcı kontrolü sandbox ortamında yapılmadı.

## Kontrol Edilen Rotalar
Build sırasında ve/veya local HTTP kontrolünde doğrulanması gereken rotalar:
- `/`
- `/projects`
- `/projects/next-ai-dashboard`
- `/writings`
- `/writings/yapay-zeka-caginda-yazilim-gelistirici-olmak`
- `/journey`
- `/about`
- bilinmeyen proje slug → `notFound()` / 404
- bilinmeyen yazı slug → `notFound()` / 404

## Bilinen Eksikler
- İçerikler hâlâ gerçek kişisel veri değil, açıkça mock/placeholder seviyesindedir.
- Gerçek GitHub, demo, sosyal medya ve iletişim linkleri eklenmedi.
- Hakkımda portresi kullanıcı doğrulaması bekleyen aday portredir; Sprint 02'de değiştirilmedi.
- Mobil 360px yatay scroll görsel tarayıcıda manuel incelenmedi; grid ve metin kırılımları responsive taşmayı azaltacak şekilde düzenlendi.
- Sandbox kopyasında `.git` olmadığı için main başlangıç commit'i ve son commit hash'i burada doğrulanamadı.

## Merge Sırasında Dikkat
- Bu branch Core layout, ortak UI, Studio, Auth, package ve görsel varlık dosyalarına dokunmamalıdır; değişiklikler public alanı ve takip belgeleriyle sınırlıdır.
- Mock content tipleri genişlediği için ileride Studio publish modeli bağlanırken `ProjectSummary`, `ProjectLink`, `WritingSummary` ve `WritingSection` alanları dikkate alınmalı.
- Tüm link alanları bilinmeyen durumda `href: null` bırakıldı; doğrulanmış URL olmadan aktif linke çevrilmemeli.
- Core branch'te header/footer değişiklikleri varsa bu branch ile çakışma beklenmez; `src/components/layout/**` dosyalarına dokunulmadı.
