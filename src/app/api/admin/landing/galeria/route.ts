import { NextResponse } from "next/server";

import { deleteBannerFromGallery, getBannerGallery } from "@/features/admin/services/landing-admin-service";

export async function GET() {
  try {
    const gallery = await getBannerGallery();
    return NextResponse.json({ data: gallery });
  } catch (error) {
    console.error("GET /api/admin/landing/galeria failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Error al cargar la galería de imágenes." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "bad_request", message: "Se requiere el path de la imagen." }, { status: 400 });
    }

    const deleted = await deleteBannerFromGallery(path);
    if (!deleted) {
      return NextResponse.json({ error: "not_found", message: "Imagen no encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("DELETE /api/admin/landing/galeria failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: error instanceof Error ? error.message : "Error al eliminar la imagen." },
      { status: 500 },
    );
  }
}
