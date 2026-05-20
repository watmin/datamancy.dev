---
name: complectens
description: Weave together. The datamancer complectēns the tests — does each layer compose only from layers above it? Does each layer carry its own proof? Or did this test attempt to one-shot a hard problem?
---

# Complectēns

> *complectēns* — Latin: embracing, encompassing, comprehending. Present active participle of *complectī*: *com-* (together) + *plectere* (to weave, plait). Past participle *complexus* → English "complex" — components woven into a comprehensible whole.

> The test should read like a story. Each layer adds one new chapter. The named helpers are the characters. The composition is the plot. The deftest at the bottom is what happens.

Complectens checks **whether the test was woven or thrown together**.

A test that one-shots a hard problem cannot answer YES to the four questions. A test that composes from named, individually-proven layers can. The compiler tells you the test runs. Complectēns tells you what the test PROVES — and whether, when it fails, you'll know which thread broke.

## The four questions applied

Run them on the deftest at the bottom of the file:

- **Obvious?** When this test fails, will I immediately know which named layer broke? If the failure narrows to a specific function name in the trace → YES. If "expected X, actual Y" with no further structure → NO (Level 1 lie).
- **Simple?** Is the deftest body 3-7 lines, composing only the topmost named helpers? If yes → YES. If 10+ sequential bindings → NO (Level 1 lie). The inherent complexity of the scenario is preserved in the helpers; the deftest body itself stays small.
- **Honest?** Do the named helpers do EXACTLY what their names promise? If `:test::put-one` actually does spawn-then-put-then-tear-down, the name is lying about its scope (Level 1). The function name's contract IS the discipline; verify it matches the body.
- **Good UX?** Can a fresh reader trace top-down with no jumping forward? Does each layer add ONE new thing over the layer above? If a helper at line 50 references a helper defined at line 200 → NO (Level 1: late dependency).

The four questions MUST run in order. Obvious + Simple + Honest must all hold before Good UX matters. A test that hides its diagnostic surface is broken regardless of how readable it might be.

## What complectēns sees

> Code examples below are transcribed from the wat-rs substrate where this discipline matured. The syntax is wat-rs-specific (`defn`, `deftest`, `let` with vector bindings `[name val name val]`, `Thread/join-result`, `pool/finish`, channel-pair patterns); translate to your substrate's equivalent verbs. The DISCIPLINE — top-down dependency, named layers, per-layer proof, short deftest body — applies regardless of host language.

### Monolithic deftests — the load-bearing violation

A deftest body with > ~10 let bindings is making a structural claim it cannot support. When such a test fails, the panic message gives you NO narrowing surface. "expected X, actual Y" — the bug could be in any of 30 anonymous bindings.

Empirical bound: a deftest body with more than ~10 sequential bindings is a Level 1 lie. It claims to test a scenario but cannot diagnose which unit of work failed.

```clojure
;; ❌ Level 1 lie — monolithic. When it fails, what broke?
(deftest test-cache-round-trip
  (let [spawn       ...
        pool        ...
        driver      ...
        handle      ...
        reply-pair  ...
        reply-tx    ...
        reply-rx    ...
        ack-pair    ...
        ack-tx      ...
        ack-rx      ...
        _put        ...
        results     ...
        _join       ...]
    (assert-eq ...)))
```

Anonymous sequential bindings are the lie. Every binding is a name that pretends something exists when actually nothing named does. The let has erased the diagnostic surface.

### Helpers without their own deftests — a Level 2 mumble

Each named helper above the final test should have its own deftest proving it in isolation. Without per-helper deftests, the discipline degrades to "named factoring" without the proof tree. Failure trace can't bisect the layers.

```clojure
;; ❌ Level 2 mumble — helpers exist but no deftests for them.
(defn :test::send-one-put [...] ...)    ; helper, but never tested alone
(defn :test::send-one-get [...] ...)    ; helper, but never tested alone
(defn :test::put-then-get [...] ...)    ; composes; never tested alone

(deftest :final-test                    ; only this is proven
  (test::put-then-get ...))
```

When `final-test` fails, you cannot tell whether `put`, `get`, or the composition broke. The proof tree is missing.

### Multi-file stepping stones — a Level 2 mumble

Splitting incremental complexity across many files (a "step-A.wat, step-B.wat, ..., step-E.wat" family) violates the "one file" rule. The reader file-hops to follow the dependency graph. The reader of a stepping-stone family wants ONE document, top-down, where each layer's existence is visible at a glance.

