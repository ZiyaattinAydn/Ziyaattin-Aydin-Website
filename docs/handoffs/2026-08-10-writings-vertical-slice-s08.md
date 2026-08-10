# Sprint 08 Handoff — Writings Vertical Slice

Tarih: 2026-08-10
Branch: `feat/writings-s08`
Base commit: `41a4886` (main)

## Özet

Sprint 07'deki Projects vertical slice patterni birebir Writings'e uygulandı.
Core domain → Studio CRUD → Public read cutover üç commit ile tamamlandı.

## Commitler

1. `eb825dd` — **feat(core): add secure writing domain mutations**
   - `src/features/writings/domain.ts` — Tipler, row mapper, result yardımcıları
   - `src/features/writings/validation.ts` — Input validasyonu, alan hataları
   - `src/features/writings/transitions.ts` — State machine, slug lock, yayın gereksinimleri
   - `src/features/writings/database-errors.ts` — PostgreSQL hata çevirisi
   - `src/features/writings/mutation-guard.ts` — Owner+AAL2 yetkilendirme guard
   - `src/features/writings/server/writing-mutations.ts` — Server mutasyonları (list, get, create, update, transition, archive)
   - `src/features/writings/index.ts` — Barrel export

2. `4a7190c` — **feat(studio): add owner writing management flow**
   - `src/features/studio/studio-content.ts` — Nav'a "Yazılar" eklendi
   - `src/features/studio/writings/action-state.ts` — Action state tipleri + hata çevirisi
   - `src/features/studio/writings/actions.ts` — Server Actions (create, update, transition, archive)
   - `src/features/studio/writings/writing-presentation.ts` — Etiketler, ton eşleştirme, tarih formatlama
   - `src/features/studio/writings/writing-submit-button.tsx` — Pending-aware submit düğmesi
   - `src/features/studio/writings/writing-card.tsx` — Yazı kart bileşeni
   - `src/features/studio/writings/writing-form.tsx` — Tam create/edit formu
   - `src/features/studio/writings/writing-workflow-actions.tsx` — State geçişleri + arşivleme
   - `src/app/(studio)/studio/writings/page.tsx` — Yazı listesi sayfası
   - `src/app/(studio)/studio/writings/new/page.tsx` — Yeni yazı sayfası
   - `src/app/(studio)/studio/writings/[writingId]/edit/page.tsx` — Yazı düzenleme sayfası

3. `0839f87` — **feat(public): database-backed writing list and detail**
   - `src/features/public/content/source-selection.ts` — `getPublicWritingContentRepository()` eklendi
   - `src/app/(public)/writings/page.tsx` — Supabase-backed source'a geçirildi
   - `src/app/(public)/writings/[slug]/page.tsx` — Supabase-backed source'a geçirildi

## State Machine

```
draft → review → approved → published → unpublished → (review | archived)
                                                ↓
                                             archived
draft/review/approved → archived (herhangi birinden)
```

- Published slug kilitlenir (değiştirilemez)
- Publish için gereksinimler: title, slug, excerpt, content, category dolmalı
- Yalnız owner+AAL2 mutasyon yapabilir
- Hard delete yok, sadece archive

## Source Seçimi

| Ortam       | Kaynak   |
|-------------|----------|
| Production  | Mock     |
| Preview     | Supabase (varsa) → Mock fallback |
| Development | Supabase (varsa) → Mock fallback |

## Güvenlik Kontrolleri

- [x] Service role CRUD'da kullanılmıyor
- [x] Owner+AAL2 guard her mutasyonda zorunlu
- [x] RLS politikaları (Sprint 05 migration'dan) aktif
- [x] Secret taraması temiz — sızdırılmış credential yok
- [x] `select *` kullanılmıyor
- [x] Force push yapılmadı

## Build Durumu

- [x] ESLint — hata yok
- [x] TypeScript `tsc --noEmit` — hata yok
- [x] `next build` — başarılı, tüm route'lar doğru şekilde listelendi

## Ertelenen / Kapsam Dışı

- Vercel Preview kabul testi — merge sonrası yapılacak
- Production Supabase cutover
- Writing image upload / cover image yönetimi
- Rich text editor (Markdown/MDX body)
- Slug history / redirect
- Arama / filtreleme Studio tarafında
