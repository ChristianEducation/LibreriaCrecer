# SPEC — CONÓCENOS: REDISEÑO + TARJETAS EDITABLES
**Proyecto:** Crecer Librería Cristiana
**Fecha:** 29 Junio 2026
**Tarea:** Rediseñar la página Conócenos con el texto real de la clienta, y agregar un bloque de "tarjetas de oferta" editables desde el admin (ícono + título + descripción + enlace opcional).
**Migración:** `0009_about_offerings.sql`

---

## DECISIONES CERRADAS (híbrido)

- **Texto principal (hero + propósito):** va escrito en la página, NO editable desde admin. Es la identidad de la librería, se escribe una vez. (Si la clienta lo quiere editable después, es otro spec.)
- **Tarjetas "Queremos ofrecer":** SÍ editables desde admin (crear, editar, ordenar, publicar/ocultar, eliminar). Pre-cargadas con las 4 de la clienta.
- **Reutilizamos la tabla `about_sections`** con un campo discriminador `section_type` (`'story'` | `'offering'`). Las "stories" actuales no cambian; las "offerings" son el tipo nuevo.
- **Ícono:** editable desde un set fijo de íconos (dropdown en el admin). NO ícono libre.
- **Enlace:** opcional por tarjeta (`link_url` + `link_label`). Ej: "Espacios de encuentro" → `/encuentros`.

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz)
2. Lee `docs/MASTER-PROMPT.md`
3. Lee `docs/agentes/frontend.md`, `backend.md`, `design-system.md`

**Archivos que vas a tocar — léelos COMPLETOS antes de modificar:**
- `src/integrations/drizzle/schema/landing.ts` (tabla `aboutSections`)
- `src/app/(store)/nosotros/page.tsx` (página pública)
- `src/app/admin/(panel)/nosotros/page.tsx` (admin)
- `src/app/api/admin/nosotros/route.ts` (GET lista + POST crear)
- `src/app/api/admin/nosotros/[id]/route.ts` (PUT + DELETE)
- `src/app/globals.css` (clases `.about-*` — buscar todas)

Confirma con: *"Contexto absorbido. about_sections hoy es solo 'stories' con CRUD inline en las rutas. Listo para FASE 0."*

---

## REGLAS DEL PROYECTO (NO VIOLAR)

- **Archivos completos siempre.** Prohibido `// ... existing code`.
- **Migración:** NO `drizzle-kit push`. SQL como `drizzle/0009_about_offerings.sql`, aplicado manualmente.
- **Padding vertical:** `style={{ paddingTop, paddingBottom }}` inline, nunca `py-`.
- Tras CADA fase: `npx tsc --noEmit` + `npm run lint` limpios.
- **EVIDENCIA REAL OBLIGATORIA** al cerrar cada fase.
- **No tocar** nada fuera de Conócenos.

---

# FASE 0 — SCHEMA + MIGRACIÓN + BACKFILL DE LAS 4 TARJETAS

## Modificar: `src/integrations/drizzle/schema/landing.ts`
Agregar a `aboutSections`:
```ts
sectionType: text("section_type").notNull().default("story"),  // "story" | "offering"
icon: text("icon"),         // nombre de ícono (solo offerings)
linkUrl: text("link_url"),  // enlace opcional (solo offerings)
linkLabel: text("link_label"),
```

