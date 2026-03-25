# Tarea 4.2 — Navbar, Footer y Layouts

## Contexto
Este es el segundo paso de la Fase 4 del proyecto Crecer Librería Cristiana. La Tarea 4.1 configuró los tokens de diseño en `globals.css` (Tailwind v4 con `@theme`), y creó los componentes atómicos en `shared/ui/` (Button, Badge, Input, SectionHeader, Separator) y el hook `useScrollReveal`.

Ahora construimos los componentes que envuelven todas las páginas — Navbar, CartPanel, Footer — y los layouts base de la tienda pública y del panel admin. Al terminar esta tarea, cualquier página que se cree heredará automáticamente el layout correcto.

## Prerequisitos
- Tarea 4.1 completada: tokens en `globals.css`, componentes en `shared/ui/`, hook `useScrollReveal`
- Los componentes `Button` y `Badge` de `shared/ui/` ya existen y se importan desde ahí
- El store de Zustand del carrito ya existe en `src/features/carrito/store.ts` con sus hooks en `src/features/carrito/hooks.ts`
- Las APIs de categorías (`GET /api/categorias`) y banners (`GET /api/landing/banners`) ya están implementadas

---

## Lo que necesito que hagas

### 1. Navbar — `src/shared/ui/Navbar.tsx`

Client Component (`'use client'`). Aparece en todas las páginas de la tienda pública excepto en su variante simplificada para checkout.

**Especificación visual** (del `index.html` y `catalogo.html`):

```
/* Contenedor */
position: sticky | top: 0 | z-index: 100
height: 64px | padding: 0 48px
display: flex | align-items: center | justify-content: space-between | gap: 20px
background: rgba(245,243,232,0.95)   ← usa el nuevo --beige con alfa
backdrop-filter: blur(16px)
border-bottom: 1px solid var(--border)
transition: box-shadow 0.3s

/* Al hacer scroll (clase .scrolled) */
box-shadow: 0 2px 24px rgba(58,48,1,0.08)
```

**Logo / marca:**
```
display: flex | align-items: center | gap: 10px
Cruz decorativa: width 28px, height 28px
  ::before → width 1.5px, height 100%, left 50%, background: var(--gold)
  ::after  → width 100%, height 1.5px, top 50%, background: var(--gold)
Nombre: font-family EB Garamond, 18px, weight 500, color: var(--moss)
Subtítulo: DM Sans, 9px, letter-spacing 0.22em, uppercase, color: var(--gold)
```

**Buscador:**
```
flex: 1 | max-width: 300px
Input: padding 8px 36px 8px 16px | background: var(--beige-warm)
border: 1px solid var(--border) | border-radius: 2px
font-size: 13px | color: var(--text)
focus: border-color var(--gold), background var(--white)
Botón lupa: posición absoluta derecha, color var(--text-light), hover: var(--moss)
```

**Links de navegación:**
```
display: flex | gap: 28px | list-style: none
Links: font-size 13px, font-weight 400, letter-spacing 0.04em
color: var(--text-mid) | hover: var(--moss)
Link activo: font-weight 500, color: var(--moss)
```

**Dropdown de categorías:**
```
position: absolute | top: 100% | margin-top: 10px
min-width: 230px | padding: 10px 0
background: rgba(245,243,232,0.98) | backdrop-filter: blur(16px)
border: 1px solid var(--border) | border-radius: 2px
box-shadow: 0 16px 40px rgba(58,48,1,0.12)
Animación: opacity 0→1, visibility, translateY(-8px→0) en 0.22s
Trigger: onMouseEnter/onMouseLeave del item padre
Items: padding 9px 18px, font-size 13px, color var(--text-mid)
hover: background var(--beige-warm), color var(--moss)
```

**Ícono del carrito:**
```
display: flex | align-items: center | gap: 6px
SVG: width 17px, height 17px | color: var(--moss)
hover: opacity 0.7
Badge: background var(--gold), color white, font-size 9px, font-weight 600
width 16px, height 16px, border-radius 50%
```

