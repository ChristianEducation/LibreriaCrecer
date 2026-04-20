CREATE TABLE "footer_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_description" text,
	"catalog_links" text,
	"info_links" text,
	"address" text,
	"maps_url" text,
	"copyright_text" text,
	"design_credit" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
