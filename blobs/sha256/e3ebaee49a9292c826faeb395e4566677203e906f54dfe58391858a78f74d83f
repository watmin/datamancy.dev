---
name: exigere
description: Drive out deferred-work language. The datamancer exigit — what cannot ship in this stone either ships now or is bounded by a named arc; deferral-prose carries no other honest form. Substrate code does not promise future-work in comments; it ships present-work or names where the future-work tracks.
---

# Exigere

> *exigere* — Latin: to drive out; to demand; to exact; to measure against a standard. Root of English "exigent" (pressing, demanding immediate action) and "exact" (precise; admitting no deferral). Active infinitive; same typology as `purgare`, `intueri`, `secare`. Two faces, one act: drives OUT the deferral-language; demands present completion or honest scope-bounding.

> What is inscribed is inscribed. What is deferred is a wound the substrate carries until the deferring arc resolves it.

The compiler verifies syntax. The other spells verify structure, life, names, time. Exigere verifies **completion-honesty**: does this comment defer work, or document present work?

A deferred comment is the broken half of an INSCRIPTION-deferral (FM 11). FM 11 catches deferral prose in closure paperwork. Exigere catches the same prose anywhere it tries to hide in the substrate — source comments, doc-strings, runes, SCORE deltas, README excerpts. The discipline is identical; the scope is broader.

## The principle

A substrate that promises future-work in its comments lies to every fresh reader. The reader sees `// TODO` or `// would extract if Y` and must hunt — is the TODO tracked? Did the extraction happen? Is "Y" still a constraint? Each unverified deferral is a small instance of orchestrator-procedural-worry masquerading as documentation.

Exigere asks: **does this comment document the present, or defer the future?**

The present-form is honest: code documents what it DOES (and why, when non-obvious). The defer-form is dishonest: code documents what it DOESN'T do, where DOESN'T means SHOULD HAVE but DIDN'T this round.

Three honest paths exist for a finding the practitioner cannot fix in-stone:
1. **Fix it** — no comment needed; the substrate improved.
2. **Affirm the scope cut** — `Out of arc N's scope. Tracked in arc M (DESIGN at ...).` The cut is explicit; the tracker is named; both are verifiable.
3. **Open the follow-up arc** — fix lands in arc M; arc N's comment cites arc M by name.

The dishonest path: leave the comment with "future-work" prose and no named tracker. That comment is what exigere drives out.

## The four-questions applied

- **Obvious?** Does the comment tell the reader something true about the code's PRESENT state? If yes → Obvious. If the comment is about an UNSPECIFIED future state ("could RAII-ify", "would extract"), it adds no fact a reader can act on. FAILS Obvious.
- **Simple?** Does the comment have one role (document, justify, warn)? A "WHY this works + WHY the alternative wasn't taken" comment is two roles; the second role is deferral. FAILS Simple.
- **Honest?** Does the comment match what the code does? A comment that says "deferred to substrate-level refactor outside this scope" claims a deferral-contract with no named tracker — the claim has no referent. FAILS Honest.
- **Good UX?** Can a fresh reader trust the comment without leaving the file? An "outside scope" comment requires the reader to know which scope, where it's tracked, when it'll close. If those facts aren't on the line, the comment forces a hunt. FAILS UX.

A comment failing any axis is exigere's finding.

## What exigere flags as Level 1 (hard-cut default)

The list is FM 11's grep pattern + code-comment-specific phrases that surface in source. All are L1 unless ruled by an attested rune.

**TODO-family** (no arc reference = L1):
- `TODO` / `FIXME` / `XXX` / `HACK` (bare; no arc cite)
- `// TODO: <thing>` without an arc reference

**Future-arc-deferral phrases:**
- "deferred to a future arc"
- "future arc when X surfaces" / "future arc could X"
- "future cleanup" / "future polish" / "future REPL"
- "future-self" / "future caller" (when defending non-fix, not naming current contract)
- "will be" / "will land" / "can land later" / "land later"
- "left for" / "to be added" / "to-be-added"
- "not yet implemented" / "not yet supported" / "not implemented"
- "scratch arc" / "punted" / "pending arc" / "next arc"
- "small follow-up" / "small future"