## Entregable: `drizzle/0009_about_offerings.sql`
```sql
ALTER TABLE "about_sections"
ADD COLUMN "section_type" text NOT NULL DEFAULT 'story',
ADD COLUMN "icon" text,
ADD COLUMN "link_url" text,
ADD COLUMN "link_label" text;

-- Las filas existentes quedan como 'story' por el default. Correcto.

-- Pre-cargar las 4 tarjetas de oferta de la clienta:
INSERT INTO "about_sections"
  ("title", "content", "section_type", "icon", "display_order", "is_active")
VALUES
  ('Selección de libros',
   'Material pastoral, recursos catequéticos y artículos religiosos para acompañar el crecimiento personal, familiar y comunitario.',
   'offering', 'books', 0, true),
  ('Espacios de encuentro',
   'Presentaciones de libros, conversaciones con autores y actividades que favorecen la reflexión sobre la fe, la cultura y nuestro tiempo.',
   'offering', 'users', 1, true),
  ('Cuentacuentos',
   'Actividades para los más pequeños que buscan despertar el amor por la lectura, estimular la imaginación y fortalecer valores en familia.',
   'offering', 'book', 2, true),
  ('Jornadas de retiro',
   'Para adultos que deseen profundizar su vida espiritual en un espacio de silencio, oración y encuentro interior.',
   'offering', 'heart', 3, true);
```

Christian lo aplica en Supabase SQL Editor con "Run without RLS".

**Nota:** `content` es `NOT NULL` en la tabla actual, por eso las offerings traen descripción. `imageUrl`/`imagePosition` quedan en sus defaults (no se usan en offerings).

### GATE FASE 0
`npx tsc --noEmit` limpio. Mostrar `grep` del schema + `cat` del SQL.

---

# FASE 1 — SET DE ÍCONOS + CONFIG

## Crear/Modificar: `src/shared/config/about.ts` (o donde calcen las constantes de landing)
Definir el set fijo de íconos disponibles para las tarjetas:
```ts
export const ABOUT_OFFERING_ICONS = [
  "books", "users", "book", "heart", "bulb", "cross",
  "calendar", "message", "star", "gift",
] as const;
export type AboutOfferingIcon = (typeof ABOUT_OFFERING_ICONS)[number];
```
Mapear cada nombre a un SVG inline (o al sistema de íconos que ya use el proyecto — **verificar si hay un componente de íconos existente**, ej. `SidebarIcon` en admin, y reutilizar el patrón). Si el proyecto no tiene un set de íconos público reutilizable, crear un componente `AboutIcon` que reciba `name: AboutOfferingIcon` y renderice el SVG correspondiente (stroke, 24px, `currentColor`).

### GATE FASE 1
`tsc` + `lint` limpios. Mostrar `cat` del config/componente de íconos.

---

# FASE 2 — API ADMIN (extender CRUD para offerings)

Las rutas de `nosotros` hoy validan inline. Extenderlas para soportar los campos nuevos.

## Modificar: `src/app/api/admin/nosotros/route.ts`
- `GET`: ya devuelve todo; confirmar que incluye los campos nuevos (al ser `select()` completo, ya los trae).
- `POST`: aceptar `sectionType`, `icon`, `linkUrl`, `linkLabel` en el body. Validar:
  - `sectionType` ∈ `{"story","offering"}` (default "story").
  - Si `sectionType === "offering"`: `icon` debe ser uno de `ABOUT_OFFERING_ICONS`. `title` y `content` siguen requeridos. `linkUrl`/`linkLabel` opcionales.

## Modificar: `src/app/api/admin/nosotros/[id]/route.ts`
- `PUT`: aceptar y actualizar los campos nuevos (`sectionType`, `icon`, `linkUrl`, `linkLabel`) con el patrón de update parcial.
- `DELETE`: sin cambios (ya borra por id).

### GATE FASE 2
`tsc` + `lint` limpios. Mostrar `cat` de la ruta principal y `grep -n "sectionType\|icon\|linkUrl" src/app/api/admin/nosotros/route.ts`.

---

# FASE 3 — ADMIN UI (gestionar las tarjetas)

## Modificar: `src/app/admin/(panel)/nosotros/page.tsx`
El admin hoy gestiona "stories". Extenderlo para gestionar también "offerings":

