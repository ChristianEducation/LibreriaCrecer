# Tarea 3.4 — Gestión del Landing (Admin)

## Contexto
Este es el cuarto y último paso de la Fase 3 del proyecto Crecer Librería Cristiana. Las tareas anteriores configuraron auth (3.1), CRUD de productos y categorías (3.2), y gestión de pedidos (3.3). Ahora necesitamos que la administradora pueda gestionar el contenido editable del landing page de la tienda.

## Recordatorio — Secciones del landing y su fuente de datos
- **Hero slides:** editable desde admin (tabla hero_slides) ← ESTA TAREA
- **Novedades:** automático (6 productos más recientes) — no necesita gestión
- **Ofertas:** automático (productos con sale_price activo) — no necesita gestión
- **Categorías destacadas:** se gestiona marcando categories.featured desde el CRUD de categorías (Tarea 3.2)
- **Banners intermedios:** editable desde admin (tabla banners) ← ESTA TAREA
- **Selección curada:** editable desde admin (tabla featured_products) ← ESTA TAREA
- **Instagram:** embed externo — no necesita gestión
- **Mapa:** iframe estático — no necesita gestión

## Lo que necesito que hagas

### 1. Crear servicios del admin para el landing
- Ubicación: `src/features/admin/services/landing-admin-service.ts`

**Hero Slides:**

- `getHeroSlidesAdmin()` — Lista todos los slides (incluye inactivos), ordenados por display_order
- `createHeroSlide(data)` — Crear slide con imagen, título, subtítulo, link, orden
- `updateHeroSlide(id, data)` — Actualizar slide
- `deleteHeroSlide(id)` — Eliminar slide (hard delete, no soft delete — los slides no necesitan historial)
- `uploadHeroImage(file)` — Subir imagen usando uploadBannerImage(file, "hero") de Supabase Storage
- `reorderHeroSlides(slideIds)` — Actualizar display_order según el orden del array

**Banners:**

- `getBannersAdmin()` — Lista todos los banners (incluye inactivos)
- `createBanner(data)` — Crear banner con imagen, título, descripción, link, position
- `updateBanner(id, data)` — Actualizar banner
- `deleteBanner(id)` — Eliminar banner (hard delete)
- `uploadBannerImage(file)` — Subir imagen usando uploadBannerImage(file, "promo") de Supabase Storage

**Selección curada:**

- `getCuratedProductsAdmin(section?)` — Lista productos curados, opcionalmente filtrados por sección
- `addCuratedProduct(data)` — Agregar un producto a la selección: product_id, section, description, display_order
- `updateCuratedProduct(id, data)` — Actualizar descripción, sección u orden
- `removeCuratedProduct(id)` — Eliminar de la selección (hard delete)
- `reorderCuratedProducts(section, productIds)` — Reordenar dentro de una sección

### 2. Crear schemas de validación
- Ubicación: `src/features/admin/schemas/landing-schemas.ts`

**HeroSlideSchema:**
- title: string (opcional)
- subtitle: string (opcional)
- link_url: string url válida (opcional)
- display_order: number (default 0)
- is_active: boolean (default true)

**BannerSchema:**
- title: string (opcional)
- description: string (opcional)
- link_url: string url válida (opcional)
- position: string (requerido — ej: "between_sections_1", "between_sections_2")
- is_active: boolean (default true)

**CuratedProductSchema:**
- product_id: uuid (requerido)
- section: string (requerido — ej: "monthly_selection", "liturgical_reading")
- description: string (opcional — por qué fue seleccionado)
- display_order: number (default 0)
- is_active: boolean (default true)

### 3. Crear API Routes del admin

**Hero Slides:**

`GET /api/admin/landing/hero`
- Response: { data: slides[] }

`POST /api/admin/landing/hero`
- Body: HeroSlideSchema
- Response: { data: slide } (201)

`PUT /api/admin/landing/hero/[id]`
- Body: HeroSlideSchema parcial
- Response: { data: slide }

