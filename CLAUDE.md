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
│   │       ├── categorias/
│   │       ├── pedidos/
│   │       └── landing/      # hero/, banners/, seleccion/, footer/
│   └── api/
│       ├── productos/        # GET público del catálogo
│       ├── categorias/       # GET público de categorías
│       ├── landing/          # GET público hero, banners, selección
│       ├── ordenes/          # POST crear orden, GET por número
│       ├── cupones/          # POST validar cupón
│       ├── stock/            # POST validar stock
│       ├── pagos/            # Getnet: crear-sesion, retorno, notificacion
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
│       └── components/       # AdminSidebar, AdminTable, AdminTopbar, AdminStatusPill, etc.
│
├── shared/
│   ├── ui/                   # Navbar, Footer, CartPanel, Button, Input, Badge, Toast, etc.
│   ├── hooks/                # useScrollReveal, useToast
│   └── utils/
│       └── formatters.ts     # formatCLP(), formatDate()
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

**product_images** — `id`, `product_id`, `url`, `alt_text`, `display_order`, `created_at`

**orders** — `id`, `order_number` (unique, ej: "ORD-0001"), `status`, `subtotal`, `shipping_cost`, `total`, `delivery_method` ("pickup"|"shipping"), `payment_method`, `payment_reference`, `coupon_id`, `discount_amount`, `admin_notes`, timestamps

**order_items** — snapshot inmutable: `product_title`, `unit_price`, `sku`, `quantity`, `subtotal`

**order_customers** — `first_name`, `last_name`, `email`, `phone` (1:1 con order)

**order_addresses** — dirección completa (solo si delivery_method = "shipping", 1:1 con order)

**coupons** — `code`, `discount_type` ("percentage"|"fixed"), `discount_value`, `min_purchase_amount`, `starts_at`, `expires_at`, `max_uses`, `current_uses`, `is_active`

**hero_slides** — `title`, `subtitle`, `image_url`, `link_url`, `display_order`, `is_active`

**banners** — `title`, `description`, `image_url`, `link_url`, `position`, `metadata` (jsonb con `FooterBannerMetadata`), `is_active`

**featured_products** — `product_id` (FK), `section` (string libre), `description` editorial, `display_order`, `is_active`

**admin_users** — `email`, `password_hash` (bcrypt, 12 rounds), `name`, `is_active`

### Importar el cliente de Drizzle

```typescript
import { db } from "@/integrations/drizzle";
import { products, categories, orders } from "@/integrations/drizzle/schema";
```

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

### Órdenes — creación atómica
La creación de una orden es una transacción Drizzle que incluye: validar stock, crear orden + items + customer + address (si aplica), descontar stock, incrementar usos del cupón. Si cualquier paso falla, todo se revierte.

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

### Componentes compartidos (`src/shared/ui/`)
`Button`, `Input` (incluye Textarea), `Badge`, `Navbar`, `Footer`, `CartPanel`, `Toast`, `SectionHeader`, `Separator`

### Componentes del admin (`src/features/admin/components/`)
`AdminSidebar`, `AdminTopbar`, `AdminTable`, `AdminStatusPill`, `AdminMetricCard`, `AdminToggle`, `AdminUploadZone`

---

## Autenticación Admin

- JWT en cookie HTTP-only `"admin-session"`, firmado con `ADMIN_JWT_SECRET`, 24h de duración
- Middleware en `src/middleware.ts` protege `/admin/*` y `/api/admin/*`
- Excepción: `/admin/login` y `/api/admin/auth/login` son públicos
- Usa `jose` (no `jsonwebtoken`) por compatibilidad con Edge Runtime
- Login contra tabla `admin_users` con bcrypt (12 rounds)

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
```

> **Importante:** El `DATABASE_URL` usa Session Pooler de Supabase con un punto en el username (`postgres.projectref`). El cliente de Drizzle en `client.ts` parsea la URL manualmente para evitar que `postgres.js` lo maneje incorrectamente. No cambiar ese parsing.

> **Importante:** Las variables en `.env.local` deben ir una por línea. Ponerlas en una sola línea causa fallo de conexión silencioso.

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

- **Fases 1–4 completas** — backend, APIs, admin panel y frontend público implementados
- **Fase 4B en curso** — mejoras al landing para dejarlo fiel al diseñador
- `npx tsc --noEmit` y `npm run lint` pasan sin errores
- **Pendiente:** Integración VESSI (esperando respuesta de API), Resend emails, Fase 5 (SEO, testing, deploy)
- **Getnet en TEST** — credenciales de producción se configuran post-validación con Getnet
- **Instagram** — usar Elfsight widget, requiere `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID` en `.env.local`

### Progreso Fase 4B

**✅ Tarea 4B.1 — LibrosMesSection completada y corregida:**
- Eliminado wrapper doble (panel beige redondeado sobre fondo blanco)
- Título cambiado a "Selección del mes"
- Container queries (`cqi`) reemplazados por `clamp()` con `vw` en `globals.css`
- Flechas prev/next movidas al área de portadas (flanquean las portadas, no el sidebar)
- Sidebar limpio: eyebrow + título + descripción sin botones
- Portadas más grandes: `--lm-card-w: clamp(11rem, 16vw, 16rem)`
- Sección con `min-height: 75vh` para tener personalidad propia al hacer scroll
- Placeholder elegante cuando no hay productos curados
- Pendiente ajuste fino: padding-left del sidebar (`clamp(2.5rem, 5vw, 5rem)`)

**⏳ Pendientes de ejecutar:**
- Tarea 4B.2 — Carrusel "Recién llegados" (prompt listo en `docs/`)
- Tarea 4B.3 — Categorías en carrusel de una fila (prompt listo en `docs/`)
- Tarea 4B.4 — Banner superior + Hero intermedio desde BD (prompt listo en `docs/`)
- Tarea 4B.5 — Instagram embed Elfsight + Placeholders + Seed de 10 libros (prompt listo en `docs/`)

### Componentes nuevos de Fase 4B (por crear)
- `src/features/catalogo/components/RecentProductsCarousel.tsx` — carrusel recién llegados
- `src/features/catalogo/components/CategoryCarousel.tsx` — categorías en fila
- `src/shared/ui/TopBanner.tsx` — banda superior editable desde admin

### Convenciones Fase 4B
- Cada sección del landing tiene `min-height` propio para verse con personalidad al hacer scroll
- Toda sección sin datos muestra un placeholder elegante (borde punteado, ícono tenue, texto serif)
- Colores **nunca** se tocan — están aprobados y son definitivos
- Después de cada tarea: `npx tsc --noEmit` y `npm run lint` deben pasar sin errores

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