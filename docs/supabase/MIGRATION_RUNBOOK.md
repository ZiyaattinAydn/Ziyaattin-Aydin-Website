# Supabase Migration and Rollback Runbook

Durum: **Uygulama öncesi runbook.** Bu sprintte SQL çalıştırılmaz.

## Ana ilke

Migration işlemi tek seferde toplu ve kontrolsüz çalıştırılmaz. Her dosya review edilir, non-production'da uygulanır, doğrulanır ve sonuç kaydı tutulur. Production SQL yalnız Preview kabulü ve kullanıcı onayı sonrası çalıştırılır.

## Ön koşullar

- Sprint 05 Core mimari belgeleri review edilmiş olmalı.
- Studio hattının hazırladığı SQL dosyaları branch/commit bazında sabitlenmiş olmalı.
- Sprint 06 karar kapısındaki blocker cevaplar tamamlanmış olmalı.
- Supabase project region ve environment ayrımı onaylanmış olmalı.
- Gerçek key'ler repository dışında tanımlanmış olmalı.
- Backup/rollback yaklaşımı seçilmiş olmalı.

## Uygulama sırası

### 1. Supabase project oluşturma

- Önce non-production project oluşturulur.
- Production project ayrı oluşturulur; migration onayına kadar boş tutulabilir.
- Region kullanıcı onayıyla seçilir.
- Project ref, URL veya key dokümana gerçek değer olarak commit edilmez.

### 2. Project URL ve key'lerin alınması

- Public URL ve publishable/anon key alınır.
- Secret/service role yalnız gerekli server admin use-case varsa alınır.
- Key'ler chat, issue, screenshot veya Git history içine konmaz.

### 3. Environment değerlerinin girilmesi

- Local: `.env.local`
- Preview: Vercel Preview scope
- Production: Vercel Production scope
- Production secret Preview'a kopyalanmaz.
- Değerler girildikten sonra secret içermeyen presence kontrolü yapılır.

### 4. SQL dosyalarının review edilmesi

Her SQL dosyası için:

- Dosya adı ve çalışma sırası
- Transaction sınırı
- Idempotency beklentisi
- Destructive statement kontrolü
- `security definer` ve sabit `search_path` kontrolü
- RLS açık mı?
- Anonymous write var mı?
- Owner bootstrap güvenli mi?
- Storage policy kapsamı
- Rollback etkisi

review edilir.

### 5. Backup ve rollback hazırlığı

- Non-production için veri kaybı kabulü açıkça yazılır.
- Production için planın desteklediği backup/PITR veya `pg_dump` yaklaşımı doğrulanır.
- Rollback dosyası destructive ise kullanıcı onayı olmadan çalıştırılmaz.
- Backup tamamlanmadan production migration başlamaz.

### 6. Initial schema SQL

- İlk olarak tablo, type, constraint ve indexler uygulanır.
- SQL Editor sonucu kaydedilir.
- Beklenen tablo/constraint listesi kontrol edilir.
- Hata varsa sonraki adıma geçilmez.

### 7. Function / trigger SQL

- `updated_at`, publish timestamp ve owner helper işlevleri uygulanır.
- `security definer` varsa `search_path` ve privilege kontrol edilir.
- Her yeni Auth kullanıcısını owner yapan trigger kabul edilmez.

### 8. RLS policy SQL

- Tüm Studio/data tablolarında RLS açık olmalıdır.
- Anonymous yalnız public + published içerik okuyabilmelidir.
- Anonymous write kapalıdır.
- Owner `auth.uid()` tabanlı policy ile yönetilir.
- Service role normal CRUD testinde kullanılmaz.

### 9. Storage SQL

- `public-assets` ve `private-files` bucket/policy paketi review edilir.
- Public read yalnız tasarlanan bucket/path için açılır.
- Private bucket anonymous erişime kapalıdır.
- Upload/update/delete owner policy ile korunur.

### 10. Opsiyonel development seed

- Yalnız non-production'da çalıştırılır.
- Gerçek owner UUID/secret içermez.
- Placeholder değiştirilmeden çalıştırılamayacak güvenli guard bulunmalıdır.
- Production'da seed çalıştırılmaz.

### 11. SQL Editor sonuçlarının kaydedilmesi

Her dosya için aşağıdaki kayıt tutulur:

```text
Project environment: non-production | production
Migration file:
Git commit:
Executed by:
Execution time (UTC):
Result: success | failed | partially applied
Rows/objects affected:
Warnings:
Verification queries:
Rollback required: yes | no
```

Secret, access token veya tam connection string kayda eklenmez.

### 12. Local test

- Env presence
- Auth login/session
- Owner/non-owner guard
- Anonymous public read
- Anonymous/private write denial
- Studio CRUD
- Storage upload/read/delete
- Publish/unpublish görünürlüğü

kontrol edilir.

### 13. Preview deployment testi

- Preview deployment non-production Supabase project'e bağlanır.
- Public ve Studio route'ları test edilir.
- Auth callback URL'leri doğrulanır.
- RLS negatif testleri yapılır.
- Production verisi kullanılmadığı doğrulanır.

### 14. Production öncesi kullanıcı onayı

Aşağıdakiler kullanıcı tarafından onaylanmadan production migration yapılmaz:

- SQL commit/hash
- Backup durumu
- Rollback riski
- Region ve project
- Auth/MFA modeli
- Owner hesabı/UUID bootstrap
- Storage limitleri
- Preview test sonucu

## Başarısız adımda durma noktası

Her SQL dosyası bağımsız stop point'tir.

- SQL hata verdiyse sonraki dosya çalıştırılmaz.
- Transaction rollback olduysa hata düzeltilip review tekrarlanır.
- Partial apply ihtimali varsa schema state doğrulanmadan yeniden çalıştırılmaz.
- Production'da doğaçlama SQL düzeltmesi yapılmaz; düzeltme yeni migration dosyası olarak Git'e eklenir.

## Rollback kullanım koşulları

Rollback yalnız şu durumlarda değerlendirilir:

- Migration kullanıcı verisini veya erişimi ciddi biçimde bozduysa
- Güvenlik policy'si yetkisiz erişim açtıysa
- İleri migration ile güvenli düzeltme yapılamıyorsa
- Backup doğrulandıysa
- Kullanıcı açık onay verdiyse

Rollback'in veri silmesi muhtemelse önce restore/forward-fix seçeneği değerlendirilir.

## Production yasakları

- Deneysel SQL çalıştırma
- Dashboard'da Git'e kaydedilmemiş manuel schema değişikliği
- RLS kapatarak geçici çözüm
- Service role ile policy testini bypass etme
- Backup olmadan destructive rollback
- Preview'da test edilmemiş migration

## Schema değişikliğinin Git'e kaydı

- Her değişiklik yeni timestamp'li migration dosyasıdır.
- Uygulanmış migration dosyası sonradan sessizce değiştirilmez.
- Düzeltme yeni migration olarak eklenir.
- SQL çalışma sonucu handoff/deployment kaydında commit hash ile ilişkilendirilir.
- Rollback dosyası rutin migration değil acil durum aracı olarak işaretlenir.
