# Kişisel Sistemim — Geliştirme Kuralları

Bu repo tek bir ürün ve tek bir geliştirme akışıyla yönetilir. Eski Core/Public/Studio/Integration/Orchestration pencere düzeni artık geçerli değildir.

## Her işe başlamadan
1. README.md, docs/PROJECT_STATUS.md, docs/ROADMAP.md ve docs/DECISIONS.md dosyalarını oku.
2. Mevcut main, açık PR'lar ve Vercel/Supabase durumunu kontrol et.
3. Aynı anda bir ürün görevi üzerinde çalış; kısa ömürlü bir feature/fix branch aç.

## Kod ve teslim
- UI, server, veritabanı, test ve dokümanı aynı iş kapsamında birlikte ele al.
- Mevcut çalışma mantığını bozmadan değiştir. Güvenlik kontrollerini client'a devretme.
- Supabase Studio işlemleri current AAL2 + aktif owner + RLS ile korunur.
- Service-role / DB şifresi / gizli anahtarları repoya, loglara veya tarayıcıya koyma.
- Public içerik ile private Studio veri sınırını koru.
- İlgili değişiklikte lint, typecheck, build ve davranış testlerini çalıştır.
- Önce Preview doğrula, sonra PR'ı main'e birleştir ve Production durumunu kontrol et.
- Production veritabanı kurulum ve migration'larında hedefi doğrula, önce backup al; geliştirme ve production verilerini istemeden birleştirme.
- Değişiklik tamamlandığında docs/PROJECT_STATUS.md'yi güncelle; detaylı günlük handoff/prompt dosyası üretme.
- Kullanıcı onayı olmadan gerçek olmayan başarı, adres, profil fotoğrafı ve iletişim linki yayınlama.

Next.js sürümüne özgü API değişikliklerinde yüklü dokümanları doğrula.
