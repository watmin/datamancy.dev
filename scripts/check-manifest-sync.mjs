#!/usr/bin/env node
/**
 * Gate: the manifest must describe the tree that is on disk.
 *
 * It does NOT verify the manifest's signature — no public key lives in this repo,
 * only the 64-hex fingerprint, so verification needs the KMS fetch that
 * `publish.mjs` performs. This gate answers one question: does what was signed
 * match what is here.
 *
 * Five doc generators already gate "the indexes match the spell frontmatter" —
 * but every one of them regenerates FROM DISK, so they agree with each other by
 * construction and none can see the manifest. `generate-agent-ready.mjs` reads
 * the manifest and compares manifest-derived output to manifest-derived files,
 * which is the same closed loop from the other side. Nothing asserted
 * manifest <-> disk, and `npm run check:docs` went green over a tree carrying an
 * unpublished spell and two stale signed hashes.
 *
 * That green is not cosmetic. `functions/_middleware.js` sources the valid spell
 * set FROM THE MANIFEST for routing (it hashes nothing); the ADAPTER is what refuses
 * a body whose hash does not match. So pushing
 * regenerated indexes as an "infra" commit without `npm run ship` 404s the new
 * spell and makes the adapter REFUSE `grimoire/SKILL.md` — the START-HERE index —
 * on the maintainer's own bytes, exactly as llms.txt promises it would for an
 * attacker's.
 *
 * Deliberately NOT in `check:docs`: a working tree mid-authoring is legitimately
 * ahead of the manifest, and a gate that is red for the whole of normal work is a
 * gate people learn to ignore. It runs where drift is a DEFECT rather than a
 * state: in CI on a pushed commit, and in `publish.mjs` after signing.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const MANIFEST = ".well-known/mcp/manifest.json";
const problems = [];

if (!existsSync(MANIFEST)) {
  console.error(`[check-manifest-sync] ${MANIFEST} is missing — nothing to check against`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(MANIFEST, "utf-8"));
const resources = manifest.resources ?? [];
if (resources.length === 0) {
  console.error(`[check-manifest-sync] the manifest lists no resources — refusing to vouch for an empty set`);
  process.exit(1);
}

// A spell is a top-level directory holding a SKILL.md. NOTE this is NOT
// scripts/lib/spells.mjs's rule: that one applies a SKIP set (scripts, blobs,
// manifests, .well-known, and `grimoire`) plus frontmatter validation. This gate
// deliberately counts `grimoire` too, because the manifest publishes it. A
// SKILL.md landing under a SKIPped directory would make this gate red with no
// way to satisfy it — which is the right alarm, not a false one.
const onDisk = new Set(
  readdirSync(".", { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith(".") && existsSync(`${d.name}/SKILL.md`))
    .map((d) => d.name),
);
const inManifest = new Set(resources.map((r) => r.uri.replace(/^\//, "").split("/")[0]));

for (const name of [...onDisk].sort()) {
  if (!inManifest.has(name)) {
    problems.push(`${name}/SKILL.md is on disk and NOT in the signed manifest — it would 404 for every consumer while the indexes advertise it. Run \`npm run ship\`.`);
  }
}
for (const name of [...inManifest].sort()) {
  if (!onDisk.has(name)) {
    problems.push(`${name} is in the signed manifest and NOT on disk — the manifest advertises a spell this tree cannot serve.`);
  }
}

for (const r of resources) {
  const p = r.uri.replace(/^\//, "");
  if (!existsSync(p)) {
    problems.push(`${p} — listed in the manifest, absent from disk`);
    continue;
  }
  const actual = createHash("sha256").update(readFileSync(p)).digest("hex");
  const claimed = String(r.sha256 ?? "").replace(/^sha256:/, "");
  if (!claimed) {
    problems.push(`${p} — manifest entry carries no sha256`);
  } else if (actual !== claimed) {
    problems.push(`${p} — signed hash ${claimed.slice(0, 12)}… but disk is ${actual.slice(0, 12)}…; the adapter would REFUSE this file. Run \`npm run ship\`.`);
  }

  // The adapter's PINNED mode — the one it documents as strongest — fetches
  // `blob`, not `uri`. Checking only `uri` would print a pass over a tree where
  // every pinned consumer is broken.
  const blob = r.blob ? String(r.blob).replace(/^\//, "") : "";
  if (!blob) {
    problems.push(`${p} — manifest entry carries no blob path`);
  } else if (!existsSync(blob)) {
    problems.push(`${blob} — content-addressed blob for ${p} is missing; pinned-mode consumers cannot fetch it`);
  } else {
    const blobHash = createHash("sha256").update(readFileSync(blob)).digest("hex");
    if (blobHash !== actual) {
      problems.push(`${blob} — blob hashes ${blobHash.slice(0, 12)}… but ${p} is ${actual.slice(0, 12)}…; pinned mode and uri mode would serve different bytes`);
    }
  }
}

// "signed" is a claim, so measure what can be measured here — and no more. This
// asserts a snapshot EXISTS for these exact bytes: they were signed at some point.
// It does NOT open manifest.json.sig and cannot — no public key lives in this repo,
// so a manifest reverted to older signed bytes under a newer .sig passes here and
// fails every consumer. `sign-manifest.mjs` archives every signed
// manifest at manifests/<sha256 of the manifest bytes>/, so that directory exists
// iff THESE bytes were signed. Without this the gate prints "signed resources
// match disk" over a manifest regenerated by `manifest:generate` alone, under a
// .sig that no longer covers it — the exact infra-push case it exists to catch.
const manifestHash = createHash("sha256").update(readFileSync(MANIFEST)).digest("hex");
if (!existsSync(`manifests/${manifestHash}/manifest.json`)) {
  problems.push(
    `the manifest hashes to ${manifestHash.slice(0, 12)}… and no manifests/${manifestHash.slice(0, 12)}…/ snapshot exists — ` +
      `these bytes were never signed. \`npm run manifest:generate\` alone leaves the .sig covering older bytes.`,
  );
}

if (problems.length) {
  console.error(`[check-manifest-sync] the signed manifest does not describe this tree — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error(`\nThe manifest is the source of truth the site serves and the adapter verifies against.\nContent changes are published with \`npm run ship\`, never by committing regenerated indexes.`);
  process.exit(1);
}
console.error(`[check-manifest-sync] ✓ a signed snapshot exists for manifest ${manifestHash.slice(0, 12)}…; ${resources.length} resources match disk; ${onDisk.size} spell dirs, none unpublished`);
