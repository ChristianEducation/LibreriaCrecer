# SPEC — HERO CTA: POSICIÓN (ANCLAS 3×3) + COLORES
**Proyecto:** Crecer Librería Cristiana
**Fecha:** 25 Junio 2026
**Tarea:** Separar el botón (CTA) del bloque de texto del Hero, darle 9 posiciones de ancla independientes y control de colores (fondo, texto, borde) editable desde admin.
**Enfoque elegido:** Opción B — anclas 3×3 (robusto en responsive). NO posición absoluta libre por X/Y.

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz)
2. Lee `docs/MASTER-PROMPT.md`
3. Lee `docs/agentes/frontend.md`
4. Lee `docs/agentes/backend.md`
5. Lee `docs/agentes/design-system.md`

**Archivos que vas a tocar — léelos COMPLETOS antes de modificar:**
- `src/integrations/drizzle/schema/landing.ts` (tabla `heroSlides`)
- `src/shared/config/landing.ts` (constantes y tipos del hero)
- `src/features/admin/schemas/landing-schemas.ts` (schema zod del hero)
- `src/features/admin/services/landing-admin-service.ts` (create/update hero)
- `src/features/catalogo/services/landing-service.ts` (SELECT de `heroSlides`)
- `src/features/catalogo/view-models/hero-view-model.ts` (tipo + mapper del view-model)
- `src/features/catalogo/components/HeroSlider.tsx` (render LIVE del hero)
- `src/features/catalogo/components/hero/HeroPreview.tsx` (preview en admin)
- `src/features/admin/components/landing/HeroAdminEditor.tsx` (controles del admin)
- `drizzle/0005_extend_hero_slides.sql` (molde de migración ALTER del hero)

Confirma con: *"Contexto absorbido. Hero diagnosticado: CTA hoy va dentro de `hero-copy`, posición por `textPosition` (3 presets), fondo `#c8a830` + texto blanco hardcodeados. Listo para FASE 0."*

---

## REGLAS DEL PROYECTO (NO VIOLAR)

- **Archivos completos siempre.** Prohibido `// ... existing code`.
- **Migración:** NO `drizzle-kit push`. Genero SQL (`ALTER TABLE`) y lo aplica Christian en Supabase SQL Editor con "Run without RLS".
- **Padding vertical:** `style={{ paddingTop, paddingBottom }}` inline, nunca `py-`.
- **Inputs zod en snake_case** (igual que el resto de `landing-schemas.ts`).
- Tras CADA fase: `npx tsc --noEmit` + `npm run lint` limpios.
- **EVIDENCIA REAL OBLIGATORIA** al cerrar cada fase: output real de `tsc`/`lint` + `cat`/`grep` del código escrito. Reportes narrativos sin evidencia = no se aceptan.
- **No tocar** nada fuera del hero. Cero cambios a checkout, catálogo, pedidos, otras secciones del landing.

---

## DIAGNÓSTICO Y OBJETIVO

**Hoy:** el CTA es un `<Link>` dentro del bloque `hero-copy` (junto al título y subtítulo). Se posiciona solo con `textPosition` (left/center/right) porque hereda la posición del bloque de texto. Su estilo es `text-white` + `background: #c8a830` + `borderRadius: var(--radius-xl)`, todo fijo en código. No hay control de color ni posición propia.

**Objetivo:**
1. **Sacar el CTA del bloque de texto** y renderizarlo en una capa propia, anclada a una de **9 posiciones** (rejilla 3×3) dentro del área del hero, INDEPENDIENTE de la posición del texto.
2. **Control de colores** del botón desde admin: color de fondo, color de texto y color de borde (con pickers). Defaults = los valores actuales, para que NADA cambie visualmente hasta que tía Moni edite.

**Importante (responsive):** las 9 anclas se resuelven con flexbox (`align-items` × `justify-content`) sobre una capa `absolute inset-0`, NO con coordenadas X/Y absolutas. Así el botón se mantiene dentro del encuadre en desktop y mobile. No introducir posición por píxeles ni por porcentaje arbitrario.

---

# FASE 0 — CONFIG + SCHEMA + MIGRACIÓN

## Modificar: `src/shared/config/landing.ts`
Agregar, siguiendo el estilo de las constantes hero existentes:

```ts
export const HERO_CTA_POSITIONS = [
  "top-left", "top-center", "top-right",
  "middle-left", "middle-center", "middle-right",
  "bottom-left", "bottom-center", "bottom-right",
] as const;
export type HeroCtaPosition = (typeof HERO_CTA_POSITIONS)[number];
export const HERO_CTA_POSITION_DEFAULT: HeroCtaPosition = "bottom-left";

export const HERO_CTA_BG_COLOR_DEFAULT = "#c8a830";
export const HERO_CTA_TEXT_COLOR_DEFAULT = "#ffffff";
// El borde por defecto es null (sin borde).
```

