---
name: partire
form: act
category: craft
reading: to divide a module along its cohesion seams — should this file be split, and if so, where?
description: Decompose a module along its true seams. The datamancer partit the file — does it have one reason to change, or several? A file that braids independent domains, each with its own reason to change and its own test surface, is several modules wearing one name; partire finds the minimum cuts that make each piece obviously one thing, or returns LEAVE when the file is one concern at length.
vigilia-slot: conditional-code
vigilia-order: 5
vigilia-concern: Module cohesion — one reason to change, or several?
vigilia-trigger: solvere reports braiding at two or more sites in one file whose function-level fixes conflict, or the practitioner flags a file as spanning more than one domain
---

# Partire

> *partire* — Latin: to divide, part, distribute, share out; the active infinitive beside deponent *partīrī*. The root of *pars, partis* (a part) and the direct ancestor of "partition" and "part." Not to cut a thing in half — to divide it **into its parts**, along the lines the thing already has.

> We propose instead that one begins with a list of difficult design decisions or design decisions which are likely to change. Each module is then designed to hide such a decision from the others. — David Parnas, *On the Criteria To Be Used in Decomposing Systems into Modules* (1972)

Partire checks **whether a module is one thing or several wearing one name** — and if several, **where the seams are.** It is the structural question one level above the function: `solvere` finds where two *concerns* braided — interleaved so that one cannot move without disturbing the other — inside a file; `intueri` finds where a *name* lies; `purgare` finds where a *thought* died. None of them answers the question the practitioner asks when holding a large, sprawling module: **should this file be split, and if so, where?**

Size is not the question. A three-thousand-line parser can be one concern — one design decision (the grammar) expressed at length. A two-hundred-line file mixing key management, HTTP routing, and audit logging is three concerns, three reasons to change, fused into one name. Partire reads the file's **concern graph** — the map from each region to the one reason it would change — never the line count.

## The principle

A module earns its boundary by **hiding one decision likely to change.** Parnas's criterion, made operational: a module has **one reason to change** when every part of it changes together, for the same cause, at the same rate — and changes to *other* decisions leave it untouched. That single reason is the module's *secret*; the boundary is the wall around the secret.

Partire asks: **how many reasons to change does this file have?**

- **One** → the file is one module at length. LEAVE.
- **Several** → the file is several modules wearing one name, and the seams are the lines between the reasons-to-change. SPLIT, along exactly those lines.

The honest shape has each module hiding one decision: the parser hides the grammar; the key manager hides the key lifecycle; the router hides the URL space. When the grammar changes, only the parser moves. When the key-rotation policy changes, only the key manager moves. The decisions vary on **independent axes**, and the module structure mirrors that independence.

The dishonest shape has one file hiding three decisions, so a change to any one of them opens a file that also holds the other two — and the maintainer editing the URL space reads past cryptographic key handling to find the route table, and risks disturbing what they did not mean to touch.

## The two verdicts

A `partire` cast returns exactly one verdict. Each carries the burden of being *useful*, not merely declared.

### LEAVE — one concern at length

The file should **not** be split. A LEAVE verdict is worthless unless it is **defensible** — a practitioner reading it agrees the file holds together. So it must show, not assert, the cohesion:

- **The single reason to change** — name the one decision the whole file hides. "This entire file changes when, and only when, the wire format changes."
- **The test evidence** — exercising any part of this file does **not** require standing up the infrastructure of an unrelated domain. One test fixture reaches the whole file; you do not load the database to test the parser.
- **The `solvere` corroboration** *(when solvere was run)* — `solvere` finds no braiding here, or only incidental, single-site braiding a function-level fix resolves without moving anything between modules. On the practitioner-flag trigger, where partire is cast with no prior solvere pass, this corroboration is simply absent: the LEAVE rests on the two showings above, and the practitioner may run solvere to confirm.

A file `solvere` passes clean is almost always a LEAVE; partire's job there is to *say why*, defensibly, so the practitioner can stop looking.

### SPLIT — several modules wearing one name

Here are the proposed modules. A SPLIT verdict is worthless unless it is **actionable** — the practitioner can execute the decomposition **from the output alone**, with no further judgment calls. So for **each** proposed module it must carry:

- **The name that stands alone** — a domain noun the module could be filed under and a reader could explain without opening it (`key_manager`, `router`, `audit_log` — never `utils2`, `core_part_b`, `helpers`).
- **What moves to it** — the exact `file:line` regions (types, functions, constants) that migrate into this module.
- **The locality argument** — *why these things change together*: the one decision they jointly hide, the single reason-to-change they share. This is the load-bearing justification; without it the cut is a guess.
- **The independent-test evidence** — proof that this module **can be tested without the others' infrastructure**. This is the difference between a real seam and an accidental one (below). If you cannot describe a test of this module that does not drag in another proposed module's setup, the seam is false and the cut is withdrawn.

The **number of modules is the minimum** that makes each piece obviously one thing (see *The minimum-cuts principle*).

## The real seam and the accidental seam

This distinction is the whole discipline. Drawing a line through a file is easy; drawing it where the module actually divides is the spell.

A **real seam** produces modules that each (1) have a **name that stands alone**, (2) have **different reasons to change**, and (3) **can be tested independently** of one another. Cut here and the strands hang straight: each module hides its own decision, and a change to one does not reach the others.

An **accidental seam** produces modules that are **still entangled** — the coupling merely re-routes from function calls into *imports*. Cut here and module A reaches into module B's internals to function; they still change together; you have split the file without splitting the concern. The classic accidental seams:

- **Splitting by size** — "it got long, cut it in half." The half-line falls mid-concern; both halves change together forever.
- **Splitting by sprint / by author** — the boundary follows who-wrote-what, not what-changes-together.
- **Splitting by layer when the layers share one secret** — `encode.rs` and `decode.rs` that both hard-code the same byte offsets are one decision (the wire format) cut into two files; a format change touches both. (`solvere` calls this duplicated encoding; partire calls a split *along* it an accidental seam.)

The test that separates them is the **independent-test surface.** Two modules with genuinely different reasons to change can each be tested without the other. Two modules that still share a secret cannot — testing one requires constructing the other's state. **No independent test surface → accidental seam → the cut is withdrawn.** This is what keeps partire from being a size or style heuristic in disguise.

## The minimum-cuts principle

SPLIT proposes the **fewest** modules that give each piece one reason to change — never the most. The count of modules equals the count of **distinct reasons-to-change** in the file, read off the concern graph. Three reasons-to-change → three modules, not seven.

Over-shredding is its own failure: a file cut into seven one-function modules that all change together for the same reason is *more* coupled than the original, not less — the single concern now spans seven files and every change touches all seven. Partire stops cutting the moment each remaining piece has one reason to change. A proposed module that has no reason to change distinct from its sibling is **two pieces of one module** — merge them back; the cut between them was accidental.

Because the cuts are read off the concern graph (the actual change-axes of the code), not invented, **two casts of the same file converge on the same decomposition** — or differ only where the graph genuinely admits two readings, which partire names explicitly as a practitioner's call rather than silently picking one.

## The grounding clause

A decomposition is a claim about **how a real file divides**, so a partire SPLIT is **withdrawn unless every proposed module is grounded**:

- **Every region cited** — each thing that moves carries its `file:line`. A module whose contents are described but not located is half a finding.
- **Every reason-to-change named** — each module's single hidden decision is stated, and it is **distinct** from its siblings'. Two modules sharing a reason-to-change are one module; the cut between them is withdrawn.
- **Every seam proven independent** — each module's independent-test surface is described concretely (the fixture that reaches it without the others). A seam asserted but not shown to be independently testable is an **accidental seam wearing a real one's robe** — withdrawn.

And the finding must be **real, not a matter of taste:**

- **The concerns are genuinely independent**, not one concern the reader finds long. "This would read more cleanly in two files" is not a finding — *Level 3 taste*, never a finding. Only a file whose parts have **demonstrably different reasons to change** is a SPLIT.
- **The input is the concern graph, not the line count.** A long file with one reason to change is a LEAVE no matter its length; a short file with three reasons to change is a SPLIT no matter how few its lines. If the only argument for a cut is "it's big," there is no finding.

**Every SPLIT carries, per module: the standalone name, the moved regions (`file:line`), the distinct reason-to-change, and the independent-test evidence — or that module is withdrawn from the decomposition.** This is the rule that separates a real seam from an arbitrary cut.

**The module boundary.** The unit partire weighs is the **module** — by default the single **file** cast against. In most languages one file is one module; where a module already spans several files (a directory of submodules), it has largely been decomposed already, so partire targets a single file, or a **practitioner-declared file-set** treated as one module. The input is always the concern graph of that unit, never its file count.

## The four questions applied

