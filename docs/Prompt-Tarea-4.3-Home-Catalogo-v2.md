# Tarea 4.3 — Home y Catálogo

## Contexto
Este es el tercer paso de la Fase 4 del proyecto Crecer Librería Cristiana. Las tareas anteriores dejaron:
- **4.1:** Tokens en `globals.css` (Tailwind v4 con `@theme`), componentes atómicos en `shared/ui/` (Button, Badge, Input, SectionHeader, Separator), hook `useScrollReveal`
- **4.2:** Navbar, CartPanel, Footer, layout de la tienda `(store)/layout.tsx`, layout del panel admin `admin/(panel)/layout.tsx`

Ahora construimos las dos páginas de mayor tráfico del sitio: el **home** (`/`) y el **listado de productos** (`/productos`). Se hacen juntas porque comparten los componentes más importantes: `ProductCard` y `CategoryCard`.

## Prerequisitos
- Tarea 4.1 y 4.2 completadas
- APIs funcionando: `/api/productos`, `/api/categorias`, `/api/landing/hero`, `/api/landing/seleccion`, `/api/productos/novedades`, `/api/productos/ofertas`, `/api/categorias/destacadas`
- Migración de Drizzle: campo `header_image_url` debe agregarse a la tabla `categories` en esta tarea — actualmente no existe

---

## Lo que necesito que hagas

### 1. Migración de Drizzle — `header_image_url` en categories

**La tabla `categories` actualmente no tiene este campo.** Agregarlo como columna nueva en `src/integrations/drizzle/schema/categories.ts`:

```typescript
header_image_url: text('header_image_url'),  // nullable — imagen horizontal para el header del listado de productos
```

Generar y ejecutar la migración:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

### 2. ProductCard — `src/features/catalogo/components/ProductCard.tsx`

Client Component (`'use client'`). Es el componente más reutilizado del sitio — aparece en home, listado de productos, detalle (relacionados) y checkout (recomendados).

**Especificación visual** (del `index.html` y `catalogo.html`):

```
Contenedor:
  cursor: pointer
  opacity: 0 + translateY(20px) → visible con reveal
  transition: opacity 0.55s ease, transform 0.55s ease

Imagen:
  aspect-ratio: 2/3 | position: relative | overflow: hidden
  background: linear-gradient(145deg, var(--beige-warm), var(--beige-mid))
  margin-bottom: 12px | border-radius: 2px
  box-shadow: 2px 4px 16px rgba(58,48,1,0.09)
  transition: box-shadow 0.35s, transform 0.35s cubic-bezier(0.22,1,0.36,1)
  hover: translateY(-4px), box-shadow 4px 10px 28px rgba(58,48,1,0.16)

  Fallback sin imagen: SVG libro centrado, width 36px, opacity 0.12, color var(--moss)
  Con imagen: next/image con object-fit cover

Badge (opcional):
  position: absolute | top: 8px | left: 8px
  Nuevo: background var(--gold) | Oferta: background var(--moss)
  color: white | font-size: 8px | font-weight: 600
  letter-spacing: 0.1em | uppercase | padding: 3px 8px | border-radius: 1px

Overlay hover:
  position: absolute | inset: 0 | border-radius: 2px
  background: rgba(58,48,1,0.82)
  opacity: 0→1 en hover | transition: opacity 0.28s
  Contiene botón Agregar (variante add-to-cart del Button de shared/ui)

Info:
  Autor: 10px, color var(--text-light), margin-bottom 3px, letter-spacing 0.03em
  Título: EB Garamond, 14px, weight 500, color var(--text), line-height 1.3
  Precio normal: DM Sans, 14px, weight 500, color var(--gold)
  Con descuento: precio original tachado (12px, var(--text-light)) + precio oferta (14px, var(--gold))
```

**Props:**
```typescript
interface ProductCardProps {
  id: string
  slug: string
  title: string
  author: string | null
  price: number
  salePrice?: number | null
  mainImageUrl?: string | null
  isNew?: boolean
  isOnSale?: boolean
  className?: string
}
```

