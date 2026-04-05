# Crecer Librería Cristiana — Handoff v01
**Última actualización:** Abril 2026 — Sesión: Migración al sistema de documentación versionada  
**Stack:** Next.js 15.2.4 · Drizzle ORM · Supabase PostgreSQL · Zustand 5 · Tailwind v4 · Getnet  
**Estado del build:** ✅ `npx tsc --noEmit` limpio · ✅ `npm run lint` limpio  
**Líneas de código:** ~16.250 · 64 `.tsx` · 118 `.ts`

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
Emails:     Resend (pendiente — integrations/email/index.ts es placeholder vacío)
Inventario: VESSI (pendiente — integrations/inventory/index.ts es placeholder vacío)
Instagram:  Elfsight widget externo
Estilos:    Tailwind CSS v4 (sin tailwind.config.ts — tokens en globals.css)
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
│   │   ├── page.tsx          # Home ✅
│   │   ├── productos/        # /productos (listado) y /productos/[slug] (detalle) ✅
│   │   ├── categorias/       # /categorias ⚠️ PLACEHOLDER — solo <h1>
│   │   └── carrito/          # /carrito ✅
│   ├── (checkout)/           # Layout propio sin Navbar/Footer de la tienda
│   │   └── checkout/
│   │       ├── page.tsx      # Formulario de compra ✅
│   │       └── confirmacion/ # Página post-pago ✅ (sin polling activo aún)
│   ├── admin/
│   │   ├── login/            # Pública — no protegida por middleware ✅
│   │   └── (panel)/          # Protegido — AdminLayout con sidebar ✅
│   │       ├── page.tsx      # Dashboard con stats reales ✅
│   │       ├── productos/    # CRUD completo ✅
│   │       ├── categorias/   # CRUD completo ✅
│   │       ├── pedidos/      # Listado + detalle + cambio de estado ✅
│   │       └── landing/      # hero/, banners/, seleccion/, footer/ ✅
│   └── api/
│       ├── productos/        # GET público ✅
│       ├── categorias/       # GET público ✅
│       ├── landing/          # GET público hero, banners, selección ✅
│       ├── ordenes/          # POST crear orden, GET por número ✅
│       ├── cupones/          # POST validar cupón ✅
│       ├── stock/            # POST validar stock ✅
│       ├── pagos/            # crear-sesion, retorno, notificacion ✅
│       └── admin/            # Todas las rutas protegidas del admin ✅
│
├── features/
│   ├── catalogo/             # Servicios, componentes, tipos del catálogo ✅
│   ├── carrito/              # Zustand store + hooks + tipos ✅
│   ├── checkout/             # Servicios de orden, cupón, stock, pago ✅
│   ├── admin/                # Auth, CRUD, schemas, componentes admin ✅
│   └── pedidos/              # ⚠️ Solo index.ts vacío — lógica en checkout/ y admin/
│
├── shared/
│   ├── ui/                   # Button, Input, Badge, Navbar, Footer, CartPanel, Toast...
│   ├── hooks/                # useScrollReveal, useToast
│   ├── utils/                # formatters.ts (formatCLP, formatDate)
│   └── config/               # ⚠️ index.ts vacío
│
└── integrations/
    ├── drizzle/              # Cliente + schema (13 tablas) + 3 migraciones ✅
    ├── supabase/             # Storage client + helpers ✅
    ├── payments/getnet/      # Auth, client, config, types ✅
    ├── email/                # ⚠️ Placeholder vacío — Resend pendiente
    └── inventory/            # ⚠️ Placeholder vacío — VESSI pendiente
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

**Cómo funciona:**
Las páginas son Server Components que llaman directamente a los servicios de Drizzle (no vía fetch a la API pública). La API pública existe para uso externo. El listado usa `searchParams` de Next.js para filtro por categoría, ordenamiento y paginación — todo URL-based. La búsqueda textual está implementada en el backend (`ilike` en title y author) pero **no tiene input en la UI todavía**.

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
**Estado:** ✅ Completa (en ambiente TEST)  
**Archivos clave:**
- `src/features/checkout/services/order-service.ts` — transacción atómica
- `src/features/checkout/services/payment-service.ts` — flujo Getnet
- `src/integrations/payments/getnet/` — auth, client, config, types
- `src/app/(checkout)/checkout/page.tsx`
- `src/app/(checkout)/checkout/confirmacion/page.tsx`

