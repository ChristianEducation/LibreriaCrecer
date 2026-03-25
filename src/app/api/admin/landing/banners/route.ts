import { NextResponse } from "next/server";

import { BannerSchema } from "@/features/admin/schemas/landing-schemas";
import {
  createBanner,
  getBannersAdmin,
  uploadBannerImage,
} from "@/features/admin/services/landing-admin-service";

function getStringFromFormData(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  return value;
}

function getMetadataFromFormData(formData: FormData) {
  const raw = getStringFromFormData(formData, "metadata");
  if (!raw) return undefined;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function GET() {
  try {
    const items = await getBannersAdmin();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("GET /api/admin/landing/banners failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load banners." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");
    const body = isMultipart ? await request.formData() : await request.json();

    const payload = isMultipart
      ? {
          title: getStringFromFormData(body, "title"),
          description: getStringFromFormData(body, "description"),
          link_url: getStringFromFormData(body, "link_url"),
          position: getStringFromFormData(body, "position"),
          metadata: getMetadataFromFormData(body),
          is_active: (getStringFromFormData(body, "is_active") ?? "true") === "true",
        }
      : body;

    const parsed = BannerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid banner payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    let imageUrl = !isMultipart && typeof body.image_url === "string" ? body.image_url.trim() : "";
    if (isMultipart) {
      const file = body.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "validation_error", message: "file is required." }, { status: 400 });
      }
      const uploaded = await uploadBannerImage(file);
      imageUrl = uploaded.url;
    }

    if (!imageUrl) {
      return NextResponse.json({ error: "validation_error", message: "image_url is required." }, { status: 400 });
    }

    const created = await createBanner({ ...parsed.data, imageUrl });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/landing/banners failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not create banner." },
      { status: 500 },
    );
  }
}
