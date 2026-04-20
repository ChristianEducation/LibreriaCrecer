# PROMPT CATEGORÍA 5 — NUEVAS SECCIONES
**Proyecto:** Crecer Librería Cristiana  
**Fecha:** 15 Abril 2026  
**Tarea:** Filtros "Selección del mes" y "Recién llegados" + página /nosotros

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

Esta tarea tiene dos partes independientes:

**Parte A:** Conectar los links "Selección del mes" y "Recién llegados" del navbar a páginas filtradas de `/productos` en lugar de anclas del landing.

**Parte B:** Crear la página `/nosotros` con CMS simple editable desde admin.

---

# PARTE A — FILTROS DE NAVBAR

## CAMBIO A1 — Nuevo filtro en `product-service.ts`

**Archivo:** `src/features/catalogo/services/product-service.ts`

**Leer el archivo completo antes de modificar.**

### Contexto de la lógica actual

`getProducts()` acepta un objeto `ProductQueryParams`. Internamente `buildProductConditions()` construye las condiciones WHERE. Los filtros actuales son `onlyOnSale` e `isFeatured`, ambos como flags booleanos.

### Qué agregar

Agregar un nuevo parámetro `onlySeleccion?: boolean` al tipo `ProductQueryParams` (buscar dónde está definido ese tipo en `../types` — puede ser `src/features/catalogo/types.ts`).

En `buildProductConditions()`, agregar la condición correspondiente cuando `onlySeleccion === true`:

```typescript
if (onlySeleccion) {
  // Subquery: IDs de productos que están en featured_products con section = 'libros_mes'
  const seleccionSubquery = db
    .select({ productId: featuredProducts.productId })
    .from(featuredProducts)
    .where(
      and(
        eq(featuredProducts.section, "libros_mes"),
        eq(featuredProducts.isActive, true)
      )
    );

  conditions.push(inArray(products.id, seleccionSubquery));
}
```

**Importante:** `featuredProducts` debe importarse desde `@/integrations/drizzle/schema`. Agregar al import existente.

### Orden para "Selección del mes"

Cuando `onlySeleccion === true`, el orden debe ser por `featuredProducts.displayOrder ASC`. Esto requiere modificar `getSortClause()` o manejar el orden directamente en la query. La forma más simple: agregar un caso especial en la página que llame a `getProducts` con `sortBy: "newest"` pero el orden real lo da el JOIN. Si la query sin JOIN ya devuelve resultados correctos, el orden por `displayOrder` es un nice-to-have — priorizarlo solo si no complica el código.

---

## CAMBIO A2 — Actualizar `productos/page.tsx`

**Archivo:** `src/app/(store)/productos/page.tsx`

**Leer el archivo completo antes de modificar.**

Agregar `filter === "seleccion"` al llamado de `getProducts`:

```typescript
getProducts({
  page,
  limit: 40,
  categorySlug: activeCategory || undefined,
  sortBy: filter === "nuevo" ? "newest" : sort,
  search: search || undefined,
  onlyActive: true,
  onlyInStock: true,
  onlyOnSale: filter === "oferta",
  isFeatured: filter === "destacado",
  onlySeleccion: filter === "seleccion",  // ← nuevo
}),
```

---

## CAMBIO A3 — Agregar chip en `FilterBar.tsx`

**Archivo:** `src/features/catalogo/components/FilterBar.tsx`

**Leer el archivo completo antes de modificar.**

El array `filterChips` actualmente tiene: `""`, `"nuevo"`, `"oferta"`, `"destacado"`. Agregar `"seleccion"`:

```typescript
const filterChips = [
  { value: "",           label: "Todos" },
  { value: "nuevo",      label: "Nuevos" },
  { value: "oferta",     label: "En oferta" },
  { value: "destacado",  label: "Recomendados" },
  { value: "seleccion",  label: "Selección del mes" },  // ← nuevo
];
```

---

## CAMBIO A4 — Actualizar links en `Navbar.tsx`

**Archivo:** `src/shared/ui/Navbar.tsx`

**Leer el archivo completo antes de modificar.**

El array `navLinksAfterCategories` actualmente apunta a anclas del landing:

