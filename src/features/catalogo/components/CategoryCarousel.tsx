"use client";

import { useRef } from "react";

import type { CatalogCategory } from "@/features/catalogo/types";

import { CategoryCard } from "./CategoryCard";

type CategoryCarouselProps = {
  categories: CatalogCategory[];
};

function ChevronLeft() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      style={{ width: "14px", height: "14px" }}
      viewBox="0 0 24 24"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      style={{ width: "14px", height: "14px" }}
      viewBox="0 0 24 24"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function EmptyPlaceholder() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-[2px] border border-dashed border-border bg-beige text-center"
      style={{ minHeight: "200px", padding: "2rem 1.5rem" }}
    >
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        style={{ width: "48px", height: "48px", opacity: 0.15 }}
        viewBox="0 0 24 24"
      >
        <rect height="7" rx="1" width="7" x="3" y="3" />
        <rect height="7" rx="1" width="7" x="14" y="3" />
        <rect height="7" rx="1" width="7" x="14" y="14" />
        <rect height="7" rx="1" width="7" x="3" y="14" />
      </svg>
      <p className="font-serif text-lg font-normal text-text-mid">Sin categorías destacadas</p>
      <p
        className="font-sans font-light leading-relaxed text-text-light"
        style={{ fontSize: "0.875rem", maxWidth: "22rem" }}
      >
        Las categorías marcadas como destacadas aparecerán aquí.
      </p>
    </div>
  );
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const isNav = categories.length >= 7;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function scrollByDirection(direction: number) {
    const track = scrollRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-cat-card]");
    if (!card) return;
    const step = card.offsetWidth + 12;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  const cardStyle: React.CSSProperties = isNav
    ? { flex: "0 0 calc((100% - 5 * 12px) / 6)", flexShrink: 0 }
    : { flex: "1 1 0", minWidth: 0 };

  return (
    <section className="page-px bg-beige" id="categorias" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p
          className="font-sans uppercase text-gold"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "9px",
            letterSpacing: "0.35em",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              width: "24px",
              height: "1px",
              background: "var(--gold)",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          Explorar
        </p>
        <h2
          className="font-serif font-normal text-moss"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15, letterSpacing: "-0.01em" }}
        >
          Categorías
        </h2>
      </div>

      {/* Contenido */}
      {categories.length === 0 ? (
        <EmptyPlaceholder />
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isNav && (
            <button
              aria-label="Categoría anterior"
              className="carousel-nav-btn"
              onClick={() => scrollByDirection(-1)}
              type="button"
            >
              <ChevronLeft />
            </button>
          )}

          <div
            className={isNav ? "cat-track-scroll" : undefined}
            ref={isNav ? scrollRef : undefined}
            style={{
              display: "flex",
              gap: "12px",
              flex: 1,
              minWidth: 0,
              ...(isNav ? { overflowX: "auto" } : {}),
            }}
          >
            {categories.map((cat, i) => (
              <div
                data-cat-card=""
                key={cat.id}
                style={cardStyle}
              >
                <CategoryCard
                  imageUrl={cat.imageUrl}
                  index={i}
                  name={cat.name}
                  slug={cat.slug}
                />
              </div>
            ))}
          </div>

          {isNav && (
            <button
              aria-label="Categoría siguiente"
              className="carousel-nav-btn"
              onClick={() => scrollByDirection(1)}
              type="button"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
