import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { writingSlugFromTitle } from "../src/features/studio/writings/writing-slug.ts";
import { validateCreateWritingInput, validateUpdateWritingInput } from "../src/features/writings/validation.ts";

const read = (path) => readFileSync(path, "utf8");
const valid = {
  title: "Yetişmeye Çalışırken Kaçırdığımız Hayat",
  slug: "yetismeye-calisirken-kacirdigimiz-hayat",
  excerpt: "Kendi zamanını yakalamak.",
  content: "Birinci paragraf.\n\nİkinci paragraf.",
  category: "Kişisel Deneme",
  tags: ["yaşam"],
  readingTime: 5,
  visibility: "public",
  isFeatured: false,
  coverImageUrl: null,
};

test("Turkish title generates URL-safe slug, with empty-title fallback", () => {
  assert.equal(writingSlugFromTitle(valid.title), valid.slug);
  assert.equal(writingSlugFromTitle("İ Ç Ğ Ü Ş Ö 123"), "i-c-g-u-s-o-123");
  assert.equal(writingSlugFromTitle("   "), "yazi");
  assert.ok(writingSlugFromTitle("a".repeat(240)).length <= 120);
});

test("existing writing validation still rejects missing critical data and checks visibility", () => {
  assert.equal(validateCreateWritingInput(valid).ok, true);
  assert.equal(validateCreateWritingInput({ ...valid, visibility: "invalid" }).ok, false);
  assert.equal(validateCreateWritingInput({ ...valid, slug: "NOT-VALID" }).ok, false);
  assert.equal(validateUpdateWritingInput({ visibility: "private" }).ok, true);
});

test("form no longer exposes manual slug, URL or redundant public-image checkbox", () => {
  const form = read("src/features/studio/writings/writing-form.tsx");
  assert.ok(form.includes('name="title"'));
  assert.ok(form.includes("<MarkdownEditor"));
  assert.ok(read("src/features/studio/writings/markdown-editor.tsx").includes('name="content"'));
  assert.ok(form.includes('name="excerpt"'));
  assert.ok(form.includes('name="visibility"'));
  assert.ok(!form.includes('name="slug"'));
  assert.ok(form.includes('type="hidden" name="coverImageUrl"'));
  assert.ok(!form.includes('type="url"'));
  assert.ok(form.includes('<UploadForm image streamlinedPublicImage'));
  assert.ok(form.includes("onBusyChange={setUploading}"));
  assert.ok(form.includes("disabled={uploading}"));
  assert.ok(!form.includes('name="publicConsent"'));
  assert.ok(form.includes("Makale önizlemesi"));
  assert.ok(form.includes('value="private"') && form.includes('value="public"'));
  assert.ok(!form.includes('value="hidden"'));
});

test("writing action generates collision-safe slug, and updates do not edit slug", () => {
  const actions = read("src/features/studio/writings/actions.ts");
  assert.ok(actions.includes("writingSlugFromTitle(input.title)"));
  assert.ok(actions.includes('result.error.code !== "slug_conflict"'));
  assert.ok(actions.includes("createWritingDraft({ ...input, slug })"));
  assert.ok(!actions.includes('readText(formData, "slug")'));
  assert.ok(actions.includes("updateWriting(writingId, readWritingInput(formData))"));
});

test("server publication validates title, excerpt, content and ownership of public covers", () => {
  const publication = read("src/features/writings/server/writing-publication.ts");
  const mutation = read("src/features/writings/server/writing-mutations.ts");
  assert.ok(publication.includes("input.excerpt.trim()"));
  assert.ok(publication.includes("input.content.trim()"));
  assert.ok(publication.includes('publicImageUrl(input.coverImageUrl)'));
  assert.ok(publication.includes('.eq("owner_id", ownerId)'));
  assert.ok(publication.includes('.eq("storage_bucket", "public-assets")'));
  assert.ok(publication.includes('.eq("upload_status", "uploaded")'));
  assert.ok(publication.includes('db.storage.from("public-assets").info(path)'));
  assert.ok(mutation.includes('publish_state: imageApproval ? "published" : "draft"'));
  assert.ok(mutation.includes('payload.publish_state = "published"'));
  assert.ok(mutation.includes('payload.publish_state = "unpublished"'));
  assert.ok(mutation.includes('payload.image_approval_state = verification.data.imageApproval'));
});

