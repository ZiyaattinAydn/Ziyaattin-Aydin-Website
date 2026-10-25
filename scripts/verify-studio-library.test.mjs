import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
const native = createRequire(import.meta.url);
function load(file, mocks = {}, cache = new Map()) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const m = { exports: {} };
  cache.set(file, m);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const req = (name) => {
    if (name in mocks) return mocks[name];
    if (name === "server-only") return {};
    if (name.startsWith(".") || name.startsWith("@/")) {
      const base = name.startsWith("@/")
        ? path.resolve("src", name.slice(2))
        : path.resolve(path.dirname(file), name);
      return load(base + ".ts", mocks, cache);
    }
    return native(name);
  };
  vm.runInThisContext("(function(require,module,exports){" + code + "\n})", {
    filename: file,
  })(req, m, m.exports);
  return m.exports;
}
const d = load("src/features/studio/library/domain.ts");
const image = load("src/lib/public-image.ts");
const id = "40000000-0000-4000-8000-000000000001",
  owner = "10000000-0000-4000-8000-000000000001";
function form(values = {}) {
  const f = new FormData();
  for (const [k, v] of Object.entries({
    title: "Not",
    content: "Text",
    version: "v1",
    ...values,
  }))
    f.set(k, v);
  return f;
}
test("notes validate bounds, sanitize tags, and reject forged project IDs", () => {
  const n = d.parseNote(form({ tags: "a, b, a", category: "  Fikir  " }));
  assert.deepEqual(n.tags, ["a", "b"]);
  assert.equal(n.category, "Fikir");
  assert.equal(n.project_id, null);
  for (const v of [
    { title: " " },
    { title: "x".repeat(201) },
    { content: "x".repeat(100001) },
    { projectId: "../other" },
    { tags: Array.from({ length: 21 }, (_, i) => "t" + i).join(",") },
  ])
    assert.throws(() => d.parseNote(form(v)));
});
test("Turkish note search combines project, category, tag, archive and sort filters without mutation", () => {
  const rows = [
    {
      id: "a",
      title: "İş",
      content: "Plan",
      category: "Fikir",
      tags: ["web"],
      project_id: "p",
      status: "active",
      created_at: "2026-01-01",
      updated_at: "2026-02-02",
    },
    {
      id: "b",
      title: "Başka",
      content: "Plan",
      tags: [],
      project_id: null,
      status: "active",
      created_at: "2026-02-01",
      updated_at: "2026-02-03",
    },
    {
      id: "c",
      title: "Arşiv",
      content: "",
      tags: [],
      status: "archived",
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    },
  ];
  assert.deepEqual(
    d
      .filterNotes(rows, {
        q: "iş",
        project: "p",
        category: "Fikir",
        tag: "web",
      })
      .map((n) => n.id),
    ["a"],
  );
  assert.deepEqual(
    d.filterNotes(rows, { sort: "title" }).map((n) => n.id),
    ["b", "a"],
  );
  assert.deepEqual(
    d.filterNotes(rows, { status: "archived" }).map((n) => n.id),
    ["c"],
  );
  assert.equal(rows[0].id, "a");
});
test("uploads reject mismatched extensions, active content, invalid names and size limits", () => {
  d.validateUpload("note.md", "text/markdown", 20);
  d.validateUpload("photo.png", "image/png", 10 * 1024 * 1024, true);
  for (const args of [
    ["a.svg", "image/svg+xml", 20],
    ["a.png", "text/plain", 10],
    ["../a.pdf", "application/pdf", 10],
    ["a.pdf", "application/pdf", 0],
    ["a.pdf", "application/pdf", 25 * 1024 * 1024 + 1],
    ["a.pdf", "application/pdf", 20, true],
    ["a.png", "image/png", 10 * 1024 * 1024 + 1, true],
  ])
    assert.throws(() => d.validateUpload(...args));
});
test("file signatures distinguish renamed executables/HTML from supported formats", () => {
  const bytes = (s) => new TextEncoder().encode(s);
  assert.equal(
    d.matchesSignature(bytes("%PDF-1.7\n"), "application/pdf"),
    true,
  );
  assert.equal(
    d.matchesSignature(bytes("<script>alert(1)</script>"), "application/pdf"),
    false,
  );
  assert.equal(d.matchesSignature(bytes("MZ executable"), "image/png"), false);
  assert.equal(
    d.matchesSignature(
      Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]),
      "image/png",
    ),
    true,
  );
  assert.equal(d.matchesSignature(bytes("Not metni"), "text/markdown"), true);
  assert.equal(
    d.matchesSignature(Uint8Array.from([255, 254, 0]), "text/plain"),
    false,
  );
});
test("public images reject private, signed, external and traversal URLs", () => {
  const origin = "https://example.supabase.co";
  const good =
    origin + "/storage/v1/object/public/public-assets/" + owner + "/cover.png";
  assert.equal(image.publicImageUrl(good, origin), good);
  assert.equal(
    image.publicImageUrl("/images/portraits/home.png"),
    "/images/portraits/home.png",
  );
  for (const url of [
    origin + "/storage/v1/object/sign/private-files/a.png?token=secret",
    origin + "/storage/v1/object/public/private-files/a.png",
    "https://attacker.example/a.png",
    good + "?token=secret",
    "/studio/files/x/content",
    "//attacker.example/a.png",
    "/images/../secret.png",
  ])
    assert.equal(image.publicImageUrl(url, origin), null);
});
function harness({
  authorized = true,
  writeResponse = { data: { id }, error: null },
  fileOverride = {},
  downloadError = false,
  bytes = new TextEncoder().encode("%PDF-1.7\n"),
  removeError = false,
} = {}) {
  const calls = [];
  const file = {
    id,
    storage_bucket: "private-files",
    storage_path: owner + "/file.pdf",
    mime_type: "application/pdf",
    size_bytes: bytes.length,
    status: "active",
    upload_status: "pending",
    ...fileOverride,
  };
  const builder = new Proxy(
    {},
    {
      get(_t, k) {
        if (k === "then") return (resolve) => resolve(writeResponse);
        return (...args) => {
          calls.push([k, ...args]);
          return builder;
        };
      },
    },
  );
  const db = {
    from: (t) => {
      calls.push(["from", t]);
      return builder;
    },
    storage: {
      from: (bucket) => ({
        download: async (p) => {
          calls.push(["download", bucket, p]);
          return downloadError
            ? { error: {}, data: null }
            : { error: null, data: new Blob([bytes]) };
        },
        remove: async (p) => {
          calls.push(["remove", bucket, p]);
          return { error: removeError ? {} : null };
        },
        getPublicUrl: (p) => ({
          data: {
            publicUrl:
              "https://example.supabase.co/storage/v1/object/public/" +
              bucket +
              "/" +
              p,
          },
        }),
        info: async () => ({ error: null }),
      }),
    },
  };
  const ctx = async () => {
    if (!authorized) throw new Error("denied");
    return { db, owner };
  };
  const mocks = {
    "./server": {
      libraryContext: ctx,
      ownedFile: async () => ({ ...(await ctx()), file }),
      checkProject: async () => {},
    },
    "next/cache": { revalidatePath: (p) => calls.push(["revalidate", p]) },
    "next/navigation": {
      redirect: (p) => {
        throw new Error("REDIRECT " + p);
      },
    },
  };
  return {
    files: load("src/features/studio/library/file-actions.ts", mocks),
    notes: load("src/features/studio/library/note-actions.ts", mocks),
    review: load("src/features/studio/library/publication-actions.ts", mocks),
    calls,
    file,
    db,
  };
}
test("all library writes fail closed without active owner and AAL2 context", async () => {
  const h = harness({ authorized: false });
  const responses = [
    await h.notes.saveNote(null, {}, form()),
    await h.notes.archiveNote(id, {}, form({ confirmation: "archive" })),
    await h.files.prepareUpload({
      name: "a.pdf",
      type: "application/pdf",
      size: 10,
      projectId: null,
    }),
    await h.files.finishUpload(id),
    await h.files.updateFile(id, form()),
    await h.review.approvePublicationMedia(
      "projects",
      id,
      {},
      form({ confirmation: "approve" }),
    ),
  ];
  for (const r of responses) assert.ok(r.ok === false || r.status === "error");
  assert.equal(h.calls.length, 0);
});
test("note create ignores forged publication/owner fields and update uses version and owner predicates", async () => {
  const h = harness();
  await assert.rejects(
    h.notes.saveNote(
      null,
      {},
      form({
        owner_id: "forged",
        visibility: "public",
        publish_state: "published",
      }),
    ),
    /REDIRECT/,
  );
  const payload = h.calls.find((c) => c[0] === "insert")[1];
  assert.equal(payload.owner_id, owner);
  assert.equal(payload.visibility, "private");
  assert.equal(payload.publish_state, "draft");
  assert.equal(payload.publish_candidate, false);
  await assert.rejects(h.notes.saveNote(id, {}, form()), /REDIRECT/);
  assert.ok(
    h.calls.some(
      (c) => c[0] === "eq" && c[1] === "updated_at" && c[2] === "v1",
    ),
  );
  assert.ok(
    h.calls.some((c) => c[0] === "eq" && c[1] === "owner_id" && c[2] === owner),
  );
});
test("stale or failed note writes never report success or delete content", async () => {
  for (const response of [
    { data: null, error: null },
    { data: null, error: { message: "private details" } },
  ]) {
    const h = harness({ writeResponse: response });
    assert.equal((await h.notes.saveNote(id, {}, form())).status, "error");
    assert.equal(
      (await h.notes.archiveNote(id, {}, form({ confirmation: "archive" })))
        .status,
      "error",
    );
    assert.ok(!h.calls.some((c) => c[0] === "delete"));
  }
});
test("private upload reserves a unique owner-scoped pending record; public image requires explicit consent", async () => {
  const h = harness();
  const r = await h.files.prepareUpload({
    name: "a.pdf",
    type: "application/pdf",
    size: 10,
    projectId: null,
  });
  assert.equal(r.ok, true);
  assert.equal(r.bucket, "private-files");
  assert.ok(r.path.startsWith(owner + "/"));
  const p = h.calls.find((c) => c[0] === "insert")[1];
  assert.equal(p.visibility, "private");
  assert.equal(p.upload_status, "pending");
  const denied = await h.files.prepareUpload({
    name: "a.png",
    type: "image/png",
    size: 10,
    projectId: null,
    image: true,
  });
  assert.equal(denied.ok, false);
});
test("upload finalization verifies Storage bytes before publishing metadata and can safely retry", async () => {
  const h = harness();
  assert.equal((await h.files.finishUpload(id)).ok, true);
  assert.ok(
    h.calls.findIndex((c) => c[0] === "download") <
      h.calls.findIndex((c) => c[0] === "update"),
  );
  assert.equal(
    h.calls.find((c) => c[0] === "update")[1].upload_status,
    "uploaded",
  );
  const missing = harness({ downloadError: true });
  assert.equal((await missing.files.finishUpload(id)).ok, false);
  assert.ok(!missing.calls.some((c) => c[0] === "update"));
  assert.ok(!missing.calls.some((c) => c[0] === "remove"));
  const complete = harness({ fileOverride: { upload_status: "uploaded" } });
  assert.equal((await complete.files.finishUpload(id)).ok, true);
  assert.ok(!complete.calls.some((c) => c[0] === "download"));
});
test("invalid new upload is compensated, but cleanup failure retains pending metadata for recovery", async () => {
  const invalid = new TextEncoder().encode("<html>bad</html>");
  const h = harness({ bytes: invalid });
  assert.equal((await h.files.finishUpload(id)).ok, false);
  assert.ok(h.calls.some((c) => c[0] === "remove"));
  assert.equal(
    h.calls.find((c) => c[0] === "update")[1].upload_status,
    "failed",
  );
  const failed = harness({ bytes: invalid, removeError: true });
  assert.equal((await failed.files.finishUpload(id)).ok, false);
  assert.ok(!failed.calls.some((c) => c[0] === "update"));
});
test("file archive requires confirmation and protects content; project unlink is allowed", async () => {
  const h = harness();
  assert.equal(
    (await h.files.updateFile(id, form({ archive: "yes" }))).ok,
    false,
  );
  assert.equal(h.calls.length, 0);
  assert.equal(
    (
      await h.files.updateFile(
        id,
        form({ archive: "yes", confirmation: "archive" }),
      )
    ).ok,
    true,
  );
  assert.equal(h.calls.find((c) => c[0] === "update")[1].status, "archived");
  assert.ok(!h.calls.some((c) => c[0] === "remove" || c[0] === "delete"));
  const unlink = harness();
  await unlink.files.updateFile(id, form({ projectId: "" }));
  assert.equal(unlink.calls.find((c) => c[0] === "update")[1].project_id, null);
});
test("private download route denies unauthorized requests and always sends no-store", async () => {
  const route = load(
    "src/app/(studio)/studio/files/[fileId]/content/route.ts",
    {
      "@/features/studio/library/server": {
        ownedFile: async () => {
          throw new Error("denied");
        },
      },
    },
  );
  const r = await route.GET(
    { nextUrl: new URL("https://site/studio/files/" + id + "/content") },
    { params: Promise.resolve({ fileId: id }) },
  );
  assert.equal(r.status, 403);
  assert.match(r.headers.get("Cache-Control"), /no-store/);
  assert.match(r.headers.get("X-Robots-Tag"), /noindex/);
});
test("private preview renders text as text, forces office downloads, and emits safe disposition", async () => {
  for (const [type, download, expected] of [
    ["text/markdown", false, "inline"],
    ["application/msword", false, "attachment"],
    ["application/pdf", true, "attachment"],
  ]) {
    const h = harness({
      fileOverride: {
        upload_status: "uploaded",
        mime_type: type,
        original_name: "Türkçe belge.pdf",
      },
    });
    const route = load(
      "src/app/(studio)/studio/files/[fileId]/content/route.ts",
      {
        "@/features/studio/library/server": {
          ownedFile: async () => ({ db: h.db, file: h.file }),
        },
      },
    );
    const r = await route.GET(
      {
        nextUrl: new URL(
          "https://site/studio/files/x/content" +
            (download ? "?download=1" : ""),
        ),
      },
      { params: Promise.resolve({ fileId: id }) },
    );
    assert.equal(r.status, 200);
    assert.ok(r.headers.get("Content-Disposition").startsWith(expected));
    assert.match(r.headers.get("Content-Disposition"), /UTF-8/);
    assert.match(r.headers.get("Content-Security-Policy"), /sandbox/);
    if (type.startsWith("text/"))
      assert.match(r.headers.get("Content-Type"), /text\/plain/);
  }
});
test("publication review rejects stale versions, untrusted covers and unsafe links", async () => {
  const stale = harness({
    writeResponse: { data: { id, publish_state: "draft" }, error: null },
  });
  // The owned snapshot exists but no row matches the submitted version.
  const noRow = harness({ writeResponse: { data: null, error: null } });
  assert.equal(
    (
      await noRow.review.approvePublicationMedia(
        "projects",
        id,
        {},
        form({ confirmation: "approve" }),
      )
    ).status,
    "error",
  );
  for (const record of [
    { image_url: "https://evil.example/image.png" },
    { github_url: "javascript:alert(1)" },
    {
      cover_image_url:
        "https://example.supabase.co/storage/v1/object/sign/private-files/image.png?token=secret",
    },
  ]) {
    const h = harness({
      writeResponse: {
        data: { id, publish_state: "draft", ...record },
        error: null,
      },
    });
    const kind = "cover_image_url" in record ? "writings" : "projects";
    assert.equal(
      (
        await h.review.approvePublicationMedia(
          kind,
          id,
          {},
          form({ confirmation: "approve" }),
        )
      ).status,
      "error",
    );
    assert.ok(!h.calls.some((c) => c[0] === "update"));
  }
  const result = await stale.review.approvePublicationMedia(
    "projects",
    id,
    {},
    form({ confirmation: "approve" }),
  );
  assert.equal(result.status, "success");
  assert.ok(
    stale.calls.some(
      (c) => c[0] === "eq" && c[1] === "updated_at" && c[2] === "v1",
    ),
  );
});
test("writing workflow supports draft, review, approve, publish, unpublish and archive without losing content", () => {
  const t = load("src/features/writings/transitions.ts");
  let row = {
    title: "Synthetic",
    slug: "synthetic",
    excerpt: "Summary",
    content: "Text",
    coverImageUrl: null,
    publishState: "draft",
    visibility: "private",
  };
  for (const target of [
    "review",
    "approved",
    "published",
    "unpublished",
    "published",
    "archived",
  ]) {
    const r = t.prepareWritingTransition(row, target);
    assert.equal(r.ok, true);
    row = { ...row, ...r.data };
  }
  assert.equal(row.visibility, "private");
  assert.equal(row.content, "Text");
  assert.equal(t.prepareWritingTransition(row, "draft").ok, false);
  assert.equal(
    t.prepareWritingTransition(
      {
        ...row,
        publishState: "approved",
        coverImageUrl: "https://example/cover.png",
        imageApprovalState: "pending",
      },
      "published",
    ).ok,
    false,
  );
  assert.equal(
    t.validateWritingUpdatePolicy(
      { ...row, publishState: "published", visibility: "public" },
      { content: " " },
    ).ok,
    false,
  );
});
test("approved covers appear only for public published content and private/unknown sources stay hidden", async () => {
  const { createSupabasePublicContentRepository, parseWritingSections } = load(
    "src/features/public/content/supabase-repository.ts",
  );
  const row = {
    id,
    slug: "synthetic",
    title: "Synthetic",
    excerpt: "Summary",
    summary: "Summary",
    content: "Text",
    status: "active",
    tags: [],
    category: null,
    reading_time: 1,
    progress: 0,
    is_featured: false,
    visibility: "public",
    publish_state: "published",
    published_at: "2026-01-01",
    updated_at: "2026-01-01",
    image_url: "/images/test.png",
    cover_image_url: "/images/test.png",
    image_approval_state: "approved",
    link_approval_state: "not_required",
    demo_url: null,
    github_url: null,
  };
  for (const kind of ["projects", "writings"]) {
    const repository = (patch) =>
      createSupabasePublicContentRepository({
        execute: async () => ({ data: { ...row, ...patch }, error: null }),
      });
    const read = (r) =>
      kind === "projects"
        ? r.getProjectBySlug("synthetic")
        : r.getWritingBySlug("synthetic");
    const publicRow = await read(repository({}));
    assert.ok(publicRow.image || publicRow.coverImage);
    const pending = await read(repository({ image_approval_state: "pending" }));
    assert.equal(
      kind === "projects" ? pending.image : pending.coverImage,
      null,
    );
    assert.equal(
      await read(
        repository({ publish_state: "unpublished", visibility: "hidden" }),
      ),
      null,
    );
  }
  assert.equal(parseWritingSections("true")[0].paragraphs[0], "true");
});
