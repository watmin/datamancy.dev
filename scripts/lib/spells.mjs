// The single source of truth for "what spells exist and what they are."
//
// Both generators (the grimoire index and the README catalog) read spells
// from here, so a spell is described in exactly ONE place — its own
// SKILL.md frontmatter. Add a spell, fill its frontmatter, and every
// generated surface picks it up. Forget a field and the build fails loud,
// naming the spell — drift becomes a red build, never a silent stale table.

import { readdir, readFile } from "node:fs/promises";
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
const REQUIRED = ["name", "form", "category", "description", "reading", "vigilia-slot"];
// Vigilia membership fields beyond the slot: order + concern for roster members,
// trigger for conditional slots. Parsed always; validated conditionally in
// readSpells (a member missing its order/concern, or a conditional ward missing
// its trigger, is a red build — the same loud-drift discipline as a bad category).
const VIGILIA_MEMBER_FIELDS = ["vigilia-order", "vigilia-concern", "vigilia-trigger"];
const FORMS = new Set(["act", "agent", "thing"]);
// Closed typology — extend ON PURPOSE here (a one-line, reviewed edit), never
// by accident via a typo in frontmatter. A category outside this set is a red
// build, not a silent mis-file into the catalog's "spell" fallback.
//
// CATEGORY_META is the SINGLE SOURCE for "what categories exist and what each
// means." Generators derive their category overview from it (the /llms.txt
// agent map, the agent-skills index x-note), and CATEGORIES — the validation
// set — is its keys, so the valid categories and their descriptions can never
// drift into two hand-typed lists. Key order is render order. Add a category
// once, here, and it appears everywhere by construction.
export const CATEGORY_META = {
  craft: {
    label: "tests of craft",
    blurb: "is the code well-made, beyond 'it compiles'?",
  },
  surface: {
    label: "tests of surface",
    blurb: "does the surface — types, tests, declarations — name what it does?",
  },
  fidelity: {
    label: "tests of fidelity",
    blurb: "does what's claimed match what's delivered?",
  },
  solo: {
    label: "solo wards",
    blurb:
      "stand-alone casts — a fresh reader walking the path, and every defensive spell at once",
  },
  primer: {
    label: "primers",
    blurb:
      "disciplines you read and run on yourself rather than cast against a target — recovering after a context compaction, keeping the durable record true, and the grounded dungeon crawl, the agile method behind every spell here",
  },
};
const CATEGORIES = new Set(Object.keys(CATEGORY_META));

// VIGILIA_SLOT_META — the SINGLE SOURCE for "which spells the watch musters, and
// in what slot." Twin of CATEGORY_META: vigilia's roster table and selection
// rule are GENERATED from each spell's `vigilia-slot` frontmatter against this
// object, so the watch can never drift from the wards the way a hand-maintained
// table did (it once listed 12 of 20; three wards self-declared membership the
// table omitted). `conditional: true` marks a slot whose members are cast only
// when a trigger fires (so they MUST declare `vigilia-trigger`). `member: false`
// marks the two non-roster slots (vigilia itself; the primers). Key order is the
// slot group's render order; `vigilia-order` orders rows within a slot. Add a
// slot once, here, and it appears in the generated watch by construction.
export const VIGILIA_SLOT_META = {
  "universal-code": {
    label: "universal code wards",
    blurb: "cast on every code target — the default set, before all others",
    conditional: false,
    member: true,
  },
  "universal-cross": {
    label: "universal cross-kind ward",
    blurb: "cast on every target regardless of kind — code, docs, and a warded home's stamped proof records (INSCRIPTION/SCORE)",
    conditional: false,
    member: true,
  },
  "conditional-code": {
    label: "conditional code wards",
    blurb: "join the code set when the file's contents warrant the trigger",
    conditional: true,
    member: true,
  },
  "spec-kind": {
    label: "spec / DSL wards",
    blurb: "cast on spec, language, and DSL files",
    conditional: false,
    member: true,
  },
  "test-kind": {
    label: "test wards",
    blurb: "cast on test files, alongside the applicable code wards",
    conditional: false,
    member: true,
  },
  "chronicle-kind": {
    label: "chronicle ward",
    blurb: "cast on chronicle prose by a fresh, uncontexted subagent",
    conditional: false,
    member: true,
  },
  "docs-kind": {
    label: "docs ward",
    blurb: "cast on documentation targets — README, USER-GUIDE, walkable text",
    conditional: false,
    member: true,
  },
  perimeter: {
    label: "perimeter lens",
    blurb: "always cast last, after the inward set — surveys the surround they left uncovered",
    conditional: false,
    member: true,
  },
  aggregator: {
    label: "the aggregator — not a roster member",
    blurb: "vigilia itself; excluded from the set it summons",
    conditional: false,
    member: false,
  },
  primer: {
    label: "primers — excluded from vigilia",
    blurb: "run on yourself, not cast against a target; vigilia does not summon these",
    conditional: false,
    member: false,
  },
};
const VIGILIA_SLOTS = new Set(Object.keys(VIGILIA_SLOT_META));

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const yaml = match[1];
  const field = (key) => {
    const m = yaml.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : null;
  };
  return Object.fromEntries([...REQUIRED, ...VIGILIA_MEMBER_FIELDS].map((k) => [k, field(k)]));
}

