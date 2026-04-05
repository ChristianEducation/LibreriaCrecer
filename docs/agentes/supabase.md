# AGENTE: SUPABASE STORAGE

## Antes de escribir cualquier línea

1. Lee `docs/HANDOFF-v01.md` — estado actual del proyecto
2. Lee `docs/agentes/CLAUDE.md` — reglas globales

---

## Regla fundamental

**Supabase en este proyecto = Storage de imágenes únicamente.**

El cliente Supabase **nunca** se usa para queries a la base de datos. Todas las queries van por Drizzle ORM. Si necesitas tocar datos, lee `docs/agentes/backend.md`.

---

## Los 3 buckets

| Bucket | Constante | Máximo | Uso |
|---|---|---|---|
| `products` | `STORAGE_BUCKETS.PRODUCTS` | 5MB | Imágenes de productos |
| `banners` | `STORAGE_BUCKETS.BANNERS` | 10MB | Hero slides + banners intermedios |
| `categories` | `STORAGE_BUCKETS.CATEGORIES` | 5MB | Imágenes de categorías |

**Formatos permitidos en todos:** `jpg`, `jpeg`, `png`, `webp`

---

## Estructura de rutas en Storage

```
products/
  {product-id}/
    main-{timestamp}-{uuid8}.webp
    gallery-{timestamp}-{uuid8}.webp

banners/
  hero/
    slide-{timestamp}-{uuid8}.webp
  promo/
    banner-{timestamp}-{uuid8}.webp

categories/
  {category-id}/
    cover-{timestamp}-{uuid8}.webp
    header-{timestamp}-{uuid8}.webp
```

---

## Funciones disponibles — usar siempre estas, no crear nuevas

```typescript
// Todas viven en src/integrations/supabase/storage.ts
// Todas son server-side únicamente (tienen import "server-only")

import {
  uploadProductImage,
  uploadBannerImage,
  uploadCategoryImage,
  deleteImage,
  getPublicUrl,
  uploadImage,        // genérico — preferir los helpers específicos
} from "@/integrations/supabase/storage";

import { STORAGE_BUCKETS } from "@/integrations/supabase/types";
```

### Subir imagen de producto
```typescript
const result = await uploadProductImage(file, productId);

if (!result.success) {
  // result.error.message — string descriptivo del error
  throw new Error(result.error.message);
}

// result.publicUrl — URL pública lista para guardar en BD
// result.path     — ruta relativa dentro del bucket
await db.update(products)
  .set({ mainImageUrl: result.publicUrl })
  .where(eq(products.id, productId));
```

### Subir banner (hero o promo)
```typescript
// Para hero slides
const result = await uploadBannerImage(file, "hero");

// Para banners intermedios
const result = await uploadBannerImage(file, "promo");

if (!result.success) throw new Error(result.error.message);
// result.publicUrl → guardar en hero_slides.image_url o banners.image_url
```

### Subir imagen de categoría
```typescript
// cover = imagen principal de la categoría
const result = await uploadCategoryImage(file, categoryId, "cover");

// header = imagen de cabecera en la página de listado
const result = await uploadCategoryImage(file, categoryId, "header");

if (!result.success) throw new Error(result.error.message);
```

### Eliminar imagen
```typescript
import { deleteImage } from "@/integrations/supabase/storage";
import { STORAGE_BUCKETS } from "@/integrations/supabase/types";

// Necesitas la ruta relativa (path), no la URL pública
// El path se extrae de la URL: la parte después del bucket en la URL pública
const result = await deleteImage(STORAGE_BUCKETS.PRODUCTS, path);

if (!result.success) {
  console.warn("No se pudo eliminar la imagen:", result.error.message);
  // No lanzar error — el registro en BD igual se elimina
}
```

---

## Recibir archivos en API Routes (FormData)

Las subidas de imagen llegan como `multipart/form-data` desde el admin. El patrón estándar:

```typescript
// src/app/api/admin/productos/[id]/imagenes/route.ts
import { NextResponse } from "next/server";
import { uploadProductImage } from "@/integrations/supabase/storage";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "validation_error", message: "Se requiere un archivo." },
        { status: 400 },
      );
    }

    const result = await uploadProductImage(file, id);

    if (!result.success) {
      return NextResponse.json(
        { error: "upload_error", message: result.error.message },
        { status: 422 },
      );
    }

    return NextResponse.json({ data: { url: result.publicUrl } });
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Error inesperado." },
      { status: 500 },
    );
  }
}
```

---

## Tipos de retorno

```typescript
// Resultado de upload — siempre verificar .success antes de usar
type StorageUploadResult =
  | { success: true; path: string; publicUrl: string }
  | { success: false; error: { message: string; cause?: unknown } };

// Resultado de delete
type StorageOperationResult =
  | { success: true; path: string }
  | { success: false; error: { message: string; cause?: unknown } };
```

---

## Variables de entorno requeridas

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

El cliente se inicializa en `src/integrations/supabase/client.ts`. No crear instancias adicionales del cliente Supabase.

---

## Reglas de acceso a buckets (Supabase Dashboard)

- **Lectura:** pública (cualquier visitante puede ver las URLs)
- **Escritura:** solo desde el servidor — las funciones de upload tienen `import "server-only"` y solo se llaman desde API Routes del admin (protegidas por middleware)
- **Nunca** exponer claves de servicio en el cliente

---

## Lo que NO hacer

```typescript
// ❌ Usar el cliente Supabase para queries a la BD
const { data } = await supabase.from("products").select("*");
// → Usar Drizzle ORM

// ❌ Crear una instancia nueva del cliente
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(url, key);
// → Usar getSupabaseStorageClient() de @/integrations/supabase/client

// ❌ Llamar funciones de storage desde componentes React
// → Solo desde API Routes o Server Actions (server-side)

// ❌ Hardcodear nombres de bucket como strings
uploadImage("products", file, path);
// → Usar constantes: STORAGE_BUCKETS.PRODUCTS

// ❌ Ignorar el resultado de success
const result = await uploadProductImage(file, id);
await db.update(...).set({ imageUrl: result.publicUrl }); // puede ser undefined si falló
// → Verificar result.success primero
```

---

*Agente Supabase Storage — Crecer Librería Cristiana — Abril 2026*
