# Crecer Librería Cristiana — Guía para Claude Code

## Qué es este proyecto

E-commerce completo para una librería católica ubicada en Antofagasta, Chile. Los clientes compran como invitado (sin registro), pagan con Getnet/Webpay, y el inventario se sincroniza con VESSI (integración pendiente). El admin gestiona el catálogo, pedidos y contenido del landing desde un panel integrado bajo `/admin`.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 App Router + TypeScript strict |
| Base de datos | Supabase PostgreSQL (conexión directa) |
| ORM | Drizzle ORM — **todas** las queries van por aquí |
| Storage | Supabase Storage — solo imágenes |
| Estado carrito | Zustand 5 con persist a localStorage |
| Formularios | React Hook Form + Zod 4 |
| Pagos | Getnet Web Checkout (actualmente en TEST) |
| Emails | Resend (pendiente de integrar) |
| Inventario | VESSI (pendiente — esperando respuesta de API) |
| Instagram feed | Elfsight widget (`NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`) |
| Estilos | Tailwind CSS v4 |
| Deploy | Vercel |

---

## Arquitectura — 3 capas

```
Presentación (app/ pages + features/ components)
        ↓
API Routes (app/api/ — toda la lógica de negocio)
        ↓
Datos / Servicios externos (integrations/)
```

El frontend **nunca** toca la base de datos ni servicios externos directamente. Todo pasa por API Routes.

---

## Estructura de carpetas

```
src/
├── app/
│   ├── (store)/              # Tienda pública — usa StoreLayout con Navbar + Footer
│   │   ├── page.tsx          # Home
│   │   ├── productos/        # /productos (listado) y /productos/[slug] (detalle)
│   │   ├── categorias/       # /categorias
│   │   └── carrito/          # /carrito
│   ├── (checkout)/           # Checkout en layout propio (sin Navbar/Footer de la tienda)
│   │   └── checkout/
│   │       ├── page.tsx
│   │       └── confirmacion/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx    # Pública — no protegida por middleware
│   │   └── (panel)/          # Protegido — usa AdminLayout con sidebar
│   │       ├── page.tsx      # Dashboard con stats
│   │       ├── productos/
│   │       │   ├── page.tsx             # Listado
│   │       │   ├── nuevo/page.tsx       # Crear producto
│   │       │   └── [id]/editar/page.tsx # Editar producto
│   │       ├── categorias/
│   │       │   ├── page.tsx             # Listado
│   │       │   ├── nuevo/page.tsx       # Crear categoría
│   │       │   └── [id]/editar/page.tsx # Editar categoría
│   │       ├── pedidos/
│   │       │   ├── page.tsx             # Listado con filtros + checkbox includePending
│   │       │   └── [id]/page.tsx        # Detalle de pedido
│   │       └── landing/      # hero/, banners/, seleccion/, footer/
│   └── api/
│       ├── productos/        # GET público del catálogo
│       ├── categorias/       # GET público de categorías
│       ├── landing/          # GET público hero, banners, selección
│       ├── ordenes/          # POST crear orden, GET por número de orden
│       ├── cupones/          # POST validar cupón
│       ├── stock/            # POST validar stock
│       ├── pagos/            # Getnet: crear-sesion, retorno, notificacion
│       ├── cron/
│       │   └── limpiar-pendientes/  # Cron job — cancela órdenes pending >24h
│       └── admin/            # Todas las rutas protegidas del admin
│
├── features/
│   ├── catalogo/
│   │   ├── services/         # product-service.ts, category-service.ts, landing-service.ts
│   │   ├── components/       # ProductCard, ProductGrid, FilterBar, HeroSlider, etc.
│   │   ├── types.ts          # CatalogProduct, CatalogCategory, ProductListResult, etc.
│   │   └── http.ts           # Funciones fetch del lado cliente
│   ├── carrito/
│   │   ├── store.ts          # useCartStore (Zustand)
│   │   ├── types.ts          # CartItem, CartItemInput, CartSummary
│   │   └── hooks.ts          # useCart, useCartSummary, useCartItem
│   ├── checkout/
│   │   ├── services/         # order-service.ts, coupon-service.ts, payment-service.ts, stock-service.ts
│   │   ├── schemas.ts        # CreateOrderSchema, ValidateCouponSchema
│   │   └── components/       # CheckoutForm
│   └── admin/
│       ├── services/         # auth-service.ts, product-admin-service.ts, category-admin-service.ts, order-admin-service.ts, landing-admin-service.ts
│       ├── schemas/          # product-schemas.ts, category-schemas.ts, landing-schemas.ts
│       ├── constants.ts      # ADMIN_SESSION_COOKIE, ADMIN_TOKEN_MAX_AGE_SECONDS
│       └── components/       # AdminSidebar, AdminTable, AdminTopbar, AdminStatusPill, AdminMetricCard, AdminToggle, AdminUploadZone, product-admin-form.tsx
│
├── scripts/
│   ├── seed-admin.ts         # Crea el primer usuario admin
│   └── seed-products.ts      # Seed de 20 libros, 9 categorías, selección del mes, hero slide
│
├── shared/
│   ├── ui/                   # Navbar, Footer, CartPanel, Button, Input, Badge, Toast, SectionHeader, Separator
│   │   └── TopBanner.tsx     # Server Component — importar directamente (no desde barrel)
│   ├── hooks/                # useScrollReveal, useScrollRevealMultiple, useToast, useCartHydration
│   ├── config/
│   │   └── brand.ts          # Constante BRAND: name, tagline, logoSrc, address, email, instagram
│   └── utils/
│       └── formatters.ts     # formatCLP() → "$12.500" | formatDate() → "14/03/2026 15:30" (es-CL corto)
│
└── integrations/
    ├── drizzle/
    │   ├── client.ts         # db — instancia de Drizzle (singleton con global)
    │   └── schema/           # categories.ts, products.ts, orders.ts, coupons.ts, landing.ts, admin.ts
    ├── supabase/
    │   ├── client.ts         # Solo para Storage
    │   └── storage.ts        # uploadProductImage, uploadBannerImage, uploadCategoryImage, etc.
    └── payments/getnet/      # auth.ts, client.ts, config.ts, types.ts
```

