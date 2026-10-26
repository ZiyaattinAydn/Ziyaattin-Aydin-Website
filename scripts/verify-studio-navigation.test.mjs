import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { studioNavItems } from "../src/features/studio/studio-content.ts";
import { studioNavigationState } from "../src/features/studio/studio-navigation.ts";

test("each Studio section marks its own landing page as current", () => {
  for (const item of studioNavItems) {
    assert.deepEqual(studioNavigationState(item.href, item.href), {
      active: true,
      nested: false,
      currentPage: true,
    }, item.label);
  }
});

test("all sections with detail/editor pages return to their list root", () => {
  for (const item of studioNavItems.filter((i) => i.href !== "/studio")) {
    for (const suffix of ["/new", "/example/edit", "/example"]) {
      assert.deepEqual(studioNavigationState(item.href + suffix, item.href), {
        active: true,
        nested: true,
        currentPage: false,
      }, item.label + suffix);
    }
  }
});

test("section detection cannot match siblings or dashboard as parent", () => {
  assert.equal(studioNavigationState("/studio/projects-other", "/studio/projects").active, false);
  assert.equal(studioNavigationState("/studio/projects/new", "/studio/writings").active, false);
  assert.equal(studioNavigationState("/studio/projects/new", "/studio").active, false);
  assert.equal(studioNavigationState("/studio", "/studio/projects").active, false);
});

test("both desktop and mobile menus navigate to roots without bypassing unsaved guard", () => {
  const shell = readFileSync("src/components/studio/studio-shell.tsx", "utf8");
  const guard = readFileSync("src/features/studio/library/unsaved.ts", "utf8");
  assert.ok(shell.includes("router.push(href)"), "Nested page links should navigate explicitly to their root");
  assert.ok(shell.includes("onClick={(event) => openSectionRoot(event, item.href, nested)}"));
  assert.equal(shell.match(/onClick=\{\(event\) => openSectionRoot\(event, item.href, nested\)\}/g)?.length, 2);
  assert.ok(shell.includes('aria-current={currentPage ? "page" : undefined}'));
  assert.ok(guard.includes('window.confirm('), "Unsaved-change confirmation must remain active");
});
