---
name: experiri
form: act
category: fidelity
reading: to put to the proof — to learn by trial rather than by report
description: Put the declared surface to the proof. The datamancer experītur — every form the system ADVERTISES is synthesized and driven, or carries a rune saying why not, in each position the cast declares and names; a surface that cannot be reached, or is reached and discriminates nothing, is a promise the system does not keep. The only ward whose evidence is an event rather than a source — cast it when the spec and the code AGREE and you still do not know whether either is true.
vigilia-slot: conditional-code
vigilia-order: 6
vigilia-concern: Declared surface vs surface that can be driven — unreachable and inert cells
vigilia-trigger: a target that DECLARES a surface it claims is callable — an operator table, opcode list, plugin registry, capability whitelist, route table, exported API index — AND can be loaded and driven in the caster's own process without irreversible effect — a disposable instance, a rolled-back transaction, or a fixture
---

# Experiri

> *experiri* — Latin: to put to the test, to try, to learn by trial. Deponent; the root of English "experiment," "expert," and "peril" — knowledge bought by attempt rather than taken on report. Its participle *expertus* means *one who has found out by doing*.

> A declaration is a promise. A test of the declaration is a reading of the promise. Only the run collects on it.

Every other spell in the grimoire — the catalog of disciplines this spell belongs to, indexed at `/grimoire/SKILL.md`, which defines the practice-terms used here (*ward*, *cast*, *the four questions*, *rune*) and catalogs every sibling named below — **reads**. That is the right instrument for almost every question the book asks: no program tells you whether a name lies (`intueri`), whether a document coheres (`cohaerere`), whether prose rings true (`consonare`). Those are observational questions and reading answers them.

Experiri is the exception, and it exists for one narrow class the readers cannot reach: **the system declares a surface, and driving it does not deliver what the declaration promised** — either nothing on the declared path executes at all, or it executes and discriminates nothing. Not a disagreement between spec and code. An agreement, jointly wrong.


The `form`, `category` and `vigilia-*` keys are how the grimoire and `vigilia` (the meta-spell that musters the inward set) index this ward — which slot it occupies, the order it is mustered in, the concern it owns, and the condition under which it is mustered at all; `reading` is the Latin sense of its name. A caster executing the procedure below needs none of them: `vigilia` reads the `vigilia-*` keys to decide whether to muster this ward at all.

## The failure this ward exists to catch

A reading ward finds a **divergence**: the spec says X, the code does Y, one of them is wrong. `conferre` is built for exactly that.

Experiri's quarry has no divergence to find. The worked case that earned this spell: a constructor row in a rules engine's operator table. It was declared in the table; the query fence admitted it; the type-checker typed it; the purity analysis approved it; the naming rule derived its name; the totality gate passed it. **Source and spec agreed completely — and both were wrong together**, because the table advertised a surface the executor had no implementation arm for. Every reading ward correctly reported harmony. The full guard (`vigilia`, the meta-spell that musters the inward set) converged twice on that subsystem — two consecutive recasts returning zero findings at either severity (**Level 1** and **Level 2**, defined under *Reporting format* below) — while six such rows sat in it.

> **A reading cannot see an execution defect. A count cannot see a value defect; a list is only a claim; a declaration is only a promise.**

And a corpus cannot stand in for the run. A corpus records what **compiled**, so it is structurally blind to what cannot be written. Three of those six broken rows appeared nowhere in a 1569-file corpus. That reads like neglect; it *was the symptom*.

## The three properties that define the cast

1. **It EXECUTES.** The only ward that must. Its evidence is a program that ran, never a file that parsed.
2. **It SYNTHESIZES its own callers.** It may not sample the existing corpus, because the corpus is precisely the blind spot — it contains only what already worked.
3. **Its unit is (declaration × position)**, never the declaration alone. A **declaration** is one row of the roster step 1 enumerates — whatever the system's own table counts as an entry, not whatever you would group them by. Say which, in the report: a route table enumerated by route and one enumerated by (method, path) give different grids and hide different asymmetries. One such pair is a **cell** — the thing that gets driven, counted and reported throughout.

