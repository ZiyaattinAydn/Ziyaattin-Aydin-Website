# Projenin durumu

Son kontrol: 25 Ekim 2026

## Studio 1.0 geliştirmesi

- Görev oluşturma/düzenleme, öncelik, başlangıç/bitiş tarihi, proje bağlantısı, durum, yeniden açma ve onaylı arşivleme.
- Proje, durum, öncelik ve tarih filtreleri; Türkçe arama, sıralama ve gecikme göstergeleri.
- Gerçek kayıtlardan dashboard sayaçları, yaklaşan işler, son çalışılan projeler ve hızlı görev formu.
- Proje detayında görevler, görevlerden hesaplanan ilerleme, sıradaki adımlar ve bağlantılar. Görev yoksa yüzde gösterilmez. Önceki manuel ilerleme alanı açıkça kişisel tahmin olarak etiketlenir.
- Proje tamamlanmadan açık görev kontrolü; tamamlanmış projeye açık görev eklenince/yeniden açılınca projenin aktif duruma dönmesi.
- Mobil navigasyon, form yüklenme/hata durumları, arşiv onayı, erişilebilir odak ve hata ekranları.
- Manifest ve uygulama ikonları. Service worker, özel veri önbelleği veya çevrimdışı düzenleme yok.

## Güvenlik ve ortam

Preview ve Production aynı Supabase projesini (`atrphakkgpqtoqdigggt`) kullanır. Yeni bir proje açılmadı. İki ortamda URL ve publishable key tanımlı; görünür değişkenlerde service-role/secret key yok.

`20261025200525_studio_1_0_security_and_tasks.sql` ortak veritabanına uygulandı. Başlangıç alanı ve kontroller eklendi; mevcut satırlar değiştirilmedi. Önce/sonra proje ve görev sayıları ile içerik özetleri aynı. Eski migration dosyaları geçmişte SQL Editor ile kurulmuş; bunları tekrar çalıştırmayın.

Owner RLS yardımcısı artık AAL2 de ister. AAL1'de yalnız kişinin kendi profilini okuma korunur; TOTP kurulumu engellenmez. `rls_auto_enable()` için anon/authenticated erişimi kaldırıldı; ilgili iki güvenlik uyarısı kapandı. Sızdırılmış parola koruması hâlâ kapalı: Supabase Auth ayarından ayrıca ele alınmalı; ücretli plan değişikliği yapılmadı.

Uygulama geri alınırsa eklenen sütun korunabilir; veri içeren sütunları veya tabloları silerek rollback yapmayın.

## Doğrulama ve yayın kapısı

`npm test`: görev/Server Action testleri, ayrı geçici PostgreSQL üzerinde sentetik CRUD/RLS testleri, proje kuralları ve public içerik sınırları. Test PostgreSQL'i ağdaki Supabase'e bağlanmaz; Auth işlevleri yerel test karşılıklarıdır, gerçek Auth/TOTP testi sayılmaz.

`npm run check`: lint, typecheck ve production build. Güvenlik düzeltmeleri için Next.js 16.4.3'e geçildi; npm audit temiz.

Kullanıcı Preview’da gerçek hesapla giriş → TOTP → Studio → çıkış akışının başarılı olduğunu doğruladı. Yerel production sunucusunda girişsiz/geçersiz çerezli Studio erişimi, no-store başlıkları, manifest/ikonlar ve farklı kaynaktan çıkış isteğinin reddi test edildi. Canlı Supabase tasks ve owner_profiles anonim okumaları HTTP 401 ile reddedildi.

Panel, görev listesi/formu ve proje detayı 390/768/1440 pikselde bağımsız sentetik görsel testte taşma veya etiketsiz form alanı göstermedi. Bu test uygulamanın yetkilendirmesini değiştirmez. Uzun süreli oturum yenileme ve gerçek Android/iOS ana ekrana ekleme henüz cihaz testi bekler. Kullanıcı onaylı Preview akışından sonra Production dağıtımı ayrıca kontrol edilir.

Notlar ve dosyalar ayrı çalışma kapsamında. Public portföy tasarımı ve mevcut içerik kaynağı değiştirilmedi.
