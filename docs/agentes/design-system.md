# AGENTE: SISTEMA DE DISEÑO

## Antes de escribir cualquier línea

1. Lee `docs/HANDOFF-v01.md` — estado actual del proyecto
2. Lee `docs/agentes/CLAUDE.md` — reglas globales

Este archivo es la **fuente única de verdad** para decisiones visuales. Siempre leerlo antes de crear o modificar componentes de UI.

---

## Identidad visual

Librería católica en Antofagasta. El tono es cálido, editorial y sobrio — no comercial ni recargado. La paleta mezcla beige antiguo con dorado y verde musgo. La tipografía serif (EB Garamond) aporta carácter literario; DM Sans equilibra con legibilidad moderna.

---

## Paleta de colores

Definida en `src/app/globals.css` bajo `@theme inline`. Sin `tailwind.config.ts`.

### Colores principales

| Token Tailwind | Variable CSS | Hex | Uso |
|---|---|---|---|
| `bg-beige` / `text-beige` | `--color-beige` | `#f5f3e8` | Fondo del sitio |
| `bg-beige-warm` | `--color-beige-warm` | `#ede9d4` | Fondos alternos, hover suave |
| `bg-beige-mid` | `--color-beige-mid` | `#e0dbb8` | Bordes suaves, divisores |
| `bg-white` / `text-white` | `--color-white` | `#faf9f4` | Blanco cálido — cards, inputs |
| `text-moss` / `bg-moss` | `--color-moss` | `#736002` | Verde oscuro — textos importantes, botones |
| `bg-moss-mid` | `--color-moss-mid` | `#8a7302` | Hover de moss |
| `text-gold` / `bg-gold` | `--color-gold` | `#c8a830` | Acento principal — precios, eyebrows, botones primarios |
| `bg-gold-light` | `--color-gold-light` | `#d4b840` | Hover de gold |
| `bg-gold-pale` | `--color-gold-pale` | `#e8d060` | Gold muy suave |
| `text-text` | `--color-text` | `#3a3001` | Texto body principal |
| `text-text-mid` | `--color-text-mid` | `#6b5a04` | Texto secundario |
| `text-text-light` | `--color-text-light` | `#8a7830` | Texto terciario, placeholders |
| `border-border` | `--color-border` | `rgba(115,96,2,0.13)` | Borde estándar |
| `border-border-gold` | `--color-border-gold` | `rgba(200,168,48,0.3)` | Borde con acento dorado |

### Colores de estado

| Token Tailwind | Hex | Uso |
|---|---|---|
| `text-success` / `bg-success` | `#27ae60` | Éxito, pagado, activo |
| `text-error` / `bg-error` | `#c0392b` | Error, cancelado |
| `text-info` / `bg-info` | `#2980b9` | Información, preparando |
| `text-warning` / `bg-warning` | `#e67e22` | Advertencia, pendiente |

---

## Tipografía

### Fuentes

| Rol | Fuente | Variable | Clase Tailwind |
|---|---|---|---|
| Headings | EB Garamond | `--font-serif` | `font-serif` |
| Body / UI | DM Sans | `--font-sans` | `font-sans` (default) |
| Monospace | Geist Mono | `--font-mono` | `font-mono` |

### Escala tipográfica usada en el proyecto

```tsx
// Eyebrow — label pequeño sobre headings
<p className="text-[9px] uppercase tracking-[0.3em] text-gold" />
// con línea decorativa:
<p className="flex items-center gap-3 text-eyebrow uppercase tracking-[0.35em] text-gold">
  <span className="h-px w-6 bg-gold" />
  <span>Novedades</span>
</p>

// H1 — hero y detalle de producto
<h1 className="font-serif text-[clamp(28px,3vw,40px)] leading-[1.1] tracking-[-0.01em] text-moss" />

// H2 — secciones del landing
<h2 className="font-serif text-[clamp(28px,2.8vw,42px)] leading-[1.15] tracking-[-0.01em] text-moss" />

// H2 admin
<h1 className="font-serif text-[2rem] leading-none text-text" />

// Body normal
<p className="text-sm font-light leading-[1.7] text-text-light" />

// Label de input
<label className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-light" />

// Precio con descuento
<span className="text-[12px] text-text-light line-through">{formatCLP(original)}</span>
<span className="text-[14px] font-medium text-gold">{formatCLP(sale)}</span>

// Precio sin descuento
<p className="text-[14px] font-medium text-gold">{formatCLP(price)}</p>

// Texto pequeño — metadata de producto
<p className="text-[10px] tracking-[0.03em] text-text-light" />
```