---

## Base de datos — 13 tablas

Todas las queries van por Drizzle ORM. Nunca usar el cliente de Supabase para queries.

### Tablas principales

**products** — `id` (uuid), `title`, `slug` (unique), `code`, `sku` (unique), `author`, `description`, `price` (integer CLP), `sale_price` (integer|null), `cover_type`, `pages`, `in_stock`, `stock_quantity`, `main_image_url`, `is_featured`, `is_active`, timestamps

**categories** — `id`, `name`, `slug` (unique), `description`, `image_url`, `header_image_url`, `parent_id` (self-ref), `featured`, `display_order`, `is_active`, timestamps

**product_categories** — PK compuesto (`product_id`, `category_id`)

**product_images** — `id`, `product_id` (uuid NOT NULL → FK a products.id, CASCADE on delete), `url`, `alt_text`, `display_order`, `created_at`

**orders** — `id`, `order_number` (unique, ej: "ORD-0001"), `status`, `subtotal`, `shipping_cost`, `total`, `delivery_method` ("pickup"|"shipping"), `payment_method`, `payment_reference`, `coupon_id`, `discount_amount`, `admin_notes`, timestamps

**order_items** — snapshot inmutable: `product_title`, `unit_price`, `sku`, `quantity`, `subtotal`, `product_id` (nullable FK → set null si producto es eliminado, preserva historial)

**order_customers** — `first_name`, `last_name`, `email`, `phone` (1:1 con order)

**order_addresses** — dirección completa (solo si delivery_method = "shipping", 1:1 con order)

**coupons** — `code`, `discount_type` ("percentage"|"fixed"), `discount_value`, `min_purchase_amount`, `starts_at`, `expires_at`, `max_uses`, `current_uses`, `is_active`

**hero_slides** — `title`, `subtitle`, `image_url`, `link_url`, `display_order`, `is_active`

**banners** — `title`, `description`, `image_url`, `link_url`, `position`, `metadata` (jsonb con `FooterBannerMetadata`), `is_active`

Valores de `position` en uso:
- `"top_banner"` — banner superior de la tienda (`TopBanner.tsx`)
- `"hero_intermedio"` — sección QuoteSection del landing
- `"catalogo_header"` — header visual de `/productos`
- `"footer_illustration"` — banner/ilustración del footer del landing
- `"between_sections_1"`, `"between_sections_2"`, `"between_sections_3"` — banners entre secciones

`FooterBannerMetadata` (jsonb):
```typescript
{
  opacity?: number;       // opacidad de la imagen
  fadeStart?: number;     // inicio del gradiente de fade (px)
  fadeEnd?: number;       // fin del gradiente de fade (px)
  imgWidth?: number;      // ancho de la imagen en px
  artSpaceWidth?: number; // espacio reservado para el arte en px
}
```

**featured_products** — `product_id` (FK), `section` (string libre), `description` editorial, `display_order`, `is_active`

**admin_users** — `email`, `password_hash` (bcrypt, 12 rounds), `name`, `is_active`

### Importar el cliente de Drizzle

```typescript
import { db } from "@/integrations/drizzle";
import { products, categories, orders } from "@/integrations/drizzle/schema";
```

### Configuración del cliente postgres.js (`client.ts`)

- `ssl: "require"` — siempre forzado (Supabase Session Pooler lo requiere sin excepción)
- `connect_timeout: 10` — falla rápido en lugar de colgar indefinidamente
- `max: 5` en producción, `max: 3` en desarrollo (evita pool exhaustion con queries concurrentes del layout + API routes)
- URL parseada manualmente con `new URL()` — postgres.js no maneja el punto en el username `postgres.projectref` correctamente si se le pasa la connection string directa. **No cambiar este parsing.**

