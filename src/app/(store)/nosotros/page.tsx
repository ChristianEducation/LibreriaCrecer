import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";

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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontFamily: "var(--font-inter)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "16px",
            }}
          >
            <span style={{ width: "24px", height: "1px", background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
            Nuestra historia
          </p>
          <h1
            className="heading-xl font-normal"
            style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "white", letterSpacing: "-0.03em", marginBottom: "1.25rem", lineHeight: 1.1 }}
          >
            Conócenos
          </h1>
          <p
            style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.75)", maxWidth: "480px" }}
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
                paddingTop: "6rem",
                paddingBottom: "6rem",
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
                      style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 400, letterSpacing: "-0.025em", color: "var(--moss)", lineHeight: 1.2, marginBottom: "1.25rem" }}
                    >
                      {section.title}
                    </h2>
                    <p
                      style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-wrap" }}
                    >
                      {section.content}
                    </p>
                  </div>
                  {/* Imagen */}
                  <div style={{ order: imageOnRight ? 2 : 1, borderRadius: "var(--radius-lg)", overflow: "hidden", aspectRatio: "4/3", position: "relative" }}>
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
                    style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 400, letterSpacing: "-0.025em", color: "var(--moss)", lineHeight: 1.2, marginBottom: "1.25rem" }}
                  >
                    {section.title}
                  </h2>
                  <p
                    style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-wrap" }}
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
        style={{ paddingTop: "6rem", paddingBottom: "6rem", textAlign: "center" }}
      >
        <p
          style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}
        >
          Nuestra colección
        </p>
        <h2
          className="heading-xl font-normal"
          style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", fontWeight: 400, color: "var(--moss)", lineHeight: 1.15, marginBottom: "2rem" }}
        >
          Explora nuestra colección
        </h2>
        <Link
          href="/productos"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", paddingTop: "14px", paddingBottom: "14px", paddingLeft: "2rem", paddingRight: "2rem", background: "var(--gold)", color: "white", borderRadius: "var(--radius-xl)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
        >
          Ver todos los libros
        </Link>
      </section>
    </main>
  );
}
