// RUTA TEMPORAL DE DIAGNOSTICO — SE BORRA APENAS SE USE.
// Solo lectura: consulta a Getnet el estado de 5 transacciones fijas.
import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

import { getPaymentStatus } from "@/integrations/payments/getnet/client";

export const dynamic = "force-dynamic";

const TOKEN_SHA256 = "beaabad552f2c5252d90d24b4d2c2766a5ab4e172a16e73aca10ca64079cb3a3";

const REQUEST_IDS: Record<string, number> = {
  "ORD-0040 (control: pagado)": 11321380,
  "ORD-0041 (control: nunca pago)": 11321439,
  "ORD-0044 (control: pagado)": 12105661,
  "ORD-0045 (duda)": 12200611,
  "ORD-0046 (duda)": 12984256,
};

function isAuthorized(request: NextRequest): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const given = createHash("sha256").update(token).digest();
  const expected = Buffer.from(TOKEN_SHA256, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await Promise.all(
    Object.entries(REQUEST_IDS).map(async ([label, requestId]) => {
      try {
        const result = await getPaymentStatus(requestId);
        return [label, { requestId, result }] as const;
      } catch (error) {
        return [
          label,
          { requestId, error: error instanceof Error ? error.message : String(error) },
        ] as const;
      }
    }),
  );

  return NextResponse.json(Object.fromEntries(entries));
}
