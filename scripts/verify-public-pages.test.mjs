import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const nativeRequire = createRequire(import.meta.url);
function loadPage(
  file,
  { project = null, writing = null, unavailable = false } = {},
) {
  const cache = new Map();
  const mocks = {
    "next/link": {
      __esModule: true,
      default: ({ children, ...props }) =>
        React.createElement("a", props, children),
    },
    "next/navigation": {
      notFound() {
        throw new Error("NOT_FOUND");
      },
    },
    "@/features/public/content/public-reads": {
      async readPublicProject() {
        if (unavailable) throw new Error("private server detail");
        return project;
      },
      async readPublicWriting() {
        if (unavailable) throw new Error("private server detail");
        return writing;
      },
    },
  };
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = { exports: {} };
    cache.set(filename, loaded);
    const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    const req = (name) => {
      if (name in mocks) return mocks[name];
      if (name.startsWith("@/") || name.startsWith(".")) {
        const base = name.startsWith("@/")
          ? path.resolve("src", name.slice(2))
          : path.resolve(path.dirname(filename), name);
        for (const suffix of [".ts", ".tsx", "/index.ts"])
          if (fs.existsSync(base + suffix)) return load(base + suffix);
      }
      return nativeRequire(name);
    };
    vm.runInThisContext(
      "(function(require,module,exports){" + output + "\n})",
      { filename },
    )(req, loaded, loaded.exports);
    return loaded.exports;
  }
  return load(file);
}
const props = { params: Promise.resolve({ slug: "test-entry" }) };
const project = {
  slug: "test-entry",
  title: "Test project",
  description: "Public project summary",
  status: "Devam Ediyor",
  statusLabel: "Geliştirme devam ediyor",
  technologies: [],
  progress: 75,
  problem: "Test problem",
  approach: "Test approach",
  highlights: ["Public highlight"],
  nextSteps: [],
  sourceNote: "DEVELOPER_ONLY_TEXT",
  publicNotes: ["PRIVATE_NOTE_SENTINEL"],
  links: {
    demo: { label: "Canlı demo", href: null },
    github: { label: "GitHub", href: "https://example.com/source" },
  },
};
test("project detail renders useful sections and valid links without internal notes or estimated progress", async () => {
  const page = loadPage("src/app/(public)/projects/[slug]/page.tsx", {
    project,
  });
  const html = renderToStaticMarkup(await page.default(props));
  for (const text of [
    "Test project",
    "Test problem",
    "Test approach",
    "Public highlight",
    "https://example.com/source",
  ])
    assert.ok(html.includes(text));
  for (const text of [
    "DEVELOPER_ONLY_TEXT",
    "PRIVATE_NOTE_SENTINEL",
    "%75",
    "Yayın akışı",
    "Onay",
  ])
    assert.ok(!html.includes(text));
  const metadata = await page.generateMetadata(props);
  assert.equal(metadata.alternates.canonical, "/projects/test-entry");
});
test("writing body escapes HTML and article metadata uses the actual publication dates", async () => {
  const writing = {
    slug: "test-entry",
    title: "Test writing",
    category: "Notlar",
    excerpt: "Summary",
    date: "2026-10-25",
    updatedLabel: "2026-10-25",
    readingTime: "2 dk",
    sections: [
      {
        id: "intro",
        title: "Başlangıç",
        paragraphs: ['<script>alert("x")</script>'],
        quote: "A quote",
        code: "const x = 1;",
      },
    ],
  };
  const page = loadPage("src/app/(public)/writings/[slug]/page.tsx", {
    writing,
  });
  const html = renderToStaticMarkup(await page.default(props));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes('<script>alert("x")'));
  assert.ok(html.includes('href="#intro"'));
  assert.ok(html.includes('id="intro"'));
  const metadata = await page.generateMetadata(props);
  assert.equal(metadata.openGraph.type, "article");
  assert.equal(metadata.openGraph.publishedTime, "2026-10-25");
});
test("unknown project and writing pages return not-found without indexable metadata", async () => {
  for (const kind of ["projects", "writings"]) {
    const page = loadPage("src/app/(public)/" + kind + "/[slug]/page.tsx");
    await assert.rejects(page.default(props), /NOT_FOUND/);
    assert.equal((await page.generateMetadata(props)).robots.index, false);
  }
});
test("unavailable public data produces a retry view without server details", async () => {
  for (const kind of ["projects", "writings"]) {
    const page = loadPage("src/app/(public)/" + kind + "/[slug]/page.tsx", {
      unavailable: true,
    });
    const html = renderToStaticMarkup(await page.default(props));
    assert.ok(html.includes("Yeniden dene"));
    assert.ok(!html.includes("private server detail"));
    assert.equal((await page.generateMetadata(props)).robots.index, false);
  }
});
