import { NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "covers.openlibrary.org",
  "books.google.com",
  "books.googleusercontent.com",
  "buscalibre.cl",
  "buscalibre.com",
  "sanpablochile.cl",
  "paulinas.cl",
  "antartica.cl",
  "amazon.com",
  "amazon.es",
  "casadellibro.com",
  "todostuslibros.com",
  "goodreads.com",
  "mercadolibre.cl",
  "agape.cl"
];

function isHostAllowed(hostname: string): boolean {
  if (ALLOWED_HOSTS.includes(hostname)) return true;
  if (hostname.endsWith(".googleusercontent.com")) return true;
  
  // Para los sitios de la lista, también permitimos sus subdominios (ej. www.buscalibre.cl, images.amazon.com)
  for (const host of ALLOWED_HOSTS) {
    if (hostname.endsWith(`.${host}`)) return true;
  }
  
  return false;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "validation_error", message: "Se requiere el parámetro url." },
        { status: 400 },
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "validation_error", message: "URL inválida." },
        { status: 400 },
      );
    }

    if (!isHostAllowed(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: "validation_error", message: "Host no permitido." },
        { status: 400 },
      );
    }

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: "upstream_error", message: "No se pudo descargar la imagen." },
        { status: 502 },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "upstream_error", message: "La respuesta no es una imagen." },
        { status: 502 },
      );
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/productos/portada-proxy failed", error);
    return NextResponse.json(
      { error: "upstream_error", message: "No se pudo descargar la imagen." },
      { status: 502 },
    );
  }
}
