# Branch Handoff — Core Supabase Architecture Sprint 05

- Tarih: 2026-07-10
- Sohbet / çalışma hattı: Pencere 1 — Core Foundation
- Branch: `feat/core-supabase-architecture-s05`
- Main başlangıç commit'i: `cf2d3ab` — kullanıcı tarafından verilen Sprint 05 başlangıç değeri; gerçek worktree'de `git rev-parse --short HEAD` ile doğrulanmalı.
- Son commit: `[!]` Yerel commit sonrası `git rev-parse --short HEAD` ile doldurulmalı.

## Tamamlanan görevler

- Supabase'in PostgreSQL, Auth ve Storage sorumlulukları için mimari sözleşme hazırlandı.
- Public/Studio veri erişimi, RLS otoritesi ve Preview/Production project ayrımı dokümante edildi.
- Browser, server session ve admin client sınırları belirlendi.
- Cookie tabanlı SSR session, Next.js 16 Proxy, Studio server guard ve RLS katmanları önerildi.
- Migration, non-production uygulama, stop point, backup, production gate ve rollback runbook'u hazırlandı.
- Sprint 06 öncesi kullanıcı kararları tek approval gate içinde toplandı.
- Tracking ve decision belgeleri Sprint 05 Core kapsamıyla güncellendi.

## Oluşturulan belgeler

- `docs/supabase/SUPABASE_ARCHITECTURE.md`
- `docs/supabase/SUPABASE_ENVIRONMENT.md`
- `docs/supabase/SERVER_CLIENT_BOUNDARY.md`
- `docs/supabase/AUTH_SESSION_AND_GUARD.md`
- `docs/supabase/MIGRATION_RUNBOOK.md`
- `docs/supabase/SPRINT_06_APPROVAL_GATE.md`
- `docs/handoffs/2026-07-10-core-supabase-architecture-s05.md`

## Değiştirilen takip dosyaları

- `docs/PROJECT_STATUS.md`
- `docs/WORKSTREAMS.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`
- `CHANGELOG.md`

## `.env.example` değişiklikleri

- Değişiklik yapılmadı.
- Dosya incelendi ve gerekli placeholder'ların mevcut olduğu doğrulandı:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Gerçek URL, key veya secret eklenmedi.

## Eklenen bağımlılıklar

- Yok.
- `package.json` ve `package-lock.json` değiştirilmedi.
- Supabase npm paketi kurulmadı.

## Yeni environment değişkenleri

- Yok.
- Mevcut placeholder sözleşmesi korundu.

## Önerilen Auth/session modeli

- Public signup kapalı tek owner hesabı.
- Cookie tabanlı Supabase SSR session.
- Owner yetkisi e-posta string'i yerine `auth.uid()` ile bağlı owner profile kaydından gelir.
- Next.js 16 Proxy yalnız session yenileme ve erken redirect yapar.
- Studio server layout ve her mutation gerçek auth/owner kontrolünü tekrarlar.
- Production Studio erişimi için TOTP MFA ve `aal2` önerilir.
- RLS database ve Storage erişiminde son güvenlik otoritesidir.
- Service role normal CRUD için kullanılmaz.

## Çalıştırılan kontroller

Sandbox içinde doküman ve dosya kapsamı kontrolleri tamamlandı:

- [x] Yalnız izin verilen Core dokümantasyon/tracking alanları değiştirildi.
- [x] `src/**`, `supabase/**`, `package.json`, `package-lock.json` ve `next.config.ts` değiştirilmedi.
- [x] Gerçek secret, Supabase project URL/key, owner UUID veya SQL migration eklenmedi.
- [x] Yeni bağımlılık eklenmedi.
- [!] `npm ci` sandbox DNS çözümleme sorunu nedeniyle tamamlanamadı (`registry.npmjs.org` çözümlenemedi).
- [!] `npm run lint`, `npm run typecheck`, `npm run build` ve `npm audit` bu nedenle sandbox içinde yeniden çalıştırılamadı; gerçek worktree'de zorunlu olarak çalıştırılmalı.

Yerelde çalıştırılacak:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm audit
```

`npm audit fix --force` çalıştırılmamalı.

## Audit sonucu

- Sprint 04/main bağlamındaki son bilinen sonuç: 2 moderate vulnerability.
- Zincir: `next` → `postcss <8.5.10`.
- Advisory: `GHSA-qx2v-qp2m-jg93`.
- Sprint 05 branch'inde paket değişikliği yapılmadı.
- Güncel audit sonucu yerel worktree'de yeniden kaydedilmeli.

## Kullanıcı onayı bekleyen kararlar

- Supabase region: Central EU / Frankfurt önerisi.
- Ayrı Production ve Non-production project kullanımı.
- Email/password veya magic link seçimi.
- Public signup'ın kapalı tutulması.
- TOTP MFA ve Studio için `aal2` zorunluluğu.
- Owner UUID allowlist/profile modeli ve ilk owner bootstrap yöntemi.
- Owner olmayan authenticated kullanıcı davranışı.
- Session inactivity/time-box/single-session ayarları ve plan uyumu.
- Recovery flow ve backup TOTP factor.
- `public-assets` ve `private-files` bucket adları.
- Maksimum dosya boyutu ve MIME allowlist.
- Development seed kullanımı.
- Studio SQL paketinin non-production Supabase project'e uygulanması.
- Core Auth/Proxy/route guard implementasyonuna geçiş.
- Preview test sonrası Production migration onayı.

## Bilinen eksikler

- Gerçek Supabase project oluşturulmadı.
- Gerçek env değerleri girilmedi.
- Supabase client/server kodu yazılmadı.
- Auth, MFA, Proxy, route guard veya CRUD uygulanmadı.
- SQL migration yazılmadı veya çalıştırılmadı.
- Storage bucket/policy uygulanmadı.
- Public ve Studio mock veriyle çalışmaya devam ediyor.
- Kullanıcı approval gate henüz cevaplanmadı.

## Merge sırasında dikkat edilecekler

- `docs/PROJECT_STATUS.md`, `docs/WORKSTREAMS.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md` ve `CHANGELOG.md` Public/Studio Sprint 05 branch'leriyle conflict çıkarabilir; anlam bazlı birleştirilmelidir.
- Core `docs/supabase/**` alanı Studio `supabase/**` SQL paketinden ayrıdır; biri mimari/runbook, diğeri uygulanabilir SQL'dir.
- Studio SQL önerileri Core mimari sınırlarıyla karşılaştırılmalı: anonymous write kapalı, owner UUID, RLS, service role izolasyonu ve non-production-first.
- Kullanıcı kararları tamamlanmadan Auth/guard implementasyonu veya SQL uygulaması başlamamalıdır.
- `.env.example` içinde gerçek secret bulunmamalıdır.
- `npm audit fix --force` çalıştırılmamalıdır.

## SQL'in uygulanmadığı doğrulaması

- `supabase/**` dizinine dokunulmadı.
- SQL dosyası oluşturulmadı.
- Supabase SQL Editor veya CLI ile komut çalıştırılmadı.
