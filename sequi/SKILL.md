---
name: sequi
form: act
category: craft
reading: to follow the state — threaded visibly through types, across the chain
description: Follow the state. The datamancer sequit the composition chain — state must follow through every transformation, visibly, through the types. Hidden state breaks composition; the spell catches the break.
vigilia-slot: universal-code
vigilia-order: 6
vigilia-concern: Per-chain state threading
---

# Sequi

> *sequi* — Latin deponent infinitive: to follow, accompany, pursue. Cognates: sequence, sequel, consecutive, consequent. The act of following through a chain.

> Brian Beckman taught: hidden state breaks composition. State that follows through every step, visible in every type, is the only honest shape. The state monad's `s -> (s, a)` made operational.

Where solvere finds tangled concerns and complectens finds wrongly-braided test layers, sequi finds **chains where state went into hiding**. A composition is honest when each step receives the prior state and returns the new state THROUGH ITS SIGNATURE. A composition is dishonest when steps coordinate via globals, statics, lazy_static, OnceLock, hidden Arc<Mutex>, or any channel not visible in the type.

## The principle

State that follows visibly through types lets the reader see what changed at every step. State that follows via side channels is invisible — the reader cannot reason about it, the test cannot exercise it, the caller cannot rewire the chain. Beckman's specific contribution: the discipline that makes state visible in types is not optional decoration; it is the only way composition holds.

Sequi asks: **for each chain of transformations, does state follow through the signatures, end to end?**

The honest shape:
- Each step's signature shows what it receives + what it returns
- The state at the chain's end is derived from the state at the chain's start through visible steps
- A caller can insert / remove / reorder steps and the type checker enforces the new chain's correctness
- The test can construct any prefix of the chain and observe the intermediate states

The dishonest shape:
- Sequential calls that ignore each other's outputs (`step1(); step2(); step3();` where the steps coordinate via something not in the call signatures)
- Hidden state via globals / statics / lazy_static / OnceLock / `Arc<Mutex<>>` reached from inside transformation bodies
- Type signatures hiding mutation the function actually performs
- The chain that works at runtime but the type checker has no purchase on it

## The four questions applied

The unit of analysis is a CHAIN — a sequential pipeline of transformations whose composition is the point.

- **Obvious?** Can a reader read the chain's signatures and see the state thread? `let s1 = step1(s0); let s2 = step2(s1); let out = step3(s2);` — obvious; each s_i visible. `step1(); step2(); step3();` with hidden coordination — obvious fails.
- **Simple?** Does each step do ONE state transition? Or does it ALSO touch a global counter, log to a singleton, mutate an out-of-signature Arc?
- **Honest?** Do the types tell the truth about what the step affects? `fn step(state: State, input: T) -> (State, U)` is honest. `fn step(input: T) -> U` with internal `COUNTER.fetch_add(1)` is dishonest — the counter mutation is hidden.
- **Good UX?** Can a caller rewire the chain (insert a step, drop a step, reorder steps) and have the type checker enforce correctness? Visible state threads support rewiring; hidden coordination silently breaks under reorder.

## What sequi sees

> Code examples below illustrate Rust patterns; translate to your host. The discipline applies wherever transformations are composed into chains.

### Broken bind chain — state ignored

```rust
// ❌ Each call returns a value the next call ignores
let _ = build_request(input);
let _ = send_request(connection);   // ← did it use the request? unclear
let _ = process_response();         // ← did it see the response? unclear
```

Three sequential calls; no visible coordination. Either the calls are connected via hidden state (a global request queue, a session-storage singleton), or the order is incidental and the chain doesn't really compose. Either is a Beckman violation.

### Hidden state via global counter

```rust
// ❌ Signature claims pure transformation; body mutates global
pub fn next_id(prefix: &str) -> String {
    let n = ID_COUNTER.fetch_add(1, Ordering::Relaxed);
    format!("{}-{}", prefix, n)
}
```

The signature says "give me a prefix, I'll give you a String." The body says "I will also mutate global state." A caller composing this into a chain has NO WAY to test it in isolation or observe the state transition. The fix: thread the counter explicitly — `fn next_id(counter: u64, prefix: &str) -> (u64, String)`.

### Hidden state via Arc<Mutex<>> reached from a closure

```rust
// ❌ The closure captures shared state; the chain looks pure but races
items.iter().map(|item| {
    let mut cache = SHARED_CACHE.lock().unwrap();
    cache.insert(item.id, item.value.clone());
    item.id
}).collect()
```

The map operation looks like a pure transformation (item → id). The body silently mutates `SHARED_CACHE`. Two readers cannot see the same state evolution; the chain is not composable across threads (and may not even be composable across iterations). Fix: thread the cache explicitly, OR if SHARED_CACHE is truly cross-cutting, use the rune.

