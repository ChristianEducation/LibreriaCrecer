"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

import { useCart } from "@/features/carrito/hooks";
import { Badge } from "@/shared/ui";
import { useScrollReveal } from "@/shared/hooks";
import { formatCLP } from "@/shared/utils/formatters";

export interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  price: number;
  salePrice?: number | null;
  mainImageUrl?: string | null;
  isNew?: boolean;
  isOnSale?: boolean;
  stockQuantity?: number;
  className?: string;
  variant?: "default" | "clean";
}

function BookFallbackIcon() {
  return (
    <svg aria-hidden="true" className="h-10 w-10 text-moss/30" fill="none" viewBox="0 0 48 48">
      <path
        d="M15 10.5h15.75A5.25 5.25 0 0 1 36 15.75v21.75H18.75A3.75 3.75 0 0 0 15 41.25V10.5Zm0 0A3.75 3.75 0 0 0 11.25 14.25v23.5A2.75 2.75 0 0 0 14 40.5h4.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M20 18h10M20 23h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function ProductCard({
  id,
  slug,
  title,
  author,
  price,
  salePrice,
  mainImageUrl,
  isNew = false,
  isOnSale = false,
  stockQuantity,
  className,
}: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const revealRef = useScrollReveal<HTMLDivElement>();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasDiscount = isOnSale || (salePrice !== null && salePrice !== undefined && salePrice < price);
  const effectivePrice = hasDiscount && salePrice ? salePrice : price;
  const isLowStock = stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= 3;

  const badge = useMemo(() => {
    if (hasDiscount) {
      return <Badge variant="sale">Oferta</Badge>;
    }
    if (isNew) {
      return <Badge variant="new">Nuevo</Badge>;
    }
    return null;
  }, [hasDiscount, isNew]);

  useEffect(() => {
    if (!isAdded) return;
    const timeoutId = window.setTimeout(() => setIsAdded(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [isAdded]);

  function handleNavigate() {
    router.push(`/productos/${slug}`);
  }

  return (
    <article
      className={cx("reveal cursor-pointer", className)}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={revealRef}
      role="link"
      tabIndex={0}
    >
      {/* Imagen */}
      <div
        style={{
          position: "relative",
          aspectRatio: "2/3",
          overflow: "hidden",
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(145deg, var(--beige-warm), var(--beige-mid))",
          boxShadow: isHovered
            ? "4px 12px 30px rgba(58,48,1,0.22)"
            : "0 0 0.5px rgba(58,48,1,0.14), 0 2px 6px rgba(58,48,1,0.10)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {mainImageUrl ? (
          <Image
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            src={mainImageUrl}
            style={{
              objectFit: "cover",
              transform: isHovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.6s ease-out",
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookFallbackIcon />
          </div>
        )}

        {/* Badges */}
        {(badge ?? isLowStock) ? (
          <div className="absolute left-2 top-2 z-[2] flex flex-col gap-1">
            {badge}
            {isLowStock && <Badge variant="warning">Últimas unidades</Badge>}
          </div>
        ) : null}

        {/* Hover overlay + botón agregar */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(20,16,4,0.35)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.25s ease",
            pointerEvents: isHovered ? "auto" : "none",
          }}
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              addItem({
                productId: id,
                title,
                slug,
                author,
                price: effectivePrice,
                originalPrice: hasDiscount ? price : null,
                imageUrl: mainImageUrl ?? null,
                sku: null,
              });
              setIsAdded(true);
            }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingTop: "14px",
              paddingBottom: "14px",
              background: isAdded ? "var(--moss)" : "var(--gold)",
              color: "white",
              fontSize: "11px",
              letterSpacing: "0.1em",
              fontWeight: 600,
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              borderRadius: "0 0 var(--radius-md) var(--radius-md)",
              transition: "background 0.2s",
            }}
            type="button"
          >
            {isAdded ? "Agregado" : "Agregar"}
          </button>
        </div>
      </div>

      {/* Info debajo — siempre visible */}
      <div style={{ paddingTop: "10px" }}>
        {author ? (
          <p style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--text-light)",
            marginBottom: "3px",
          }}>
            {author}
          </p>
        ) : null}
        <h3
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text)",
            lineHeight: 1.3,
            marginBottom: "4px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>
        {hasDiscount && salePrice ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-light)", textDecoration: "line-through" }}>
              {formatCLP(price)}
            </span>
            <span style={{ fontSize: "13px", color: "var(--gold-light)" }}>
              {formatCLP(salePrice)}
            </span>
          </div>
        ) : (
          <p style={{ fontSize: "13px", color: "var(--gold-light)" }}>
            {formatCLP(effectivePrice)}
          </p>
        )}
      </div>
    </article>
  );
}
