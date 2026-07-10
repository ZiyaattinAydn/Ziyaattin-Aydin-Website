# Public Query Contract

> Bu belge gelecekteki server-side Supabase veri okumalarının davranış sözleşmesidir. Supabase import'u, query kodu, API route veya cache implementasyonu içermez.

## Ortak filtre

Tüm anonymous public content sorgularının zorunlu filtresi:

```text
visibility = public
publish_state = published
```

Bu filtre sadece component içinde değil, database policy ve server-side sorguda uygulanmalıdır.

## Project list

Beklenen alanlar:

- kart için gerekli public-safe kolonlar,
- `slug`, `title`, `description`, `status`, `status_label`, `progress`, `category`,
- `technologies`, `is_featured`, `published_at`, `updated_at`,
- yalnız onaylı link durumu için gerekli minimal metadata.

Sıralama:

1. `is_featured DESC`
2. opsiyonel `featured_rank ASC NULLS LAST`
3. `published_at DESC NULLS LAST`
4. `updated_at DESC`
5. deterministic tie-breaker olarak `id ASC`

Liste sorgusu detay JSONB alanlarının tamamını taşımamalıdır.

## Project detail by slug

- Slug normalize edilerek tek kayıt beklenir.
- Zorunlu filtre slug ile birlikte `published + public` olmalıdır.
- Kayıt yoksa veya filtreyi geçmiyorsa `notFound()`.
- `demo_url` / `github_url` yalnız approval state uygun olduğunda response'a veya UI anchor'ına dönüşür.
- İlişkili medya yalnız public ve approved ise alınır.

## Writing list

Beklenen alanlar:

- `slug`, `title`, `excerpt`, `category`, `tags`,
- `reading_time_minutes`, `is_featured`, `published_at`,
- approved cover metadata varsa minimal cover alanları.

Sıralama project list ile aynı featured/published mantığını izler. Taslak tarih label'ları database response'a taşınmaz.

## Writing detail by slug

- Zorunlu filtre: slug + `published + public`.
- Content/body zorunlu alanı boş veya şema doğrulaması başarısızsa kayıt public için geçersiz kabul edilir ve `notFound()` döner.
- Related writing sorgusu yalnız görünür kayıtları alır; görünmeyen slug hakkında bilgi sızdırmaz.
- External link listesinde URL null veya approval uygun değilse anchor üretilmez.

## Journey

- Yalnız `published + public` kayıtlar okunur.
- Sıralama: `sort_order ASC`, sonra `published_at ASC`, sonra `id ASC`.
- Related project/writing hedefi görünür değilse yalnız link kaldırılır; journey kaydı diğer zorunlu alanları sağlıyorsa render edilmeye devam edebilir.

## Featured content

Featured sorgu şu koşulları birlikte arar:

```text
is_featured = true
visibility = public
publish_state = published
```

Featured bayrağı tek başına yayına alma mekanizması değildir. Sonuç limiti route bazında açık belirlenir.

## Null link davranışı

- URL null ise anchor render edilmez.
- URL dolu ama approval state approved değilse anchor render edilmez.
- URL geçersiz formatta ise server mapping kaydı güvenli biçimde null kabul eder ve loglar.
- Disabled CTA gerçek buton/link semantiği taşımamalı; pasif metin veya `aria-disabled` görseli kullanılabilir.

## Portrait approval

- Ana sayfa onaylı `home-hero.png` mevcut sabit varlık olarak korunur.
- About portrait database'den gelse bile yalnız `portrait_approval_state = approved` ise render edilir.
- Candidate/pending/rejected durumda production About sayfası portreyi gizler; aday portreyi final gibi göstermez.
- Portre onayı yokluğu About metninin yayınlanmasına otomatik engel değildir; görsel alan bağımsız gizlenebilir.

## Empty data

- Liste boşsa 200 response ve erişilebilir, nötr boş durum gösterilir.
- “Henüz yayınlanmış içerik yok” denebilir; draft/private kayıt varlığı ima edilmez.
- Ana sayfa featured sonuçları boşsa bölüm gizlenebilir veya güvenli boş durum gösterebilir.
- Mock içerik production database boşluğunu gizlemek için otomatik fallback yapılmaz.

## Database erişilemezse

- Database kesintisi “kayıt yok” gibi `notFound()` ile maskelenmemelidir.
- Liste ve ana sayfa için genel “İçerikler geçici olarak yüklenemiyor” durumu veya güvenli last-known-good cache düşünülebilir.
- Detail route için kesinti, kayıt yokluğundan ayrılan server error/error boundary davranışına gitmelidir; private kayıt bilgisi yine açığa çıkmaz.
- Production'da sessizce mock veriye dönmek yasaktır; ziyaretçi mock içeriği gerçek production verisi sanabilir.
- Hata detayları, Supabase mesajı, tablo adı veya policy bilgisi client'a yazılmaz.

## Build/runtime veri okuma

Önerilen gelecek yaklaşım:

- Public list/detail veri okuması server-side yapılır.
- Secret/service role client bundle'a konmaz; normal public read için RLS destekli güvenli server/client anahtarı kullanılır.
- Build'in database erişimine tamamen bağımlı olup deployment'ı kırması yerine runtime/ISR ve güvenli cache yaklaşımı değerlendirilir.
- Sitemap/metadata üretimi de yalnız published + public kayıtları kullanır.
- Dynamic slug route, görünmeyen içerik için aynı `notFound()` sınırını korur.

## Cache ve revalidation

Henüz uygulanmayacak hedef yaklaşım:

- İçerik tipi bazında cache tag: `projects`, `writings`, `journey`, `profile`.
- Publish/unpublish sonrası ilgili tag/path kontrollü revalidate edilir.
- Kısa stale süreleri yerine publish event tabanlı revalidation tercih edilebilir.
- Cached kayıt görünürlük kaybettiğinde eski public içerik uzun süre servis edilmemelidir.
- Rollback sırasında list, detail, homepage featured ve sitemap birlikte invalidation almalıdır.

## Response mapping

Database row doğrudan component props olarak kullanılmamalıdır. Arada public-safe mapper bulunmalıdır:

1. runtime/schema doğrulaması,
2. workflow + visibility doğrulaması,
3. approval filtreleri,
4. null/default normalizasyonu,
5. yalnız public-safe DTO üretimi.

Bu sprintte mapper kodu yazılmaz.
