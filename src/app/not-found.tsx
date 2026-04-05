import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-beige)", display: "flex", flexDirection: "column" }}>

      {/* Nav simplificado — solo logo */}
      <nav style={{
        height: "64px",
        padding: "0 clamp(1.25rem, 5vw, 3.5rem)",
        display: "flex",
        alignItems: "center",
        background: "rgba(242,239,223,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          {/* Logo mark — cruz dorada */}
          <div style={{ width: "28px", height: "28px", position: "relative" }}>
            <div style={{ position: "absolute", width: "1.5px", height: "100%", background: "var(--color-gold)", left: "50%", transform: "translateX(-50%)" }} />
            <div style={{ position: "absolute", height: "1.5px", width: "100%", background: "var(--color-gold)", top: "50%", transform: "translateY(-50%)" }} />
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: "var(--color-moss)", display: "block", lineHeight: 1 }}>
              Crecer Librería
            </span>
            <span style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-gold)", display: "block", marginTop: "2px" }}>
              Librería Católica
            </span>
          </div>
        </Link>
      </nav>

      {/* Contenido centrado */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>

          {/* Ilustración */}
          <div style={{ marginBottom: "40px" }}>
            <img
              src="/images/404-illustration.svg"
              alt="Página no encontrada"
              style={{ width: "200px", height: "auto", margin: "0 auto", display: "block", opacity: 0.85 }}
            />
          </div>

          {/* 404 decorativo */}
          <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "16px" }}>
            Error 404
          </p>

          {/* Título */}
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, color: "var(--color-moss)", lineHeight: 1.1, marginBottom: "16px" }}>
            Esta página no existe
          </h1>

          {/* Subtítulo */}
          <p style={{ fontSize: "14px", color: "var(--color-text-light)", lineHeight: 1.8, maxWidth: "340px", margin: "0 auto 40px", fontWeight: 300 }}>
            Es posible que la página haya sido movida o que el enlace sea incorrecto. Vuelve al inicio y encuentra lo que buscas.
          </p>

          {/* Botones */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", background: "var(--color-moss)", color: "white",
              textDecoration: "none", borderRadius: "2px", fontSize: "11px",
              fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Ir al inicio
            </Link>
            <Link href="/productos" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", background: "transparent",
              color: "var(--color-moss)", border: "1px solid var(--color-moss)",
              textDecoration: "none", borderRadius: "2px", fontSize: "11px",
              fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Ver colección
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
