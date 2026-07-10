import fs from "node:fs";

function source(path) {
  if (!fs.existsSync(path)) {
    throw new Error("Missing required file: " + path);
  }
  return fs.readFileSync(path, "utf8");
}

const storageMigration = source(
  "supabase/migrations/202607100004_storage_setup.sql",
);

if (!storageMigration.includes("on conflict (id) do update")) {
  throw new Error("Storage migration is not idempotent.");
}

if (storageMigration.toLowerCase().includes("create policy")) {
  throw new Error(
    "Hosted storage policy DDL must remain in the Dashboard runbook.",
  );
}

const storageRunbook = source(
  "docs/studio/STUDIO_STORAGE_POLICY_RUNBOOK.md",
);

const policyNames = [
  "public_assets_public_read",
  "public_assets_owner_insert",
  "public_assets_owner_update",
  "public_assets_owner_delete",
  "private_files_owner_read",
  "private_files_owner_insert",
  "private_files_owner_update",
  "private_files_owner_delete",
];

for (const policyName of policyNames) {
  if (!storageRunbook.includes(policyName)) {
    throw new Error("Missing Storage policy runbook entry: " + policyName);
  }
}

const seed = source("supabase/seed/202607100001_development_seed.sql");

if (seed.includes("REPLACE_WITH_OWNER_UUID")) {
  throw new Error("Development seed still contains an owner UUID placeholder.");
}

if (!seed.includes("into strict parsed_owner_uuid")) {
  throw new Error("Development seed does not fail closed on owner ambiguity.");
}

const handoff = source(
  "docs/handoffs/2026-07-10-studio-auth-mfa-s06.md",
);

if (!handoff.includes("S06_STUDIO_OK")) {
  throw new Error("Final Studio handoff is missing S06_STUDIO_OK.");
}

const authorization = source("src/lib/auth/studio-authorization.ts");

if (
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(authorization) ||
  authorization.includes("SUPABASE_SERVICE_ROLE_KEY")
) {
  throw new Error(
    "Studio authorization contains a forbidden identity or service role.",
  );
}

console.log("S06_STUDIO_FINAL_STATIC_OK");
