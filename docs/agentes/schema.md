# AGENTE: ESQUEMA DE BASE DE DATOS

## Antes de escribir cualquier línea

1. Lee `docs/HANDOFF-v01.md` — estado actual del proyecto
2. Lee `docs/agentes/CLAUDE.md` — reglas globales
3. Si vas a escribir queries → lee también `docs/agentes/backend.md`

---

## Convenciones globales de la BD

- **Todos los IDs:** `uuid` con `defaultRandom()` — nunca auto-increment
- **Todos los precios:** `integer` en CLP — nunca `real` ni `decimal`
- **Eliminación:** soft delete con `is_active = false` — nunca `DELETE` físico
- **Timestamps:** `withTimezone: true` en todos — `created_at` en todas las tablas, `updated_at` donde aplica
- **Slugs:** `unique()` — se generan automáticamente desde el nombre/título, nunca a mano
- **Archivos de schema:** `src/integrations/drizzle/schema/` — un archivo por dominio

---

## Mapa de relaciones

```
categories ──┐
             ├── product_categories ── products ──┬── product_images
             └── (self-reference parent_id)       │
                                                  └── featured_products

orders ──┬── order_items ──→ products (set null on delete)
         ├── order_customers (1:1)
         ├── order_addresses (1:1, solo si shipping)
         └── coupons (many:1, set null on delete)

hero_slides   (independiente)
banners       (independiente)
admin_users   (independiente)
```

---

## Las 13 tablas

### 1. `categories`
**Archivo:** `src/integrations/drizzle/schema/categories.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `name` | text NOT NULL | nombre de la categoría |
| `slug` | text NOT NULL UNIQUE | para URLs — generado automáticamente |
| `description` | text | nullable |
| `image_url` | text | nullable — imagen principal (Supabase Storage) |
| `header_image_url` | text | nullable — imagen cabecera en listado de productos |
| `parent_id` | uuid | nullable — FK → categories.id (self-reference, set null on delete) |
| `featured` | boolean | default false — aparece en landing |
| `display_order` | integer | default 0 — orden en el landing |
| `is_active` | boolean | default true — soft delete |
| `created_at` | timestamp tz | default now |
| `updated_at` | timestamp tz | default now |

**Notas:** `header_image_url` se muestra como banner en `/productos?cat=slug`. `featured=true` → aparece en `CategoryCarousel` del landing.

---

### 2. `products`
**Archivo:** `src/integrations/drizzle/schema/products.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `title` | text NOT NULL | título del libro |
| `slug` | text NOT NULL UNIQUE | para URLs — generado automáticamente |
| `code` | text | nullable — código interno de la librería |
| `sku` | text UNIQUE | nullable — identificador para VESSI |
| `author` | text | nullable |
| `description` | text | nullable |
| `price` | integer NOT NULL | precio base en CLP |
| `sale_price` | integer | nullable — precio oferta; si null, no hay descuento |
| `cover_type` | text | nullable — ej: "Tapa dura", "Tapa blanda" |
| `pages` | integer | nullable |
| `in_stock` | boolean NOT NULL | default true |
| `stock_quantity` | integer NOT NULL | default 0 |
| `main_image_url` | text | nullable — URL de Supabase Storage |
| `is_featured` | boolean NOT NULL | default false — aparece en sección destacados |
| `is_active` | boolean NOT NULL | default true — soft delete |
| `created_at` | timestamp tz | default now |
| `updated_at` | timestamp tz | default now |

**Notas críticas:**
- El precio efectivo es `sale_price` si existe y es menor que `price`, si no `price`
- `stock_quantity` se decrementa SOLO cuando una orden pasa de `pending` a `paid`
- `sku` es el identificador para la futura integración con VESSI

---

### 3. `product_categories`
**Archivo:** `src/integrations/drizzle/schema/products.ts`

Tabla de unión muchos-a-muchos. PK compuesto.

| Campo | Tipo | Notas |
|---|---|---|
| `product_id` | uuid NOT NULL | FK → products.id, CASCADE on delete |
| `category_id` | uuid NOT NULL | FK → categories.id, CASCADE on delete |

---

