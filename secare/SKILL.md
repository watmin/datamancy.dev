---
name: secare
form: act
category: craft
reading: to cut cleanly along the grain — parallel boundaries genuinely disjoint
description: Cut cleanly along the grain. The datamancer secat the parallel boundary — verify that each parallel invocation writes to its own slot, never shares mutation, never races for state.
vigilia-slot: conditional-code
vigilia-order: 2
vigilia-concern: Parallel safety; disjoint writes
vigilia-trigger: files that use parallel primitives
---

# Secare

> *secare* — Latin: to cut, divide, sever cleanly. Root of "section," "sector," "bisect," "intersect." The act of cutting along the grain so the pieces fall apart cleanly.

> A cleaver divides into parts that do not touch.

Secare checks **parallelism safety**. When code says "this runs in parallel," does the structure GUARANTEE that the parallel pieces do not touch each other's state? Or does it merely HOPE?

The compiler catches data races where the host language has the discipline (Rust's borrow checker; pure-FP isolation). The compiler does not catch race conditions in the algorithm — the cases where the host language permits the access but the algorithm requires disjointness.

## The principle

Parallel safety is a structural property, not a runtime property. A `par_iter().map(|x| ...)` is safe when each iteration's closure writes only to its own slot in the output (the map result). It is unsafe when iterations write to a shared `&mut Vec<T>` or call functions that mutate global state.

Secare asks: **for each parallel boundary, are the writes genuinely disjoint?**

The structurally honest shape:
- Each parallel invocation produces a value
- The values are collected (`collect()`, `reduce()`, `fold()`)
- Aggregation happens AFTER the parallel phase, sequentially
- No invocation reaches outside its slot during the parallel phase

The structurally dishonest shape:
- Parallel invocations share a `Mutex<T>` (concurrency-mode lock-based)
- Parallel invocations write to a `Atomic*` with non-trivial ordering assumptions
- Parallel invocations call helpers that touch shared state (logging, metrics, global counters)
- Parallel invocations dispatch to channels and the dispatch creates ordering dependencies

## The four questions applied

- **Obvious?** Can a reader tell, from the parallel boundary's signature alone, that the writes are disjoint? `(0..n).into_par_iter().map(|i| compute(i)).collect::<Vec<_>>()` — obvious; each `i` produces one value into the result. `(0..n).into_par_iter().for_each(|i| GLOBAL_LOG.lock().push(events[i]))` — obvious in the wrong direction; each iteration takes a shared lock. Both are obvious; one is obviously honest, the other obviously not.
- **Simple?** Does the parallel phase do ONE thing — compute values from inputs — and let aggregation happen elsewhere? Or does the parallel phase try to do compute + aggregation + side effects in one pass? The mixed form is harder to reason about because each concern's safety depends on the others.
- **Honest?** Does the structure CLAIM disjointness it doesn't deliver? `par_iter().for_each(|x| shared.lock().push(x))` claims parallelism in the call shape; the lock proves the work runs serially. Honesty is whether the structural claim and the structural reality match. (Whether the parallelism actually PAYS at the workload scale is temperare's question, not secare's.)
- **Good UX?** Does the parallel form's failure mode point at the boundary that broke? A panic inside `par_iter` should name which iteration failed; if all you get is "panic in worker thread" with no further detail, the parallel form is fighting your debugging.

## What secare sees

> Code examples below illustrate Rust + rayon-style parallelism; translate to your host language's parallel primitives. The discipline applies to ANY parallel mechanism (thread pools, async tasks, GPU dispatch, MapReduce).

### Shared-state mutation during parallel phase — Level 1 lie

```rust
// ❌ Iterations share GLOBAL_COUNTER; the lock serializes the parallelism
items.par_iter().for_each(|item| {
    let count = GLOBAL_COUNTER.fetch_add(1, Ordering::SeqCst);
    process(item, count);
});
```

Either the iterations need the counter (in which case the parallelism is a lie; lock contention serializes them) or they don't (in which case the counter is dead and removable). Either way, the current shape is wrong.

### Per-iteration `Mutex<T>` access — Level 1 lie

```rust
// ❌ Each iteration takes &shared.lock(); throughput is bounded by lock turnover
items.par_iter().for_each(|item| {
    let mut shared = shared_state.lock().unwrap();
    shared.update(item);
});
```

The structure says "parallel"; the lock says "serial." The two cancel. Honest forms: each iteration produces an update value (`map`), then a sequential pass applies them; or the update is genuinely associative and can use `reduce`/`fold`.

### Channel send during parallel phase — Level 2 mumble

```rust
// ⚠ Each iteration sends; receiver is a single thread; ordering may not be the iteration order
items.par_iter().for_each(|item| {
    tx.send(process(item)).expect("send");
});
```

This works for fire-and-forget pipelines but can surprise: outputs are received in arrival order, not iteration order. If downstream code assumed iteration order, the parallel form silently breaks it. Either: (a) collect into a Vec to preserve iteration order; (b) tag outputs with index; (c) document that order is not preserved.

### Hot reduction that defeats parallelism — Level 2 mumble

```rust
// ⚠ Per-iteration .lock() on a hot path
items.par_iter().fold(
    || HashMap::<K, V>::new(),
    |mut local, item| { local.insert(item.k, item.v); local },
).reduce(
    || HashMap::<K, V>::new(),
    |mut a, b| { for (k, v) in b { a.insert(k, v); }; a },
);
```

This pattern is correct — `fold` accumulates per-thread, `reduce` merges. But if the inner work per item is tiny compared to HashMap operations, the parallelism doesn't pay; per-thread overhead exceeds work-per-item.

## What secare does NOT flag

- **`par_iter().map(...).collect::<Vec<_>>()`** — each iteration produces a value into the output's slot at the iteration's index. Disjoint writes guaranteed by rayon.
- **`Atomic*` for cheap counters** where the ordering is `Ordering::Relaxed` and a stale read is acceptable. The lock-free counter is the canonical safe form.
- **Read-only shared state** during the parallel phase — `&T` shared across iterations is always safe; only `&mut T` or interior mutability create races.
- **Channels driving a pipeline where order doesn't matter** (event streams, fan-out workers, work-stealing queues).

## The rune

Some parallel patterns look unsafe but are structurally fine because of an invariant the spell can't see. The rune declares the boundary safe with a justified reason:

```rust
// rune:secare(disjoint-via-index) — each iteration writes to results[i]; rayon guarantees one i per worker
results.par_iter_mut().enumerate().for_each(|(i, slot)| {
    *slot = compute(inputs[i]);
});
```

Format: `// rune:secare(<category>) — <reason>`

**Categories:**

- `disjoint-via-index` — writes are sliced by index; each iteration owns one slot; the disjointness is structural.
- `relaxed-counter` — `Atomic*` with `Ordering::Relaxed` for a counter where the algorithm tolerates stale reads. Name the invariant.
- `read-only-share` — shared state is `&T` only; no interior mutability. (Most won't need a rune; flag only if the shape LOOKS like a race but isn't.)
- `async-not-parallel` — the call looks parallel (`tokio::join!`, futures) but the host runtime serializes them; the apparent parallelism is awaited-not-raced.

Placement: on the line immediately preceding the parallel boundary.

The reason field is required. A rune with an empty reason fails the spell.

## Reporting format

For each finding, report:

- File path + line number
- The parallel boundary (par_iter / spawn / async-task / etc.)
- The shared-state touch (lock / atomic / channel send / global / mut reference)
- The race class (lost-update / silent-reorder / lock-serialization / undefined-order)
- The disjoint direction (collect-then-aggregate / index-sliced-writes / per-thread-fold-then-reduce / drop-the-parallelism)

## The principle behind the spell

Parallelism is structural. Either the writes are disjoint by construction, or they race — and "races" includes lock contention that serializes what was supposed to run concurrently. Secare cuts the parallel boundary cleanly: each iteration in its own slot, aggregation outside, no thread touching another thread's work during the parallel phase. The pieces fall apart cleanly because the cut respected the grain.
