import type { Metadata } from "next";

import { FilterBar, PageHeader, Pagination, ProductGrid } from "@/features/catalogo/components";
import { getCategories, getProducts, type ProductSortBy } from "@/features/catalogo";
import { getCatalogoHeaderBanner } from "@/features/catalogo/services/landing-service";

type ProductosPageProps = {
  searchParams: Promise<{
    cat?: string | string[];
    sort?: string | string[];
    page?: string | string[];
    filter?: string | string[];
    search?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Nuestra colección",
  description:
    "Explora nuestra selección de libros católicos, Biblias, recursos de espiritualidad y formación cristiana. Envío a todo Chile desde Antofagasta.",
  alternates: {
    canonical: "/productos",
  },
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getValidSort(value: string | undefined): ProductSortBy {
  if (value === "price_asc" || value === "price_desc" || value === "name" || value === "newest") {
    return value;
  }

  return "newest";
}

function getValidPage(value: string | undefined) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const params = await searchParams;
  const activeCategory = getSingleValue(params.cat) ?? "";
  const sort = getValidSort(getSingleValue(params.sort));
  const page = getValidPage(getSingleValue(params.page));
  const filter = getSingleValue(params.filter) ?? "";
  const search = getSingleValue(params.search) ?? "";

  const [productResult, categories, headerBanner] = await Promise.all([
    getProducts({
      page,
      limit: 40,
      categorySlug: activeCategory || undefined,
      sortBy: filter === "nuevo" ? "newest" : sort,
      search: search || undefined,
      onlyActive: true,
      onlyInStock: true,
      onlyOnSale: filter === "oferta",
      isFeatured: filter === "destacado",
      onlySeleccion: filter === "seleccion",
    }),
    getCategories(),
    getCatalogoHeaderBanner(),
  ]);

  const defaultHeaderImageUrl = headerBanner?.imageUrl ?? null;

  return (
    <main className="bg-beige">
      <PageHeader
        activeCategory={activeCategory}
        categories={categories}
        defaultHeaderImageUrl={defaultHeaderImageUrl}
      />
      <FilterBar activeFilter={filter} activeSort={sort} totalResults={productResult.total} />

      <section className="page-px" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <ProductGrid products={productResult.products} />
        <Pagination currentPage={page} totalPages={productResult.totalPages} />
      </section>
    </main>
  );
}
