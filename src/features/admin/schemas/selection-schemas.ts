import { z } from "zod";

// Sin `.transform` ni `.default`: así un campo ausente sigue ausente y no se pisa al
// actualizar. El servicio convierte los textos vacíos en null.
const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const SelectionSnapshotItemSchema = z.object({
  productId: z.string().uuid(),
  description: optionalText(1000),
});

export const CreateSelectionSnapshotSchema = z.discriminatedUnion("action", [
  // Guarda la selección que está publicada hoy en el historial.
  z.object({ action: z.literal("archive_current"), periodLabel: optionalText(80) }),
  // Crea un borrador copiando la selección publicada.
  z.object({ action: z.literal("draft_from_current"), periodLabel: optionalText(80) }),
  // Crea un borrador vacío.
  z.object({ action: z.literal("blank_draft"), periodLabel: optionalText(80) }),
  // Copia una selección del historial (o un borrador) como borrador nuevo.
  z.object({ action: z.literal("duplicate"), sourceId: z.string().uuid() }),
]);

export const UpdateSelectionSnapshotSchema = z.object({
  periodLabel: optionalText(80),
  title: optionalText(160),
  body: optionalText(2000),
  items: z.array(SelectionSnapshotItemSchema).max(60).optional(),
});

export type CreateSelectionSnapshotInput = z.infer<typeof CreateSelectionSnapshotSchema>;
export type UpdateSelectionSnapshotInput = z.infer<typeof UpdateSelectionSnapshotSchema>;
