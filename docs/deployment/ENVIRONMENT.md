# Environment Contract

Durum: Faz 3 öncesi sözleşme hazırlığı. Gerçek Supabase/Auth/Storage implementasyonu henüz yoktur.

Bu dosya `.env.example`, local `.env.local` ve Vercel Environment Variables arasında hangi değişkenlerin nasıl kullanılacağını açıklar. Gerçek secret değerleri repository'ye commit edilmemelidir.

## Değişkenler

| Değişken | Amaç | Local kullanım | Vercel seviyesi | Public / Secret | Aktif kullanım |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Site canonical URL ve deployment URL referansı | `.env.local` içinde `http://localhost:3000` kullanılabilir | Preview için preview/custom preview URL; Production için production URL/custom domain | Public | Kısmen hazırlık; metadata/deployment doğrulamasında kullanılacak |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Faz 3 başlamadan boş kalmalı | Preview ve Production için ayrı project/ortam kararı sonrası tanımlanmalı | Public | Henüz aktif değil |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key; client tarafı isteklerde kullanılabilir public key | Faz 3 başlamadan boş kalmalı | Preview ve Production için Supabase kararından sonra tanımlanmalı | Public | Henüz aktif değil |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase yönetim işlemleri için yüksek yetkili secret | Yalnız `.env.local`; client koduna aktarılmamalı | Gerekiyorsa yalnız server-side kullanım için Vercel Environment Variables | Secret | Henüz aktif değil |

## Güvenlik notları

- `SUPABASE_SERVICE_ROLE_KEY` hiçbir koşulda `NEXT_PUBLIC_` prefix'i almamalı.
- Service role key client component, browser bundle, public config, statik JSON veya public route response içinde kullanılmamalı.
- Gerçek Supabase değerleri kullanıcı onayı ve Faz 3 görev kapsamı olmadan eklenmemeli.
- Auth, MFA, Storage bucket, RLS policy ve public publish akışı kararları verilmeden production secret tanımlanmamalı.
- `.env.example` yalnız placeholder sözleşmesidir; gerçek değerler `.env.local` ve Vercel Dashboard Environment Variables alanında tutulmalıdır.

## Vercel ortam önerisi

GitHub → Vercel otomatik deployment modelinde ortam seviyeleri şöyle kullanılmalı:

- Development: Local `.env.local` ile sınırlı kalabilir.
- Preview: Feature branch / pull request deployment doğrulaması için ayrı güvenli değerler kullanılmalı.
- Production: Yalnız doğrulanmış production değerleri kullanılmalı.

`NEXT_PUBLIC_SITE_URL` için Preview ve Production değerleri URL doğrulaması yapılmadan kesin kabul edilmemeli. Bilinmeyen URL uydurulmamalı.

## Otomatik deployment kapısı

- Feature branch push'u Preview Deployment üretmeden Preview env tamamlandı sayılmaz.
- `main` push'u Production Deployment üretmeden Production env tamamlandı sayılmaz.
- Manuel `vercel --prod` ana akış değildir; CLI varsa sadece inspect/debug için kullanılabilir.
- Vercel Dashboard erişimi yoksa GitHub integration, production branch ve deployment URL durumları `not verified` olarak kalmalıdır.

## Sonraki faz kararları

Faz 3 başlamadan önce şu başlıklar netleştirilmeli:

- Supabase Auth provider yaklaşımı
- MFA yöntemi
- Studio route guard stratejisi
- Storage bucket ayrımı ve dosya limitleri
- RLS policy kapsamı
- Studio’dan Public siteye publish akışı
