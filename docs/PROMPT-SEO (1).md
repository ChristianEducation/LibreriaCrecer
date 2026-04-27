# PROMPT: SEO Completo para Producción — Crecer Librería Cristiana

## Instrucción de inicio

Lee `CLAUDE.md` en la raíz del proyecto antes de comenzar.
Luego lee los siguientes archivos en este orden:
1. `src/app/layout.tsx`
2. `src/app/(store)/page.tsx`
3. `src/app/(store)/productos/[slug]/page.tsx`
4. `src/app/(store)/productos/page.tsx`
5. `src/app/(store)/categorias/page.tsx`
6. `src/app/(store)/nosotros/page.tsx`

No escribas ninguna línea de código hasta haber leído todos los archivos anteriores.

---

## Contexto

Proyecto: Crecer Librería Cristiana — e-commerce de librería católica en Antofagasta, Chile.
Stack: Next.js 15 App Router, TypeScript strict, Tailwind v4.
Objetivo: implementar SEO completo y profesional para producción.
Esta tarea es solo de SEO — no tocar estilos, lógica de negocio, APIs ni base de datos.

Los archivos a crear o modificar son exactamente los que se listan abajo.
No modificar ningún otro archivo fuera de esta lista.

Reglas adicionales:
- Si ya existe metadata o generateMetadata, reemplazar, no duplicar.
- Si /images/og-default.jpg no existe, detener y reportar.
- Omitir el campo telephone en JSON-LD si no hay dato real.

---

## ARCHIVO 1 — Modificar `src/app/layout.tsx`

### 1A — Cambiar el atributo `lang` del html

Cambiar `<html lang="en">` por `<html lang="es-CL">`.

### 1B — Reemplazar el export `metadata` existente

El archivo ya tiene un `metadata` básico. Reemplazarlo completo por este:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl"
  ),
  title: {
    default: "Crecer Librería Cristiana — Antofagasta",
    template: "%s | Crecer Librería Cristiana",
  },
  description:
    "Librería cristiana en Antofagasta, Chile. Libros católicos, recursos espirituales y selección curada para el camino de fe. Compra online con despacho a todo Chile.",
  keywords: [
    "librería cristiana",
    "libros católicos",
    "Antofagasta",
    "libros religiosos Chile",
    "librería católica",
    "recursos espirituales",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Crecer Librería Cristiana",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Crecer Librería Cristiana — Antofagasta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### 1C — Agregar JSON-LD de LocalBusiness y WebSite

Dentro del `<body>`, antes de `{children}`, agregar este bloque:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl"}/#website`,
          url: process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl",
          name: "Crecer Librería Cristiana",
          description:
            "Librería cristiana en Antofagasta, Chile. Libros católicos y recursos espirituales.",
          inLanguage: "es-CL",
        },
        {
          "@type": "BookStore",
          "@id": `${process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl"}/#local`,
          name: "Crecer Librería Cristiana",
          url: process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Arturo Prat 470",
            addressLocality: "Antofagasta",
            addressRegion: "Antofagasta",
            addressCountry: "CL",
          },
          openingHours: "Mo-Sa 09:00-19:00",
          priceRange: "$$",
          currenciesAccepted: "CLP",
          paymentAccepted: "Credit Card, Debit Card",
        },
      ],
    }),
  }}
