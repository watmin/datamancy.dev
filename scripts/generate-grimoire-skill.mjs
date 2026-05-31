#!/usr/bin/env node
//
// Generate grimoire/SKILL.md — the index spell of the datamancy practice.
//
// Walks every <spell>/SKILL.md, extracts name + description from YAML
// frontmatter, emits a markdown index. The whole point: an LLM consumer
// loads THIS spell first (small, scannable), sees the catalog, then
// fetches specific spell SKILL.md files on demand. Each fetch is
// SHA-256 verified by the npm adapter; this is just the entry point.
//
// Output ordering: alphabetical by spell name.
//
// Run from the repo root: `npm run grimoire:regen`
//
// Naming: per intueri's verdict (2026-05-30). The user's bias was
// `datamancy`; intueri overrode — datamancy names the PRACTICE, grimoire
// is the BOOK of the practice. An LLM loading `grimoire` immediately
// knows what to expect (a collection of spells). Loading `datamancy`
// would have been ambiguous: index? manifesto? founding document?
//
// Workflow:
//   1. Edit / add spells
//   2. `npm run manifest:publish` (regens grimoire, regens manifest, signs)
//   3. git commit + push

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const REPO_ROOT = process.cwd();
const OUTPUT_DIR = "grimoire";
const OUTPUT_FILE = "grimoire/SKILL.md";

// Top-level entries that are NOT spell directories.
const SKIP = new Set([
  "node_modules",
  "scripts",
  ".well-known",
  ".git",
  ".github",
  "grimoire", // this script's own output; we generate it, don't read it
]);

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const yaml = match[1];

  // Extract `name:` and `description:` — single-line values in our spells.
  const nameMatch = yaml.match(/^name:\s*(.+)$/m);
  const descMatch = yaml.match(/^description:\s*(.+)$/m);

  if (!nameMatch || !descMatch) return null;

  return {
    name: nameMatch[1].trim(),
    description: descMatch[1].trim(),
  };
}

async function main() {
  const entries = await readdir(REPO_ROOT, { withFileTypes: true });
  const spells = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".")) continue;
    if (SKIP.has(entry.name)) continue;

    const skillPath = join(REPO_ROOT, entry.name, "SKILL.md");
    try {
      await stat(skillPath);
    } catch {
      continue;
    }

    const content = await readFile(skillPath, "utf-8");
    const fm = parseFrontmatter(content);
    if (!fm) {
      console.error(`[skip] ${entry.name}: missing or unparseable frontmatter`);
      continue;
    }

    spells.push(fm);
  }

  spells.sort((a, b) => a.name.localeCompare(b.name));

  const lines = [
    "---",
    "name: grimoire",
    "description: The grimoire index — the datamancer opens this first; it lists every spell in the practice with one-line descriptions, so the reader may load only what the task demands.",
    "---",
    "",
    "# Grimoire — the index of the datamancy practice",
    "",
    "> *grimoire* — the book of the practice. Load this first. Each spell below is named with a Latin verb (the act) or noun (the thing) and described in one line. To actually cast a spell, load its `<name>/SKILL.md` from this same server. Each fetch is SHA-256 verified against the signed manifest at `/.well-known/mcp/manifest.json`.",
    "",
    "## How to use",
    "",
    "The datamancy grimoire holds focused disciplines, each codified as a `SKILL.md` cast by an LLM subagent against a target file or tree. Loading every spell's full SKILL.md into context wastes tokens and obscures what each does. Loading just this grimoire index gives you the catalog — pick the spell that fits your need, then load its full discipline on demand.",
    "",
    "Spells are **cast, not enacted**: the subagent reads the SKILL.md, applies the discipline to the named target, returns findings. The orchestrator addresses the findings before shipping. The discipline lives in the spell; the casting is mechanical; pre-deciding the findings skips the discipline the spell exists to enforce.",
    "",
    "## The catalog",
    "",
    "*All spells alphabetical.*",
    "",
  ];

  for (const { name, description } of spells) {
    lines.push(`- **\`${name}\`** — ${description}`);
  }

  lines.push("");
  lines.push("## Trust");
  lines.push("");
  lines.push(
    "Every spell content fetched from this server is SHA-256 verified against the manifest at `/.well-known/mcp/manifest.json`, which is itself signed with **ECDSA P-256 over SHA-256** by a key held non-exportably in **AWS KMS** — the private key material never touches a disk and every signature is logged in CloudTrail. The matching public key is pinned in the [`datamancy`](https://www.npmjs.com/package/datamancy) npm package source. Tampered content cannot reach the LLM.",
  );
  lines.push("");
  lines.push(
    "Full design: [algebraic-intelligence.dev/docs/static-mcp/](https://github.com/watmin/algebraic-intelligence.dev/blob/main/docs/static-mcp/DESIGN.md).",
  );
  lines.push("");

  await mkdir(join(REPO_ROOT, OUTPUT_DIR), { recursive: true });
  await writeFile(OUTPUT_FILE, lines.join("\n"));

  console.error(
    `[generate-grimoire-skill] wrote index of ${spells.length} spells to ${OUTPUT_FILE}`,
  );
  console.error(
    "[generate-grimoire-skill] next: `npm run manifest:publish` (regens manifest + signs; grimoire becomes the 20th resource)",
  );
}

main().catch((err) => {
  console.error(
    "[generate-grimoire-skill] FATAL:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
