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
| `cohaerere/SKILL.md` (new spell — admission trial by combat) | `2026-06-26T21-30-56Z` | full applicable `vigilia` (docs-kind: `nesciens` + `cohaerere`-on-itself + `exigere`, `circumspicere` last), embedded by value, fresh subagents, 3 combat rounds under the rune rule | **0 L1**; the dogfood drove the spell from 2 finding-shapes → 3 (added **assertion-clash**, the most common kind), generalized the incompatibility demonstration (verdict-flip / meaning-shift / absent-governing-definition / both-cannot-hold), stated the document boundary, and armed the clash shared-subject phantom; converged — `cohaerere` COHERES + `circumspicere` clean. `nesciens` 0 hard-stumbles; soft-stumbles grounded-invalid (grimoire house-style "rune"/"Level" forward-refs, consistent with conferre/consonare). `exigere` 0. 0 un-dispositioned. | `714de2d` (publish `2026-06-26T22-22-27Z`) |
| `partire/SKILL.md` (new spell — admission trial by combat) | `2026-06-27T23-31-55Z` | full applicable `vigilia` (docs-kind: `nesciens` + `cohaerere`-on-itself + `exigere`; `intueri` on the name; the **dogfood** `partire`-on-itself; `circumspicere` last), embedded by value, fresh subagents, 3 combat rounds under the rune rule | **0 L1**; the combat forged the spell — it had implied **solvere was a hard prerequisite**, contradicting the two-arm `vigilia-trigger`; `cohaerere` drove out 3 clashes (Level-3 disposition; "fires"/trigger; and a convergence-round **L1**: the LEAVE Reporting-format template hadn't inherited the conditional solvere-corroboration) → demoted solvere to one of two honest arms → COHERES. Also defined the load-bearing terms "concern graph"/"braiding", added the **module-boundary** clause (mirroring `cohaerere`'s own precedent), named the generated-file marker. **dogfood** (`partire`-on-`partire`) → **LEAVE**: one coherent ward, not two fused. `nesciens` converges (0 hard); `exigere` 0; `intueri` — name SPEAKS, distinct from `secare`/`solvere`. Grounded-invalid (no change, verified vs corpus): the two `## The principle…` headings (grimoire house form), the rune-encounter protocol (README's global rune convention). `circumspicere` read the generator + confirmed the published trigger; clean. 0 un-dispositioned. | `7f7cea0` (publish `2026-06-27T23-31-01Z`) |


## Struck rows

A struck row is one whose vouched paths changed after its stamp and which has
**not** been re-cast. Per *Re-proving a row*, the honest dispositions are re-stamp
or strike; these are struck rather than re-stamped because no full `vigilia` was
cast on them since the change. They are kept here as history, not as a claim.

- **`scripts/lib/spells.mjs`, `scripts/generate-vigilia-skill.mjs`** — struck `2026-08-28`.
  Stamped `2026-06-05T11-18-37Z` (`0da95bb`). `spells.mjs` gained the frontmatter
  name-vs-directory gate during the `experiri` landing; `generate-vigilia-skill.mjs`
  changed at `af00e81`. Original row kept below.
- **`grimoire/SKILL.md` + `scripts/generate-grimoire-skill.mjs`, `extirpare/SKILL.md`** — struck `2026-08-28`.
  Stamped `2026-06-30T07-19-10Z` (`8cb9d0a`). The index gained a `### Runes` section
  during the `experiri` landing — and that section shipped three successive false
  universals before converging, which is precisely why the row could not stand.

<details><summary>Struck rows, verbatim</summary>

| `scripts/lib/spells.mjs`, `scripts/generate-vigilia-skill.mjs` | `2026-06-05T11-18-37Z` | full `vigilia` ×3 (8 universal code wards + `nesciens` on the generated doc + `circumspicere` last), under the rune termination rule | **0 L1**; 5 L2 dispositioned (3 fixed, 2 grounded-invalid — `agent-ready` is manifest-derived, the asymmetry is necessary); no runes needed | `0da95bb` |
| `grimoire/SKILL.md` (the bootloader ethos — via `scripts/generate-grimoire-skill.mjs`) + `extirpare/SKILL.md` (catalog-surfaced description) | `2026-06-30T07-19-10Z` | full applicable `vigilia` (docs-kind: `nesciens` + `cohaerere` + `exigere`; `circumspicere` last), embedded by value, fresh subagents, **6 combat rounds** under the rune/disposition rule | **0 L1** — `circumspicere`'s Round-1 L1 (the ethos pointing constraint engineering *"in full: `extirpare`"* when extirpare held only the shared *ladder*, not the forward discipline) **FIXED**: softened to claim the ladder only, the forward discipline housed in the ethos itself; re-verified RESOLVED at close (extirpare's three rungs are direction-neutral; the catalog promises no spell the disk lacks). The combat forged the change far past the original edit: encoded **failure + constraint engineering** as the paired first-load disciplines, then drove a *spreading* **cast-class** root-fix — `cast` reserved for the ward-spawn act across **6 sites** (Principle 5, How-to-cast, the blockquote, the intro, the install line, the anti-pattern), `extirpare` *"each spell"*→*"each **atomic** ward"*, the catalog pointer + header corrected; **declared + tagged the meta-spell** (`vigilia`, `vigilia-slot: aggregator`) so the taxonomy (`primer \| ward`; atomic-vs-meta) is complete by construction; `MCP` expanded, datamancer/spell glossed, a Principle-2 → four-questions forward-pointer added. Converged: `cohaerere` **COHERES**, `nesciens` 0-hard (1 soft grounded), `exigere` **0/0 ×6**, `circumspicere` surround clean on all 4 facets (catalog↔disk↔manifest **1:1**; Trust claims backed in `sign-manifest.mjs`/`publish.mjs`/the pinned KMS fingerprint). **Grounded-invalid (2):** the line-8 blockquote MCP/subject density (`rune:nesciens(advanced-audience)`-shaped — MCP-native audience, the bootloader's subject + signed-fetch posture belong up front; stable across all 6 rounds, nesciens-LOW); constraint engineering's no-dedicated-spell (`rune:circumspicere(accepted-by-design)` — the derivable dual over a shared ladder, the ethos its declared home, per the builder's *"encode in the grimoire"* directive). 0 un-dispositioned. **PUBLISHED** `2026-06-30T08-34-32Z` — manifest head `sha256:68a2f13b…`; KMS-signed, fingerprint-verified against the pinned trust root, live-served bytes re-verified; every consumer auto-updates on next fetch. | `8cb9d0a` (publish `2026-06-30T08-34-32Z`) |

</details>

## Adding a row

1. Ward the target — cast the full applicable `vigilia` (embed each ward, `circumspicere` last), fight every finding under the rune rule, converge to **no un-dispositioned L1/L2**.
2. Append a row: the target path(s), the ISO8601 UTC stamp (`date -u +%Y-%m-%dT%H-%M-%SZ`), the method, the result (L1 count + L2 disposition + any runes), and the commit that landed the fixes.

## Re-proving a row

A row holds only as long as a fresh `vigilia` cast still measures it warded.
Re-cast on touch (or on demand); if it diverges, the row is stale — fix and
re-stamp, or strike the row. The ledger is the trail; the cast is the proof.
