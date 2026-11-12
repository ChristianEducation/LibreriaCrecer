import { sql } from "drizzle-orm";

import { products } from "@/integrations/drizzle/schema";

/**
 * Columnas de imagen para las consultas del catálogo público.
 *
 * - `mainImageUrl`: imagen "de vitrina": la de estudio (`studio_image_url`) si existe, si no la original.
 * - `originalImageUrl`: siempre la portada original (`main_image_url`).
 * - `hasStudioImage`: true cuando `mainImageUrl` es la imagen de estudio (formato 2:3 con fondo propio).
 *
 * El admin sigue leyendo `main_image_url` directamente: la imagen de estudio es derivada y se puede
 * quitar (poniendo `studio_image_url` en NULL) sin perder la portada original.
 */
export const catalogImageColumns = {
  mainImageUrl: sql<string | null>`coalesce(${products.studioImageUrl}, ${products.mainImageUrl})`,
  originalImageUrl: products.mainImageUrl,
  hasStudioImage: sql<boolean>`${products.studioImageUrl} is not null`,
};
