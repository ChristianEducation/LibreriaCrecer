import { BRAND } from "@/shared/config/brand";

const DEFAULT_APP_URL = "https://www.libreriacrecer.cl";

function getAppBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured?.trim()) {
    return configured.trim().replace(/\/$/, "");
  }
  return DEFAULT_APP_URL;
}

export type WhatsAppConsultProduct = {
  title: string;
  sku: string | null;
  slug: string;
};

export function buildWhatsAppConsultUrl(product: WhatsAppConsultProduct): string {
  const productUrl = `${getAppBaseUrl()}/productos/${product.slug}`;
  const skuLabel = product.sku?.trim() ? product.sku : "no informado";
  const message = `Hola, quisiera consultar si tienen disponible "${product.title}".\nSKU: ${skuLabel}\nProducto: ${productUrl}`;

  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
