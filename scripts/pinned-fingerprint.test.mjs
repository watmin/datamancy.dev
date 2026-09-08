/**
 * The pinned KMS public-key fingerprint is the constant the whole trust story
 * rests on: `publish.mjs` asserts the live signing key hashes to it before it
 * will sign, and consumers pin the matching key in the npm package. It is also
 * written out by hand in four places — the ship gate's constant, the shipped
 * page, and twice in CONTRIBUTING (once full, once truncated).
 *
 * Nothing asserted they agree. They matched by inspection, which is precisely
 * the state `circumspicere`'s own worked example names: a freeze-time
 * transcription slip would ship a self-inconsistent published trust root with a
 * green build, and a never-patched artifact cannot retract it.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(join(ROOT, p), "utf-8");
// Text files a fingerprint could plausibly be written into. Excludes blobs/ and
// manifests/ (content-addressed hashes that are not this fingerprint).
const SKIP = new Set(["node_modules", ".git", ".github", "blobs", "manifests", ".well-known"]);
function shippedTextFiles(dir = ".", out = []) {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const rel = dir === "." ? e.name : `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!SKIP.has(e.name)) shippedTextFiles(rel, out); }
    else if (/\.(md|html|txt|json|js|mjs|ts)$/.test(e.name)) out.push(rel);
  }
  return out;
}

// The load-bearing one: the constant publish.mjs refuses to sign without.
const shipGate = read("scripts/publish.mjs").match(/"([0-9a-f]{64})"/);
assert.ok(shipGate, "scripts/publish.mjs no longer carries a 64-hex pinned fingerprint");
const PINNED = shipGate[1];

test("every full-length fingerprint in the repo is the one the ship gate pins", () => {
  // Walk the repo, not a hand-list: a fifth site added later must be caught, and
  // a hand-list is invisible to the one thing it should catch.
  let seen = 0;
  for (const path of shippedTextFiles()) {
    for (const found of read(path).matchAll(/\b[0-9a-f]{64}\b/g)) {
      seen++;
      assert.equal(found[0], PINNED, `${path} carries a 64-hex constant that is not the pinned fingerprint`);
    }
  }
  // Without this the test iterates zero times and passes vacuously — delete the
  // constant from every doc and it would still be green.
  assert.ok(seen >= 2, `expected the full fingerprint in publish.mjs and CONTRIBUTING.md; found ${seen}`);
});

test("every truncated fingerprint is a real prefix of the pinned one", () => {
  // Truncated forms are display-only and are the easiest to mistype, because no
  // reader ever compares them against the full value.
  // Walking every truncated hex in the repo is wrong: the ledger and the publish
  // log quote truncated CONTENT hashes (`sha256:68a2f13b…`), which are not this
  // constant. The discriminator is CONTEXT — a truncation is a fingerprint claim
  // only when the surrounding text calls it one.
  let seen = 0;
  for (const path of shippedTextFiles()) {
    const text = read(path);
    for (const found of text.matchAll(/\b([0-9a-f]{8,32})(?:…|\.\.\.)/g)) {
      // Look only at what PRECEDES the hash. The ledger writes
      // "manifest head `sha256:68a2f13b…`; KMS-signed, fingerprint-verified against
      // the pinned trust root" — fingerprint words follow a CONTENT hash there, so a
      // window that reads forward misclassifies it. What a token IS, its own prefix says.
      const before = text.slice(Math.max(0, found.index - 60), found.index);
      if (/sha256:|head|manifest|blob|version/i.test(before)) continue; // a content hash
      if (!/fingerprint|pinned|trust root|public key/i.test(before)) continue;
      seen++;
      assert.ok(
        PINNED.startsWith(found[1]),
        `${path}: "${found[1]}…" sits in fingerprint context and is not a prefix of ${PINNED.slice(0, 16)}…`,
      );
    }
  }
  assert.ok(seen >= 2, `expected the truncated fingerprint in CONTRIBUTING.md and index.html; found ${seen}`);
});
