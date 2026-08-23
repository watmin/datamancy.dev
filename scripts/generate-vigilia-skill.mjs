#!/usr/bin/env node
//
// Generate vigilia/SKILL.md — the watch, the aggregator spell.
//
// vigilia musters the inward defensive wards against a target, then circumspicere
// last. WHICH wards, in WHICH slot, is NOT hand-listed here — it is COMPILED from
// each spell's own `vigilia-slot` frontmatter (the single source, validated in
// scripts/lib/spells.mjs against VIGILIA_SLOT_META). The conceptual prose lives
// in render() as literals; the roster table, the selection rule, and EVERY
// ward/kind name-list are generated — the prose names no ward or kind as a
// ROSTER literal (conceptual mentions of circumspicere, the singular perimeter
// lens, and the kind taxonomy are stable vocabulary, not roster data), so the
// roster cannot drift when the wards change (the watch once listed 12 of 20,
// while three wards self-declared a membership it omitted).
//
//   npm run vigilia:regen                              # write vigilia/SKILL.md
//   node scripts/generate-vigilia-skill.mjs --check    # drift gate, no write
//
// Twin of generate-grimoire-skill.mjs — same readSpells source, same --check gate.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readSpells, VIGILIA_SLOT_META } from "./lib/spells.mjs";

const OUTPUT_DIR = "vigilia";
const OUTPUT_FILE = "vigilia/SKILL.md";
const CHECK = process.argv.includes("--check");

const SLOT_KEYS = Object.keys(VIGILIA_SLOT_META);

// The roster members (everything but the two non-member slots), sorted by
// slot-group order (VIGILIA_SLOT_META key order) then by each spell's
// vigilia-order. Order is unique within a slot (readSpells Gate 4 enforces it),
// so the sort is total.
function rosterMembers(spells) {
  return spells
    .filter((s) => VIGILIA_SLOT_META[s["vigilia-slot"]].member)
    .sort((a, b) => {
      const slotA = SLOT_KEYS.indexOf(a["vigilia-slot"]);
      const slotB = SLOT_KEYS.indexOf(b["vigilia-slot"]);
      return slotA !== slotB ? slotA - slotB : Number(a["vigilia-order"]) - Number(b["vigilia-order"]);
    });
}

// The "When cast" column derives from the slot: a conditional ward shows its
// trigger, every other shows its slot's blurb. No per-row editorial to drift.
function rosterRows(members) {
  return members.map((s) => {
    const meta = VIGILIA_SLOT_META[s["vigilia-slot"]];
    const when = meta.conditional ? `Conditional — ${s["vigilia-trigger"]}` : meta.blurb;
    return `| **${s.name}** | ${s["vigilia-concern"]} | ${when} |`;
  });
}

