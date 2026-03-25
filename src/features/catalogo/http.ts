import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function okPaginated<T>(
  data: T,
  pagination: { page: number; limit: number; total: number; totalPages: number },
) {
  return NextResponse.json({ data, pagination });
}

export function badRequest(error: string, message?: string) {
  return NextResponse.json(
    {
      error,
      message: message ?? "Invalid request parameters.",
    },
    { status: 400 },
  );
}

export function notFound(message: string) {
  return NextResponse.json(
    {
      error: "not_found",
      message,
    },
    { status: 404 },
  );
}

export function serverError(message = "Unexpected server error.") {
  return NextResponse.json(
    {
      error: "internal_server_error",
      message,
    },
    { status: 500 },
  );
}

export function parsePositiveIntParam(
  value: string | null,
  fallback: number,
  fieldName: string,
): { value: number; error?: string } {
  if (!value) {
    return { value: fallback };
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { value: fallback, error: `Invalid '${fieldName}'. Expected a positive integer.` };
  }

  return { value: parsed };
}

export function parseBooleanParam(
  value: string | null,
  fallback: boolean,
  fieldName: string,
): { value: boolean; error?: string } {
  if (value === null) {
    return { value: fallback };
  }

  if (value === "true") {
    return { value: true };
  }

  if (value === "false") {
    return { value: false };
  }

  return { value: fallback, error: `Invalid '${fieldName}'. Expected 'true' or 'false'.` };
}
