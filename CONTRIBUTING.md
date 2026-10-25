# Geliştirme düzeni

Projeyi tek akışta geliştiriyorum. Her iş için ayrı bir branch açıp işi bitirdiğimde `main`e alıyorum.

1. Güncel `main` üzerinden `feat/`, `fix/` veya `chore/` branch'i aç.
2. Değişiklik hangi katmanları etkiliyorsa birlikte ele al; gereksiz ayrı iş akışları oluşturma.
3. İlgili testleri, lint, typecheck ve build'i çalıştır.
4. Preview'da kontrol et, ardından PR ile `main`e birleştir.
5. Production dağıtımını kontrol et ve kullanılan branch'i sil.

Özel Studio verileri herkese açık siteye sızmamalı. Auth, MFA ve RLS kontrolleri korunmalı. Veritabanı değişiklikleri önce geliştirme ortamında denenmeli; Production için yedek ve geri dönüş planı bulunmalı.

Güncel yapılacaklar `docs/ROADMAP.md` içinde. Yapılan değişikliklerin geçmişi Git commitlerinde.
