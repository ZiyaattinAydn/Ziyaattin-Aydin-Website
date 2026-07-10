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
