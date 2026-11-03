import { z } from "zod";

export const SubscribeNewsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Ingresa tu correo.")
    .max(254, "El correo es demasiado largo.")
    .email("Ingresa un correo válido."),
  // Honeypot: un humano nunca lo completa.
  website: z.string().optional(),
  source: z.string().trim().max(40).optional(),
});

export type SubscribeNewsletterInput = z.infer<typeof SubscribeNewsletterSchema>;
