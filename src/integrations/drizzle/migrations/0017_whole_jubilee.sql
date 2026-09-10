ALTER TABLE "orders" ADD COLUMN "chilexpress_package_weight_grams" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "chilexpress_package_height_cm" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "chilexpress_package_width_cm" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "chilexpress_package_length_cm" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "chilexpress_package_id" uuid;--> statement-breakpoint
ALTER TABLE "shipping_config" ADD COLUMN "origin_street" text;--> statement-breakpoint
ALTER TABLE "shipping_config" ADD COLUMN "origin_street_number" text;--> statement-breakpoint
ALTER TABLE "shipping_config" ADD COLUMN "origin_supplement" text;--> statement-breakpoint
ALTER TABLE "shipping_config" ADD COLUMN "sender_name" text;--> statement-breakpoint
ALTER TABLE "shipping_config" ADD COLUMN "sender_phone" text;--> statement-breakpoint
ALTER TABLE "shipping_config" ADD COLUMN "sender_email" text;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_chilexpress_package_id_shipping_packages_id_fk" FOREIGN KEY ("chilexpress_package_id") REFERENCES "public"."shipping_packages"("id") ON DELETE set null ON UPDATE no action;