### What a "position" is, and how to derive one

A **position** is a distinct site the system's *own admission rules* let a declaration appear in. Two sets follow, and keeping them apart is the whole of this section:

- the **admissible** position set — every site the system says yes to. A property of the system; you discover it, you do not choose it.
- the **driven** position set — the subset this cast actually drives. The grid is their **product** only where every declaration admits every position; where declarations differ, it is the **sum** of each declaration's own driven positions. You choose it, you declare it by name, and it **is** your coverage.

Derive the admissible set by asking the system where it admits the thing, and never by sampling where callers happened to use it. The question that generalises: **what does the system's own admission rule vary over, once the declaration is fixed?** Every answer below is that rule's free variable.

| the declared surface | its positions are |
|---|---|
| an operator table in a query DSL | the grammar productions that admit an operator — inside a fenced expression, as an inline constraint |
| a serializer's type registry | the write path and the read path — a type registered for both, driven in each |
| an HTTP route table | the methods the route declares, and the content-types it declares to accept — two axes, so the positions are their **product** where the route admits every pairing, and only the pairings it declares where it does not |
| a plugin registry | the lifecycle hooks the plugin declares it implements |
| an opcode table | the operand shapes and addressing modes the opcode admits |

Reachability is not a property of the thing declared. In the worked case one operator was reachable inside a fenced expression and refused as an inline constraint — same operator, same field, same comparison, two different answers. A ward that asked once per declaration must pick one, and either choice is a lie about half the surface. The serializer row is the same shape and the easiest to recognise: a type that constructs and never reads is one cell green and one cell dead.

**The driven set is your coverage.** Every admissible position you do not drive is a declared gap — see *The failure modes of an executing ward* below, which makes naming that boundary a reporting obligation, and the `position-not-modelled` rune (see *The rune* below), which records it.

## What this ward takes as given

Every other spell in the book needs a file. This one needs a running system, so it assumes more —
and what it assumes is the caster's to bring, not the ward's to supply:

- **A target that loads and drives in your own process, without an effect you cannot undo.** The
  frontmatter trigger says exactly this, and `vigilia` gates the muster on it.
- **A harness you write yourself, in the target's own runtime.** None ships with this ward and none
  could: a synthesized caller is specific to the surface.
- **The ability to name your surface's fire/refuse pair, and to establish the preconditions a
  declaration requires — named or implied — before it is driven.** Which pairs a surface *offers* is a fact about your
  system; which of them is *admissible* is settled by step 5, not by you.
- **A declaration that names something checkable** — an arity, a type, a schema, a digest. Where it
  names nothing, the fire-drive has no oracle: that axis is untestable, and the report says so on the
  `COVERAGE:` line — which names what the cast drove, and then everything it did not settle — *not driven* takes **positions**, *untestable* takes **axes** (a property the declaration names nothing to check), *unadjudicated* takes **cells** — rather than rendering it as clean.

A reader holding none of these can follow the discipline and cannot cast it. That gap is the
trigger's whole purpose, and it is not a defect in the page.

## How to cast

**Drive nothing whose side effects you cannot undo.** This is the only ward that runs the system it audits, and a synthesized caller is a real call: `DELETE /users/{id}` deletes a real user. Drive against a disposable instance, a transaction you roll back, or a fixture. Where a declaration cannot be driven without an irreversible effect, rune it `irreversible-effect` and name the effect. An audit that damages the audited system has failed whatever else it found.

The procedure, in order. Two steps can end it early: step 1 if the target will not load, and step 3 if the calibration fails — and a cast can stop later still, if the surface dies mid-run. None is a clean result; *Reporting format* below says what each files. Steps 1–4 happen before a single finding is collected; skipping any of them produces a table nobody should believe.

