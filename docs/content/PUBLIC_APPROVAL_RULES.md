# Public Approval Rules

> Kullanıcı onayı, publish state ve visibility birbirinden bağımsız güvenlik kapılarıdır. Bu belge gerçek approval UI veya workflow implementasyonu içermez.

## Temel kural

Bir içerik ancak aşağıdaki koşullar sağlandığında public render adayıdır:

1. `publish_state = published`
2. `visibility = public`
3. Render edilecek her hassas alan kendi approval kontrolünü geçer.

İçerik published olsa bile link, sosyal hesap, iletişim bilgisi, portre veya görsel otomatik onaylanmış sayılmaz.

## Link approval

GitHub, demo, external source, contact ve social URL'ler için:

- Kullanıcı onayı olmadan aktif olmaz.
- Null URL anchor olarak render edilmez.
- URL dolu olsa bile approval state approved değilse anchor render edilmez.
- Private repository, signed URL, Studio URL veya kişisel yönetim bağlantısı public'e taşınmaz.
- URL label'ı onay anlamına gelmez.
- Link değiştiğinde önceki approval geçersiz sayılmalı veya yeniden review gerektirmelidir.
- URL protokol/host doğrulaması server mapping aşamasında yapılmalıdır.

Önerilen state:

- `missing`
- `pending`
- `approved`
- `rejected`

## Portrait ve image approval

- Ana sayfa portresi `public/images/portraits/home-hero.png` onaylı referanstır ve bu geçiş kapsamında değiştirilmez.
- Hakkımda portresi kullanıcı tarafından açıkça onaylanmadan final kabul edilmez.
- About candidate portrait development/mock ortamında açık notla incelenebilir; production database akışında approved değilse gizlenir.
- Yeni yapay insan görseli veya kullanıcıya benzemeyen portre eklenmez.
- Project cover, writing cover ve gallery görselleri ayrı image approval state taşımalıdır.
- Görsel değiştiğinde approval yeniden gereklidir.
- Approved image için alt metin/public kullanım izni de onay paketinin parçası olmalıdır.

Önerilen state:

- `missing`
- `candidate`
- `pending`
- `approved`
- `rejected`

## Profile/contact approval

Aşağıdaki alanlar kullanıcı onayı olmadan eklenmez:

- gerçek e-posta,
- GitHub profili,
- LinkedIn veya sosyal medya,
- yaş,
- eğitim ve iş geçmişi,
- başarı/müşteri/gelir iddiaları,
- gerçek biyografi detayları.

Contact URL onayı ile genel profil metni onayı ayrı tutulabilir.

## Publish state onay değildir

| Alan | Published içerikte otomatik görünür mü? |
| --- | --- |
| Onaylı metin alanları | Evet |
| Null link | Hayır |
| Pending/rejected link | Hayır |
| Approved link | Evet, URL validation sonrası |
| Candidate/pending portrait | Hayır |
| Approved portrait | Evet |
| Private Studio notu | Hayır |
| Internal approval/rejection note | Hayır |

## Approval kaydı için gelecek beklenti

Kesin migration kararı olmadan şu metadata değerlendirilebilir:

- `approval_state`
- `approved_at`
- `approved_by`
- `approval_version` veya content hash
- `rejection_reason` — private
- `last_changed_at`

Onay verildikten sonra hassas alan değişirse version/hash eşleşmesi bozulur ve alan pending durumuna döner.

## Public mapper kuralı

Public-safe mapper:

- onaysız URL'yi response DTO'ya dahil etmez,
- onaysız asset URL'sini response DTO'ya dahil etmez,
- internal approval note'u client'a göndermez,
- eksik alanı sahte placeholder değerle doldurmaz,
- onaylı alanı uygun semantic element ile render eder.
