import { createHash, timingSafeEqual } from "crypto";

import type { GetnetSessionStatus } from "./types";

export type GetnetNotificationPayload = {
  requestId?: number | string;
  reference?: string;
  status?:
    | string
    | {
        status?: string;
        date?: string;
        reason?: string;
        message?: string;
      };
  date?: string;
  signature?: string;
};

export type VerifiedGetnetNotification = {
  requestId: number;
  reference: string;
  status: GetnetSessionStatus;
  date: string;
};

type NotificationValidationResult =
  | { success: true; data: VerifiedGetnetNotification }
  | { success: false; code: "invalid_payload" | "invalid_signature" };

function parseRequestId(value: number | string | undefined): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizeSignature(signature: string): string {
  return signature
    .replace(/^sha256:/i, "")
    .trim()
    .toLowerCase();
}

function signaturesMatch(expected: string, received: string): boolean {
  if (!/^[a-f0-9]{64}$/.test(received)) return false;

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function verifyGetnetNotification(
  payload: GetnetNotificationPayload,
  secretKey: string,
): NotificationValidationResult {
  const requestId = parseRequestId(payload.requestId);
  const statusValue = typeof payload.status === "object" ? payload.status.status : payload.status;
  const date = typeof payload.status === "object" ? payload.status.date : payload.date;
  const reference = payload.reference?.trim();
  const signature = payload.signature ? normalizeSignature(payload.signature) : "";

  if (!requestId || !statusValue || !date || !reference || !signature) {
    return { success: false, code: "invalid_payload" };
  }

  const status = statusValue.toUpperCase() as GetnetSessionStatus;
  const allowedStatuses = new Set<GetnetSessionStatus>([
    "APPROVED",
    "REJECTED",
    "PENDING",
    "FAILED",
    "CREATED",
    "PARTIAL_EXPIRED",
    "REFUNDED",
  ]);

  if (!allowedStatuses.has(status)) {
    return { success: false, code: "invalid_payload" };
  }
  const expectedSignature = createHash("sha256")
    .update(`${requestId}${statusValue}${date}${secretKey}`)
    .digest("hex");

  if (!signaturesMatch(expectedSignature, signature)) {
    return { success: false, code: "invalid_signature" };
  }

  return {
    success: true,
    data: { requestId, reference, status, date },
  };
}
