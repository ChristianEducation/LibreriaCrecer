-- NOTA PARA CHRISTIAN (PASO MANUAL DE STORAGE):
-- Crear bucket público `encounters` en Supabase Storage (límite 10 MB por archivo, como `banners`).
-- Política de lectura pública anon; escritura solo service role.
-- (Hereda el patrón actual de uploads; la migración de seguridad a service-role key es una sesión aparte y NO entra acá.)

CREATE TABLE IF NOT EXISTS "encounters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"event_date" date NOT NULL,
	"excerpt" text,
	"description" text,
	"cover_image_url" text NOT NULL,
	"video_url" text,
	"location" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "encounters_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "encounter_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"encounter_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "encounter_images" ADD CONSTRAINT "encounter_images_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "encounter_images_encounter_id_idx" ON "encounter_images" ("encounter_id");
