import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";
import { Button } from "@/shared/ui";

type AboutSection = typeof aboutSections.$inferSelect;

async function getAboutSections(): Promise<AboutSection[]> {
  try {
    return db
      .select()
      .from(aboutSections)
      .where(eq(aboutSections.isActive, true))
      .orderBy(asc(aboutSections.displayOrder));
  } catch {
    return [];
  }
}

export default async function NosotrosPage() {
  const sections = await getAboutSections();

  return (
    <main className="bg-beige">
      {/* Hero */}
      <section
        className="page-px relative overflow-hidden bg-moss"
        style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,208,96,0.12),transparent_40%)]" />
        <div className="relative z-[1] max-w-2xl">
          <p
            className="section-eyebrow font-sans uppercase text-gold"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              letterSpacing: "0.35em",
              marginBottom: "16px",
            }}
          >
            <span style={{ width: "24px", height: "1px", background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
            Nuestra historia
          </p>
          <h1
            className="font-serif font-normal text-white"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "1.25rem" }}
          >
            Conócenos
          </h1>
          <p
            className="font-sans font-light text-white/75"
            style={{ fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)", lineHeight: 1.8, maxWidth: "480px" }}
          >
            Somos una librería cristiana en Antofagasta comprometida con acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
          </p>
        </div>
      </section>

      {/* Secciones alternadas */}
      {sections.length === 0 ? (
        <section className="page-px" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <p className="font-sans font-light text-text-light" style={{ fontSize: "15px" }}>
            Próximamente compartiremos más sobre nuestra historia.
          </p>
        </section>
      ) : (
        sections.map((section, index) => {
          const isEven = index % 2 === 0;
          const imageOnRight = section.imagePosition === "right";

          return (
            <section
              key={section.id}
              className="page-px"
              style={{
                paddingTop: "5rem",
                paddingBottom: "5rem",
                background: isEven ? "var(--beige)" : "var(--white)",
              }}
            >
              {section.imageUrl ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4rem",
                    alignItems: "center",
                  }}
                  className="about-section-grid"
                >
                  {/* Texto */}
                  <div style={{ order: imageOnRight ? 1 : 2 }}>
                    <h2
                      className="font-serif font-normal text-moss"
                      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", lineHeight: 1.2, marginBottom: "1.25rem" }}
                    >
                      {section.title}
                    </h2>
                    <p
                      className="font-sans font-light text-text"
                      style={{ fontSize: "clamp(0.875rem, 1vw, 1rem)", lineHeight: 1.85, whiteSpace: "pre-wrap" }}
                    >
                      {section.content}
                    </p>
                  </div>
                  {/* Imagen */}
                  <div style={{ order: imageOnRight ? 2 : 1, borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", position: "relative" }}>
                    <Image
                      alt={section.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src={section.imageUrl}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: "720px" }}>
                  <h2
                    className="font-serif font-normal text-moss"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", lineHeight: 1.2, marginBottom: "1.25rem" }}
                  >
                    {section.title}
                  </h2>
                  <p
                    className="font-sans font-light text-text"
                    style={{ fontSize: "clamp(0.875rem, 1vw, 1rem)", lineHeight: 1.85, whiteSpace: "pre-wrap" }}
                  >
                    {section.content}
                  </p>
                </div>
              )}
            </section>
          );
        })
      )}

      {/* Call to action */}
      <section
        className="page-px bg-beige-warm"
        style={{ paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}
      >
        <p
          className="section-eyebrow font-sans uppercase text-gold"
          style={{ letterSpacing: "0.35em", marginBottom: "1rem" }}
        >
          Nuestra colección
        </p>
        <h2
          className="font-serif font-normal text-moss"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15, marginBottom: "2rem" }}
        >
          Explora nuestra colección
        </h2>
        <Link href="/productos">
          <Button variant="primary">Ver todos los libros</Button>
        </Link>
      </section>
    </main>
  );
}
