#!/usr/bin/env node
//
// Generate grimoire/SKILL.md — the index spell of the datamancy practice.
//
// Reads every spell's metadata from the shared source of truth
// (scripts/lib/spells.mjs → each spell's SKILL.md frontmatter) and emits a
// scannable markdown index. The whole point: an LLM consumer loads THIS spell
// first (small), sees the catalog, then fetches specific spell SKILL.md files
// on demand. Each fetch is SHA-256 verified by the npm adapter; this is just
// the entry point. Output order: alphabetical by spell name.
//
//   npm run grimoire:regen          # write grimoire/SKILL.md
//   node scripts/generate-grimoire-skill.mjs --check   # drift gate, no write
//
// Naming: per intueri's verdict (2026-05-30). datamancy names the PRACTICE,
// grimoire is the BOOK of the practice — an LLM loading `grimoire` immediately
// knows to expect a collection of spells.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { readSpells } from "./lib/spells.mjs";

const OUTPUT_DIR = "grimoire";
const OUTPUT_FILE = "grimoire/SKILL.md";
const CHECK = process.argv.includes("--check");

function render(spells) {
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
    "Spells are **cast, not enacted**: the caster embeds a spell's `SKILL.md` verbatim into a subagent's prompt — the subagent reads it from context and never fetches the spell itself (a spawned worker may be sandboxed, with no network or MCP) — names the target, and the subagent applies the discipline and returns findings. The spell travels into the worker by value, not by reference. The orchestrator addresses the findings before shipping. The discipline lives in the spell; the casting is mechanical; pre-deciding the findings skips the discipline the spell exists to enforce.",
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
  return lines.join("\n");
}

async function main() {
  const spells = await readSpells();
  const next = render(spells);

  if (CHECK) {
    let current = "";
    try {
      current = await readFile(OUTPUT_FILE, "utf-8");
    } catch {
      /* missing file → drift */
    }
    if (current !== next) {
      console.error(
        `[generate-grimoire-skill] DRIFT: ${OUTPUT_FILE} is stale — run \`npm run grimoire:regen\``,
      );
      process.exit(1);
    }
    console.error(`[generate-grimoire-skill] ✓ ${OUTPUT_FILE} is current (${spells.length} spells)`);
    return;
  }

  await mkdir(join(process.cwd(), OUTPUT_DIR), { recursive: true });
  await writeFile(OUTPUT_FILE, next);
  console.error(`[generate-grimoire-skill] wrote index of ${spells.length} spells to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("[generate-grimoire-skill] FATAL:", err instanceof Error ? err.message : err);
  process.exit(1);
});
