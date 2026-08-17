# auth.md — datamancy.dev

> This site has no agent registration system: no accounts, no credentials, no
> tokens. It serves the datamancy grimoire as raw, cryptographically verifiable
> markdown. The document exists to signal "no auth" explicitly — same doctrine as
> the companion [oauth-authorization-server](/.well-known/oauth-authorization-server)
> and [oauth-protected-resource](/.well-known/oauth-protected-resource) — rather
> than rely on a missing file to imply it.

## Audience

Agents and humans loading the datamancy grimoire at `https://datamancy.dev` —
Latin-named defensive spells, each a `SKILL.md` an LLM subagent casts against a
target. Nothing on this site is gated.

## Registration

**None required.** There is no register endpoint, no provisioning flow, no
account creation. Agents access content with anonymous GET requests; the same
`curl` you'd use against any static page is sufficient.

## Supported methods

| identity type | credential | flow |
|---|---|---|
| `anonymous` | *(none)* | unauthenticated GET against any URL |

The same `anonymous` identity type is advertised in
[`/.well-known/oauth-authorization-server`](/.well-known/oauth-authorization-server)
under `agent_auth.identity_types_supported`.

## Credentials issued

**None.** No API keys, no access tokens, no bearer credentials. Nothing to claim.
Nothing to revoke.

## Integrity, not authentication

The grimoire's security model is **content integrity**, not access control. The
MCP manifest at [`/.well-known/mcp/manifest.json`](/.well-known/mcp/manifest.json)
is **ECDSA P-256 signed**, and each spell's SHA-256 is verifiable against it. The
[`datamancy`](https://www.npmjs.com/package/datamancy) npm adapter (`npx -y
datamancy@^1.1.0`) pins the public key and refuses any spell whose hash or signature
fails. So the question this site answers is not *"who are you?"* but *"are these
the bytes the datamancer signed?"* — verifiably yes, or refused.

## Why this file exists

The Cloudflare *isitagentready* checker expects an `auth.md` companion to OAuth
metadata, even when the operational answer is "no auth." Following the same
discipline as the site's other `.well-known` documents, this file is **explicit
rather than absent** — structurally empty, not accidentally missing.

## Pointers

- **Agent map:** [/llms.txt](https://datamancy.dev/llms.txt)
- **Grimoire index:** [/grimoire/SKILL.md](https://datamancy.dev/grimoire/SKILL.md)
- **Signed MCP manifest:** [/.well-known/mcp/manifest.json](https://datamancy.dev/.well-known/mcp/manifest.json)
- **Agent Skills index:** [/.well-known/agent-skills/index.json](https://datamancy.dev/.well-known/agent-skills/index.json)
- **MCP server card:** [/.well-known/mcp/server-card.json](https://datamancy.dev/.well-known/mcp/server-card.json)
- **npm adapter:** [npmjs.com/package/datamancy](https://www.npmjs.com/package/datamancy)
- **Practitioner:** [datamancer.dev](https://datamancer.dev)
