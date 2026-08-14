ALTER TABLE "hero_slides" ADD COLUMN "cta_mode" text DEFAULT 'button' NOT NULL;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "hotspot_x" integer;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "hotspot_y" integer;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "hotspot_width" integer;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "hotspot_height" integer;