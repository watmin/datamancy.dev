---
name: cernere
description: Sift valid forms from phantom. The datamancer cernit the source — every form used must trace to the language spec. Forms that look valid but aren't defined are phantom; the spell catches them before they ship.
---

# Cernere

> *cernere* — Latin: to separate by sifting, distinguish, discern, decide. The primary classical sense is agricultural — sifting grain from chaff. Cognate root of "concern," "discern," "secret" (that which was separated aside).

> What belongs passes through. What doesn't gets caught.

Cernere checks **language conformance**. Does the source use only forms defined in the language specification? A form that looks like a valid s-expression but is not defined in the language — a phantom — promises functionality the language does not provide. The compiler may accept it (if the language is dynamically typed); the runtime will reject it (or silently misbehave); the spell catches it at lint time.

## The principle

A language's vocabulary is a contract between the program author and the runtime. The vocabulary defines what can be said; everything else is either silently ignored or runtime-failed. A phantom form is the program author claiming the language supports something it doesn't — a hallucinated primitive that LOOKS like the real ones because they share the same syntactic shape.

Cernere asks: **for every form this source uses, does it exist in the language?**

The honest shape:
- The consumer has a language spec (LANGUAGE.md / a grammar file / a list of registered primitives + macros + special forms)
- The consumer's source files contain ONLY forms that trace to that spec
- New forms enter the source AFTER they enter the spec
- The spell's findings cite the spec section where the form should have been declared

The dishonest shape:
- Source uses a form that looks like it should work but isn't declared (`push!` in a language without `push!`; `cond` in a language with only `if` / `match`)
- Source uses an implementation function (`cache-get`) as if it were a language primitive
- Source uses a form from a SIBLING language (Rust idioms in Scheme; Python idioms in JavaScript) because the author was thinking in another tongue
- Source uses an OLD form that was retired — the spell finds the retirement gap before the runtime does

## The four questions applied

- **Obvious?** Will a reader who knows the language immediately recognize the phantom? `(push! v x)` in a language without mutation OBVIOUSLY misfits — the `!` convention shouts side-effects in a pure substrate. `(format "..." x)` may look fine to a reader without the spec; the absence of `format` in the registered primitives is what makes it a phantom.
- **Simple?** Does the language have ONE source of truth for "what exists"? If the practitioner must consult three documents + a runtime registry + a stdlib + a substrate-internal table, the language's vocabulary is fragmented and the spell's job grows. The honest shape: one canonical list.
- **Honest?** When the spell catches a phantom, does the source's author understand WHY it's phantom? "This form looks like it should work" is the failure mode; the spell's report must cite the language's actual surface so the author updates their mental model, not just the line.
- **Good UX?** Does the spell's verdict point at a real form the author probably meant? "`(format "x" y)` is phantom; did you mean `(concat "x" y)` (concat is registered at <spec-location>)?" is good UX; "phantom form: format" alone is correct but unhelpful.

## What cernere sees

> Code examples below illustrate the discipline on wat/Scheme files where forms begin with `(`; translate to your host language's atomic-call boundary. The discipline applies to any language with a defined vocabulary: SQL dialects (catch `SELECT TOP` in PostgreSQL); shell scripts (catch `bash`isms in `sh`); domain DSLs (catch invented operations).

### Phantom function calls

```scheme
;; The language registers: define, fn, let, match, if, cons, car, cdr, ...
;; The source uses:
(format "~a / ~a" k v)
```

`format` is not in the language's registered primitives. The author is thinking in Common Lisp (where `format` is canonical) but writing in a language that doesn't have it. The spell catches this; the report cites the registered string-formatting primitive (e.g., `string::concat` + `display`).

### Phantom mutation operators

```scheme
;; The language is immutable; mutation lives only in specific primitives.
(push! my-vec x)
(set! counter 0)
```

`push!` and `set!` are common in MUTATION-FRIENDLY Lisps (Scheme R6RS, Common Lisp). In a language that confines mutation to specific primitives (`var-set!`, `update-cell`, etc.), these are phantoms. The `!` convention is honest about side-effects but the verb itself doesn't exist.

### Phantom control flow

```scheme
;; The language has if, match, when, unless. cond is not declared.
(cond ((= x 0) "zero")
      ((> x 0) "positive")
      (else "negative"))
```

`cond` is one of Lisp's most familiar control-flow forms. In a language that deliberately reduced its control-flow vocabulary to `if`/`match`/`when`/`unless`, `cond` is a phantom — even though it would be trivially expressible via `match`. The spell catches the import-from-elsewhere.

### Implementation functions promoted to language forms

```scheme
;; cache-get is an internal helper in the substrate's Rust impl.
;; It is not exposed as a language primitive.
(cache-get key)
```

The author found `cache-get` in the source tree and tried to call it. It's an internal helper, not a language form. The spell catches the leak — the consumer should use the public surface (`(:cache::Service/get k)` or whatever the documented form is).

### Retired forms still in use

```scheme
;; The language retired :wat::core::lambda in favor of :wat::core::fn (arc 162).
(:wat::core::lambda (x) (* x x))
```

A form that USED to exist but was retired is a phantom from the spec's current perspective. The spell catches usage of retired forms and cites the retirement (which arc / which version / what to use instead).

## What cernere does NOT flag

- **User-defined functions in scope** that look like phantom calls — the spell needs to recognize that `(my-helper x)` is a call to a definition the source provides. The spec is the language's vocabulary + the source's own definitions.
- **Macros that expand to valid forms** — a macro's CALL SITE is the form being checked; the expansion is checked separately (or trusted because the macro was registered).
- **Forms inside literal AST builders** (quasiquote templates that construct ASTs without evaluating them) — those forms are data, not calls; the validity check applies when (and if) the AST is evaluated.
- **Comment-quoted forms in docstrings or examples** that show "here's what a call would look like" without actually invoking.

## The rune

Some uses look like phantoms but are intentional. The rune declares the form exempt with a justified reason:

```scheme
;; rune:cernere(future-form) — calling :next-version::foo deliberately; this branch only executes when the new substrate version is loaded; gated by feature flag
(:next-version::foo x)
```

Format: `;; rune:cernere(<category>) — <reason>`

**Categories:**

- `future-form` — calling a form that will exist in a future version of the language; gated by a feature flag or version check.
- `spell-probe` — deliberately invoking a phantom to test the spell's own detection (or the language's error-handling). Cite the test that exercises the phantom path.
- `dynamic-dispatch-target` — the form is the NAME of something resolved at runtime (e.g., a string passed to `eval`); the spell can't statically know it's valid.
- `external-language` — the form embedded in a string is in another language (SQL inside a Rust `query!` macro; HTML inside a template). Cite the language.

Placement: on the line immediately preceding the phantom-looking form, OR as a trailing comment if the host allows.

The reason field is required. A rune with an empty reason fails the spell.

## Reporting format

For each phantom found, report:

- File path + line number
- The phantom form
- The language's actual surface (where the form would have been declared if it existed)
- The most likely intended form (with citation to where it IS declared)
- Recommendation: replace / remove / mark with rune

## The principle behind the spell

A language is its vocabulary. A program that uses words outside the vocabulary is speaking a language other than the one the runtime knows. Sometimes the foreign word is a creative extension worth promoting to the spec; usually it's a leak from another tongue the author was thinking in. Cernere sifts the source against the spec so the author can decide: promote the form, or replace it. The four-questions decide which.