---

## Reglas de negocio críticas

### Precios
- **Siempre enteros en CLP**. Sin decimales ni floats para dinero.
- `formatCLP(amount)` → `"$12.500"` — usar para toda visualización
- `effectivePrice` = `sale_price` si existe, sino `price`

### Carrito (Zustand)
- `addItem(item: CartItemInput)` — siempre agrega 1 unidad. Si el producto ya existe, incrementa en 1. No acepta quantity como parámetro.
- Para agregar más de 1 unidad usar `updateQuantity(productId, quantity)` después
- Persistido en localStorage como `"crecer-cart"`
- `CartItemInput` es `CartItem` sin el campo `quantity`
- `useCartHydration()` — hook en `shared/hooks/` que espera la hidratación del store de Zustand desde localStorage antes de renderizar el carrito (evita hydration mismatch)

### Checkout — `CreateOrderSchema`
```typescript
{
  items: [{ productId: uuid, quantity: number }],
  customer: { firstName, lastName, email, phone },
  deliveryMethod: "pickup" | "shipping",
  address?: { street, number, apartment?, commune, city, region, zipCode?, deliveryInstructions? },
  couponCode?: string
}
```
`paymentMethod` **no** va en este schema — es estado del frontend solamente.

### Transiciones de estado de pedidos
```
pending → paid | cancelled
paid → preparing | cancelled
preparing → shipped (si delivery) | delivered (si pickup)
shipped → delivered
```

### Órdenes — creación y descuento de stock

**`createOrder()`** — transacción Drizzle que incluye: validar stock (sin descontar), crear orden + items + customer + address (si aplica), incrementar usos del cupón. **NO descuenta stock.** Si cualquier paso falla, todo se revierte.

**Descuento de stock** ocurre únicamente en `processPaymentResult()` en `payment-service.ts`, dentro de una transacción con guard `AND status = 'pending'` para idempotencia:
```typescript
.where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
```
Esto evita doble descuento si el webhook de Getnet y el retorno del usuario llegan simultáneamente.

**Generación de `order_number`:** Lógica de retry (MAX_ATTEMPTS=3) — genera número secuencial, reintenta si hay colisión de unique constraint. Formato: `"ORD-0001"`.

**FKs nullable en órdenes:**
- `order_items.productId` — nullable FK (set null si el producto es eliminado, preserva historial)

### Getnet (Pagos)
- Ambiente actual: **TEST** (`https://checkout.test.getnet.cl`)
- Credenciales de prueba están hardcodeadas como fallback en `config.ts`
- El `tranKey` se genera fresco en cada request: `Base64(SHA-256(nonce + seed + secretKey))`
- Tarjeta aprobación test: Visa 4111 1111 1111 1111, CVV 123
- Variables de producción se configuran en Vercel cuando Getnet valide

---

## Sistema de diseño

### Tokens (Tailwind v4 — en `globals.css` vía `@theme`)
**No existe `tailwind.config.ts`**. Los tokens están en `@theme inline` dentro de `src/app/globals.css`.

| Token | Valor |
|---|---|
| `--color-gold` | `#c8a830` — color principal de acento |
| `--color-background` / `--color-beige` | `#f5f3e8` |
| `--color-foreground` / `--color-text` | `#3a3001` |
| `--color-moss` | `#736002` |
| `--color-white` | `#faf9f4` |
| `--radius` | `2px` — border-radius en todo el sitio |
| `--radius-hero` | `16px` — única excepción |
| `--font-serif` | EB Garamond — headings |
| `--font-sans` | DM Sans — body |

### Problema conocido: Tailwind JIT no compila de forma confiable

**⚠️ CRÍTICO:** En este proyecto (Next.js 15 + Turbopack + Tailwind v4), las siguientes clases Tailwind **no se compilan de forma confiable**:
- Valores arbitrarios: `px-[14px]`, `rounded-[16px]`
- Utilities responsivas: `md:py-20`, `lg:px-14`
- Clases generadas desde tokens custom: `text-eyebrow`

**Solución establecida — CSS-first approach:**
- Para padding **horizontal** → usar clase `.page-px` (definida en `globals.css`)
- Para padding **vertical** → usar inline `style={{ paddingTop: "...", paddingBottom: "..." }}`
- Para tamaños de texto custom → definir clase en `globals.css @layer components` y aplicarla como className

Nunca confiar en que una clase Tailwind de layout crítico compile. Verificar siempre visualmente.

### Sistema de padding — `.page-px`
```css
.page-px { padding-inline: clamp(1.25rem, 5vw, 3.5rem); }
```
**Nunca usar `px-5 md:px-10 lg:px-14`** — reemplazado por `.page-px`.
Aplicado en: Navbar inner div, todas las secciones del landing, PageHeader del catálogo.

