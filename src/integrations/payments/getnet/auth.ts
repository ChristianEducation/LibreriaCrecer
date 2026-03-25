import { createHash, randomBytes } from "crypto";

import { getnetConfig } from "./config";
import type { GetnetAuthObject } from "./types";

export function buildGetnetAuth(): GetnetAuthObject {
  const nonceBytes = randomBytes(16);
  const seed = new Date().toISOString();

  const tranKeyBuffer = createHash("sha256")
    .update(Buffer.concat([nonceBytes, Buffer.from(`${seed}${getnetConfig.secretKey}`, "utf8")]))
    .digest();

  return {
    login: getnetConfig.login,
    tranKey: tranKeyBuffer.toString("base64"),
    nonce: nonceBytes.toString("base64"),
    seed,
  };
}