El contador del badge usa `useCartSummary()` del hook de Zustand en `src/features/carrito/hooks.ts`. La propiedad a mostrar es `totalItems` (suma de todas las cantidades). Si se prefiere mostrar solo el número de filas distintas, usar `itemCount` — elegir una y ser consistente en todo el proyecto.

**Comportamiento:**
- Al hacer scroll > 40px, agregar clase que activa la sombra (usar `useEffect` + `scroll` listener)
- Al hacer clic en el ícono del carrito, abrir/cerrar `CartPanel`
- Cerrar dropdown con `Escape`
- Cerrar CartPanel al hacer clic fuera
- Las categorías del dropdown llegan como prop desde el layout Server Component

**Props:**
```typescript
interface NavbarProps {
  categories?: { id: string; name: string; slug: string }[]
  variant?: 'default' | 'checkout'  // checkout: sin links, sin búsqueda, muestra "← Volver al carrito"
}
```

**Variante checkout** (del `checkout.html`):
```
Solo muestra: logo | "← Volver al carrito" (link, color var(--text-light))
Sin buscador, sin links de navegación, sin carrito
```

---

### 2. CartPanel — `src/shared/ui/CartPanel.tsx`

Client Component (`'use client'`). Panel del carrito que aparece como dropdown al hacer clic en el ícono del carrito de la Navbar.

**Especificación visual** (del `index.html`):

```
/* Contenedor */
position: fixed | top: 72px | right: 24px
width: 320px
background: rgba(245,243,232,0.99)
border: 1px solid var(--border) | border-radius: 2px
box-shadow: 0 20px 48px rgba(58,48,1,0.14)
backdrop-filter: blur(20px)
z-index: 200
Animación open: opacity 0→1, visibility, translateY(-8px→0) en 0.22s ease

/* Header */
padding: 16px 18px 14px
border-bottom: 1px solid var(--border)
Título "Mi carrito": EB Garamond, 16px, weight 500, color var(--moss)
Contador: "X productos" o "Vacío" — DM Sans, 10px, letter-spacing 0.15em, uppercase, color var(--text-light)

/* Lista de items */
max-height: 260px | overflow-y: auto
scrollbar: width 3px, thumb color var(--beige-mid)

/* Item del carrito */
display: flex | align-items: center | gap: 12px | padding: 10px 18px
hover: background var(--beige-warm)

Miniatura del libro:
  width: 34px | aspect-ratio: 2/3
  background: linear-gradient(145deg, var(--beige-warm), var(--beige-mid))
  border-radius: 1px
  Si hay imageUrl: mostrar imagen con object-fit cover
  Si no hay: mostrar ícono de libro SVG (opacity 0.22, color var(--moss))

Info del libro:
  Título: EB Garamond, 13px, weight 500, color var(--text)
  overflow: hidden, text-overflow: ellipsis, white-space: nowrap
  Autor: DM Sans, 11px, color var(--text-light), margin-top 1px

Precio y cantidad (columna derecha):
  Precio: 13px, weight 500, color var(--gold)
  Controles cantidad: botones − y + de 18x18px
    border: 1px solid var(--border) | border-radius: 1px
    hover: background var(--moss), border-color var(--moss), color white

/* Estado vacío */
padding: 40px 18px | text-align: center
Ícono bolsa: width 32px, opacity 0.15, color var(--moss)
Texto: "Tu carrito está vacío" — 13px, color var(--text-light)

/* Footer del panel */
padding: 14px 18px 16px
border-top: 1px solid var(--border)
Fila total: "TOTAL" label (10px, letter-spacing 0.2em, uppercase, var(--text-light))
            Monto (EB Garamond, 20px, weight 500, color var(--moss))
Botón checkout:
  width: 100% | padding: 12px
  background: var(--moss) | color: white
  font-size: 11px | font-weight: 500 | letter-spacing: 0.12em | uppercase
  border-radius: 2px
  hover: var(--moss-mid), translateY(-1px)
  disabled (carrito vacío): opacity 0.38, cursor not-allowed
```

