# SPEC — ENCUENTROS CRECER
**Proyecto:** Crecer Librería Cristiana
**Fecha:** 25 Junio 2026
**Tarea:** Nueva sección "Encuentros Crecer" — galería de eventos pasados (frontstore + admin)
**Tipo:** Feature completa (DB → Admin → Frontstore). Spec dividido en FASES secuenciales con gate de verificación entre cada una.

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz del proyecto)
2. Lee `docs/MASTER-PROMPT.md`
3. Lee `docs/agentes/backend.md`
4. Lee `docs/agentes/frontend.md`
5. Lee `docs/agentes/design-system.md`
6. Lee `docs/agentes/schema.md`
7. Lee `docs/agentes/supabase.md`

**Archivos de referencia que vas a CLONAR (léelos completos antes de tocar nada, son tu molde):**
- `src/integrations/drizzle/schema/products.ts` → molde de `products` + `product_images` (galería 1-a-muchos)
- `src/integrations/drizzle/schema/landing.ts` → molde de tablas de contenido (`banners`, `featuredProducts`)
- `src/features/admin/services/landing-admin-service.ts` → molde de servicio admin CRUD + reorder + manejo de imágenes en Storage
- `src/features/admin/schemas/landing-schemas.ts` → molde de schemas zod (input en snake_case)
- `src/app/api/admin/landing/seleccion/route.ts` y `seleccion/reorder/route.ts` → molde de rutas API admin
- `src/app/api/admin/landing/banners/[id]/imagen/route.ts` → molde de subida de imagen
- `src/app/(store)/productos/[slug]/page.tsx` → molde de página de detalle pública (server component)
- `src/app/(store)/nosotros/page.tsx` → molde de página pública con contenido editable
- `src/shared/ui/Navbar.tsx` → array `navLinksAfterCategories`
- `src/features/admin/components/AdminSidebar.tsx` → array `sections`

Confirma con: *"Contexto absorbido. Stack: Next.js 15 + Drizzle + Supabase + Tailwind v4. Listo para FASE 0."*

---

## REGLAS DEL PROYECTO (NO VIOLAR)

- **Archivos completos siempre.** Prohibido `// ... existing code`. Cada archivo nuevo o modificado se entrega entero.
- **Migraciones:** NO uses `drizzle-kit push` (falla por el punto en el usuario de Supabase). Genera el SQL y lo aplica Christian manualmente en Supabase SQL Editor con "Run without RLS".
- **Padding vertical:** `style={{ paddingTop, paddingBottom }}` inline. NUNCA clases `py-` de Tailwind (bug Tailwind v4 + Turbopack).
- **`TopBanner`:** si aparece, import directo, nunca por barrel. (No deberías necesitar tocarlo; el layout de `(store)` ya lo incluye — no lo modifiques.)
- **Envelope de respuestas API:** éxito `{ data }`; error `{ error, message, details? }` con el status correcto. `try/catch` con `console.error`.
- **Inputs zod en snake_case** (igual que `landing-schemas.ts`: `link_url`, `display_order`, `is_active`).
- **Después de CADA fase:** `npx tsc --noEmit` y `npm run lint` deben pasar limpios.
- **EVIDENCIA REAL OBLIGATORIA.** Al terminar cada fase muestra el output REAL de `tsc`/`lint` y un `cat`/`grep` del código escrito. Reportes narrativos sin evidencia = no se aceptan. (Aprendizaje previo: un agente reportó "implementado" con el archivo todavía como placeholder `export {};`.)
- **No tocar:** lógica de negocio existente, checkout, pagos, pedidos, catálogo, ni el frontend público fuera de lo que este spec indica.

---

## RESUMEN FUNCIONAL

"Encuentros Crecer" es una **galería de eventos pasados** de la librería (charlas, ferias, presentaciones, talleres, encuentros de oración).

- **Frontstore:** página índice tipo galería (grilla de carátulas: imagen + título + fecha) → al hacer click, página de detalle inmersiva (portada, descripción larga, galería de fotos, video opcional embebido).
- **Admin:** sección bajo `/admin/encuentros` para crear, editar, **ordenar** (arrastrar), **publicar/ocultar** y eliminar encuentros; subir portada, fotos de galería, video (URL embebida) y textos.
- La invitación a **próximos** eventos vive en el Hero de la home (ya editable), NO en esta sección.

### Fuera de alcance v1 (Fase 2, NO implementar ahora)
- Filtro por tipo/categoría de evento.
- Enlace al catálogo (encuentro ↔ producto, para presentaciones de libros).
- Múltiples videos por encuentro (v1 = un video opcional).
- Agenda de próximos eventos / lógica de fechas futuras.

---

# FASE 0 — SCHEMA + MIGRACIÓN