### 4. `product_images`
**Archivo:** `src/integrations/drizzle/schema/products.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `product_id` | uuid NOT NULL | FK → products.id, CASCADE on delete |
| `url` | text NOT NULL | URL de Supabase Storage |
| `alt_text` | text | nullable |
| `display_order` | integer NOT NULL | default 0 — orden en galería |
| `created_at` | timestamp tz | default now |

---

### 5. `orders`
**Archivo:** `src/integrations/drizzle/schema/orders.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `order_number` | text NOT NULL UNIQUE | formato "ORD-0001" — secuencial legible |
| `status` | text NOT NULL | default "pending" — ver estados abajo |
| `subtotal` | integer NOT NULL | suma de items en CLP |
| `shipping_cost` | integer NOT NULL | default 0 |
| `total` | integer NOT NULL | subtotal - discount + shipping |
| `delivery_method` | text NOT NULL | `"pickup"` o `"shipping"` |
| `payment_method` | text | nullable — ej: "getnet" |
| `payment_reference` | text | nullable — requestId de Getnet |
| `coupon_id` | uuid | nullable — FK → coupons.id, SET NULL on delete |
| `discount_amount` | integer NOT NULL | default 0 — monto descontado por cupón |
| `admin_notes` | text | nullable — notas internas del admin |
| `created_at` | timestamp tz | default now |
| `updated_at` | timestamp tz | default now |

**Estados válidos y transiciones:**
```
pending   → paid        (Getnet confirma — stock se descuenta aquí)
pending   → cancelled   (cliente cancela o cron job 24h)
paid      → preparing   (admin)
preparing → shipped     (admin — solo si delivery_method = "shipping")
preparing → delivered   (admin — si es "pickup")
shipped   → delivered   (admin)
paid      → cancelled   (admin con devolución)
```

---

### 6. `order_items`
**Archivo:** `src/integrations/drizzle/schema/orders.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `order_id` | uuid NOT NULL | FK → orders.id, CASCADE on delete |
| `product_id` | uuid | nullable — FK → products.id, **SET NULL** on delete |
| `sku` | text | nullable — **snapshot** del SKU al momento de compra |
| `product_title` | text NOT NULL | **snapshot** del título al momento de compra |
| `unit_price` | integer NOT NULL | **snapshot** del precio en CLP |
| `quantity` | integer NOT NULL | |
| `subtotal` | integer NOT NULL | unit_price × quantity |
| `created_at` | timestamp tz | default now |

**Crítico:** `product_title`, `unit_price` y `sku` son snapshots inmutables. Si el producto se edita o elimina después, estos valores no cambian. `product_id` puede quedar NULL (SET NULL) si el producto se desactiva — los snapshots garantizan la trazabilidad.

---

### 7. `order_customers`
**Archivo:** `src/integrations/drizzle/schema/orders.ts`

Relación 1:1 con `orders`. Un comprador por orden (compra como invitado).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `order_id` | uuid NOT NULL UNIQUE | FK → orders.id, CASCADE on delete |
| `first_name` | text NOT NULL | |
| `last_name` | text NOT NULL | |
| `email` | text NOT NULL | |
| `phone` | text NOT NULL | |
| `created_at` | timestamp tz | default now |

---

### 8. `order_addresses`
**Archivo:** `src/integrations/drizzle/schema/orders.ts`

Relación 1:1 con `orders`. Solo existe si `delivery_method = "shipping"`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `order_id` | uuid NOT NULL UNIQUE | FK → orders.id, CASCADE on delete |
| `street` | text NOT NULL | nombre de la calle |
| `number` | text NOT NULL | número de la dirección |
| `apartment` | text | nullable — depto u oficina |
| `commune` | text NOT NULL | |
| `city` | text NOT NULL | |
| `region` | text NOT NULL | |
| `zip_code` | text | nullable |
| `delivery_instructions` | text | nullable |
| `created_at` | timestamp tz | default now |

---

### 9. `coupons`
**Archivo:** `src/integrations/drizzle/schema/coupons.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `code` | text NOT NULL UNIQUE | ej: "CRECER10" — mayúsculas por convención |
| `discount_type` | text NOT NULL | `"percentage"` o `"fixed"` |
| `discount_value` | integer NOT NULL | 10 para 10% o 5000 para $5.000 fijo |
| `min_purchase_amount` | integer | nullable — monto mínimo para aplicar |
| `starts_at` | timestamp tz | nullable — inicio de vigencia |
| `expires_at` | timestamp tz | nullable — fin de vigencia |
| `max_uses` | integer | nullable — null = ilimitado |
| `current_uses` | integer NOT NULL | default 0 — incrementa con cada orden |
| `is_active` | boolean NOT NULL | default true |
| `created_at` | timestamp tz | default now |
| `updated_at` | timestamp tz | default now |

