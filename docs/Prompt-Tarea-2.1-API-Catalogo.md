# Tarea 2.1 — API Routes de Catálogo y Landing

## Contexto
Este es el primer paso de la Fase 2 del proyecto Crecer Librería Cristiana. La Fase 1 dejó configurado: Next.js con App Router (1.1), Drizzle ORM con 13 tablas en PostgreSQL (1.2), Supabase Storage para imágenes (1.3), y Zustand store del carrito (1.4). Ahora necesitamos crear las API Routes que alimentan el catálogo público y el landing de la tienda.

## Decisiones de arquitectura ya tomadas
- Las API Routes viven en `app/api/` como Route Handlers de Next.js
- Los archivos de ruta deben ser delgados — reciben la request, llaman a funciones de servicio, y devuelven la respuesta
- La lógica de queries y negocio vive en archivos de servicio separados dentro de `src/features/catalogo/`
- Drizzle ORM para todas las queries (conexión directa a PostgreSQL)
- Precios en CLP (enteros sin decimales)
- No hay autenticación de clientes — estos endpoints son públicos

## Lo que necesito que hagas

### 1. Crear la capa de servicios del catálogo
- Ubicación: `src/features/catalogo/services/`
- Estos archivos contienen la lógica de queries con Drizzle. Las API Routes solo los llaman.

**product-service.ts:**
- `getProducts(params)` — Lista productos con paginación, filtros y ordenamiento
  - Parámetros: page, limit, categorySlug (opcional), search (opcional), sortBy (price_asc, price_desc, newest, name), onlyInStock (boolean, default true), onlyActive (boolean, default true)
  - Retorna: { products: Product[], total: number, page: number, totalPages: number }
  - Incluir: imagen principal, si tiene descuento (sale_price vs price), categorías asociadas
  - La búsqueda por texto debe buscar en title y author

- `getProductBySlug(slug)` — Detalle completo de un producto
  - Retorna: producto con todas sus imágenes (product_images), categorías asociadas, y campos calculados (hasDiscount, discountPercentage)
  - Si el producto no existe o no está activo, retornar null

- `getNewProducts(limit)` — Productos más recientes
  - Retorna los N productos más recientes ordenados por created_at descendente
  - Solo productos activos y en stock
  - Default limit: 6

- `getOnSaleProducts(limit)` — Productos en oferta
  - Retorna productos que tienen sale_price definido (no null)
  - Solo productos activos y en stock
  - Default limit: 6

- `getFeaturedProducts()` — Productos marcados como destacados
  - Retorna productos con is_featured = true
  - Solo activos y en stock

**category-service.ts:**
- `getCategories()` — Lista todas las categorías activas
  - Incluir: conteo de productos por categoría
  - Ordenadas por display_order
  - Solo categorías activas

- `getCategoryBySlug(slug)` — Detalle de una categoría
  - Retorna la categoría con sus productos (paginados)
  - Si no existe o no está activa, retornar null

- `getFeaturedCategories()` — Categorías destacadas para el landing
  - Retorna categorías con featured = true
  - Ordenadas por display_order

**landing-service.ts:**
- `getHeroSlides()` — Slides del hero principal
  - Solo slides activos, ordenados por display_order

- `getBanners()` — Banners intermedios
  - Solo banners activos
  - Opcionalmente filtrar por position

- `getCuratedProducts(section?)` — Productos de selección curada
  - Retorna featured_products con los datos del producto asociado
  - Puede filtrar por sección (monthly_selection, liturgical_reading, etc.)
  - Solo activos, ordenados por display_order

### 2. Crear las API Routes

**Catálogo de productos:**

`GET /api/productos`
- Query params: page, limit, category, search, sort, inStock
- Llama a productService.getProducts()
- Response: { data: products[], pagination: { page, limit, total, totalPages } }

`GET /api/productos/[slug]`
- Llama a productService.getProductBySlug()
- Response: { data: product } o 404

`GET /api/productos/novedades`
- Query params: limit (default 6)
- Llama a productService.getNewProducts()
- Response: { data: products[] }

`GET /api/productos/ofertas`
- Query params: limit (default 6)
- Llama a productService.getOnSaleProducts()
- Response: { data: products[] }

`GET /api/productos/destacados`
- Llama a productService.getFeaturedProducts()
- Response: { data: products[] }

**Categorías:**

`GET /api/categorias`
- Llama a categoryService.getCategories()
- Response: { data: categories[] }

`GET /api/categorias/[slug]`
- Query params: page, limit (para los productos de la categoría)
- Llama a categoryService.getCategoryBySlug()
- Response: { data: category } con productos paginados, o 404

`GET /api/categorias/destacadas`
- Llama a categoryService.getFeaturedCategories()
- Response: { data: categories[] }

**Landing:**

`GET /api/landing/hero`
- Llama a landingService.getHeroSlides()
- Response: { data: slides[] }

`GET /api/landing/banners`
- Query params: position (opcional)
- Llama a landingService.getBanners()
- Response: { data: banners[] }

`GET /api/landing/seleccion`
- Query params: section (opcional)
- Llama a landingService.getCuratedProducts()
- Response: { data: featuredProducts[] }

### 3. Definir tipos de respuesta
- Ubicación: `src/features/catalogo/types.ts`
- Crear tipos para las respuestas de cada endpoint
- Incluir un tipo genérico ApiResponse<T> con estructura consistente: { data: T, error?: string }
- Incluir un tipo PaginatedResponse<T> que extienda ApiResponse con { pagination: { page, limit, total, totalPages } }

### 4. Manejo de errores
- Cada endpoint debe tener try/catch
- Errores de validación de parámetros: 400 Bad Request
- Recurso no encontrado: 404 Not Found
- Errores de servidor: 500 Internal Server Error
- Formato consistente de error: { error: string, message: string }

## Reglas importantes
- Todos los endpoints son públicos (no requieren autenticación)
- Los Route Handlers deben ser delgados — máximo validar params y llamar al servicio
- Toda la lógica de queries vive en los archivos de servicio, NO en los route handlers
- Las queries deben ser eficientes — usar select específico de campos, no select *
- Los precios se devuelven como enteros en CLP
- Los slugs se usan para las URLs públicas, los UUIDs para referencias internas
- NO crear endpoints de escritura (POST, PUT, DELETE) aquí — eso es parte del Admin (Fase 3)
- NO crear componentes de frontend ni páginas
- NO modificar el store de Zustand ni los esquemas de Drizzle existentes
