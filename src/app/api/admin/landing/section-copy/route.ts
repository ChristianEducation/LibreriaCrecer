import { NextResponse } from "next/server";

import { getSectionCopies } from "@/features/admin/services/landing-admin-service";

export async function GET() {
  try {
    const items = await getSectionCopies();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("GET /api/admin/landing/section-copy failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load section copy." },
      { status: 500 },
    );
  }
}
