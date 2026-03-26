import { and, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { banners } from "@/integrations/drizzle/schema";

import { TopBannerClient } from "./TopBannerClient";

export async function TopBanner() {
  const topBanner = await db
    .select()
    .from(banners)
    .where(and(eq(banners.isActive, true), eq(banners.position, "top_banner")))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!topBanner) return null;

  if (!topBanner.title) return null;

  return (
    <TopBannerClient
      description={topBanner.description}
      linkUrl={topBanner.linkUrl}
      title={topBanner.title}
    />
  );
}
