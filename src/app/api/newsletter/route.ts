import { NextResponse } from "next/server";

import { SubscribeNewsletterSchema } from "@/features/newsletter/schemas";
import { subscribeToNewsletter } from "@/features/newsletter/services/newsletter-service";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Límite por IP en memoria: frena el abuso básico por instancia (best-effort).
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(getClientIp(request))) {
      return NextResponse.json(
        { error: "rate_limited", message: "Demasiados intentos. Prueba nuevamente en unos minutos." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = SubscribeNewsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: parsed.error.issues[0]?.message ?? "Ingresa un correo válido.",
        },
        { status: 400 },
      );
    }

    // Honeypot completado: responder como éxito sin guardar nada.
    if (parsed.data.website) {
      return NextResponse.json({ data: { subscribed: true } });
    }

    await subscribeToNewsletter(parsed.data.email, parsed.data.source || "home");
    return NextResponse.json({ data: { subscribed: true } });
  } catch (error) {
    console.error("POST /api/newsletter failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No pudimos registrar tu correo. Intenta nuevamente." },
      { status: 500 },
    );
  }
}
