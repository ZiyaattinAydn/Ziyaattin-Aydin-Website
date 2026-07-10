# Public Publish Flow

Bu doküman Studio içinde hazırlanacak içeriklerin ileride public siteye nasıl güvenli biçimde taşınacağını public taraf açısından tarif eder. Bu sprintte database migration, Supabase bağlantısı, API route, CRUD, Auth, Storage veya gerçek publish implementasyonu yapılmaz.

Amaç; public sayfaların yalnız onaylı, public-safe ve kullanıcı tarafından doğrulanmış içerikleri göstermesi için gereken durumları ve UI davranışını netleştirmektir.

## Kapsam

Public taraf şu içerik tiplerini tüketmeye hazırlanır:

- `project`
- `writing`
- `journey item`
- `profile/about content`

Studio tarafı ileride bu içerikleri oluşturabilir, düzenleyebilir ve review/publish kararını yönetebilir. Public site ise yalnız public görünürlük ve onay kurallarına uygun alanları render eder.

## Yayın durumları

### 1. Content draft

İçerik Studio veya mock data içinde ilk kez hazırlanır.

Public kuralı:

- Production public listelerde varsayılan olarak görünmemelidir.
- Mock/dev aşamasında görünürse “mock içerik” veya “taslak” dili korunmalıdır.
- Gerçek başarı, gerçek müşteri işi, gerçek tarih veya canlı link iddiası gibi sunulmamalıdır.

### 2. Review required

İçerik public sayfaya çıkmadan önce kullanıcı kontrolü bekler.

Public kuralı:

- Metin, link, görsel, portre ve kişisel bilgi alanları ayrı ayrı incelenmelidir.
- Review tamamlanmadan gerçek link aktif anchor olarak render edilmez.
- Onay bekleyen içerik public listelerde görünürse kullanıcıyı yanıltmayacak küçük durum etiketi taşımalıdır.

### 3. Approved

İçerik public’e çıkmaya adaydır; kullanıcı metni ve public-safe alanları onaylamıştır.

Public kuralı:

- Approved durum tek başına production yayını anlamına gelmez.
- Publish zamanı, görünürlük ve bağlantı onayı ayrıca kontrol edilmelidir.
- `visibility = public` olmadan liste sayfalarında görünmemelidir.

### 4. Published

İçerik public site üzerinde yayınlanabilir kabul edilir.

Public kuralı:

- Liste ve detay sayfalarında gösterilecek ana durum budur.
- `publishedAt` veya benzeri yayın tarihi ileride database tarafından sağlanmalıdır.
- Aktif linkler yalnız onaylı ve gerçek URL ise gösterilmelidir.

### 5. Archived

İçerik geçmişte yayınlanmış olabilir ama artık ana listede öne çıkarılmayacaktır.

Public kuralı:

- Varsayılan listelerde gizlenebilir veya “arşiv” filtresiyle gösterilebilir.
- Detay sayfası kalacaksa arşiv etiketi görünür olmalıdır.
- Gerçek kaldırma/redirect kararı integration ve product kararı gerektirir.

### 6. Hidden / private

İçerik public site için uygun değildir veya kullanıcı tarafından gizlenmiştir.

Public kuralı:

- `visibility = private` olan kayıtlar public route içinde render edilmemelidir.
- Private Studio notları, gerçek loglar, gizli repo linkleri ve doğrulanmamış kişisel bilgiler public modele taşınmamalıdır.
- `unlisted` davranışı ayrıca ürün kararı gerektirir; varsayılan public listede görünmemelidir.

## Link approval

Link alanları şu prensiple ele alınır:

- `href` yoksa aktif `<a>` veya Next `Link` render edilmez.
- Linkin gerçek ve kullanıcı tarafından onaylı olduğu bilinmiyorsa `href` boş kalır.
- Demo, GitHub, dış kaynak, sosyal medya ve iletişim linkleri ayrı onay gerektirir.
- Linkin etiketi var ama URL yoksa public UI pasif durum gösterir: “Yakında”, “Doğrulama bekliyor”, “Aktif bağlantı yok”.
- Core sahipliğindeki global sosyal/contact linkleri bu akışa uyumlu kalmalıdır; Public branch gerçek sosyal/contact URL eklemez.

## Image / portrait approval

Görsel ve portreler metinden daha yüksek risklidir.

Public kuralı:

- Ana sayfadaki `home-hero.png` onaylı ana portre olarak korunur.
- Hakkımda portresi kullanıcı tarafından ayrıca doğrulanmadıkça `candidate` / “doğrulama bekliyor” olarak kalır.
- Yeni insan görseli, yapay portre veya kullanıcıya benzemeyen görsel eklenmez.
- Studio Storage ileride görsel sağlayacaksa public taraf yalnız `approved` görselleri final gibi sunmalıdır.

## Rollback / unpublish

Yayınlanmış içerik geri alınabilir olmalıdır.

Public taraf davranışı:

- `publishState` veya `publishFlowState` published dışına çekildiğinde içerik listeden düşmelidir.
- Detay route davranışı için karar seçenekleri:
  - `notFound()` ile kaldırmak,
  - arşiv etiketiyle göstermek,
  - ileride redirect mekanizması kullanmak.
- Bu sprintte gerçek rollback implementasyonu yapılmaz; karar yalnız dokümante edilir.

## Studio ilişkisi

Studio data model ileride draft, review ve publish kararlarını tutabilir. Public tarafın beklentisi şudur:

- Studio private alanları public tabloya direkt kopyalamaz.
- Public model yalnız seçilmiş, temizlenmiş ve onaylı alanları tüketir.
- Project, writing, journey item ve profile/about content kayıtları ortak `visibility`, `publishState`, `publishFlowState`, `sourceNote` ve approval notlarıyla uyumlu olur.
- Studio publish işlemi bir içerik seçme ve onaylama mekanizmasıdır; public site içinde gerçek CRUD yapılmaz.

## Public UI davranışı

Public UI küçük ve sakin durum etiketleri kullanır:

- Mock içerik
- Kullanıcı onayı bekliyor
- Yayın hazırlığı
- Yayında
- Arşiv

Bu etiketler debug paneli gibi büyük gösterilmez; ancak ziyaretçiye gerçek olmayan veya onay bekleyen içeriğin production iddiası taşımadığını anlatır.

## Sprint 05 database geçişi sınırı

Database geçişi için canonical workflow ve görünürlük ayrı tutulur:

- `publish_state`: `draft`, `review`, `approved`, `published`, `unpublished`, `archived`
- `visibility`: `public`, `hidden`, `private`

Anonymous public okuma yalnız `publish_state = published` ve `visibility = public` birleşiminde mümkündür. Link ve image/portrait approval bu iki koşuldan bağımsızdır. Ayrıntılar `PUBLIC_VISIBILITY_RULES.md`, `PUBLIC_QUERY_CONTRACT.md` ve `PUBLIC_APPROVAL_RULES.md` içindedir.