1. **Enumerate the roster from the system, not from a hand-list.** Ask the loaded system what it admits — read its table, walk its registry, call its introspection — or, where the system reifies no table at all, probe exhaustively over the closed alphabet the declaration admits, and say in the report that the roster was probed rather than read. A live enumeration often returns more than the target declared: entries the framework injected, defaults, inherited rows. Cut those by **provenance**, not by name — keep what this target registered — and say in the report which rule you cut by and how many it removed. That is a rule you can state and someone else can re-run; a list of names you happened to exclude is the hand-list this step forbids. A hand-copied roster inherits whatever the copy got wrong, and a roster taken from the corpus contains only what already worked.
2. **Derive the admissible position set** by the method above — ask the system, do not infer it: read the grammar productions that admit the form, the router's own method table, the registry's hook enumeration, the codec's registration call. If you cannot make the system tell you, say in the report that the set was inferred; a guessed position set manufactures findings against positions the system never offered. Then choose the subset you will drive and write down every admissible position you are leaving out. That exclusion list is part of the result, not an omission from it.
3. **Build the calibration first** — before any real cell is driven. Pin at least two cells whose behaviour you already know — the corpus is the right source for *choosing* what to pin, because a cell that already worked is one whose answer you can predict; it is barred only as a source of synthesized callers (property 2) — and drive each to **both** outcomes: at least two *fire* results and two *refuse* results across them. (The synthesis method is step 5; the worked calibration below is rendered in full.) (A cell has no single expected answer — step 6 drives every cell both ways, wherever the surface offers two — so the calibration is counted in **drives**, not cells.) Run them. If they do not come back as expected, the driver is broken and nothing else it says counts. You may repair it and start the cast again — a cast you abandon before reporting is not a cast, and the repaired run is the one you file. What you may not do is report a cast whose calibration failed as anything but void: once it is reported, the failed calibration is a cast-level finding and stays one. A cast without a passing calibration is not evidence; it is a rumour with a table.
4. **Collect the runes and adjudicate them** (see *The rune* below — including what to do when the roster is not yours to write in). A rune sits on the declaration's own row, so you met them at step 1 — but they are not a filter you apply silently, they are a judgment you make now. Test each reason against the dispose-not-defer rule: a **valid** rune sets the cells its scope covers aside as `exempt`, never synthesized, never tried, never in `attempted`; a **void** rune — one whose reason defers rather than disposes — returns its cell to the cast, to be driven below like any other. Do this before synthesis, or the counts in your report will include cells you were never entitled to drive.

5. **Synthesize a caller for each (declaration × position).** Construct the smallest input that exercises that cell — no corpus sampling — from the declaration's own signature, and derive the refuse-drive from the fire-drive by a **single** negation — of an operand the *declaration itself* constrains, never of the routing or rendering that got you there — and arity is not an operand: negating the number of arguments measures your calling convention, which this rule already forbids. Negate what the declaration promises to discriminate on, or the refuse-drive measures your harness instead of the cell. The worked example below is the whole method.

   For `Tuple/2` in the operator table: arity 2, both operands any term, so the fire-drive is `Tuple(1,2)` matched against a fact carrying `Tuple(1,2)`, and the refuse-drive is the same rule against a fact carrying `Tuple(1,3)`. Rendered into the two positions, that is four drives over two cells — the same shape as the calibration below.

   And on a surface with no rules engine anywhere in it — a serializer's type registry, whose two
   positions are the write path and the read path. For `Money`: the write cell's fire-drive encodes
   `Money(3,"GBP")` and expects bytes back; its refuse-drive encodes `Money(3,None)`, which the
   registry declares invalid, and expects a rejection. The read cell is driven **separately** on the
   bytes the write cell produced: its fire-drive decodes them back to what the declaration says it should return — equality only where the declaration promises round-tripping; a codec documented as lossy keeps its promise by losing, its refuse-drive
   decodes a truncated copy and expects a rejection. Two cells, four drives, and the read cell's
   verdict is independent of the write cell's — which is how `Money` is green on write and dead on
   read, the finding no reading ward can reach.
