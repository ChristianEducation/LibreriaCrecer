CREATE TABLE "landing_section_copy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_key" text NOT NULL,
	"eyebrow" text,
	"title" text,
	"body" text,
	"cta_label" text,
	"cta_href" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "landing_section_copy_section_key_unique" UNIQUE ("section_key")
);
