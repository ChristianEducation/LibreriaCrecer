# Crecer Librería Cristiana — Handoff v01
**Última actualización:** Abril 2026 — Sesión: CAT1–CAT5 (Logo, BrandLoader, landing spacing, panoramic categories, editable footer, /nosotros)  
**Stack:** Next.js 15.2.4 · Drizzle ORM · Supabase PostgreSQL · Zustand 5 · Tailwind v4 · Getnet · lottie-react  
**Estado del build:** ✅ `npx tsc --noEmit` limpio · ✅ `npm run lint` limpio  
**Líneas de código:** ~17.500 · ~200 archivos `.ts`/`.tsx`

---

## 📋 INSTRUCCIÓN DE INICIO OBLIGATORIA

> Lee este handoff completo antes de escribir cualquier línea de código.
> Luego lee `docs/agentes/CLAUDE.md` para las reglas globales.
> Si tocas archivos de UI → lee `docs/agentes/frontend.md` primero.
> Si tocas API Routes o servicios → lee `docs/agentes/backend.md` primero.

---

## 🗂 STACK Y RUTAS

```
Framework:  Next.js 15.2.4 (App Router + Turbopack)
Lenguaje:   TypeScript strict (sin `any`)
DB:         Supabase PostgreSQL vía Drizzle ORM (conexión directa, Session Pooler)
Storage:    Supabase Storage (solo imágenes — nunca para queries a BD)
Estado:     Zustand 5 con persist a localStorage
Formularios: React Hook Form 7 + Zod 4
Auth admin: jose (JWT) + bcryptjs — Edge Runtime compatible
Pagos:      Getnet Web Checkout (actualmente en ambiente TEST)
Animaciones: lottie-react (BrandLoader — public/animations/Loader_16.json)
Emails:     Resend (pendiente — integrations/email/index.ts es placeholder vacío)
Inventario: VESSI (pendiente — integrations/inventory/index.ts es placeholder vacío)
Instagram:  Elfsight widget externo
Estilos:    Tailwind CSS v4 (sin tailwind.config.ts — tokens en globals.css)
Testing:    Playwright (E2E — 32 passing, 1 skipped known issue)
Deploy:     Vercel
```

### Scripts principales
```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run lint         # ESLint
npx tsc --noEmit     # Verificar tipos sin compilar (SIEMPRE correr antes de entregar)
npm run db:generate  # Generar migración Drizzle
npm run db:migrate   # Aplicar migraciones
npm run seed:admin   # Crear primer usuario admin
npm run seed:products # Poblar catálogo (pendiente de ejecutar en producción)
npm run test:e2e          # Correr todos los tests E2E (requiere dev server en :3000)
npm run test:e2e:ui       # Playwright con interfaz gráfica interactiva
npm run test:e2e:report   # Abrir reporte HTML del último run
```

### Path aliases (tsconfig)
```
@/app/*          → src/app/*
@/features/*     → src/features/*
@/shared/*       → src/shared/*
@/integrations/* → src/integrations/*
@/lib/*          → src/lib/*
```

---

## 🗺 ESTRUCTURA DE CARPETAS