6. **Drive each cell twice: once to fire, once to refuse.** *Fire* and *refuse* are the two answers the surface itself distinguishes — matched/not-matched, accepted/rejected, encoded/rejected, hook-invoked/hook-skipped, routed/not-routed. **Name the pair for your surface before you drive — and the pair is not free.** More than one may look like it fits; step 5 settles it. A pair whose refuse-drive would negate the routing or the rendering is not admissible, because step 5 forbids that negation. Where no admissible pair leaves an operand the declaration constrains, the surface offers no second answer: drive the cell once and classify it below. Where more than one pair survives that test, take the one with a **witness on both sides**: a pair you can actually drive to each answer outranks one whose second answer no input produces. And where an admissible pair leaves an operand the declaration constrains but **no input yields the second answer**, that cell has no refuse witness. Judge it on its fire-drive alone — the same treatment the totality case gets — so it classifies `drove-and-discriminated`, and record **the axis**, not the cell, on the `COVERAGE:` line's *untestable* slot. It is not `inert`: `inert` says a cell answers the same to every input, and that is exactly what you could not establish. A serializer's write cell fires when the value encodes and refuses when it will not; its read cell fires when the encoded form decodes and refuses when it will not — which is exactly how a type is green in one and dead in the other. A lifecycle hook fires when it is invoked for an event it declares it handles, and refuses when it is not invoked for one it does not. A route fires when the request reaches the declared handler and refuses when the router declines it — a redirect or an error *from the handler* is a fire, because the route was reached.

   *"The surface reports no error" is not "the surface has one answer."* A transformation surface rejects nothing and still answers twice — reported-changed against reported-unchanged. Where the declaration itself **promises totality**, no refuse-drive is owed and step 7 judges the cell on its fire-drive alone. Where a surface genuinely offers no second answer and makes no such promise, drive it once, say so on its row, and classify it below: a cell that cannot be made to answer differently has not been shown to discriminate.

**Take the fire-drive's expected answer from the declaration, never from the artifact the position serves.** A driver that compares what a route returned against the file that route serves is comparing a thing to itself and is green by construction. The declaration is the only independent oracle the cast has; where it names a size, a hash, a type or an arity, that is what the drive is checked against.

7. **Classify each cell you tried.** When both drives refuse, the discriminator is whether the system *admitted the call at all*: the question is whether the surface is **usable from that position at all**. A cell that never entered the declaration is `unreachable` — and so is one that entered, ran, and still could not deliver from there, because the position's own machinery refused what the declaration returned: usable nowhere and fatal-when-used are the same fact about that cell. A cell is `inert` only when it is usable and answers the same to every input. **Classify:** — *unreachable* / *inert* / *drove-and-discriminated* — plus one that is never a finding: **driver defect**, raised loud (see the failure modes). `drove-and-discriminated` is not a finding; the other two are. A cell that could only be driven once is `inert` — it was not shown to discriminate, which is the same fact `inert` records — **unless the declaration promises totality, or step 6 sent it to the no-refuse-witness arm**; either way it is judged on its fire-drive alone. Where the declaration says every input is valid, accepting every input *is* the promise kept: no refuse-drive is owed, the fire-drive is checked against what the declaration names, and the cell is `drove-and-discriminated`. Say in the report which declarations were judged total, and on what wording.  A cell carrying a rune was set aside before step 5 and is reported `exempt`; it is never tried, and so never classified here.
8. **Roll up per declaration.** A declaration whose cells disagree — driven clean in one position, unreachable or inert in another — is **asymmetric**. This is a fact about a declaration across positions, never a cell verdict; its failing cell is already counted once at step 7 and is not counted again here.
9. **Report** in the format below, leading with the calibration, the `COVERAGE:` line, and the cost.

## The four questions applied

- **Obvious?** Does the target say plainly what it claims to offer — one enumerable surface — or must the practitioner infer the roster from scattered registrations? A surface you cannot enumerate you cannot drive, and the enumeration must come from the system, never from a hand-list.
- **Simple?** Is one cell one fact — *this declaration, in this position, answered this way*? A cell that bundles several positions cannot say which one failed.
- **Honest?** Does a cell that *ran* actually **discriminate**? "It did not throw" is not "it works." Every cell must be made to CHANGE ITS ANSWER — driven once to fire and once to refuse, wherever the surface offers two — or it has shown only that the code is reachable, not that it does anything.
- **Good UX?** When a cell fails, does the report name the declaration, the position, and the input, so the practitioner can reproduce it in one command? A matrix of red squares with no reproduction is a rumour.

