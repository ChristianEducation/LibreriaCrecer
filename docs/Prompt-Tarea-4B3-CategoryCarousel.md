# Tarea 4B.3 — Categorías en carrusel de una fila

## Contexto
Esta tarea es parte de la Fase 4B del proyecto Crecer Librería Cristiana. Leer `FASE-4B-Planificacion.md` antes de comenzar.

El objetivo es rediseñar la sección de categorías del landing para que muestre los elementos en una sola fila horizontal con navegación prev/next, mostrando 6 categorías visibles a la vez — en vez del grid de múltiples filas que tiene actualmente.

**Leer `docs/index.html` antes de comenzar**, específicamente `.categorias-section`, `.cats-grid`, `.cat-card`, `.cat-bg`, `.cat-overlay`, `.cat-label`, `.cat-ornament`.

## Estado actual

En `src/app/(store)/page.tsx` la sección de categorías usa un grid:
```jsx
<div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
  {categorias.map((category, index) => (
    <CategoryCard ... />
  ))}
</div>
```

Esto muestra todas las categorías en múltiples filas. El objetivo es una sola fila con scroll/navegación controlada.

## Archivos a modificar

- `src/app/(store)/page.tsx` — reemplazar el bloque de categorías por el nuevo componente
- `src/features/catalogo/components/CategoryCarousel.tsx` — **crear este archivo nuevo**
- `src/features/catalogo/components/index.ts` — agregar el export del nuevo componente

**NO modificar:**
- `CategoryCard.tsx` — usar el componente tal cual está
- Colores en `globals.css`
- Ningún otro servicio ni componente

## Lo que hay que construir

### Componente — `CategoryCarousel`

Crear `src/features/catalogo/components/CategoryCarousel.tsx` como Client Component (`"use client"`).

**Props:**
```typescript
type CategoryCarouselProps = {
  categories: CatalogCategory[];
};
```

**Lógica:**

- **0 categorías** → mostrar placeholder elegante
- **1 a 6 categorías** → mostrar todas estáticas en fila, sin navegación
- **7+ categorías** → mostrar 6 a la vez con botones prev/next para navegar

La navegación mueve de a 1 categoría por click (no de a 6). El slider hace scroll suave usando `scrollBy` igual que `LibrosMesSection`.

**Estructura visual:**

Header de la sección con eyebrow "Explorar", título "Categorías", sin descripción, sin link "Ver todos" (el diseñador no lo tiene en esta sección).

Las tarjetas de categoría deben tener **proporción `3/4`** (igual que el diseñador `.cat-card { aspect-ratio: 3/4 }`). Altura de la sección determinada por el contenido — no forzar altura fija.

El ancho de cada tarjeta en el carrusel debe permitir que quepan 6 cómodamente en pantalla desktop. Usar `flex: 0 0 calc((100% - 5 * gap) / 6)` como referencia, donde `gap` es `12px` (igual que el diseñador).

Los botones prev/next siguen el mismo estilo que en `LibrosMesSection` — cuadrados `36px`, borde `border-border`, hover `bg-moss text-white`.

Solo mostrar los botones prev/next cuando hay 7+ categorías.

**Estado vacío (placeholder):**

Cuando `categories.length === 0`:

```
[ ícono de cuadrícula tenue ]
Sin categorías destacadas
Las categorías marcadas como destacadas aparecerán aquí.
```

- `min-height: 200px`
- Borde punteado con `border-border`
- Fondo `bg-beige`
- Texto centrado, tipografía del sitio

### Integración en `page.tsx`

Reemplazar el bloque actual:
```jsx
<section className="bg-beige px-5 py-16 ...">
  <div className="mb-10 flex ...">
    <SectionHeader ... />
    <Button ...>Ver todo el catalogo</Button>
  </div>
  <div className="grid grid-cols-2 ...">
    {categorias.map(...)}
  </div>
</section>
```

Por:
```jsx
<CategoryCarousel categories={categorias} />
```

El componente maneja internamente su padding (`px-5 py-16 md:px-10 md:py-20 lg:px-14`), fondo (`bg-beige`), header y layout.

## Resultado esperado

- **0 categorías**: placeholder elegante
- **1-6 categorías**: fila estática visible, todas las tarjetas visibles sin navegación
- **7+ categorías**: 6 visibles a la vez, botones prev/next para navegar de a 1

## Verificación

```bash
npx tsc --noEmit
npm run lint
```
Ambos deben pasar sin errores.
