import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";

type AboutSection = typeof aboutSections.$inferSelect;

export const metadata: Metadata = {
  title: "Conócenos",
  description:
    "Somos Crecer Librería Cristiana, una librería católica en Antofagasta dedicada a acompañar el camino de fe con una selección curada de libros y recursos espirituales.",
  alternates: {
    canonical: "/nosotros",
  },
};

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
      <section
        className="page-px about-hero relative overflow-hidden"
        style={{ paddingTop: "4.5rem", paddingBottom: "5rem" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(232,208,96,0.16),transparent_34%),radial-gradient(circle_at_10%_85%,rgba(200,168,48,0.10),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(200,168,48,0.55),transparent)]" />

        <div className="relative z-[1]">
          <nav
            aria-label="Breadcrumb"
            className="about-breadcrumb"
          >
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span>Conócenos</span>
          </nav>

          <div className="about-hero-copy">
            <p className="about-eyebrow">
              <span aria-hidden="true" />
              Librería Católica · Antofagasta
            </p>
            <h1 className="about-hero-title">
              Una librería para crecer en la{" "}
              <em>fe y la lectura</em>
            </h1>
            <p className="about-hero-description">
              Acompañamos a familias, comunidades y lectores con una selección cuidada de libros,
              biblias y artículos religiosos para la vida espiritual cotidiana.
            </p>
          </div>
        </div>
      </section>

      <section
        className="page-px about-manifesto-section"
        style={{ paddingTop: "4.5rem", paddingBottom: "4.5rem" }}
      >
        <div className="about-manifesto">
          <p className="about-eyebrow about-eyebrow--dark">
            <span aria-hidden="true" />
            Nuestro propósito
          </p>
          <p className="about-manifesto-lead">
            Creemos que una buena librería no solo vende libros: orienta, recomienda y abre un
            espacio tranquilo para encontrar palabras que acompañen el camino.
          </p>
          <p className="about-manifesto-copy">
            Desde Antofagasta, Librería Crecer reúne títulos para la oración, la formación, la
            catequesis y la lectura personal, con una mirada cercana y una curaduría pensada para
            servir a cada lector.
          </p>
        </div>
      </section>

      {sections.length === 0 ? (
        <section
          className="page-px bg-white"
          style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
        >
          <div className="about-empty-state">
            <p className="about-eyebrow about-eyebrow--dark">
              <span aria-hidden="true" />
              Nuestra historia
            </p>
            <h2>Pronto compartiremos más de Librería Crecer</h2>
            <p>
              Estamos preparando este espacio para contar mejor nuestra historia, nuestra selección
              y el servicio que ofrecemos a la comunidad.
            </p>
          </div>
        </section>
      ) : (
        sections.map((section, index) => {
          const isEven = index % 2 === 0;
          const imageOnRight = section.imagePosition === "right";
          const chapterNumber = String(index + 1).padStart(2, "0");

          return (
            <section
              key={section.id}
              className="page-px about-story-section"
              style={{
                paddingTop: "5.75rem",
                paddingBottom: "5.75rem",
                background: isEven ? "var(--beige)" : "var(--white)",
              }}
            >
              <div className={imageOnRight ? "about-story-grid" : "about-story-grid about-story-grid--image-left"}>
                <div className="about-story-copy">
                  <p className="about-chapter-label">Historia {chapterNumber}</p>
                  <h2>{section.title}</h2>
                  <p>{section.content}</p>
                </div>

                <div className="about-story-media" aria-label={section.imageUrl ? undefined : "Ilustración editorial"}>
                  {section.imageUrl ? (
                    <Image
                      alt={section.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 48vw, 520px"
                      src={section.imageUrl}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="about-story-fallback">
                      <svg aria-hidden="true" fill="none" viewBox="0 0 120 120">
                        <path d="M28 34c12 0 22 3 32 10 10-7 20-10 32-10v52c-12 0-22 3-32 10-10-7-20-10-32-10V34Z" stroke="currentColor" strokeWidth="4" />
                        <path d="M60 44v52" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
                        <path d="M38 50c6 .5 11 2 16 5M38 64c6 .5 11 2 16 5M82 50c-6 .5-11 2-16 5M82 64c-6 .5-11 2-16 5" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                      </svg>
                      <span>Librería Crecer</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })
      )}

      <section
        className="page-px about-cta-section"
        style={{ paddingTop: "5rem", paddingBottom: "5.5rem" }}
      >
        <div className="about-cta">
          <p className="about-eyebrow">
            <span aria-hidden="true" />
            Nuestra colección
          </p>
          <h2>Encuentra una lectura para este tiempo</h2>
          <p>
            Explora libros y artículos seleccionados con el mismo cuidado con que atendemos en
            nuestra librería.
          </p>
          <Link className="about-cta-link" href="/productos">
            Ver colección
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
