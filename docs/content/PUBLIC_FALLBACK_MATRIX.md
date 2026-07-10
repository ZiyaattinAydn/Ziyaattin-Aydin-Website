# Public Fallback Matrix

> Bu belge gelecekteki database geçişinde beklenen UI ve route davranışını tanımlar. Gerçek error boundary, Supabase sorgusu veya fallback kodu içermez.

| Senaryo | Liste / ana sayfa | Detail route | HTTP/SEO beklentisi | Güvenlik ve loglama |
| --- | --- | --- | --- | --- |
| Database boş | Nötr empty state; mock veriye sessiz fallback yok | Slug yoksa `notFound()` | Liste 200; detail 404 | Draft/private varmış gibi mesaj verme. |
| Database erişilemiyor | Genel geçici yükleme hatası veya güvenli last-known-good cache | Error boundary/temporary error; `notFound()` ile veri yokluğu gibi gösterme | 5xx veya framework error davranışı; indexlenmemeli | Teknik hata client'a sızmaz; server log/monitoring. |
| Slug bulunamadı | Etkisiz | `notFound()` | 404 + noindex | Aranan slug loglanacaksa kişisel veri içermemeli. |
| İçerik `draft` | Listede yok | `notFound()` | 404/noindex | “Taslak var” mesajı yok. |
| İçerik `review` / `approved` | Listede yok | `notFound()` | 404/noindex | Review varlığı sızmaz. |
| İçerik `unpublished` | Listede yok | `notFound()` | 404/noindex | Önceki public cache ve sitemap kaydı invalidate edilir. |
| İçerik `private` | Listede yok | `notFound()` | 404/noindex | Public ile private için aynı response. |
| İçerik `hidden` | Listede yok | `notFound()` | 404/noindex | Eski `unlisted` kayıtlar karar verilene kadar hidden gibi davranır. |
| İçerik `archived` | Varsayılan listede yok | Şimdilik `notFound()` | 404/noindex | Public arşiv kararı gelirse sözleşme revize edilir. |
| Link null | Kart/detail normal render; link alanı pasif veya gizli | Anchor üretilmez | Sayfa index davranışı değişmez | Null URL href'e çevrilmez. |
| Link dolu, onay yok | URL client'a mümkünse hiç gönderilmez | Pasif “Onay bekliyor” metni veya alan gizleme | Normal | Publish state link approval yerine geçmez. |
| Görsel null | Görsel alanı gizlenir; layout kırılmaz | Metin içerik render edilebilir | Normal | Sahte/mock insan görseli kullanılmaz. |
| About portrait onayı yok | About sayfası metinle açılabilir | Candidate portre production'da final gibi render edilmez | Normal | Ana sayfa onaylı portresi değişmez. |
| Zorunlu alan eksik | Kayıt listeden filtrelenir | `notFound()` | 404/noindex | Server validation hatası kaydedilir; ham row client'a gönderilmez. |
| Opsiyonel alan eksik | İlgili meta/bölüm gizlenir | Sayfa kalan içerikle render edilir | Normal | Default metin gerçek bilgi uydurmaz. |
| Studio publish tamamlanmamış | Listede yok | `notFound()` | 404/noindex | Queue/review durumu public'e açıklanmaz. |
| Related içerik görünür değil | Related kart/link gösterilmez | Ana kayıt render edilmeye devam eder | Normal | Gizli hedef slug'ı client'a taşınmaz. |
| Featured sonuç yok | Bölüm gizlenir veya empty state | — | Ana sayfa 200 | Draft/private featured kayıtlar sayılmaz. |
| Cache'te eski published kayıt var, sonra unpublish edildi | Cache invalidation sonrası listeden düşer | Revalidation sonrası `notFound()` | En kısa güvenli süre | Publish/unpublish homepage, list, detail ve sitemap'i birlikte invalidate eder. |

## Fallback ilkeleri

1. Production database başarısızlığında otomatik mock fallback yapılmaz.
2. Zorunlu alan eksikse gerçeğe benzeyen metin uydurulmaz.
3. Görsel eksikse yeni insan görseli veya onaysız portrait eklenmez.
4. Görünür olmayan kayıtlar için tek public response `notFound()` olur.
5. Database kesintisi ile gerçek 404 birbirinden operasyonel olarak ayrılır.
6. Empty state yalnız yayınlanmış public sonuçların olmamasını anlatır; private kayıt sayısını açıklamaz.

## Sprint 06 kaynak seçimi açıklaması

Production'ın bu sprintte mock repository kullanması database kesintisinde yapılan otomatik fallback değildir; gerçek cutover öncesinde bilinçli ve sabitlenmiş kaynak seçimidir.

Non-production ortamında `PUBLIC_CONTENT_SOURCE=supabase` seçilmiş fakat Core query reader henüz bağlanmamışsa configuration-level warning ile mock'a dönülebilir. Reader bağlandıktan ve Supabase repository gerçekten aktive edildikten sonra query/database hataları mock içerikle maskelenmez; kontrollü unavailable error davranışına gider.