**Conexión con Zustand:**
- Usar `useCart()` de `src/features/carrito/hooks.ts` para las acciones: `incrementQuantity`, `decrementQuantity`, `removeItem`
- Usar `useCartSummary()` de `src/features/carrito/hooks.ts` para los totales
- El botón de checkout es un `<Link href="/checkout">` que también cierra el panel

**Props:**
```typescript
interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
}
```

---

### 3. Footer — `src/shared/ui/Footer.tsx`

Server Component. Carga los datos del banner de footer desde la API y renderiza el footer completo con la ilustración de fondo.

**Fondo:** `var(--beige-warm)` — `#EDE9D4`

**Línea decorativa superior:**
```
position: absolute | top: 0 | left: 0 | right: 0 | height: 1px
background: linear-gradient(to right, transparent, rgba(200,168,48,0.35), transparent)
z-index: 4
```

**Ilustración de fondo:**
```
position: absolute | inset: 0
width controlado por parámetro | height: 100%
object-fit: cover | object-position: left center
mix-blend-mode: multiply
opacity: controlado por parámetro (default 0.80)
```

**Overlay de desvanecimiento:**
```
position: absolute | inset: 0 | z-index: 2
background: linear-gradient(to right,
  rgba(237,233,212,0) 0%,
  rgba(237,233,212,0) {fadeStart}%,
  rgba(237,233,212,0.78) {mid}%,
  rgba(237,233,212,0.97) {fadeEnd}%,
  rgba(237,233,212,1) 100%
)
donde mid = Math.round((fadeStart + fadeEnd) / 2)
```

**Layout de información** (z-index: 3):
```
display: flex | align-items: stretch | min-height: 280px

Espacio izquierdo para ilustración: width = artSpaceWidth%
Panel de información derecho: flex: 1

Padding del panel: 40px 56px 0 32px
Grid interno: grid-template-columns: 1.3fr 1fr 1fr 1fr | gap: 28px
```

**Columna 1 — Branding:**
```
Cruz decorativa: 20x20px, líneas en var(--gold)
Nombre: EB Garamond, 17px, color var(--text)
Tagline: DM Sans, 7px, letter-spacing 0.22em, uppercase, color var(--gold)
Descripción: DM Sans, 11px, line-height 1.75, color var(--text-light), weight 300
```

**Columnas 2 y 3 — Catálogo e Información:**
```
h4: DM Sans, 7px, letter-spacing 0.28em, uppercase, color var(--gold), margin-bottom 14px
Links: DM Sans, 11px, color var(--text-mid), weight 300 | hover: color var(--moss)
```

**Columna 4 — Ubicación:**
```
h4: igual a las columnas anteriores
Ícono pin SVG: 14px, color var(--gold)
Texto: "Arturo Prat 470 / Antofagasta, Chile" — 11px, color var(--text-mid), weight 300
Link "Ver en el mapa →":
  9px, font-weight 500, letter-spacing 0.1em, uppercase
  color var(--gold) | border-bottom: 1px solid rgba(200,168,48,0.3)
  hover: border-color var(--gold)
  href: "https://maps.google.com/?q=Arturo+Prat+470+Antofagasta"
  target: _blank
```

**Barra inferior:**
```
padding: 14px 56px 20px
border-top: 1px solid rgba(115,96,2,0.1)
display: flex | justify-content: space-between
font-size: 10px | color: var(--text-light)
"© 2026 Crecer Librería. Todos los derechos reservados." | "Diseño: Hultur Studio"
```

**Carga de datos del footer:**

El footer llama a `GET /api/landing/banners?position=footer_illustration`. El endpoint devuelve el banner correspondiente incluyendo el campo `metadata` cuando existe. Si no existe el banner o no tiene `metadata`, el footer usa valores por defecto:

```typescript
// Valores por defecto si no existe el banner o su metadata:
const defaults = {
  imageUrl: null,
  opacity: 0.80,
  fadeStart: 40,
  fadeEnd: 70,
  imgWidth: 72,       // % del ancho total
  artSpaceWidth: 36,  // % de espacio reservado para la ilustración
}

// Tipo del metadata almacenado en DB:
interface FooterBannerMetadata {
  opacity: number       // 0-1
  fadeStart: number     // 0-100
  fadeEnd: number       // 0-100
  imgWidth: number      // 0-100
  artSpaceWidth: number // 0-100
}
```

