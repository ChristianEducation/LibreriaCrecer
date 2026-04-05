import { createHash, randomBytes } from "crypto";

import { getnetConfig } from "./config";
import type { GetnetAuthObject } from "./types";

export function buildGetnetAuth(): GetnetAuthObject {
  const nonceBytes = randomBytes(16);
  const seed = new Date().toISOString();

  const nonceBase64 = nonceBytes.toString("base64");
  const tranKey = createHash("sha256")
    .update(`${nonceBase64}${seed}${getnetConfig.secretKey}`)
    .digest("base64");

  return {
    login: getnetConfig.login,
    tranKey,
    nonce: nonceBase64,
    seed,
  };
}
