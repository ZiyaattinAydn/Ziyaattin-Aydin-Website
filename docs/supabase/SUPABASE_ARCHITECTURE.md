# Supabase Architecture Contract

Durum: **Sprint 06 runtime temeli uygulandı.** Supabase client, Proxy ve server-side authorization yardımcıları eklendi; gerçek project/secret, SQL uygulaması, Login/MFA UI, CRUD ve Storage işlemleri ayrı işlerde tamamlanacaktır.

## Amaç

Supabase bu projede üç ana sorumluluk üstlenecek:

1. **PostgreSQL** — Public içerik, Studio çalışma verileri, publish durumu ve sahiplik ilişkileri.
2. **Auth** — Tek owner hesabının kimlik doğrulaması, session ve MFA seviyesi.
3. **Storage** — Public yayımlanmış varlıklar ile private Studio dosyalarının ayrıştırılması.

Supabase uygulamanın tek güvenlik katmanı değildir; ancak veri erişiminde **RLS son güvenlik otoritesidir**.

## Kapsam dışı

Sprint 05 kapsamında aşağıdakiler yapılmaz:

- `@supabase/supabase-js` veya `@supabase/ssr` kurulumu
- Browser/server client oluşturulması
- Auth formu veya MFA akışı
- `proxy.ts`, middleware veya route guard implementasyonu
- SQL migration yazılması ya da çalıştırılması
- Storage bucket oluşturulması
- Gerçek environment değeri veya secret eklenmesi

## Önerilen environment topolojisi

### Baseline öneri

- **Production:** Yalnız production verisi ve production kullanıcı hesabı için ayrı Supabase project.
- **Non-production:** Local development ve Vercel Preview için ikinci Supabase project.
- **Preview branch'leri:** Başlangıçta aynı non-production project'i paylaşabilir; test verisi production'a taşınmaz.
- **İleri seviye seçenek:** İhtiyaç büyürse branch başına geçici project/branching değerlendirilebilir; Sprint 06 kapsamı değildir.

Bu ayrımın amacı Preview deployment veya development seed işlemlerinin production verisine, Auth kullanıcılarına veya Storage nesnelerine dokunmasını engellemektir.

## Ana güvenlik prensipleri

1. **Public key secret değildir.** Browser kullanımı için verilen publishable/anon key yalnız RLS ile sınırlandırılmış erişim sağlamalıdır.
2. **Service role / secret key yalnız güvenli server ortamındadır.** Client bundle, `NEXT_PUBLIC_*`, statik JSON, browser logu veya public response içine giremez.
3. **Service role normal Studio CRUD için kullanılmaz.** Normal işlemler authenticated owner session ve RLS ile yürütülür.
4. **RLS zorunludur.** Public, authenticated ve owner erişimleri tablo/policy seviyesinde ayrıştırılır.
5. **Proxy tek güvenlik katmanı değildir.** Erken yönlendirme veya session yenileme yapsa bile Server Component, Server Action veya Route Handler gerçek kullanıcı/yetki kontrolünü tekrarlar.
6. **Client tarafından gönderilen role güvenilmez.** Owner yetkisi database kaydı ve doğrulanmış `auth.uid()` ilişkisi üzerinden belirlenir.
7. **Public yayın durumu explicit olmalıdır.** Anonymous erişim yalnız `visibility = public` ve `publish_state = published` koşullarını sağlayan kayıtlarla sınırlanır.

## Public ve Studio veri erişimi ayrımı

### Public site

- Varsayılan okuma katmanı Server Component olmalıdır.
- Yalnız yayımlanmış/public içerik okunur.
- Browser client yalnız gerçek zamanlı veya kullanıcı etkileşimli bir gereksinim açıkça ortaya çıkarsa kullanılır.
- Anonymous write kapalıdır.
- Taslak, private not, görev, dosya ve publish queue public sorgulara açılmaz.
- Cache/revalidation stratejisi Public veri geçiş sprintinde ayrıca kararlaştırılır.

### Private Studio

- Studio yalnız authenticated ve doğrulanmış owner hesabına açıktır.
- Okuma/yazma işlemlerinde user session korunur ve RLS uygulanır.
- Server tarafı veri erişimi tercih edilir.
- Client Component yalnız form state, upload progress, optimistic UI veya browser API gerektiren küçük alanlarda kullanılır.
- Her mutation owner kontrolü ve RLS ile korunur.
- Service role normal Studio CRUD yoluna eklenmez.

## Server ve client client'ları

Sprint 06 implementasyonunda üç ayrı sorumluluk değerlendirilmelidir:

| Client türü | Amaç | Key / kimlik | İzin verilen kullanım |
| --- | --- | --- | --- |
| Browser client | Auth UI, gerekli client-side etkileşim | Public Supabase URL + publishable/anon key + kullanıcı session | RLS korumalı kullanıcı işlemleri |
| Server session client | Server Component, Server Action, Route Handler | Public key + request cookie session | Kullanıcı adına RLS korumalı okuma/yazma |
| Admin client | İstisnai bakım/administrative işlem | Server-only secret/service role | Yalnız açıkça tanımlanmış yönetim işi; normal CRUD değil |

