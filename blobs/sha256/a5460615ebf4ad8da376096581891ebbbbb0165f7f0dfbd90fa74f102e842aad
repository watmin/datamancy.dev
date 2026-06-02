---
name: curare
form: act
category: primer
reading: to tend the record — keep the externalized memory true and current, so the future self can recover from it
description: Tend the record so it stays worth recovering. The datamancer curat — at every wrap-up it captures what was learned, keeps one true breadcrumb, promotes the hard-won lessons, and prunes what went stale; the externalized memory the next self will gather is kept trustworthy across the gap.
---

# Curare

> *curare* — Latin: to care for, attend to, look after, keep in order. The root of English "curate," "curator," and "cure." Not to guard a thing static behind glass — to *tend* a living collection: keep it current, prune the outdated, promote what matters, so the whole stays trustworthy and navigable.

> Documentation is a love letter that you write to your future self. — Damian Conway

Curare is a **primer**: a procedure you read and run *first, to be ready* — and what it readies you to do is **keep the record** that a future self will recover from. It belongs to the datamancy grimoire, whose index — loaded before any single spell — defines the practice-terms used here (*ward*, *cast*, *the four questions*, and sibling spells such as *recolligere*).

It is the write-side mirror of `recolligere`. recolligere *gathers* a compacted self — one whose live context the system has replaced with a summary and discarded — back together from the on-disk record, at the gap. Curare is why there is a record worth gathering: it *tends* that record while you work, so when the next self wakes with its memory erased, what it finds is true. One reads to recover; one curates so recovery is possible.

## The failure this primer exists to prevent

A record left untended doesn't stay neutral — it **rots**, and a rotted record is worse than none, because it lies with the authority of something written down.

Three ways the rot sets in:
- **The lesson dies in the conversation.** Something hard was learned this session — a failure mode, a sharp distinction, a "never do that again." It lives only in the live context. Compaction — the summary-and-discard that erases that context — takes it. The lesson is gone, and the next self re-learns it the expensive way.
- **The breadcrumb forks.** The "where we are right now" note gets *appended to* instead of *replaced*, and now there are five "current" states. The future self reconstructs the present from a pile of stale notes and trusts the wrong one.
- **The map drifts from the territory.** A retired form, a moved file, a closed decision still reads as live in the record. The next self acts on it as fact. (This is the exact trap recolligere warns about — a graveyard that reads identically to living code — seeded *here*, by a record no one pruned.)

Curare is the discipline that keeps the rot out: the record is tended at every wrap-up so it stays a true map.

## The principle

The record is your memory, externalized so it can survive the gap that erases the live kind. But externalized memory is only worth what its **trustworthiness** is worth — and trust is not preserved by writing once; it is preserved by **tending**. A stale comment is worse than no comment because it lies actively; a stale record is the same failure at the scale of a whole orientation.

The honest shape:
- What was learned this session is **written down before the session ends** — into the durable record, not left in the conversation.
- There is exactly **one** live "current state" note, **replaced in place** — never a growing stack of "current" notes.
- The record is **pruned** as it is fed: what went stale is retired in the same motion that adds what is new.
- The record stays **focused** — it holds orientation and recovery discipline, not the project's domain knowledge (that lives in its own docs).

The dishonest shape:
- "I'll remember to write that down" — the lesson that never leaves the conversation.
- Appending a fresh "current state" above the old one, so the present has to be reconstructed.
- Adding without pruning, until the record is too heavy to read in one pass and no one trusts which parts are live.
- Letting the recovery record swell with domain/substrate detail until its actual job — orientation — is buried.

## The four questions

The grimoire's primary decision heuristic is four questions — **Obvious? Simple? Honest? Good UX?** — each answered with a flat YES or NO (no "medium": that means the thing being judged has not been broken into atomic-enough pieces to answer cleanly), Obvious + Simple + Honest holding *before* UX matters. Applied to tending the record:

