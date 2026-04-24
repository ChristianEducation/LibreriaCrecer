import type { CatalogCategory } from "@/features/catalogo/types";

import { CategoryCard } from "./CategoryCard";

type CategoryCarouselProps = {
  categories: CatalogCategory[];
  panoramaUrl?: string | null;
};

export function CategoryCarousel({ categories, panoramaUrl }: CategoryCarouselProps) {
  return (
    <section className="page-px bg-beige-warm" id="categorias" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
      <div className="storefront-container category-carousel-grid">
        {/* Celda 1 — bloque de título */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", aspectRatio: "3/2" }}>
          <p
            className="eyebrow"
            style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}
          >
            <span style={{ width: "20px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }} />
            Explorar
          </p>
          <h2
            className="heading-xl font-normal"
            style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "var(--moss)" }}
          >
            Categorías
          </h2>
        </div>

        {/* Celdas 2-10 — cards */}
        {categories.length === 0 ? (
          <p style={{ fontSize: "13px", color: "var(--text-light)", gridColumn: "1 / -1" }}>No hay categorías disponibles.</p>
        ) : (
          categories.map((cat, index) => (
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
          ))
        )}
      </div>
    </section>
  );
}
