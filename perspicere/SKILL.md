---
name: perspicere
description: See through. The datamancer perspicere — pierces deeply-nested type expressions to find the noun the depth is hiding, and suggests a typealias that names it.
argument-hint: [file-path or directory]
---

# Perspicere

> When the type is too deep to see through, the noun is missing.

`per-` (through) + `specere` (to look) → to look through. The
spell's act is to look through the layers of a deeply-nested
generic and surface the noun the type is actually about.

A type written as
`Sender<Vector<Option<HolonAST>>>`
is hard to read. A reader fathoming three layers of `<` to find
`HolonAST` at the bottom is doing work the substrate should have
done with a typealias. The same shape becomes
`GetReplyTx<HolonAST>` — but only because someone took the time
to name it.

Deep nesting is the substrate's signal that a noun is missing
from its vocabulary.

## The principle

Type expressions communicate. A type a reader can pronounce in
one breath ("a sender of Holon ASTs") communicates. A type
nested three deep ("a sender of a vector of options of Holon
ASTs") doesn't — it requires the reader to assemble the noun
themselves, every time.

Perspicere asks: **how deep does this type go before its noun
appears?** If the answer is "deeper than I can read," there's a
typealias missing.

## What perspicere flags

Type annotations with **2 or more `<` characters** — i.e., 2+
levels of generic nesting.

Examples flagged:
- `Sender<Vector<Option<HolonAST>>>` (3 levels — `Sender` of
  `Vector` of `Option` of `HolonAST`)
- `Vector<Option<Entry<K,V>>>` (3 levels)
- `Fn(Vector<Option<X>>)->Y` (2 levels in a function-type argument)

Examples NOT flagged:
- `GetReplyTx<V>` — 1 level; the noun (`GetReplyTx`) is at the
  surface
- `Vector<HolonAST>` — 1 level; the noun is `Vec of HolonAST`
  and lives at the surface
- `HolonAST` — 0 levels; bare nominal type
- A typealias declaration whose body has 2+ `<` characters —
  the alias IS the name; the body is allowed to be deep

## What perspicere does NOT flag

- Lines marked with the rune `rune:perspicere(<category>) — <reason>`
  (see § "The rune" below). Recognize `rune:perspicere(...)` runes.
- Typealias bodies — the typealias declaration is the answer,
  not the question. A `typealias :Bar :Sender<Vec<Option<HolonAST>>>`
  is fine; `Bar` is the name perspicere wanted.
- Test files exercising the substrate's typealias machinery
  itself (e.g., a test that constructs deep types deliberately
  to verify parser behavior). Mark them with the rune so the
  exemption is intentional.

## The rune

Some type expressions are deep for a reason that no typealias
can fix. Examples:

- The deep type appears exactly once and a name would be
  read-once-then-forgotten.
- The typealias would itself be a Level 2 mumble (e.g., naming
  `Sender<Vector<Option<HolonAST>>>` as `BatchedHolonASTSender`
  reads worse than the type itself).
- The deep type is intentionally exposing structure the reader
  needs to see at this site.

For these cases, the line gets a **rune** that declares the deep
type viable for a justified reason:

```scheme
;; rune:perspicere(read-once) — called once at the test boundary; alias would be a Level 2 mumble
((_ Vector<Option<HolonAST>>)
  ...)
```

Format: `;; rune:perspicere(<category>) — <reason>`

**Categories:**

- `read-once` — deep type appears exactly once and a name would
  be read-once-then-forgotten.
- `mumble-alias` — the typealias would itself be a Level 2
  mumble (e.g., naming `Sender<Vector<Option<HolonAST>>>` as
  `BatchedHolonASTSender` reads worse than the type itself).
- `intentional-structure` — the deep type is intentionally
  exposing structure the reader needs to see at this site.

Placement: on the line immediately above the type expression
OR as a trailing comment on the same line.

The reason field is required. A rune with an empty reason fails
the spell — the rune's job is to capture the WHY so the next
reader understands the exemption rather than guessing.

When perspicere encounters a rune, it skips the line and
records the exemption in its report.

## How to read a flagged type

For each flagged type, perspicere asks:

1. **What is this type FOR?** Walk the layers. The innermost
   concrete type is usually the noun. The outer layers tell the
   role: producer (`Sender`), batched container (`Vector`),
   nullable (`Option`), error-wrapped (`Result`).
2. **What's the role-noun?** Combine the role with the noun:
   "a sender of HolonASTs that come in batches and may be
   missing" → `BatchedHolonASTReplyTx`. Pick the name a fresh
   reader will read once and remember.
3. **Does the consumer already have a typealias for this shape
   elsewhere?** Check sibling modules. Reuse before inventing.
4. **Is a typealias the right fix, or is the rune the right
   fix?** If the type appears once and naming it would create
   a single-use noun, prefer the rune.

## Reporting format

For each flagged type, report:

- File path + line number
- The full type expression
- Number of `<` levels
- The role-noun the type is asking for (one suggestion)
- Whether a sibling typealias might fit (cross-module scan)
- Recommendation: mint typealias / mark with rune / leave alone
  for human judgment

For each rune encountered:

- File path + line number
- The reason text
- Verdict: clear (reason passes the four questions) or
  questionable (reason is vague, copy-paste, or reads like
  "I didn't want to alias this")

## The principle behind the spell

A type the caller can name in one breath is caller-vantage. A
type the reader must unpack layer-by-layer is implementer-
vantage. A name lets the reader stay at the caller's vantage;
a deeply nested type forces them into the implementer's.
Perspicere finds where the type-level vantage broke. The four-
questions (see grimoire README) apply to every candidate alias
name and to every rune justification.
