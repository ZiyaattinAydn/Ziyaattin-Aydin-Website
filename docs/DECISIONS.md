# Karar Kaydı

## Ürün
- Public kişisel site ve private Studio aynı Next.js projesinde bulunacak.
- Studio public menüde görünmeyecek; footer'da küçük yönetici girişi bulunabilir.
- Public site ve Studio aynı Supabase altyapısını kontrollü biçimde paylaşacak.

## Teknoloji
- Next.js App Router + React + TypeScript
- Tailwind CSS
- Supabase: Auth, PostgreSQL ve Storage
- Vercel deployment
- PWA ilk sürümde; Expo ve Tauri backlog'da

## Görsel Kimlik
- Varsayılan ana tema: Palet 2
- Alternatifler: Palet 1 ve Palet 3
- Fontlar: Inter ve JetBrains Mono
- Koyu/siyah zemin, yeşil vurgu, hafif kod dokuları
- Ana sayfa portresi: `public/images/portraits/home-hero.png`
- Hakkımda sayfasında yalnız onaylı kullanıcı portresi kullanılmalı; yapay üretilen farklı kişi kullanılmamalı

## Çalışma Modeli
- 3 geliştirme sohbeti ayrı feature branch'lerde çalışır.
- 4. sohbet branch'leri `main`e entegre eder.
- 5. sohbet görev dağıtır ve prompt üretir.
- Her sohbet işe başlamadan takip belgelerini okur ve iş sonunda günceller.

## Sprint 03 — Faz 3 Öncesi Karar Başlıkları

Bu başlıklar karar verilmiş maddeler değildir. Supabase/Auth/Storage implementasyonu başlamadan önce kullanıcı onayı ve entegrasyon değerlendirmesi gerektirir.

### Supabase Auth provider yaklaşımı
- Durum: Karar gerektiriyor
- Değerlendirilecekler:
  - İlk sürümde yalnız e-posta/şifre mi kullanılacak?
  - Magic link veya OAuth provider gerekir mi?
  - Private Studio yalnız tek kullanıcı için mi kalacak, yoksa ileride çok kullanıcı desteği düşünülüyor mu?
- Kullanıcı onayı: Gerekli

### MFA yöntemi
- Durum: Karar gerektiriyor
- Değerlendirilecekler:
  - TOTP tabanlı MFA yeterli mi?
  - Recovery code akışı gerekecek mi?
  - MFA ilk production sürümünde zorunlu mu, yoksa sonraki güvenlik sertleştirmesine mi bırakılacak?
- Kullanıcı onayı: Gerekli

### Studio route guard stratejisi
- Durum: Karar gerektiriyor
- Değerlendirilecekler:
  - Middleware tabanlı koruma mı, server component/session kontrolü mü kullanılacak?
  - `/login` ve `/studio/**` redirect davranışı nasıl olacak?
  - Public rotalar ile Studio rotaları aynı uygulamada kalmaya devam edecek mi?
- Kullanıcı onayı: Gerekli

### Storage bucket yaklaşımı
- Durum: Karar gerektiriyor
- Değerlendirilecekler:
  - Public yayın görselleri ve private Studio dosyaları ayrı bucket'larda mı tutulacak?
  - PDF/sunum/dosya yükleme limitleri ne olacak?
  - Dosya isimlendirme, klasörleme ve backup stratejisi nasıl olacak?
- Kullanıcı onayı: Gerekli

### RLS policy yaklaşımı
- Durum: Karar gerektiriyor
- Değerlendirilecekler:
  - Tek kullanıcı senaryosu için minimum güvenli RLS politikaları
  - Public content okuma politikası
  - Studio private data okuma/yazma politikası
  - Service role key'in yalnız server-side operasyonlarda kullanılması
- Kullanıcı onayı: Gerekli

### Public publish akışı
- Durum: Karar gerektiriyor
- Değerlendirilecekler:
  - Studio içerikleri taslak/onay/yayında durumlarına sahip olacak mı?
  - Public site mock veriden database-backed içeriğe ne zaman geçecek?
  - Yayınlanan içerik statik render mı, dinamik render mı, yoksa cache/revalidate akışıyla mı sunulacak?
