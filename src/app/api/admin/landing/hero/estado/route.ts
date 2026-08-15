import { NextResponse } from "next/server";

import { getHeroSlidesChangeSignal } from "@/features/admin/services/landing-admin-service";

export async function GET() {
  try {
    const signal = await getHeroSlidesChangeSignal();
    return NextResponse.json({ data: { signal } });
  } catch (error) {
    console.error("GET /api/admin/landing/hero/estado failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load hero change signal." },
      { status: 500 },
    );
  }
}
