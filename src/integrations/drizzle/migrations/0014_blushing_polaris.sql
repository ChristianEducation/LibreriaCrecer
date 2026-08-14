ALTER TABLE "hero_slides" ALTER COLUMN "text_position" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "hero_slides" ALTER COLUMN "text_position" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "content_position" text DEFAULT 'middle-left' NOT NULL;