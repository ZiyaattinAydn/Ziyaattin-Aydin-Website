# Yapılacaklar

## Tamamlanan teknik geliştirme

- [x] Studio: projeler, görevler, yazılar, notlar, özel dosyalar ve yayın araçları.
- [x] Studio Yolculuğum: taslak, düzenleme, açık onayla yayın, yayından kaldırma ve arşiv.
- [x] Studio Hakkımda/iletişim: gizli taslak, link doğrulama, açık onayla yayın ve geri alma.
- [x] Public 1.0: anonim içerik okuma, SEO, sitemap, responsive ve güvenlik kontrolleri.
- [x] GitHub Actions: PR ve main push'larında npm test, npm run check ve npm audit.
- [x] PR #11, #12, #13 main'e birleştirildi; Vercel Production READY.
- [x] Profil migration'ı Supabase'e uygulandı (20261025223430); mevcut içerik kayıtları korunuyor.

## GitHub / Vercel yönetici ayarları (son kullanıcı UI işlemleri)

- [ ] Vercel Preview kapalı ayarını doğrula: previewDeploymentsDisabled=true isteği Vercel tarafından kabul edildi, ancak mevcut okuma araçları bu alanı göstermiyor. Kalıcılık bağımsız teyit edilemedi.
- [ ] GitHub main için Quality checks / test-and-build required status check: workflow başarılı, rulesets listesi boş ve main protected=false. Bağlayıcıda Administration yetkisi yok (403).
- [ ] Birleşmiş artık branch'leri sil: chore/remove-stale-launcher-and-env-notes (PR #8), feat/final-tech-readiness-20261026 (PR #12), feat/studio-profile-readiness-20261026 (PR #13). Aktif bağlayıcı branch delete yapmıyor.

## Final kabul (gerçek hesap ve cihaz)

- [ ] Studio'da MFA, not ve dosya yükleme/indirme ile yeni editörlerin gerçek hesap testleri.
- [ ] Android/iOS ana ekrana ekleme, gerçek PWA açılışı ve uzun oturum testi.
- [ ] Supabase Auth'da sızdırılmış parola koruması (mevcut plan desteklerse; ücretli yükseltme yok).
- [ ] Gerçek biyografi, iletişim, proje, portföy görselleri, yazılar ve Yolculuğum kayıtları.
- [ ] Gerçek içeriklerle son erişilebilirlik, SEO, mobil görünüm ve yayın kontrolü.

## Bilerek ertelenenler

- Ücretli ikinci Supabase projesi ve ücretli özelliklere geçiş.
- Özel kullanıcı verileri için offline PWA önbelleği.
- Küçük veri hacmi için gereksiz mikro-optimizasyonlar.
