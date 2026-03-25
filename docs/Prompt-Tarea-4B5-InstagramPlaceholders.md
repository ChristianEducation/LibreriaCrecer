# Tarea 4B.5 — Instagram embed + Placeholders bonitos

## Contexto
Esta tarea es parte de la Fase 4B del proyecto Crecer Librería Cristiana. Leer `FASE-4B-Planificacion.md` antes de comenzar. Es la última tarea de la Fase 4B.

Dos objetivos: reemplazar los placeholders de colores de Instagram por el embed oficial, y revisar/pulir todos los estados vacíos del landing para que se vean elegantes en la presentación al cliente.

## Archivos a modificar

- `src/features/catalogo/components/InstagramSection.tsx` — reemplazar placeholders por embed
- `src/app/layout.tsx` — agregar el script de Instagram si es necesario
- Revisar y ajustar placeholders en:
  - `src/features/catalogo/components/LibrosMesSection.tsx` (ya hecho en 4B.1, verificar)
  - `src/features/catalogo/components/RecentProductsCarousel.tsx` (ya hecho en 4B.2, verificar)
  - `src/features/catalogo/components/CategoryCarousel.tsx` (ya hecho en 4B.3, verificar)
  - `src/features/catalogo/components/HeroSlider.tsx` — verificar que el fallback sin slides se ve bien

**NO modificar:**
- Colores en `globals.css`
- Ningún servicio ni schema

## Parte 1 — Instagram feed con Elfsight

### Contexto
Se usa Elfsight para mostrar el feed de Instagram. Es un widget externo que genera un código HTML personalizado desde su dashboard. No requiere API keys ni configuración de Meta/Instagram. El plan gratuito soporta 200 vistas mensuales — suficiente para el lanzamiento.

### Cómo obtener el código de Elfsight (pasos para el desarrollador)
1. Ir a https://elfsight.com/instagram-feed-instashow/
2. Crear cuenta gratuita
3. Crear un widget nuevo, conectar la cuenta `@crecerlibreria`
4. Personalizar el layout (preferir grid de 4-5 columnas, fondo transparente)
5. Publicar y copiar el código HTML generado — se ve así:
```html
<script src="https://static.elfsight.com/platform/platform.js" async></script>
<div class="elfsight-app-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" data-elfsight-app-lazy></div>
```
6. Guardar ese `app-id` (el UUID en el class del div) como variable de entorno

### Implementación en el proyecto

**Variable de entorno** — agregar a `.env.local` y `.env.local.example`:
```
NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

**`InstagramSection.tsx`** — reemplazar los placeholders de colores por el widget de Elfsight:

```tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";

export function InstagramSection() {
  const appId = process.env.NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID;

  return (
    <section className="bg-beige px-5 py-16 md:px-10 md:py-20 lg:px-14">
      {/* header existente — mantener igual */}
      ...

      {appId ? (
        <>
          <Script
            src="https://static.elfsight.com/platform/platform.js"
            strategy="lazyOnload"
          />
          <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
        </>
      ) : (
        // Fallback si no está configurado el ID
        <div className="flex min-h-[200px] items-center justify-center border border-dashed border-border">
          <p className="text-sm text-text-light">
            Configurar NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID para mostrar el feed.
          </p>
        </div>
      )}
    </section>
  );
}
```

Usar el componente `<Script>` de Next.js con `strategy="lazyOnload"` para no bloquear el render de la página.

**Mantener el header de la sección** (eyebrow "Instagram", título "@crecerlibreria", link "Ver perfil") exactamente igual que estaba — solo cambia el contenido debajo del header.

**Si `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID` no está definido** — mostrar el fallback con mensaje de configuración. Nunca crashear.

## Parte 2 — Auditoría y pulido de todos los placeholders

Revisar cada sección del landing y verificar que el estado vacío se ve elegante. Si alguno de las tareas anteriores (4B.1, 4B.2, 4B.3) no implementó su placeholder correctamente, corregirlo aquí.

### Criterios para un placeholder "elegante"

Todo placeholder del landing debe tener:
- `min-height` adecuada (no colapsar a 0px)
- Borde punteado sutil: `border border-dashed border-border`
- Fondo coherente con la sección (`bg-white` o `bg-beige` según corresponda)
- Ícono SVG tenue (opacity ~10-15%)
- Título en serif (`font-serif`) con mensaje claro
- Subtexto en sans (`font-sans font-light`) explicativo
- NO usar colores de error (rojo) — usar `text-text-light` y `text-gold` para el eyebrow

### Secciones a revisar

**HeroSlider** — cuando `slides.length === 0`, actualmente muestra el `fallbackSlide` con `imageUrl: ""`. Verificar que se ve bien sin imagen — el gradiente de fondo `bg-moss` con el contenido textual debe verse decente. Si no, mejorar el fallback visual.

**LibrosMesSection** — verificar que el placeholder de 4B.1 cumple los criterios. Ajustar si es necesario.

**CategoryCarousel** — verificar que el placeholder de 4B.3 cumple los criterios. Ajustar si es necesario.

**RecentProductsCarousel** — verificar que el placeholder de 4B.2 cumple los criterios. Ajustar si es necesario.

**QuoteSection / Hero intermedio** — esta sección siempre se muestra (con datos de BD o con fallback hardcodeado). No necesita placeholder vacío.

### Seed de prueba — script de datos

Al final de esta tarea, crear el archivo `src/scripts/seed-products.ts` con un seed de **10 libros católicos inventados pero plausibles** para probar el landing completo.

El script debe:
- Insertar 10 productos con datos realistas (títulos, autores, precios en CLP entre $5.000 y $35.000)
- Insertar 6 categorías marcadas como `featured = true`
- Insertar 3 productos en `featured_products` con `section = "monthly_selection"`
- Insertar 1 hero slide con `imageUrl` vacío (para probar el fallback)
- Usar Drizzle directamente igual que `seed-admin.ts`
- Agregar el comando en `package.json`: `"seed:products": "npx tsx src/scripts/seed-products.ts"`

Los 10 libros deben tener variedad:
- Algunos con `sale_price` (para ver badges de oferta)
- Algunos con `main_image_url: null` (para ver el fallback de imagen)
- Insertar los 10 productos en orden de "más antiguo a más reciente" — las fechas `created_at` usan `defaultNow()` por lo que el orden de inserción determinará cuáles aparecen primero en "Recién llegados". Insertar primero los menos relevantes y al final los que deben aparecer como más recientes.
- Al menos 2 con `is_featured: true`

## Verificación final de toda la Fase 4B

```bash
npx tsc --noEmit
npm run lint
```

Ambos deben pasar sin errores. Luego ejecutar el seed:

```bash
npm run seed:products
npm run dev
```

Y verificar visualmente cada sección del landing con datos reales.