## Archivo nuevo: `src/integrations/drizzle/schema/encounters.ts`

Crear las dos tablas clonando el patrón de `products.ts`.

**Tabla `encounters`:**
| Columna | Tipo Drizzle | Notas |
|---|---|---|
| `id` | `uuid().defaultRandom().primaryKey()` | |
| `slug` | `text().notNull().unique()` | generado desde el título |
| `title` | `text().notNull()` | |
| `eventDate` | `date("event_date").notNull()` | fecha del evento (día calendario) |
| `excerpt` | `text()` | descripción breve para la tarjeta |
| `description` | `text()` | descripción larga para el detalle |
| `coverImageUrl` | `text("cover_image_url").notNull()` | carátula/portada |
| `videoUrl` | `text("video_url")` | URL embebida opcional (YouTube/Instagram) |
| `location` | `text()` | lugar, opcional |
| `displayOrder` | `integer("display_order").default(0).notNull()` | orden manual |
| `isActive` | `boolean("is_active").default(true).notNull()` | publicar/ocultar |
| `createdAt` | `timestamp(..., { withTimezone: true }).defaultNow().notNull()` | |
| `updatedAt` | `timestamp(..., { withTimezone: true }).defaultNow().notNull()` | |

**Tabla `encounter_images`** (clon exacto de `product_images`):
| Columna | Tipo Drizzle | Notas |
|---|---|---|
| `id` | `uuid().defaultRandom().primaryKey()` | |
| `encounterId` | `uuid("encounter_id").notNull().references(() => encounters.id, { onDelete: "cascade" })` | |
| `url` | `text().notNull()` | |
| `altText` | `text("alt_text")` | |
| `displayOrder` | `integer("display_order").default(0).notNull()` | |
| `createdAt` | `timestamp(..., { withTimezone: true }).defaultNow().notNull()` | |

**Relations:** `encountersRelations` con `many(encounterImages)`; `encounterImagesRelations` con `one(encounters)`. (Clona el patrón de `productsRelations` / `productImagesRelations`.)

## Modificar: `src/integrations/drizzle/schema/index.ts`
Agregar `export * from "./encounters";`

## Entregable de migración: `drizzle/0007_encounters.sql`
Generar el SQL `CREATE TABLE` para ambas tablas (con sus defaults, FK con `ON DELETE CASCADE`, y la constraint `UNIQUE` en `slug`). Incluir además un índice sobre `encounter_images(encounter_id)`, porque las fotos siempre se consultan por su FK. Christian lo aplica manualmente en Supabase SQL Editor con "Run without RLS". **No correr `drizzle-kit push`.**

## Paso manual de Storage (documentar, NO ejecutable por el agente)
En el entregable, incluir una nota clara para Christian:
> Crear bucket público `encounters` en Supabase Storage (límite 10 MB por archivo, como `banners`). Política de lectura pública anon; escritura solo service role. (Hereda el patrón actual de uploads; la migración de seguridad a service-role key es una sesión aparte y NO entra acá.)

### GATE FASE 0
`npx tsc --noEmit` limpio. Mostrar `cat src/integrations/drizzle/schema/encounters.ts` y el `.sql` generado.

---

# FASE 1 — STORAGE HELPER

## Modificar: `src/integrations/supabase/types.ts`
Agregar `ENCOUNTERS: "encounters"` a `STORAGE_BUCKETS`.

## Modificar: `src/integrations/supabase/storage.ts`
- Agregar `[STORAGE_BUCKETS.ENCOUNTERS]: TEN_MB_IN_BYTES` al mapa de límites.
- Crear `uploadEncounterImage(file, path)` clonando `uploadBannerImage` (mismo `ensureValidImage` + `uploadImage`, bucket `ENCOUNTERS`).

## Modificar: `src/integrations/supabase/index.ts`
Exportar `uploadEncounterImage`.

### GATE FASE 1
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar `grep -n "ENCOUNTERS\|uploadEncounterImage" src/integrations/supabase/*.ts`.

---

# FASE 2 — SCHEMAS ZOD + SERVICIO ADMIN

## Archivo nuevo: `src/features/admin/schemas/encounter-schemas.ts`
Clonar el estilo de `landing-schemas.ts` (inputs snake_case). Definir:
- `EncounterSchema` (create): `title` (req), `event_date` (req, string ISO), `excerpt?`, `description?`, `video_url?`, `location?`, `display_order` (default 0), `is_active` (default true). La portada NO va acá (se sube como archivo aparte, igual que banners).
- `UpdateEncounterSchema` (partial).
- `ReorderEncountersSchema`: `{ ids: z.array(z.string().uuid()) }`.
- `EncounterImageSchema` para alt opcional al subir foto de galería.

Exportar los tipos `EncounterInput`, `UpdateEncounterInput`, etc.

