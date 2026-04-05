import Script from "next/script";

export function InstagramSection() {
  const appId = process.env.NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID;

  return (
    <section className="page-px bg-beige" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
      <p className="section-eyebrow flex items-center gap-3 font-sans uppercase tracking-[0.35em] text-gold" style={{ marginBottom: "2.5rem" }}>
        <span className="h-px w-8 bg-gold" />
        Sé parte de nuestra comunidad
      </p>
      {appId ? (
        <>
          <Script
            src="https://static.elfsight.com/platform/platform.js"
            strategy="lazyOnload"
          />
          <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
        </>
      ) : null}
    </section>
  );
}
