# Changelog

## Unreleased

### Added
- Core UI primitive setine `ProgressBar` ve `SectionShell` eklendi
- Next.js 16, React 19, TypeScript ve Tailwind CSS tabanlı başlangıç projesi
- Public, auth ve Studio rota iskeletleri
- Palet 1, Palet 2 ve Palet 3 tema token'ları
- Inter ve JetBrains Mono font altyapısı
- Repository içi proje durumu, çalışma hattı, karar, yol haritası ve handoff belgeleri
- Onaylı tasarım referansları ve portre varlıkları
- Core ortak UI primitive'leri: `Button`, `LinkButton`, `SectionWrapper`, `EmptyState`, `StatCard`, `StatusBadge`
- UI primitive barrel export dosyası: `src/components/ui/index.ts`

### Changed
- `siteConfig` metadata, navigation, admin entry, contact ve social alanlarıyla daha güvenli yapılandırıldı
- Root metadata `siteConfig` ile tutarlı hâle getirildi
- Footer doğrulanmamış contact/social bilgilerini aktif link gibi göstermeyecek şekilde config tabanlı hale getirildi
- Next.js workspace root uyarısı için `next.config.ts` içinde Turbopack root proje köküne sabitlendi
- Yerel build worker sayısı `experimental.cpus: 4` ile sınırlandı
- Global tema token'ları Palet 2 varsayılan kalacak şekilde daha okunabilir semantik gruplara ayrıldı
- Global focus, selection, overflow ve reduced-motion kuralları güçlendirildi
- Public header mobil menü ve aktif sayfa erişilebilirliği iyileştirildi
- Public footer doğrulanmamış kişisel linkleri placeholder olarak gösterecek şekilde sadeleştirildi
- `Panel` ve `Tag` bileşenleri geriye uyumlu kalacak şekilde küçük varyant/tone desteği aldı

### Verified
- Sprint 02 başlangıç main commit’i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `62d5227` olarak kayda geçirildi
- Next.js 16 yerel dokümanlarında `turbopack.root` davranışı kontrol edildi
- `package-lock.json` içinde özel/internal registry izi bulunmadı
- `npm run lint`, `npm run typecheck` ve `npm run build` ayrı ayrı başarıyla çalıştı

### Known Issues
- Workspace root uyarısı gerçek Windows ortamında tekrar gözlenmeli; uyarı devam ederse repo dışındaki `C:\Users\ziyaa\package-lock.json` dosyasının gereksiz olup olmadığı kontrol edilmeli
- Snapshot içinde `.git` metadata bulunmadığı için GitHub remote, `main` ↔ `origin/main` senkronu ve gerçek son commit doğrulanamadı
- Bu ortamda `npm config get registry` protected registry hatası verdi
- `npm run check` bu ortamda build aşamasında zaman aşımına uğradı; alt komutlar ayrı ayrı başarılı
