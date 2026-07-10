# Studio Sprint 06 Handoff — Auth / MFA

- Branch: `feat/studio-auth-mfa-s06`
- Core base: `02f7c6a`
- Storage alignment commit: `c395508`
- Kod durumu: tamamlandı
- Runtime dış işlemler: bekliyor
- Ara başarı etiketi: `S06_STUDIO_CODE_OK`

## Tamamlanan kod

- Supabase email/password login
- Güvenli internal redirect
- Trusted user + active owner/admin allowlist doğrulaması
- TOTP enrollment, QR/manual secret ve challenge/verify
- Birden fazla verified faktör ve son faktörü koruyan kaldırma davranışı
- `/studio/**` server layout current AAL2 guard
- Proxy session refresh kapsamına `/mfa` eklenmesi
- Server-side logout ve no-store/cache temizliği
- Env eksikken fail-closed davranış
- Recovery/reset ve development setup runbook’ları
- Static verifier: `node scripts/verify-studio-auth.mjs`

## Secret durumu

Gerçek URL, publishable key, service role key, database password, owner UUID, TOTP
secret, QR secret, access token ve refresh token kaynak koda veya dokümana
eklenmedi. Owner e-postası authorization kodunda hard-code edilmedi.

## Dış ortamda tamamlanacaklar

1. Development Supabase project oluşturma.
2. Yalnız local ve Vercel Preview env değerlerini girme.
3. Dört migration dosyasını sırayla çalıştırma.
4. Owner Auth kullanıcısını oluşturma ve pending profile’ı active owner yapma.
5. Development seed çalıştırma.
6. İlk TOTP enrollment ve ikinci faktör testi.
7. Anonymous, owner AAL1, owner AAL2 ve allowlist dışı RLS matrisi.
8. Preview login, MFA, Studio protection ve logout kabul testi.
9. Yaklaşık sekiz saat session hedefinin Dashboard desteğini kaydetme.

Bu dış işlemler doğrulanmadan `S06_STUDIO_OK` etiketi verilmez ve production
uygulanmış gibi raporlanmaz.
