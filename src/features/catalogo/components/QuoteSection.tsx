type QuoteSectionProps = {
  quote: string;
  author: string;
  backgroundImageUrl?: string | null;
};

export function QuoteSection({ quote, author, backgroundImageUrl }: QuoteSectionProps) {
  return (
    <section
      className="page-px relative overflow-hidden bg-[var(--foreground)]"
      style={{ paddingTop: "6.25rem", paddingBottom: "6.25rem" }}
    >
      {backgroundImageUrl ? (
        <>
          {/* Imagen de fondo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
          {/* Overlay oscuro — permite leer el texto */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "rgba(30,24,0,0.62)" }}
          />
        </>
      ) : null}

      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(200,168,48,0.7),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,208,96,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(200,168,48,0.14),transparent_28%)]" />

      <div className="relative z-[1] max-w-4xl" style={{ textAlign: "center", alignItems: "center", justifyContent: "center", margin: "0 auto", display: "flex", flexDirection: "column" }}>
        <span className="font-display block" style={{ fontSize: "100px", lineHeight: "1", color: "rgba(255,255,255,0.6)", marginBottom: "-1rem" }}>&ldquo;</span>
        <blockquote className="font-display editorial-emphasis max-w-3xl text-[clamp(22px,2.6vw,32px)] text-white/92" style={{ margin: "0 auto", lineHeight: 1.3 }}>
          {quote}
        </blockquote>
        <p className="font-editorial text-[10px] uppercase tracking-[0.28em] text-gold" style={{ textAlign: "center", marginTop: "2rem" }}>{author}</p>
      </div>
    </section>
  );
}
