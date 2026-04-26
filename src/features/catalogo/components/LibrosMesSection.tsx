"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import type { CuratedProduct } from "@/features/catalogo/types";
import type { LibrosMesViewModel } from "@/features/catalogo/view-models/libros-mes-view-model";
import { useScrollReveal } from "@/shared/hooks";
import { formatCLP } from "@/shared/utils/formatters";

type LibrosMesSectionProps = {
  items: CuratedProduct[];
  copy?: LibrosMesViewModel;
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
      <div className="relative aspect-[2/3] overflow-hidden rounded-[2px] bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))] shadow-[4px_6px_24px_rgba(58,48,1,0.12)] transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[6px_12px_32px_rgba(58,48,1,0.22)]">
        {product.mainImageUrl ? (
          <Image
            alt={product.title}
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 220px"
            src={product.mainImageUrl}
          />
        ) : null}
      </div>

      <div style={{ paddingTop: "10px" }}>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-light)" }}>
          {product.author ?? "Selección especial"}
        </p>
        <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 600, color: "var(--text)", marginTop: "4px", lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.title}
        </h3>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--gold-light)", marginTop: "4px" }}>
          {formatCLP(price)}
        </p>
      </div>
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

export function LibrosMesSection({ items, copy }: LibrosMesSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const title = copy?.title?.trim() || "Selección\ndel mes";
  const body =
    copy?.body?.trim() ||
    "Una selección de obras particularmente relevantes e inspiradoras: desde estudios bíblicos y devocionales hasta biografías de figuras católicas.";

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
    <section className="page-px bg-white" id="libros-mes" style={{ paddingTop: "9rem", paddingBottom: "10rem" }}>
        <div className="storefront-container libros-mes-grid">
          <div>
            <p
              className="eyebrow libros-mes-eyebrow flex items-center gap-2"
              style={{ marginBottom: "0.75rem" }}
            >
              <span className="libros-mes-eyebrow-line h-px shrink-0" style={{ background: "var(--gold)" }} />
              SELECCIÓN ESPECIAL
            </p>
            <h2 className="heading-xl libros-mes-title font-normal" style={{ fontFamily: "var(--font-castoro)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", fontWeight: 400, color: "var(--moss)" }}>
              {title.split("\n").map((line, index, lines) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
            <p className="libros-mes-body text-text-light" style={{ fontFamily: "var(--font-inter)" }}>
              {body}
            </p>
          </div>

          <div className="libros-mes-slider">
            {items.length > 0 && (
              <button
                aria-label="Anterior"
                className="libros-nav-round libros-mes-prev"
                onClick={() => scrollByDirection(-1)}
                type="button"
              >
                <SliderChevron direction="prev" />
              </button>
            )}
            <div className="libros-mes-viewport min-w-0 overflow-hidden">
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
                className="libros-nav-round libros-mes-next"
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
