# SPEC — HERO: IMAGEN MOBILE (DOBLE IMAGEN / ART DIRECTION)
**Proyecto:** Crecer Librería Católica
**Fecha:** 28 Junio 2026
**Tarea:** Permitir subir una imagen vertical opcional por slide del hero, usada en mobile. Si no se sube, usa la imagen principal como fallback.
**Migración:** `0008_hero_mobile_image.sql`

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz)
2. Lee `docs/MASTER-PROMPT.md`
3. Lee `docs/agentes/frontend.md`
4. Lee `docs/agentes/backend.md`

**Archivos que vas a tocar — léelos COMPLETOS antes de modificar:**
- `src/integrations/drizzle/schema/landing.ts` (tabla `heroSlides`)
- `src/features/admin/services/landing-admin-service.ts` (create/update/delete hero)
- `src/features/admin/schemas/landing-schemas.ts` (schema zod del hero)
- `src/features/catalogo/view-models/hero-view-model.ts` (tipo + mapper)
- `src/features/catalogo/services/landing-service.ts` (SELECT de heroSlides)
- `src/features/catalogo/components/HeroSlider.tsx` (render live)
- `src/features/admin/components/landing/HeroAdminEditor.tsx` (controles admin)
- `drizzle/0007_encounters.sql` (molde de migración — para clonar el estilo ALTER)

Confirma con: *"Contexto absorbido. HeroSlider hoy usa un solo `<Image fill>` con `object-cover`. Listo para FASE 0."*

---

## REGLAS DEL PROYECTO (NO VIOLAR)

- **Archivos completos siempre.** Prohibido `// ... existing code`.
- **Migración:** NO `drizzle-kit push`. SQL como archivo `drizzle/0008_hero_mobile_image.sql`. Lo aplica Christian manualmente.
- **Padding vertical:** `style={{ paddingTop, paddingBottom }}` inline, nunca `py-`.
- **Inputs zod en snake_case.**
- Tras CADA fase: `npx tsc --noEmit` + `npm run lint` limpios.
- **EVIDENCIA REAL OBLIGATORIA** al cerrar cada fase.
- **No tocar** nada fuera del hero.

---

## RESUMEN FUNCIONAL

Cada slide del hero puede tener una **imagen mobile opcional** (`mobile_image_url`). En el admin aparece una segunda zona de upload etiquetada "Imagen Mobile (Opcional) — formato vertical recomendado". En el frontend, si el slide tiene `mobileImageUrl`, se usa en pantallas ≤ 768px; si no, se usa la imagen principal como fallback. El cambio es invisible para slides que no tengan imagen mobile.

---

# FASE 0 — SCHEMA + MIGRACIÓN

## Modificar: `src/integrations/drizzle/schema/landing.ts`
En la tabla `heroSlides`, agregar una columna:
```ts
mobileImageUrl: text("mobile_image_url"),  // null = usar imageUrl como fallback
```

## Entregable: `drizzle/0008_hero_mobile_image.sql`
```sql
ALTER TABLE "hero_slides"
ADD COLUMN "mobile_image_url" text;
-- No backfill necesario: null = fallback a imageUrl (comportamiento actual).
```

Christian lo aplica en Supabase SQL Editor con "Run without RLS".

### GATE FASE 0
`npx tsc --noEmit` limpio. Mostrar:
- `grep -n "mobileImageUrl\|mobile_image_url" src/integrations/drizzle/schema/landing.ts`
- `cat drizzle/0008_hero_mobile_image.sql`

---

# FASE 1 — VIEW-MODEL + SELECT + SCHEMAS + SERVICIO

Todos los cambios de plumbing de datos en una sola fase (son cambios simples y atómicos).

## Modificar: `src/features/catalogo/services/landing-service.ts`
Agregar `mobileImageUrl: heroSlides.mobileImageUrl` al SELECT de hero slides.

## Modificar: `src/features/catalogo/view-models/hero-view-model.ts`
- Agregar `mobileImageUrl: string | null` al tipo `HeroSlideViewModel`.
- Mapear `mobileImageUrl: slide.mobileImageUrl` en el mapper.

## Modificar: `src/features/admin/schemas/landing-schemas.ts`
En `HeroSlideSchema` (create) y `UpdateHeroSlideSchema` (partial), agregar:
```ts
mobile_image_url: z.string().url().optional().nullable(),
```
(Campo opcional — no es obligatorio subir imagen mobile.)

## Modificar: `src/features/admin/services/landing-admin-service.ts`
- En `createHeroSlide`: setear `mobileImageUrl: data.mobile_image_url ?? null`.
- En `updateHeroSlide`: agregar `if ("mobile_image_url" in data) updateData.mobileImageUrl = data.mobile_image_url ?? null`.
- En `deleteHeroSlide`: si `mobileImageUrl` existe, borrarla del Storage antes de borrar la fila (igual que `imageUrl`). Usar `extractStoragePathFromPublicUrl` que ya existe.
- En `getHeroSlidesAdmin` (si existe): incluir `mobileImageUrl` en el SELECT.

