import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type SelectionSnapshotStatus = "draft" | "archived";

export type SelectionSnapshotItem = {
  productId: string;
  description?: string | null;
};

// Registro interno de "Selección Crecer": borradores (preparados sin publicar) e
// historial (selecciones que ya estuvieron o que se guardaron). La selección vigente
// NO vive aquí: sigue en `featured_products` (section = monthly_selection) y su texto en
// `landing_section_copy` (clave libros_mes), que es lo que lee la tienda.
export const selectionSnapshots = pgTable("selection_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: text("status").$type<SelectionSnapshotStatus>().notNull().default("draft"),
  // Nombre libre para reconocerla, por ejemplo "Octubre 2026".
  periodLabel: text("period_label"),
  title: text("title"),
  body: text("body"),
  // Productos en su orden. Solo guarda el id y, si existe, el texto editorial.
  items: jsonb("items").$type<SelectionSnapshotItem[]>().notNull().default([]),
  // true cuando el respaldo se creó solo al publicar otra selección.
  autoSaved: boolean("auto_saved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
