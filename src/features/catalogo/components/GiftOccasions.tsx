"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { GIFTS_TAGLINE, type GiftOccasion } from "@/shared/config/regalos";
import { ScrollReveal } from "@/shared/ui/ScrollReveal";

type GiftOccasionsProps = {
  occasions: GiftOccasion[];
};

// Cuántas tarjetas caben a la vez en escritorio; desde ahí se muestran flechas.
const VISIBLE_ON_DESKTOP = 5;

export function GiftOccasions({ occasions }: GiftOccasionsProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  if (occasions.length === 0) {
    return null;
  }

  function scrollRow(direction: "prev" | "next") {
    const row = rowRef.current;
    if (!row) return;
    const amount = row.clientWidth * 0.85;
    row.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <section className="page-px bg-beige" id="regalos" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="storefront-container">
        <ScrollReveal className="landing-section-heading">
          <div className="gift-occasions-heading">
            <div>
              <p
                className="eyebrow"
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}
              >
                <span
                  className="motion-line"
                  style={{ width: "20px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }}
                />
                Regalos con intención
              </p>
              <h2
                className="heading-xl font-normal"
                style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "var(--moss)" }}
              >
                {GIFTS_TAGLINE}
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {occasions.length > VISIBLE_ON_DESKTOP ? (
                <div className="hidden lg:flex" style={{ gap: "8px" }}>
                  <button
                    aria-label="Ocasiones anteriores"
                    className="carousel-nav-btn"
                    onClick={() => scrollRow("prev")}
                    style={{ borderRadius: "50%" }}
                    type="button"
                  >
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    aria-label="Más ocasiones"
                    className="carousel-nav-btn"
                    onClick={() => scrollRow("next")}
                    style={{ borderRadius: "50%" }}
                    type="button"
                  >
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              ) : null}
              <Link className="gift-occasions-all" href="/regalos">
                Ver todos los regalos →
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <div className="gift-occasions-row" ref={rowRef}>
          {occasions.map((occasion, index) => (
            <ScrollReveal className="gift-occasion-item" delayMs={Math.min(index, 5) * 65} key={occasion.slug} variant="scale-soft">
              <Link className="gift-card" href={`/regalos?ocasion=${occasion.slug}`}>
                {occasion.imageUrl ? (
                  <Image
                    alt=""
                    className="gift-card-image"
                    fill
                    sizes="(max-width: 768px) 60vw, (max-width: 1280px) 20vw, 240px"
                    src={occasion.imageUrl}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span aria-hidden="true" className="gift-card-ornament">
                    <svg fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" viewBox="0 0 24 24" width="28">
                      <path d="M12 3v18M7 8h10" />
                    </svg>
                  </span>
                )}
                <span className="gift-card-body">
                  {occasion.phrase !== occasion.label ? (
                    <span className="gift-card-label">{occasion.label}</span>
                  ) : null}
                  <span className="gift-card-phrase">{occasion.phrase}</span>
                  <span className="gift-card-cta">Ver ideas →</span>
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
