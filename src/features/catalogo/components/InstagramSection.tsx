import Link from "next/link";

import { SectionHeader } from "@/shared/ui";

const placeholderBackgrounds = [
  "linear-gradient(135deg, #5A4A02, #C8A830)",
  "linear-gradient(135deg, #3A3001, #8A7302)",
  "linear-gradient(145deg, #C8A830, #D4B840)",
  "linear-gradient(145deg, #5A4A02, #8A7302)",
] as const;

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
  return (
    <section className="bg-beige px-5 py-16 md:px-10 md:py-20 lg:px-14">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          description="Un mural visual para anunciar lectura, comunidad y lanzamientos sin perder la textura editorial del sitio."
          eyebrow="Instagram"
          title="Ritmo visual"
          titleEm="en comunidad"
        />
        <Link
          className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-gold"
          href="https://www.instagram.com/"
          target="_blank"
        >
          <InstagramIcon />
          Ver perfil
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-[10px] lg:grid-cols-4">
        {placeholderBackgrounds.map((background, index) => (
          <a
            className="group relative block aspect-square overflow-hidden rounded"
            href="https://www.instagram.com/"
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            <div
              className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
              style={{ background }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(58,48,1,0.12)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-[rgba(58,48,1,0.55)] text-white">
                <InstagramIcon />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
