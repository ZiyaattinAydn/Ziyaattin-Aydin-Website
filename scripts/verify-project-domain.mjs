import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const nativeRequire = createRequire(import.meta.url);
const moduleCache = new Map();

function resolveTypeScriptModule(request, parentFilename) {
  let candidate;

  if (request.startsWith("@/")) {
    candidate = path.join(root, "src", request.slice(2));
  } else if (request.startsWith(".")) {
    candidate = path.resolve(path.dirname(parentFilename), request);
  } else {
    return null;
  }

  for (const suffix of ["", ".ts", "/index.ts"]) {
    const resolved = `${candidate}${suffix}`;

    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      return resolved;
    }
  }

  throw new Error(
    `Unable to resolve TypeScript module "${request}" from ${parentFilename}`,
  );
}

function loadTypeScriptModule(relativeOrAbsolutePath) {
  const filename = path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.join(root, relativeOrAbsolutePath);

  if (moduleCache.has(filename)) {
    return moduleCache.get(filename).exports;
  }

  const source = fs.readFileSync(filename, "utf8");
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: filename,
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      strict: true,
      esModuleInterop: true,
    },
  });

  const errors = (diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  assert.equal(
    errors.length,
    0,
    `TypeScript transpile diagnostics found in ${filename}`,
  );

  const commonJsModule = { exports: {} };
  moduleCache.set(filename, commonJsModule);

  const wrapper = vm.runInThisContext(
    `(function (exports, module, require, __filename, __dirname) {${outputText}\n})`,
    { filename },
  );

  const localRequire = (request) => {
    const resolved = resolveTypeScriptModule(request, filename);
    return resolved
      ? loadTypeScriptModule(resolved)
      : nativeRequire(request);
  };

  wrapper(
    commonJsModule.exports,
    commonJsModule,
    localRequire,
    filename,
    path.dirname(filename),
  );

  return commonJsModule.exports;
}

loadTypeScriptModule(
  "src/features/projects/domain.ts",
);
const validation = loadTypeScriptModule(
  "src/features/projects/validation.ts",
);
const transitions = loadTypeScriptModule(
  "src/features/projects/transitions.ts",
);
const guard = loadTypeScriptModule(
  "src/features/projects/mutation-guard.ts",
);
const databaseErrors = loadTypeScriptModule(
  "src/features/projects/database-errors.ts",
);

let assertions = 0;

function check(condition, message) {
  assertions += 1;
  assert.ok(condition, message);
}

function equal(actual, expected, message) {
  assertions += 1;
  assert.equal(actual, expected, message);
}

function deepEqual(actual, expected, message) {
  assertions += 1;
  assert.deepEqual(actual, expected, message);
}

const validDraft = validation.validateCreateProjectInput({
  title: "  İlk Gerçek Proje  ",
  slug: "ilk-gercek-proje",
  summary: "  Development project özeti.  ",
  problem: "",
  approach: null,
  highlights: [" İlk madde ", "", "İkinci madde"],
  nextSteps: [],
  status: "active",
  visibility: "private",
  progress: 35,
  isFeatured: false,
  githubUrl: "",
  demoUrl: "https://example.com/demo",
  imageUrl: null,
});

check(validDraft.ok, "Geçerli draft create input reddedildi.");
if (validDraft.ok) {
  equal(validDraft.data.title, "İlk Gerçek Proje");
  equal(validDraft.data.approach, "");
  deepEqual(validDraft.data.highlights, [
    "İlk madde",
    "İkinci madde",
  ]);
  equal(validDraft.data.githubUrl, null);
}

const missingTitle = validation.validateCreateProjectInput({
  title: " ",
  slug: "basliksiz-proje",
});
equal(missingTitle.ok, false, "Eksik title kabul edildi.");

const invalidSlug = validation.validateCreateProjectInput({
  title: "Proje",
  slug: "Gecersiz Slug",
});
equal(invalidSlug.ok, false, "Geçersiz slug kabul edildi.");

const invalidUrl = validation.validateCreateProjectInput({
  title: "Proje",
  slug: "proje",
  demoUrl: "javascript:alert(1)",
});
equal(invalidUrl.ok, false, "Geçersiz URL kabul edildi.");

for (const progress of [-1, 101, 1.5]) {
  const result = validation.validateCreateProjectInput({
    title: "Proje",
    slug: "proje",
    progress,
  });
  equal(result.ok, false, `Geçersiz progress kabul edildi: ${progress}`);
}

const unknownField = validation.validateCreateProjectInput({
  title: "Proje",
  slug: "proje",
  owner_id: "00000000-0000-4000-8000-000000000000",
});
equal(unknownField.ok, false, "Yönetilen owner_id alanı kabul edildi.");

const managedApproval = validation.validateUpdateProjectInput({
  link_approval_state: "approved",
});
equal(
  managedApproval.ok,
  false,
  "Client tarafından approval sonucu kabul edildi.",
);

const baseProject = {
  id: "51000000-0000-4000-8000-000000000001",
  ownerId: "51000000-0000-4000-8000-000000000099",
  title: "Proje",
  slug: "proje",
  summary: "Yayın özeti",
  sections: {
    problem: "",
    approach: "",
    highlights: [],
    nextSteps: [],
  },
  status: "active",
  visibility: "private",
  publishState: "draft",
  progress: 50,
  isFeatured: false,
  githubUrl: null,
  demoUrl: null,
  linkApprovalState: "not_required",
  imageUrl: null,
  imageApprovalState: "not_required",
  publishedAt: null,
  archivedAt: null,
  createdAt: "2026-07-14T00:00:00.000Z",
  updatedAt: "2026-07-14T00:00:00.000Z",
};

