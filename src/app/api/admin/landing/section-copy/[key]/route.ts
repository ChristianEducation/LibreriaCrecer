import { NextResponse } from "next/server";

import { UpdateLandingSectionCopySchema } from "@/features/admin/schemas/landing-schemas";
import {
  getSectionCopyByKey,
  upsertSectionCopy,
} from "@/features/admin/services/landing-admin-service";
import { isLandingSectionKey } from "@/shared/config/landing";

type Params = { key: string };

export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { key } = await context.params;

    if (!isLandingSectionKey(key)) {
      return NextResponse.json(
        { error: "validation_error", message: "Unknown section key." },
        { status: 400 },
      );
    }

    const row = await getSectionCopyByKey(key);
    return NextResponse.json({ data: row });
  } catch (error) {
    console.error("GET /api/admin/landing/section-copy/[key] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load section copy." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { key } = await context.params;

    if (!isLandingSectionKey(key)) {
      return NextResponse.json(
        { error: "validation_error", message: "Unknown section key." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = UpdateLandingSectionCopySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid section copy payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const row = await upsertSectionCopy(key, parsed.data);
    return NextResponse.json({ data: row });
  } catch (error) {
    console.error("PUT /api/admin/landing/section-copy/[key] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not save section copy." },
      { status: 500 },
    );
  }
}
