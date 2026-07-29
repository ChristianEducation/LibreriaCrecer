import Image from "next/image";
import Link from "next/link";

import { AdminLoginForm } from "./admin-login-form";

type AdminLoginPanelProps = {
  nextPath?: string;
};

export function AdminLoginPanel({ nextPath }: AdminLoginPanelProps) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <Image
          alt="Crecer Librería"
          height={40}
          src="/images/Logo-Crecer.png"
          style={{ objectFit: "contain" }}
          width={40}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 500, color: "var(--moss)" }}>
            Crecer Librería
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold)",
            }}
          >
            Librería Católica
          </span>
        </div>
      </div>

      <span
        style={{
          display: "inline-block",
          marginBottom: "22px",
          borderRadius: "20px",
          background: "var(--beige-warm)",
          border: "1px solid var(--border-gold)",
          padding: "5px 14px",
          fontSize: "11px",
          fontWeight: 500,
          color: "var(--moss)",
        }}
      >
        Crecer Librería · Panel administrativo
      </span>

      <p
        style={{
          marginBottom: "8px",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--text-light)",
        }}
      >
        Acceso interno
      </p>
      <h1
        style={{
          marginBottom: "10px",
          fontFamily: "var(--font-serif)",
          fontSize: "30px",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "var(--text)",
        }}
      >
        Accede a tu cuenta
      </h1>
      <p style={{ marginBottom: "28px", fontSize: "13px", lineHeight: 1.55, color: "var(--text-light)" }}>
        Inicia sesión para gestionar pedidos, productos y contenido de la tienda.
      </p>

      <AdminLoginForm nextPath={nextPath} />

      <Link
        href="/"
        style={{
          marginTop: "24px",
          display: "block",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--text-light)",
          textDecoration: "none",
        }}
      >
        ← Volver al sitio
      </Link>
    </div>
  );
}