## What experiri sees

> The worked examples come from a rules engine over a typed DSL, where the discipline matured. Translate to your surface using the position table above.

### A declaration that passes every gate and cannot execute

The row is admitted to the namespace, declared total, arity-checked and type-checked — four gates, all green — and the executor has no arm for it. Nothing reads as wrong because nothing *is* inconsistent; the implementation simply is not there, and no reader looks for an absence that nothing references.

### A declaration reachable in one position and inert in another

Accepted, compiled, fired — and matched nothing, every time, in one of the two syntactic positions that admit it. The cell is green on "did it run" and empty on "did it discriminate." This is why the unit is (declaration × position), and why the ward must force a *changed answer* rather than a completed call.

### A type constructible and never readable

The query language could build the value; no accessor could ever take it apart. Constructible-but-unreadable survives every reading ward, because construction and access are declared in different places and neither contradicts the other. In the position table above this is the serializer row: write-position green, read-position dead.

### A surface inferred from error strings

A form that exists only in the literal text of a diagnostic — the system names it when refusing something else, and no path can reach it. Drive it and it names itself immediately.

## What experiri does NOT flag

- **A declaration deliberately reserved** — declared now, implemented at a named, verifiable tracker. That is `exigere`'s axis (it hunts deferred-work prose), and the rune below covers the honest case.
- **Anything a reading ward already owns.** A *braided concern* — one unit doing several independent jobs whose reasons to change differ — is `solvere`'s; a stale suppression is `excusare`'s; a spec/code disagreement is `conferre`'s. Experiri is only for the agreement that is jointly wrong.
- **Behaviour under edge inputs.** Driving a declaration once, well, proves reachability. A totality claim contradicted by an empty-input raise needs edge-input comparison against the body, which is `conferre`'s class, not this one.
- **A cell that drove, discriminated, and returned the wrong thing.** Reachability and discrimination are this ward's whole question, and that cell answered both: it was reached and it discriminated. Whether it returns what the declaration *names* is a divergence between spec and implementation — `conferre`'s axis — and where the shapes agree and only the value is wrong, that is a test's job, not a ward's. Record it in the report as context if you saw it; do not file it as a cell verdict.
- **Surfaces outside the declared position set** — see *The failure modes of an executing ward*, next. That is not an absence of findings, it is an absence of coverage, and the report must say so.

## The failure modes of an executing ward

A reading ward and a driving ward fail in **opposite directions**, and this is the most important thing the spell has to teach.

**A broken reader finds NOTHING; a broken driver finds a JACKPOT.** A filter matching no pattern reports an empty list, and empty reads as clean. But one mis-rendered position reports an entire *column* of refusals that looks exactly like a discovery — and this ward's findings are meant to be believed. The failure mode is a **false triumph**, which is the expensive direction.

Therefore:

- **A CALIBRATION is mandatory: at least two pinned cells and four drives — two expected-fire and two expected-refuse.** (Two of each *drive*, not of each cell: a cell has no single expected answer, because step 6 drives every cell both ways wherever the surface offers two.) (An *outcome* is what one driven cell does; a *verdict* is how a finding is classified. They are different vocabularies and the report format below uses the second.) A driver that renders nothing passes an all-refuse control; a driver that never applies its constraint passes an all-fire control. Only a mixed control can fail in both directions.

  A worked calibration for the operator table — **two cells, four drives** — run before anything else:

  | pinned drive (cell + input) | expected outcome | why it is known |
  |---|---|---|
  | `equals`, fenced, matching input | **fire** | the corpus uses it daily |
  | `equals`, fenced, non-matching input | **refuse** | same operator, negated fixture |
  | `equals`, inline, matching input | **fire** | documented in the DSL guide |
  | `equals`, inline, non-matching input | **refuse** | same, negated |

  All four drives must come back as expected. If the two refuse-drives fire, the constraint is not being applied; if the two fire-drives refuse, the position is mis-rendered. Either way, stop.

