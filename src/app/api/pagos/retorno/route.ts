import { NextResponse, type NextRequest } from "next/server";

import { processPaymentResultByOrderNumber } from "@/features/checkout/services/payment-service";
import { getnetConfig } from "@/integrations/payments/getnet";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    const errorUrl = new URL("/checkout/confirmacion", getnetConfig.appUrl);
    errorUrl.searchParams.set("status", "pending");
    errorUrl.searchParams.set("error", "missing_reference");
    return NextResponse.redirect(errorUrl);
  }

  try {
    const result = await processPaymentResultByOrderNumber(reference);

    const confirmationUrl = new URL("/checkout/confirmacion", getnetConfig.appUrl);
    confirmationUrl.searchParams.set("order", reference);

    if (!result.success) {
      confirmationUrl.searchParams.set("status", "pending");
      confirmationUrl.searchParams.set("error", result.code);
      return NextResponse.redirect(confirmationUrl);
    }

    confirmationUrl.searchParams.set("status", result.data.status);
    confirmationUrl.searchParams.set("paymentStatus", result.data.paymentStatus);
    return NextResponse.redirect(confirmationUrl);
  } catch (error) {
    console.error("GET /api/pagos/retorno failed", error);
    const fallbackUrl = new URL("/checkout/confirmacion", getnetConfig.appUrl);
    fallbackUrl.searchParams.set("order", reference);
    fallbackUrl.searchParams.set("status", "pending");
    fallbackUrl.searchParams.set("error", "internal_server_error");
    return NextResponse.redirect(fallbackUrl);
  }
}
