# Maintaining the grimoire

This repo is the **content + trust channel** for the datamancy MCP. The
[`README`](README.md) tells a *practitioner* how to **cast** a spell; this
document tells a *maintainer* how to **publish** one.

## The mental model: living content, frozen kernel

There are two artifacts, and they version independently:

| Artifact | What it is | When it changes |
|---|---|---|
| **this repo** (`datamancy.dev`) | the spells (markdown) + the signed manifest | every time you edit/add/remove a spell |
| **the [`datamancy`](https://www.npmjs.com/package/datamancy) npm package** | the frozen kernel that fetches + verifies | **almost never** — only for kernel *code* changes |

Editing a spell here does **not** require an npm release. You re-sign the
manifest and push; every live consumer picks it up on its next fetch and
verifies it against the public key already pinned in their installed package.
**The website is the content.** The npm package is the trust anchor, and a
`1.x` anchor never moves. (See the package's
[CONTRACT.md](https://github.com/watmin/datamancy/blob/main/CONTRACT.md) for the
exact line between "edit freely" and "needs a new major.")

## Add or edit a spell

1. **Write the discipline.** Create `<name>/SKILL.md` (or edit an existing one).
   A spell is one focused discipline; see the README for the form.
2. **Name it honestly.** Latin, after the typology: an *act* is an infinitive
   (`perspicere`), an *agent* a present participle (`complectens`), a *thing* a
   noun (`mora`). Run the four-questions on the name — ideally **cast `intueri`**
   on it — before it lands. The grimoire is open and unnumbered; names are
   etymological, never positional.
3. **Do not hand-edit `grimoire/SKILL.md`.** The index is **generated** from
   every spell's frontmatter by `scripts/generate-grimoire-skill.mjs`. Edit the
   spell's own `description`; the index regenerates on publish.
4. **Editing an already-warded spell? Commit the edit first.** `ledger:check` marks a
   vouched path changed when it is merely *dirty in the worktree*, so a spell that
   carries a live ledger row and is edited in place aborts `ship` before it can
   publish. Commit the content change, re-cast the watch, re-stamp or strike the row
   citing that commit, then `npm run ship`.
5. **Ward it before it ships — trial by combat.** A new spell earns its place by
   surviving the grimoire's own guard: cast the full applicable `vigilia` against
   it (for a spell page that is `nesciens` + `cohaerere` + `exigere`, with
   **`circumspicere` last**), embed each ward by value, use fresh subagents, and
   fight every finding under the rune rule until there is **no un-dispositioned
   L1 or L2**. Then append a row to [`docs/WARDING-LEDGER.md`](docs/WARDING-LEDGER.md)
   recording the target, the ISO8601 UTC stamp, the method, the result and the
   commit. The ledger's own gate (`npm run ledger:check` — run by
   `check:docs`, and by `ship` after all content is regenerated and before it is
   signed) verifies that every **vouched path** is unchanged
   since its stamp — it cannot see a spell that has **no row at all**, so this
   step is held by discipline and by this paragraph, not by the build.

## Publish: `npm run ship`

One command does the whole ceremony, fail-closed — every gate must pass before
the next, so a manifest that can't be verified against the pinned key never
reaches a `git push`.

```bash
aws sso login --sso-session datamancy     # one-time per session — see "Trust" below
npm run ship                              # publish
npm run ship -- "fix grimoire Trust line" # publish with a commit/tag annotation
```

What it runs, in order:

| Step | Gate it enforces |
|---|---|
| `aws sts get-caller-identity` | aborts if there is no signing session |
| `npm run docs:regen` | the generated indexes are rebuilt from spell frontmatter — the single source |
| `generate-manifest` → `generate-agent-ready` | the manifest and the discovery files are rebuilt from that tree |
| **`npm run claims:check`** | every shipped verification claim must name who verifies. Runs **after all generation** (the discovery files carry claims) and **before signing**, because a false claim in signed content cannot be retracted from a consumer that already fetched it |
| `npm run ledger:check` | a warding-ledger row whose vouched paths moved since its stamp aborts here, before anything is signed |
| **KMS sign** | the manifest is signed and archived to `manifests/<hash>/` |
| **`npm run manifest:check`** | the freshly-signed manifest must describe this tree — a spell on disk and not in the manifest would 404 while the indexes advertise it |
| fetch the KMS public key → assert fingerprint `09db7668…` | the signing key **is** the one consumers pin — a key swap / wrong alias aborts here |
| **verify the fresh signature against that key** | an unverifiable manifest is never committed |
| `git add .` → stray/cruft gate | a `.rej`/`.orig`/`.bak`/`.patch`/`.tmp`/`node_modules` file staged into a signed push aborts, naming the offender |
| orphan-snapshot gate | only *this* publish's `manifests/<hash>/` may be staged — a leftover dry-run snapshot cannot ride the push |
| `git commit` + `tag <version>` + `git push --follow-tags` | only after every gate above passes |
| poll the live origin until it serves the new hash | catches a failed Cloudflare deploy |
| **re-verify the *served* bytes** against the pinned key, then spot-check one blob + one spell body | proves what the world actually gets verifies too — and that the *content*, not just the manifest, landed |

> **The dry run signs, and leaves something behind.** `DATAMANCY_NO_PUSH=1 npm run ship`
> runs every gate above through the signature check and stops before the commit — but
> it *does* mint a real KMS signature and archive `manifests/<hash>/`. `epoch` is
> wall-clock, so the next run's manifest hashes differently and that snapshot becomes
> an orphan: `git add .` stages it, the orphan gate refuses, and the refusal lands
> **after** the next signature. **`rm -rf manifests/<the-dry-run-hash>` before you
> ship** — the dry run prints the exact command. The same applies to any abort after
> the signing step.

Dry-run everything up to (but not including) the push:

```bash
DATAMANCY_NO_PUSH=1 npm run ship          # all local gates, no commit/push
```

Overridable via env: `DATAMANCY_AWS_PROFILE` (default `datamancy-signer`),
`DATAMANCY_KMS_KEY`, `DATAMANCY_KMS_REGION`, `DATAMANCY_ORIGIN`.

### Infra commits vs published content

`npm run ship` is for changes to **signed content** — a spell's `SKILL.md` and the
generated indexes that hash into the manifest. Site **infra** that is not signed
content — the routing (`functions/_middleware.js`, `_headers`, `_redirects`,
`404.html`), the hand-authored prose in `llms.txt`, this file — is committed to
`main` directly and deployed by Cloudflare on push; it never re-signs the manifest.
One visible consequence: `manifest.serverInfo.commit` is the commit at the last
**content publish**, not deployed `HEAD`. It is provenance for the signed bytes
(what it covers), not a deploy pointer — a run of infra-only commits sitting ahead
of it is correct, not drift.

### The lower-level scripts

`npm run ship` orchestrates these; reach for them only to debug a single stage:

| Script | Does |
|---|---|
| `npm run ledger:check` | verify every warding-ledger row's vouched paths are unchanged since its stamp |
| `npm run grimoire:regen` | regenerate `grimoire/SKILL.md` from spell frontmatter |
| `npm run manifest:generate` | rebuild `.well-known/mcp/manifest.json` + content-addressed blobs |
| `npm run manifest:sign` | sign the manifest via KMS → `manifest.json.sig` + content-addressed snapshot |
| `npm run manifest:check` | assert the signed manifest describes the tree on disk (run by `ship` after signing, and by CI on a pushed commit — **not** by `check:docs`, where a tree mid-authoring is legitimately ahead) |
| `npm run manifest:publish` | regen → generate → agent-ready → sign, chained (no verify gate, no push — prefer `ship`) |
| `npm run claims:check` | every shipped verification claim must name who verifies (a ratchet over known phrasings — its docblock states its reach) |
| `npm run check:docs` | the drift gate CI runs: claims + ledger + all five generators in `--check` mode |
| `npm test` | the unit suite — middleware routing, and the pinned-fingerprint agreement check |

## Trust — why signing is manual, by design

The private key lives **non-exportably in AWS KMS** (`alias/datamancy-signing`,
`us-west-2`). It never touches a disk; every signature is logged in CloudTrail.
That is the whole security model: the bytes can be hosted anywhere, but only a
holder of the KMS signing session can mint a manifest consumers will accept.
Signing is therefore a deliberate human-gated step — it is not, and must not be,
automated into CI.

The matching **public** key is pinned in the npm package and cross-published in
three independent channels; its fingerprint is the constant the `ship` gate
asserts against:

```
09db7668a3a0ea27c52de060081c0a70584181c02f9eb94eff6941f904b5f12e
```
- npm package source — `datamancy/src/pinned-pubkey.ts`
- the practitioner card at [datamancer.dev](https://datamancer.dev)
- DNS: `dig +short TXT _datamancy-key.datamancer.dev`

## What you must NOT change without a new major

The frozen kernel tolerates an enormous range of content evolution — but a
handful of shapes are load-bearing and breaking them bricks every installed
`1.x` consumer (they can never be patched). The authoritative list is the
package's
**[CONTRACT.md](https://github.com/watmin/datamancy/blob/main/CONTRACT.md)** (the
"MUST NEVER change under schemaVersion 1" section). In short: the signature
scheme, the manifest's required shapes, UTF-8 text bodies, the well-known paths,
and direct (no-redirect) serving are frozen. A genuine break is signalled by
bumping `schemaVersion` **and** minting a new package major — never an in-place
patch.

If the **signing key is ever lost or compromised**, that too is a new major (the
major version *is* the key generation). The runbook is the package's
[RECOVERY.md](https://github.com/watmin/datamancy/blob/main/RECOVERY.md).
