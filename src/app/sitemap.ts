import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/features/catalogo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl").replace(/\/$/, "");
  const now = new Date();

  const [productResult, categories] = await Promise.all([
    getProducts({
      page: 1,
      limit: 1000,
      sortBy: "newest",
      onlyActive: true,
      onlyInStock: false,
    }),
    getCategories(),
  ]);

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...productResult.products.map((product) => ({
      url: `${baseUrl}/productos/${product.slug}`,
      lastModified: product.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/productos?cat=${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
