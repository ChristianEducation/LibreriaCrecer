import Link from "next/link";

import { CategoryCard } from "@/features/catalogo/components";
import { getCategories } from "@/features/catalogo/services/category-service";

export default async function CategoriasPage() {
  const categories = await getCategories();

  return (
    <main>
      {/* Header — mismo lenguaje visual que PageHeader de /productos */}
      <section
        className="page-px relative overflow-hidden"
        style={{
          background:
            "#4a3c02 radial-gradient(ellipse at 70% 50%, rgba(217,186,30,0.07) 0%, transparent 60%)",
          paddingTop: "3.5rem",
          paddingBottom: "2.5rem",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            marginBottom: "1.25rem",
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Link
            href="/"
            style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
          >
            Inicio
          </Link>
          <span style={{ color: "rgba(255,255,255,0.35)", opacity: 0.3 }}>/</span>
          <span style={{ color: "var(--gold-light)" }}>Categorías</span>
        </div>

        {/* Título */}
        <h1
          className="font-serif font-normal leading-[1.04] text-white"
          style={{ fontSize: "clamp(36px,4vw,56px)" }}
        >
          Categorías
        </h1>

        {/* Subtítulo */}
        <p
          className="font-light"
          style={{
            fontSize: "14px",
            lineHeight: 1.8,
            marginTop: "1rem",
            maxWidth: "42rem",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Explora nuestra selección organizada por temáticas para encontrar
          exactamente lo que buscas.
        </p>
      </section>

      {/* Grid de categorías */}
      <section
        className="page-px bg-beige"
        style={{ paddingTop: "3rem", paddingBottom: "4rem" }}
      >
        {categories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p
              className="font-serif"
              style={{
                fontSize: "22px",
                color: "var(--color-moss)",
                marginBottom: "8px",
              }}
            >
              No hay categorías disponibles
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-light)",
                marginBottom: "24px",
              }}
            >
              Vuelve pronto, estamos actualizando nuestro catálogo.
            </p>
            <Link
              href="/productos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                background: "var(--color-moss)",
                color: "white",
                borderRadius: "2px",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Ver toda la colección →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                imageUrl={category.imageUrl}
                name={category.name}
                productCount={category.productCount}
                slug={category.slug}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