```
src/
├── app/
│   ├── (store)/              # Tienda pública — StoreLayout con Navbar + Footer
│   │   ├── page.tsx          # Home ✅ (LandingWithSplash wrapper — splash 3.5s)
│   │   ├── productos/        # /productos (listado) y /productos/[slug] (detalle) ✅
│   │   ├── categorias/       # /categorias ✅ Grid real con header visual y breadcrumb
│   │   ├── carrito/          # /carrito ✅
│   │   └── nosotros/         # /nosotros ✅ Secciones alternadas texto+imagen (CMS)
│   ├── (checkout)/           # Layout propio sin Navbar/Footer de la tienda
│   │   └── checkout/
│   │       ├── page.tsx      # Formulario de compra ✅
│   │       └── confirmacion/ # Página post-pago ✅ (polling 3s/30s activo, usa BrandLoader)
│   ├── admin/
│   │   ├── login/            # Pública — no protegida por middleware ✅
│   │   └── (panel)/          # Protegido — AdminLayout con sidebar ✅
│   │       ├── page.tsx      # Dashboard con stats reales ✅ (acceso rápido a /nosotros)
│   │       ├── productos/    # CRUD completo ✅
│   │       ├── categorias/   # CRUD completo ✅
│   │       ├── pedidos/      # Listado + detalle + cambio de estado ✅
│   │       ├── nosotros/     # CRUD secciones de /nosotros ✅
│   │       └── landing/      # hero/, banners/, seleccion/, footer/, categorias/ ✅
│   └── api/
│       ├── productos/        # GET público ✅
│       ├── categorias/       # GET público ✅
│       ├── landing/          # GET público hero, banners, selección, footer ✅
│       ├── nosotros/         # GET público secciones activas ✅
│       ├── ordenes/          # POST crear orden, GET por número ✅
│       ├── cupones/          # POST validar cupón ✅
│       ├── stock/            # POST validar stock ✅
│       ├── pagos/            # crear-sesion, retorno, notificacion ✅
│       └── admin/            # Rutas protegidas del admin ✅ (incluye /nosotros CRUD)
│
├── features/
│   ├── catalogo/             # Servicios, componentes, tipos del catálogo ✅
│   ├── carrito/              # Zustand store + hooks + tipos ✅
│   ├── checkout/             # Servicios de orden, cupón, stock, pago ✅
│   ├── admin/                # Auth, CRUD, schemas, componentes admin ✅
│   ├── landing/              # ✅ LandingWithSplash.tsx (splash screen 3.5s)
│   └── pedidos/              # ⚠️ Solo index.ts vacío — lógica en checkout/ y admin/
│
├── shared/
│   ├── ui/                   # Button, Input, Badge, Navbar, Footer, CartPanel, Toast...
│   │   ├── Logo.tsx          # ✅ Logo real SVG + texto "Crecer" con cruz dorada
│   │   └── BrandLoader.tsx   # ✅ Spinner Lottie con colores gold del proyecto
│   ├── hooks/                # useScrollReveal, useToast
│   ├── utils/                # formatters.ts (formatCLP, formatDate)
│   └── config/               # ⚠️ index.ts vacío
│
├── public/
│   ├── animations/
│   │   └── Loader_16.json    # ✅ Animación Lottie del BrandLoader (colores gold #c8a830 [0.788,0.659,0.298,1])
│   └── images/
│       └── logo.png          # Logo PNG de reserva
│
└── integrations/
    ├── drizzle/              # Cliente + schema (15 tablas) + 5 migraciones ✅
    ├── supabase/             # Storage client + helpers ✅
    ├── payments/getnet/      # Auth, client, config, types ✅
    ├── email/                # ⚠️ Placeholder vacío — Resend pendiente
    └── inventory/            # ⚠️ Placeholder vacío — VESSI pendiente

tests/
├── home.spec.ts        # 6 tests ✅
├── catalogo.spec.ts    # 9 tests (8 passing, 1 skipped known issue) ✅
├── producto.spec.ts    # 7 tests ✅
├── carrito.spec.ts     # 5 tests ✅
├── admin.spec.ts       # 5 tests ✅
└── checkout.spec.ts    # 6 tests ⚠️ PENDIENTE DE CORREGIR — requiere Getnet TEST activo
```

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### Feature 1: Catálogo público
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/features/catalogo/services/product-service.ts`
- `src/features/catalogo/services/category-service.ts`
- `src/features/catalogo/services/landing-service.ts`
- `src/app/(store)/page.tsx` — Home
- `src/app/(store)/productos/page.tsx` — Listado con filtros URL
- `src/app/(store)/productos/[slug]/page.tsx` — Detalle
- `src/app/(store)/categorias/page.tsx` — Grid de categorías con header

**Cómo funciona:**
Las páginas son Server Components que llaman directamente a los servicios de Drizzle (no vía fetch a la API pública). La API pública existe para uso externo. El listado usa `searchParams` de Next.js para filtro por categoría, ordenamiento y paginación — todo URL-based. La búsqueda textual tiene input en el `FilterBar` (desktop) y en el `Navbar` móvil, ambos conectados al parámetro `?search=` en la URL, que el backend resuelve con `ilike` en title y author.

**Detalles de UI del catálogo:**
- `ProductGrid`: 2 columnas en móvil, 5 en desktop (`grid-cols-2 lg:grid-cols-5`)
- `FilterBar`: chips de filtro en desktop (`hidden md:flex`) y fila scroll horizontal en móvil (`.filter-bar-chips-mobile`)
- `Pagination`: muestra "Página X de Y" y botones prev/next
- `ProductCard`: stepper respeta `stock_quantity` real del producto, badge "Últimas unidades" si `stock_quantity ≤ 5`

---

### Feature 2: Carrito
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/features/carrito/store.ts` — Zustand con persist
- `src/features/carrito/hooks.ts` — useCart, useCartSummary, useCartItem
- `src/features/carrito/useCartHydration.ts` — evita hydration mismatch SSR

**Cómo funciona:**
Store en `localStorage` (`crecer-cart`). La hidratación usa `useCartHydration()` que retorna `hydrated: boolean` — los componentes que dependen del carrito deben esperar a que sea `true` antes de renderizar. `addItem()` siempre agrega 1 unidad — para cantidades mayores llamar `updateQuantity()` por separado.

---

### Feature 3: Checkout y Pagos
**Estado:** ✅ Completa (en ambiente TEST — flujo end-to-end verificado)  
**Archivos clave:**
- `src/features/checkout/services/order-service.ts` — transacción atómica
- `src/features/checkout/services/payment-service.ts` — flujo Getnet
- `src/integrations/payments/getnet/` — auth, client, config, types
- `src/app/(checkout)/checkout/page.tsx`
- `src/app/(checkout)/checkout/confirmacion/page.tsx`

**Cómo funciona:**
1. Usuario completa el formulario → `POST /api/ordenes` crea la orden en `pending` (transacción atómica: valida stock, snapshot de precios)
2. Siempre usa Getnet → `POST /api/pagos/crear-sesion` → redirige a Getnet Web Checkout
3. Getnet redirige a `GET /api/pagos/retorno` (tanto en aprobación como en cancelación) → actualiza estado en BD → redirige a `/checkout/confirmacion?order=...&status=...`
4. Getnet también envía `POST /api/pagos/notificacion` (webhook async) — tiene guard idempotente
5. `/checkout/confirmacion` hace polling a `GET /api/ordenes/[orderNumber]` cada 3s si el estado inicial es `pending`, hasta 10 intentos (30s), luego muestra mensaje de timeout
6. Si el pago fue cancelado, la página muestra un botón "Agregar al carrito y reintentar" que recarga los items desde el snapshot de la orden

**Opciones de entrega disponibles:**
- Retiro en tienda (Arturo Prat 470) — sin costo
- Despacho a domicilio vía Chilexpress — costo se paga al recibir (`shippingCost: 0` en BD)

**IMPORTANTE:** El stock se descuenta únicamente cuando el estado pasa de `pending` a `paid`. El guard AND `status = 'pending'` evita doble procesamiento entre retorno y webhook.

---

