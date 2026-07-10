# Mock Data Migration Inventory

> Kaynak: `src/data/mock-content.ts` ve mevcut Public rotalar. Bu belge seed SQL değildir; mock verilerin hangilerinin güvenli development seed adayı olabileceğini ve hangilerinin gerçek kullanıcı içeriği beklediğini sınıflandırır.

## Genel karar

Mevcut mock kayıtların hiçbiri production `published + public` içerik olarak doğrudan taşınmamalıdır. Development seed'e alınacaksa:

- açıkça mock/demo olduğu korunmalı,
- `publish_state = draft` veya `review`,
- `visibility = private` ya da yalnız local/dev ortamında kullanılacak güvenli durum,
- tüm gerçek URL alanları null,
- image/link approval state `missing` veya `pending`

olmalıdır.

## Project envanteri

| Slug | Mevcut durum | Development seed adayı | Production'a doğrudan? | Bekleyen alanlar | Not |
| --- | --- | --- | --- | --- | --- |
| `next-ai-dashboard` | Mock project, draft/review-required, public mock görünürlük | Evet, güvenli UI seed | Hayır | Gerçek açıklama, progress, GitHub/demo, görsel ve kullanıcı onayı | `github_url` ve `demo_url` null kalmalı. |
| `flowfit` | Planlanan mobil ürün fikri, content-draft | Evet, yalnız draft seed | Hayır | Ürün kapsamı, gerçek ekranlar, mağaza/repo linki, gerçek tarih | Supabase teknoloji etiketi implementasyon iddiası değildir. |
| `trace-analytics` | Mock arayüz/prototip, review | Evet, public-safe temsili seed | Hayır | Gerçek sistem verisi, ekran görüntüsü, metrik, link onayı | Gerçek log veya private veri seed'e girmemeli. |
| `orbit-dashboard` | “Tamamlandı” görünen mock sunum | Riskli; yalnız açık mock etiketiyle | Hayır | Gerçek proje kanıtı, kapsam, link ve görsel onayı | `status=Tamamlandı` gerçek başarı gibi algılanabileceği için production seed'e taşınmamalı. |

### Project alanları

Database'e taşınabilecek yapısal alanlar:

- slug, title, description, category,
- status/status label,
- summary/problem/approach,
- array/json içerikleri,
- progress constraint test verisi,
- isFeatured,
- workflow/visibility state,
- null link + approval state örnekleri.

Geçici mock kalacak veya kaldırılacak alanlar:

- `contentState`, `visibilityNote`, mock-specific `sourceNote`,
- “Sprint mock kaydı”, “Mock tamamlandı” gibi timeframe değerleri,
- gerçek başarı algısı oluşturabilecek tamamlandı metinleri,
- doğrulanmamış teknolojiler kişisel uzmanlık kanıtı olarak kullanılmamalı.

## Writing envanteri

| Slug | Mevcut durum | Development seed adayı | Production'a doğrudan? | Bekleyen alanlar |
| --- | --- | --- | --- | --- |
| `yapay-zeka-caginda-yazilim-gelistirici-olmak` | Featured mock article, draft/review-required | Evet, editor/render seed | Hayır | Kullanıcı tarafından yazılmış final metin, gerçek yayın tarihi, kaynaklar, onay |
| `modern-web-performans-ipuclari` | Mock performance article, draft | Evet | Hayır | Gerçek ölçüm, örnek, kaynak, tarih |
| `minimal-tasarimin-gucu` | Mock product/design article, draft | Evet | Hayır | Gerçek kişisel görüş/deneyim onayı, tarih, kaynak |

Database'e taşınabilecek yapısal alanlar:

- slug/title/excerpt/category/tags,
- section JSON şekli,
- related content ilişkisi örnekleri,
- reading time number'a dönüştürülerek,
- null external link davranışı,
- featured ve sort order test verisi.

Seed'e aktarılmaması gereken placeholder değerler:

- `date: "Mock tarih"`,
- `updatedLabel` metinleri,
- `coverLabel` mock kodları,
- `placeholderNote`,
- gerçekmiş gibi algılanabilecek kaynak/performans iddiaları.

Eksik alanlar:

- gerçek `published_at`,
- canonical body/content format kararı,
- cover asset ve image approval,
- gerçek external source URL'leri,
- yazar/profile ilişki kararı.

## Journey envanteri

Mevcut kayıtlar: `Aşama 01–04`.

Development seed adayı:

- Timeline UI ve sıralama testi için evet.
- Gerçek kronoloji veya kişisel geçmiş olarak hayır.

Database'e taşınabilecek:

- title/detail/lesson/statusNote yapısı,
- related project/writing ilişki örnekleri,
- sort order,
- workflow/visibility test state'leri.

Kullanıcıdan beklenen:

- gerçek tarih/date label,
- gerçek dönüm noktaları,
- doğrulanmış kişisel anlatım,
- ilişkili production project/writing kayıtları.

Kaldırılacak placeholder:

- `Aşama 01` gibi yalnız layout amaçlı marker'lar, gerçek içerik sağlandığında değiştirilmeli.

## Profile/About envanteri

Yapısal seed adayı:

- focus area JSON şekli,
- values/technologies array şekli,
- candidate portrait approval davranışı,
- null contact/social davranışı.

Production'a doğrudan taşınmamalı:

- geçici headline/description,
- onaysız `about-portrait.png` final asset olarak,
- uzmanlık veya kişisel deneyim izlenimi verebilecek doğrulanmamış metinler,
- herhangi bir gerçek contact/social URL uydurusu.

Kullanıcı onayı bekleyen:

- final About metni,
- About portresi,
- e-posta,
- GitHub/LinkedIn/sosyal linkler,
- eğitim, yaş, iş geçmişi ve başarı bilgileri.

Korunacak sabit varlık:

- Ana sayfa `home-hero.png` onaylı portre olarak korunur; About mapping tarafından değiştirilmez.

## Development seed'e aday minimum paket

Güvenli seed paketi aşağıdaki amaçlarla sınırlı olabilir:

- 2–4 draft/private project kaydı,
- 2–3 draft/private writing kaydı,
- 4 draft/private journey kaydı,
- candidate/no-contact owner profile,
- tüm external URL'ler null,
- approval state'ler `missing`/`pending`,
- hiçbir kayıt anonymous RLS filtresini geçmez.

Anonymous public sorguyu test etmek için en fazla bir açıkça “development demo” kaydı `published + public` yapılacaksa bu yalnız local/dev seed dokümanında belirtilmeli ve production seed sürecinden ayrılmalıdır.

## Seed'e aktarılmaması gerekenler

- Sahte GitHub/demo/contact/social URL,
- gerçek kişi hakkında onaysız biyografi,
- private repository/path bilgisi,
- gerçek log/metric/customer data,
- candidate portrait'i approved yapan değer,
- `auth.users` veya gerçek owner UUID,
- gerçek başarı/müşteri işi gibi algılanacak mock statüler,
- production secret veya Storage signed URL.

## Migration öncesi eksik kararlar

- JSONB vs alt tablo yapısı,
- link başına approval kolonları,
- profile ile owner settings ayrımı,
- slug redirect geçmişi,
- gerçek published dates,
- real content ownership/onayları,
- development seed ile production seed ayrımı.