```typescript
const navLinksAfterCategories = [
  { href: "/#libros-mes",       label: "Selección del mes" },
  { href: "/#recien-llegados",  label: "Recién llegados" },
] as const;
```

Reemplazar por:

```typescript
const navLinksAfterCategories = [
  { href: "/productos?filter=seleccion", label: "Selección del mes" },
  { href: "/productos?filter=nuevo",     label: "Recién llegados" },
] as const;
```

También actualizar los mismos links en el **drawer mobile** del navbar — buscar el bloque que itera `navLinksAfterCategories` dentro del panel móvil y verificar que use el mismo array (debería ser automático si itera el mismo array).

---

# PARTE B — PÁGINA /NOSOTROS

## CAMBIO B1 — Schema Drizzle: tabla `about_sections`

**Archivo:** `src/integrations/drizzle/schema/landing.ts`

**Leer el archivo completo antes de modificar.**

Agregar al final del archivo:

```typescript
export const aboutSections = pgTable("about_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  imagePosition: text("image_position").notNull().default("right"), // "left" | "right"
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

Después de modificar el schema, correr:
```bash
npx drizzle-kit push
```

---

## CAMBIO B2 — API routes para `/nosotros`

### Ruta pública (lectura)

**Archivo a crear:** `src/app/api/nosotros/route.ts`

```typescript
// GET /api/nosotros
// Devuelve: { data: AboutSection[] } — solo isActive = true, ordenadas por displayOrder
```

### Rutas admin (CRUD)

**Archivo a crear:** `src/app/api/admin/nosotros/route.ts`
- `GET`: devuelve todas las secciones (activas e inactivas)
- `POST`: crea una nueva sección

**Archivo a crear:** `src/app/api/admin/nosotros/[id]/route.ts`
- `PUT`: actualiza una sección
- `DELETE`: soft delete (`isActive = false`) — nunca DELETE físico

**Archivo a crear:** `src/app/api/admin/nosotros/[id]/imagen/route.ts`
- `POST`: sube imagen a Supabase Storage y actualiza `imageUrl`
- Usar `uploadBannerImage(file, "promo")` desde `@/integrations/supabase/storage` — bucket `banners`, subcarpeta `promo`. No crear buckets nuevos ni funciones de storage nuevas.
- Leer `docs/agentes/supabase.md` antes de implementar esta ruta.

Seguir el mismo patrón de autenticación admin y de respuestas que `src/app/api/admin/landing/banners/route.ts`. Leer ese archivo antes de crear estos.

---

## CAMBIO B3 — Página pública `/nosotros`

**Archivo a crear:** `src/app/(store)/nosotros/page.tsx`

Es un Server Component que fetchea las secciones directamente desde el servicio Drizzle (igual que la página de productos fetchea categorías — excepción documentada en `CLAUDE.md`).

**Estructura de la página:**

```
Hero simple
  ↓
Secciones texto+imagen alternadas (map sobre aboutSections)
  ↓
Call to action (link a /productos)
```

**Hero:**
- Fondo `bg-moss`
- Eyebrow: "Nuestra historia" (texto fijo, no editable)
- Título: "Conócenos" en serif blanco
- Subtítulo: descripción breve fija

**Secciones alternadas (por cada `AboutSection`):**
- Si `imagePosition === "right"`: `[texto izquierda] [imagen derecha]`
- Si `imagePosition === "left"`: `[imagen izquierda] [texto derecha]`
- En mobile: imagen siempre arriba, texto abajo
- Imagen: `next/image` con `aspect-ratio: 4/3`, `object-fit: cover`
- Título de sección: `font-serif text-moss`
- Contenido: `font-sans font-light text-text leading-relaxed`
- Si no hay imagen: solo el texto centrado

**Call to action:**
- Fondo `bg-beige-warm`
- Texto: "Explora nuestra colección"
- Botón que lleva a `/productos`
- Usar componente `Button` de `@/shared/ui`

**Padding:** usar `.page-px` para horizontal y `style={{ paddingTop, paddingBottom }}` para vertical (regla del proyecto).

**Estado vacío:** si no hay secciones activas, mostrar un mensaje simple en lugar de secciones vacías.

---

## CAMBIO B4 — Agregar link "Conócenos" al Navbar

**Archivo:** `src/shared/ui/Navbar.tsx`

**Leer el archivo completo antes de modificar.**

Agregar "Conócenos" como link de navegación desktop y mobile. Colocarlo después de "Categorías" y antes de "Selección del mes".

En el array de links desktop (el bloque `nav` dentro del header), agregar:
```tsx
<Link href="/nosotros" className={cx(...)}>
  Conócenos
