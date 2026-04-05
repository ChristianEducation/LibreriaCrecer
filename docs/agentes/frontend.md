# AGENTE: FRONTEND & UI

## Antes de escribir cualquier línea

1. Lee `docs/HANDOFF-v01.md` — estado actual del proyecto
2. Lee `docs/agentes/CLAUDE.md` — reglas globales
3. Lee `docs/agentes/design-system.md` — paleta, tipografía y componentes

---

## Decisión: ¿Server Component o Client Component?

```
Server Component (default — sin 'use client')
  ✅ Páginas del catálogo (home, listado, detalle)
  ✅ Layouts (store, checkout, admin)
  ✅ Cualquier componente que solo muestra datos del servidor

Client Component ('use client' en la primera línea)
  ✅ Carrito, formularios, modales, tooltips
  ✅ Cualquier cosa que use useState, useEffect, useRouter
  ✅ Componentes que leen del store de Zustand
```

**Regla:** Empezar siempre como Server Component. Agregar `'use client'` solo cuando sea estrictamente necesario.

---

## Estructura de un componente

```tsx
// Server Component (sin directiva)
import Image from "next/image";
import { formatCLP } from "@/shared/utils/formatters";

interface Props {
  title: string;
  price: number;
  imageUrl: string | null;
}

export function MiComponente({ title, price, imageUrl }: Props) {
  return (
    <article className="...">
      <h2 className="font-serif text-moss">{title}</h2>
      <p className="text-gold">{formatCLP(price)}</p>
    </article>
  );
}
```

```tsx
// Client Component
"use client";

import { useState } from "react";
import { cx } from "class-variance-authority";
import { Button } from "@/shared/ui";

interface Props {
  label: string;
  onConfirm: () => void;
}

export function MiComponenteInteractivo({ label, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  }

  return (
    <Button loading={loading} onClick={handleClick} variant="primary">
      {label}
    </Button>
  );
}
```

---

## Sistema de estilos — Tailwind v4

**No existe `tailwind.config.ts`.** Los tokens viven en `src/app/globals.css` bajo `@theme inline`.

### Clases de color disponibles

```
Fondos:    bg-beige · bg-beige-warm · bg-beige-mid · bg-white
Textos:    text-text · text-text-mid · text-text-light · text-moss · text-gold
Bordes:    border-border · border-border-gold · border-moss · border-gold
Estados:   text-success · text-error · text-info · text-warning
```

### Tipografía

```tsx
// Headings — EB Garamond
<h1 className="font-serif text-[clamp(28px,3vw,40px)] leading-[1.1] tracking-[-0.01em] text-moss" />
<h2 className="font-serif text-[2rem] leading-none text-text" />

// Eyebrow (label pequeño sobre headings)
<p className="text-[9px] uppercase tracking-[0.3em] text-gold" />

// Body
<p className="text-sm font-light leading-[1.7] text-text-light" />

// Precios
<span className="text-[14px] font-medium text-gold">{formatCLP(price)}</span>
<span className="text-[12px] text-text-light line-through">{formatCLP(originalPrice)}</span>
```

### Padding — regla crítica

```tsx
// ✅ CORRECTO — padding horizontal de sección
<section className="page-px py-12">

// ✅ CORRECTO — valor de padding vertical único
<div style={{ paddingTop: "clamp(3rem, 6vw, 5rem)" }}>

// ❌ INCORRECTO — Turbopack + Tailwind v4 no compila esto de forma confiable
<section className="px-5 md:px-10 lg:px-14">
<div className="py-[clamp(3rem,6vw,5rem)]">
```

### Border radius

```tsx
// ✅ Todo el sitio usa 2px
className="rounded"      // → 2px (--radius)

// ✅ Única excepción — hero cards
className="rounded-[16px]"  // → --radius-hero
```

### Clases utilitarias globales (definidas en globals.css)

```css
.page-px          /* padding-inline: clamp(1.25rem, 5vw, 3.5rem) */
.reveal           /* animación de entrada — opacity + translateY */
.reveal.visible   /* activa la animación (via useScrollReveal hook) */
.carousel-nav-btn /* botón prev/next de carruseles */
.cat-track-scroll /* scrollbar oculto para track de categorías */
.hero-wrapper     /* wrapper con padding 14px y esquinas redondeadas en hijo */
.libros-mes-*     /* grid y tipografía escalable de la sección LibrosMes */
```

---

## Componentes disponibles — usar siempre antes de crear nuevos

### `src/shared/ui/`

**Button**
```tsx
import { Button } from "@/shared/ui";

// Variantes: primary | moss | outline | ghost | add-to-cart | secondary
// Tamaños: sm | md | lg
// Props extras: loading, as="a", href

<Button variant="primary" size="md">Comprar</Button>
<Button loading={isLoading} variant="moss">Guardar</Button>
<Button as="a" href="/productos" variant="ghost">Ver todo</Button>
```

**Input** (incluye Textarea)
```tsx
import { Input } from "@/shared/ui";

<Input label="Nombre" error={errors.name?.message} {...register("name")} />
<Input as="textarea" label="Descripción" rows={4} {...register("description")} />
```

