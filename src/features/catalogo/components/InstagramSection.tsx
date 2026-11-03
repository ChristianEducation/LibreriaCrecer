import Script from "next/script";

import { NewsletterForm } from "@/features/newsletter/components/NewsletterForm";
import { ScrollReveal } from "@/shared/ui/ScrollReveal";

export function InstagramSection() {
  const appId = process.env.NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID;

  return (
    <section className="page-px bg-beige" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="community-grid storefront-container">
        <div>
          <ScrollReveal>
            <p
              className="eyebrow"
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}
            >
              <span className="motion-line" style={{ width: "32px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }} />
              Sé parte de nuestra comunidad
            </p>
            <h2
              className="heading-xl font-normal"
              style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "var(--moss)", marginBottom: "2.5rem" }}
            >
              Síguenos
            </h2>
          </ScrollReveal>
          {appId ? (
            <>
              <Script
                src="https://static.elfsight.com/platform/platform.js"
                strategy="lazyOnload"
              />
              <ScrollReveal className="instagram-widget-reveal" delayMs={120} variant="scale-soft">
                <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
              </ScrollReveal>
            </>
          ) : null}
        </div>

        <ScrollReveal delayMs={120}>
          <div className="newsletter-card" id="suscripcion">
            <p
              className="eyebrow"
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}
            >
              <span className="motion-line" style={{ width: "20px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }} />
              Novedades
            </p>
            <h3 className="newsletter-title">Recibe novedades y fechas especiales</h3>
            <p className="newsletter-text">
              Nuevos libros, ideas de regalo para bautizos y primeras comuniones, y lo que llega para Navidad. Sin
              exceso de correos.
            </p>
            <NewsletterForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
