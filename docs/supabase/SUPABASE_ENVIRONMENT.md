# Supabase Environment Strategy

Durum: **Sprint 06 runtime sözleşmesi uygulanıyor**. Repository gerçek değer veya secret içermez.

## Temel kurallar

- `.env.example` yalnız değişken isimlerini ve güvenlik notlarını taşır.
- Gerçek local değerler `.env.local` içinde tutulur ve commit edilmez.
- Vercel Preview ile Production environment değerleri ayrıştırılır.
- Production secret Preview ortamına kopyalanmaz.
- `NEXT_PUBLIC_*` değişkenleri browser bundle'a girebilir; secret kabul edilmez.
- `SUPABASE_SERVICE_ROLE_KEY` veya gelecekte kullanılabilecek Supabase secret key yalnız server ortamında bulunur.

## Environment matrisi

| Değişken | Public / secret | Browser | Local `.env.local` | Vercel Preview | Vercel Production | Erişebilen katman | Sprint 05 gerçek değer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Evet | `http://localhost:3000` | Doğrulanmış Preview/custom URL | `https://ziyaattin-aydin-website.vercel.app` veya doğrulanmış custom domain | Client + server | Production URL proje bağlamında biliniyor; repository'de secret değil, fakat deploy ortamı ayrıca doğrulanmalı |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Evet | Non-production project URL | Non-production project URL | Production project URL | Client + server | Hayır — `USER_APPROVAL_REQUIRED` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public publishable/anon key | Evet | Non-production public key | Non-production public key | Production public key | Client + server | Hayır — `USER_APPROVAL_REQUIRED` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | **Hayır** | Yalnız gerçekten admin server işi gerekiyorsa | Varsayılan olarak tanımlanmaz; gerekiyorsa ayrı non-production secret | Yalnız onaylanmış server-only admin işinde | Server-only admin modülü | Hayır — bu sprintte boş |

## Önerilen project/environment eşleşmesi

| Uygulama ortamı | Supabase project | Veri türü | Not |
| --- | --- | --- | --- |
| Local Development | Non-production | Seed/mock dönüşüm testi | Production verisi kullanılmaz |
| Vercel Preview | Non-production | Preview kabul testi | Preview branch'leri başlangıçta aynı test project'ini paylaşabilir |
| Vercel Production | Production | Gerçek içerik ve owner hesabı | Preview kabulü ve migration onayı sonrası |

## Değişken bazında notlar

### `NEXT_PUBLIC_SITE_URL`

Amaç:

- Canonical site referansı
- Auth redirect allowlist planı
- Server-side callback/redirect üretimi

Kurallar:

- Local değeri `http://localhost:3000` olabilir.
- Preview deployment URL'si branch'e göre değişebiliyorsa tek sabit URL yanlış sonuç üretmemelidir; implementation sırasında request origin veya doğrulanmış preview domain yaklaşımı değerlendirilecektir.
- Redirect target yalnız izin verilen internal origin/path olmalıdır.

### `NEXT_PUBLIC_SUPABASE_URL`

- Supabase project API URL'sidir.
- Secret değildir.
- Preview ve Production farklı project kullanırsa değerler environment seviyesinde ayrılır.
- URL bilinmeden placeholder dışında değer commit edilmez.

### `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

- Browser kullanımına uygun public publishable/anon key'dir.
- Güvenlik anahtarı gibi davranılmamalı; yetki RLS ve grants ile sınırlandırılmalıdır.
- Public olmasına rağmen gereksiz loglanmamalı veya doküman örneğinde gerçek değer kullanılmamalıdır.

### `SUPABASE_SERVICE_ROLE_KEY`

- RLS bypass edebilen yüksek yetkili server secret'ıdır.
- `NEXT_PUBLIC_` prefix'i alamaz.
- Client Component, browser client, public config, static export veya kullanıcıya dönen response içine giremez.
- Normal Public/Studio CRUD için kullanılmaz.
- Sprint 06 başlangıcında admin use-case tanımlanmamışsa Vercel'e eklenmemesi önerilir.

## Vercel kapısı

Gerçek değerler Vercel Dashboard → Project Settings → Environment Variables alanında girilir.

- Non-production değerleri: Preview
- Production değerleri: Production
- Local development: `.env.local`

Her değişken için environment scope kontrol edilmeli; aynı production secret'ın yanlışlıkla Preview scope'a eklenmesi blocker sayılmalıdır.

## Rotation ve olay yönetimi

Secret sızıntısı şüphesinde:

1. İlgili Supabase key rotate edilir.
2. Local `.env.local` ve Vercel environment değerleri güncellenir.
3. Preview ve Production redeploy edilir.
4. Git history ve build logları secret izi için kontrol edilir.
5. Olay ve yapılan işlemler handoff/incident kaydına yazılır.

## `.env.example` kabul kriteri

- Dört sözleşme değişkeni bulunur.
- Gerçek Supabase project URL/key yoktur.
- Service role client güvenlik notu vardır.
- Production/Preview ayrımı açıklanır.
- `.env.local` commit edilmez.

## Sprint 06 Uygulama Durumu

- Canonical public key: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Runtime validation: client istendiği anda, kontrollü ve generic hata ile
- Public mock build: Supabase env olmadan başarılı
- Auth/Studio: env eksikken fail closed
- Browser client: yalnız project URL + publishable key
- Server client: async Next.js `cookies()` adapter'ı
- Service role: normal akışta kullanılmıyor; gerçek değer eklenmedi
- Local ve Vercel Preview: development Supabase project'i kullanacak
- Vercel Production: production project oluşturulana kadar Supabase env tanımlanmayacak