/>
```

**Importante:** el campo `telephone` queda vacío (`""`) intencionalmente — será llenado por la tía Moni desde el admin cuando configure el footer.

---

## ARCHIVO 2 — Modificar `src/app/(store)/page.tsx`

Agregar este export de metadata antes de la función `HomePage`:

```tsx
export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Bienvenido a Crecer Librería Cristiana en Antofagasta. Descubre nuestra selección de libros católicos, Biblias, recursos de espiritualidad y formación con despacho a todo Chile.",
  alternates: {
    canonical: "/",
  },
};
```

Agregar el import de `Metadata` desde `"next"` si no está ya importado.

---

## ARCHIVO 3 — Modificar `src/app/(store)/productos/[slug]/page.tsx`

### 3A — Agregar import de Metadata

```tsx
import type { Metadata } from "next";
```

### 3B — Agregar función generateMetadata

Agregar esta función antes de la función `ProductoPage`. Usa `getProductBySlug` que ya está importado en el archivo:

```tsx
export async function generateMetadata({
  params,
}: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl";

  const description = product.description
    ? product.description.slice(0, 155)
    : `${product.title}${product.author ? ` de ${product.author}` : ""} — disponible en Crecer Librería Cristiana, Antofagasta.`;

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/productos/${slug}`,
    },
    openGraph: {
      title: product.title,
      description,
      url: `${baseUrl}/productos/${slug}`,
      type: "website",
      images: product.mainImageUrl
        ? [
            {
              url: product.mainImageUrl,
              alt: product.title,
            },
          ]
        : [],
    },
  };
}
```

### 3C — Agregar JSON-LD de Product y BreadcrumbList

Dentro del `return` de `ProductoPage`, inmediatamente después de `<main>` y antes de la primera `<section>`, agregar:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: product.title,
          description: product.description ?? undefined,
          image: product.mainImageUrl ? [product.mainImageUrl] : undefined,
          sku: product.sku ?? undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "CLP",
            price: product.salePrice ?? product.price,
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "Crecer Librería Cristiana",
            },
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Inicio",
              item: process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Colección",
              item: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl"}/productos`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.title,
              item: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl"}/productos/${product.slug}`,
            },
          ],
        },
      ],
    }),
  }}
/>
```

---

## ARCHIVO 4 — Modificar `src/app/(store)/productos/page.tsx`

Agregar este export de metadata antes de la función de la página. Importar `Metadata` desde `"next"` si no está ya importado:

```tsx
export const metadata: Metadata = {
  title: "Nuestra colección",
  description:
    "Explora nuestra selección de libros católicos, Biblias, recursos de espiritualidad y formación cristiana. Envío a todo Chile desde Antofagasta.",
  alternates: {
    canonical: "/productos",
  },
};
```

---

## ARCHIVO 5 — Modificar `src/app/(store)/categorias/page.tsx`

Agregar este export de metadata antes de la función de la página. Importar `Metadata` desde `"next"` si no está ya importado:

```tsx
export const metadata: Metadata = {
  title: "Categorías",
  description:
    "Navega por categorías: Biblia, espiritualidad, formación, liturgia y más. Librería cristiana en Antofagasta con despacho a todo Chile.",
  alternates: {
    canonical: "/categorias",
  },
};
```

---

## ARCHIVO 6 — Modificar `src/app/(store)/nosotros/page.tsx`

Agregar este export de metadata antes de la función de la página. Importar `Metadata` desde `"next"` si no está ya importado:

```tsx
export const metadata: Metadata = {
  title: "Conócenos",
  description:
    "Somos Crecer Librería Cristiana, una librería católica en Antofagasta dedicada a acompañar el camino de fe con una selección curada de libros y recursos espirituales.",
  alternates: {
    canonical: "/nosotros",
  },
};
```

---

## ARCHIVO 7 — Crear `src/app/sitemap.ts`

Además:
- Incluir productos activos en el sitemap usando el servicio existente (landing-service o product-service).
- No dejar el sitemap solo con páginas estáticas.

Crear este archivo nuevo:

```tsx
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
```

---

## ARCHIVO 8 — Crear `src/app/robots.ts`

Crear este archivo nuevo:

```tsx
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## Verificación final

Al terminar todos los cambios, ejecutar en orden:

```bash
npx tsc --noEmit
npm run lint
```

Ambos deben pasar sin errores nuevos.

Si hay errores de TypeScript en los JSON-LD por el uso de `undefined`, reemplazar `?? undefined` por la comprobación ternaria equivalente: `product.sku ? product.sku : undefined`.

Reportar cualquier error encontrado antes de dar la tarea por terminada.

---

## Resumen de archivos tocados

| Archivo | Acción |
|---|---|
| `src/app/layout.tsx` | Modificar — metadata base + lang + JSON-LD LocalBusiness |
| `src/app/(store)/page.tsx` | Modificar — metadata home |
| `src/app/(store)/productos/[slug]/page.tsx` | Modificar — generateMetadata + JSON-LD Product |
| `src/app/(store)/productos/page.tsx` | Modificar — metadata catálogo |
| `src/app/(store)/categorias/page.tsx` | Modificar — metadata categorías |
| `src/app/(store)/nosotros/page.tsx` | Modificar — metadata conócenos |
| `src/app/sitemap.ts` | Crear nuevo |
| `src/app/robots.ts` | Crear nuevo |
