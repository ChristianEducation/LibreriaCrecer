# PROMPT CATEGORÍA 4 — FOOTER
**Proyecto:** Crecer Librería Cristiana  
**Fecha:** 15 Abril 2026  
**Tarea:** Fix de imagen + estilizar footer alineado al diseñador + info editable desde admin

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz del proyecto)
2. Lee `docs/MASTER-PROMPT.md`
3. Lee `docs/agentes/frontend.md`
4. Lee `docs/agentes/backend.md`
5. Lee `docs/agentes/design-system.md`

Confirma con: *"Contexto absorbido. Stack: Next.js 15 + Drizzle + Supabase + Tailwind v4. Esperando instrucción."*

---

## CONTEXTO

El footer actual (`src/shared/ui/Footer.tsx`) tiene dos bugs que hacen invisible la imagen ilustrativa, y además necesita más información de contacto editable desde el admin. El diseñador entregó un HTML de referencia (`footer-preview-v6.html`) que es la fuente de verdad visual.

Esta tarea tiene 3 cambios independientes. Ejecutar en orden.

---

## CAMBIO 1 — FIX DE LA IMAGEN DEL FOOTER

**Archivo:** `src/shared/ui/Footer.tsx`

**Leer el archivo completo antes de modificar.**

Hay dos errores en el `<img>` dentro del bloque `{hasIllustration ? (...) : null}`:

**Error 1 — Clase Tailwind inválida:**  
`object-left-center` no existe en Tailwind. Reemplazar por `object-left`.

**Error 2 — `mix-blend-multiply` hace la imagen invisible:**  
Este modo de mezcla sobre el fondo `bg-beige-warm` hace que imágenes con tonos claros desaparezcan visualmente. Eliminar `mix-blend-multiply` del className.

Localizar exactamente esta línea:
```tsx
className="h-full object-cover object-left-center mix-blend-multiply"
```

Reemplazar por:
```tsx
className="h-full object-cover object-left"
```

No tocar ningún otro atributo del `<img>` ni la lógica circundante.

---

## CAMBIO 2 — NUEVA TABLA EN BD: `footer_content`

El footer actualmente tiene info de contacto hardcodeada (dirección, links de catálogo, links de info). Esta información debe ser editable desde admin.

### Paso 1 — Schema Drizzle

**Archivo:** `src/integrations/drizzle/schema/landing.ts`

**Leer el archivo completo antes de modificar.**

Agregar la siguiente tabla al final del archivo:

```typescript
export const footerContent = pgTable("footer_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Columna 1: Branding
  brandDescription: text("brand_description"),
  // Columna 2: Catálogo — links separados por ||| (formato: "label::href|||label::href")
  catalogLinks: text("catalog_links"),
  // Columna 3: Información — mismo formato
  infoLinks: text("info_links"),
  // Columna 4: Ubicación
  address: text("address"),
  mapsUrl: text("maps_url"),
  // Footer bottom
  copyrightText: text("copyright_text"),
  designCredit: text("design_credit"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

**Nota sobre el formato de links:** Se usa texto plano con separador `|||` para evitar JSON en el schema. Cada link tiene formato `label::href`. Ejemplo: `"Todos los libros::/productos|||Biblias::/productos?cat=biblias"`.

### Paso 2 — Migración Drizzle

Después de modificar el schema, correr:
```bash
npx drizzle-kit push
```

Si da error de conflicto, usar:
```bash
npx drizzle-kit push --force
```

### Paso 3 — Valores por defecto en código

Los valores actuales del footer hardcodeados son los defaults. Si no hay registro en `footer_content`, el Footer usa estos valores hardcodeados exactamente como están ahora (no se rompe nada si la tabla está vacía).

---

## CAMBIO 3 — API ROUTES para `footer_content`

### Ruta pública (lectura)

**Archivo a crear:** `src/app/api/landing/footer/route.ts`

Devuelve el primer (y único) registro de `footer_content`. Si no existe, devuelve `null`. Usa el patrón estándar del proyecto:

```typescript
// GET /api/landing/footer
// Devuelve: { data: FooterContent | null }
```

Importar `db` desde `@/integrations/drizzle` y `footerContent` desde el schema.

### Ruta admin (lectura + escritura)

**Archivo a crear:** `src/app/api/admin/landing/footer-content/route.ts`

- `GET`: devuelve el registro actual
- `POST/PUT`: upsert — si existe el registro, actualiza; si no, crea uno nuevo

Validar con middleware de auth igual que las otras rutas admin del proyecto (revisar `src/app/api/admin/landing/banners/route.ts` como referencia de patrón).

**Nota:** `footer_content` solo almacena texto — no tiene imágenes propias. La imagen ilustrativa del footer ya la maneja la tabla `banners` con `position = "footer_illustration"` y sus propias API routes existentes. No crear rutas de upload para `footer_content`.

---

## CAMBIO 4 — ACTUALIZAR `Footer.tsx` para consumir la BD

**Archivo:** `src/shared/ui/Footer.tsx`

**Leer el archivo completo antes de modificar.**

### Función de fetch

Agregar una función `getFooterContent()` similar a `getFooterBanner()` ya existente. Llama a `/api/landing/footer` con `cache: "no-store"`.

Define el tipo de retorno con los mismos campos del schema. Si la llamada falla o no hay datos, retorna `null` y se usan los valores hardcodeados.

### Valores hardcodeados como fallback

```typescript
const defaultFooterContent = {
  brandDescription: "Una libreria cristiana pensada para acompanar el estudio, la devocion y la vida diaria con una seleccion curada de titulos.",
  catalogLinks: "Coleccion completa::/productos|||Novedades::/productos?filter=nuevo|||Ofertas::/productos?filter=oferta",
  infoLinks: "Mi carrito::/carrito|||Checkout::/checkout",
  address: "Arturo Prat 470 / Antofagasta, Chile",
  mapsUrl: "https://maps.google.com/?q=Arturo+Prat+470+Antofagasta",
  copyrightText: "© 2026 Crecer Libreria. Todos los derechos reservados.",
  designCredit: "Diseño: Hultur Studio",
};
```

### Función de parseo de links

Crear una pequeña función helper dentro del archivo:

```typescript
function parseLinks(raw: string): { label: string; href: string }[] {
  return raw
    .split("|||")
    .filter(Boolean)
    .map((item) => {
      const [label, href] = item.split("::");
      return { label: label ?? "", href: href ?? "/" };
    });
}
```

### Renderizado

En el JSX, reemplazar los arrays `catalogLinks` e `infoLinks` hardcodeados por el resultado de `parseLinks(content.catalogLinks)` y `parseLinks(content.infoLinks)`. Reemplazar los demás textos hardcodeados por los valores de `content`.

---

## CAMBIO 5 — PÁGINA ADMIN PARA EDITAR FOOTER CONTENT

**Archivo:** `src/app/admin/(panel)/landing/footer/page.tsx`

**Leer el archivo completo antes de modificar.**

La página actual maneja solo la imagen ilustrativa. Agregar una segunda sección debajo del formulario de imagen existente para editar el contenido de texto del footer.

### Nueva sección de formulario

Usar el mismo patrón visual de la página existente. La nueva sección tiene:

**Campos:**
- Descripción del branding (textarea, 3 líneas)
- Links del catálogo (textarea con instrucción: "Un link por línea, formato: `Nombre del link :: /ruta`")
- Links de información (textarea, mismo formato)
- Dirección (input text)
- URL de Google Maps (input text)
- Texto de copyright (input text)
- Crédito de diseño (input text)

**Comportamiento:**
- Al montar la página, también hace `GET /api/admin/landing/footer-content` para cargar los valores actuales
- Al guardar, hace `POST /api/admin/landing/footer-content` con los valores del formulario
- El formato de links en el formulario usa saltos de línea por UX (`Nombre :: /ruta\nNombre 2 :: /ruta2`), pero al guardar se convierte a formato `|||` del schema

**Conversión de formato:**
```typescript
// De UX (textarea) → BD:
const toDbFormat = (raw: string) =>
  raw.split("\n").filter(Boolean).map(l => l.trim().replace(" :: ", "::")).join("|||");

// De BD → UX (textarea):
const toUiFormat = (raw: string) =>
  raw.split("|||").filter(Boolean).map(l => l.replace("::", " :: ")).join("\n");
```

---

## LO QUE NO TOCAR

- ❌ No modificar la lógica de imagen del footer (sliders de opacidad/fade) — ya funciona
- ❌ No modificar las API routes existentes de banners
- ❌ No tocar el layout del footer ni sus estilos visuales — solo los datos

---

## CHECKLIST DE VALIDACIÓN

### Fix imagen
- [ ] `object-left-center` reemplazado por `object-left`
- [ ] `mix-blend-multiply` eliminado
- [ ] La imagen es visible en el footer cuando hay una configurada en admin

### BD y API
- [ ] Tabla `footer_content` creada en el schema
- [ ] `npx drizzle-kit push` ejecutado sin errores
- [ ] `GET /api/landing/footer` responde con `{ data: ... }`
- [ ] `GET /api/admin/landing/footer-content` responde con el registro
- [ ] `POST /api/admin/landing/footer-content` guarda correctamente

### Footer.tsx
- [ ] Consume datos de la BD cuando existen
- [ ] Usa valores hardcodeados como fallback cuando no hay datos
- [ ] Links del catálogo y de info se renderizan desde la BD
- [ ] Textos de dirección, copyright y crédito provienen de la BD

### Admin
- [ ] La sección de contenido aparece en `/admin/landing/footer`
- [ ] Al cargar la página, los campos muestran los valores actuales
- [ ] Al guardar, los cambios se reflejan en el footer del sitio
- [ ] La sección de imagen existente no se rompe

### Calidad de código
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Sin `any`
- [ ] Sin `console.log`
- [ ] Archivos leídos completos antes de modificar

---

*Prompt generado: 15 Abril 2026 — Categoría 4 de 5*
