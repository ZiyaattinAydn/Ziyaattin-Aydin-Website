# Branch Handoff

- Tarih: 2026-07-07
- Sohbet / çalışma hattı: Pencere 2 — Public Site
- Branch: `feat/public-publish-plan-s04`
- Main başlangıç commit'i: Beklenen `d68fa15`; sandbox zip/patch ortamında gerçek git geçmişi bulunmadığı için yerelde doğrulanmalı.
- Son commit: Sandbox ortamında commit hash oluşturulmadı. Yerel `feat/public-publish-plan-s04` worktree'inde commit sonrası doldurulmalı.

## Tamamlanan Görevler

- Public publish flow planı `docs/content/PUBLIC_PUBLISH_FLOW.md` olarak oluşturuldu.
- Content draft, review required, approved, published, archived, hidden/private, link approval, image/portrait approval ve rollback/unpublish kararları public taraf açısından belgelendi.
- `docs/content/PUBLIC_CONTENT_MODEL.md` publish flow ilişkisi ve Studio alan eşleşmesi ile güncellendi.
- `src/data/mock-content.ts` içinde `publishFlowState`, `approvalNote` ve link `approvalState` alanları eklendi/tutarlı hâle getirildi.
- Project, writing, journey ve about alanlarında public publish/onay durumunu küçük ve sakin etiketlerle gösteren `PublishStatusNote` component'i eklendi.
- Gerçek olmayan demo/GitHub/dış kaynak linkleri aktif anchor gibi bırakılmadı; link yoksa pasif durum metni korunuyor.
- Hakkımda portresi aday/doğrulama bekleyen portre olarak kaldı; yeni görsel veya gerçek kişisel bilgi eklenmedi.
- Gerçek database, API route, Supabase, Auth, Storage veya Studio CRUD implementasyonu yapılmadı.

## Değiştirilen Ana Dosyalar

- `docs/content/PUBLIC_PUBLISH_FLOW.md`
- `docs/content/PUBLIC_CONTENT_MODEL.md`
- `src/data/mock-content.ts`
- `src/components/public/publish-status-note.tsx`
- `src/components/public/project-card.tsx`
- `src/components/public/project-explorer.tsx`
- `src/components/public/writing-card.tsx`
- `src/components/public/writing-explorer.tsx`
- `src/components/public/timeline-card.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(public)/projects/page.tsx`
- `src/app/(public)/projects/[slug]/page.tsx`
- `src/app/(public)/writings/page.tsx`
- `src/app/(public)/writings/[slug]/page.tsx`
- `src/app/(public)/journey/page.tsx`
- `src/app/(public)/about/page.tsx`
- `docs/PROJECT_STATUS.md`
- `docs/WORKSTREAMS.md`
- `CHANGELOG.md`
- `docs/handoffs/2026-07-07-public-publish-plan-s04.md`

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

Yerelde manuel kontrol önerisi:

- `/projects/next-ai-dashboard`
- `/writings/yapay-zeka-caginda-yazilim-gelistirici-olmak`
- bilinmeyen proje slug için `notFound()`
- bilinmeyen yazı slug için `notFound()`
- 360px mobil genişlikte yatay scroll
- aktif olmayan linklerin gerçekten aktif anchor olmaması

## Bilinen Eksikler

- Gerçek Studio publish workflow, database tabloları, Supabase client, Auth/MFA, Storage ve RLS implementasyonu yapılmadı.
- Public içerikler hâlâ mock/hazırlık seviyesinde.
- Gerçek GitHub/demo/social/contact linkleri kullanıcı onayı olmadan aktif edilmedi.
- Hakkımda portresi kullanıcı tarafından doğrulanmış final portre değildir.
- Studio data model draft ile teknik eşleşme yalnız public tüketim sözleşmesi seviyesinde ele alındı; migration kararı verilmedi.
- `npm audit` çıktısındaki 2 moderate vulnerability izlenmeye devam etmeli; `npm audit fix --force` çalıştırılmadı.

## Merge Sırasında Dikkat Edilecekler

- Bu branch Core Sprint 04 sonrası merge edilmelidir.
- `docs/content/PUBLIC_PUBLISH_FLOW.md` entegrasyonda korunmalı.
- `src/data/mock-content.ts` içindeki `publishFlowState`, `approvalNote` ve link `approvalState` alanları Studio data model kararlarıyla uyumlandırılmalı.
- Core `site-config` veya layout değişiklikleri sosyal/iletişim linkleriyle çakışırsa Core sahipliği korunmalı; Public branch gerçek sosyal/contact URL eklemedi.
- Gerçek olmayan linklerin aktif linke dönüşmediği manuel kontrol edilmeli.
- `/about` sayfasında portre “onaylı/final” gibi sunulmamalı; aday/doğrulama bekleyen portre olarak kalmalı.
