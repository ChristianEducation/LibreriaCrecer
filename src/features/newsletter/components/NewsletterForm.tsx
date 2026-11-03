"use client";

import { useState } from "react";

type Status = { kind: "idle" } | { kind: "ok"; message: string } | { kind: "error"; message: string };

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus({ kind: "idle" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, source: "home" }),
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setStatus({ kind: "error", message: payload?.message ?? "No pudimos registrar tu correo." });
        return;
      }

      setEmail("");
      setStatus({ kind: "ok", message: "¡Gracias! Te enviamos un correo de bienvenida." });
    } catch {
      setStatus({ kind: "error", message: "Error de red. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="newsletter-form" noValidate onSubmit={(event) => { void handleSubmit(event); }}>
      <label className="newsletter-hp" htmlFor="newsletter-website">
        No completar este campo
        <input
          autoComplete="off"
          id="newsletter-website"
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          type="text"
          value={website}
        />
      </label>

      <label className="sr-only" htmlFor="newsletter-email">
        Tu correo
      </label>
      <input
        autoComplete="email"
        className="newsletter-input"
        id="newsletter-email"
        inputMode="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tu@correo.cl"
        required
        type="email"
        value={email}
      />
      <button className="newsletter-submit" disabled={loading} type="submit">
        {loading ? "Enviando..." : "Suscribirme"}
      </button>
      <p className="newsletter-consent">
        Al suscribirte aceptas recibir correos de Crecer Librería con novedades y fechas especiales. Puedes darte de
        baja cuando quieras.
      </p>
      {status.kind !== "idle" ? (
        <p
          aria-live="polite"
          className={`newsletter-message newsletter-message--${status.kind}`}
          role={status.kind === "error" ? "alert" : "status"}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
