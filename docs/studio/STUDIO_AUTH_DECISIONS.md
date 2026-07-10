# Studio Auth Decisions — Sprint 05 Baseline

> Durum: **Karar önerisi hazırlandı, uygulanmadı.** Bu belge gerçek Supabase Auth, MFA, route guard, middleware, session/cookie yönetimi veya environment değişkeni içermez.

## Güvenlik hedefi

Studio yalnız Ziyaattin’in kullanacağı private yönetim alanıdır. İlk Auth implementasyonunda hedef çok kullanıcılı ekip sistemi değil, tek ve doğrulanmış owner hesabının güvenli erişimidir.

Temel ilkeler:

- Public sign-up kapalı olmalıdır.
- Auth olmuş her kullanıcı Studio owner kabul edilmemelidir.
- Yetki yalnız client metadata, form role alanı veya gizli URL’ye dayanmamalıdır.
- Owner yetkisi `auth.uid()` ile eşleşen, veritabanında kontrollü aktive edilmiş `owner_profiles` satırından gelmelidir.
- MFA tamamlanmadan Studio private verisi okunmamalıdır.
- Service role key browser/client bundle’a konmamalıdır.
- Route guard tek güvenlik katmanı değildir; RLS nihai veri sınırını korumalıdır.

## Karar matrisi

| Karar | Önerilen baseline | Alternatif | Ana risk | Kullanıcı onayı gerekli mi? | Durum / hedef sprint |
| --- | --- | --- | --- | --- | --- |
| Hesap modeli | Tek owner hesabı | Gelecekte kontrollü admin hesabı | Yanlışlıkla çok kullanıcıya yetki verilmesi | Evet | `USER_APPROVAL_REQUIRED` — Sprint 06 öncesi |
| Auth provider | Supabase Auth | Harici OAuth provider | Provider callback/account linking karmaşıklığı | Evet | `USER_APPROVAL_REQUIRED` |
| Ana giriş yöntemi | Email/password + TOTP MFA | Magic link + TOTP | Şifre yönetimi gerekir; magic link e-posta hesabını kritik faktör yapar | Evet | `USER_APPROVAL_REQUIRED` |
| Public sign-up | Kapalı | Before User Created Hook ile allowlist | Yanlış Dashboard ayarı veya hook hatası yeni hesap açabilir | Evet | Öneri: kapalı |
| Magic link | İlk fazda kapalı | Recovery veya ana giriş yöntemi | Link yönlendirme ve e-posta hesabı ele geçirilmesi riski | Evet | `USER_APPROVAL_REQUIRED` |
| MFA | Authenticator uyumlu TOTP zorunlu | MFA’sız tek faktör veya farklı yöntem | Cihaz kaybında recovery olmadan kilitlenme | Evet | Öneri: zorunlu TOTP |
| MFA enrollment | Owner hesabı oluşturulduktan sonra ilk güvenli oturumda zorunlu enrollment | Önceden manuel enrollment | Enrollment tamamlanmadan Studio erişimi sızabilir | Evet | Sprint 06/07 |
| MFA challenge | Şifre doğrulandıktan sonra AAL2 doğrulanmadan `/studio/**` erişimi yok | Sadece kritik işlemlerde MFA | MFA’nın private veri koruması zayıflar | Evet | Öneri: Studio’nun tamamında AAL2 |
| Owner allowlist | `owner_profiles.user_id = auth.uid()` + aktif owner/admin rolü | Doğrulanmış e-posta allowlist’i | E-posta değişimi/metadata güveni yanlış yetki verebilir | Evet | SQL baseline hazır, kullanıcı UUID’si bekleniyor |
| Owner aktivasyonu | Trusted SQL Editor/Dashboard işlemi | Otomatik role assignment | Her yeni Auth kullanıcısının owner olması kritik açık oluşturur | Evet | Öneri: kontrollü manuel aktivasyon |
| Session timeout | 8 saat mutlak oturum + 30 dakika pasiflik sonrası yeniden doğrulama değerlendirmesi | Daha kısa veya daha uzun süre | Kısa süre UX’i bozar; uzun süre cihaz riskini artırır | Evet | `USER_APPROVAL_REQUIRED` |
| Remember me | İlk fazda kapalı veya Supabase güvenli session varsayılanıyla sınırlı | Uzun kalıcı session | Kayıp/paylaşılan cihazda erişim süresi uzar | Evet | `USER_APPROVAL_REQUIRED` |
| Recovery | Şifre reset + tek kullanımlık MFA recovery prosedürü; manuel owner doğrulaması | Sadece e-posta reset | Zayıf recovery MFA’yı etkisizleştirir; yetersiz recovery kilitlenme yaratır | Evet | `USER_APPROVAL_REQUIRED` |
| Başarısız login | Genel hata mesajı, rate limit/CAPTCHA değerlendirmesi, kullanıcı varlığını açıklamama | Ayrıntılı hata mesajı | Account enumeration ve brute force | Evet | Sprint 06 Auth UX |
| Route guard | Server-side session + owner + MFA kontrolü; middleware yalnız erken yönlendirme yardımcı katmanı | Sadece middleware | Middleware tek başına veri güvenliği sağlamaz | Teknik onay | Sprint 06 |
| RLS | Tüm private tablolarda aktif; owner-only write | Server/service role üzerinden bypass CRUD | Client bug’ı private veriyi açabilir; service role kötüye kullanılabilir | Teknik onay | Sprint 05 SQL hazır, uygulanmadı |
| Storage | `public-assets` ve `private-files` ayrımı; owner UUID path prefix | Tek bucket | Private object yanlışlıkla public olabilir | Evet | Limit/MIME kararı bekliyor |

