"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ProductCard } from "@/features/catalogo/components";
import type { CatalogProduct } from "@/features/catalogo/types";
import { Button } from "@/shared/ui";

function CrossMark({ muted = false }: { muted?: boolean }) {
  return (
    <span className="relative mb-7 block h-[60px] w-[60px]">
      <span
        className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-[1px]"
        style={{ backgroundColor: muted ? "var(--text-light)" : "var(--gold)" }}
      />
      <span
        className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-[1px]"
        style={{ backgroundColor: muted ? "var(--text-light)" : "var(--gold)" }}
      />
    </span>
  );
}

function normalizeStatus(value: string | null) {
  if (value === "paid" || value === "pending" || value === "cancelled") {
    return value;
  }

  return "pending";
}

export default function ConfirmacionPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const status = normalizeStatus(searchParams.get("status"));
  const orderNumber = searchParams.get("order") ?? "ORD-PENDIENTE";

  const message = useMemo(() => {
    if (status === "paid") {
      return {
        title: "¡Tu compra fue procesada con exito!",
        subtitle: "Recibiras un correo con los detalles a la brevedad.",
        muted: false,
      };
    }

    if (status === "cancelled") {
      return {
        title: "Pago no completado",
        subtitle: "Tu pedido no fue procesado. Puedes intentarlo nuevamente.",
        muted: true,
      };
    }

    return {
      title: "Pedido recibido",
      subtitle: "En cuanto confirmemos tu pago, prepararemos tu pedido.",
      muted: false,
    };
  }, [status]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/productos/novedades?limit=5");
        const payload = (await response.json().catch(() => null)) as { data?: CatalogProduct[] } | null;

        if (!cancelled) {
          setProducts(payload?.data ?? []);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProducts(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <section className="mx-auto flex min-h-[60vh] max-w-[560px] flex-col items-center justify-center px-5 py-20 text-center">
        <CrossMark muted={message.muted} />
        <h1 className="font-serif text-[36px] text-moss">{message.title}</h1>
        <p className="mt-3 max-w-[380px] text-sm font-light leading-[1.7] text-text-light">
          {message.subtitle}
        </p>
        <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-gold">Pedido #{orderNumber}</p>

        {status === "cancelled" ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button as="a" href="/checkout" variant="moss">
              Intentar de nuevo
            </Button>
            <Button as="a" href="/carrito" variant="outline">
              Volver al carrito
            </Button>
          </div>
        ) : (
          <Button as="a" className="mt-8" href="/productos" variant="moss">
            Seguir explorando →
          </Button>
        )}
      </section>

      <section className="bg-beige px-5 py-[72px] md:px-10 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-[10px] text-[9px] uppercase tracking-[0.3em] text-gold">
                <span className="h-px w-5 bg-gold" />
                <span>Mientras sigues explorando</span>
              </p>
              <h2 className="font-serif text-[clamp(24px,2.2vw,34px)] leading-[1.1] text-moss">
                Titulos recomendados
              </h2>
            </div>

            <Button as="a" href="/productos" size="sm" variant="ghost">
              Ver coleccion →
            </Button>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 gap-x-[18px] gap-y-8 md:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="h-[320px] animate-pulse rounded-[2px] bg-white/60" key={index} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-[18px] gap-y-8 md:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard
                  author={product.author}
                  id={product.id}
                  isNew={product.createdAt ? Date.now() - new Date(product.createdAt).getTime() <= 1000 * 60 * 60 * 24 * 45 : false}
                  isOnSale={product.hasDiscount}
                  key={product.id}
                  mainImageUrl={product.mainImageUrl}
                  price={product.price}
                  salePrice={product.salePrice}
                  slug={product.slug}
                  title={product.title}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