**Comportamiento del botón Agregar:**
- Llama a `addItem` del store de Zustand (`src/features/carrito/store.ts`, vía hooks en `src/features/carrito/hooks.ts`)
- `addItem` recibe el ítem completo y siempre agrega 1 unidad (o incrementa en 1 si ya existe)
- El botón cambia a "✓ Agregado" con fondo `var(--moss)` por 1800ms y luego vuelve al estado original
- **Clic en la card (fuera del botón) navega a `/productos/{slug}`** — ruta de detalle del producto

**Animación:** usar hook `useScrollReveal` de `src/shared/hooks/`

---

### 3. CategoryCard — `src/features/catalogo/components/CategoryCard.tsx`

Server Component. Card de categoría para el grid del home.

**Especificación visual** (del `index.html`):

```
Contenedor:
  position: relative | overflow: hidden
  aspect-ratio: 3/4 | cursor: pointer | border-radius: 2px
  Link a /productos?cat={slug}   ← ruta del listado de productos con filtro por categoría

Fondo de imagen:
  width: 100% | height: 100%
  background-size: cover | background-position: center
  transition: transform 0.6s cubic-bezier(0.22,1,0.36,1)
  hover: scale(1.07)

  Fallback por índice (cuando no hay imageUrl):
  0: linear-gradient(145deg, #3A3001, #4A3802)
  1: linear-gradient(145deg, #4A3A02, #3A4430)
  2: linear-gradient(145deg, #736002, #4A3802)
  3: linear-gradient(145deg, #6A5402, #736002)
  4: linear-gradient(145deg, #8A7302, #C8A830)
  5: linear-gradient(145deg, #736002, #506040)
  6: linear-gradient(145deg, #7A6402, #5A4A02)
  7: linear-gradient(145deg, #8A7830, #484E38)

Overlay gradiente:
  gradient de to top: rgba(58,48,1,0.88)→0.2→transparent
  hover: rgba(58,48,1,0.94)→0.38→transparent

Ornamento cruz decorativo:
  position: absolute | top: 50% | left: 50% | transform: translate(-50%, -60%)
  width: 40px | height: 40px | opacity: 0.12
  ::before/::after líneas en var(--gold-pale)
  hover: opacity 0.2, translate(-50%, -62%) scale(1.1)

Label inferior:
  position: absolute | bottom: 0 | padding: 16px 14px
  Sub: DM Sans, 9px, letter-spacing 0.22em, uppercase, color var(--gold-light) — "Explorar"
  Nombre: EB Garamond, 15px, weight 400, color white, line-height 1.3
```

**Props:**
```typescript
interface CategoryCardProps {
  name: string
  slug: string
  imageUrl?: string | null
  index?: number   // para el gradiente fallback y el delay de animación
}
```

---

### 4. PageHeader — `src/features/catalogo/components/PageHeader.tsx`

Client Component (`'use client'`). Header del listado de productos con imagen de fondo y fade animado entre categorías.

**Especificación visual** (del `catalogo.html`):

```
Contenedor:
  background: var(--moss) | padding: 56px 56px 0
  position: relative | overflow: hidden
  Gradiente decorativo radial gold sutil

Imagen de fondo (cuando existe):
  position: absolute | inset: 0 | width: 100% | height: 100%
  object-fit: cover | mix-blend-mode: multiply | opacity: 0.35

Fade animado entre imágenes al cambiar categoría:
  Dos capas absolutas superpuestas (capa A e imagen nueva capa B)
  Crossfade CSS de 400ms al cambiar de categoría
  Si no hay imagen: solo fondo moss con gradiente decorativo

Contenido (z-index 1):
  padding-bottom: 40px | border-bottom: 1px solid rgba(255,255,255,0.08)

  Breadcrumb: 10px, color rgba(255,255,255,0.35), hover var(--gold-light)
    "Inicio / Colección" o "Inicio / Colección / {categoría}"

  Título: EB Garamond, clamp(36px,4vw,56px), weight 400, color white
    <em>: color rgba(237,217,106,0.85)

  Subtítulo: DM Sans, 14px, color rgba(255,255,255,0.45), weight 300

Pills de categoría:
  display: flex | overflow-x: auto | scrollbar none
  border-top: 1px solid rgba(255,255,255,0.07)

  Primera pill: "Todos" → al hacer clic, limpiar filtro ?cat=
  Resto de pills: una por categoría → filtro ?cat={slug}

  Pill: padding 16px 20px, 12px, weight 400, color rgba(255,255,255,0.45)
    ::after barra gold 2px que hace scaleX(0→1) al activar
    hover: color rgba(255,255,255,0.75)
    active: color white, weight 500
```

