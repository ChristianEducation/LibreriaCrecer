# Tarea 3.2 — CRUD de Productos y Categorías (Admin)

## Contexto
Este es el segundo paso de la Fase 3 del proyecto Crecer Librería Cristiana. La Tarea 3.1 configuró la autenticación del admin con login, JWT en cookies, y middleware de protección. Ahora necesitamos crear el CRUD completo de productos y categorías para que la administradora pueda gestionar el catálogo desde el panel admin.

## Decisiones de arquitectura ya tomadas
- Todas las rutas del admin están protegidas por el middleware (Tarea 3.1)
- Las API Routes del admin van bajo `/api/admin/`
- Supabase Storage se usa para imágenes (helpers creados en Tarea 1.3)
- React Hook Form + Zod para formularios
- Drizzle ORM para queries
- UI funcional básica con Tailwind (se pulirá en Fase 4)

## Lo que necesito que hagas

### 1. Crear servicios del admin para productos
- Ubicación: `src/features/admin/services/product-admin-service.ts`

**getProductsAdmin(params):**
- Lista productos para el admin (incluye inactivos y sin stock)
- Parámetros: page, limit, search (título o autor), categoryId (opcional), isActive (opcional)
- Retorna: productos con paginación, incluyendo categorías asociadas y estado de stock

**getProductAdmin(id):**
- Detalle completo de un producto para edición
- Incluir: todas las imágenes, categorías asociadas, todos los campos

**createProduct(data):**
- Crear producto con todos sus campos
- Generar slug automáticamente desde el título (kebab-case, sin caracteres especiales)
- Si el slug ya existe, agregar sufijo numérico (-1, -2, etc.)
- Crear relaciones en product_categories si se asignan categorías
- Retorna: producto creado

**updateProduct(id, data):**
- Actualizar campos del producto
- Regenerar slug si el título cambió (mantener el anterior si no cambió)
- Actualizar relaciones de categorías (eliminar las anteriores, crear las nuevas)
- Retorna: producto actualizado

**deleteProduct(id):**
- Soft delete: marcar is_active = false (no eliminar físicamente)
- Retorna: confirmación

**uploadProductImage(productId, file, isMain):**
- Usar uploadProductImage de Supabase Storage (Tarea 1.3)
- Si isMain: actualizar main_image_url en el producto
- Si no es main: crear registro en product_images
- Retorna: URL de la imagen

**deleteProductImage(imageId):**
- Eliminar de Supabase Storage y del registro en product_images
- Si era la main_image_url, setear a null

**reorderProductImages(productId, imageIds):**
- Actualizar display_order de las imágenes según el orden del array

### 2. Crear servicios del admin para categorías
- Ubicación: `src/features/admin/services/category-admin-service.ts`

**getCategoriesAdmin():**
- Lista todas las categorías (incluye inactivas)
- Incluir: conteo de productos por categoría
- Ordenadas por display_order

**getCategoryAdmin(id):**
- Detalle de una categoría para edición

**createCategory(data):**
- Crear categoría con slug auto-generado
- Retorna: categoría creada

**updateCategory(id, data):**
- Actualizar categoría
- Regenerar slug si el nombre cambió

**deleteCategory(id):**
- Soft delete: marcar is_active = false
- Verificar que no tenga productos activos asociados antes de desactivar (o advertir)

**uploadCategoryImage(categoryId, file):**
- Usar uploadCategoryImage de Supabase Storage
- Actualizar image_url en la categoría

**reorderCategories(categoryIds):**
- Actualizar display_order según el orden del array

### 3. Crear schemas de validación
- Ubicación: `src/features/admin/schemas/`

**product-schemas.ts:**
- CreateProductSchema: title (req), author, description, price (req, min 1), sale_price, code, sku, cover_type, pages, in_stock, stock_quantity, is_featured, is_active, categoryIds (array de UUIDs)
- UpdateProductSchema: todos opcionales excepto los que se envíen

**category-schemas.ts:**
- CreateCategorySchema: name (req), description, parent_id, featured, display_order, is_active
- UpdateCategorySchema: todos opcionales

