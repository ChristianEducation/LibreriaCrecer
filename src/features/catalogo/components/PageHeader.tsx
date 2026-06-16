"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

export interface PageHeaderProps {
  categories: { id: string; name: string; slug: string; headerImageUrl?: string | null }[];
  activeCategory: string;
  defaultHeaderImageUrl?: string | null;
}

export function PageHeader({
  categories,
  activeCategory,
  defaultHeaderImageUrl = null,
}: PageHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentImage, setCurrentImage] = useState<string | null>(defaultHeaderImageUrl);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeCategoryData = useMemo(
    () => categories.find((category) => category.slug === activeCategory) ?? null,
    [activeCategory, categories],
  );

  const nextImage = activeCategoryData?.headerImageUrl ?? defaultHeaderImageUrl ?? null;

  useEffect(() => {
    if (nextImage === currentImage) {
      return;
    }

    setPreviousImage(currentImage);
    setCurrentImage(nextImage);
    setIsTransitioning(true);

    const timeoutId = window.setTimeout(() => {
      setPreviousImage(null);
      setIsTransitioning(false);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [currentImage, nextImage]);

  function updateCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set("cat", slug);
    } else {
      params.delete("cat");
    }

    const query = params.toString();
    router.push(query ? `/productos?${query}` : "/productos");
  }

  const subtitle = activeCategoryData
    ? (activeCategoryData as { description?: string | null }).description ??
      "Una curaduría pensada para acompañar el estudio, la lectura y la devoción."
    : "Libros, biblias y artículos religiosos para el crecimiento espiritual.";



  return (
    <section
      className="page-px relative overflow-hidden"
      style={{
        background: "var(--gold)",
        paddingTop: "3.5rem",
      }}
    >
      {/* Imagen de fondo previa (fade out) */}
      {previousImage ? (
        <div className="pointer-events-none absolute inset-0">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="100vw"
            src={previousImage}
            style={{ opacity: isTransitioning ? 0 : 0.25, transition: "opacity 400ms", filter: "brightness(1.1) contrast(0.9)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(200,168,48,0.65) 0%, rgba(200,168,48,0.85) 100%)",
            }}
          />
        </div>
      ) : null}

      {/* Imagen de fondo actual */}
      {currentImage ? (
        <div className="pointer-events-none absolute inset-0">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="100vw"
            src={currentImage}
            style={{ opacity: 0.25, filter: "brightness(1.1) contrast(0.9)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(200,168,48,0.65) 0%, rgba(200,168,48,0.85) 100%)",
            }}
          />
        </div>
      ) : null}

      {/* Contenido principal */}
      <div className="relative z-[1] border-b" style={{ borderColor: "rgba(58,48,1,0.1)", paddingBottom: "2.5rem" }}>
        {/* Breadcrumb */}
        <div
          className="flex flex-wrap items-center gap-2"
          style={{ marginBottom: "1.25rem", fontSize: "10px" }}
        >
          <Link
            className="transition-colors"
            href="/"
            style={{ color: "var(--text-light)" }}
          >
            Inicio
          </Link>
          <span style={{ color: "var(--text-light)", opacity: 0.5 }}>/</span>
          <Link
            className="transition-colors"
            href="/productos"
            style={{ color: activeCategoryData ? "var(--text-light)" : "var(--text)" }}
          >
            Colección
          </Link>
          {activeCategoryData ? (
            <>
              <span style={{ color: "var(--text-light)", opacity: 0.5 }}>/</span>
              <span style={{ color: "var(--text)" }}>{activeCategoryData.name}</span>
            </>
          ) : null}
        </div>

        {/* Título */}
        <h1
          className="font-display font-normal leading-[1.04] text-text"
          style={{ fontSize: "clamp(42px,4.6vw,64px)", letterSpacing: "-0.015em" }}
        >
          {activeCategoryData ? (
            activeCategoryData.name
          ) : (
            <>
              Nuestra{" "}
              <em
                className="editorial-emphasis"
                style={{
                  color: "var(--text)",
                }}
              >
                colección
              </em>
            </>
          )}
        </h1>

        {/* Subtítulo */}
        <p
          className="font-editorial font-light text-text-mid"
          style={{ fontSize: "14px", lineHeight: 1.8, marginTop: "1rem", maxWidth: "42rem" }}
        >
          {subtitle}
        </p>
      </div>

      {/* Tabs de categorías */}
      <TabsWithFade
        activeCategory={activeCategory}
        categories={categories}
        updateCategory={updateCategory}
      />
    </section>
  );
}

/* ---------- Sub-componente: tabs con fade lateral ---------- */

function TabsWithFade({
  activeCategory,
  categories,
  updateCategory,
}: {
  activeCategory: string;
  categories: PageHeaderProps["categories"];
  updateCategory: (slug: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  return (
    <div className="relative z-[1] group">
      {/* Fade izquierdo y botón */}
      <div
        className="absolute left-0 top-0 bottom-0 z-[2] flex items-center"
        style={{
          width: "48px",
          background: "linear-gradient(to right, #c8a830, transparent)",
          opacity: showLeft ? 1 : 0,
          transition: "opacity 0.25s",
          pointerEvents: showLeft ? "auto" : "none",
        }}
      >
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
          className="hidden lg:flex items-center justify-center w-6 h-6 ml-1 rounded-full bg-black/5 text-text hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Desplazar a la izquierda"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      {/* Fade derecho y botón */}
      <div
        className="absolute right-0 top-0 bottom-0 z-[2] flex items-center justify-end"
        style={{
          width: "48px",
          background: "linear-gradient(to left, #c8a830, transparent)",
          opacity: showRight ? 1 : 0,
          transition: "opacity 0.25s",
          pointerEvents: showRight ? "auto" : "none",
        }}
      >
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
          className="hidden lg:flex items-center justify-center w-6 h-6 mr-1 rounded-full bg-black/5 text-text hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Desplazar a la derecha"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto border-t [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={checkScroll}
        style={{ borderColor: "rgba(58,48,1,0.05)" }}
      >
        <button
          className={cx(
            "relative shrink-0 transition-colors",
            !activeCategory ? "font-medium text-text" : "text-text-light hover:text-text",
          )}
          onClick={() => updateCategory("")}
          style={{ padding: "1rem 1.25rem", fontSize: "12px", letterSpacing: "0.05em" }}
          type="button"
        >
          Todos
          <span
            className="absolute inset-x-4 bottom-0 origin-left bg-moss transition-transform duration-300"
            style={{
              height: "2px",
              transform: !activeCategory ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </button>

        {categories.map((category) => {
          const isActive = category.slug === activeCategory;

          return (
            <button
              className={cx(
                "relative shrink-0 transition-colors",
                isActive ? "font-medium text-text" : "text-text-light hover:text-text",
              )}
              key={category.id}
              onClick={() => updateCategory(category.slug)}
              style={{ padding: "1rem 1.25rem", fontSize: "12px", letterSpacing: "0.05em" }}
              type="button"
            >
              {category.name}
              <span
                className="absolute inset-x-4 bottom-0 origin-left bg-moss transition-transform duration-300"
                style={{
                  height: "2px",
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
