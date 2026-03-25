import { FilterBar, PageHeader, Pagination, ProductGrid } from "@/features/catalogo/components";
import { getCategories, getProducts, type ProductSortBy } from "@/features/catalogo";

type ProductosPageProps = {
  searchParams: Promise<{
    cat?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
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

  const [productResult, categories] = await Promise.all([
    getProducts({
      page,
      limit: 20,
      categorySlug: activeCategory || undefined,
      sortBy: sort,
      onlyActive: true,
      onlyInStock: true,
    }),
    getCategories(),
  ]);

  const defaultHeaderImageUrl = categories.find((category) => category.headerImageUrl)?.headerImageUrl ?? null;

  return (
    <main className="bg-beige">
      <PageHeader
        activeCategory={activeCategory}
        categories={categories}
        defaultHeaderImageUrl={defaultHeaderImageUrl}
      />
      <FilterBar activeSort={sort} totalResults={productResult.total} />

      <section className="px-5 py-12 md:px-10 md:py-14 lg:px-14 lg:py-16">
        <ProductGrid products={productResult.products} />
        <Pagination currentPage={page} totalPages={productResult.totalPages} />
      </section>
    </main>
  );
}

