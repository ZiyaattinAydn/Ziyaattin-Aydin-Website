# Proje kayıtları

Veri modeli `public.projects` tablosunda. Studio işlemleri `src/features/projects/` altında.

## Düzenlenebilen alanlar

Başlık, slug, özet, problem, yaklaşım, öne çıkanlar, sonraki adımlar, proje durumu, görünürlük, ilerleme yüzdesi, öne çıkarma seçimi, GitHub/demo/görsel URL'leri.

Kimlik, sahiplik, yayın durumu, onay bilgileri ve zaman damgaları istemciden alınmıyor.

## Sınırlar

| Alan | Limit |
| --- | --- |
| Başlık | 140 karakter |
| Slug | 120 karakter |
| Özet | 600 karakter |
| Problem / yaklaşım | 12.000 karakter |
| Öne çıkanlar / sonraki adımlar | En fazla 40 madde |
| Madde | 500 karakter |
| URL | 2.048 karakter |

Slug yalnız küçük harf, sayı ve arada tire içerir. URL'ler HTTP/HTTPS olmalı, ilerleme 0–100 arası tam sayı olmalı.

## Yayın akışı

```text
draft -> review -> approved -> published -> unpublished
  |        |         |           |             |
  +--------+---------+-----------+-------------+--> archived
```

- Taslak ve inceleme aşamasında düzenleme yapılabilir.
- Yayınlanmış içeriğin slug'ı sabit kalır; yeniden adlandırma yönlendirmeleri henüz yok.
- Public yayın için içerik, bağlantı/görsel onayı ve `public` görünürlük koşulları sağlanmalı.
- Arşivlemek kaydı silmez, geri getirme işlemi henüz uygulanmadı.

Yetki doğrulaması sunucuda yapılır: oturum, aktif owner hesabı, current AAL2 ve Supabase RLS. Normal işlemler service-role kullanmaz.
