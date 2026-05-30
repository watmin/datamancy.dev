---
name: purgare
description: Purge dead thoughts. The datamancer purgares the code — finds structs never imported, fields never read, collections never populated, branches never taken. The cost of a dead thought is compute.
---

# Purgare

> *purgare* — Latin: to cleanse, purge, remove waste. The cognate root of "purge," "purify," "expurgate." The act of removing what should not remain.

> A thought that produces no signal is not inert. It occupies space. It accumulates state. It steals cycles from good thoughts.

Purgare checks **whether each defined thing is alive**. The compiler warns about unused variables. The compiler does not warn about defined-but-never-imported structs, fields that are written but never read, parameters always passed the same constant, collections created but never populated, branches that always evaluate the same way. These are dead thoughts the compiler accepts. Purgare finds them.

## The principle

Every defined thing should produce signal somewhere. A struct that is exported but never imported is dead. A field that is written but never read is dead. A branch that is never taken is dead. Dead thoughts occupy space; they accumulate state; they steal cycles from good thoughts; they confuse readers who assume defined things are used.

Purgare asks: **does this defined thing live, or has it died and been left in place?**

A code path is alive when both ends are connected — the producer puts something into it, and a consumer reads it back out. A code path is dead when one end is missing — produced but never consumed, defined but never instantiated, written but never read.

## The four questions applied

- **Obvious?** Will a fresh reader understand why this thing exists? If the reader cannot find a consumer / caller / reader, the thing's existence is unobvious. Level 1 lie — the definition implies usage that isn't there.
- **Simple?** Does deleting this thing change behavior? If `cargo check` passes and tests pass after deletion, the thing was dead. If a removal cascade is needed (delete the field, delete the struct, delete the constructor), the dead thought had grown roots.
- **Honest?** Does the type signature tell the truth? A function whose `Option<T>` parameter is always `None` at call sites is lying — the parameter pretends to vary. A `Vec<T>` field that is never `.push()`'d is lying — the field pretends to hold collections.
- **Good UX?** Does the existence of this thing burden the reader without serving them? Every defined thing the reader must skip past to reach the live code is a tax. The reader's attention is the substrate's scarcest resource.

## What purgare sees

> Code examples below illustrate Rust patterns; translate to your host language. The discipline holds in any language with a module system, structs, and control flow.

### Structs exported but never imported

```rust
// (lib.rs or module file)
pub struct UnusedMetric {
    pub count: u64,
    pub timestamp: i64,
}
```

`grep` for `pub struct UnusedMetric` finds the definition. `grep` for `UnusedMetric` across the codebase finds only the definition site. The struct has no consumers. It is dead. Either it was never wired up, or its consumer was deleted and the struct was forgotten.

### Parameters always passed as a constant

```rust
pub fn build_request(timeout: Option<Duration>, retries: u32, ...) -> Request { ... }

// Every call site:
build_request(None, 0, ...);
build_request(None, 0, ...);
build_request(None, 0, ...);
```

The `timeout` and `retries` parameters are dead. They vary in the signature but not in practice. The fix: remove them from the signature; their constant values become local constants inside `build_request` (or the function returns the simpler shape).

### Collections never populated

```rust
pub struct Aggregator {
    pub events: Vec<Event>,        // ← never .push()'d
    pub running_sum: i64,
}

impl Aggregator {
    pub fn record(&mut self, value: i64) {
        self.running_sum += value;
    }

    pub fn summary(&self) -> Summary {
        Summary {
            count: self.events.len(),   // ← always 0
            sum: self.running_sum,
        }
    }
}
```

The `events` field is dead. It exists; it's read in `summary()`; but no code path writes to it. The `count` in the summary is always 0. The dead field gives a misleading reading.

### Branches that always evaluate one way

```rust
pub struct Flags {
    pub use_legacy: bool,    // ← initialized to false; never set true
}

impl Service {
    pub fn handle(&self, req: Request) -> Response {
        if self.flags.use_legacy {
            handle_legacy(req)         // ← dead branch
        } else {
            handle_modern(req)
        }
    }
}
```

If `use_legacy` is never set to `true` anywhere, the `if` is dead. Either remove the flag + collapse the branch, or wire up the call site that was supposed to set it. The "feature flag that was never used" pattern is the canonical case.

### Write-only state

```rust
pub struct Bookkeeper {
    pub last_processed_id: u64,    // ← written; never read
}

impl Bookkeeper {
    pub fn record(&mut self, id: u64) {
        self.last_processed_id = id;
    }
}
```

`last_processed_id` is updated but never observed. It might have been added "for debugging" or "in case we need it later" — but no current code path reads it. Dead. Either remove it, or surface a method that reads it (and ensure some caller actually uses that method).

## What purgare does NOT flag

These have STRUCTURAL signals that distinguish them from dead thoughts (visibility, trait bound, exhaustive coverage). They are not violations:

- **Public API surface** intentionally exported for downstream consumers (library crates exporting types for users). Mark with a doc comment or attribute that names the intentional export; corroborate with the `public-api` rune when the absence-of-internal-use is itself the load-bearing signal.
- **Trait implementations** required by a trait bound, even if no current caller exercises the specific impl. The trait + the impl are the contract; the contract exists for future callers.
- **Enum variants that are never constructed but are covered in exhaustive match arms elsewhere** — the variant's existence keeps the match honest by forcing the matcher to handle the variant if it ever IS constructed. Removing the variant would silently shrink the exhaustiveness guarantee.

Other intentional retentions (test fixtures awaiting their tests, defensive code paths for edges the production flow doesn't trigger) lack a structural signal — they look identical to forgotten code from outside. Those cases REQUIRE the rune; see § "The rune" below.

## The rune

Some defined-but-unused things are intentionally so. The rune declares the lifelessness exempt with a justified reason:

```rust
// rune:purgare(public-api) — exported for downstream library consumers; not used internally by design
pub struct ConfigSummary { ... }
```

Format: `// rune:purgare(<category>) — <reason>`

**Categories:**

- `public-api` — exported for downstream consumers outside this codebase. Naming convention or visibility tells the half of the story; the rune tells the other half (this is intentional, not forgotten).
- `trait-contract` — required by a trait bound or contract, even if no current caller exercises this specific path.
- `future-fixture` — test fixture for a planned test not yet written. The rune retires when the test lands.
- `safety-margin` — defensive code path for an error condition the current production flow doesn't trigger; preserved for the future caller who hits the edge.

Placement: on the line immediately preceding the dead-looking definition.

The reason field is required. A rune with an empty reason fails the spell.

## Reporting format

For each flagged dead thought, report:

- File path + line number
- The dead definition (struct / field / parameter / branch / variable)
- Evidence of death (no callers / no readers / constant value / never-populated)
- Recommendation: delete / wire up the missing consumer / mark with rune
- Estimated removal cost: leaf deletion (1 site) / cascade (multiple sites)

## The principle behind the spell

Code is communication. Each defined thing says to the reader: "this exists; you should know about it." A defined thing with no consumer says that, then provides nothing further. The reader's attention was spent on a thing that returned no signal — the substrate's scarcest resource taxed for nothing. Purgare finds where the tax was levied without justification. Every removal proposal passes through the four-questions before the cascade begins.
