import Image from "next/image";

import { AdminLoginForm } from "./admin-login-form";

const DEFAULT_APP_URL = "https://www.libreriacrecer.cl";

function getAppBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured?.trim()) {
    return configured.trim().replace(/\/$/, "");
  }
  return DEFAULT_APP_URL;
}

type AdminLoginPanelProps = {
  nextPath?: string;
};

export function AdminLoginPanel({ nextPath }: AdminLoginPanelProps) {
  return (
    <div className="admin-theme" style={{ width: "100%", background: "transparent" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
        <Image
          alt="Crecer Librería"
          height={52}
          priority
          src="/images/Logo-Crecer.png"
          style={{ objectFit: "contain" }}
          width={52}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "var(--adm-serif, var(--font-serif))", fontSize: "22px", fontWeight: 600, color: "var(--adm-ink-strong)", lineHeight: 1.1 }}>
            Crecer Librería
          </span>
          <span
            style={{
              marginTop: "4px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "var(--adm-gold-deep)",
            }}
          >
            Panel admin
          </span>
        </div>
      </div>

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
          fontFamily: "var(--adm-serif, var(--font-serif))",
          fontSize: "32px",
          fontWeight: 700,
          letterSpacing: "-0.015em",
          lineHeight: 1.1,
          color: "var(--adm-ink-strong)",
        }}
      >
        Accede a tu cuenta
      </h1>
      <p style={{ marginBottom: "28px", fontSize: "13px", lineHeight: 1.55, color: "var(--text-light)" }}>
        Inicia sesión para gestionar pedidos, productos y contenido de la tienda.
      </p>

      <AdminLoginForm nextPath={nextPath} />

      <a
        href={getAppBaseUrl()}
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
      </a>
    </div>
  );
}
