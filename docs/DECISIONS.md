# Temel kararlar

## Ürün

Kişisel site ve Studio aynı Next.js uygulamasında olacak. Site herkesin görebildiği portföy; Studio ise sadece bana ait çalışma alanı.

Projeler ve yazılar, hazırlanıp onaylandıktan sonra Public sitede yayınlanabilir. Görevler, notlar ve özel dosyalar varsayılan olarak gizli kalacak.

Mobil kullanım önemli. Web sitesi responsive olacak, ardından PWA desteği eklenecek. Not editörünün biçimini henüz seçmedim.

## Tasarım

Koyu arka plan, yeşil vurgu, Inter ve JetBrains Mono. Mevcut görsel referanslar `docs/reference-designs/` altında.

Kişisel fotoğraflar, iş bilgileri ve bağlantılar doğrulanmadan yayınlanmayacak.

## Teknik yaklaşım

Next.js, React, TypeScript, Tailwind, Supabase ve Vercel kullanıyorum.

- Studio erişimi: oturum + aktif owner hesabı + TOTP MFA (AAL2) + RLS.
- Veritabanı: geliştirme ve Production ortamları ayrı tutulacak.
- Yayın: yalnız yayınlanmış, herkese açık kayıtlar ve onaylı bağlantılar gösterilecek.
- Silme: mümkün olduğunda kalıcı silme yerine arşivleme.
- Çalışma: tek branch'te tamamlanan iş, Preview kontrolü, PR ve `main` merge.

Uygulama ayrıntıları için [mimari](ARCHITECTURE.md) ve [Supabase kurulumu](../supabase/README.md).
