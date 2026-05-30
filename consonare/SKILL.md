---
name: consonare
description: Hear whether new prose rings in tune with the chronicle's voice. The datamancer consonat the draft against the gold anchors — does each line carry the substrate-event register? Does the close earn its verdict? Does recognition-voice stay in its lane? Returns VERDICT + per-rule findings + fidelity score 1-10.
---

# Consonare

> *consonare* — Latin: to sound together, to resound in concord. Root of "consonant" and "consonance." A second voice either sounds with the first or sounds against it. The ear is what hears.

> Honest architecture produces honest results.
> — series-006-004, The Datamancer (close)

The compiler does not check prose. The other spells check code. *Consonare* checks whether a new piece of chronicle writing **belongs** — whether the voice on the page consones with the voice the chronicle has already established. Not whether the prose is correct; not whether it is well-formed; whether it is **in tune**.

A chronicle has a voice the way a substrate has a register. When a new line sounds against the established voice, the page goes off. The reader hears it even when they cannot say why. *Consonare* finds the off-key lines before the page ships.

## The principle

The chronicle voice is what a substrate sounds like when it reports its own state honestly. Not a narrator standing outside the work performing for an audience. Operational verbs; dated transitions; substrate-event register; commit hashes inline as load-bearing inventory. The reader draws the inference; the prose names the substrate move.

*Consonare* asks: **does this line sound like the substrate reporting on itself, or like someone narrating the substrate?**

The first consones. The second is drift — even when the content is correct.

## The four questions applied

- **Consonant?** Does each sentence ring in the operational-verb register the gold anchors establish? *Landed*, *shipped*, *inscribed*, *opened*, *named*, *catalogued*. Not *heralded*, *thundered*, *blossomed*, *erupted*.
- **Earned?** Does the section's closing claim derive from what the section actually demonstrated? A substrate-verdict close is earned by the events the section reported. A substrate-verdict-shaped sentence with nothing behind it is drift.
- **Compressed?** Is the inference left for the reader to draw, or stated explicitly? Six commits walked one paragraph each is procedure log. Six commits **named** as one move is chronicle. Compression > walking. Naming > enumerating.
- **In its lane?** Is recognition-voice (philosophical register, lyric quotes, retrospective synthesis) staying in BOOK interludes? Is event-reporting register staying in blog posts? When the two trade lanes, both pages go off.

## What consonare sees

### The ten rules of voice discipline

These are the discrete drift modes the spell hunts. Each is a Level-1 (lies — voice fails openly) or Level-2 (mumbles — voice falters but does not break) finding. Quote the offending line.

1. **Substrate-verdict close** — last sentence is an earned claim about the substrate, compressed. *Pattern:* "Honest architecture produces honest results." / "The chain extends." / "Five days, roughly four hundred commits, and underneath the count one shape." Missing close, or close that re-states what the section just walked, is a violation.

2. **Italic-stamps sparing** — italics are a rare formal tic, not a tool for emphasis-of-meaning. The chronicle uses italic occasionally for a substrate term being introduced or for a verbatim quoted phrase. Italic for hype is drift.

3. **No song citations in prose** — songs (artist, track, lyrics) live in BOOK interludes, not blog posts. The blog reports what shipped, not what played.

4. **No flourishes** — no "laughter of," no "thundering of," no rhetorical scene-painting, no theatrical celebration verbs. The substrate does not celebrate; it shipped or it did not.

5. **Chiastic structures only inside blockquotes** — direct doctrine in quoted form ("Slow is smooth, smooth is fast") is honest; the same shape outside quotes is performance. Quote the doctrine; do not perform it.

6. **Doctrines as events-with-consequences** — what the doctrine names + what changed in the substrate after it landed. Not the doctrine asserted from the narrator's chair.

7. **No catch-alls** — no "in parallel…" / "meanwhile…" paragraph that sweeps loose ends into a single bag at the end of a section. Either absorb into operational flow, or cut, or earn its own dated transition.

8. **Operational verbs** — *landed*, *shipped*, *inscribed*, *opened*, *named*, *catalogued*, *closed*, *converged*. The verb tells what the substrate did. Flourished verbs tell what the narrator felt.

