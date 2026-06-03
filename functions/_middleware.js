// Cloudflare Pages middleware — markdown content negotiation + spell-URL routing.
//
// Two jobs, both about telling an agent the truth:
//
// 1. ROOT CONTENT-NEGOTIATION. `/` serves an HTML landing so browsers render it
//    and the WebMCP crawler can execute /webmcp.js. An agent that sends
//    `Accept: text/markdown` (q ≥ text/html's) instead gets /llms.txt as
//    text/markdown — same URL, content-negotiated. A bare `*/*` (curl, most HTTP
//    libraries) is neutral and falls through to HTML, the right default.
//
// 2. SPELL-URL ROUTING. Spells live canonically at `/<name>/SKILL.md`. The
//    natural wrong guesses — `/grimoire/<name>/SKILL.md`, `/grimoire/<name>.md`,
//    `/<name>.md` — used to hit the not-found fallback, which returned the HTML
//    landing as `200 text/markdown`: a phantom success an agent parses as garbage.
//    This middleware OWNS the spell namespace so that can never happen:
//      - a real spell at a guessed path → 301 to the canonical URL
//      - an unknown name at a `…/SKILL.md` path, OR a `.md` shorthand that
//        resolves to nothing → honest 404 + a markdown body pointing at the
//        catalog (and the nearest real spell)
//    The valid spell set is read from the signed manifest — the same source of
//    truth the MCP consumers verify against — so this layer can never disagree
//    with what is actually published.
//
// Cloudflare does NOT apply the static `_headers` rules to responses a Function
// builds by hand, so every Response we construct sets AGENT_HEADERS explicitly —
// otherwise a cross-origin agent (browser/WebMCP) gets a CORS-opaque, header-bare
// reply and cannot read even the helpful 404 body. These mirror the `/*` rule.
//
// Free-plan Pages Functions; no dependency on Cloudflare's paid features.

const MANIFEST_PATH = "/.well-known/mcp/manifest.json";

// The security + CORS + content-signal headers the `/*` _headers rule grants to
// static-asset responses. Hand-built Function responses must carry them too.
const AGENT_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Signal": "search=yes, ai-input=yes, ai-train=yes",
};

// True only when Accept EXPLICITLY prefers text/markdown over text/html. A bare
// wildcard is neutral and falls through to the HTML default (right for browsers).
export function prefersMarkdown(accept) {
  if (!accept) return false;
  let mdQ = -1;
  let htmlQ = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().split(";").map((s) => s.trim());
    if (!type) continue;
    let q = 1;
    for (const param of params) {
      if (param.startsWith("q=")) {
        const parsed = parseFloat(param.slice(2));
        if (!isNaN(parsed)) q = parsed;
      }
    }
    if (type === "text/markdown") mdQ = Math.max(mdQ, q);
    else if (type === "text/html") htmlQ = Math.max(htmlQ, q);
  }
  return mdQ > 0 && mdQ >= htmlQ;
}

// The root is the only HTML page; everything else is already raw markdown.
export function markdownCompanionPath(pathname) {
  if (pathname === "/" || pathname === "") return "/llms.txt";
  return null;
}

// Recognize the URL shapes that name a spell. `strict` shapes (…/SKILL.md) are
// unambiguous spell requests — safe to 404 on an unknown name. The `.md`
// shorthand is NOT strict: `/auth.md` and `/README.md` are real top-level files,
// so an unknown `.md` name is probed (real file → serve; nothing → honest 404),
// never assumed missing.
export function parseSpellRequest(pathname) {
  let m;
  if ((m = pathname.match(/^\/([a-z][a-z0-9-]*)\/SKILL\.md$/)))
    return { name: m[1], canonical: true, strict: true };
  if ((m = pathname.match(/^\/grimoire\/([a-z][a-z0-9-]*)\/SKILL\.md$/)))
    return { name: m[1], canonical: false, strict: true };
  if ((m = pathname.match(/^\/(?:grimoire\/)?([a-z][a-z0-9-]*)\.md$/)))
    return { name: m[1], canonical: false, strict: false };
  return null;
}

// Cache the valid spell set per isolate (60s) so the hot path — agents fetching
// real spells — doesn't refetch the manifest every time. Stale-if-error: a failed
// refresh keeps the last good set rather than degrading routing.
let SPELL_CACHE = { names: null, at: 0 };