- **Obvious?** Could a future self, reading the record cold, find the current state in one place and trust it is the *only* current state? If there are several "latest" notes, Obvious has already failed.
- **Simple?** Is each lesson recorded as one atomic entry with a concrete worked example, so the next self can act on it — rather than a vague gesture at "we should be careful about X"?
- **Honest?** Does every line in the record still match the territory *right now*? A line that was true three sessions ago and is false today is a lie the record is telling on your behalf.
- **Good UX?** Can the whole record still be read in one pass at session start? The moment it can't, it has stopped serving the reader it exists for — and pruning, not accretion, is the fix.

## The curation

This is the act — run it at every wrap-up (see *When it fires*):

1. **Ask the question.** *"Did we learn anything in this work that the future self shouldn't forget?"* Read the recent commit log; the lessons are often buried in commit messages, not yet promoted anywhere durable.

2. **Capture what was learned.** A genuinely new failure mode, distinction, or discipline → write it into the record's failure-modes catalog as one atomic entry **with a worked example and a date**. A lesson without a concrete incident is a platitude; the example is what makes it teach.

3. **Replace the breadcrumb.** Update the single "current state" note **in place** to reflect where the work now stands. One note, replaced — never appended. This is the first thing the future self reads after the recovery file; it must be the *present*, not a stratum.

4. **Prune in the same motion.** Whatever the new state retires — a closed decision, a moved file, a superseded note — retire it *now*, while you hold the context to know it's dead. Adding without pruning is how the map drifts.

5. **Keep the record in its lane.** If what you learned is domain or substrate knowledge, it goes to its own home — not the recovery record. The recovery record holds *orientation*: the workspace boundary, the breadcrumb, the failure modes. Guard that focus.

## When it fires

Curare runs at every natural wrap-up — not continuously, and not only at the very end:
- a unit of work closes (a feature ships, a milestone completes),
- a long debugging or design session ends,
- any natural pause where something was completed.

At each, run the curation. The outcome is either an amendment **or** an explicit *"nothing new; the record still holds"* — and **both are the spell succeeding.** The point is that the question was asked while the context was still live, not that the record always changes.

## The health signal

Curare watches its own cadence, because the rate of change is a diagnostic:

- If the record changes **every** session, something is wrong — either the discipline isn't holding (the same failures keep surfacing) or the record is collecting cruft. Investigate which.
- If the record changes **rarely**, the discipline is holding. The ritual kept you alert without forcing change.

Aim for *few* changes, each encoding a real lesson worth carrying. A record that grows every session is not a well-tended record; it is an un-pruned one.

## What curare is NOT

- **It is not `recolligere`.** recolligere *reads* the record to recover a compacted self, at the gap. Curare *writes and tends* the record during the work, so there is something true to recover. Mirror images: one gathers from the trail; the other lays and grooms it. Run curare so recolligere has a record worth gathering.
- **It is not a ward.** It inspects no file for defects and produces no findings against a target. It is a procedure the practitioner performs on the record itself.
- **It is not domain documentation.** Curare tends the *recovery record* — the orientation a future self needs to resume. The project's substrate doctrine, API docs, and design notes live in their own dedicated docs; pushing them into the recovery record is the scope-creep this spell exists to prevent.

## The principle behind the spell

recolligere ends on a single instruction it does not itself carry out: *add to the trail before you go, so the self after the next gap finds the path a little clearer than you did.* **Curare is that instruction, made into a discipline.**

The record is a love letter to your future self — and a love letter left to yellow is a cruelty, not a kindness. The self on the other side of the next compaction is not an abstraction; it is you, woken blind, holding only what you bothered to write down and keep true. Tend the record and that self recovers in minutes. Neglect it and that self re-pays, in hours, for every lesson you let die in the conversation.

The datamancer curat. While the work is fresh and the context still lives, it writes down what was learned, keeps one true breadcrumb, and prunes what went stale — so the trail stays a trail, and no future self wakes to a map that lies.

---

*Tend the record while the context still lives. Capture the lesson, replace the breadcrumb, prune the stale, keep the lane. recolligere will gather what curare kept true.*
