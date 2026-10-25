# Ortam değişkenleri

Gerçek değerler `.env.local` veya Vercel Environment Variables içinde tutulur. Repoya eklenmez.

| Değişken | Kullanım |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Sitenin adresi |
| `NEXT_PUBLIC_SUPABASE_URL` | İlgili ortamın Supabase URL'si |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Tarayıcıda kullanılabilen Supabase publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yalnız özel sunucu yönetim işlemleri gerekirse |

`NEXT_PUBLIC_` ile başlayan değerler tarayıcıya gidebilir. Service-role anahtarını bu adla tanımlama ve normal Studio işlemlerinde kullanma.

Vercel Preview geliştirme Supabase projesini kullanıyor. Production ortamı için ayrı Supabase projesi, owner hesabı, MFA, migration ve yedek hazırlanmadan geliştirme anahtarlarını Production'a taşımayacağız.

Bağlantı değişkenleri güncellendikten sonra ilgili Vercel deployment yeniden oluşturulmalı.
