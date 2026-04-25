import { type BannerPosition, isBannerPosition } from "@/shared/config/landing";

import { getBanners } from "../services/landing-service";

export type BannerViewModel = {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  eyebrow: string | null;
  title: string | null;
  ctaLabel: string | null;
  position: BannerPosition;
};

export type BannersViewModel = {
  banners: BannerViewModel[];
};

export async function getBannersViewModel(position?: string): Promise<BannersViewModel> {
  const normalizedPosition =
    position && isBannerPosition(position) ? position : undefined;

  const rows = await getBanners(normalizedPosition);

  const banners: BannerViewModel[] = rows.map((row) => ({
    id: row.id,
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl,
    eyebrow: row.eyebrow,
    title: row.title,
    ctaLabel: row.ctaLabel,
    position: row.position,
  }));

  return { banners };
}
