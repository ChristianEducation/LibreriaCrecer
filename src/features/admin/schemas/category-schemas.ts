import { z } from "zod";

const nullableString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

export const CreateCategorySchema = z.object({
  name: z.string().trim().min(1),
  description: nullableString,
  parentId: z.string().uuid().optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