Si no hay `imageUrl`, el footer se muestra sin ilustración, solo con el fondo `beige-warm`.

---

### 4. Migración de Drizzle — campo `metadata` en banners

**La tabla `banners` actualmente no tiene este campo.** Agregarlo como columna nueva:

```typescript
// En src/integrations/drizzle/schema/landing.ts
// Agregar en la definición de la tabla banners:
metadata: jsonb('metadata'),   // nullable — parámetros extendidos por sección
```

Generar y ejecutar la migración:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Esta columna también será útil para otras secciones del landing que necesiten parámetros configurables en el futuro.

---

### 5. Layout de la tienda pública — `src/app/(store)/layout.tsx`

Server Component. Envuelve todas las páginas de la tienda pública.

```typescript
// Carga las categorías para el Navbar directamente con Drizzle
// (estamos en el servidor, no necesitamos fetch a la API)

import { db } from '@/integrations/drizzle'
import { categories } from '@/integrations/drizzle/schema'
import { eq, asc } from 'drizzle-orm'

// Consultar categorías activas ordenadas por display_order
// Pasar como prop al Navbar: <Navbar categories={categories} />
// Renderizar: <Navbar> + {children} + <Footer />
```

**IMPORTANTE — imports de Drizzle:** El proyecto expone Drizzle a través de un barrel en `@/integrations/drizzle`. Usar siempre ese import, nunca `@/integrations/drizzle/client` directamente. Si el barrel exporta el schema como namespace separado, ajustar el import según la convención del proyecto (p. ej. `import { schema } from '@/integrations/drizzle'` o `import { categories } from '@/integrations/drizzle/schema'`).

El layout NO incluye ningún padding ni wrapper adicional — cada página maneja su propio espaciado interno.

---

### 6. Layout del panel admin — `src/app/admin/(panel)/layout.tsx`

**IMPORTANTE — estructura del admin:** El panel admin está bajo el route group `(panel)`. Las páginas del admin viven en `src/app/admin/(panel)/`. Las URLs públicas siguen siendo `/admin`, `/admin/productos`, etc. — el route group no afecta las URLs.

El login (`src/app/admin/login/`) está **fuera** del route group `(panel)` y no hereda este layout.

Client Component (`'use client'`). Reemplaza el layout básico de la Fase 3.

**Estructura:**
```
<div style="display: flex; height: 100vh; overflow: hidden">
  <AdminSidebar />           ← siempre visible
  <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden">
    <AdminTopbar />          ← barra superior
    <main style="flex: 1; overflow-y: auto; padding: 28px">
      {children}
    </main>
  </div>
</div>
```

**AdminSidebar** — crear en `src/features/admin/components/AdminSidebar.tsx`:

```
width: 220px | flex-shrink: 0
background: var(--moss) | border-right: 1px solid rgba(217,186,30,0.15)
display: flex | flex-direction: column | height: 100vh

/* Logo */
padding: 20px 18px 16px
border-bottom: 1px solid rgba(255,255,255,0.1)
Cruz cuadrada: 28x28px, background var(--gold), border-radius 2px (NO 6px — nuestro sistema es 2px)
Nombre: EB Garamond, 1.2rem, color white
Sub: DM Sans, 0.6rem, color rgba(255,255,255,0.4), letter-spacing 1px, uppercase

/* Navegación */
flex: 1 | overflow-y: auto | padding: 12px 10px

Sección label:
  font-size: 0.58rem | font-weight: 600 | letter-spacing: 2px
  text-transform: uppercase | color: rgba(255,255,255,0.35)
  padding: 14px 10px 6px

Item del sidebar:
  display: flex | align-items: center | gap: 10px
  padding: 9px 10px | border-radius: 2px (NO 8px)
  cursor: pointer | transition: all 0.18s | margin-bottom: 2px
  hover: background rgba(255,255,255,0.08)
  active: background rgba(217,186,30,0.15), border: 1px solid rgba(217,186,30,0.25)
  active icon: color var(--gold)
  active label: color white, font-weight 500

Ícono: font-size 15px, width 18px, color rgba(255,255,255,0.55)
Label: font-size 0.8rem, color rgba(255,255,255,0.65)
Badge numérico: background var(--error), color white, font-size 0.6rem, font-weight 700
               padding: 2px 6px, border-radius: 10px

/* Footer del sidebar */
padding: 14px 18px
border-top: 1px solid rgba(255,255,255,0.1)
Avatar: 32px, border-radius 50%, gradient de var(--gold)
Nombre admin: 0.78rem, weight 500, color white
Rol: 0.65rem, color rgba(255,255,255,0.4)
Botón logout: color rgba(255,255,255,0.35), hover: color var(--error)
              llama a POST /api/admin/auth/logout y redirige a /admin/login
```

