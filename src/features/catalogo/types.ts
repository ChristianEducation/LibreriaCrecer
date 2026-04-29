export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type ApiPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: ApiPagination;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  headerImageUrl: string | null;
  parentId: string | null;
  featured: boolean;
  displayOrder: number;
  productCount?: number;
};

export type ProductCategoryRef = Pick<CatalogCategory, "id" | "name" | "slug">;

export type CatalogProduct = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  publisher: string | null;
  price: number;
  salePrice: number | null;
  effectivePrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  mainImageUrl: string | null;
  sku: string | null;
  inStock: boolean;
  stockQuantity: number;
  createdAt: Date;
  categories: ProductCategoryRef[];
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  displayOrder: number;
};

export type CatalogProductDetail = CatalogProduct & {
  description: string | null;
  code: string | null;
  coverType: string | null;
  pages: number | null;
  images: ProductImage[];
};

export type ProductListResult = {
  products: CatalogProduct[];
  total: number;
  page: number;
  totalPages: number;
};

export type ProductSortBy = "price_asc" | "price_desc" | "newest" | "name";

export type ProductQueryParams = {
  page: number;
  limit: number;
  categorySlug?: string;
  search?: string;
  sortBy?: ProductSortBy;
  onlyInStock?: boolean;
  onlyActive?: boolean;
  onlyOnSale?: boolean;
  isFeatured?: boolean;
  onlySeleccion?: boolean;
};

export type CategoryWithProducts = {
  category: CatalogCategory;
  products: CatalogProduct[];
  pagination: ApiPagination;
};

export type CuratedProduct = {
  id: string;
  section: string;
  description: string | null;
  displayOrder: number;
  product: CatalogProduct;
};
