import { createHash, randomBytes } from "crypto";

import { getnetConfig } from "./config";
import type { GetnetAuthObject } from "./types";

export function buildGetnetAuth(): GetnetAuthObject {
  const nonceBytes = randomBytes(16);
  const seed = new Date().toISOString();

  const tranKeyInput = Buffer.concat([
    nonceBytes,
    Buffer.from(seed, "utf8"),
    Buffer.from(getnetConfig.secretKey, "utf8"),
  ]);
  const tranKey = createHash("sha256").update(tranKeyInput).digest("base64");

  return {
    login: getnetConfig.login,
    tranKey,
    nonce: nonceBytes.toString("base64"),
    seed,
  };
}