**Props:**
```typescript
interface PageHeaderProps {
  categories: { id: string; name: string; slug: string; headerImageUrl?: string | null }[]
  activeCategory: string   // 'todos' | slug de la categoría activa
  onCategoryChange: (slug: string) => void
  defaultHeaderImageUrl?: string | null   // imagen cuando activeCategory es 'todos'
}
```

**Comportamiento:**
- Las pills sincronizan con los search params de la URL (`?cat=`)
- Al cambiar de pill, actualizar URL con `router.push` sin reload completo
- El fade entre imágenes ocurre al cambiar de categoría con `transition: opacity 400ms`

---

### 5. FilterBar — `src/features/catalogo/components/FilterBar.tsx`

Client Component (`'use client'`). Barra sticky debajo del PageHeader.

```
background: var(--white) | border-bottom: 1px solid var(--border)
padding: 0 56px | height: 52px
position: sticky | top: 64px | z-index: 90   ← justo debajo del Navbar (64px)

Lado izquierdo:
  Label: 10px, letter-spacing 0.22em, uppercase, color var(--text-light)
  Chips de filtro:
    padding 4px 12px | border-radius 1px | border 1px solid var(--border)
    11px | color var(--text-mid)
    hover: border-color var(--moss), color var(--moss)
    active: background var(--moss), color white

Lado derecho:
  Contador: "X productos", 12px, color var(--text-light)
  Selector orden: label + select nativo sin borde (font DM Sans, 12px)
```

**Props:**
```typescript
interface FilterBarProps {
  totalResults: number
  activeFilter: string   // 'todos' | 'nuevo' | 'oferta'
  activeSort: string     // 'default' | 'price-asc' | 'price-desc' | 'alpha'
  onFilterChange: (filter: string) => void
  onSortChange: (sort: string) => void
}
```

---

### 6. HeroSlider — `src/features/catalogo/components/HeroSlider.tsx`

Client Component (`'use client'`). Hero principal del home.

**Especificación visual** (del `index.html`):

```
Wrapper: background var(--white), padding: 14px

Hero:
  position: relative | height: 88vh | min-height: 580px
  overflow: hidden | border-radius: 16px   ← ÚNICA excepción al sistema 2px
  background: var(--moss) como fallback

Imagen de fondo:
  position: absolute | inset: 0 | border-radius: 16px
  background-size: cover | background-position: center
  transition: transform 8s ease
  hover del hero: scale(1.02)

Overlay:
  radial-gradient(ellipse at center, rgba(58,48,1,0.25) 0%, rgba(58,48,1,0.68) 100%)

Contenido (z-index 2):
  padding: 0 40px | max-width: 740px
  animación: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.5s forwards

  Tag superior: border gold sutil, padding 5px 16px, border-radius 0
    10px, letter-spacing 0.22em, uppercase, color rgba(255,255,255,0.85)
    Puntos decorativos 4px gold a los lados

  H1: EB Garamond, clamp(40px,5.5vw,72px), weight 400, color white
    <em>: color rgba(232,210,140,0.9)

  Descripción: 15px, weight 300, color rgba(255,255,255,0.72), max-width 420px

  Botones: Button primary + Button secondary

Indicador de scroll:
  position: absolute | bottom: 28px | left: 50%
  9px, letter-spacing 0.25em, uppercase, color var(--text-light)
  Línea animada: 1px wide, 36px tall, scaleY 0→1 2s infinite
```

