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
- [!] GitHub repository ve remote doğrulaması bu snapshot ortamında yapılamadı; zip içinde `.git` metadata bulunmadığı için gerçek worktree'de `git remote -v` ile doğrulanmalı
- [!] `main` ve `origin/main` senkron durumu bu snapshot ortamında doğrulanamadı; gerçek worktree'de `git fetch origin` ve `git status` ile kontrol edilmeli
- [!] Başlangıç commit bilgisi `git rev-parse --short HEAD` ile bu ortamda güncellenemedi; zip içinde `.git` metadata yok
- [ ] Üç feature branch güncel `main` üzerinden açılacak
- [ ] Vercel preview bağlantısı kurulacak

## Sprint 01 — Core Foundation

- [x] Palet 1, Palet 2 ve Palet 3 token'ları daha düzenli semantik değişkenlerle toparlandı
- [x] Global CSS temel erişilebilirlik, seçim, focus ve responsive overflow kuralları güçlendirildi
- [x] Ortak UI primitive seti genişletildi: `Button`, `LinkButton`, `SectionWrapper`, `EmptyState`, `StatCard`, `StatusBadge`
- [x] Mevcut `Panel`, `Tag` ve `PageIntro` uyumluluğu korunarak küçük geliştirmeler yapıldı
- [x] Public header mobil menü davranışı sade ve erişilebilir şekilde güçlendirildi
- [x] Public footer gerçekliği doğrulanmamış e-posta/GitHub/LinkedIn bilgilerini link olarak uydurmayacak şekilde düzenlendi
- [x] `package-lock.json` içinde özel/internal registry izi aranıp bulunmadı
- [!] `npm config get registry` bu ortamda `registry option is protected` hatası verdi; gerçek yerel makinede tekrar doğrulanmalı
- [!] `npm run check` bu ortamda build aşamasında zaman aşımına uğradı; `npm run lint`, `npm run typecheck` ve `npm run build` ayrı ayrı başarıyla tamamlandı

## Sonraki Kilometre Taşı

Core branch entegrasyonundan sonra Public Site ve Studio Shell çalışma hatları güncel `main` üzerinden başlatılacak.
