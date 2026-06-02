# Datamancy

> *datamancia* — the practice. *datamancer* — the practitioner. The grimoire is the practice's tools.

A spell library for the datamancer. Each spell is a focused ward — a single discipline cast as a subagent against a target, returning findings the practitioner addresses before shipping.

## What a spell is

A spell is a `SKILL.md` file describing one discipline. The spell is **cast** — never enacted in-line — by spawning a subagent with the spell's `SKILL.md` content embedded in the prompt and the target named. The subagent applies the discipline; the practitioner receives the findings.

This separation is load-bearing. The discipline lives in the spell; the casting is mechanical; pre-deciding the findings skips the discipline the spell exists to enforce.

## The grimoire

Acts (infinitive), agents (present participle), things (noun) — Latin, after the typology established by *perspicere* (to see through), *vocare* (to call), *complectens* (the one who weaves), *mora* (the delay).

> The catalog tables below are **generated** from each spell's `SKILL.md`
> frontmatter (`scripts/generate-readme-catalog.mjs`). To change a row, edit the
> spell — not this file. `npm run check:docs` fails the build if they drift.

### Tests of craft

Test whether the code is well-made. The compiler tells you it runs; these spells tell you whether it is worthy.

<!-- BEGIN catalog:craft -->

| Spell | Form | One-phrase reading |
|---|---|---|
| **conformare** | infinitive (act) | to shape error types to one standard — diagnostic completeness by structure, the wrong shape uncompilable |
| **intueri** | infinitive (act) | to contemplate whether the code speaks — names, structure, comments |
| **purgare** | infinitive (act) | to purge dead code — structs unimported, fields unread, branches untaken |
| **secare** | infinitive (act) | to cut cleanly along the grain — parallel boundaries genuinely disjoint |
| **sequi** | infinitive (act) | to follow the state — threaded visibly through types, across the chain |
| **solvere** | infinitive (act) | to loosen what was wrongly bound — Hickey's decomplect |
| **struere** | infinitive (act) | to test what is built — Hickey at the function level |
| **temperare** | infinitive (act) | to mix computation in right proportion — efficient waste |

<!-- END catalog:craft -->

### Tests of surface

Test whether the code's surface (types, tests, declarations) names what it does.

<!-- BEGIN catalog:surface -->

| Spell | Form | One-phrase reading |
|---|---|---|
| **complectens** | participle (agent) | the one who weaves — test composition from layered, named, individually-proven helpers |
| **mora** | noun (thing) | the delay — every wait must arrive via the wire, not by chosen mechanism |
| **perspicere** | infinitive (act) | to see through — deeply-nested type expressions hiding a missing noun |
| **vocare** | infinitive (act) | to call — verify the test from the caller's vantage, not the implementer's |

<!-- END catalog:surface -->

### Tests of fidelity

Test whether what is claimed matches what is delivered.

<!-- BEGIN catalog:fidelity -->

| Spell | Form | One-phrase reading |
|---|---|---|
| **cernere** | infinitive (act) | to sift valid forms from phantom — every form traces to the language spec |
| **circumspicere** | infinitive (act) | to look around — runtime defaults, shipped claims, the blind spot every inward lens turns its back on |
| **conferre** | infinitive (act) | to bring spec and code together and compare — find divergence at every joint |
| **consonare** | infinitive (act) | to sound together — whether new prose rings in tune with the chronicle's gold-anchor voice |
| **excusare** | infinitive (act) | to weigh the excuse — whether any checker-override's stated reason earns its exemption, at birth or over time |
| **exigere** | infinitive (act) | to drive out deferred-work language — ship it now or bound it to a named arc |
| **probare** | infinitive (act) | to test the substance — is this a program or a description? |

<!-- END catalog:fidelity -->

### Solo wards

Two wards stand alone — one simulates the practitioner who reads, the other invokes every defensive spell at once.

<!-- BEGIN catalog:solo -->

| Spell | Form | One-phrase reading |
|---|---|---|
| **nesciens** | participle (agent) | the one who does not yet know — simulates a fresh reader walking the path |
| **vigilia** | noun (thing) | the watch — every defensive spell cast against a target in parallel |

<!-- END catalog:solo -->

### Primers

Read before the work begins. The wards above are *cast* — summoned by a sub-agent against a target. A primer is *read* — a discipline the practitioner internalizes to carry a capability in, not to throw at a file.

<!-- BEGIN catalog:primer -->