## Archivo nuevo: `src/features/admin/services/encounter-admin-service.ts`
Clonar el patrón de funciones de `landing-admin-service.ts` (incluido el helper `extractStoragePathFromPublicUrl`, adaptado al bucket `encounters`). Funciones:
- `getEncountersAdmin()` → lista ordenada por `displayOrder ASC, createdAt DESC`, con conteo de imágenes (o las imágenes embebidas).
- `getEncounterByIdAdmin(id)` → encuentro + sus `encounter_images` ordenadas.
- `createEncounter(data & { coverImageUrl })` → genera `slug` con el helper existente `src/features/admin/services/slug.ts` (garantizar unicidad: si choca, sufijo incremental). Inserta y retorna.
- `updateEncounter(id, data & { coverImageUrl? })` → patrón de update parcial con `"campo" in data`, setea `updatedAt: new Date()`.
- `deleteEncounter(id)` → borra portada + todas las fotos de galería del Storage (usando el helper de extracción de path) y luego la fila (las `encounter_images` caen por cascade).
- `reorderEncounters(ids)` → actualiza `displayOrder` según el índice del array (clon de `reorderCuratedProducts`).
- `addEncounterImage(encounterId, { url, altText })` → inserta en `encounter_images` con `displayOrder` = siguiente.
- `deleteEncounterImage(imageId)` → borra del Storage + fila.

**Imports:** `db` desde `@/integrations/drizzle`; `encounters, encounterImages` desde `@/integrations/drizzle/schema`; helpers de Storage desde `@/integrations/supabase`.

### GATE FASE 2
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar `cat` de ambos archivos nuevos.

---

# FASE 3 — RUTAS API ADMIN

Clonar el patrón de `seleccion/route.ts`, `seleccion/reorder/route.ts` y `banners/[id]/imagen/route.ts` (envelope, `safeParse`, status correctos, `console.error`).

Crear:
- `src/app/api/admin/encuentros/route.ts` → `GET` (lista) + `POST` (crea; recibe `multipart/form-data` con campos + archivo de portada, sube con `uploadEncounterImage`, llama `createEncounter`).
- `src/app/api/admin/encuentros/[id]/route.ts` → `GET` (detalle), `PUT` (actualiza; portada opcional vía form-data), `DELETE`.
- `src/app/api/admin/encuentros/reorder/route.ts` → `PUT` con `{ ids }`.
- `src/app/api/admin/encuentros/[id]/imagenes/route.ts` → `POST` (sube foto de galería) + `GET` (lista fotos).
- `src/app/api/admin/encuentros/[id]/imagenes/[imageId]/route.ts` → `DELETE`.

**Protección:** estas rutas viven bajo `/api/admin/*`; respetar el mismo middleware/guard de auth que ya cubre las otras rutas admin (verificar `src/middleware.ts` — NO duplicar lógica de auth, solo asegurarte de que el path queda cubierto por el matcher existente).

### GATE FASE 3
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar `find src/app/api/admin/encuentros -name route.ts` y `cat` de la ruta principal.

---

# FASE 4 — UI ADMIN

Adoptar el mismo look de las pantallas admin existentes (ver `src/app/admin/(panel)/landing/seleccion/page.tsx` y `productos/nuevo/page.tsx` como molde de formularios e imágenes). Componentes de cliente con `"use client"` donde haya interacción.

Crear:
- `src/app/admin/(panel)/encuentros/page.tsx` → tabla/lista con: portada miniatura, título, fecha, estado (publicado/oculto), **arrastrar para ordenar**, toggle publicar/ocultar, botones editar/eliminar.
- `src/app/admin/(panel)/encuentros/nuevo/page.tsx` → formulario crear (título, fecha, excerpt, descripción, lugar, URL de video, subir portada).
- `src/app/admin/(panel)/encuentros/[id]/editar/page.tsx` → editar campos + **gestor de galería** (subir varias fotos, reordenarlas, borrar) reutilizando el patrón de imágenes de `productos/[id]/editar`.

## Modificar: `src/features/admin/components/AdminSidebar.tsx`
En el array `sections`, grupo **"Contenido"**, agregar:
```ts
{ href: "/admin/encuentros", label: "Encuentros", icon: "image" }
```
**Usar un `SidebarIconName` ya existente (`"image"`). NO inventar un nombre de icono nuevo** (rompería el tipo `SidebarIconName`). Si quieres un icono más representativo, primero verifica qué nombres acepta `SidebarIcon`.

### GATE FASE 4
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar `cat` de la página de lista y captura del flujo crear→subir portada→publicar (o describir el flujo verificado con el código a la vista).

---

# FASE 5 — FRONTSTORE (PÚBLICO)

