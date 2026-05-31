// Cloudflare Pages middleware — markdown content negotiation.
//
// The root (/) serves an HTML landing so browsers render it and the WebMCP
// crawler can execute /webmcp.js. But an agent that sends `Accept: text/markdown`
// (with a q-value at or above text/html's) should get markdown, not HTML. For the
// homepage we serve /llms.txt — the agent-curated map of the grimoire — with
// Content-Type: text/markdown. Same URL, content-negotiated.
//
// Every other path falls through unchanged: the spell files (/*/SKILL.md), the
// manifest, the blobs — all already served as their correct content-type.
//
// Free-plan Pages Functions; no dependency on Cloudflare's paid "Markdown for
// Agents" feature.

// True only when Accept EXPLICITLY prefers text/markdown over text/html. A bare
// wildcard (curl's default, most HTTP libraries' default) is neutral and falls
// through to the HTML default — the right behavior for browsers.
function prefersMarkdown(accept) {
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

// Map an HTML page to its markdown companion. The root is the only HTML page on
// this site; everything else is already raw markdown and needs no rewrite.
function markdownCompanionPath(pathname) {
  if (pathname === "/" || pathname === "") return "/llms.txt";
  return null;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") return next();
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
