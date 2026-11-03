import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ProductGrid } from "@/features/catalogo/components";
import {
  GiftsFilters,
  GiftsOccasionChips,
  GiftsPagination,
  GiftsSortSelect,
} from "@/features/catalogo/components/GiftsFilters";
import { getActiveGiftOccasions } from "@/features/catalogo/services/landing-service";
import { getGiftCategoryFacets, getProducts } from "@/features/catalogo/services/product-service";
import type { ProductSortBy } from "@/features/catalogo/types";
import {
  findGiftOccasion,
  findGiftPriceRange,
  GIFTS_HERO_DEFAULT_IMAGE,
  GIFTS_TAGLINE,
  giftSection,
} from "@/shared/config/regalos";

type RegalosPageProps = {
  searchParams: Promise<{
    ocasion?: string | string[];
    cat?: string | string[];
    precio?: string | string[];
    oferta?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};

const PAGE_SIZE = 24;

export const metadata: Metadata = {
  title: "Regalos con intención",
  description:
    "Ideas de regalo para bautizos, primeras comuniones, confirmaciones, matrimonios y momentos de duelo. Libros y detalles católicos con despacho a todo Chile.",
  alternates: {
    canonical: "/regalos",
  },
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getValidSort(value: string | undefined): ProductSortBy {
  if (value === "price_asc" || value === "price_desc" || value === "name" || value === "newest") {
    return value;
  }

  // Sin orden explícito: el orden que la clienta definió en el admin.
  return "curated";
}

function getValidPage(value: string | undefined) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function RegalosPage({ searchParams }: RegalosPageProps) {
  const params = await searchParams;
  const occasions = await getActiveGiftOccasions();

  const requestedOccasion = findGiftOccasion(getSingleValue(params.ocasion));
  const activeOccasion = occasions.find((occasion) => occasion.slug === requestedOccasion?.slug) ?? null;
  const category = getSingleValue(params.cat) ?? "";
  const priceRange = findGiftPriceRange(getSingleValue(params.precio));
  const onSale = getSingleValue(params.oferta) === "1";
  const sortBy = getValidSort(getSingleValue(params.sort));
  const page = getValidPage(getSingleValue(params.page));

  const sections = (activeOccasion ? [activeOccasion] : occasions).map((occasion) => giftSection(occasion.slug));

  const [result, categoryFacets] = await Promise.all([
    getProducts({
      page,
      limit: PAGE_SIZE,
      sortBy,
      categorySlug: category || undefined,
      onlyActive: true,
      onlyInStock: false,
      onlyOnSale: onSale,
      giftSections: sections,
      minPrice: priceRange?.min,
      maxPrice: priceRange?.max,
    }),
    getGiftCategoryFacets(sections),
  ]);

  // Elegir solo una ocasión sin productos no es "sin resultados": es una selección en preparación.
  const hasActiveFilters = Boolean(category || priceRange || onSale);
  return (
    <main style={{ background: "var(--beige)" }}>
      <header className="gifts-hero page-px" style={{ paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <div className="gifts-hero-inner storefront-container">
          <div className="gifts-hero-copy">
            <nav aria-label="Ruta" className="gifts-breadcrumb">
              <Link href="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              <span>Regalos</span>
            </nav>

            <h1 className="gifts-hero-title" style={{ marginTop: "1.25rem" }}>
              Regalos con <em>intención</em>
            </h1>
            <span aria-hidden="true" className="gifts-accent" />
            <p className="gifts-hero-lead" style={{ marginTop: "1.1rem" }}>
              {GIFTS_TAGLINE}. Elige la ocasión y te mostramos libros y objetos pensados para acompañar cada momento.
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="gifts-hero-media">
          <Image
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 0px, 760px"
            src={activeOccasion?.heroImageUrl ?? GIFTS_HERO_DEFAULT_IMAGE}
            style={{ objectFit: "cover", objectPosition: "center 55%" }}
          />
        </div>
      </header>

      <div className="gifts-bar page-px">
        <div className="storefront-container">
          <GiftsOccasionChips occasions={occasions} />
        </div>
      </div>

      <section
        className="page-px"
        id="regalos-listado"
        style={{ paddingTop: "2.25rem", paddingBottom: "5rem", scrollMarginTop: "90px" }}
      >
        <div className="storefront-container">
          <div className="gifts-layout">
            <GiftsFilters categories={categoryFacets} occasions={occasions} />

            <div style={{ minWidth: 0 }}>
              {activeOccasion ? (
                <div className="gifts-occasion-note">
                  <h2>{activeOccasion.phrase}</h2>
                  <p>{activeOccasion.description}</p>
                </div>
              ) : null}

              <div className="gifts-results-bar">
                <span>
                  {result.total} {result.total === 1 ? "producto" : "productos"}
                </span>
                <div className="hidden lg:block">
                  <GiftsSortSelect />
                </div>
              </div>

              {result.products.length === 0 ? (
                <div className="gifts-empty">
                  {activeOccasion?.imageUrl ? (
                    <div aria-hidden="true" className="gifts-empty-media">
                      <Image alt="" fill sizes="(max-width: 768px) 100vw, 260px" src={activeOccasion.imageUrl} style={{ objectFit: "cover" }} />
                    </div>
                  ) : null}
                  <div className="gifts-empty-copy">
                    <h3>{hasActiveFilters ? "Sin resultados con estos filtros" : "Estamos preparando esta selección"}</h3>
                    <p>
                      {hasActiveFilters
                        ? "Prueba con otra ocasión o quita algún filtro para ver más ideas."
                        : "Pronto encontrarás aquí libros y detalles para cada ocasión. Mientras tanto, explora toda la colección."}
                    </p>
                    <Link
                      href="/productos"
                      style={{
                        display: "inline-block",
                        marginTop: "1.25rem",
                        fontSize: "13px",
                        color: "var(--moss)",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      Ver toda la colección →
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <ProductGrid products={result.products} />
                  <GiftsPagination currentPage={result.page} totalPages={result.totalPages} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