### Padding vertical en secciones
Las secciones usan inline styles para el padding vertical (Tailwind `py-*` no compila):
```tsx
style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
```

### Sistema de eyebrows — `.section-eyebrow`
```css
/* globals.css @layer components */
.section-eyebrow { font-size: 12px; }
```
**Todos los eyebrows del landing usan esta clase.** No usar `text-eyebrow` (token Tailwind, no compila). El token `--text-eyebrow` en `@theme` existe pero no genera la clase de forma confiable.

Componentes que usan `.section-eyebrow`:
- `SectionHeader.tsx` — eyebrow genérico (CategoryCarousel, RecentProductsCarousel)
- `LibrosMesSection.tsx` — junto a `.libros-mes-eyebrow`
- `InstagramSection.tsx`

### Hero — `.hero-wrapper`
```css
.hero-wrapper { background: var(--white); padding: 14px; }
.hero-wrapper > div:first-child { border-radius: var(--radius-hero); overflow: hidden; }
```
Genera el efecto "flotante" del hero con `border-radius: 16px`.

### Componentes compartidos (`src/shared/ui/`)
`Button`, `Input` (incluye Textarea), `Badge`, `Navbar`, `Footer`, `CartPanel`, `Toast`, `SectionHeader`, `Separator`

`useToast` — API correcta:
```typescript
const { toast } = useToast();
toast({ message: "Guardado correctamente", variant: "success" });
toast({ message: "Error al guardar", variant: "error" });
```

> **Importante:** `TopBanner` NO está en el barrel `index.ts`. Importar directamente:
> ```typescript
> import { TopBanner } from "@/shared/ui/TopBanner";
> ```
> Razón: `TopBanner` importa Drizzle (server-only). Si estuviera en el barrel, cualquier Client Component que importe de `@/shared/ui` arrastraría `fs`/postgres al bundle del cliente → build error.

### Componentes del admin (`src/features/admin/components/`)
`AdminSidebar`, `AdminTopbar`, `AdminTable`, `AdminStatusPill`, `AdminMetricCard`, `AdminToggle`, `AdminUploadZone`, `product-admin-form.tsx` (Client Component reutilizado para crear y editar productos)

### Filtro de pedidos — `includePending`
Por defecto, la lista de pedidos en `/admin/pedidos` solo muestra `paid`, `preparing`, `shipped`, `delivered`. Los pedidos `pending` y `cancelled` se ocultan para no saturar el listado.

El checkbox "Mostrar pedidos pendientes" activa `includePending=true` en la query, que pasa el parámetro al servicio `getOrdersAdmin({ includePending: true })`. Implementado en `order-admin-service.ts` con `inArray(orders.status, [...])` condicional.

---

## Autenticación Admin

- JWT en cookie HTTP-only `"admin-session"`, firmado con `ADMIN_JWT_SECRET`, 24h de duración
- Middleware en `src/middleware.ts` protege `/admin/*` y `/api/admin/*`
- Excepción: `/admin/login` y `/api/admin/auth/login` son públicos
- Usa `jose` (no `jsonwebtoken`) por compatibilidad con Edge Runtime
- Login contra tabla `admin_users` con bcrypt (12 rounds)
- Constantes: `ADMIN_SESSION_COOKIE = "admin-session"`, `ADMIN_TOKEN_MAX_AGE_SECONDS = 86400` (24h)

### Redirección post-login

**Nunca usar `router.push() + router.refresh()` después de autenticación.** En Next.js App Router, ambas llamadas compiten: `router.refresh()` reintenta renderizar la página actual mientras `router.push()` intenta navegar, y se cancelan mutuamente.

**Regla:** Siempre usar `window.location.href` para redirección post-auth:
```typescript
window.location.href = nextPath ?? "/admin";
```
Esto garantiza un request HTTP completo con todas las cookies ya seteadas.

---

## Variables de entorno requeridas

```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ADMIN_JWT_SECRET=                    # mínimo 32 caracteres
GETNET_LOGIN=                        # dejar vacío para usar credenciales TEST
GETNET_SECRET_KEY=                   # dejar vacío para usar credenciales TEST
GETNET_ENDPOINT=                     # dejar vacío para usar TEST
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID=   # UUID del widget de Elfsight para Instagram
CRON_SECRET=                         # secreto para autenticar llamadas al cron job de Vercel
```

> **Importante:** El `DATABASE_URL` usa Session Pooler de Supabase con un punto en el username (`postgres.projectref`). El cliente de Drizzle en `client.ts` parsea la URL manualmente para evitar que `postgres.js` lo maneje incorrectamente. No cambiar ese parsing.

> **Importante:** Las variables en `.env.local` deben ir una por línea. Ponerlas en una sola línea causa fallo de conexión silencioso.

---

## Supabase Storage

