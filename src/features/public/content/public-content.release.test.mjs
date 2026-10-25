import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createSupabasePublicContentRepository } from "./supabase-repository.ts";
import { emptyPublicContentRepository } from "./empty-repository.ts";

const row = (overrides = {}) => ({
  id: "61000000-0000-4000-8000-000000000002",
  slug: "published-writing",
  title: "Published writing",
  excerpt: "Public excerpt",
  content: "A plain paragraph.",
  category: "Notlar",
  tags: [],
  reading_time: 2,
  status: "active",
  is_featured: true,
  visibility: "public",
  publish_state: "published",
  published_at: "2026-10-25T12:00:00Z",
  updated_at: "2026-10-25T12:00:00Z",
  ...overrides,
});
const repository = (data) =>
  createSupabasePublicContentRepository({
    async execute() {
      return { data, error: null };
    },
  });
test("empty configuration has no portfolio fixtures or invented biography", async () => {
  const r = emptyPublicContentRepository;
  for (const op of ["listProjects", "listWritings", "listJourneyItems"])
    assert.deepEqual(await r[op](), []);
  assert.equal(await r.getProjectBySlug("orbit-dashboard"), null);
  assert.equal(
    await r.getWritingBySlug("supabase-guvenlik-hazirlik-notlari"),
    null,
  );
  const profile = await r.getProfile();
  assert.equal(profile.displayName, "Ziyaattin Aydın");
  assert.equal(profile.portrait, null);
  assert.deepEqual(profile.focusAreas, []);
});
test("published development seed is excluded from every writing read", async () => {
  for (const patch of [
    { tags: ["development-seed"] },
    { id: "51000000-0000-4000-8000-000000000002" },
  ]) {
    const r = repository([row(patch)]);
    assert.deepEqual(await r.listWritings(), []);
    assert.deepEqual(await r.listFeaturedWritings(3), []);
    assert.deepEqual(await r.listRelatedWritings(["published-writing"]), []);
    assert.equal(await r.getWritingBySlug("published-writing"), null);
  }
});
test("legacy seed project is never a public portfolio entry", async () => {
  const r = repository([
    {
      ...row(),
      id: "51000000-0000-4000-8000-000000000001",
      summary: "Fixture",
      progress: 0,
      github_url: null,
      demo_url: null,
      link_approval_state: "not_required",
    },
  ]);
  assert.deepEqual(await r.listProjects(), []);
  assert.deepEqual(await r.listFeaturedProjects(3), []);
  assert.equal(await r.getProjectBySlug("published-writing"), null);
});
for (const patch of [
  { visibility: "private" },
  { visibility: "hidden" },
  { publish_state: "draft" },
  { publish_state: "review" },
  { publish_state: "archived" },
  { published_at: null },
]) {
  test("writing reads reject " + JSON.stringify(patch), async () => {
    const r = repository([row(patch)]);
    assert.deepEqual(await r.listWritings(), []);
    assert.equal(await r.getWritingBySlug("published-writing"), null);
  });
}
test("approved writing text is rendered as text without interpreting markup", async () => {
  const r = repository([row({ content: '<script>alert("x")</script>' })]);
  const article = await r.getWritingBySlug("published-writing");
  assert.equal(
    article.sections[0].paragraphs[0],
    '<script>alert("x")</script>',
  );
  assert.equal(article.sections[0].id, "content");
});
test("journey reads reject drafts even if a reader returns them", async () => {
  const r = repository([
    {
      ...row(),
      summary: "Summary",
      period_label: "2026",
      occurred_on: null,
      sort_order: 0,
      publish_state: "draft",
    },
  ]);
  assert.deepEqual(await r.listJourneyItems(), []);
});
test("public reader creates an anonymous client with no session persistence", async () => {
  let options, fetchInit;
  const builder = {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    not() {
      return this;
    },
    in() {
      return this;
    },
    order() {
      return this;
    },
    limit() {
      return this;
    },
    async maybeSingle() {
      return { data: null, error: null };
    },
    then(resolve) {
      resolve({ data: [], error: null });
    },
  };
  const source = fs.readFileSync(
    "src/features/public/content/supabase-server-query-reader.ts",
    "utf8",
  );
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const loaded = { exports: {} };
  const injected = (name) => {
    if (name === "server-only") return {};
    if (name === "@supabase/supabase-js")
      return {
        createClient(_url, _key, config) {
          options = config;
          return {
            from() {
              return builder;
            },
          };
        },
      };
    if (name === "@/lib/supabase/environment")
      return {
        getSupabasePublicEnvironment() {
          return {
            url: "https://example.supabase.co",
            publishableKey: "test-public-key",
          };
        },
      };
    throw new Error("Unexpected dependency " + name);
  };
  vm.runInNewContext(
    "(function(require,module,exports,fetch){" + output + "})",
    {},
  )(injected, loaded, loaded.exports, async (_input, init) => {
    fetchInit = init;
    return { ok: true };
  });
  await loaded.exports
    .createSupabaseServerPublicQueryReader()
    .execute({
      table: "projects",
      columns: ["id"],
      filters: [],
      result: "many",
    });
  assert.equal(options.auth.persistSession, false);
  assert.equal(options.auth.autoRefreshToken, false);
  assert.equal(options.auth.detectSessionInUrl, false);
  assert.equal("cookies" in options, false);
  await options.global.fetch("https://example.supabase.co", {});
  assert.equal(fetchInit.cache, "no-store");
  assert.ok(!source.includes("next/headers"));
  assert.ok(!source.includes("createServerSupabaseClient"));
});