## Önerilen owner aktivasyon modeli

Sprint 05 SQL paketi şu modeli kullanır:

1. Supabase Auth üzerinde gerçek kullanıcı oluşturulur.
2. Auth trigger yalnız `pending`, rolesüz bir `owner_profiles` satırı oluşturur.
3. Gerçek UUID ve e-posta kullanıcı tarafından doğrulanır.
4. Trusted SQL Editor oturumunda yalnız o UUID `role = owner`, `status = active` yapılır.
5. RLS helper `auth.uid()` ile aktif owner/admin satırını kontrol eder.
6. Client herhangi bir role veya owner UUID seçemez.

Her yeni Auth kullanıcısı otomatik owner yapılmaz.

## Önerilen login ve MFA akışı

1. Kullanıcı `/login` üzerinden seçilen Supabase Auth yöntemiyle kimliğini doğrular.
2. Session yoksa Studio’ya geçiş yapılmaz.
3. Session var fakat allowlist profili aktif değilse erişim reddedilir.
4. Owner doğrulanmış fakat MFA enrollment yoksa enrollment ekranına yönlendirilir.
5. MFA enrollment var fakat mevcut session AAL2 değilse challenge ekranına yönlendirilir.
6. Session + owner + gerekli MFA seviyesi doğrulandıktan sonra `/studio/**` render edilir.
7. Server-side kontroller ve RLS birlikte uygulanır.

Bu akış plan durumundadır; route veya kod eklenmemiştir.

## Recovery önerisi

Kullanıcı kararından sonra recovery planı ayrıca kabul edilmelidir:

- Owner e-posta hesabının güvenliği ön koşuldur.
- Şifre reset linkleri kısa ömürlü ve tek kullanımlık olmalıdır.
- MFA cihazı kaybında ikinci doğrulama/recovery adımı tanımlanmalıdır.
- Recovery işlemi owner allowlist rolünü otomatik değiştirmemelidir.
- Yeni cihaz veya MFA reset sonrası mevcut session’ların iptal edilmesi değerlendirilmelidir.
- Recovery code/backup yöntemi düz metin repository veya not tablosunda tutulmamalıdır.

## Başarısız giriş davranışı

Önerilen UX ve güvenlik sınırı:

- “E-posta bulunamadı” gibi account enumeration mesajı gösterme.
- Genel “Giriş bilgileri doğrulanamadı” mesajı kullan.
- Art arda denemelerde Supabase rate limit ve gerekirse CAPTCHA ayarını değerlendir.
- Başarısız giriş nedeniyle owner role/status değiştirme.
- Login denemelerini application log’a secret/şifre içerecek şekilde yazma.
- MFA hatasını şifre hatasından ayrıştırırken hesap varlığını ifşa etme.

## Kullanıcıdan beklenen kararlar

Sprint 06 başlamadan önce en az şu cevaplar alınmalıdır:

- [ ] Ana giriş email/password mı, magic link mi?
- [ ] TOTP MFA zorunlu mu?
- [ ] Owner hesabının doğrulanmış e-posta adresi nedir?
- [ ] Owner UUID aktivasyonu için SQL paketi çalıştırılmasına onay var mı?
- [ ] Session timeout ve remember-me tercihi nedir?
- [ ] Recovery yöntemi nedir?
- [ ] Public/private bucket boyut ve MIME baseline’ı onaylandı mı?
- [ ] Development seed çalıştırılacak mı?
- [ ] Sprint 06 Auth + route guard implementasyonuna onay var mı?

## Bu sprintte uygulanmayanlar

- Supabase projesi veya Auth provider ayarı yapılmadı.
- Auth client/server paketi eklenmedi.
- `/login` gerçek forma dönüştürülmedi.
- Middleware, callback route veya route guard eklenmedi.
- MFA enrollment/challenge uygulanmadı.
- Session timeout veya recovery uygulanmadı.
- Gerçek owner UUID commit edilmedi.
- SQL gerçek Supabase projesine uygulanmadı.

## İlgili dokümanlar

- `supabase/README.md`
- `supabase/migrations/202607100001_initial_schema.sql`
- `supabase/migrations/202607100002_database_functions.sql`
- `supabase/migrations/202607100003_rls_policies.sql`
- `supabase/migrations/202607100004_storage_setup.sql`
- `docs/studio/STUDIO_DATA_MODEL_DRAFT.md`
- `docs/studio/STUDIO_SECURITY_RLS_PLAN.md`
- `docs/studio/STUDIO_PUBLISH_FLOW.md`
