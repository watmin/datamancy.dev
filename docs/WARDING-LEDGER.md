# Warding ledger — what's warded, when, and how to re-prove it

The record of which files in this repo have been **warded** (run through a full
`vigilia` cast and converged), and when. It lives **here, not as an in-code
stamp** — a stamp comment can go false while the build stays green (arc-250's
lesson), so the proof points at git + a re-castable measurement instead of
sitting silently in the file it claims.

**A row is a claim, not a permanent guarantee.** It says "warded as of this
measurement." Drift after the stamp is caught by *re-running the watch*, never by
trusting the row. "Warded" here = the failure **class** annihilated (ideally by
construction), **0 L1**, and every
L2 **fought** — fixed, or runed only for not-cleanly-solvable / perf-cost, or
grounded-invalid. The green check is not the bar; the disposition is.

| Target | Warded (ISO8601 UTC) | Method | Result | Commit |
|---|---|---|---|---|
| `scripts/lib/spells.mjs`, `scripts/generate-vigilia-skill.mjs` | `2026-06-05T11-18-37Z` | full `vigilia` ×3 (8 universal code wards + `nesciens` on the generated doc + `circumspicere` last), under the rune termination rule | **0 L1**; 5 L2 dispositioned (3 fixed, 2 grounded-invalid — `agent-ready` is manifest-derived, the asymmetry is necessary); no runes needed | `0da95bb` |
| `cohaerere/SKILL.md` (new spell — admission trial by combat) | `2026-06-26T21-30-56Z` | full applicable `vigilia` (docs-kind: `nesciens` + `cohaerere`-on-itself + `exigere`, `circumspicere` last), embedded by value, fresh subagents, 3 combat rounds under the rune rule | **0 L1**; the dogfood drove the spell from 2 finding-shapes → 3 (added **assertion-clash**, the most common kind), generalized the incompatibility demonstration (verdict-flip / meaning-shift / absent-governing-definition / both-cannot-hold), stated the document boundary, and armed the clash shared-subject phantom; converged — `cohaerere` COHERES + `circumspicere` clean. `nesciens` 0 hard-stumbles; soft-stumbles grounded-invalid (grimoire house-style "rune"/"Level" forward-refs, consistent with conferre/consonare). `exigere` 0. 0 un-dispositioned. | `714de2d` (publish `2026-06-26T22-22-27Z`) |

## Adding a row

1. Ward the target — cast the full applicable `vigilia` (embed each ward, `circumspicere` last), fight every finding under the rune rule, converge to **no un-dispositioned L1/L2**.
2. Append a row: the target path(s), the ISO8601 UTC stamp (`date -u +%Y-%m-%dT%H-%M-%SZ`), the method, the result (L1 count + L2 disposition + any runes), and the commit that landed the fixes.

## Re-proving a row

A row holds only as long as a fresh `vigilia` cast still measures it warded.
Re-cast on touch (or on demand); if it diverges, the row is stale — fix and
re-stamp, or strike the row. The ledger is the trail; the cast is the proof.
