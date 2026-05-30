#!/usr/bin/env node
/**
 * Generate .well-known/mcp/manifest.json for datamancy.dev.
 *
 * Walks every top-level directory looking for SKILL.md, computes the
 * SHA-256 + byte size of each, and emits a manifest with a resource
 * entry per spell. Sorted deterministically by spell name so the
 * manifest is byte-stable across regenerations (good for signing).
 *
 * Run from the repo root: `npm run manifest:generate`
 *
 * After regenerating, sign with `npm run manifest:sign`.
 */

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";

const REPO_ROOT = process.cwd();
const OUTPUT = ".well-known/mcp/manifest.json";
const SITE = "https://datamancy.dev";

// Top-level entries to skip — repo plumbing, not spells.
const SKIP = new Set([
  "node_modules",
  "scripts",
  ".well-known",
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

async function main() {
  const commit = gitShortSha();
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
      continue; // no SKILL.md in this directory, not a spell
    }
    if (!s.isFile()) continue;

    const buf = await readFile(skillPath);
    const sha256 = createHash("sha256").update(buf).digest("hex");

    resources.push({
      name: entry.name,
      uri: `${SITE}/${entry.name}/SKILL.md`,
      mimeType: "text/markdown",
      sha256,
      size: buf.byteLength,
      version: commit,
    });
  }

  // Deterministic ordering — manifest bytes are stable across runs as
  // long as content doesn't change. Important for signing.
  resources.sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    serverInfo: {
      name: "datamancy.dev",
      version: commit,
    },
    practitioner: "https://datamancer.dev",
    trust: {
      algorithm: "SHA-256",
      tier: 2,
      signed: true,
    },
    resources,
  };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(manifest, null, 2) + "\n");

  console.error(
    `[generate-manifest] wrote ${resources.length} resources to ${OUTPUT}`,
  );
  console.error(`[generate-manifest] version: ${commit}`);
  console.error(`[generate-manifest] next: run \`npm run manifest:sign\``);
}

main().catch((err) => {
  console.error("[generate-manifest] FATAL:", err);
  process.exit(1);
});