</Link>
```

Usar las mismas clases que los demás links del navbar. Marcar como activo cuando `pathname === "/nosotros"`.

En el drawer mobile, agregar el link con el mismo patrón que los demás links del menú.

---

## CAMBIO B5 — Página admin para gestionar secciones

**Archivo a crear:** `src/app/admin/(panel)/nosotros/page.tsx`

Página Client Component que sigue el patrón de `src/app/admin/(panel)/landing/seleccion/page.tsx`. Leer ese archivo antes de crear este.

**Funcionalidades:**
- Listado de secciones con título, posición de imagen y toggle activo/inactivo
- Formulario para crear nueva sección: título, contenido (textarea), posición imagen (select: izquierda/derecha), upload de imagen
- Botón editar por sección (edita inline o en formulario)
- Botón eliminar (soft delete)
- No necesita reordenamiento drag-and-drop por ahora — el `displayOrder` se asigna automáticamente como el siguiente entero disponible

**Usar componentes admin existentes:** `AdminTable`, `AdminToggle`, `AdminUploadZone` desde `@/features/admin/components`.

---

## CAMBIO B6 — Agregar link en el admin landing index

**Archivo:** `src/app/admin/(panel)/landing/page.tsx`

**Leer el archivo completo antes de modificar.**

Este archivo lista las secciones de admin del landing. Agregar un link a la nueva página de nosotros. Pero `/nosotros` no es estrictamente "landing" — agregar el link en el layout del admin general o crear una nueva sección "Páginas".

**Opción más simple:** Agregar directamente en `src/app/admin/(panel)/page.tsx` (dashboard del admin) un card que diga "Página Conócenos" y apunte a `/admin/nosotros`. Si ese archivo no existe o es muy diferente, agregarlo en `landing/page.tsx` con una nota.

Leer el archivo del dashboard admin (`src/app/admin/(panel)/page.tsx`) para ver el patrón actual.

---

## CHECKLIST DE VALIDACIÓN

### Parte A — Filtros navbar

- [ ] `onlySeleccion` agregado a `ProductQueryParams` en types
- [ ] `buildProductConditions` tiene la condición con subquery a `featured_products`
- [ ] `featuredProducts` importado en `product-service.ts`
- [ ] `productos/page.tsx` pasa `onlySeleccion: filter === "seleccion"`
- [ ] `FilterBar.tsx` muestra chip "Selección del mes"
- [ ] Navbar desktop: links apuntan a `/productos?filter=seleccion` y `/productos?filter=nuevo`
- [ ] Navbar mobile (drawer): mismos links actualizados
- [ ] `/productos?filter=seleccion` muestra solo los productos de `featured_products` con `section = 'libros_mes'`
- [ ] `/productos?filter=nuevo` sigue funcionando igual que antes

### Parte B — Página /nosotros

- [ ] Tabla `about_sections` creada (`npx drizzle-kit push` ejecutado)
- [ ] `GET /api/nosotros` devuelve secciones activas
- [ ] CRUD admin en `/api/admin/nosotros/` funciona
- [ ] Upload de imagen funciona en `/api/admin/nosotros/[id]/imagen`
- [ ] Página `/nosotros` renderiza correctamente con y sin secciones
- [ ] Layout alternado funciona (imagen izquierda/derecha según `imagePosition`)
- [ ] En mobile, imagen siempre arriba
- [ ] Estado vacío muestra mensaje en lugar de layout roto
- [ ] Link "Conócenos" visible en navbar desktop y mobile
- [ ] Página admin `/admin/nosotros` permite crear, editar y desactivar secciones

### Calidad de código

- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Sin `any`
- [ ] Sin `console.log`
- [ ] Soft delete siempre — nunca DELETE físico en `about_sections`
- [ ] Archivos leídos completos antes de modificar

---

*Prompt generado: 15 Abril 2026 — Categoría 5 de 5*
