"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { HeroPreview } from "@/features/catalogo/components";
import type {
  HeroOverlayVariantViewModel,
  HeroSlideViewModel,
  HeroViewModel,
} from "@/features/catalogo/view-models/hero-view-model";
import { useAutoRefreshOnChange, useToast } from "@/shared/hooks";
import {
  HERO_CONTENT_THEME_DEFAULT,
  HERO_CONTENT_POSITION_DEFAULT,
  HERO_OVERLAY_OPACITY_DEFAULT,
  HERO_OVERLAY_OPACITY_MAX,
  HERO_OVERLAY_OPACITY_MIN,
  HERO_OVERLAY_VARIANT_DEFAULT,
  HERO_TEXT_ALIGN_DEFAULT,
  HERO_CTA_MODE_DEFAULT,
  HERO_CTA_POSITION_DEFAULT,
  HERO_CTA_BG_COLOR_DEFAULT,
  HERO_CTA_TEXT_COLOR_DEFAULT,
  HERO_HOTSPOT_DEFAULT,
  type HeroContentTheme,
  type HeroContentPosition,
  type HeroOverlayVariant,
  type HeroTextAlign,
  type HeroCtaMode,
  type HeroCtaPosition,
} from "@/shared/config/landing";

type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  ctaText: string | null;
  ctaPosition: HeroCtaPosition;
  ctaBgColor: string | null;
  ctaTextColor: string | null;
  ctaBorderColor: string | null;
  ctaMode: HeroCtaMode;
  hotspotX: number | null;
  hotspotY: number | null;
  hotspotWidth: number | null;
  hotspotHeight: number | null;
  mobileHotspotX: number | null;
  mobileHotspotY: number | null;
  mobileHotspotWidth: number | null;
  mobileHotspotHeight: number | null;
  showContent: boolean;
  contentPosition: HeroContentPosition;
  contentTextColor: string | null;
  textAlign: HeroTextAlign;
  overlayVariant: HeroOverlayVariant;
  overlayOpacity: number;
  contentTheme: HeroContentTheme;
  displayOrder: number;
  isActive: boolean;
};

type HeroFormState = {
  id?: string;
  existingImageUrl: string | null;
  existingMobileImageUrl: string | null;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_position: HeroCtaPosition;
  cta_bg_color: string | null;
  cta_text_color: string | null;
  cta_border_color: string | null;
  cta_mode: HeroCtaMode;
  hotspot_x: number;
  hotspot_y: number;
  hotspot_width: number;
  hotspot_height: number;
  mobile_hotspot_enabled: boolean;
  mobile_hotspot_x: number;
  mobile_hotspot_y: number;
  mobile_hotspot_width: number;
  mobile_hotspot_height: number;
  link_url: string;
  show_content: boolean;
  content_position: HeroContentPosition;
  content_text_color: string | null;
  text_align: HeroTextAlign;
  overlay_variant: HeroOverlayVariant;
  overlay_opacity: number;
  content_theme: HeroContentTheme;
  display_order: number;
  is_active: boolean;
  imageFile: File | null;
  mobileImageFile: File | null;
};

const initialForm: HeroFormState = {
  existingImageUrl: null,
  existingMobileImageUrl: null,
  title: "",
  subtitle: "",
  cta_text: "",
  cta_position: HERO_CTA_POSITION_DEFAULT,
  cta_bg_color: HERO_CTA_BG_COLOR_DEFAULT,
  cta_text_color: HERO_CTA_TEXT_COLOR_DEFAULT,
  cta_border_color: null,
  cta_mode: HERO_CTA_MODE_DEFAULT,
  hotspot_x: HERO_HOTSPOT_DEFAULT.x,
  hotspot_y: HERO_HOTSPOT_DEFAULT.y,
  hotspot_width: HERO_HOTSPOT_DEFAULT.width,
  hotspot_height: HERO_HOTSPOT_DEFAULT.height,
  mobile_hotspot_enabled: false,
  mobile_hotspot_x: HERO_HOTSPOT_DEFAULT.x,
  mobile_hotspot_y: HERO_HOTSPOT_DEFAULT.y,
  mobile_hotspot_width: HERO_HOTSPOT_DEFAULT.width,
  mobile_hotspot_height: HERO_HOTSPOT_DEFAULT.height,
  link_url: "",
  show_content: true,
  content_position: HERO_CONTENT_POSITION_DEFAULT,
  content_text_color: null,
  text_align: HERO_TEXT_ALIGN_DEFAULT,
  overlay_variant: HERO_OVERLAY_VARIANT_DEFAULT,
  overlay_opacity: HERO_OVERLAY_OPACITY_DEFAULT,
  content_theme: HERO_CONTENT_THEME_DEFAULT,
  display_order: 0,
  is_active: true,
  imageFile: null,
  mobileImageFile: null,
};

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

const ALIGN_OPTIONS: SegmentedOption<HeroTextAlign>[] = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

const OVERLAY_OPTIONS: SegmentedOption<HeroOverlayVariant>[] = [
  { value: "gradient", label: "Degradado" },
  { value: "solid", label: "Sólido" },
  { value: "none", label: "Ninguno" },
];

const THEME_OPTIONS: SegmentedOption<HeroContentTheme>[] = [
  { value: "light", label: "Texto claro" },
  { value: "dark", label: "Texto oscuro" },
];

