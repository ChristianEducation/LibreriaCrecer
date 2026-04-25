import Link from "next/link";
import type { CSSProperties } from "react";

import type { HeroViewModel } from "../../view-models/hero-view-model";

export type HeroPreviewProps = {
  data: HeroViewModel;
  viewMode?: "desktop" | "mobile";
};

export function HeroPreview({ data, viewMode = "desktop" }: HeroPreviewProps) {
  const slide = data.slides[0];

  if (!slide) {
    return null;
  }

  const isMobile = viewMode === "mobile";

  const stageStyle: CSSProperties | undefined = slide.imageUrl
    ? { backgroundImage: `url(${slide.imageUrl})` }
    : undefined;

  const overlayStyle: CSSProperties = { opacity: slide.overlayOpacity / 100 };

  return (
    <div className={`hero-preview hero-preview--${viewMode}`}>
      {isMobile ? (
        <div className="hero-preview-notch">
          <div className="hero-preview-notch-bar" />
        </div>
      ) : (
        <div className="hero-preview-chrome">
          <div className="hero-preview-dots">
            <span className="hero-preview-dot hero-preview-dot--red" />
            <span className="hero-preview-dot hero-preview-dot--yellow" />
            <span className="hero-preview-dot hero-preview-dot--green" />
          </div>
          <div className="hero-preview-urlbar">crecer.cl</div>
        </div>
      )}

      <div className="hero-preview-mocknav">
        <div className="hero-preview-mocknav-brand">
          <div className="hero-preview-mocknav-logo" aria-hidden="true">
            C
          </div>
          {!isMobile ? <span className="hero-preview-mocknav-name">Crecer</span> : null}
        </div>
        {!isMobile ? (
          <div className="hero-preview-mocknav-links">
            <span>Inicio</span>
            <span>Libros</span>
            <span>Liturgia</span>
            <span>Espiritualidad</span>
            <span>Nosotros</span>
          </div>
        ) : null}
        <div className="hero-preview-mocknav-icons">
          <span className="hero-preview-mocknav-icon" aria-hidden="true">
            <svg
              fill="none"
              height="13"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
              viewBox="0 0 20 20"
              width="13"
            >
              <path d="M8.5 14a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM15 15l-2.5-2.5" />
            </svg>
          </span>
          <span className="hero-preview-mocknav-icon" aria-hidden="true">
            <svg
              fill="none"
              height="13"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
              viewBox="0 0 20 20"
              width="13"
            >
              <path d="M10 2l8 4.5v7L10 18l-8-4.5v-7zM10 2v16M2 6.5l8 4.5 8-4.5" />
            </svg>
          </span>
        </div>
      </div>

      <div
        className={`hero-preview-stage hero-preview-stage--${slide.textPosition} ${
          slide.imageUrl ? "" : "hero-preview-stage--fallback"
        }`}
        style={stageStyle}
      >
        {slide.overlayVariant !== "none" && slide.imageUrl ? (
          <div
            aria-hidden="true"
            className={`hero-preview-overlay hero-preview-overlay--${slide.overlayVariant}`}
            style={overlayStyle}
          />
        ) : null}

        <span aria-hidden="true" className="hero-preview-deco hero-preview-deco--tr" />
        <span aria-hidden="true" className="hero-preview-deco hero-preview-deco--bl" />

        {slide.showContent ? (
          <div
            className={`hero-preview-content hero-preview-content--${slide.textAlign} hero-preview-content--${slide.contentTheme}`}
          >
            {data.eyebrow ? (
              <span className="hero-preview-badge">
                <svg
                  aria-hidden="true"
                  fill="currentColor"
                  height="11"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.6"
                  viewBox="0 0 20 20"
                  width="11"
                >
                  <path d="M10 2l1.8 4 4.2.6-3 3 .7 4.2L10 12l-3.7 1.8.7-4.2-3-3 4.2-.6z" />
                </svg>
                {data.eyebrow}
              </span>
            ) : null}

            {slide.title ? <h2 className="hero-preview-title">{slide.title}</h2> : null}

            {slide.subtitle ? <p className="hero-preview-subtitle">{slide.subtitle}</p> : null}

            {slide.ctaText && slide.linkUrl ? (
              <Link className="hero-preview-cta" href={slide.linkUrl}>
                {slide.ctaText}
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="13"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 20 20"
                  width="13"
                >
                  <path d="M4 10h12M12 6l4 4-4 4" />
                </svg>
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="hero-preview-chips">
        <span className="hero-preview-chip hero-preview-chip--active">Novedades</span>
        <span className="hero-preview-chip">Más vendidos</span>
        <span className="hero-preview-chip">Biblias</span>
        <span className="hero-preview-chip">Liturgia</span>
      </div>
    </div>
  );
}
