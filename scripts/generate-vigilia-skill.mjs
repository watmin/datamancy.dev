#!/usr/bin/env node
//
// Generate vigilia/SKILL.md — the watch, the aggregator spell.
//
// vigilia musters the inward defensive wards against a target, then circumspicere
// last. WHICH wards, in WHICH slot, is NOT hand-listed here — it is COMPILED from
// each spell's own `vigilia-slot` frontmatter (the single source, validated in
// scripts/lib/spells.mjs against VIGILIA_SLOT_META). The conceptual prose lives
// in render() as literals; the roster table, the selection rule, and the
// universal/conditional name-lists are generated — so the watch can never drift
// from the wards (it once listed 12 of 20, while three wards self-declared a
// membership the table omitted).
//
//   npm run vigilia:regen                              # write vigilia/SKILL.md
//   node scripts/generate-vigilia-skill.mjs --check    # drift gate, no write
//
// Twin of generate-grimoire-skill.mjs — same readSpells source, same --check gate.

import { readFile, writeFile } from "node:fs/promises";
import { readSpells, VIGILIA_SLOT_META } from "./lib/spells.mjs";

const OUTPUT_FILE = "vigilia/SKILL.md";
const CHECK = process.argv.includes("--check");

const SLOT_KEYS = Object.keys(VIGILIA_SLOT_META);

// Roster members (everything but the two non-member slots), sorted by slot-group
// order (VIGILIA_SLOT_META key order) then by each spell's vigilia-order.
function members(spells) {
  return spells
    .filter((s) => VIGILIA_SLOT_META[s["vigilia-slot"]].member)
    .sort((a, b) => {
      const da = SLOT_KEYS.indexOf(a["vigilia-slot"]);
      const db = SLOT_KEYS.indexOf(b["vigilia-slot"]);
      return da !== db ? da - db : Number(a["vigilia-order"]) - Number(b["vigilia-order"]);
    });
}

// The "Slot — why in the set" column derives from the slot: a conditional ward
// shows its trigger, every other shows its slot's blurb. No per-row editorial to
// drift.
function rosterRows(spells) {
  return members(spells).map((s) => {
    const meta = VIGILIA_SLOT_META[s["vigilia-slot"]];
    const why = meta.conditional ? `Conditional — ${s["vigilia-trigger"]}` : meta.blurb;
    return `| **${s.name}** | ${s["vigilia-concern"]} | ${why} |`;
  });
}

// The selection rule, grouped by slot in render order; conditional wards list
// their trigger, the rest list the slot's blurb.
function selectionRows(spells) {
  const ms = members(spells);
  const lines = [];
  for (const slot of SLOT_KEYS) {
    const meta = VIGILIA_SLOT_META[slot];
    if (!meta.member) continue;
    const wards = ms.filter((s) => s["vigilia-slot"] === slot);
    if (!wards.length) continue;
    if (meta.conditional) {
      const items = wards.map((w) => `**${w.name}** (${w["vigilia-trigger"]})`).join(", ");
      lines.push(`- **${meta.label}** — join the cast when the trigger fires: ${items}.`);
    } else {
      const names = wards.map((w) => `**${w.name}**`).join(", ");
      lines.push(`- **${meta.label}** — ${meta.blurb}: ${names}.`);
    }
  }
  return lines;
}

function namesInSlot(spells, slot) {
  return members(spells)
    .filter((s) => s["vigilia-slot"] === slot)
    .map((s) => s.name)
    .join(", ");
}