**Cómo funciona:**
1. Usuario completa el formulario → `POST /api/ordenes` crea la orden en `pending` (transacción atómica: valida stock, snapshot de precios, descuenta stock solo al confirmar `paid`)
2. Si paga con tarjeta → `POST /api/pagos/crear-sesion` → redirige a Getnet
3. Getnet redirige a `GET /api/pagos/retorno` → actualiza estado → redirige a `/checkout/confirmacion`
4. Getnet también envía `POST /api/pagos/notificacion` (webhook async) — tiene guard idempotente

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
JWT en cookie HTTP-only `admin-session` (24h, firmado con `jose`). Middleware Edge Runtime verifica el token en cada request. El admin puede gestionar: productos (CRUD + imágenes), categorías, pedidos (cambio de estado), hero slides, banners intermedios y selección curada del landing.

---

### Feature 5: Landing editable
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/features/catalogo/components/HeroSlider.tsx`
- `src/features/catalogo/components/LibrosMesSection.tsx`
- `src/features/catalogo/components/CategoryCarousel.tsx`
- `src/features/catalogo/components/RecentProductsCarousel.tsx`
- `src/features/catalogo/components/QuoteSection.tsx` — Hero intermedio
- `src/features/catalogo/components/InstagramSection.tsx`
- `src/shared/ui/TopBanner.tsx` + `TopBannerClient.tsx`

**Secciones y su fuente de datos:**
- Hero slides → tabla `hero_slides` (admin)
- Selección del mes → tabla `featured_products` (admin)
- Categorías → tabla `categories` con `featured=true` (admin)
- Recién llegados → 10 productos más recientes (automático)
- Hero intermedio → tabla `banners` con `position="hero_intermedio"` (admin)
- Instagram → Elfsight widget (`NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`)

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

---

## 🚀 BACKLOG PRIORIZADO

### P0 — Bloqueante para producción
- [ ] **Resend** — emails de confirmación de compra y cambio de estado de pedido
- [ ] **Seed de productos** — ejecutar `npm run seed:products` en producción
- [ ] **Credenciales Getnet producción** — obtener post-validación con Getnet, configurar en Vercel
- [ ] **Variables de entorno en Vercel** — `DATABASE_URL`, `ADMIN_JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`

### P1 — Alta prioridad
- [ ] **Página `/categorias`** — actualmente `<h1>Categorias</h1>`, implementar listado real
- [ ] **Búsqueda textual en UI** — agregar input en `/productos`, conectar al query param `?search=`. La API ya está lista.
- [x] **Cron job de cancelación** — pedidos `pending` de +24h → `cancelled`, revertir cupones. Requiere `vercel.json` + API Route protegida
- [x] **Polling en confirmación de pago** — ciclo 3s / 30s timeout hacia `GET /api/ordenes/[orderNumber]`
- [ ] **VESSI** — pendiente de respuesta de la API. Integración en `src/integrations/inventory/`

### P2 — Lanzamiento / Fase 5
- [ ] SEO: `generateMetadata` en producto y categoría, Open Graph, sitemap.xml
- [ ] Optimización de imágenes: `priority` en LCP (HeroSlider), lazy en galería
- [ ] Testing end-to-end del flujo de compra con tarjeta TEST Getnet
- [ ] UI de admin para cupones (actualmente solo vía BD directa)
- [ ] UI de admin para usuarios admin adicionales (actualmente solo `seed:admin`)
- [ ] Páginas legales: política de privacidad, términos y condiciones

---

## 🗄 BASE DE DATOS — 13 TABLAS

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
| `banners` | Banners por position (ej: `hero_intermedio`) |
| `featured_products` | Selección curada por sección (ej: `monthly_selection`) |
| `admin_users` | Usuarios del panel admin con password_hash |

**Migraciones:** 3 aplicadas (`0000`, `0001`, `0002`) en `src/integrations/drizzle/migrations/`

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

---

*Handoff v01 — Abril 2026 — Estado post Fases 1–4B completas. Próximo: Resend, búsqueda UI, `/categorias`, cron job.*
