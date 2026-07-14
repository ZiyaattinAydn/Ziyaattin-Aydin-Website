import assert from "node:assert/strict";
import test from "node:test";
import {
  getApprovedPublicImage,
  getApprovedPublicUrl,
} from "./approvals.ts";
import {
  hasPublicSupabaseConfiguration,
  resolvePublicContentSource,
} from "./source-policy.ts";
import {
  isPubliclyReadable,
  normalizeVisibility,
} from "./visibility.ts";

test("published public content with published_at is readable", () => {
  assert.equal(
    isPubliclyReadable({
      publishState: "published",
      visibility: "public",
      publishedAt: "2026-07-10T00:00:00.000Z",
    }),
    true,
  );
});

test("draft, private and missing published_at content are hidden", () => {
  assert.equal(
    isPubliclyReadable({
      publishState: "draft",
      visibility: "public",
      publishedAt: "2026-07-10T00:00:00.000Z",
    }),
    false,
  );

  assert.equal(
    isPubliclyReadable({
      publishState: "published",
      visibility: "private",
      publishedAt: "2026-07-10T00:00:00.000Z",
    }),
    false,
  );

  assert.equal(
    isPubliclyReadable({
      publishState: "published",
      visibility: "public",
      publishedAt: null,
    }),
    false,
  );
});

test("legacy unlisted visibility normalizes to hidden", () => {
  assert.equal(normalizeVisibility("unlisted"), "hidden");
});

test("only approved and valid links become public URLs", () => {
  assert.equal(
    getApprovedPublicUrl(
      "https://example.com/project",
      "approved",
    ),
    "https://example.com/project",
  );

  assert.equal(
    getApprovedPublicUrl(
      "https://example.com/private",
      "pending",
    ),
    null,
  );

  assert.equal(
    getApprovedPublicUrl("javascript:alert(1)", "approved"),
    null,
  );
});

test("unapproved portrait and image values are removed", () => {
  assert.equal(
    getApprovedPublicImage(
      {
        src: "/images/candidate.png",
        alt: "Candidate portrait",
      },
      "candidate",
    ),
    null,
  );

  assert.deepEqual(
    getApprovedPublicImage(
      {
        src: "/images/approved.png",
        alt: "Approved portrait",
      },
      "approved",
    ),
    {
      src: "/images/approved.png",
      alt: "Approved portrait",
      note: undefined,
    },
  );
});

test("production and missing source configuration default to mock", () => {
  assert.equal(
    resolvePublicContentSource({
      NODE_ENV: "production",
    }),
    "mock",
  );

  assert.equal(
    resolvePublicContentSource({
      NODE_ENV: "development",
    }),
    "mock",
  );

  assert.equal(
    resolvePublicContentSource({
      NODE_ENV: "production",
      VERCEL_ENV: "production",
      PUBLIC_CONTENT_SOURCE: "supabase",
    }),
    "mock",
  );
});

test("non-production Supabase source must be explicitly requested", () => {
  assert.equal(
    resolvePublicContentSource({
      NODE_ENV: "production",
      VERCEL_ENV: "preview",
      PUBLIC_CONTENT_SOURCE: "supabase",
    }),
    "supabase",
  );

  assert.equal(
    resolvePublicContentSource({
      NODE_ENV: "development",
      PUBLIC_CONTENT_SOURCE: "unexpected",
    }),
    "mock",
  );
});

test("Supabase project configuration requires both public values", () => {
  assert.equal(
    hasPublicSupabaseConfiguration({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-key",
    }),
    true,
  );

  assert.equal(
    hasPublicSupabaseConfiguration({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    }),
    false,
  );

  assert.equal(
    hasPublicSupabaseConfiguration({
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-key",
    }),
    false,
  );

  assert.equal(
    hasPublicSupabaseConfiguration({
      NEXT_PUBLIC_SUPABASE_URL: " ",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: " ",
    }),
    false,
  );
});
