import { getnetConfig } from "./config";
import { buildGetnetAuth } from "./auth";
import type {
  GetnetCreateSessionParams,
  GetnetCreateSessionResponse,
  GetnetPaymentStatusResponse,
  GetnetReversePaymentResponse,
} from "./types";

const REQUEST_TIMEOUT_MS = 15_000;

function normalizeEndpoint(path: string) {
  return `${getnetConfig.endpoint}${path.startsWith("/") ? path : `/${path}`}`;
}

async function postGetnet<TResponse>(path: string, body: Record<string, unknown>): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(normalizeEndpoint(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => ({}))) as TResponse & {
      status?: { message?: string };
    };

    if (!response.ok) {
      const message = payload.status?.message ?? `Getnet request failed with status ${response.status}.`;
      throw new Error(message);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

export async function createPaymentSession(
  params: GetnetCreateSessionParams,
): Promise<GetnetCreateSessionResponse> {
  const expirationDate = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return postGetnet<GetnetCreateSessionResponse>("/api/session/", {
    auth: buildGetnetAuth(),
    payment: {
      reference: params.reference,
      description: params.description,
      amount: {
        currency: "CLP",
        total: params.amount,
      },
    },
    buyer: params.buyer,
    expiration: expirationDate,
    returnUrl: params.returnUrl,
    cancelUrl: params.cancelUrl,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  });
}

export async function getPaymentStatus(requestId: number): Promise<GetnetPaymentStatusResponse> {
  return postGetnet<GetnetPaymentStatusResponse>(`/api/session/${requestId}`, {
    auth: buildGetnetAuth(),
  });
}

export async function reversePayment(internalReference: string): Promise<GetnetReversePaymentResponse> {
  return postGetnet<GetnetReversePaymentResponse>("/api/reverse", {
    auth: buildGetnetAuth(),
    internalReference,
  });
}
