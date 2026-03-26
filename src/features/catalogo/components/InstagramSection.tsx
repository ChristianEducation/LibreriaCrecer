import Script from "next/script";
import Link from "next/link";

import { SectionHeader } from "@/shared/ui";

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <rect height="14" rx="4" stroke="currentColor" strokeWidth="1.5" width="14" x="5" y="5" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.75" cy="7.25" fill="currentColor" r="1" />
    </svg>
  );
}

export function InstagramSection() {
  const appId = process.env.NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID;

  return (
    <section className="page-px bg-beige" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.25rem" }}>
        <SectionHeader
          description="Un mural visual para anunciar lectura, comunidad y lanzamientos sin perder la textura editorial del sitio."
          eyebrow="Instagram"
          title="Ritmo visual"
          titleEm="en comunidad"
        />
        <Link
          className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-gold"
          href="https://www.instagram.com/crecerlibreria"
          target="_blank"
        >
          <InstagramIcon />
          Ver perfil
        </Link>
      </div>

      {appId ? (
        <>
          <Script
            src="https://static.elfsight.com/platform/platform.js"
            strategy="lazyOnload"
          />
          <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
        </>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-[2px] border border-dashed border-border bg-beige-warm/40 text-center"
          style={{ minHeight: "220px", padding: "2.5rem 1.5rem" }}
        >
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            style={{ width: "48px", height: "48px", opacity: 0.12 }}
            viewBox="0 0 24 24"
          >
            <rect height="14" rx="4" width="14" x="5" y="5" />
            <circle cx="12" cy="12" r="3.25" />
            <circle cx="16.75" cy="7.25" fill="currentColor" r="1" />
          </svg>
          <p className="font-serif text-lg font-normal text-text-mid">Feed de Instagram</p>
          <p
            className="font-sans font-light leading-relaxed text-text-light"
            style={{ fontSize: "0.875rem", maxWidth: "22rem" }}
          >
            Configurar <code className="font-mono text-xs">NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID</code> para mostrar el feed.
          </p>
        </div>
      )}
    </section>
  );
}
