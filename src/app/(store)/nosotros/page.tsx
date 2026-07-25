import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";
import { EncounterCards } from "@/features/encuentros/components/EncounterCards";
import { getPublishedEncounters } from "@/features/encuentros/services/encounter-service";
import { AboutIcon } from "@/shared/ui/AboutIcon";
import type { AboutOfferingIcon } from "@/shared/config/about";

type AboutSection = typeof aboutSections.$inferSelect;

const encounterPhotos = [
  {
    alt: "Persona explorando libros durante un encuentro de Librería Crecer",
    className: "about-encounter-photo--reading",
    src: "/images/nosotros/encuentro-lectura.webp",
  },
  {
    alt: "Comunidad compartiendo dentro de Librería Crecer",
    className: "about-encounter-photo--community",
    src: "/images/nosotros/encuentro-comunidad.webp",
  },
  {
    alt: "Personas conversando durante un encuentro de Librería Crecer",
    className: "about-encounter-photo--dialogue",
    src: "/images/nosotros/encuentro-dialogo.webp",
  },
  {
    alt: "Asistentes reunidos en un encuentro de Librería Crecer",
    className: "about-encounter-photo--gathering",
    src: "/images/nosotros/encuentro-reunion.webp",
  },
  {
    alt: "Abrazo entre asistentes de un encuentro de Librería Crecer",
    className: "about-encounter-photo--embrace",
    src: "/images/nosotros/encuentro-abrazo.webp",
  },
] as const;

export const metadata: Metadata = {
  title: "Conócenos",
  description:
    "Somos Crecer Librería Católica, una librería católica en Antofagasta dedicada a acompañar el camino de fe con una selección curada de libros y recursos espirituales.",
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
  const [allSections, encounters] = await Promise.all([
    getAboutSections(),
    getPublishedEncounters().catch(() => []),
  ]);
  const stories = allSections.filter((s) => s.sectionType === "story");
  const offerings = allSections.filter((s) => s.sectionType === "offering");

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
              Promovemos el crecimiento integral de la persona
            </h1>
            <p className="about-hero-description">
              …ofreciendo libros, experiencias y espacios de encuentro que favorecen el diálogo
              entre la fe, la cultura, la educación y las distintas dimensiones del saber humano.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label="Nuestra comunidad"
        className="page-px about-community-section"
        style={{ paddingTop: "4.5rem", paddingBottom: "4.5rem" }}
      >
        <div className="about-encounter-gallery">
          {encounterPhotos.map((photo) => (
            <figure
              className={`about-encounter-photo ${photo.className}`}
              key={photo.src}
            >
              <Image
                alt={photo.alt}
                fill
                sizes="(max-width: 767px) 58vw, (max-width: 1100px) 24vw, 320px"
                src={photo.src}
              />
            </figure>
          ))}
        </div>
      </section>

      <section
        className="page-px about-purpose-section"
        style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div className="about-purpose-layout">
          <div className="about-purpose-closing">
            <p className="about-eyebrow about-eyebrow--dark">
              <span aria-hidden="true" />
              Nuestro propósito
            </p>
            <p>
              Queremos ser un lugar donde la fe dialogue con la cultura, la educación y las grandes
              preguntas del ser humano, promoviendo espacios donde los libros se transformen en
              encuentros y caminos de crecimiento.
            </p>
          </div>
        </div>
      </section>

      {encounters.length > 0 ? (
        <section
          className="page-px about-encounters-section"
          id="encuentros"
          style={{ paddingTop: "5rem", paddingBottom: "5.5rem" }}
        >
          <div className="about-encounters-heading">
            <p className="about-eyebrow about-eyebrow--dark">
              <span aria-hidden="true" />
              Nuestra comunidad
            </p>
            <h2>Encuentros Crecer</h2>
            <p>
              Revive las jornadas que han convertido los libros, la conversación y la fe en
              experiencias compartidas.
            </p>
          </div>

          <EncounterCards encounters={encounters} />
        </section>
      ) : null}

      {/* BLOQUE NUEVO: Tarjetas de oferta */}
      {offerings.length > 0 && (
        <section
          className="page-px about-offerings-section"
          style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
        >
          <div style={{ maxWidth: "1120px", marginInline: "auto", marginBottom: "2.5rem" }}>
            <p
              className="about-eyebrow about-eyebrow--dark about-offerings-eyebrow"
              style={{ justifyContent: "center" }}
            >
              <span aria-hidden="true" />
              Lo que hacemos
            </p>
          </div>
          
          <div className="about-offerings-grid">
            {offerings.map((offering) => (
              <div key={offering.id} className="about-offering-card">
                <div className="about-offering-icon-box">
                  <AboutIcon name={(offering.icon as AboutOfferingIcon) || "books"} size={24} />
                </div>
                <h3>{offering.title}</h3>
                <p>{offering.content}</p>
                {offering.linkUrl && (
                  <Link href={offering.linkUrl} className="about-offering-link mt-auto">
                    {offering.linkLabel || "Conoce más"}
                    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {stories.length === 0 ? (
        <section
          className="page-px bg-beige"
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
        stories.map((section, index) => {
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
                background: isEven ? "var(--white)" : "var(--beige)",
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
        style={{
          paddingTop: "5rem",
          paddingBottom: "5.5rem",
          background: stories.length % 2 !== 0 ? "var(--beige)" : "var(--white)"
        }}
      >
        <div className="about-cta">
          <p className="about-eyebrow about-eyebrow--dark">
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
