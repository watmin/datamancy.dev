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
    "### Freshness",
    "",
    "The grimoire and every spell are served **live** — each read re-fetches the manifest and SHA-256 verifies it. The MCP resource *list*, by contrast, can lag: a long-lived client may hold a list cached from before a spell was minted or retired, until a read re-fetches the manifest and the server emits `list_changed`. So **read the grimoire fresh to learn what exists** — it is the live catalog, and reading it refreshes the list. Never trust a cached resource list for the current spell set.",
    "",
    "## How to cast — embed, never fetch",
    "",
    "Spells are **cast, not enacted**, and the casting has one load-bearing rule: **embed, never fetch.**",
    "",
    "**You — the orchestrator — read the spell from this server; your workers do not.** You can reach this MCP; a spawned sub-agent may not (sandboxed, headless, no network). Fetch a spell's `SKILL.md` here — it is SHA-256 verified against the signed manifest at fetch — and paste it **verbatim** into the sub-agent's prompt. The spell travels into the worker **by value**.",
    "",
    "- **The worker never fetches.** It reads the spell from its own prompt context — no MCP call, no file read, no network. If your design needs the worker to fetch the spell, the design is wrong.",
    "- **One spell per worker.** Each sub-agent gets exactly the discipline its task needs, embedded — not a bundle.",
    "",
    "**Anti-pattern — do NOT do this:** writing spells to a file on disk (or a concatenated \"all spells\" blob) and delegating *\"go read this file.\"* That casts **unverified** bytes — you have discarded the signature this whole server exists to provide — goes **stale** the instant any spell is republished, and bloats every worker with spells it will not cast. The signed manifest is the single source of truth; the orchestrator reading-and-verifying once, then embedding the verified bytes, is what carries the trust into the worker.",
    "",
    "**Fan-outs and workflows:** the orchestrator reads each needed spell once (verified), passes the verified text into the fan-out (e.g. as workflow `args`), and each agent's prompt embeds the one spell it casts. A **meta-spell** that summons others — e.g. `vigilia` fanning out its wards — becomes the shape of the workflow itself: one agent per ward, each embedding its own ward's `SKILL.md`, never a mono blob.",
    "",
    "The orchestrator addresses the findings before shipping. The discipline lives in the spell; the casting is mechanical; pre-deciding the findings skips the discipline the spell exists to enforce.",
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
    console.error(`[generate-grimoire-skill] ✓ ${OUTPUT_FILE} is current (${spells.length} spells; + the generated grimoire index = ${spells.length + 1} dirs)`);
    return;
  }

  await mkdir(join(process.cwd(), OUTPUT_DIR), { recursive: true });
  await writeFile(OUTPUT_FILE, next);
  console.error(`[generate-grimoire-skill] wrote index of ${spells.length} spells to ${OUTPUT_FILE} (+ the grimoire index itself = ${spells.length + 1} dirs on disk)`);
}

main().catch((err) => {
  console.error("[generate-grimoire-skill] FATAL:", err instanceof Error ? err.message : err);
  process.exit(1);
});
