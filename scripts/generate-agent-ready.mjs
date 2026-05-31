#!/usr/bin/env node
//
// Generate the manifest-derived agent-discovery files, so they can never drift
// from the signed grimoire:
//   .well-known/agent-skills/index.json   (Agent Skills index, agentskills.io v0.2.0)
//   .well-known/mcp/server-card.json      (MCP server card)
//   sitemap.xml
//
// Source of truth = the signed manifest (.well-known/mcp/manifest.json) for the
// spell list + SHA-256 + version, joined with each spell's SKILL.md frontmatter
// for description + category. Run by `npm run agent:regen`; folded into ship and
// the check:docs drift gate. Hand-authored constants (robots.txt, the OAuth
// stubs, api-catalog, auth.md, webmcp.js) live as static files — they don't
// reference the spell list, so they don't drift.
//
//   npm run agent:regen                                  # write the files
//   node scripts/generate-agent-ready.mjs --check        # drift gate, no write

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const SITE = "https://datamancy.dev";
const REPO = "https://github.com/watmin/datamancy.dev";
const NPM = "https://www.npmjs.com/package/datamancy";
const PRACTITIONER = "https://datamancer.dev";
const CHRONICLE = "https://algebraic-intelligence.dev";

const MANIFEST = ".well-known/mcp/manifest.json";
const OUT_SKILLS = ".well-known/agent-skills/index.json";
const OUT_CARD = ".well-known/mcp/server-card.json";
const OUT_SITEMAP = "sitemap.xml";

const CHECK = process.argv.includes("--check");

// category (spell frontmatter) → Agent Skills `type`
const TYPE = {
  craft: "tests-of-craft",
  surface: "tests-of-surface",
  fidelity: "tests-of-fidelity",
  solo: "solo-ward",
};

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const yaml = m[1];
  const f = (k) => {
    const x = yaml.match(new RegExp(`^${k}:\\s*(.+)$`, "m"));
    return x ? x[1].trim() : null;
  };
  return { name: f("name"), description: f("description"), category: f("category") };
}

