import { ScrollReveal } from "@/shared/ui/ScrollReveal";

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
          <ScrollReveal className="quote-background-reveal">
            <div
              aria-hidden="true"
              className="quote-background-media absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            />
          </ScrollReveal>
          {/* Overlay oscuro — permite leer el texto */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "rgba(30,24,0,0.62)" }}
          />
        </>
      ) : null}

      <ScrollReveal className="quote-gold-line" variant="line-grow">
        <div className="h-px w-full bg-[linear-gradient(to_right,transparent,rgba(200,168,48,0.7),transparent)]" />
      </ScrollReveal>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,208,96,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(200,168,48,0.14),transparent_28%)]" />

      <div className="relative z-[1] max-w-4xl" style={{ textAlign: "center", alignItems: "center", justifyContent: "center", margin: "0 auto", display: "flex", flexDirection: "column" }}>
        <ScrollReveal>
          <span className="font-display block" style={{ fontSize: "100px", lineHeight: "1", color: "rgba(255,255,255,0.6)", marginBottom: "-1rem" }}>&ldquo;</span>
        </ScrollReveal>
        <ScrollReveal delayMs={90}>
          <blockquote className="font-display editorial-emphasis max-w-3xl text-[clamp(22px,2.6vw,32px)] text-white/92" style={{ margin: "0 auto", lineHeight: 1.3 }}>
            {quote}
          </blockquote>
        </ScrollReveal>
        <ScrollReveal delayMs={180}>
          <p className="font-editorial text-[10px] uppercase tracking-[0.28em] text-gold" style={{ textAlign: "center", marginTop: "2rem" }}>{author}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