### Types hide what the function actually does

```rust
// ❌ Returns Vec<T>; also touches metrics, logging, and an event bus
pub fn process_batch(items: Vec<Item>) -> Vec<ProcessedItem> {
    METRICS.batch_count.inc();
    LOGGER.info(&format!("processing {} items", items.len()));
    let result = items.into_iter().map(process_one).collect();
    EVENT_BUS.publish(BatchProcessed { count: result.len() });
    result
}
```

The signature promises a simple data transformation. The body performs four state transitions: increment metric, write log, transform data, publish event. A caller reading the signature is misled three times. Either: lift the side effects out (the caller orchestrates metrics + logging + publishing), OR rune-acknowledge the cross-cutting concerns explicitly.

### mut self that returns nil — state transition hidden behind receiver

```rust
// ⚠ Idiomatic Rust, but the state transition is invisible past the receiver
impl Counter {
    pub fn increment(&mut self) {
        self.value += 1;
    }
}

// Composed in a chain:
counter.increment();
counter.increment();
let final_val = counter.value;
```

The `&mut self` is the honest channel — the mutability is in the signature. This is HOST-IDIOMATIC and not flagged by default. But if the chain is the load-bearing concern (state must follow visibly so the chain can be rewired), prefer:

```rust
pub fn increment(self) -> Self {
    Self { value: self.value + 1, ..self }
}

let final_counter = counter.increment().increment();
```

The latter is monadically explicit. Flag only when the chain's rewireability is the discipline being defended.

## What sequi does NOT flag

- **Pure functions composed via `|>` / `.then()` / `bind` / `.map()` / `.collect()`** — these ARE the honest shape; sequi defends them.
- **Database / network / file IO via explicit handles passed through the chain** — the handle IS the state being threaded; honest.
- **Logging / metrics / tracing through dedicated cross-cutting pipelines** — those have their own pipelines; not state being threaded through the domain chain.
- **`&mut self` in host-idiomatic substrates** when the receiver's mutability is the visible channel and the chain doesn't depend on monadic explicitness.
- **Single-step computations** — sequi is about chains; a one-step function call is solvere/struere/intueri territory, not sequi's.

## The rune

Some hidden state is intentional and load-bearing. The rune declares the hiding conscious:

```rust
// rune:sequi(ambient-context) — logger threaded via thread-local; explicit threading would bloat every signature in the codebase
// rune:sequi(performance-counter) — global atomic measured at 5x faster than threading; the counter is observation, not domain state
// rune:sequi(host-idiom) — Rust &mut self; the mutability IS in the signature; monadic return form is not idiomatic here
// rune:sequi(legacy-shape) — pre-discipline; refactor tracked in arc N; rune retires when refactor lands
```

Format: `// rune:sequi(<category>) — <reason>`

**Categories:**

- `host-idiom` — the host language's canonical pattern uses receiver mutation (`&mut self`, OOP setters) rather than monadic state return; mutability is in the signature; not hidden.
- `ambient-context` — true cross-cutting concern (logging, tracing, telemetry) that doesn't carry domain state; threading would force every signature to carry irrelevant baggage.
- `performance-counter` — global counter/atomic justified by measurement; threading would impose unjustified cost. Cite the measurement.
- `legacy-shape` — pre-discipline code; refactor tracked. The rune retires when the refactor lands; cite the arc/issue.

**Note on what has NO rune category:** hidden domain state (a global / static / Arc<Mutex<>> holding actual domain data the chain operates on) has no rune by design. The discipline does not permit it — the honest response is to thread the state explicitly OR restructure into a service-with-handle pattern. A rune would suppress the finding without justifying it; sequi refuses that suppression for the case the spell exists to catch.

Placement: on the line immediately preceding the chain or the function whose body breaks the thread.

The reason field is required. A rune with an empty reason fails the spell.

## Reporting format

For each chain in scope:

- File path + chain start/end line numbers
- The chain's transformations (named or anonymous)
- Where the state thread breaks (specific site)
- The hidden coordination (global / static / Arc / mut-without-return / cross-cutting-via-singleton)
- Recommendation: thread explicitly / accept the rune / restructure into a service-with-handle

## The principle behind the spell

Beckman taught: when you can see the state, you can see what changed. When you can't, you don't know what your function actually does — and neither does the caller, the reader, the test. The state monad isn't mystical; it's the discipline that makes state visible. Sequi makes the discipline operational at the composition layer: each transformation takes state in, returns state out, the types show the thread, and the chain composes because nothing is hiding.
