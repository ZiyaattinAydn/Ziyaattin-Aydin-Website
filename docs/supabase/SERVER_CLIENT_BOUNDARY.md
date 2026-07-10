# Server / Client Boundary

Durum: Sprint 06 server/client runtime sınırı uygulandı; geniş CRUD ve public database cutover kapsam dışıdır.

## Varsayılan yaklaşım

Next.js App Router içinde bileşenler varsayılan olarak Server Component kalmalıdır. Client Component yalnız browser API, local interactive state veya event handler gerektiren en küçük sınırda kullanılmalıdır.

## Sorumluluk matrisi

| İşlem | Tercih edilen katman | Gerekçe |
| --- | --- | --- |
| Public proje/yazı/lifecycle okuma | Server Component | Secret gerektirmez, published/public filtre ve cache yönetimi server'da merkezileşir |
| Studio dashboard okuma | Server Component / server data module | Session ve owner kontrolü request sırasında yapılır |
| Form input state | Client Component | Kullanıcı etkileşimi gerekir |
| Studio mutation | Server Action veya Route Handler | Auth/owner kontrolü ve validation server'da tekrarlanır |
| Dosya upload UI | Client Component + güvenli server/presigned akış | Progress/browser file API gerekir; policy server/RLS ile korunur |
| Auth callback | Route Handler | Code/session cookie dönüşümü ve redirect doğrulaması |
| Session yenileme / erken redirect | Next.js 16 Proxy | UX ve cookie sürekliliği; nihai authorization değildir |
| Administrative bakım | Ayrı server-only modül/script | Service role browser ve normal CRUD yolundan ayrılır |

## Server Component sorumluluğu

- Request cookie bağlamıyla server Supabase client kullanmak.
- Public sorgularda explicit published/public filtrelerini uygulamak.
- Studio sorgularında authenticated user ve owner kaydını doğrulamak.
- Auth durumuna göre `redirect()` veya `notFound()` kararını güvenli biçimde vermek.
- Secret veya raw session token'ı serialized props ile client'a taşımamak.
- User-specific response'ların yanlış cache'lenmesini önlemek.

## Client Component kullanım koşulları

Client Component yalnız şu ihtiyaçlardan biri varsa eklenmelidir:

- Form input ve validation feedback
- Modal/menu/tabs gibi etkileşim
- Upload progress veya drag/drop
- Optimistic UI
- Browser API
- Auth challenge/MFA code girişi

Client bileşenin public Supabase key kullanması mümkündür; ancak yaptığı her sorgu RLS ile güvenli olmalıdır.

## Session ve cookie sınırı

- Cookie tabanlı SSR session önerilir.
- Next.js 16 `cookies()` API'si server request sınırında ele alınır.
- Cookie okuma Server Component'te; cookie yazma Server Function/Route Handler/Proxy gibi desteklenen response katmanlarında yapılır.
- Session nesnesi yalnız varlığına güvenilerek authorization kararı vermemelidir; server tarafında doğrulanmış user ve owner kaydı kontrol edilir.
- Cookie/session değerleri client prop olarak aktarılmaz.

## Public read sorguları

Public read yolu:

1. Server request alınır.
2. Public key ile server Supabase client oluşturulur.
3. Yalnız public/published model veya view sorgulanır.
4. RLS anonymous read policy'si aynı sınırı uygular.
5. Dönüş modeli UI için minimum alanlara map edilir.

Browser'dan doğrudan public read gerekiyorsa aynı RLS sınırı korunur; private kolonların exposed schema/view içinde bulunmaması tercih edilir.

## Studio authenticated sorguları

Studio yolu:

1. Session cookie okunur/yenilenir.
2. Authenticated user server'da doğrulanır.
3. `owner_profiles` üzerinden owner yetkisi kontrol edilir.
4. MFA zorunluysa assurance level doğrulanır.
5. Kullanıcı session'ı ile sorgu çalışır.
6. RLS `auth.uid()` ve owner policy ile son kararı verir.

## Server Action sınırı

Server Action kullanılacaksa:

- Her çağrıda auth + owner kontrolü tekrarlanır.
- Input schema validation yapılır.
- Client tarafından gelen `owner_id`, role, publish state veya storage path doğrudan güvenilmez.
- Mutation sonucu minimum veri döndürür.
- Hatalar secret/token/SQL detayı sızdırmaz.
- Revalidation yalnız başarılı mutation sonrası yapılır.

## Route Handler sınırı

Route Handler şu durumlarda tercih edilebilir:

- Auth callback
- Webhook
- Upload/download proxy veya signed URL işlemi
- Harici entegrasyon
- İstemciden bağımsız API sözleşmesi

Route Handler da server guard ve RLS'den muaf değildir.

## Browser'da yapılabilecekler

- Email/password veya onaylanan Auth provider ile giriş UI'si
- MFA challenge code gönderimi
- Public key ile RLS korumalı istek
- Kullanıcının yetkili olduğu form/mutation çağrısı
- Dosya seçimi ve progress UI

## Browser'da yapılamayacaklar

- Service role/secret key kullanımı
- Owner rolü atama
- RLS bypass
- Arbitrary user yönetimi
- Production migration çalıştırma
- Private bucket'ı anonymous listeleme
- Client role değerine dayanarak authorization verme

## Service role izolasyonu

Service role gerekiyorsa:

- `server-only` ile korunmuş ayrı modülde tutulur.
- Normal browser/server session client factory'sine parametre olarak verilmez.
- Public veya Studio CRUD helper'ları service role import etmez.
- Kullanım noktası, gerekçesi ve audit izi dokümante edilir.
- Mümkün olan her işlem authenticated session + RLS ile çözülür.

## Cache sınırı

- Owner-specific Studio response'ları shared/static cache'e girmemelidir.
- Public published içerik cache edilebilir; publish/unpublish sonrası revalidation gerekir.
- Auth cookie yazan response CDN/shared cache ile karışmamalıdır.
- Cache stratejisi implementasyon sırasında Next.js 16 yerel docs ile yeniden doğrulanmalıdır.

## Sprint 06 Kod Karşılıkları

| Sınır | Uygulama |
| --- | --- |
| Public environment okuma ve lazy validation | `src/lib/supabase/environment.ts` |
| Browser client | `src/lib/supabase/client.ts` |
| Request-scoped server client | `src/lib/supabase/server.ts` |
| Proxy cookie refresh client | `src/lib/supabase/proxy.ts` |
| Server-only service-role presence kontrolü | `src/lib/supabase/server-environment.ts` |
| Studio authorization | `src/lib/auth/studio-authorization.ts` |
| Redirect doğrulama | `src/lib/auth/safe-redirect.ts` |

Server Component içinde cookie yazma desteklenmediğinde client factory yazma hatasını yutar; writable session refresh Proxy, Server Function veya Route Handler katmanında yapılır.
