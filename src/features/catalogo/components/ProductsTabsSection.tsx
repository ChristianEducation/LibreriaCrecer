"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import type { CatalogProduct } from "@/features/catalogo/types";
import { ScrollReveal } from "@/shared/ui/ScrollReveal";

import { ProductCard } from "./ProductCard";

type TabKey = "popular" | "recent";

type ProductsTabsSectionProps = {
  popular: CatalogProduct[];
  recent: CatalogProduct[];
};

const TAB_META: Record<TabKey, { label: string; href: string; isNew: boolean }> = {
  popular: { label: "Más buscados", href: "/productos", isNew: false },
  recent: { label: "Recién llegados", href: "/productos?filter=nuevo", isNew: true },
};

export function ProductsTabsSection({ popular, recent }: ProductsTabsSectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const availableTabs = (["popular", "recent"] as const).filter((key) =>
    (key === "popular" ? popular : recent).length > 0,
  );
  const [selected, setSelected] = useState<TabKey>(availableTabs[0] ?? "recent");

  if (availableTabs.length === 0) {
    return null;
  }

  const activeTab = availableTabs.includes(selected) ? selected : availableTabs[0];
  const products = activeTab === "popular" ? popular : recent;
  const meta = TAB_META[activeTab];

  function scrollRow(direction: "prev" | "next") {
    const row = rowRef.current;
    if (!row) return;
    const amount = row.clientWidth * 0.9;
    row.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  }

  function selectTab(key: TabKey) {
    setSelected(key);
    rowRef.current?.scrollTo({ left: 0 });
  }

  return (
    <section className="page-px bg-white" id="mas-buscados" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="storefront-container">
        <ScrollReveal className="landing-section-heading">
          <div className="products-tabs-heading">
            <div>
              <p
                className="eyebrow"
                style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}
              >
                <span
                  className="motion-line"
                  style={{ width: "24px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }}
                />
                En la tienda
              </p>
              <h2
                className="heading-xl font-normal"
                style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "var(--moss)" }}
              >
                Lo que más se lleva
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div className="hidden lg:flex" style={{ gap: "8px" }}>
                <button
                  aria-label="Anterior"
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
                  aria-label="Siguiente"
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
              <Link
                className="font-sans text-text-mid transition-colors hover:text-moss"
                href={meta.href}
                style={{ fontSize: "13px", flexShrink: 0 }}
              >
                Ver todos →
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <div aria-label="Productos" className="products-tabs" role="tablist">
          {availableTabs.map((key) => (
            <button
              aria-selected={activeTab === key}
              className="products-tab"
              id={`tab-${key}`}
              key={key}
              onClick={() => selectTab(key)}
              role="tab"
              type="button"
            >
              {TAB_META[key].label}
            </button>
          ))}
        </div>

        <div
          aria-labelledby={`tab-${activeTab}`}
          className="recent-products-grid products-tab-row"
          ref={rowRef}
          role="tabpanel"
        >
          {products.map((product) => (
            <ProductCard
              author={product.author}
              className="recent-product-card"
              id={product.id}
              isNew={meta.isNew}
              isOnSale={product.hasDiscount}
              key={`${activeTab}-${product.id}`}
              hasStudioImage={product.hasStudioImage}
              mainImageUrl={product.mainImageUrl}
              originalImageUrl={product.originalImageUrl}
              onlineSaleEnabled={product.onlineSaleEnabled}
              price={product.price}
              salePrice={product.salePrice}
              sku={product.sku}
              slug={product.slug}
              stockQuantity={product.stockQuantity}
              title={product.title}
              variant="clean"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
