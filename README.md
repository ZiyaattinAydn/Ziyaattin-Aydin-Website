# Kişisel Sistemim

Ziyaattin'in public portföyü ile yalnız kendisinin kullanacağı özel Studio çalışma alanını tek platformda birleştiren Next.js projesi.

## Teknoloji
- Next.js 16 / App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (sonraki faz)
- Vercel

## Gereksinim
- Node.js 20.9 veya üzeri; Node 22 önerilir.

## Başlangıç
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Kalite Kontrolleri
```bash
npm run lint
npm run typecheck
npm run build
# veya
npm run check
```

## Temel Rotalar
- `/`
- `/projects`
- `/projects/[slug]`
- `/writings`
- `/writings/[slug]`
- `/journey`
- `/about`
- `/login`
- `/studio`

## Çalışmaya Başlamadan Önce
1. `docs/PROJECT_STATUS.md`
2. `docs/WORKSTREAMS.md`
3. `docs/DECISIONS.md`
4. `CONTRIBUTING.md`

belgelerini oku.

## Ana Proje Belgesi
`docs/kisisel-sistemim-proje-ana-dokumani.pdf`
