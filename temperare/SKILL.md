---
name: temperare
description: Mix computation in right proportion. The datamancer temperat the code — finds redundant calls, invariant work in loops, recomputation when nothing changed. Correct but hot.
---

# Temperare

> *temperare* — Latin: to mix in due proportion, moderate, regulate, temper (metal). Direct cognate root of "temper" / "temperature" / "temperance." The smith's act of quenching — heating + cooling in the right measure so the blade holds without internal stress.

> Tempered steel is not weaker steel. It is steel that wastes no energy on internal stress.

Other spells check correctness (struere), life (purgare), structure (solvere), communication (intueri). Temperare checks **efficiency in the algebraic sense** — does the computation do more work than the problem requires?

A pure function called six times with the same argument is correct. It is also wasteful. Temperare finds where the code burns more than it needs.

## The principle

Every redundant operation is energy spent twice. Sometimes the redundancy is cheap (a microsecond, a few bytes) and the simpler form is worth the cost. Sometimes the redundancy is the difference between sub-second and minutes, between sustainable and self-defeating. Temperare doesn't decide which is which on its own — it surfaces the candidates and the four-questions decide.

Temperare asks: **is this computation done in the right proportion to the problem, or has it overshot?**

The opposite of tempered is hot — code that runs correctly but burns more than it should. Hot code accumulates: each individual hot spot is small; ten thousand of them are an architectural smell.

## The four questions applied

- **Obvious?** Will a reader notice the redundancy without needing to profile? If the same expression appears three times in three lines, obvious holds. If the redundancy hides behind a memoization layer no one knows is broken, obvious fails (and the failure is the discovery).
- **Simple?** Is the wasteful version structurally simpler than the tempered version? Sometimes yes — the tempered form requires caching, batching, or precomputation. Sometimes no — the wasteful form is the long way around an obvious shortcut.
- **Honest?** Does the code name the trade-off? A function called `slow_but_simple_path` says "I chose simplicity over speed here." A function called `compute_metric` that recomputes the same metric six times per call says nothing about why.
- **Good UX?** Does the performance scale linearly (or better) in the dimension that grows? An O(n²) inner loop where n grows with the user base is hot in the wrong way; the same loop where n is bounded by a small config is fine.

## What temperare sees

> Code examples below illustrate Rust patterns; translate to your host language. The discipline holds wherever computation has a cost.

### Redundant pure calls

```rust
// ❌ Same function called three times with the same argument
let user_role = get_user_role(user_id);
let user_perms = compute_permissions(get_user_role(user_id));   // ← again
log_access(get_user_role(user_id), resource);                   // ← again
```

`get_user_role(user_id)` is pure (no side effects, deterministic on input). Calling it three times burns three lookups. The tempered form binds the result once and reuses the binding.

### Loop-invariant computation

```rust
// ❌ `config.threshold` recomputed every iteration
for item in items.iter() {
    if item.score > load_config().threshold {       // ← reads config from disk every iter
        process(item);
    }
}
```

`load_config()` likely does file I/O, parsing, validation — all of which produce the same threshold each iteration. The tempered form hoists the load outside the loop.

### Recomputation when nothing changed

```rust
// ❌ Cache invalidated on every read; "cache" is a misnomer
pub fn cached_summary(&mut self) -> Summary {
    self.cache = compute_expensive_summary(&self.state);  // ← always recomputes
    self.cache.clone()
}
```

The field is called `cache` but the function recomputes on every call. The cache is a lie. Either invalidate on writes (and skip recomputation on reads when valid), or drop the cache layer and admit the computation runs every call.

### Eager work for lazy needs

```rust
// ❌ Builds full report eagerly; caller often only needs the first field
pub fn build_report(data: &Data) -> Report {
    Report {
        summary: expensive_summary(data),
        details: expensive_details(data),       // ← caller never reads this
        attachments: expensive_attachments(data), // ← caller never reads this
    }
}
```

If most callers only need `summary`, eagerly computing `details` and `attachments` is hot. The tempered form returns lazy accessors (closures, methods) so unused work is never done.

### O(n²) where O(n) suffices

```rust
// ❌ Quadratic — each item searches the whole list to check existence
for item in new_items.iter() {
    if !existing.iter().any(|e| e.id == item.id) {
        existing.push(item.clone());
    }
}
```

A `HashSet<Id>` over existing IDs makes this O(n + m). Quadratic loops over user-scale data are the canonical hot path — the heuristic is "n could grow; the form burns when it does."

## What temperare does NOT flag

- **Single redundant call when the source is cheap** (a getter on a small struct; a constant) — the verbose form may be more readable and the cost is rounding noise.
- **Eager work that the test suite requires** — tests need predictable, complete output; "lazy" results that defer evaluation can break test setups.
- **The wasteful form when the wasteful form IS the abstraction**'s point (e.g., a referential transparency check that deliberately calls a function twice to verify determinism). Mark with the rune.
- **Cross-cutting concerns** (logging, metrics, tracing) that look redundant because they're called on every operation; that's the contract, not waste.

## The rune

Some hot paths are intentional — the wasteful form is the chosen trade-off. The rune declares the heat exempt with a justified reason:

```rust
// rune:temperare(determinism-check) — recomputes deliberately; the pair must agree (referential transparency check)
let a = compute(x);
let b = compute(x);
assert_eq!(a, b);
```

Format: `// rune:temperare(<category>) — <reason>`

**Categories:**

- `determinism-check` — repeats the call deliberately; the agreement IS the assertion.
- `simplicity-win` — the wasteful form is structurally simpler and the cost is justified by the simplicity. Cite the cost ceiling (e.g., "n is bounded by 16 by the schema").
- `lazy-incompatible` — the eager form is required because the host context (test harness, fork-then-exec, signal handler) cannot run lazy work.
- `cross-cutting` — the operation runs every call by design (logging / metrics / audit); the apparent redundancy is the discipline.

Placement: on the line immediately preceding the hot path.

The reason field is required. A rune with an empty reason fails the spell.

## Reporting format

For each finding, report:

- File path + line number
- The hot pattern (redundant-call / loop-invariant / unused-eager / quadratic / cache-lie)
- The dimension that grows (n callers / n items / n iterations / n bytes / n syscalls)
- Estimated savings if tempered (order of magnitude, not micro-benchmark)
- The tempered direction (hoist / memoize / lazy / hashset / drop-cache-layer)

## The principle behind the spell

Tempered steel is the steel without internal stress. Tempered code is the code without redundant work. Neither is the SIMPLER form by default; both are the form where the energy spent matches the energy required. Every redundant operation is energy that didn't have to be spent. Sometimes the trade is worth it; the four-questions decide. Temperare surfaces the candidates so the practitioner can decide consciously.
