# Studio Sprint 09 — Görev Takip Handoff

Tarih: 2026-10-25
Branch: feat/studio-task-tracker-s09
Base: main@912c9fa

## Yapılan denetim
- Production Vercel: READY, commit 912c9fa (public source hâlâ mock).
- Development Supabase: başlangıçta INACTIVE; restore isteği kabul edildi, son durum COMING_UP.
- Sprint 07 gerçek Project CRUD + owner/AAL2 + RLS main içinde.
- Studio Tasks, Notes, Files ve ana panel başlangıçta mock'tu.
- Sprint 08 Writings Vertical Slice PR #4 açık, main içinde değil.
- docs/PROJECT_STATUS.md ve Studio banner'ı eski sprint uyarıları taşıyordu.

## Bu sprintin sınırları
1. tasks tablosundan gerçek owner-scoped okuma, project seçenekleri.
2. Task create: başlık, açıklama, öncelik, isteğe bağlı project.
3. Durum geçişleri: todo/in_progress/blocked/done; done için completed_at.
4. Archive-only; fiziksel silme yok.
5. Studio ana panelinde gerçek açık görev ve proje sayıları.
6. Supabase kapalıyken mock fallback yok.
7. Studio kabuğunda artık yanlış olan Auth yok açıklamasını düzeltme.

## Güvenlik
- Tüm okuma/yazma işlemleri aktif owner + current AAL2 sınırında.
- Her mutation owner_id eşitliğiyle scoped ve mevcut RLS'ye tabi.
- Owner kimliği istemciden alınmaz.
- Service-role, DB secret ve hard-delete kullanılmaz.
- Geçersiz form girdileri güvenli bildirimle reddedilir.

## Doğrulama
- Vercel branch preview son uygulama commit build: READY.
- Hosted task create/status/archive kabulü: BLOKLU; Supabase COMING_UP.
- Manual MFA/login/owner/non-owner/RLS matrisi: bu sprintte yeniden doğrulanmadı.
- main merge ve production cutover: yapılmadı.

## Gerçekten kullanılabilir Studio için sıra
1. Dev Supabase ACTIVE_HEALTHY; migration, owner/AAL2 ve mevcut veriyi doğrula.
2. Preview'da create/update/done/archive ve yetkisiz kullanıcı reddini test et.
3. Görev düzenleme (başlık, açıklama, deadline, proje ilişkisi) ve filtre/arama.
4. Notes gerçek CRUD ve Markdown editör.
5. Private Files/Storage metadata/upload/download, RLS/izin testleri.
6. Studio projelerine iş geçmişi/handoff/next action görünümü.
7. Sprint 08 Writings PR #4'ü güncel main ile ayrı incele ve merge kararı ver.
8. Production Supabase hazırlığı; geri dönüş/backup; kontrollü cutover; PWA ve güvenlik testleri.

## Not
Vercel preview READY yalnız build kanıtıdır; veritabanı kapalıyken gerçek kullanıcı kabul testi değildir.
