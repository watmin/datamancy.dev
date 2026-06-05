---
name: extirpare
form: act
category: primer
reading: to root out the failure class — pull the root so it cannot regrow, never patch the stem
description: Root out the failure class. The datamancer extirpat — a failure is not friction to bypass but the system asking for help; stop the moment it surfaces, read what it reports, and pull the whole class out by the root so it cannot regrow. Never patch the stem; never construct the situation that needs the patch. The meta-discipline beneath every ward — each spell is one failure class pulled out of the ground.
vigilia-slot: primer
---

# Extirpare

> *extirpare* — Latin: *ex-* (out) + *stirps* (the root, the stock, the underground lineage that regrows). To pull a thing out by its root, so the *kind* of it cannot grow back. Not to cut the stem — to clear the ground.

> A failure is the system asking for help. The failure isn't recovered from; it is read.

Every other spell in this grimoire — the practitioner's collection of *wards*, each a focused pass that scans one target for one class of defect — is one failure class pulled out of the ground. **Extirpare is the act every ward performs**, named and lifted out so you can perform it on *anything*: not cast against a file the way a ward is, but *read and run* by you, on the work in front of you. It is the discipline of *removing* failure from systems — not reducing how often a failure appears, but making the *kind* of failure structurally unavailable.

## The three moves, in order

**1. Failure is data, not noise.** A failure is not friction to bypass, a flaky test to retry, an exception to swallow, a flag to set, a TODO to leave for later. It is the system reporting a state the design did not anticipate. The failure *is* the report. The job is not to make it stop showing up; the job is to read what it says.

**2. Stop — immediately.** The moment a failure surfaces, you stop. Not "next sprint," not "after the feature ships," not "leave a TODO." The reason is not dogma; it is compounding cost. Right now the failure is visible and easy to reason about. A week from now, with more code stacked on top, it is still there but harder to find, harder to trace, harder to fix without breaking what was built over it. The cost of fixing a failure today is always lower than tomorrow — failure debt accrues interest faster than the financial kind.

**3. Pull the root, not the stem.** The failure is never "this one case broke." It is "a *class* of inputs, states, or interactions can produce this kind of break." The fix is never "make this case stop breaking" — that cuts the stem, and the class grows a new one next week. The fix is "make this whole class structurally impossible." *Caught the null pointer* is the first-level fix; *the type makes a null unrepresentable in this position* is the second. Extirpare insists on the second.

## The ladder — climbing toward impossibility

Eliminating a class is not one move; it is a ladder, and you climb as far as the material lets you:

- **A convention** — "we agree not to do X." The weakest rung: it leans on every future hand remembering. A convention is a failure class waiting for a tired afternoon.
- **A check that fires at construction time** — a build gate, a generated artifact, a test that goes red the instant the mistake is committed. Now the mistake is *caught*, not merely discouraged.
- **A shape the mistake cannot be expressed in** — a type, a structure, an interface where the wrong state has no constructor, no representation, no way to be written down at all. The top rung: the failure is not caught because it cannot occur.

Climb until the failure is un-expressible, or until the material runs out — and when it runs out, say so, and hold the highest rung you reached. A check is worse than a type and far better than a convention.

## Never construct the situation that needs the patch

The deepest move sits one rung above the ladder: do not eliminate the failure — eliminate the *situation that produces it.* A patch is scar tissue on a bad arrangement. When a design would *require* a workaround — a lock around shared mutable state, a retry around a flaky call, a guard around an order-dependence — the failure-engineered answer is rarely "add the workaround." It is "change the arrangement so the workaround is unnecessary." The lock is not avoided; the shared-mutable-state-across-threads situation is never built. The retry is not added; the call is made not-flaky. So before you patch, ask: *what situation am I patching — and could I simply not construct it?*

## The four questions are this discipline at design time

The four questions — **Obvious? Simple? Honest? Good UX?** — are extirpare applied *before* the code exists. Each one asks: *what failure mode could this design suffer?*

- **Obvious?** Could a reader fail to understand what this does? That is a failure mode — eliminate it by making it obvious.
- **Simple?** Could complexity hide a class of bugs that have not surfaced yet? Eliminate it by simplifying until each piece does one thing.
- **Honest?** Could the design lie about what it does? Eliminate it by making honesty *structural*. This is where the discipline bites hardest: "we tried to be honest" is a convention; "the design *cannot* be dishonest" is the top of the ladder.
- **Good UX?** Could a caller fall onto a wrong path? Eliminate it by making the right path the easiest path — the only path, if you can.

Run each as a flat YES / NO; any NO is a failure mode you have caught before it shipped. The four questions are a **closed set** — four, not three or five, one for each axis on which a design can fail the person who meets it: comprehension, complexity, honesty, and path. This primer explains them; it does not extend them.

## Worked examples

The discipline is concrete. A few, each the same shape — *a failure surfaced; the class, not the case, was pulled out:*

- **A wrong URL returned `200 OK` with the wrong body.** The patch: special-case that one URL. The extirpation: make the routing layer *own* its namespace, so every wrong guess resolves or fails honestly — the whole class of "a wrong path lies" gone, not the single path.
- **A hand-maintained index drifted from reality.** The patch: fix the index. The extirpation: *generate* the index from the source of truth and *gate* it in the build, so drift becomes a red build — the class of "the index can be wrong" made un-expressible.
- **A stale document risked being trusted as current.** The patch: update it. The extirpation: move it where its *path* declares it inactive — then find the *instruction* that told every future hand to keep feeding it, and delete that instruction.

Notice the last one. The sharpest extirpation is often not the stale artifact — it is the *rule, habit, or arrangement that keeps producing it.* Pull *that* root, and you never weed that bed again.

## What extirpare is NOT

- **Not a manifesto.** It is a tool for building systems that don't break the same way twice, not a philosophy to evangelize.
- **Not a verdict on other practices.** A team that does not extirpate is not wrong; they may be solving a different problem under different constraints. The discipline is a choice, made by someone tired of watching the same failures recur.
- **Not exhaustive.** The practitioner brings judgment this primer only sketches — which rung the material allows, which situation is worth un-building, when a check is enough and a type would be gold-plating.
- **Not a ward, and not its sibling primers' job.** It does not gather a scattered self (*recolligere*) or tend a record (*curare*); it does not scan one file for one defect — a ward does that. It is the *act every ward performs*, lifted out so you can perform it on anything.

## The discipline beneath the disciplines

Look across the grimoire and you will see extirpare everywhere: each ward names a *class* of failure and pulls it out — names that lie, dead code, phantom abstractions, spec/code drift, prose that mumbles, a blind spot the inward lenses miss. The wards are extirpare, focused through one lens each. This primer is the lens-grinder: read it and you can name a failure class no existing ward covers, and pull it out yourself.

The bar does not rise by being right. It rises by *nothing wrong being allowed to regrow.*

---

*A failure surfaced — stop. Read what it reports. Find the root, not the stem. Pull until the class is out of the ground, or hold the highest rung you reached. Then go find the thing that planted it, and pull that too. Extirpare.*
