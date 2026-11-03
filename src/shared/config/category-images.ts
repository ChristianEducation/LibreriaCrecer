// Imágenes por defecto de las categorías. Se usan solo cuando la categoría no
// tiene `imageUrl` propia: subir una imagen desde el admin siempre tiene prioridad.

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  santos: "/images/categorias/santos.jpg",
  tarjetas: "/images/categorias/tarjetas.jpg",
  espiritualidad: "/images/categorias/espiritualidad.jpg",
  eclesial: "/images/categorias/eclesial.jpg",
  "teologia-filosofia-antropologia": "/images/categorias/teologia-filosofia-antropologia.jpg",
  "virgen-maria": "/images/categorias/virgen-maria.jpg",
  "pastoral-y-sacramentos": "/images/categorias/pastoral-y-sacramentos.jpg",
  "psicologia-y-autoayuda": "/images/categorias/psicologia-y-autoayuda.jpg",
  "biblia-liturgia": "/images/categorias/biblia-liturgia.jpg",
  "narrativa-testimonios-biografias": "/images/categorias/narrativa-testimonios-biografias.jpg",
  "educacion-familia-otros": "/images/categorias/educacion-familia-otros.jpg",
  historia: "/images/categorias/historia.jpg",
  "artesania-religiosa": "/images/categorias/artesania-religiosa.jpg",
  regalos: "/images/categorias/regalos.jpg",
  "padre-hurtado": "/images/categorias/padre-hurtado.jpg",
};

export function getCategoryImage(slug: string, imageUrl?: string | null): string | null {
  return imageUrl ?? DEFAULT_CATEGORY_IMAGES[slug] ?? null;
}

// Imagen panorámica del encabezado de /productos. Se usa solo si la categoría no tiene
// `headerImageUrl` propia (la que se sube desde el admin tiene prioridad).
export const COLLECTION_HERO_DEFAULT_IMAGE = "/images/categorias/encabezados/todas.jpg";

const DEFAULT_CATEGORY_HEADERS: Record<string, string> = Object.fromEntries(
  Object.keys(DEFAULT_CATEGORY_IMAGES).map((slug) => [slug, `/images/categorias/encabezados/${slug}.jpg`]),
);

export function getCategoryHeaderImage(slug: string | null | undefined, headerImageUrl?: string | null): string {
  if (headerImageUrl) return headerImageUrl;
  if (slug && DEFAULT_CATEGORY_HEADERS[slug]) return DEFAULT_CATEGORY_HEADERS[slug];
  return COLLECTION_HERO_DEFAULT_IMAGE;
}