function render(spells) {
  const universalCode = namesInSlot(spells, "universal-code");
  const conditional = namesInSlot(spells, "conditional-code");
  const lines = [
    "---",
    "name: vigilia",
    "form: thing",
    "category: solo",
    "reading: the watch — every defensive spell cast against a target in parallel",
    "description: The watch. The datamancer summons the vigilia — every inward defensive spell cast against the target in parallel, then circumspicere last to look around at what they all missed; one report per spell; the full guard standing.",
    "vigilia-slot: aggregator",
    "---",
    "",
    "# Vigilia",
    "",
    "> *vigilia* — Latin: a watch, a guard, a vigil; the act of staying alert. Cognate root of \"vigilance,\" \"vigilant,\" \"vigil.\" The full guard standing watch.",
    "",
    "> The pieces guard each. The whole guards everything.",
    "",
    "Vigilia is **the aggregator**. It does not check the code itself; it summons every defensive spell in the grimoire against the target, in parallel, and collects the reports. The practitioner casts vigilia when the question is \"is this code ready?\" — and wants the answer from every angle the grimoire knows how to ask.",
    "",
    "## The principle",
    "",
    "Each defensive spell sees one concern. solvere sees tangles. purgare sees dead thoughts. intueri sees communication. conformare sees error-type shape. struere sees craft. sequi sees state threading. temperare sees waste. exigere sees deferral-rot. perspicere sees the noun a nest of types is hiding. secare sees parallel races. mora sees a wait disguised as mechanism. excusare sees a suppression no one re-judged. conferre sees spec/code divergence. probare sees substance. cernere sees phantom forms. complectens sees a test thrown together instead of woven. vocare sees a test reaching past the interface. consonare sees prose drifting off the chronicle's voice. nesciens sees documentation walkability. Every one of these looks **into** the target. And one looks **around** it: circumspicere sees the surround — the runtime's default egress, the shipped claims, the unenforced invariants, the blind spot the inward lenses turn their backs on. Each finding is bounded; each spell converges (L1 + L2 = 0) on its own concern.",
    "",
    "Vigilia asks: **across ALL the concerns the grimoire knows, has the target converged?**",
    "",
    "The honest shape:",
    "- Vigilia spawns the **inward** defensive spells in parallel — one subagent per spell, anchored to the target",
    "- Each spell applies its discipline; each returns its report",
    "- Then circumspicere is cast **last** — after the inward reports — because its quarry is what they left uncovered; it cannot find the negative space until it knows what space was filled",
    "- Vigilia aggregates all the reports; the aggregate shows the target's overall standing",
    "- A target that converges across ALL spells is ready; a target that diverges in any spell has a gap to close",
    "",
    "The dishonest shape:",
    "- Casting vigilia and hoping NO spell finds anything (vigilia is a measurement, not a prayer)",
    "- Skipping spells whose findings are inconvenient (the full guard means ALL of them)",
    "- Counting Level 3 taste against the aggregate (vigilia respects each spell's severity rules; only L1+L2 count toward divergence)",
    "",
    "## The four questions applied",
    "",
    "- **Obvious?** Can the practitioner read vigilia's aggregate and know in one glance which spells converged and which didn't? \"9 of 10 converged; cernere flagged 2 phantoms\" is obvious. \"Various findings\" is not.",
    "- **Simple?** Does vigilia add complexity beyond aggregation? The spell should not invent new findings; the spell should only collect what the defensive set produced.",
    "- **Honest?** Does the aggregate report each spell's findings as that spell named them? Vigilia does not re-classify (no demoting a sibling's L1 to L2; no merging two findings into one).",
    "- **Good UX?** Does the aggregate point at what to fix FIRST? The practitioner needs prioritization: L1 lies before L2 mumbles; the spell whose finding gates the most downstream work first.",
    "",
    "## What vigilia casts",
    "",
    "The defensive set, in the order each spell's findings tend to compose — universal code wards first, then the conditional code wards, then the spec / test / chronicle / docs wards, then circumspicere last. **This table is generated from each spell's `vigilia-slot` frontmatter** — the single source, validated against `VIGILIA_SLOT_META`; it cannot drift from the wards:",
    "",
    "| Spell | Concern | Slot — why in the set |",
    "|---|---|---|",
    ...rosterRows(spells),
    "",
    `Not all spells apply to every target. Vigilia casts only those whose discipline matches the target's **kind** — \`code\`, \`spec\`, \`test\`, \`docs\`, \`chronicle\`, or \`mixed\` (the union). The **universal code set** (${universalCode}) is cast on every code target; the conditional code wards (${conditional}) join as the file's contents warrant; the spec, test, chronicle, and docs wards join when the target is of that kind. **exigere** is the one ward genuinely universal across kinds — it also runs on docs and always on INSCRIPTION/SCORE records. circumspicere is always cast, and always last.`,
    "",
    "## The cast mechanic — embed, never fetch",
    "",
    "The caster fetches each inward spell's `SKILL.md` from the grimoire once — the MCP serves it SHA-256-verified — and **embeds the full text verbatim** into that spell's subagent prompt, alongside the named target. The subagent applies its discipline from what it was handed.",
    "",
    "The subagent **never fetches its own spell.** A spawned worker may run sandboxed: no network, no MCP, no reach to datamancy.dev. If the cast depended on the worker fetching the spell text, it would fail the instant the sandbox denied the request — and a spell the worker could not read is an invalid cast, not a finding. So the spell travels into the worker **by value, not by reference**: embedded in the prompt, already in hand. circumspicere is cast last the same way — after the inward reports, with its own text embedded, not fetched.",
    "",
    "Failure engineering: the worker that cannot reach the grimoire still holds the spell. Remove the fetch, remove the fetch-failure class.",
    "",
    "**One ward needs the opposite of context: consonare.** consonare grades chronicle voice against the gold anchors, and its verdict is honest only from a *fresh* reader. Its subagent gets the draft and the spell text — but **not** the surrounding conversation or prior drafts, which would prime it to hear its own echo as the chronicle's voice. When vigilia musters consonare on a chronicle target, it withholds the session context from that one worker. The embed-never-fetch rule still holds (the spell travels by value); only the *context* is held back.",
    "",
    "## How to invoke",
    "",
    "```",
    "/vigilia path/to/target",
    "/vigilia path/to/directory",
    "/vigilia path/to/target --include cernere,probare      # explicit add",
    "/vigilia path/to/target --exclude temperare,secare     # explicit skip",
    "```",
    "",
    "The default selection rule (also generated from the slots):",
    "",
    ...selectionRows(spells),
    "",
    "circumspicere is cast last on every target, regardless of kind. The practitioner can override with `--include` / `--exclude` as needed.",
    "",
    "## What vigilia returns",
    "",
    "For each spell cast:",
    "- Spell name",
    "- Convergence (CONVERGED / N L1 / M L2)",
    "- Findings list (passed through from the spell's report verbatim)",
    "",
    "Aggregate:",
    "- Total L1 across all spells",
    "- Total L2 across all spells",
    "- Prioritization: which findings to address first (L1 in the most upstream spell)",
    "- Verdict: target CONVERGES (zero L1+L2) or DIVERGES (counts)",
    "",
    "## What vigilia does NOT do",
    "",
    "- **Invent findings** — vigilia's output is the union of its children's outputs; nothing new appears",
    "- **Re-classify findings** — each child spell owns its severity verdicts",
    "- **Suppress findings** — the rune system per spell handles legitimate exemptions; vigilia respects each spell's rune output and does not add its own suppression layer",
    "- **Recommend rune additions** — that's per-spell authoring discipline, not aggregator concern",
    "",
    "## The rune",
    "",
    "Vigilia has no rune of its own. Vigilia is an aggregator; its findings are the children's findings; the children's runes already cover legitimate exemptions. A rune at the vigilia level would be a meta-suppression with no honest semantics.",
    "",
    "(If a target should be excluded from vigilia entirely, that's a per-spell rune on the target — or a build-tool config that doesn't run vigilia on that path. Not vigilia's concern.)",
    "",
    "## Reporting format",
    "",
    "The aggregate report:",
    "",
    "```",
    "vigilia on <target>",
    "  intueri    : CONVERGED",
    "  solvere    : 1 L1 (file:line — braided concerns)",
    "  purgare    : CONVERGED",
    "  struere    : 2 L2 (file:line — wrong-level abstraction; file:line — type doesn't enforce)",
    "  temperare  : CONVERGED",
    "",
    "Aggregate: 1 L1 + 2 L2; DIVERGES.",
    "Priority: solvere L1 (structure gates everything else); then struere L2s.",
    "```",
    "",
    "A converged target shows:",
    "",
    "```",
    "vigilia on <target>",
    "  intueri    : CONVERGED",
    "  solvere    : CONVERGED",
    "  purgare    : CONVERGED",
    "  struere    : CONVERGED",
    "  temperare  : CONVERGED",
    "",
    "Aggregate: 0 L1 + 0 L2; CONVERGES. Ready.",
    "```",
    "",
    "## The principle behind the spell",
    "",
    "Each defensive spell guards one concern with discipline. The full guard standing watch is more than any single spell — not because the spells COMBINE into something larger, but because no concern is left unwatched when all are cast. The practitioner casts vigilia when the question is the whole, not the part. The four-questions decide what to address in the divergent report.",
    "",
  ];
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
        `[generate-vigilia-skill] DRIFT: ${OUTPUT_FILE} is stale — run \`npm run vigilia:regen\``,
      );
      process.exit(1);
    }
    const count = members(spells).length;
    console.error(`[generate-vigilia-skill] ✓ ${OUTPUT_FILE} is current (${count} wards mustered + 2 non-members)`);
    return;
  }

  await writeFile(OUTPUT_FILE, next);
  console.error(`[generate-vigilia-skill] wrote ${OUTPUT_FILE} (${members(spells).length} wards mustered from frontmatter)`);
}

main().catch((err) => {
  console.error("[generate-vigilia-skill] FATAL:", err instanceof Error ? err.message : err);
  process.exit(1);
});
