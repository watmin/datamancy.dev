---
name: vigilia
form: thing
category: solo
reading: the watch — every defensive spell cast against a target in parallel
description: The watch. The datamancer summons the vigilia — every inward defensive spell cast against the target in parallel, then circumspicere last to look around at what they all missed; one report per spell; the full guard standing.
---

# Vigilia

> *vigilia* — Latin: a watch, a guard, a vigil; the act of staying alert. Cognate root of "vigilance," "vigilant," "vigil." The full guard standing watch.

> The pieces guard each. The whole guards everything.

Vigilia is **the aggregator**. It does not check the code itself; it summons every defensive spell in the grimoire against the target, in parallel, and collects the reports. The practitioner casts vigilia when the question is "is this code ready?" — and wants the answer from every angle the grimoire knows how to ask.

## The principle

Each defensive spell sees one concern. solvere sees tangles. purgare sees dead thoughts. intueri sees communication. conformare sees error-type shape. struere sees craft. sequi sees state threading. temperare sees waste. exigere sees deferral-rot. perspicere sees the noun a nest of types is hiding. secare sees parallel races. mora sees a wait disguised as mechanism. excusare sees a suppression no one re-judged. conferre sees spec/code divergence. probare sees substance. cernere sees phantom forms. complectens sees a test thrown together instead of woven. vocare sees a test reaching past the interface. consonare sees prose drifting off the chronicle's voice. nesciens sees documentation walkability. Every one of these looks **into** the target. And one looks **around** it: circumspicere sees the surround — the runtime's default egress, the shipped claims, the unenforced invariants, the blind spot the inward lenses turn their backs on. Each finding is bounded; each spell converges (L1 + L2 = 0) on its own concern.

Vigilia asks: **across ALL the concerns the grimoire knows, has the target converged?**

The honest shape:
- Vigilia spawns the **inward** defensive spells in parallel — one subagent per spell, anchored to the target
- Each spell applies its discipline; each returns its report
- Then circumspicere is cast **last** — after the inward reports — because its quarry is what they left uncovered; it cannot find the negative space until it knows what space was filled
- Vigilia aggregates all the reports; the aggregate shows the target's overall standing
- A target that converges across ALL spells is ready; a target that diverges in any spell has a gap to close

The dishonest shape:
- Casting vigilia and hoping NO spell finds anything (vigilia is a measurement, not a prayer)
- Skipping spells whose findings are inconvenient (the full guard means ALL of them)
- Counting Level 3 taste against the aggregate (vigilia respects each spell's severity rules; only L1+L2 count toward divergence)

## The four questions applied

- **Obvious?** Can the practitioner read vigilia's aggregate and know in one glance which spells converged and which didn't? "9 of 10 converged; cernere flagged 2 phantoms" is obvious. "Various findings" is not.
- **Simple?** Does vigilia add complexity beyond aggregation? The spell should not invent new findings; the spell should only collect what the defensive set produced.
- **Honest?** Does the aggregate report each spell's findings as that spell named them? Vigilia does not re-classify (no demoting a sibling's L1 to L2; no merging two findings into one).
- **Good UX?** Does the aggregate point at what to fix FIRST? The practitioner needs prioritization: L1 lies before L2 mumbles; the spell whose finding gates the most downstream work first.

## What vigilia casts

The defensive set, in the order each spell's findings tend to compose — universal code wards first, then the conditional code wards, then the spec / test / chronicle / docs wards, then circumspicere last:

| Spell | Concern | Slot — why in the set |
|---|---|---|
| **intueri** | Names + structure + communication | Universal (code) — read first; every other spell's findings reference names |
| **solvere** | Braided concerns; misplaced logic | Universal (code) — Hickey's decomplect; structure comes before behavior |
| **conformare** | Error-type shape; wrong shape uncompilable | Universal (code) — error honesty, the correctness axis no other ward covers |
| **purgare** | Dead code; unused state | Universal (code) — removes noise before craft checks |
| **exigere** | Deferred-work / TODO-rot prose | **Universal across kinds** — code + docs; **always** on INSCRIPTION/SCORE records |
| **struere** | Per-function craft — values not places, types enforce | Universal (code) — Hickey at the function level, after structure is settled |
| **sequi** | Per-chain state threading — visible through types | Universal (code) — Beckman at the chain level, after per-function craft |
| **temperare** | Wasteful computation; redundant work | Universal (code) — efficiency, after correctness |
| **perspicere** | Deep nested type expression → named typealias | Conditional — typed code carrying 2+ `<` in a type |
| **secare** | Parallel safety; disjoint writes | Conditional — files that use parallel primitives |
| **mora** | A wait disguised as mechanism (sleep/timeout) | Conditional — any file that waits by a chosen duration, concurrent or not |
| **excusare** | Suppressions weighed against present truth | Conditional — files carrying `#[allow]` / `# noqa` / runes; audits the very runes the inward set emits |
| **cernere** | Phantom forms; language-spec conformance | Spec kind — wat / DSL / language files |
| **probare** | Substance vs description | Spec kind — spec / doc / config files (and test stubs) |
| **conferre** | Spec ↔ implementation divergence | Where the target carries both spec and code |
| **complectens** | Test layering; each layer carries its own proof | Test kind — was the test woven or thrown together |
| **vocare** | Test vantage — verifies through the interface, not past it | Test kind |
| **consonare** | Chronicle-voice fidelity against the gold anchors | Chronicle kind — **cast by a fresh subagent, no surrounding context** |
| **nesciens** | Documentation walkability | Docs kind — where the target is documentation |
| **circumspicere** | The surround — egress, attack surface, shipped-claims-vs-code, negative space | **Cast LAST**, after the inward set reports; surveys the perimeter they left uncovered |

