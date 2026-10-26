import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
function load(file, mocks = {}, cache = new Map()) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule.exports);
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const require = (name) => {
    if (name in mocks) return mocks[name];
    if (name.startsWith(".") || name.startsWith("@/")) {
      const base = name.startsWith("@/")
        ? path.resolve("src", name.slice(2))
        : path.resolve(path.dirname(file), name);
      return load(base + ".ts", mocks, cache);
    }
    throw new Error("Unexpected dependency " + name);
  };
  vm.runInThisContext(
    "(function(require,loadedModule,exports){" + js + "\n})",
    { filename: file },
  )(require, loadedModule, loadedModule.exports);
  cache.set(file, loadedModule.exports);
  return loadedModule.exports;
}
const d = load("src/features/studio/tasks/task-domain.ts");
const now = new Date("2026-10-25T22:00:00Z"); // 26 October in Istanbul.
const task = (id, overrides = {}) => ({
  id,
  title: "İş planı",
  description: "Açıklama",
  project_id: null,
  status: "todo",
  priority: "medium",
  starts_at: null,
  due_at: null,
  completed_at: null,
  archived_at: null,
  created_at: "2026-10-01T00:00:00Z",
  updated_at: "2026-10-20T10:00:00Z",
  ...overrides,
});
function form(overrides = {}) {
  const f = new FormData();
  for (const [key, value] of Object.entries({
    title: "Görev",
    description: "Açıklama",
    status: "todo",
    priority: "medium",
    projectId: "",
    startsAt: "",
    dueAt: "",
    ...overrides,
  }))
    f.set(key, value);
  return f;
}
test("valid dates, optional dates, leap days and Istanbul end-of-day", () => {
  const r = d.validateTaskForm(
    form({ startsAt: "2028-02-29", dueAt: "2028-02-29" }),
  );
  assert.equal(r.ok, true);
  assert.equal(r.data.starts_at, "2028-02-28T21:00:00.000Z");
  assert.equal(r.data.due_at, "2028-02-29T20:59:59.999Z");
  assert.equal(d.validateTaskForm(form()).data.due_at, null);
  assert.equal(d.calendarDate(now), "2026-10-26");
});
test("reject impossible dates, reversed range, invalid IDs and oversized text", () => {
  for (const patch of [
    { startsAt: "2026-02-29" },
    { dueAt: "nonsense" },
    { startsAt: "2026-10-27", dueAt: "2026-10-26" },
    { title: " " },
    { title: "x".repeat(161) },
    { description: "x".repeat(2001) },
    { priority: "invalid" },
    { status: "archived" },
    { projectId: "not-uuid" },
  ])
    assert.equal(
      d.validateTaskForm(form(patch)).ok,
      false,
      JSON.stringify(patch),
    );
});
test("due classification handles midnight, seven-day boundary and completed/archive", () => {
  assert.equal(
    d.dueState(task("1", { due_at: "2026-10-25T20:59:59.999Z" }), now),
    "overdue",
  );
  assert.equal(
    d.dueState(task("1", { due_at: "2026-10-26T20:59:59.999Z" }), now),
    "upcoming",
  );
  assert.equal(
    d.dueState(task("1", { due_at: "2026-11-02T20:59:59.999Z" }), now),
    "upcoming",
  );
  assert.equal(
    d.dueState(task("1", { due_at: "2026-11-03T20:59:59.999Z" }), now),
    null,
  );
  for (const status of ["done", "archived"])
    assert.equal(
      d.dueState(task("1", { status, due_at: "2020-01-01" }), now),
      null,
    );
});
const tasks = [
  task("a", {
    project_id: "p",
    priority: "urgent",
    due_at: "2026-10-25T12:00:00Z",
  }),
  task("b", {
    title: "Başka iş",
    status: "done",
    due_at: "2026-10-26T12:00:00Z",
  }),
  task("c", { status: "archived" }),
  task("d", { due_at: "2026-10-27T12:00:00Z" }),
];
test("combined project/status/priority filters and Turkish search", () => {
  assert.deepEqual(
    d
      .filterTasks(
        tasks,
        { q: "iş", project: "p", priority: "urgent", status: "todo" },
        now,
      )
      .map((t) => t.id),
    ["a"],
  );
  assert.equal(d.filterTasks(tasks, { project: "none" }, now).length, 2);
  assert.deepEqual(
    d.filterTasks(tasks, { status: "archived" }, now).map((t) => t.id),
    ["c"],
  );
  assert.equal(d.filterTasks(tasks, { q: "bulunamaz" }, now).length, 0);
});
test("date filters, range and stable sorting do not mutate source", () => {
  assert.deepEqual(
    d.filterTasks(tasks, { date: "overdue" }, now).map((t) => t.id),
    ["a"],
  );
  assert.deepEqual(
    d.filterTasks(tasks, { date: "upcoming" }, now).map((t) => t.id),
    ["d"],
  );
  assert.deepEqual(
    d
      .filterTasks(tasks, { from: "2026-10-26", to: "2026-10-26" }, now)
      .map((t) => t.id),
    ["b"],
  );
  assert.deepEqual(
    d.filterTasks(tasks, { sort: "priority" }, now).map((t) => t.id),
    ["a", "b", "d"],
  );
  assert.deepEqual(
    d.filterTasks(tasks, { sort: "due" }, now).map((t) => t.id),
    ["a", "b", "d"],
  );
  assert.deepEqual(
    tasks.map((t) => t.id),
    ["a", "b", "c", "d"],
  );
});
test("project progress uses non-archived tasks, with no invented empty percentage", () => {
  assert.deepEqual(d.taskProgress(tasks), {
    total: 3,
    completed: 1,
    open: 2,
    percent: 33,
  });
  assert.equal(d.taskProgress([]).percent, null);
  assert.equal(d.taskProgress([task("a", { status: "done" })]).percent, 100);
});
function actions({
  authorized = true,
  response = {
    data: { id: "30000000-0000-4000-8000-000000000001" },
    error: null,
  },
  throwDb = false,
} = {}) {
  const calls = [];
  const builder = new Proxy(
    {},
    {
      get(_target, key) {
        if (key === "then") return (resolve) => resolve(response);
        return (...args) => {
          calls.push([key, ...args]);
          if (throwDb) throw new Error("database");
          return builder;
        };
      },
    },
  );
  const modules = {
    "@/lib/auth/studio-authorization": {
      getStudioAuthorization: async () =>
        authorized
          ? { ok: true, profile: { userId: "trusted-owner" } }
          : { ok: false },
    },
    "@/lib/supabase/server": {
      createServerSupabaseClient: async () => ({
        from: (...args) => {
          calls.push(["from", ...args]);
          return builder;
        },
      }),
    },
    "next/cache": {
      revalidatePath: (...args) => calls.push(["revalidate", ...args]),
    },
    "next/navigation": {
      redirect: (url) => {
        throw new Error("REDIRECT " + url);
      },
    },
  };
  return { api: load("src/features/studio/tasks/actions.ts", modules), calls };
}
test("task editor omits calendar fields without dropping historical records", () => {
  const source = fs.readFileSync("src/features/studio/tasks/task-form.tsx", "utf8");
  assert.equal(source.includes('name="startsAt"'), false);
  assert.equal(source.includes('name="dueAt"'), false);
  assert.equal(source.includes('name="title"'), true);
  assert.equal(source.includes('name="status"'), true);
  assert.equal(source.includes('name="projectId"'), true);
});

