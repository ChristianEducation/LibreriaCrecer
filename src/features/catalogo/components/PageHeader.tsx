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
    ? "Una curaduria pensada para acompanar estudio, lectura y devocion."
    : "Explora novedades, clasicos y selecciones con una identidad editorial sobria.";

  return (
    <section className="relative overflow-hidden bg-moss px-5 pt-10 md:px-10 md:pt-14 lg:px-14 lg:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,208,96,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(200,168,48,0.16),transparent_32%)]" />

      {previousImage ? (
        <div className="absolute inset-0">
          <Image
            alt=""
            className={cx(
              "object-cover mix-blend-multiply opacity-[0.35] transition-opacity duration-[400ms]",
              isTransitioning ? "opacity-0" : "opacity-[0.35]",
            )}
            fill
            sizes="100vw"
            src={previousImage}
          />
        </div>
      ) : null}

      {currentImage ? (
        <div className="absolute inset-0">
          <Image
            alt=""
            className="object-cover mix-blend-multiply opacity-[0.35] transition-opacity duration-[400ms]"
            fill
            sizes="100vw"
            src={currentImage}
          />
        </div>
      ) : null}

      <div className="relative z-[1] border-b border-b-white/10 pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] text-white/40">
          <Link className="transition-colors hover:text-gold-light" href="/">
            Inicio
          </Link>
          <span>/</span>
          <Link className="transition-colors hover:text-gold-light" href="/productos">
            Coleccion
          </Link>
          {activeCategoryData ? (
            <>
              <span>/</span>
              <span className="text-gold-light">{activeCategoryData.name}</span>
            </>
          ) : null}
        </div>

        <h1 className="max-w-3xl font-serif text-[clamp(36px,4vw,56px)] font-normal leading-[1.04] text-white">
          {activeCategoryData ? (
            activeCategoryData.name
          ) : (
            <>
              Coleccion <em className="font-normal italic text-[rgba(237,217,106,0.85)]">Crecer</em>
            </>
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-[14px] font-light leading-[1.8] text-white/55">{subtitle}</p>
      </div>

      <div className="relative z-[1] flex gap-1 overflow-x-auto border-t border-t-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          className={cx(
            "relative shrink-0 px-5 py-4 text-[12px] font-normal text-white/45 transition-colors hover:text-white/75",
            !activeCategory ? "font-medium text-white" : "",
          )}
          onClick={() => updateCategory("")}
          type="button"
        >
          Todos
          <span
            className={cx(
              "absolute inset-x-4 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300",
              !activeCategory ? "scale-x-100" : "scale-x-0",
            )}
          />
        </button>

        {categories.map((category) => {
          const isActive = category.slug === activeCategory;

          return (
            <button
              className={cx(
                "relative shrink-0 px-5 py-4 text-[12px] font-normal text-white/45 transition-colors hover:text-white/75",
                isActive ? "font-medium text-white" : "",
              )}
              key={category.id}
              onClick={() => updateCategory(category.slug)}
              type="button"
            >
              {category.name}
              <span
                className={cx(
                  "absolute inset-x-4 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