### Feature 4: Panel Admin
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/middleware.ts` — protege `/admin/*` y `/api/admin/*`
- `src/features/admin/services/auth-service.ts`
- `src/features/admin/services/product-admin-service.ts`
- `src/features/admin/services/category-admin-service.ts`
- `src/features/admin/services/order-admin-service.ts`
- `src/features/admin/services/landing-admin-service.ts`

**Cómo funciona:**
JWT en cookie HTTP-only `admin-session` (24h, firmado con `jose`). Middleware Edge Runtime verifica el token en cada request. El admin puede gestionar: productos (CRUD + imágenes), categorías, pedidos (cambio de estado + notas internas), hero slides, banners intermedios y selección curada del landing.

---

### Feature 5: Landing editable
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/features/catalogo/components/HeroSlider.tsx`
- `src/features/catalogo/components/LibrosMesSection.tsx`
- `src/features/catalogo/components/CategoryCarousel.tsx`
- `src/features/catalogo/components/RecentProductsCarousel.tsx`
- `src/features/catalogo/components/QuoteSection.tsx` — Hero intermedio
- `src/features/catalogo/components/CategoryCard.tsx` — con soporte panorámico
- `src/features/catalogo/components/InstagramSection.tsx`
- `src/shared/ui/TopBanner.tsx` + `TopBannerClient.tsx`
- `src/features/landing/LandingWithSplash.tsx` — wrapper con splash screen

**Secciones y su fuente de datos:**
- Hero slides → tabla `hero_slides` (admin)
- Selección del mes → tabla `featured_products` con sección canónica `monthly_selection` + filtro `?filter=seleccion` en catálogo (admin)
- Categorías → tabla `categories` activas con imagen panorámica opcional (admin `/admin/landing/categorias`)
- Recién llegados → 10 productos más recientes (automático)
- Hero intermedio → tabla `banners` con `position="hero_intermedio"` (admin)
- Footer texto → tabla `footer_content` — descripción, links, dirección, copyright (admin)
- Footer ilustración → tabla `banners` con `position="footer_illustration"` (admin)
- Instagram → Elfsight widget (`NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`)

**Imagen panorámica en categorías (CAT3):**
`CategoryCarousel` acepta `panoramaUrl?: string | null`. Cuando está presente, cada `CategoryCard` usa CSS `background-image` con `background-position` calculado: `(index / (total-1)) * 100% 50%`. Efecto: la imagen panorámica se distribuye horizontalmente entre todas las tarjetas. Sin panorama, las tarjetas usan su `imageUrl` individual o el gradiente de fallback. Configurable desde `/admin/landing/categorias`.

**Padding vertical corregido (CAT2):**
`RecentProductsCarousel`, `LibrosMesSection`, `CategoryCarousel` usan `paddingTop/Bottom: "5rem"` (antes 2.5rem). `QuoteSection` usa `paddingTop/Bottom: "6.25rem"` + overlay con div separado `rgba(30,24,0,0.62)`. Buscador Navbar: `maxWidth: "300px"` inline.

**Footer dinámico (CAT4):**
`Footer.tsx` llama `Promise.all([getFooterBanner(), getFooterContent()])`. `getFooterContent()` fetch a `/api/landing/footer`; si falla, cae al objeto `defaultFooterContent` hardcodeado. Links del footer se guardan como `"label::href|||label::href"` en BD. La imagen del footer usa `object-left` (no `object-left-center mix-blend-multiply`).

---

### Feature 8: Logo real + BrandLoader + Splash screen (CAT1)
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/shared/ui/Logo.tsx` — Logo SVG + texto "Crecer" con cruz dorada (reemplaza BrandMark hardcodeado en Navbar y Footer)
- `src/shared/ui/BrandLoader.tsx` — Spinner Lottie usando `lottie-react`, carga `public/animations/Loader_16.json`
- `public/animations/Loader_16.json` — Animación Lottie con colores gold `[0.788, 0.659, 0.298, 1]` (#c8a830)
- `src/features/landing/LandingWithSplash.tsx` — Client Component, muestra `BrandLoader` por 3.5s antes de renderizar el home
- `src/app/(store)/page.tsx` — envuelto en `LandingWithSplash` (solo primera visita o navegación directa al home)
- `src/app/(checkout)/checkout/confirmacion/page.tsx` — usa `BrandLoader` en lugar del spinner SVG genérico

**Cómo funciona:**
`BrandLoader` importa la animación Lottie y la renderiza con `lottie-react`. `LandingWithSplash` mantiene estado `showSplash` con `setTimeout(3500)`; mientras `showSplash=true` muestra el loader centrado en pantalla completa, luego monta el contenido real. La confirmación de pago usa `BrandLoader` en el estado de polling `pending`.

**Link admin discreto en Footer (CAT1):**
En la barra de copyright, al final del bloque derecho, un `·` (punto mediano) con `href="/admin/login"`, `opacity-60`, `hover:opacity-100`, sin underline. No visible para usuarios normales, accesible para el admin directo vía URL o click.

---

### Feature 9: Página /nosotros con CMS (CAT5)
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/app/(store)/nosotros/page.tsx` — Server Component, hero moss, secciones alternadas, CTA
- `src/app/admin/(panel)/nosotros/page.tsx` — Client Component CRUD con `AdminUploadZone`
- `src/app/api/nosotros/route.ts` — GET público secciones activas ordenadas por `displayOrder`
- `src/app/api/admin/nosotros/route.ts` — GET all + POST crear (con auto-incremento de `displayOrder`)
- `src/app/api/admin/nosotros/[id]/route.ts` — PUT actualizar + DELETE soft (isActive=false)
- `src/app/api/admin/nosotros/[id]/imagen/route.ts` — POST imagen via `uploadBannerImage(file, "promo")`
- `src/integrations/drizzle/schema/landing.ts` — tabla `aboutSections`

**Cómo funciona:**
Las secciones tienen `title`, `content`, `imageUrl`, `imagePosition` ("right"|"left"), `displayOrder`, `isActive`. La página pública alterna fondo beige/white por índice par/impar. Cuando hay imagen, usa grid 2 columnas con orden CSS según `imagePosition`. Sin imagen, el texto ocupa `maxWidth: 720px`. El admin permite crear, editar, activar/desactivar y eliminar (soft) cada sección. Las imágenes se suben a bucket `banners` con subcarpeta `promo`.

**Navbar (CAT5):**
- Link "Conócenos" agregado en desktop (antes del dropdown Categorías) y en el drawer móvil
- `navLinksAfterCategories` actualizado: `?filter=seleccion` (Selección del mes) y `?filter=nuevo` (Recién llegados)
- La selección editorial del sitio es única: home, header, catálogo y admin apuntan a `monthly_selection`

---

### Feature 6: Mobile responsive + menú hamburguesa
**Estado:** ✅ Completa  
**Archivos modificados:**
- `src/shared/ui/Navbar.tsx` — hamburger button + drawer móvil + búsqueda + categorías accordion
- `src/shared/ui/Footer.tsx` — grid responsive 1/4 columnas
- `src/shared/ui/CartPanel.tsx` — zona central fija 182px (vacío e items)
- `src/features/catalogo/components/FilterBar.tsx` — chips móvil scroll horizontal
- `src/features/catalogo/components/ProductGallery.tsx` — thumbnails con flex-wrap
- `src/features/catalogo/components/RecentProductsCarousel.tsx` — clase `.recent-products-grid`
- `src/features/checkout/components/CheckoutForm.tsx` — `.form-grid-2col`, `.form-grid-street`
- `src/app/globals.css` — clases CSS: `.form-grid-2col`, `.form-grid-street`, `.filter-bar-chips-mobile`, `.recent-products-grid`

**Comportamiento del drawer móvil (`<lg`):**
- Botón hamburger en Navbar, oculto en `lg:hidden`
- Drawer fijo desde `top: 64px`, z-index 99, anima con opacity + translateY
- Backdrop con z-index 98 — cierra al hacer click
- Cierra al presionar Escape, al navegar a otra ruta
- Body scroll-lock mientras está abierto
- Incluye: input de búsqueda, links de nav, accordion de categorías

---

### Feature 7: Tests E2E con Playwright
**Estado:** ✅ Instalado y configurado · 32 passing · 1 skipped known issue  
**Archivos:**
- `playwright.config.ts` — baseURL `:3000`, Chromium + Pixel 5 mobile
- `tests/home.spec.ts` — 6 tests
- `tests/catalogo.spec.ts` — 9 tests (1 skipped: chip "Todos" router.push known issue)
- `tests/producto.spec.ts` — 7 tests
- `tests/carrito.spec.ts` — 5 tests
- `tests/admin.spec.ts` — 5 tests
- `tests/checkout.spec.ts` — 6 tests ⚠️ PENDIENTE DE CORREGIR

**Known issue — chip "Todos" en catálogo:**
`router.push("/productos")` en Next.js 15 App Router no dispara eventos de navegación detectables por Playwright cuando la URL actual ya tiene `?filter=`. Confirmado con `waitForFunction` en `window.location.href`. Funciona correctamente en browser real. Marcado como `test.skip` con comentario en `catalogo.spec.ts:37`.

**Para correr los tests:**
```bash
# Asegurarse de que el dev server esté corriendo en :3000
npm run dev
# En otra terminal:
npm run test:e2e                                           # todos
npm run test:e2e -- --project=chromium                    # solo desktop
npx playwright test home.spec.ts catalogo.spec.ts ...     # archivos específicos
```

---

## ⚙️ REGLAS CRÍTICAS DE CÓDIGO

### R1 — TopBanner: importar SIEMPRE directo, nunca por barrel
**Por qué:** Importa Drizzle (Node.js `fs`). Si entra al barrel `shared/ui/index.ts`, los Client Components lo arrastran al bundle del cliente → `Module not found: Can't resolve 'fs'`

```typescript
// ✅ CORRECTO
import { TopBanner } from "@/shared/ui/TopBanner";

// ❌ INCORRECTO
import { TopBanner } from "@/shared/ui"; // barrel — rompe el build
```

---

### R2 — DATABASE_URL: parseo manual obligatorio
**Por qué:** El username de Supabase tiene un punto (`postgres.projectref`). `postgres.js` lo parsea mal si recibe la URL directa.

```typescript
// ✅ CORRECTO — client.ts ya lo hace con new URL() manual
// No cambiar el código de parseo en src/integrations/drizzle/client.ts

// ❌ INCORRECTO
const db = drizzle(process.env.DATABASE_URL); // el punto en el username se pierde
```

---

### R3 — SSL siempre requerido en Drizzle
**Por qué:** Supabase siempre requiere SSL. Sin él las conexiones cuelgan indefinidamente.

```typescript
// ✅ CORRECTO
postgres({ ssl: "require", connect_timeout: 10, ... })

// ❌ INCORRECTO
postgres({ ssl: dbConfig.useSsl ? "require" : undefined }) // condicional → cuelga
```

---

### R4 — Login admin: window.location.href, no router.push
**Por qué:** `router.push()` + `router.refresh()` se cancelan mutuamente en App Router. La navegación no ocurre.

```typescript
// ✅ CORRECTO
window.location.href = nextPath ?? "/admin";

// ❌ INCORRECTO
router.push("/admin");
router.refresh(); // cancela el push
```

---

### R5 — addItem en el carrito: siempre agrega 1
**Por qué:** La firma de `addItem` no acepta `quantity`. Para agregar más de 1, usar `updateQuantity` después.

```typescript
// ✅ CORRECTO
addItem(cartItem);               // agrega con quantity: 1
updateQuantity(productId, 3);    // si necesitas 3

// ❌ INCORRECTO
addItem({ ...cartItem, quantity: 3 }); // el tipo no lo acepta
```

---

### R6 — Tailwind v4: sin tailwind.config.ts
**Por qué:** Tailwind v4 configura tokens en `globals.css` vía `@theme inline`. No existe `tailwind.config.ts`.

```css
/* ✅ CORRECTO — en globals.css */
@theme inline {
  --color-gold: #c8a830;
}