- **Obvious?** After reading the SPLIT, can a practitioner execute it without asking a further question — each module named, each region located, each cut justified? If the decomposition needs a follow-up judgment call to act on, Obvious has failed; it is a sketch, not a verdict.
- **Simple?** Does each proposed module do **one** thing — hide one decision, carry one reason to change? A proposed module that is itself two concerns has not been decomposed enough; "medium cohesion" means the concern graph was not read finely enough to answer.
- **Honest?** Does the verdict tell the truth about the seam? A SPLIT that proposes a cut with no independent test surface is dishonest — it claims a seam the code does not have. A LEAVE that waves "it's fine" without naming the single reason-to-change is dishonest too. Honesty here is the independent-test evidence made mandatory.
- **Good UX?** Does the decomposition serve the maintainer who will edit one decision next month — so they open one small module that holds only that decision, rather than a file that also holds two others? The decomposition's user is the *next editor*; a cut that does not reduce their blast radius does not serve them.

## What partire sees

> The examples below are illustrative; the syntax is incidental. The transferable parts are *how many reasons-to-change a file holds* and *where the independent-test surface falls*. Translate to your host language.

### A file braiding three domains — SPLIT, Level 1

A 200-line `session.rs` holds: (a) HMAC signing-key derivation and rotation, (b) the HTTP route table mapping paths to handlers, (c) an append-only audit log writer.

- **`key_manager`** ← `session.rs:10–58` (the `SigningKey`, `derive`, `rotate`, the rotation clock). Reason to change: **the key lifecycle / crypto policy**. Independent test: feed it a clock and assert rotation; no HTTP, no audit sink.
- **`router`** ← `session.rs:60–130` (the `Route` table, `dispatch`, path matching). Reason to change: **the URL space**. Independent test: assert path→handler resolution against a table; no keys, no audit.
- **`audit_log`** ← `session.rs:132–200` (the `AuditWriter`, `append`, the on-disk format). Reason to change: **the audit record format / retention**. Independent test: append events to an in-memory sink and assert the bytes; no keys, no routes.

Three reasons to change, three independent test surfaces, three names that stand alone. The file is three modules wearing one name; a maintainer rotating keys should never have to scroll past the route table. **Level 1** (Level 1 and Level 2, the severities partire returns, are defined under *Reporting format* below) — the fusion actively misleads and widens every change's blast radius. Minimum cuts: three (not four — nothing here divides further).

### A long file that is one concern — LEAVE

A 1,400-line `wat_parser.rs` holds the recursive-descent parser: a tokenizer, forty `parse_*` functions, the AST constructors. It is long, and a size heuristic would flag it.

