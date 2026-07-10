# Studio MFA Recovery Runbook

## Güvenlik modeli

Studio erişimi e-posta/şifre ile başlayan Supabase Auth oturumuna ek olarak active
`owner_profiles` allowlist ve current `aal2` gerektirir. Recovery code özelliği
yoktur. E-posta recovery bağlantısı tek başına Studio erişimi vermez; server guard
ve RLS her korumalı istekte AAL2 kontrolünü sürdürür.

## Normal yedek erişim

1. Owner AAL2 oturumuyla `/mfa?next=/studio` sayfasını aç.
2. “İkinci TOTP faktörü ekle” seçeneğini kullan.
3. İkinci bir fiziksel cihaz veya ayrı güvenli authenticator kurulumu kullan.
4. Yeni faktörü 6 haneli kodla doğrula.
5. İki verified faktörün listelendiğini kontrol et.

Son verified faktör arayüzden kaldırılamaz. Bir faktör kaybedildiğinde yalnız diğer
verified faktörle AAL2 oturumu açıldıktan sonra kayıp faktör kaldırılır.

## Tüm TOTP cihazları kaybedildiyse

Bu işlem yalnız Supabase Dashboard’a güvenli yönetici erişimi olan owner tarafından
development veya production projesi ayrımı doğrulandıktan sonra yapılır.

1. Doğru Supabase projesini ve ortamı doğrula.
2. Authentication → Users bölümünde owner Auth kullanıcısını UUID ve e-posta ile
   çapraz kontrol et.
3. Kullanıcının MFA factors bölümünde kayıp TOTP faktörlerini kontrollü biçimde
   kaldır.
4. Auth kullanıcısını veya `owner_profiles` kaydını silme.
5. Owner yeniden e-posta/şifre ile giriş yapsın.
6. Uygulama verified faktör bulunmadığını görerek zorunlu enrollment ekranına
   yönlendirsin.
7. Yeni TOTP faktörü doğrulanmadan `/studio/**` açılmamalı.
8. Erişim geri geldikten sonra ikinci yedek faktör oluştur.

## Yasaklar

- TOTP secret, QR içeriği, access token veya refresh token paylaşılmaz.
- Service role key normal login, MFA veya Studio CRUD için kullanılmaz.
- Owner UUID veya e-posta authorization kaynak koduna yazılmaz.
- E-posta recovery akışı MFA bypass olarak kabul edilmez.
- Son faktörü kaldırıp korumasız Studio oturumu bırakılmaz.