test("archive is preserved; manual review and publish workflow no longer displayed", () => {
  const edit = read("src/app/(studio)/studio/writings/[writingId]/edit/page.tsx");
  const workflow = read("src/features/studio/writings/writing-workflow-actions.tsx");
  const list = read("src/app/(studio)/studio/writings/page.tsx");
  assert.ok(edit.includes("<WritingWorkflowActions"));
  assert.ok(!edit.includes("PublicationReview"));
  assert.ok(!edit.includes("getAllowedWritingTransitions"));
  assert.ok(workflow.includes("archiveWritingAction"));
  assert.ok(!workflow.includes("transitionWritingAction"));
  assert.ok(!workflow.includes("TransitionForm"));
  assert.ok(list.includes('title="Yazılarım"'));
  assert.ok(!list.includes("Sprint 08 CRUD"));
});

test("Markdown renderer escapes user content rather than injecting HTML", () => {
  const renderer = read("src/features/writings/markdown-content.tsx");
  const editor = read("src/features/studio/writings/markdown-editor.tsx");
  for (const token of ["<blockquote", "<ul", "<ol", "<hr", "<strong", "<em"]) assert.ok(renderer.includes(token));
  assert.ok(!renderer.includes("dangerouslySetInnerHTML"));
  assert.ok(!renderer.includes("innerHTML"));
  assert.ok(!renderer.includes("href="));
  assert.ok(editor.includes('name="content"'));
  assert.ok(editor.includes('value={value}'));
});
test("form fields remain mapped through create/update action and edit hydration", () => {
  const actions = read("src/features/studio/writings/actions.ts");
  const form = read("src/features/studio/writings/writing-form.tsx");
  const edit = read("src/app/(studio)/studio/writings/[writingId]/edit/page.tsx");
  for (const field of ["title","excerpt","category","visibility","readingTime","tags","isFeatured","coverImageUrl"]) {
    assert.ok(actions.includes('"' + field + '"'), field + " action");
    assert.ok(form.includes('name="' + field + '"'), field + " form");
    assert.ok(edit.includes(field + ": writing."), field + " edit");
  }
  assert.ok(edit.includes("content: writing.content"));
  assert.ok(actions.includes('content: readText(formData, "content")'));
});

test("public article TOC uses Markdown headings and matching content anchors", () => {
  const page = read("src/app/(public)/writings/[slug]/page.tsx");
  const markdown = read("src/features/writings/markdown-content.tsx");
  assert.ok(page.includes("markdownHeadings(section.paragraphs.join("));
  assert.ok(page.includes("toc.map("));
  assert.ok(page.includes("toc.length > 0"));
  assert.ok(page.includes("headingPrefix={section.id}"));
  assert.ok(markdown.includes('headingPrefix + "-heading-" + headingIndex++'));
  assert.ok(markdown.includes('prefix + "-heading-" + index++'));
  assert.ok(markdown.includes("id={id}"));
});
test("Studio writing and project edits provide quick links to create another", () => {
  const writing = read("src/app/(studio)/studio/writings/[writingId]/edit/page.tsx");
  const project = read("src/app/(studio)/studio/projects/[projectId]/edit/page.tsx");
  assert.ok(writing.includes('href="/studio/writings/new"'));
  assert.ok(writing.includes("Yeni yazı ekle"));
  assert.ok(project.includes('href="/studio/projects/new"'));
  assert.ok(project.includes("Yeni proje ekle"));
});

test("writing status labels retain natural width beside card heading", () => {
  const card = read("src/features/studio/writings/writing-card.tsx");
  assert.ok(card.includes("flex flex-wrap items-start justify-between gap-4"));
  assert.ok(card.includes("shrink-0 self-start"));
  assert.ok(card.includes("<StudioStatusPill"));
});
