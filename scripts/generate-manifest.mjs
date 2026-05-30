#!/usr/bin/env node
/**
 * Generate the content-addressed MCP layout for datamancy.dev.
 *
 * For each spell (<dir>/SKILL.md):
 *   - SHA-256 the content, write an immutable blob at blobs/sha256/<hash>
 *     (skipped if it already exists — unchanged spells dedupe across versions)
 *   - add a resource entry carrying the live `uri` (pretty, browsable) AND
 *     the immutable `blob` URL
 *
 * Then emit the "latest" manifest at .well-known/mcp/manifest.json carrying:
 *   - schemaVersion — so the FORMAT can evolve independently of the URLs
 *   - epoch — unix seconds, a monotonic version stamp
 *   - previous — hash of the last PUBLISHED manifest (the chain backpointer,
 *     read from .well-known/mcp/HEAD; null at genesis). History is the chain
 *     of immutable manifests — git's parent links — so there is no growing
 *     index file.
 *
 * This script does NOT write the immutable manifests/<hash>/ snapshot or
 * advance HEAD — that happens in sign-manifest.mjs, after the bytes are
 * final and signed. Re-running generate only refreshes `latest` + blobs; it
 * never litters immutable snapshots.
 *
 * Layout (stable, storage-agnostic — maps 1:1 to object-store keys, so a
 * future move to R2/S3 is a copy + route, not a redesign):
 *   blobs/sha256/<hash>                  immutable content, append-only
 *   manifests/<manifest-hash>/...        immutable versions (written by sign)
 *   .well-known/mcp/manifest.json(.sig)  the moving "latest" pointer
 *   .well-known/mcp/HEAD                 the published chain head (a hash)
 *   <spell>/SKILL.md                     pretty human tree (the `uri` target)
 *
 * Run from repo root: `npm run manifest:generate`, then `npm run manifest:sign`.
 */

import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  stat,
  access,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";

const REPO_ROOT = process.cwd();
const SCHEMA_VERSION = 1;

const MANIFEST = ".well-known/mcp/manifest.json";
const HEAD = ".well-known/mcp/HEAD";
const BLOBS_DIR = "blobs/sha256";

// Top-level entries that are never spells.
const SKIP = new Set([
  "node_modules",
  "scripts",
  ".well-known",
  "blobs",
  "manifests",
  ".git",
  ".github",
]);

function gitShortSha() {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function readHead() {
  try {
    return (await readFile(HEAD, "utf-8")).trim() || null;
  } catch {
    return null;
  }
}

async function main() {
  const commit = gitShortSha();
  const prevHash = await readHead();

  // Epoch MUST strictly increase per published manifest — the consumer's
  // rollback protection depends on monotonicity. Use wall-clock seconds, but if
  // a prior manifest exists, force at least prevEpoch + 1, so two publishes in
  // the same second (or a backward clock) can never emit a non-increasing
  // epoch. Rigid at the source, not left to chance.
  const now = Math.floor(Date.now() / 1000);
  let epoch = now;
  if (prevHash) {
    try {
      const prev = JSON.parse(
        await readFile(join("manifests", prevHash, "manifest.json"), "utf-8"),
      );
      if (typeof prev.epoch === "number") {
        epoch = Math.max(now, prev.epoch + 1);
      }
    } catch {
      // No readable prior snapshot — treat as the genesis baseline.
    }
  }

  // ISO8601 version label, tag-safe (colons → dashes): 2026-05-30T21-42-00Z.
  // Sorts chronologically, reads cleanly, and is a valid git tag + path.
  const version = new Date(epoch * 1000)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replace(/:/g, "-");

  await mkdir(BLOBS_DIR, { recursive: true });

  const entries = await readdir(REPO_ROOT, { withFileTypes: true });
  const resources = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".")) continue;
    if (SKIP.has(entry.name)) continue;

    const skillPath = join(REPO_ROOT, entry.name, "SKILL.md");
    let s;
    try {
      s = await stat(skillPath);
    } catch {
      continue; // no SKILL.md — not a spell
    }
    if (!s.isFile()) continue;

    const buf = await readFile(skillPath);
    const sha256 = createHash("sha256").update(buf).digest("hex");

    // Immutable, content-addressed blob. Unchanged spells already have it.
    const blobPath = join(BLOBS_DIR, sha256);
    if (!(await exists(blobPath))) await writeFile(blobPath, buf);

    // Origin-AGNOSTIC paths, not absolute URLs. The consumer resolves them
    // against whatever origin it's pointed at (datamancy.dev by default, or
    // an org's own mirror via DATAMANCY_SITE). The signed manifest carries no
    // hostname, so the exact same signed bytes verify wherever they're served
    // — clone the snapshot, host it yourself, still provably authentic.
    resources.push({
      name: entry.name,
      uri: `${entry.name}/SKILL.md`,
      blob: `${BLOBS_DIR}/${sha256}`,
      mimeType: "text/markdown",
      sha256,
      size: buf.byteLength,
    });
  }

  // Deterministic ordering so the manifest bytes only change when content
  // (or epoch/previous) changes.
  resources.sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    serverInfo: { name: "datamancy.dev", version, commit },
    practitioner: "https://datamancer.dev",
    epoch,
    previous: prevHash ? `sha256:${prevHash}` : null,
    trust: { algorithm: "SHA-256", tier: 2, signed: true },
    resources,
  };

  await mkdir(dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

  console.error(
    `[generate-manifest] ${resources.length} spells, version ${version}, ` +
      `schemaVersion ${SCHEMA_VERSION} (commit ${commit})`,
  );
  console.error(
    `[generate-manifest] previous: ${manifest.previous ?? "(genesis)"}`,
  );
  console.error(`[generate-manifest] wrote ${MANIFEST} + blobs → ${BLOBS_DIR}/`);
  console.error(`[generate-manifest] next: \`npm run manifest:sign\``);
}

main().catch((err) => {
  console.error("[generate-manifest] FATAL:", err);
  process.exit(1);
});