- Kullanıcı onayı: Gerekli

## Sprint 04 — Deployment Modeli ve Doğrulama Kapısı

### GitHub → Vercel otomatik deployment modeli
- Durum: Uygulama modeli olarak benimsendi; gerçek Vercel bağlantısı ayrıca doğrulanmalı
- Ana akış:
  1. Feature branch GitHub'a pushlanır ve Preview Deployment beklenir.
  2. Integration branch kalite kontrollerinden geçer.
  3. Integration branch `main`e merge edilir.
  4. `main` push sonrası Production Deployment beklenir.
- Manuel `vercel --prod` ana akış değildir; Vercel CLI yalnız inspect/debug için opsiyonel kullanılabilir.
- Kullanıcı/Vercel erişimi gerektiren kontrol: GitHub repository bağlantısı, production branch `main`, automatic preview/production deployment ayarları, gerçek Preview ve Production URL'leri.

### Deployment tamamlandı kapısı
- Durum: Karar gerektiriyor / doğrulama bekliyor
- Faz 2 tamamen kapanmadan önce gerçek Preview URL ve Production URL doğrulanmalı.
- Vercel Dashboard/CLI erişimi yoksa deployment tamamlandı işaretlenmemeli.
- Supabase/Auth/Storage secret'ları, kullanıcı onayı ve Faz 3 implementasyon kapsamı olmadan eklenmemeli.

## Sprint 05 — Supabase Mimari Baseline Önerileri

Bu maddeler implementasyon kararı değildir. `docs/supabase/SPRINT_06_APPROVAL_GATE.md` içindeki kullanıcı onayı tamamlanmadan gerçek Supabase/Auth/SQL çalışması başlamaz.

### Environment ayrımı
- Öneri: Ayrı Production ve Non-production Supabase project.
- Local ve Vercel Preview başlangıçta Non-production project'i paylaşabilir.
- Production secret ve verisi Preview ortamına verilmez.
- Durum: `USER_APPROVAL_REQUIRED`.

### Auth ve owner modeli
- Öneri: Public signup kapalı tek owner hesabı.
- Owner yetkisi e-posta string'inden değil `auth.uid()` ile bağlı owner profile kaydından gelir.
- İlk owner ataması review edilmiş tek seferlik SQL/admin işlemiyle yapılır; her yeni kullanıcı otomatik owner olmaz.
- Durum: `USER_APPROVAL_REQUIRED`.

### Session ve route guard
- Öneri: Cookie tabanlı Supabase SSR session.
- Next.js 16 Proxy yalnız session yenileme ve erken redirect için kullanılır.
- Studio server layout, mutation katmanı ve RLS authorization'ı tekrar doğrular.
- Proxy veya client redirect tek güvenlik katmanı değildir.
- Durum: `USER_APPROVAL_REQUIRED`.

### MFA
- Öneri: Production Studio için TOTP MFA ve `aal2` zorunluluğu.
- Recovery için verified email reset ve backup TOTP factor yaklaşımı değerlendirilir.
- Durum: `USER_APPROVAL_REQUIRED`.

### Service role
- Service role/secret key yalnız açıkça onaylanmış server-only administrative işlerde kullanılabilir.
- Normal Public/Studio CRUD user session + RLS ile yürütülür.
- Service role hiçbir koşulda browser bundle veya `NEXT_PUBLIC_*` değişkenine girmez.

### Migration kapısı
- SQL önce review edilir, sonra Non-production project'te dosya sırasıyla çalıştırılır.
- Her adım ayrı stop point'tir; başarısız adım sonrası ilerlenmez.
- Preview kabulü, backup ve kullanıcı onayı olmadan Production migration çalıştırılmaz.
- Uygulanmış migration sessizce değiştirilmez; düzeltme yeni migration dosyasıdır.

## Sprint 06 — Onaylanan Supabase Runtime Kararları

