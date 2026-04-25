export const MONTHLY_SELECTION_SECTION = "monthly_selection";

const legacyMonthlySelectionSections = ["libros_mes", "liturgical_reading"] as const;

export const MONTHLY_SELECTION_SECTION_ALIASES = [
  MONTHLY_SELECTION_SECTION,
  ...legacyMonthlySelectionSections,
] as const;

export function isMonthlySelectionAlias(section: string) {
  return MONTHLY_SELECTION_SECTION_ALIASES.includes(
    section as (typeof MONTHLY_SELECTION_SECTION_ALIASES)[number],
  );
}

export function normalizeCuratedSection(section?: string) {
  if (!section) {
    return MONTHLY_SELECTION_SECTION;
  }

  return isMonthlySelectionAlias(section) ? MONTHLY_SELECTION_SECTION : section;
}

export const HERO_TEXT_POSITIONS = ["left", "center", "right"] as const;
export type HeroTextPosition = (typeof HERO_TEXT_POSITIONS)[number];
export const HERO_TEXT_POSITION_DEFAULT: HeroTextPosition = "left";

export const HERO_TEXT_ALIGNS = ["left", "center", "right"] as const;
export type HeroTextAlign = (typeof HERO_TEXT_ALIGNS)[number];
export const HERO_TEXT_ALIGN_DEFAULT: HeroTextAlign = "left";

export const HERO_OVERLAY_VARIANTS = ["gradient", "solid", "none"] as const;
export type HeroOverlayVariant = (typeof HERO_OVERLAY_VARIANTS)[number];
export const HERO_OVERLAY_VARIANT_DEFAULT: HeroOverlayVariant = "gradient";

export const HERO_CONTENT_THEMES = ["light", "dark"] as const;
export type HeroContentTheme = (typeof HERO_CONTENT_THEMES)[number];
export const HERO_CONTENT_THEME_DEFAULT: HeroContentTheme = "light";

export const HERO_OVERLAY_OPACITY_MIN = 0;
export const HERO_OVERLAY_OPACITY_MAX = 100;
export const HERO_OVERLAY_OPACITY_DEFAULT = 55;

export const BANNER_POSITIONS = [
  "top_banner",
  "hero_intermedio",
  "catalogo_header",
  "categories_panorama",
  "between_sections_1",
  "between_sections_2",
  "between_sections_3",
  "footer_illustration",
] as const;
export type BannerPosition = (typeof BANNER_POSITIONS)[number];

export function isBannerPosition(value: string): value is BannerPosition {
  return (BANNER_POSITIONS as readonly string[]).includes(value);
}

export const LANDING_SECTION_KEYS = [
  "hero",
  "libros_mes",
  "categorias",
  "instagram",
  "nosotros.hero",
  "nosotros.manifesto",
  "nosotros.cta",
] as const;
export type LandingSectionKey = (typeof LANDING_SECTION_KEYS)[number];

export function isLandingSectionKey(value: string): value is LandingSectionKey {
  return (LANDING_SECTION_KEYS as readonly string[]).includes(value);
}
