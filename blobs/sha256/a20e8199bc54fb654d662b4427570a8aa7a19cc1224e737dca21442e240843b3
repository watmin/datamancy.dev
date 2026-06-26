---
name: cohaerere
form: act
category: fidelity
reading: to cling together — whether a document is self-consistent: its definitions are used consistently and its assertions do not contradict
description: Test whether a document holds together as one thing. The datamancer cohaeret the document against itself — a term used under a different implicit definition in another section, a term scattered across definitions that never settle, or two sections asserting incompatible facts, is a contradiction no single section reveals, because each section read alone passes every other spell.
vigilia-slot: docs-kind
vigilia-order: 2
vigilia-concern: Intra-document semantic self-consistency
---

# Cohaerere

> *cohaerere* — Latin: to cling together, to stick fast, to cohere. From *co-* (together) + *haerere* (to stick, cling, adhere — the root of "adhere," "hesitate," "hesitant"). The act of testing whether a thing holds together as one, rather than several contradicting things wearing one cover.

> A document is a promise that its parts agree. When a term is defined one way in the introduction and used another way in the table, the document is two documents pretending to be one — and the reader who trusts both is misled by the gap between them, not by either alone.

Cohaerere checks **fidelity of a document with itself.** Its sibling `conferre` brings two artifacts — a spec and the code — into one frame to find where they diverge. Cohaerere walks **one** artifact looking for where it diverges from itself — a term used under two different implicit definitions, a term scattered across definitions that never settle, or two sections that simply assert incompatible facts — with the difference never declared. They are mirror images — one external, one internal — and the internal one has no other home in the grimoire.

## The failure this spell exists to catch

The defect lives **in the relationship between sections, never in any one of them.** This is the whole reason it survives a full guard:

- `nesciens` walks the document top-to-bottom and accepts its structure as given — it catches an *undefined* term, not a term defined twice under two scopes.
- `conferre` compares the document to an *external* source — it sees no divergence between two sections that are each internally consistent with their own footnotes.
- `consonare` hears voice, not logic; `probare` weighs substance, not consistency; `exigere` hunts deferral.
- `circumspicere` surveys the surround and *might* frame it as an unenforced shipped claim — but only if its lens happens to land there, which is not guaranteed.

So every section passes every spell, and the document still contradicts itself. The minimal shape:

> **§ Introduction:** "Option B is an additive enhancement to Option A — not a standalone deployment."
>
> **§ Comparison table:** the **"Option B"** column evaluates every requirement from scratch, implying Option A is absent — so requirements Option A satisfies appear as Option-B failures.

The prose scopes B as *A-plus-B*; the table scopes B as *B-alone*. Both pass nesciens (no undefined terms), conferre (no external source to diverge from), probare (both substantive). The contradiction is the gap between them, and cohaerere is the only spell that tests the gap.

## The principle

A document's sections make a single implicit promise: **everything in here can be true at once.** A named thing it defines is a contract the rest must honor; an assertion it makes is a fact the rest must not contradict. Cohaerere collects the document's definitions and its assertions and asks: **can they all hold together?**

It fails in **three shapes**, and naming them is the whole discipline:
- **Drift** — a term is defined once, and a later usage assumes a *different* scope for it (the prose says Option B includes A; the table evaluates B as if A were absent).
- **Scatter** — a term is never defined once at all: N undeclared definitions, so no usage can be checked against a canonical reading ("tenant" meaning three different things in three sections).
- **Assertion clash** — two sections make *incompatible claims about the same subject*, no term being redefined ("the cache is write-through" in §3, "write-back" in §7). Both cannot be true.

All three are one failure: **the document cannot hold together as one thing**, because honoring one part forces breaking another.

The honest shape:
- A term is defined once, and every usage assumes the same scope, properties, and constraints.
- When a section *narrows* or *extends* a defined term for local reasons, it **says so** at the point of use.
- A comparison-table column evaluates its option under the same scope the prose describes for that option.
- A recommendation that claims to satisfy a set of requirements uses the same definition of those requirements that the requirements section carries.

