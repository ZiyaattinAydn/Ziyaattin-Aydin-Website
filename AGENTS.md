<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Kişisel Sistemim — Agent Çalışma Kuralları

Her görevden önce sırayla oku:
1. `docs/PROJECT_STATUS.md`
2. `docs/WORKSTREAMS.md`
3. `docs/DECISIONS.md`
4. `docs/ROADMAP.md`
5. `CONTRIBUTING.md`

## Zorunlu Kurallar
- `main` üzerinde doğrudan özellik geliştirme.
- Yalnız atandığın branch ve dosya kapsamına dokun.
- Ortak altyapı dosyalarını değiştirmeden önce çalışma hattı sahipliğini kontrol et.
- Yeni bağımlılık eklemek gerekiyorsa nedenini handoff belgesine yaz.
- Gizli değerleri repository'ye ekleme; `.env.example` kullan.
- Onaylanmamış veya kullanıcıya benzemeyen portre üretme/kullanma.
- İş sonunda `docs/handoffs/YYYY-MM-DD-<branch>.md` oluştur.
- `docs/PROJECT_STATUS.md`, `docs/WORKSTREAMS.md` ve `CHANGELOG.md` dosyalarını güncelle.
- Teslimden önce `npm run lint`, `npm run typecheck` ve `npm run build` çalıştır.

## Durum Sembolleri
- `[ ]` Başlamadı
- `[~]` Devam ediyor
- `[x]` Branch içinde tamamlandı
- `[m]` Main'e merge edildi
- `[!]` Blocker veya dikkat