async function build() {
  const manifest = JSON.parse(await readFile(MANIFEST, "utf-8"));
  const version = manifest.serverInfo.version; // ISO8601-ish, e.g. 2026-05-31T01-51-51Z
  const lastmod = version.slice(0, 10); // YYYY-MM-DD for sitemap

  const skills = [];
  for (const r of manifest.resources) {
    const fm = frontmatter(await readFile(r.uri, "utf-8"));
    const type = fm.name === "grimoire" ? "grimoire-index" : TYPE[fm.category] || "spell";
    skills.push({
      name: r.name,
      type,
      description: fm.description || "",
      url: `${SITE}/${r.uri}`,
      sha256: r.sha256,
      "x-documentation": `${REPO}/blob/main/${r.uri}`,
    });
  }

  // ── Agent Skills index ────────────────────────────────────────────────
  const skillsIndex = {
    $schema: "https://agentskills.io/schema/v0.2.0.json",
    skills,
    "x-source": REPO,
    "x-source-version": "main",
    "x-published-mcp-manifest": `${SITE}/.well-known/mcp/manifest.json`,
    "x-note":
      "The datamancy grimoire — Latin-named defensive spells, each a SKILL.md the " +
      "datamancer casts as a subagent against a target file or tree. Each spell " +
      "encodes one discipline; severity is L1 (blocks) / L2 (fix-now) / L3 (taste). " +
      "The `type` field groups them: tests-of-craft (code quality — Hickey + Beckman " +
      "lineage), tests-of-surface (test quality), tests-of-fidelity (spec/code drift " +
      "and claim-vs-code honesty), solo-ward (nesciens reads as a fresh reader; vigilia " +
      "casts every defensive spell in parallel), grimoire-index (the catalog, load first). " +
      "The sha256 lets agents verify content integrity against the URL — the same hashes " +
      "appear in the ECDSA P-256-signed MCP manifest, consumed by the `datamancy` npm " +
      "package via `npx -y datamancy`, which refuses any spell that fails verification.",
    "x-pointers": {
      "grimoire-index": `${SITE}/grimoire/SKILL.md`,
      "agent-map": `${SITE}/llms.txt`,
      "mcp-manifest": `${SITE}/.well-known/mcp/manifest.json`,
      "mcp-signature": `${SITE}/.well-known/mcp/manifest.json.sig`,
      "mcp-card": `${SITE}/.well-known/mcp/server-card.json`,
      "npm-package": NPM,
      practitioner: PRACTITIONER,
      chronicle: CHRONICLE,
    },
  };

  // ── MCP server card ───────────────────────────────────────────────────
  const serverCard = {
    serverInfo: { name: "datamancy.dev", version },
    capabilities: { resources: {} },
    "x-static-server": true,
    "x-manifest-url": `${SITE}/.well-known/mcp/manifest.json`,
    "x-resource-count": manifest.resources.length,
    "x-trust": {
      algorithm: "SHA-256",
      signed: true,
      "signature-url": `${SITE}/.well-known/mcp/manifest.json.sig`,
      "signature-algorithm": "ECDSA-P256",
      "pubkey-pinned-in": NPM,
    },
    "x-note":
      "datamancy.dev is a cryptographically verifiable static MCP serving the " +
      "datamancy grimoire as raw markdown. The manifest is ECDSA P-256 signed; the " +
      "npm adapter (`npx -y datamancy`) verifies the signature against a public key " +
      "pinned in the package source, then verifies the SHA-256 of each fetched spell " +
      "against the signed manifest. No content reaches the LLM unverified. The " +
      "practitioner's identity card is at " +
      PRACTITIONER +
      "; the chronicle is at " +
      CHRONICLE +
      ".",
    "x-recommended-resources": [
      {
        name: "datamancy-mcp-manifest",
        uri: `${SITE}/.well-known/mcp/manifest.json`,
        mimeType: "application/json",
        description: `The signed MCP manifest — ${manifest.resources.length} resources, each with SHA-256-verifiable content. Verify against the signature at /.well-known/mcp/manifest.json.sig.`,
      },
      {
        name: "datamancy-agent-skills",
        uri: `${SITE}/.well-known/agent-skills/index.json`,
        mimeType: "application/json",
        description: "The Agent Skills index — the same spells, grouped by discipline, each SHA-256-cross-checkable against the signed manifest.",
      },
      {
        name: "datamancy-npm-package",
        uri: NPM,
        mimeType: "text/html",
        description: "Zero-dependency MCP adapter that consumes the manifest. Pins the public key in source. Invoke via `npx -y datamancy` in any MCP client config.",
      },
    ],
  };

  // ── sitemap ───────────────────────────────────────────────────────────
  const urls = [
    `${SITE}/`,
    `${SITE}/grimoire/SKILL.md`,
    ...manifest.resources
      .filter((r) => r.name !== "grimoire")
      .map((r) => `${SITE}/${r.uri}`),
    `${SITE}/llms.txt`,
    `${SITE}/README.md`,
  ];
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map((u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`)
      .join("\n") +
    "\n</urlset>\n";

  return {
    [OUT_SKILLS]: JSON.stringify(skillsIndex, null, 2) + "\n",
    [OUT_CARD]: JSON.stringify(serverCard, null, 2) + "\n",
    [OUT_SITEMAP]: sitemap,
  };
}

async function main() {
  const files = await build();

  if (CHECK) {
    let drift = false;
    for (const [path, content] of Object.entries(files)) {
      let current = "";
      try {
        current = await readFile(path, "utf-8");
      } catch {
        /* missing → drift */
      }
      if (current !== content) {
        console.error(`[generate-agent-ready] DRIFT: ${path} is stale — run \`npm run agent:regen\``);
        drift = true;
      }
    }
    if (drift) process.exit(1);
    console.error("[generate-agent-ready] ✓ agent-discovery files current");
    return;
  }

  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
  console.error(
    `[generate-agent-ready] wrote ${Object.keys(files).length} files (${JSON.parse(files[OUT_SKILLS]).skills.length} skills)`,
  );
}

main().catch((err) => {
  console.error("[generate-agent-ready] FATAL:", err instanceof Error ? err.message : err);
  process.exit(1);
});