- **"It refused" is two different facts.** **The question is attribution: was the refusal **caused by** the system under audit, or by your harness?** That is the test; what the refusal *names* is only evidence for it, and on some surfaces it is misleading evidence. Three cases, as worked examples of the one rule — a refusal naming the thing under test is usually the system's; one naming something else is usually your harness's; and one that names the thing under test **because you never established a precondition the declaration requires or implies** is yours, so establish every precondition and drive it again before filing. The case the naming test gets wrong: a refusal raised by the **position's own machinery, downstream of a call that succeeded** — the declaration ran and returned, and the position could not carry the result. It names neither the declaration nor your harness, and it is the system's: that is a positional asymmetry, this ward's signature finding, and filing it as a driver defect erases it. This side files Level 1, so it earns the same re-drive the fire side gets. A drive that *fires* when it should refuse is the same fork, asked per cell: re-drive it with the **same** caller against a fixture the declaration should not match — move the operand, never the rendering — and if the answer does not change, re-render the same negation by a different mechanism before concluding anything: a rendering fault can be invariant under every operand. Only a cell whose answer holds under **both** a changed operand and a changed rendering is `inert`; if either moves it, the first rendering was a driver defect. This test presupposes the declaration refuses *something*; where it promises totality there is no such fixture, and the cell is judged by the rule in step 6 instead. A passing calibration proves the instrument works in general, never that it rendered *this* cell. They are separate outcomes, the second must be **loud**, and it must never be counted as a finding. Conflate them and you will file genuine findings as driver defects, or driver defects as findings — both have happened.
- **"It ran" is not "it worked."** See the Honest question: force the answer to change.
- **The position set IS the ward's coverage.** Choosing it is the whole difficulty. A cast that drives one surface and calls the declaration audited commits the same false-completeness it exists to attack. Report the positions driven, by name, beside the findings.
- **It finds symptoms; it does not diagnose.** *"This cannot be driven"* is a fact. *"Therefore it should not exist"* is an inference, and it is the practitioner's to make and defend — the first such inference in the worked case was wrong.

## Its mirror: `cernere`

The two are opposite directions on one axis, and only one of them can be answered by reading:

- **`cernere`** catches a CALLER using a form the spec never defined — a **phantom form**.
- **`experiri`** catches a SPEC declaring a form no caller can reach — a **phantom surface**.

Cast `cernere` when you doubt the source. Cast `experiri` when you doubt the roster.

## The rune

Some declarations are unreachable on purpose. The rune declares a declaration's driven **cells** exempt — every one of them, or, when it names a position, that cell alone.

**A rune you cannot place is still a judgment you must record.** A rune is written by the target's authors. When the roster is not yours to edit — a stdlib, a vendored dependency, a generated table — declare the exemption **in the cast** instead: same categories, same syntax, same reason rule, listed in the report and counted in `exempt` — except `position-not-modelled`, which exempts no cell wherever it is declared and rides the coverage line instead. Casting against a roster you cannot write to must not force `exempt` to 0, because that turns a deliberate exemption into a finding and lets an incomplete cast satisfy the *fully reachable* gate.

**Placement:** on the declaration's own row in the table or registry the roster is read from — the same place the cast enumerates. If the roster is generated, the rune goes on the source the generator reads. A rune anywhere the cast does not look is not an exemption; it is a note.

**Effect:** a runed cell is reported as `exempt` with its category, and is excluded from the finding counts. A rune never removes a cell from the report; it changes which column it lands in.

```
rune:experiri(reserved-surface) — declared for the v3 opcode range; no executor arm until ticket PLAT-4471 lands (tracker: github.com/acme/plat/issues/4471); the totality gate covers the rows that DO execute
```

Format: `rune:experiri(<category>[, <position>]) — <reason>`.

**The reason must DISPOSE of the cell, not defer it.** A rune fails the spell if its reason is empty, or if it promises future work instead of stating a present decision: *"not tracked **yet**"*, *"**will** revisit"*, *"**when** a caller surfaces"* are deferrals in a compliant rune's clothing, and are exactly what `exigere` exists to drive out. *"Not tracked, because X"* disposes; *"not tracked yet"* does not. A tracker nobody can resolve is a deferral wearing a ticket number.

