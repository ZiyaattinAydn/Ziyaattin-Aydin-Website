# Vercel Deployment Checklist

Durum: `[ ]` Vercel üzerinde henüz doğrulanmadı. Bu belge yalnız doğrulama akışını hazırlar.

## Amaç

Bu checklist, Kişisel Sistemim / Ziyaattin Aydın Website projesinin Vercel Preview ve Production deployment doğrulamasını güvenli ve tekrar edilebilir hâle getirmek için hazırlanmıştır.

Supabase Auth, MFA, PostgreSQL, Storage, RLS, gerçek route guard ve gerçek secret yönetimi bu sprintte uygulanmaz.

## 1. GitHub bağlantısı

- [ ] Repository Vercel hesabına import edilecek GitHub hesabında görünüyor mu?
- [ ] Repository: `ZiyaattinAydn/Ziyaattin-Aydin-Website`
- [ ] Default production branch `main` olarak seçildi mi?
- [ ] Private repository erişimi Vercel tarafından yetkilendirildi mi?
- [ ] Deploy tetikleyecek branch filtreleri kontrol edildi mi?

## 2. Project import ayarları

- [ ] Framework Preset: `Next.js`
- [ ] Root Directory: repository kökü
- [ ] Install Command: `npm ci`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: Vercel / Next.js varsayılanı; manuel `.next` override edilmemeli
- [ ] Node.js sürümü: proje gereksinimine göre Node.js `>=20.9`, tercihen Node 22
- [ ] Yeni bağımlılık veya özel registry kullanılmadı

## 3. Environment variables

Vercel Project Settings → Environment Variables altında tanımlanacak alanlar için sözleşme `docs/deployment/ENVIRONMENT.md` dosyasındadır.

- [ ] `NEXT_PUBLIC_SITE_URL` Preview için tanımlandı
- [ ] `NEXT_PUBLIC_SITE_URL` Production için tanımlandı
- [ ] Supabase placeholder değişkenleri gerçek secret olmadan boş veya güvenli placeholder olarak bırakıldı
- [ ] `SUPABASE_SERVICE_ROLE_KEY` client tarafına aktarılmadı ve `NEXT_PUBLIC_` prefix'i almadı
- [ ] Gerçek Supabase değerleri, kullanıcı kararı ve Faz 3 implementasyonu başlamadan eklenmedi

## 4. Preview deployment doğrulama

Preview deployment gerçek Vercel URL’i üzerinden kontrol edilmeden tamamlandı sayılmaz.

- [ ] Pull request / branch deployment başarıyla oluştu
- [ ] Build log içinde `npm ci` başarılı
- [ ] Build log içinde `npm run build` başarılı
- [ ] Next.js workspace root / multiple lockfile uyarısı geri gelmedi
- [ ] Yalnız `experimental.cpus: 4` bilgisi görünüyorsa blocker sayılmadı
- [ ] Preview URL açılıyor
- [ ] Console’da kritik runtime hata yok
- [ ] Mobil viewport’ta yatay taşma yok

## 5. Production deployment doğrulama

Production deployment gerçek production URL’i üzerinden kontrol edilmeden tamamlandı sayılmaz.

- [ ] `main` branch production deploy tetikledi
- [ ] Production build başarılı
- [ ] Production URL açılıyor
- [ ] Cache veya stale deployment sorunu yok
- [ ] Lighthouse veya temel manuel performans kontrolünde bariz blocker yok
- [ ] Production ortamında fake contact/social linkleri gerçek link gibi görünmüyor

## 6. Public route kontrol listesi

Aşağıdaki rotalar Preview ve Production üzerinde en az bir kez manuel açılmalı:

- [ ] `/`
- [ ] `/projects`
- [ ] `/projects/[slug]` — mevcut mock slug ile
- [ ] `/writings`
- [ ] `/writings/[slug]` — mevcut mock slug ile
- [ ] `/journey`
- [ ] `/about`

## 7. Auth / Studio route uyarısı

Bu sprintte gerçek auth guard yoktur. Aşağıdaki rotalar şimdilik placeholder veya mock Studio kabuğudur:

- [ ] `/login`
- [ ] `/studio`
- [ ] `/studio/projects`
- [ ] `/studio/tasks`
- [ ] `/studio/notes`
- [ ] `/studio/files`

Doğrulama sırasında bu rotaların var olması, güvenli private Studio tamamlandı anlamına gelmez.

## 8. Deployment tamamlandı kabul koşulu

Deployment yalnız şu koşullardan sonra tamamlandı işaretlenebilir:

- [ ] Preview deployment gerçek Vercel URL’i ile doğrulandı
- [ ] Production deployment gerçek production URL’i ile doğrulandı
- [ ] Build loglarında blocker yok
- [ ] Environment variable sözleşmesine aykırı gerçek secret commit edilmedi
- [ ] Public ve Studio placeholder durumları proje belgelerinde açık kaldı