**Datos:** recibe slides como prop desde el Server Component padre (`GET /api/landing/hero`). Si no hay slides, mostrar contenido de fallback hardcodeado con fondo moss.

---

### 7. QuoteSection — `src/features/catalogo/components/QuoteSection.tsx`

Server Component.

```
background: var(--moss) | padding: 100px 56px
position: relative | overflow: hidden

Gradientes decorativos radiales sutiles en gold
Línea superior: gradient horizontal gold transparente

Comilla: EB Garamond, 100px, color var(--gold), opacity 0.25
Blockquote: EB Garamond, clamp(20px,2.4vw,30px), italic, color rgba(255,255,255,0.88)
Cite: DM Sans, 10px, letter-spacing 0.28em, uppercase, color var(--gold)
```

Props: `quote`, `author`, `backgroundImageUrl` opcional.

---

### 8. InstagramSection — `src/features/catalogo/components/InstagramSection.tsx`

Server Component. Por ahora con placeholders visuales; en producción usará embed de Behold.

```
background: var(--beige) | padding: 80px 56px

Header: SectionHeader + link "Ver perfil" con ícono Instagram

Grid: 4 columnas, gap 10px
  mobile: 2 columnas
Post: aspect-ratio 1, border-radius 2px, overflow hidden
  hover imagen: scale(1.07) en 0.45s
  overlay hover: rgba(58,48,1,0.55) con ícono Instagram blanco

Placeholders (fallback sin embed real):
  p1: linear-gradient(135deg, #5A4A02, #C8A830)
  p2: linear-gradient(135deg, #3A3001, #8A7302)
  p3: linear-gradient(145deg, #C8A830, #D4B840)
  p4: linear-gradient(145deg, #5A4A02, #8A7302)
```

---

### 9. LibrosMesSection — `src/features/catalogo/components/LibrosMesSection.tsx`

Client Component. Slider horizontal de la selección curada.

```
background: var(--white) | padding: 80px 56px

Layout: grid 2 columnas (280px | 1fr), gap 64px, align-items center

Columna izquierda: SectionHeader + botones prev/next
  Botones: 36x36px, border-radius 2px, border 1px solid var(--border)
  hover: background var(--moss), color white

Slider (columna derecha):
  display flex, gap 20px, overflow hidden, scroll-behavior smooth

LibroCard dentro del slider:
  flex: 0 0 160px | cursor: pointer | link a /productos/{slug}
  Imagen: aspect-ratio 2/3, border-radius 2px
    box-shadow: 4px 6px 24px rgba(58,48,1,0.12)
    hover: translateY(-6px), sombra más pronunciada
  Autor: 10px, color var(--text-light)
  Título: EB Garamond, 15px, weight 500, color var(--text)
  Precio: 14px, weight 500, color var(--gold)
```

Los datos vienen de `GET /api/landing/seleccion` pasados como prop desde el Server Component padre.

---

### 10. Página Home — `src/app/(store)/page.tsx`

Server Component. Llama en paralelo a todas las APIs y ensambla secciones.

```typescript
const [heroSlides, novedades, categorias, seleccion] = await Promise.all([
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/landing/hero`).then(r => r.json()),
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/productos/novedades?limit=6`).then(r => r.json()),
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categorias/destacadas`).then(r => r.json()),
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/landing/seleccion`).then(r => r.json()),
])
```

**Orden de secciones** (respetar fondos alternados):
1. `HeroSlider` — wrapper fondo `var(--white)`, `border-radius: 16px`
2. `LibrosMesSection` — fondo `var(--white)`
3. Grid de categorías destacadas con `CategoryCard` — fondo `var(--beige)`, link a `/productos?cat={slug}`
4. Grid de novedades (6 `ProductCard`) con link "Ver todos" → `/productos` — fondo `var(--white)`
5. `QuoteSection` — fondo `var(--moss)`
6. `InstagramSection` — fondo `var(--beige)`