- **Separar visualmente** las dos secciones en el admin: "Historias" (stories) y "Tarjetas de oferta" (offerings). Pueden ser dos listas en la misma página, o un filtro/tab. Lo más simple: dos bloques en la misma página, cada uno con su lista y su botón "Nueva".
- **Formulario de offering:** título, descripción (textarea), selector de ícono (dropdown con los `ABOUT_OFFERING_ICONS`, mostrando el ícono al lado del nombre), enlace opcional (`link_url` + `link_label`), toggle publicar/ocultar, orden (reorder con el patrón existente del admin).
- El formulario de offering NO muestra los campos de imagen (esos son solo para stories).
- Al crear una offering, mandar `sectionType: "offering"` en el POST.

**Reutilizar** el patrón de formulario, reorder y toggle que ya existe en este mismo archivo para stories — no inventar mecánica nueva.

### GATE FASE 3
`tsc` + `lint` limpios. Verificar en dev: crear una tarjeta de oferta, editarla, cambiar su ícono, ocultarla. Mostrar evidencia.

---

# FASE 4 — PÁGINA PÚBLICA (rediseño + render de tarjetas)

## Modificar: `src/app/(store)/nosotros/page.tsx`

**1. Texto del hero y propósito** — reemplazar el texto actual por el de la clienta:
- Hero título: "Un llamado que se transformó en un **Sí**" (el "Sí" en `<em>`).
- Hero descripción: el párrafo de origen (Librería Crecer nace en Antofagasta… el anhelo de crecer que habita en toda persona).
- Sección propósito (la que hoy es "manifesto"): eyebrow "Nuestro propósito", lead con el texto de "Lo que nos inspira" (Nos inspira el deseo de colaborar con la misión evangelizadora…), y copy con el segundo párrafo (Creemos que cada persona posee una dignidad única…).

**2. Bloque nuevo de tarjetas de oferta** — entre el propósito y las historias:
- Query: traer las `aboutSections` con `sectionType = "offering"`, `isActive = true`, ordenadas por `displayOrder`.
- Eyebrow "Lo que hacemos" + título "Queremos ofrecer".
- Grilla responsive (`repeat(auto-fit, minmax(200px, 1fr))`), cada tarjeta: ícono (componente `AboutIcon`), título en serif, descripción, y si tiene `linkUrl`, un enlace al final con `linkLabel`.
- Padding vertical inline.
- Estética: clonar los tokens del proyecto (beige/moss/gold, Garamond para títulos). Referencia visual: el preview ya aprobado por Christian (tarjetas blancas, radio 12px, ícono en cuadro beige, borde hairline).

**3. Las historias (stories)** — el bloque existente sigue igual, pero la query debe filtrar `sectionType = "story"` para no mezclar offerings entre las historias.

**4. CTA final** — sin cambios (ya enlaza a /productos).

**IMPORTANTE:** la query actual de la página trae TODAS las `about_sections`. Hay que separarla en dos: una para offerings, otra para stories (ambas filtrando por `sectionType`). Si no se filtra, las 4 tarjetas aparecerían también como "historias" con imagen vacía.

### GATE FASE 4
`tsc` + `lint` limpios. Verificar en dev: `/nosotros` muestra hero nuevo, propósito, las 4 tarjetas en grilla, las historias (si hay), y el CTA. Las tarjetas NO aparecen duplicadas en el bloque de historias. Mostrar evidencia.

---

# CHECKLIST DE ARCHIVOS

**Modificados:**
- `src/integrations/drizzle/schema/landing.ts`
- `src/app/api/admin/nosotros/route.ts`
- `src/app/api/admin/nosotros/[id]/route.ts`
- `src/app/admin/(panel)/nosotros/page.tsx`
- `src/app/(store)/nosotros/page.tsx`
- `src/app/globals.css` (clases nuevas para las tarjetas de oferta)

**Nuevos:**
- `drizzle/0009_about_offerings.sql`
- `src/shared/config/about.ts` (set de íconos)
- `src/shared/ui/AboutIcon.tsx` (o reutilizar set existente)

**Paso manual de Christian:**
- Aplicar `drizzle/0009_about_offerings.sql` en Supabase SQL Editor ("Run without RLS"). Esto crea las columnas Y pre-carga las 4 tarjetas.
