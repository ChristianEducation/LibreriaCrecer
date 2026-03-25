import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { getAdminById, verifyToken } from "@/features/admin/services/auth-service";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          error: "unauthorized",
          message: "Not authenticated.",
        },
        { status: 401 },
      );
    }

    const payload = await verifyToken(sessionToken);
    if (!payload) {
      return NextResponse.json(
        {
          error: "unauthorized",
          message: "Invalid or expired session.",
        },
        { status: 401 },
      );
    }

    const admin = await getAdminById(payload.adminId);
    if (!admin) {
      return NextResponse.json(
        {
          error: "unauthorized",
          message: "Admin not found.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      data: {
        admin,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/auth/me failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not get current admin.",
      },
      { status: 500 },
    );
  }
}