**Notas:** `current_uses` se incrementa dentro de la transacción de `createOrder`. Si la orden se cancela, se decrementa (pendiente: cron job). No hay UI de admin para cupones aún — se crean directo en la BD.

---

### 10. `hero_slides`
**Archivo:** `src/integrations/drizzle/schema/landing.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `title` | text | nullable |
| `subtitle` | text | nullable |
| `image_url` | text NOT NULL | URL de Supabase Storage (bucket: banners/hero/) |
| `link_url` | text | nullable — destino al hacer clic |
| `display_order` | integer NOT NULL | default 0 |
| `is_active` | boolean NOT NULL | default true |
| `created_at` | timestamp tz | default now |
| `updated_at` | timestamp tz | default now |

---

### 11. `banners`
**Archivo:** `src/integrations/drizzle/schema/landing.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `title` | text | nullable |
| `description` | text | nullable |
| `image_url` | text NOT NULL | URL de Supabase Storage (bucket: banners/promo/) |
| `link_url` | text | nullable |
| `position` | text NOT NULL | identificador del lugar en el landing |
| `metadata` | jsonb | nullable — `FooterBannerMetadata` (opacity, fade, dimensiones) |
| `is_active` | boolean NOT NULL | default true |
| `created_at` | timestamp tz | default now |
| `updated_at` | timestamp tz | default now |

**Valores de `position` en uso:**
- `"hero_intermedio"` → `QuoteSection` del landing (background image)

---

### 12. `featured_products`
**Archivo:** `src/integrations/drizzle/schema/landing.ts`

Selección editorial de productos.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `product_id` | uuid NOT NULL | FK → products.id, CASCADE on delete |
| `section` | text NOT NULL | identificador de la sección editorial |
| `description` | text | nullable — por qué fue seleccionado |
| `display_order` | integer NOT NULL | default 0 |
| `is_active` | boolean NOT NULL | default true |
| `created_at` | timestamp tz | default now |
| `updated_at` | timestamp tz | default now |

**Valores de `section` en uso:**
- `"monthly_selection"` → selección editorial única del sitio (`LibrosMesSection` del landing + filtro `?filter=seleccion`)

---

### 13. `admin_users`
**Archivo:** `src/integrations/drizzle/schema/admin.ts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | default random |
| `email` | text NOT NULL UNIQUE | |
| `password_hash` | text NOT NULL | bcrypt, 12 rounds — nunca exponer en respuestas |
| `name` | text NOT NULL | nombre para mostrar en el panel |
| `is_active` | boolean NOT NULL | default true |
| `created_at` | timestamp tz | default now |
| `updated_at` | timestamp tz | default now |

**Notas:** Se crea el primer admin con `npm run seed:admin`. No hay UI para crear usuarios adicionales — se hace directo en la BD o extendiendo el seed.

---

## Imports de schema para Drizzle

```typescript
// Productos
import { products, productCategories, productImages } from "@/integrations/drizzle/schema";

// Categorías
import { categories } from "@/integrations/drizzle/schema";

// Órdenes
import { orders, orderItems, orderCustomers, orderAddresses } from "@/integrations/drizzle/schema";

// Cupones
import { coupons } from "@/integrations/drizzle/schema";

// Landing
import { heroSlides, banners, featuredProducts } from "@/integrations/drizzle/schema";

// Admin
import { adminUsers } from "@/integrations/drizzle/schema";

// Cliente
import { db } from "@/integrations/drizzle/client";
```

---

## Migraciones

3 migraciones aplicadas en `src/integrations/drizzle/migrations/`:
- `0000_military_arachne.sql` — schema inicial completo
- `0001_brave_warbird.sql` — ajuste post-setup
- `0002_needy_preak.sql` — ajuste post-setup

Para generar una nueva migración tras cambiar el schema:
```bash
npm run db:generate  # genera el SQL
npm run db:migrate   # aplica en la BD
```

---

*Agente schema — Crecer Librería Cristiana — Abril 2026*
