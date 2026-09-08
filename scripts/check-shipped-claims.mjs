#!/usr/bin/env node
/**
 * Gate: a RATCHET over known verification-claim phrasings — not a census.
 *
 * WHAT IT CAN SEE, stated first because a green from it is otherwise read as a
 * certificate it cannot issue: it matches the phrasings in CLAIMS below and
 * nothing else. A verification claim written in other words is INVISIBLE to it.
 * It was demonstrated green over "Every file this site serves is cryptographically
 * verified before it reaches you" until that wording was added here. Treat it as a
 * ratchet that stops known regressions, and keep casting `circumspicere` for the
 * claims it cannot see.
 *
 * The rule it does enforce: a matched claim must name who verifies, IN ITS OWN
 * SENTENCE.
 *
 * The origin serves bytes. It verifies nothing. Verification is performed by the
 * `datamancy` npm adapter, which pins the public key — a page cannot meaningfully
 * pin a key against its own origin, and `curl`, a browser, or an MCP client that
 * skips the check all receive whatever the origin served.
 *
 * WHY THIS IS A GATE AND NOT A SWEEP. Three consecutive `circumspicere` casts
 * found this same class, and each time the repair was applied to the sites the
 * cast named and skipped their twins: index.html and llms.txt were scoped while
 * grimoire/SKILL.md was not; grimoire's generator was then scoped while
 * vigilia's generator — carrying the sentence verbatim — was not; 404.html and
 * _headers were never looked at because CONTRIBUTING classes them as unsigned
 * infra. A hand sweep finds what the sweeper remembers to look for. This finds
 * what is there.
 *
 * The rule: a line matching a CONTENT-verification phrase must, within its own
 * sentence-ish window, name the adapter — or carry an explicit waiver marker
 * whose reason is the honest bound. Claims about the MANIFEST being signed are
 * true of the origin and are not the subject here.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SKIP_DIRS = new Set(["node_modules", ".git", ".github", "blobs", "manifests"]);
const EXT = /\.(md|html|txt|json|js|mjs|xml)$/;
// The origin-side files a consumer or model can read. `_headers` has no
// extension and is public source, so it is named explicitly.
const EXTRA = ["_headers", "_redirects", ".well-known/api-catalog"];

// Phrases that assert CONTENT is verified. Each one is a phrase that has
// actually shipped here unscoped; this is a list of real defects, not a guess.
const CLAIMS = [
  /SHA-?256[- ]verified/i,
  /hash-verified/i,
  /signature-verified/i,
  /verified against (?:that|the) signed manifest/i,
  /tampered content/i,
  /signed markdown/i,
  /signed,? not spoofable/i,
  /cannot reach (?:the|an) LLM/i,
  /serves it SHA/i,
  // Added because this round's repairs reworded three files (404.html, _headers,
  // package.json) OUT of the set above — their claims became correct AND invisible,
  // so a regression there was unguarded. And because a caster demonstrated the gate
  // green over the last three.
  /hash-listed/i,
  /verifies at fetch/i,
  /verified pipeline/i,
  /cryptographically verified/i,
  /tampering is impossible/i,
  /reaches (?:the |an |you)[^.]{0,40}unverified/i,
];
// What discharges a claim: naming who does the verifying, or an explicit waiver.
const SCOPED = /adapter|datamancy`?\]?\(?https?:\/\/www\.npmjs|npm package|pins the public key/i;
// Sentence scope, not a character window. A ±240-char window accepted the word
// "adapter" from an ADJACENT sentence about something else — measured, and the
// claim went green. The verifier has to be named in the clause that makes the claim.
const sentenceAround = (flat, at) => {
  const backs = [flat.lastIndexOf(". ", at), flat.lastIndexOf("! ", at), flat.lastIndexOf("? ", at), flat.lastIndexOf("\u0000", at)];
  const start = Math.max(...backs);
  const ends = [flat.indexOf(". ", at), flat.indexOf("! ", at), flat.indexOf("? ", at), flat.indexOf("\u0000", at)].filter((i) => i !== -1);
  return flat.slice(start === -1 ? 0 : start + 1, ends.length ? Math.min(...ends) + 1 : flat.length);
};
const WAIVER = /claims-ok:/;

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") && e.name !== ".well-known") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(p, out);
    } else if (EXT.test(e.name)) out.push(p);
  }
  return out;
};

const files = [...new Set([...walk("."), ...EXTRA])].map((p) => relative(".", p)).sort();
const problems = [];
let claimsSeen = 0;

for (const file of files) {
  if (file === "scripts/check-shipped-claims.mjs") continue; // the pattern list is not a claim
  let text;
  try { text = readFileSync(file, "utf-8"); statSync(file); } catch { continue; }
  // Match over a WHITESPACE-COLLAPSED stream, not per line. A claim wraps:
  // 404.html reads "bare, signed\n    markdown", and a line-based matcher walks
  // straight past it — the same blind spot four prior casts hit with their own
  // instruments. Keep an offset -> line map so hits still report a real line.
  // Join wrapped prose, but put a \u0000 BLOCK SENTINEL wherever a line cannot be a
  // sentence continuation — a blank line, a list item, a heading, a table row, a
  // blockquote, an HTML tag. Markdown lists carry no terminal punctuation, so a
  // backward scan for ". " runs straight through them: measured, a claim was
  // discharged by the word "adapter" inside a `- **npm adapter:** …` bullet many
  // lines earlier. The sentinel is a boundary; prose wraps still join, which is what
  // keeps 404.html's claim (which breaks across a newline mid-sentence) visible.
  // A `>` blockquote line and a `#` comment line CONTINUE their sentence (llms.txt
  // quotes a wrapped paragraph; _headers comments wrap), so strip those markers
  // before deciding. What genuinely cannot continue a sentence: a blank line, a
  // list item, a table row, an HTML block tag.
  // Strip indentation ALWAYS, then any quote/comment marker. With the whitespace
  // eaten only when a `>`/`#` followed, BLOCK was anchored at column 0: an INDENTED
  // `<p>` or `- bullet` read as a sentence continuation, and a fresh unscoped claim
  // inserted mid-page was discharged by an "adapter" in a previous paragraph.
  // Measured EXIT=0 on the real index.html before this line.
  const strip = (l) => l.replace(/^\s+/, "").replace(/^[>#]+\s?/, "");
  // BLOCK-level tags only. `<code>`, `<em>`, `<a>` and friends open mid-sentence —
  // 404.html wraps its claim onto a line starting `<code>datamancy</code>`, and
  // treating every tag as a boundary split a correctly-scoped claim from its verifier.
  const BLOCK_TAG = /^<\/?(p|div|ul|ol|li|h[1-6]|section|main|nav|header|footer|article|aside|table|thead|tbody|tr|td|th|blockquote|pre|hr|form|figure|script|style|body|html|head|meta|link|title)\b/i;
  const BLOCK = (l) => {
    const t = strip(l);
    return /^(\s*$|[-*+|]\s|\d+\.\s)/.test(t) || BLOCK_TAG.test(t);
  };
  const lineOf = [];
  let flat = "";
  const raw = text.split("\n");
  raw.forEach((line, i) => {
    const sep = flat ? (BLOCK(line) ? "\u0000" : " ") : "";
    const piece = sep + line.trim();
    for (let k = 0; k < piece.length; k++) lineOf.push(i + 1);
    flat += piece;
  });
  for (const re of CLAIMS) {
    for (const m of flat.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"))) {
      claimsSeen++;
      const line = lineOf[m.index] ?? 1;
      // The window is the surrounding prose: a scoped claim often names the
      // adapter a clause earlier or later, across the same wrap.
      const window = sentenceAround(flat, m.index);
      if (SCOPED.test(window) || WAIVER.test(window)) continue;
      problems.push(`${file}:${line} — …${flat.slice(Math.max(0, m.index - 60), m.index + 90).trim()}…`);
    }
  }
}

if (!claimsSeen) {
  console.error(`[check-shipped-claims] REFUSING to vouch: matched 0 verification claims across ${files.length} files. The patterns cannot both be correct and find nothing — this repo ships these claims.`);
  process.exit(1);
}
if (problems.length) {
  console.error(`[check-shipped-claims] ${problems.length} of ${claimsSeen} verification claim(s) do not say WHO verifies:\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error(`\nThe origin serves bytes and verifies nothing; the \`datamancy\` npm adapter pins the key and verifies.\nName the adapter in the sentence, or mark a deliberate exception with \`claims-ok: <the honest bound>\`.`);
  process.exit(1);
}
console.error(`[check-shipped-claims] ✓ ${claimsSeen} verification claim(s) across ${files.length} shipped files, each naming who verifies`);
