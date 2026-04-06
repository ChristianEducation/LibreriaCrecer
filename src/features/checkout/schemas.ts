import { z } from "zod";

export const createOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const createOrderCustomerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  phone: z.string().min(8),
});

export const createOrderAddressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  apartment: z.string().optional(),
  commune: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  zipCode: z.string().optional(),
  deliveryInstructions: z.string().optional(),
});

export const CreateOrderSchema = z
  .object({
    items: z.array(createOrderItemSchema).min(1),
    customer: createOrderCustomerSchema,
    deliveryMethod: z.enum(["pickup", "shipping"]),
    address: createOrderAddressSchema.optional(),
    couponCode: z.string().trim().min(1).optional(),
    notes: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "shipping" && !data.address) {
      ctx.addIssue({
        path: ["address"],
        code: z.ZodIssueCode.custom,
        message: "Address is required when deliveryMethod is 'shipping'.",
      });
    }
  });

export const ValidateCouponSchema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.number().int().min(1),
});

export const ValidateStockSchema = z.object({
  items: z.array(createOrderItemSchema).min(1),
});

export type CreateOrderSchemaInput = z.infer<typeof CreateOrderSchema>;
export type ValidateCouponSchemaInput = z.infer<typeof ValidateCouponSchema>;
export type ValidateStockSchemaInput = z.infer<typeof ValidateStockSchema>;
