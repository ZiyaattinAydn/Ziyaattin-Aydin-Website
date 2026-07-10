import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const require = createRequire(import.meta.url);

function loadStandaloneTypeScriptModule(relativePath) {
  const filename = path.join(root, relativePath);
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
    `TypeScript transpile diagnostics found in ${relativePath}`,
  );

  const commonJsModule = { exports: {} };
  const wrapper = vm.runInThisContext(
    `(function (exports, module, require, __filename, __dirname) {${outputText}\n})`,
    { filename },
  );

  wrapper(
    commonJsModule.exports,
    commonJsModule,
    require,
    filename,
    path.dirname(filename),
  );

  return commonJsModule.exports;
}

function withEnvironment(overrides, callback) {
  const keys = Object.keys(overrides);
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );

  try {
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }

    callback();
  } finally {
    for (const key of keys) {
      const value = previous[key];

      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

const environment = loadStandaloneTypeScriptModule(
  "src/lib/supabase/environment.ts",
);
const redirects = loadStandaloneTypeScriptModule(
  "src/lib/auth/safe-redirect.ts",
);
const authorization = loadStandaloneTypeScriptModule(
  "src/lib/auth/studio-authorization-rules.ts",
);

withEnvironment(
  {
    NEXT_PUBLIC_SUPABASE_URL: undefined,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined,
  },
  () => {
    assert.equal(environment.isSupabaseConfigured(), false);
    assert.throws(
      () => environment.getSupabasePublicEnvironment(),
      (error) =>
        error?.name === "SupabaseConfigurationError" &&
        error?.code === "SUPABASE_NOT_CONFIGURED" &&
        !error.message.includes("NEXT_PUBLIC_"),
    );
  },
);

withEnvironment(
  {
    NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-placeholder",
  },
  () => {
    assert.equal(environment.isSupabaseConfigured(), false);
  },
);

withEnvironment(
  {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-placeholder",
  },
  () => {
    assert.equal(environment.isSupabaseConfigured(), true);
    assert.deepEqual(environment.getSupabasePublicEnvironment(), {
      url: "https://example.supabase.co",
      publishableKey: "public-placeholder",
    });
  },
);

assert.equal(
  redirects.getSafeRedirectPath("/studio/projects?view=active"),
  "/studio/projects?view=active",
);
for (const unsafeTarget of [
  "https://evil.example",
  "//evil.example",
  "/\\evil.example",
  "/%2fevil.example",
  "/%5cevil.example",
  "javascript:alert(1)",
]) {
  assert.equal(
    redirects.getSafeRedirectPath(unsafeTarget),
    "/studio",
    `Unsafe redirect target accepted: ${unsafeTarget}`,
  );
}

assert.equal(authorization.hasRequiredStudioAssurance("aal1"), false);
assert.equal(authorization.hasRequiredStudioAssurance("aal2"), true);
assert.equal(authorization.hasRequiredStudioAssurance("future-aal"), false);

assert.equal(
  authorization.isActiveOwnerProfile(
    { user_id: "owner-id", role: "owner", status: "active" },
    "owner-id",
  ),
  true,
);
assert.equal(
  authorization.isActiveOwnerProfile(
    { user_id: "owner-id", role: "admin", status: "active" },
    "owner-id",
  ),
  true,
);
for (const profile of [
  null,
  { user_id: "other-id", role: "owner", status: "active" },
  { user_id: "owner-id", role: null, status: "active" },
  { user_id: "owner-id", role: "owner", status: "pending" },
  { user_id: "owner-id", role: "member", status: "active" },
]) {
  assert.equal(
    authorization.isActiveOwnerProfile(profile, "owner-id"),
    false,
  );
}

const browserClientSource = fs.readFileSync(
  path.join(root, "src/lib/supabase/client.ts"),
  "utf8",
);
assert.equal(
  browserClientSource.includes("SUPABASE_SERVICE_ROLE_KEY"),
  false,
);
assert.equal(
  browserClientSource.includes("server-environment"),
  false,
);

const proxySource = fs.readFileSync(
  path.join(root, "src/proxy.ts"),
  "utf8",
);
assert.match(proxySource, /matcher:\s*\["\/login", "\/studio\/:path\*"\]/);
assert.match(proxySource, /status:\s*503/);

console.log("Supabase runtime verification passed.");