---

### 11. Página de listado de productos — `src/app/(store)/productos/page.tsx`

**Nota sobre la ruta:** El listado principal de productos vive en `/productos` (`src/app/(store)/productos/page.tsx`). No crear `/catalogo`. Todos los links del sitio que apunten al listado deben usar `/productos`.

Mixta — Server Component para la carga inicial, Client Component interno para los filtros dinámicos con TanStack Query.

```typescript
// Lee searchParams: cat, filter, sort, page
export default async function ProductosPage({ searchParams }) {
  const cat = searchParams.cat || 'todos'
  const page = searchParams.page || '1'
  const sort = searchParams.sort || 'default'
  const filter = searchParams.filter || 'todos'

  const [productos, categorias] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/productos?category=${cat}&page=${page}&sort=${sort}`),
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categorias`),
  ]).then(rs => Promise.all(rs.map(r => r.json())))

  return (
    <>
      <PageHeader
        categories={categorias.data}
        activeCategory={cat}
        onCategoryChange={...}   // manejado por Client Component interno
      />
      <FilterBar
        totalResults={productos.pagination.total}
        activeFilter={filter}
        activeSort={sort}
        onFilterChange={...}
        onSortChange={...}
      />
      <div style={{ padding: '48px 56px 80px', minHeight: '60vh' }}>
        <ProductGrid productos={productos.data} />
        <Pagination
          currentPage={Number(page)}
          totalPages={productos.pagination.totalPages}
        />
      </div>
    </>
  )
}
```

**Comportamiento de filtros:**
- `PageHeader` maneja el filtro por categoría (pills → `?cat=`)
- `FilterBar` maneja filtros adicionales (`?filter=nuevo|oferta`) y ordenamiento (`?sort=`)
- Todos los filtros sincronizan con la URL usando `router.push` (sin reload completo)
- TanStack Query re-fetcha cuando cambian los searchParams

**Grilla del listado:** `grid-template-columns: repeat(5, 1fr)`, `gap: 28px 20px`

**Responsive:**
- ≤1200px → 4 columnas
- ≤1024px → 3 columnas
- ≤768px → 2 columnas, gap 16px

---

## Reglas importantes

- **La ruta del listado es `/productos`**, no `/catalogo`. El archivo es `src/app/(store)/productos/page.tsx`. No crear ningún archivo en `(store)/catalogo/`.
- **Los links de `CategoryCard` apuntan a `/productos?cat={slug}`**, no a `/catalogo?cat={slug}`.
- **Los links "Ver todos" del home apuntan a `/productos`**, no a `/catalogo`.
- **El clic en `ProductCard` navega a `/productos/{slug}`** — ruta del detalle de producto.
- **`ProductCard` es Client Component** — necesita Zustand. El resto son Server Components donde sea posible.
- **`addItem` del store de Zustand** siempre recibe el ítem completo y agrega 1 unidad (o incrementa en 1 si ya existe en el carrito). No hay parámetro de cantidad en `addItem`.
- **`header_image_url`** es un campo nuevo en `categories` — la migración de esta tarea es obligatoria antes de que `PageHeader` pueda usarlo.
- **Imágenes usan `next/image`** con `sizes` correcto según el contexto (home vs listado).
- **`formatCLP`** ya existe en `src/shared/utils/formatters.ts` — importar desde ahí, no redefinir.
- **Hero usa `border-radius: 16px`** — única excepción documentada al sistema de 2px.
- **NO crear páginas de detalle, carrito ni checkout** — eso es la Tarea 4.4.
- **NO modificar** archivos de Fases 1–3 ni layouts de la Tarea 4.2.
- Verificar que `tsc --noEmit` pase sin errores al finalizar.
