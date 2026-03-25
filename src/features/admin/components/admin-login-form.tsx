"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useToast } from "@/shared/hooks";
import { Button } from "@/shared/ui";

import { AdminLoginSchema, type AdminLoginInput } from "../schemas";

type AdminLoginFormProps = {
  nextPath?: string;
};

function BrandCross() {
  return (
    <span className="relative block size-9">
      <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-gold" />
      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-gold" />
    </span>
  );
}

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
  const router = useRouter();
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
        const message = payload?.message ?? "No se pudo iniciar sesion.";
        setErrorMessage(message);
        toast({ message, variant: "error" });
        return;
      }

      toast({ message: "Acceso verificado. Redirigiendo al panel..." });
      router.push(nextPath || "/admin");
      router.refresh();
    } catch {
      const message = "Ocurrio un error de red. Intenta nuevamente.";
      setErrorMessage(message);
      toast({ message, variant: "error" });
    }
  }

  return (
    <div className="relative z-[1] w-full max-w-[400px] overflow-hidden rounded-[3px] bg-[#F8F5E6] shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
      <div className="relative bg-moss px-10 pb-7 pt-8 text-center">
        <div className="absolute inset-x-10 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(217,186,30,0.3),transparent)]" />
        <div className="mb-4 flex justify-center">
          <BrandCross />
        </div>
        <span className="block font-serif text-[20px] text-white">Crecer Libreria</span>
        <span className="text-[9px] uppercase tracking-[0.28em] text-gold">Panel de Administracion</span>
      </div>

      <div className="px-10 pb-10 pt-9">
        <h1 className="font-serif text-[22px] text-moss">Ingresar</h1>
        <p className="mb-7 mt-1 text-[12px] font-light text-text-light">Acceso restringido al equipo interno</p>

        {errorMessage ? (
          <div className="mb-5 flex items-center gap-2 rounded-[2px] border border-error/20 bg-error/8 px-[14px] py-[10px] text-[12px] text-error">
            <svg aria-hidden="true" className="size-[14px] shrink-0" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-[5px] block text-[10px] uppercase tracking-[0.18em] text-text-light">
              Correo electronico
            </span>
            <span className="relative block">
              <input
                className={cx(
                  "w-full rounded-[2px] border bg-beige px-[14px] py-[11px] pr-10 text-sm text-text outline-none transition-all duration-200 placeholder:text-text-light focus:border-gold focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,186,30,0.1)]",
                  errors.email ? "border-error" : "border-border",
                )}
                id="email"
                placeholder="admin@crecerlibreria.cl"
                type="email"
                {...form.register("email")}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-light">
                <MailIcon />
              </span>
            </span>
            {errors.email ? <span className="mt-1 block text-[11px] text-error">{errors.email.message}</span> : null}
          </label>

          <label className="block">
            <span className="mb-[5px] block text-[10px] uppercase tracking-[0.18em] text-text-light">
              Contrasena
            </span>
            <span className="relative block">
              <input
                className={cx(
                  "w-full rounded-[2px] border bg-beige px-[14px] py-[11px] pr-10 text-sm text-text outline-none transition-all duration-200 placeholder:text-text-light focus:border-gold focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,186,30,0.1)]",
                  errors.password ? "border-error" : "border-border",
                )}
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
              />
              <button
                aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light transition-colors hover:text-moss"
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
              >
                <EyeIcon off={showPassword} />
              </button>
            </span>
            {errors.password ? (
              <span className="mt-1 block text-[11px] text-error">{errors.password.message}</span>
            ) : null}
          </label>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[12px] text-text-light">
              <input className="accent-moss" type="checkbox" />
              <span>Recordarme</span>
            </label>
            <span className="text-[12px] text-gold">Acceso seguro</span>
          </div>

          <Button className="w-full justify-center" loading={isSubmitting} type="submit" variant="moss">
            Ingresar
          </Button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-text-light before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          Acceso seguro · SSL
        </p>
      </div>
    </div>
  );
}
