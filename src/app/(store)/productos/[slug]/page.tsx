import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ProductCard, ProductGallery, ProductInfoBlock } from "@/features/catalogo/components";
import { getProductBySlug, getRelatedProducts } from "@/features/catalogo/services/product-service";

type ProductoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl";

  const description = product.description
    ? product.description.slice(0, 155)
    : `${product.title}${product.author ? ` de ${product.author}` : ""} — disponible en Crecer Librería Cristiana, Antofagasta.`;

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/productos/${slug}`,
    },
    openGraph: {
      title: product.title,
      description,
      url: `${baseUrl}/productos/${slug}`,
      type: "website",
      images: product.mainImageUrl
        ? [
            {
              url: product.mainImageUrl,
              alt: product.title,
            },
          ]
        : [],
    },
  };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryIds = product.categories.map((c) => c.id);
  const relatedProducts = await getRelatedProducts(product.id, categoryIds, 5);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl";

  return (
    <main>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                name: product.title,
                description: product.description ?? undefined,
                image: product.mainImageUrl ? [product.mainImageUrl] : undefined,
                sku: product.sku ? product.sku : undefined,
                offers: {
                  "@type": "Offer",
                  priceCurrency: "CLP",
                  price: product.salePrice ?? product.price,
                  availability: product.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                  seller: {
                    "@type": "Organization",
                    name: "Crecer Librería Cristiana",
                  },
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Inicio",
                    item: baseUrl,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Colección",
                    item: `${baseUrl}/productos`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: product.title,
                    item: `${baseUrl}/productos/${product.slug}`,
                  },
                ],
              },
            ],
          }),
        }}
        type="application/ld+json"
      />
      {/* Sección principal */}
      <section style={{ background: "var(--white)", paddingTop: "28px", paddingBottom: "72px" }}>
        <div className="storefront-container page-px">
          {/* Breadcrumb */}
          <p
            className="font-editorial"
            style={{
              fontSize: "11px",
              lineHeight: 1,
              marginBottom: "32px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              letterSpacing: "0.02em",
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
          <div className="storefront-container page-px">
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginBottom: "40px",
              }}
            >
              <div>
                <p
                  className="font-editorial"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: 500,
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
                  className="font-display"
                  style={{
                    fontSize: "clamp(26px,2.4vw,38px)",
                    fontWeight: 400,
                    color: "var(--moss)",
                    lineHeight: 1.08,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Títulos{" "}
                  <em className="editorial-emphasis">relacionados</em>
                </h2>
              </div>

              {product.categories[0] && (
                <Link
                  className="font-editorial"
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
