import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AddToCartButton,
  ProductCard,
  ProductGallery,
} from "@/features/catalogo/components";
import {
  getProductBySlug,
  getProducts,
} from "@/features/catalogo/services/product-service";
import type { CatalogProduct, CatalogProductDetail } from "@/features/catalogo/types";
import { formatCLP } from "@/shared/utils/formatters";

type ProductoPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isRecent(createdAt: Date | string) {
  return Date.now() - new Date(createdAt).getTime() <= 1000 * 60 * 60 * 24 * 45;
}

function splitDescription(description: string | null) {
  if (!description?.trim()) {
    return [
      "Una seleccion editorial pensada para acompanar lectura, formacion y vida espiritual desde Antofagasta.",
    ];
  }

  return description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function ProductInfo({ product }: { product: CatalogProductDetail }) {
  const primaryCategory = product.categories[0] ?? null;
  const paragraphs = splitDescription(product.description);
  const reference = product.code ?? product.sku ?? null;
  const specs = [
    product.coverType ? `Tapa ${product.coverType.toLowerCase()}` : null,
    product.pages ? `${product.pages} paginas` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="pt-1">
      <p className="mb-[10px] flex items-center gap-[10px] text-[9px] uppercase tracking-[0.3em] text-gold">
        <span className="h-px w-5 bg-gold" />
        <span>{primaryCategory?.name ?? "Coleccion"}</span>
      </p>

      <h1 className="mb-1 font-serif text-[clamp(28px,3vw,40px)] leading-[1.1] tracking-[-0.01em] text-moss">
        {product.title}
      </h1>

      {product.author ? (
        <p className="mb-5 text-sm font-light text-text-light">
          por{" "}
          <Link
            className="text-text-mid transition-colors hover:text-gold"
            href={`/productos?search=${encodeURIComponent(product.author)}`}
          >
            {product.author}
          </Link>
        </p>
      ) : null}

      {reference ? (
        <p className="mb-3 text-[11px] tracking-[0.06em] text-text-light">Referencia {reference}</p>
      ) : null}

      {product.inStock && product.stockQuantity <= 5 ? (
        <div className="mb-5 inline-flex items-center gap-2 rounded-[2px] border border-border-gold bg-gold/15 px-3 py-1 text-[11px] text-gold">
          <span className="size-1.5 rounded-full bg-current" />
          <span>Ultimas unidades en stock</span>
        </div>
      ) : null}

      <div className="mb-6">
        {product.hasDiscount && product.salePrice ? (
          <div className="mb-1 text-sm text-text-light line-through">{formatCLP(product.price)}</div>
        ) : null}
        <div className="font-serif text-[38px] font-medium leading-none tracking-[-0.01em] text-moss">
          {formatCLP(product.salePrice ?? product.price)}
        </div>
        <p className="mt-1 text-xs font-light text-text-light">
          Impuestos incluidos · Envio calculado al checkout
        </p>
      </div>

      <div className="my-6 h-px w-full bg-border" />

      <div className="mb-5 text-sm font-light leading-[1.85] text-text-mid">
        {paragraphs.map((paragraph) => (
          <p className="mt-3 first:mt-0" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>

      {specs.length > 0 ? (
        <div className="mb-7 flex flex-col gap-2">
          {specs.map((spec) => (
            <div className="flex items-center gap-2.5 text-[13px] text-text-mid" key={spec}>
              <span className="size-1 rounded-full bg-gold" />
              <span>{spec}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="my-6 h-px w-full bg-border" />

      <AddToCartButton
        product={{
          id: product.id,
          slug: product.slug,
          title: product.title,
          author: product.author,
          price: product.price,
          salePrice: product.salePrice,
          mainImageUrl: product.mainImageUrl,
          sku: product.sku,
          stockQuantity: product.stockQuantity,
          inStock: product.inStock,
        }}
      />
    </div>
  );
}

function RelatedProducts({ categorySlug, products }: { categorySlug?: string; products: CatalogProduct[] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-beige px-5 py-[72px] md:px-10 lg:px-14 lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-[10px] text-[9px] uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-5 bg-gold" />
              <span>Tambien podria interesarte</span>
            </p>
            <h2 className="font-serif text-[clamp(24px,2.2vw,34px)] leading-[1.1] text-moss">
              Titulos relacionados
            </h2>
          </div>

          <Link
            className="inline-flex items-center gap-1 border-b border-transparent pb-px text-[12px] font-medium uppercase tracking-[0.08em] text-moss transition-colors hover:border-moss"
            href={categorySlug ? `/productos?cat=${categorySlug}` : "/productos"}
          >
            Ver mas <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-[18px] gap-y-8 md:grid-cols-3 xl:grid-cols-5">
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
      </div>
    </section>
  );
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryCategory = product.categories[0] ?? null;
  const relatedResult = primaryCategory?.slug
    ? await getProducts({
        page: 1,
        categorySlug: primaryCategory.slug,
        limit: 6,
        onlyActive: true,
        onlyInStock: true,
      })
    : { products: [] as CatalogProduct[] };

  const related = relatedResult.products
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, 5);

  return (
    <main>
      <section className="bg-white px-5 pb-[72px] pt-7 md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1100px]">
          <nav className="mb-8 flex flex-wrap items-center gap-1 text-[11px] text-text-light">
            <Link className="transition-colors hover:text-moss" href="/">
              Inicio
            </Link>
            <span className="opacity-30">/</span>
            <Link className="transition-colors hover:text-moss" href="/productos">
              Coleccion
            </Link>
            {primaryCategory ? (
              <>
                <span className="opacity-30">/</span>
                <Link
                  className="transition-colors hover:text-moss"
                  href={`/productos?cat=${primaryCategory.slug}`}
                >
                  {primaryCategory.name}
                </Link>
              </>
            ) : null}
            <span className="opacity-30">/</span>
            <span className="text-text-mid">{product.title}</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[72px]">
            <ProductGallery
              images={product.images}
              mainImageUrl={product.mainImageUrl}
              productAuthor={product.author}
              productTitle={product.title}
            />
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      <RelatedProducts categorySlug={primaryCategory?.slug} products={related} />
    </main>
  );
}
