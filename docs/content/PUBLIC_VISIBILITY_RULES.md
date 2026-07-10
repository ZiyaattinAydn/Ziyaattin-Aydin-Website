# Public Visibility Rules

> Bu belge Public anonymous read sınırını tanımlar. Gerçek RLS policy veya sorgu implementasyonu içermez.

## İki ayrı eksen

Workflow ve görünürlük tek enum içinde birleştirilmemelidir:

- `publish_state`: `draft`, `review`, `approved`, `published`, `archived`
- `visibility`: `public`, `hidden`, `private`

Public erişim için **iki koşul birlikte** sağlanır:

```text
publish_state = published AND visibility = public
```

`approved`, yayına hazır olmayı; `published`, gerçekten yayınlanmış olmayı ifade eder. `hidden` ve `private`, içerik published olsa bile anonymous erişimi kapatır.

## Durum matrisi

| Durum | Liste sayfası | Doğrudan slug | Anonymous | Studio owner | Index | Public davranış | Gelecek preview |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `draft` | Hayır | Hayır | Hayır | Evet | `noindex` | `notFound()` | Owner-only preview desteklenebilir. |
| `review` | Hayır | Hayır | Hayır | Evet | `noindex` | `notFound()` | Review token/session ile ileride desteklenebilir. |
| `approved` | Hayır | Hayır | Hayır | Evet | `noindex` | `notFound()` | Publish öncesi owner preview desteklenebilir. |
| `published` + `public` | Evet | Evet | Evet | Evet | Index alabilir | Normal render | Gerekmez. |
| `archived` | Varsayılan hayır | Hayır | Hayır | Evet | `noindex` | Şimdilik `notFound()` | İleride public arşiv kararıyla değişebilir. |
| `hidden` | Hayır | Hayır | Hayır | Evet | `noindex` | `notFound()` | Owner-only preview olabilir. |
| `private` | Hayır | Hayır | Hayır | Evet | `noindex` | `notFound()` | Public route üzerinden preview önerilmez. |

## Bilgi sızdırmama kuralı

Public detail route aşağıdaki kayıtlar arasında farklı mesaj üretmez:

- slug yok,
- draft,
- review,
- approved ama yayınlanmamış,
- archived,
- hidden,
- private,
- owner'a ait olmayan veya okunamayan kayıt.

Hepsi public kullanıcı için aynı `notFound()` davranışına gider. “Bu içerik private”, “taslak mevcut” veya “onay bekliyor” gibi kayıt varlığını doğrulayan mesaj gösterilmez.

## Liste sorguları

- Liste sorguları yalnız `published + public` kayıtları döndürür.
- UI tarafında filtreleyerek gizlemek yeterli güvenlik değildir; database/RLS ve server query aynı sınırı uygulamalıdır.
- Featured olmak, visibility veya publish kontrolünü geçersiz kılmaz.
- Related content bağlantıları da aynı görünürlük filtresinden geçer.

## Preview modu için gelecek sınır

Preview modu eklenirse:

- Anonymous preview URL olmamalı.
- Owner session ve gerekli MFA/allowlist kontrolü aranmalı.
- Preview response `noindex, nofollow, noarchive` olmalı.
- Preview token kullanılacaksa kısa ömürlü, tek amaçlı ve server tarafında doğrulanmış olmalı.
- Preview route, kaydın private alanlarını public response'a taşımamalı.

Bu sprintte preview implementasyonu yapılmaz.
