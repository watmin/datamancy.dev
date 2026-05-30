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

import { readFile, writeFile, unlink, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const MANIFEST = ".well-known/mcp/manifest.json";
const SIGNATURE = ".well-known/mcp/manifest.json.sig";
const HEAD = ".well-known/mcp/HEAD";

const KEY_ID = process.env.DATAMANCY_KMS_KEY ?? "alias/datamancy-signing";
const REGION = process.env.DATAMANCY_KMS_REGION ?? "us-west-2";
const PROFILE = process.env.DATAMANCY_AWS_PROFILE ?? "datamancy-signer";

async function main() {
  const manifestBytes = await readFile(MANIFEST);

  // KMS signs a DIGEST (the manifest exceeds the 4KB raw-message limit).
  // The digest is not secret — it's SHA-256 of the public manifest — so a
  // temp file to hand it to the AWS CLI as fileb:// is fine.
  const digest = createHash("sha256").update(manifestBytes).digest();
  const digestPath = join(tmpdir(), `datamancy-manifest-${process.pid}.digest`);
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
    await unlink(digestPath).catch(() => {});
  }

  const signature = Buffer.from(sigB64, "base64");
  await writeFile(SIGNATURE, signature);

  // Finalize the immutable snapshot. The manifest's own SHA-256 is its
  // content address = the version id a consumer pins. Copy the EXACT signed
  // bytes + signature to manifests/<hash>/ (write-once, never reopened), and
  // advance HEAD so the next generate links its `previous` to this version.
  const manifestHash = createHash("sha256").update(manifestBytes).digest("hex");
  const snapDir = join("manifests", manifestHash);
  await mkdir(snapDir, { recursive: true });
  await writeFile(join(snapDir, "manifest.json"), manifestBytes);
  await writeFile(join(snapDir, "manifest.json.sig"), signature);
  await writeFile(HEAD, manifestHash + "\n");

  console.error(
    `[sign-manifest] signed ${manifestBytes.byteLength} bytes of ${MANIFEST} ` +
      `via KMS (${KEY_ID}, ${REGION})`,
  );
  console.error(
    `[sign-manifest] DER signature: ${signature.byteLength} bytes → ${SIGNATURE}`,
  );
  console.error(`[sign-manifest] version: sha256:${manifestHash}`);
  console.error(`[sign-manifest] snapshot → ${snapDir}/ (HEAD advanced)`);
  console.error(`[sign-manifest] next: git add . && git commit && git push`);
}

main().catch((err) => {
  console.error(
    "[sign-manifest] FATAL:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
