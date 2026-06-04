#!/usr/bin/env node
/**
 * publish — the whole grimoire publish flow in one command, fail-closed.
 *
 * This is the script form of the manual ceremony: regenerate the index,
 * regenerate + sign the manifest, PROVE the signature verifies against the
 * consumer-pinned key, commit + tag + push, wait for the live origin to serve
 * the new bytes, and PROVE what's actually served verifies too. Any gate that
 * fails aborts before the next — a manifest that can't be verified against the
 * pinned fingerprint never reaches a `git push`.
 *
 *   npm run ship                 # publish with a default message
 *   npm run ship -- "fix X"      # publish with a custom commit/tag annotation
 *
 * The only human prerequisite is a live signing session (the private key is
 * non-exportable in KMS, by design):
 *   aws sso login --sso-session datamancy
 *
 * Env (all optional): DATAMANCY_AWS_PROFILE (default datamancy-signer),
 * DATAMANCY_KMS_KEY (alias/datamancy-signing), DATAMANCY_KMS_REGION
 * (us-west-2), DATAMANCY_ORIGIN (https://datamancy.dev), DATAMANCY_NO_PUSH=1
 * (do everything up to and including local verify, then stop before push).
 */

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createPublicKey, createHash, verify } from "node:crypto";

const MANIFEST = ".well-known/mcp/manifest.json";
const SIGNATURE = ".well-known/mcp/manifest.json.sig";

// The trust root, published in three independent channels (npm package source,
// datamancer.dev, and DNS TXT _datamancy-key.datamancer.dev). The publish gate
// asserts the KMS signing key STILL hashes to this — so a key swap, a wrong
// alias, or a future mistake can never ship content consumers would reject.
const PINNED_FINGERPRINT =
  "09db7668a3a0ea27c52de060081c0a70584181c02f9eb94eff6941f904b5f12e";

const PROFILE = process.env.DATAMANCY_AWS_PROFILE ?? "datamancy-signer";
const KEY_ID = process.env.DATAMANCY_KMS_KEY ?? "alias/datamancy-signing";
const REGION = process.env.DATAMANCY_KMS_REGION ?? "us-west-2";
const ORIGIN = (process.env.DATAMANCY_ORIGIN ?? "https://datamancy.dev").replace(
  /\/$/,
  "",
);
const NO_PUSH = process.env.DATAMANCY_NO_PUSH === "1";
const POLL_ATTEMPTS = 40;
const POLL_INTERVAL_MS = 6000;

const note = process.argv.slice(2).join(" ").trim();

function log(...a) {
  console.error("[publish]", ...a);
}
function die(...a) {
  console.error("[publish] ABORT —", ...a);
  process.exit(1);
}

// Run a child script and stream its output (the generate/sign steps narrate).
function step(label, file) {
  log(`${label} …`);
  execFileSync("node", [file], { stdio: "inherit" });
}
// Run a command and capture stdout (git/aws).
function capture(cmd, args) {
  return execFileSync(cmd, args, { encoding: "utf-8" }).trim();
}

