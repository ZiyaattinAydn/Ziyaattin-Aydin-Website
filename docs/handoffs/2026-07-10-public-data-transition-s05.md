# Branch Handoff — Public Data Transition Sprint 05

- Tarih: 2026-07-10
- Sohbet / çalışma hattı: Pencere 2 — Public Site
- Branch: `feat/public-data-transition-s05`
- Main başlangıç commit'i: Beklenen `cf2d3ab`; yerel worktree'de doğrulanmalı.
- Son commit: Sandbox ortamında gerçek repository commit hash'i oluşturulmadı; yerel commit sonrası doldurulmalı.

## Tamamlanan görevler

- Public database mapping sözleşmesi oluşturuldu.
- Workflow state ve visibility ayrı eksenler olarak tanımlandı.
- Anonymous read sınırı `published + public` olarak kesinleştirildi.
- Görünmeyen detail içerikleri için bilgi sızdırmayan ortak `notFound()` davranışı belgelendi.
- Public list/detail/featured/journey/profile query beklentileri yazıldı.
- Database empty/unavailable, null link, null image, onaysız portrait ve eksik alan fallback matrisi oluşturuldu.
- Link, contact/social, project image, writing cover ve About portrait approval kuralları netleştirildi.
- Mevcut project, writing, journey ve profile mock kayıtları development seed/production uygunluğu açısından envantere alındı.
- `PUBLIC_CONTENT_MODEL.md` ve `PUBLIC_PUBLISH_FLOW.md` Sprint 05 companion sözleşmelerine bağlandı.
- Gerçek Supabase import'u, sorgu kodu, API route, mapper, database bağlantısı, migration veya publish CRUD eklenmedi.

## Oluşturulan mapping belgeleri

- `docs/content/PUBLIC_DATABASE_MAPPING.md`
- `docs/content/PUBLIC_VISIBILITY_RULES.md`
- `docs/content/PUBLIC_QUERY_CONTRACT.md`
- `docs/content/PUBLIC_FALLBACK_MATRIX.md`
- `docs/content/PUBLIC_APPROVAL_RULES.md`
- `docs/content/MOCK_DATA_MIGRATION_INVENTORY.md`

## Database/Studio hizalama özeti

- Hedef public tablolar: `projects`, `writings`, `journey_items`, `owner_profiles`.
- Review/publish operasyonu için `publish_queue` Public tarafından doğrudan okunmaz.
- Studio SQL hattındaki ortak kolonlarla hizalama hedeflendi: `owner_id`, `visibility`, `publish_state`, `published_at`, `archived_at`, link/image approval alanları.
- Bu alanlar kesin migration kararı değildir; Studio SQL branch'i ve entegrasyon incelemesi belirleyicidir.

## Kullanıcı onayı bekleyen içerikler

- Gerçek project title/description/progress ve başarı iddiaları.
- GitHub, demo, external source, contact ve social URL'ler.
- Project/writing görselleri ve image approval.
- Hakkımda final metni ve About portresi.
- Yaş, eğitim, iş geçmişi, başarılar ve gerçek biyografi detayları.
- Gerçek writing metinleri, kaynaklar ve yayın tarihleri.
- Gerçek journey tarihleri ve dönüm noktaları.

## Mock migration envanteri özeti

- Project: `next-ai-dashboard`, `flowfit`, `trace-analytics` güvenli development draft seed adayı; `orbit-dashboard` tamamlandı iddiası nedeniyle yalnız açık mock etiketiyle kullanılmalı.
- Writing: üç kayıt editor/render testine uygun draft seed adayı; `Mock tarih`, placeholder note ve kaynak iddiaları production seed'e taşınmamalı.
- Journey: `Aşama 01–04` yalnız timeline/sort testine uygun; gerçek kronoloji değildir.
- Profile: yalnız shape/approval fallback testi için aday; About portrait ve contact/social alanları onay bekler.
- Tüm URL alanları null kalmalı; seed kayıtları production published içerik olarak eklenmemeli.

## Değiştirilen ana dosyalar

- `docs/content/PUBLIC_DATABASE_MAPPING.md`
- `docs/content/PUBLIC_VISIBILITY_RULES.md`
- `docs/content/PUBLIC_QUERY_CONTRACT.md`
- `docs/content/PUBLIC_FALLBACK_MATRIX.md`
- `docs/content/PUBLIC_APPROVAL_RULES.md`
- `docs/content/MOCK_DATA_MIGRATION_INVENTORY.md`
- `docs/content/PUBLIC_CONTENT_MODEL.md`
- `docs/content/PUBLIC_PUBLISH_FLOW.md`
- `docs/PROJECT_STATUS.md`
- `docs/WORKSTREAMS.md`
- `CHANGELOG.md`
- `docs/handoffs/2026-07-10-public-data-transition-s05.md`

## Eklenen bağımlılıklar

- Yok.

## Yeni environment değişkenleri

- Yok.

## Test sonuçları

- `npm ci` — başarılı; 2 moderate vulnerability raporlandı, `npm audit fix --force` çalıştırılmadı.
- `npm run lint` — başarılı.
- `npm run typecheck` — başarılı; route types üretildi.
- `npm run build` — başarılı; 14/14 static page üretildi ve dynamic project/writing rotaları build çıktısında yer aldı.

## Kontrol edilen rotalar

Build çıktısında route üretimi doğrulandı; gerçek tarayıcı/manual URL kontrolü yerel worktree’de yapılmalı:

- `/`
- `/projects`
- `/projects/next-ai-dashboard`
- `/writings`
- `/writings/yapay-zeka-caginda-yazilim-gelistirici-olmak`
- `/journey`
- `/about`
- bilinmeyen project/writing slug için `notFound()`

## Bilinen eksikler

- Gerçek Supabase schema ve RLS bu Public branch'in kapsamı değildir.
- Gerçek query/mapping/cache/revalidation kodu yoktur.
- Public-safe database view/table kararı kesinleşmemiştir.
- JSONB ile ilişkisel alt tablo kararları açık kalır.
- Gerçek owner UUID ve kullanıcı onaylı içerikler yoktur.
- Mock veriler kaldırılmadı.

## Merge notları

- Bu branch yalnız `docs/content/**`, tracking ve handoff dosyalarına dokunmalıdır.
- Studio SQL branch'iyle tablo/kolon adları karşılaştırılmalı; Public belge migration olarak uygulanmamalıdır.
- Anonymous read policy yalnız `published + public` olmalıdır.
- Draft/review/approved/archived/hidden/private kayıtlar public detail için aynı `notFound()` sınırını korumalıdır.
- Production database boş veya erişilemezken mock veriye sessiz fallback yapılmamalıdır.
- Link/image/portrait approval publish state'ten bağımsız tutulmalıdır.
- `npm audit fix --force` çalıştırılmamalıdır.
