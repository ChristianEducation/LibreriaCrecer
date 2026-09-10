import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import { verifyGetnetNotification } from "../src/integrations/payments/getnet/notification";

const secretKey = "manual-secret";
const requestId = 1234;
const status = "APPROVED";
const date = "2026-03-29T16:43:54-05:00";
const signature = createHash("sha1")
  .update(`${requestId}${status}${date}${secretKey}`)
  .digest("hex");

test("acepta la firma SHA-1 documentada por Getnet con prefijo", () => {
  const result = verifyGetnetNotification(
    {
      requestId,
      reference: "ORD-1234",
      status: { status, date, reason: "00" },
      signature: `sha1:${signature}`,
    },
    secretKey,
  );

  assert.deepEqual(result, {
    success: true,
    data: { requestId, reference: "ORD-1234", status, date },
  });
});

test("acepta el formato plano compatible sin prefijo", () => {
  const result = verifyGetnetNotification(
    {
      requestId: String(requestId),
      reference: "ORD-1234",
      status,
      date,
      signature: signature.toUpperCase(),
    },
    secretKey,
  );

  assert.equal(result.success, true);
});

test("rechaza una firma SHA-256 aunque sus datos sean correctos", () => {
  const sha256Signature = createHash("sha256")
    .update(`${requestId}${status}${date}${secretKey}`)
    .digest("hex");
  const result = verifyGetnetNotification(
    {
      requestId,
      reference: "ORD-1234",
      status: { status, date },
      signature: sha256Signature,
    },
    secretKey,
  );

  assert.deepEqual(result, { success: false, code: "invalid_signature" });
});

test("rechaza firmas manipuladas y payloads incompletos", () => {
  const tampered = verifyGetnetNotification(
    {
      requestId,
      reference: "ORD-1234",
      status: { status, date },
      signature: `sha1:${"0".repeat(40)}`,
    },
    secretKey,
  );
  const incomplete = verifyGetnetNotification(
    { requestId, reference: "ORD-1234", status: { status, date } },
    secretKey,
  );

  assert.deepEqual(tampered, { success: false, code: "invalid_signature" });
  assert.deepEqual(incomplete, { success: false, code: "invalid_payload" });
});

test("rechaza estados fuera del contrato Getnet", () => {
  const unknownStatus = "UNEXPECTED";
  const unknownSignature = createHash("sha1")
    .update(`${requestId}${unknownStatus}${date}${secretKey}`)
    .digest("hex");
  const result = verifyGetnetNotification(
    {
      requestId,
      reference: "ORD-1234",
      status: { status: unknownStatus, date },
      signature: unknownSignature,
    },
    secretKey,
  );

  assert.deepEqual(result, { success: false, code: "invalid_payload" });
});
