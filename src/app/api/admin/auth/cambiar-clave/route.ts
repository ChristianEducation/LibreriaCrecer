import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { ChangePasswordSchema } from "@/features/admin/schemas";
import { updateAdminPassword, verifyToken } from "@/features/admin/services/auth-service";

export async function PUT(request: Request) {
  try {
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session) {
      return NextResponse.json(
        { error: "unauthorized", message: "Not authenticated." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = ChangePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid password payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updated = await updateAdminPassword(session.adminId, parsed.data.newPassword);

    if (!updated) {
      return NextResponse.json(
        { error: "not_found", message: "Admin not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("PUT /api/admin/auth/cambiar-clave failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update password." },
      { status: 500 },
    );
  }
}
