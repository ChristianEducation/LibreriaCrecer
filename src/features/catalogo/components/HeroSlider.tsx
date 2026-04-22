"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cx } from "class-variance-authority";

type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  displayOrder: number;
};

type HeroSliderProps = {
  slides: HeroSlide[];
};

const fallbackSlide: HeroSlide = {
  id: "fallback",
  title: "Crecer Librería Cristiana",
  subtitle: "Librería Católica · Antofagasta",
  imageUrl: "",
  linkUrl: "/productos",
  displayOrder: 0,
};

const heroCopy = {
  eyebrow: "Libreria Catolica · Antofagasta",
  titleStart: "Al servicio de la fe,",
  titleEmphasis: "la educacion y la cultura",
  description:
    "Una cuidada seleccion de libros y textos para el crecimiento personal y comunitario en la sociedad actual.",
} as const;

/** Solo chevron, sin contorno — navegación del carrusel */
function HeroNavChevron({ direction }: { direction: "left" | "right" }) {
  if (direction === "left") {
    return (
      <svg aria-hidden="true" className="h-9 w-9 shrink-0 md:h-11 md:w-11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" className="h-9 w-9 shrink-0 md:h-11 md:w-11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const items = useMemo(() => (slides.length > 0 ? slides : [fallbackSlide]), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [items.length]);

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % items.length);
  }

  const activeSlide = items[activeIndex] ?? fallbackSlide;

  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    function onScroll() {
      setHasScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero-full">
      <div className="relative flex h-full w-full items-center justify-center bg-moss text-center">
        {activeSlide.imageUrl ? (
          <Image
            alt={activeSlide.title ?? "Hero principal"}
            className="object-cover transition-transform duration-[8000ms] ease-out"
            fill
            priority
            sizes="100vw"
            src={activeSlide.imageUrl}
          />
        ) : null}

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(58,48,1,0.25)_0%,rgba(58,48,1,0.68)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent)]" />

        <div className="absolute inset-0 z-[2] flex items-center justify-center px-5 md:px-10">
          {/* .hero-content: max-width 740px; .hero-tag mb 28px; h1 mb 22px; .hero-desc mb 44px; .hero-actions */}
          <div className="flex w-full max-w-[740px] flex-col items-center text-white">
            <div className="mb-7 inline-flex items-center gap-2 border border-gold/35 bg-gold/8 px-4 py-[5px] text-[10px] uppercase tracking-[0.22em] text-white/85">
              <span className="h-1 w-1 rounded-full bg-gold" />
              {heroCopy.eyebrow}
              <span className="h-1 w-1 rounded-full bg-gold" />
            </div>

            <h1 className="font-display mb-[22px] text-[clamp(44px,6vw,82px)] font-normal leading-[1.05] tracking-[-0.015em] text-white">
              {heroCopy.titleStart}
              <br />
              <em className="editorial-emphasis text-[rgba(232,210,140,0.92)]">{heroCopy.titleEmphasis}</em>
            </h1>
            <p className="font-editorial max-w-[440px] text-[15px] font-light leading-[1.8] tracking-[0.01em] text-white/72" style={{ marginBottom: "4rem" }}>
              {heroCopy.description}
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                className="inline-flex items-center gap-2 border border-white/35 text-[13px] uppercase tracking-[0.14em] text-white/85 transition-colors duration-200 hover:border-gold hover:text-gold"
                href="/productos"
                style={{ padding: "0.45rem 1.1rem" }}
              >
                Ver colección
                <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {items.length > 1 ? (
            <>
              <div className="absolute inset-y-0 left-0 z-[3] flex items-center pl-2 md:pl-5 lg:pl-8">
                <button
                  aria-label="Slide anterior"
                  className="touch-manipulation p-2 text-white/90 transition-[color,transform] duration-200 [filter:drop-shadow(0_2px_8px_rgba(58,48,1,0.45))] hover:-translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  onClick={goToPrevious}
                  type="button"
                >
                  <HeroNavChevron direction="left" />
                </button>
              </div>

              <div className="absolute inset-y-0 right-0 z-[3] flex items-center pr-2 md:pr-5 lg:pr-8">
                <button
                  aria-label="Siguiente slide"
                  className="touch-manipulation p-2 text-white/90 transition-[color,transform] duration-200 [filter:drop-shadow(0_2px_8px_rgba(58,48,1,0.45))] hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  onClick={goToNext}
                  type="button"
                >
                  <HeroNavChevron direction="right" />
                </button>
              </div>
            </>
          ) : null}

          {items.length > 1 ? (
            <div className="absolute bottom-7 right-6 z-[3] flex items-center md:bottom-9 md:right-10">
              <div className="flex items-center gap-2">
                {items.map((item, index) => (
                  <button
                    aria-label={`Ir al slide ${index + 1}`}
                    className={cx(
                      "h-[10px] w-[10px] rounded-full border transition-all duration-300 md:h-[11px] md:w-[11px]",
                      index === activeIndex
                        ? "border-gold bg-gold shadow-[0_0_0_4px_rgba(217,186,30,0.18)]"
                        : "border-white/55 bg-white/38 hover:border-white/75 hover:bg-white/58",
                    )}
                    key={item.id}
                    onClick={() => goToSlide(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="hero-scroll-indicator"
          style={{ opacity: hasScrolled ? 0 : 1 }}
        />
      </div>
    </section>
  );
}
