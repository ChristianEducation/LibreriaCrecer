ALTER TABLE "hero_slides"
ADD COLUMN "mobile_image_url" text;
-- No backfill necesario: null = fallback a imageUrl (comportamiento actual).
