---
name: circumspicere
form: act
category: fidelity
reading: to look around — runtime defaults, shipped claims, the blind spot every inward lens turns its back on
description: Look around. The datamancer circumspicere — steps back from the code the other spells look INTO and surveys what surrounds it: the runtime's default behaviour, the attack surface, the shipped claims, and the blind spot every inward lens turns its back on. Cast last; finds what the guard walked past.
argument-hint: [artifact path or directory]
vigilia-slot: perimeter
vigilia-order: 1
vigilia-concern: The surround — egress, attack surface, claims-vs-code, negative space
---

# Circumspicere

> *circum-* (around) + *specere* (to look) → to look around, on all sides. The sibling of perspicere: `per-` looks THROUGH the code; `circum-` looks AROUND it.

> The inward wards look in. What they miss stands behind them.

Every defensive spell in the grimoire looks **into** the code, each through one lens — intueri at the names, struere at the craft, probare at the substance, secare at the races. Circumspicere is the spell that turns around. It is cast **last**, after the inward guard has reported, because its quarry is precisely what the inward gazes leave uncovered: the surround.

The practitioner casts circumspicere when the question is not "is this code correct?" but "**what is true about this artifact that no lens examined?**"

## The principle

The inward spells converge on the lines that exist. Circumspicere hunts the gap between what the artifact **does**, **claims**, and **depends on** — and what the inward guard actually checked. Four surfaces the inward gazes turn their backs on:

1. **Egress / default behaviour** — what the code DOES by a primitive's defaults, not what any line says. No line is "wrong," yet the artifact behaves in a way no one chose.
2. **Claims vs code** — a sentence the artifact SHIPS (README, CONTRACT, a security table) that the code does not actually enforce.
3. **Unenforced invariants** — a value the entire design leans on that no test and no build asserts.
4. **Negative space** — a surface, path, or failure-class that NO inward spell examined at all.

Circumspicere's quarry is the distance between the artifact's *promises and posture* and its *checked behaviour*.

## Why it is cast last

Circumspicere needs to know what the others covered, because its target is the complement: the uncovered. Cast first, it would re-walk ground the inward lenses own. Cast last — inside vigilia, after the inward wards report — it surveys the perimeter they left. The day it finds nothing is the day the artifact's claims and its code finally describe the same thing.

## What circumspicere flags

Each facet, with the worked example from the assault that birthed the spell — a full-grimoire cast where all the inward spells found only cosmetics and missed every one of these:

1. **Default-behaviour egress** — a primitive used at its defaults whose default reaches outward.
   *Worked: every `fetch()` used the runtime's default `redirect: "follow"`. No line is wrong — yet a hosting-only attacker's `302` makes the kernel emit an attacker-chosen outbound request (SSRF) before any verification runs. The flaw lived in the defaults, not the logic; the fix was one option: `redirect: "error"`.*

2. **A claim the code does not enforce** — a shipped sentence the artifact cannot back.
   *Worked: the README "what this defeats" table asserted a hosting-only compromise "reaches consumers: No." True for content injection; false for request egress. The claim outran the code — and a never-patched artifact can never retract a false claim.*

3. **An unenforced load-bearing invariant** — a value the trust story rests on that nothing asserts.
   *Worked: the entire trust-on-first-use story rests on the pinned key matching its published fingerprint. It matched — by hand. No test, no build step enforced it; a freeze-time transcription slip would have shipped a self-inconsistent trust root forever. A six-line test turns the typo into a red build.*

4. **Negative space / uncovered surface** — a path or failure-class no inward spell examined.
   *Worked: the CLI/process glue had zero tests; the version-chain walk was unbounded while its sibling capped at 50.*

## What circumspicere does NOT flag

- **The correctness of code the inward spells already own.** Circumspicere is not a re-run of intueri or struere or probare. If a finding is "this line is wrong," it belongs to the spell whose concern that is. Circumspicere only sees the surround.
- **A surface or claim deliberately bounded and documented as such** — IF the bound is honest and present (see the rune). An accepted-by-design limit stated plainly in the shipped docs is not a blind spot; it is a chosen edge.
- Lines or claims marked with `rune:circumspicere(<category>) — <reason>`.

## The rune

For a surface or claim left open **on purpose**, honestly bounded. The rune's burden is heavier here than in any inward spell: it must name **where the bound is documented**, because an undocumented "it's fine" rune IS the very blind spot circumspicere exists to catch.

**Categories:**

- `accepted-by-design` — the limit is real, stated in the shipped docs, and the four-questions justify it (e.g. rollback protection that is in-session-only by design).
- `out-of-threat-model` — the surface lies outside the artifact's stated threat model, and the threat model says so.
- `enforced-elsewhere` — the invariant IS asserted, at a site the rune names.

Format: `rune:circumspicere(<category>) — <reason; and WHERE the bound is documented>`

A rune whose reason does not point at a shipped, honest statement of the bound fails the spell.

## The four questions applied

- **Obvious?** Does a consumer reading the shipped claims meet the same artifact the code is? A claim the code doesn't honour fails here.
- **Simple?** Is the open surface a default that closes in one line (`redirect: "error"`), or an inherent cost? One-line closures are gaps to fix; inherent costs are runes to document.
- **Honest?** Does any shipped sentence promise more than the code enforces? That is the dishonesty circumspicere exists to catch.
- **Good UX?** Does the artifact's default behaviour do something the operator would not expect and could not see — a silent outbound request, an unverifiable key?

## Reporting format

For each finding:

- The surround it lives in (egress / claim / invariant / negative-space)
- Location — the code site AND, for a claim-vs-code finding, the doc site it contradicts (these findings carry two coordinates)
- What the inward guard saw here (usually nothing — that is the point)
- Severity (the grimoire scale), with one escalation: a finding that **contradicts a shipped claim** ranks highest, because a never-patched artifact cannot take the claim back
- The closure — the one-line default, the missing assertion, or the bound to document

## The principle behind the spell

To know what you do not see, you do not look harder — you turn around. Every inward lens faces the code; the artifact's blind spots stand behind them, in the surround they all share. Circumspicere is the turn. It is cast last and it is cast once, and it earns its place the day it keeps a flaw the inward wards could not see out of something you can never patch.
