// Regression tests for the spell-URL routing middleware (node:test, no deps).
//
// The pure decision functions carry the routing's whole logic; the live
// behaviour (301 / honest-404 / fall-through) is a thin shell over them. These
// lock the decisions that the phantom-200 fix established, so a future edit that
// reintroduces the bug — or 404s a real file like /auth.md — fails loud.
//
//   npm test   (node --test)

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseSpellRequest,
  prefersMarkdown,
  nearestSpell,
  notFoundBody,
} from "./_middleware.js";

test("parseSpellRequest: canonical /<name>/SKILL.md is strict + canonical", () => {
  assert.deepEqual(parseSpellRequest("/examinare/SKILL.md"), {
    name: "examinare",
    canonical: true,
    strict: true,
  });
});

test("parseSpellRequest: /grimoire/<name>/SKILL.md is a strict guess (301-able, 404-able)", () => {
  assert.deepEqual(parseSpellRequest("/grimoire/examinare/SKILL.md"), {
    name: "examinare",
    canonical: false,
    strict: true,
  });
});

test("parseSpellRequest: .md shorthand is NON-strict (probe before 404)", () => {
  for (const p of ["/examinare.md", "/grimoire/examinare.md"]) {
    assert.deepEqual(parseSpellRequest(p), {
      name: "examinare",
      canonical: false,
      strict: false,
    });
  }
});

test("parseSpellRequest: real top-level files never become a strict 404", () => {
  // /auth.md parses as a non-strict shorthand → unknown name falls through to a
  // probe, so the real file still serves (the F4 regression guard).
  assert.equal(parseSpellRequest("/auth.md").strict, false);
  // Uppercase names don't match the lowercase spell pattern at all → not routed.
  assert.equal(parseSpellRequest("/README.md"), null);
  assert.equal(parseSpellRequest("/CONTRIBUTING.md"), null);
});

test("parseSpellRequest: non-spell paths are not routed", () => {
  for (const p of [
    "/",
    "/xyzzy",
    "/.well-known/mcp/manifest.json",
    "/blobs/sha256/abc123",
    "/grimoire/SKILL.md", // the index IS a strict canonical name ('grimoire')
  ]) {
    const r = parseSpellRequest(p);
    if (p === "/grimoire/SKILL.md") {
      assert.deepEqual(r, { name: "grimoire", canonical: true, strict: true });
    } else {
      assert.equal(r, null);
    }
  }
});

test("prefersMarkdown: only an explicit md >= html preference flips it", () => {
  assert.equal(prefersMarkdown("text/markdown"), true);
  assert.equal(prefersMarkdown("text/markdown;q=0.9,text/html;q=0.8"), true);
  assert.equal(prefersMarkdown("text/html,text/markdown;q=0.5"), false);
  assert.equal(prefersMarkdown("*/*"), false); // curl / most libs — neutral
  assert.equal(prefersMarkdown("text/html"), false);
  assert.equal(prefersMarkdown(""), false);
  assert.equal(prefersMarkdown(null), false);
});

test("nearestSpell: suggests a close name, null when nothing is close", () => {
  const names = new Set(["examinare", "recolligere", "conferre", "vigilia"]);
  assert.equal(nearestSpell("examinaer", names), "examinare");
  assert.equal(nearestSpell("recolligre", names), "recolligere");
  assert.equal(nearestSpell("zzzzzzzz", names), null);
});

test("notFoundBody: names the spell and points at the catalog + hint", () => {
  const body = notFoundBody("sprint", "examinare");
  assert.match(body, /No such spell: `sprint`/);
  assert.match(body, /\/grimoire\/SKILL\.md/);
  assert.match(body, /\/llms\.txt/);
  assert.match(body, /Did you mean \*\*`examinare`\*\*/);
  // no hint → no "did you mean" line
  assert.doesNotMatch(notFoundBody("sprint", null), /Did you mean/);
});
