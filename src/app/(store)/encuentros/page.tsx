import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedEncounters } from "@/features/encuentros/services/encounter-service";
import { SectionHeader } from "@/shared/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Encuentros Crecer",
  description: "Galería de eventos, talleres y encuentros organizados por Crecer Librería Católica.",
  alternates: {
    canonical: "/encuentros",
  },
};

export default async function EncuentrosPage() {
  const encuentros = await getPublishedEncounters();

  return (
    <main style={{ background: "var(--beige)", minHeight: "100vh" }}>
      <section style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div className="storefront-container page-px">
          <SectionHeader
            eyebrow="COMUNIDAD"
            title="Encuentros"
            titleEm="Crecer"
            description="Revive nuestros talleres, eventos y momentos compartidos como comunidad en torno a la literatura y la fe."
            align="center"
            className="mb-12"
            as="h1"
          />

          {encuentros.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "3rem", paddingBottom: "3rem" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "var(--white)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <svg fill="none" height="28" stroke="var(--text-light)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="28">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <p className="font-serif text-2xl text-moss">Próximamente</p>
              <p className="mt-2 text-sm text-text-light">
                Estamos preparando nuevas galerías de nuestros encuentros.
              </p>
            </div>
          ) : (
            <div
              className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              style={{ marginTop: "3rem" }}
            >
              {encuentros.map((encounter) => (
                <Link
                  key={encounter.id}
                  href={`/encuentros/${encounter.slug}`}
                  className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    background: "var(--white)",
                    borderRadius: "6px",
                    boxShadow: "0 4px 20px -4px rgba(58,48,1,0.08), 0 0 0 1px rgba(58,48,1,0.03)",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "3/2",
                      overflow: "hidden",
                      background: "var(--beige-warm)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={encounter.coverImageUrl}
                      alt={encounter.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div style={{ padding: "18px 20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--gold)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      {encounter.eventDate
                        ? new Date(encounter.eventDate).toLocaleDateString("es-CL", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" })
                        : "Fecha por definir"}
                    </p>
                    <h3
                      className="font-serif text-moss"
                      style={{
                        fontSize: "19px",
                        lineHeight: 1.25,
                        marginBottom: "10px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {encounter.title}
                    </h3>
                    {encounter.excerpt ? (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--text-light)",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          marginBottom: "16px",
                          flex: 1,
                        }}
                      >
                        {encounter.excerpt}
                      </p>
                    ) : null}
                    <div style={{ marginTop: "auto" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "var(--moss)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          borderBottom: "1px solid var(--gold)",
                          paddingBottom: "2px",
                        }}
                      >
                        Ver galería <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
