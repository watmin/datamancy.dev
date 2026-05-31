// The single source of truth for "what spells exist and what they are."
//
// Both generators (the grimoire index and the README catalog) read spells
// from here, so a spell is described in exactly ONE place — its own
// SKILL.md frontmatter. Add a spell, fill its frontmatter, and every
// generated surface picks it up. Forget a field and the build fails loud,
// naming the spell — drift becomes a red build, never a silent stale table.

import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

// Top-level entries that are not spell directories.
const SKIP = new Set([
  "node_modules",
  "scripts",
  "blobs",
  "manifests",
  ".well-known",
  ".git",
  ".github",
  "grimoire", // generated output, not a hand-authored spell
]);

// Every spell MUST declare these. `description` feeds the grimoire index
// (the fuller line); `reading` feeds the README catalog (the one-phrase);
// `form` and `category` drive the catalog's typology + grouping.
const REQUIRED = ["name", "form", "category", "description", "reading"];
const FORMS = new Set(["act", "agent", "thing"]);

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const yaml = match[1];
  const field = (key) => {
    const m = yaml.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : null;
  };
  return Object.fromEntries(REQUIRED.map((k) => [k, field(k)]));
}

/**
 * Read + validate every spell. Returns an array sorted by name. Throws with
 * a message naming the offending spell if any required field is missing or a
 * `form` is outside the typology — so a half-catalogued spell can never ship.
 */
export async function readSpells(repoRoot = process.cwd()) {
  const entries = await readdir(repoRoot, { withFileTypes: true });
  const spells = [];
  const problems = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    if (SKIP.has(entry.name)) continue;

    const skillPath = join(repoRoot, entry.name, "SKILL.md");
    try {
      await stat(skillPath);
    } catch {
      continue; // directory without a SKILL.md is not a spell
    }

    const fm = parseFrontmatter(await readFile(skillPath, "utf-8"));
    if (!fm) {
      problems.push(`${entry.name}/SKILL.md: missing or unparseable frontmatter`);
      continue;
    }
    const missing = REQUIRED.filter((k) => !fm[k]);
    if (missing.length) {
      problems.push(`${entry.name}/SKILL.md: missing frontmatter field(s): ${missing.join(", ")}`);
      continue;
    }
    if (!FORMS.has(fm.form)) {
      problems.push(`${entry.name}/SKILL.md: form "${fm.form}" not one of ${[...FORMS].join(" | ")}`);
      continue;
    }
    spells.push(fm);
  }

  if (problems.length) {
    throw new Error(
      `spell metadata incomplete — fix the frontmatter:\n  - ${problems.join("\n  - ")}`,
    );
  }
  spells.sort((a, b) => a.name.localeCompare(b.name));
  return spells;
}

// Human label for a form, e.g. act → "infinitive (act)".
export const FORM_LABEL = {
  act: "infinitive (act)",
  agent: "participle (agent)",
  thing: "noun (thing)",
};
