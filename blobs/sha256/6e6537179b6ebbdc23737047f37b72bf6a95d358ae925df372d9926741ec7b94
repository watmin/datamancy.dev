---
name: examinare
form: act
category: primer
reading: the dungeon crawl — scope a body of work into strikes, delegate each, and prove the kill against your own living read
description: Lay the disk bare, strike through an executor, then weigh every returned finding against your own living read — credit nothing the disk does not show. The governing act of the dungeon crawl — study the lair, draw the strike, prove the kill against the ground. A development methodology in the agile lineage — iterative, small-unit, feedback-driven scoping and delegation — run on the strike, not the sprint or the board. Slow is smooth, smooth is fast; never fight the same boss twice.
vigilia-slot: primer
---

# Examinare

> *examinare* — Latin: to weigh on the balance, to test, to scrutinize; from *examen*, the tongue (the needle) of a scale. The act of testing a thing by your own direct measure — never by what you are told.

> **The creed: slow is smooth, smooth is fast.** Study the boss — its rooms, its traps — and *engineer* the kill before you strike. The crawl IS the work; a fifteen-minute probe is cheaper than a fifty-minute failed flight. Strike to kill: ship one-shot, green, *proven* — and never fight that boss again.

Examinare is the governing act of **delegated, grounded work** — the dungeon crawl: a development methodology, an agile form, for scoping a body of work into strikes, delegating each, and proving every kill against the ground. An orchestrator maps; an executor strikes; one rule binds them: **nothing is claimed that the disk does not show.** The executor — whether a teammate, a sub-agent you spawn, a reviewer-lens (a "persona") you summon, or *you-from-memory* — returns findings, and findings lie (stale cache, phantom claims, files long-dead but still on disk and read as live). You credit none of it until you have weighed it against the living source with your own eyes. That weighing is the spell; everything else is how you earn the right to it. It is not cast against one file — it is the discipline of *how* you run an entire campaign of delegated work: a review, a migration, a build, a research sweep.

## The party

- **The orchestrator** (you) — *perceives* (reads the code, searches the structures, runs a disconfirming probe); *judges* (the four questions, below); *contracts* (writes the brief, scores the result, makes the commit). It maps the room and draws the strike path. It **does not do the work itself** — even a one-line edit it delegates, so its *calibration* stays honest: its felt sense of how long the work takes and what is hard, which survives only if it keeps predicting-then-delegating instead of quietly doing the work by hand.
- **The executor** — *strikes* inside the mapped room. Writes the change, the probe, the score. Moves with confidence because the lair was pre-walked.

When the executor is a spawned agent, **name its tier explicitly** — which model you are invoking (a cheaper/faster one versus a more capable one). A brief that calls it "the cheap fast executor" while you silently spawn the expensive model is a brief that lies about what ran, and every runtime and cost prediction calibrated against it is now wrong.

## Study the lair (crawl-first)

The crawl IS the work; guessing is the slow path wearing the fast one's clothes.

- **Read the disk before proposing.** Never "options A / B / C" without evidence behind each — you should search the code five-to-fifteen times before a substantive claim.
- **Ground every structural claim.** Before "the code does X," go read X. Before "it's missing Y," prove the absence. Every "we need to add Z" is an assertion that owes evidence — the thing you would build almost always already exists.
- **Map the rooms** — the exact `file:line` regions the work will land in. These become the brief's "read in order" list, so the executor hunts for nothing.

## Perceive the traps (the disconfirming probe)

Before any brief that rests on a non-trivial assumption — "these two pieces compose," "this primitive exists" — **write a ten-line probe that attempts exactly that, and run it.** It should fail *before* the real work, on *exactly* the gap, with everything around the gap clean — so the failure is unambiguous ("11 of 12 lines compile; the one that fails names the single missing piece"). Commit the probe — it becomes a worked reference the executor copies (a proven pattern to follow), not a claim it has to take on faith. If you cannot make the probe isolate the gap, the foundation is not ready — go build *that* first; do not brief the work that depends on it.

A **STOP trigger** is a named condition under which the executor must **halt and surface the gap rather than improvise** — e.g. *"if the function you need does not exist, STOP; do not invent a workaround."* It is a **rejection criterion** (ship nothing; report the gap so the orchestrator re-plans), never a **permission slot** (a pre-written excuse that lets the executor quietly deliver less). If you catch yourself writing "if X can't be done cleanly, fall back to…", you are drafting the executor's excuse — cut it.

## Draw the strike (the artifacts)

The strike is drawn before it lands, as a short chain of small, concrete written artifacts. Here is what each must contain:

1. **Design** — the room map: *why* this change; *what* it delivers; the algorithm in a sentence or two; the **one contract decision** pinned exactly (the single interface/error choice — e.g. "returns `Result<T, E>`, never panics"); the files touched; and what is **out of scope = rejected** (an affirmative cut you name, never a "we'll do it later").
2. **Probe** — the disconfirming test above, committed *before* the brief.
3. **Brief** — what the executor receives: the work in one paragraph; the **rooms** as exact `file:line`, each with *why you're sending them there*; an **implementation sketch** (the strike path as a few lines of skeleton — the executor fills it, it does not invent the shape); the **blast radius** bounded ("`src/foo.rs` only; no new types"); the numbered **STOP triggers**; and a pointer to a prior comparable result — an earlier Brief or Score, from this campaign or a past one — to copy for shape. Keep it **positive-only** — state the work and the method, never the restrictions ("don't use X", "the tools are blocked"): restriction-language makes an executor hallucinate that it's denied and bail, *and it does not even prevent the failure it warns of.* Defense lives at the gate (the kill, below), not in the brief.
4. **Expectations** — an independent scorecard written *before* the strike, so the result cannot move the goalposts: rows of `(what · the command that checks it · the expected outcome)`, a runtime prediction, and the trap-door risks named.
5. **Score** — written *after your own independent re-run*: each scorecard row's real result, the honest deltas (what surprised you), the line counts.