Las páginas públicas son **server components** que llaman a un servicio de lectura directamente (sin ruta API pública), igual que la home y el detalle de producto.

## Archivo nuevo: `src/features/encuentros/services/encounter-service.ts`
- `getPublishedEncounters()` → solo `isActive = true`, orden `displayOrder ASC, eventDate DESC`. Devuelve campos para tarjeta (id, slug, title, eventDate, excerpt, coverImageUrl).
- `getEncounterBySlug(slug)` → encuentro publicado + sus `encounter_images` ordenadas. Si no existe o está oculto → null (la página hace `notFound()`).

## Archivo nuevo: `src/app/(store)/encuentros/page.tsx` (índice — galería)
- Grilla de carátulas (clonar la estética de las cards del catálogo: doble sombra, radios, tokens de `design-system.md`).
- Cada tarjeta: `coverImageUrl`, `title`, `eventDate` formateada (es-CL), link a `/encuentros/[slug]`.
- Encabezado de sección con `SectionHeader` si aplica (ver `src/shared/ui/SectionHeader.tsx`).
- Estado vacío amable si no hay encuentros publicados.
- **Padding vertical SIEMPRE inline** (`style={{ paddingTop, paddingBottom }}`), nunca `py-`.

## Archivo nuevo: `src/app/(store)/encuentros/[slug]/page.tsx` (detalle inmersivo)
- Portada amplia (`coverImageUrl`), título, fecha, lugar.
- `description` larga.
- Galería navegable de `encounter_images`.
- Video embebido si `videoUrl` existe (iframe responsivo YouTube/Instagram; NO alojar video).
- `generateMetadata` para SEO (title + og:image = portada), clonando el patrón del detalle de producto.
- `notFound()` si el slug no existe o el encuentro está oculto.

## Modificar: `src/shared/ui/Navbar.tsx`
En el array `navLinksAfterCategories` agregar:
```ts
{ href: "/encuentros", label: "Encuentros" }
```
(Sirve desktop y mobile porque ambos mapean el mismo array — verificarlo.)

### GATE FASE 5
`npx tsc --noEmit` + `npm run lint` limpios. Verificar en dev: `/encuentros` lista, click abre `/encuentros/[slug]`, el link aparece en navbar desktop y mobile. Mostrar evidencia real.

---

# FASE 6 — SEED + VERIFICACIÓN FINAL

- Crear 1 encuentro de prueba con portada + 3 fotos de galería + video, desde el admin, end-to-end.
- Verificar: aparece en `/encuentros`, abre el detalle, ocultarlo lo saca del frontstore, reordenar cambia el orden, eliminar limpia el Storage.
- Correr la suite Playwright existente (`npm run test:e2e` o equivalente) para confirmar que NADA se rompió. Si hay tiempo, agregar `tests/encuentros.spec.ts` mínimo (índice carga, detalle carga, oculto da 404).

### GATE FINAL
`npx tsc --noEmit` + `npm run lint` limpios + suite Playwright verde. Resumen de findings clasificado: **Bloqueantes / Importantes / Menores.**

---

## CHECKLIST DE ARCHIVOS

**Nuevos**
- `src/integrations/drizzle/schema/encounters.ts`
- `drizzle/0007_encounters.sql`
- `src/features/admin/schemas/encounter-schemas.ts`
- `src/features/admin/services/encounter-admin-service.ts`
- `src/app/api/admin/encuentros/route.ts`
- `src/app/api/admin/encuentros/[id]/route.ts`
- `src/app/api/admin/encuentros/reorder/route.ts`
- `src/app/api/admin/encuentros/[id]/imagenes/route.ts`
- `src/app/api/admin/encuentros/[id]/imagenes/[imageId]/route.ts`
- `src/app/admin/(panel)/encuentros/page.tsx`
- `src/app/admin/(panel)/encuentros/nuevo/page.tsx`
- `src/app/admin/(panel)/encuentros/[id]/editar/page.tsx`
- `src/features/encuentros/services/encounter-service.ts`
- `src/app/(store)/encuentros/page.tsx`
- `src/app/(store)/encuentros/[slug]/page.tsx`
- (opcional) `tests/encuentros.spec.ts`

**Modificados**
- `src/integrations/drizzle/schema/index.ts`
- `src/integrations/supabase/types.ts`
- `src/integrations/supabase/storage.ts`
- `src/integrations/supabase/index.ts`
- `src/features/admin/components/AdminSidebar.tsx`
- `src/shared/ui/Navbar.tsx`

**Pasos manuales de Christian (fuera del agente)**
- Aplicar `drizzle/0007_encounters.sql` en Supabase SQL Editor ("Run without RLS").
- Crear bucket público `encounters` en Supabase Storage (10 MB, lectura anon, escritura service role).
