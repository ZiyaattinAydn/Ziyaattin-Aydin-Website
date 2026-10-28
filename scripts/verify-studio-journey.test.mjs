import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const filename = "src/features/studio/journey/domain.ts";
const transpiled = ts.transpileModule(fs.readFileSync(filename,"utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const loadedModule = { exports: {} };
vm.runInThisContext("(function(module,exports){" + transpiled + "\n})", { filename })(
  loadedModule, loadedModule.exports
);
const { parseJourney, journeySlugFromTitle } = loadedModule.exports;
function form(fields = {}) {
  const data = new FormData();
  for (const [name, value] of Object.entries({
    title: "İlk staj", period_label: "2025",
    summary: "Deneyimim", content: "Öğrendiklerim", occurred_on: "2025-06-15",
    sort_order: "1", ...fields,
  })) data.set(name, value);
  return data;
}
test("Journey form parses valid private content", () => {
  const r = parseJourney(form());
  assert.equal(r.title, "İlk staj");
  assert.equal(r.slug, "ilk-staj");
  assert.equal(r.sort_order, 1);
  assert.equal(r.occurred_on, "2025-06-15");
});
test("Journey form defaults optional fields", () => {
  const r = parseJourney(form({ occurred_on: "", sort_order: "", period_label: "" }));
  assert.equal(r.occurred_on, null);
  assert.equal(r.sort_order, 0);
  assert.equal(r.period_label, null);
});
for (const [field, value] of [
  ["title",""],["title","x".repeat(161)],
  ["summary","x".repeat(801)],["content","x".repeat(20001)],
  ["period_label","x".repeat(101)],["occurred_on","2026-02-30"],
  ["occurred_on","2026-13-01"],["sort_order","4.5"],["sort_order","100001"],
]) {
  test("Rejects invalid " + field + " input " + String(value).slice(0,8), () => {
    assert.throws(() => parseJourney(form({ [field]: value })));
  });
}

test("Journey slug is generated from Turkish titles and stays within URL length", () => {
  assert.equal(journeySlugFromTitle("Her şey bir pinpon oyunuyla başladı"), "her-sey-bir-pinpon-oyunuyla-basladi");
  assert.equal(journeySlugFromTitle("İlk Hello World!"), "ilk-hello-world");
  assert.equal(journeySlugFromTitle("Şimdi / Çalışma -- Zamanı"), "simdi-calisma-zamani");
  assert.ok(journeySlugFromTitle("a".repeat(160)).length <= 105);
  assert.equal(journeySlugFromTitle("!!!"), "yolculuk");
});
test("Untrusted posted slugs cannot override the title-based slug or an existing URL", () => {
  const posted = form({ title: "Yeni Başlangıç", slug: "forged-address" });
  assert.equal(parseJourney(posted).slug, "yeni-baslangic");
  assert.equal(parseJourney(posted, "once-yayinlanmis-adres").slug, "once-yayinlanmis-adres");
  assert.throws(() => parseJourney(posted, "invalid/slug"));
});
test("The Studio form does not expose manual slug inputs and server actions preserve old URLs", () => {
  const formSource = fs.readFileSync("src/features/studio/journey/journey-form.tsx", "utf8");
  const actions = fs.readFileSync("src/features/studio/journey/actions.ts", "utf8");
  assert.ok(!formSource.includes('name="slug"'));
  assert.ok(formSource.includes("Bağlantı yeni kayıtlarda başlıktan otomatik oluşturulur"));
  assert.ok(actions.includes("parseJourney(form, current.slug)"));
  assert.ok(actions.includes('result.error?.code !== "23505"'));
  assert.ok(actions.includes('publish_state: "draft", visibility: "private"'));
  assert.ok(actions.includes('if (current.publish_state === "published")'));
});
