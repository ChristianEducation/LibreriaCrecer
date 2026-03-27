import Script from "next/script";

export function InstagramSection() {
  const appId = process.env.NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID;

  return (
    <section className="page-px py-6 bg-beige">
      <p className="section-eyebrow mb-6 flex items-center gap-3 font-sans uppercase tracking-[0.35em] text-gold" style={{ fontSize: "11px" }}>
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
