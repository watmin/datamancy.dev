// WebMCP registration for datamancy.dev
// https://webmachinelearning.github.io/webmcp/
//
// Exposes three tools to in-browser AI agents:
//   - getGrimoireIndex: the grimoire index markdown (the spell catalog)
//   - listAgentSkills:  the parsed /.well-known/agent-skills/index.json
//   - getMcpManifest:   the signed MCP manifest (the source of truth)
//
// Each tool feature-detects the WebMCP API; if `navigator.modelContext` is
// absent (every browser without the experimental flag, today), the script
// silently no-ops. No exceptions thrown, no console noise.
//
// SCOPE: these tools return what the origin serves, UNVERIFIED — including
// getGrimoireIndex, which hands /grimoire/SKILL.md to a model as raw bytes. The
// SHA-256 + ECDSA verification is performed by the `datamancy` npm adapter, which
// pins the public key; a page cannot meaningfully pin a key against its own
// origin. Shipped sentences that claim verification are required to name who
// verifies; `scripts/check-shipped-claims.mjs` is the ratchet, and its docblock
// states exactly which phrasings it can see.
// Fetches use `redirect: "error"` so a hosting-only 302 cannot redirect a tool
// call outward, matching scripts/publish.mjs.

(function () {
  if (typeof navigator === "undefined") return;
  if (!navigator.modelContext) return;
  if (typeof navigator.modelContext.provideContext !== "function") return;

  const fetchText = async (url, accept) => {
    try {
      const r = await fetch(url, { redirect: "error", ...(accept ? { headers: { Accept: accept } } : {}) });
      if (!r.ok) return { error: `HTTP ${r.status}`, url };
      return { contentType: r.headers.get("content-type"), content: await r.text(), url };
    } catch (err) {
      return { error: err.message, url };
    }
  };
  const fetchJson = async (url) => {
    try {
      const r = await fetch(url, { redirect: "error" });
      if (!r.ok) return { error: `HTTP ${r.status}`, url };
      return await r.json();
    } catch (err) {
      return { error: err.message, url };
    }
  };

  navigator.modelContext.provideContext({
    tools: [
      {
        name: "getGrimoireIndex",
        description:
          "Fetch the datamancy grimoire index (/grimoire/SKILL.md) — the catalog of every defensive spell with a one-line description. Load this first to choose a spell, then fetch its full SKILL.md.",
        inputSchema: { type: "object", properties: {}, required: [], additionalProperties: false },
        execute: async () => fetchText("/grimoire/SKILL.md", "text/markdown"),
      },
      {
        name: "listAgentSkills",
        description:
          "Fetch /.well-known/agent-skills/index.json — the structured index of the grimoire's spells, each with its category and a SHA-256 that cross-checks against the signed MCP manifest. Returns parsed JSON.",
        inputSchema: { type: "object", properties: {}, required: [], additionalProperties: false },
        execute: async () => fetchJson("/.well-known/agent-skills/index.json"),
      },
      {
        name: "getMcpManifest",
        description:
          "Fetch /.well-known/mcp/manifest.json — the ECDSA P-256-signed MCP manifest, the source of truth for every spell's SHA-256. The detached signature is at the same path + .sig. Returns parsed JSON.",
        inputSchema: { type: "object", properties: {}, required: [], additionalProperties: false },
        execute: async () => fetchJson("/.well-known/mcp/manifest.json"),
      },
    ],
  });
})();
