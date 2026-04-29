import { z } from "zod";

const nullableString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

export const CreateProductSchema = z.object({
  title: z.string().trim().min(1),
  author: nullableString,
  publisher: nullableString,
  description: nullableString,
  price: z.number().int().min(1),
  salePrice: z.number().int().min(1).optional(),
  code: nullableString,
  sku: nullableString,
  coverType: nullableString,
  pages: z.number().int().min(1).optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryIds: z.array(z.string().uuid()).default([]),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