The user's framing (verbatim): *"i dislike that the proof does this across many files... it should be one files with incremental complexity.... its a linear - top down - dependency graph."*

Layered helpers + per-layer deftests + the final scenario all in one file. File-hopping defeats the diagnosability the discipline is supposed to deliver.

### Late dependency — a Level 1 lie

Test files MUST read top-down. A helper at line 200 referencing a helper at line 400 is the file lying about its dependency direction. The reader can no longer trust top-down comprehension; they must scan forward AND backward.

```clojure
;; ❌ Level 1 lie — line N defines a helper that calls one defined at line N+M.

(defn :test::layer-1-helper [...]    ; line 50
  (:test::layer-2-helper ...))       ; references something defined LATER

(defn :test::layer-2-helper [...]    ; line 200
  ...)
```

The dependency graph must run upward only. Earlier defines compose into later defines, never the reverse.

### Anonymous accidental complexity — Level 2 mumble

A scenario has irreducible inherent complexity (must spawn, must pop, must send, must recv, must drop, must join). Anonymous bindings preserve that complexity but extract the diagnostic surface — every binding is "_finish", "_join", "_put", "spawn", "pair". When something fails, NONE of these names tell you what step in the scenario actually broke.

The fix: extract the composed sequence into a NAMED helper, with a NAMED deftest. The complexity moves into the helper's body where it's bounded and inspectable; the deftest body becomes 3-7 lines of named composition. The four questions all answer YES.

## How to cast

The spell runs in two phases:

### Phase 1 — mechanical survey

Find candidates programmatically. **Any scan tool is acceptable** — shell, awk, python, a future native implementation — as long as the survey is reproducible and reports concrete `(file, line, deftest-name, body-line-count)` tuples.

The mechanical pass DOES NOT judge; it only finds candidates.

What to count:

1. **deftest body line count** — paren-balanced extraction from each deftest form. The line count of the body is the proxy for binding count. Empirical thresholds: > 30 lines = suspect; > 50 lines = likely Level 1; > 100 lines = definite Level 1. Sort findings by body line-count descending.
2. **let binding-count per body** — sharper than line count. Count the entries in each top-level let form within a deftest body. > 10 entries → Level 1.
3. **forward references** — for each `define` of a helper, grep for references to helpers NOT yet defined above it in the same file. Any forward reference → Level 1.
4. **file count for stepping-stone families** — find groups of `step-*.wat` / `proof_*.wat` files in the same directory. Multi-file stepping stones → Level 2 candidate (the discipline says ONE file).
5. **helpers without deftests** — for each `define` in a prelude or at file top-level, search for a sibling deftest referencing it. Missing → Level 2 candidate.

Output of phase 1 is a structured findings list: `(file, line, deftest-name OR helper-name, body-line-count, severity-candidate)`.

For host-language integration test files that embed test source as strings, the same rules apply to the embedded scenarios: short string + named helpers in surrounding test files, NOT a 200-line embedded let.

### Phase 2 — judgment

Read each candidate. Apply the four questions. Distinguish:

- A 30-line deftest body might be inherently complex (e.g., a long match expression on a complex enum) and NOT a Level 1 lie. The line count is a candidate flag, not a verdict.
- A helper without a sibling deftest might be a single-use detail that doesn't need its own proof (e.g., a thin wrapper used in exactly one place). Level 3 taste.
- A forward reference might be a macro auto-recursion. Not a real violation.

Phase 2 is where the judgment happens: applying the four questions to actual code requires reading the bindings' semantics, not just counting them.

### Why two phases

The mechanical pass is reproducible: any agent re-running it finds the same candidates. The judgment pass is where the four-questions converge — applied to actual semantics, not to counts.

## Edge cases

Worked examples surfaced during cache-service calibration in the wat-rs substrate where this discipline matured. They illustrate the boundary conditions every practitioner hits in a concurrency-aware typed substrate; the SHAPES generalize to other substrates with similar invariants (deadlock-aware walkers, pool-accounting, mixed pass/panic outcomes).

### Mixed-outcome files — the two-prelude pattern

A test file can mix deftests that PASS cleanly with deftests that `:should-panic`. The naïve approach — ONE prelude that includes ALL helpers — makes EVERY deftest in the file fire whatever check the prelude triggers. Pass-intended tests regress to panic outcomes; panic-intended tests keep firing.

The fix: TWO prelude factories in the same file. One per outcome class.

