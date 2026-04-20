type QuoteSectionProps = {
  quote: string;
  author: string;
  backgroundImageUrl?: string | null;
};

export function QuoteSection({ quote, author, backgroundImageUrl }: QuoteSectionProps) {
  return (
    <section
      className="page-px relative overflow-hidden bg-moss"
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

      <div className="relative z-[1] max-w-4xl">
        <span className="block font-serif text-[100px] leading-none text-gold/25">&ldquo;</span>
        <blockquote className="-mt-8 max-w-3xl font-serif text-[clamp(20px,2.4vw,30px)] italic leading-[1.55] text-white/90">
          {quote}
        </blockquote>
        <p className="mt-8 text-[10px] uppercase tracking-[0.28em] text-gold">{author}</p>
      </div>
    </section>
  );
}
