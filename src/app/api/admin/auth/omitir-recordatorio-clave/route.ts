import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { dismissMustChangePassword, verifyToken } from "@/features/admin/services/auth-service";

export async function PATCH() {
  try {
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session) {
      return NextResponse.json(
        { error: "unauthorized", message: "Not authenticated." },
        { status: 401 },
      );
    }

    const updated = await dismissMustChangePassword(session.adminId);

    if (!updated) {
      return NextResponse.json(
        { error: "not_found", message: "Admin not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("PATCH /api/admin/auth/omitir-recordatorio-clave failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update reminder preference." },
      { status: 500 },
    );
  }
}
