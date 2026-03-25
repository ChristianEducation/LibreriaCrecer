import "server-only";

import { randomUUID } from "crypto";

import { getSupabaseStorageClient } from "./client";
import {
  STORAGE_BUCKETS,
  type BannerType,
  type StorageBucket,
  type StorageOperationResult,
  type StorageUploadResult,
} from "./types";

const VALID_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const FIVE_MB_IN_BYTES = 5 * 1024 * 1024;
const TEN_MB_IN_BYTES = 10 * 1024 * 1024;

const BUCKET_MAX_SIZE: Record<StorageBucket, number> = {
  [STORAGE_BUCKETS.PRODUCTS]: FIVE_MB_IN_BYTES,
  [STORAGE_BUCKETS.CATEGORIES]: FIVE_MB_IN_BYTES,
  [STORAGE_BUCKETS.BANNERS]: TEN_MB_IN_BYTES,
};

function createStorageError(message: string, cause?: unknown) {
  return {
    success: false as const,
    error: {
      message,
      cause,
    },
  };
}

function getFileExtension(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ?? "";
}

function sanitizeFileNameSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function ensureValidImage(file: File, bucket: StorageBucket) {
  const extension = getFileExtension(file.name);
  const maxSizeInBytes = BUCKET_MAX_SIZE[bucket];

  if (!VALID_IMAGE_EXTENSIONS.has(extension)) {
    return {
      ok: false as const,
      error: `Invalid file format for ${bucket}. Allowed formats: jpg, jpeg, png, webp.`,
    };
  }

  if (file.size > maxSizeInBytes) {
    return {
      ok: false as const,
      error: `File is too large for ${bucket}. Maximum size is ${Math.floor(
        maxSizeInBytes / (1024 * 1024),
      )}MB.`,
    };
  }

  return { ok: true as const, extension };
}

function buildUniqueName(prefix: string, extension: string) {
  const timestamp = Date.now();
  const suffix = randomUUID().slice(0, 8);
  return `${prefix}-${timestamp}-${suffix}.${extension}`;
}

export async function getPublicUrl(bucket: StorageBucket, path: string): Promise<StorageUploadResult> {
  try {
    const supabaseStorageClient = getSupabaseStorageClient();
    const { data } = supabaseStorageClient.storage.from(bucket).getPublicUrl(path);
    return {
      success: true,
      path,
      publicUrl: data.publicUrl,
    };
  } catch (error) {
    return createStorageError("Failed to generate public URL.", error);
  }
}

export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  path: string,
): Promise<StorageUploadResult> {
  const validation = ensureValidImage(file, bucket);
  if (!validation.ok) {
    return createStorageError(validation.error);
  }

  try {
    const supabaseStorageClient = getSupabaseStorageClient();
    const { error } = await supabaseStorageClient.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || `image/${validation.extension}`,
    });

    if (error) {
      return createStorageError(`Failed to upload image to ${bucket}.`, error);
    }

    return getPublicUrl(bucket, path);
  } catch (error) {
    return createStorageError(`Unexpected error uploading image to ${bucket}.`, error);
  }
}

export async function deleteImage(bucket: StorageBucket, path: string): Promise<StorageOperationResult> {
  try {
    const supabaseStorageClient = getSupabaseStorageClient();
    const { error } = await supabaseStorageClient.storage.from(bucket).remove([path]);
    if (error) {
      return createStorageError(`Failed to delete image from ${bucket}.`, error);
    }

    return {
      success: true,
      path,
    };
  } catch (error) {
    return createStorageError(`Unexpected error deleting image from ${bucket}.`, error);
  }
}

export async function uploadProductImage(file: File, productId: string): Promise<StorageUploadResult> {
  const validation = ensureValidImage(file, STORAGE_BUCKETS.PRODUCTS);
  if (!validation.ok) {
    return createStorageError(validation.error);
  }

  const safeProductId = sanitizeFileNameSegment(productId);
  const fileName = buildUniqueName("main", validation.extension);
  const path = `${safeProductId}/${fileName}`;

  return uploadImage(STORAGE_BUCKETS.PRODUCTS, file, path);
}

export async function uploadBannerImage(
  file: File,
  bannerType: BannerType,
): Promise<StorageUploadResult> {
  const validation = ensureValidImage(file, STORAGE_BUCKETS.BANNERS);
  if (!validation.ok) {
    return createStorageError(validation.error);
  }

  const safeBannerType = sanitizeFileNameSegment(bannerType);
  const prefix = bannerType === "hero" ? "slide" : "banner";
  const fileName = buildUniqueName(prefix, validation.extension);
  const path = `${safeBannerType}/${fileName}`;

  return uploadImage(STORAGE_BUCKETS.BANNERS, file, path);
}

export async function uploadCategoryImage(
  file: File,
  categoryId: string,
  target: "cover" | "header" = "cover",
): Promise<StorageUploadResult> {
  const validation = ensureValidImage(file, STORAGE_BUCKETS.CATEGORIES);
  if (!validation.ok) {
    return createStorageError(validation.error);
  }

  const safeCategoryId = sanitizeFileNameSegment(categoryId);
  const fileName = buildUniqueName(target, validation.extension);
  const path = `${safeCategoryId}/${fileName}`;

  return uploadImage(STORAGE_BUCKETS.CATEGORIES, file, path);
}
