ALTER TABLE "hero_slides"
ADD COLUMN "cta_position" text NOT NULL DEFAULT 'bottom-left',
ADD COLUMN "cta_bg_color" text,
ADD COLUMN "cta_text_color" text,
ADD COLUMN "cta_border_color" text;

-- Backfill: preservar EXACTO el look actual (dorado + texto blanco)
-- solo en slides que ya muestran botón.
UPDATE "hero_slides"
SET "cta_bg_color" = '#c8a830',
    "cta_text_color" = '#ffffff'
WHERE "cta_text" IS NOT NULL
  AND btrim("cta_text") <> ''
  AND "cta_bg_color" IS NULL;
