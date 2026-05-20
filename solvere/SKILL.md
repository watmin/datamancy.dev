---
name: solvere
description: Loosen what was wrongly bound. The datamancer solveres the code — finds braided concerns, misplaced logic, duplicated encoding. Hickey's decomplect, made operational.
---

# Solvere

> *solvere* — Latin: to loosen, untie, release, dissolve a knot. The cognate root of "solve," "dissolve," "resolve." The act of untying what was wrongly bound.

> "I'd rather have more things hanging nice, straight down, not twisted together, than just a couple of things tied in a knot." — Rich Hickey

Solvere checks **whether the architecture's strands hang straight**, or whether concerns have been braided together such that one cannot move without disturbing another.

When the code is complected, the architecture is hidden. When the architecture is hidden, the practitioner cannot think about it. When the practitioner cannot think about it, the practitioner cannot improve it. Solvere finds where the braid formed.

## The principle

Simple means *not interleaved*. Two concerns that compose are separate. Two concerns that interleave are one entangled thing pretending to be two. The interleave is the lie; solvere finds the lie and surfaces what should hang as separate strands.

Solvere asks: **what concerns has this code braided together?**

The honest shape has each concern as its own thing, callable independently, composing via abstractions (function calls, message passing, typed channels). The dishonest shape has concern A reaching into concern B's internals because the two were never properly separated.

## The four questions applied

- **Obvious?** When this code does one of its jobs, is the OTHER job visibly absent? A function called `parse_config` that ALSO logs metrics has two jobs braided; obvious fails. A function called `parse_config` that calls `log_parse_metrics(result)` after parsing has the jobs as separate strands; obvious holds.
- **Simple?** Can each concern be tested independently? If the only way to exercise concern A is to run a test that also exercises concerns B, C, and D — the concerns are braided. Independent test surface IS the proof of independent concerns.
- **Honest?** Does the module structure mirror the concerns? `market.rs` should hold market logic; `treasury.rs` should hold treasury logic. A treasury concept defined in `market.rs` is misplacement — the file name lies about the file's contents.
- **Good UX?** Can a fresh reader trace one concern from start to finish without their attention forking? Forking attention is the felt experience of complection.

## What solvere sees

> Code examples below are drawn from the substrates where this discipline matured (concurrency-aware typed substrates). The transferable parts are WHAT-two-jobs-are-braided and WHERE-each-belongs; the syntax is illustrative only. Translate to your host language.

### Domain concepts misplaced — the load-bearing violation

A struct, enum, or function whose name names a concept in domain A but whose module location is domain B. The file's name promises one thing; its contents deliver another.

```rust
// ❌ Level 1 lie — TreasuryState defined in market.rs
// (market.rs)
pub struct TreasuryState {
    pub balance: u64,
    pub positions: Vec<Position>,
}

pub fn snapshot_market(...) -> MarketSnapshot { ... }
```

`TreasuryState` belongs in `treasury.rs`. Its presence in `market.rs` braids the two domains; a reader looking for treasury types in the treasury module won't find them, and a reader of market code stumbles over an out-of-place type.

### Functions doing two things

A function whose name describes one job but whose body performs two. The braid is *inside the function*; the lie is the function's name.

```rust
// ❌ Level 1 lie — parse_config also writes metrics
pub fn parse_config(src: &str) -> Result<Config> {
    let cfg = serde::from_str(src)?;
    METRICS.parse_count.inc();          // ← second job, undeclared
    METRICS.parse_duration.observe(...);
    Ok(cfg)
}
```

The fix: extract the metrics into a separate call site at the caller. `parse_config` does parsing; the caller decides whether to record metrics.

### Channel-contract bypass — silent abstraction undone

A consumer that hand-builds the wire protocol instead of calling the helper that abstracts it. The helper exists; the consumer reaches past it; the abstraction is silently undone. The interface promised insulation; the consumer's bypass means every other consumer must now also learn the wire (or copy the bypass). Level 1 lie — the surface lies about what it actually provides once one caller routes around it.

