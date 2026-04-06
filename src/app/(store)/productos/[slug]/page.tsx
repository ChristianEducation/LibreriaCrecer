import { notFound } from "next/navigation";
import Link from "next/link";

import { ProductCard, ProductGallery, ProductInfoBlock } from "@/features/catalogo/components";
import { getProductBySlug, getRelatedProducts } from "@/features/catalogo/services/product-service";

type ProductoPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryIds = product.categories.map((c) => c.id);
  const relatedProducts = await getRelatedProducts(product.id, categoryIds, 5);

  return (
    <main>
      {/* Sección principal */}
      <section style={{ background: "var(--white)", paddingTop: "28px", paddingBottom: "72px" }}>
        <div className="page-px">
          {/* Breadcrumb */}
          <p
            style={{
              fontSize: "11px",
              lineHeight: 1,
              marginBottom: "32px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link
              className="transition-colors hover:text-moss"
              href="/"
              style={{ color: "var(--color-text-light)", textDecoration: "none" }}
            >
              Inicio
            </Link>
            <span style={{ opacity: 0.3, margin: "0 5px" }}>/</span>
            <Link
              className="transition-colors hover:text-moss"
              href="/productos"
              style={{ color: "var(--color-text-light)", textDecoration: "none" }}
            >
              Colección
            </Link>
            {product.categories[0] && (
              <>
                <span style={{ opacity: 0.3, margin: "0 5px" }}>/</span>
                <Link
                  className="transition-colors hover:text-moss"
                  href={`/productos?cat=${product.categories[0].slug}`}
                  style={{ color: "var(--color-text-light)", textDecoration: "none" }}
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <span style={{ opacity: 0.3, margin: "0 5px" }}>/</span>
            <span style={{ color: "var(--color-moss)" }}>{product.title}</span>
          </p>

          {/* Layout 2 columnas */}
          <div className="product-detail-grid">
            <ProductGallery
              images={product.images}
              mainImageUrl={product.mainImageUrl}
              productAuthor={product.author}
              productTitle={product.title}
            />
            <ProductInfoBlock product={product} />
          </div>
        </div>
      </section>

      {/* Sección relacionados */}
      {relatedProducts.length > 0 && (
        <section style={{ background: "var(--beige)", paddingTop: "72px", paddingBottom: "80px" }}>
          <div className="page-px">
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "1px",
                      background: "var(--gold)",
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  También podría interesarte
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(24px,2.2vw,34px)",
                    fontWeight: 400,
                    color: "var(--moss)",
                    lineHeight: 1.1,
                  }}
                >
                  Títulos relacionados
                </h2>
              </div>

              {product.categories[0] && (
                <Link
                  href={`/productos?cat=${product.categories[0].slug}`}
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--moss)",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid transparent",
                    paddingBottom: "1px",
                  }}
                >
                  Ver más →
                </Link>
              )}
            </div>

            {/* Grid relacionados */}
            <div className="related-products-grid">
              {relatedProducts.map((p) => (
                <ProductCard
                  author={p.author}
                  id={p.id}
                  isOnSale={p.hasDiscount}
                  key={p.id}
                  mainImageUrl={p.mainImageUrl}
                  price={p.price}
                  salePrice={p.salePrice ?? undefined}
                  slug={p.slug}
                  title={p.title}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
