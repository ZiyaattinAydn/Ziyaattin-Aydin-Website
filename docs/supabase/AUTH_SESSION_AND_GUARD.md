# Auth Session and Guard Architecture

Durum: **Öneri / kullanıcı onayı bekliyor.** Gerçek Auth, Proxy veya route guard implementasyonu yapılmamıştır.

## Önerilen baseline

- Cookie tabanlı Supabase SSR session
- Public signup kapalı
- Tek owner hesabı
- Owner yetkisi `auth.uid()` ile bağlı database profili üzerinden
- Production Studio erişimi için TOTP MFA / `aal2`
- Next.js 16 Proxy yalnız session yenileme ve erken redirect
- Studio server layout ve her mutation içinde yeniden auth/owner kontrolü
- Database/Storage erişiminde RLS son otorite

## Karar matrisi

| Başlık | Önerilen seçenek | Alternatif | Güvenlik etkisi | Kullanıcı onayı |
| --- | --- | --- | --- | --- |
| Session modeli | Cookie tabanlı Supabase SSR | Client-only local storage session | SSR ve server guard ile daha tutarlı; cookie/caching dikkat ister | Gerekli |
| Studio kullanıcı modeli | Tek owner, public signup kapalı | Gelecekte multi-user/RBAC | Saldırı yüzeyi ve policy karmaşıklığı düşük | Gerekli |
| Owner doğrulama | `owner_profiles` + `auth.uid()` | Email allowlist | UUID tabanlı model e-posta değişiminden etkilenmez | Gerekli |
| İlk provider | Email/password | Magic link-only veya OAuth | Password recovery ve brute-force koruması gerekir | Gerekli |
| Magic link | İlk sürümde kapalı veya yalnız alternatif | Ana giriş yöntemi | Link/email hesabı güvenliğine bağlı; yanlışlıkla signup engellenmeli | Gerekli |
| MFA | TOTP zorunlu, Studio için `aal2` | MFA sonraki faz / phone MFA | Owner hesabı ele geçirilmesine karşı güçlü ek katman | Gerekli |
| Proxy görevi | Session refresh + erken redirect | Tüm authorization'ı Proxy'de yapmak | Tek katmana bağımlılık engellenir | Mimari öneri; implementasyon onayı gerekli |
| Nihai route guard | Studio server layout + mutation check | Yalnız client redirect | Client bypass edilse bile koruma sürer | Gerekli |
| Session timeout | Plan destekliyorsa inactivity/time-box + single-session | Supabase default session | Kayıp cihaz riskini azaltır; sık login UX'i yaratır | Gerekli |
| Recovery | Verified email reset + backup TOTP faktörü | Manuel admin recovery | Recovery bypass saldırı yüzeyi yaratmamalı | Gerekli |

## `/login` davranışı

### Giriş yapmamış kullanıcı

- Login formu gösterilir.
- Public signup bulunmaz.
- Redirect parametresi varsa yalnız aynı-origin internal path kabul edilir.
- Başarısız login genel hata döndürür; hesabın varlığını açık etmez.

### Giriş yapmış owner — MFA tamamlanmış

- `/studio` veya güvenli internal `next` path'e yönlendirilir.

### Giriş yapmış owner — MFA gerekiyor

- MFA challenge ekranına yönlendirilir.
- `aal2` olmadan Studio içeriği render edilmez.

### Giriş yapmış fakat owner olmayan kullanıcı

- Studio erişimi reddedilir.
- Session'ı otomatik silme veya güvenli “yetkisiz hesap” ekranı seçenekleri kullanıcı onayıyla belirlenir.
- Owner olmayan kullanıcıya Studio veri sorgusu yapılmaz.

## `/studio/**` erişim kontrolü

Önerilen kontrol sırası:

1. Proxy session cookie sürekliliğini sağlar ve obvious unauthenticated isteği `/login`e yönlendirebilir.
2. Studio root layout server tarafında gerçek Auth user'ı doğrular.
3. `owner_profiles` veya eşdeğer yetki tablosu sorgulanır.
4. MFA zorunluysa current assurance level `aal2` olmalıdır.
5. Alt sayfa/server mutation aynı user/owner koşulunu yeniden kontrol eder.
6. Database/Storage RLS policy son erişim kararını verir.

## Next.js 16 Proxy sınırı

Next.js 16'da `middleware.ts` convention'ı `proxy.ts` olarak yeniden adlandırılmıştır.

Proxy şunları yapabilir:

- Session token refresh cookie'lerini request/response arasında taşımak
- `/login` ve `/studio/**` için erken redirect
- Güvenli path normalization
- Expired/eksik session için UX iyileştirmesi

Proxy şunları tek başına yapmamalıdır:

- Owner authorization'ın tek kaynağı olmak
- Database role bilgisini güvenilir cache gibi kabul etmek
- Service role kullanmak
- RLS yerine geçmek
- Client tarafından gönderilen role/owner bilgisini kabul etmek

## Güvenli redirect

- Yalnız `/` ile başlayan internal path kabul edilir.
- `//`, protocol içeren URL, farklı host veya encoded external redirect reddedilir.
- Varsayılan başarılı hedef `/studio` olmalıdır.
- Login callback allowlist local, Preview ve Production origin'leriyle sınırlanır.

## Session timeout önerisi

Kesin süre kullanıcı ve Supabase planı doğrulanınca seçilmelidir.

Öneri:

- JWT expiration için Supabase güvenli varsayılanı korunur.
- Plan destekliyorsa 8–12 saat inactivity timeout değerlendirilir.
- Tek owner senaryosunda single-session seçeneği değerlendirilir.
- Kritik publish/delete işlemlerinde yakın zamanda MFA doğrulaması veya yeniden doğrulama opsiyonu backlog'a eklenebilir.

Plan desteklemeyen özellikler uygulanmış gibi belgelenmemelidir.

## Recovery önerisi

- Email/password seçilirse verified email password reset akışı.
- TOTP MFA için en az bir backup TOTP factor önerilir.
- Recovery code desteği varsayılmamalıdır; Supabase desteği implementasyon tarihinde yeniden kontrol edilir.
- Owner recovery prosedürü repository dışında güvenli biçimde saklanır.
- Recovery, owner allowlist/RLS kontrolünü bypass etmez.

## Hata ve rate-limit davranışı

- Login hatası kullanıcı enumeration yapmayan genel mesaj olmalıdır.
- Birden çok başarısız denemede Supabase rate limits/CAPTCHA seçenekleri değerlendirilir.
- Raw Auth error, stack trace veya token browser'a gösterilmez.
- Yetkisiz erişim loglanabilir; log içinde secret veya tam token bulunmaz.

## Kullanıcı kararı gerektirenler

- Email/password mı, magic link mi?
- TOTP MFA production Studio için zorunlu mu?
- Owner olmayan authenticated kullanıcı davranışı
- Session inactivity/time-box/single-session değerleri ve plan uyumu
- Recovery prosedürü ve backup factor
- Auth implementasyonuna Sprint 06'da başlanması