```scheme
;; ❌ Level 1 lie — bypassing the consumer surface
;; (CacheService/get is the helper; this consumer hand-builds the wire)
(send req-tx (Request::Get k reply-tx))
(let ((response (recv reply-rx)))
  ...)

;; ✓ Honest — call the helper
(CacheService/get cache-handle k)
```

Bypassing the helper means every consumer learns the wire protocol; the abstraction provides no insulation. Solvere flags the bypass and recommends the helper.

### Duplicated encoding — the silent braid

The same encoding logic appearing in two places (often: once in a serializer, once in a hand-written parser; or once in a constructor, once in a transformer). When the format changes, both must change in sync; if they drift, behavior diverges silently.

```rust
// ❌ Level 2 mumble — same field-order logic in two functions
pub fn encode_message(msg: &Message) -> Vec<u8> {
    let mut buf = Vec::new();
    buf.extend(msg.timestamp.to_le_bytes());
    buf.extend(msg.kind.as_byte());
    buf.extend(msg.payload.as_slice());
    buf
}

pub fn decode_message(bytes: &[u8]) -> Result<Message> {
    let timestamp = u64::from_le_bytes(bytes[0..8].try_into()?);
    let kind = MessageKind::from_byte(bytes[8])?;
    let payload = bytes[9..].to_vec();
    Ok(Message { timestamp, kind, payload })
}
```

The braid: field order + byte offsets + type widths all encoded twice. The fix: a single declarative shape (a struct with derive macros; a schema; a code-generated codec) so encoding and decoding are one source of truth.

## What solvere does NOT flag

- **Composition** (NOT complection). A function that calls three helpers in sequence is composing, not complecting. Each call delegates one job; the function orchestrates. Orchestration is honest.
- **Wrapping abstractions** that genuinely insulate. A `CacheService` that wraps a `HashMap` + a lock + a metrics counter is doing one job (provide cache semantics) by composing the parts. Honest.
- **Cross-cutting concerns expressed via dedicated channels** — logging, metrics, telemetry that flow through their own pipelines. Those pipelines run alongside the domain logic; they don't braid with it.

## The rune

Some braids are intentional and load-bearing. For these, the rune declares the entanglement exempt with a justified reason:

```rust
// rune:solvere(load-bearing-coupling) — this fn must atomically update both fields to maintain the invariant; splitting would break the atomicity
pub fn advance_with_metric(&mut self, delta: u64) { ... }
```

Format: `// rune:solvere(<category>) — <reason>`

**Categories:**

- `load-bearing-coupling` — the two concerns MUST move together for correctness (atomicity, invariant maintenance, transactional update). Splitting breaks the invariant.
- `irreducible-tangle` — a true cross-cutting concern (logging tied to call-stack walking; tracing tied to runtime entry/exit) where the host language doesn't offer a clean separation.
- `historical-shape` — a legacy braid preserved because rewriting carries higher risk than the discipline violation justifies. The rune retires when the rewrite arc lands.

Placement: on the line immediately preceding the braided definition, wherever the host language allows a comment to attach.

The reason field is required. A rune with an empty reason fails the spell — the rune's job is to capture the WHY so the next reader understands the exemption.

## Reporting format

For each flagged braid, report:

- File path + line number
- The braided concerns (name both)
- Where each concern SHOULD live (target module / function / abstraction)
- Recommendation: split / move / introduce abstraction / mark with rune
- One-sentence judgment of whether the braid is structural or incidental

## The principle behind the spell

The architecture is the story the code tells about its own concerns. When the concerns hang straight — each in its own place, each callable on its own — the story is clear and the practitioner can act on it. When the concerns are braided — one reaching into another, two doing what should be one — the story is hidden and the practitioner cannot act without disturbing things they didn't mean to disturb. Solvere finds where the braid formed so the strands can hang straight again. The four-questions (see grimoire README) apply to every split / move / abstraction proposed.
