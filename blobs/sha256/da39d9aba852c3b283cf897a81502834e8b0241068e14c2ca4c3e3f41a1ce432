---
name: excusare
form: act
category: fidelity
reading: to weigh the excuse — whether any checker-override's stated reason earns its exemption, at birth or over time
description: Weigh every exemption against present truth. The datamancer excusat the overrides — each suppression that tells a checker "this looks like a finding, but it is correct, and here is why" is held up to the world as it is now, at the moment it is offered AND as it ages, and struck when its reason does not earn its standing.
argument-hint: [path or directory whose exemptions to weigh]
---

# Excusare

> *excusare* — Latin: *ex-* (out from) + *causa* (cause, reason, legal case). To plead a cause in one's defense; to free from blame by offering a reason; to excuse, exempt. Active infinitive; root of English "excuse." An *excusatio* was the formal reason offered to be released from a duty — and the magistrate's job was to weigh whether the reason held. Excusare is that weighing.

> An exemption is an excuse offered to a checker. The excuse is only as good as its reason — and a reason is true *now*, not *when it was written.*

A checker — a spell, the Rust compiler, clippy, eslint, a type-checker — raises a finding: *this is wrong.* An override answers: *no, it is correct, and here is why.* That override is an **excuse**. Every codebase accumulates them: `// rune:conformare(spanless-by-domain)`, `#[allow(clippy::len_without_is_empty)]`, `// eslint-disable-next-line`, `# noqa: E501`, `# type: ignore`, `@SuppressWarnings("unchecked")`. Each silences a real checker that would otherwise fire. Each rests on a reason. **Excusare weighs the reason.**

The other spells (and the external checkers) RAISE findings. Excusare does not re-raise them — it judges the **excuse offered against the finding**: is this exemption warranted? Two moments, one judgment: *is the reason legitimate the instant it is offered* (birth), and *does it stay legitimate as the code moves on* (over time).

## The principle

An override is an attestation of standing: *this exemption is warranted.* It is the single point in the discipline where a finding is deliberately walked past. That makes it the single point where a real defect can hide behind a plausible sentence — forever, because **a checker never re-judges its own suppressions.** clippy will not re-examine your `#[allow]`. The spell that emitted a rune does not re-read it on the next cast. The suppression, once written, is trusted until a human looks. Excusare is that look, made systematic.

Excusare asks, of every exemption: **does its stated reason earn the exemption — now?**

This spans two failure surfaces a single checker cannot see:

1. **At birth, for un-vouched overrides.** A spell-emitted rune was form-checked by its emitting spell when written (conformare validates its own `spanless-by-domain` at cast). But a clippy `#[allow]`, an `eslint-disable`, a `# noqa` has **no emitting spell that vouched for it** — it was written by a hand that may have been silencing a real finding because fixing it was inconvenient. *Nobody graded whether that excuse was legitimate.* Excusare does: is this suppression "the lint is wrong for this domain, here is why" (legitimate), or "I didn't want to fix it" (illegitimate — the finding is real and the override is hiding it)?

2. **Over time, for every override.** The code an exemption guards changes; the stone it deferred to ships; the site it annotated moves. The override's TEXT survives unchanged — still parses, still names a category, still reads plausibly — while its TRUTH quietly inverts. A pardon for a condition that no longer exists actively greenlights the very finding the checker would now correctly raise.

The first is **synchronic** (true the moment offered?); the second is **diachronic** (still true as the world moved?). Both are the same question — *does the reason earn the exemption?* — asked at different times. Excusare owns both, because for an un-vouched override they collapse: the first time anyone weighs a clippy `#[allow]`, that weighing is both its birth-grade and, if the code has since moved, its rot-check at once.

> **Note on lineage:** excusare is the grown form of `recensere` (which weighed only spell-runes, and only over time — explicitly assuming birth was vouched elsewhere). That assumption held for grimoire runes and broke for external-checker overrides, which no spell births. Excusare generalizes: any checker, any language, birth and over time. The Roman *censor* both **enrolled** the citizen (birth) and **re-mustered** the rolls at each *lustrum* (over time) — excusare is the whole office, not half of it.

## The verdict classes

Excusare weighs each exemption and sorts it into one of these, or passes it (**HOLDS**).

### ILLEGITIMATE-AT-BIRTH — the excuse never earned the exemption