### GATE FASE 1
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar:
- `grep -n "mobileImageUrl\|mobile_image" src/features/catalogo/view-models/hero-view-model.ts`
- `grep -n "mobileImageUrl\|mobile_image" src/features/admin/services/landing-admin-service.ts`

---

# FASE 2 — RUTA API + ADMIN UI

## Verificar/Modificar: ruta de upload de imagen del hero
La imagen mobile se sube a través de la misma ruta de imagen existente del hero (`/api/admin/landing/hero/[id]/imagen`) o una nueva ruta dedicada. **Verificar primero qué existe en `src/app/api/admin/landing/hero/`**.

Si ya existe una ruta de upload, agregar soporte para el campo `type` en el form-data: `type=main` (imagen principal, comportamiento actual) vs `type=mobile` (imagen mobile). La ruta guarda según el tipo:
- `type=main` → `updateHeroSlide(id, { imageUrl: upload.publicUrl })`
- `type=mobile` → `updateHeroSlide(id, { mobile_image_url: upload.publicUrl })`

Si no existe ruta de upload separada (el upload se hace en el POST/PUT del slide), adaptar el PUT para aceptar `mobileImageFile` como campo adicional del form-data.

**Verificar antes de implementar** — no inventar una arquitectura que no calce con la existente.

## Modificar: `src/features/admin/components/landing/HeroAdminEditor.tsx`
Agregar al formulario, debajo de la zona de upload de la imagen principal:

```
─── Imagen Mobile (Opcional) ───────────────────────────────
Sube una versión vertical de la imagen para móviles (formato 9:16 
recomendado, similar a historias de Instagram). Si no subes una, 
se usará la imagen principal.

[zona de upload / preview de imagen mobile]
[botón "Quitar imagen mobile" si ya tiene una]
```

- Estado del form: agregar `mobileImageFile: File | null` y `existingMobileImageUrl: string | null`.
- Preview: mostrar miniatura de la imagen mobile si existe, igual que la imagen principal.
- Al guardar: subir la imagen mobile si `mobileImageFile !== null`, igual que la imagen principal.
- Inicialización al editar: leer `slide.mobileImageUrl` → `existingMobileImageUrl`.

### GATE FASE 2
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar:
- `grep -n "mobileImage\|mobile_image\|type=mobile" src/features/admin/components/landing/HeroAdminEditor.tsx`
- Output de `tsc` y `lint`.

---

# FASE 3 — RENDER LIVE (HeroSlider)

## Modificar: `src/features/catalogo/components/HeroSlider.tsx`

Reemplazar el `<Image>` único por un `<picture>` con art direction:

```tsx
<picture>
  {activeSlide.mobileImageUrl ? (
    <source
      media="(max-width: 768px)"
      srcSet={activeSlide.mobileImageUrl}
    />
  ) : null}
  <Image
    alt={activeSlide.title ?? "Hero principal"}
    className="object-cover transition-transform duration-[8000ms] ease-out"
    fill
    priority
    sizes="100vw"
    src={activeSlide.imageUrl}
  />
</picture>
```

**Notas:**
- El `<picture>` wrappea el `<Image>` de Next.js. Next.js permite esto — el `<source>` es HTML nativo y el navegador lo resuelve antes de que Next.js optimice la imagen.
- Si `mobileImageUrl` es null, el `<source>` no se renderiza y el comportamiento es idéntico al actual.
- El `<Image fill>` sigue siendo el fallback universal (desktop + mobile sin imagen mobile).
- No cambiar nada más del HeroSlider.

### GATE FASE 3
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar:
- `grep -n "picture\|source\|mobileImageUrl" src/features/catalogo/components/HeroSlider.tsx`
- Verificar en dev: un slide SIN imagen mobile se ve idéntico a antes. Un slide CON imagen mobile muestra la versión vertical en viewport ≤ 768px.

---

# CHECKLIST DE ARCHIVOS

**Modificados:**
- `src/integrations/drizzle/schema/landing.ts`
- `src/features/catalogo/services/landing-service.ts`
- `src/features/catalogo/view-models/hero-view-model.ts`
- `src/features/admin/schemas/landing-schemas.ts`
- `src/features/admin/services/landing-admin-service.ts`
- `src/features/admin/components/landing/HeroAdminEditor.tsx`
- `src/features/catalogo/components/HeroSlider.tsx`
- Ruta API de imagen del hero (verificar cuál aplica)

**Nuevos:**
- `drizzle/0008_hero_mobile_image.sql`

**Paso manual de Christian:**
- Aplicar `drizzle/0008_hero_mobile_image.sql` en Supabase SQL Editor ("Run without RLS").
- Preparar versión vertical (9:16) de los afiches que lo necesiten (ej. Magnifica Humanitas).
