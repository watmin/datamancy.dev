#!/usr/bin/env node
//
// Generate the category overview inside llms.txt — the agent map's
// "what disciplines exist, grouped by category" block.
//
// llms.txt's prose (the trust model, how to add the MCP, the pointers) is
// hand-written narrative and lives OUTSIDE the markers. The category overview —
// which categories exist, what each means, and which spells fall under each — is
// FACTS derived from CATEGORY_META + each spell's frontmatter `category`, so it
// is generated. This kills the drift class that silently dropped the `primer`
// category from the hand-maintained map: you can never hand-type the category
// list out of sync because you never hand-type it.
//
// The generated block sits between:
//   <!-- BEGIN agent-categories -->
//   ...generated list...
//   <!-- END agent-categories -->
//
//   npm run llms:regen                       # rewrite the block
//   node scripts/generate-llms.mjs --check    # drift gate, no write

import { readFile, writeFile } from "node:fs/promises";
import { readSpells, CATEGORY_META } from "./lib/spells.mjs";

const LLMS = "llms.txt";
const BEGIN = "<!-- BEGIN agent-categories -->";
const END = "<!-- END agent-categories -->";
const CHECK = process.argv.includes("--check");

// One line per category, in CATEGORY_META key order, naming the spells that fall
// under it (sorted by name — readSpells already sorts). A category with no spells
// is skipped, not emitted empty.
function overview(spells) {
  const lines = [];
  for (const [category, meta] of Object.entries(CATEGORY_META)) {
    const names = spells
      .filter((s) => s.category === category)
      .map((s) => `\`${s.name}\``);
    if (!names.length) continue;
    lines.push(`- **${meta.label}** — ${meta.blurb} · ${names.join(" ")}`);
  }
  return lines.join("\n");
}

function render(src, spells) {
  // Every spell must fall under a known category. readSpells already gates
  // category ∈ CATEGORIES upstream, and CATEGORIES is CATEGORY_META's keys, so
  // an orphan here would be a deep invariant break — fail loud, never silent.
  const orphans = spells.filter((s) => !(s.category in CATEGORY_META));
  if (orphans.length) {
    throw new Error(
      `spell(s) with no CATEGORY_META entry: ${orphans
        .map((s) => `${s.name} (${s.category})`)
        .join(", ")}`,
    );
  }
  const re = new RegExp(`(${BEGIN})[\\s\\S]*?(${END})`);
  if (!re.test(src)) {
    throw new Error(`${LLMS}: missing \`${BEGIN}\` … \`${END}\` markers`);
  }
  return src.replace(re, `$1\n\n${overview(spells)}\n\n$2`);
}

async function main() {
  const spells = await readSpells();
  const current = await readFile(LLMS, "utf-8");
  const next = render(current, spells);

  if (CHECK) {
    if (current !== next) {
      console.error(
        `[generate-llms] DRIFT: ${LLMS} category overview is stale — run \`npm run llms:regen\``,
      );
      process.exit(1);
    }
    console.error(
      `[generate-llms] ✓ ${LLMS} category overview is current (${spells.length} spells)`,
    );
    return;
  }

  if (current === next) {
    console.error(`[generate-llms] ${LLMS} category overview already current`);
    return;
  }
  await writeFile(LLMS, next);
  console.error(
    `[generate-llms] updated ${LLMS} category overview (${spells.length} spells)`,
  );
}

main().catch((err) => {
  console.error("[generate-llms] FATAL:", err instanceof Error ? err.message : err);
  process.exit(1);
});
