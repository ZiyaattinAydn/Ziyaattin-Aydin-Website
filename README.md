# Ziyaattin Aydın — Personal Website

> 🟡 **Durum:** Aktif geliştirme

Public portföyü ile yalnızca kişisel kullanım için tasarlanan özel **Studio** çalışma alanını tek platformda birleştiren Next.js projesi.

## Proje hedefi

Tek bir sistem içinde:

- Projeleri ve case study'leri sergilemek
- Yazıları ve teknik notları yayınlamak
- Kişisel gelişim / journey alanını göstermek
- Public portföy ile private Studio deneyimini ayırmak
- İlerleyen fazlarda Supabase tabanlı veri ve oturum yapısını kullanmak

## Teknoloji

- Next.js 16 / App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase *(sonraki faz)*
- Vercel

## Temel rotalar

```text
/
/projects
/projects/[slug]
/writings
/writings/[slug]
/journey
/about
/login
/studio
```

## Gereksinim

- Node.js 20.9 veya üzeri
- Node.js 22 önerilir

## Başlangıç

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Kalite kontrolleri

```bash
npm run lint
npm run typecheck
npm run build
# veya
npm run check
```

## Geliştirme durumu

Proje tamamlanmış bir portföy şablonu olarak değil, aktif olarak büyütülen kişisel bir sistem olarak geliştirilmektedir. Public portföy tarafı ile private Studio tarafı aynı ürün mimarisi içinde ilerlemektedir.

## Proje belgeleri

Çalışmaya başlamadan önce:

1. `docs/PROJECT_STATUS.md`
2. `docs/WORKSTREAMS.md`
3. `docs/DECISIONS.md`
4. `CONTRIBUTING.md`

Ana proje belgesi:

`docs/kisisel-sistemim-proje-ana-dokumani.pdf`
