import { z } from "zod";

import { MONTHLY_SELECTION_SECTION, normalizeCuratedSection } from "@/shared/config/landing";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))
  .refine((value) => !value || /^https?:\/\//i.test(value), {
    message: "Invalid URL",
  });

const FooterBannerMetadataSchema = z.object({
  opacity: z.number().min(0).max(1),
  fadeStart: z.number().int().min(0).max(100),
  fadeEnd: z.number().int().min(0).max(100),
  imgWidth: z.number().int().min(0).max(100),
  artSpaceWidth: z.number().int().min(0).max(100),
});

export const HeroSlideSchema = z.object({
  title: optionalString,
  subtitle: optionalString,
  link_url: optionalUrl,
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const UpdateHeroSlideSchema = HeroSlideSchema.partial();

export const BannerSchema = z.object({
  title: optionalString,
  description: optionalString,
  link_url: optionalUrl,
  position: z.string().trim().min(1),
  metadata: FooterBannerMetadataSchema.optional(),
  is_active: z.boolean().default(true),
});

export const UpdateBannerSchema = BannerSchema.partial();

export const CuratedProductSchema = z.object({
  product_id: z.string().uuid(),
  section: z.string().trim().min(1).default(MONTHLY_SELECTION_SECTION).transform(normalizeCuratedSection),
  description: optionalString,
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const UpdateCuratedProductSchema = CuratedProductSchema.partial();

export type HeroSlideInput = z.infer<typeof HeroSlideSchema>;
export type UpdateHeroSlideInput = z.infer<typeof UpdateHeroSlideSchema>;
export type BannerInput = z.infer<typeof BannerSchema>;
export type UpdateBannerInput = z.infer<typeof UpdateBannerSchema>;
export type CuratedProductInput = z.infer<typeof CuratedProductSchema>;
export type UpdateCuratedProductInput = z.infer<typeof UpdateCuratedProductSchema>;
export type FooterBannerMetadataInput = z.infer<typeof FooterBannerMetadataSchema>;
