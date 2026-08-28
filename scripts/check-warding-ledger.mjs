#!/usr/bin/env node
/**
 * Gate the warding ledger against its own re-prove rule.
 *
 * docs/WARDING-LEDGER.md says: "A row is a claim, not a permanent guarantee…
 * Re-cast on touch; if it diverges, the row is stale — fix and re-stamp, or
 * strike the row."
 *
 * Nothing enforced that. A row could vouch for a file that had changed a dozen
 * commits ago and the build stayed green — which is the exact failure mode the
 * ledger's own header says it exists to avoid ("a stamp comment can go false
 * while the build stays green"). The ledger was the last claim in this repo
 * held by vigilance alone.
 *
 * This reads each row's backticked paths and its commit, and fails if any of
 * those paths has changed since — in git history OR in the working tree.
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const LEDGER = "docs/WARDING-LEDGER.md";
const sh = (c) => execSync(c, { encoding: "utf-8" }).trim();

// Only the LIVE table counts. Struck rows are kept verbatim further down the
// file as history; a struck row is explicitly not a claim, so gating it would
// make the honest disposition impossible to record.
const allLines = readFileSync(LEDGER, "utf-8").split("\n");
const struckAt = allLines.findIndex((l) => /^##\s+Struck rows/i.test(l));
const liveLines = struckAt === -1 ? allLines : allLines.slice(0, struckAt);

const rows = liveLines
  .filter((l) => l.startsWith("|") && !l.startsWith("|---") && !l.startsWith("| Target"))
  .map((line) => {
    const cells = line.split("|").map((c) => c.trim());
    const paths = [...(cells[1] ?? "").matchAll(/`([^`]+)`/g)]
      .map((m) => m[1])
      .filter((p) => p.includes("/") || p.endsWith(".mjs") || p.endsWith(".md"));
    // NOT a fixed index: a row's Result prose can itself contain a `|`, which
    // shifts every cell after it. Scan from the right for the commit token.
    const commit = cells
      .slice()
      .reverse()
      .map((c) => (c.match(/`([0-9a-f]{7,40})`/) ?? [])[1])
      .find(Boolean);
    return { paths, commit, stamp: (cells[2] ?? "").replace(/`/g, "") };
  })
  ;

// A row that parses to nothing must not be silently dropped: a filter that
// matches no pattern reports an empty list, and empty reads as clean. Count the
// live data rows independently and refuse to vouch if any failed to parse, or
// if the live table turned up empty while rows exist.
const liveDataRows = liveLines.filter(
  (l) => l.startsWith("|") && !l.startsWith("|---") && !l.startsWith("| Target"),
).length;
const unparsed = rows.filter((r) => !r.paths.length || !r.commit);
if (unparsed.length || rows.length !== liveDataRows) {
  console.error(
    `[check-warding-ledger] REFUSING to vouch: parsed ${rows.length - unparsed.length} of ` +
      `${liveDataRows} live row(s). A row whose Target or Commit cell did not parse is not a ` +
      `row this gate has checked.`,
  );
  process.exit(1);
}
if (liveDataRows === 0) {
  console.error(`[check-warding-ledger] REFUSING to vouch: the live table has no rows.`);
  process.exit(1);
}
const checkable = rows.filter((r) => r.paths.length && r.commit);

const stale = [];
const unreachable = [];
for (const row of checkable) {
  for (const p of row.paths) {
    if (!existsSync(p)) {
      stale.push(`${p} — vouched by row stamped ${row.stamp}, but the path no longer exists`);
      continue;
    }
    // git exits 1 for "path changed" and 128 for "bad revision". A bare catch
    // folds them together and reports a change against a ref git never resolved
    // — which is what a shallow CI clone (fetch-depth 1) produces for every
    // stamped commit. Resolve the ref first and say which failure this is.
    try {
      execSync(`git cat-file -e ${row.commit}^{commit}`, { stdio: "ignore" });
    } catch {
      unreachable.push(
        `${row.commit} — stamp commit not in this clone (row stamped ${row.stamp}). ` +
          `A shallow checkout cannot verify the ledger; fetch full history.`,
      );
      continue;
    }
    let changed = false;
    try {
      execSync(`git diff --quiet ${row.commit} HEAD -- ${p}`, { stdio: "ignore" });
    } catch {
      changed = true;
    }
    try {
      execSync(`git diff --quiet HEAD -- ${p}`, { stdio: "ignore" });
    } catch {
      changed = true;
    }
    if (changed) {
      stale.push(
        `${p} — changed since ${row.commit} (row stamped ${row.stamp}). ` +
          `Re-cast and re-stamp the row, or strike it.`,
      );
    }
  }
}

if (unreachable.length) {
  console.error(`[check-warding-ledger] cannot verify — ${unreachable.length} stamp commit(s) unreachable:\n`);
  for (const u of unreachable) console.error(`  - ${u}`);
  process.exit(1);
}
if (stale.length) {
  console.error(`[check-warding-ledger] ${stale.length} STALE row-path claim(s):\n`);
  for (const s of stale) console.error(`  - ${s}`);
  console.error(
    `\nThe ledger's own rule (${LEDGER}, "Re-proving a row"): a row holds only as long ` +
      `as a fresh cast still measures it warded.`,
  );
  process.exit(1);
}
console.error(`[check-warding-ledger] ✓ ${checkable.length} rows; every vouched path unchanged since its stamp`);
