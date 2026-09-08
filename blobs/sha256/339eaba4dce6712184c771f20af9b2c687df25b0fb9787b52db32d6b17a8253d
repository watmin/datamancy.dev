---
name: peragrare
form: act
category: fidelity
reading: to traverse the whole ground — visit every cell the instrument could tell apart
description: Traverse the whole ground. The datamancer peragrat the ground an instrument discriminates over — a differential, a gate, a fuzzer answers only the questions its corpus asks, so the space it could tell apart is enumerated from ITS OWN COMPARISON and every cell no fixture ever visits is named with the defect that would hide there. A green from an instrument that was never asked is silence, not proof.
vigilia-slot: conditional-code
vigilia-order: 7
vigilia-concern: Corpus span against the instrument's discrimination space — cells no fixture ever visits
vigilia-trigger: a load-bearing INSTRUMENT — a differential, a conformance suite, a property test, a fuzzer, a gate — whose green some larger correctness claim rests on, AND a corpus of fixtures that feeds it
---

# Peragrare

> *peragrare* — Latin: to travel through, to range over the whole of; from *per-* (through, over the extent of) + *ager* (field, land, territory). Cicero uses it of an army traversing whole regions; Lucretius, of a mind traversing *omne immensum*, the whole immensity. Not to walk in — to walk it *all*. (The description's *peragrat* is this verb in the third person: *he/she/it traverses*.)

> An instrument answers only the questions its corpus asks. Every question it was never asked comes back the same as a question it passed.

Every other ward in the grimoire — the catalog of disciplines this spell belongs to, indexed at this server's root as `/grimoire/SKILL.md`, which defines the practice-terms used here (*ward*, *cast*, *the four questions*, *rune*) and catalogs every sibling named below — audits **the thing under test**. A file, a module, a document, a spec against its code, a declared surface driven.

Peragrare audits **the population the instrument runs over**. It is the only ward whose subject is not the artifact but the *questions the artifact was asked*.

The `form`, `category` and `vigilia-*` keys in the frontmatter above are how the grimoire and `vigilia` (the meta-spell that musters the inward set) index this ward — which slot it occupies, the order it is mustered in, the concern it owns, and the condition under which it is mustered at all; `reading` is the Latin sense of its name. **A caster executing the procedure below needs none of them.**

## ⛔ Read this before anything else: the axes come from the INSTRUMENT

This ward has one mis-cast that makes it worthless, and it is the natural one. **If you derive the axes from what the fixtures happen to contain, coverage is 100% by construction and the ward finds nothing, forever** — a perfect green, cast after cast, from a sweep that can only ever describe the corpus back to itself.

The axes must come from **what the instrument compares**. Not from the corpus. Not from the domain. Not from what you expect to find. From the comparison the instrument performs when it decides right from wrong — which lives in the instrument's own implementation, and reading *that* is required, not forbidden.

This is the same defect as a property test whose model is read off the implementation: it cannot falsify what it was copied from. It is stated first because a caster who forgets it produces a report that reads exactly like a clean one.

## The failure this ward exists to catch

A capable, honest, correctly-implemented instrument. Its fixtures pass. It has caught real defects before. And a whole class of defect walks past it, every run, because **no fixture ever stages the shape the defect requires**.

The instrument was never at fault. It answered every question it was asked, correctly. The green is not a false negative — it is **silence**, and silence is what a pass looks like.

> **A count is not a coverage measure. A green is not proof. A green from a question never asked is indistinguishable from a green from a question passed.**

The worked case that earned this spell: a three-way differential over a rules engine, comparing an external reference implementation, a spec model, and a fast path element-wise on derived facts. A defect escaped — a rule whose `:then` head is a user function had its stratum assigned to the *function's* name instead of the produced fact type, so a consumer was ordered below its own producer and its rows were never derived. The differential would have named the missing rows outright.

**Measured: 0 of 46 fixtures had a user-fn rule head.** Every fixture in the corpus constructed its facts with a record-type head — the buggy path was correct for all 46. Two more from the same corpus, the same week: a `retract` that removed every equal fact where the reference removes one, invisible because *the fixtures stage no duplicate*; and an accumulate over a derived type, invisible because **0 of 13 accumulate fixtures bagged a derived type**.

Three defects, three mechanisms, and not one of them a flaw in an instrument.

### The tell that the discipline is missing

In that same corpus, one fixture's header carried a hand-maintained coverage matrix (its "axis" is that corpus's local word for one fixture, not this ward's):

```
leading accumulate, in a RULE,  no cascade    — covered, agrees
leading :exists,    in a RULE,  WITH cascade  — covered, agrees
leading accumulate, in a QUERY, WITH cascade  — THIS AXIS
```
> *"one axis per non-monotonic leading condition, **because a fix for one did not reach the other**."*

Someone had worked out the cross-product by hand, for one family, in a comment. The fourth cell had never been driven. **A discipline being reinvented locally, per-family, in prose, is the signature of a missing spell** — and it is the cheapest evidence that this ward is due on a given instrument.

## The three units: fixture, axis, cell

Keep these apart; the report's arithmetic rests on it.

- A **fixture** is one member of the corpus — one test, one case, one input the instrument runs over.
- An **axis** is one dimension of the discrimination space: something the instrument's comparison could come out differently along. Never a fixture, and never counted in fixtures.
- A **cell** is one point in that space — one value from *each* axis, all of them.

"Cell" is `experiri`'s word, deliberately (that ward is introduced under *Its mirror*, below): both wards count points in a grid, and the whole difference is **where the grid comes from**. `experiri`'s axes are the *system's admission rules* — where it says a declaration may appear. Peragrare's axes are the *instrument's comparison* — what it can tell apart. Say which grid you mean whenever both wards are in the room.

A cell is **visited** when some fixture lands in it and **empty** when none does; an empty cell's verdict, where it earns one, is `unvisited`. A visited cell is either **read** — its fixture's assertions actually reach this cell's axes — or **hollow**, which step 6 defines. The finding is the empty cell and the hollow one, under the rules in steps 5 and 6.

## What this ward assumes — and what to do when your instrument is different

Every other ward needs a file. This one needs an **instrument**, and a procedure written for instruments must assume a shape. Four assumptions carry the seven steps below. **Each has been broken by a real cast**, and a caster who meets a break and quietly invents a rule produces numbers a second reader cannot reproduce.

1. **The instrument performs one comparison, statable in one sentence.** Two comparisons in one harness are two instruments; cast twice.
2. **Its corpus is a set of discrete fixtures you can enumerate mechanically.** A corpus that is production data rather than authored cases still qualifies — but "fixture" then means a row, a record, a request, and you say so.
3. **Each fixture has exactly one coordinate.** A differential whose two legs are constructed separately breaks this, and so does a fixture staging more than one case.
4. **The instrument compares everything it is handed.** A loader that filters, a guard that returns early, an assertion that compares one side to itself — each breaks it, and each is a question the instrument was handed and did not ask.

**The rule when one breaks: name the break on the report, say what you did instead, and say what it moved.** That is the discipline — not a rule per shape, because the shapes do not end. The two places a break costs most are the two the steps below already call out: **corpus membership** and **the coordinate function**. Each has swung a published count by more than the axes did.

The steps carry the breaks seen so far; the list is not closed, because the shapes are not. Yours will be a new one. Report it as one.

### What you must bring

- **An instrument you can state the comparison of.** If you cannot say in one sentence what it compares and on what, you cannot derive its axes, and the cast has nothing to enumerate against. That sentence goes in the report.
- **A census you write yourself.** Nothing ships with this ward and nothing could: the enumerator is specific to one corpus, in whatever language that corpus lives in. It will be wrong (see the failure modes) and it must be re-runnable by someone else, so it lives **committed in the audited project, beside the corpus it counts** — or, where that corpus is not yours to add to (step 4), wherever the `CENSUS:` line discloses. Never an *undisclosed* scratch script: a number nobody can reproduce next month is a number the report should not carry.
- **The standing to say a cell matters.** The ward finds cells nobody asked about. Which of those are worth the cost of filling is the practitioner's call, and the ward does not make it — see *What peragrare does NOT flag*.

A reader holding none of these can follow the discipline and cannot cast it. That is the trigger's purpose, not a defect in the page.

## How to cast

1. **Pick the instrument and name its comparison.** Read the instrument's own implementation — you must, the comparison is in it — and write one sentence: what two things does it hold against each other, and on what does it declare them equal or unequal? *"Compares derived-fact sets element-wise between the reference engine and the fast path."* This sentence is the authority for everything below.

2. **Derive the discriminating dimensions from that sentence.** An axis is something the comparison could come out differently along. Ask of each candidate: *if I changed this, could the comparison flip?* If no, it is not an axis — it is domain colour, and putting it in the grid inflates the space with cells that cannot hold a defect. ⛔ Do not derive axes from fixture contents; that is the mis-cast above. Write the axes down and their values, then close the derivation.

   **If you cannot derive a single axis, stop: the instrument is inert.** A comparison that can never come out differently — a value held against itself, an assertion that only bounds a range, a check whose two sides are computed by the same call — has an *empty* discrimination space, and no corpus could span it. That is this ward's best finding and its shortest cast: file `instrument-inert` (Level 1), name the comparison and why it cannot flip, and report no grid. A green from an instrument that cannot fail is the purest form of the silence this ward exists to refuse — and it is the case that most often wears a confident name, because such an instrument is usually named for the property it does not test.

   The derivation, on four different instruments — the shape generalises, the domain does not:

   | the instrument | what it compares | its axes |
   |---|---|---|
   | a rules-engine differential | derived-fact sets, reference vs fast path | rule-head kind, the consumer's relation to the produced type, fixpoint rounds |
   | a serializer round-trip suite | a value against itself after encode→decode | the type's shape, the wire version written vs read, whether the value is at a representational boundary (empty, max, null) |
   | an HTTP contract test | a response against a declared schema | method, content-type, auth state — each an axis only if the comparison can flip on it |
   | a deterministic-allocation gate | a vector from one instance against one from another | which key namespace, the provenance of each side (both live, or one restored from storage), the configuration delta between the sides |

   **If the grid explodes,** cut axes rather than the cross-product: an axis you deliberately drop goes on the `AXES:` line's *not modelled* slot with the reason, exactly where an axis you could not derive goes. What may not happen is an axis silently absent.

3. **Anchor the census — three pins.** Before the sweep counts for anything, run the enumerator against all three. Each catches a different broken enumerator, and no two of them catch each other's.
   - **The populated pin** — a cell you know holds fixtures. Catches a **false zero**: a broken query reports no hits, and no-hits reads exactly like a real hole. This pin **is** a cell (or a slice) of the grid and is counted in `CELLS IN GRID` like any other.
   - **The empty pin** — a coordinate the grid does not contain. Catches a **false hit**: a pattern that matches too much reports the space full, finds nothing, and never will again. Construct it by naming a value **no axis takes** — a type that does not exist, a token no production emits. Not a *combination* of real axis values that the system forbids: that is a real cell of the grid and its home is the `cell-unconstructible` rune. This pin alone is a probe rather than a point: its fabricated coordinate never enters `CELLS IN GRID`, and adding it to an axis's value set would inflate the grid with cells that cannot hold a defect — the thing step 2 forbids.
   - **The moving pin** — one fixture placed at each *non-default* value of each axis, run through the same coordinate function the census uses, each landing where you put it. Catches a **stuck classifier**: an enumerator that emits one coordinate for everything passes the other two pins — the populated pin sits at the stuck value and hits, the empty pin returns zero under any implementation — and manufactures the entire rest of the grid as empty. That is the *jackpot of phantom holes* below, and it is the failure the first two pins cannot see. Where a fixture's coordinate is **read** literally off it rather than computed, this pin is trivially satisfied; say so and move on. Where it is computed, this is the pin that earns the census.

     Its denominator is the sum over axes of (values − 1) — three axes of 2, 3 and 2 values need four probes, not three.

     **Build its fixtures out of the corpus's own construction forms, not out of clean literals.** A probe written as a flat inline value tests the classifier against a shape the corpus does not use: real fixtures build their values through a helper, a local class, a factory, a method body — and a classifier that reads the construction site sees nothing there. Such a probe lands 5 of 5 while every real member is mis-placed. Take each probe's *form* from a member you have read, and change only the axis value.

   A pin may name a **slice** rather than a single cell; write `*` on every axis it leaves unconstrained, so a second reader can reproduce it. If any pin comes back wrong, the enumerator is broken and nothing else it says counts: fix it and re-anchor. A census reported without a passing anchor is a rumour with a grid.

4. **Establish corpus membership, then enumerate against the cross-product.** **A fixture is a member iff it reaches the comparison of step 1** — everything else in the same file is out, however much it looks like a test of the same subject. State the membership rule in the report with the count it excluded: this decision moves the numbers further than the axes do, it is invisible to anyone reading the report without it, and two casters who choose differently produce different grids from one corpus.

   **Split the excluded, because one half is a finding.** An input **never offered** to the instrument is an honest exclusion. An input the instrument **received and did not compare** is not. The test is not "did a loader filter it" — many instruments have no loader — it is: **did the instrument have both sides of the comparison available and decline to perform it?** A path its own filter dropped, a case its own guard skipped, a branch that returns before the assert, an assertion that compares one side to itself. Each is an input the instrument was handed and a question it did not ask, and the instrument's real corpus is narrower than the one it was given while nothing says so. `dropped` counts inputs the instrument never compared **at all**; an input compared on some legs of the comparison and declined on others stays a **member**, and its declined legs are carried in the finding's own count — otherwise the same input is in two slots and `CORPUS:` cannot sum. Report both counts; a nonzero drop, whole or partial, is a `silently-dropped` finding (below), never a quiet subtraction. The defect that hides in a dropped input is invisible to the grid by construction, because a dropped input reaches no cell.

   **Where an axis is set-valued over one member** — the member is a collection, and several of its parts take different values on that axis — project it to a scalar before you place it: the strongest value present, the maximum, the dominant one. Name the projection on the `AXES:` line and say why it is the one the comparison can flip on. A projection nobody can see is a coordinate nobody can reproduce.

   **Where a member's two sides are built separately** — a differential fixture that constructs one leg for each implementation — the member has two candidate coordinates. Take the coordinate from the side the comparison's *first* argument is built from, say so in the report, and file the divergence between the legs as its own observation if they disagree: a fixture whose two sides sit in different cells is comparing two different questions.

   Then enumerate, mechanically and reproducibly, with **the enumerator committed beside the corpus it counts** (see *What you must bring*). Where the cast is an audit of a corpus that is not yours to add files to, say so on the `CENSUS:` line and give the enumerator's location — an undisclosed scratch script is how a number stops being reproducible. Report the population per cell, not merely visited/empty — a cell with one fixture and a cell with forty are different facts about the corpus.

5. **For each empty cell, name the defect that would hide there.** This is the gate that turns a chore into a finding. *"No fixture stages a user-fn rule head; a stratum assigned to the function's name instead of the produced type would order a consumer below its producer and never be seen"* is a finding. *"Cell (user-fn, cascade) is empty"* is a chore. **An empty cell with no defect hypothesis is not filed** — not as a finding, not at any level, and the report counts those separately so they cannot be silently dropped. A matrix of red squares with no hypotheses is the false triumph this ward refuses.

6. **For each visited cell, read whether anything actually checks the axes that cell sits on.** A cell whose fixture stages the shape and whose assertions never read it is **hollow** — populated, and harder to see than empty, because it reads as covered. This is a *reading*, not a run. Where the corpus is a set of test cases, read the fixture's own assertions. Where it is production data — rows in a table, records in a log — the fixtures carry no assertions at all, and what you read is the instrument's own comparison branches for that cell. Either way the question is the same: does anything in this cast look at the axes this cell varies on? A cell sitting at an axis's *absence* value — no guards, no marker, nothing staged — has nothing to read on that axis by construction: grade it on the axes that do, and say which you graded it on. Whether an assertion that does look is strong enough to fail on a real bug is mutation-testing's question, not this ward's.

7. **Report** in the format below, leading with the anchor result, the comparison, the corpus rule, the axes and where each came from, and the cost.

## The four questions applied

- **Obvious?** Can a reader see, from the report alone, which axis each finding lies on and why that axis is an axis? An axis whose derivation is not shown is one nobody can check for the mis-cast above.
- **Simple?** Is one cell one combination? A cell that bundles two axis values cannot say which one was never asked.
- **Honest?** Did the axes come from the instrument's comparison — and can you show where each one came from, line by line? This question is the ward's whole integrity, and it is answerable only by the caster.
- **Good UX?** Does each finding hand its reader a defect to go look for, rather than a hole to go fill? A hole is a chore; a hypothesis is work someone will do.

## What peragrare does NOT flag

- **Whether a cell matters.** The ward says the question was never asked. Whether the answer is worth the cost of asking is a judgment, and it belongs to whoever pays. In the worked corpus, one of three cells filled that week came back green — the engines agreed, and the fixture found nothing. That cost was real and this ward would not have predicted it.
- **Whether a filled cell's fixture would CATCH a defect.** Step 6 reads whether the assertions reach the axis. Whether an assertion that reaches it is strong enough to fail on a real bug is mutation-proof territory and belongs to whoever fills the cell.
- **Correctness.** A cell's verdict is only ever *"this question was never asked"* or *"asked and not read"* — never *"the answer is wrong."* A cell that is visited, read, and answers wrongly is the instrument's own job, or `conferre`'s. Some of this ward's verdicts are about neither a cell nor a question — a question the instrument was handed and never asked, a comparison that cannot come out differently, a cast that broke. The roster is under *Reporting format*.
- **A defect orthogonal to every axis anyone can name.** The ward systematises the cross-product of the axes a practitioner can articulate. One nobody articulates is invisible to it exactly as it is to everything else, and the report says so on the `AXES:` line rather than implying the space is closed.

**Checking a hypothesis is not forbidden — it just has no verdict, either way.** A step-5 hypothesis is falsifiable and is often one command from an answer. Go and check it if you can. The cell's verdict does not move — it is still `unvisited`, because the verdict is about whether the question was *asked*, never about what the answer turned out to be — and that holds symmetrically: a **confirmed** hypothesis is an occupied blind spot rather than a hypothetical one, which tells a reader which hole to fill first; a **refuted** one means your guess was wrong, not that the cell is safe, because the corpus still asks nothing there and a regression still lands unseen. Both go on the `HYPOTHESES:` line, which counts confirmed, refuted and unchecked separately. A refuted hypothesis is *not* an unfiled cell: `EMPTY, NOT FILED` is for cells you could think of nothing about, and that is a different fact. What you may not do is let a check you could not obtain, or one that came back clean, silently downgrade the finding.

## The failure modes of a ward whose finding is an absence

**A ward that reports presences is wrong loudly; a ward that reports absences is wrong quietly.** Both of this ward's broken forms produce a believable report:

- **A broken enumerator finds a JACKPOT of phantom holes** — a query that matches nothing reports the whole grid empty, and every cell reads as a discovery.
- **An over-broad enumerator finds NOTHING, forever** — a pattern that matches too much reports the grid full, and a full grid reads as proof. This is the direction that never gets caught, because nobody investigates a clean result.
- **A stuck classifier does BOTH and looks like neither** — a coordinate function that emits one value for every fixture piles the whole corpus into a single cell and reports every other cell empty. It hits where you look and misses where you do not, which is what a working enumerator also does.

Hence the three pins in step 3, and hence this, stated plainly: **the enumeration is an instrument and it will be wrong.** In the day that earned this spell, four such sweeps were run and **three were corrected**: one regex read a field accessor `(:Type/field x)` as a produced type and manufactured a hit; one implemented half a definition and reported 54 where the truth was 21; one under-counted 7 where the real population was 25. A later cast, over a corpus whose coordinates were computed from git state rather than read off the fixtures, corrected its enumerator twice — and **neither correction came from the populated or the empty pin**; both came from moving a fixture across an axis and watching where it landed. That cast is why the third pin exists, and why the number of pins is not a matter of taste.

Two more:

- **The axes read off the corpus.** Restated here because it is the mis-cast, not a footnote: it yields a permanent, flattering, meaningless green. The report must show each axis's derivation so a second reader can catch it.
- **A cell count is not a coverage measure.** *"38 of 42 cells visited"* is a fact about the corpus and says nothing about the instrument's power. The number does not go in a verdict without the hypotheses that make its gaps mean something.

## Its mirror: `experiri`

The two share a subject — the surface a system offers — and divide on method and on where the grid comes from:

- **`experiri`** drives each declared form **once**, in each position the system admits, and finds the form that cannot run. It EXECUTES, and it is barred from the corpus by construction, because the corpus contains only what already worked. Its blind spot is the **combination**: it would drive a user-fn rule head, find it works, and be satisfied — the defect needs that form *together with* a downstream consumer of the produced type, across a fixpoint round. Every element present, the combination absent.
- **`peragrare`** drives nothing to reach a verdict. It READS a corpus against a space and finds the combination nobody staged; a hypothesis may be checked afterwards, and the check moves no verdict. Its blind spot is the **element**: it takes the instrument's power as given, and cannot tell you a form was never implemented at all.

Cast `experiri` when you doubt the roster. Cast `peragrare` when the roster is fine, the instrument is fine, and a defect still walked past.

## The rune

Some cells are not holes. The rune declares one cell — or, where it names an axis value, every cell carrying it — exempt from the census.

**Placement:** in the corpus's own coverage record, where the census reads it — the fixture header, the manifest, the generator's source. A rune the census does not read is not an exemption; it is a note. Where the cast is an audit of a corpus you may not add to (step 4), the census's own source is the only placement left open to you; put them there and say so on the `CENSUS:` line.

```
rune:peragrare(cell-unconstructible) (*, downstream-of-produced-type, 0 rounds) — a consumer
downstream of a produced type cannot be exercised in zero rounds of derivation: the type does not
exist until a round has run, so the combination has no written form
```

Format: `rune:peragrare(<category>) (<cell>) — <reason>`.

**Effect:** a runed cell leaves the empty-cell count and lands in `exempt`, and it gets an `EXEMPT` row in the report carrying its category, its reason and where the rune lives. A rune never removes a cell from the report; it changes which column it lands in. An exemption a reader cannot check from the report is not an exemption.

**One rune, one row, N cells — and the slot counts cells, not rows.** A rune naming an axis value exempts every cell carrying it, and `exempt` is part of a partition of the grid, so it must sum with the other slots. Slices overlap, so `exempt` is the size of the **union** and each row prints the cells it contributes that no earlier row already claimed, resolved in print order; a row contributing nothing new still prints, with `0 new`, because its reason is still a judgment someone made. A rune's row may write `*` on an axis it does not constrain; a *finding's* cell may not, because a finding must be reproducible at one point.

**The reason must DISPOSE of the cell, not defer it.** *"cannot be built, because X"* disposes; *"not staged **yet**"*, *"**will** add"*, *"**when** someone needs it"* are deferrals in a compliant rune's clothing, and are exactly what `exigere` exists to drive out. A rune that fails this gate is void and its cell returns to the census, to be judged at step 5 like any other — where it may earn no finding at all.

**Categories:**

- `cell-unconstructible` — the combination has no written form: the type system forbids it, the grammar admits no form joining these values, or it is semantically null. Note the boundary against step 3's empty pin: a *value no axis takes* is outside the grid and is pin material; a **combination of real axis values** the system forbids is a cell **in** the grid, and this rune is its only exit. **Name the rule that forbids it**, not the difficulty of building it. A cell that is merely hard to build is not exempt; it is an empty cell with a cost attached.
- `covered-elsewhere` — the cell is constructible and would discriminate, and a **named other instrument already asks it**. Name that instrument and the cell it covers there, so a reader can go check. This is the category most easily abused: an unnamed "the unit tests cover it" is not an exemption, it is a guess about someone else's corpus.

## Reporting format

For each finding:

- **The cell** — one value per axis, all of them, so it is reproducible. No `*` in a finding's cell. (`silently-dropped`, `instrument-inert` and `census-void` have no cell; they render `n/a`.)
- **The verdict**, and its level. **Level 1** is a correctness lie, **Level 2** a structural mumble; both count against convergence, and an L2 is fought, not filed and forgotten. One of five verdicts. **unvisited** (no fixture lands here) — **Level 1**, and only with the hypothesis that makes it one / **hollow** (a fixture lands here and nothing reads the axes it sits on) — **Level 2** / **silently-dropped** (the instrument had both sides and did not compare them) — **Level 1** / **instrument-inert** (the comparison can never come out differently; there is no space to span) — **Level 1** / **census-void** (the anchor failed, or the census could not enumerate) — **Level 1**.
- **The defect that would hide there**, in one sentence. An `unvisited` cell without this is not filed at all. For `silently-dropped`, the rule that declined them and how many; for `instrument-inert`, the comparison and why it cannot come out differently; for `census-void`, what the anchor or the enumerator did instead.

> The rows below sample the report's row types — two findings and one `EXEMPT` row, which is not a finding — not the full list the counts describe.

> **`(rule head: user-fn, consumer: downstream-of-produced-type, rounds: >=1)`** — **unvisited** (0 of 12 members)
> hides: a stratum assigned to the function's name rather than the produced fact type orders the consumer below its own producer; its rows are never derived and the differential never sees a row to compare. **Confirmed** — reproduced in one command; the reference engine returns `[0 1 0]` where both others return `[0 1 1]`.

> **`n/a`** — **silently-dropped** (2 inputs)
> hides: the harness compares the two engines only when the expected set is non-empty, so the two cases in this file that assert an *empty* derivation are loaded, run, and never compared. A dropped input reaches no cell, so no cell in this grid could have shown it.

> **EXEMPT** `(*, downstream-of-produced-type, 0 rounds)` — **2 cells** — `cell-unconstructible`: a consumer downstream of a produced type cannot be exercised in zero rounds of derivation; the type does not exist until a round has run. Rune at `fixtures/HEADER.md:14`.

Then, for the cast as a whole and non-optionally — these **lead** the rendered report. The worked block below is a rules-engine differential, the same domain as the origin case; the slots are normative, the vocabulary in them is not:

```
ANCHOR: PASSED — populated pin `(record-head, sibling, *)` = 5 members
        empty pin `(nonexistent-head-kind, *, *)` = 0 (a value no axis takes)
        moving pin: one fixture per non-default axis value, 4 of 4 landed where placed
INSTRUMENT: compares derived-fact sets element-wise, reference engine vs fast path
CENSUS: scripts/peragrare-census.py, committed beside the corpus
CORPUS: 46 fixtures in the file = 12 members | 32 never offered | 2 dropped by the instrument
        membership: a fixture is a member iff it reaches the comparison above
AXES: 3, each derived from the comparison —
        rule-head kind (2: record-head | user-fn)
            <- the comparison keys on produced fact type; the head is what names it
        consumer relation (3: downstream-of-produced-type | sibling | no-consumer)
            <- a set compared element-wise can only differ if some consumer's rows are absent
        fixpoint rounds (2: 0 | >=1)
            <- stratum order only bites after one round of derivation
      not modelled: rule arity (how many constraints a rule carries) — a real axis,
      DELIBERATELY CUT FOR SIZE; modelling it would take the grid from 12 to 48.
CELLS IN GRID:   12 = read 4 | hollow 1 | empty 5 | exempt 2 (cell-unconstructible 2)
FINDINGS:         4 = unvisited 2 (L1) + hollow 1 (L2) + silently-dropped 1 (L1)
                        + instrument-inert 0 + census-void 0
EMPTY, NOT FILED: 3
HYPOTHESES:       2 filed = confirmed 1 | refuted 0 | unchecked 1
COST: 40 min - 20 to derive the axes, 15 to correct the enumerator twice, 5 to sweep
VERDICT: the corpus does NOT span the instrument's discrimination space
```

**Derive the block; do not compose it.** Every number above follows from the ones above it, and a reader will check: the grid is the product of the declared axis cardinalities (2 x 3 x 2 = 12); the four `CELLS IN GRID` slots partition it (4+1+5+2); `FINDINGS` decomposes into its verdicts (2+1+1+0+0); `empty` splits into filed `unvisited` plus `EMPTY, NOT FILED` (5 = 2+3); the moving pin's denominator is the sum over axes of (values - 1), here (2-1)+(3-1)+(2-1) = 4; `CORPUS` sums to its total (12+32+2 = 46); and every visited cell holds at least one member, so the members must be enough to fill them. A block whose arithmetic does not close is a census nobody can reproduce, whatever it found.

**Every number is member-relative.** The pins, the per-cell populations and each finding's *"n of m"* all count **members**, never the file's raw fixture total. A report that mixes the two is unreadable and un-reproducible, and it is the mistake `CORPUS:` exists to make visible.

**visited** is `read + hollow`, split because only one of them is coverage. **EMPTY, NOT FILED** counts the empty cells that produced no hypothesis — they are not findings, and hiding them would let a caster silently drop the cells they could not think about. The `AXES:` line shows **each axis's derivation**, not a blanket assurance, because that is the only way a second reader can check the ⛔ mis-cast; its **not modelled** slot carries both an axis you could not derive and one you deliberately cut for size, and you say which, because they mean different things about the space.

The `VERDICT:` line may claim the corpus **spans** only when the derivation produced at least one axis, every cell is **read or exempt** — a hollow cell is visited and is *not* coverage — all three pins passed, nothing was dropped whole or in part, the census completed, and the *not modelled* slot is empty.

**An inert instrument ends at step 2 and renders the block in its short form.** There is no grid to anchor, enumerate or partition, and saying so is the report:

```
ANCHOR: n/a - no grid to anchor
INSTRUMENT: <the comparison, and why it cannot come out differently>
CENSUS: n/a - no census run
CORPUS: n/a
AXES: 0 - the derivation closed at step 2
CELLS IN GRID:  0
FINDINGS:       1 = instrument-inert 1 (L1)
VERDICT: the instrument has no discrimination space; no corpus could span it
```

**A missing instrument is not this ward's finding — but the silence around it is worth a sentence.** Where the claim you came to audit has *no* instrument at all, there is no comparison to derive axes from and no corpus to enumerate: report `NOT CAST: no instrument for <the claim>`, name the claim and where it is made, and stop. That is a real result and it belongs in whatever report sent you here — do not render it as a clean cast. The near neighbour, and the far more common one, is an instrument that exists and cannot fail; that one **is** this ward's, and it files `instrument-inert` at step 2.

**A census whose anchor failed, or that could not enumerate, is one Level 1 `census-void` finding of the cast** — reported with whatever was earned, never as a shorter clean report. It is a finding not earned by a cell, and it is what makes `vigilia`'s arithmetic refuse the cast: a findings-free row renders as converged, and *an instrument that found nothing because it was never asked* is this ward's own subject turned on itself. It applies to the ward.

## Cost, and when to cast it

**Cheap to cast, expensive to act on.** The census reads; filling a cell means writing a fixture, and in a three-way differential also a reference model in a second language. That asymmetry sets where it belongs: on instruments that are **load-bearing** — a differential a whole project's correctness rests on, a conformance suite, a gate that licenses a release — never on every test file. `vigilia` musters it conditionally for exactly that reason.

The moment it is due: **after a defect escapes, when *"why did nothing catch this?"* has the answer *"nothing ever asked."*** That answer is the trigger, and once you have heard it once about an instrument, the rest of its space is worth enumerating.

## The principle behind the spell

Every other ward asks whether the thing under audit tells the truth. This one asks whether the *question* was ever put.

An instrument is a machine for turning questions into answers, and it is scrupulous: ask it well and it answers well, every time, and it will never once tell you what you failed to ask. Coverage grows along whatever axis the last bug happened to lie on, and the shape of the corpus becomes the shape of what the project can see — not by anyone's decision, but by accretion.

Traverse the whole ground. Derive the space from what the instrument can tell apart, walk every cell, and name what would be living in the ones nobody has visited. A green from ground you never walked is not a pass. It is silence.
