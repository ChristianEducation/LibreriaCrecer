import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

import {
  getFooterContent as getFooterContentFromDb,
  getFooterIllustration,
} from "@/features/catalogo/services/landing-service";
import type { FooterBannerMetadata } from "@/integrations/drizzle/schema";

type FooterContentResponse = {
  brandDescription: string | null;
  catalogLinks: string | null;
  infoLinks: string | null;
  address: string | null;
  mapsUrl: string | null;
  copyrightText: string | null;
  designCredit: string | null;
};

const defaultFooterBanner: FooterBannerMetadata & { imageUrl: string | null } = {
  imageUrl: null,
  opacity: 0.8,
  fadeStart: 40,
  fadeEnd: 70,
  imgWidth: 72,
  artSpaceWidth: 36,
  textTone: "current",
};

const defaultFooterContent = {
  brandDescription:
    "Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.",
  catalogLinks: "Colección completa::/productos|||Novedades::/productos?filter=nuevo|||Ofertas::/productos?filter=oferta",
  infoLinks: "Mi carrito::/carrito|||Checkout::/checkout",
  address: "Arturo Prat 470 / Antofagasta, Chile",
  mapsUrl: "https://maps.google.com/?q=Arturo+Prat+470+Antofagasta",
  copyrightText: "© 2026 Crecer Librería. Todos los derechos reservados.",
  designCredit: "Diseño: Hultur Studio",
};

function parseLinks(raw: string): { label: string; href: string }[] {
  return raw
    .split("|||")
    .filter(Boolean)
    .map((item) => {
      const [label, href] = item.split("::");
      return { label: label ?? "", href: href ?? "/" };
    });
}

async function getFooterBanner() {
  try {
    const banner = await getFooterIllustration();
    if (!banner) {
      return defaultFooterBanner;
    }

    return {
      imageUrl: banner.imageUrl ?? null,
      opacity: banner.metadata?.opacity ?? defaultFooterBanner.opacity,
      fadeStart: banner.metadata?.fadeStart ?? defaultFooterBanner.fadeStart,
      fadeEnd: banner.metadata?.fadeEnd ?? defaultFooterBanner.fadeEnd,
      imgWidth: banner.metadata?.imgWidth ?? defaultFooterBanner.imgWidth,
      artSpaceWidth: banner.metadata?.artSpaceWidth ?? defaultFooterBanner.artSpaceWidth,
      textTone: banner.metadata?.textTone ?? defaultFooterBanner.textTone,
    };
  } catch (error) {
    console.error("Footer: failed to load footer illustration", error);
    return defaultFooterBanner;
  }
}

async function getFooterContent() {
  try {
    const data: FooterContentResponse | null = await getFooterContentFromDb();

    if (!data) return defaultFooterContent;

    return {
      brandDescription: data.brandDescription ?? defaultFooterContent.brandDescription,
      catalogLinks: data.catalogLinks ?? defaultFooterContent.catalogLinks,
      infoLinks: data.infoLinks ?? defaultFooterContent.infoLinks,
      address: data.address ?? defaultFooterContent.address,
      mapsUrl: data.mapsUrl ?? defaultFooterContent.mapsUrl,
      copyrightText: data.copyrightText ?? defaultFooterContent.copyrightText,
      designCredit: data.designCredit ?? defaultFooterContent.designCredit,
    };
  } catch (error) {
    console.error("Footer: failed to load footer content", error);
    return defaultFooterContent;
  }
}

export async function Footer() {
  noStore();
  const [banner, content] = await Promise.all([getFooterBanner(), getFooterContent()]);
  const mid = Math.round((banner.fadeStart + banner.fadeEnd) / 2);
  const hasIllustration = Boolean(banner.imageUrl);
  const catalogLinks = parseLinks(content.catalogLinks);
  const infoLinks = parseLinks(content.infoLinks);
  const isDarkTone = banner.textTone === "dark";
  const primaryTextColor = isDarkTone ? "var(--text)" : "var(--text-mid)";
  const bodyTextColor = isDarkTone ? "var(--text)" : "var(--text-light)";

  return (
    <footer className="relative overflow-hidden" style={{ background: "var(--beige-warm)" }}>
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in srgb, var(--gold) 35%, transparent), transparent)",
          zIndex: 4,
        }}
      />

      {hasIllustration ? (
        <>
          <div className="absolute inset-0 z-[1] overflow-hidden">
            <img
              alt=""
              className="h-full object-cover object-left"
              src={banner.imageUrl ?? ""}
              style={{
                width: `${banner.imgWidth}%`,
                opacity: banner.opacity,
              }}
            />
          </div>
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background: `linear-gradient(to right,
                rgba(237,233,212,0) 0%,
                rgba(237,233,212,0) ${banner.fadeStart}%,
                rgba(237,233,212,0.78) ${mid}%,
                rgba(237,233,212,0.97) ${banner.fadeEnd}%,
                rgba(237,233,212,1) 100%
              )`,
            }}
          />
        </>
      ) : null}

      <div className="relative z-[3] flex min-h-[280px] items-stretch">
        {hasIllustration ? <div style={{ width: `${banner.artSpaceWidth}%` }} /> : null}

        <div className="flex-1 page-px" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <Image src="/images/Logo-Crecer.png" alt="Crecer Librería" width={44} height={44} style={{ objectFit: "contain", marginBottom: "12px" }} />
              <p style={{ fontFamily: "var(--font-castoro)", fontSize: "18px", color: "var(--text)", fontWeight: 400 }}>Crecer Libreria</p>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "12px", marginTop: "2px" }}>Fe, lectura y formación</p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", lineHeight: 1.7, color: bodyTextColor, maxWidth: "240px" }}>
                {content.brandDescription}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Catálogo</h4>
              <div className="flex flex-col gap-2">
                {catalogLinks.map((link) => (
                  <Link
                    style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: primaryTextColor, lineHeight: 2, textDecoration: "none" }}
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Información</h4>
              <div className="flex flex-col gap-2">
                {infoLinks.map((link) => (
                  <Link
                    style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: primaryTextColor, lineHeight: 2, textDecoration: "none" }}
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Ubicación</h4>
              <div className="flex items-start gap-[7px] text-text-mid">
                <svg aria-hidden="true" className="mt-0.5 size-[14px] shrink-0 text-gold" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 20s6-5.74 6-11a6 6 0 1 0-12 0c0 5.26 6 11 6 11Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="9" fill="currentColor" r="1.75" />
                </svg>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: primaryTextColor }}>{content.address}</p>
              </div>
              <a
                className="mt-3 inline-block border-b border-b-gold/30 text-[9px] font-medium uppercase tracking-[0.1em] text-gold transition-colors hover:border-b-gold"
                href={content.mapsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Ver en el mapa →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-[3] page-px flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
        style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", paddingBottom: "1.5rem", fontFamily: "var(--font-inter)", fontSize: "11px", color: bodyTextColor }}
      >
        <p>{content.copyrightText}</p>
        <div className="flex items-center gap-3">
          <p>{content.designCredit}</p>
          <Link href="/admin/login" style={{ fontSize: "11px", color: bodyTextColor, textDecoration: "none", opacity: 0.5 }}>·</Link>
        </div>
      </div>
    </footer>
  );
}