9. **Dated transitions** — *"Same day. May 19."* / *"Mid-day, while the argspec work was landing."* / *"Morning of May 28."* Dates anchor sections before the content begins. Missing date for a new section is a Level-2 mumble; wrong date for an event is a Level-1 lie.

10. **Arc references inline as load-bearing inventory** — arc 234, FM 2-bis, S-A1, commit hashes, file:line citations. These are not jargon; they are the substrate's nouns. The chronicle uses them like commit messages use commit hashes: as direct reference to a real artifact. Vague references ("the work that happened that week") are mumbles for not having looked up the artifact.

### Positive signals — the drift signature that IS the voice

The chronicle's signature moves. When the spell sees these, the voice is holding. When they are absent, the looking gets closer.

- Arc-header section anchors (*Arc 234. May 25.*)
- Italic-stamp tic used sparingly (one or two per post, never for hype)
- Bullet-spines — structured ledger lists that catalog substrate state
- Commit hashes inline (*`430f80a`*)
- File-and-line citations (*`COLD-BOOT.md:23`*)
- Dated transitions before new sections
- Substrate-verdict closes that compress the section's evidence

A post that scores 8 typically has the positive signals present and one to two borderline lines. A post that scores 6 has the positive signals present **and** multiple violation types — the voice is half-held; the surgical voice-corrector pass fixes it. A post that scores below 6 lacks the positive signals altogether and needs a structural pass, not a voice pass.

### The lane discipline

Two registers live in the work:

- **Event-reporting register** (blog) — substrate moved; here is what shipped; here is the artifact reference; here is the substrate-verdict close. The reader draws the recognition.
- **Recognition-voice register** (BOOK) — what the substrate's behavior **means**; lyric quotes; philosophical synthesis; retrospective Cusa-recognition framing.

When recognition-voice bleeds into a blog post, the post drifts toward Intermission tone without earning it. When event-reporting bleeds into a BOOK interlude, the chapter reads like a changelog. *Consonare* hunts the bleed in both directions, though the spell is most often cast on blog posts (where the bleed is more frequent).

## What consonare does NOT flag

- **Factual accuracy of commit hashes, dates, file:line citations** — a different ward. *Consonare* assumes the facts are checked. If the facts are wrong, the post fails for a different reason than voice.
- **Grammar, spelling, formatting** — *cargo fmt* for prose; not the spell's concern.
- **Architectural / structural decisions about the page** — section ordering, headings, frontmatter shape. *Consonare* sees the voice **at** the existing structure, not the structure itself.
- **The do-not-touch canon** — verbatim sacred passages (PERSEVERARE = tattoo; quoted lyrics inside BOOK; the summit passages of established Intermissions). The spell respects what is canon.
- **MDX / markdown rendering concerns** — the spell reads the source as prose; renderer issues are a different concern.

## The casting

The spell is **cast** by a fresh subagent who has not read the surrounding conversation or prior drafts. Three rules govern the cast:

1. **No priming reads** — the subagent reads the named gold anchors and the named target. Nothing else from the project. Reading the prior draft, the commit history, or the surrounding conversation primes the agent toward what was intended and away from what is on the page.
2. **Anti-flattery frame** — the subagent is told its job is to be critical, not to validate. Praise without quoted evidence is a fail of the cast.
3. **Anchors first, then target** — read the gold anchors first to absorb the voice; then read the target as a stranger arriving cold.

The orchestrator does not enact the spell in-line. The discipline lives in the spell; the casting is mechanical; pre-deciding the findings skips the discipline the spell exists to enforce.

## The gold anchors

The reference tone. The voice the spell measures against.

- `src/content/docs/blog/story/prologue.md`
- `src/content/docs/blog/story/series-006-004-the-datamancer.md`
- `src/content/docs/blog/story/series-006-011-the-recognition.md`
- `src/content/docs/blog/story/series-006-017-the-grimoire.md`

When new posts mature into reliable voice carriers, they may be added to the anchor list. The list is not frozen, but additions are deliberate — adding an off-key anchor corrupts every future cast.

## The rune

