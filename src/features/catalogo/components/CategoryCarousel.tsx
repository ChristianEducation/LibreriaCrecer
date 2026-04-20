import type { CatalogCategory } from "@/features/catalogo/types";

import { CategoryCard } from "./CategoryCard";

type CategoryCarouselProps = {
  categories: CatalogCategory[];
  panoramaUrl?: string | null;
};

export function CategoryCarousel({ categories, panoramaUrl }: CategoryCarouselProps) {
  return (
    <section className="page-px bg-beige" id="categorias" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p
          className="section-eyebrow font-sans uppercase text-gold"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
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

      {/* Grid */}
      {categories.length === 0 ? (
        <p style={{ fontSize: "13px", color: "var(--color-text-light)" }}>No hay categorías disponibles.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {categories.map((cat, index) => (
            <CategoryCard
              imageUrl={cat.imageUrl}
              key={cat.id}
              name={cat.name}
              panoramaIndex={index}
              panoramaTotal={categories.length}
              panoramaUrl={panoramaUrl ?? null}
              productCount={cat.productCount}
              slug={cat.slug}
            />
          ))}
        </div>
      )}
    </section>
  );
}
