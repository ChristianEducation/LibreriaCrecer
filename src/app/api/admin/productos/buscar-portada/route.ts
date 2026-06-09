import { NextResponse } from "next/server";

import { searchCovers } from "@/features/admin/services/cover-search-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isbn = searchParams.get("isbn") ?? undefined;
    const titulo = searchParams.get("titulo") ?? undefined;
    const autor = searchParams.get("autor") ?? undefined;

    if (!isbn && !titulo) {
      return NextResponse.json(
        { error: "validation_error", message: "Se requiere al menos un ISBN o título para buscar." },
        { status: 400 },
      );
    }

    const candidates = await searchCovers({ isbn, title: titulo, author: autor });
    return NextResponse.json({ data: candidates });
  } catch (error) {
    console.error("GET /api/admin/productos/buscar-portada failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo buscar portadas." },
      { status: 500 },
    );
  }
}