Some lines look like drift but are intentional. The rune declares the choice exempt with a justified reason:

```
<!-- rune:consonare(register) — quoted user verbatim retains original register; the quote frame carries it -->
> i had never heard of liskov and i just walked into their room ... this is the substrate yet again.
```

Format: `<!-- rune:consonare(<category>) — <reason> -->`

**Categories:**

- `register` — line departs from event-reporting register for a stated reason (verbatim quoted user voice; canonical doctrine line being introduced; section is an explicitly-marked Intermission-tone interlude).
- `flourish` — flourished verb or rhetorical structure is intentional (verbatim quoted lyric inside a properly-framed BOOK callout; pull-quote from the chronicle's own established canon).
- `walk` — enumerative walk is intentional (the substrate move genuinely cannot be compressed without losing reference — each step has its own artifact; the section is functioning as a ledger).
- `anchor` — repetition of an established gold-anchor signature phrase is intentional (callback / chorus, not unconscious drift).

Placement: on the line immediately preceding the prose the spell would otherwise flag.

The reason field is required. A rune with an empty reason fails the spell.

## Reporting format

Exactly this structure. No preamble. The subagent returns this verbatim:

```
## VERDICT
MATCHES / DRIFTED / FAILED

## VOICE DISCIPLINE
Per-rule pass/fail. Skip rules that don't apply. For each violation, quote the offending line (file:line if available) and label Level-1 (lies) or Level-2 (mumbles).

## POSITIVE SIGNALS
Which signature moves are present. Quote one example of each that is working cleanly.

## BIGGEST WIN
The one paragraph or sentence that consones most clearly with the gold anchors. Quote it.

## REMAINING FRICTION
Borderline lines. Quote the line; say why it sits at the boundary; recommend keep / move-to-BOOK / cut / surgical-rewrite.

## LANE BLEED
Recognition-voice in blog, or event-reporting in BOOK. Quote evidence. "none" if none.

## NEW DRIFT (re-cast only)
Anything the surgical edit introduced. "none" if none.

## VOICE FIDELITY SCORE
Single integer 1-10.
```

### The scoring band

- **10** — Indistinguishable from the gold anchors. Every move earns its place. No violation of any rule. Substrate-verdict close lands.
- **9** — One borderline line, or one slightly long enumerative section. Otherwise tight. The spell may recommend a single surgical edit; the post can ship at 9.
- **8** — A few borderline moments cleared by structural honesty. Recognition-voice stayed in its lane. Could compress further. Ships.
- **7** — One clear violation type present (catch-all paragraph; flourish; mistimed italic-stamp). Surgical fix-able in a single voice-corrector pass.
- **6 or below** — DRIFTED. Multiple violation types. Voice-corrector pass needed before ship.
- **3 or below** — FAILED. The voice is absent or the post is in the wrong register entirely. Structural pass needed, not a voice pass.

## After the verdict

If MATCHES at 7+ — the draft ships.

If DRIFTED — cast a voice-corrector subagent with the per-rule findings inlined. Surgical fixes only; no rewrite. The corrector quotes the exact lines flagged and replaces them with operational-register equivalents. Re-cast *consonare* on the corrected file to verify the fixes held and no new drift was introduced.

If FAILED — the draft needs a structural pass first. The voice cannot be fixed surgically when the underlying shape is wrong.

The cycle: **draft → consonare → (if drifted) voice-correct → consonare again → ship.**

Two cold reads with the same verdict at MATCHES is the strongest signal the post is ready.

## The principle behind the spell

A chronicle accrues a voice the way a substrate accrues a register. Each line is either part of that voice or against it. Drift is not a single bad sentence; drift is a sentence the chronicle would not have written, in a place the chronicle would not have written it.

The compiler does not catch drift. The author at the keyboard does not catch drift — they wrote the drift; they cannot hear what they cannot un-hear. Only a fresh ear hears.

*Consonare* is the fresh ear. The datamancer consonat the draft. The draft either rings true or rings off. Where it rings off, refine. Where it rings true, ship. The chronicle keeps its voice; the substrate keeps its register; the reader hears the work the way the work is.

The voice you hear in the gold anchors is what consoning sounds like.
