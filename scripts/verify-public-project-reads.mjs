import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import {
  createSupabasePublicContentRepository,
} from "../src/features/public/content/supabase-repository.ts";

function readArgument(name) {
  const index = process.argv.indexOf(name);

  if (index === -1) {
    return null;
  }

  const value = process.argv[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a slug value.`);
  }

  return value;
}

function readRepeatedArguments(name) {
  const values = [];

  for (let index = 0; index < process.argv.length; index += 1) {
    if (process.argv[index] !== name) {
      continue;
    }

    const value = process.argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`${name} requires a slug value.`);
    }

    values.push(value);
  }

  return values;
}

function requireEnvironment(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for hosted development verification.`);
  }

  return value;
}

function createAnonymousQueryReader(supabase) {
  return {
    async execute(request) {
      let query = supabase
        .from(request.table)
        .select(request.columns.join(","));

      for (const filter of request.filters) {
        if (filter.operator === "eq") {
          query = query.eq(filter.column, filter.value);
          continue;
        }

        if (filter.operator === "not") {
          query = query.not(filter.column, "is", null);
          continue;
        }

        query = query.in(filter.column, [...filter.value]);
      }

      for (const order of request.order ?? []) {
        query = query.order(order.column, {
          ascending: order.ascending,
          ...(order.nullsFirst === undefined
            ? {}
            : { nullsFirst: order.nullsFirst }),
        });
      }

      if (request.limit !== undefined) {
        query = query.limit(request.limit);
      }

      if (request.result === "maybe-single") {
        const response = await query.maybeSingle();

        return {
          data: response.data,
          error: response.error,
        };
      }

      const response = await query;

      return {
        data: response.data ?? [],
        error: response.error,
      };
    },
  };
}

if (process.env.PUBLIC_CONTENT_SOURCE !== "supabase") {
  throw new Error(
    "PUBLIC_CONTENT_SOURCE must be set to supabase for this verifier.",
  );
}

const supabaseUrl = requireEnvironment(
  "NEXT_PUBLIC_SUPABASE_URL",
);
const publishableKey = requireEnvironment(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
);

const supabase = createClient(supabaseUrl, publishableKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
});

const repository = createSupabasePublicContentRepository(
  createAnonymousQueryReader(supabase),
);

const projects = await repository.listProjects();

assert.ok(
  projects.length > 0,
  "At least one development-only published/public project is required.",
);

for (const project of projects) {
  assert.equal(project.publishState, "published");
  assert.equal(project.visibility, "public");
  assert.equal(project.image, null);

  for (const link of [
    project.links.github.href,
    project.links.demo.href,
  ]) {
    if (!link) {
      continue;
    }

    const url = new URL(link);
    assert.ok(
      url.protocol === "https:" || url.protocol === "http:",
      "Only HTTP/HTTPS approved links may be exposed.",
    );
    assert.equal(url.username, "");
    assert.equal(url.password, "");
  }
}

const requestedPublishedSlug =
  readArgument("--published-slug") ?? projects[0].slug;
const detail = await repository.getProjectBySlug(
  requestedPublishedSlug,
);

assert.ok(
  detail,
  `Published project detail was not readable: ${requestedPublishedSlug}`,
);
assert.equal(detail.slug, requestedPublishedSlug);

const unknownSlug = "public-verifier-record-does-not-exist";
assert.equal(
  await repository.getProjectBySlug(unknownSlug),
  null,
);

for (const hiddenSlug of readRepeatedArguments("--hidden-slug")) {
  assert.equal(
    await repository.getProjectBySlug(hiddenSlug),
    null,
    `Non-public development record became readable: ${hiddenSlug}`,
  );
}

console.log("PUBLIC_PROJECT_HOSTED_READ_OK");
console.log(`visible_project_count=${projects.length}`);
console.log(`verified_published_slug=${requestedPublishedSlug}`);
console.log(
  `verified_hidden_slug_count=${readRepeatedArguments("--hidden-slug").length}`,
);
