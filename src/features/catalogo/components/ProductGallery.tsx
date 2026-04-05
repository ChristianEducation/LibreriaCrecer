"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cx } from "class-variance-authority";

type GalleryImage = {
  id: string;
  url: string | null;
  altText?: string | null;
};

export interface ProductGalleryProps {
  images: { id: string; url: string; altText?: string | null }[];
  productTitle: string;
  productAuthor?: string | null;
  mainImageUrl?: string | null;
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg aria-hidden="true" className="size-[14px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PlaceholderBook({
  productTitle,
  productAuthor,
  className,
}: {
  productTitle: string;
  productAuthor?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(160deg,#3A2A20_0%,#5C3A28_40%,#3A2A20_100%)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]",
        className,
      )}
    >
      <div className="flex h-[88%] w-[78%] flex-col items-center justify-center border border-white/[0.12] px-5 py-7 text-center">
        {productAuthor ? (
          <>
            <span className="mb-4 text-[11px] uppercase tracking-[0.18em] text-white/[0.55]">
              {productAuthor}
            </span>
            <div className="mb-4 h-px w-[40%] bg-white/[0.15]" />
          </>
        ) : null}

        <span className="font-serif text-[26px] italic leading-[1.2] text-white/[0.92]">
          {productTitle}
        </span>

        <div className="my-4 h-px w-[40%] bg-white/[0.15]" />
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/[0.3]">
          Crecer Libreria Cristiana
        </span>
      </div>
    </div>
  );
}

function buildGalleryImages(
  mainImageUrl: string | null | undefined,
  images: ProductGalleryProps["images"],
): GalleryImage[] {
  const items: GalleryImage[] = [];
  const seen = new Set<string>();

  if (mainImageUrl) {
    seen.add(mainImageUrl);
    items.push({
      id: "main-image",
      url: mainImageUrl,
      altText: null,
    });
  }

  for (const image of images) {
    if (!image.url || seen.has(image.url)) {
      continue;
    }

    seen.add(image.url);
    items.push(image);
  }

  if (items.length === 0) {
    items.push({
      id: "placeholder",
      url: null,
      altText: null,
    });
  }

  return items;
}

export function ProductGallery({
  images,
  productTitle,
  productAuthor,
  mainImageUrl,
}: ProductGalleryProps) {
  const galleryImages = useMemo(
    () => buildGalleryImages(mainImageUrl, images),
    [images, mainImageUrl],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [galleryImages]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen]);

  return (
    <>
      <div className="lg:sticky lg:top-[88px]">
        <button
          className="group relative mb-3 block aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))] shadow-[0_8px_40px_rgba(58,48,1,0.1)]"
          onClick={() => setIsLightboxOpen(true)}
          style={{ maxWidth: "420px", margin: "0 auto" }}
          type="button"
        >
          {activeImage?.url ? (
            <Image
              alt={activeImage.altText ?? productTitle}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              src={activeImage.url}
            />
          ) : (
            <PlaceholderBook productAuthor={productAuthor} productTitle={productTitle} />
          )}

          <span className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-[2px] border border-white/[0.15] bg-[rgba(58,48,1,0.6)] text-white backdrop-blur-[8px] transition-colors duration-200 group-hover:bg-[rgba(58,48,1,0.85)]">
            <ExpandIcon />
          </span>
        </button>

        {galleryImages.length > 1 && (
        <div className="flex gap-2">
          {galleryImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                className={cx(
                  "relative aspect-[2/3] w-16 overflow-hidden rounded-[2px] border-2 border-transparent bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))] opacity-55 transition-[border-color,opacity] duration-200 hover:opacity-85",
                  isActive ? "border-gold opacity-100" : "",
                )}
                key={image.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                {image.url ? (
                  <Image
                    alt={image.altText ?? `${productTitle} ${index + 1}`}
                    className="object-cover"
                    fill
                    sizes="64px"
                    src={image.url}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-moss/20">
                    <BookIcon className="size-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        )}
      </div>

      <div
        aria-hidden={!isLightboxOpen}
        className={cx(
          "fixed inset-0 z-[9000] flex items-center justify-center bg-[rgba(46,38,1,0.92)] p-6 opacity-0 backdrop-blur-[8px] transition-[opacity,visibility] duration-300",
          isLightboxOpen ? "visible opacity-100" : "invisible",
        )}
        onClick={() => setIsLightboxOpen(false)}
      >
        <div className="relative w-full max-w-[480px]">
          <button
            aria-label="Cerrar imagen ampliada"
            className="absolute -top-11 right-0 flex size-9 items-center justify-center rounded-full border border-white/20 text-lg text-white transition-colors duration-200 hover:bg-white/10"
            onClick={() => setIsLightboxOpen(false)}
            type="button"
          >
            ×
          </button>

          <div
            className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-[linear-gradient(160deg,#3A2A20_0%,#5C3A28_40%,#3A2A20_100%)]"
            onClick={(event) => event.stopPropagation()}
          >
            {activeImage?.url ? (
              <Image
                alt={activeImage.altText ?? productTitle}
                className="object-cover"
                fill
                sizes="90vw"
                src={activeImage.url}
              />
            ) : (
              <PlaceholderBook productAuthor={productAuthor} productTitle={productTitle} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