function sha256Hex(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

// The pinned public key, fetched fresh from KMS — the single source of truth.
// Returns a KeyObject plus the fingerprint (SHA-256 over the DER SPKI) so the
// caller can assert it equals PINNED_FINGERPRINT.
function kmsPublicKey() {
  const b64 = capture("aws", [
    "kms",
    "get-public-key",
    "--key-id",
    KEY_ID,
    "--region",
    REGION,
    "--profile",
    PROFILE,
    "--query",
    "PublicKey",
    "--output",
    "text",
  ]);
  const der = Buffer.from(b64, "base64");
  const key = createPublicKey({ key: der, format: "der", type: "spki" });
  return { key, fingerprint: sha256Hex(der) };
}

function verifyManifest(manifestBytes, sigBytes, key, where) {
  const ok = verify("sha256", manifestBytes, { key, dsaEncoding: "der" }, sigBytes);
  if (!ok) die(`signature does NOT verify (${where}) — refusing to proceed`);
  log(`✓ signature verifies against pinned key (${where})`);
}

async function main() {
  // ── 0. Prerequisite: a live signing session ────────────────────────────
  try {
    const who = capture("aws", [
      "sts",
      "get-caller-identity",
      "--profile",
      PROFILE,
      "--query",
      "Arn",
      "--output",
      "text",
    ]);
    log(`signer: ${who}`);
  } catch {
    die(
      `no AWS session for profile "${PROFILE}". Run: aws sso login --sso-session datamancy`,
    );
  }

  // ── 1. Generate + sign ─────────────────────────────────────────────────
  // Regenerate the content docs from the SINGLE source — `docs:regen` (grimoire
  // index + README catalog + llms.txt agent map). Reusing the npm script instead
  // of a hardcoded list here means a doc generator added to docs:regen can never
  // be silently skipped by the publish flow — which is exactly how llms.txt once
  // drifted (publish hardcoded grimoire+README and never got generate-llms).
  log("regenerating content docs (docs:regen) …");
  execFileSync("npm", ["run", "docs:regen"], { stdio: "inherit" });
  step("regenerating manifest", "scripts/generate-manifest.mjs");
  step("regenerating agent-discovery files", "scripts/generate-agent-ready.mjs");
  step("signing manifest via KMS", "scripts/sign-manifest.mjs");

  // ── 2. GATE: prove the fresh signature verifies against the pinned key ──
  const manifestBytes = readFileSync(MANIFEST);
  const sigBytes = readFileSync(SIGNATURE);
  const head = sha256Hex(manifestBytes);
  const { key, fingerprint } = kmsPublicKey();
  if (fingerprint !== PINNED_FINGERPRINT) {
    die(
      `KMS key fingerprint ${fingerprint} ≠ pinned ${PINNED_FINGERPRINT}. ` +
        `The signing key is NOT the one consumers trust — content would be rejected.`,
    );
  }
  log(`✓ KMS key fingerprint matches pinned trust root (${fingerprint.slice(0, 16)}…)`);
  verifyManifest(manifestBytes, sigBytes, key, "pre-push / local");

  const manifest = JSON.parse(manifestBytes);
  const version = manifest.serverInfo.version;
  log(`new head: sha256:${head}`);
  log(`version:  ${version}`);

  if (NO_PUSH) {
    log("DATAMANCY_NO_PUSH=1 — verified locally, stopping before push.");
    log(`to publish: git add . && git commit -m "publish ${version}" && git tag ${version} && git push --follow-tags`);
    return;
  }

  // ── 3. Commit + tag + push ─────────────────────────────────────────────
  const message = note
    ? `publish ${version} — ${note}`
    : `publish ${version}`;
  capture("git", ["add", "."]);
  // GATE: `git add .` is a blunt sweep. Refuse to publish if it staged patch/editor cruft —
  // a real stray riding a signed push is the failure the .rej phantom only mimicked. This
  // names the actual staged offenders and aborts; the verdict is bound to evidence, never a
  // free-floating "STRAY" that can desync from what's on disk.
  const staged = capture("git", ["diff", "--cached", "--name-only"]).split("\n").filter(Boolean);
  const cruft = staged.filter((f) =>
    /\.(rej|orig|swp|swo|bak)$|~$|(^|\/)\.DS_Store$|(^|\/)node_modules\//.test(f),
  );
  if (cruft.length) {
    die(
      `'git add .' staged stray/cruft files — refusing to publish:\n  ${cruft.join("\n  ")}\n` +
        `  remove or .gitignore them, then re-run.`,
    );
  }
  // GATE: only THIS publish's snapshot may be staged. A leftover
  // manifests/<other-hash>/ — e.g. from a NO_PUSH dry run — would otherwise ride
  // the signed push as a phantom version. `previous` already comes from git so a
  // stray cannot corrupt the chain; this keeps it from polluting the archive too.
  const orphanSnaps = staged.filter(
    (f) =>
      /^manifests\/[0-9a-f]{64}\//.test(f) &&
      !f.startsWith(`manifests/${head}/`),
  );
  if (orphanSnaps.length) {
    die(
      `staged a manifest snapshot that is not this publish (${head.slice(0, 16)}…) — ` +
        `likely a leftover dry-run snapshot:\n  ${orphanSnaps.join("\n  ")}\n` +
        `  remove the stray manifests/<hash>/ dir(s), then re-run.`,
    );
  }
  capture("git", ["commit", "-m", message]);
  capture("git", ["tag", version]);
  log(`committed + tagged ${version}; pushing …`);
  execFileSync("git", ["push", "--follow-tags"], { stdio: "inherit" });

  // ── 4. Wait for the live origin to serve the new bytes ─────────────────
  const url = `${ORIGIN}/.well-known/mcp/manifest.json`;
  log(`polling ${url} for sha256:${head.slice(0, 16)}… (Cloudflare redeploy)`);
  let live = false;
  for (let i = 1; i <= POLL_ATTEMPTS; i++) {
    try {
      const res = await fetch(url, { redirect: "error", cache: "no-store" });
      if (res.ok) {
        const got = sha256Hex(Buffer.from(await res.arrayBuffer()));
        if (got === head) {
          log(`✓ live after ${i} attempt(s)`);
          live = true;
          break;
        }
      }
    } catch {
      /* transient during redeploy — keep polling */
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  if (!live)
    die(
      `pushed, but origin has not served sha256:${head.slice(0, 16)}… after ` +
        `${POLL_ATTEMPTS} attempts — check the Cloudflare Pages deploy.`,
    );

  // ── 5. GATE: prove what is ACTUALLY SERVED verifies against the pin ────
  const liveManifest = Buffer.from(
    await (await fetch(url, { redirect: "error", cache: "no-store" })).arrayBuffer(),
  );
  const liveSig = Buffer.from(
    await (
      await fetch(`${url}.sig`, { redirect: "error", cache: "no-store" })
    ).arrayBuffer(),
  );
  if (sha256Hex(liveManifest) !== head)
    die("served manifest hash drifted mid-publish — aborting");
  verifyManifest(liveManifest, liveSig, key, "live / served");

  log("");
  log(`PUBLISHED ✓  ${ORIGIN}  →  version ${version}`);
  log(`head sha256:${head}`);
  log("every live consumer auto-updates on its next fetch — the kernel is untouched.");
}

main().catch((err) => {
  die(err instanceof Error ? err.message : String(err));
});
