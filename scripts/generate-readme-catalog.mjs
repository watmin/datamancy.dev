#!/usr/bin/env node
//
// Generate the README spell catalog — the per-category tables only.
//
// The README's prose (what a spell is, casting, the four questions, the
// category headings + intros) is hand-written story and lives OUTSIDE the
// markers. The fact tables — which spell, its form, its one-phrase reading —
// are FACTS duplicated from each spell's frontmatter, so they are generated.
// This kills the drift class: edit a spell's `reading`, run this, and the
// README table is right by construction. You can never hand-maintain a row
// out of sync because you never hand-maintain a row.
//
// Each category region in README.md is delimited:
//   <!-- BEGIN catalog:<category> -->
//   ...generated table...
//   <!-- END catalog:<category> -->
//
//   npm run readme:regen                              # rewrite the tables
//   node scripts/generate-readme-catalog.mjs --check  # drift gate, no write
//
// Every spell's `category` MUST have a matching region, or this fails loud —
// a spell with nowhere to go is a red build, not a silent omission.

import { readFile, writeFile } from "node:fs/promises";
import { readSpells, FORM_LABEL } from "./lib/spells.mjs";

const README = "README.md";
const CHECK = process.argv.includes("--check");

const cell = (s) => String(s).replace(/\|/g, "\\|");

function tableFor(spells) {
  if (!spells.length) return "*(none yet)*";
  const rows = [
    "| Spell | Form | One-phrase reading |",
    "|---|---|---|",
    ...spells.map(
      (s) => `| **${cell(s.name)}** | ${cell(FORM_LABEL[s.form])} | ${cell(s.reading)} |`,
    ),
  ];
  return rows.join("\n");
}

function render(readmeSrc, spells) {
  // Which category regions does the README declare?
  const regions = [...readmeSrc.matchAll(/<!-- BEGIN catalog:([a-z0-9-]+) -->/g)].map(
    (m) => m[1],
  );
  if (!regions.length) {
    throw new Error(
      `${README} has no <!-- BEGIN catalog:<category> --> markers — nothing to generate`,
    );
  }
  const regionSet = new Set(regions);

  // Every spell must have a home. An orphan = a red build.
  const orphans = spells.filter((s) => !regionSet.has(s.category));
  if (orphans.length) {
    const detail = orphans
      .map((s) => `${s.name} (category: ${s.category})`)
      .join(", ");
    throw new Error(
      `spell(s) have no matching README catalog region: ${detail}. ` +
        `Add a <!-- BEGIN catalog:${orphans[0].category} --> section to ${README} ` +
        `or fix the spell's category.`,
    );
  }

  let out = readmeSrc;
  for (const category of regions) {
    const inCat = spells.filter((s) => s.category === category);
    if (!inCat.length) {
      console.error(`[generate-readme-catalog] warning: region "${category}" has no spells`);
    }
    const re = new RegExp(
      `(<!-- BEGIN catalog:${category} -->)[\\s\\S]*?(<!-- END catalog:${category} -->)`,
    );
    if (!re.test(out)) {
      throw new Error(`${README}: region catalog:${category} has a BEGIN but no END marker`);
    }
    out = out.replace(re, `$1\n\n${tableFor(inCat)}\n\n$2`);
  }
  return out;
}

async function main() {
  const spells = await readSpells();
  const current = await readFile(README, "utf-8");
  const next = render(current, spells);

  if (CHECK) {
    if (current !== next) {
      console.error(
        `[generate-readme-catalog] DRIFT: ${README} catalog is stale — run \`npm run readme:regen\``,
      );
      process.exit(1);
    }
    console.error(`[generate-readme-catalog] ✓ ${README} catalog is current (${spells.length} spells; + the grimoire index = ${spells.length + 1} dirs)`);
    return;
  }

  if (current === next) {
    console.error(`[generate-readme-catalog] ${README} catalog already current`);
    return;
  }
  await writeFile(README, next);
  console.error(`[generate-readme-catalog] updated ${README} catalog (${spells.length} spells; + the grimoire index = ${spells.length + 1} dirs)`);
}

main().catch((err) => {
  console.error("[generate-readme-catalog] FATAL:", err instanceof Error ? err.message : err);
  process.exit(1);
});