**Badge**
```tsx
import { Badge } from "@/shared/ui";

// Variantes: new | sale | info | success | warning | error
<Badge variant="sale">Oferta</Badge>
<Badge variant="new">Nuevo</Badge>
```

**Toast** — via hook
```tsx
import { useToast } from "@/shared/hooks";

const { toast } = useToast();
toast({ message: "Producto agregado al carrito", variant: "success" });
toast({ message: "Error al guardar", variant: "error" });
```

**SectionHeader**
```tsx
import { SectionHeader } from "@/shared/ui";

<SectionHeader eyebrow="Novedades" title="Lo último en tienda" />
```

**Separator**
```tsx
import { Separator } from "@/shared/ui";
<Separator />  // línea decorativa con acento gold
```

### `src/features/admin/components/` (solo en páginas del admin)

```tsx
import {
  AdminTable,
  AdminStatusPill,
  AdminMetricCard,
  AdminToggle,
  AdminUploadZone,
  AdminSidebar,
  AdminTopbar,
} from "@/features/admin/components";

// Estado visual de órdenes
<AdminStatusPill status="paid" />     // verde
<AdminStatusPill status="pending" />  // amarillo
<AdminStatusPill status="cancelled"/> // rojo

// Métrica del dashboard
<AdminMetricCard label="Ventas hoy" value={formatCLP(stats.salesToday)} />

// Upload de imagen con preview
<AdminUploadZone onFileSelect={handleFile} accept="image/*" />
```

---

## Zustand — carrito

```tsx
"use client";

import { useCart, useCartSummary, useCartItem } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";

function MiComponente({ productId }: { productId: string }) {
  const hydrated = useCartHydration();
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { totalItems, subtotal, total } = useCartSummary();
  const itemEnCarrito = useCartItem(productId);

  // ✅ Esperar hidratación antes de renderizar contenido dependiente del carrito
  if (!hydrated) return <Skeleton />;

  // ✅ addItem siempre agrega 1 unidad
  addItem({ productId, title, slug, author, price, originalPrice, imageUrl, sku });

  // ✅ Para cantidades específicas: addItem + updateQuantity
  addItem(cartItem);
  updateQuantity(productId, 3);
}
```

---

## Formularios con React Hook Form + Zod

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/shared/ui";

const Schema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
});

type SchemaInput = z.infer<typeof Schema>;

export function MiFormulario() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchemaInput>({ resolver: zodResolver(Schema) });

  async function onSubmit(data: SchemaInput) {
    const res = await fetch("/api/mi-ruta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // manejar respuesta...
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nombre" error={errors.nombre?.message} {...register("nombre")} />
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Button loading={isSubmitting} type="submit">Enviar</Button>
    </form>
  );
}
```

---

## Imágenes

```tsx
import Image from "next/image";

// ✅ Imagen de producto con fallback
{mainImageUrl ? (
  <Image
    alt={title}
    className="object-cover"
    fill
    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
    src={mainImageUrl}
  />
) : (
  <FallbackIcon />
)}

// ✅ LCP (above the fold) — agregar priority
<Image priority src={heroSlide.imageUrl} alt="..." fill />

// ✅ Imágenes de Supabase Storage — ya configuradas en next.config.ts
// No agregar dominios manualmente
```

---

## Fetch desde Client Components

```tsx
"use client";

import { useState, useEffect } from "react";

export function ListaConFetch() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mi-recurso")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setData(json.data);
        else setError(json.message ?? "Error");
      })
      .catch(() => setError("Error de red"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <p className="text-error text-sm">{error}</p>;
  return <div>{data.map((item) => <Row key={item.id} {...item} />)}</div>;
}
```

---

## Formateo de datos

```tsx
import { formatCLP, formatDate } from "@/shared/utils/formatters";

formatCLP(12500)            // → "$12.500"
formatDate(new Date())      // → "14/03/2026 15:30"
```

---

## Animación de entrada

```tsx
import { useScrollReveal } from "@/shared/hooks";

export function MiCard() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="reveal" ref={revealRef}>
      {/* Se anima al entrar en el viewport */}
    </div>
  );
}
```

---

## Lo que NO hacer en este dominio

```tsx
// ❌ 'use client' sin necesidad
"use client";
export function TituloBásico() {
  return <h1>Hola</h1>; // no necesita client
}

// ❌ Padding con clases responsivas anidadas
<section className="px-5 md:px-10 lg:px-14">  // usar .page-px

// ❌ Queries a la BD desde componentes
import { db } from "@/integrations/drizzle/client"; // en un componente → nunca

// ❌ TopBanner desde barrel
import { TopBanner } from "@/shared/ui";  // arrastra Drizzle al cliente

// ❌ addItem con quantity
addItem({ ...item, quantity: 3 });  // siempre agrega 1

// ❌ Usar carrito sin esperar hidratación
const { items } = useCart(); // renderizar inmediatamente → mismatch SSR
// ✅ Siempre: const hydrated = useCartHydration(); if (!hydrated) return null;

// ❌ Float para precios en UI
price.toFixed(2)  // los precios CLP son enteros
```

---

*Agente frontend — Crecer Librería Cristiana — Abril 2026*