The dishonest shape:
- A term defined as additive-on-top-of-X, then evaluated as standalone elsewhere — with X silently assumed absent.
- A column label that reuses a prose term but evaluates it under a different, undeclared scope.
- A footnote that defines a concept narrowly while inline uses of it assume the broad reading.
- Two sections that each pass inspection alone and contradict each other in their relationship — neither updated when the other moved.

## The grounding clause

An incoherence is a claim about **two or more places at once**, so a cohaerere finding is **withdrawn unless it cites them all** — each quoted, each `file:line` (the rune is defined below in §The rune). One citation is half a finding; none is a guess wearing the auditor's robe. Each of the three shapes carries its own **grounded demonstration of incompatibility** — the specific proof that the cited sites cannot all hold:

- **Drift** — a definition site *and* a divergent usage site, plus the demonstration that the usage assumes a different scope: a **verdict that flips** under the two scopes (a table cell that reads ✓ under the definition's scope and ✗ under the usage's), *or* a **later claim whose meaning changes** under the two scopes (a "replay is exact" that is true under the broad reading and false under the narrowed one). Drift need not reduce to a binary cell — it needs only a reading that demonstrably differs.
- **Scatter** — **N (≥2) co-equal definition sites** of one name, plus the demonstration that they have **no declared relationship and no single governing definition** (the document defines "tenant" three undeclared ways, so there is no canonical "tenant" any usage could be checked against). The proof is the *absence of a governing definition*, not that the N are intrinsically contradictory — a "tenant" that could be all three *as declared facets* is not a scatter (that is the rune); a "tenant" left three undeclared things is.
- **Assertion clash** — **two assertion sites** about the same subject, plus the demonstration that **both cannot be true** (the cache is write-through *and* write-back; the algorithm is O(n log n) *and* O(n²)). No term is redefined; the sites simply contradict as fact, and one is false if the other holds.

And the finding must be **real, not a difference of grain.** Before reporting, cohaerere establishes, or it withdraws:

- **The pieces are real, and a clash is about one subject.** A definition is actually a definition (drift, scatter), an assertion is actually asserted (clash), and the two clashing assertions are about the **same subject under the same scope** — not two similarly-named but distinct ones (two caches, two layers, two versions). Each shape has a phantom it most easily manufactures: drift and scatter promote a casual phrase to a binding definition and find everything in "violation" of it; clash calls two claims about *different* subjects a contradiction. Establishing shared-subject identity is to clash what "a definition is actually a definition" is to drift.
- **The divergence is real** — the incompatibility demonstration above holds (the verdict flips, the meaning shifts, the governing definition is absent, or both claims cannot stand). A usage that merely *omits* broader context without contradicting it is a `nesciens` walkability note, not a cohaerere finding.
- **The difference is undeclared.** A section that says "evaluated standalone for comparison," or descriptions declared as *facets* of one concept, has declared its scope; the divergence is then intentional (the rune), not a finding.

**The document boundary.** "One document" is, by default, the **single file** cast against. When the cast is handed a **named set of files** as the document (a multi-file spec, a docs site, a `wat/` domain split across files), that set *is* the document and definition↔usage drift across its files is in scope. A document disagreeing with the **code or external spec it describes** is never cohaerere's — that is `conferre`'s (external) domain; cohaerere stays inside the document, however many files the caster declares it to span.

**Every reported finding carries all its citations and its grounded demonstration of incompatibility — verdict-flip or meaning-shift (drift), absent governing definition (scatter), or both-cannot-be-true (clash) — or it is withdrawn.** This is the rule that separates a real incoherence from a pedantic re-reading.

## The four questions applied