equal(
  transitions.canTransitionProjectState("draft", "review"),
  true,
  "draft -> review geçişi kapalı.",
);
equal(
  transitions.canTransitionProjectState("review", "published"),
  false,
  "review -> published geçişi açık.",
);
equal(
  transitions.canTransitionProjectState("archived", "published"),
  false,
  "archived -> published geçişi açık.",
);

const approvedProject = {
  ...baseProject,
  publishState: "approved",
};
const publishPlan = transitions.prepareProjectTransition(
  approvedProject,
  "published",
);
check(publishPlan.ok, "Approved proje publish edilemedi.");
if (publishPlan.ok) {
  deepEqual(publishPlan.data, {
    publishState: "published",
    visibility: "public",
  });
}

const pendingLinkProject = {
  ...approvedProject,
  demoUrl: "https://example.com",
  linkApprovalState: "pending",
};
equal(
  transitions.prepareProjectTransition(
    pendingLinkProject,
    "published",
  ).ok,
  false,
  "Onaysız public link ile publish kabul edildi.",
);

const unpublishPlan = transitions.prepareProjectTransition(
  {
    ...baseProject,
    publishState: "published",
    visibility: "public",
    publishedAt: "2026-07-14T00:00:00.000Z",
  },
  "unpublished",
);
check(unpublishPlan.ok, "Published -> unpublished reddedildi.");
if (unpublishPlan.ok) {
  equal(unpublishPlan.data.visibility, "hidden");
}

const archivePlan = transitions.prepareProjectTransition(
  baseProject,
  "archived",
);
check(archivePlan.ok, "Draft -> archived reddedildi.");
if (archivePlan.ok) {
  deepEqual(archivePlan.data, {
    publishState: "archived",
    visibility: "private",
  });
}

for (const state of ["approved", "published", "unpublished"]) {
  const result = transitions.validateProjectUpdatePolicy(
    {
      ...baseProject,
      publishState: state,
      visibility: state === "published" ? "public" : "private",
    },
    { slug: "yeni-slug" },
  );
  equal(result.ok, false, `${state} slug değişikliği kabul edildi.`);
}

for (const state of ["draft", "review"]) {
  const result = transitions.validateProjectUpdatePolicy(
    {
      ...baseProject,
      publishState: state,
    },
    { slug: "yeni-slug" },
  );
  check(result.ok, `${state} slug değişikliği reddedildi.`);
}

equal(
  transitions.validateProjectUpdatePolicy(
    {
      ...baseProject,
      publishState: "archived",
    },
    { title: "Yeni başlık" },
  ).ok,
  false,
  "Archived proje güncellemesi kabul edildi.",
);

const authorized = guard.getProjectMutationContext({
  ok: true,
  user: { id: "owner-id" },
  profile: { userId: "owner-id", role: "owner" },
  assuranceLevel: "aal2",
});
check(authorized.ok, "Active owner + AAL2 reddedildi.");

for (const authorization of [
  { ok: false, reason: "unauthenticated" },
  { ok: false, reason: "unauthorized" },
  { ok: false, reason: "mfa_required" },
  {
    ok: true,
    user: { id: "owner-id" },
    profile: { userId: "other-id", role: "owner" },
    assuranceLevel: "aal2",
  },
]) {
  equal(
    guard.getProjectMutationContext(authorization).ok,
    false,
    "Owner/AAL2 mutation sınırı bypass edildi.",
  );
}

const conflict = databaseErrors.mapProjectDatabaseError({
  code: "23505",
  message:
    'duplicate key value violates unique constraint "projects_slug_key"',
  details: "Key (slug)=(secret-project) already exists.",
});
equal(conflict.ok, false);
if (!conflict.ok) {
  equal(conflict.error.code, "slug_conflict");
  equal(
    JSON.stringify(conflict).includes("secret-project"),
    false,
    "Raw database ayrıntısı domain hatasına sızdı.",
  );
}

const serverSource = fs.readFileSync(
  path.join(
    root,
    "src/features/projects/server/project-mutations.ts",
  ),
  "utf8",
);

check(
  serverSource.includes("getStudioAuthorization"),
  "Mutation service Studio authorization helper kullanmıyor.",
);
check(
  serverSource.includes("createServerSupabaseClient"),
  "Mutation service normal owner Supabase client kullanmıyor.",
);
equal(
  serverSource.includes("SUPABASE_SERVICE_ROLE_KEY"),
  false,
  "Mutation service service-role secret referansı içeriyor.",
);
equal(
  /\.delete\s*\(/.test(serverSource),
  false,
  "Project mutation service hard delete içeriyor.",
);
check(
  serverSource.includes('publish_state: "draft"'),
  "Create mutation draft state'i server-side zorlamıyor.",
);
check(
  serverSource.includes('.eq("owner_id", context.ownerId)'),
  "Owner row filtresi mutation update sınırında yok.",
);

console.log(
  `Sprint 07 project domain verification passed (${assertions} assertions).`,
);
