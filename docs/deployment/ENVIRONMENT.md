# Environment Contract

Durum: Faz 3 öncesi sözleşme hazırlığı. Gerçek Supabase/Auth/Storage implementasyonu henüz yoktur.

Bu dosya `.env.example`, local `.env.local` ve Vercel Environment Variables arasında hangi değişkenlerin nasıl kullanılacağını açıklar. Gerçek secret değerleri repository'ye commit edilmemelidir.

## Değişkenler

| Değişken | Amaç | Local kullanım | Vercel seviyesi | Public / Secret | Aktif kullanım |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Site canonical URL ve deployment URL referansı | `.env.local` içinde `http://localhost:3000` kullanılabilir | Preview ve Production ortamlarında ilgili Vercel URL veya custom domain | Public | Kısmen hazırlık; metadata/deployment doğrulamasında kullanılacak |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Faz 3 başlamadan boş kalmalı | Preview ve Production için ayrı project/ortam kararı sonrası tanımlanmalı | Public | Henüz aktif değil |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key; client tarafı isteklerde kullanılabilir public key | Faz 3 başlamadan boş kalmalı | Preview ve Production için Supabase kararından sonra tanımlanmalı | Public | Henüz aktif değil |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase yönetim işlemleri için yüksek yetkili secret | Yalnız `.env.local`; client koduna aktarılmamalı | Gerekiyorsa yalnız server-side kullanım için Vercel Environment Variables | Secret | Henüz aktif değil |

## Güvenlik notları

- `SUPABASE_SERVICE_ROLE_KEY` hiçbir koşulda `NEXT_PUBLIC_` prefix'i almamalı.
- Service role key client component, browser bundle, public config veya statik JSON içinde kullanılmamalı.
- Gerçek Supabase değerleri kullanıcı onayı ve Faz 3 görev kapsamı olmadan eklenmemeli.
- Auth, MFA, Storage bucket, RLS policy ve public publish akışı kararları verilmeden production secret tanımlanmamalı.

## Vercel ortam önerisi

- Development: Local `.env.local` ile sınırlı kalabilir.
- Preview: Branch/PR deployment doğrulaması için ayrı güvenli değerler kullanılmalı.
- Production: Yalnız doğrulanmış production değerleri kullanılmalı.

## Sonraki faz kararları

Faz 3 başlamadan önce şu başlıklar netleştirilmeli:

- Supabase Auth provider yaklaşımı
- MFA yöntemi
- Studio route guard stratejisi
- Storage bucket ayrımı ve dosya limitleri
- RLS policy kapsamı
- Studio’dan Public siteye publish akışı
