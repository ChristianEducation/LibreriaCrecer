import {
  type HeroContentTheme,
  type HeroOverlayVariant,
  type HeroTextAlign,
  type HeroTextPosition,
} from "@/shared/config/landing";

import { getHeroSlides, getSectionCopy } from "../services/landing-service";

export type HeroOverlayVariantViewModel = "none" | "gradient" | "dark";

export type HeroSlideViewModel = {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  linkUrl: string | null;
  showContent: boolean;
  textPosition: HeroTextPosition;
  textAlign: HeroTextAlign;
  overlayVariant: HeroOverlayVariantViewModel;
  overlayOpacity: number;
  contentTheme: HeroContentTheme;
};

export type HeroViewModel = {
  eyebrow: string | null;
  title: string | null;
  body: string | null;
  slides: HeroSlideViewModel[];
};

function mapOverlayVariant(value: HeroOverlayVariant): HeroOverlayVariantViewModel {
  switch (value) {
    case "none":
      return "none";
    case "gradient":
      return "gradient";
    case "solid":
      return "dark";
  }
}

export async function getHeroViewModel(): Promise<HeroViewModel> {
  const [slidesRows, copy] = await Promise.all([
    getHeroSlides(),
    getSectionCopy("hero"),
  ]);

  const slides: HeroSlideViewModel[] = slidesRows.map((slide) => ({
    id: slide.id,
    imageUrl: slide.imageUrl,
    title: slide.title,
    subtitle: slide.subtitle,
    ctaText: slide.ctaText,
    linkUrl: slide.linkUrl,
    showContent: slide.showContent,
    textPosition: slide.textPosition,
    textAlign: slide.textAlign,
    overlayVariant: mapOverlayVariant(slide.overlayVariant),
    overlayOpacity: slide.overlayOpacity,
    contentTheme: slide.contentTheme,
  }));

  return {
    eyebrow: copy?.eyebrow ?? null,
    title: copy?.title ?? null,
    body: copy?.body ?? null,
    slides,
  };
}
