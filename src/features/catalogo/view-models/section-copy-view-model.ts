import { type LandingSectionKey } from "@/shared/config/landing";

import { getSectionCopy } from "../services/landing-service";

export type SectionCopyViewModel = {
  eyebrow: string | null;
  title: string | null;
  body: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

const EMPTY_SECTION_COPY: SectionCopyViewModel = {
  eyebrow: null,
  title: null,
  body: null,
  ctaLabel: null,
  ctaHref: null,
};

export async function getSectionCopyViewModel(
  key: LandingSectionKey,
): Promise<SectionCopyViewModel> {
  const row = await getSectionCopy(key).catch(() => null);

  if (!row) {
    return EMPTY_SECTION_COPY;
  }

  return {
    eyebrow: row.eyebrow,
    title: row.title,
    body: row.body,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
  };
}
