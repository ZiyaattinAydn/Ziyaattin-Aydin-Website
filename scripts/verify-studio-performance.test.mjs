import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

function source(path) { return readFileSync(path, "utf8"); }

test("Studio has exactly one set of session controls per viewport", () => {
  const layout = source("src/app/(studio)/studio/layout.tsx");
  const shell = source("src/components/studio/studio-shell.tsx");
  assert.ok(!layout.includes("<StudioSessionControls />"), "Remove stray toolbar outside StudioShell.");
  assert.equal(shell.match(/<StudioSessionControls \/>/g)?.length, 2);
  assert.ok(shell.includes("md:hidden") && shell.includes("hidden md:block"),
    "Remaining controls are mutually exclusive desktop/mobile.");
});

test("Studio authorization stays owner+MFA gated and memoizes strictly per request", () => {
  const auth = source("src/lib/auth/studio-authorization.ts");
  assert.ok(auth.includes('import { cache } from "react"'));
  assert.ok(auth.includes("getStudioAuthorization = cache("));
  assert.ok(auth.includes("hasRequiredStudioAssurance(mfaAccess.currentLevel)"));
  assert.ok(auth.includes("hasRequiredStudioAssurance(mfaAccess.nextLevel)"));
  assert.ok(auth.includes("readActiveOwnerProfile(supabase, trustedUser.user)"));
  assert.ok(auth.includes("getAuthenticatorAssuranceLevel(supabase)"));
  assert.ok(auth.includes("Promise.all(["));
  assert.ok(!auth.includes("SUPABASE_SERVICE_ROLE_KEY"));
});

test("Task and library list reads preserve owner filters and pagination but run independently", () => {
  const tasks = source("src/features/studio/tasks/task-store.ts");
  const files = source("src/features/studio/library/server.ts");
  assert.ok(tasks.includes("await Promise.all(["));
  assert.ok(tasks.includes('fetchRows<StudioTask>("tasks", TASK_COLUMNS)'));
  assert.ok(tasks.includes('fetchRows<TaskProject>("projects"'));
  assert.ok(tasks.includes('.eq("owner_id", ownerId)'));
  assert.ok(tasks.includes(".range(offset, offset + 499)"));
  assert.ok(files.includes("await Promise.all([fetchLibraryRows(), fetchProjects()])"));
  assert.ok(files.includes('.eq("owner_id", ctx.owner)'));
  assert.ok(files.includes(".range(offset, offset + 499)"));
});

test("Task detail query retrieves just the requested, authorized task", () => {
  const tasks = source("src/features/studio/tasks/task-store.ts");
  const portion = tasks.slice(tasks.indexOf("export async function getStudioTask"));
  assert.ok(portion.includes('.eq("id", id)'));
  assert.ok(portion.includes('.eq("owner_id", ownerId)'));
  assert.ok(portion.includes(".maybeSingle()"));
  assert.ok(!portion.includes("await listStudioTasks()"));
});

test("Project file reads stay owner scoped; upload-time ownership checks stay enforced", () => {
  const lib = source("src/features/studio/library/server.ts");
  const detail = source("src/app/(studio)/studio/projects/[projectId]/page.tsx");
  assert.ok(lib.includes("export async function checkProject("), "Upload-time project access guard must remain.");
  assert.ok(lib.includes('await ctx.db.from("files")'));
  assert.ok(lib.includes('.eq("owner_id", ctx.owner).eq("project_id", projectId)'));
  assert.ok(detail.includes("getOwnerProject(projectId)"));
});
