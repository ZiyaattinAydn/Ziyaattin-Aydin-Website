# Vercel Deployment Checklist

Durum: `[!]` GitHub → Vercel otomatik deployment bağlantısı gerçek Vercel hesabı üzerinden henüz doğrulanmadı. Bu checklist ana akışı GitHub integration ve automatic deployments olarak tanımlar.

## Amaç

Kişisel Sistemim / Ziyaattin Aydın Website projesinde deployment modeli şudur:

1. Kod GitHub repository'ye pushlanır.
2. Feature branch push'ları Vercel Preview Deployment üretir.
3. Integration branch kalite testlerinden geçer.
4. Integration branch `main`e merge edilir.
5. `main` push sonrası Vercel Production Deployment tetiklenir.
6. Preview ve Production URL'leri gerçek deployment üzerinden doğrulanır.

Manuel `vercel --prod` ana akış değildir. Vercel CLI yalnız inspect/debug/durum görüntüleme için opsiyonel yardımcıdır.

Supabase Auth, MFA, PostgreSQL, Storage, RLS, gerçek route guard ve gerçek secret yönetimi bu sprintte uygulanmaz.

## 1. GitHub repository bağlantısı

- [ ] Vercel project, GitHub repository'ye bağlı mı?
- [ ] Repository: `ZiyaattinAydn/Ziyaattin-Aydin-Website`
- [ ] Repository URL: `https://github.com/ZiyaattinAydn/Ziyaattin-Aydin-Website`
- [ ] Private repository erişimi Vercel tarafından yetkilendirildi mi?
- [ ] `origin` remote yerelde doğru repository'yi gösteriyor mu?
- [ ] Feature branch push'u GitHub'da görünüyor mu?
- [ ] Branch ignore / deployment protection ayarları beklenen branch'leri engellemiyor mu?

Yerel Git kontrolü:

```bash
cd /c/Users/ziyaa/Ziyaattin-Aydin-Website

git status
git fetch origin
git checkout main
git pull --ff-only origin main
git rev-parse --short HEAD
git remote -v
git branch -vv
```

## 2. Vercel project Git ayarları

Vercel Dashboard → Project → Settings → Git altında kontrol edilecek:

- [ ] Git provider: GitHub
- [ ] Linked repository: `ZiyaattinAydn/Ziyaattin-Aydin-Website`
- [ ] Production Branch: `main`
- [ ] Automatic deployments açık mı?
- [ ] Preview deployments feature branch push'larında tetikleniyor mu?
- [ ] Production deployments `main` push/merge sonrası tetikleniyor mu?
- [ ] Ignored Build Step / branch ignore ayarları beklenen deployları engellemiyor mu?

Erişim yoksa bu bölüm `[!] not verified` bırakılmalı; deployment tamamlandı denmemeli.

## 3. Project import / build ayarları

- [ ] Framework Preset: `Next.js`
- [ ] Root Directory: repository kökü
- [ ] Install Command: `npm ci`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: Vercel / Next.js varsayılanı; manuel `.next` override edilmemeli
- [ ] Node.js sürümü: proje gereksinimine göre Node.js `>=20.9`, tercihen Node 22
- [ ] Yeni bağımlılık veya özel registry kullanılmadı
- [ ] Build log içinde Next.js workspace root / multiple lockfile uyarısı geri gelmedi
- [ ] Yalnız `experimental.cpus: 4` bilgisi görünüyorsa blocker sayılmadı

## 4. Environment variables

Vercel Project Settings → Environment Variables altında tanımlanacak alanlar için sözleşme `docs/deployment/ENVIRONMENT.md` dosyasındadır.

