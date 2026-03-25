import { type NextRequest } from "next/server";

import { badRequest, notFound, ok, parsePositiveIntParam, serverError } from "@/features/catalogo/http";
import { getCategoryBySlug } from "@/features/catalogo/services/category-service";

type Params = {
  slug: string;
};

export async function GET(request: NextRequest, context: { params: Promise<Params> }) {
  try {
    const { slug } = await context.params;
    const query = request.nextUrl.searchParams;

    const pageResult = parsePositiveIntParam(query.get("page"), 1, "page");
    const limitResult = parsePositiveIntParam(query.get("limit"), 12, "limit");

    if (pageResult.error || limitResult.error) {
      return badRequest("invalid_query_params", pageResult.error ?? limitResult.error);
    }

    const category = await getCategoryBySlug(slug, {
      page: pageResult.value,
      limit: limitResult.value,
    });

    if (!category) {
      return notFound("Category not found.");
    }

    return ok(category);
  } catch (error) {
    console.error("GET /api/categorias/[slug] failed", error);
    return serverError("Could not load category detail.");
  }
}