## Modificar: `src/integrations/drizzle/schema/landing.ts`
En la tabla `heroSlides`, agregar 4 columnas (importar `HeroCtaPosition` y `HERO_CTA_POSITION_DEFAULT` del config):

```ts
ctaPosition: text("cta_position").$type<HeroCtaPosition>().default(HERO_CTA_POSITION_DEFAULT).notNull(),
ctaBgColor: text("cta_bg_color"),        // null = botón transparente / estilo link
ctaTextColor: text("cta_text_color"),    // null → fallback al default en el render
ctaBorderColor: text("cta_border_color"),// null = sin borde
```

## Entregable de migración: `drizzle/<siguiente_numero>_hero_cta_controls.sql`
Clonar el estilo de `0005_extend_hero_slides.sql` (ALTER + backfill). **Usar el siguiente número libre** de la carpeta `drizzle/` al momento de crearlo (ojo: si ya corriste el spec de Encuentros, ese tomó un número — revisa la carpeta y usa el que siga).

```sql
ALTER TABLE "hero_slides"
ADD COLUMN "cta_position" text NOT NULL DEFAULT 'bottom-left',
ADD COLUMN "cta_bg_color" text,
ADD COLUMN "cta_text_color" text,
ADD COLUMN "cta_border_color" text;

-- Backfill: preservar EXACTO el look actual (dorado + texto blanco)
-- solo en slides que ya muestran botón.
UPDATE "hero_slides"
SET "cta_bg_color" = '#c8a830',
    "cta_text_color" = '#ffffff'
WHERE "cta_text" IS NOT NULL
  AND btrim("cta_text") <> ''
  AND "cta_bg_color" IS NULL;
```

Christian lo aplica manualmente en Supabase SQL Editor ("Run without RLS").

### GATE FASE 0
`npx tsc --noEmit` limpio. Mostrar diff/`cat` de los 2 archivos + el `.sql`.

---

# FASE 1 — VIEW-MODEL + SELECT

## Modificar: `src/features/catalogo/services/landing-service.ts`
En el SELECT de `heroSlides`, agregar los 4 campos nuevos (`ctaPosition`, `ctaBgColor`, `ctaTextColor`, `ctaBorderColor`).

## Modificar: `src/features/catalogo/view-models/hero-view-model.ts`
- Agregar al tipo `HeroSlideViewModel`: `ctaPosition: HeroCtaPosition`, `ctaBgColor: string | null`, `ctaTextColor: string | null`, `ctaBorderColor: string | null`.
- En el mapper, mapear los 4 campos desde el row.

### GATE FASE 1
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar `grep -n "cta" src/features/catalogo/view-models/hero-view-model.ts`.

---

# FASE 2 — ADMIN: SCHEMA + SERVICIO

## Modificar: `src/features/admin/schemas/landing-schemas.ts`
En el schema del hero (create y update), agregar (snake_case):
- `cta_position`: enum sobre `HERO_CTA_POSITIONS`, default `HERO_CTA_POSITION_DEFAULT`.
- `cta_bg_color`: hex opcional/nullable. Validar formato hex con regex `^#([0-9a-fA-F]{6})$` (o `null`).
- `cta_text_color`: idem.
- `cta_border_color`: idem.

## Modificar: `src/features/admin/services/landing-admin-service.ts`
- En `createHeroSlide`: setear los 4 campos nuevos.
- En `updateHeroSlide`: agregar el patrón `"cta_position" in data → updateData.ctaPosition = ...` etc., para cada uno de los 4 (respetando null para los colores).

### GATE FASE 2
`npx tsc --noEmit` + `npm run lint` limpios. Mostrar `cat` de las secciones modificadas.

---

# FASE 3 — RENDER LIVE (HeroSlider)

## Modificar: `src/features/catalogo/components/HeroSlider.tsx`

**Cambio 1 — sacar el CTA del bloque de texto.**
Hoy el CTA está anidado dentro de `.hero-copy` (después del subtítulo). Moverlo FUERA de ese bloque y renderizarlo en una **capa propia** hermana, `absolute inset-0`, anclada por la rejilla 3×3:

- Crear un mapa de ancla → clases flex, p. ej.:
```ts
const CTA_ANCHOR: Record<HeroCtaPosition, string> = {
  "top-left": "items-start justify-start",
  "top-center": "items-start justify-center",
  "top-right": "items-start justify-end",
  "middle-left": "items-center justify-start",
  "middle-center": "items-center justify-center",
  "middle-right": "items-center justify-end",
  "bottom-left": "items-end justify-start",
  "bottom-center": "items-end justify-center",
  "bottom-right": "items-end justify-end",
};
```
- La capa: `<div className={cx("absolute inset-0 z-[2] flex p-6 md:p-10 lg:p-14", CTA_ANCHOR[activeSlide.ctaPosition])}>` y dentro el `<Link>` del CTA. (Ajustar el padding a los tokens/espaciados ya usados en el hero; el padding evita que el botón quede pegado al borde.)
- El `z-index` del CTA debe quedar sobre el overlay y a la par del texto (revisar los `z-[2]`/`z-[3]` existentes para no tapar las flechas del carrusel).