The override silences a finding the checker **correctly** raised, and the stated reason does not justify the silence. The sharpest case: an `#[allow(clippy::X)]` / `# noqa` / `@SuppressWarnings` with a reason that is absent, vague ("clippy noise"), or an admission of avoidance ("didn't want to refactor"). The checker was *right*; the override is a defect wearing an exemption's clothes. The closure is conditional on whether the finding is still live: **if the checker still fires — remove the override AND fix the code** (the finding was legitimate); **if the checker is now inert** (the code drifted enough that the lint no longer raises) — **remove the override only** — there is no live finding left to fix, just a never-warranted suppression to strike. (The inert case is still ILLEGITIMATE-AT-BIRTH, not STALE-GUARD — see the two-phase gate; the inertness is evidence, not the verdict.)

Distinguish from the legitimate case: an exemption IS warranted when the checker's rule is genuinely wrong for this domain, and the reason names *why structurally* — e.g. `#[allow(clippy::len_without_is_empty)]` on a receiver whose `len()` is a deliberately-narrowed approximation (kernel-buffered bytes invisible), where a naive `is_empty()` would mislead. That HOLDS. The line between them is the reason: a structural domain-truth holds; a convenience-plea does not.

**A schedule is not a domain-truth.** The sharpest ILLEGITIMATE-AT-BIRTH that is NOT a bare-reason plea: an override whose reason is *"will fix later"* / *"banked"* / *"deferred"* against a checker that is **correct**. The lint is right; the fix is merely unscheduled; the override pleads timing, not domain-immunity — and silences a live finding in the meantime. This is distinct from an honest deferral to a NAMED target (see OPEN-DEFERRAL below): a vague "banked to a future cleanup" with no named, open, in-reach stone is a schedule-plea and fails at birth. The test is `feedback_defers_within_reach_tolerable`: a named stone, within reach, structurally-right owner → OPEN-DEFERRAL (honest); any of those missing → ILLEGITIMATE-AT-BIRTH (the deferral points nowhere).

*The magistrate's analogue: the excuse offered to dodge a duty the citizen genuinely owes.*

### OPEN-DEFERRAL — honest, time-bounded, points at named open work

The legitimate sibling of CLOSED-DEFERRAL — and the verdict for an exemption that defers a **correct** finding to a target that is **named, open, in-chain, and within reach** (`feedback_defers_within_reach_tolerable`). The checker is right (so this is NOT a domain-truth HOLDS — the lint is not wrong for the domain); but the fix is genuinely scoped to a specific open stone/arc/ticket the reader can navigate to, and deferring it there is honest while that target is open and close. Example: `#[allow(clippy::result_large_err)] // Stone 243.8: box RuntimeError large variants — named, open, next-in-chain`.

OPEN-DEFERRAL is **conditionally legitimate** — it HOLDS *only* while its named target is open. Two hard requirements: (1) the reason MUST cite the specific target by name/number (a stone number, arc number, ticket id) — "banked to a future cleanup" or "the RuntimeError question" is NOT a named target and falls to ILLEGITIMATE-AT-BIRTH; (2) the moment the named target **ships**, the override converts to CLOSED-DEFERRAL and requires immediate removal (fix landed) or re-pointing (fix slipped to a new named target). It is the one verdict class that is legitimate-now-but-carries-its-own-expiry: excusare re-weighs it on every cast precisely to catch the ship that flips it to CLOSED-DEFERRAL.

*The magistrate's analogue: the deferment granted against a named, still-pending obligation — valid until the obligation comes due, then struck.*

### STALE-GUARD — the guarded property changed

The exemption pardons a condition that no longer holds. The classic: `rune:sequi(ambient-context)` on a field LATER refactored to thread explicitly — or `#[allow(dead_code)]` on a function that is now called. The override still names a real category and reads fine, but the state it pardoned is gone; it greenlights nothing, or worse, greenlights a NEW finding that grew under the old pardon. The exemption outlived the condition that justified it.

*The censor's analogue: the citizen inscribed under a property class he no longer holds.*

### CLOSED-DEFERRAL — the cited target has shipped

