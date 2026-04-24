"use client";

import { useEffect, useRef, useState } from "react";
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
  const isCarousel = products.length >= 6;
  const productsLen = products.length;

  const [startIndex, setStartIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isCarousel) return;

    function rotate() {
      setVisible(false);
      setTimeout(() => {
        setStartIndex((prev) => (prev + 1) % productsLen);
        setVisible(true);
      }, 300);
    }

    intervalRef.current = setInterval(rotate, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCarousel, productsLen]);

  function goToIndex(index: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setVisible(false);
    setTimeout(() => {
      setStartIndex(index);
      setVisible(true);
      intervalRef.current = setInterval(() => {
        setVisible(false);
        setTimeout(() => {
          setStartIndex((prev) => (prev + 1) % productsLen);
          setVisible(true);
        }, 300);
      }, 4000);
    }, 300);
  }

  const visibleProducts = isCarousel
    ? Array.from({ length: 5 }, (_, i) => products[(startIndex + i) % productsLen])
    : products;

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

        {/* Contenido */}
        {products.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <>
            <div
              className="recent-products-grid"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {visibleProducts.map((product, i) => (
                <ProductCard
                  author={product.author}
                  id={product.id}
                  isNew
                  isOnSale={product.hasDiscount}
                  key={isCarousel ? `slot-${i}` : product.id}
                  mainImageUrl={product.mainImageUrl}
                  price={product.price}
                  salePrice={product.salePrice}
                  slug={product.slug}
                  title={product.title}
                  variant="clean"
                />
              ))}
            </div>

            {/* Indicador de puntos */}
            {isCarousel && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "2rem",
                }}
              >
                {products.map((_, index) => (
                  <button
                    aria-label={`Ir al producto ${index + 1}`}
                    key={index}
                    onClick={() => goToIndex(index)}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      background: index === startIndex ? "var(--gold)" : "var(--border)",
                      transition: "background 0.3s",
                    }}
                    type="button"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
