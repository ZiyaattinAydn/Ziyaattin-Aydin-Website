import assert from "node:assert/strict";
import test from "node:test";
import {
  PROJECT_DETAIL_COLUMNS,
  PROJECT_LIST_COLUMNS,
  createSupabasePublicContentRepository,
} from "./supabase-repository.ts";
import {
  PublicRepositoryUnavailableError,
} from "./repository.ts";

function createProjectRow(overrides = {}) {
  return {
    id: "51000000-0000-4000-8000-000000000001",
    slug: "development-public-project",
    title: "Development Public Project",
    summary: "Development Supabase public read doğrulama kaydı.",
    problem: "Public project read sınırını doğrulamak.",
    approach: "RLS ve explicit query filtrelerini birlikte kullanmak.",
    highlights: ["Published/public list doğrulaması"],
    next_steps: ["Production cutover yapmamak"],
    status: "active",
    progress: 60,
    is_featured: true,
    github_url: null,
    demo_url: null,
    link_approval_state: "pending",
    visibility: "public",
    publish_state: "published",
    published_at: "2026-07-14T00:00:00.000Z",
    updated_at: "2026-07-14T00:00:00.000Z",
    image_url: "https://example.com/candidate.png",
    image_approval_state: "pending",
    ...overrides,
  };
}

function createReader(handler) {
  const requests = [];

  return {
    requests,
    reader: {
      async execute(request) {
        requests.push(request);
        return handler(request);
      },
    },
  };
}

test("project list uses explicit public-safe columns and mandatory filters", async () => {
  const fixture = createReader(() => ({
    data: [createProjectRow()],
    error: null,
  }));
  const repository = createSupabasePublicContentRepository(
    fixture.reader,
  );

  const projects = await repository.listProjects();
  assert.equal(projects.length, 1);

  const [request] = fixture.requests;
  assert.equal(request.table, "projects");
  assert.deepEqual(request.columns, PROJECT_LIST_COLUMNS);
  assert.equal(request.columns.includes("owner_id"), false);
  assert.equal(request.columns.includes("created_at"), false);
  assert.equal(request.columns.includes("*"), false);
  assert.deepEqual(request.filters, [
    { column: "visibility", operator: "eq", value: "public" },
    {
      column: "publish_state",
      operator: "eq",
      value: "published",
    },
    { column: "published_at", operator: "not", value: null },
  ]);
});

test("published public project detail opens by slug", async () => {
  const fixture = createReader(() => ({
    data: createProjectRow(),
    error: null,
  }));
  const repository = createSupabasePublicContentRepository(
    fixture.reader,
  );

  const project = await repository.getProjectBySlug(
    "development-public-project",
  );

  assert.equal(project?.slug, "development-public-project");
  assert.equal(project?.publishState, "published");
  assert.equal(project?.visibility, "public");

  const [request] = fixture.requests;
  assert.deepEqual(request.columns, PROJECT_DETAIL_COLUMNS);
  assert.deepEqual(request.filters.at(-1), {
    column: "slug",
    operator: "eq",
    value: "development-public-project",
  });
});

for (const [label, overrides] of [
  ["draft", { publish_state: "draft" }],
  ["review", { publish_state: "review" }],
  ["approved", { publish_state: "approved" }],
  ["unpublished", { publish_state: "unpublished" }],
  ["archived", { publish_state: "archived" }],
  ["hidden", { visibility: "hidden" }],
  ["private", { visibility: "private" }],
  ["missing published_at", { published_at: null }],
]) {
  test(`${label} project detail is indistinguishable from not found`, async () => {
    const fixture = createReader(() => ({
      data: createProjectRow(overrides),
      error: null,
    }));
    const repository = createSupabasePublicContentRepository(
      fixture.reader,
    );

    assert.equal(
      await repository.getProjectBySlug("non-public-project"),
      null,
    );
  });
}

test("unapproved links and project image are not exposed", async () => {
  const fixture = createReader(() => ({
    data: createProjectRow({
      github_url: "https://example.com/private-repository",
      demo_url: "https://example.com/pending-demo",
      link_approval_state: "pending",
    }),
    error: null,
  }));
  const repository = createSupabasePublicContentRepository(
    fixture.reader,
  );

  const project = await repository.getProjectBySlug(
    "development-public-project",
  );

  assert.equal(project?.links.github.href, null);
  assert.equal(project?.links.demo.href, null);
  assert.equal(project?.image, null);
});

test("approved valid project links are exposed without credentials", async () => {
  const fixture = createReader(() => ({
    data: createProjectRow({
      github_url: "https://example.com/repository",
      demo_url: "https://example.com/demo",
      link_approval_state: "approved",
    }),
    error: null,
  }));
  const repository = createSupabasePublicContentRepository(
    fixture.reader,
  );

  const project = await repository.getProjectBySlug(
    "development-public-project",
  );

  assert.equal(
    project?.links.github.href,
    "https://example.com/repository",
  );
  assert.equal(
    project?.links.demo.href,
    "https://example.com/demo",
  );
});

test("empty project list remains a safe empty result", async () => {
  const fixture = createReader(() => ({
    data: [],
    error: null,
  }));
  const repository = createSupabasePublicContentRepository(
    fixture.reader,
  );

  assert.deepEqual(await repository.listProjects(), []);
});

test("database failure becomes the generic unavailable domain error", async () => {
  const fixture = createReader(() => ({
    data: null,
    error: {
      message: "raw database detail that must not reach the UI",
    },
  }));
  const repository = createSupabasePublicContentRepository(
    fixture.reader,
  );

  await assert.rejects(
    repository.listProjects(),
    PublicRepositoryUnavailableError,
  );
});