Buckets configurados (nombres exactos en Supabase):
- `products` — imágenes de productos (portadas + galería)
- `banners` — hero slides + banners intermedios y promocionales
- `categories` — imágenes de categorías (cover + header)

Usar siempre las constantes `STORAGE_BUCKETS.*` de `@/integrations/supabase/types` — nunca strings hardcodeados.

Funciones en `src/integrations/supabase/storage.ts`:
`uploadProductImage()`, `uploadCategoryImage()`, `uploadBannerImage()`, `deleteImage()`

---

## Cron Jobs

### `vercel.json`
```json
{
  "crons": [{ "path": "/api/cron/limpiar-pendientes", "schedule": "0 * * * *" }]
}
```
Se ejecuta cada hora. Requiere Vercel Pro para frecuencias sub-diarias.

### `/api/cron/limpiar-pendientes`
- Autenticación: header `Authorization: Bearer ${CRON_SECRET}`
- Encuentra órdenes `status = 'pending'` con `createdAt < NOW() - 24h`
- En transacción: marca cada una como `status: 'cancelled'`, revierte `currentUses` de cupones con `greatest(currentUses - 1, 0)`
- Retorna `{ ok: true, cancelled: N, orderNumbers: [...] }`

---

## Patrones de código

### ServiceResult — manejo de errores en servicios
Todos los servicios del admin usan este patrón:
```typescript
type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; code: string; message: string; details?: unknown };
```

### API HTTP helpers (`src/app/api/`)
Helpers estándar en API Routes:
```typescript
ok(data)           // 200 { data }
badRequest(msg)    // 400 { error, message }
notFound(msg)      // 404 { error, message }
serverError(msg)   // 500 { error, message }
```

### Admin Client Components — fetch con try/catch/finally
**Siempre** usar try/catch/finally en funciones de fetch de Client Components del admin. Sin esto, `setLoading(false)` nunca se llama si el fetch lanza, dejando la UI permanentemente en estado de carga:
```typescript
async function fetchXxx() {
  setLoading(true);
  try {
    const response = await fetch(URL, { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as Payload | null;
    if (!response.ok) {
      setError(payload?.message ?? "Error.");
      return;
    }
    setData(payload?.data ?? []);
  } catch {
    setError("Error de red. Intenta nuevamente.");
  } finally {
    setLoading(false); // siempre ejecutado
  }
}
```

### Admin layout — defensive DB calls
El layout de admin (`src/app/admin/(panel)/layout.tsx`) usa `.catch(() => null)` en las llamadas a BD:
```typescript
const payload = await verifyToken(token).catch(() => null);
const admin = await getAdminById(id).catch(() => null);
```
Si la BD falla durante navegación → redirige a login en lugar de colgar toda la navegación.

### Slugs — generación
Los slugs se generan con NFD normalization + eliminación de acentos + lowercase + replace de espacios. Bucle de unicidad: si el slug ya existe, agrega sufijo numérico (`-2`, `-3`, etc.).

---