**Scope-defense framing** (defending why the fix wasn't done):
- "outside scope" / "outside <X> scope" / "outside <X>'s scope" (when defending non-fix)
- "would require Y refactor" (where Y is unstated future work)
- "would be a substrate-level refactor"
- "an RAII guard would require..." (any "would require" defending omission)
- "could RAII-ify" / "could extract" / "could refactor" (could-but-didn't)

**Disposition deferrals:**
- "intentionally discarded" (when the discard hides diagnostic richness; the silent-tier contract documents itself elsewhere)
- "should be" / "should land" / "should consider"
- "if pressure" / "if demand" / "when needed" / "when surfaces" / "surfaces a need"

## What exigere flags as Level 2 (rune-eligible)

Deferral-prose WITH a named arc reference. The arc is the candidate-tracker; the rune attestation verifies the arc actually exists / is open / was inscribed.

- "deferred to arc <N>" with named arc — needs arc N verifiable
- "out of scope for <stone>; tracked in arc <M>" — needs M verifiable
- "see arc <N> for follow-up" — pointer; verify N exists

A rune may accept these IF the referenced arc resolves to a real on-disk artifact AND the reason text holds.

## What exigere does NOT flag

**Substantive code annotation** (present-tense documentation):
- `BEWARE:` / `NOTE:` / `INVARIANT:` — warns or documents current contract
- `WHY:` — positive design-decision explanation
- Doc-comments explaining CURRENT behavior (`/// Returns the parsed signature triple.`)

**Historical / retirement context** (past-tense fact):
- "arc 144 retired X" — past event; documents history
- "Stone 241.18a moved X here from runtime.rs" — past event; documents lineage
- "previously was Y; now is Z because reason" — past contrast for current shape

**Affirmative scope-bounding** (FM 11 accepted form):
- "Out of arc N's scope. Tracked in arc M (DESIGN.md at path)." — explicit cut + named tracker (rune-attested)
- "Out of arc N's scope; substrate-architectural reason: <X>; not tracked elsewhere because <Y>." — explicit cut + reasoned non-tracking
- "Arc N intentionally does NOT cover Y because the caller set hasn't surfaced demand. If/when a caller surfaces, a NEW ARC opens; arc N's INSCRIPTION does not commit to it." — explicit non-commitment

**Pure cross-references**:
- "see <function-name>" / "see <module>" — code navigation
- "matches Rust's `?` operator scoping" — semantic cross-reference

## The rune

Format: `// rune:exigere(<category>) — <reason>`

**Categories:**

- `attested-arc` — the deferral cites a NAMED follow-up arc verifiable on disk. The reason field MUST include the arc number and its DESIGN.md path (or equivalent). Example:
  ```rust
  // rune:exigere(attested-arc) — RAII guard tracked in arc 248 (DESIGN.md at docs/arc/2026/05/248-infer-ctx-raii-bracket/DESIGN.md); current push/pop pattern stays until that arc lands
  fresh.push_enclosing_ret(ret_type.clone());
  ```

- `scope-affirmative` — FM 11 accepted form: the scope cut is explicit and bounded; either tracked in a named arc OR explicitly NOT tracked with substrate-architectural reasoning. Example:
  ```rust
  // rune:exigere(scope-affirmative) — Out of arc 241's scope; check.rs widening to support function/ home is a single-stone cost, not an arc-tracked debt
  pub(crate) struct InferCtx { ... }
  ```

The reason field is required. A rune with an empty reason fails the spell. A rune that names an arc that does NOT exist on disk fails the spell.

## Reporting format

For each finding:
- File path + line number
- The deferral-prose verbatim (quoted)
- Level (L1 hard-cut / L2 rune-eligible)
- Category (TODO-family / future-arc-deferral / scope-defense / disposition-deferral / etc.)
- What the spell suggests — direction, not full rewrite
- For L2 with rune attempt: verify the cited arc exists on disk

For each rune encountered:
- File path + line number
- Category + reason text
- Verdict: clear (arc/tracker verified) OR questionable (no verification possible)

## How to invoke

```
/exigere path/to/file.rs
/exigere src/function/
/exigere docs/arc/2026/05/241-function-signature-unification/
/exigere --include-tests
```

By default, exigere casts on `src/`, `wat/`, and `docs/arc/**/INSCRIPTION.md` + `SCORE-*.md`. The `--include-tests` flag adds `tests/`. The spell can be cast on any text-bearing file.

Default vigilia inclusion: exigere joins the defensive set alongside `intueri`, `solvere`, `purgare`, `struere`, `sequi`, `temperare` for code files; alongside `intueri`, `nesciens` for docs; always for INSCRIPTION + SCORE files.

## The principle behind the spell

The substrate ships present-work. Future-work belongs in arcs (with DESIGN.md, BRIEF, EXPECTATIONS, SCORE — verifiable artifacts) or in nothing at all. A comment is the wrong vehicle for future-work-promise — it has no verification surface, no closure mechanism, no commitment honored. The promise rots; the reader trusts; the substrate accumulates lies.

FM 11 catches this at the INSCRIPTION layer (orchestrator-doctrine pre-commit grep). Exigere catches it everywhere else — source code, doc-comments, runes, SCORE deltas. The discipline is one discipline; the spell makes it cast-able instead of vigil-able.

The datamancer exigit. Code documents the present; arcs track the future; nothing in between.
