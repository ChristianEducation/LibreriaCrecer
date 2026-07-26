import assert from "node:assert/strict";
import test from "node:test";

import {
  getGetnetSessionStatus,
  mapGetnetStatusToInternal,
  type GetnetPaymentStatusResponse,
} from "../src/integrations/payments/getnet/types";

test("obtiene APPROVED desde la transaccion confirmada", () => {
  const response: GetnetPaymentStatusResponse = {
    requestId: 1234,
    status: { status: "APPROVED" },
    request: {
      payment: {
        reference: "ORD-1234",
        amount: { currency: "CLP", total: 12721 },
      },
    },
    payment: [
      {
        status: { status: "APPROVED", reason: "00" },
        reference: "ORD-1234",
        amount: { from: { currency: "CLP", total: 12721 } },
      },
    ],
  };

  assert.equal(getGetnetSessionStatus(response), "APPROVED");
  assert.equal(mapGetnetStatusToInternal("APPROVED"), "paid");
});

test("mapea estados finales y pendientes sin promover pagos", () => {
  assert.equal(mapGetnetStatusToInternal("REJECTED"), "cancelled");
  assert.equal(mapGetnetStatusToInternal("FAILED"), "cancelled");
  assert.equal(mapGetnetStatusToInternal("PARTIAL_EXPIRED"), "cancelled");
  assert.equal(mapGetnetStatusToInternal("PENDING"), "pending");
  assert.equal(mapGetnetStatusToInternal("CREATED"), "pending");
  assert.equal(mapGetnetStatusToInternal("REFUNDED"), "pending");
});
test("prioriza el estado actual de la sesión sobre pagos históricos", () => {
  const response: GetnetPaymentStatusResponse = {
    requestId: 1234,
    status: { status: "REFUNDED" },
    request: {
      payment: {
        reference: "ORD-1234",
        amount: { currency: "CLP", total: 12721 },
      },
    },
    payment: [
      {
        status: { status: "APPROVED" },
        reference: "ORD-1234",
        amount: { from: { currency: "CLP", total: 12721 } },
      },
    ],
  };

  assert.equal(getGetnetSessionStatus(response), "REFUNDED");
  assert.equal(mapGetnetStatusToInternal("REFUNDED"), "pending");
});
