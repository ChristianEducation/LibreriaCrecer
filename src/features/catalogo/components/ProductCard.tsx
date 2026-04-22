"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

import { useCart } from "@/features/carrito/hooks";
import { Badge, Button } from "@/shared/ui";
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
    if (!isAdded) {
      return;
    }

    const timeoutId = window.setTimeout(() => setIsAdded(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [isAdded]);

  function handleNavigate() {
    router.push(`/productos/${slug}`);
  }

  return (
    <article
      className={cx("group reveal cursor-pointer", className)}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
      ref={revealRef}
      role="link"
      tabIndex={0}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))] shadow-[0_0_0.5px_rgba(58,48,1,0.14),_0_2px_6px_rgba(58,48,1,0.10)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[4px_12px_30px_rgba(58,48,1,0.22)]">
        {mainImageUrl ? (
          <Image
            alt={title}
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            src={mainImageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookFallbackIcon />
          </div>
        )}

        {(badge ?? isLowStock) ? (
          <div className="absolute left-2 top-2 z-[2] flex flex-col gap-1">
            {badge}
            {isLowStock && <Badge variant="warning">Últimas unidades</Badge>}
          </div>
        ) : null}

        {/* Gradiente suave hacia el footer para lectura del overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(20,16,4,0.6)_0%,rgba(20,16,4,0)_100%)]" />

        {/* Overlay glassmorphism con autor / título / precio */}
        <div
          className="glass-overlay absolute inset-x-0 bottom-0 px-3 transition-opacity duration-300 group-hover:opacity-0"
          style={{ paddingBlock: "0.65rem" }}
        >
          <p className="mb-0.5 text-[9px] uppercase tracking-[0.05em] text-white/65">
            {author ?? "Edicion seleccionada"}
          </p>
          <h3 className="font-serif text-[13px] font-medium leading-[1.25] text-white line-clamp-2">
            {title}
          </h3>
          {hasDiscount && salePrice ? (
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[10px] text-white/55 line-through">{formatCLP(price)}</span>
              <span className="text-[12px] font-medium text-[rgb(232,210,140)]">{formatCLP(salePrice)}</span>
            </div>
          ) : (
            <p className="mt-1 text-[12px] font-medium text-[rgb(232,210,140)]">{formatCLP(price)}</p>
          )}
        </div>

        {/* Hover panel: CTA agregar */}
        <div className="absolute inset-0 flex items-end justify-center bg-[rgba(20,16,4,0.72)] p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            className={cx(
              "min-w-[140px] shadow-[0_10px_22px_rgba(0,0,0,0.25)]",
              isAdded ? "bg-moss hover:bg-moss" : "",
            )}
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
            size="sm"
            variant="add-to-cart"
          >
            {isAdded ? "Agregado" : "Agregar"}
          </Button>
        </div>
      </div>
    </article>
  );
}