Admin client ayrı modülde tutulmalı ve yanlışlıkla client import graph'ına girmemelidir.

## Auth ve owner modeli

Önerilen baseline:

- Public signup kapalı.
- Tek owner hesabı manuel/denetimli biçimde oluşturulur.
- Owner yetkisi e-posta metnine değil `auth.users.id` ile bağlı `owner_profiles` kaydına dayanır.
- İlk owner ataması review edilmiş SQL/admin işlemiyle yapılır.
- Her yeni Auth kullanıcısı otomatik owner yapılmaz.
- Production Studio erişimi için MFA `aal2` seviyesi önerilir.

Kesin kararlar `SPRINT_06_APPROVAL_GATE.md` içinde kullanıcı onayı bekler.

## Proxy, server guard ve RLS sorumluluğu

Next.js 16'da önceki `middleware` convention'ı **Proxy** olarak adlandırılır. Önerilen katmanlar:

1. **Proxy:** Session cookie yenileme, login/studio için erken yönlendirme, güvenli internal redirect kontrolü.
2. **Studio server layout/page guard:** Gerçek kullanıcıyı, owner kaydını ve gerekiyorsa MFA assurance level'ını doğrular.
3. **Server Action / Route Handler:** Her mutation öncesi yeniden auth/owner kontrolü yapar.
4. **RLS:** Sorgu hangi uygulama katmanından gelirse gelsin database erişiminde son kararı verir.

Proxy kontrolü atlanırsa bile server guard ve RLS veriyi koruyabilmelidir.

## Storage yaklaşımı

Önerilen iki bucket:

- `public-assets`: Yalnız onaylanmış/yayımlanmış görseller ve public dosyalar.
- `private-files`: Studio belgeleri, PDF/sunum ve private çalışma dosyaları.

Kurallar:

- Public bucket read erişimi açık olabilir; write/update/delete yalnız owner.
- Private bucket anonymous read/write kapalıdır.
- Dosya metadata kaydı PostgreSQL tablosunda owner, visibility, path, MIME ve boyut bilgisiyle tutulur.
- Bucket policy'leri `storage.objects` RLS üzerinden uygulanır.
- Dosya boyutu ve MIME allowlist kullanıcı onayı sonrası kesinleştirilir.

## Mock veriden database'e geçiş sırası

1. Sprint 05 mimari ve SQL paketlerinin review edilmesi.
2. Kullanıcı karar kapısının tamamlanması.
3. Non-production Supabase project oluşturulması.
4. Environment değerlerinin local ve Vercel Preview'a girilmesi.
5. Schema/functions/RLS/Storage SQL paketinin review sonrası non-production'a uygulanması.
6. Seed ile yalnız development/preview test verisi oluşturulması.
7. Core Auth/session/guard implementasyonu.
8. Studio data adapter/CRUD geçişi.
9. Public published-content adapter geçişi.
10. Preview kabul testi ve güvenlik kontrolü.
11. Production Supabase project ve environment değerleri.
12. Production migration için ayrı kullanıcı onayı.

Mock veri tek committe silinmemeli; adapter veya feature gate üzerinden kontrollü geçiş yapılmalıdır.

## Preview ve Production ayrımı

- Preview deployment production Supabase secret'larını kullanmamalıdır.
- Preview Auth redirect URL'leri yalnız izin verilen Vercel URL pattern'leriyle sınırlandırılmalıdır.
- Preview seed verisi production'a taşınmaz.
- Production migration, Preview kabul testi tamamlanmadan çalıştırılmaz.
- Production service role/secret yalnız Vercel Production environment seviyesinde bulunur; ihtiyaç yoksa hiç tanımlanmaz.

## Karar durumu

Bu belgedeki mimari **önerilen baseline** niteliğindedir. Bölge, provider, MFA, owner bootstrap, session timeout, bucket limitleri, seed ve SQL uygulama onayı kullanıcı tarafından kesinleştirilmeden Sprint 06 implementasyonu başlamamalıdır.

## Resmî referanslar

- Supabase SSR ve cookie tabanlı client: https://supabase.com/docs/guides/auth/server-side
- Supabase API key güvenliği: https://supabase.com/docs/guides/getting-started/api-keys
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage access control: https://supabase.com/docs/guides/storage/security/access-control
- Next.js 16 Proxy convention: https://nextjs.org/docs/app/api-reference/file-conventions/proxy

## Sprint 06 Runtime Uygulaması

Core Sprint 06 ile aşağıdaki mimari parçalar kaynak koda taşındı:

- `@supabase/supabase-js@2.110.2`
- `@supabase/ssr@0.12.0`
- Lazy ve fail-closed environment validation
- Browser ve request-scoped server client factory'leri
- Next.js 16 `src/proxy.ts` session refresh ve erken redirect sınırı
- Server-only trusted user, active owner ve current `aal2` authorization helper'ı
- Redirect, environment, AAL ve owner kuralları için Node tabanlı runtime doğrulama betiği

Production mock davranışı korunur. Gerçek Supabase project değerleri, SQL uygulaması, Login/MFA UI, Studio CRUD, Storage upload ve Public database cutover bu Core değişikliğinde yapılmaz.
