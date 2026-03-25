export const STORAGE_BUCKETS = {
  PRODUCTS: "products",
  BANNERS: "banners",
  CATEGORIES: "categories",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export type BannerType = "hero" | "promo";
export type CategoryImageTarget = "cover" | "header";

export type StorageError = {
  message: string;
  cause?: unknown;
};

export type StorageSuccessResult = {
  success: true;
  path: string;
  publicUrl: string;
};

export type StorageDeleteResult = {
  success: true;
  path: string;
};

export type StorageFailureResult = {
  success: false;
  error: StorageError;
};

export type StorageUploadResult = StorageSuccessResult | StorageFailureResult;
export type StorageOperationResult = StorageDeleteResult | StorageFailureResult;