test("updating without date fields preserves recorded dates; creation uses none", async () => {
  const id = "30000000-0000-4000-8000-000000000001";
  const originalStarts = "2026-09-15T00:00:00.000Z";
  const originalDue = "2026-11-15T20:59:59.999Z";
  const { api, calls } = actions({
    response: { data: { id, starts_at: originalStarts, due_at: originalDue }, error: null },
  });
  const f = form({ version: "2026-10-25T10:00:00Z" });
  f.delete("startsAt");
  f.delete("dueAt");
  await assert.rejects(api.updateTaskAction(id, {}, f), /REDIRECT.*notice=updated/);
  const update = calls.find((c) => c[0] === "update")[1];
  assert.equal(update.starts_at, originalStarts);
  assert.equal(update.due_at, originalDue);
  assert.ok(calls.some((c) => c[0] === "select" && c[1] === "starts_at,due_at"));

  const created = actions();
  const newForm = form({ startsAt: "2026-01-01", dueAt: "2026-12-31" });
  await assert.rejects(created.api.createTaskAction({}, newForm), /REDIRECT.*notice=created/);
  const inserted = created.calls.find((c) => c[0] === "insert")[1];
  assert.equal(inserted.starts_at, null);
  assert.equal(inserted.due_at, null);
});

test("all task writes fail closed without owner + MFA authorization", async () => {
  const { api, calls } = actions({ authorized: false }),
    id = "30000000-0000-4000-8000-000000000001";
  for (const result of [
    await api.createTaskAction({}, form()),
    await api.updateTaskAction(id, {}, form()),
    await api.archiveTaskAction(id, {}, form({ confirmation: "archive" })),
  ])
    assert.equal(result.status, "error");
  assert.equal(calls.length, 0);
});
test("create stores trusted owner and validated fields; ignores client metadata", async () => {
  const { api, calls } = actions();
  await assert.rejects(
    api.createTaskAction(
      {},
      form({ owner_id: "attacker", completed_at: "forged", priority: "high" }),
    ),
    /REDIRECT.*notice=created/,
  );
  const payload = calls.find((c) => c[0] === "insert")[1];
  assert.equal(payload.owner_id, "trusted-owner");
  assert.equal(payload.priority, "high");
  assert.equal("completed_at" in payload, false);
  assert.ok(calls.some((c) => c[0] === "revalidate" && c[1] === "/studio"));
});
test("update requires the owned, non-archived row at submitted version", async () => {
  const { api, calls } = actions(),
    id = "30000000-0000-4000-8000-000000000001";
  await assert.rejects(
    api.updateTaskAction(
      id,
      {},
      form({ version: "2026-10-25T10:00:00Z", status: "done" }),
    ),
    /notice=updated/,
  );
  assert.ok(
    calls.some(
      (c) => c[0] === "eq" && c[1] === "owner_id" && c[2] === "trusted-owner",
    ),
  );
  assert.ok(
    calls.some(
      (c) =>
        c[0] === "eq" &&
        c[1] === "updated_at" &&
        c[2] === "2026-10-25T10:00:00Z",
    ),
  );
  assert.ok(
    calls.some(
      (c) => c[0] === "neq" && c[1] === "status" && c[2] === "archived",
    ),
  );
});
test("archive requires explicit confirmation and never deletes", async () => {
  const { api, calls } = actions(),
    id = "30000000-0000-4000-8000-000000000001";
  assert.equal((await api.archiveTaskAction(id, {}, form())).status, "error");
  assert.equal(calls.length, 0);
  await assert.rejects(
    api.archiveTaskAction(
      id,
      {},
      form({ confirmation: "archive", version: "2026-10-25T10:00:00Z" }),
    ),
    /notice=archived/,
  );
  assert.deepEqual(calls.find((c) => c[0] === "update")[1], {
    status: "archived",
  });
  assert.ok(!calls.some((c) => c[0] === "delete"));
});
test("database failure and zero-row stale update return errors, not success", async () => {
  for (const config of [
    { response: { data: null, error: { code: "42501" } } },
    { response: { data: null, error: null } },
    { throwDb: true },
  ]) {
    const { api } = actions(config);
    assert.equal(
      (
        await api.updateTaskAction(
          "30000000-0000-4000-8000-000000000001",
          {},
          form(),
        )
      ).status,
      "error",
    );
  }
});
test("auth decision rules reject pending, disabled, forged identity and insufficient MFA", () => {
  const rules = load("src/lib/auth/studio-authorization-rules.ts");
  assert.equal(
    rules.isActiveOwnerProfile(
      { user_id: "u", role: "owner", status: "active" },
      "u",
    ),
    true,
  );
  for (const patch of [
    { status: "pending" },
    { status: "disabled" },
    { role: null },
    { user_id: "other" },
  ])
    assert.equal(
      rules.isActiveOwnerProfile(
        { user_id: "u", role: "owner", status: "active", ...patch },
        "u",
      ),
      false,
    );
  assert.equal(rules.hasRequiredStudioAssurance("aal1"), false);
  assert.equal(rules.hasRequiredStudioAssurance("aal2"), true);
});

test("authorization requires both current AAL2 and an enrolled verified factor", async () => {
  for (const [currentLevel, nextLevel, expected] of [
    ["aal1", "aal2", false],
    ["aal2", "aal1", false],
    ["aal2", "aal2", true],
  ]) {
    const client = {
      auth: {
        getUser: async () => ({
          data: { user: { id: "trusted" } },
          error: null,
        }),
        mfa: {
          getAuthenticatorAssuranceLevel: async () => ({
            data: { currentLevel, nextLevel },
            error: null,
          }),
        },
      },
      from: () => ({
        select() {
          return this;
        },
        eq() {
          return this;
        },
        async maybeSingle() {
          return {
            data: { user_id: "trusted", role: "owner", status: "active" },
            error: null,
          };
        },
      }),
    };
    const api = load("src/lib/auth/studio-authorization.ts", {
      "server-only": {},
      "@/lib/supabase/environment": { isSupabaseConfigured: () => true },
      "@/lib/supabase/server": {
        createServerSupabaseClient: async () => client,
      },
    });
    assert.equal((await api.getStudioAuthorization()).ok, expected);
  }
});
