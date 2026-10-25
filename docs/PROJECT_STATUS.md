# Projenin durumu

Son kontrol: 25 Ekim 2026

## Çalışan kısımlar

- Kişisel sitenin ana sayfa, hakkımda, projeler, yazılar ve yolculuk sayfaları.
- Supabase Auth ile giriş, TOTP doğrulaması ve korumalı Studio alanı.
- Studio'da proje oluşturma/düzenleme, yayın durumu ve arşivleme.
- Studio'da yazı oluşturma/düzenleme ve yayın akışı.
- Görev oluşturma, projeye bağlama, durum değiştirme, tamamlama ve arşivleme.
- Açık görevleri gösteren Studio ana paneli.
- GitHub'dan Vercel'e otomatik dağıtım.

## Henüz tamamlanmayanlar

- Public portföydeki örnek içerikleri gerçek projeler ve kişisel bilgilerle değiştirmek.
- Görevlerin başlık, açıklama, tarih, öncelik ve proje bağlantısını sonradan düzenlemek.
- Proje çalışma geçmişi ve kaldığım yerden devam et akışını geliştirmek.
- Not alma ve dosya yönetiminde gerçek kayıt işlemleri.
- Telefona kurulabilen PWA.
- Ayrı Production Supabase veritabanı ve Studio girişinin Production'da çalışması.

## Teknik notlar

- Supabase geliştirme ortamı aktif. Vercel Preview Supabase'e bağlı; Production için ayrı veritabanı/ortam değişkenleri gerekiyor.
- Public sayfalarda üretim ortamı hâlâ büyük ölçüde örnek içerik gösteriyor.
- Supabase'in güvenlik uyarılarından `public.rls_auto_enable()` fonksiyonunun erişim yetkisi gözden geçirilmeli.
- Gerçek Production geçişinden önce migration geçmişi, yedekleme ve MFA/erişim testleri yapılmalı.

Yapılacakların sırası için [yol haritası](ROADMAP.md).
