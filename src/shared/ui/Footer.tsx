import Link from "next/link";
import { headers } from "next/headers";

import type { FooterBannerMetadata } from "@/integrations/drizzle/schema";

type FooterBannerResponse = {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
  metadata?: FooterBannerMetadata | null;
};

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
};

const defaultFooterContent = {
  brandDescription:
    "Una libreria cristiana pensada para acompanar el estudio, la devocion y la vida diaria con una seleccion curada de titulos.",
  catalogLinks: "Coleccion completa::/productos|||Novedades::/productos?filter=nuevo|||Ofertas::/productos?filter=oferta",
  infoLinks: "Mi carrito::/carrito|||Checkout::/checkout",
  address: "Arturo Prat 470 / Antofagasta, Chile",
  mapsUrl: "https://maps.google.com/?q=Arturo+Prat+470+Antofagasta",
  copyrightText: "© 2026 Crecer Libreria. Todos los derechos reservados.",
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

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");

  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

async function getFooterBanner() {
  try {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/landing/banners?position=footer_illustration`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return defaultFooterBanner;
    }

    const payload = (await response.json()) as { data?: FooterBannerResponse[] };
    const banner = payload.data?.[0];

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
    };
  } catch {
    return defaultFooterBanner;
  }
}

async function getFooterContent() {
  try {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/landing/footer`, { cache: "no-store" });

    if (!response.ok) return defaultFooterContent;

    const payload = (await response.json()) as { data?: FooterContentResponse | null };
    const data = payload.data;

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
  } catch {
    return defaultFooterContent;
  }
}

function BrandCross() {
  return (
    <span className="relative block h-5 w-5">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gold" />
    </span>
  );
}

export async function Footer() {
  const [banner, content] = await Promise.all([getFooterBanner(), getFooterContent()]);
  const mid = Math.round((banner.fadeStart + banner.fadeEnd) / 2);
  const hasIllustration = Boolean(banner.imageUrl);
  const catalogLinks = parseLinks(content.catalogLinks);
  const infoLinks = parseLinks(content.infoLinks);

  return (
    <footer className="relative overflow-hidden bg-beige-warm">
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

        <div className="flex-1 px-8 pb-0 pt-10 md:px-14">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <BrandCross />
                <div>
                  <p className="font-serif text-[17px] text-text">Crecer Libreria</p>
                  <p className="text-[7px] uppercase tracking-[0.22em] text-gold">Fe, lectura y formacion</p>
                </div>
              </div>
              <p className="max-w-[240px] text-[11px] font-light leading-[1.75] text-text-light">
                {content.brandDescription}
              </p>
            </div>

            <div>
              <h4 className="mb-[14px] text-[7px] uppercase tracking-[0.28em] text-gold">Catalogo</h4>
              <div className="flex flex-col gap-2">
                {catalogLinks.map((link) => (
                  <Link
                    className="text-[11px] font-light text-text-mid transition-colors hover:text-moss"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-[14px] text-[7px] uppercase tracking-[0.28em] text-gold">Informacion</h4>
              <div className="flex flex-col gap-2">
                {infoLinks.map((link) => (
                  <Link
                    className="text-[11px] font-light text-text-mid transition-colors hover:text-moss"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-[14px] text-[7px] uppercase tracking-[0.28em] text-gold">Ubicacion</h4>
              <div className="flex items-start gap-[7px] text-text-mid">
                <svg aria-hidden="true" className="mt-0.5 size-[14px] shrink-0 text-gold" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 20s6-5.74 6-11a6 6 0 1 0-12 0c0 5.26 6 11 6 11Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="9" fill="currentColor" r="1.75" />
                </svg>
                <p className="text-[11px] font-light">{content.address}</p>
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

      <div className="relative z-[3] flex flex-col gap-2 border-t border-t-[rgba(115,96,2,0.1)] px-14 pb-5 pt-[14px] text-[10px] text-text-light md:flex-row md:items-center md:justify-between">
        <p>{content.copyrightText}</p>
        <div className="flex items-center gap-3">
          <p>{content.designCredit}</p>
          <Link className="opacity-60 no-underline transition-opacity hover:opacity-100" href="/admin/login" style={{ fontSize: "10px", color: "inherit", textDecoration: "none" }}>·</Link>
        </div>
      </div>
    </footer>
  );
}
