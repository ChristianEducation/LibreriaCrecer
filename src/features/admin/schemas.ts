import { z } from "zod";

export const AdminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const ChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
    .regex(/[0-9]/, "Debe incluir al menos un número"),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