- [ ] `NEXT_PUBLIC_SITE_URL` Preview için doğru preview/custom URL ile tanımlandı
- [ ] `NEXT_PUBLIC_SITE_URL` Production için production URL/custom domain ile tanımlandı
- [ ] `NEXT_PUBLIC_SUPABASE_URL` Faz 3 başlamadan gerçek production secret gibi kullanılmadı
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` Faz 3 başlamadan gerçek production secret gibi kullanılmadı
- [ ] `SUPABASE_SERVICE_ROLE_KEY` yalnız server-side secret olarak tanımlandıysa tanımlandı; client tarafına aktarılmadı
- [ ] `SUPABASE_SERVICE_ROLE_KEY` hiçbir zaman `NEXT_PUBLIC_` prefix'i almadı
- [ ] Gerçek secret repository'ye commit edilmedi

## 5. Feature branch Preview Deployment akışı

Feature branch push sonrası beklenen akış:

1. `feat/core-vercel-s04` branch'i GitHub'a pushlanır.
2. Vercel Deployments ekranında yeni Preview Deployment görünür.
3. Deployment commit'i branch'in son commit'iyle eşleşir.
4. Build log içinde `npm ci` ve `npm run build` başarılıdır.
5. Preview URL açılır.
6. Kritik route kontrolü yapılır.

Kontrol listesi:

- [ ] Preview deployment oluştu
- [ ] Preview URL kaydedildi
- [ ] Preview deployment branch/commit eşleşmesi doğrulandı
- [ ] Build logları incelendi
- [ ] Workspace root uyarısı yok
- [ ] Console'da kritik runtime hata yok
- [ ] Mobil viewport'ta yatay taşma yok

Vercel erişimi yoksa veya deployment görünmüyorsa `docs/deployment/DEPLOYMENT_VERIFICATION.md` içinde `not verified` / blocker olarak yaz.

## 6. Sprint 04 Production Deployment akışı

Production deployment Core branch içinde doğrudan tetiklenmez. Beklenen entegrasyon akışı:

1. Feature branch push → Preview Deployment beklenir.
2. Integration branch kalite testleri geçer.
3. `integration/sprint-04` `main`e merge edilir.
4. `main` push → Production Deployment beklenir.
5. Production deployment URL ve commit doğrulanır.

Kontrol listesi:

- [ ] `integration/sprint-04` main'e merge edildi
- [ ] `main` push Production Deployment tetikledi
- [ ] Production deployment commit'i main merge commit'iyle eşleşiyor
- [ ] Production URL açılıyor
- [ ] Production build logları başarılı
- [ ] Production ortamında fake contact/social linkleri gerçek link gibi görünmüyor

Production deployment gerçek URL üzerinden kontrol edilmeden tamamlandı sayılmaz.

## 7. Public route kontrol listesi

Aşağıdaki rotalar Preview ve Production üzerinde en az bir kez manuel açılmalı:

- [ ] `/`
- [ ] `/projects`
- [ ] `/projects/[slug]` — mevcut mock slug ile
- [ ] `/writings`
- [ ] `/writings/[slug]` — mevcut mock slug ile
- [ ] `/journey`
- [ ] `/about`

## 8. Auth / Studio route uyarısı

Bu sprintte gerçek auth guard yoktur. Aşağıdaki rotalar şimdilik placeholder veya mock Studio kabuğudur:

- [ ] `/login`
- [ ] `/studio`
- [ ] `/studio/projects`
- [ ] `/studio/tasks`
- [ ] `/studio/notes`
- [ ] `/studio/files`

Bu rotaların açılması güvenli private Studio tamamlandı anlamına gelmez.

## 9. Opsiyonel Vercel CLI inceleme

Ana akış GitHub integration'dır. CLI yalnız erişim varsa durum görüntüleme için kullanılabilir:

```bash
vercel --version
vercel project ls
vercel ls
vercel inspect <deployment-url>
```

CLI login veya project yetkisi yoksa zorlanmamalı. Böyle bir durumda deployment doğrulaması tamamlandı değil, `not verified` olarak belgelenmelidir.

## 10. Deployment tamamlandı kabul koşulu

Deployment yalnız şu koşullardan sonra tamamlandı işaretlenebilir:

- [ ] Vercel project GitHub repository'ye bağlı olduğu doğrulandı
- [ ] Production Branch değerinin `main` olduğu doğrulandı
- [ ] Feature branch Preview Deployment gerçek Vercel URL'iyle doğrulandı
- [ ] Sprint integration `main` merge sonrası Production Deployment gerçek URL ile doğrulandı
- [ ] Build loglarında blocker yok
- [ ] Environment variable sözleşmesine aykırı gerçek secret commit edilmedi
- [ ] Public ve Studio placeholder durumları proje belgelerinde açık kaldı