**Navegación del sidebar** (items y rutas reales del proyecto):

```
─── Principal ───
Dashboard          → /admin
Pedidos            → /admin/pedidos     (badge con pedidos pendientes)

─── Catálogo ───
Productos          → /admin/productos
Categorías         → /admin/categorias

─── Página principal ───
Hero               → /admin/landing/hero
Banners            → /admin/landing/banners
Selección curada   → /admin/landing/seleccion
Footer             → /admin/landing/footer

─── Sistema ───
Cupones            → /admin/cupones
```

El item activo se determina comparando `usePathname()` con el href de cada item. Usar `startsWith` para que rutas anidadas (ej. `/admin/productos/nuevo`) mantengan el item "Productos" activo.

**AdminTopbar** — crear en `src/features/admin/components/AdminTopbar.tsx`:

```
height: 56px | flex-shrink: 0
background: rgba(245,243,232,0.95) | backdrop-filter: blur(12px)
border-bottom: 1px solid var(--border)
display: flex | align-items: center | justify-content: space-between | padding: 0 28px

Título de la sección actual: 0.88rem, font-weight 600, color var(--text)
  Se determina por la ruta actual con usePathname()

Zona derecha: buscador simple + botón "Cerrar sesión"
```

El nombre del admin logueado se obtiene haciendo fetch a `GET /api/admin/auth/me` al montar el componente.

---

### 7. Archivos de exportación

Actualizar `src/shared/ui/index.ts` agregando los nuevos componentes:

```typescript
export { Navbar } from './Navbar'
export { CartPanel } from './CartPanel'
export { Footer } from './Footer'
// (mantener los exports existentes de la Tarea 4.1)
```

---

## Reglas importantes

- **El layout del panel admin va en `src/app/admin/(panel)/layout.tsx`**, no en `src/app/admin/layout.tsx`. El route group `(panel)` no afecta las URLs — `/admin`, `/admin/productos`, etc. siguen funcionando igual.
- **La página de login está fuera del route group**: `src/app/admin/login/page.tsx`. No hereda el layout del panel y no debe hacerlo.
- **El sidebar del admin siempre está visible** — es parte del layout, no un componente toggle.
- **El Navbar usa `categories` como prop** recibida desde el layout Server Component — no hace fetch propio.
- **El Footer hace su propio fetch** de los parámetros de la ilustración porque es un Server Component independiente.
- **Imports de Drizzle**: usar siempre `@/integrations/drizzle` (barrel). No usar rutas internas como `@/integrations/drizzle/client`.
- **La tabla `banners` no tiene `metadata` todavía** — la migración de este campo es parte de esta tarea y debe ejecutarse antes de que el footer intente leerlo.
- **`border-radius: 2px` en todo** — el sidebar del admin usa `2px` en sus items, NO el `8px` del HTML del diseñador.
- **NO modificar** las API Routes de Fases 1–3 ni el store de Zustand.
- **NO crear páginas** — solo layouts y componentes compartidos.
- Verificar que `tsc --noEmit` pase sin errores al finalizar.
