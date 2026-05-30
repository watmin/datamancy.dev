#!/usr/bin/env node
/**
 * Sign .well-known/mcp/manifest.json with the offline Ed25519 private key.
 *
 * Reads the private key from ~/.config/datamancy/private.pem (override
 * via DATAMANCY_KEY env var). Signs the EXACT bytes of manifest.json as
 * they exist on disk. Writes the detached signature to
 * .well-known/mcp/manifest.json.sig.
 *
 * SAFETY: refuses to run if the key path resolves to anywhere inside
 * this repo. Private keys must stay outside any committed tree.
 *
 * Run from the repo root: `npm run manifest:sign`
 *
 * Workflow:
 *   1. Edit spells / add new ones
 *   2. `npm run manifest:generate`
 *   3. `npm run manifest:sign`  ← this script
 *   4. `git add . && git commit && git push`
 *   5. Cloudflare Pages auto-deploys
 */

import { readFile, writeFile, access } from "node:fs/promises";
import { sign, createPrivateKey } from "node:crypto";
import { homedir } from "node:os";
import { resolve, join } from "node:path";

const MANIFEST = ".well-known/mcp/manifest.json";
const SIGNATURE = ".well-known/mcp/manifest.json.sig";
const DEFAULT_KEY = join(homedir(), ".config/datamancy/private.pem");
const KEY_PATH = process.env.DATAMANCY_KEY ?? DEFAULT_KEY;

async function main() {
  // Safety check: refuse to read a key that lives inside this repo.
  const repoRoot = resolve(process.cwd());
  const keyPath = resolve(KEY_PATH);
  if (keyPath.startsWith(repoRoot + "/") || keyPath === repoRoot) {
    throw new Error(
      `Private key path ${keyPath} is inside repo ${repoRoot}. ` +
        `REFUSING — keys must stay outside any tracked directory.`,
    );
  }

  // Confirm key file exists and is readable.
  try {
    await access(keyPath);
  } catch {
    throw new Error(
      `Private key not found at ${keyPath}. ` +
        `Override with DATAMANCY_KEY env var if it lives elsewhere.`,
    );
  }

  const manifestBytes = await readFile(MANIFEST);
  const keyPem = await readFile(keyPath);
  const privateKey = createPrivateKey({ key: keyPem, format: "pem" });

  // Ed25519: algorithm arg is null; node:crypto infers from key type.
  const signature = sign(null, manifestBytes, privateKey);

  await writeFile(SIGNATURE, signature);

  console.error(
    `[sign-manifest] signed ${manifestBytes.byteLength} bytes of ${MANIFEST}`,
  );
  console.error(
    `[sign-manifest] signature: ${signature.byteLength} bytes → ${SIGNATURE}`,
  );
  console.error(`[sign-manifest] key: ${keyPath}`);
  console.error(`[sign-manifest] next: \`git add . && git commit && git push\``);
}

main().catch((err) => {
  console.error(
    "[sign-manifest] FATAL:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