Partire returns **LEAVE**: every part changes for **one** reason — *the wat grammar changed*. The tokenizer, the `parse_*` family, and the AST node builders are not independent decisions; they are one decision (the language's surface syntax) at length. The test evidence confirms it: a parser test feeds source text and asserts an AST — there is no sub-region you could test without the others, because there is no second concern to isolate. `solvere` finds no domain misplaced. The defensible LEAVE names the single reason-to-change and the absence of an independent test surface for any proposed sub-piece. *Do not split.*

### An accidental seam offered and refused — the withdrawal

A tempting cut: split `wire.rs` into `encode.rs` and `decode.rs`. Two names, two files, looks clean. Partire **refuses** the cut: `encode` and `decode` both hard-code the same field offsets and type widths (`wire.rs:20` and `wire.rs:55` — the same `[0..8]` timestamp, the same `kind` byte). They share one reason to change — *the wire format* — so they are one module. Testing `decode` independently is impossible without `encode` to produce a valid frame, and vice versa: **no independent test surface.** The honest move is the opposite of a split — `solvere`'s "single declarative shape, one source of truth" *merges* the duplicated offsets. A cut here would route the coupling through an import and call it modular. Withdrawn.

## What partire does NOT flag

- **Size.** File length is never the input. A long file with one reason to change is a LEAVE; partire reports nothing about its length. (If the file is long *and* mumbling its structure, that is `intueri`'s concern, not a seam.)
- **Taste / style.** "This would be cleaner in two files," "I'd group these differently" — *Level 3*, noted only if useful, never a finding. Only a demonstrably different reason-to-change is a seam.
- **Function-level braiding** — a single function doing two jobs, a concept misplaced, a duplicated encoding *within* a file that should be unified-in-place. That is **`solvere`**: it untangles strands inside the module. Partire fires *after* solvere — typically when braiding recurs at **multiple sites** such that the function-level fixes conflict (the signal that the file itself is two or three things), and also on a practitioner's direct flag. solvere fixes the braid in place; partire moves the modules. They compose; they do not overlap.
- **Parallel / runtime boundaries.** Whether each parallel invocation writes its own slot and never races is **`secare`** — a *runtime data* boundary, drawn by who-mutates-what under concurrency. Partire draws a *static module* boundary, by what-changes-together. A file can pass secare (no races) and fail partire (three concerns fused), or the reverse. Different axis, different cut.
- **Test organization.** Whether a *test* file composes from layered, individually-proven helpers is **`complectens`**. Partire is for **production code**; it does not decompose test suites.
- **Dead code.** A struct never imported, a branch never taken, is **`purgare`**. Partire decomposes what is *live*; it does not prune.
- **Generated files.** A file emitted by a generator (recognizable by its conventional machine header — `@generated`, `Code generated by …`) is **out of scope** — its structure is the generator's decision, not a hand-authored cohesion choice. Cast partire on the **generator**, never its output.

## The rune

Some files look like several concerns but are intentionally one module — the parts share a load-bearing locality the split would break. The rune declares the file exempt with a justified reason, placed at the top of the file:

```rust
// rune:partire(load-bearing-locality) — the framer touches transport, session, and crypto layers by necessity: a frame's length prefix, sequence number, and auth tag are computed in one pass over one buffer; splitting them re-reads the buffer three times and lets the layers' offsets drift out of sync
```

Format: `// rune:partire(<category>) — <reason>`

**Categories:**

- `load-bearing-locality` — the parts hide what *looks* like several decisions but is one: a shared invariant, a single-pass computation, an atomic update that must see all the fields at once. Splitting breaks the invariant or re-does the work. (The mirror of solvere's `load-bearing-coupling`, at the module scale.)
- `facade` — the file intentionally presents **one unified surface** over several sub-concerns, and splitting would leak the sub-structure to every caller. The module's one reason to change *is* "the surface this facade promises"; the internals are deliberately hidden behind it, not separate modules.
- `historical-shape` — a legacy mono-module preserved because the rewrite carries higher risk than the cohesion violation justifies. The rune names the tracked split/refactor work item and retires when that split lands.

The reason field is required. A rune with an empty reason fails the spell — the rune captures *why these concerns are one module* so the next reader does not re-propose the split every pass.

## Reporting format

Open with the verdict, then the justification:

```
## VERDICT
LEAVE / SPLIT
```

**For LEAVE**, report:
- **The single reason to change** — the one decision the whole file hides.
- **The test evidence** — why no sub-region has an independent test surface (there is no second concern to isolate).
- **The `solvere` corroboration** *(when solvere was run; absent on the practitioner-flag trigger, where the LEAVE rests on the two showings above)* — no braiding, or only incidental single-site braiding fixable in place.

**For SPLIT**, report the minimum set of modules; for **each**:
- **Name** — the standalone domain noun the module becomes.
- **What moves** — the `file:line` regions (types, functions, constants) that migrate to it.
- **Reason to change** — the single decision this module hides, *distinct* from its siblings'.
- **Independent-test evidence** — the fixture that exercises this module without the others' infrastructure.
- **Severity** — **Level 1** (genuinely independent domains fused — the fusion actively misleads and widens every change's blast radius) or **Level 2** (latent — the concerns are separable and the locality would improve, but the entanglement is partial and rarely bites the maintainer).

Plus, when relevant:
- **Refused cuts** — a seam that *looks* available but was withdrawn for lack of an independent test surface (the accidental seam), named so the practitioner does not re-propose it.
- **Practitioner's-call splits** — where the concern graph genuinely admits two decompositions, both named, the choice left explicit rather than silently picked.

A proposed module lacking its name, its located regions, its distinct reason-to-change, or its independent-test evidence is **withdrawn from the decomposition, not reported.** A SPLIT whose every module withdraws is a LEAVE.

## The principle behind the spell

A file is a promise that its contents belong together. The reader who opens it to change one decision is entitled to assume the file holds *that* decision and not two others standing behind it. When a module hides one secret, the promise holds: the change is local, the blast radius is the module, and the maintainer touches only what they meant to. When a module hides three, the promise is broken silently — every section is locally fine, every function passes `intueri` and `solvere`, and the file still costs every editor the tax of reading past two unrelated domains to reach the one they came for.

Partire finds where the module actually divides — not by its length, not by taste, but by the lines along which its reasons-to-change already fall — and either draws the minimum cuts that let each piece hide one decision, or certifies, defensibly, that the file was one decision all along. The practitioner who casts it earns the right to say not merely that each function is well-made, but that the **module is one thing** — or knows exactly what several things it should become.
