import { NextResponse } from "next/server";

import { HeroSlideSchema } from "@/features/admin/schemas/landing-schemas";
import {
  createHeroSlide,
  getHeroSlidesAdmin,
  uploadHeroImage,
} from "@/features/admin/services/landing-admin-service";

function getStringFromFormData(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  return value;
}

function getBooleanFromFormData(formData: FormData, key: string): boolean | undefined {
  const raw = getStringFromFormData(formData, key);
  if (raw === undefined) return undefined;
  return raw === "true";
}

function getNumberFromFormData(formData: FormData, key: string): number | undefined {
  const raw = getStringFromFormData(formData, key);
  if (raw === undefined || raw.trim() === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET() {
  try {
    const slides = await getHeroSlidesAdmin();
    return NextResponse.json({ data: slides });
  } catch (error) {
    console.error("GET /api/admin/landing/hero failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load hero slides." },
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
          subtitle: getStringFromFormData(body, "subtitle"),
          link_url: getStringFromFormData(body, "link_url"),
          cta_text: getStringFromFormData(body, "cta_text"),
          show_content: getBooleanFromFormData(body, "show_content"),
          text_position: getStringFromFormData(body, "text_position"),
          text_align: getStringFromFormData(body, "text_align"),
          overlay_variant: getStringFromFormData(body, "overlay_variant"),
          overlay_opacity: getNumberFromFormData(body, "overlay_opacity"),
          content_theme: getStringFromFormData(body, "content_theme"),
          display_order: Number(getStringFromFormData(body, "display_order") ?? 0),
          is_active: (getStringFromFormData(body, "is_active") ?? "true") === "true",
        }
      : body;

    const parsed = HeroSlideSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid hero slide payload.",
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
      const uploaded = await uploadHeroImage(file);
      imageUrl = uploaded.url;
    }

    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "image_url is required.",
        },
        { status: 400 },
      );
    }

    const created = await createHeroSlide({ ...parsed.data, imageUrl });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/landing/hero failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not create hero slide." },
      { status: 500 },
    );
  }
}
