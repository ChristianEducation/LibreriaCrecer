"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import type { CuratedProduct } from "@/features/catalogo/types";
import { useScrollReveal } from "@/shared/hooks";
import { formatCLP } from "@/shared/utils/formatters";

type LibrosMesSectionProps = {
  items: CuratedProduct[];
};

function SliderChevron({ direction }: { direction: "prev" | "next" }) {
  if (direction === "prev") {
    return (
      <svg
        aria-hidden="true"
        className="h-[length:var(--lm-icon)] w-[length:var(--lm-icon)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className="h-[length:var(--lm-icon)] w-[length:var(--lm-icon)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function BookTile({ item }: { item: CuratedProduct }) {
  const product = item.product;
  const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const revealRef = useScrollReveal<HTMLAnchorElement>();

  return (
    <Link
      className="libros-mes-card reveal group block shrink-0 cursor-pointer"
      data-libros-card
      href={`/productos/${product.slug}`}
      ref={revealRef}
    >
      <div className="libros-mes-card-cover relative aspect-[2/3] overflow-hidden rounded-[2px] bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))] shadow-[4px_6px_24px_rgba(58,48,1,0.12)] transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[6px_12px_32px_rgba(58,48,1,0.2)]">
        {product.mainImageUrl ? (
          <Image
            alt={product.title}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 220px"
            src={product.mainImageUrl}
          />
        ) : null}
      </div>
      <p className="libros-mes-brand mb-0.5 tracking-[0.04em] text-text-light">
        {product.author ?? "Selección especial"}
      </p>
      <h3 className="libros-mes-libro-title mb-1 font-serif font-medium leading-[1.3] text-text">{product.title}</h3>
      <p className="libros-mes-price font-medium text-gold">{formatCLP(price)}</p>
    </Link>
  );
}

function EmptySlider() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[2px] border border-dashed border-border bg-beige-warm/40 px-6 py-10 text-center">
      <svg
        aria-hidden="true"
        className="h-14 w-14 opacity-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        viewBox="0 0 24 24"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
      <p className="font-serif text-lg font-normal text-text-mid">Sin selección este mes</p>
      <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-text-light">
        Próximamente una curaduría especial de títulos seleccionados.
      </p>
    </div>
  );
}

export function LibrosMesSection({ items }: LibrosMesSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function scrollByDirection(direction: number) {
    const track = scrollRef.current;
    if (!track) {
      return;
    }
    const card = track.querySelector<HTMLElement>("[data-libros-card]");
    if (!card) {
      return;
    }
    const styles = getComputedStyle(track);
    const gapRaw = styles.columnGap || styles.gap;
    const gap = Number.parseFloat(gapRaw) || 0;
    const step = card.offsetWidth + gap;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section className="page-px flex min-h-[75vh] flex-col justify-center bg-white py-16 md:py-20" id="libros-mes">
        <div className="libros-mes-grid">
          <div>
            <p className="libros-mes-eyebrow flex items-center gap-2 font-sans uppercase tracking-[0.35em] text-gold">
              <span className="libros-mes-eyebrow-line h-px shrink-0 bg-gold" />
              Selección especial
            </p>
            <h2 className="libros-mes-title font-serif font-normal text-moss">
              Selección
              <br />
              del mes
            </h2>
            <p className="libros-mes-body text-text-light">
              Una selección de obras particularmente relevantes e inspiradoras: desde estudios bíblicos y devocionales
              hasta biografías de figuras católicas.
            </p>
          </div>

          <div className="flex items-center gap-0">
            {items.length > 0 && (
              <button
                aria-label="Anterior"
                className="libros-mes-btn shrink-0 flex items-center justify-center rounded-[2px] border border-border bg-transparent text-text-mid transition-all duration-[220ms] hover:border-moss hover:bg-moss hover:text-white"
                onClick={() => scrollByDirection(-1)}
                type="button"
              >
                <SliderChevron direction="prev" />
              </button>
            )}
            <div className="min-w-0 flex-1 overflow-hidden">
              {items.length === 0 ? (
                <EmptySlider />
              ) : (
                <div
                  className="libros-mes-track overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  ref={scrollRef}
                >
                  {items.map((item) => (
                    <BookTile item={item} key={item.id} />
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <button
                aria-label="Siguiente"
                className="libros-mes-btn shrink-0 flex items-center justify-center rounded-[2px] border border-border bg-transparent text-text-mid transition-all duration-[220ms] hover:border-moss hover:bg-moss hover:text-white"
                onClick={() => scrollByDirection(1)}
                type="button"
              >
                <SliderChevron direction="next" />
              </button>
            )}
          </div>
        </div>
    </section>
  );
}
