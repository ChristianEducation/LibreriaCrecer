CREATE TABLE "selection_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"period_label" text,
	"title" text,
	"body" text,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"auto_saved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
