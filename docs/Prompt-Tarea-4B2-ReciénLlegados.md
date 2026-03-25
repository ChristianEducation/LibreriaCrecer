# Tarea 4B.2 — Carrusel "Recién llegados"

## Contexto
Esta tarea es parte de la Fase 4B del proyecto Crecer Librería Cristiana. Leer `FASE-4B-Planificacion.md` antes de comenzar.

El objetivo es implementar la sección "Recién llegados" en el landing con lógica de carrusel automático que muestra los últimos productos agregados a la tienda.

**Leer `docs/index.html` antes de comenzar**, específicamente la sección `.productos-section` y las clases `.product-card`, `.product-img`, `.product-overlay`, `.productos-grid` para referencia visual.

## Estado actual

En `src/app/(store)/page.tsx` existe una sección llamada "Titulos recien llegados" que usa `<ProductGrid products={novedades} />` con un grid estático. No tiene lógica de carrusel automático ni la estructura visual correcta.

## Archivos a modificar

- `src/app/(store)/page.tsx` — reemplazar la sección estática por el nuevo componente
- `src/features/catalogo/components/RecentProductsCarousel.tsx` — **crear este archivo nuevo**
- `src/features/catalogo/components/index.ts` — agregar el export del nuevo componente
- `src/features/catalogo/services/product-service.ts` — verificar que `getNewProducts` acepta `limit: 10`

**NO modificar:**
- `ProductCard.tsx` — usar el componente tal cual está
- Colores en `globals.css`
- Ningún otro servicio ni componente

## Lo que hay que construir

### Servicio — verificar `getNewProducts`

En `src/features/catalogo/services/product-service.ts` verificar que `getNewProducts(limit)` ordena por `created_at` descendente y acepta `limit` hasta 10. Si el límite máximo actual es 6, actualizarlo para aceptar hasta 10. No cambiar nada más.

En `src/app/(store)/page.tsx` cambiar la llamada de `getNewProducts(6)` a `getNewProducts(10)`.

### Componente — `RecentProductsCarousel`

Crear `src/features/catalogo/components/RecentProductsCarousel.tsx` como Client Component (`"use client"`).

**Props:**
```typescript
type RecentProductsCarouselProps = {
  products: CatalogProduct[];
};
```

**Lógica del carrusel:**

- **0 productos** → mostrar placeholder elegante
- **1 a 5 productos** → mostrar todos estáticos en fila, sin movimiento
- **6 a 10 productos** → carrusel automático: siempre 5 productos visibles, rota de a 1 cada 4 segundos en bucle continuo

**Implementación del carrusel (solo cuando hay 6-10 productos):**

Usar un índice de estado `startIndex` que indica cuál es el primer producto visible. Los 5 productos mostrados son `products[(startIndex + i) % products.length]` para `i` de 0 a 4.

Cada 4 segundos: `startIndex = (startIndex + 1) % products.length`

Usar `opacity` y `transform` con `transition-all duration-500` para transiciones suaves entre estados. No usar scroll horizontal — re-renderizar los 5 slots con animación de fade/slide.

**Estructura visual:**

Sigue el patrón `.productos-section` del diseñador:
- Header con eyebrow "Recién llegados", título "Últimos *títulos*", y link "Ver todos" → `/productos` alineado a la derecha
- Debajo: los 5 productos visibles usando `<ProductCard />` existente en grid de 5 columnas

**Indicador (solo con 6-10 productos):**

Puntos de navegación debajo del carrusel. Un punto por producto. Activo: `bg-gold`. Inactivo: `bg-border`. Click en punto salta a ese índice y resetea el timer.

### Estado vacío (placeholder)

Cuando `products.length === 0`:

```
[ ícono libro tenue ]
Aún no hay títulos
Los nuevos libros aparecerán aquí cuando se agreguen al catálogo.
```

- `min-height: 280px`
- Borde punteado con `border-border`
- Fondo `bg-white`
- Texto centrado, tipografía del sitio (serif para título, sans para subtexto)

### Integración en `page.tsx`

Reemplazar el bloque actual de la sección de novedades por:
```jsx
<RecentProductsCarousel products={novedades} />
```

El componente maneja internamente su propio padding (`px-5 py-16 md:px-10 md:py-20 lg:px-14`), header y layout.

## Resultado esperado

- **0 productos**: placeholder elegante
- **1-5 productos**: fila estática visible sin animación
- **6-10 productos**: siempre 5 visibles, rota de a 1 cada 4 segundos, con puntos de navegación

## Verificación

```bash
npx tsc --noEmit
npm run lint
```
Ambos deben pasar sin errores.
