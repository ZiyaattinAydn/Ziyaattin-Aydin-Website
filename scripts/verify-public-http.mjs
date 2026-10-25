import assert from "node:assert/strict";
const base = process.argv[2] ?? "http://localhost:3007";
const canonical = "https://ziyaattin-aydin-website.vercel.app";
const developerCopy =
  /Sprint 0[2347]|mock\/placeholder|publish flow|publish sözleşmesi|database-content|development-seed|Onay bekleyen profil|Palet 2/i;
for (const path of ["/", "/about", "/projects", "/writings", "/journey"]) {
  const r = await fetch(base + path);
  assert.equal(r.status, 200, path);
  const html = await r.text();
  const visible = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  assert.equal(
    (visible.match(/<h1\b/g) || []).length,
    1,
    path + " needs one main heading",
  );
  assert.ok(!developerCopy.test(visible), path + " contains developer copy");
  assert.ok(
    html.includes(
      'rel="canonical" href="' + canonical + (path === "/" ? "" : path) + '"',
    ),
    path + " canonical",
  );
  assert.ok(html.includes('property="og:image"'), path + " share image");
  assert.ok(html.includes('name="description"'), path + " description");
  assert.ok(
    !html.includes('src="/images/portraits/about-portrait.png"'),
    "candidate portrait must stay hidden",
  );
}
for (const path of [
  "/projects/orbit-dashboard",
  "/projects/next-ai-dashboard",
  "/projects/missing-public-project",
  "/writings/supabase-guvenlik-hazirlik-notlari",
]) {
  const r = await fetch(base + path, {
    headers: { "user-agent": "Googlebot" },
  });
  const html = await r.text();
  // Next may stream a 404 boundary after sending the public layout.
  assert.ok(
    r.status === 404 ||
      (html.includes('name="robots" content="noindex') &&
        html.includes("Sayfa bulunamadı")),
    path + " must be hidden",
  );
  assert.ok(
    !html.includes("Gerçek kişisel bilgi, bağlantı veya secret içermez."),
    path + " leaked seed content",
  );
}
const xml = await (await fetch(base + "/sitemap.xml")).text();
for (const path of ["/about", "/projects", "/writings", "/journey"])
  assert.ok(xml.includes(canonical + path));
assert.ok(
  !/\/studio|supabase-guvenlik-hazirlik-notlari|orbit-dashboard/.test(xml),
);
const robots = await (await fetch(base + "/robots.txt")).text();
assert.ok(robots.includes("Disallow: /studio"));
assert.ok(robots.includes("Sitemap: " + canonical + "/sitemap.xml"));
const login = await (await fetch(base + "/login")).text();
assert.ok(login.includes('name="robots" content="noindex, nofollow"'));
const image = await fetch(base + "/images/social-card.png");
assert.equal(image.status, 200);
assert.ok(image.headers.get("content-type")?.includes("image/png"));
console.log(
  "PUBLIC_HTTP_OK: 5 pages, metadata/canonicals, hidden fixtures, sitemap/robots and share image",
);
