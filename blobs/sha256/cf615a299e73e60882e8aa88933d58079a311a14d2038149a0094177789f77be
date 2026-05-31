---
name: recensere
form: act
category: fidelity
reading: to re-muster the runes — every standing exemption re-judged against present truth
description: Re-muster the runes against present truth. The datamancer recenset the rolls — re-examining every already-declared exemption (stale-guard, closed-deferral, orphaned back-reference) and striking each rune whose justification no longer holds.
argument-hint: [path or directory whose runes to re-muster]
---

# Recensere

> *recensere* — Latin: *re-* (again) + *censere* (to assess, appraise, judge the worth of). The verb of the **censor**, who at each *lustrum* re-walked the citizen rolls and struck the dead, the moved, and the no-longer-qualified. 3rd-conjugation active infinitive. Sibling of *cernere* (to sift): where cernere sifts forms against the spec, recensere re-sifts the exemptions already granted.

> A pardon is not permanent. The crime it forgave may have changed.

Every defensive spell can EMIT a rune — a justified exemption: *"this looks like a finding, but it is correct, and here is why."* `rune:sequi(ambient-context)`. `rune:conformare(spanless-by-domain)`. `rune:solvere(deferred-stone-N)`. The rune is the spell's pardon: it tells the next cast to walk past a thing that would otherwise be flagged.

But a rune is written ONCE and then trusted FOREVER. No spell re-judges it. That is the exact failure the ward-marker discipline (`vigilatum`) was built to kill — *an attestation believed from reputation, never re-measured* — but living at the **rune layer** instead of the ward layer. Recensere is the censor of the rolls: it holds every standing rune up to present reality and strikes the ones whose warrant has rotted.

## The principle

A rune is an attestation of standing: *this exemption is warranted.* Standing is not timeless. The code the rune guards changes; the stone the rune deferred to ships; the site the rune annotated moves. The rune's TEXT survives all of these unchanged — it still parses, still names a real category, still reads plausibly — while its TRUTH quietly inverts. A pardon for a condition that no longer exists is not neutral: it actively greenlights the very finding the spell would now raise.

Recensere asks: **for every rune already declared, is its justification STILL TRUE — not when it was written, but now?**

This is a DIACHRONIC discipline — it measures across time, not at a single moment. It is therefore distinct from the form-check every spell already performs at cast time (*"a rune with an empty reason fails"*, *"a rune citing an arc that doesn't exist fails"*). That form-check is synchronic: *is this rune well-formed when written?* Recensere is diachronic: *is this rune still warranted as the world moved on?* A rune can pass form-check the day it is written and rot into a lie the day another stone ships — same text, opposite truth. No synchronic, per-spell check can ever catch a property that emerges only from the passage of time.

## The three rot-classes

Recensere re-musters each rune and sorts it into one of these, or passes it.

### STALE-GUARD — the guarded property changed

The rune exempts a condition that no longer holds. The classic: `rune:sequi(ambient-context)` on a field that was LATER refactored to thread explicitly through the signatures. The rune still names a real category and reads fine — but the state it pardoned (hidden ambient threading) is gone; the field is now honest, and the rune greenlights nothing, or worse, greenlights a NEW hidden-state the refactor introduced under the old pardon. The exemption outlived the condition that justified it.

*The censor's analogue: the citizen inscribed under a property class he no longer holds.*

### CLOSED-DEFERRAL — the cited stone has shipped

