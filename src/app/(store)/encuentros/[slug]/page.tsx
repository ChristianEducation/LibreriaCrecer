import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEncounterBySlug } from "@/features/encuentros/services/encounter-service";

type EncounterPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: EncounterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const encounter = await getEncounterBySlug(slug).catch(() => null);

  if (!encounter) {
    return { title: "Encuentro no encontrado" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl";
  const description = encounter.excerpt ?? encounter.description?.slice(0, 155) ?? "Encuentro Crecer Librería Católica";

  return {
    title: `${encounter.title} | Encuentros Crecer`,
    description,
    alternates: {
      canonical: `/encuentros/${slug}`,
    },
    openGraph: {
      title: encounter.title,
      description,
      url: `${baseUrl}/encuentros/${slug}`,
      type: "article",
      images: encounter.coverImageUrl ? [{ url: encounter.coverImageUrl, alt: encounter.title }] : [],
    },
  };
}

export default async function EncounterPage({ params }: EncounterPageProps) {
  const { slug } = await params;
  const encounter = await getEncounterBySlug(slug);

  if (!encounter) {
    notFound();
  }

  return (
    <main style={{ background: "var(--beige)", minHeight: "100vh" }}>
      {/* Portada Inmersiva */}
      <section style={{ position: "relative", width: "100%", height: "60vh", minHeight: "400px", maxHeight: "600px", background: "var(--moss)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={encounter.coverImageUrl}
          alt={encounter.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.65 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(23,20,15,0.9), transparent)" }} />
        
        <div className="storefront-container page-px" style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: "3rem" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--gold)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {encounter.eventDate
              ? new Date(encounter.eventDate).toLocaleDateString("es-CL", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" })
              : "Fecha por definir"}
            {encounter.location ? ` · ${encounter.location}` : ""}
          </p>
          <h1 className="font-serif" style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "var(--white)", lineHeight: 1.1, marginBottom: "16px", maxWidth: "800px" }}>
            {encounter.title}
          </h1>
          <Link
            href="/encuentros"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "2px" }}
            className="transition-colors hover:text-white"
          >
            ← Volver a Encuentros
          </Link>
        </div>
      </section>

      {/* Contenido Principal */}
      <section style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="storefront-container page-px">
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            {encounter.excerpt && (
              <p style={{ fontSize: "20px", lineHeight: 1.6, color: "var(--moss)", fontWeight: 400, marginBottom: "2.5rem" }}>
                {encounter.excerpt}
              </p>
            )}
            
            {encounter.description && (
              <div 
                style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap" }}
              >
                {encounter.description}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Embebido */}
      {encounter.videoUrl && (
        <section style={{ background: "var(--white)", paddingTop: "4rem", paddingBottom: "4rem", borderTop: "1px solid var(--border)" }}>
          <div className="storefront-container page-px">
            <h2 className="font-serif text-center" style={{ fontSize: "28px", color: "var(--moss)", marginBottom: "2.5rem" }}>
              Revive el momento
            </h2>
            <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
              <iframe 
                src={encounter.videoUrl.includes("watch?v=") ? encounter.videoUrl.replace("watch?v=", "embed/") : encounter.videoUrl} 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Galería de Fotos */}
      {encounter.images && encounter.images.length > 0 && (
        <section style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
          <div className="storefront-container page-px">
            <h2 className="font-serif text-center" style={{ fontSize: "28px", color: "var(--moss)", marginBottom: "2.5rem" }}>
              Galería de fotos
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {encounter.images.map((img) => (
                <div key={img.id} style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden", borderRadius: "8px", background: "var(--beige-warm)" }}>
                  <a href={img.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", height: "100%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.altText ?? "Foto del encuentro"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      className="transition-transform duration-500 hover:scale-105"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