/* ❌ INCORRECTO — no existe este archivo */
/* tailwind.config.ts */
```

**Clases arbitrarias / responsivas complejas no confiables con Turbopack + Tailwind v4. Usar:**
- `.page-px` para padding horizontal (definido en globals.css)
- `style={{ }}` para valores de padding vertical específicos
- Clases utilitarias definidas en `globals.css` para texto custom

---

### R7 — Soft delete siempre
**Por qué:** Los registros nunca se eliminan físicamente para mantener trazabilidad de pedidos.

```typescript
// ✅ CORRECTO
await db.update(products).set({ isActive: false }).where(eq(products.id, id));

// ❌ INCORRECTO
await db.delete(products).where(eq(products.id, id));
```

---

### R8 — Precios siempre como integer CLP
**Por qué:** Nunca usar float para dinero. Los precios en CLP no tienen decimales.

```typescript
// ✅ CORRECTO
price: integer("price").notNull()  // en el schema
subtotal: item.price * item.quantity  // math con integers

// ❌ INCORRECTO
price: real("price")  // float → errores de redondeo
```

---

### R9 — jose, no jsonwebtoken
**Por qué:** El middleware corre en Edge Runtime. `jsonwebtoken` usa APIs de Node.js que no están disponibles en Edge.

```typescript
// ✅ CORRECTO
import { jwtVerify, SignJWT } from "jose";