---

## Forma y espaciado

### Border radius

```
--radius:      2px   → clase `rounded` — TODO el sitio usa esto
--radius-hero: 16px  → única excepción, hero cards solamente
```

**Nunca usar** `rounded-md`, `rounded-lg`, `rounded-full` salvo que el componente lo justifique explícitamente (ej: pills de estado en admin usan `rounded-[20px]`).

### Padding de sección — regla crítica

```tsx
// ✅ Padding horizontal — siempre .page-px
<section className="page-px py-12">

// ✅ Padding vertical con valor único — style inline
<div style={{ paddingTop: "clamp(3rem, 6vw, 5rem)" }}>

// ❌ Nunca esto — Turbopack + Tailwind v4 no lo compila confiablemente
<section className="px-5 md:px-10 lg:px-14">
```

`.page-px` = `padding-inline: clamp(1.25rem, 5vw, 3.5rem)` — definido en `globals.css`.

---

## Componentes compartidos — `src/shared/ui/`

### Button

```tsx
import { Button } from "@/shared/ui";

// Variantes disponibles
<Button variant="primary">      // gold — acción principal
<Button variant="moss">         // moss — acción secundaria importante
<Button variant="outline">      // borde moss, fondo transparente
<Button variant="ghost">        // solo texto con borde inferior, mayúsculas
<Button variant="secondary">    // versión ghost para fondos oscuros
<Button variant="add-to-cart">  // gold con scale hover — solo ProductCard

// Tamaños
<Button size="sm">   // min-h-9, text-[11px]
<Button size="md">   // min-h-11, text-[12px] — default
<Button size="lg">   // min-h-12, text-[12px]

// Props adicionales
<Button loading={isLoading}>        // spinner + disabled automático
<Button as="a" href="/ruta">        // renderiza como <a>
<Button disabled>                   // opacidad 50%
<Button type="submit">              // para formularios
```

### Input / Textarea

```tsx
import { Input, Textarea } from "@/shared/ui";

// Input básico con label y error
<Input
  label="Nombre"
  error={errors.nombre?.message}
  hint="Texto de ayuda opcional"
  {...register("nombre")}
/>

// Textarea
<Textarea
  label="Descripción"
  rows={6}
  error={errors.descripcion?.message}
  {...register("descripcion")}
/>

// Estados visuales automáticos:
// Normal:  border-border, focus ring gold/10
// Error:   border-error, focus ring error/10
```

### Badge

```tsx
import { Badge } from "@/shared/ui";

<Badge variant="new">Nuevo</Badge>       // fondo gold, texto blanco
<Badge variant="sale">Oferta</Badge>     // fondo moss, texto blanco
<Badge variant="success">OK</Badge>      // verde semitransparente
<Badge variant="error">Error</Badge>     // rojo semitransparente
<Badge variant="warning">Atención</Badge>// naranja semitransparente
<Badge variant="info">Info</Badge>       // azul semitransparente
```

### SectionHeader

```tsx
import { SectionHeader } from "@/shared/ui";

// Con eyebrow y título
<SectionHeader
  eyebrow="Novedades"
  title="Lo último en tienda"
/>

// Con énfasis en italic
<SectionHeader
  eyebrow="Selección"
  title="Lo último"
  titleEm="en tienda"     // se renderiza en <em> italic al final del título
/>

// Con descripción y centrado
<SectionHeader
  eyebrow="Categorías"
  title="Explora nuestra colección"
  description="Libros para cada etapa del camino espiritual."
  align="center"
/>
```

### Separator

```tsx
import { Separator } from "@/shared/ui";
<Separator />  // línea decorativa con acento dorado
```

### Toast

```tsx
import { useToast } from "@/shared/hooks";

const { toast } = useToast();
toast({ message: "Guardado correctamente", variant: "success" });
toast({ message: "No se pudo guardar", variant: "error" });
toast({ message: "Revisa los datos", variant: "warning" });
```

---

## Componentes admin — `src/features/admin/components/`

### AdminStatusPill