- **Obvious?** Can a reader holding the definition next to the usage see that they disagree — once both are placed side by side? If surfacing the contradiction requires three inferential hops the document never invites, it may be a difference of grain, not an incoherence.
- **Simple?** Does each named concept have ONE definition the document returns to, rather than being re-described slightly differently in five places? A term re-defined per-section is a cohaerere nightmare and usually the root cause — the fix is one canonical definition, referenced.
- **Honest?** When a section uses a term under a narrowed or extended scope, does it *say so* at the point of use? The declared local scope is honest; the silent one is the drift. "Evaluated standalone here for contrast" is honest; a column that just does it is not.
- **Good UX?** Does the document's structure make its own consistency checkable — defined terms findable, usages traceable back to their definition — or does it scatter the same concept so a reader cannot hold the whole of it at once? A document that cannot be checked for coherence is one whose coherence cannot be trusted.

## What cohaerere sees

> The examples below are documentation defects, where this spell matures. The discipline applies to any document with definitions and downstream usages: a design doc's terms vs its comparison tables; a requirements doc vs its recommendation; a config reference's footnotes vs its inline uses; an API doc's "Concepts" section vs its endpoint descriptions.

### A comparison table evaluating an option under the wrong scope — Level 1

> **§ Options:** "**Option X** layers on top of Option A; it reuses A's auth and storage and adds a cache."
>
> | Requirement | Option A | **Option X** |
> |---|---|---|
> | Authenticated | ✓ | ✗ |
> | Durable storage | ✓ | ✗ |
> | Cached reads | ✗ | ✓ |

The prose scopes X as A+X; the table scopes X as X-alone, so "Authenticated" and "Durable storage" — which the prose says X *inherits from A* — show as X failures. A reader comparing columns concludes X is worse than A on two axes it actually matches. The contradiction is between the prose definition and the table's implicit one; each is internally fine. Fix: either the table's X column inherits A's rows (scope it as the prose defines), or the prose is wrong that X is additive — but one of them must move.

### A recommendation that satisfies requirements under a shifted definition — Level 1

> **§ Requirements:** "**Low latency** means p99 under 10ms end-to-end, including network."
>
> **§ Recommendation:** "Option Y is recommended; it meets the low-latency requirement (p99 6ms)."

The requirement defines low-latency as *end-to-end including network*; the recommendation's 6ms is service-time only (network excluded). The recommendation claims to satisfy a requirement it has silently redefined. The two uses of "low latency" do not cohere. Fix: measure against the requirement's definition, or amend the requirement — declared.

### A footnote definition contradicted by inline use — Level 2

> "We store all events in the ledger.[^1]"
> `[^1]: "All events" excludes health-check pings, which are dropped at ingest.`
>
> Later: "Because every event is in the ledger, replay is exact."

The footnote narrows "all events" (pings excluded); the later inline use assumes the unrestricted reading to claim exact replay. Latent — it only bites a reader who needs replay to include pings. The narrowed definition and the broad usage do not cohere.

### Two sections asserting incompatible facts — Level 1 (assertion clash)

> **§ Architecture:** "The cache is **write-through** — every write hits the backing store synchronously before returning."
>
> **§ Performance:** "Writes return immediately; the cache flushes to the store asynchronously (**write-back**), so a crash can lose the last few writes."

No term is redefined — both sections use "cache" and "write" the same way. They simply state contradictory facts about the same subject: write-through *and* write-back. Both cannot be true; a reader who plans around durability from §Architecture is misled by §Performance, or vice versa. This is the most common intra-document incoherence and the one neither drift nor scatter reaches — there is no definition to drift from, just two claims that cannot stand together. Fix: one is wrong (or the design changed and one section is stale) — establish which and align them.

### A term re-defined per section — Level 2 (the root-cause smell)

A document that defines "tenant" three times — "a billing account" in §2, "an isolation boundary" in §5, "a row-level filter" in §8 — without declaring that these are three facets of one concept (or three different concepts that need three names). Each section is locally coherent; the document has no single "tenant." Cohaerere flags the scatter and names the cure: one canonical definition the others reference, or three distinct names.

## What cohaerere does NOT flag

