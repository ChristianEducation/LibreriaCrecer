"use client";

import { useRef } from "react";

import type { CatalogCategory } from "@/features/catalogo/types";
import { ScrollReveal } from "@/shared/ui/ScrollReveal";

import { CategoryCard } from "./CategoryCard";

type CategoryCarouselProps = {
  categories: CatalogCategory[];
};

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scrollRow(direction: "prev" | "next") {
    const row = rowRef.current;
    if (!row) return;
    const amount = row.clientWidth * 0.85;
    row.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <section className="page-px bg-beige-warm" id="categorias" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="storefront-container">
        <ScrollReveal className="landing-section-heading">
          <div className="category-row-heading">
            <div>
              <p
                className="eyebrow"
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}
              >
                <span
                  className="motion-line"
                  style={{ width: "20px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }}
                />
                Explorar
              </p>
              <h2
                className="heading-xl font-normal"
                style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "var(--moss)" }}
              >
                Categorías
              </h2>
            </div>

            {categories.length > 0 ? (
              <div className="hidden lg:flex" style={{ gap: "8px" }}>
                <button
                  aria-label="Categorías anteriores"
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
                  aria-label="Más categorías"
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
          </div>
        </ScrollReveal>

        {categories.length === 0 ? (
          <p style={{ fontSize: "13px", color: "var(--text-light)" }}>No hay categorías disponibles.</p>
        ) : (
          <div className="category-row" ref={rowRef}>
            {categories.map((cat, index) => (
              <ScrollReveal
                className="category-row-item"
                delayMs={Math.min(index, 5) * 65}
                key={cat.id}
                variant="scale-soft"
              >
                <CategoryCard imageUrl={cat.imageUrl} name={cat.name} slug={cat.slug} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
