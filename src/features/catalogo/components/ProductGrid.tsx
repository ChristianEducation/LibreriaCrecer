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
          <p className="text-[10px] uppercase tracking-[0.26em] text-gold">Sin resultados</p>
          <h3 className="font-serif text-[28px] text-moss">Aun no hay libros para este filtro</h3>
          <p className="text-sm font-light leading-[1.8] text-text-light">
            Prueba otra categoria u orden para descubrir mas titulos disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-10 xl:grid-cols-4 2xl:grid-cols-5">
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
          title={product.title}
        />
      ))}
    </div>
  );
}
