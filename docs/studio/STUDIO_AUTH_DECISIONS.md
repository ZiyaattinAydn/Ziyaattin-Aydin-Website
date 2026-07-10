# Studio Auth Decisions

> Bu belge Sprint 03 karar hazırlığıdır. Gerçek Supabase Auth, MFA, route guard, middleware, session kontrolü veya environment değişkeni implementasyonu içermez.

## Mevcut durum

- `/login` sayfası placeholder durumundadır.
- Form alanları disabled kalmalıdır.
- `/studio` rotaları UI/mock workflow incelemesi için erişilebilir durumdadır.
- Bu durum gerçek güvenlik sağlamaz; gizli URL güvenlik kabul edilmez.
- Supabase Auth, MFA, RLS ve route guard sonraki fazda bağlanacaktır.

## Ürün ilkesi

Studio yalnız Ziyaattin'in private çalışma alanı olacaktır. Herkese açık kayıt, self-service sign-up veya çok kullanıcılı ekip akışı bu karar notunun kapsamı dışındadır.

## Karar bekleyen konular

### 1. Supabase Auth bağlama stratejisi

Durum: karar bekliyor.

Açık sorular:
- Sadece önceden oluşturulmuş tek Supabase kullanıcısı mı kabul edilecek?
- E-posta/şifre dışında magic link veya provider kullanılacak mı?
- Login ekranı server action, route handler veya client-side Supabase helper ile mi bağlanacak?
- Auth callback route ihtiyacı olacak mı?

Geçici kural:
- Bu sprintte Supabase client/import/env eklenmez.
- Login formu çalışır gibi gösterilmez.

### 2. MFA yöntemi

Durum: kullanıcı kararı bekliyor.

Açık sorular:
- Authenticator uyumlu TOTP zorunlu mu olacak?
- Recovery code üretimi ve saklama davranışı nasıl anlatılacak?
- MFA kurulumu ilk girişte mi, admin panelindeki ayarlardan mı yapılacak?
- MFA tamamlanmadan Studio route'ları nasıl kilitlenecek?

Geçici kural:
- UI metinleri MFA'nın sonraki güvenlik fazında bağlanacağını söyler.
- MFA kod alanı disabled kalır.

### 3. Route guard stratejisi

Durum: karar bekliyor.

Açık sorular:
- Studio koruması middleware ile mi, server component/session check ile mi, yoksa ikisinin kombinasyonu ile mi yapılacak?
- Şifre doğru ama MFA tamamlanmamış durumda kullanıcı hangi ara route'a yönlenecek?
- `/studio` altındaki her route aynı guard'ı mı paylaşacak?
- Public route'lar Studio auth kontrolünden tamamen ayrılacak mı?

Geçici kural:
- Bu sprintte middleware veya gerçek route guard eklenmez.
- Studio public menüye eklenmez.

### 4. Session timeout ve remember me

Durum: karar bekliyor.

Açık sorular:
- Private Studio oturumu ne kadar süre açık kalacak?
- Remember me seçeneği olacak mı?
- Pasif kalma timeout'u uygulanacak mı?
- Mobil tarayıcı davranışı ayrıca ele alınacak mı?

Geçici kural:
- Login ekranında remember me veya timeout kontrolü aktif gösterilmez.

### 5. Recovery davranışı

Durum: karar bekliyor.

Açık sorular:
- Şifre sıfırlama akışı aktif edilecek mi?
- MFA cihazı kaybolursa recovery code veya manuel müdahale yolu nasıl olacak?
- Recovery ekranları public route altında mı, auth route group altında mı yer alacak?

Geçici kural:
- Recovery linkleri gerçekmiş gibi eklenmez.
- Kullanıcıya güvenlik tamamlandı izlenimi verilmez.

### 6. Owner profile ve public profil ayrımı

Durum: karar bekliyor.

Açık sorular:
- `user_profile` / `owner_settings` private ayarları ne zaman açılacak?
- Public iletişim ve sosyal linkler kullanıcı onayı olmadan aktif edilecek mi?
- Public profil alanları private owner settings'ten nasıl ayrılacak?

Geçici kural:
- Hakkımda portresi, gerçek iletişim ve sosyal linkler kullanıcı onayı olmadan aktif edilmez.

## Uygulama dışı bırakılanlar

Bu sprintte özellikle yapılmayacaklar:

- Supabase client oluşturma.
- `.env.example` veya `.env.local` değiştirme.
- Middleware ekleme.
- Route guard yazma.
- Auth callback route'u ekleme.
- MFA doğrulama akışı oluşturma.
- Session veya cookie yönetimi ekleme.
- RLS policy veya SQL migration yazma.

## Sonraki faz için önerilen kontrol listesi

- [ ] Supabase project ve Auth provider ayarları doğrulanacak.
- [ ] Tek owner hesabı stratejisi netleşecek.
- [ ] MFA yöntemi ve recovery davranışı seçilecek.
- [ ] Route guard uygulama noktası belirlenecek.
- [ ] RLS policy taslakları migration öncesi gözden geçirilecek.
- [ ] Public/private data boundary test edilecek.
