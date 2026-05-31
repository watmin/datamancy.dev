// The single source of truth for "what spells exist and what they are."
//
// Both generators (the grimoire index and the README catalog) read spells
// from here, so a spell is described in exactly ONE place — its own
// SKILL.md frontmatter. Add a spell, fill its frontmatter, and every
// generated surface picks it up. Forget a field and the build fails loud,
// naming the spell — drift becomes a red build, never a silent stale table.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

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
// Closed typology — extend ON PURPOSE here (a one-line, reviewed edit), never
// by accident via a typo in frontmatter. A category outside this set is a red
// build, not a silent mis-file into the catalog's "spell" fallback.
const CATEGORIES = new Set(["craft", "surface", "fidelity", "solo"]);

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

// Recursively collect every SKILL.md path (relative to root), pruning the dirs
// that never hold spells. Used to assert the FLAT layout: the enumeration in
// readSpells only sees `<name>/SKILL.md`, so a spell written one level deeper
// is invisible to it — never validated, silently absent. This walk is the eye
// that sees what the glob can't, so a misplaced/nested spell fails LOUD.
async function findSkillFiles(root) {
  const out = [];
  async function walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === ".git" || e.name === ".github") continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.name === "SKILL.md") out.push(relative(root, full));
    }
  }
  await walk(root);
  return out;
}

// Flat == "<single-segment>/SKILL.md" (handles either path separator).
const FLAT_SKILL = /^[^/\\]+[/\\]SKILL\.md$/;

/**
 * Read + validate the whole spell tree. Returns the spells sorted by name, or
 * throws — naming every offence — if any spell is malformed (missing field,
 * unknown form, unknown category) OR misplaced (a SKILL.md nested below the
 * flat `<name>/SKILL.md` layout). A half-catalogued or misplaced spell can
 * never ship: the enumeration validates what it sees, and the flat-layout
 * assertion guarantees it sees everything.
 */
export async function readSpells(repoRoot = process.cwd()) {
  const problems = [];

  // Gate 1 — tree hygiene: every SKILL.md must be flat. A nested spell is
  // illegal (for now) and, worse, invisible to the enumeration below; assert
  // against the disk so it cannot exist silently.
  for (const rel of await findSkillFiles(repoRoot)) {
    if (!FLAT_SKILL.test(rel)) {
      problems.push(`${rel}: illegal nested/misplaced spell — spells must be flat at <name>/SKILL.md`);
    }
  }

  // Gate 2 — enumerate the flat spells and validate each one's frontmatter.
  const entries = await readdir(repoRoot, { withFileTypes: true });
  const spells = [];

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
    if (!CATEGORIES.has(fm.category)) {
      problems.push(`${entry.name}/SKILL.md: category "${fm.category}" not one of ${[...CATEGORIES].join(" | ")}`);
      continue;
    }
    spells.push(fm);
  }

  if (problems.length) {
    throw new Error(
      `spell validation failed — fix the tree/frontmatter:\n  - ${problems.join("\n  - ")}`,
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
