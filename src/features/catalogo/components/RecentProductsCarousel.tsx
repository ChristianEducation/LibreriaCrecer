"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
      <svg aria-hidden="true" className="opacity-10" fill="none" stroke="currentColor" strokeWidth="0.8" style={{ width: "56px", height: "56px" }} viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-serif text-lg font-normal text-text-mid">Aún no hay títulos</p>
      <p className="font-sans font-light leading-relaxed text-text-light" style={{ maxWidth: "20rem", fontSize: "0.875rem" }}>
        Los nuevos libros aparecerán aquí cuando se agreguen al catálogo.
      </p>
    </div>
  );
}

export function RecentProductsCarousel({ products }: RecentProductsCarouselProps) {
  const isCarousel = products.length >= 6;
  const productsLen = products.length;

  const [startIndex, setStartIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rotate = useCallback((direction: "next" | "prev" = "next") => {
    setVisible(false);
    setTimeout(() => {
      setStartIndex((prev) => {
        if (direction === "next") return (prev + 1) % productsLen;
        return (prev - 1 + productsLen) % productsLen;
      });
      setVisible(true);
    }, 300);
  }, [productsLen]);

  const startAutoRotate = useCallback(() => {
    if (!isCarousel || isHovered) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => rotate("next"), 3000); // 3 segundos
  }, [isCarousel, isHovered, rotate]);

  const stopAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    startAutoRotate();
    return stopAutoRotate;
  }, [startAutoRotate, stopAutoRotate]);

  function handleManualNav(direction: "next" | "prev") {
    stopAutoRotate();
    rotate(direction);
    // El useEffect se encargará de reiniciar el auto-rotate si no está hovereado
    setTimeout(startAutoRotate, 300);
  }

  if (!products.length) {
    return (
      <section className="page-px bg-white" id="recien-llegados" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
        <div className="storefront-container">
          <EmptyPlaceholder />
        </div>
      </section>
    );
  }

  const visibleProductsDesktop = isCarousel
    ? Array.from({ length: 5 }, (_, i) => products[(startIndex + i) % productsLen])
    : products;

  return (
    <section className="page-px bg-white" id="recien-llegados" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
      <div className="storefront-container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3rem" }}>
          <div>
            <p className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <span style={{ width: "24px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }} />
              Recién llegados
            </p>
            <h2 className="heading-xl font-normal" style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "var(--moss)" }}>
              Lo último en tienda
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* Controles Desktop (Ocultos en mobile) */}
            {isCarousel && (
              <div className="hidden lg:flex" style={{ gap: "8px" }}>
                <button 
                  onClick={() => handleManualNav("prev")} 
                  className="carousel-nav-btn" 
                  aria-label="Anterior"
                  style={{ borderRadius: "50%" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={() => handleManualNav("next")} 
                  className="carousel-nav-btn" 
                  aria-label="Siguiente"
                  style={{ borderRadius: "50%" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            )}
            <Link className="font-sans text-text-mid transition-colors hover:text-moss" href="/productos" style={{ fontSize: "13px", borderBottom: "1px solid transparent", paddingBottom: "1px", flexShrink: 0 }}>
              Ver todos →
            </Link>
          </div>
        </div>

        {/* VERSIÓN MOBILE: Scroll horizontal libre (Oculta en desktop) */}
        <div className="recent-products-grid lg:hidden">
          {products.map((product) => (
            <ProductCard author={product.author} id={product.id} isNew isOnSale={product.hasDiscount} key={product.id} mainImageUrl={product.mainImageUrl} price={product.price} salePrice={product.salePrice} slug={product.slug} title={product.title} variant="clean" />
          ))}
        </div>

        {/* VERSIÓN DESKTOP: Carrusel rotativo con animaciones (Oculta en mobile) */}
        <div 
          className="recent-products-grid hidden lg:grid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {visibleProductsDesktop.map((product, i) => (
            <ProductCard author={product.author} id={product.id} isNew isOnSale={product.hasDiscount} key={isCarousel ? `slot-${startIndex}-${i}` : product.id} mainImageUrl={product.mainImageUrl} price={product.price} salePrice={product.salePrice} slug={product.slug} title={product.title} variant="clean" />
          ))}
        </div>
      </div>
    </section>
  );
}
