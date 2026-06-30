# Geliştirme Kuralları

1. `main` üzerinde doğrudan geliştirme yapılmaz.
2. Her iş paketi güncel `main`den açılan kısa ömürlü bir branch üzerinde yürütülür.
3. İşe başlamadan önce `docs/PROJECT_STATUS.md`, `docs/WORKSTREAMS.md` ve `docs/DECISIONS.md` okunur.
4. Ortak dosya sahipliğine uyulur; başka çalışma hattının alanında gereksiz düzenleme yapılmaz.
5. İş sonunda handoff belgesi oluşturulur ve takip dosyaları güncellenir.
6. Merge öncesinde lint, type-check ve production build geçmelidir.

## Commit Örnekleri
- `feat(public): add projects listing`
- `feat(studio): create dashboard shell`
- `feat(theme): add palette tokens`
- `fix(public): prevent mobile overflow`
- `docs: update project status`
