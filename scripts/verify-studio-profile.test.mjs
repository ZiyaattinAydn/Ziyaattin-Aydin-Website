import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const filename = "src/features/studio/profile/domain.ts";
const source = fs.readFileSync(filename, "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const loadedModule = { exports: {} };
vm.runInThisContext("(function(module,exports){" + js + "\n})", { filename })(
  loadedModule, loadedModule.exports
);
const { parseProfile, safeProfileLink } = loadedModule.exports;
const make = (fields = {}) => {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    headline: "Yazılım geliştirici", description: "Kısa biyografi",
    email: "person@example.com", github_url: "https://github.com/example",
    linkedin_url: "https://www.linkedin.com/in/example", ...fields
  })) data.set(key, value);
  return data;
};
test("Personal profile fields accept verified links and email", () => {
  const r = parseProfile(make());
  assert.equal(r.headline, "Yazılım geliştirici");
  assert.equal(r.github_url, "https://github.com/example");
});
test("Blank optional links remain private placeholders", () => {
  const r = parseProfile(make({ email: "", github_url: "", linkedin_url: "" }));
  assert.equal(r.email, null);
  assert.equal(r.linkedin_url, null);
});
for (const [field, value] of [
  ["headline","x".repeat(201)],["description","x".repeat(3001)],
  ["email","fake-email"],["github_url","https://fakegithub.com/person"],
  ["github_url","http://github.com/example"],["github_url","https://github.com/login?next=bad"],
  ["linkedin_url","https://evil.example/in/example"],["linkedin_url","https://linkedin.com/company/acme"],
]) {
  test("Reject invalid " + field + ": " + String(value).slice(0,10), () => {
    assert.throws(() => parseProfile(make({ [field]: value })));
  });
}
test("Public URL sanitizer drops unknown hosts and secrets", () => {
  assert.equal(safeProfileLink("https://github.com/example", "github"), "https://github.com/example");
  assert.equal(safeProfileLink("https://github.com@example.net/person", "github"), null);
  assert.equal(safeProfileLink("https://www.linkedin.com/in/example", "linkedin"), "https://www.linkedin.com/in/example");
  assert.equal(safeProfileLink("javascript:alert(1)", "github"), null);
});