```clojure
;; Factory 1 — Layer 0 helpers; pure lifecycle; no channel-pair patterns; clean pass.
(make-deftest :deftest-hermetic
  [(defn :test::layer-0a [...] ...)   ;; spawn + drop + join
   (defn :test::layer-0b [...] ...)]) ;; receive a value end-to-end

;; Factory 2 — Layer 1+ helpers; service-aware; includes channel-pair patterns
;; that trigger the deadlock walker at freeze; all deftests using this prelude :should-panic.
(make-deftest :deftest-service
  [(defn :test::layer-1-put [...] ...)         ;; helper-verb call site
   (defn :test::layer-1-get [...] ...)
   (defn :test::layer-2-put-then-get [...] ...)])

;; Clean-pass deftests use factory 1.
(:deftest-hermetic :test::test-layer-0a (:test::layer-0a))

;; Should-panic deftests use factory 2.
(should-panic "channel-pair-deadlock")
(:deftest-service :test::test-layer-1-put (:test::layer-1-put))
```

The two-prelude split is a one-file solution to the mixed-outcome constraint. Same discipline; just two namespaces of helpers within the same file.

### Cross-function tracing — DO NOT factor channel-allocation into a helper

When the consumer has a walker that traces channel arguments back through `(first pair)` / `(second pair)` chains to a `make-channel` anchor, **the trace stops at function-call boundaries.** Factoring channel allocation + the first/second projections into a helper that returns the (Sender, Receiver) tuple SILENCES the check — the same code shape that fires the walker inline does NOT fire when wrapped.

```clojure
;; ❌ Tempting: clean abstraction. But the walker stops tracing here;
;; if a deadlock pattern existed inline, it's hidden now.
(defn :test::make-ack-channel
  [] -> :(AckTx, AckRx)
  (let [pair (make-bounded-channel :unit 1)]
    (Tuple (first pair) (second pair))))

;; ✓ Correct: keep the channel-allocation + first/second sequence INLINE in the
;; helper that uses both halves. The walker's trace can follow the chain.
(defn :test::send-put-with-ack
  [req-tx <- :ReqTx
   k      <- :K
   v      <- :V] -> :unit
  (let [ack-pair (make-bounded-channel :unit 1)
        ack-tx   (first ack-pair)
        ack-rx   (second ack-pair)
        _put     (put req-tx ack-tx ack-rx ...)]
    ()))
```

When extracting helpers, leave channel allocations IN the helper that calls the helper-verb. Don't abstract the channel-allocation into its own function — abstract the WHOLE workload (allocate + call + drop) instead.

### Pool-style services require pop-before-finish