// ❌ INCORRECTO
import jwt from "jsonwebtoken"; // incompatible con Edge Runtime
```

---

### R10 — .env.local: una variable por línea
**Por qué:** Si múltiples variables están en la misma línea, los valores se corrompen silenciosamente.

```bash
# ✅ CORRECTO
DATABASE_URL=postgresql://...
ADMIN_JWT_SECRET=...

# ❌ INCORRECTO
DATABASE_URL=postgresql://... ADMIN_JWT_SECRET=...
```

---

### R11 — no-console: solo warn y error
**Por qué:** El proyecto tiene ESLint configurado con la regla `no-console` que bloquea `console.log`.

```typescript
// ✅ CORRECTO
console.warn("Algo inesperado:", detail);
console.error("Error crítico:", err);

// ❌ INCORRECTO
console.log("debug"); // falla ESLint
```

---

### R12 — Playwright: scope locators a `main` para evitar CartPanel
**Por qué:** El `CartPanel` está siempre en el DOM con `opacity-0` cuando está cerrado. Locators como `getByText("Tu carrito está vacío")` o `getByText(/^\$[\d.]+/)` lo encuentran antes que el contenido principal → strict mode violations o matches de elementos ocultos.

```typescript
// ✅ CORRECTO en tests E2E
await expect(page.locator("main").getByText("Tu carrito está vacío")).toBeVisible();
await expect(page.locator("main").getByText(/^\$[\d.]+/).first()).toBeVisible();

// ❌ INCORRECTO
await expect(page.getByText("Tu carrito está vacío")).toBeVisible(); // puede encontrar CartPanel
```

---

### R13 — Migraciones Drizzle: generar SQL, aplicar manualmente en Supabase
**Por qué:** `drizzle-kit push` y `drizzle-kit migrate` fallan con el Session Pooler de Supabase. El username tiene un punto (`postgres.projectref`) que `postgres.js` parsea mal al recibir la URL directa, sin importar los flags SSL o `connect_timeout`. Las conexiones cuelgan indefinidamente.

```bash
# ✅ FLUJO CORRECTO para cambios de schema
npm run db:generate       # genera SQL en src/integrations/drizzle/migrations/
# → copiar el SQL generado
# → pegarlo en Supabase SQL Editor → "Run without RLS"

# ❌ INCORRECTO — cuelga siempre con Session Pooler
npx drizzle-kit push
npx drizzle-kit migrate
```

**Migraciones aplicadas hasta la fecha:**
- `0000_...` — schema inicial (products, categories, orders, etc.)
- `0001_...` — segunda migración
- `0002_...` — tercera migración
- `0003_add_footer_content.sql` — tabla `footer_content` (aplicada manualmente, Abril 2026)
- `0004_add_about_sections.sql` — tabla `about_sections` (aplicada manualmente, Abril 2026)

---

### R14 — BrandLoader en lugar de spinners genéricos
**Por qué:** El proyecto tiene una animación Lottie con los colores exactos del sistema de diseño (`gold #c8a830`). Usar SVG spinner genérico o `animate-spin` rompe la consistencia visual.

```typescript
// ✅ CORRECTO
import { BrandLoader } from "@/shared/ui/BrandLoader";

// En JSX:
<BrandLoader className="h-8 w-8" />   // tamaño configurable vía className

// ❌ INCORRECTO
<svg className="animate-spin h-8 w-8 text-gold" ...>   // spinner genérico
```

`BrandLoader` acepta `className` para controlar el tamaño. Importar directo (no desde barrel si hay conflictos de Server/Client).

---

## 🐛 BUGS RESUELTOS — HISTORIAL COMPLETO

