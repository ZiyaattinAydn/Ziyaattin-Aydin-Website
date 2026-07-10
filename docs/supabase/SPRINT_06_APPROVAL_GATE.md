# Sprint 06 User Approval Gate

Durum: **USER_APPROVAL_REQUIRED**

Sprint 06'da Supabase/Auth/route guard implementasyonuna geçilmeden önce aşağıdaki kararlar kullanıcı tarafından cevaplanmalıdır. Boş veya onaysız karar blocker kabul edilir.

| Karar | Öneri | Mevcut durum | Kullanıcı cevabı | Blocker etkisi |
| --- | --- | --- | --- | --- |
| Supabase region | Türkiye'ye yakın **Central EU / Frankfurt** | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Project oluşturulamaz |
| Environment stratejisi | Ayrı Production ve Non-production project | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Env/migration güvenli kurulamaz |
| Auth provider | İlk sürüm email/password, public signup kapalı | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Login implementasyonu başlayamaz |
| Magic link | İlk sürümde kapalı; gerekirse sonradan alternatif/recovery | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Auth callback kapsamı belirsiz |
| MFA yöntemi | TOTP authenticator | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Studio güvenlik seviyesi belirsiz |
| MFA zorunluluğu | Production Studio erişiminden önce `aal2` zorunlu | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Route guard tamamlanamaz |
| Owner/admin allowlist | `owner_profiles` içinde auth UUID; email-only yetki yok | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | RLS/guard policy kesinleşemez |
| İlk owner bootstrap | Review edilmiş tek seferlik SQL/admin işlemi | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Owner hesabı yetkilendirilemez |
| Owner olmayan Auth kullanıcı davranışı | Studio 403/denied; veri sorgusu yok | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Guard UX belirsiz |
| Session timeout | Plan destekliyorsa 8–12 saat inactivity + single-session değerlendirmesi | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Auth settings ve UX belirsiz |
| Recovery flow | Verified email reset + backup TOTP factor | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Hesap kurtarma güvenliği belirsiz |
| Public Storage bucket | `public-assets` | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Storage SQL/policy kesinleşemez |
| Private Storage bucket | `private-files` | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Studio file policy kesinleşemez |
| Maksimum dosya boyutu | Başlangıç için 25 MB / dosya | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Bucket/upload validation belirsiz |
| Public MIME allowlist | JPEG, PNG, WebP, AVIF; gerekiyorsa public PDF ayrıca onay | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Public upload policy belirsiz |
| Private MIME allowlist | Görseller, PDF, DOCX, PPTX; executable/archive varsayılan kapalı | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Private upload policy belirsiz |
| Development seed | Yalnız non-production'da kullanılabilir | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Preview test verisi planı belirsiz |
| SQL paketine onay | Studio Sprint 05 SQL paketi security review sonrası uygulanabilir | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Migration uygulanamaz |
| SQL ilk hedefi | Önce non-production project | Önerildi | `USER_APPROVAL_REQUIRED` | Production'a güvenli geçiş yapılamaz |
| Auth/guard implementasyonuna geçiş | Core Sprint 06 başlatılabilir | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Kod geliştirme başlamaz |
| Production migration onayı | Preview kabul testinden sonra ayrı onay | `USER_APPROVAL_REQUIRED` | `USER_APPROVAL_REQUIRED` | Production database kurulamaz |

## Öneri gerekçeleri

### Region

Central EU / Frankfurt Türkiye'ye yakın mevcut EU seçeneklerinden biridir. Region project oluşturulduktan sonra kolayca değiştirilemediği için başlangıçta kesinleştirilmelidir.

### Auth provider

Tek owner Studio için email/password en basit baseline'dır. Public signup kapalı tutulur. Magic link seçilirse yeni kullanıcı otomatik oluşturma davranışı kapatılmalı ve redirect allowlist dikkatle yapılandırılmalıdır.

### MFA

TOTP, SMS bağımlılığı olmadan authenticator uygulamasıyla ikinci faktör sağlar. Production Studio için zorunlu olması önerilir.

### Owner allowlist

Yetkinin yalnız e-posta string'ine dayanması yerine Auth UUID ile bağlı owner profile kullanılması önerilir. E-posta değişikliği yetkiyi yanlışlıkla taşımamalıdır.

### Session

Supabase planı destekliyorsa inactivity timeout ve single-session owner hesabı için faydalıdır. Plan desteği ve kullanım rahatlığı doğrulanmadan kesin değer uygulanmamalıdır.

### Storage

Public ve private varlıkların aynı bucket'ta yalnız path kurallarıyla ayrılması yerine ayrı bucket'lar daha anlaşılır policy sınırı sağlar.

## Onay kaydı formatı

Kullanıcı kararları verildiğinde tablo güncellenmeli ve aşağıdaki kayıt handoff'a eklenmelidir:

```text
Decision date:
Approved by: Ziyaattin
Approved decisions:
Deferred decisions:
Rejected recommendations:
Sprint 06 implementation authorized: yes | no
SQL non-production application authorized: yes | no
```
