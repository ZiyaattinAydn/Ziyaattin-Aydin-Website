# Branch Handoff

- Tarih: 2026-07-07
- Sohbet / çalışma hattı: Pencere 2 — Public Site
- Branch: `feat/public-site`
- Son commit: Bu sandbox çalışmasında yüklenen zip içinde `.git` bulunmadığı için commit hash oluşturulamadı. Yerel `feat/public-site` worktree'inde commit atılmalı.

## Yapılan İşler
- Public mock içerik modeli proje ve yazı detaylarını destekleyecek şekilde genişletildi.
- Ana sayfa hero, öne çıkan projeler/yazılar, dijital pano ve yolculuk özeti ile yeniden düzenlendi.
- Ana sayfadaki onaylı portre `public/images/portraits/home-hero.png` olarak korundu.
- Projeler sayfasına public component içinde arama, durum/kategori filtreleri, sıralama ve erişilebilir boş sonuç durumu eklendi.
- Proje detay sayfası; geri dönüş linki, başlık, açıklama, status/progress, teknoloji listesi, özet/problem/yaklaşım, teknik kararlar, kilometre taşları, öğrenilenler ve sıradaki adımlar bloklarıyla iyileştirildi.
- Bilinmeyen proje slug için `notFound()` davranışı korundu.
- Yazılar sayfasına öne çıkan yazı, arama, kategori filtreleri, sıralama ve temiz kart düzeni eklendi.
- Yazı detay sayfası; içindekiler, okunabilir içerik alanı, kod blokları, küçük onaylı yazar avatarı ve ilgili yazılarla düzenlendi.
- Bilinmeyen yazı slug için `notFound()` davranışı korundu.
- Yolculuğum sayfası mock zaman çizelgesi ve kapsam notlarıyla iyileştirildi.
- Hakkımda sayfasında `about-portrait.png` yalnız aday/doğrulama bekleyen portre olarak sunuldu; kesin portre gibi gösterilmedi.

## Değiştirilen Ana Dosyalar
- `src/data/mock-content.ts`
- `src/app/(public)/page.tsx`
- `src/app/(public)/projects/page.tsx`
- `src/app/(public)/projects/[slug]/page.tsx`
- `src/app/(public)/writings/page.tsx`
- `src/app/(public)/writings/[slug]/page.tsx`
- `src/app/(public)/journey/page.tsx`
- `src/app/(public)/about/page.tsx`
- `src/components/public/project-card.tsx`
- `src/components/public/project-explorer.tsx`
- `src/components/public/public-section.tsx`
- `src/components/public/status-pill.tsx`
- `src/components/public/timeline-item.tsx`
- `src/components/public/writing-card.tsx`
- `src/components/public/writing-explorer.tsx`
- `docs/PROJECT_STATUS.md`
- `docs/WORKSTREAMS.md`
- `CHANGELOG.md`
- `docs/handoffs/2026-07-07-public-site.md`

## Eklenen Bağımlılıklar
- Yok

## Yeni Environment Değişkenleri
- Yok

## Çalıştırılan Kontroller
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run dev` ile manuel rota HTTP kontrolü

## Manuel Kontrol Edilen Rotalar
- `/` → 200
- `/projects` → 200
- `/projects/next-ai-dashboard` → 200
- `/writings` → 200
- `/writings/yapay-zeka-caginda-yazilim-gelistirici-olmak` → 200
- `/journey` → 200
- `/about` → 200
- `/projects/bilinmeyen-slug` → 404
- `/writings/bilinmeyen-slug` → 404

## Bilinen Eksikler
- İçerikler gerçek kişisel veri değil, Sprint 01 için açıkça mock/placeholder seviyesindedir.
- Gerçek GitHub, demo, sosyal medya ve iletişim linkleri eklenmedi.
- Hakkımda sayfasındaki `about-portrait.png` kullanıcı doğrulaması bekleyen aday portredir.
- Header/footer mobil menü ve footer linkleri Core sahipliğinde olduğu için değiştirilmedi.
- Yatay scroll görsel olarak tarayıcıda manuel incelenemedi; grid, metin kırılımı ve overflow kararları responsive taşmayı önleyecek şekilde düzenlendi.
- `npm ci` sonrası mevcut Next/PostCSS bağımlılıklarından gelen 2 orta seviye `npm audit` uyarısı devam ediyor; `npm audit fix --force` çalıştırılmadı.

## Merge Sırasında Dikkat
- Bu branch Core branch'ten sonra merge edilecekse `src/components/layout/**`, `src/components/ui/**`, `src/app/globals.css` ve `src/app/layout.tsx` değişiklikleriyle çakışma beklenmiyor; bu branch o dosyalara dokunmadı.
- Public componentler yalnız `src/components/public/**` altında eklendi.
- Gerçek içerik yayın akışı geldiğinde `src/data/mock-content.ts` modeli Studio publish modeliyle uyumlu hâle getirilmeli.
- Hakkımda portresi kullanıcı tarafından doğrulanmadan final kabul edilmemeli.

## Takip Dosyası Güncellemeleri
- [x] `docs/PROJECT_STATUS.md`
- [x] `docs/WORKSTREAMS.md`
- [x] `CHANGELOG.md`
