ALTER TABLE "hero_slides"
ADD COLUMN "cta_text" text,
ADD COLUMN "show_content" boolean NOT NULL DEFAULT true,
ADD COLUMN "text_position" text NOT NULL DEFAULT 'left',
ADD COLUMN "text_align" text NOT NULL DEFAULT 'left',
ADD COLUMN "overlay_variant" text NOT NULL DEFAULT 'gradient',
ADD COLUMN "overlay_opacity" integer NOT NULL DEFAULT 55,
ADD COLUMN "content_theme" text NOT NULL DEFAULT 'light';

UPDATE "hero_slides"
SET "cta_text" = 'Ver colección'
WHERE "link_url" IS NOT NULL
  AND btrim("link_url") <> ''
  AND "cta_text" IS NULL;