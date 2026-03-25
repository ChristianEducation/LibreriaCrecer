# Tarea 4B.4 — Banner superior + Hero intermedio desde BD

## Contexto
Esta tarea es parte de la Fase 4B del proyecto Crecer Librería Cristiana. Leer `FASE-4B-Planificacion.md` antes de comenzar.

Dos implementaciones en una tarea: el banner superior sobre el Navbar (banda informativa con X para cerrar) y la conexión del hero intermedio a la BD para que sea editable desde el admin.

## Archivos a modificar

- `src/shared/ui/TopBanner.tsx` — **crear este archivo nuevo**
- `src/shared/ui/index.ts` — agregar export de `TopBanner`
- `src/app/(store)/layout.tsx` — agregar `<TopBanner />` antes del `<Navbar />`
- `src/features/catalogo/services/landing-service.ts` — agregar solo la función `getHeroIntermedio()` que usa el `getBanners()` ya existente en ese mismo archivo
- `src/app/(store)/page.tsx` — agregar `getHeroIntermedio()` al Promise.all y actualizar props de `QuoteSection`
- `src/app/admin/(panel)/landing/page.tsx` — agregar cards de navegación para banner superior y hero intermedio

**NO modificar:**
- Colores en `globals.css`
- Schema de Drizzle — las tablas ya soportan todo
- Las API Routes existentes

## Parte 1 — Banner superior (`TopBanner`)

### Comportamiento
- Banda fina encima del Navbar
- Se muestra **solo si hay un banner activo** con `position = "top_banner"` en la tabla `banners`
- Si no hay ninguno activo, no renderiza nada (sin espacio vacío)
- Tiene un botón X para cerrarlo — el cierre es solo visual (estado local), no persiste en BD
- Una vez cerrado, no vuelve a aparecer hasta que el usuario recargue la página

### Datos que usa
De la tabla `banners` con `position = "top_banner"`:
- `title` → texto principal de la banda
- `description` → texto secundario opcional (si existe, mostrar más pequeño al lado o debajo)
- `link_url` → si existe, hacer el texto clickeable

### Implementación

`TopBanner` es un Server Component que obtiene el banner desde la BD y renderiza el componente cliente `TopBannerClient` con los datos.

Crear dos partes:
1. `TopBannerServer` (default export) — Server Component, hace la query, pasa datos a `TopBannerClient`
2. `TopBannerClient` — Client Component (`"use client"`), maneja el estado `isVisible` con `useState`

**Obtener el banner desde BD directamente** (no via fetch HTTP, usar Drizzle directamente igual que el `Footer`):
```typescript
import { db } from "@/integrations/drizzle";
import { banners } from "@/integrations/drizzle/schema";
import { and, eq } from "drizzle-orm";

const topBanner = await db
  .select()
  .from(banners)
  .where(and(eq(banners.isActive, true), eq(banners.position, "top_banner")))
  .limit(1)
  .then((rows) => rows[0] ?? null);
```

Si `topBanner` es null, retornar `null` (no renderizar nada).

**Diseño visual `TopBannerClient`:**

```
[  texto del banner centrado                    ×  ]
```

- Fondo: `bg-moss`
- Texto: `text-white/90`, `text-[12px]`, `tracking-[0.04em]`
- Padding: `py-2 px-4`
- Botón X: `text-white/60 hover:text-white`, posición `absolute right-4`
- Si tiene `link_url`: envolver el `title` en un `<a>` con `underline decoration-white/30 hover:decoration-white`
- Si tiene `description`: mostrarla debajo del title en `text-[10px] text-white/60`
- Animación de cierre: `transition-all duration-300` con `max-h-0 overflow-hidden` cuando se cierra

### Integración en `layout.tsx`

```tsx
// src/app/(store)/layout.tsx
import { TopBanner } from "@/shared/ui";

export default async function StoreLayout({ children }) {
  // ... código existente ...
  return (
    <>
      <TopBanner />   {/* ← nuevo, antes del Navbar */}
      <Navbar categories={categories} />
      {children}
      <Footer />
    </>
  );
}
```

## Parte 2 — Hero intermedio desde BD

### Estado actual
`QuoteSection` en `src/features/catalogo/components/QuoteSection.tsx` tiene texto hardcodeado. Se llama en `page.tsx` con props fijas:
```jsx
<QuoteSection
  author="Crecer Libreria Cristiana"
  backgroundImageUrl={heroSlides[0]?.imageUrl ?? null}
  quote="Creemos en libros que no solo informan..."
/>
```

### Lo que hay que cambiar

El hero intermedio debe venir de la tabla `banners` con `position = "hero_intermedio"`:
- `title` → la frase/cita (reemplaza el `quote` hardcodeado)
- `description` → el autor/atribución (reemplaza el `author` hardcodeado)
- `image_url` → imagen de fondo (reemplaza el uso de la imagen del hero)

**En `landing-service.ts`** agregar una función:
```typescript
export async function getHeroIntermedio() {
  const result = await getBanners("hero_intermedio");
  return result[0] ?? null;
}
```

**En `page.tsx`** agregar la llamada al `Promise.all` existente:
```typescript
const [heroSlides, novedades, categorias, seleccion, heroIntermedio] = await Promise.all([
  getHeroSlides(),
  getNewProducts(10),
  getFeaturedCategories(),
  getCuratedProducts(),
  getHeroIntermedio(),   // ← nuevo
]);
```

Y actualizar el uso de `QuoteSection`:
```jsx
<QuoteSection
  author={heroIntermedio?.description ?? "Crecer Librería Cristiana"}
  backgroundImageUrl={heroIntermedio?.imageUrl ?? heroSlides[0]?.imageUrl ?? null}
  quote={heroIntermedio?.title ?? "Creemos en libros que no solo informan, sino que acompañan."}
/>
```

Si no hay banner `hero_intermedio` en BD, usa los valores por defecto hardcodeados — la sección siempre se muestra.

`QuoteSection.tsx` **no necesita cambios** — solo cambian los datos que se le pasan.

## Parte 3 — Admin: agregar acceso a banner superior y hero intermedio

En `src/app/admin/(panel)/landing/page.tsx` agregar dos cards al grid existente:

```tsx
<Link href="/admin/landing/banners" ...>
  <p className="font-medium text-text">Banner superior</p>
  <p ...>Banda informativa sobre el header. Usar position "top_banner".</p>
</Link>

<Link href="/admin/landing/banners" ...>
  <p className="font-medium text-text">Hero intermedio</p>
  <p ...>Frase inspiradora entre secciones. Usar position "hero_intermedio".</p>
</Link>
```

Ambos apuntan a `/admin/landing/banners` que ya existe y permite crear/editar banners por position. Solo es orientación para el admin.

## Verificación

```bash
npx tsc --noEmit
npm run lint
```
Ambos deben pasar sin errores.
