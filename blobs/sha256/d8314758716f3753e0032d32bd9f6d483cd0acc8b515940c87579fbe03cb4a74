---
name: struere
description: Test what is built. The datamancer struere the function — values flowing through, not mutating in place; composition that holds under load; abstractions at the right level.
---

# Struere

> *struere* — Latin: to build, arrange, construct so as to stand; to lay in order. Root of "structure," "construct," "instruct," "destroy" (de-struere — un-build). The act of arranging components so the whole holds.

> A built thing is shaped by repeated thought and revision. Each cycle removes what shouldn't be there. Each composition tests what should.

Other spells ask: is it tangled (solvere)? Is it alive (purgare)? Does it speak (intueri)? Does state follow through the chain (sequi)? Struere asks: **is the function itself well-built?**

Hickey's lens applied at the function level: values, not places; types enforce; the abstraction sits at the caller's vantage. (Chain-level state-threading is sequi's concern; struere checks the per-function craft.)

## The principle

A well-built function does one thing and tells you what it did. A well-built data flow moves through transformations without mutating shared state. A well-built abstraction sits at the level its callers think at — not too high (the caller juggles internals); not too low (the caller waits while the abstraction over-explains).

Struere asks: **does this composition hold under load? Could a caller exercise it without surprise?**

## The four questions applied

- **Obvious?** Can the function's contract be read off its signature alone? `fn parse_config(src: &str) -> Result<Config, ParseError>` says what it does. `fn handle(state: &mut State) -> i32` says nothing about what the i32 means or what state was mutated. Level 1 lie.
- **Simple?** Does the function take values and return values, with no side effects the signature doesn't surface? Mutation through `&mut self` is honest because the signature names it. Mutation through `Arc<Mutex<T>>` smuggled in via a field is not.
- **Honest?** Does the type enforce what the comment claims? If the comment says "returns a non-empty Vec," the return type should be `Vec1<T>` (a non-empty-vec newtype) — not `Vec<T>` with a runtime check the caller might forget.
- **Good UX?** Does the abstraction sit at the caller's level? A caller writing application logic should not see channel allocations or thread spawns; those belong inside the abstraction. A caller writing the abstraction should not see application semantics; those belong above.

## What struere sees

> Code examples below illustrate Rust patterns; translate to your host language. The transferable parts are the SHAPES (values flowing through; types enforcing contracts; composition that holds); the syntax is illustrative.

### Mutation hidden behind innocent signatures — Level 1 lie

```rust
// ❌ The signature claims nothing; the body mutates global state.
pub fn fetch_count() -> u64 {
    let count = COUNTER.fetch_add(1, Ordering::Relaxed);
    count
}
```

The function name `fetch_count` and the empty parameter list say "this is a read." The body says "this is a read-modify-write on shared state." The caller is misled. Fix: rename to `next_count` (names the increment) or take `&mut Counter` explicitly so the mutation is visible.

### Types that don't enforce — Level 1 lie

```rust
// ❌ Comment promises "non-empty"; type doesn't enforce.
/// Returns the user's roles. Always at least one (guest if no others).
pub fn user_roles(user_id: UserId) -> Vec<Role> { ... }
```

Three callers will trust the comment. The fourth will deploy a code path where the upstream invariant breaks; `roles[0]` panics. The type should be `Vec1<Role>` (or `(Role, Vec<Role>)`); the compiler enforces what the comment promises.

### Abstractions at the wrong level — Level 1 lie

```rust
// ❌ The caller is doing application logic but sees infrastructure.
pub fn record_trade(
    db: &Database,
    metrics: &MetricsRegistry,
    audit_log: &AuditLog,
    trade: Trade,
) -> Result<(), Box<dyn Error>> { ... }
```

The caller wanted to "record a trade." Instead, they juggle three infrastructure handles, three error types, and one domain value. The abstraction has leaked. Fix: a `TradeBook` value holds the three handles; `book.record(trade)` is the caller's surface.

### Composition that doesn't hold — Level 2 mumble

```rust
// ❌ Each function works alone; together they race.
fn enqueue(item: Item) { GLOBAL_Q.lock().push(item); }
fn drain() -> Vec<Item> { GLOBAL_Q.lock().drain(..).collect() }

// Two threads: T1 enqueues 100 items; T2 drains every 10ms.
// T2 sometimes drains 0 items (T1 hadn't acquired the lock yet);
// sometimes drains all 100 (T1 had finished); rarely drains a
// partial batch (T1 mid-loop, T2 caught it between pushes).
```

Each function passes its own four-questions cleanly. The COMPOSITION doesn't hold — observers see arbitrary subsets depending on timing. Honest composition: `enqueue_batch(items: Vec<Item>)` so the producer's intent is preserved; or a typed channel that the producer drives end-to-end.

### Values masquerading as places — Level 2 mumble

```rust
// ❌ The struct looks like a value but stores references and assumes lifetimes.
pub struct Snapshot<'a> {
    pub events: &'a [Event],
    pub timestamp: i64,
}
```

A `Snapshot` reads as a value (a frozen view), but `&'a [Event]` binds it to whoever owns the slice. A caller who tries to keep the snapshot past the slice's lifetime gets a compile error they didn't expect. Fix: own the data (`Vec<Event>`) or use an immutable Arc; let the caller hold the value without lifetime ceremony.

## What struere does NOT flag

- **Pure functions with `&mut self`** receivers — the receiver's mutability is in the signature; the contract is honest.
- **Side effects at IO boundaries** (`println!`, `write_file`, `send_request`) — the function name surfaces the effect; the caller chose it deliberately.
- **`unsafe` blocks** that are correctly scoped + commented — `unsafe` declares the cost; the comment justifies it. Outside struere's scope; the host language's safety story owns this concern (no rune needed).
- **Performance optimizations** that trade clarity for speed at justified hotspots — that's temperare's concern, not struere's.

## The rune

Some compositions are intentionally tight against the four-questions because the host's constraints justify it. The rune declares the exemption with a justified reason:

```rust
// rune:struere(invariant-coupling) — these three fields must be updated atomically; splitting the struct would break the invariant
pub struct PositionLedger {
    balance: i64,
    last_seq: u64,
    pending: Vec<Trade>,
}
```

Format: `// rune:struere(<category>) — <reason>`

**Categories:**

- `invariant-coupling` — fields/operations must move together for correctness; the apparent complection is structural.
- `host-constraint` — the abstraction can't sit at the caller's level because the host language doesn't offer the mechanism (no higher-kinded types; no compile-time reflection; etc.). Remove the rune when the host mechanism ships and the abstraction can be rewritten; the rune's presence is a tracking obligation.
- `lifetime-coupling` — a value-shaped struct deliberately borrows (`&'a [...]`) for performance or zero-copy reasons; the caller's lifetime ceremony is the cost the rune declares conscious. Cite the perf measurement or the zero-copy invariant.
- `performance-hotspot` — the simpler form was profiled and found insufficient; the current form is justified by measurement. Cite the measurement.

Placement: on the line immediately preceding the construct.

The reason field is required. A rune with an empty reason fails the spell.

## Reporting format

For each finding, report:

- File path + line number
- The construct (function / type / abstraction)
- Which lens flagged it (values-not-places / composition-doesn't-hold / wrong-level / type-doesn't-enforce)
- Level 1 (lie) or Level 2 (mumble)
- The proposed direction (rename / type-tightening / abstraction-extraction / composition-shape)

## The principle behind the spell

A function is the smallest unit of the architecture. If functions don't hold under load, the architecture they compose into doesn't either. Struere applies Hickey's heat at the function level — remove what's mutable when values would do; make the type tell the truth; place the abstraction where the caller stands. Composition across functions (whether state follows visibly through the chain) is sequi's concern; struere defends the unit before sequi tests how units compose. The four-questions decide which findings ship as changes.