function Segmented<T extends string>({
  value,
  options,
  onChange,
  full = false,
  ariaLabel,
}: {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (next: T) => void;
  full?: boolean;
  ariaLabel?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={full ? "admin-segmented admin-segmented--full" : "admin-segmented"}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`admin-segmented-option${isActive ? " admin-segmented-option--active" : ""}`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const GRID_9_POSITIONS = [
  "top-left", "top-center", "top-right",
  "middle-left", "middle-center", "middle-right",
  "bottom-left", "bottom-center", "bottom-right",
] as const;

// Grilla generica de 9 posiciones (3x3) — la usan tanto la posicion del boton
// CTA como la posicion del bloque de titulo/subtitulo, mismos 9 valores.
function PositionGrid3x3<T extends (typeof GRID_9_POSITIONS)[number]>({
  value,
  onChange,
}: {
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-[6px] border border-border bg-[#faf9f6] p-1 w-[160px]">
      {GRID_9_POSITIONS.map((pos) => {
        const isActive = pos === value;
        return (
          <button
            key={pos}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(pos as T)}
            title={pos}
            className={`admin-segmented-option${isActive ? " admin-segmented-option--active" : ""}`}
            style={{ height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-moss" : "bg-border-strong"}`} />
          </button>
        );
      })}
    </div>
  );
}

const CTA_MODE_OPTIONS: SegmentedOption<HeroCtaMode>[] = [
  { value: "button", label: "Botón de sistema" },
  { value: "hotspot", label: "Zona en la imagen" },
];

type HotspotRect = { x: number; y: number; width: number; height: number };

function clampPercent(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

type HotspotDragState = {
  mode: "move" | "resize";
  startPointerX: number;
  startPointerY: number;
  startRect: HotspotRect;
};

function HotspotEditor({
  imageUrl,
  rect,
  onChange,
}: {
  imageUrl: string;
  rect: HotspotRect;
  onChange: (rect: HotspotRect) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<HotspotDragState | null>(null);

  useEffect(() => {
    if (!dragState) return;

    function handlePointerMove(event: PointerEvent) {
      const container = containerRef.current;
      if (!container || !dragState) return;
      const bounds = container.getBoundingClientRect();
      const deltaXPercent = ((event.clientX - dragState.startPointerX) / bounds.width) * 100;
      const deltaYPercent = ((event.clientY - dragState.startPointerY) / bounds.height) * 100;

      if (dragState.mode === "move") {
        const nextX = clampPercent(dragState.startRect.x + deltaXPercent, 0, 100 - dragState.startRect.width);
        const nextY = clampPercent(dragState.startRect.y + deltaYPercent, 0, 100 - dragState.startRect.height);
        onChange({ ...dragState.startRect, x: Math.round(nextX), y: Math.round(nextY) });
      } else {
        const nextWidth = clampPercent(dragState.startRect.width + deltaXPercent, 5, 100 - dragState.startRect.x);
        const nextHeight = clampPercent(dragState.startRect.height + deltaYPercent, 5, 100 - dragState.startRect.y);
        onChange({ ...dragState.startRect, width: Math.round(nextWidth), height: Math.round(nextHeight) });
      }
    }

    function handlePointerUp() {
      setDragState(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState, onChange]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid var(--border)",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" draggable={false} src={imageUrl} style={{ width: "100%", height: "auto", display: "block" }} />
      <div
        onPointerDown={(event) => {
          event.preventDefault();
          setDragState({ mode: "move", startPointerX: event.clientX, startPointerY: event.clientY, startRect: rect });
        }}
        style={{
          position: "absolute",
          left: `${rect.x}%`,
          top: `${rect.y}%`,
          width: `${rect.width}%`,
          height: `${rect.height}%`,
          border: "2px dashed #c8a830",
          background: "rgba(200, 168, 48, 0.18)",
          cursor: "move",
        }}
      >
        <div
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setDragState({ mode: "resize", startPointerX: event.clientX, startPointerY: event.clientY, startRect: rect });
          }}
          style={{
            position: "absolute",
            right: -7,
            bottom: -7,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#c8a830",
            border: "2px solid white",
            cursor: "nwse-resize",
          }}
        />
      </div>
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  allowNull = true,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  allowNull?: boolean;
}) {
  return (
    <div>
      <label className="admin-field-label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value ?? "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          disabled={value === null}
          className="h-8 w-10 cursor-pointer rounded border border-border bg-[#faf9f6] p-0.5"
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => {
            const val = e.target.value.trim();
            onChange(val === "" ? null : val);
          }}
          placeholder={allowNull ? "Transparente" : "#000000"}
          className="admin-input !w-24 !py-1 text-sm"
        />
        {allowNull && (
          <button
            type="button"
            onClick={() => onChange(value === null ? "#000000" : null)}
            className="text-[12px] text-text-light hover:text-text transition-colors"
          >
            {value === null ? "Asignar color" : "Quitar color"}
          </button>
        )}
      </div>
    </div>
  );
}

type HeroAdminEditorProps = {
  initialData?: HeroViewModel;
};

function mapOverlayVariant(v: HeroOverlayVariant): HeroOverlayVariantViewModel {
  return v === "solid" ? "dark" : v;
}

async function fetchHeroChangeSignal(): Promise<string | null> {
  const response = await fetch("/api/admin/landing/hero/estado", { cache: "no-store" });
  if (!response.ok) return null;
  const payload = (await response.json().catch(() => null)) as { data?: { signal: string | null } } | null;
  return payload?.data?.signal ?? null;
}

export function HeroAdminEditor({ initialData }: HeroAdminEditorProps = {}) {
  const router = useRouter();
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<HeroFormState>(initialForm);
  const [showAdvancedText, setShowAdvancedText] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const slidesRef = useRef<HeroSlide[]>([]);

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => {
    if (!draggedId) return;

    function handlePointerMove(event: PointerEvent) {
      const el = document.elementFromPoint(event.clientX, event.clientY);
      const card = el?.closest<HTMLElement>("[data-slide-id]");
      const overId = card?.dataset.slideId;
      if (!overId || overId === draggedId) return;

      setSlides((prev) => {
        const fromIndex = prev.findIndex((item) => item.id === draggedId);
        const toIndex = prev.findIndex((item) => item.id === overId);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return prev;
        // No mezclar activos con inactivos al arrastrar: cada grupo se
        // reordena solo dentro de si mismo.
        if (prev[fromIndex].isActive !== prev[toIndex].isActive) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    }

    async function handlePointerUp() {
      setDraggedId(null);
      // Persiste siempre activos primero (en su orden) y luego inactivos,
      // sin importar como hayan quedado intercalados en el arreglo interno.
      const current = slidesRef.current;
      const orderedIds = [
        ...current.filter((item) => item.isActive).map((item) => item.id),
        ...current.filter((item) => !item.isActive).map((item) => item.id),
      ];
      await fetch("/api/admin/landing/hero/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideIds: orderedIds }),
      });
      router.refresh();
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggedId, router]);

  const previewUrl = useMemo(() => (form.imageFile ? URL.createObjectURL(form.imageFile) : null), [form.imageFile]);
  const previewMobileUrl = useMemo(() => (form.mobileImageFile ? URL.createObjectURL(form.mobileImageFile) : null), [form.mobileImageFile]);

  const liveViewModel = useMemo((): HeroViewModel => {
    const imageUrl = previewUrl ?? form.existingImageUrl ?? "";
    const mobileImageUrl = previewMobileUrl ?? form.existingMobileImageUrl;
    if (imageUrl) {
      const liveSlide: HeroSlideViewModel = {
        id: form.id ?? "preview",
        imageUrl,
        mobileImageUrl,
        title: form.title || null,
        subtitle: form.subtitle || null,
        ctaText: form.cta_text || null,
        linkUrl: form.link_url || null,
        showContent: form.show_content,
        contentPosition: form.content_position,
        contentTextColor: form.content_text_color,
        textAlign: form.text_align,
        overlayVariant: mapOverlayVariant(form.overlay_variant),
        overlayOpacity: form.overlay_opacity,
        contentTheme: form.content_theme,
        ctaPosition: form.cta_position,
        ctaBgColor: form.cta_bg_color,
        ctaTextColor: form.cta_text_color,
        ctaBorderColor: form.cta_border_color,
        ctaMode: form.cta_mode,
        hotspotX: form.hotspot_x,
        hotspotY: form.hotspot_y,
        hotspotWidth: form.hotspot_width,
        hotspotHeight: form.hotspot_height,
        mobileHotspotX: form.mobile_hotspot_enabled ? form.mobile_hotspot_x : null,
        mobileHotspotY: form.mobile_hotspot_enabled ? form.mobile_hotspot_y : null,
        mobileHotspotWidth: form.mobile_hotspot_enabled ? form.mobile_hotspot_width : null,
        mobileHotspotHeight: form.mobile_hotspot_enabled ? form.mobile_hotspot_height : null,
      };
      return {
        eyebrow: initialData?.eyebrow ?? null,
        title: initialData?.title ?? null,
        body: initialData?.body ?? null,
        slides: [liveSlide],
      };
    }
    return initialData ?? { eyebrow: null, title: null, body: null, slides: [] };
  }, [form, previewUrl, previewMobileUrl, initialData]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (previewMobileUrl) URL.revokeObjectURL(previewMobileUrl);
    };
  }, [previewUrl, previewMobileUrl]);

  async function fetchSlides() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/landing/hero", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { data?: HeroSlide[]; message?: string } | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudieron cargar los slides.");
        return;
      }

      setSlides(payload?.data ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchSlides();
  }, []);

  // Actualiza el listado solo cuando no hay edicion en curso, para no
  // pisar un formulario abierto o un arrastre a medio hacer.
  useAutoRefreshOnChange(fetchHeroChangeSignal, 15_000, {
    onChange: () => {
      void fetchSlides();
    },
    enabled: !formOpen && draggedId === null && !saving,
  });

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (form.id) {
        const updatePayload: Record<string, unknown> = {
          title: form.title || null,
          subtitle: form.subtitle || null,
          link_url: form.link_url || null,
          cta_text: form.cta_text || null,
          cta_position: form.cta_position,
          cta_bg_color: form.cta_bg_color,
          cta_text_color: form.cta_text_color,
          cta_border_color: form.cta_border_color,
          cta_mode: form.cta_mode,
          hotspot_x: form.hotspot_x,
          hotspot_y: form.hotspot_y,
          hotspot_width: form.hotspot_width,
          hotspot_height: form.hotspot_height,
          mobile_hotspot_x: form.mobile_hotspot_enabled ? form.mobile_hotspot_x : null,
          mobile_hotspot_y: form.mobile_hotspot_enabled ? form.mobile_hotspot_y : null,
          mobile_hotspot_width: form.mobile_hotspot_enabled ? form.mobile_hotspot_width : null,
          mobile_hotspot_height: form.mobile_hotspot_enabled ? form.mobile_hotspot_height : null,
          show_content: form.show_content,
          content_position: form.content_position,
          content_text_color: form.content_text_color,
          text_align: form.text_align,
          overlay_variant: form.overlay_variant,
          overlay_opacity: form.overlay_opacity,
          content_theme: form.content_theme,
          display_order: Number(form.display_order || 0),
          is_active: form.is_active,
        };

        if (!form.mobileImageFile && form.existingMobileImageUrl === null) {
          updatePayload.mobile_image_url = null;
        }

        const response = await fetch(`/api/admin/landing/hero/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo actualizar el slide.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }

        if (form.imageFile) {
          const uploadData = new FormData();
          uploadData.append("file", form.imageFile);
          await fetch(`/api/admin/landing/hero/${form.id}/imagen`, { method: "POST", body: uploadData });
        }
        if (form.mobileImageFile) {
          const mobileUploadData = new FormData();
          mobileUploadData.append("file", form.mobileImageFile);
          mobileUploadData.append("type", "mobile");
          await fetch(`/api/admin/landing/hero/${form.id}/imagen`, { method: "POST", body: mobileUploadData });
        }
      } else {
        if (!form.imageFile) {
          const message = "La imagen es obligatoria para crear un slide.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }

        const createData = new FormData();
        createData.append("title", form.title);
        createData.append("subtitle", form.subtitle);
        createData.append("link_url", form.link_url);
        createData.append("cta_text", form.cta_text);
        createData.append("cta_position", form.cta_position);
        if (form.cta_bg_color) createData.append("cta_bg_color", form.cta_bg_color);
        if (form.cta_text_color) createData.append("cta_text_color", form.cta_text_color);
        if (form.cta_border_color) createData.append("cta_border_color", form.cta_border_color);
        createData.append("cta_mode", form.cta_mode);
        createData.append("hotspot_x", String(form.hotspot_x));
        createData.append("hotspot_y", String(form.hotspot_y));
        createData.append("hotspot_width", String(form.hotspot_width));
        createData.append("hotspot_height", String(form.hotspot_height));
        if (form.mobile_hotspot_enabled) {
          createData.append("mobile_hotspot_x", String(form.mobile_hotspot_x));
          createData.append("mobile_hotspot_y", String(form.mobile_hotspot_y));
          createData.append("mobile_hotspot_width", String(form.mobile_hotspot_width));
          createData.append("mobile_hotspot_height", String(form.mobile_hotspot_height));
        }
        createData.append("show_content", String(form.show_content));
        createData.append("content_position", form.content_position);
        if (form.content_text_color) createData.append("content_text_color", form.content_text_color);
        createData.append("text_align", form.text_align);
        createData.append("overlay_variant", form.overlay_variant);
        createData.append("overlay_opacity", String(form.overlay_opacity));
        createData.append("content_theme", form.content_theme);
        createData.append("display_order", String(form.display_order ?? 0));
        createData.append("is_active", String(form.is_active));
        createData.append("file", form.imageFile);
        if (form.mobileImageFile) {
          createData.append("mobileFile", form.mobileImageFile);
        }

        const response = await fetch("/api/admin/landing/hero", {
          method: "POST",
          body: createData,
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo crear el slide.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }
      }

      setForm(initialForm);
      setShowAdvancedText(false);
      setFormOpen(false);
      toast({ message: "Hero actualizado correctamente." });
      await fetchSlides();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function openNewSlideForm() {
    setForm(initialForm);
    setShowAdvancedText(false);
    setFormOpen(true);
  }

  function closeForm() {
    setForm(initialForm);
    setShowAdvancedText(false);
    setFormOpen(false);
  }

  function startEdit(slide: HeroSlide) {
    setForm({
      id: slide.id,
      existingImageUrl: slide.imageUrl,
      existingMobileImageUrl: slide.mobileImageUrl ?? null,
      title: slide.title ?? "",
      subtitle: slide.subtitle ?? "",
      cta_text: slide.ctaText ?? "",
      cta_position: slide.ctaPosition ?? HERO_CTA_POSITION_DEFAULT,
      cta_bg_color: slide.ctaBgColor ?? null,
      cta_text_color: slide.ctaTextColor ?? null,
      cta_border_color: slide.ctaBorderColor ?? null,
      cta_mode: slide.ctaMode ?? HERO_CTA_MODE_DEFAULT,
      hotspot_x: slide.hotspotX ?? HERO_HOTSPOT_DEFAULT.x,
      hotspot_y: slide.hotspotY ?? HERO_HOTSPOT_DEFAULT.y,
      hotspot_width: slide.hotspotWidth ?? HERO_HOTSPOT_DEFAULT.width,
      hotspot_height: slide.hotspotHeight ?? HERO_HOTSPOT_DEFAULT.height,
      mobile_hotspot_enabled:
        slide.mobileHotspotX !== null &&
        slide.mobileHotspotY !== null &&
        slide.mobileHotspotWidth !== null &&
        slide.mobileHotspotHeight !== null,
      mobile_hotspot_x: slide.mobileHotspotX ?? HERO_HOTSPOT_DEFAULT.x,
      mobile_hotspot_y: slide.mobileHotspotY ?? HERO_HOTSPOT_DEFAULT.y,
      mobile_hotspot_width: slide.mobileHotspotWidth ?? HERO_HOTSPOT_DEFAULT.width,
      mobile_hotspot_height: slide.mobileHotspotHeight ?? HERO_HOTSPOT_DEFAULT.height,
      link_url: slide.linkUrl ?? "",
      show_content: slide.showContent,
      content_position: slide.contentPosition,
      content_text_color: slide.contentTextColor ?? null,
      text_align: slide.textAlign,
      overlay_variant: slide.overlayVariant,
      overlay_opacity: slide.overlayOpacity,
      content_theme: slide.contentTheme,
      display_order: slide.displayOrder,
      is_active: slide.isActive,
      imageFile: null,
      mobileImageFile: null,
    });
    setShowAdvancedText(slide.showContent);
    setFormOpen(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function removeSlide(id: string) {
    if (!window.confirm("Eliminar este slide?")) return;

    const response = await fetch(`/api/admin/landing/hero/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const message = "No se pudo eliminar el slide.";
      setError(message);
      toast({ message, variant: "error" });
      return;
    }

    toast({ message: "Slide eliminado." });
    await fetchSlides();
    router.refresh();
  }

  const overlayDisabled = form.overlay_variant === "none";
  const sliderStyle = { "--value": `${form.overlay_opacity}%` } as CSSProperties;
  const dropzonePreview = previewUrl ?? form.existingImageUrl;
  const activeSlides = slides.filter((slide) => slide.isActive);
  const inactiveSlides = slides.filter((slide) => !slide.isActive);

  function renderSlideCard(slide: HeroSlide, positionNumber: number | null) {
    const isEditing = form.id === slide.id;
    return (
      <article
        key={slide.id}
        data-slide-id={slide.id}
        className="admin-slide-grid-card"
        style={{
          opacity: draggedId === slide.id ? 0.4 : 1,
          borderColor: isEditing ? "rgba(200, 168, 48, 0.55)" : undefined,
          boxShadow: isEditing ? "0 0 0 2px rgba(200, 168, 48, 0.25)" : undefined,
        }}
      >
        <div className="admin-slide-grid-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.imageUrl} alt={slide.title ?? "Hero"} className="admin-slide-grid-image" />
          <button
            type="button"
            className="admin-slide-grid-handle"
            onPointerDown={(event) => {
              event.preventDefault();
              setDraggedId(slide.id);
            }}
            aria-label="Arrastrar para reordenar"
            title="Arrastrar para reordenar"
          >
            <svg aria-hidden="true" fill="currentColor" height="14" viewBox="0 0 20 20" width="14">
              <circle cx="6" cy="5" r="1.4" />
              <circle cx="6" cy="10" r="1.4" />
              <circle cx="6" cy="15" r="1.4" />
              <circle cx="12" cy="5" r="1.4" />
              <circle cx="12" cy="10" r="1.4" />
              <circle cx="12" cy="15" r="1.4" />
            </svg>
          </button>
        </div>

        <div className="admin-slide-grid-info">
          <span className={`admin-badge ${slide.isActive ? "admin-badge--active" : "admin-badge--inactive"}`}>
            <span className="admin-badge-dot" />
            {positionNumber !== null ? `${positionNumber} · Activo` : "Inactivo"}
          </span>
          <p className="mt-1.5 truncate text-[13px] font-medium text-text">{slide.title ?? "(Sin título)"}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-text-light">
            <svg
              aria-hidden="true"
              fill="none"
              height="11"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
              viewBox="0 0 20 20"
              width="11"
            >
              <path d="M8.5 11.5a3 3 0 004.5 0l3-3a3 3 0 00-4.5-4.5l-1 1M11.5 8.5a3 3 0 00-4.5 0l-3 3a3 3 0 004.5 4.5l1-1" />
            </svg>
            {slide.linkUrl ? "Con enlace" : "Sin enlace"}
          </div>
        </div>

        <div className="admin-slide-grid-actions">
          <button
            type="button"
            onClick={() => startEdit(slide)}
            className="admin-icon-btn"
            aria-label="Editar"
            title="Editar"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="15"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 20 20"
              width="15"
            >
              <path d="M14 3l3 3-9.5 9.5L4 16l.5-3.5L14 3z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => removeSlide(slide.id)}
            className="admin-icon-btn admin-icon-btn--danger"
            aria-label="Eliminar"
            title="Eliminar"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="15"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 20 20"
              width="15"
            >
              <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
            </svg>
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link
          href="/admin/landing"
          className="inline-flex items-center gap-1.5 text-sm text-text-mid transition-colors hover:text-text"
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 20 20"
            width="14"
          >
            <path d="M12 4l-6 6 6 6" />
          </svg>
          Volver a Landing
        </Link>
      </div>

      <div className="editor-card">
        <div className="editor-card-header flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-text">Slides existentes</h3>
            <p className="mt-0.5 text-[12px] text-text-light">
              {slides.length} {slides.length === 1 ? "slide" : "slides"} configurado
              {slides.length === 1 ? "" : "s"}. Arrastra el ícono de agarre para reordenar.
            </p>
          </div>
          <button type="button" onClick={openNewSlideForm} className="admin-btn-primary">
            + Nuevo slide
          </button>
        </div>

        <div className="editor-card-body">
          {loading ? (
            <p className="text-sm text-text-light">Cargando slides...</p>
          ) : slides.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-border bg-[#faf9f6] px-6 py-10 text-center">
              <p className="text-sm text-text-mid">Aún no hay slides creados.</p>
              <p className="mt-1 text-[12px] text-text-light">Usa &quot;+ Nuevo slide&quot; para añadir el primero.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="admin-section-label">Activos ({activeSlides.length}) — este es el orden real del sitio</p>
                {activeSlides.length > 0 ? (
                  <div className="admin-slide-grid mt-2">
                    {activeSlides.map((slide, index) => renderSlideCard(slide, index + 1))}
                  </div>
                ) : (
                  <p className="text-[12px] text-text-light">No hay slides activos ahora mismo.</p>
                )}
              </div>

              {inactiveSlides.length > 0 ? (
                <div>
                  <p className="admin-section-label">Inactivos ({inactiveSlides.length}) — archivados, no aparecen en el sitio</p>
                  <div className="admin-slide-grid mt-2">
                    {inactiveSlides.map((slide) => renderSlideCard(slide, null))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {formOpen ? (
      <div className="hero-editor-grid">
        {liveViewModel.slides.length > 0 ? (
          <div className="hero-editor-grid-preview">
            <div className="hero-editor-preview-sticky">
              <HeroPreview data={liveViewModel} />
            </div>
          </div>
        ) : null}

        <div className="hero-editor-grid-form">
      <form onSubmit={submitForm} className="editor-card">
        <div className="editor-card-header flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-text">{form.id ? "Editar slide" : "Nuevo slide"}</h2>
            <p className="mt-0.5 text-[12px] text-text-light">
              {form.id ? "Aplica cambios al slide seleccionado." : "Completa los campos para crear un nuevo slide."}
            </p>
          </div>
          {form.id ? (
            <span className="admin-badge admin-badge--active">
              <span className="admin-badge-dot" />
              Editando
            </span>
          ) : null}
        </div>

        <div className="editor-card-body">
          {/* ─── Imagen ─── */}
          <section className="admin-fieldset">
            <p className="admin-section-label">Imagen de fondo</p>
            <AdminUploadZone
              hint="Recomendado: 1920×900 px. JPG o PNG."
              onFileSelect={(file) => setForm((prev) => ({ ...prev, imageFile: file }))}
              previewUrl={dropzonePreview}
            />
            {form.id && form.existingImageUrl && !form.imageFile ? (
              <p className="admin-field-help">
                Imagen actual del slide. Sube una nueva para reemplazarla.
              </p>
            ) : null}
          </section>

          <section className="admin-fieldset">
            <p className="admin-section-label">Imagen Mobile (Opcional)</p>
            <p className="admin-field-help mb-4">
              Versión vertical para móviles (formato 9:16 recomendado). Si no subes una, se usa la imagen principal.
            </p>
            <AdminUploadZone
              hint="Recomendado: 1080×1920 px. JPG o PNG."
              onFileSelect={(file) => setForm((prev) => ({ ...prev, mobileImageFile: file, existingMobileImageUrl: null }))}
              previewUrl={previewMobileUrl ?? form.existingMobileImageUrl}
            />
            {form.existingMobileImageUrl && !form.mobileImageFile ? (
              <div className="mt-4 flex items-center justify-between rounded-[6px] border border-border bg-[#faf9f6] px-3 py-2">
                <span className="text-sm text-text-mid">Ya existe una imagen mobile guardada.</span>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, existingMobileImageUrl: null, mobileImageFile: null }))}
                  className="text-sm text-[var(--color-gold)] hover:underline"
                >
                  Quitar imagen mobile
                </button>
              </div>
            ) : null}
          </section>

          {/* ─── CTA ─── */}
          <section className="admin-fieldset">
            <p className="admin-section-label">Llamado a la acción (CTA)</p>

            <div className="mb-5">
              <label className="admin-field-label">Tipo de CTA</label>
              <Segmented
                value={form.cta_mode}
                options={CTA_MODE_OPTIONS}
                onChange={(value) => setForm((prev) => ({ ...prev, cta_mode: value }))}
                full
                ariaLabel="Tipo de CTA"
              />
              <p className="admin-field-help">
                {form.cta_mode === "button"
                  ? "Un botón con el estilo de la marca, posicionado sobre la imagen."
                  : "Una zona invisible sobre el botón que ya dibujaste dentro de la imagen — no se muestra nada encima, solo se activa el clic en esa area."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-field-label" htmlFor="hero-cta-text">
                  {form.cta_mode === "button" ? "Texto del botón" : "Texto accesible (lectores de pantalla)"}
                </label>
                <input
                  id="hero-cta-text"
                  className="admin-input"
                  placeholder="Ej: Ver colección"
                  value={form.cta_text}
                  onChange={(event) => setForm((prev) => ({ ...prev, cta_text: event.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label" htmlFor="hero-link">
                  URL de destino
                </label>
                <input
                  id="hero-link"
                  className="admin-input"
                  placeholder="https://..."
                  value={form.link_url}
                  onChange={(event) => setForm((prev) => ({ ...prev, link_url: event.target.value }))}
                />
              </div>
            </div>
            <p className="admin-field-help mt-2">
              {form.cta_mode === "button" ? (
                <>
                  El botón solo aparece si completas <strong>texto</strong> y <strong>URL</strong>.
                </>
              ) : (
                <>
                  La zona clickeable se activa con solo completar la <strong>URL</strong>.
                </>
              )}
            </p>

            {form.cta_mode === "button" ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="admin-field-label">Posición del botón</label>
                  <PositionGrid3x3
                    value={form.cta_position}
                    onChange={(value) => setForm((prev) => ({ ...prev, cta_position: value }))}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <ColorControl
                    label="Color de fondo del botón"
                    value={form.cta_bg_color}
                    onChange={(val) => setForm((prev) => ({ ...prev, cta_bg_color: val }))}
                  />
                  <ColorControl
                    label="Color del texto del botón"
                    value={form.cta_text_color}
                    onChange={(val) => setForm((prev) => ({ ...prev, cta_text_color: val }))}
                    allowNull={false}
                  />
                  <ColorControl
                    label="Color del borde"
                    value={form.cta_border_color}
                    onChange={(val) => setForm((prev) => ({ ...prev, cta_border_color: val }))}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <label className="admin-field-label">Zona clickeable sobre la imagen</label>
                {dropzonePreview ? (
                  <HotspotEditor
                    imageUrl={dropzonePreview}
                    rect={{
                      x: form.hotspot_x,
                      y: form.hotspot_y,
                      width: form.hotspot_width,
                      height: form.hotspot_height,
                    }}
                    onChange={(rect) =>
                      setForm((prev) => ({
                        ...prev,
                        hotspot_x: rect.x,
                        hotspot_y: rect.y,
                        hotspot_width: rect.width,
                        hotspot_height: rect.height,
                      }))
                    }
                  />
                ) : (
                  <p className="admin-field-help">
                    Sube la imagen del slide más abajo para poder ubicar la zona clickeable.
                  </p>
                )}
                <p className="admin-field-help mt-2">
                  Arrastra el rectángulo para moverlo, y el punto de la esquina para cambiar su tamaño.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="admin-field-label" htmlFor="hotspot-x">
                      X (%)
                    </label>
                    <input
                      id="hotspot-x"
                      type="number"
                      min={0}
                      max={100}
                      className="admin-input"
                      value={form.hotspot_x}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          hotspot_x: clampPercent(Number(event.target.value || 0), 0, 100 - prev.hotspot_width),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="hotspot-y">
                      Y (%)
                    </label>
                    <input
                      id="hotspot-y"
                      type="number"
                      min={0}
                      max={100}
                      className="admin-input"
                      value={form.hotspot_y}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          hotspot_y: clampPercent(Number(event.target.value || 0), 0, 100 - prev.hotspot_height),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="hotspot-width">
                      Ancho (%)
                    </label>
                    <input
                      id="hotspot-width"
                      type="number"
                      min={5}
                      max={100}
                      className="admin-input"
                      value={form.hotspot_width}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          hotspot_width: clampPercent(Number(event.target.value || 5), 5, 100 - prev.hotspot_x),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="hotspot-height">
                      Alto (%)
                    </label>
                    <input
                      id="hotspot-height"
                      type="number"
                      min={5}
                      max={100}
                      className="admin-input"
                      value={form.hotspot_height}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          hotspot_height: clampPercent(Number(event.target.value || 5), 5, 100 - prev.hotspot_y),
                        }))
                      }
                    />
                  </div>
                </div>

                {previewMobileUrl ?? form.existingMobileImageUrl ? (
                  <div className="mt-6 rounded-[10px] border border-border bg-[#faf9f6] p-4">
                    <AdminToggle
                      checked={form.mobile_hotspot_enabled}
                      label="Usar una zona distinta para mobile"
                      description="Si la imagen mobile tiene el botón dibujado en otro lugar, marca esto y ubícalo aparte. Si lo dejas apagado, mobile usa la misma zona que escritorio."
                      onChange={(checked) => setForm((prev) => ({ ...prev, mobile_hotspot_enabled: checked }))}
                    />

                    {form.mobile_hotspot_enabled ? (
                      <div className="mt-4">
                        <label className="admin-field-label">Zona clickeable sobre la imagen mobile</label>
                        <HotspotEditor
                          imageUrl={previewMobileUrl ?? form.existingMobileImageUrl ?? ""}
                          rect={{
                            x: form.mobile_hotspot_x,
                            y: form.mobile_hotspot_y,
                            width: form.mobile_hotspot_width,
                            height: form.mobile_hotspot_height,
                          }}
                          onChange={(rect) =>
                            setForm((prev) => ({
                              ...prev,
                              mobile_hotspot_x: rect.x,
                              mobile_hotspot_y: rect.y,
                              mobile_hotspot_width: rect.width,
                              mobile_hotspot_height: rect.height,
                            }))
                          }
                        />

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div>
                            <label className="admin-field-label" htmlFor="mobile-hotspot-x">
                              X (%)
                            </label>
                            <input
                              id="mobile-hotspot-x"
                              type="number"
                              min={0}
                              max={100}
                              className="admin-input"
                              value={form.mobile_hotspot_x}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  mobile_hotspot_x: clampPercent(
                                    Number(event.target.value || 0),
                                    0,
                                    100 - prev.mobile_hotspot_width,
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="admin-field-label" htmlFor="mobile-hotspot-y">
                              Y (%)
                            </label>
                            <input
                              id="mobile-hotspot-y"
                              type="number"
                              min={0}
                              max={100}
                              className="admin-input"
                              value={form.mobile_hotspot_y}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  mobile_hotspot_y: clampPercent(
                                    Number(event.target.value || 0),
                                    0,
                                    100 - prev.mobile_hotspot_height,
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="admin-field-label" htmlFor="mobile-hotspot-width">
                              Ancho (%)
                            </label>
                            <input
                              id="mobile-hotspot-width"
                              type="number"
                              min={5}
                              max={100}
                              className="admin-input"
                              value={form.mobile_hotspot_width}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  mobile_hotspot_width: clampPercent(
                                    Number(event.target.value || 5),
                                    5,
                                    100 - prev.mobile_hotspot_x,
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="admin-field-label" htmlFor="mobile-hotspot-height">
                              Alto (%)
                            </label>
                            <input
                              id="mobile-hotspot-height"
                              type="number"
                              min={5}
                              max={100}
                              className="admin-input"
                              value={form.mobile_hotspot_height}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  mobile_hotspot_height: clampPercent(
                                    Number(event.target.value || 5),
                                    5,
                                    100 - prev.mobile_hotspot_y,
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </section>

          {/* ─── Publicación ─── */}
          <section className="admin-fieldset">
            <p className="admin-section-label">Publicación</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-field-label" htmlFor="hero-order">
                  Orden de aparición
                </label>
                <input
                  id="hero-order"
                  type="number"
                  className="admin-input"
                  value={form.display_order}
                  onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value || 0) }))}
                />
                <p className="admin-field-help">Menor número aparece primero.</p>
              </div>
              <div className="flex items-end">
                <div className="w-full rounded-[10px] border border-border bg-[#faf9f6] px-4">
                  <AdminToggle
                    checked={form.is_active}
                    label="Slide activo"
                    description="Visible en la portada del sitio."
                    onChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─── Texto sobre la imagen (avanzado) ─── */}
          <section className="admin-fieldset">
            <button
              type="button"
              onClick={() => setShowAdvancedText((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <p className="admin-section-label !mb-0">
                  Texto sobre la imagen (avanzado)
                  {form.show_content ? (
                    <span className="ml-2 text-[10px] font-semibold normal-case text-moss">· Activo</span>
                  ) : null}
                </p>
                <p className="mt-1 text-[12px] font-normal normal-case text-text-light">
                  Título, subtítulo y cómo se ubican sobre la imagen. Solo importa si activas &quot;Mostrar
                  contenido&quot; aquí abajo.
                </p>
              </div>
              <svg
                aria-hidden="true"
                className="shrink-0 transition-transform"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                style={{ transform: showAdvancedText ? "rotate(180deg)" : "rotate(0deg)" }}
                viewBox="0 0 20 20"
                width="16"
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </button>

            {showAdvancedText ? (
              <div className="mt-5 space-y-5">
                <div className="rounded-[10px] border border-border bg-[#faf9f6] px-4">
                  <AdminToggle
                    checked={form.show_content}
                    label="Mostrar contenido sobre la imagen"
                    description="Si está apagado, solo se muestra la imagen sin título ni botón."
                    onChange={(checked) => setForm((prev) => ({ ...prev, show_content: checked }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="admin-field-label" htmlFor="hero-title">
                      Título
                    </label>
                    <input
                      id="hero-title"
                      className="admin-input"
                      placeholder="Ej: Lecturas para esta cuaresma"
                      value={form.title}
                      onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="hero-subtitle">
                      Subtítulo
                    </label>
                    <input
                      id="hero-subtitle"
                      className="admin-input"
                      placeholder="Texto breve de apoyo"
                      value={form.subtitle}
                      onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="admin-field-label">Posición del contenido</label>
                    <PositionGrid3x3
                      value={form.content_position}
                      onChange={(value) => setForm((prev) => ({ ...prev, content_position: value }))}
                    />
                    <p className="admin-field-help">Dónde se ancla el bloque de texto sobre la imagen.</p>
                  </div>
                  <div>
                    <label className="admin-field-label">Alineación del texto</label>
                    <Segmented
                      value={form.text_align}
                      options={ALIGN_OPTIONS}
                      onChange={(value) => setForm((prev) => ({ ...prev, text_align: value }))}
                      full
                      ariaLabel="Alineación del texto"
                    />
                    <p className="admin-field-help">Cómo se alinean las líneas dentro del bloque.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="admin-field-label">Tema del texto</label>
                    <Segmented
                      value={form.content_theme}
                      options={THEME_OPTIONS}
                      onChange={(value) => setForm((prev) => ({ ...prev, content_theme: value }))}
                      ariaLabel="Tema del texto"
                    />
                    <p className="admin-field-help">
                      Usa <strong>texto claro</strong> sobre imágenes oscuras y <strong>texto oscuro</strong> sobre
                      claras. Se ignora si eliges un color personalizado al lado.
                    </p>
                  </div>
                  <div>
                    <ColorControl
                      label="Color personalizado del texto"
                      value={form.content_text_color}
                      onChange={(val) => setForm((prev) => ({ ...prev, content_text_color: val }))}
                    />
                    <p className="admin-field-help">
                      Si eliges un color aquí, reemplaza al tema claro/oscuro para el título y subtítulo.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="admin-field-label">Tipo de overlay</label>
                  <Segmented
                    value={form.overlay_variant}
                    options={OVERLAY_OPTIONS}
                    onChange={(value) => setForm((prev) => ({ ...prev, overlay_variant: value }))}
                    ariaLabel="Tipo de overlay"
                  />
                  <p className="admin-field-help">El overlay oscurece la imagen para que el texto sea legible.</p>
                </div>

                <div>
                  <label className="admin-field-label" htmlFor="hero-overlay-opacity">
                    Opacidad del overlay
                  </label>
                  <div className="admin-slider-row">
                    <input
                      id="hero-overlay-opacity"
                      type="range"
                      min={HERO_OVERLAY_OPACITY_MIN}
                      max={HERO_OVERLAY_OPACITY_MAX}
                      step={1}
                      disabled={overlayDisabled}
                      className="admin-slider"
                      style={sliderStyle}
                      value={form.overlay_opacity}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, overlay_opacity: Number(event.target.value) }))
                      }
                    />
                    <span className="admin-slider-value">{form.overlay_opacity}%</span>
                  </div>
                  {overlayDisabled ? (
                    <p className="admin-field-help">Selecciona un tipo de overlay para ajustar la opacidad.</p>
                  ) : (
                    <p className="admin-field-help">0% es transparente, 100% es completamente opaco.</p>
                  )}
                </div>
              </div>
            ) : null}
          </section>

          {error ? <div className="admin-error-block">{error}</div> : null}
        </div>

        <div className="editor-card-footer">
          <button type="button" onClick={closeForm} className="admin-btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="admin-btn-primary">
            {saving ? (
              <>
                <svg
                  aria-hidden="true"
                  className="animate-spin"
                  fill="none"
                  height="14"
                  viewBox="0 0 20 20"
                  width="14"
                >
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.4" />
                  <path
                    d="M17 10a7 7 0 00-7-7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.4"
                  />
                </svg>
                Guardando...
              </>
            ) : form.id ? (
              "Actualizar slide"
            ) : (
              "Crear slide"
            )}
          </button>
        </div>
      </form>
        </div>
      </div>
      ) : null}
    </div>
  );
}