// The selection rule, grouped by slot in render order; conditional wards list
// their trigger, the rest list the slot's blurb.
function selectionRows(members) {
  const lines = [];
  for (const slot of SLOT_KEYS) {
    const meta = VIGILIA_SLOT_META[slot];
    if (!meta.member) continue;
    const wards = members.filter((s) => s["vigilia-slot"] === slot);
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

function namesInSlot(members, slot) {
  return members
    .filter((s) => s["vigilia-slot"] === slot)
    .map((s) => s.name)
    .join(", ");
}

function render(members) {
  const universalCode = namesInSlot(members, "universal-code");
  const conditional = namesInSlot(members, "conditional-code");
  const crossKind = namesInSlot(members, "universal-cross");
  const chronicleWard = namesInSlot(members, "chronicle-kind");
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
    "> This spell belongs to the **datamancy grimoire** — load its index (`grimoire/SKILL.md`) first. The index defines the practice-terms used here (*ward*, *cast*, *the four questions*, *rune*) and lists the sibling spells vigilia musters; this spell assumes that context rather than redefining it.",
    "",
    "Vigilia is **the aggregator**. It does not check the code itself; it summons every defensive spell in the grimoire against the target, in parallel, and collects the reports. The practitioner casts vigilia when the question is \"is this code ready?\" — and wants the answer from every angle the grimoire knows how to ask.",
    "",
    "## The principle",
    "",
    "Each defensive spell sees one concern — names and structure, tangles, dead code, craft, state, waste, and the rest; the roster below names every ward and the concern it owns. Every one of these looks **into** the target. And one looks **around** it: circumspicere sees the surround — the runtime's default egress, the shipped claims, the unenforced invariants, the blind spot the inward lenses turn their backs on. Each finding is bounded; each spell converges (L1 + L2 = 0) on its own concern.",
    "",
    "A finding carries a severity: **L1** is a correctness lie, **L2** a structural mumble, **L3** taste. Only L1 and L2 count toward convergence; L3 is noted and set aside.",
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
    "The grimoire's primary decision heuristic is four questions, each answered with a flat YES or NO — turned here on vigilia's own output:",
    "",
    "- **Obvious?** Can the practitioner read vigilia's aggregate and know in one glance which spells converged and which didn't? \"9 of 10 converged; cernere flagged 2 phantoms\" is obvious. \"Various findings\" is not.",
    "- **Simple?** Does vigilia add complexity beyond aggregation? The spell should not invent new findings; the spell should only collect what the defensive set produced.",
    "- **Honest?** Does the aggregate report each spell's findings as that spell named them? Vigilia does not re-classify (no demoting a sibling's L1 to L2; no merging two findings into one).",
    "- **Good UX?** Does the aggregate point at what to fix FIRST? The practitioner needs prioritization: L1 lies before L2 mumbles; the spell whose finding gates the most downstream work first.",
    "",
    "## What vigilia casts",
    "",
    "The defensive set, in the order each spell's findings tend to compose — universal code wards first, then the conditional code wards, then the kind-scoped wards, then circumspicere last. **This table is generated from each spell's `vigilia-slot` frontmatter** — the single source, validated at build time (a table out of sync with the frontmatter fails the drift gate); it cannot drift from the wards:",
    "",
    "| Spell | Concern | When cast |",
    "|---|---|---|",
    ...rosterRows(members),
    "",
    `Not all spells apply to every target. Vigilia casts only those whose discipline matches the target's **kind**. The **universal code set** (${universalCode}) is cast on every code target; the conditional code wards (${conditional}) join as the file's contents warrant; the kind-scoped wards join when the target matches their kind. Beyond those, **${crossKind}** runs on every target regardless of kind — not just code (its row names where). circumspicere is always cast, and always last. The selection rule below names, per kind, exactly which wards muster.`,
    "",
    "## The cast mechanic — reach the MCP, or embed",
    "",
    "The caster fetches each inward spell's `SKILL.md` from the grimoire once — the grimoire's signed MCP endpoint serves it SHA-256-verified — and **embeds the full text verbatim** into that spell's subagent prompt, alongside the named target. The subagent applies its discipline from what it was handed.",
    "",
    "**If the subagents cannot reach the datamancy MCP, you MUST embed each spell's content in their prompt.** A spawned worker often runs sandboxed — no network, no MCP, no reach to datamancy.dev — or is simply launched without the server attached, and the caster usually cannot tell which from the outside. A cast that depends on the worker fetching its own spell fails the instant the sandbox denies the request, and a spell the worker could not read is an invalid cast, not a finding. So unless you have ESTABLISHED that your workers hold the MCP, the spell travels into them **by value, not by reference**: embedded in the prompt, already in hand. circumspicere is cast last the same way — after the inward reports, with its own text in its prompt.",
    "",
    "A worker that genuinely does have the MCP may fetch its own spell instead; the bytes are SHA-256 verified against the signed manifest either way, so the trust is identical and only the failure mode differs. Embedding is always correct. Fetching is correct only when you know it can succeed — which is why embedding is the default and the fallback both.",
    "",
    "Failure engineering: a worker that cannot reach the grimoire still holds the spell. Where the fetch cannot be guaranteed, remove it — and the whole fetch-failure class goes with it.",
    "",
    `**One ward needs the opposite of context: ${chronicleWard}.** ${chronicleWard} grades chronicle voice against the gold anchors, and its verdict is honest only from a *fresh* reader. Its subagent gets the draft and the spell text — but **not** the surrounding conversation or prior drafts, which would prime it to hear its own echo as the chronicle's voice. When vigilia musters ${chronicleWard} on a chronicle target, it withholds the session context from that one worker. The rule above still holds (the spell reaches the worker either way); only the *context* is held back.`,
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
    ...selectionRows(members),
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
    "- **Suppress findings** — the rune system per spell (a rune is a structured, vouched exemption a finding can carry) handles legitimate exemptions; vigilia respects each spell's rune output and does not add its own suppression layer",
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
  const members = rosterMembers(spells);
  const next = render(members);

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
    console.error(`[generate-vigilia-skill] ✓ ${OUTPUT_FILE} is current (${members.length} wards mustered from ${spells.length} spells)`);
    return;
  }

  await mkdir(join(process.cwd(), OUTPUT_DIR), { recursive: true });
  await writeFile(OUTPUT_FILE, next);
  console.error(`[generate-vigilia-skill] wrote ${OUTPUT_FILE} (${members.length} wards mustered from ${spells.length} spells)`);
}

main().catch((err) => {
  console.error("[generate-vigilia-skill] FATAL:", err instanceof Error ? err.message : err);
  process.exit(1);
});