An attested-target deferral (`rune:x(deferred-stone-N)`, `deferred-arc-N`, an `#[allow]` reason citing "until ticket #123") whose named stone / arc / ticket has **closed**. The deferral was honest while the target was open and in-reach (`feedback_defers_within_reach_tolerable`); the moment it ships, the override points at done work as if pending — a deferral to nowhere. It converts to a real fix (the deferred work landed or didn't) or to a fresh exemption naming a still-open target.

*The censor's analogue: the roll entry pointing at a man now dead.*

### ORPHANED — the exempted site moved, the reference dangles

The exempted code was deleted or relocated, but a sibling back-reference still cites it (*"see the `#[allow]` on the helper for rationale"*). The pointer leads nowhere. The justification is unreachable; a reader following the trail finds a hole.

*The censor's analogue: the roll citing a household that has moved away.*

### Reaching exactly one verdict — the two-phase gate

The verdict field carries exactly ONE class. The classes are NOT one severity line — they sit on two axes, and the verdict is reached by gating between them, not by ranking across them:

- **Axis 1 — birth: did the warrant ever exist?** ILLEGITIMATE-AT-BIRTH lives here.
- **Axis 2 — over-time: a once-valid warrant rotted, how?** STALE-GUARD, CLOSED-DEFERRAL, ORPHANED live here. HOLDS and OPEN-DEFERRAL are the "still-valid" outcomes of this axis.

A warrant that never existed cannot *rot* — so the two axes are gated in sequence, birth first:

**Phase 1 — birth.** Was this exemption EVER legitimate (did its reason ever name a genuine domain-truth, or a named-open target, rather than a bare/vague/schedule plea)? If **NO** → **ILLEGITIMATE-AT-BIRTH**, and STOP. The over-time classes do not apply — there was no valid warrant to outlive, so labelling it STALE-GUARD ("the exemption outlived the condition that justified it") would falsely imply a justifying condition once existed. A bare-reason `#[allow]` on now-inert code is ILLEGITIMATE-AT-BIRTH, not STALE-GUARD — it was rotten from the start; that the lint also stopped firing is noted in the evidence line, not promoted to the verdict.

*The borderline band — debatable resolves to NO.* Phase 1 is not "was the author sincere" — it is "does a genuine structural warrant exist." If the reason is neither clearly bogus nor clearly a structural domain-truth (a plausible-but-debatable claim that *might* be a rationalization), the gate resolves it **NO → ILLEGITIMATE-AT-BIRTH** unless the caster can articulate the structural property *in one sentence, from the code alone* (cf the four-questions Obvious bar; an exemption is a claim, and a claim demands evidence). A warrant you cannot state structurally is not a warrant — "I think this is probably fine" is a sincere convenience-plea, not a domain-truth. Conservative-NO keeps the pardon-grant honest: the burden is on the excuse to prove itself, not on the spell to disprove it.

*Compound reasons — gate each component independently.* A reason can braid parts: half a (bogus) domain-truth claim, half a (valid) named-open deferral. Do NOT gate the reason as one lump. Gate each component: any component that fails Phase 1 is flagged ILLEGITIMATE-AT-BIRTH in the evidence line (the bogus half must be struck from the reason regardless); the surviving legitimate component(s) then proceed through the gate and determine the single verdict (e.g. the valid named-open half → OPEN-DEFERRAL as the verdict, with "bogus domain-truth claim struck from reason" in evidence). One exemption, one verdict — by the strongest surviving component — plus an evidence line that names every struck component. An exemption whose ONLY components all fail Phase 1 is ILLEGITIMATE-AT-BIRTH outright.

**Phase 2 — over-time** (only for exemptions that passed Phase 1 — i.e. were legitimate at birth). Is the warrant still good?
- Still a genuine domain-truth → **HOLDS**. Still a named-open in-reach target → **OPEN-DEFERRAL**.
- Rotted → pick the rot by what is dead, in this within-axis order: **STALE-GUARD** (the guarded property changed) **> CLOSED-DEFERRAL** (the named target shipped) **> ORPHANED** (the PRIMARY citation's site moved). These three can co-apply; STALE-GUARD leads because a vanished guarded property makes the override inert regardless of any target's status. Name co-applying rot-classes in the evidence line; the closure is identical across them (*remove or re-point the override*), so the ordering only keeps the verdict field deterministic.

*HOLDS-with-note — the warrant holds but the reason TEXT drifted.* A distinct sub-case of HOLDS: the structural warrant is still genuinely true (so it is NOT STALE-GUARD — the guarded property did not change), but the reason's *prose* no longer accurately describes the current code (it names a since-renamed function, cites an outdated mechanism, etc.). Verdict: **HOLDS** (L3, not counted as a defect), closure: *update the reason text to match the current code*. This is the one HOLDS that carries an action — a reader-misleading reason on a still-valid exemption rots trust even though the warrant is sound, so the text-drift is recorded, not waved past.

**ORPHANED is the PRIMARY citation dying, not a secondary cross-reference.** An otherwise-healthy OPEN-DEFERRAL (named target still open) that merely carries a dangling *secondary* back-ref ("see the helper's rationale") stays **OPEN-DEFERRAL** — the dangling cross-ref is L2 evidence on that record, not a standalone ORPHANED verdict. ORPHANED is the verdict only when the exemption's own load-bearing reference is the thing that dangles.

## The four questions applied

Run on every exemption in the target:

- **Obvious?** Can a reader see, from the override and its present surroundings, that the exemption applies? If the guarded code has visibly changed shape since the override was written, or the reason field is empty/vague, the warrant is not obvious — a STALE-GUARD or ILLEGITIMATE-AT-BIRTH candidate.
- **Simple?** Is the override's truth checkable at the override itself, or must you reconstruct history (when did stone-N close? where did the helper move? was the lint ever actually wrong here?) to know if it holds? A reason whose truth lives elsewhere-in-time is the gap excusare owns.
- **Honest?** Does the override still tell the truth it claims? An ILLEGITIMATE-AT-BIRTH lies from day one (the finding is real, the excuse is a convenience- or schedule-plea); a CLOSED-DEFERRAL lies as of the day its named target shipped; an OPEN-DEFERRAL tells the truth *for now* (named target still open) but carries its expiry. Honesty is truth-NOW, not truth-when-written, nor truth-the-author-wished.
- **Good UX?** Does the override still serve the next reader — pointing them past a real non-issue — or does it now mislead them past a live finding, or down a dead reference? An exemption that has flipped from shield to blindfold fails here.

## What excusare weighs (the override surface, any language)

Excusare reads the exemption where it lives — in the code, never a central ledger. It recognizes the override forms of every checker in play:

- **Grimoire runes:** `// rune:<spell>(<category>) — <reason>` (the spell-emitted exemptions; conformare/sequi/struere/intueri/solvere/temperare/etc.)
- **Rust/clippy:** `#[allow(clippy::<lint>)]`, `#[allow(dead_code)]`, `#[allow(unused)]`, and the crate-level `#![allow(...)]`
- **JS/TS:** `// eslint-disable`, `// eslint-disable-next-line <rule>`, `/* eslint-disable */`, `// @ts-ignore`, `// @ts-expect-error`
- **Python:** `# noqa`, `# noqa: <code>`, `# type: ignore`, `# pylint: disable=<rule>`
- **Java/Kotlin/etc.:** `@SuppressWarnings("...")`
- **Any inline checker-suppression with a reason slot.** The form varies; the discipline does not: every one is an excuse offered to a checker, and the reason is what excusare weighs.

A suppression with **no reason at all** is itself a finding — an exemption that pleads nothing pleads badly. Excusare flags the bare `#[allow]` / `# noqa` (no code, no reason) as ILLEGITIMATE-AT-BIRTH by default: an unexplained silence of a checker is the absence of a warrant, not the presence of one.

## What excusare does NOT do

- **It does not re-raise the finding's whole discipline.** It does not re-litigate whether the code is tangled (solvere's job) or span-less (conformare's) or what clippy's lint *means*. It adjudicates ONLY whether the EXEMPTION earns its standing. The checker owns the finding; excusare owns the excuse.
- **It does not judge un-exempted findings.** A live clippy warning with no `#[allow]` is the checker's own output, addressed by fixing or (legitimately) suppressing — and once suppressed, excusare weighs the suppression. A finding nobody has tried to excuse is not yet excusare's quarry.
- **Dead code** is `purgare`'s catch (dead CODE). Excusare's interest is the dead EXCUSE: a live, reachable site carrying a rotted or never-warranted exemption. Seam: `#[allow(dead_code)]` on genuinely-dead code is BOTH — purgare deletes the code; excusare notes the allow died with it.
- **Formatting suppressions** (`#[rustfmt::skip]`, `// prettier-ignore`) are appearance, not finding-suppression — a different ward unless the skip hides a real structural issue.

## The rune

Excusare has its own rune — the **most scrutinized exemption in the grimoire**, because it is an exemption from the weigher of exemptions, the exact recursion excusare exists to prevent. It is legal ONLY for an exemption whose warrant is **structurally immutable** — a property that cannot change without an architectural change that would itself trip another spell.

```
// rune:excusare(perennial) — <why this exemption's warrant CANNOT rot: the guarded property is structurally fixed, and any change to it would trip <named spell/checker> first>
```

**Category:**

- `perennial` — the exemption is correct-forever by construction, not by current happenstance. The reason MUST name WHY the guarded property is structurally immutable (e.g. "SHUTDOWN_RX is the substrate's single cascade signal by the universe-residency design; threading it explicitly is forbidden by the transport-oblivion invariant, not merely unwanted — changing it would trip sequi's host-idiom check first"). A `perennial` that says only "this has always been fine" FAILS — *has-always-been* is reputation, the precise rot excusare kills. A failed `perennial` maps to a verdict class: one that NEVER carried a structural-immutability argument (a reputation-plea from the start) is **ILLEGITIMATE-AT-BIRTH** (the warrant was never earned); one whose argument was once sound but has since been voided by an architecture change is **STALE-GUARD** (the warrant rotted). Both close the same way — supply a real structural-immutability argument or strike the `perennial`.

Even `perennial` exemptions are re-weighed: excusare re-reads their immutability claim against the current architecture. The weigher weighs even the pardons that claim to be timeless. The reason field is required; a `perennial` whose immutability argument no longer holds is itself a STALE-GUARD.

Placement: on the line immediately preceding the exemption being declared perennial, or folded into its reason where the host allows.

## Reporting format

For each exemption in the target:

- File path + line number + the override verbatim (the rune / `#[allow]` / `# noqa` + its reason)
- The checker it silences (which spell, or clippy/eslint/rustc/etc.)
- Verdict: **HOLDS**, or one of **ILLEGITIMATE-AT-BIRTH / OPEN-DEFERRAL / STALE-GUARD / CLOSED-DEFERRAL / ORPHANED**
- The evidence: WHY the reason does/doesn't earn the exemption — the finding is genuinely real (birth), the guarded property changed, the cited target closed (commit/date), the cited site no longer exists
- Level: L1 (actively lies NOW — silences a live finding, or defers to closed work) / L2 (warrant weakening — cited target open-but-drifting, vague reason, dangling back-reference) / L3 (still true; re-categorization or redundancy only — reported, never counted)
- The closure: remove the override + fix the code (illegitimate) / convert to a real fix / re-point at a still-open target / repair the reference / strike the exemption / mark `perennial` with a structural-immutability argument

Aggregate:
- Total exemptions weighed; HOLDS vs struck
- Prioritization: ILLEGITIMATE-AT-BIRTH and CLOSED-DEFERRALs and STALE-GUARDs that silence a live finding first (L1); dangling references and weakening warrants after (L2)

## Relationship to vigilia + the checkers

Excusare is the **peer of every finding-raiser, at the exemption layer**:

- **vigilia** summons the inward defensive spells, which RAISE findings and EMIT runes (exemptions born vouched, form-checked as written).
- **external checkers** (clippy, eslint, rustc, type-checkers) RAISE findings and accept overrides (`#[allow]` / `# noqa` / etc.) born **un-vouched** — no spell graded them.
- **excusare** weighs the exemptions of BOTH — the vouched runes (does the vouch still hold over time?) and the un-vouched overrides (was the silence ever legitimate, and does it still hold?).

vigilia watches the code. The checkers watch the code. Excusare watches every excuse offered to walk past what they found. A substrate that runs vigilia + clippy but never excusare accumulates a growing pile of suppressions no one re-judges — each quietly inverting as the code moves on, each a place a real defect can sleep behind a plausible sentence.

**Clippy-in-a-warded-home doctrine (`docs/VIGILATUM.md`):** a home's `vigilatum` stamp requires clippy-zero OR every clippy finding exempted by an excusare-HOLDS `#[allow]`. A bare or illegitimate `#[allow]` does not satisfy the bar — it is a finding excusare must strike, not a clean suppression.

## The principle behind the spell

The magistrate's office existed because a duty pleaded away once and never reviewed decays into privilege: the exemption granted for a reason that lapsed, the silence bought for a finding that was real all along. The remedy was not to forbid excuses — excuses are how genuine domain-truth overrides a rule too blunt to know it. The remedy was to WEIGH each one, when offered and as it ages, against the world as it is, and strike the ones that do not earn their standing. A codebase's overrides — runes, allows, ignores, suppressions — are its pleas of exemption. Excusare weighs them: held to present truth, at birth and over time, and the excuses that no longer earn their standing are struck. The datamancer excusat the overrides — an excuse is only as good as its reason, and a reason is true now or not at all.
