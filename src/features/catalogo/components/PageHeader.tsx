"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  COLLECTION_HERO_DEFAULT_IMAGE,
  getCategoryHeaderImage,
  getCategoryImage,
} from "@/shared/config/category-images";

export interface PageHeaderProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    headerImageUrl?: string | null;
  }[];
  activeCategory: string;
  defaultHeaderImageUrl?: string | null;
}

// Estilos compartidos con /regalos (clases `gifts-hero*`, `gifts-bar`, `gifts-chip*`).
export function PageHeader({
  categories,
  activeCategory,
  defaultHeaderImageUrl = null,
}: PageHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeCategoryData = useMemo(
    () => categories.find((category) => category.slug === activeCategory) ?? null,
    [activeCategory, categories],
  );

  const heroImage = activeCategoryData
    ? getCategoryHeaderImage(activeCategoryData.slug, activeCategoryData.headerImageUrl)
    : (defaultHeaderImageUrl ?? COLLECTION_HERO_DEFAULT_IMAGE);

  function updateCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set("cat", slug);
    } else {
      params.delete("cat");
    }
    params.delete("page");

    const query = params.toString();
    router.push(query ? `/productos?${query}` : "/productos", { scroll: false });
  }

  function scrollChips(direction: "prev" | "next") {
    const row = scrollRef.current;
    if (!row) return;
    row.scrollBy({ left: (direction === "next" ? 1 : -1) * row.clientWidth * 0.8, behavior: "smooth" });
  }

  const subtitle =
    activeCategoryData?.description ??
    (activeCategoryData
      ? "Una curaduría pensada para acompañar el estudio, la lectura y la devoción."
      : "Libros, biblias y artículos religiosos para el crecimiento espiritual.");

  return (
    <>
      <header className="gifts-hero page-px" style={{ paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <div className="gifts-hero-inner storefront-container">
          <div className="gifts-hero-copy">
            <nav aria-label="Ruta" className="gifts-breadcrumb">
              <Link href="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              {activeCategoryData ? <Link href="/productos">Colección</Link> : <span>Colección</span>}
              {activeCategoryData ? (
                <>
                  <span aria-hidden="true">/</span>
                  <span>{activeCategoryData.name}</span>
                </>
              ) : null}
            </nav>

            <h1 className="gifts-hero-title" style={{ marginTop: "1.25rem" }}>
              {activeCategoryData ? (
                activeCategoryData.name
              ) : (
                <>
                  Nuestra <em>colección</em>
                </>
              )}
            </h1>
            <span aria-hidden="true" className="gifts-accent" />
            <p className="gifts-hero-lead" style={{ marginTop: "1.1rem" }}>
              {subtitle}
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="gifts-hero-media">
          <Image
            alt=""
            className="gifts-hero-photo"
            fill
            key={heroImage}
            priority
            sizes="(max-width: 1024px) 0px, 760px"
            src={heroImage}
            style={{ objectFit: "cover", objectPosition: "center 55%" }}
          />
        </div>
      </header>

      <div className="gifts-bar page-px">
        <div className="storefront-container coll-bar-inner">
          <div aria-label="Categorías" className="gifts-chips" ref={scrollRef} role="group">
            <button
              aria-pressed={!activeCategory}
              className="gifts-chip gifts-chip--plain"
              onClick={() => updateCategory("")}
              type="button"
            >
              Todos
            </button>
            {categories.map((category) => {
              const thumb = getCategoryImage(category.slug, category.imageUrl);

              return (
                <button
                  aria-pressed={category.slug === activeCategory}
                  className="gifts-chip"
                  key={category.id}
                  onClick={() => updateCategory(category.slug)}
                  type="button"
                >
                  {thumb ? (
                    <span aria-hidden="true" className="gifts-chip-thumb">
                      <Image alt="" fill sizes="32px" src={thumb} style={{ objectFit: "cover" }} />
                    </span>
                  ) : null}
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="coll-bar-arrows hidden lg:flex">
            <button aria-label="Categorías anteriores" className="carousel-nav-btn" onClick={() => scrollChips("prev")} style={{ borderRadius: "50%" }} type="button">
              <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button aria-label="Más categorías" className="carousel-nav-btn" onClick={() => scrollChips("next")} style={{ borderRadius: "50%" }} type="button">
              <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
