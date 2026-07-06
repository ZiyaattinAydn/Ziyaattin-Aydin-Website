# Proje Durumu

Son güncelleme: 2026-07-07

## İşaretler
- `[ ]` Başlamadı
- `[~]` Devam ediyor
- `[x]` Branch içinde tamamlandı
- `[m]` Main'e merge edildi
- `[!]` Blocker / dikkat gerekiyor

## Mevcut Faz

**Faz 2 — Teknik Temel ve Proje İskeleti**

- [x] Proje ana dokümanı PDF olarak hazırlandı
- [x] Next.js + React + TypeScript projesi oluşturuldu
- [x] App Router, Tailwind CSS ve ESLint kuruldu
- [x] Inter ve JetBrains Mono bağlandı
- [x] Palet 2 varsayılan tema token'ları eklendi
- [x] Palet 1 ve Palet 3 alternatif token'ları eklendi
- [x] Public rota iskeletleri oluşturuldu
- [x] Login ve Studio kabuk rotaları oluşturuldu
- [x] Canlı proje takip belgeleri oluşturuldu
- [x] Onaylı tasarım referansları repository'ye eklendi
- [!] `npm audit` güncel Next.js bağımlılığında iki orta seviye PostCSS uyarısı gösteriyor; resmi patch takip edilecek
- [x] Yerel bootstrap commit oluşturuldu (`dd8ff0b`)
- [x] Public Sprint 01 branch kapsamında public sayfa deneyimi ilk kullanılabilir seviyeye getirildi
- [ ] GitHub repository oluşturulacak ve yerel `main` gönderilecek
- [ ] Bootstrap commit `main` branch'ine gönderilecek
- [ ] Üç feature branch güncel `main` üzerinden açılacak
- [ ] Vercel preview bağlantısı kurulacak

## Public Sprint 01 Çıktısı

- Public mock içerik modeli proje ve yazı detay sayfalarını besleyecek şekilde genişletildi.
- Ana sayfa; onaylı `home-hero.png` portresi korunarak hero, proje, yazı, dijital pano ve yolculuk bloklarıyla düzenlendi.
- Projeler sayfasına public alan içinde arama, durum/kategori filtreleri, sıralama, boş sonuç ve erişilebilir liste düzeni eklendi.
- Proje detayları; geri dönüş linki, durum/progress, teknoloji etiketleri, özet/problem/yaklaşım, kilometre taşları, öğrenilenler ve sonraki adımlar bloklarıyla iyileştirildi.
- Yazılar sayfasına öne çıkan yazı, arama, kategori filtreleri, sıralama ve temiz kart düzeni eklendi.
- Yazı detayları; içindekiler, okunabilir makale alanı, kod blokları ve ilgili yazılarla düzenlendi.
- Yolculuğum ve Hakkımda sayfalarında doğrulanmamış kişisel bilgi uydurmadan mock/aday içerik dili korundu.

## Sonraki Kilometre Taşı

Core, Public ve Studio branch'leri entegrasyon penceresi tarafından kalite kontrolleriyle incelenip `main`e sırayla merge edilecek.