```tsx
import { AdminStatusPill } from "@/features/admin/components";

// Estados de orden
<AdminStatusPill status="pending" />    // naranja — "Pendiente"
<AdminStatusPill status="paid" />       // verde   — "Pagado"
<AdminStatusPill status="preparing" />  // azul    — "Preparando"
<AdminStatusPill status="shipped" />    // morado  — "Enviado"
<AdminStatusPill status="delivered" />  // verde   — "Entregado"
<AdminStatusPill status="cancelled" />  // rojo    — "Cancelado"

// Estados de entidad
<AdminStatusPill status="active" />     // verde   — "Activo"
<AdminStatusPill status="inactive" />   // gris    — "Inactivo"

// Con texto personalizado
<AdminStatusPill status="paid">Confirmado</AdminStatusPill>
```

### AdminMetricCard

```tsx
import { AdminMetricCard } from "@/features/admin/components";

<AdminMetricCard label="Ventas hoy" value={formatCLP(stats.salesToday)} />
<AdminMetricCard label="Pedidos pendientes" value={stats.byStatus.pending} />
```

### AdminUploadZone

```tsx
import { AdminUploadZone } from "@/features/admin/components";

<AdminUploadZone
  onFileSelect={(file) => handleUpload(file)}
  accept="image/jpeg,image/png,image/webp"
  currentImageUrl={product.mainImageUrl}
/>
```

### AdminToggle

```tsx
import { AdminToggle } from "@/features/admin/components";

<AdminToggle
  checked={isActive}
  onChange={(val) => setIsActive(val)}
  label="Activo"
/>
```

---

## Patrones visuales del sitio

### Animación de entrada

```tsx
import { useScrollReveal } from "@/shared/hooks";

// Cualquier elemento que deba animarse al entrar al viewport
const revealRef = useScrollReveal<HTMLDivElement>();
<div className="reveal" ref={revealRef}>...</div>
```

### Fallback de imagen de producto

```tsx
// Cuando no hay imagen, mostrar ícono de libro
function BookFallbackIcon() {
  return (
    <div className="flex h-full items-center justify-center">
      <svg aria-hidden="true" className="h-10 w-10 text-moss/30" ...>
        {/* path de libro abierto */}
      </svg>
    </div>
  );
}
```

### Imagen de producto

```tsx
<div className="relative aspect-[2/3] overflow-hidden rounded bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))] shadow-[2px_4px_16px_rgba(58,48,1,0.09)]">
  <Image alt={title} className="object-cover" fill sizes="..." src={url} />
</div>
```

### Eyebrow con línea decorativa

```tsx
<p className="flex items-center gap-[10px] text-[9px] uppercase tracking-[0.3em] text-gold">
  <span className="h-px w-5 bg-gold" />
  <span>Categoría</span>
</p>
```

### Carrusel — botones prev/next

```tsx
// Usar clase global .carousel-nav-btn definida en globals.css
<button className="carousel-nav-btn" onClick={prev} type="button">
  {/* ícono flecha izquierda */}
</button>
<button className="carousel-nav-btn" onClick={next} type="button">
  {/* ícono flecha derecha */}
</button>
```

---

## Íconos

El proyecto **no usa librerías de íconos**. Todos los íconos son SVG inline con estas convenciones:

```tsx
// Tamaño con clase Tailwind
<svg className="size-4" ...>     // 16px
<svg className="size-[22px]" ...> // 22px custom
<svg className="h-10 w-10" ...>  // 40px

// Siempre con aria-hidden en íconos decorativos
<svg aria-hidden="true" fill="none" viewBox="0 0 24 24">

// Stroke style del proyecto
stroke="currentColor"
strokeWidth="1.5"
strokeLinecap="round"
strokeLinejoin="round"
```

---

## Reglas visuales globales

- **Solo light mode** — no implementar dark mode
- **Un solo color de acento:** gold (`#c8a830`) — no introducir colores nuevos sin justificación
- **Transiciones:** `transition-colors duration-200` o `transition-all duration-200 ease-out` en elementos interactivos
- **Hover en cards:** `-translate-y-1` + shadow más profunda — patrón de `ProductCard`
- **Mobile-first:** diseñar para móvil y escalar con breakpoints `md:` y `lg:`
- **No usar** `rounded-md`, `rounded-lg` — el sistema usa `2px` en todo

---

*Agente design system — Crecer Librería Cristiana — Abril 2026*
