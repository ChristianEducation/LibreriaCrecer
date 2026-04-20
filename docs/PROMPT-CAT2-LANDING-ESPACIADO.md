# PROMPT CATEGORÍA 2 — LANDING: ESPACIADO & DISEÑO
**Proyecto:** Crecer Librería Cristiana  
**Fecha:** 15 Abril 2026  
**Tarea:** Alinear padding de secciones, corregir QuoteSection, y ajustar buscador en Navbar

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz del proyecto)
2. Lee `docs/MASTER-PROMPT.md`
3. Lee `docs/agentes/frontend.md`
4. Lee `docs/agentes/design-system.md`

Confirma con: *"Contexto absorbido. Stack: Next.js 15 + Drizzle + Supabase + Tailwind v4. Esperando instrucción."*

---

## CONTEXTO

El index HTML del diseñador es la fuente de verdad visual del proyecto. Define estos valores de espaciado para las secciones del landing:

```css
/* Desktop */
.section       { padding: 80px 56px; }
.quote-section { padding: 100px 56px; }

/* Mobile (≤768px) */
.section       { padding: 56px 24px; }
.quote-section { padding: 64px 24px; }
```

El horizontal ya está cubierto por la clase `.page-px` del proyecto (`padding-inline: clamp(1.25rem, 5vw, 3.5rem)`). Solo hay que corregir el **padding vertical**.

Regla del proyecto (de `CLAUDE.md`): usar `style={{ paddingTop, paddingBottom }}` para valores de padding vertical en secciones, NO clases `py-*` de Tailwind.

---

## CAMBIOS A REALIZAR

### CAMBIO 1 — `RecentProductsCarousel.tsx`

**Archivo:** `src/features/catalogo/components/RecentProductsCarousel.tsx`

**Leer el archivo completo antes de modificar.**

Localizar esta línea exacta en el wrapper `<section>`:

```tsx
<section className="page-px bg-white" id="recien-llegados" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
```

Reemplazar por:

```tsx
<section className="page-px bg-white" id="recien-llegados" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
```

> `5rem` = 80px desktop. El `page-px` ya maneja el horizontal.

---

### CAMBIO 2 — `LibrosMesSection.tsx`

**Archivo:** `src/features/catalogo/components/LibrosMesSection.tsx`

**Leer el archivo completo antes de modificar.**

Localizar esta línea exacta en el wrapper `<section>`:

```tsx
<section className="page-px bg-white" id="libros-mes" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
```

Reemplazar por:

```tsx
<section className="page-px bg-white" id="libros-mes" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
```

---

### CAMBIO 3 — `CategoryCarousel.tsx`

**Archivo:** `src/features/catalogo/components/CategoryCarousel.tsx`

**Leer el archivo completo antes de modificar.**

Localizar esta línea exacta en el wrapper `<section>`:

```tsx
<section className="page-px bg-beige" id="categorias" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
```

Reemplazar por:

```tsx
<section className="page-px bg-beige" id="categorias" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
```

---

### CAMBIO 4 — `QuoteSection.tsx`

**Archivo:** `src/features/catalogo/components/QuoteSection.tsx`

**Leer el archivo completo antes de modificar.**

Este componente tiene dos problemas:
1. Padding horizontal hardcodeado con clases Tailwind (`px-5 md:px-10 lg:px-14`) en lugar de `page-px`
2. Padding vertical inconsistente con el diseñador (`py-20 md:py-24` = 80px/96px, debe ser 100px)
3. La imagen de fondo tiene `opacity-[0.08] mix-blend-screen` — muy sutil. Reemplazar por un overlay oscuro real que permita leer el texto con claridad, alineado con el estilo del HeroSlider

Reemplazar el `<section>` completo:

**ANTES:**
```tsx
<section className="relative overflow-hidden bg-moss px-5 py-20 md:px-10 md:py-24 lg:px-14">
  {backgroundImageUrl ? (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-cover bg-center opacity-[0.08] mix-blend-screen"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    />
  ) : null}
```

**DESPUÉS:**
```tsx
<section
  className="page-px relative overflow-hidden bg-moss"
  style={{ paddingTop: "6.25rem", paddingBottom: "6.25rem" }}
>
  {backgroundImageUrl ? (
    <>
      {/* Imagen de fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      />
      {/* Overlay oscuro — permite leer el texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "rgba(30,24,0,0.62)" }}
      />
    </>
  ) : null}
```

> `6.25rem` = 100px. El overlay `rgba(30,24,0,0.62)` es oscuro y cálido, alineado con la paleta del proyecto.

---

### CAMBIO 5 — `Navbar.tsx` (buscador desktop)

**Archivo:** `src/shared/ui/Navbar.tsx`

**Leer el archivo completo antes de modificar.**

El buscador desktop actualmente tiene `max-w-[420px]`. Según el diseñador: `flex: 1; max-width: 300px`.

Localizar el `<form>` del buscador desktop (buscar `hidden w-full max-w-[420px]`):

```tsx
<form
  className="relative hidden w-full max-w-[420px] flex-1 lg:block"
  onSubmit={handleSearch}
>
```

Reemplazar por:

```tsx
<form
  className="relative hidden flex-1 lg:block"
  style={{ maxWidth: "300px" }}
  onSubmit={handleSearch}
>
```

> Usar `style` para el `maxWidth` siguiendo la regla del proyecto de no usar valores arbitrarios en Tailwind v4.

---

## LO QUE NO TOCAR

- ❌ No modificar el overlay del `HeroSlider.tsx` — ya está correcto
- ❌ No modificar la lógica de ningún componente — solo padding y estilos visuales
- ❌ No cambiar el padding horizontal — `.page-px` ya lo maneja
- ❌ No tocar APIs, servicios, ni lógica de negocio

---

## CHECKLIST DE VALIDACIÓN

Al terminar, verificar punto por punto:

### Secciones del landing
- [ ] `RecentProductsCarousel`: padding vertical `5rem` arriba y abajo
- [ ] `LibrosMesSection`: padding vertical `5rem` arriba y abajo
- [ ] `CategoryCarousel`: padding vertical `5rem` arriba y abajo
- [ ] Las 3 secciones mantienen `page-px` y sus clases de color de fondo

### QuoteSection
- [ ] Usa `page-px` para padding horizontal (eliminadas las clases `px-5 md:px-10 lg:px-14`)
- [ ] Padding vertical `6.25rem` (100px) usando `style`
- [ ] Cuando hay `backgroundImageUrl`: se ve la imagen + overlay oscuro encima
- [ ] Cuando NO hay `backgroundImageUrl`: fondo `bg-moss` sólido sin cambios
- [ ] El texto de la cita sigue siendo legible sobre el overlay

### Navbar buscador
- [ ] Buscador desktop con `maxWidth: "300px"` via `style`
- [ ] Buscador sigue funcionando (busca al submit)
- [ ] En mobile, el buscador del drawer no se toca

### Calidad de código
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Sin clases arbitrarias nuevas con `[]` en Tailwind
- [ ] Sin `console.log`
- [ ] Sin `any`

---

*Prompt generado: 15 Abril 2026 — Categoría 2 de 5*
