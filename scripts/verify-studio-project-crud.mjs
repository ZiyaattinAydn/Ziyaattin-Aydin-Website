import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
let assertionCount = 0;

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function check(condition, message) {
  assertionCount += 1;
  assert.ok(condition, message);
}

const actions = read("src/features/studio/projects/actions.ts");
const form = read("src/features/studio/projects/project-form.tsx");
const workflow = read(
  "src/features/studio/projects/project-workflow-actions.tsx",
);
const listPage = read("src/app/(studio)/studio/projects/page.tsx");
const newPage = read("src/app/(studio)/studio/projects/new/page.tsx");
const editPage = read(
  "src/app/(studio)/studio/projects/[projectId]/edit/page.tsx",
);
const packageJson = JSON.parse(read("package.json"));

const studioProjectSources = [
  actions,
  form,
  workflow,
  listPage,
  newPage,
  editPage,
  read("src/features/studio/projects/action-state.ts"),
  read("src/features/studio/projects/project-card.tsx"),
  read("src/features/studio/projects/project-presentation.ts"),
  read("src/features/studio/projects/project-submit-button.tsx"),
].join("\n");

check(actions.includes('"use server"'), "Project actions must be server actions.");
check(
  actions.includes('from "@/features/projects/server/project-mutations"'),
  "Studio actions must consume the Core server mutation boundary.",
);
for (const operation of [
  "createProjectDraft",
  "updateProject",
  "transitionProjectPublishState",
  "archiveProject",
]) {
  check(
    actions.includes(operation),
    `Studio actions must call ${operation}.`,
  );
}
check(
  listPage.includes("listOwnerProjects"),
  "Studio list must use the owner project read boundary.",
);
check(
  editPage.includes("getOwnerProject"),
  "Studio edit page must use the owner project read boundary.",
);
check(
  editPage.includes("getAllowedProjectTransitions"),
  "Edit page must derive transitions from the Core contract.",
);
check(
  editPage.includes("canChangeProjectSlug"),
  "Edit page must enforce Core slug editability.",
);
check(
  workflow.includes('value="archive"') &&
    workflow.includes("archiveConfirmation"),
  "Archive must require explicit confirmation.",
);
check(
  actions.includes('formData.get("archiveConfirmation") !== "archive"'),
  "Archive confirmation must be checked server-side.",
);
check(
  actions.includes('revalidatePath("/studio/projects")'),
  "Studio list must be revalidated after mutations.",
);
check(
  actions.includes('revalidatePath("/projects")'),
  "Public project list path must be revalidated after mutations.",
);
check(
  form.includes('name="title"') &&
    form.includes('name="slug"') &&
    form.includes('name="summary"'),
  "Project form must expose the minimum editable fields.",
);
check(
  form.includes("publishedVisibilityLocked"),
  "Published visibility must be locked in the UI.",
);
check(
  !studioProjectSources.includes('name="owner_id"'),
  "Owner identity must never come from a Studio form.",
);
check(
  !studioProjectSources.includes('name="publish_state"'),
  "Publish state must not be accepted by the edit form.",
);
check(
  !studioProjectSources.includes(".from("),
  "Studio UI/action layer must not bypass the Core project service.",
);
check(
  !studioProjectSources.includes(".delete("),
  "Sprint 07 Studio must not implement hard delete.",
);
check(
  !studioProjectSources.includes("SUPABASE_SERVICE_ROLE_KEY"),
  "Studio project flow must not use the service role.",
);
check(
  !studioProjectSources.includes("owner_id"),
  "Studio project source must not accept or expose owner_id.",
);
check(
  !/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(
    studioProjectSources,
  ),
  "Studio project source must not contain a real-looking owner UUID.",
);
check(
  !/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(studioProjectSources),
  "Studio project source must not hard-code an email address.",
);
check(
  packageJson.scripts?.["test:studio-projects"] ===
    "node scripts/verify-studio-project-crud.mjs",
  "package.json must expose the Studio project verifier.",
);

console.log(
  `S07_STUDIO_PROJECT_CRUD_STATIC_OK (${assertionCount} assertions)`,
);
