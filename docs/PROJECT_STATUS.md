# Kişisel Sistemim — Güncel Durum

Son inceleme: 2026-10-25

## Kod (main)
- [x] Public sayfalar: Ana, Hakkımda, Projeler (liste/detay), Yazılar (liste/detay), Yolculuğum.
- [x] Supabase SSR/auth istemcileri, güvenli redirect, server Studio route guard.
- [x] Tek aktif owner + TOTP AAL2 doğrulaması; normal CRUD için RLS sınırı.
- [x] Studio Projects: liste, yeni taslak, düzenleme, yayın durumları, arşiv.
- [x] Studio Writings: liste/yeni/düzenleme/yayın durumları/arşiv (Sprint 08 main'e alındı).
- [x] Studio Tasks: gerçek liste, proje bağı, oluşturma, durum değiştirme, tamamlama, arşiv (Sprint 09 main'e alındı).
- [x] Ana Studio paneli: gerçek açık görevler ve proje sayıları.

## Canlı ortam
- [x] GitHub main -> Vercel production pipeline çalışıyor.
- [x] Development Supabase projesi mevcut; mevcut SQL şeması ve RLS/Storage bucket'ları kurulmuş.
- [x] Vercel Preview için Supabase URL/publishable key tanımlı.
- [ ] Ayrı Production Supabase projesi, owner bootstrap ve ortam değişkenleri.
- [ ] Gerçek Production Studio login/CRUD kabul testi.
- [ ] Production Public mock -> veritabanı kaynağı geçişi.
- [ ] Studio Writings ve Tasks için main sonrası bütünleşik end-to-end kabul matrisi (Preview build tek başına yeterli değil).

## Açık ürün geliştirmeleri
- [ ] Studio görevleri: başlık/açıklama/öncelik/proje/tarih düzenleme, filtreleme ve arama.
- [ ] Studio proje detayı: çalışma geçmişi, takip ve sonraki adım görünümü.
- [ ] Studio Notlar: kapsam netleşince güvenli oluşturma/düzenleme/arama.
- [ ] Studio Dosyalar: metadata, yükleme, özel dosyaya güvenli erişim, önizleme.
- [ ] Public gerçek içerikler: portföy vaka anlatıları, biyografi, doğrulanmış sosyal linkler, görseller.
- [ ] Yolculuğum ve public yazıları gerçek veriye bağlamak.
- [ ] PWA: manifest, ikonlar, install UX ve cache/offline/auth davranışları.
- [ ] Production backup, migration kayıtları ve geri alma stratejisi; güvenlik sertleştirme.

## Riskler ve borç
- Supabase Advisor: public.rls_auto_enable() SECURITY DEFINER execute yetkisi anonim ve giriş yapmış kullanıcılar için inceleme gerektiriyor; doğrulanmadan production'a taşınmamalı.
- Supabase Auth sızmış parola koruması uyarısı; plan/ayar uygunluğu değerlendirilmeli.
- Development Supabase tarafında uygulanan şema bulunmasına karşın migration history boş; yeniden kurulumdan önce şema/migration eşlemesi doğrulanmalı.
- README/arayüzde kalan mock/Sprint açıklamaları gerçek içerik geçişinde temizlenmeli.
- İçerik editörleri, dosya sistemi ve PWA için uçtan uca testler eksik.

## Yeni geliştirme düzeni
Tek iş -> kısa ömürlü branch -> UI+DB+test -> Preview kabul -> main merge -> Production kontrol.
Eski 5-sayfa orkestrasyon modeli ve sprint handoff dokümanları artık kullanılmıyor.