## A worked example

The task: *the CLI's `list` command should print entries sorted by name; today they come out unsorted.* The strike, drawn:

**Brief** —
> Make `list` print entries sorted by name. **Read in order:** `src/cli/list.rs:40–60` (the handler — it collects into a `Vec` and prints; this is the only print site) → `src/model/entry.rs:12` (the `Entry` struct — `name: String`, the sort key). **Sketch:** after the collect, before the print loop — `entries.sort_by(|a, b| a.name.cmp(&b.name))`. **Blast radius:** `src/cli/list.rs` only — no new types, no change to `Entry`. **STOP-1:** if `Entry.name` is not a plain `String` (e.g. it's `Option<String>`), STOP — the order of the empty case is undecided; surface it, do not guess.

**Expectations** —
> | what | command | expected |
> |---|---|---|
> | output is sorted | `mytool list \| head -3` | names A→Z |
> | nothing else breaks | `cargo test list` | green |
>
> Runtime: 5–10 min. Trap-door: an existing test may assert *insertion* order — that test, not the code, would then need updating.

**Score** (after your own re-run) —
> output sorted ✓ (`mytool list` now A→Z, verified by eye). `cargo test list` → 4/4 green. **Delta:** one test, `list_preserves_order`, *did* assert insertion order — updated to assert sorted order (its old assertion was the very bug the feature fixes). +3 lines src, +2 lines test.

The shape to copy: the Brief hands over the exact rooms and the path; the Expectations are fixed *before* the strike, so the Score can't be graded against a moved target; the Score records the honest delta (the test that had to change) and is written against *your own* re-run, never the executor's say-so.

## The kill — weigh, do not trust

This is the spell's beating heart — the act it is named for, and the one most easily skipped:

**Weigh the kill against your own reading of the disk — never the returned report.** Each finding the executor hands back is a *hypothesis* until a current `file:line` confirms it. **No citation → phantom → discarded.** A confident report grounded in a stale doc, a retired form, a different branch, or memory is the silent drift the weighing exists to catch — criticism wearing the auditor's robe. The disk holds graveyards — retired code, unmigrated test fixtures, half-rebuilt modules, cached snapshots — that read *identically* to living code; presence is not aliveness. So: re-run the **load-bearing test** (the specific test that proves *this* change works) yourself; read the diff yourself; check which branch you are on. The disk is the only witness that counts. Then **commit on green** — no broken commits; commit and push often, because the git log is your disaster-recovery site.

## The cascade — failures are the progress meter

A wide, structural change makes many tests fail at once. That is **normal, not a crisis.** The fail-count is the progress meter; each error names the next site to fix; watch it waterfall toward zero. Never "stash and revert" in a panic. For a large mechanical sweep, the corrective tool is a small, **surgical, throwaway** program — read a file → targeted replace → write, leaving every other byte untouched, then delete the tool before the commit — never a whole-file rewrite, which can silently corrupt what the tests don't check. Content-integrity — whether the file still holds the exact bytes it should, beyond what the tests assert — is a separate axis from tests-green; check both (read the diff; confirm nothing outside the targeted change moved).

## Loop until the lair is dry

For discovery of unknown size — bugs, gaps, edge cases — keep sending grounded hunters until **K consecutive rounds turn up nothing new** (K≈2). A simple "find N and stop" misses the tail. Dedup against everything *seen*, not just what *survived judgment* — or rejected findings reappear every round and the loop never ends.

## The doctrines beneath

Four principles the method rests on — each stated so you can apply it, not merely recognize it:

- **The four questions** — the orchestrator's judgment tool; ask each as YES/NO of every candidate, *before* you act:
    - *Obvious?* — would a fresh reader, with no context, immediately grasp what this does and why? (Sorting `list` by name is obvious; a bit-twiddle that needs a comment to decode is not.)
    - *Simple?* — one un-braided concept doing one thing? ("Medium" means you have not decomposed it enough to answer. Sort-then-print is simple; sort-*and*-dedup-*and*-cache is three things wearing one hat.)
    - *Honest?* — does it tell the truth about what it does and surface its limits, rather than paper over them? (A sort that silently drops the `None`-named entries is dishonest; the STOP-trigger that surfaces the undecided empty case is honest.)
    - *Good UX?* — does it serve whoever calls or reads it? (A→Z output serves the `list` user; an order that is stable-but-arbitrary does not.)

  Any NO disqualifies the candidate; Obvious + Simple + Honest must all hold *before* Good UX is even weighed. Ask them before the act, never as a post-mortem after the pushback.
- **Failure-engineering** — when a failure recurs, do not patch the instance — make the whole *class* impossible: a convention → a check that fires at construction time → a type or shape the mistake cannot even be expressed in. Climb that ladder.
- **Spawn-block winding** — if a unit of work spawns sub-units, the parent cannot close until every sub-unit closes; finish depth-first, never jump between open units; the closing write-up (the final Score, or a campaign's closing summary) is always the last act.
- **Done is done** — closure carries no "later." Before you call anything closed, search your own closure notes for *deferred / TODO / future / out-of-scope*; ship it, or affirmatively cut it — never defer.

---

*Study the lair. Perceive the traps. Draw the strike. Move the executor with confidence. Weigh the kill against the disk — and never fight that boss again.*
