import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { selectResumeTasksPerProject } from "../src/features/studio/tasks/continue-work.ts";

const project = (id, status = "active") => ({
  id, title: "Project " + id, status, publish_state: "draft", created_at: "2026-01-01", updated_at: "2026-10-01",
});
const task = (id, project_id, status, priority, updated_at) => ({
  id, project_id, status, priority, updated_at,
  title: "Task " + id, description: "", starts_at: null, due_at: null,
  completed_at: null, archived_at: null, created_at: "2026-10-01",
});

test("one representative work item for each unfinished project, not four items from the newest", () => {
  const projects = [project("Kantin", "paused"), project("Köprüaltı"), project("RenTR"), project("JoJo", "completed")];
  const tasks = [
    task("1","Köprüaltı","blocked","high","2026-10-26T10:00:00Z"),
    task("2","Köprüaltı","blocked","urgent","2026-10-26T11:00:00Z"),
    task("3","Köprüaltı","todo","medium","2026-10-25T10:00:00Z"),
    task("4","Kantin","blocked","high","2026-10-25T10:00:00Z"),
    task("5","RenTR","in_progress","low","2026-10-20T10:00:00Z"),
    task("6","RenTR","todo","urgent","2026-10-26T14:00:00Z"),
    task("7","JoJo","todo","urgent","2026-10-26T14:00:00Z"),
  ];
  const result = selectResumeTasksPerProject(tasks, projects);
  assert.equal(result.length, 3);
  assert.equal(new Set(result.map((row) => row.project.id)).size, 3);
  assert.equal(result.find((x) => x.project.id === "Köprüaltı").task.id, "3");
  assert.equal(result.find((x) => x.project.id === "RenTR").task.id, "5");
  assert.equal(result.find((x) => x.project.id === "Kantin").task.id, "4");
});

test("priority chooses the next waiting task when no active or ready task exists", () => {
  const r = selectResumeTasksPerProject([
    task("older","one","blocked","urgent","2026-10-25"),
    task("newer","one","blocked","medium","2026-10-26"),
    task("done","one","done","urgent","2026-10-26"),
  ], [project("one")]);
  assert.equal(r[0]?.task.id, "older");
});

test("project uploader hides its redundant project selector but library uploader keeps it", () => {
  const form = readFileSync("src/features/studio/projects/project-form.tsx","utf8");
  const upload = readFileSync("src/features/studio/library/upload-form.tsx","utf8");
  assert.ok(form.includes("<UploadForm embeddedInProject projectId="));
  assert.ok(upload.includes("!embeddedInProject"));
  assert.ok(upload.includes("Proje kaydedildiğinde dosya otomatik"));
});

test("homepage uses full project and writing carousels, and about panels share the component", () => {
  const home = readFileSync("src/app/(public)/page.tsx","utf8");
  const about = readFileSync("src/app/(public)/about/page.tsx","utf8");
  const carousel = readFileSync("src/components/public/auto-carousel.tsx","utf8");
  assert.ok(home.includes('<AutoCarousel label="Projeler"'));
  assert.ok(home.includes('<AutoCarousel label="Yazılar"'));
  assert.ok(!home.includes("projects.value.slice(0, 3)"));
  assert.ok(about.includes('<AutoCarousel label="Hakkımda alanları"'));
  assert.ok(carousel.includes("Date.now() + 10000"));
  assert.ok(carousel.includes("prefers-reduced-motion"));
  assert.ok(carousel.includes("onTouchEnd"));
});

test("project filters search actual subtitle and separate paused from active", () => {
  const explorer = readFileSync("src/components/public/project-explorer.tsx","utf8");
  const mapper = readFileSync("src/features/public/content/supabase-repository.ts","utf8");
  assert.ok(explorer.includes("project.subtitle ??"));
  assert.ok(explorer.includes("Filtreleri temizle"));
  assert.ok(explorer.includes("Öne çıkanlar önce"));
  assert.ok(!explorer.includes("setCategory"));
  assert.ok(mapper.includes('status === "paused"'));
  assert.ok(mapper.includes('return "Duraklatıldı"'));
});

test("resume cards prominently show a linked project identity above task title", () => {
  const card = readFileSync("src/features/studio/tasks/task-card.tsx", "utf8");
  assert.ok(card.includes('aria-label={projectName + " projesini aç"}'));
  assert.ok(card.includes('className="mb-4 inline-flex'));
  assert.ok(card.indexOf('mb-4 inline-flex') < card.indexOf('<h3 className='));
  assert.ok(card.includes('text-sm font-semibold text-[var(--accent)]'));
});

test("carousel retains manual arrows but no automatic transition counter", () => {
  const carousel = readFileSync("src/components/public/auto-carousel.tsx", "utf8");
  const css = readFileSync("src/components/public/auto-carousel.module.css", "utf8");
  assert.ok(!carousel.includes("Otomatik geçiş"));
  assert.ok(!carousel.includes("visiblePosition"));
  assert.ok(carousel.includes('onClick={() => move(-1)}'));
  assert.ok(carousel.includes('onClick={() => move(1)}'));
  assert.ok(css.includes("justify-content: flex-end"));
});

test("public footer no longer exposes duplicate repository source link, but keeps existing Studio entry", () => {
  const footer = readFileSync("src/components/layout/site-footer.tsx", "utf8");
  assert.ok(!footer.includes("Kaynak kodu"));
  assert.ok(!footer.includes("ZiyaattinAydn/Ziyaattin-Aydin-Website"));
  assert.ok(footer.includes('href={siteConfig.adminEntry.href}'));
});

function loadShortcut(authorized) {
  const src = readFileSync("src/components/layout/studio-return-shortcut.tsx", "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  const requireStub = (name) => {
    if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
    if (name === "@/lib/auth/studio-authorization") return {
      getStudioAuthorization: async () => {
        if (authorized === "error") throw new Error("AUTH_UNAVAILABLE");
        return { ok: authorized };
      },
    };
    if (name === "react/jsx-runtime") return {
      jsx: (type, props) => React.createElement(type, props),
      jsxs: (type, props) => React.createElement(type, props),
    };
    throw new Error("Unexpected shortcut dependency: " + name);
  };
  vm.runInThisContext("(function(require,module,exports){" + js + "\n})")(requireStub, module, module.exports);
  return module.exports.StudioReturnShortcut;
}

test("public Studio shortcut requires full server-side Studio authorization and stays hidden otherwise", async () => {
  const source = readFileSync("src/components/layout/studio-return-shortcut.tsx", "utf8");
  const layout = readFileSync("src/app/(public)/layout.tsx", "utf8");
  const controls = readFileSync("src/components/studio/studio-session-controls.tsx", "utf8");
  assert.ok(source.includes("getStudioAuthorization()"));
  assert.ok(!source.includes("localStorage"));
  assert.ok(layout.includes("<StudioReturnShortcut />"));
  assert.ok(layout.includes('<Suspense fallback={null}>'));
  assert.ok(controls.includes('href="/"') && controls.includes("Siteyi görüntüle"));

  for (const denied of [false, "error"]) {
    const component = loadShortcut(denied);
    assert.equal(await component(), null);
  }
  const component = loadShortcut(true);
  const html = renderToStaticMarkup(await component());
  assert.ok(html.includes('href="/studio"'));
  assert.ok(html.includes("Studio’ya dön"));
});
