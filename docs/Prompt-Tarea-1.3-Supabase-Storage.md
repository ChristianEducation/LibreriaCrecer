# Tarea 1.3 — Configurar Supabase Storage

## Contexto
Este es el tercer paso del proyecto Crecer Librería Cristiana (e-commerce de librería católica). La Tarea 1.1 inicializó el proyecto y la Tarea 1.2 configuró Drizzle ORM con el esquema completo de base de datos. Ahora necesitamos configurar Supabase Storage para el manejo de imágenes del sitio.

## Decisiones de arquitectura ya tomadas
- **Supabase** se usa SOLO para Storage de imágenes (NO para queries a la BD, eso lo hace Drizzle)
- **Supabase Auth NO se usa** en este proyecto
- Las imágenes se almacenan en Supabase Storage y las URLs se guardan en las tablas de la BD (campos image_url, main_image_url, etc.)
- El proyecto usa la estructura por features definida en la Tarea 1.1

## Lo que necesito que hagas

### 1. Instalar dependencias
- Instalar `@supabase/supabase-js`

### 2. Crear el cliente de Supabase (solo para Storage)
- Ubicación: `src/integrations/supabase/client.ts`
- Usar variables de entorno: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Este cliente se usa EXCLUSIVAMENTE para operaciones de Storage, NO para queries a la base de datos
- Agregar un comentario claro en el archivo indicando que las queries van por Drizzle, no por este cliente

### 3. Definir los buckets necesarios

El proyecto necesita 3 buckets:

**products** — Imágenes de productos
- Público para lectura (cualquier visitante puede ver las imágenes)
- Subida restringida (solo desde el servidor/admin)
- Formatos permitidos: jpg, jpeg, png, webp
- Tamaño máximo: 5MB por archivo

**banners** — Imágenes del hero y banners promocionales del landing
- Público para lectura
- Subida restringida
- Formatos permitidos: jpg, jpeg, png, webp
- Tamaño máximo: 10MB por archivo (banners suelen ser más grandes)

**categories** — Imágenes de categorías
- Público para lectura
- Subida restringida
- Formatos permitidos: jpg, jpeg, png, webp
- Tamaño máximo: 5MB por archivo

### 4. Crear un módulo de utilidades de Storage
- Ubicación: `src/integrations/supabase/storage.ts`
- Crear funciones helper reutilizables:
  - `uploadImage(bucket, file, path)` — sube una imagen y devuelve la URL pública
  - `deleteImage(bucket, path)` — elimina una imagen
  - `getPublicUrl(bucket, path)` — obtiene la URL pública de una imagen
  - `uploadProductImage(file, productId)` — helper específico para productos que organiza las imágenes en carpetas por producto
  - `uploadBannerImage(file, bannerType)` — helper para banners (hero o intermedios)
  - `uploadCategoryImage(file, categoryId)` — helper para categorías
- Cada función debe manejar errores y devolver un resultado tipado con TypeScript
- Las funciones de upload deben generar nombres de archivo únicos (usar timestamp o UUID) para evitar colisiones

### 5. Definir tipos
- Ubicación: `src/integrations/supabase/types.ts`
- Crear tipos para los resultados de las operaciones de Storage (ej: StorageUploadResult, StorageError)
- Definir un enum o constantes con los nombres de los buckets para evitar strings sueltos

### 6. Agregar variables de entorno
- Agregar al `.env.local` de ejemplo:
  - `NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key`

### 7. Crear documentación de setup
- Crear un archivo `src/integrations/supabase/README.md` con instrucciones de:
  - Cómo crear los buckets en el dashboard de Supabase
  - Qué políticas de acceso (RLS policies) aplicar a cada bucket
  - Las variables de entorno necesarias

## Estructura de carpetas en Storage

```
products/
├── {product-id}/
│   ├── main-{timestamp}.webp
│   ├── gallery-1-{timestamp}.webp
│   └── gallery-2-{timestamp}.webp

banners/
├── hero/
│   ├── slide-{timestamp}.webp
│   └── slide-{timestamp}.webp
├── promo/
│   └── banner-{timestamp}.webp

categories/
├── {category-id}/
│   └── cover-{timestamp}.webp
```

## Reglas importantes
- Este módulo NO tiene lógica de negocio — solo operaciones CRUD de archivos
- NO instalar Supabase Auth ni configurar autenticación
- NO usar el cliente de Supabase para queries a la BD (eso es responsabilidad de Drizzle)
- Las funciones helper deben ser server-side (no exponer claves en el cliente)
- Para operaciones de subida desde el admin, usar Server Actions o API Routes que llamen a estos helpers
- NO instalar Zustand, TanStack Query ni otras dependencias (cada una tiene su tarea)