## Comandos útiles

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run lint         # ESLint
npx tsc --noEmit     # Verificar tipos sin compilar
npm run db:generate  # Generar migración Drizzle
npm run db:migrate   # Aplicar migraciones
npm run seed:admin   # Crear primer usuario admin
npm run seed:products # Seed de 20 libros, 9 categorías, selección del mes y hero slide
```

---

## Path aliases (tsconfig)

```typescript
@/app/*           → src/app/*
@/features/*      → src/features/*
@/shared/*        → src/shared/*
@/integrations/*  → src/integrations/*
@/lib/*           → src/lib/*
```

---

## Estado actual del proyecto

- **Fases 1–4C completas** — backend, APIs, admin panel, landing y todas las páginas interiores implementados ✅
- `npx tsc --noEmit` y `npm run lint` pasan sin errores
- **Flujo de pago Getnet funcionando end-to-end en TEST** — pago aprobado, rechazo, cancelación, polling en confirmación y botón "reintentar" implementados y verificados ✅
- **Checkout simplificado** — único método de pago (Getnet), dos opciones de entrega: Retiro en tienda (gratis) y Despacho Chilexpress (por pagar al recibir, `shippingCost: 0` en BD) ✅
- **Pendiente:** ejecutar `npm run seed:products` en producción, VESSI, Resend, Fase 5
- **Getnet en TEST** — credenciales de producción se configuran post-validación con Getnet
- **Instagram** — Elfsight activo, `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID=1e93ffdc-0e7e-4160-b103-98c5a444c896`

### Fase 4B — todo completado

**✅ 4B.1 — LibrosMesSection**
- Título: "Selección del mes", flechas flanquean portadas
- Padding horizontal: `.page-px`, padding vertical: inline `style`
- Eyebrow: `.section-eyebrow` + `.libros-mes-eyebrow`

**✅ 4B.2 — RecentProductsCarousel**
- Eyebrow: "Recién llegados" con `.section-eyebrow`, título: "Lo último *en tienda*"
- ≤6 productos estáticos, 7-10 carrusel automático con fade

**✅ 4B.3 — CategoryCarousel**
- Eyebrow: "Explorar" con `.section-eyebrow`, título: "Categorías"
- ≤6 categorías estáticas, 7+ carrusel con prev/next (scrollBy)

**✅ 4B.4 — Banner superior + Hero intermedio**
- `TopBanner.tsx` (Server) + `TopBannerClient.tsx` (Client) — importado directo en `layout.tsx` (no en barrel)
- `getHeroIntermedio()` en `landing-service.ts` — conecta `QuoteSection` a BD con `position="hero_intermedio"`
- Fallback a valores hardcodeados si no hay banner en BD

**✅ 4B.5 — Instagram + placeholders + seed**
- `InstagramSection.tsx` — eyebrow "Sé parte de nuestra comunidad" + widget Elfsight
- Widget condicionado a `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`; si no está configurado, sección vacía
- `src/scripts/seed-products.ts` — 20 libros católicos reales, 9 categorías, 3 en selección del mes, 1 hero slide
- Seed es idempotente (usa `onConflictDoNothing`)

### Navbar
Links en orden: Colección → Categorías (dropdown con hover) → Selección del mes (`/#libros-mes`) → Recién llegados (`/#recien-llegados`)
- Dropdown de Categorías: inline styles, `opacity + translateY` transition, delay 150ms en `onMouseLeave` para que el cursor pueda llegar al menú sin que se cierre
- El dropdown muestra "Ver toda la colección" + categorías dinámicas pasadas como prop

### Componentes nuevos Fase 4B
- `src/features/catalogo/components/RecentProductsCarousel.tsx`
- `src/features/catalogo/components/CategoryCarousel.tsx`
- `src/shared/ui/TopBanner.tsx` (Server) + `src/shared/ui/TopBannerClient.tsx` (Client)
- `src/scripts/seed-products.ts`

---

### Fase 4C — Páginas interiores

Referencia visual del diseñador: `docs/catalogo.html`, `docs/producto.html`, `docs/checkout.html`. Leer el HTML correspondiente antes de cada tarea.

**✅ 4C.1 — Catálogo (`/productos`)**
- `PageHeader.tsx`: fondo `#4a3c02` (fallback) o imagen con overlay `rgba(58,48,1,0.55→0.45)`, título "Nuestra *colección*" (italic dorado `rgba(232,210,140,0.85)`), breadcrumb con separadores `opacity-30`, tabs con animación `scaleX` gold, `.page-px`
- `FilterBar.tsx`: chips de filtro izquierda (Todos/Nuevos/En oferta/Recomendados), sort y contador a la derecha, `.page-px`, `top: 64px`
- `productos/page.tsx`: lee `?filter=`, llama `getCatalogoHeaderBanner()`, `limit: 40`, pasa `activeFilter`
- `ProductQueryParams` ahora acepta `onlyOnSale?: boolean` e `isFeatured?: boolean`
- `getCatalogoHeaderBanner()` en `landing-service.ts` — banner con `position="catalogo_header"` configurable desde admin

**✅ 4C.2 — Detalle de producto (`/productos/[slug]`)**
- `ProductGallery.tsx`: imagen principal grande + thumbnails (solo si hay más de 1 imagen)
- `ProductInfoBlock.tsx` (Client Component): eyebrow con categorías, título h1 serif, autor, SKU, badge de stock, precio con descuento, descripción, specs (tapa/páginas con puntos dorados), stepper de cantidad, botón "Agregar al carrito" con estado "Agregado ✓" (2s), trust badges
- `app/(store)/productos/[slug]/page.tsx`: Server Component, breadcrumb con inline styles, grid 2 col `1fr 1fr` gap 72px, sección de relacionados (5 productos, grid 5 col)
- `getRelatedProducts(productId, categoryIds, limit)` en `product-service.ts`

**✅ 4C.3 — Carrito + Checkout**
- `carrito/page.tsx`: reescrito con inline styles + `.page-px`. Grid `1fr 380px`, items con imagen/controles/eliminar, estado vacío con BookIcon, cupón debajo, resumen lateral sticky
- `CheckoutForm.tsx`: visuals actualizados (SectionTitle inline, delivery options como `<label>` cards con radio dorado, payment buttons con borde, summary aside "Tu pedido"). Toda la lógica RHF/Zod intacta
- `checkout/page.tsx`: skeleton con inline styles; el layout y progress bar viven dentro de `CheckoutForm`
- CartPanel (`shared/ui/CartPanel.tsx`): zona central fija `182px` en ambos estados (vacío e items), scroll cuando items superan esa altura

**✅ 4C.4 — Confirmación + 404**
- `confirmacion/page.tsx`: **Client Component** (`"use client"`) con `useSearchParams()` envuelto en `<Suspense>`. Tres estados: paid (cruz dorada), pending (reloj giratorio), cancelled (X + 2 CTAs). Si el estado inicial es `pending`, hace polling a `GET /api/ordenes/{orderNumber}` cada 3s, máximo 10 intentos (30s), luego muestra mensaje de timeout. Sin sección de productos recomendados.
- `not-found.tsx`: nav propio con logo+cruz dorada, ilustración SVG libro, "Error 404", título serif, 2 botones (inicio + colección)
- `public/images/404-illustration.svg`: libro abierto minimalista moss/gold/beige — temporal, reemplazable sin tocar código
- `src/shared/config/brand.ts`: constante `BRAND` con name, tagline, logoSrc, address, email, instagram

### Sección Categorías del landing (CategoryCarousel.tsx)
- Renombrado internamente a grid puro — eliminado carrusel (arrows, scroll, isNav)
- Layout: `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`
- Obtiene **todas** las categorías activas con `getCategories()` (no solo `featured=true`)
- `CategoryCard.tsx`: aspect-ratio `3/2`, overlay `rgba(58,48,1,0.35)`, fallback `#4a3c02` + radial-gradient, nombre serif blanco 16px, contador de títulos en `rgba(255,255,255,0.55)`, hover `scale(1.02)`

---

## Bugs resueltos — historial

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
| 15 | Getnet rechazaba todas las sesiones de pago silenciosamente | `tranKey` calculado con `Base64(nonce)` como string en vez de bytes crudos — fórmula correcta: `SHA256(nonceBytes \|\| seed_utf8 \|\| secretKey_utf8)` → Base64 | `Buffer.concat([nonceBytes, Buffer.from(seed,"utf8"), Buffer.from(secretKey,"utf8")])` en `auth.ts` |
| 16 | `paymentStatus=[object Object]` en URL de retorno | `GetnetPaymentEntry.status` tipado como `string` pero Getnet devuelve objeto `{status, reason, message, date}` | Actualizar tipo a objeto anidado; acceder con `.status?.status` en `payment-service.ts` |
| 17 | Orden quedaba `pending` en BD cuando el cliente cancelaba el pago | `cancelUrl` apuntaba directo a `/checkout/confirmacion`, saltándose `/api/pagos/retorno` | `cancelUrl = appUrl/api/pagos/retorno?reference=...` (mismo endpoint que `returnUrl`) |
| 18 | UI del admin quedaba en loading permanente si el fetch lanzaba | `setLoading(false)` dentro del `try` — nunca ejecutado al ocurrir excepción | `finally { setLoading(false) }` en todas las funciones de fetch de Client Components |
| 19 | Pool de conexiones agotado en desarrollo | `max: 1` causaba que el layout y la API route se bloquearan mutuamente | `max: 3` en desarrollo, `max: 5` en producción en `client.ts` |
| 20 | Post-guardar en formulario de producto admin no navegaba | `router.push("/admin/productos")` + `router.refresh()` se cancelaban mutuamente (mismo patrón que bug #11) | `window.location.href = "/admin/productos"` en `product-admin-form.tsx` |

---

## Lo que NO hacer

- No usar el cliente de Supabase para queries a la BD — solo para Storage
- No instalar `jsonwebtoken` — el proyecto usa `jose` para Edge Runtime
- No agregar `tailwind.config.ts` — Tailwind v4 usa `globals.css`
- No poner `paymentMethod` en `CreateOrderSchema`
- No pasar `quantity` a `addItem()` en el carrito — siempre agrega 1
- No hacer queries directas desde componentes — todo va por API Routes
- No eliminar físicamente registros — siempre soft delete (`is_active = false`)
- No almacenar precios como float — siempre integers CLP
- **No usar `px-5 md:px-10 lg:px-14`** — usar `.page-px`
- **No usar `py-*` de Tailwind para padding vertical de secciones** — usar inline `style={{ paddingTop, paddingBottom }}`
- **No usar clases Tailwind custom (`text-eyebrow`, etc.) para propiedades críticas** — definir en `globals.css @layer components`
- **No exportar Server Components que importen Drizzle desde el barrel `shared/ui/index.ts`** — importar directamente para evitar el error "Module not found: Can't resolve 'fs'"
- **No usar `router.push() + router.refresh()` para redirigir después de login/auth** — usar `window.location.href` (ambas llamadas se cancelan mutuamente en App Router)
- **No omitir `finally { setLoading(false) }` en fetch de Client Components** — sin finally, la UI queda permanentemente en estado de carga si el fetch lanza
- **No pasar la `DATABASE_URL` directa a `postgres()`** — parsear manualmente (el punto en el username del Session Pooler de Supabase se maneja incorrectamente)
- **No descontar stock en `createOrder()`** — el descuento ocurre únicamente en `processPaymentResult()` cuando el status pasa a `"paid"`
- **No calcular `tranKey` de Getnet concatenando strings** — la fórmula correcta usa bytes crudos: `Buffer.concat([nonceBytes, Buffer.from(seed, "utf8"), Buffer.from(secretKey, "utf8")])` → SHA-256 → Base64. Concatenar `base64(nonce) + seed + secretKey` como string produce un `tranKey` inválido que Getnet rechaza silenciosamente.
- **No acceder a `payment[0].status` directamente como string** — Getnet devuelve un objeto `{status, reason, message, date}`; el valor string está en `payment[0].status.status`
- **No apuntar `cancelUrl` directo a `/checkout/confirmacion`** — siempre pasar por `/api/pagos/retorno` igual que `returnUrl`, para que el servidor actualice el estado de la orden en BD (pending → cancelled) antes de redirigir

---

## VESSI + Getnet — Decisión pendiente

### Contexto
La clienta usa VESSI con Inventario Fácil para stock y boletas. El problema: VESSI no tiene API de stock independiente — solo descuenta stock cuando emite una boleta DTE.

### Lo investigado
- API VESSI: Solo emite DTEs. Stock se descuenta automáticamente si se usa el ID interno del producto VESSI en cada línea de la boleta.
- Getnet Web Checkout: Procesa pagos online. Según normativa SII, comprobantes de pago electrónico con tarjeta tienen validez como boleta — pendiente confirmar si aplica para Web Checkout online.
- Credenciales demo VESSI entregadas para ambiente QA.

### Tres opciones en evaluación

**Opción A — VESSI emite boleta, Getnet solo cobra:**
Getnet procesa el pago sin emitir boleta. VESSI emite DTE y descuenta stock. Sin duplicados. Requiere confirmar si Getnet Web Checkout permite no emitir comprobante como boleta.

**Opción B — Getnet emite boleta, stock solo en e-commerce:**
Getnet emite comprobante válido como boleta. Stock vive únicamente en el admin del e-commerce. VESSI solo para ventas físicas. Problema: stock desincronizado.

**Opción C — Abandonar VESSI para stock:**
E-commerce maneja stock completo. Clienta deja de usar VESSI para inventario. Requiere cambiar flujo de trabajo de la clienta.

### Próximo paso
Reunión con la clienta para ver cómo resolvió los duplicados en tienda física. Decisión bloqueada hasta esa reunión.

### Documentación técnica disponible
- API DTE VESSI: autenticación AWS Signature v4 via STS, tokens temporales 12h
- Stack compatible: JavaScript/Node.js con aws-sdk + @aws-amplify/core
- URL QA: https://qgd3pr8an8.execute-api.us-west-2.amazonaws.com/qa
- AccessKey demo: [ver .env.local o 1Password — no commitear] (solo ambiente QA)

---

## VESSI + Getnet — Arquitectura definida

### Flujo de pago y boleta
1. Cliente confirma compra en el e-commerce
2. Getnet Web Checkout procesa el pago (solo cobra, no emite boleta)
3. Servidor recibe confirmación APPROVED de Getnet
4. Servidor llama a la API DTE de VESSI
5. VESSI emite la boleta electrónica (TipoDTE: 39) y responde con PDF
6. Cliente recibe confirmación de compra (boleta vía Resend — pendiente)

### Decisiones tomadas
- Getnet = pasarela de pago exclusivamente. No emite DTEs.
- VESSI = emisión de boleta electrónica exclusivamente. No se usa para stock.
- NO se envía el ID interno de producto VESSI en las líneas del detalle — VESSI emite la boleta sin tocar el stock de su sistema.
- Stock lo maneja únicamente el e-commerce (tabla `products.stock_quantity`). La clienta actualiza manualmente desde el admin cuando hay ventas físicas.
- Boletas sin receptor identificado usan RUT genérico `66666666-6` — compra como invitado no requiere RUT del cliente (campo opcional en checkout).

### Credenciales VESSI (ambiente QA)
- AccessKey: [ver .env.local o 1Password — no commitear]
- Secret: [ver .env.local o 1Password — no commitear]
- URL QA: `https://qgd3pr8an8.execute-api.us-west-2.amazonaws.com/qa`
- RUT emisor demo: `76431892` (Vessi SpA, sin DV en la URL)
- URL producción: `https://c0hocia0ua.execute-api.us-west-2.amazonaws.com/prod`

### Dependencias para implementar
- `aws-sdk` — para llamada a STS y obtener tokens temporales (duración 12h, cachear)
- `@aws-amplify/core` — para firmar la petición con AWS Signature v4
- `moment` — manejo de fechas para el firmado
- `axios` — peticiones HTTP a la API

### Pendiente — posible migración a Bsale
Si el volumen de ventas físicas justifica sincronización automática de stock, evaluar migrar de VESSI a Bsale (tiene API REST completa: boletas + stock en tiempo real). La integración está en `src/integrations/dte/` con interfaz genérica para facilitar ese cambio futuro.
