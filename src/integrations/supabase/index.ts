export { getSupabaseStorageClient } from "./client";
export {
  deleteImage,
  getPublicUrl,
  listImages,
  uploadBannerImage,
  uploadCategoryImage,
  uploadImage,
  uploadProductImage,
} from "./storage";
export { STORAGE_BUCKETS } from "./types";
export type {
  BannerType,
  StorageBucket,
  StorageDeleteResult,
  StorageError,
  StorageFailureResult,
  StorageOperationResult,
  StorageSuccessResult,
  StorageUploadResult,
} from "./types";

