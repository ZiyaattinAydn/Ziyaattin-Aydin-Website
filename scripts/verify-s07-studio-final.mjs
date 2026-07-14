import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

let assertions = 0;

function check(condition, message) {
  assert.ok(condition, message);
  assertions += 1;
}

function read(file) {
  check(existsSync(file), `${file} must exist`);
  return readFileSync(file, "utf8");
}

const requiredFiles = [
  "docs/studio/STUDIO_PROJECT_CRUD_RUNBOOK.md",
  "docs/handoffs/2026-07-14-studio-project-crud-s07.md",
  "src/app/(studio)/studio/projects/page.tsx",
  "src/app/(studio)/studio/projects/new/page.tsx",
  "src/app/(studio)/studio/projects/[projectId]/edit/page.tsx",
  "src/features/studio/projects/actions.ts",
  "src/features/studio/projects/project-form.tsx",
  "src/features/studio/projects/project-workflow-actions.tsx",
  "scripts/verify-studio-project-crud.mjs",
];

for (const file of requiredFiles) {
  check(existsSync(file), `${file} must exist`);
}

const handoff = read(
  "docs/handoffs/2026-07-14-studio-project-crud-s07.md",
);
const runbook = read("docs/studio/STUDIO_PROJECT_CRUD_RUNBOOK.md");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const actions = read("src/features/studio/projects/actions.ts");
const tracking = [
  read("docs/PROJECT_STATUS.md"),
  read("docs/WORKSTREAMS.md"),
  read("docs/DECISIONS.md"),
  read("docs/ROADMAP.md"),
  read("CHANGELOG.md"),
].join("\n");

check(handoff.includes("S07_STUDIO_OK"), "handoff success label missing");
check(handoff.includes("729e556"), "implementation commit missing");
check(handoff.includes("ffbe5fb"), "Core merge commit missing");
check(
  handoff.includes("Production env unchanged"),
  "production environment result missing",
);
check(runbook.includes("Hard delete yoktur"), "hard-delete rule missing");
check(
  runbook.includes("Published") && runbook.includes("slug"),
  "published slug rule missing",
);
check(
  packageJson.scripts?.["test:studio-projects"] ===
    "node scripts/verify-studio-project-crud.mjs",
  "Studio Projects npm test script missing",
);
check(
  !actions.includes(".delete("),
  "Studio Projects actions must not hard-delete",
);
check(
  tracking.includes("S07_STUDIO_OK"),
  "tracking success label missing",
);

console.log(`S07_STUDIO_FINAL_OK (${assertions} assertions)`);
