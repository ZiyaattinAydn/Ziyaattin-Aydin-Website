import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const filename = "src/features/studio/journey/domain.ts";
const transpiled = ts.transpileModule(fs.readFileSync(filename,"utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const module = { exports: {} };
vm.runInThisContext("(function(module,exports){" + transpiled + "\n})", { filename })(
  module, module.exports
);
const { parseJourney } = module.exports;
function form(fields = {}) {
  const data = new FormData();
  for (const [name, value] of Object.entries({
    title: "İlk staj", slug: "ilk-staj", period_label: "2025",
    summary: "Deneyimim", content: "Öğrendiklerim", occurred_on: "2025-06-15",
    sort_order: "1", ...fields,
  })) data.set(name, value);
  return data;
}
test("Journey form parses valid private content", () => {
  const r = parseJourney(form());
  assert.equal(r.title, "İlk staj");
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
  ["title",""],["title","x".repeat(161)],["slug","HELLO"],
  ["slug","a/../b"],["slug","hello--world"],["slug","x".repeat(121)],
  ["summary","x".repeat(801)],["content","x".repeat(20001)],
  ["period_label","x".repeat(101)],["occurred_on","2026-02-30"],
  ["occurred_on","2026-13-01"],["sort_order","4.5"],["sort_order","100001"],
]) {
  test("Rejects invalid " + field + " input " + String(value).slice(0,8), () => {
    assert.throws(() => parseJourney(form({ [field]: value })));
  });
}
