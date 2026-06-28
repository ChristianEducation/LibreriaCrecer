import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))
  .refine((value) => !value || /^https?:\/\//i.test(value), {
    message: "Invalid URL",
  });

export const EncounterSchema = z.object({
  title: z.string().trim().min(1, "El título es requerido"),
  event_date: z.string().trim().min(1, "La fecha es requerida"),
  excerpt: optionalString,
  description: optionalString,
  video_url: optionalUrl,
  location: optionalString,
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const UpdateEncounterSchema = EncounterSchema.partial();

export const ReorderEncountersSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export const EncounterImageSchema = z.object({
  alt_text: optionalString,
});

export type EncounterInput = z.infer<typeof EncounterSchema>;
export type UpdateEncounterInput = z.infer<typeof UpdateEncounterSchema>;
export type ReorderEncountersInput = z.infer<typeof ReorderEncountersSchema>;
export type EncounterImageInput = z.infer<typeof EncounterImageSchema>;
