# Supabase Storage Setup

Este modulo se usa solo para manejo de archivos en Supabase Storage.
Las queries SQL del proyecto se hacen exclusivamente con Drizzle ORM.

## Variables de entorno

Define estas variables en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## Buckets requeridos

Crear estos buckets en Supabase Storage:

1. `products`
   - Public bucket: activado
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - File size limit: `5 MB`

2. `banners`
   - Public bucket: activado
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - File size limit: `10 MB`

3. `categories`
   - Public bucket: activado
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - File size limit: `5 MB`

## Estructura recomendada de rutas

```text
products/{product-id}/main-{timestamp}-{id}.webp
banners/hero/slide-{timestamp}-{id}.webp
banners/promo/banner-{timestamp}-{id}.webp
categories/{category-id}/cover-{timestamp}-{id}.webp
```

## Politicas recomendadas (Storage RLS)

Aplicar politicas para cada bucket:

- `SELECT`: publico (lectura de imagenes para visitantes)
- `INSERT`, `UPDATE`, `DELETE`: restringido a backend/admin

Si mas adelante se usa auth para admin, enlazar estas politicas a usuarios autenticados con rol admin.
En esta etapa, las subidas deben pasar por Server Actions o API Routes del backend.