| # | Síntoma | Causa raíz | Fix permanente |
|---|---|---|---|
| 1 | `productId: string \| null` no asignable a `CreateOrderItemInput` | Schema Drizzle devuelve `string \| null`, el tipo espera `string` | Filtrar con type guard `(r): r is {...}` antes de `decrementStock` |
| 2 | `Module not found: Can't resolve 'fs'` en Client Components | `TopBanner` importado vía barrel `shared/ui/index.ts` arrastra Drizzle al cliente | Importar siempre directo: `@/shared/ui/TopBanner` |
| 3 | `jsonwebtoken` incompatible con Edge Runtime | Usa APIs de Node.js no disponibles en Edge | Usar `jose` en su lugar |
| 4 | `console.log` bloqueado por ESLint | Regla `no-console` del proyecto | Usar `console.warn` / `console.error` |
| 5 | `useRouter` importado sin usar tras cambiar a `window.location.href` | Se olvidó eliminar import y declaración | Eliminar import de `next/navigation` y el `const router` |
| 6 | SSL no activaba — conexiones colgando | `ssl` condicional a `?sslmode=require` en la URL; Supabase siempre requiere SSL | `ssl: "require"` siempre, sin condición |
| 7 | Páginas cargando indefinidamente sin error | Sin `connect_timeout` en el cliente postgres | Agregar `connect_timeout: 10` |
| 8 | Error de BD crasheaba toda la tienda | `StoreLayout` sin try/catch en la query de categorías | try/catch con fallback `categories = []` |
| 9 | Username de Supabase (`postgres.projectref`) — parseo incorrecto | `postgres.js` mal maneja el punto al recibir URL directa | Parseo manual con `new URL()` — no cambiar `client.ts` |
| 10 | Fallo silencioso de conexión en `.env.local` | Variables en una sola línea → valores corruptos | Una variable por línea sin excepción |
| 11 | Login admin no redirigía | `router.push()` + `router.refresh()` se cancelan mutuamente | `window.location.href = nextPath ?? "/admin"` |
| 12 | Stock descontado antes de confirmar pago | `decrementStock()` dentro de `createOrder()` (status `pending`) | Mover a `processPaymentResult()` al confirmar `paid` |
| 13 | Doble procesamiento: retorno + webhook simultáneos descontaban stock 2 veces | Ambos endpoints marcaban `paid` y descontaban stock | Guard `AND status = 'pending'` en la transacción — idempotente |
| 14 | Clases Tailwind arbitrarias/responsivas no compilaban | Turbopack + Tailwind v4 no detecta estas clases de forma confiable | `.page-px` en globals.css, `style={{}}` para valores únicos |
| 15 | Getnet rechazaba todas las sesiones de pago silenciosamente | `tranKey` calculado con `Base64(nonce)` como string en vez de bytes crudos — fórmula de producción es `SHA256(nonceBytes \|\| seed_utf8 \|\| secretKey_utf8)` → Base64 | `Buffer.concat([nonceBytes, Buffer.from(seed,"utf8"), Buffer.from(secretKey,"utf8")])` en `auth.ts` |
| 16 | `paymentStatus=[object Object]` en URL de retorno | `GetnetPaymentEntry.status` tipado como `string` pero Getnet devuelve objeto `{status, reason, message, date}` | Actualizar tipo a objeto anidado; acceder con `.status?.status` en `payment-service.ts` |
| 17 | Orden quedaba `pending` en BD cuando el cliente cancelaba el pago en Getnet | `cancelUrl` apuntaba directo a `/checkout/confirmacion` saltándose `/api/pagos/retorno` — el servidor nunca marcaba la orden como `cancelled` | `cancelUrl = appUrl/api/pagos/retorno?reference=...` (mismo endpoint que `returnUrl`) |
| 18 | UI del admin quedaba en estado loading permanente si el fetch lanzaba | `setLoading(false)` dentro del `try` — nunca se ejecutaba al ocurrir una excepción | `finally { setLoading(false) }` en todas las funciones de fetch de Client Components |
| 19 | Pool de conexiones agotado en desarrollo — queries del layout competían con API routes | `max: 1` conexión en desarrollo causaba que layout y API route se bloquearan mutuamente | `max: 3` en desarrollo, `max: 5` en producción en `client.ts` |
| 20 | Post-guardar en formulario de producto admin no navegaba | `router.push("/admin/productos")` + `router.refresh()` se cancelaban mutuamente (mismo patrón que bug #11) | `window.location.href = "/admin/productos"` en `product-admin-form.tsx` |
| 21 | Chip "Nuevos" en FilterBar no aplicaba filtro correcto | `filter=new` en lugar de `filter=nuevo` en la URL | Corregir valor del chip en `filterChips` array |
| 22 | Notas internas de pedido no se guardaban desde el admin | Campo `adminNotes` no incluido en el payload del PATCH `/api/admin/pedidos/[id]` | Agregar `adminNotes` al schema de actualización y al handler |
| 23 | Botón "Agregar al carrito y reintentar" en confirmación fallaba | `slug` del producto ausente en el snapshot de `order_items` — se usaba `productId` como fallback incorrecto | Incluir `slug` en `CreateOrderItemInput` y en el snapshot al crear la orden |
| 24 | Badge de cantidad del carrito no se actualizaba | `useCartHydration()` no estaba siendo respetado en `Navbar` — mostraba `0` hasta refresh | Envolver badge en condicional `hydrated &&` |
| 25 | Tarjetas de productos relacionados mostraban `price` en vez de `sale_price` | `effectivePrice` no calculado en el componente de relacionados | Usar `sale_price ?? price` consistente con el resto del catálogo |
| 26 | Link "/admin" visible en el footer para usuarios públicos | Footer incluía enlace admin sin restricción de visibilidad | Eliminar enlace admin del footer público |
| 27 | Búsqueda textual sin input en la UI | La API ya aceptaba `?search=` pero no había campo en `FilterBar` ni en el Navbar móvil | Agregar input de búsqueda en `FilterBar` (desktop) y en el drawer del menú hamburguesa (móvil) |
| 28 | `/categorias` mostraba solo `<h1>Categorias</h1>` placeholder | Página no implementada | Grid real con `CategoryCard`, header visual con breadcrumb, estado vacío con CTA |
| 29 | `ProductGrid` sin columnas responsive — 3 cols en mobile | `grid-cols-3` fijo | Cambiar a `grid-cols-2 lg:grid-cols-5` |
| 30 | Paginación sin número de página visible | Solo había botones prev/next sin indicador "Página X de Y" | Agregar indicador de página actual y total en `Pagination` |
| 31 | Stepper de cantidad ignoraba stock disponible | Botón `+` sin límite superior | Stepper respeta `product.stockQuantity` como máximo |
| 32 | Badge "Últimas unidades" ausente | No implementado | Badge en `ProductCard` cuando `stock_quantity ≤ 5` |
| 33 | Carrito, checkout y detalle de producto no eran responsive en mobile | Grids con `style={{ display: "grid", gridTemplateColumns: "1fr 380px" }}` fijos | Reemplazar con clases CSS (`.cart-layout-grid`, `.product-detail-grid`) en `globals.css` con media queries |
| 34 | `CartPanel` acumulaba height en mobile — no tenía zona central fija | Zona de items sin altura máxima constante | Zona central de 182px con overflow-y scroll, mantiene botones fijos |
| 35 | Catálogo, formularios de checkout, footer y galería sin responsive | Grids y layouts de 2 columnas fijos, thumbnails sin wrap | `.form-grid-2col`, `.form-grid-street`, `flex-wrap` en galería, `grid-cols-1 md:grid-cols-[...]` en footer |
| 36 | Menú de navegación inaccesible en mobile | Solo existía el nav desktop (`lg:hidden` para hamburger) | Drawer móvil en `Navbar` con búsqueda, links, accordion de categorías, body scroll-lock |
| 37 | Tests E2E fallaban por strict mode violations, stale locators y matches en elementos ocultos | `getByText("Tu carrito está vacío")` encontraba CartPanel oculto; `getByRole("button", { name: /añadir al carrito/i })` quedaba stale al cambiar texto a "Agregado"; `getByRole("link", { name: "Colección" })` encontraba Navbar + breadcrumb | Scope a `page.locator("main")`, locator separado para "Agregado", `.first()` en links duplicados |

---

## 🚀 BACKLOG PRIORIZADO

### P0 — Bloqueante para producción
- [ ] **Resend** — emails de confirmación de compra y cambio de estado de pedido
- [ ] **Seed de productos** — ejecutar `npm run seed:products` en producción
- [ ] **Credenciales Getnet producción** — obtener post-validación con Getnet, configurar en Vercel
- [ ] **Variables de entorno en Vercel** — `DATABASE_URL`, `ADMIN_JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`

### P1 — Alta prioridad
- [x] **Página `/categorias`** — grid real con header visual implementado
- [x] **Búsqueda textual en UI** — input en FilterBar (desktop) y drawer hamburguesa (móvil), conectado a `?search=`
- [x] **Mobile responsive completo** — carrito, checkout, catálogo, detalle producto, CartPanel, footer
- [x] **Menú hamburguesa móvil** — drawer con búsqueda, links y categorías accordion
- [x] **Cron job de cancelación** — pedidos `pending` de +24h → `cancelled`, revertir cupones
- [x] **Polling en confirmación de pago** — ciclo 3s / 30s timeout hacia `GET /api/ordenes/[orderNumber]`
- [x] **Flujo completo de Getnet** — pago aprobado, rechazo, cancelación y botón "Agregar al carrito y reintentar" verificados en TEST
- [x] **Seed de productos actualizado** — 20 libros católicos reales y 9 categorías
- [x] **Checkout simplificado** — único método de pago (Getnet), dos opciones de entrega
- [x] **Auditoría de UX completa** — 6 bugs corregidos post-auditoría (filtro Nuevos, notas pedido, slug reintentar, badge carrito, salePrice relacionados, footer link admin)
- [x] **Logo real** — `Logo.tsx` reemplaza BrandMark hardcodeado en Navbar y Footer (CAT1)
- [x] **BrandLoader Lottie** — `BrandLoader.tsx` + `Loader_16.json` colores gold (CAT1)
- [x] **Splash screen 3.5s** — `LandingWithSplash.tsx` en home, `BrandLoader` en confirmación (CAT1)
- [x] **Espaciado landing** — secciones a 5rem, QuoteSection 6.25rem + overlay correcto (CAT2)
- [x] **Imagen panorámica categorías** — CSS background-position distribuida entre tarjetas, configurable desde admin (CAT3)
- [x] **Footer dinámico** — texto editable vía `footer_content` en BD, fallback hardcodeado (CAT4)
- [x] **Filtro Selección del mes** — `?filter=seleccion` en catálogo vía subquery `featured_products` (CAT5)
- [x] **Página /nosotros** — CMS completo: secciones alternadas, admin CRUD, imágenes (CAT5)
- [x] **Navbar Conócenos** — link en desktop y drawer móvil; links actualizados a `?filter=seleccion` y `?filter=nuevo` (CAT5)
- [ ] **API Chilexpress** — cotización de despacho en tiempo real y búsqueda de sucursales (pendiente de credenciales del cliente)
- [ ] **VESSI** — pendiente de respuesta de la API. Integración en `src/integrations/inventory/`

### P2 — Lanzamiento / Fase 5
- [ ] SEO: `generateMetadata` en producto y categoría, Open Graph, sitemap.xml
- [ ] Optimización de imágenes: `priority` en LCP (HeroSlider), lazy en galería
- [x] **Playwright** — E2E instalado: 32 tests passing en Chromium + Pixel 5 (home, catálogo, producto, carrito, admin)
- [ ] **`checkout.spec.ts` pendiente** — 6 tests del flujo completo de compra escritos pero sin corregir; requieren Getnet TEST activo y datos en BD
- [ ] UI de admin para cupones (actualmente solo vía BD directa)
- [ ] UI de admin para usuarios admin adicionales (actualmente solo `seed:admin`)
- [ ] Páginas legales: política de privacidad, términos y condiciones

---

## 🗄 BASE DE DATOS — 15 TABLAS

| Tabla | Descripción |
|---|---|
| `categories` | Categorías con jerarquía (parent_id), slug, featured, display_order |
| `products` | Catálogo con price/sale_price (integer CLP), stock, is_featured, is_active |
| `product_categories` | Relación muchos-a-muchos productos ↔ categorías |
| `product_images` | Galería de imágenes por producto (display_order) |
| `orders` | Órdenes con status (pending→paid→preparing→shipped→delivered→cancelled) |
| `order_items` | Items con snapshot de título, precio y SKU al momento de compra |
| `order_customers` | Datos del comprador invitado (nombre, email, teléfono) |
| `order_addresses` | Dirección de despacho (solo si delivery_method = "shipping") |
| `coupons` | Cupones de descuento (percentage o fixed), vigencia, usos |
| `hero_slides` | Slides del hero rotativo del landing |
| `banners` | Banners por position (`hero_intermedio`, `footer_illustration`, `categories_panorama`, etc.) |
| `featured_products` | Selección editorial única (`monthly_selection` → home + filtro `?filter=seleccion`) |
| `admin_users` | Usuarios del panel admin con password_hash |
| `footer_content` | Texto editable del footer: descripción, links catálogo, links info, dirección, copyright (**nueva — Abril 2026**) |
| `about_sections` | Secciones de /nosotros: título, contenido, imageUrl, imagePosition, displayOrder, isActive (**nueva — Abril 2026**) |

**Migraciones:** 5 en `src/integrations/drizzle/migrations/` — las dos últimas (`0003`, `0004`) aplicadas manualmente en Supabase SQL Editor (ver R13)

---

## 🔑 VARIABLES DE ENTORNO

```bash
# Base de datos — Session Pooler (puerto 5432, NO Transaction Pooler en 6543)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Auth admin (mínimo 32 caracteres)
ADMIN_JWT_SECRET=...

# Getnet (dejar vacío en dev para usar credenciales TEST hardcodeadas)
GETNET_LOGIN=
GETNET_SECRET_KEY=
GETNET_ENDPOINT=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Instagram
NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID=1e93ffdc-0e7e-4160-b103-98c5a444c896

# Cron job (Vercel — requerido para proteger el endpoint)
CRON_SECRET=
```

> **Crítico:** Usar Session Pooler (puerto 5432), NO Transaction Pooler (puerto 6543). El Transaction Pooler causó fallos de conexión previos.

---

## 📖 LECCIONES APRENDIDAS — RESUMEN DE REGLAS

| Síntoma que verás | Regla que aplica |
|---|---|
| `Can't resolve 'fs'` en Client Component | `TopBanner` importado vía barrel → usar import directo |
| Conexión a BD cuelga sin error | Falta `ssl: "require"` o `connect_timeout: 10` |
| Login admin no redirige | Usar `window.location.href`, no `router.push` + `router.refresh` |
| Error de tipos en items de orden | Type guard antes de `decrementStock` |
| ESLint falla con `console.log` | Solo `console.warn` / `console.error` |
| Clases Tailwind no aplican | Usar `.page-px` y `globals.css` — no clases arbitrarias con Turbopack |
| `.env.local` no carga variables | Una variable por línea — sin excepciones |
| Stock descontado doble | Guard `status = 'pending'` en transacción de pago |
| Test Playwright falla con "strict mode violation" | Scoped a `page.locator("main")` o usar `.first()` explícito |
| Test Playwright falla con "element not found" post-click | Usar locator separado después del click (no reusar el mismo si el DOM cambia) |
| `drizzle-kit push` o `migrate` cuelga con Supabase | Session Pooler incompatible con drizzle-kit CLI — usar `db:generate` + SQL manual en Supabase SQL Editor (R13) |
| Spinner genérico en vez del loader del sistema de diseño | Usar `BrandLoader` de `@/shared/ui/BrandLoader` — animación Lottie con colores gold del proyecto (R14) |

---

## 🟢 ESTADO ACTUAL DEL PROYECTO

**Fases 1–4C completas + auditoría completa + mobile responsive + CAT1–CAT5 identidad y contenido.** El e-commerce es funcional end-to-end, totalmente responsive, con identidad visual propia (logo real, BrandLoader Lottie, splash screen) y contenido completamente editable desde el admin:

**Flujo de compra verificado:**
- Cliente navega home (con splash screen 3.5s) → catálogo (filtros, búsqueda, paginación, selección del mes) → detalle de producto → carrito → checkout → Getnet Web Checkout
- Pago aprobado: orden pasa a `paid` → stock descontado → confirmación con BrandLoader + status paid
- Pago cancelado: orden pasa a `cancelled` → confirmación con botón "Agregar al carrito y reintentar"
- Webhook de Getnet con guard idempotente contra doble procesamiento
- Cron job cancela órdenes `pending` de más de 24h, hora a hora

**Contenido editable desde el admin:**
- Hero slides, banners intermedios, selección curada del mes
- Imagen panorámica de la sección categorías del landing
- Texto completo del footer (descripción, links, dirección, copyright)
- Página /nosotros con secciones alternadas (título, contenido, imagen, posición)

**Identidad visual:**
- Logo real (`Logo.tsx`) en Navbar y Footer
- BrandLoader Lottie con colores gold del sistema de diseño
- Splash screen 3.5s en el home; BrandLoader en confirmación de pago

**Tests E2E:** 32 passing en Chromium y Pixel 5 (mobile). `checkout.spec.ts` escrito pero pendiente de corregir.

**Pendiente para producción:** Resend (emails), credenciales Getnet de producción, variables en Vercel, ejecutar seed en producción.

*Handoff v01 — Abril 2026 · Sesión CAT1–CAT5*
