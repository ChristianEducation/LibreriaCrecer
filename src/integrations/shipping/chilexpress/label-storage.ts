// Nota: sin `import "server-only"` — ese paquete no es resoluble bajo
// `node --import tsx --test` (rompe los tests unitarios) y no es la unica
// proteccion real aca: SUPABASE_SERVICE_ROLE_KEY nunca lleva prefijo
// NEXT_PUBLIC_, por lo que Next.js jamas lo inyecta en un bundle de cliente
// aunque este archivo se importara desde uno (cosa que hoy no ocurre: solo
// lo usan shipping-admin-service.ts y la API route de admin, ambos server-side).
import { createClient } from "@supabase/supabase-js";

import { detectLabelMimeType } from "./client";

/**
 * Bucket PRIVADO dedicado a etiquetas Chilexpress — no reutiliza los buckets
 * publicos de productos/banners/categorias (integrations/supabase/storage.ts).
 * La etiqueta contiene datos personales del destinatario (nombre, direccion),
 * por lo que nunca debe quedar accesible por URL publica permanente.
 *
 * Debe crearse manualmente en Supabase con `public = false`. Ver README del
 * proyecto / reporte de esta tarea para la configuracion exacta.
 */
const CHILEXPRESS_LABEL_BUCKET = "chilexpress-labels";
const SIGNED_URL_TTL_SECONDS = 300;

const LABEL_MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

let serviceRoleClient: ReturnType<typeof createClient> | null = null;

/**
 * Cliente con la Service Role Key — el unico capaz de subir/leer objetos de
 * un bucket privado sin depender de policies RLS para el rol `anon`. Nunca
 * debe usarse fuera de codigo server-only (esta protegido por "server-only"
 * arriba, y la key nunca lleva prefijo NEXT_PUBLIC_).
 */
function getServiceRoleClient() {
  if (serviceRoleClient) {
    return serviceRoleClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables (requeridas para Storage de etiquetas Chilexpress).",
    );
  }

  serviceRoleClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return serviceRoleClient;
}

export type StoredChilexpressLabel = {
  /** Path dentro del bucket — esto es lo unico que se guarda en orders.chilexpress_label_url. */
  path: string;
  mimeType: string;
};

export type LabelStoragePlan = {
  path: string;
  mimeType: string;
  bytes: Buffer;
};

/**
 * Logica pura: decide el path/mime/bytes a subir a partir del base64 crudo,
 * sin tocar la red. Separado de storeChilexpressLabel() para poder testear
 * que el path nunca contiene el base64 y que el mime type se detecta bien.
 */
export function buildLabelStoragePlan(params: {
  orderNumber: string;
  transportOrderNumber: string;
  labelData: string;
}): LabelStoragePlan | null {
  const trimmed = params.labelData.trim();
  if (!trimmed) {
    return null;
  }

  const mimeType = detectLabelMimeType(trimmed);
  const extension = LABEL_MIME_EXTENSIONS[mimeType] ?? "bin";
  const bytes = Buffer.from(trimmed, "base64");
  const path = `${params.orderNumber}/${params.transportOrderNumber}.${extension}`;

  return { path, mimeType, bytes };
}

/**
 * Decodifica label.labelData (base64 crudo) y lo sube al bucket privado.
 * Nunca devuelve ni persiste el base64/data URI completo — solo el path.
 */
export async function storeChilexpressLabel(params: {
  orderNumber: string;
  transportOrderNumber: string;
  labelData: string;
}): Promise<StoredChilexpressLabel | null> {
  const plan = buildLabelStoragePlan(params);
  if (!plan) {
    return null;
  }

  const client = getServiceRoleClient();
  const { error } = await client.storage.from(CHILEXPRESS_LABEL_BUCKET).upload(plan.path, plan.bytes, {
    contentType: plan.mimeType,
    upsert: true,
  });

  if (error) {
    throw new Error(`No se pudo guardar la etiqueta Chilexpress en Storage: ${error.message}`);
  }

  return { path: plan.path, mimeType: plan.mimeType };
}

/**
 * Signed URL temporal (5 minutos) para un path del bucket privado. Solo debe
 * llamarse desde rutas ya protegidas por el middleware de admin — nunca
 * exponer esta funcion a un endpoint publico.
 */
export async function getSignedChilexpressLabelUrl(path: string): Promise<string | null> {
  const client = getServiceRoleClient();
  const { data, error } = await client.storage
    .from(CHILEXPRESS_LABEL_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}

/**
 * Pedidos generados antes de este cambio guardaron un data URI (o, muy
 * excepcionalmente, una URL) completo en chilexpress_label_url en vez de un
 * path de Storage. Se detectan asi para que el admin siga pudiendo abrirlos.
 */
export function isLegacyLabelValue(value: string): boolean {
  return value.startsWith("data:") || /^https?:\/\//i.test(value);
}
