# Changelog

## Unreleased

### Added
- GitHub → Vercel otomatik deployment doğrulama kaydı eklendi: `docs/deployment/DEPLOYMENT_VERIFICATION.md`
- Vercel Preview / Production doğrulama checklist'i eklendi: `docs/deployment/VERCEL_CHECKLIST.md`
- Environment değişken sözleşmesi eklendi: `docs/deployment/ENVIRONMENT.md`
- `.env.example` içine güvenli placeholder deployment ve Supabase hazırlık değişkenleri eklendi
- Faz 3 öncesi Supabase Auth, MFA, route guard, Storage, RLS ve public publish karar başlıkları karar kaydına eklendi
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
- Vercel checklist manuel CLI deploy yerine GitHub integration / automatic preview-production deployment akışını merkeze alacak şekilde güncellendi
- Environment sözleşmesi ve `.env.example` Vercel Preview/Production env kapısını daha açık tarif edecek şekilde güncellendi
- Project tracking belgeleri Sprint 03 Core deployment hazırlığına göre güncellendi
- Faz 2 durumu Vercel gerçek doğrulaması beklediği için açık şekilde `[~]` bırakıldı
- `.env.example` service role key'in client tarafında kullanılmaması gerektiğini belirtecek şekilde güçlendirildi
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
- Sprint 04 başlangıç main commit’i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `d68fa15` olarak kayda geçirildi
- `npm run lint`, `npm run typecheck`, `npm run build` ve `npm audit` Sprint 04 snapshot üzerinde çalıştırıldı
- Sprint 03 başlangıç main commit'i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `e77d2d1` olarak kayda geçirildi
- `npm run lint`, `npm run typecheck` ve `npm run build` bu snapshot üzerinde başarıyla çalıştı
- Build çıktısında workspace root / multiple lockfile uyarısı görünmedi; ilk build için build cache uyarısı ve telemetry bilgilendirmesi görüldü
- `package-lock.json` içinde özel/internal registry izi bulunmadı
- Sprint 02 başlangıç main commit’i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `62d5227` olarak kayda geçirildi
- Next.js 16 yerel dokümanlarında `turbopack.root` davranışı kontrol edildi

### Known Issues
- GitHub → Vercel project bağlantısı, production branch, Preview URL ve Production URL bu ortamda doğrulanamadı; Vercel erişimiyle manual verification required
- Vercel Preview / Production gerçek URL üzerinden henüz doğrulanmadıysa deployment tamamlandı sayılmamalı
- `npm audit` iki orta seviye uyarı göstermeye devam ediyor: `next` ve dolaylı `postcss` (`GHSA-qx2v-qp2m-jg93`). `npm audit fix --force` çalıştırılmadı
- Supabase Auth, MFA, PostgreSQL, Storage, RLS ve gerçek route guard henüz başlamadı
- Public ve Studio hâlâ mock veriyle çalışıyor
- Hakkımda portresi ve gerçek iletişim/sosyal linkler kullanıcı onayı olmadan aktif edilmeyecek
- Snapshot içinde `.git` metadata bulunmadığı için GitHub remote, `main` ↔ `origin/main` senkronu ve gerçek son commit sandbox içinde doğrulanamadı
