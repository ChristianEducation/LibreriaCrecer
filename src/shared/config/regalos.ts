// Ocasiones de "Regalos con intención". Los productos de cada una se asignan
// desde el admin y viven en `featured_products` con section = `gift_<slug>`.
// El orden de este arreglo es el orden en el home y en /regalos.
// Las tarjetas muestran solo el nombre del sacramento u ocasión (`phrase`).

export const GIFT_SECTION_PREFIX = "gift_";

export const GIFTS_TAGLINE = "Un detalle que acompaña";

// Imagen panorámica del encabezado de /regalos cuando no hay una ocasión elegida.
export const GIFTS_HERO_DEFAULT_IMAGE = "/images/regalos/encabezados/todas.jpg";

export type GiftOccasion = {
  slug: string;
  label: string;
  phrase: string;
  description: string;
  // Ruta pública de la imagen de la tarjeta.
  imageUrl: string | null;
  // Imagen panorámica del encabezado de /regalos cuando esta ocasión está elegida.
  heroImageUrl: string | null;
  // Ocasión de temporada: solo se muestra si el interruptor del admin está encendido.
  seasonal?: boolean;
};

export const GIFT_OCCASIONS: readonly GiftOccasion[] = [
  {
    slug: "bautizo",
    label: "Bautizo",
    phrase: "Bautizo",
    description: "Recuerdos y regalos para celebrar el inicio de una vida en la fe.",
    imageUrl: "/images/regalos/bautizo.jpg",
    heroImageUrl: "/images/regalos/encabezados/bautizo.jpg",
  },
  {
    slug: "eucaristia",
    label: "Eucaristía",
    phrase: "Eucaristía",
    description: "Detalles para la primera comunión y el encuentro con Jesús Eucaristía.",
    imageUrl: "/images/regalos/eucaristia.jpg",
    heroImageUrl: "/images/regalos/encabezados/eucaristia.jpg",
  },
  {
    slug: "confirmacion",
    label: "Confirmación",
    phrase: "Confirmación",
    description: "Regalos para quien fortalece su fe y recibe el don del Espíritu.",
    imageUrl: "/images/regalos/confirmacion.jpg",
    heroImageUrl: "/images/regalos/encabezados/confirmacion.jpg",
  },
  {
    slug: "matrimonio",
    label: "Matrimonio",
    phrase: "Matrimonio",
    description: "Ideas para acompañar a quienes comienzan una vida en común.",
    imageUrl: "/images/regalos/matrimonio.jpg",
    heroImageUrl: "/images/regalos/encabezados/matrimonio.jpg",
  },
  {
    slug: "licenciaturas",
    label: "Licenciaturas",
    phrase: "Licenciaturas",
    description: "Libros y agendas para celebrar un logro y los pasos que vienen.",
    imageUrl: "/images/regalos/licenciaturas.jpg",
    heroImageUrl: "/images/regalos/encabezados/licenciaturas.jpg",
  },
  {
    slug: "flores",
    label: "Flores",
    phrase: "Flores",
    description: "Flores para distintas ocasiones, alegres o de acompañamiento.",
    imageUrl: "/images/regalos/flores.jpg",
    heroImageUrl: "/images/regalos/encabezados/flores.jpg",
  },
  {
    slug: "navidad",
    label: "Navidad",
    phrase: "Navidad",
    description: "Pesebres, Biblias y detalles para vivir la Navidad en familia.",
    imageUrl: "/images/regalos/navidad.jpg",
    heroImageUrl: "/images/regalos/encabezados/navidad.jpg",
    seasonal: true,
  },
  {
    slug: "cualquier-ocasion",
    label: "Cualquier ocasión",
    phrase: "Cualquier ocasión",
    description: "Ideas para regalar en cualquier momento, sin esperar una fecha especial.",
    imageUrl: "/images/regalos/cualquier-ocasion.jpg",
    heroImageUrl: "/images/regalos/encabezados/cualquier-ocasion.jpg",
  },
] as const;

export function giftSection(slug: string) {
  return `${GIFT_SECTION_PREFIX}${slug}`;
}

export function findGiftOccasion(slug: string | undefined | null) {
  if (!slug) return null;
  return GIFT_OCCASIONS.find((occasion) => occasion.slug === slug) ?? null;
}

// Rangos de precio del filtro de /regalos (CLP, precio efectivo).
export const GIFT_PRICE_RANGES = [
  { value: "hasta-10000", label: "Hasta $10.000", min: undefined, max: 10000 },
  { value: "10000-25000", label: "$10.000 a $25.000", min: 10000, max: 25000 },
  { value: "25000-50000", label: "$25.000 a $50.000", min: 25000, max: 50000 },
  { value: "desde-50000", label: "Más de $50.000", min: 50000, max: undefined },
] as const;

export function findGiftPriceRange(value: string | undefined | null) {
  if (!value) return null;
  return GIFT_PRICE_RANGES.find((range) => range.value === value) ?? null;
}