A lifecycle helper that demonstrates spawn-and-shutdown without doing any actual work must STILL pop a handle from the pool before calling `pool/finish` (when the consumer's substrate enforces pool-accounting). The runtime check raises "orphaned handles" if the pool is finished with un-popped slots. The lifecycle helper:

```clojure
(defn :test::lifecycle-spawn-and-shutdown
  [] -> :unit
  (let [driver  (let [spawn   (svc/spawn 1 ...)
                      pool    (first spawn)
                      d       (second spawn)
                      req-tx  (pool/pop pool)        ;; ← required
                      _finish (pool/finish pool)]
                  d)
        _join   (Thread/join-result driver)]
    ()))
```

The pop-then-drop pattern is the standard form even when no work happens — the substrate's pool-accounting requires every slot to be visited.

### Non-unit Thread output requires recv-before-join

For services where the driver loop sends a final state before returning, the lifecycle helper MUST `recv` from `Thread/output` BEFORE calling `Thread/join-result`. Dropping the receiver before the send completes panics the driver with "out disconnected".

```clojure
(defn :test::svc-spawn-and-shutdown
  [] -> :unit
  (let [driver-and-final
         (let [spawn        (svc/Service 1)
               pool         (first spawn)
               d            (second spawn)
               final-rx     (Thread/output d)
               req-tx       (pool/pop pool)
               _finish      (pool/finish pool)
               _final-state (Option/expect
                              (Result/expect (recv final-rx)
                                "spawn-and-shutdown: thread died before sending final-state")
                              "spawn-and-shutdown: thread output closed without sending")]
           d)
        _join (Thread/join-result driver-and-final)]
    ()))
```

Services whose driver returns the unit type don't have this issue — there's nothing to send. Only services where the spawned function's output type is non-unit need the drain.

### Channel-deadlock walkers fire on CALL SITES, not just channel allocations

The previous edge case warns against factoring channel allocation into a helper. The full picture: walker checks fire on any function-call site that passes both halves of a channel pair as arguments — INCLUDING calls to user-defined helpers whose signatures take both halves.

```clojure
;; ❌ Walker fires HERE — at the call to send-ack-wait — because both
;; ack-tx and ack-rx are passed in the same call.
(defn :test::send-ack-wait
  [req-tx <- :ReqTx
   ack-tx <- :AckTx
   ack-rx <- :AckRx] -> :unit
  ...)

;; In a deftest body or another helper:
(:test::send-ack-wait req-tx ack-tx ack-rx)   ;; ← walker fires here
```

The corollary: do NOT factor a CALL SEQUENCE that uses both halves of a channel pair into a helper that accepts both halves as parameters. Keep `send req-tx ...` and `recv ack-rx` as SEPARATE inline calls in the scenario body. The walker only fires when one CALL passes both halves; separate sequential calls each pass one half.

### Embedded literals — visual line count vs OUTER LOGICAL BINDINGS

Some deftest bodies contain LITERALS that are part of the test's data, not part of its composition logic. These literals are inherently irreducible:

- A test driving an embedded program AST through a forked subprocess — the embedded program can't reference the outer prelude's helpers, so it must be self-contained.
- A cadence's tick fn passed as data to a factory — the fn is data, not composition.
- A dispatcher / translator / reporter fn passed as an argument — the fn is the test fixture, not the test logic.

The mechanical phase's `>30 lines = suspect` heuristic over-flags any deftest containing such literals. Phase-2 judgment counts the **OUTER LOGICAL BINDINGS** of the deftest's let, NOT the total visual line count. A test whose outer let has 5 bindings is well-shaped, even if visual line count is 80+.

When extracting helpers FOR an embedded-literal test, target the OUTER scaffolding:
- Helpers that SETUP the literal (build it from primitive parts).
- Helpers that PROCESS the result (extract stdout/stderr, assert on contents).
- Helpers that COMPOSE multiple invocations (call the scenario, drain the channel, assert).

Helpers that try to share logic INSIDE an embedded program's body, or inside an embedded fn, are not possible without AST quasiquote builders — out of scope for the discipline.

The simpler rule: when one of the deftest's let bindings has an RHS that EVALUATES to data (an AST, a fn, a closure, a struct literal), that RHS is the test's fixture and is exempt from the line-count metric. The OUTER let's binding count remains the proxy for composition complexity.

## The rune

Some deftest bodies are inherently complex by design — the bulk is a fixture, not scaffolding, and refactoring would make the test worse. For these cases, the line gets a **rune** that declares the deftest exempt with a justified reason:

```clojure
(deftest :my::test-with-fixture
  ;; rune:complectens(embedded-program) — outer let has 2 bindings; bulk is embedded-program AST literal (sandboxed subprocess fixture)
  (let [...] ...))
```

Format: `;; rune:complectens(<category>) — <reason>`

**Categories:**

- `embedded-program` — body's bulk is an AST literal running in a sandboxed subprocess; the literal cannot reference outer prelude helpers (sandbox isolation), so extraction is impossible.
- `inline-fixtures` — outer-bindings count is high but the bindings are inline fn/closure literals defining the test's own fixture (e.g., a Mealy step+flush pair). Extracting them to the prelude would lose the file's self-contained definition.
- `proof-stepping-stones` — the body's bindings are deliberate stepping-stone assertions documenting a contract. Collapsing them would destroy the proof structure the file exists to document.
- `assertion-sequence` — tight sequence of related asserts on a single result; helper extraction would obscure the assertion-by-assertion narrative.
- `match-on-state` — long match expression on enum state where each arm tests a different scenario; the match IS the test's structure.

Placement: on the line immediately preceding the deftest body (typically inside the deftest form, before the let, where the host language allows a comment to attach).

The reason field is required. A rune with an empty reason fails the spell — the rune's job is to capture the WHY so the next reader understands the exemption rather than guessing.

When complectens encounters a rune, it skips the deftest and records the exemption in its report.

## The principle behind the spell

The test file is a top-down dependency graph in ONE file. Each function does ONE thing. Each layer composes from layers above. Each layer carries its own deftest. The final deftest body is short BECAUSE the layers exist. The failure trace IS the dependency graph. When the test fails, the broken layer's name is the diagnostic.

A test that one-shots a hard problem is a discipline violation. Complectens finds where the weave fell apart.