- Development ve Production ayrı Supabase project kullanacak.
- Development region: **APAC — Southeast Asia (Singapore)**.
- Local development ve Vercel Preview aynı development project'i kullanabilir.
- Production Supabase environment değerleri Sprint 06 Core kapsamında eklenmeyecek.
- Canonical browser-safe key adı `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- İlk Auth provider email/password; magic link ilk sürümde kapalı.
- Studio erişimi için TOTP ve current `aal2` zorunlu.
- Owner yetkisi active `owner_profiles` kaydı ve Auth UUID ile belirlenir.
- Client metadata veya e-posta string'i authorization kaynağı değildir.
- Yaklaşık 8 saatlik Studio session hedeflenir; plan desteği Dashboard kurulumu sırasında doğrulanır.
- `public-assets` ve `private-files` ayrı bucket olarak kullanılacak.
- Public dosya limiti 10 MB, private dosya limiti 25 MB.
- Public MIME allowlist JPEG, PNG, WebP ve AVIF.
- Sprint 05 SQL paketi ve development seed development project'te kontrollü sırayla çalıştırılabilir.
- Production migration Preview kabulünden sonra ayrı kullanıcı onayı gerektirir.
- Service role normal Auth, Public veya Studio CRUD akışında kullanılmaz.

## Sprint 06 — Public Repository ve Kaynak Seçimi

### Public data repository sınırı

- Public route'lar veri kaynağını bilmez; yalnız `PublicContentRepository` sözleşmesini kullanır.
- Mock ve gelecekteki Supabase adapter aynı public-safe DTO modeline map edilir.
- Database row'ları doğrudan component props olarak kullanılmaz.
- Durum: `ACCEPTED`.

### Production source kilidi

- Sprint 06 boyunca Production public content source kesin olarak `mock` kalır.
- `PUBLIC_CONTENT_SOURCE=supabase` yalnız non-production ortamında ve Core query reader bağlandığında aktive edilebilir.
- Gerçek reader aktifken database/query hatası sessiz mock fallback yapmaz.
- Durum: `ACCEPTED`.

### Public approval kapıları

- Content publish state, visibility, link approval, image approval ve portrait approval bağımsızdır.
- Link veya asset yalnız kendi approval state'i approved ve değeri güvenli/geçerliyse Public DTO'ya girer.
- Ana sayfa portresi sabit kalır; About candidate portrait onaysızken gizlenir.
- Durum: `ACCEPTED`.

## Sprint 06 Studio güvenlik kararı — S06_STUDIO_SECURITY_DECISION

Studio authorization üç birlikte zorunlu katmandan oluşur: trusted Supabase user,
active owner/admin allowlist satırı ve current `aal2`. Proxy yalnız session refresh
ve erken redirect sağlar; nihai karar server layout/helper ve RLS tarafından tekrar
verilir. Recovery code yerine ikinci TOTP faktörü ve kontrollü Dashboard reset
runbook’u kullanılır.



## Sprint 06 Studio doğrulanan operasyon kararları — S06_STUDIO_VALIDATED

- Hosted Supabase storage.objects managed relation olduğu için bucket DDL ve
  policy kurulumu ayrıldı. Bucket'lar migration, sekiz policy Dashboard runbook
  üzerinden uygulanır; managed relation ownership değiştirilmez.
- Development seed owner UUID/e-posta hard-code etmez; tam bir active owner/admin
  profilini server-side çözer ve belirsizlikte fail closed davranır.
- Preview env yalnız development Supabase project'e bağlıdır.
- Production env ve migration ayrı kullanıcı onayı olmadan uygulanmaz.
- Free plan/Dashboard'da yaklaşık 8 saat time-box sağlanamadığında özel session
  API yazılmaz; AAL1 15 dakika ile sınırlanır ve Studio her request'te current
  AAL2 kontrol eder.

## Sprint 06 Integration Kararı — S06_INTEGRATION_DECISION

- Merge sırası Core → Public → Studio olarak uygulandı.
- Development ve Production Supabase ayrımı korunmuştur.
- Production Supabase bu sprintte oluşturulmamış ve migration uygulanmamıştır.
- Production Public source mock kalır.
- Auth ve Studio env yokken fail closed kalır.
- TOTP ve current AAL2 zorunluluğu korunmuştur.
- Main merge ve push için açık kullanıcı onayı zorunludur.
