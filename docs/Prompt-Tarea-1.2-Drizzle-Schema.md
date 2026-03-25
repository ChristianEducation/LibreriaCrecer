# Tarea 1.2 — Configurar Drizzle ORM + Esquema de Base de Datos

## Contexto
Este es el segundo paso del proyecto Crecer Librería Cristiana (e-commerce de librería católica). La Tarea 1.1 ya inicializó el proyecto con Next.js 15, App Router, TypeScript y Tailwind. Ahora necesitamos configurar Drizzle ORM y definir el esquema completo de la base de datos.

## Decisiones de arquitectura ya tomadas
- **Drizzle ORM** para todas las queries a la base de datos (conexión directa a PostgreSQL)
- **Supabase PostgreSQL** como base de datos (se usa el connection string directo, NO la API REST)
- **Supabase Storage** se mantiene por separado solo para imágenes (NO se configura aquí)
- **No hay autenticación de clientes** — compra como invitado
- **Auth solo para admin** — tabla de usuarios admin
- El proyecto usa la estructura por features definida en la Tarea 1.1

## Lo que necesito que hagas

### 1. Instalar y configurar Drizzle ORM

- Instalar `drizzle-orm` y `drizzle-kit`
- Instalar el driver de PostgreSQL (`postgres` o `@neondatabase/serverless` según compatibilidad con Supabase)
- Crear el archivo de configuración de Drizzle (`drizzle.config.ts`) apuntando al connection string de Supabase (usar variable de entorno `DATABASE_URL`)
- Crear el cliente de Drizzle en `src/integrations/drizzle/client.ts`
- Crear un archivo `.env.local` de ejemplo con `DATABASE_URL=postgresql://...`

### 2. Definir los esquemas en `src/integrations/drizzle/schema/`

Crear un archivo por dominio. Todas las tablas usan UUID como primary key y tienen timestamps (created_at, updated_at).

---

#### `categories.ts` — Categorías de productos

**Tabla: categories**
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| name | text | NOT NULL |
| slug | text | NOT NULL, UNIQUE — para URLs amigables |
| description | text | nullable |
| image_url | text | nullable |
| parent_id | uuid | nullable, FK → categories.id (para subcategorías futuras) |
| featured | boolean | default false — si aparece destacada en el landing |
| display_order | integer | default 0 — orden de visualización |
| is_active | boolean | default true |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

---

#### `products.ts` — Productos

**Tabla: products**
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| title | text | NOT NULL |
| slug | text | NOT NULL, UNIQUE |
| code | text | nullable — código interno de la librería |
| sku | text | nullable, UNIQUE — identificador para sincronización con VESSI |
| author | text | nullable |
| description | text | nullable |
| price | integer | NOT NULL — precio en CLP (sin decimales, almacenar en pesos) |
| sale_price | integer | nullable — precio de oferta, si es null no hay descuento |
| cover_type | text | nullable — tipo de tapa (ej: "Tapa dura", "Tapa blanda") |
| pages | integer | nullable — número de páginas |
| in_stock | boolean | default true |
| stock_quantity | integer | default 0 |
| main_image_url | text | nullable — imagen principal (URL de Supabase Storage) |
| is_featured | boolean | default false — si aparece como destacado en el home |
| is_active | boolean | default true |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

**Tabla: product_categories** (relación muchos-a-muchos)
| Campo | Tipo | Notas |
|-------|------|-------|
| product_id | uuid | FK → products.id, ON DELETE CASCADE |
| category_id | uuid | FK → categories.id, ON DELETE CASCADE |
| (PK compuesto) | | product_id + category_id |

**Tabla: product_images** (múltiples imágenes por producto)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| product_id | uuid | FK → products.id, ON DELETE CASCADE |
| url | text | NOT NULL |
| alt_text | text | nullable |
| display_order | integer | default 0 |
| created_at | timestamp | default now() |

---

#### `orders.ts` — Pedidos

**Tabla: orders**
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| order_number | text | NOT NULL, UNIQUE — legible tipo "ORD-0001" |
| status | text | NOT NULL, default "pending" — valores: pending, paid, preparing, shipped, delivered, cancelled |
| subtotal | integer | NOT NULL — en CLP |
| shipping_cost | integer | default 0 — en CLP |
| total | integer | NOT NULL — en CLP |
| delivery_method | text | NOT NULL — valores: "pickup" o "shipping" |
| payment_method | text | nullable — ej: "webpay", "getnet" |
| payment_reference | text | nullable — ID de transacción de la pasarela |
| coupon_id | uuid | nullable, FK → coupons.id |
| discount_amount | integer | default 0 — monto descontado por cupón en CLP |
| admin_notes | text | nullable — notas internas del admin |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

