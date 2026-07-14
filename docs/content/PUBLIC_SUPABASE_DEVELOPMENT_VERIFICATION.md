# Public Supabase Development Verification

Bu runbook yalnız Sprint 07 development project read doğrulaması içindir.
Production Public database cutover değildir.

## Güvenlik sınırı

Anonymous project read yalnız aşağıdaki üç koşulu birlikte sağlayan kayıtları
görebilir:

```text
visibility = public
publish_state = published
published_at IS NOT NULL
```

Service role kullanılmaz. URL, publishable key, kullanıcı bilgisi veya TOTP
değeri terminal çıktısına, handoff'a ya da Git'e kopyalanmaz.

## Kullanılan mevcut environment adları

```text
PUBLIC_CONTENT_SOURCE
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Yeni source env adı oluşturulmaz.

`.env.local` tracked olmamalıdır:

```bash
git check-ignore -v .env.local
git ls-files | grep -E '(^|/)\.env($|\.)'
```

## Local mock doğrulaması

`PUBLIC_CONTENT_SOURCE` boş veya `mock` iken:

```bash
npm run dev
```

Kontrol:

- `/projects` mock kayıtları gösterir.
- `/projects/<mock-slug>` açılır.
- Production benzeri source guard mock kalır.

## Local development Supabase seçimi

`.env.local` içinde gerçek değerleri paylaşmadan şu seçim bulunur:

```text
PUBLIC_CONTENT_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=<development project>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<development publishable key>
```

Ardından:

```bash
npm run dev
```

Kontrol:

1. `/projects` yalnız development `published + public + published_at` kayıtlarını gösterir.
2. Published/public bir slug detail route'ta açılır.
3. Draft, review, approved, unpublished, archived, hidden, private ve
   `published_at = null` slug'ları aynı 404 davranışına gider.
4. Pending/rejected GitHub veya demo URL anchor olarak render edilmez.
5. Project image approval/alt şeması tamamlanmadığından image render edilmez.
6. Liste boşsa private kayıt sayısını ima etmeyen nötr empty state görünür.

## Hosted anonymous verifier

Önce Studio UI veya kontrollü development SQL ile açıkça development demo
olarak işaretlenmiş en az bir proje `published + public + published_at` hâline
getirilir. Production'a dokunulmaz.

`.env.local` değerlerini Node'a yükleyerek:

```bash
node   --env-file-if-exists=.env.local   --experimental-strip-types   --experimental-loader ./scripts/ts-alias-loader.mjs   scripts/verify-public-project-reads.mjs   --published-slug <published-development-slug>   --hidden-slug <draft-or-private-development-slug>
```

Birden fazla `--hidden-slug` verilebilir. Başarılı sonuç:

```text
PUBLIC_PROJECT_HOSTED_READ_OK
```

Verifier secret değerleri yazdırmaz.

## Database unavailable testi

Yalnız local process için geçici, geçersiz bir development URL kullanılır;
`.env.local` kalıcı olarak değiştirilmez ve gerçek key terminale yazılmaz.
Amaç:

- `/projects` generic unavailable state gösterir.
- `/projects/<published-slug>` generic project error boundary'ye gider.
- Supabase hata mesajı, tablo/policy detayı veya private kayıt varlığı görünmez.
- Aktif reader query hatasında sessiz mock fallback olmaz.

Test sonrasında process kapatılır ve normal `.env.local` ile yeniden başlatılır.

## Production guard

Aşağıdaki policy testi Production ortamında source değeri Supabase olsa dahi
resolver'ın mock döndürdüğünü doğrular:

```bash
node --experimental-strip-types --test   src/features/public/content/public-content.policy.test.mjs
```

Env'siz production build:

```bash
env   -u NEXT_PUBLIC_SUPABASE_URL   -u NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY   -u NEXT_PUBLIC_SITE_URL   -u SUPABASE_SERVICE_ROLE_KEY   npm run build
```

Production Supabase env eklenmez.

## Vercel Preview

- Feature branch push automatic Preview Deployment tetikler.
- Preview yalnız development Supabase project env değerlerini kullanabilir.
- `PUBLIC_CONTENT_SOURCE=supabase` yalnız Preview environment scope'unda doğrulanır.
- Production environment'a development URL/key eklenmez.
- Manuel `vercel --prod` kullanılmaz.

Preview'da `/projects`, published detail, hidden detail 404 ve unavailable
davranışı kontrollü biçimde gözlenir.

## Cleanup

Test için değiştirilen development kayıtları belgelenmiş başlangıç durumuna
Studio UI veya kontrollü SQL ile döndürülür.

- Destructive SQL yok.
- Hard delete yok.
- Production'a dokunulmaz.
- Test slug/state değişiklikleri handoff'ta secret içermeden kaydedilir.

## Sprint 07 çalıştırılmış kabul kaydı

2026-07-14 tarihinde development project üzerinde:

- Published/public/published_at dolu verification kaydı list/detail içinde okundu.
- Draft/private/published_at null development seed kaydı public read sınırının dışında kaldı.
- Hosted verifier `PUBLIC_PROJECT_HOSTED_READ_OK` sonucu verdi.
- Test kaydı hard delete edilmeden `archived + private` durumuna getirildi.
- Cleanup sonrası anonymous project sorgusu boş döndü.
- Gerçek URL/key/UUID bu belgeye veya Git'e eklenmedi.

## Cutover uyarısı

Bu doğrulama yalnız development/Preview project read kabulüdür. Production
source hâlâ mock'tur. Writings, journey, profile/about ve geniş Public database
cutover tamamlanmış sayılmaz.


## Integration Public Kabulü — S07_INTEGRATION_PUBLIC_ACCEPTANCE

Vercel Preview üzerinde archived project'in Public list/detail akışından gizlendiği doğrulandı.

Production source mock olarak korunmuştur ve Production Supabase cutover yapılmamıştır.
