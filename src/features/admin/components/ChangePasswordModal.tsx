"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "class-variance-authority";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/shared/hooks";

import { ChangePasswordSchema } from "../schemas";

const FormSchema = ChangePasswordSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormInput = z.infer<typeof FormSchema>;

export interface ChangePasswordModalProps {
  initiallyOpen: boolean;
}

export function ChangePasswordModal({ initiallyOpen }: ChangePasswordModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(initiallyOpen);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  if (!open) {
    return null;
  }

  async function onSubmit(values: FormInput) {
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/auth/cambiar-clave", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: values.newPassword }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        const message = payload?.message ?? "No se pudo actualizar la contraseña.";
        setErrorMessage(message);
        toast({ message, variant: "error" });
        return;
      }

      toast({ message: "Contraseña actualizada correctamente.", variant: "success" });
      setOpen(false);
      router.refresh();
    } catch {
      const message = "Ocurrió un error de red. Intenta nuevamente.";
      setErrorMessage(message);
      toast({ message, variant: "error" });
    }
  }

  async function handleDontAskAgain() {
    setIsDismissing(true);

    try {
      const response = await fetch("/api/admin/auth/omitir-recordatorio-clave", {
        method: "PATCH",
      });

      if (!response.ok) {
        toast({ message: "No se pudo guardar la preferencia.", variant: "error" });
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setIsDismissing(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "rgba(58,48,1,0.45)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "var(--beige)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          padding: "2rem",
        }}
      >
        <h2
          id="change-password-title"
          style={{
            marginBottom: "6px",
            fontFamily: "var(--font-serif)",
            fontSize: "22px",
            fontWeight: 400,
            color: "var(--text)",
          }}
        >
          Actualiza tu contraseña
        </h2>
        <p style={{ marginBottom: "20px", fontSize: "13px", lineHeight: 1.5, color: "var(--text-light)" }}>
          Por seguridad, te recomendamos cambiar la contraseña temporal por una propia.
        </p>

        {errorMessage ? (
          <div
            style={{
              marginBottom: "1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(220,38,38,0.2)",
              background: "rgba(220,38,38,0.06)",
              padding: "10px 14px",
              fontSize: "12px",
              color: "var(--error, #dc2626)",
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={form.handleSubmit(onSubmit)}>
          <label style={{ display: "block" }}>
            <span
              style={{
                marginBottom: "6px",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-light)",
              }}
            >
              Nueva contraseña
            </span>
            <input
              className={cx(
                "w-full border bg-white text-sm text-text outline-none transition-all duration-200 focus:border-gold focus:shadow-[0_0_0_3px_rgba(200,168,48,0.12)]",
                errors.newPassword ? "border-error" : "border-border",
              )}
              style={{ borderRadius: "var(--radius-md)", padding: "10px 14px", width: "100%" }}
              type="password"
              {...form.register("newPassword")}
            />
            {errors.newPassword ? (
              <span style={{ marginTop: "4px", display: "block", fontSize: "11px", color: "var(--error, #dc2626)" }}>
                {errors.newPassword.message}
              </span>
            ) : (
              <span style={{ marginTop: "4px", display: "block", fontSize: "11px", color: "var(--text-light)" }}>
                Mínimo 8 caracteres, con una mayúscula y un número.
              </span>
            )}
          </label>

          <label style={{ display: "block" }}>
            <span
              style={{
                marginBottom: "6px",
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-light)",
              }}
            >
              Confirmar contraseña
            </span>
            <input
              className={cx(
                "w-full border bg-white text-sm text-text outline-none transition-all duration-200 focus:border-gold focus:shadow-[0_0_0_3px_rgba(200,168,48,0.12)]",
                errors.confirmPassword ? "border-error" : "border-border",
              )}
              style={{ borderRadius: "var(--radius-md)", padding: "10px 14px", width: "100%" }}
              type="password"
              {...form.register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <span style={{ marginTop: "4px", display: "block", fontSize: "11px", color: "var(--error, #dc2626)" }}>
                {errors.confirmPassword.message}
              </span>
            ) : null}
          </label>

          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                flex: 1,
                padding: "11px",
                background: "transparent",
                color: "var(--text-light)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
              type="button"
            >
              Ahora no
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              style={{
                flex: 1,
                padding: "11px",
                background: "var(--gold)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>

        <button
          disabled={isDismissing}
          onClick={handleDontAskAgain}
          style={{
            display: "block",
            width: "100%",
            marginTop: "14px",
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "11px",
            color: "var(--text-light)",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            cursor: isDismissing ? "not-allowed" : "pointer",
            opacity: isDismissing ? 0.6 : 1,
          }}
          type="button"
        >
          {isDismissing ? "Guardando preferencia..." : "No volver a preguntar"}
        </button>
      </div>
    </div>
  );
}
