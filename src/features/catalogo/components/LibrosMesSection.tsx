"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import type { CuratedProduct } from "@/features/catalogo/types";
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

  return (
    <Link
      className="libros-mes-card group block shrink-0 cursor-pointer"
      data-libros-card
      href={`/productos/${product.slug}`}
    >
      <div className="libros-mes-card-cover relative aspect-[2/3] overflow-hidden rounded-[2px] bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))] shadow-[4px_6px_24px_rgba(58,48,1,0.12)] transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[6px_12px_32px_rgba(58,48,1,0.2)]">
        {product.mainImageUrl ? (
          <Image
            alt={product.title}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 260px"
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
    <section className="bg-white p-[14px]" id="libros-mes">
      <div className="libros-mes-panel relative overflow-hidden rounded-[var(--lm-radius)] bg-beige">
        <div className="libros-mes-inner">
          <div className="libros-mes-grid">
            <div>
              <p className="libros-mes-eyebrow flex items-center gap-2 font-sans uppercase tracking-[0.35em] text-gold">
                <span className="libros-mes-eyebrow-line h-px shrink-0 bg-gold" />
                Selección especial
              </p>
              <h2 className="libros-mes-title font-serif font-normal text-moss">
                Libros
                <br />
                del mes
              </h2>
              <p className="libros-mes-body text-text-light">
                Una selección de obras particularmente relevantes e inspiradoras: desde estudios bíblicos y devocionales
                hasta biografías de figuras católicas.
              </p>
              <div className="libros-mes-controls flex">
                <button
                  aria-label="Anterior"
                  className="libros-mes-btn flex items-center justify-center rounded-[2px] border border-border bg-transparent text-text-mid transition-all duration-[220ms] hover:border-moss hover:bg-moss hover:text-white"
                  onClick={() => scrollByDirection(-1)}
                  type="button"
                >
                  <SliderChevron direction="prev" />
                </button>
                <button
                  aria-label="Siguiente"
                  className="libros-mes-btn flex items-center justify-center rounded-[2px] border border-border bg-transparent text-text-mid transition-all duration-[220ms] hover:border-moss hover:bg-moss hover:text-white"
                  onClick={() => scrollByDirection(1)}
                  type="button"
                >
                  <SliderChevron direction="next" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="libros-mes-track overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                ref={scrollRef}
              >
                {items.map((item) => (
                  <BookTile item={item} key={item.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
