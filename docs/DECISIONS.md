# Ürün ve Teknik Kararlar — Güncel

Tarih: 2026-10-25. Ayrıntılı eski karar kayıtları Git geçmişinde korunuyor.

## Ürün
1. Aynı Next.js uygulamasında herkese açık **Public** portföy ve yalnızca sahibine açık **Studio** yer alır.
2. İki temel hedef: kişisel markalaşma ve projelerin/görevlerin düzenli takip edilmesi.
3. Studio notları ve dosyaları özel veridir; kullanıcı izin vermedikçe Public'e taşınmaz.
4. Not editörü ve bilgi kütüphanesinin kullanım ayrıntıları daha sonra tanımlanacak.
5. Telefona kurulabilir PWA hedef kapsamda; Expo ve Tauri şu an hedef değil.

## Tasarım
- Koyu yüzey + yeşil vurgu; Inter + JetBrains Mono.
- Mevcut onaylı portreler korunur; yeni fotoğraf ve kişisel içerik yalnız kullanıcı onayıyla yayınlanır.
- Web portföyün asıl marka yüzüdür. Studio'nun yönetim ayrıntıları Public'e sızdırılmaz.

## Teknoloji ve ortam
- Next.js 16, React 19, TypeScript, Tailwind CSS 4; Supabase Auth, PostgreSQL, Storage ve RLS; Vercel.
- Ayrı development (Preview) ve production Supabase projeleri tercih edilir. Development verisini izinsiz production'a bağlama.
- `main` production branch; kısa ömürlü tek iş branch'i ve Preview doğrulamasından sonra birleştirilir.
- Normal CRUD: server session, active owner + current AAL2, owner-scoped sorgu ve RLS.
- Service-role yalnız yetkilendirilmiş sunucu yönetim işlerinde; client tarafında ve normal CRUD'da kullanılamaz.

## İçerik yayını
- Proje/yazı gerçek verisi Studio'da üretilir; Public yayın yalnız `published + public + published_at` filtresiyle ve link/görsel onayıyla yapılır.
- Üretimde mock kaynağı kaldırmak ayrı test ve migration kararıdır; otomatik yayınlama yapılmaz.
- Hard delete yerine archive/unpublish tercih edilir.

## Çalışma biçimi
**Eski 3 geliştirme + 1 merge + 1 prompt sohbeti kaldırıldı.** Artık tek iş, tek branch, gerekli tüm katmanların beraber geliştirilmesi, test, Preview ve main merge uygulanır. Takip için ana belge docs/PROJECT_STATUS.md kullanılır.