An attested-stone deferral rune (`rune:x(deferred-stone-N)`, `rune:x(deferred-arc-N)`, `rune:x(attested-...)`) whose named stone or arc has **closed**. The deferral was honest while the stone was open and in-reach (`feedback_defers_within_reach_tolerable`); the moment the stone ships, the rune points at done work as if it were pending — a deferral to nowhere. It must convert to a real fix (the deferred work either landed in that stone or didn't) or to a fresh rune naming a still-open target.

*The censor's analogue: the roll entry pointing at a man now dead. The recurring rot the rust_deps ward already found — a comment citing arc `001-caching-stack`, discarded months prior; deferral pointing at a dead tracker.*

### ORPHANED — the runed site moved, the reference dangles

The runed code was deleted or relocated, but a sibling back-reference comment still cites the rune (*"see helper's rune:sequi(...) for rationale"*). The pointer now leads nowhere, or to the wrong place. The exemption's justification is unreachable; a reader following the trail finds a hole.

*The censor's analogue: the roll citing a household that has moved away.*

## The four questions applied

Run on every rune in the target:

- **Obvious?** Can a reader see, from the rune and its present surroundings, that the exemption still applies? If the code the rune guards has visibly changed shape since the rune was written, the warrant is no longer obvious — and an unobvious pardon is a STALE-GUARD candidate.
- **Simple?** Is the rune's truth checkable at the rune itself, or must you reconstruct history (when did stone-N close? where did the helper move?) to know if it still holds? A rune whose truth lives elsewhere-in-time is the diachronic gap recensere owns.
- **Honest?** Does the rune still tell the truth it was written to tell? A CLOSED-DEFERRAL is the sharpest dishonesty: it reads "we'll do this in stone-N" when stone-N is done and the work either shipped (rune is a fossil) or didn't (rune hid a drop). Honesty is truth-NOW, not truth-when-written.
- **Good UX?** Does the rune still serve the next caster — pointing them past a real non-issue — or does it now mislead them past a live finding, or down a dead reference? A rune that has flipped from shield to blindfold fails here.

## What recensere does NOT flag

- **Well-formed, still-true runes.** A `rune:sequi(ambient-context)` on a field that genuinely still threads ambiently is doing its job; recensere passes it. The spell strikes ROT, not runes-as-such. (Casting recensere and hoping it finds nothing is honest only when the rolls are genuinely current.)
- **The original finding the rune exempts.** Recensere does NOT re-cast the emitting spell's whole discipline — it does not re-litigate whether the code is tangled (solvere's job) or span-less (conformare's). It adjudicates ONLY whether the EXEMPTION still holds. The emitting spell owns the finding; recensere owns the pardon's standing.
- **Malformed runes at birth.** A rune with an empty/vague reason, or one citing a never-existent arc, fails at the EMITTING spell's cast-time form-check. That is synchronic and per-spell. Recensere assumes the rune was well-formed when written and asks only whether it has since rotted. (If a malformed rune slips through, recensere may note it, but its quarry is the diachronic rot, not the birth defect.)
- **Dead code.** A runed block that is now unreachable is `purgare`'s catch — dead CODE. Recensere's interest is the dead RUNE: a live, reachable block carrying a rotted exemption. The two are disjoint; their only seam is ORPHANED back-references (which purgare may delete as dead text, while recensere reads as a broken attestation chain).

## The rune

Recensere has its own rune — and it is the **most scrutinized rune in the grimoire**, because it is an exemption from the auditor of exemptions, and that is exactly the recursion recensere exists to prevent. It is legal ONLY for a rune whose warrant is **structurally immutable** — a property that cannot change without an architectural change that would itself trip another spell.

```
// rune:recensere(perennial) — <why this exemption's warrant CANNOT rot: the guarded property is structurally fixed, and any change to it would trip <named spell> first>
```

**Category:**

- `perennial` — the exemption is correct-forever by construction, not by current happenstance. The reason MUST name WHY the guarded property is structurally immutable (e.g. "SHUTDOWN_RX is the substrate's single cascade signal by the universe-residency design; threading it explicitly is forbidden by the transport-oblivion invariant, not merely unwanted — changing it would trip sequi's host-idiom check first"). A `perennial` rune that says only "this has always been fine" FAILS — *has-always-been* is reputation, the precise rot recensere kills.

Even `perennial` runes are re-mustered: recensere re-reads their immutability claim against the current architecture. The watchman watches the watchmen, including the pardons that claim to be timeless. The reason field is required; a `perennial` whose immutability argument no longer holds is itself a STALE-GUARD.

Placement: on the line immediately preceding the rune being declared perennial, or folded into that rune's own reason where the host allows.

## Reporting format

For each rune in the target:

- File path + line number + the rune verbatim (`rune:<spell>(<category>) — <reason>`)
- Verdict: **HOLDS** (warrant still true), or one of **STALE-GUARD / CLOSED-DEFERRAL / ORPHANED**
- The evidence: WHAT changed since the rune was written (the field now threads explicitly; stone-N closed at commit/date; the cited site no longer exists)
- Level: L1 (actively lies NOW — greenlights a live finding, or defers to closed work) / L2 (warrant weakening — cited stone open-but-drifting, vague reason, dangling back-reference) / L3 (still true; re-categorization or redundancy only — reported, never counted)
- The closure: convert to a real fix / re-point at a still-open target / repair the reference / strike the rune entirely / mark `perennial` with a structural-immutability argument

Aggregate:
- Total runes mustered; HOLDS vs struck
- Prioritization: CLOSED-DEFERRALs and STALE-GUARDs that greenlight a live finding first (L1); dangling references and weakening warrants after (L2)

## What recensere is NOT

- NOT a re-run of the emitting spells (it judges pardons, not findings).
- NOT a form-checker (that is each spell's cast-time job; recensere is truth-over-time).
- NOT a central rune ledger — it reads the runes where they live, in the code, the same single-source-of-truth discipline `vigilatum` keeps for ward markers.
- NOT permanent in its own verdicts: a rune that HOLDS today may rot tomorrow; recensere is re-cast on every touch of the runed region, exactly as wards are re-earned on every touch.

## Relationship to vigilia

Vigilia and recensere are **peers at different layers of the rune's lifecycle**:

- **vigilia** summons the inward defensive spells, which EMIT runes (the pardon's BIRTH; form-checked as written).
- **recensere** re-musters those emitted runes against present truth (the pardon's LIVED STANDING; truth-checked over time).

vigilia watches the code. Recensere watches the watch's own pardons. They touch the same rune objects from opposite ends — one as it is granted, one as it ages. A substrate that runs vigilia but never recensere accumulates exactly the rot recensere names: a growing pile of pardons no one re-judges, each quietly inverting as the code moves on.

## The principle behind the spell

The censor's office existed because a roll inscribed once and trusted forever decays into fiction — the dead still counted, the moved still taxed, the fallen still privileged. The remedy was not to stop enrolling; it was to RE-MUSTER, periodically, against present reality, and strike what no longer matched. A codebase's runes are its rolls of pardon. Recensere is the *lustrum*: it walks the rolls again, holds each exemption to the world as it is now, and strikes the ones that have rotted. Attestations rot; re-measure, never trust forever. The datamancer recenset the rolls — and the pardons that no longer earn their standing are struck.
