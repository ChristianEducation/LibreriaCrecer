import { unsubscribeFromNewsletter } from "@/features/newsletter/services/newsletter-service";

function buildPage(title: string, message: string, status: number) {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>${title}</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f3e8;font-family:Georgia,serif;color:#3a3001;">
  <main style="max-width:420px;margin:24px;padding:36px 32px;background:#faf9f4;border:1px solid rgba(115,96,2,0.13);border-radius:12px;text-align:center;">
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:normal;color:#736002;">${title}</h1>
    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#6b5a04;">${message}</p>
    <a href="/" style="display:inline-block;padding:12px 22px;background:#c8a830;border-radius:6px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#3a3001;text-decoration:none;">Volver a la tienda</a>
  </main>
</body>
</html>`;

  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("token") ?? "";
    const done = await unsubscribeFromNewsletter(token);

    if (!done) {
      return buildPage(
        "Enlace no válido",
        "No encontramos esta suscripción. Es posible que ya te hayas dado de baja.",
        404,
      );
    }

    return buildPage("Listo, te diste de baja", "No volverás a recibir correos de novedades de Crecer Librería.", 200);
  } catch (error) {
    console.error("GET /api/newsletter/baja failed", error);
    return buildPage("Ocurrió un problema", "No pudimos procesar tu solicitud. Intenta nuevamente más tarde.", 500);
  }
}