async function validSpellNames(env, origin) {
  const now = Date.now();
  if (SPELL_CACHE.names && now - SPELL_CACHE.at < 60_000) return SPELL_CACHE.names;
  try {
    const res = await env.ASSETS.fetch(new URL(MANIFEST_PATH, origin).toString());
    if (!res.ok) return SPELL_CACHE.names;
    const manifest = await res.json();
    const names = new Set((manifest.resources || []).map((r) => r.name));
    if (names.size) SPELL_CACHE = { names, at: now };
    return names;
  } catch {
    return SPELL_CACHE.names;
  }
}

// Cheapest useful "did you mean": longest shared prefix, with a bonus for a
// containment match. Returns null when nothing is close enough to suggest.
export function nearestSpell(name, names) {
  let best = null;
  let bestScore = 1;
  for (const n of names) {
    let i = 0;
    while (i < name.length && i < n.length && name[i] === n[i]) i++;
    const score = i + (n.includes(name) || name.includes(n) ? 2 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = n;
    }
  }
  return best;
}

export function notFoundBody(name, hint) {
  const lines = [
    `# No such spell: \`${name}\``,
    ``,
    `The datamancy grimoire has no spell by that name. Spells live at`,
    `\`/<name>/SKILL.md\` — for example, [/examinare/SKILL.md](/examinare/SKILL.md).`,
    ``,
    `- **Every spell, with one-line readings:** [/grimoire/SKILL.md](/grimoire/SKILL.md)`,
    `- **Agent map of the whole site:** [/llms.txt](/llms.txt)`,
  ];
  if (hint) {
    lines.push(
      ``,
      `Did you mean **\`${hint}\`**? → [/${hint}/SKILL.md](/${hint}/SKILL.md)`,
    );
  }
  return lines.join("\n") + "\n";
}

function notFound(name, names) {
  return new Response(notFoundBody(name, nearestSpell(name, names)), {
    status: 404,
    headers: {
      ...AGENT_HEADERS,
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      Link: '</grimoire/SKILL.md>; rel="index"; type="text/markdown"',
    },
  });
}

function redirectCanonical(name, origin) {
  return new Response(null, {
    status: 301,
    headers: {
      ...AGENT_HEADERS,
      Location: new URL(`/${name}/SKILL.md`, origin).toString(),
    },
  });
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") return next();

  // --- Job 2: spell-URL routing (runs first; it may short-circuit) ---
  const spell = parseSpellRequest(url.pathname);
  if (spell) {
    const names = await validSpellNames(env, url.origin);
    // If the manifest is unreadable, don't make things worse — fall through.
    if (names && names.size) {
      const known = names.has(spell.name);
      if (known && !spell.canonical) {
        // a real spell reached by a guessed path → redirect to its true home
        return redirectCanonical(spell.name, url.origin);
      }
      if (!known) {
        if (spell.strict) {
          // unambiguous spell request, unknown name → honest 404, never a phantom 200
          return notFound(spell.name, names);
        }
        // `.md` shorthand, unknown name: a real top-level file (/auth.md) or a
        // genuine miss (/sprint.md)? The ASSETS binding returns the HTML 404 page
        // for a miss with an UNRELIABLE status (it can come back 200 — the
        // phantom-200 still lives at the binding level; the edge 404 comes from
        // 404.html). So distinguish by CONTENT: a real markdown file never opens
        // with an HTML doctype. HTML body → miss → honest markdown 404; real
        // markdown → fall through (next() re-fetches and serves it).
        const probe = await env.ASSETS.fetch(
          new URL(url.pathname, url.origin).toString(),
        );
        const head = (await probe.text()).replace(/^﻿/, "").trimStart().slice(0, 64).toLowerCase();
        if (head.startsWith("<!doctype html") || head.startsWith("<html")) {
          return notFound(spell.name, names);
        }
        // real markdown file → fall through to serve it
      }
      // known && canonical → fall through and serve the real file.
    }
  }

  // --- Job 1: root markdown content-negotiation ---
  if (!prefersMarkdown(request.headers.get("Accept") || "")) return next();

  const mdPath = markdownCompanionPath(url.pathname);
  if (!mdPath) return next();

  const mdResponse = await env.ASSETS.fetch(
    new Request(new URL(mdPath, url.origin).toString(), {
      method: request.method,
      headers: request.headers,
    }),
  );
  if (!mdResponse.ok) return next();

  const headers = new Headers(mdResponse.headers);
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Vary", "Accept");
  headers.set("X-Markdown-Source", mdPath);

  return new Response(mdResponse.body, {
    status: mdResponse.status,
    statusText: mdResponse.statusText,
    headers,
  });
}
