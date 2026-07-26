"use client";

import { usePathname } from "next/navigation";

export function PurchasesPausedBanner() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }
  return (
    <section
      aria-label="Estado de las compras"
      className="page-px"
      style={{
        background: "var(--moss)",
        color: "var(--white)",
        paddingTop: "12px",
        paddingBottom: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          textAlign: "center",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--gold)",
            flexShrink: 0,
          }}
        />
        <p style={{ fontSize: "12px", lineHeight: 1.5 }}>
          <strong style={{ fontWeight: 600 }}>Estamos actualizando nuestro inventario.</strong>{" "}
          Las compras están temporalmente pausadas mientras confirmamos la disponibilidad de nuestros libros.
        </p>
      </div>
    </section>
  );
}