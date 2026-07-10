# Sprint 05 Final Decision Gate

- Tarih: 2026-07-10
- Branch: `integration/sprint-05`
- Durum: `USER_APPROVAL_REQUIRED`
- Kapsam: Supabase proje oluşturma, SQL uygulama ve Sprint 06 Auth/route guard başlangıç kararları

## Temel İlke

Sprint 05; mimari, public veri geçişi ve SQL güvenlik paketinin hazırlanmasıyla tamamlanabilir.

Aşağıdaki kararlar cevaplanmadan:

- gerçek Supabase projesi oluşturulmamalı,
- SQL paketi çalıştırılmamalı,
- Auth veya MFA implementasyonu başlamamalı,
- middleware veya route guard eklenmemeli,
- gerçek CRUD, Storage upload veya publish işlemi başlatılmamalı,
- Sprint 06 başlatılmamalıdır.

## Karar Tablosu

| Karar | Önerilen seçenek | Risk | Mevcut durum | Kullanıcı cevabı | Blocker mı? |
| --- | --- | --- | --- | --- | --- |
| Supabase projesi şimdi oluşturulsun mu? | Önce ayrı development/preview projesi; production daha sonra | Yanlış environment üzerinde erken veri ve Auth kurulması | Proje oluşturulmadı | `USER_APPROVAL_REQUIRED` | Evet |
| Region | Kullanıcıya ve ana ziyaretçi kitlesine yakın Avrupa region | Gecikme ve veri yerleşimi etkisi | Seçilmedi | `USER_APPROVAL_REQUIRED` | Evet |
| Auth yöntemi | Email/password temel yöntem | Parola güvenliği ve recovery yükü | Karar verilmedi | `USER_APPROVAL_REQUIRED` | Evet |
| Magic link | İlk sürümde opsiyonel veya kapalı | E-posta teslimatı ve link ele geçirilmesi | Karar verilmedi | `USER_APPROVAL_REQUIRED` | Evet |
| TOTP MFA | Owner hesabı için zorunlu | Recovery kaybında erişim problemi | Taslak öneri mevcut | `USER_APPROVAL_REQUIRED` | Evet |
| Owner allowlist | `owner_profiles` içinde yalnız açıkça aktive edilen owner | Yanlış kullanıcıya Studio yetkisi verilmesi | SQL paketi pending model kullanıyor | `USER_APPROVAL_REQUIRED` | Evet |
| Owner kullanıcı e-postası | Gerçek owner hesabı oluşturulurken kullanıcı tarafından girilecek | Kişisel bilgi ve yanlış hesap aktivasyonu | Repository içinde yok | `USER_APPROVAL_REQUIRED` | Evet |
| Session timeout | Kısa/orta süreli owner oturumu; remember-me olmadan başlanması | Uzun oturumda yetkisiz erişim | Karar verilmedi | `USER_APPROVAL_REQUIRED` | Evet |
| Recovery yöntemi | Supabase recovery + güvenli yedek TOTP/recovery prosedürü | Hesap kilitlenmesi | Karar verilmedi | `USER_APPROVAL_REQUIRED` | Evet |
| Public bucket | `public-assets` | Onaysız görselin public olması | SQL taslağı hazır | `USER_APPROVAL_REQUIRED` | Evet |
| Private bucket | `private-files` | Private dosyanın yanlış policy ile açılması | SQL taslağı hazır | `USER_APPROVAL_REQUIRED` | Evet |
| Public dosya boyutu sınırı | 10 MB başlangıç sınırı | Büyük dosya maliyeti ve performans | SQL taslağı 10 MB | `USER_APPROVAL_REQUIRED` | Evet |
| Private dosya boyutu sınırı | 50 MB başlangıç sınırı | Storage maliyeti ve abuse | SQL taslağı 50 MB | `USER_APPROVAL_REQUIRED` | Evet |
| İzin verilen MIME türleri | SQL paketindeki dar allowlist | SVG veya doküman içerik riskleri | Taslak allowlist hazır | `USER_APPROVAL_REQUIRED` | Evet |
| Development seed çalıştırılsın mı? | Yalnız development/preview projesinde, gerçek owner aktivasyonundan sonra | Yanlış ortamda örnek veri | Seed hazır fakat çalıştırılmadı | `USER_APPROVAL_REQUIRED` | Evet |
| SQL paketinin çalıştırılmasına onay | Önce boş development projesinde dört migration sırasıyla | Şema/RLS hatasında veri veya erişim problemi | SQL yalnız repository içinde | `USER_APPROVAL_REQUIRED` | Evet |
| Sprint 06 Auth + route guard implementasyon onayı | SQL development testleri ve kararlar tamamlandıktan sonra | Erken implementasyon ve güvenlik açığı | Başlamadı | `USER_APPROVAL_REQUIRED` | Evet |

## Ek Veri Modeli Kararları

Aşağıdaki alanlar SQL paketinde bilinçli olarak kesinleştirilmedi:

- Profile/about içeriği private `owner_profiles` tablosunda mı yoksa ayrı public-safe tabloda mı tutulacak?
- `portrait_approval_state` hangi tablo ve Storage metadata modeliyle yönetilecek?
- Contact ve social linkler ayrı satırlar mı yoksa JSONB modelinde mi tutulacak?
- Her link kendi approval state alanına mı sahip olacak?
- Project için `github_url` ve `demo_url` tek `link_approval_state` mi kullanacak, yoksa link başına ayrı approval state mi olacak?
- Profile/about içeriği için publish state ve visibility alanları gerekecek mi?
- Slug değişiklikleri için redirect/history tablosu oluşturulacak mı?
- Project ve writing section içerikleri JSONB mi yoksa ilişkisel alt tablolar mı olacak?

Bu kararlar cevaplanmadan profile/contact/social/portrait şeması genişletilmemelidir.

## Sprint 05 Güvenlik Sonucu

- Gerçek Supabase URL veya key yok.
- Gerçek owner UUID yok.
- SQL gerçek Supabase projesinde çalıştırılmadı.
- Source kodunda Supabase client yok.
- Middleware ve route guard yok.
- Anonymous write policy yok.
- Anonymous yalnız `published + public` project, writing ve journey kayıtlarını okuyabilir.
- Task, note, file metadata ve publish queue anonymous erişime kapalıdır.
- Yeni Auth kullanıcısı otomatik owner olmaz.
- Seed Auth kullanıcısı oluşturmaz.
- Service role normal CRUD akışında kullanılmaz.
- Normal migration destructive SQL içermez.
- Rollback destructive ve veri kaybı uyarılıdır.

## Sonuç

- Sprint 05 merge durumu: `MERGE_ALLOWED`
- Gerçek Supabase proje oluşturma: `BLOCKED`
- SQL uygulama: `BLOCKED`
- Sprint 06 Auth/route guard başlangıcı: `BLOCKED`
- Blocker nedeni: `USER_APPROVAL_REQUIRED`

## Sprint 06 Uygulama Sonucu — S06_EXECUTION_RESULT

Sprint 05 sonundaki Sprint 06 karar kapısı kullanıcı tarafından onaylanmış ve uygulanmıştır.

- Development Supabase oluşturuldu.
- Development migration ve seed uygulandı.
- Auth/TOTP/AAL2 implementasyonu tamamlandı.
- Production Supabase, Public database cutover, geniş CRUD ve PWA ileri iş olarak kalmıştır.