`DELETE /api/admin/landing/hero/[id]`
- Response: { data: { success: true } }

`POST /api/admin/landing/hero/[id]/imagen`
- Form data: file
- Response: { data: { url } }

`PUT /api/admin/landing/hero/reorder`
- Body: { slideIds: string[] }
- Response: { data: { success: true } }

**Banners:**

`GET /api/admin/landing/banners`
- Response: { data: banners[] }

`POST /api/admin/landing/banners`
- Body: BannerSchema
- Response: { data: banner } (201)

`PUT /api/admin/landing/banners/[id]`
- Body: BannerSchema parcial
- Response: { data: banner }

`DELETE /api/admin/landing/banners/[id]`
- Response: { data: { success: true } }

`POST /api/admin/landing/banners/[id]/imagen`
- Form data: file
- Response: { data: { url } }

**Selección curada:**

`GET /api/admin/landing/seleccion`
- Query params: section (opcional)
- Response: { data: curatedProducts[] } (incluye datos del producto asociado)

`POST /api/admin/landing/seleccion`
- Body: CuratedProductSchema
- Response: { data: curatedProduct } (201)

`PUT /api/admin/landing/seleccion/[id]`
- Body: CuratedProductSchema parcial
- Response: { data: curatedProduct }

`DELETE /api/admin/landing/seleccion/[id]`
- Response: { data: { success: true } }

`PUT /api/admin/landing/seleccion/reorder`
- Body: { section: string, productIds: string[] }
- Response: { data: { success: true } }

### 4. Crear páginas del admin

**Gestión del Landing:** `src/app/admin/landing/page.tsx`
- Página principal con tabs o secciones para: Hero Slides, Banners, Selección Curada
- O links a sub-páginas para cada sección

**Hero Slides:** `src/app/admin/landing/hero/page.tsx`
- Lista de slides con preview de imagen (thumbnail), título, link, estado activo/inactivo, orden
- Botón "Nuevo slide"
- Acciones: editar, eliminar, reordenar (drag & drop o botones arriba/abajo)
- Al crear/editar: formulario con upload de imagen, título, subtítulo, link URL, activo

**Banners:** `src/app/admin/landing/banners/page.tsx`
- Lista de banners con preview, título, posición, estado
- Botón "Nuevo banner"
- Acciones: editar, eliminar
- Al crear/editar: formulario con upload de imagen, título, descripción, link URL, posición (select con opciones), activo

**Selección curada:** `src/app/admin/landing/seleccion/page.tsx`
- Filtro por sección (tabs: "Selección del mes", "Lectura litúrgica", etc.)
- Lista de productos seleccionados con: imagen del producto, título, autor, descripción curada, orden
- Botón "Agregar producto"
- Al agregar: buscador/selector de productos existentes (buscar por título), campo para descripción editorial, selector de sección
- Acciones: editar descripción, eliminar de selección, reordenar

### 5. Actualizar navegación del admin
- Agregar "Landing" al sidebar/header del admin (creado en Tarea 3.1)
- Sub-navegación dentro de Landing: Hero, Banners, Selección

### 6. UI funcional
- Mismos estándares de UI que las Tareas 3.2 y 3.3
- Los previews de imágenes deben ser thumbnails pequeños en los listados
- El upload de imágenes debe mostrar preview antes de guardar
- La selección curada debe permitir buscar y elegir productos ya existentes (no crear nuevos)
- Loading states en todas las operaciones

## Reglas importantes
- Hero slides y banners son hard delete (se eliminan completamente, no soft delete)
- La selección curada referencia productos existentes — si un producto se elimina, el curado se elimina en cascada (ON DELETE CASCADE ya está en el esquema)
- Las imágenes del hero van al bucket "banners/hero/" en Supabase Storage
- Las imágenes de banners intermedios van al bucket "banners/promo/"
- Las secciones de curación son strings libres — la admin puede crear las que quiera
- NO modificar las API Routes públicas del landing (Tarea 2.1) — esas siguen funcionando igual
- NO crear páginas del frontend público (eso es Fase 4)