**Cambio 2 — colores dinámicos.**
Reemplazar el `style` hardcodeado del `<Link>` por valores del view-model con fallback:
```ts
style={{
  background: activeSlide.ctaBgColor ?? "transparent",
  color: activeSlide.ctaTextColor ?? "#ffffff",
  border: activeSlide.ctaBorderColor ? `1px solid ${activeSlide.ctaBorderColor}` : "none",
  borderRadius: "var(--radius-xl)",
}}
```
Quitar la clase fija `text-white` (el color ahora lo da `style`). La flecha usa `stroke="currentColor"`, así hereda `ctaTextColor` automáticamente — verificarlo.

**Nota responsive:** mantener el botón dentro de la capa con padding; NO posición absoluta por coordenadas.

### GATE FASE 3
`npx tsc --noEmit` + `npm run lint` limpios. Verificar en dev que un slide existente se ve idéntico a antes (gracias al backfill) y que cambiar `cta_position` mueve el botón sin romper mobile. Mostrar evidencia.

---

# FASE 4 — PREVIEW ADMIN (HeroPreview)

## Modificar: `src/features/catalogo/components/hero/HeroPreview.tsx`
Aplicar el MISMO cambio que en `HeroSlider`: sacar el CTA del bloque de texto a una capa anclada por la rejilla 3×3, y aplicar los colores dinámicos. El preview DEBE reflejar exactamente lo que se verá en vivo (misma lógica de anclas y colores), en sus dos `viewMode` (desktop/mobile).

### GATE FASE 4
`npx tsc --noEmit` + `npm run lint` limpios. Confirmar que el preview del admin coincide con el live.

---

# FASE 5 — CONTROLES EN EL ADMIN (HeroAdminEditor)

## Modificar: `src/features/admin/components/landing/HeroAdminEditor.tsx`

**Estado del formulario:** agregar `cta_position`, `cta_bg_color`, `cta_text_color`, `cta_border_color` al estado y al payload (en el patrón existente con `text_position`, `content_theme`, etc.), e inicializarlos desde el slide al editar.

**Control de posición (3×3):** agregar un selector visual de 9 posiciones. Lo más claro para tía Moni: una rejilla 3×3 de botones (como un selector de alineación), donde cada celda corresponde a un `HeroCtaPosition`. Reutilizar el estilo de los `SegmentedControl`/`POSITION_OPTIONS` existentes si encaja, o una rejilla simple de 9 botones con estado activo. Etiqueta: "Posición del botón".

**Controles de color:** 3 inputs de color (fondo, texto, borde). Usar `<input type="color">` + un campo de texto para el hex, o el patrón de input que ya use el proyecto. Cada uno con opción de "sin color/transparente" (null):
- "Color de fondo del botón" (null = transparente)
- "Color del texto del botón"
- "Color del borde" (null = sin borde)

Defaults al crear: `cta_bg_color = "#c8a830"`, `cta_text_color = "#ffffff"`, `cta_border_color = null`, `cta_position = "bottom-left"`.

Estos controles deben empujar al `HeroPreview` en vivo (el preview ya recibe el form como props).

### GATE FASE 5
`npx tsc --noEmit` + `npm run lint` limpios. Verificar flujo completo en dev: editar un slide → mover el botón con la rejilla 3×3 → cambiar los 3 colores → ver el preview actualizarse → guardar → confirmar en `/` (home) que el live refleja los cambios. Mostrar evidencia real.

---

# FASE 6 — VERIFICACIÓN FINAL

- Confirmar que slides preexistentes (post-backfill) se ven idénticos a antes del cambio.
- Probar las 9 posiciones en desktop y mobile (el botón nunca se sale del encuadre).
- Probar fondo transparente (botón estilo link) y con borde.
- Correr la suite Playwright (`home.spec.ts` y la suite completa) para confirmar que el hero sigue pasando.

### GATE FINAL
`tsc` + `lint` limpios + Playwright verde. Resumen clasificado: **Bloqueantes / Importantes / Menores.**

---

## CHECKLIST DE ARCHIVOS

**Modificados**
- `src/shared/config/landing.ts`
- `src/integrations/drizzle/schema/landing.ts`
- `src/features/catalogo/services/landing-service.ts`
- `src/features/catalogo/view-models/hero-view-model.ts`
- `src/features/admin/schemas/landing-schemas.ts`
- `src/features/admin/services/landing-admin-service.ts`
- `src/features/catalogo/components/HeroSlider.tsx`
- `src/features/catalogo/components/hero/HeroPreview.tsx`
- `src/features/admin/components/landing/HeroAdminEditor.tsx`

**Nuevos**
- `drizzle/<siguiente_numero>_hero_cta_controls.sql`

**Paso manual de Christian**
- Aplicar el `.sql` en Supabase SQL Editor ("Run without RLS").
