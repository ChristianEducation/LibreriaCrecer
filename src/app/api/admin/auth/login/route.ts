import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, ADMIN_TOKEN_MAX_AGE_SECONDS } from "@/features/admin/constants";
import { AdminLoginSchema } from "@/features/admin/schemas";
import { login } from "@/features/admin/services/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = AdminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid login payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await login(parsed.data.email, parsed.data.password);
    if (!result) {
      return NextResponse.json(
        {
          error: "unauthorized",
          message: "Invalid credentials.",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      data: {
        admin: result.admin,
      },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_TOKEN_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("POST /api/admin/auth/login failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not process admin login.",
      },
      { status: 500 },
    );
  }
}