A rune that fails this gate does not become a finding — a **cell** finding is a verdict **earned by driving**, and a runed cell was never tried. Instead the **exemption is void and the cell returns to the cast**: it is driven at step 5 like any other, and earns whatever the drive gives it, which may be no finding at all.

**Categories** — each must name its own particulars, or it is `exigere`'s finding rather than an exemption:

- `reserved-surface` — declared ahead of its implementation, with a NAMED, verifiable tracker.
- `platform-gated` — reachable only on a platform this cast cannot load. Name the platform, and name the cast that covers it — or say plainly that none does.
- `position-not-modelled` — reachable from a surface outside this cast's position set. Name the position and why it is excluded; it rides the coverage line, never `CELLS IN GRID`, and is the one category that exempts no cell.
- `irreversible-effect` — the cell cannot be driven without an effect this cast cannot undo. Name the effect and what would make it drivable — a fixture, a disposable instance, a transaction. This is the only category that exists because driving would be *harmful* rather than impossible.
- `driver-limit` — the cell cannot be synthesized without machinery disproportionate to the finding. Name what the driver would need, and dispose of the cell; a bare cost claim is an undisposed reason.

## Reporting format

For each finding:

- **The declaration**, and **the position** the failing cell was driven from — exactly one, because the verdict is a fact about one cell. Where the declaration is asymmetric, name the sibling position that answered alongside it as context.
- **The verdict** — for a cell, only ever one of two: **unreachable** (could not be driven, or was driven and the position could not carry the result) — **Level 1**: the declaration says callable from there and it is not / **inert** (drove, and discriminated nothing) — **Level 2**: it answers, but the same answer to every input. A cell that drove and discriminated is not a finding.
- **The synthesized caller** — the exact input, reproducible in one command.
- **What the system said**, verbatim — both answers, since the finding is the pair. Where it refused, say whether the refusal named the thing under test or something else; where it fired both times, say what the declaration promised would separate them.

> **`Tuple/2`** — position `inline-constraint` — **unreachable** (asymmetric: drove clean in `fenced-expression`)
> caller: `rules drive --rule 'when x matches Tuple(1,2) then emit'`
> system: `error: no constraint arm for constructor 'Tuple'` — names the thing under test, so this is a finding, not a driver defect.

A runed cell reports as `EXEMPT` with its category and reason; a driver defect reports loud and is never counted — both on one line, in the same shape as a finding:

> **EXEMPT** `Blob/1` — `fenced-expression` — `platform-gated`: no v3-opcode loader on `aarch64-darwin`; no cast covers it.
> **DRIVER DEFECT** `Range/2` — `inline-constraint` — `error: unknown token 'Ragne'`: names the driver's own misspelling, not the declaration. Neither is a finding, and neither leaves the report.

Then, for the cast as a whole and non-optionally — these **lead** the rendered report, though they are described last here: **the calibration result** first of all, because a report without it is not to be believed; **the `COVERAGE:` line**, naming what was driven and everything the cast did not settle; and **the cost**. The counts below are illustrative; the shape is what is normative.

```
CALIBRATION: PASSED (2 cells, 4 drives)
COVERAGE: driven fenced-expression, inline-constraint | not driven aggregate-clause (no loader for that production) | untestable — | unadjudicated —
CELLS IN GRID:   120 = attempted 118 | exempt 2 (platform-gated 1, driver-limit 1) | never reached 0
ATTEMPTED:       118 = drove-and-discriminated 101 | unreachable 12 | inert 5 | driver defects 0
FINDINGS:         17 = unreachable 12 (L1) + inert 5 (L2)
DECLARATIONS: asymmetric 3   COST: 41s wall-clock, sharded 6 ways
VERDICT: the declared surface is NOT fully reachable
```

