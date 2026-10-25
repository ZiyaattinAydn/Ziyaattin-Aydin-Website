# Ziyaattin — Kişisel Sistemim

Kişisel marka/portföy sitesi ve tek kullanıcıya özel proje-görev çalışma alanı.

## Amaç
- **Public**: Kendimi, deneyimlerimi, projelerimi ve yazılarımı güvenilir içerikle sergilemek.
- **Studio**: Projelerimi, açık/tamamlanan görevlerimi ve ileride notları/dosyaları takip etmek.
- **Mobil**: Responsive tasarımdan, telefona kurulabilir bir PWA'ya ilerlemek.

## Teknoloji
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase (Auth/PostgreSQL/Storage/RLS) ve Vercel.

## Gerçek durum (25 Ekim 2026)
- Public arayüz mevcut; Production'da içerik büyük ölçüde mock. Production Supabase cutover yok.
- Studio login, TOTP MFA (AAL2), aktif owner denetimi ve RLS altyapısı mevcut.
- Proje CRUD, yazı CRUD ve görev oluşturma/durum/arşivleme kodu main'de.
- Not ve dosya sayfaları henüz gerçek CRUD yapmıyor.
- PWA manifest/service worker/install akışı henüz uygulanmadı.
- Geliştirme Supabase projesi `atrphakkgpqtoqdigggt` ve Vercel Preview bağlantısı bulunuyor; Production'da ayrı Supabase ortamı kurulmadı.
- Gerçek kabul testleri ve üretim geçişi için docs/PROJECT_STATUS.md'yi incele.

## Geliştirme
Node.js 22.x gerekli.

```bash
npm ci
# .env.example içinden güvenli biçimde .env.local hazırla
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Temel rotalar
- Public: `/`, `/about`, `/projects`, `/projects/[slug]`, `/writings`, `/writings/[slug]`, `/journey`
- Studio: `/login`, `/mfa`, `/studio`, `/studio/projects`, `/studio/writings`, `/studio/tasks`, `/studio/notes`, `/studio/files`

## Belgeler
- [Durum](docs/PROJECT_STATUS.md)
- [Yol haritası](docs/ROADMAP.md)
- [Kararlar](docs/DECISIONS.md)
- [Mimari](docs/ARCHITECTURE.md)
- [Geliştirme kuralları](CONTRIBUTING.md)
- [Orijinal proje ana dokümanı](docs/kisisel-sistemim-proje-ana-dokumani.pdf)

Önceki sprint/handoff ayrıntıları silinen dokümanlarla birlikte Git geçmişinde korunur; yeni çalışma modeli tek akışlıdır.
