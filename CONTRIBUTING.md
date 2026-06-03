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
| regen index → regen manifest → **KMS sign** | the three scripts, chained |
| fetch the KMS public key → assert fingerprint `09db7668…` | the signing key **is** the one consumers pin — a key swap / wrong alias aborts here |
| **verify the fresh signature against that key** | an unverifiable manifest is never committed |
| `git commit` + `tag <version>` + `git push --follow-tags` | only after both gates pass |
| poll the live origin until it serves the new hash | catches a failed Cloudflare deploy |
| **re-verify the *served* bytes** against the pinned key | proves what the world actually gets verifies too |

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
| `npm run grimoire:regen` | regenerate `grimoire/SKILL.md` from spell frontmatter |
| `npm run manifest:generate` | rebuild `.well-known/mcp/manifest.json` + content-addressed blobs |
| `npm run manifest:sign` | sign the manifest via KMS → `manifest.json.sig` + write-once snapshot |
| `npm run manifest:publish` | the three above, chained (no verify gate, no push — prefer `ship`) |

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