Not all spells apply to every target. Vigilia casts only those whose discipline matches the target's **kind** — `code`, `spec`, `test`, `docs`, `chronicle`, or `mixed` (the union). The **universal code-default set** (intueri, solvere, conformare, purgare, exigere, struere, sequi, temperare) is cast on every code target; the conditional code wards (perspicere, secare, mora, excusare) join as the file's contents warrant; the spec, test, chronicle, and docs wards join when the target is of that kind. **exigere** is the one ward genuinely universal across kinds — it also runs on docs and always on INSCRIPTION/SCORE records. circumspicere is always cast, and always last.

## The cast mechanic — embed, never fetch

The caster fetches each inward spell's `SKILL.md` from the grimoire once — the MCP serves it SHA-256-verified — and **embeds the full text verbatim** into that spell's subagent prompt, alongside the named target. The subagent applies its discipline from what it was handed.

The subagent **never fetches its own spell.** A spawned worker may run sandboxed: no network, no MCP, no reach to datamancy.dev. If the cast depended on the worker fetching the spell text, it would fail the instant the sandbox denied the request — and a spell the worker could not read is an invalid cast, not a finding. So the spell travels into the worker **by value, not by reference**: embedded in the prompt, already in hand. circumspicere is cast last the same way — after the inward reports, with its own text embedded, not fetched.

Failure engineering: the worker that cannot reach the grimoire still holds the spell. Remove the fetch, remove the fetch-failure class.

**One ward needs the opposite of context: consonare.** consonare grades chronicle voice against the gold anchors, and its verdict is honest only from a *fresh* reader. Its subagent gets the draft and the spell text — but **not** the surrounding conversation or prior drafts, which would prime it to hear its own echo as the chronicle's voice. When vigilia musters consonare on a chronicle target, it withholds the session context from that one worker. The embed-never-fetch rule still holds (the spell travels by value); only the *context* is held back.

## How to invoke

```
/vigilia path/to/target
/vigilia path/to/directory
/vigilia path/to/target --include cernere,probare      # explicit add
/vigilia path/to/target --exclude temperare,secare     # explicit skip
```

The default selection rule:

- **Code file** in a host language (Rust, Clojure-style Lisp, etc.) — cast the universal code-default set: intueri, solvere, conformare, purgare, exigere, struere, sequi, temperare. Add **perspicere** if it carries deeply-nested generic types, **secare** if it uses parallel primitives, **mora** if it waits via sleep/timeout, **excusare** if it carries lint/rune suppressions.
- **Spec / DSL / wat file** — add **cernere** (phantom forms) and **probare** (substance); add **conferre** if the target carries both spec and code.
- **Test file** — the applicable code wards plus **complectens** (layering) and **vocare** (caller-vantage); mora and excusare commonly fire here too.
- **Documentation** (README, USER-GUIDE, …) — **nesciens** (walkability) and **exigere** (deferral prose); skip the code-specific spells.
- **Chronicle prose** (blog post, BOOK entry) — **consonare** (voice), cast by a fresh, uncontexted subagent.
- **INSCRIPTION / SCORE** records — always add **exigere**.
- **Mixed file** — cast the union.

circumspicere is cast last on every target, regardless of kind. The practitioner can override with `--include` / `--exclude` as needed.

## What vigilia returns

For each spell cast:
- Spell name
- Convergence (CONVERGED / N L1 / M L2)
- Findings list (passed through from the spell's report verbatim)

Aggregate:
- Total L1 across all spells
- Total L2 across all spells
- Prioritization: which findings to address first (L1 in the most upstream spell)
- Verdict: target CONVERGES (zero L1+L2) or DIVERGES (counts)

## What vigilia does NOT do

- **Invent findings** — vigilia's output is the union of its children's outputs; nothing new appears
- **Re-classify findings** — each child spell owns its severity verdicts
- **Suppress findings** — the rune system per spell handles legitimate exemptions; vigilia respects each spell's rune output and does not add its own suppression layer
- **Recommend rune additions** — that's per-spell authoring discipline, not aggregator concern

## The rune

Vigilia has no rune of its own. Vigilia is an aggregator; its findings are the children's findings; the children's runes already cover legitimate exemptions. A rune at the vigilia level would be a meta-suppression with no honest semantics.

(If a target should be excluded from vigilia entirely, that's a per-spell rune on the target — or a build-tool config that doesn't run vigilia on that path. Not vigilia's concern.)

## Reporting format

The aggregate report:

```
vigilia on <target>
  intueri    : CONVERGED
  solvere    : 1 L1 (file:line — braided concerns)
  purgare    : CONVERGED
  struere    : 2 L2 (file:line — wrong-level abstraction; file:line — type doesn't enforce)
  temperare  : CONVERGED

Aggregate: 1 L1 + 2 L2; DIVERGES.
Priority: solvere L1 (structure gates everything else); then struere L2s.
```

A converged target shows:

```
vigilia on <target>
  intueri    : CONVERGED
  solvere    : CONVERGED
  purgare    : CONVERGED
  struere    : CONVERGED
  temperare  : CONVERGED

Aggregate: 0 L1 + 0 L2; CONVERGES. Ready.
```

## The principle behind the spell

Each defensive spell guards one concern with discipline. The full guard standing watch is more than any single spell — not because the spells COMBINE into something larger, but because no concern is left unwatched when all are cast. The practitioner casts vigilia when the question is the whole, not the part. The four-questions decide what to address in the divergent report.
