"use client";

import { useEffect, useMemo, useState } from "react";
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

  const hasBg = !!currentImage;

  return (
    <section
      className="page-px relative overflow-hidden"
      style={{
        background: hasBg
          ? "#3a3001"
          : `#4a3c02 radial-gradient(ellipse at 70% 50%, rgba(217,186,30,0.07) 0%, transparent 60%)`,
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
            style={{ opacity: isTransitioning ? 0 : 0.45, transition: "opacity 400ms" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(58,48,1,0.55) 0%, rgba(58,48,1,0.45) 100%)",
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
            style={{ opacity: 0.45 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(58,48,1,0.55) 0%, rgba(58,48,1,0.45) 100%)",
            }}
          />
        </div>
      ) : null}

      {/* Contenido principal */}
      <div className="relative z-[1] border-b" style={{ borderColor: "rgba(255,255,255,0.07)", paddingBottom: "2.5rem" }}>
        {/* Breadcrumb */}
        <div
          className="flex flex-wrap items-center gap-2"
          style={{ marginBottom: "1.25rem", fontSize: "10px" }}
        >
          <Link
            className="transition-colors"
            href="/"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Inicio
          </Link>
          <span style={{ color: "rgba(255,255,255,0.35)", opacity: 0.3 }}>/</span>
          <Link
            className="transition-colors"
            href="/productos"
            style={{ color: activeCategoryData ? "rgba(255,255,255,0.35)" : "var(--gold-light)" }}
          >
            Colección
          </Link>
          {activeCategoryData ? (
            <>
              <span style={{ color: "rgba(255,255,255,0.35)", opacity: 0.3 }}>/</span>
              <span style={{ color: "var(--gold-light)" }}>{activeCategoryData.name}</span>
            </>
          ) : null}
        </div>

        {/* Título */}
        <h1
          className="font-display font-normal leading-[1.04] text-white"
          style={{ fontSize: "clamp(42px,4.6vw,64px)", letterSpacing: "-0.015em" }}
        >
          {activeCategoryData ? (
            activeCategoryData.name
          ) : (
            <>
              Nuestra{" "}
              <em className="editorial-emphasis" style={{ color: "rgba(232,210,140,0.9)" }}>
                colección
              </em>
            </>
          )}
        </h1>

        {/* Subtítulo */}
        <p
          className="font-editorial font-light text-white/60"
          style={{ fontSize: "14px", lineHeight: 1.8, marginTop: "1rem", maxWidth: "42rem" }}
        >
          {subtitle}
        </p>
      </div>

      {/* Tabs de categorías */}
      <div
        className="relative z-[1] flex gap-1 overflow-x-auto border-t [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <button
          className={cx(
            "relative shrink-0 transition-colors",
            !activeCategory ? "font-medium text-white" : "text-white/45 hover:text-white/75",
          )}
          onClick={() => updateCategory("")}
          style={{ padding: "1rem 1.25rem", fontSize: "12px", letterSpacing: "0.05em" }}
          type="button"
        >
          Todos
          <span
            className="absolute inset-x-4 bottom-0 origin-left bg-gold transition-transform duration-300"
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
                isActive ? "font-medium text-white" : "text-white/45 hover:text-white/75",
              )}
              key={category.id}
              onClick={() => updateCategory(category.slug)}
              style={{ padding: "1rem 1.25rem", fontSize: "12px", letterSpacing: "0.05em" }}
              type="button"
            >
              {category.name}
              <span
                className="absolute inset-x-4 bottom-0 origin-left bg-gold transition-transform duration-300"
                style={{
                  height: "2px",
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
