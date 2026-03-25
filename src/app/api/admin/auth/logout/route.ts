import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";

export async function POST() {
  const response = NextResponse.json({
    data: {
      success: true,
    },
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
