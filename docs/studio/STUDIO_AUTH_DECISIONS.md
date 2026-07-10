# Studio Auth Decisions

> Bu belge Sprint 04 karar matrisi çıktısıdır. Gerçek Supabase Auth, MFA, middleware, route guard, session kontrolü, environment değişkeni veya migration implementasyonu içermez. Tüm başlıklar kullanıcı onayı ve entegrasyon kararı bekleyen plan maddeleridir.

## Mevcut durum

- `/login` sayfası placeholder durumundadır.
- Form alanları ve giriş butonu bilinçli olarak disabled kalır.
- `/studio` rotaları UI/mock workflow incelemesi için erişilebilir durumdadır.
- Bu durum gerçek güvenlik sağlamaz; gizli URL güvenlik kabul edilmez.
- Supabase Auth, MFA, RLS, Storage güvenliği ve route guard sonraki fazda bağlanacaktır.

## Ürün ilkesi

Studio yalnız Ziyaattin'in private çalışma alanı olacaktır. Herkese açık kayıt, self-service sign-up, davetli ekip yönetimi veya çok kullanıcılı rol matrisi Sprint 04 kapsamına alınmaz. İlk gerçek güvenlik fazında hedef, tek owner hesabı için admin-only erişim modelini sağlamaktır.

## Karar matrisi

| Başlık | Öneri | Avantaj | Risk / dikkat | Kullanıcı kararı gerekli mi? | İmplementasyon sprint'i |
| --- | --- | --- | --- | --- | --- |
| Supabase Auth provider | İlk fazda Supabase Auth üzerinde tek owner hesabı; ekstra OAuth provider eklenmesin. | Kurulum ve RLS ilişkisi sade kalır. | Provider çeşitliliği istenirse callback ve account linking karmaşıklaşır. | Evet; provider kapsamı onaylanmalı. | Faz 3 Auth sprint'i |
| Email/password | Tek owner için e-posta/şifre kullanılabilir; public sign-up kapalı olmalı. | Basit, MFA ile birlikte anlaşılır akış. | Zayıf şifre veya yanlış sign-up ayarı risk oluşturur. | Evet; owner e-postası ve sign-up kapatma kararı gerekir. | Faz 3 Auth sprint'i |
| Magic link | İlk fazda kapalı veya opsiyonel beklemede kalsın. | Kapalı kalırsa recovery ve link hijacking yüzeyi azalır. | Açılırsa e-posta erişimi kritik güvenlik faktörü olur. | Evet; kullanım kolaylığı mı, yüzey azaltma mı tercih edilecek? | Auth karar sprint'i sonrası |
| MFA yöntemi | Authenticator uyumlu TOTP zorunlu olsun. | Tek owner Studio için güçlü ikinci faktör sağlar. | Recovery code ve cihaz kaybı akışı net değilse kilitlenme riski var. | Evet; TOTP zorunluluğu ve recovery davranışı onaylanmalı. | Faz 3 / MFA sprint'i |
| Session timeout | Private Studio için kısa/orta süreli timeout; pasif kalma davranışı ayrıca değerlendirilsin. | Paylaşılan cihaz riskini azaltır. | Çok kısa timeout çalışma akışını bölebilir. | Evet; süre kullanıcı tercihi gerektirir. | Auth hardening sprint'i |
| Remember me | İlk güvenlik fazında kapalı veya sınırlı süreli olsun. | Saldırı yüzeyini azaltır. | Sık giriş deneyimi yorucu olabilir. | Evet; mobil/desktop kullanım alışkanlığına göre karar verilmeli. | Auth hardening sprint'i |
| Recovery flow | Şifre sıfırlama + MFA recovery code planı ayrı yazılsın; gerçek ekranlar sonra eklensin. | Kilitlenme durumunda kontrollü çıkış yolu sağlar. | Recovery zayıf tasarlanırsa MFA etkisi azalır. | Evet; recovery code saklama ve manuel müdahale kararı gerekir. | Recovery sprint'i |
| Admin-only owner allowlist | Auth user id veya doğrulanmış owner e-posta allowlist'i server tarafında kontrol edilsin. | Tek owner sınırı netleşir, yanlış hesap erişimi engellenir. | E-posta bazlı kontrol tek başına yeterli olmayabilir; user id tercih edilmeli. | Evet; owner hesabı kesinleşmeli. | Faz 3 Auth sprint'i |
| Route guard stratejisi | Middleware + server-side session/MFA check kombinasyonu değerlendirilsin; public route'lar ayrık kalsın. | `/studio/**` sınırı merkezi yönetilir, server component kontrolleriyle güçlenir. | Yanlış middleware matcher public siteyi bozabilir. | Evet; guard noktası entegrasyonla seçilmeli. | Faz 3 Auth sprint'i |
| MFA tamamlanmamış ara durum | Şifre doğrulandı ama MFA yoksa Studio yerine MFA challenge/enrollment adımına yönlendirilsin. | Eksik MFA ile Studio erişimi engellenir. | Ara route ve session state yönetimi dikkat ister. | Evet; enrollment mı challenge mı önce gelecek kararı gerekir. | MFA sprint'i |
| Public/private veri sınırı | Studio private tabloları public route tarafından doğrudan okunmasın; publish edilen içerik public-safe kaynağa dönüştürülsün. | Private veri sızıntısı riski azalır. | Çift kaynak/publish queue tasarımı daha fazla iş gerektirir. | Kısmen; teknik karar gerekir. | Publish/data sprint'i |