**Tabla: order_items** (productos dentro del pedido)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| order_id | uuid | FK → orders.id, ON DELETE CASCADE |
| product_id | uuid | FK → products.id, ON DELETE SET NULL (el producto puede eliminarse después) |
| sku | text | nullable — snapshot del SKU al momento de compra para VESSI |
| product_title | text | NOT NULL — snapshot del título al momento de compra |
| unit_price | integer | NOT NULL — snapshot del precio en CLP |
| quantity | integer | NOT NULL |
| subtotal | integer | NOT NULL — unit_price * quantity |
| created_at | timestamp | default now() |

**Tabla: order_customers** (datos del comprador invitado)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| order_id | uuid | FK → orders.id, ON DELETE CASCADE, UNIQUE |
| first_name | text | NOT NULL |
| last_name | text | NOT NULL |
| email | text | NOT NULL |
| phone | text | NOT NULL |
| created_at | timestamp | default now() |

**Tabla: order_addresses** (dirección de despacho, solo si delivery_method = "shipping")
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| order_id | uuid | FK → orders.id, ON DELETE CASCADE, UNIQUE |
| street | text | NOT NULL |
| number | text | NOT NULL |
| apartment | text | nullable — depto/oficina |
| commune | text | NOT NULL — comuna |
| city | text | NOT NULL |
| region | text | NOT NULL |
| zip_code | text | nullable |
| delivery_instructions | text | nullable |
| created_at | timestamp | default now() |

---

#### `coupons.ts` — Cupones de descuento

**Tabla: coupons**
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| code | text | NOT NULL, UNIQUE — ej: "CRECER10" |
| discount_type | text | NOT NULL — valores: "percentage" o "fixed" |
| discount_value | integer | NOT NULL — 10 para 10% o 5000 para $5.000 |
| min_purchase_amount | integer | nullable — monto mínimo de compra para aplicar |
| starts_at | timestamp | nullable — fecha inicio de vigencia |
| expires_at | timestamp | nullable — fecha expiración |
| max_uses | integer | nullable — usos máximos permitidos (null = ilimitado) |
| current_uses | integer | default 0 |
| is_active | boolean | default true |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

---

#### `landing.ts` — Contenido editable del landing

**Tabla: hero_slides** (banners del hero principal)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| title | text | nullable |
| subtitle | text | nullable |
| image_url | text | NOT NULL |
| link_url | text | nullable — a dónde lleva al hacer clic |
| display_order | integer | default 0 |
| is_active | boolean | default true |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

**Tabla: banners** (banners intermedios promocionales)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| title | text | nullable |
| description | text | nullable |
| image_url | text | NOT NULL |
| link_url | text | nullable |
| position | text | NOT NULL — identificador de dónde va el banner (ej: "between_sections_1") |
| is_active | boolean | default true |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

**Tabla: featured_products** (selección curada — "Selección del mes", "Lectura litúrgica", etc.)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| product_id | uuid | FK → products.id, ON DELETE CASCADE |
| section | text | NOT NULL — ej: "monthly_selection", "liturgical_reading" |
| description | text | nullable — por qué fue seleccionado (ej: "Lectura ideal para Cuaresma") |
| display_order | integer | default 0 |
| is_active | boolean | default true |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

---

#### `admin.ts` — Usuarios admin

**Tabla: admin_users**
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK, default random |
| email | text | NOT NULL, UNIQUE |
| password_hash | text | NOT NULL |
| name | text | NOT NULL |
| is_active | boolean | default true |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

---

### 3. Definir las relaciones en Drizzle

Usar `relations()` de Drizzle para definir:
- categories → self-reference (parent/children)
- products ↔ categories (muchos a muchos vía product_categories)
- products → product_images (uno a muchos)
- orders → order_items (uno a muchos)
- orders → order_customers (uno a uno)
- orders → order_addresses (uno a uno)
- orders → coupons (muchos a uno)
- order_items → products (muchos a uno)
- featured_products → products (muchos a uno)

### 4. Crear un archivo index de exportación

`src/integrations/drizzle/schema/index.ts` que re-exporte todos los esquemas.

### 5. Generar la primera migración

Usar `drizzle-kit generate` para crear la migración inicial con todas las tablas.

## Reglas importantes
- Todos los precios en INTEGER (pesos chilenos CLP, sin decimales)
- Todos los IDs son UUID
- Todas las tablas tienen created_at y updated_at donde corresponda
- Los slugs son UNIQUE y se usarán para URLs amigables
- Los campos de snapshot en order_items (product_title, unit_price, sku) son críticos — guardan el valor al momento de la compra para que no cambien si se edita el producto después
- NO crear seeds ni datos de prueba aún
- NO configurar Supabase Storage aquí (es Tarea 1.3)
- NO instalar Zustand, TanStack Query ni otras dependencias (cada una tiene su tarea)

## Resumen de tablas (13 total)

1. categories
2. products
3. product_categories
4. product_images
5. orders
6. order_items
7. order_customers
8. order_addresses
9. coupons
10. hero_slides
11. banners
12. featured_products
13. admin_users
