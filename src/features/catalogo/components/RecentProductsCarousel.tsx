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
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const isCarousel = products.length >= 6;

  // Función de scroll suave personalizada para un deslizamiento más lento y elegante (800ms)
  const customSmoothScroll = useCallback((container: HTMLElement, targetLeft: number, duration: number) => {
    const startLeft = container.scrollLeft;
    const distance = targetLeft - startLeft;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (ease-in-out cubico)
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      container.scrollLeft = startLeft + distance * ease;

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }, []);

  // Rotación automática: avanza 1 ítem a la vez suavemente
  const scrollNextItem = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // En pantallas pequeñas no hace auto-rotate (ya es scroll nativo)
    if (window.innerWidth < 1024) return;

    const itemWidth = (container.children[0] as HTMLElement)?.offsetWidth || 0;
    const gap = 16; // 1rem definido en CSS
    const scrollAmount = itemWidth + gap;
    const targetLeft = container.scrollLeft + scrollAmount;

    // Si llegamos al final, volvemos al principio suavemente
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
      customSmoothScroll(container, 0, 1000); // 1 segundo para volver
    } else {
      customSmoothScroll(container, targetLeft, 800); // 800ms por ítem
    }
  }, [customSmoothScroll]);

  const startAutoRotate = useCallback(() => {
    if (!isCarousel || isHovered) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(scrollNextItem, 3500); // Subimos a 3.5s por la animación larga
  }, [isCarousel, isHovered, scrollNextItem]);

  const stopAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    startAutoRotate();
    return stopAutoRotate;
  }, [startAutoRotate, stopAutoRotate]);

  // Navegación manual con las flechas
  function handleManualNav(direction: "next" | "prev") {
    const container = containerRef.current;
    if (!container) return;
    
    stopAutoRotate();
    
    const scrollAmount = container.clientWidth;
    let targetLeft = container.scrollLeft;

    if (direction === "next") {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        targetLeft = 0;
      } else {
        targetLeft = container.scrollLeft + scrollAmount;
      }
    } else {
      if (container.scrollLeft <= 0) {
        targetLeft = container.scrollWidth;
      } else {
        targetLeft = container.scrollLeft - scrollAmount;
      }
    }
    
    // Las páginas se deslizan un poco más rápido (600ms) para respuesta ágil
    customSmoothScroll(container, targetLeft, 600);
    
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

        {/* Carrusel Unificado: Scroll nativo (táctil en móvil, JS en desktop) */}
        <div 
          className="recent-products-grid"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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