Three populations, and the arithmetic is the point. **CELLS IN GRID** is every (declaration × driven-position) pair **the declaration itself admits** — a product where the surface is uniform, a sum over declarations where it is not. A declaration is never driven in a position it does not declare: that cell does not exist, and a cell that does not exist cannot be a finding. The calibration's pinned cells are included, and `never reached` — cells the cast died before reaching — is 0 in any cast that ran to completion. A **runed** cell is not in `attempted` — the rune took it out before step 5, and calling it attempted would be the false triumph this ward refuses. **ATTEMPTED** partitions every cell the cast tried; a **driver defect** belongs there because it *was* tried and *did* answer, and is excluded from FINDINGS, never from the partition. A driver defect is not a disposition: that cell has no verdict yet. A defect you fix and re-drive is not counted at all — the cell takes the verdict its honest drive earned; the column counts only defects still standing when you file. Fix the driver and re-drive it, or report it unadjudicated and say so on the coverage line — never leave it counted and unexplained. The `VERDICT:` line may claim only what the cast drove: say **fully** reachable only when every cell in the grid was driven and classified **and the `COVERAGE:` line's *not driven*, *untestable* and *unadjudicated* slots are all empty** — its *driven* slot is an inventory, not a gap — with `exempt`, `never reached` and `driver defects` all 0. An axis you could not falsify is not an axis you proved. A cast carrying a cast-level finding may never claim it. The test is not *did I find nothing* — it is *did every cell answer for itself*.

**A cast that cannot finish is not a clean cast.** Whatever stops it — a failed calibration, no cell whose answer you already know, a surface that dies mid-run, a roster that enumerates nothing — report what you have, name the stop as **one Level 1 finding of the cast**, and say plainly what went unproven. It is the one finding not earned by driving, and it is what makes `vigilia`'s arithmetic refuse the cast: a findings-free row renders as converged, and *a filter matching no pattern reports an empty list, and empty reads as clean* is this ward's own diagnosis. It applies to the ward.

```
CALIBRATION: FAILED — both refuse-drives on `equals` fired
COVERAGE: driven none | not driven fenced-expression, inline-constraint (cast void) | untestable — | unadjudicated —
FINDINGS:     1 = cast-level 1 (L1) — calibration void; the surface was NOT put to the proof
COST: 4 calibration drives, 3s
VERDICT: cast void
```

A cast that dies part-way renders the same way, keeping every cell it drove: the positions it
finished, the unfinished ones on the coverage line, its cells counted under `never reached`, and
the collapse as its cast-level finding. Discarding what you earned to file a shorter report is the
false triumph this ward refuses.

The one discriminator: if `vigilia` **mustered** the ward, a row is due and the stop files a cast-level Level 1. Only an unmet trigger means no row. The exception is a target `vigilia` never mustered: one whose trigger is unmet on any of its conjuncts — it declares no callable surface, it will not load, or it cannot be driven without an effect the cast cannot undo. No row is due from it, and a caster spawned directly at one reports `NOT CAST: <which conjunct of the trigger this target fails>` and stops.

## Cost, and why the ratio is right

Reading is cheap and runs against any file; executing needs a loadable system, a synthesized-caller harness, and real wall-clock. The prototype that earned this spell drove 77 declarations × 2 positions = 154 cells — a product only because that surface's positions were uniform, roughly 30 seconds serially — past its test runner's deliberate 30-second kill, and sharded six ways to fit. That prototype lives in the project that commissioned this ward, not in this grimoire; the procedure above is what it taught, and it is written here so no reader needs to find it.

**That ratio is correct.** This is one narrow class where reading is the wrong instrument, and it should stay rare. `vigilia` musters this ward **conditionally**, on the trigger in the frontmatter, for the same reason it does not cast `secare` (which audits parallel boundaries) on a file with no parallel primitives: a ward that cannot be cast is not a clean result, and must never be counted as one — a target that does not meet the trigger is `vigilia`'s to skip on it; a caster spawned outside the watch files the NOT CAST lines above, never a clean row.

## The principle behind the spell

The other wards ask whether the system tells the truth about itself. Experiri asks something narrower and harder: whether the system can **do** what it says it can. A declaration passes through every gate the project built and still promises something the executor cannot deliver — and every reader in the book agrees it is fine, correctly, because nothing disagrees with anything.

Put it to the proof. Synthesize the caller, drive the form, demand a verdict, and make the answer change. What survives that is reachable. What does not was never a surface — only a sentence about one.