### 4. Crear API Routes del admin

**Productos:**

`GET /api/admin/productos`
- Query params: page, limit, search, categoryId, isActive
- Response: { data: products[], pagination }

`GET /api/admin/productos/[id]`
- Response: { data: product }

`POST /api/admin/productos`
- Body: CreateProductSchema
- Response: { data: product } (201)

`PUT /api/admin/productos/[id]`
- Body: UpdateProductSchema
- Response: { data: product }

`DELETE /api/admin/productos/[id]`
- Soft delete
- Response: { data: { success: true } }

`POST /api/admin/productos/[id]/imagenes`
- Form data: file + isMain (boolean)
- Response: { data: { url, imageId? } }

`DELETE /api/admin/productos/[id]/imagenes/[imageId]`
- Response: { data: { success: true } }

**Categorías:**

`GET /api/admin/categorias`
- Response: { data: categories[] }

`GET /api/admin/categorias/[id]`
- Response: { data: category }

`POST /api/admin/categorias`
- Body: CreateCategorySchema
- Response: { data: category } (201)

`PUT /api/admin/categorias/[id]`
- Body: UpdateCategorySchema
- Response: { data: category }

`DELETE /api/admin/categorias/[id]`
- Soft delete
- Response: { data: { success: true } }

`POST /api/admin/categorias/[id]/imagen`
- Form data: file
- Response: { data: { url } }

### 5. Crear páginas del admin

**Listado de productos:** `src/app/admin/productos/page.tsx`
- Tabla con columnas: imagen (thumbnail), título, autor, precio, stock, categorías, activo, acciones
- Búsqueda por título/autor
- Filtro por categoría y estado (activo/inactivo)
- Paginación
- Botón "Nuevo producto"
- Acciones por fila: editar, eliminar

**Crear/Editar producto:** `src/app/admin/productos/nuevo/page.tsx` y `src/app/admin/productos/[id]/editar/page.tsx`
- Formulario con React Hook Form + Zod
- Campos: título, autor, descripción (textarea), precio, precio oferta, código, SKU, tipo de tapa, páginas, stock, cantidad stock, destacado, activo
- Selector múltiple de categorías (checkboxes o multi-select)
- Zona de imágenes: subir imagen principal, subir imágenes de galería, reordenar, eliminar
- Preview de imagen al subir
- Botones: guardar, cancelar

**Listado de categorías:** `src/app/admin/categorias/page.tsx`
- Tabla con columnas: imagen, nombre, productos asociados, destacada, orden, activa, acciones
- Botón "Nueva categoría"
- Acciones: editar, eliminar
- Drag & drop o botones para reordenar (opcional, puede ser campo numérico)

**Crear/Editar categoría:** `src/app/admin/categorias/nuevo/page.tsx` y `src/app/admin/categorias/[id]/editar/page.tsx`
- Formulario con: nombre, descripción, categoría padre (select), destacada (checkbox), orden, activa
- Zona de imagen: subir/cambiar imagen
- Botones: guardar, cancelar

### 6. UI funcional
- Usar Tailwind CSS para estilos básicos
- Tablas limpias con bordes, hover en filas
- Formularios con labels claros, inputs con borde, estados de error en rojo
- Botones con colores distintivos: primario (azul), peligro (rojo), secundario (gris)
- Loading states básicos (texto "Cargando..." o spinner simple)
- Mensajes de éxito/error después de acciones (toast simple o alert)
- Responsive básico (que no se rompa en pantallas pequeñas)

## Reglas importantes
- Todas las API Routes del admin deben verificar la sesión (están protegidas por middleware)
- Validar con Zod en el servidor antes de cualquier operación
- Subida de imágenes via FormData (no base64)
- Los slugs se generan automáticamente — el admin no los escribe
- Soft delete siempre — nunca eliminar registros físicamente
- Los precios se ingresan como números enteros en CLP
- NO crear gestión de pedidos (eso es Tarea 3.3)
- NO crear gestión del landing (eso es Tarea 3.4)
- NO modificar las API Routes públicas de la Fase 2
