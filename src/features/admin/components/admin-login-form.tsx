"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "class-variance-authority";
import { useForm } from "react-hook-form";

import { useToast } from "@/shared/hooks";

import { AdminLoginSchema, type AdminLoginInput } from "../schemas";

type AdminLoginFormProps = {
  nextPath?: string;
};

function MailIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m3 7 9 6 9-6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  if (off) {
    return (
      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 3l18 18M10.6 10.7A3 3 0 0 0 14.8 15m3.7 1.9A11.4 11.4 0 0 1 12 19c-7 0-11-7-11-7a20 20 0 0 1 5.1-5.9M9.5 4.6A10.8 10.8 0 0 1 12 4c7 0 11 8 11 8a20.7 20.7 0 0 1-2.3 3.2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" fill="currentColor" r="2.5" />
    </svg>
  );
}

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: AdminLoginInput) {
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        const message = payload?.message ?? "No se pudo iniciar sesión.";
        setErrorMessage(message);
        toast({ message, variant: "error" });
        return;
      }

      toast({ message: "Acceso verificado. Redirigiendo al panel..." });
      window.location.href = nextPath ?? "/admin";
    } catch {
      const message = "Ocurrió un error de red. Intenta nuevamente.";
      setErrorMessage(message);
      toast({ message, variant: "error" });
    }
  }

  return (
    <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", background: "var(--beige)", borderRadius: "var(--radius-lg)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)", padding: "2.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-castoro)", fontSize: "28px", color: "var(--text)", letterSpacing: "-0.02em", fontWeight: 400 }}>Ingresar</h1>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--text-light)", marginBottom: "1.5rem", marginTop: "4px" }}>Acceso restringido al equipo interno</p>

      {errorMessage ? (
        <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px", borderRadius: "var(--radius-md)", border: "1px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.06)", padding: "10px 14px", fontSize: "12px", color: "var(--error, #dc2626)" }}>
          <svg aria-hidden="true" style={{ width: "14px", height: "14px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} onSubmit={form.handleSubmit(onSubmit)}>
        <label style={{ display: "block" }}>
          <span style={{ marginBottom: "6px", display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
            Correo Electrónico
          </span>
          <span style={{ position: "relative", display: "block" }}>
            <input
              className={cx(
                "w-full border text-sm text-text outline-none transition-all duration-200 placeholder:text-text-light focus:border-gold focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,186,30,0.1)]",
                errors.email ? "border-error" : "border-border",
              )}
              style={{ borderRadius: "var(--radius-lg)", paddingLeft: "14px", paddingRight: "40px", paddingTop: "10px", paddingBottom: "10px", background: "var(--beige-warm)", width: "100%" }}
              id="email"
              placeholder="admin@crecerlibreria.cl"
              type="email"
              {...form.register("email")}
            />
            <span style={{ pointerEvents: "none", position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }}>
              <MailIcon />
            </span>
          </span>
          {errors.email ? <span style={{ marginTop: "4px", display: "block", fontSize: "11px", color: "var(--error, #dc2626)" }}>{errors.email.message}</span> : null}
        </label>

        <label style={{ display: "block" }}>
          <span style={{ marginBottom: "6px", display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
            Contraseña
          </span>
          <span style={{ position: "relative", display: "block" }}>
            <input
              className={cx(
                "w-full border text-sm text-text outline-none transition-all duration-200 placeholder:text-text-light focus:border-gold focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,186,30,0.1)]",
                errors.password ? "border-error" : "border-border",
              )}
              style={{ borderRadius: "var(--radius-lg)", paddingLeft: "14px", paddingRight: "40px", paddingTop: "10px", paddingBottom: "10px", background: "var(--beige-warm)", width: "100%" }}
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
            />
            <button
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", padding: 0 }}
              onClick={() => setShowPassword((prev) => !prev)}
              type="button"
            >
              <EyeIcon off={showPassword} />
            </button>
          </span>
          {errors.password ? (
            <span style={{ marginTop: "4px", display: "block", fontSize: "11px", color: "var(--error, #dc2626)" }}>{errors.password.message}</span>
          ) : null}
        </label>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-light)" }}>
            <input className="accent-moss" type="checkbox" />
            <span>Recordarme</span>
          </label>
          <span style={{ fontSize: "12px", color: "var(--gold)" }}>Acceso seguro</span>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "14px", paddingBottom: "14px", background: "var(--gold)", color: "white", border: "none", borderRadius: "var(--radius-xl)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, transition: "background 0.2s" }}
        >
          {isSubmitting ? "Verificando..." : "Ingresar"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "11px", color: "var(--text-light)" }}>
        <span style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        Acceso seguro · SSL
        <span style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </p>
    </div>
  );
}
