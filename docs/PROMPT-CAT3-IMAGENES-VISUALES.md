# PROMPT CATEGORÍA 3 — IMÁGENES & VISUALES
**Proyecto:** Crecer Librería Cristiana  
**Fecha:** 15 Abril 2026  
**Tarea:** Imagen panorámica en categorías, imagen de categoría en header de /productos, y fix de imagen en footer

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz del proyecto)
2. Lee `docs/MASTER-PROMPT.md`
3. Lee `docs/agentes/frontend.md`
4. Lee `docs/agentes/backend.md`
5. Lee `docs/agentes/design-system.md`

Confirma con: *"Contexto absorbido. Stack: Next.js 15 + Drizzle + Supabase + Tailwind v4. Esperando instrucción."*

---

## CONTEXTO GENERAL

Esta tarea tiene 3 cambios independientes. Ejecutar en orden. Cada uno tiene su propio checklist.

---

## CAMBIO 1 — IMAGEN PANORÁMICA EN SECCIÓN CATEGORÍAS

### Qué se quiere lograr

La sección de categorías del landing debe mostrar una **única imagen panorámica dividida** entre todas las tarjetas. Al ver la sección completa, las tarjetas juntas forman visualmente una sola imagen cohesiva. Cada tarjeta muestra su "trozo" de esa imagen usando `background-position` calculado según su posición en el grid.

La imagen panorámica es editable desde el admin — no hardcodeada. Se guarda en la tabla `banners` con `position = "categories_panorama"`. Si no hay imagen configurada, las tarjetas muestran su fallback actual (fondo degradado oscuro).

### Paso 1 — Servicio: agregar `getCategoriesPanorama()`

**Archivo:** `src/features/catalogo/services/landing-service.ts`

**Leer el archivo completo antes de modificar.**

Agregar una nueva función exportada al final del archivo, siguiendo el mismo patrón de `getCatalogoHeaderBanner()` que ya existe:

```typescript
export async function getCategoriesPanorama() {
  const result = await getBanners("categories_panorama");
  return result[0] ?? null;
}
```

Esta función reutiliza `getBanners()` que ya existe en el mismo archivo. No crear nada nuevo en la BD ni en las API routes — la tabla `banners` y sus endpoints ya soportan cualquier `position`.

---

### Paso 2 — Página del landing: fetchear la imagen panorámica

**Archivo:** `src/app/(store)/page.tsx`

**Leer el archivo completo antes de modificar.**

La página actualmente hace un `Promise.all` con 5 fetches. Agregar `getCategoriesPanorama()` al array:

```typescript
// Importar getCategoriesPanorama desde @/features/catalogo
// Agregar al Promise.all existente:
const [heroSlides, novedades, categorias, seleccion, heroIntermedio, categoriasPanorama] = await Promise.all([
  getHeroSlides(),
  getNewProducts(10),
  getCategories(),
  getCuratedProducts(),
  getHeroIntermedio(),
  getCategoriesPanorama(),  // ← nuevo
]);
```

Pasar la URL al `CategoryCarousel`:

```tsx
<CategoryCarousel
  categories={categorias}
  panoramaUrl={categoriasPanorama?.imageUrl ?? null}  // ← nuevo prop
/>
```

---

### Paso 3 — CategoryCarousel: recibir y pasar la URL

**Archivo:** `src/features/catalogo/components/CategoryCarousel.tsx`

**Leer el archivo completo antes de modificar.**

Agregar `panoramaUrl` al tipo de props y pasarlo a cada `CategoryCard` con su `index` y el `total` de categorías:

```typescript
type CategoryCarouselProps = {
  categories: CatalogCategory[];
  panoramaUrl?: string | null;  // ← nuevo
};
```

En el grid, pasar los datos necesarios a cada tarjeta:

```tsx
{categories.map((cat, index) => (
  <CategoryCard
    imageUrl={cat.imageUrl}
    key={cat.id}
    name={cat.name}
    panoramaUrl={panoramaUrl ?? null}   // ← nuevo
    panoramaIndex={index}               // ← nuevo
    panoramaTotal={categories.length}   // ← nuevo
    productCount={cat.productCount}
    slug={cat.slug}
  />
))}
```

---

### Paso 4 — CategoryCard: implementar el efecto panorámico

**Archivo:** `src/features/catalogo/components/CategoryCard.tsx`

**Leer el archivo completo antes de modificar.**

Agregar los nuevos props al tipo:

```typescript
export interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount?: number;
  panoramaUrl?: string | null;    // ← nuevo
  panoramaIndex?: number;         // ← nuevo
  panoramaTotal?: number;         // ← nuevo
}
```

**Lógica del background-position:**

Cuando `panoramaUrl` está presente, la tarjeta usa esa imagen como fondo con CSS puro (`background-image`, `background-size`, `background-position`). **No usar `next/image`** para esto — CSS es la única forma de lograr el efecto de imagen dividida.

El `background-position` horizontal se calcula así:
- Si `panoramaTotal <= 1`: posición `0% 50%`
- Si `panoramaTotal > 1`: `(panoramaIndex / (panoramaTotal - 1)) * 100`% horizontal, `50%` vertical

El `background-size` debe ser `cover` para que la imagen llene cada tarjeta correctamente.

