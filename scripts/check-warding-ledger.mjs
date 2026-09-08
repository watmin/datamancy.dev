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
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const LEDGER = "docs/WARDING-LEDGER.md";

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
    // Every backticked token in the Target cell is a candidate path claim. The
    // filter used to DISCARD what it did not recognise — so a row vouching
    // `experiri/SKILL.md`, `llms.txt` parsed one, dropped the other, and printed
    // "every vouched path unchanged" while vouching half of what it claimed.
    //
    // The discriminator is the DISK, not a pattern: a Target cell also backticks
    // real prose (the excusare row names its rune categories, `no-falsifier` and
    // `below-resolution`), and no regex separates those from an extensionless
    // path like `_headers`. A token that RESOLVES to something on disk is a path
    // claim; one that does not is prose. A claim this gate cannot check is a
    // refused row, never a silent subtraction.
    const claimed = [...(cells[1] ?? "").matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    const looksLikePath = (t) => t.includes("/") || /\.[A-Za-z0-9]{1,5}$/.test(t);
    const paths = claimed.filter(looksLikePath);
    // BOUND, stated because it is real: a token that is neither path-like nor on
    // disk is indistinguishable from prose, so an extensionless token that does not
    // resolve — deleted, moved, or mistyped — falls out of both lists and the row vouches for less than it
    // claims. The cure is the convention, not the heuristic: write every vouched
    // path with a `/` or an extension (`./_headers`, never `_headers`) — then
    // `looksLikePath` is total and `dropped` is empty by construction.
    const dropped = claimed.filter((t) => !looksLikePath(t) && existsSync(t));
    // NOT a fixed index: a row's Result prose can itself contain a `|`, which
    // shifts every cell after it. Scan from the right for the commit token.
    const commit = cells
      .slice()
      .reverse()
      .map((c) => (c.match(/`([0-9a-f]{7,40})`/) ?? [])[1])
      .find(Boolean);
    return { paths, dropped, commit, stamp: (cells[2] ?? "").replace(/`/g, "") };
  })
  ;

// A row that parses to nothing must not be silently dropped: a filter that
// matches no pattern reports an empty list, and empty reads as clean. Count the
// live data rows and refuse to vouch if any failed to parse, or
// if the live table turned up empty while rows exist.
const liveDataRows = liveLines.filter(
  (l) => l.startsWith("|") && !l.startsWith("|---") && !l.startsWith("| Target"),
).length;
// NOTE what this does and does not do. `rows` and `liveDataRows` are derived from
// the SAME filtered lines, so `rows.length !== liveDataRows` can never fire — it is
// a shape assertion, not an independent count. The real work is `unparsed`.
const unparsed = rows.filter((r) => !r.paths.length || !r.commit || r.dropped.length);
if (unparsed.length || rows.length !== liveDataRows) {
  console.error(
    `[check-warding-ledger] REFUSING to vouch: parsed ${rows.length - unparsed.length} of ` +
      `${liveDataRows} live row(s). A row whose Target or Commit cell did not parse is not a ` +
      `row this gate has checked.`,
  );
  // Every unparsed row gets a line naming WHY. The exit is after the loop: with it
  // inside, the first row terminated the process and every later row's offender
  // went unnamed — a gate that reports a count and no offender.
  for (const r of unparsed) {
    if (r.dropped?.length) {
      console.error(
        `  - a row claims ${r.dropped.map((d) => `\`${d}\``).join(", ")} in its Target cell, ` +
          `which this gate does not recognise as a path. It would have been dropped and the ` +
          `row vouched for the rest — so the row is refused instead. Write the full path, or ` +
          `move the token out of backticks.`,
      );
    } else if (!r.paths.length) {
      console.error(`  - a row stamped ${r.stamp || "(no stamp)"} names no vouched path this gate can read.`);
    } else if (!r.commit) {
      console.error(`  - the row vouching ${r.paths.map((x) => `\`${x}\``).join(", ")} carries no commit token.`);
    }
  }
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
      execFileSync("git", ["cat-file", "-e", `${row.commit}^{commit}`], { stdio: "ignore" });
    } catch {
      unreachable.push(
        `${row.commit} — stamp commit not in this clone (row stamped ${row.stamp}). ` +
          `A shallow checkout cannot verify the ledger; fetch full history.`,
      );
      continue;
    }
    // `existsSync` is not "git knows about this". An UNTRACKED path passes every
    // diff below — absent on both sides of the commit range, and invisible to a
    // worktree diff — so the row vouches, forever, for a file git has never seen.
    // Measured: a probe row for an untracked SKILL.md printed "✓ every vouched
    // path unchanged since its stamp", EXIT=0.
    const tracked = execFileSync("git", ["ls-files", "--", p], { encoding: "utf-8" }).trim();
    if (!tracked) {
      stale.push(
        `${p} — vouched by row stamped ${row.stamp}, but git does not track it. ` +
          `An untracked path cannot be proven unchanged; commit it or strike the row.`,
      );
      continue;
    }

    let changed = false;
    try {
      execFileSync("git", ["diff", "--quiet", row.commit, "HEAD", "--", p], { stdio: "ignore" });
    } catch {
      changed = true;
    }
    // `git diff` cannot see an UNTRACKED file, so a vouched DIRECTORY could grow an
    // entirely new, never-warded file and still vouch. `status --porcelain` sees
    // both modifications and untracked additions under the path — strictly stronger
    // than the worktree diff it replaces.
    const dirty = execFileSync("git", ["status", "--porcelain", "--", p], { encoding: "utf-8" }).trim();
    if (dirty) changed = true;
    if (changed) {
      stale.push(
        `${p} — changed since ${row.commit} (row stamped ${row.stamp}). ` +
          `Re-cast and re-stamp the row, or strike it.`,
      );
    }
  }
}

// BOTH lists print before either exits. Reporting `unreachable` and exiting first
// meant one unresolvable stamp — a shallow CI clone is enough — silently swallowed
// every genuine staleness in the same run, and handed the operator "fetch full
// history" as though that were the whole finding.
if (unreachable.length) {
  console.error(`[check-warding-ledger] cannot verify — ${unreachable.length} stamp commit(s) unreachable:\n`);
  for (const u of unreachable) console.error(`  - ${u}`);
  if (stale.length) console.error(`\n  (and ${stale.length} stale row-path claim(s) below — the two are independent)`);
  console.error("");
}
if (stale.length) {
  console.error(`[check-warding-ledger] ${stale.length} STALE row-path claim(s):\n`);
  for (const s of stale) console.error(`  - ${s}`);
  console.error(
    `\nThe ledger's own rule (${LEDGER}, "Re-proving a row"): a row holds only as long ` +
      `as a fresh cast still measures it warded.`,
  );
}
if (unreachable.length || stale.length) process.exit(1);
console.error(`[check-warding-ledger] ✓ ${checkable.length} rows; every vouched path unchanged since its stamp`);
