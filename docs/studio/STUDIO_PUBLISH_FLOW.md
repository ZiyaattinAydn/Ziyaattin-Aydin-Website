# Studio Publish Flow Plan

> Bu belge Sprint 04 publish workflow planıdır. Gerçek publish, upload, delete, edit, API route, migration veya public içerik üretimi implementasyonu içermez.

## Amaç

Studio içinde oluşan private proje, not ve dosya kayıtlarının public siteye yalnız kontrollü, onaylı ve public-safe hâle getirildikten sonra taşınması için akış sözleşmesini tanımlamak.

Bu doküman Studio tarafının bakış açısını anlatır ve public tarafın içerik sözleşmesiyle uyumlu olmalıdır. Public contract referansı: `docs/content/PUBLIC_CONTENT_MODEL.md`.

## Temel sınır

- Studio kayıtları private kaynaktır.
- Public site private Studio tablolarını doğrudan okumaz.
- Public'e çıkacak alanlar ayrı public-safe içerik modeline dönüştürülür.
- Publish queue, owner-only kalır.
- Gerçek yayın aksiyonu bu sprintte yoktur.

## Durumlar

| Durum | Anlam | Studio aksiyonu | Public etkisi |
| --- | --- | --- | --- |
| `draft` | Private hazırlık kaydı | Owner içerik üzerinde çalışır | Public etkisi yok |
| `review` | Yayına aday ama kontrol bekliyor | Başlık, slug, özet, link, görsel ve private alanlar incelenir | Public etkisi yok |
| `approved` | Public-safe alanlar onaylandı | Yayına hazır kayıt işaretlenir | Hâlâ otomatik yayın olmak zorunda değil |
| `published` | Public hedefe aktarılmış kayıt | Public route/content kaynağı güncellenir | Public görünür olabilir |
| `archived` | Studio içinde arşivlendi | Çalışma kaydı saklanır ama aktif listeden düşer | Public etkisi ayrı karar ister |
| `unpublished` | Public görünürlük kaldırıldı | Public-safe kayıt kapatılır veya kaldırılır | Public route artık göstermemeli |
| `rollback` | Önceki public sürüme geri dönme | Son bilinen güvenli sürüm seçilir | Public içerik önceki hâle döner |

## Önerilen Studio akışı

1. **Private draft**
   - Proje, not veya dosya Studio içinde private kalır.
   - `visibility` varsayılan olarak owner-only/private olur.
   - Gerçek CRUD bu sprintte yoktur.

2. **Publish candidate**
   - Owner, içeriği public aday olarak işaretlemeyi seçer.
   - Bu adım gerçek butonla bağlı değildir; mock `publishState` alanıyla temsil edilir.
   - Private notlar, internal next action veya çalışma yorumları public'e taşınmaz.

3. **Review**
   - Public başlık, slug, excerpt, kapak görseli, linkler ve route hedefi kontrol edilir.
   - Link approval ve image approval bu aşamada gereklidir.
   - Kullanıcı onayı olmadan Hakkımda portresi, sosyal link veya iletişim bilgisi aktif edilmez.

4. **Approved**
   - Public-safe alanlar onaylanır.
   - Publish queue kaydı owner-only kalır.
   - Public'e aktarılacak hedef model netleşmeden deploy/publish yapılmaz.

5. **Published**
   - Gelecek sprintte seçilecek teknik yaklaşıma göre public-safe veri kaynağı güncellenir.
   - Public route, private Studio source kaydını değil public-safe çıktıyı okur.

6. **Unpublish / archive / rollback**
   - Unpublish public görünürlüğü kaldırır.
   - Archive Studio çalışma kaydını aktif listeden düşürür.
   - Rollback önceki public-safe sürüme dönmeyi ifade eder.
   - Bu aksiyonların tamamı gerçek implementasyon öncesi audit ve recovery kararı ister.

## Link approval

Public'e çıkacak her link için:

- Hedef URL kullanıcı tarafından onaylanmalı.
- Boş, sahte veya placeholder sosyal link public'e çıkmamalı.
- Dış linkler için label, hedef ve güvenlik davranışı ayrı kontrol edilmeli.
- Kişisel iletişim linkleri kullanıcı onayı olmadan aktif edilmemeli.

## Image approval

Public'e çıkacak her görsel için:

- Kullanıcının onaylamadığı portre final kabul edilmemeli.
- Ana sayfanın onaylı portresi izinsiz değiştirilmemeli.
- Hakkımda portresi ayrıca doğrulanmadan final kabul edilmemeli.
- Private Storage görseli otomatik public asset hâline getirilmemeli.
- Public görsel için alt text, kaynak ve kullanım amacı kontrol edilmeli.

## Public contract uyumu

Studio publish flow, public tarafla şu sınırlarda uyumlu olmalıdır:

- Public route yalnız public-safe title, summary, slug, image, tags, date ve body gibi alanları görmelidir.
- Private `owner_id`, `next_action`, internal review note, source file path, draft comment veya task bilgisi public modele taşınmamalıdır.
- Public içerik modeli değişirse Studio publish queue mapping'i ayrıca güncellenmelidir.

## UI karşılığı

Mevcut Studio UI'da:

- Publish, edit, upload, delete ve dosya yönetimi butonları disabled kalır.
- Kartlar mock `visibility` ve `publishState` bilgisi gösterir.
- `/studio/projects` public publish ilişkisini mock olarak anlatır.
- `/studio/notes` nottan yazıya dönüşme ihtimalini mock olarak anlatır.
- `/studio/files` Storage ve public/private asset ayrımının sonraki fazda olduğunu belirtir.

## Bu sprintte yapılmayanlar

- Gerçek publish butonu bağlanmadı.
- Public içerik tablosu veya route üretimi yapılmadı.
- Upload, image approval veya link approval UI akışı uygulanmadı.
- Migration, API route, server action veya Supabase client eklenmedi.