**Ejemplo de la lógica:**
```typescript
const xPos = panoramaTotal > 1
  ? `${Math.round((panoramaIndex / (panoramaTotal - 1)) * 100)}%`
  : "0%";
const bgPosition = `${xPos} 50%`;
```

Cuando `panoramaUrl` está presente, el div de background actual (que usa `next/image`) se reemplaza por:
```tsx
<div
  style={{
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${panoramaUrl})`,
    backgroundSize: "cover",
    backgroundPosition: bgPosition,
    transition: "transform 0.4s ease",
  }}
/>
```

El overlay y el contenido de texto no cambian — quedan exactamente igual que están ahora.

Cuando `panoramaUrl` es `null` o `undefined`, el componente se comporta exactamente igual que antes (imagen individual por categoría o fallback degradado).

---

### Paso 5 — Admin: nueva página para gestionar la imagen panorámica

**Archivo a crear:** `src/app/admin/(panel)/landing/categorias/page.tsx`

Esta página sigue el **mismo patrón exacto** que `src/app/admin/(panel)/landing/footer/page.tsx`. Leer ese archivo antes de crear este.

Las diferencias con el footer son:
- `position` = `"categories_panorama"` (en lugar de `"footer_illustration"`)
- Sin campos de `metadata` (no hay opacidad, fade, ni imgWidth — solo la imagen)
- Título de la página: "Imagen de categorías"
- Descripción: "Imagen panorámica que se divide entre las tarjetas de categorías en el landing."
- El formulario tiene: campo título (opcional), campo de imagen (obligatorio para crear, opcional para actualizar), toggle activo/inactivo
- La imagen se crea/actualiza usando las mismas API routes que el footer: `POST /api/admin/landing/banners` y `PUT /api/admin/landing/banners/[id]` con `POST /api/admin/landing/banners/[id]/imagen`
- La API route de imagen ya usa `uploadBannerImage(file, "promo")` internamente — bucket `banners`, subcarpeta `promo`. No crear buckets nuevos ni funciones de storage nuevas.

**Leer `src/app/admin/(panel)/landing/footer/page.tsx` completo** antes de crear este archivo — la estructura de estados, el fetch, el handleSubmit y el renderizado son prácticamente iguales. Simplificar eliminando todo lo relacionado con `metadata`.

---

### Paso 6 — Admin landing index: agregar link a la nueva página

**Archivo:** `src/app/admin/(panel)/landing/page.tsx`

**Leer el archivo completo antes de modificar.**

Agregar un nuevo `<Link>` al grid existente, siguiendo el mismo patrón de los otros links:

```tsx
<Link href="/admin/landing/categorias" className="rounded-[10px] border border-border bg-white p-5 transition-colors hover:border-gold/40 hover:bg-gold/5">
  <p className="font-medium text-text">Imagen de categorías</p>
  <p className="mt-2 text-sm font-light text-text-light">Panorámica dividida entre las tarjetas de categorías del landing.</p>
</Link>
```

---

## CAMBIO 2 — HEADER DE /PRODUCTOS CON IMAGEN DE CATEGORÍA

### Contexto

`PageHeader.tsx` ya tiene toda la lógica para mostrar imágenes de categoría — recibe `headerImageUrl` por categoría y hace transiciones entre ellas. El problema es que `getCategories()` en `category-service.ts` ya devuelve `headerImageUrl` por categoría, y `PageHeader` ya lo consume.

**Este cambio ya está implementado.** Verificar que funciona correctamente:

1. Ir a `/productos`
2. Hacer clic en una categoría que tenga imagen subida desde el admin
3. El header debe mostrar esa imagen de fondo con overlay oscuro y transición suave

Si no funciona, el problema está en que las categorías no tienen `headerImageUrl` cargado en la BD. En ese caso, **no tocar código** — el admin de categorías permite subir esta imagen desde `/admin/categorias/[id]/editar`.

---

## CHECKLIST DE VALIDACIÓN

### Cambio 1 — Imagen panorámica

- [ ] `getCategoriesPanorama()` agregada en `landing-service.ts`
- [ ] `(store)/page.tsx` fetchea `categoriasPanorama` y lo pasa al `CategoryCarousel`
- [ ] `CategoryCarousel` recibe `panoramaUrl` y lo pasa a cada `CategoryCard` con `index` y `total`
- [ ] `CategoryCard` calcula `background-position` correctamente según `index / (total - 1)`
- [ ] Con `panoramaUrl` nulo: tarjetas se ven igual que antes (sin regresión)
- [ ] Con `panoramaUrl` presente: tarjetas muestran trozos consecutivos de la imagen
- [ ] Página admin `/admin/landing/categorias` creada y funcional
- [ ] Desde admin se puede subir, actualizar y activar/desactivar la imagen panorámica
- [ ] Link a `/admin/landing/categorias` agregado en `/admin/landing/page.tsx`

### Cambio 2 — Header /productos

- [ ] Verificar que al filtrar por categoría con imagen, el header muestra esa imagen
- [ ] Si no funciona, documentar qué falta (probablemente subir imágenes desde el admin de categorías)

### Calidad de código

- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Sin `any`
- [ ] Sin `console.log`
- [ ] Archivos leídos completos antes de modificar

---

*Prompt generado: 15 Abril 2026 — Categoría 3 de 5*
