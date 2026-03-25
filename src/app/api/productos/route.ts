import { type NextRequest } from "next/server";

import { badRequest, okPaginated, serverError, parseBooleanParam, parsePositiveIntParam } from "@/features/catalogo/http";
import { getProducts } from "@/features/catalogo/services/product-service";
import type { ProductSortBy } from "@/features/catalogo/types";

const VALID_SORT_VALUES: ProductSortBy[] = ["price_asc", "price_desc", "newest", "name"];

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;

    const pageResult = parsePositiveIntParam(query.get("page"), 1, "page");
    const limitResult = parsePositiveIntParam(query.get("limit"), 12, "limit");
    const inStockResult = parseBooleanParam(query.get("inStock"), true, "inStock");

    if (pageResult.error || limitResult.error || inStockResult.error) {
      return badRequest(
        "invalid_query_params",
        pageResult.error ?? limitResult.error ?? inStockResult.error,
      );
    }

    const sortParam = query.get("sort");
    const sortBy = sortParam ? (sortParam as ProductSortBy) : "newest";

    if (sortParam && !VALID_SORT_VALUES.includes(sortBy)) {
      return badRequest(
        "invalid_query_params",
        "Invalid 'sort'. Expected one of: price_asc, price_desc, newest, name.",
      );
    }

    const result = await getProducts({
      page: pageResult.value,
      limit: limitResult.value,
      categorySlug: query.get("category") ?? undefined,
      search: query.get("search") ?? undefined,
      sortBy,
      onlyInStock: inStockResult.value,
      onlyActive: true,
    });

    return okPaginated(result.products, {
      page: result.page,
      limit: limitResult.value,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("GET /api/productos failed", error);
    return serverError("Could not load products.");
  }
}