- **A difference of grain** — a usage that is less detailed than the definition but not in contradiction with it. Omitting context is a `nesciens` note; contradicting it is a cohaerere finding.
- **A declared local scope** — a section that states it is using a term narrowly/broadly for a stated reason (the rune). Declared difference is coherence, not drift.
- **External divergence** — the document disagreeing with the code or the spec it describes. That is `conferre`'s domain; cohaerere stays inside the one document.
- **A walkability gap** — a concept used before it is defined, *or* used with less context than its definition carries (an omission that does not contradict it). That is `nesciens`'s domain — the document's teachability; cohaerere needs a real *contradiction* — a definition and a divergent usage, a scatter of definitions, or two clashing assertions — not merely an under-serving omission.
- **Legitimate polysemy with disambiguation** — a word used in two genuinely different senses where the document makes the senses unmistakable from context (e.g., "key" as cryptographic key vs map key, each obvious). Cohaerere flags the *undeclared* clash, not every reused word.

## The rune

Some scope-differences are intentional and load-bearing. The rune declares the divergence exempt with a justified reason, placed at the point of the divergent usage:

```
<!-- rune:cohaerere(simplified-view) — this table evaluates each option standalone for a like-for-like axis comparison; the additive relationship is described in §Options and intentionally set aside here -->
```

Format: `<!-- rune:cohaerere(<category>) — <reason> -->`

**Categories:**

- `simplified-view` — the usage intentionally evaluates a term under a narrower/standalone scope than its definition, for a stated comparison or pedagogical reason; the surrounding prose acknowledges the simplification. (The prose-vs-table case, made honest.)
- `local-override` — this section deliberately redefines a term for its own scope (a subsystem using "request" to mean its internal job, not the HTTP request); the override is stated at the section head.
- `evolving-definition` — the document describes a term across versions and the definitions legitimately differ by version; cite which version each usage assumes.
- `facet` — two descriptions of one concept are intentional facets (the "tenant" = billing-account AND isolation-boundary case), declared as facets of a single named thing, not a contradiction.

The reason field is required. A rune with an empty reason fails the spell.

## Reporting format

Open with a shape-neutral verdict, then the findings:

```
## VERDICT
COHERES / INCOHERENT
```

For each finding, report — the **shape** (drift / scatter / clash) decides the middle rows:

- **The subject** — the term or claim whose readings cannot all hold.
- **The cited sites** (each `file:line` + quote): two for **drift** (the definition site + the divergent usage site) and for **clash** (the two contradicting assertions); **N** for **scatter** (the co-equal definitions). Name the scope/claim each establishes.
- **The incompatibility demonstration** — the proof for this shape: **drift** → a verdict that flips or a meaning that shifts under the two scopes; **scatter** → no declared relationship and no governing definition among the N; **clash** → both assertions cannot be true at once.
- **Which is right** — the definition, the usage, one of the clashing assertions, "the document must declare the difference," or (scatter) "the document needs one canonical definition the rest reference, or distinct names" — with reasoning, or "cannot tell from the document; the author must decide which is current."
- **The fix** — align the usage / amend the definition / reconcile or retire one clashing assertion / unify or split the scatter / declare the difference with a rune.
- **Severity** — Level 1 (an active contradiction a reader will trip over and decide wrongly on) or Level 2 (latent — only bites a reader who needs the contested edge).

A finding lacking its citations, or its grounded incompatibility demonstration, is **withdrawn, not reported.**

## The principle behind the spell

A document earns trust as a *whole*. The reader does not read one section; they carry the introduction's definition into the table, the requirements into the recommendation, the footnote into the later claim — and they are entitled to assume the document carried them too. Intra-document incoherence betrays exactly that assumption: each section keeps its local promise while the document breaks its global one. Every other spell can pass and the betrayal survives, because no other spell tests the relationship *between* sections. Cohaerere does — and the practitioner who casts it earns the right to say not merely that each section passed inspection, but that the document **holds together as one thing.**
