# Branch Handoff — Bootstrap

- Tarih: 2026-07-01
- Sohbet / çalışma hattı: Başlangıç iskeleti
- Branch: `main`
- Son commit: dd8ff0b

## Yapılan İşler
- Next.js 16.2.9, React 19.2.4 ve TypeScript projesi oluşturuldu.
- Tailwind CSS 4 ve ESLint kuruldu.
- Public, auth ve Studio rota iskeletleri hazırlandı.
- Palet 2 varsayılan, Palet 1 ve Palet 3 alternatif tema token'ları eklendi.
- Onaylı tasarım referansları ve portre varlıkları eklendi.
- Beş sohbetli çalışma düzeni için canlı takip belgeleri hazırlandı.

## Değiştirilen Ana Dosyalar
- `src/app/**`
- `src/components/**`
- `src/data/mock-content.ts`
- `src/lib/site-config.ts`
- `docs/**`
- `README.md`
- `CONTRIBUTING.md`
- `AGENTS.md`

## Eklenen Bağımlılıklar
- create-next-app varsayılan bağımlılıkları dışında ek bağımlılık yok.

## Yeni Environment Değişkenleri
- `.env.example` içine gelecekteki Supabase ve site URL alanları eklendi.

## Çalıştırılan Kontroller
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

## Bilinen Eksikler
- Supabase, Auth, MFA ve gerçek veri bağlantısı henüz yok.
- PWA manifest ve service worker henüz yok.
- Mobil menü henüz yalnız iskelet seviyesinde.
- Inter ve JetBrains Mono CSS font adı olarak tanımlı; font dosyası repository'ye eklenmedi.

## Güvenlik Notu
- `npm audit` güncel Next.js 16.2.9 içindeki PostCSS için iki orta seviye uyarı bildiriyor.
- Güncel kararlı Next.js sürümü 16.2.9 ve güvenli, kırmayan otomatik düzeltme bulunmuyor.
- `npm audit fix --force` kullanılmamalı; resmi Next.js güncellemesi takip edilmeli.

## Merge Sırasında Dikkat
- Bu iskelet üç feature branch'in ortak başlangıç noktasıdır.
- Feature branch'ler bu commit `main`e gönderildikten sonra açılmalıdır.