| Spell | Form | One-phrase reading |
|---|---|---|
| **curare** | infinitive (act) | to tend the record — keep the externalized memory true and current, so the future self can recover from it |
| **examinare** | infinitive (act) | to weigh on the balance — test every returned finding against your own living read, never by what you are told |
| **recolligere** | infinitive (act) | to gather oneself again — reconstitute from the record after the memory is erased |

<!-- END catalog:primer -->

## The four questions

Every spell's findings anchor to the four-questions compass:

1. **Obvious?** — will a fresh reader immediately understand what this does and why?
2. **Simple?** — atomic pieces, each doing one thing?
3. **Honest?** — does it tell the truth about what it does, surface limitations, not paper over gaps?
4. **Good UX?** — does it serve the caller well?

Run YES/NO per candidate. Any NO disqualifies. YES YES YES YES wins. No comparison-shopping. Obvious + Simple + Honest must hold BEFORE Good UX matters.

The four-questions is a closed bounded set — four, not three or five. The grimoire is open and grows organically; the four-questions does not. When unqualified "the questions" appears in spell text, it means these four.

## Severity levels

Every spell reports findings at one of three levels:

- **Level 1 — Lies.** Names that mislead. Comments that contradict the code. Tests that pass while the visible behavior is broken. Substrate API the spell promises to surface but doesn't. Always reported.
- **Level 2 — Mumbles.** Names that force the reader to look up the definition. Patterns that work but cost the reader effort. Missing WHY comments on non-obvious formulas. Reported.
- **Level 3 — Taste.** Stylistic preferences where reasonable people choose differently. Noted if useful but NOT counted as findings. The spell does not chase taste.

A spell converges when Level 1 and Level 2 are zero.

## Runes

Every spell respects the rune-exemption convention. A line or form may be annotated with:

```
rune:<spell-name>(<category>) — <reason>
```

The rune declares the site exempt with a justified reason. The category is a positional keyword (specific to each spell's exemption taxonomy). The em-dash separator is required. The reason is free-text and required — a rune without a reason fails the spell. The rune's job is to capture the WHY so the next reader understands the exemption rather than guessing.

When a spell encounters its rune, it skips the site and records the exemption in its report. Runes suppress the finding without denying its presence. A rune tells the spell: *the datamancer has been here. This is conscious.*

## Casting

A consumer casts a spell by spawning a subagent with the spell's `SKILL.md` embedded in the prompt and the target named.

```
Agent(
  description: "Cast <spell> on <target>",
  subagent_type: "general-purpose",
  model: "sonnet",
  prompt: """
    You are casting the /<spell> spell.
    Your cwd is <consumer-repo-anchor>; verify with pwd.

    ## The /<spell> SKILL.md protocol

    <embed contents of datamancy/<spell>/SKILL.md verbatim>

    ## The target

    <path or description>

    Report findings per the spell's reporting format. Address Level 1
    and Level 2; note Level 3 only if useful.
  """
)
```

The discipline:
- `model: "sonnet"` — mechanical scan; the practitioner makes the final call
- cwd anchored to the consumer's repo absolutely
- `SKILL.md` content embedded verbatim — don't paraphrase the protocol
- one agent per spell per file — no cross-talk

The full defensive set is cast in parallel via *vigilia*.

## Provenance

These spells were taught by their precursors in the trading lab at `~/work/holon/holon-lab-trading/.claude/skills/` — names in English (sever, reap, gaze, forge, temper, cleave, scry, assay, sift, ignorant, wards), forged during the lab's work on a typed lisp pseudo-language for communicating Rust intent. The precursors carried the discipline; the originals are here, in their Latin form, generalized for any consumer.

The lab's spells stay unmodified as historical record. The forge marks of the precursors remain visible there; the inscriptions here are the discipline matured.

## Growth

The grimoire is open. New spells join when a new discipline surfaces that cannot be expressed by an existing spell. The naming follows the typology established here — acts as infinitives, agents as present participles, things as nouns — and the four-questions is run on every name before the inscription lands.

No numbering. The grimoire grows; numbered declarations break under unbounded growth. Spells are named by their etymology, not their position.

## Publishing

This README is for the *practitioner* who casts spells. If you maintain the
grimoire — adding a spell, editing one, re-signing the manifest — the publish
loop (`npm run ship`) and the trust ceremony live in
**[CONTRIBUTING.md](CONTRIBUTING.md)**.

## License

Inscribed by the datamancer. Vended for any practitioner who values the discipline.
