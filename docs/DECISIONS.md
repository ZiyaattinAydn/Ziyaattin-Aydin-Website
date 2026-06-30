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
