import type { CatalogProduct } from "@/features/catalogo/types";

import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: CatalogProduct[];
};

function isRecent(createdAt: Date | string) {
  const createdTime = new Date(createdAt).getTime();
  return Date.now() - createdTime <= 1000 * 60 * 60 * 24 * 45;
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center border border-dashed border-border bg-white/70 px-6 text-center">
        <div className="max-w-md space-y-3">
          <p className="font-editorial text-[10px] uppercase tracking-[0.28em] text-gold" style={{ fontWeight: 500 }}>
            Sin resultados
          </p>
          <h3 className="font-display text-[30px] text-moss" style={{ letterSpacing: "-0.015em" }}>
            Aún no hay libros <em className="editorial-emphasis">para este filtro</em>
          </h3>
          <p className="font-editorial text-sm font-light leading-[1.8] text-text-light">
            Prueba otra categoría u orden para descubrir más títulos disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          author={product.author}
          id={product.id}
          isNew={isRecent(product.createdAt)}
          isOnSale={product.hasDiscount}
          key={product.id}
          mainImageUrl={product.mainImageUrl}
          price={product.price}
          salePrice={product.salePrice}
          slug={product.slug}
          stockQuantity={product.stockQuantity}
          title={product.title}
        />
      ))}
    </div>
  );
}
