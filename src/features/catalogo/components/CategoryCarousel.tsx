import type { CatalogCategory } from "@/features/catalogo/types";
import { ScrollReveal } from "@/shared/ui/ScrollReveal";

import { CategoryCard } from "./CategoryCard";

type CategoryCarouselProps = {
  categories: CatalogCategory[];
  panoramaUrl?: string | null;
};

export function CategoryCarousel({ categories, panoramaUrl }: CategoryCarouselProps) {
  return (
    <section className="page-px bg-beige-warm" id="categorias" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
      <div className="storefront-container">
        {/* Bloque de título (fuera de la grilla) */}
        <ScrollReveal className="landing-section-heading">
          <p
            className="eyebrow"
            style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}
          >
            <span className="motion-line" style={{ width: "20px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }} />
            Explorar
          </p>
          <h2
            className="heading-xl font-normal"
            style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "var(--moss)" }}
          >
            Categorías
          </h2>
        </ScrollReveal>

        {/* Carrusel móvil / Grilla desktop */}
        <div className="category-carousel-wrapper">
          <div className="category-carousel-grid">
          {categories.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--text-light)", gridColumn: "1 / -1" }}>No hay categorías disponibles.</p>
          ) : (
            categories.map((cat, index) => (
              <ScrollReveal
                className="category-reveal-item"
                delayMs={Math.min(index, 5) * 65}
                key={cat.id}
                variant="scale-soft"
              >
                <CategoryCard
                  imageUrl={cat.imageUrl}
                  name={cat.name}
                  panoramaIndex={index}
                  panoramaTotal={categories.length}
                  panoramaUrl={panoramaUrl ?? null}
                  productCount={cat.productCount}
                  slug={cat.slug}
                />
              </ScrollReveal>
            ))
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
