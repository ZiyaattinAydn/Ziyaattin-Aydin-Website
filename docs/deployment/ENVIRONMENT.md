# Ortam değişkenleri

Gerçek değerler `.env.local` veya Vercel Environment Variables içinde tutulur. Repoya eklenmez.

| Değişken | Kullanım |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Sitenin adresi |
| `NEXT_PUBLIC_SUPABASE_URL` | İlgili ortamın Supabase URL'si |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Tarayıcıda kullanılabilen Supabase publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yalnız özel sunucu yönetim işlemleri gerekirse |

`NEXT_PUBLIC_` ile başlayan değerler tarayıcıya gidebilir. Service-role anahtarını bu adla tanımlama ve normal Studio işlemlerinde kullanma.

Preview ve Production şu anda aynı Supabase projesini kullanır. Bu nedenle Preview’da gerçek kayıtları test amacıyla değiştirmeyin veya silmeyin. Public okumalar iki ortamda da anonimdir; yalnız yayınlanmış/herkese açık kayıtlar gösterilir. Bağlantı eksikse örnek içerik üretilmez.

Bağlantı değişkenleri güncellendikten sonra ilgili Vercel deployment yeniden oluşturulmalı.