## Admin-only erişim modeli taslağı

1. Public sign-up kapalı tutulur.
2. Supabase içinde yalnız önceden oluşturulmuş owner hesabı kabul edilir.
3. Owner doğrulaması sadece client UI mesajıyla değil, server tarafında yapılır.
4. `/studio/**` route'ları session + owner allowlist + MFA tamamlanma durumunu geçmeden private veri okumaz.
5. Public site, Studio session bilgisine ihtiyaç duymaz ve Studio auth kontrolünden etkilenmez.
6. Service role key client bundle'a asla konmaz.

Bu maddeler uygulanmış değildir; gerçek sprintte ayrı test ve güvenlik kabul kriteri gerektirir.

## Karar bekleyen açık sorular

- Owner allowlist `auth.uid()` ile mi, doğrulanmış e-posta ile mi, yoksa ikisinin kombinasyonuyla mı yapılacak?
- MFA enrollment ilk girişte zorunlu mu olacak, yoksa owner hesabı önceden MFA kurulmuş şekilde mi hazırlanacak?
- Recovery code gösterimi ve saklama sorumluluğu nasıl anlatılacak?
- Session timeout süresi desktop ve mobil için aynı mı olacak?
- Route guard middleware matcher kapsamı sadece `/studio/:path*` ve gerekli auth callback route'larıyla mı sınırlanacak?
- Publish edilecek public-safe içerik ayrı tablo/view içinde mi tutulacak, yoksa build-time/static içerik üretimi mi tercih edilecek?

## Uygulama dışı bırakılanlar

Bu sprintte özellikle yapılmayacaklar:

- Supabase client oluşturma.
- `.env.example` veya `.env.local` değiştirme.
- Middleware ekleme.
- Route guard yazma.
- Auth callback route'u ekleme.
- MFA doğrulama veya enrollment akışı oluşturma.
- Session veya cookie yönetimi ekleme.
- RLS policy veya SQL migration yazma.
- Storage bucket oluşturma.
- Gerçek publish, upload, delete veya CRUD işlemi ekleme.

## İlgili dokümanlar

- `docs/studio/STUDIO_DATA_MODEL_DRAFT.md`
- `docs/studio/STUDIO_SECURITY_RLS_PLAN.md`
- `docs/studio/STUDIO_PUBLISH_FLOW.md`
- `docs/content/PUBLIC_CONTENT_MODEL.md` — Public content contract ile uyum için referans alınacak; bu belge Studio sprintinde değiştirilmez.

## Sonraki faz için önerilen kontrol listesi

- [ ] Supabase project ve Auth provider ayarları doğrulanacak.
- [ ] Tek owner hesabı ve allowlist yöntemi netleşecek.
- [ ] MFA yöntemi, enrollment ve recovery davranışı seçilecek.
- [ ] Route guard uygulama noktası belirlenecek.
- [ ] RLS policy taslakları migration öncesi gözden geçirilecek.
- [ ] Storage bucket ayrımı ve public/private dosya stratejisi onaylanacak.
- [ ] Public/private data boundary test edilecek.
