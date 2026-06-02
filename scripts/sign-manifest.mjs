#!/usr/bin/env node
/**
 * Sign .well-known/mcp/manifest.json with the KMS-hosted P-256 key.
 *
 * The private key lives in AWS KMS (alias/datamancy-signing, us-west-2) and
 * is non-exportable. This script computes SHA-256 of the EXACT manifest
 * bytes on disk, asks KMS to sign that digest (ECDSA_SHA_256), and writes
 * the DER signature to manifest.json.sig. The key never touches this
 * machine; every signature is logged in CloudTrail.
 *
 * Requires active SSO credentials:
 *   aws sso login --sso-session datamancy
 *
 * Overridable via env: DATAMANCY_KMS_KEY, DATAMANCY_KMS_REGION,
 * DATAMANCY_AWS_PROFILE.
 *
 * Workflow:
 *   1. Edit spells / add new ones
 *   2. npm run manifest:generate
 *   3. aws sso login --sso-session datamancy   (if the session expired)
 *   4. npm run manifest:sign   ← this script
 *   5. git add . && git commit && git push
 */

import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const MANIFEST = ".well-known/mcp/manifest.json";
const SIGNATURE = ".well-known/mcp/manifest.json.sig";
const SIGNATURE_TXT = ".well-known/mcp/manifest.json.sig.txt";

const KEY_ID = process.env.DATAMANCY_KMS_KEY ?? "alias/datamancy-signing";
const REGION = process.env.DATAMANCY_KMS_REGION ?? "us-west-2";
const PROFILE = process.env.DATAMANCY_AWS_PROFILE ?? "datamancy-signer";

async function main() {
  const manifestBytes = await readFile(MANIFEST);

  // KMS signs a DIGEST (the manifest exceeds the 4KB raw-message limit).
  // The digest is not secret — it's SHA-256 of the public manifest — so a
  // temp file to hand it to the AWS CLI as fileb:// is fine.
  const digest = createHash("sha256").update(manifestBytes).digest();
  // Write the digest inside a private, owner-only (0700) temp DIRECTORY rather
  // than a predictable tmp PATH — a predictable name is a symlink/AFO target a
  // local attacker could pre-create. mkdtemp's randomized 0700 dir kills that.
  const tmpDir = await mkdtemp(join(tmpdir(), "datamancy-sign-"));
  const digestPath = join(tmpDir, "manifest.digest");
  await writeFile(digestPath, digest);

  let sigB64;
  try {
    sigB64 = execFileSync(
      "aws",
      [
        "kms", "sign",
        "--key-id", KEY_ID,
        "--message", `fileb://${digestPath}`,
        "--message-type", "DIGEST",
        "--signing-algorithm", "ECDSA_SHA_256",
        "--region", REGION,
        "--profile", PROFILE,
        "--query", "Signature",
        "--output", "text",
      ],
      { encoding: "utf-8" },
    ).trim();
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }

  const signature = Buffer.from(sigB64, "base64");
  await writeFile(SIGNATURE, signature);

  // Human-readable, copy-pasteable view of the same signature (base64). The raw
  // .sig is binary DER — a browser downloads it — so a viewer who clicks through
  // gets text, not a file. NOT signed content: a derived view of SIGNATURE,
  // regenerated here on every sign so it can never drift from the real signature.
  const sigTxt =
    "ECDSA P-256 / SHA-256 detached signature over /.well-known/mcp/manifest.json\n" +
    "(raw DER at manifest.json.sig). The `npx datamancy` adapter pins the public key\n" +
    "and verifies this on every fetch.\n\nSignature (DER, base64):\n\n" +
    sigB64 + "\n";
  await writeFile(SIGNATURE_TXT, sigTxt);

  // Finalize the immutable snapshot. The manifest's own SHA-256 is its
  // content address = the version id a consumer pins. Copy the EXACT signed
  // bytes + signature to manifests/<hash>/ (write-once, never reopened). The
  // chain backpointer is NOT advanced here: the next generate derives
  // `previous` from the committed manifest in git, so only an actual publish
  // (a commit) moves the chain — nothing a dry run writes can poison it.
  const manifestHash = createHash("sha256").update(manifestBytes).digest("hex");
  const snapDir = join("manifests", manifestHash);
  await mkdir(snapDir, { recursive: true });
  await writeFile(join(snapDir, "manifest.json"), manifestBytes);
  await writeFile(join(snapDir, "manifest.json.sig"), signature);
  await writeFile(join(snapDir, "manifest.json.sig.txt"), sigTxt);

  console.error(
    `[sign-manifest] signed ${manifestBytes.byteLength} bytes of ${MANIFEST} ` +
      `via KMS (${KEY_ID}, ${REGION})`,
  );
  console.error(
    `[sign-manifest] DER signature: ${signature.byteLength} bytes → ${SIGNATURE}`,
  );
  const versionLabel = JSON.parse(manifestBytes.toString("utf-8")).serverInfo
    .version;
  console.error(
    `[sign-manifest] version: ${versionLabel} (sha256:${manifestHash})`,
  );
  console.error(`[sign-manifest] snapshot → ${snapDir}/`);
  console.error(`[sign-manifest] next:`);
  console.error(`  git add . && git commit -m "publish ${versionLabel}"`);
  console.error(`  git tag ${versionLabel} && git push --follow-tags`);
}

main().catch((err) => {
  console.error(
    "[sign-manifest] FATAL:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
