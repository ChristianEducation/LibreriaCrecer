"use client";

import Link from "next/link";

import type { CatalogProduct } from "@/features/catalogo/types";

import { ProductCard } from "./ProductCard";

type RecentProductsCarouselProps = {
  products: CatalogProduct[];
};

function EmptyPlaceholder() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-[2px] border border-dashed border-border bg-white text-center"
      style={{ minHeight: "280px", padding: "2.5rem 1.5rem" }}
    >
      <svg
        aria-hidden="true"
        className="opacity-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        style={{ width: "56px", height: "56px" }}
        viewBox="0 0 24 24"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-serif text-lg font-normal text-text-mid">Aún no hay títulos</p>
      <p
        className="font-sans font-light leading-relaxed text-text-light"
        style={{ maxWidth: "20rem", fontSize: "0.875rem" }}
      >
        Los nuevos libros aparecerán aquí cuando se agreguen al catálogo.
      </p>
    </div>
  );
}

export function RecentProductsCarousel({ products }: RecentProductsCarouselProps) {
  if (!products.length) {
    return (
      <section className="page-px bg-white" id="recien-llegados" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
        <div className="storefront-container">
          <EmptyPlaceholder />
        </div>
      </section>
    );
  }

  return (
    <section className="page-px bg-white" id="recien-llegados" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
      <div className="storefront-container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <p
              className="eyebrow"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
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
              Recién llegados
            </p>
            <h2
              className="heading-xl font-normal"
              style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "var(--moss)" }}
            >
              Lo último en tienda
            </h2>
          </div>

          <Link
            className="font-sans text-text-mid transition-colors hover:text-moss"
            href="/productos"
            style={{ fontSize: "13px", borderBottom: "1px solid transparent", paddingBottom: "1px", flexShrink: 0 }}
          >
            Ver todos →
          </Link>
        </div>

        {/* Productos — scroll horizontal en mobile, grilla en desktop */}
        <div className="recent-products-grid">
          {products.map((product) => (
            <ProductCard
              author={product.author}
              id={product.id}
              isNew
              isOnSale={product.hasDiscount}
              key={product.id}
              mainImageUrl={product.mainImageUrl}
              price={product.price}
              salePrice={product.salePrice}
              slug={product.slug}
              title={product.title}
              variant="clean"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