// Recursively collect every SKILL.md path (relative to root), pruning the dirs
// that never hold spells. Used to assert the FLAT layout: the enumeration in
// readSpells only sees `<name>/SKILL.md`, so a spell written one level deeper
// is invisible to it — never validated, silently absent. This walk is the eye
// that sees what the glob can't, so a NESTED spell (deeper than `<name>/SKILL.md`)
// fails LOUD. A flat SKILL.md inside a reserved SKIP dir is NOT caught here — it is
// intentionally excluded by Gate 2's SKIP set, which is how the generated
// `grimoire/SKILL.md` index legitimately lives in a non-spell dir.
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
    let raw;
    try {
      raw = await readFile(skillPath, "utf-8");
    } catch {
      continue; // directory without a SKILL.md is not a spell — readFile's own ENOENT is the signal
    }

    const fm = parseFrontmatter(raw);
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

    // Gate 3 — vigilia membership: every spell declares its watch slot (the
    // generated roster's single source). A bad slot, a roster member missing
    // its order/concern, a conditional ward missing its trigger, an
    // unconditional ward carrying one, or a non-member carrying row fields — each
    // is a red build, naming the spell. The watch can never drift from the wards.
    const slot = fm["vigilia-slot"];
    if (!VIGILIA_SLOTS.has(slot)) {
      problems.push(`${entry.name}/SKILL.md: vigilia-slot "${slot}" not one of ${[...VIGILIA_SLOTS].join(" | ")}`);
      continue;
    }
    const slotMeta = VIGILIA_SLOT_META[slot];
    if (slotMeta.member) {
      const need = [];
      if (!fm["vigilia-order"]) need.push("vigilia-order");
      if (!fm["vigilia-concern"]) need.push("vigilia-concern");
      if (slotMeta.conditional && !fm["vigilia-trigger"]) need.push("vigilia-trigger");
      if (need.length) {
        problems.push(`${entry.name}/SKILL.md: vigilia-slot "${slot}" requires field(s): ${need.join(", ")}`);
        continue;
      }
      if (!/^[1-9][0-9]*$/.test(fm["vigilia-order"])) {
        problems.push(`${entry.name}/SKILL.md: vigilia-order "${fm["vigilia-order"]}" must be a positive integer`);
        continue;
      }
      if (!slotMeta.conditional && fm["vigilia-trigger"]) {
        problems.push(`${entry.name}/SKILL.md: vigilia-slot "${slot}" is unconditional — drop vigilia-trigger`);
        continue;
      }
    } else if (fm["vigilia-order"] || fm["vigilia-concern"] || fm["vigilia-trigger"]) {
      problems.push(`${entry.name}/SKILL.md: vigilia-slot "${slot}" is not a roster member — drop vigilia-order/concern/trigger`);
      continue;
    }
    // The primer category and the primer slot are one fact in two axes — a spell
    // is a primer in both or neither, never split.
    if ((fm.category === "primer") !== (slot === "primer")) {
      problems.push(`${entry.name}/SKILL.md: category "${fm.category}" and vigilia-slot "${slot}" disagree on primer-ness`);
      continue;
    }
    spells.push(fm);
  }

  // Gate 4 — vigilia-order uniqueness WITHIN a slot. A cross-spell check: two
  // members of the same slot sharing an order would tie, and the generated
  // roster's row position would fall to an implicit tiebreaker. A collision is a
  // red build naming both spells — the order is the single source for row order,
  // so it must be unambiguous.
  const orderSeen = new Map(); // `${slot}#${order}` -> first spell name seen
  for (const sp of spells) {
    const slot = sp["vigilia-slot"];
    if (!VIGILIA_SLOT_META[slot]?.member) continue;
    const key = `${slot}#${sp["vigilia-order"]}`;
    if (orderSeen.has(key)) {
      problems.push(
        `${sp.name}/SKILL.md: vigilia-order ${sp["vigilia-order"]} in slot "${slot}" collides with ${orderSeen.get(key)} — orders must be unique within a slot`,
      );
    } else {
      orderSeen.set(key, sp.name);
    }
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
