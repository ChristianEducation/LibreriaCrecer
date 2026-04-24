# GUÍA DEL DISEÑADOR — Crecer Librería Cristiana

> Lee este archivo completo antes de tocar cualquier cosa.
> Tu Claude Code también debe leerlo al inicio de cada sesión.

---

## Contexto del proyecto

E-commerce de librería católica en Antofagasta, Chile. El cliente final es la comunidad cristiana hispanoparlante — el tono es cálido, editorial y sobrio, no comercial ni recargado.

**Stack:** Next.js 15.2.4 (App Router), TypeScript strict, Tailwind v4, Drizzle ORM, Supabase, Zustand 5, lottie-react.

El proyecto tiene dos áreas:
- **Frontend público** — la tienda que ve el cliente (`src/app/(store)/`)
- **Panel admin** — lo usa solo la dueña (`src/app/admin/`) → no tocar

Tu trabajo es exclusivamente el **frontend público**.

---

## Lo primero que hace tu Claude al iniciar cada sesión

```
Lee DESIGNER.md, CLAUDE.md y docs/agentes/design-system.md antes de comenzar.
Confirma con: "Contexto de diseño absorbido. Esperando instrucción."
```

---

## 🟢 ZONA VERDE — Puedes trabajar libremente

### Páginas públicas
```
src/app/(store)/page.tsx                     ← Landing principal
src/app/(store)/productos/page.tsx           ← Catálogo con filtros
src/app/(store)/productos/[slug]/page.tsx    ← Detalle de producto
src/app/(store)/carrito/page.tsx             ← Carrito
src/app/(store)/categorias/page.tsx          ← Grid de categorías
src/app/(store)/nosotros/page.tsx            ← Página Conócenos (CMS)
src/app/not-found.tsx                        ← Página 404
```

### Componentes del catálogo y landing
```
src/features/catalogo/components/CategoryCard.tsx
src/features/catalogo/components/CategoryCarousel.tsx
src/features/catalogo/components/FilterBar.tsx
src/features/catalogo/components/HeroSlider.tsx
src/features/catalogo/components/InstagramSection.tsx
src/features/catalogo/components/LibrosMesSection.tsx
src/features/catalogo/components/PageHeader.tsx
src/features/catalogo/components/Pagination.tsx
src/features/catalogo/components/ProductGallery.tsx
src/features/catalogo/components/ProductGrid.tsx
src/features/catalogo/components/ProductInfoBlock.tsx
src/features/catalogo/components/QuoteSection.tsx
src/features/catalogo/components/RecentProductsCarousel.tsx
src/features/landing/components/LandingWithSplash.tsx
```

### Assets estáticos
```
public/images/      ← Reemplazar o agregar imágenes libremente
public/animations/  ← NO modificar — es el BrandLoader del sistema
```

---

## 🟡 ZONA AMARILLA — Coordinar con Christian antes de tocar

Estos archivos afectan múltiples partes del proyecto en simultáneo. Un cambio aquí puede romper el checkout, el carrito o el admin sin notarlo.

**Describir exactamente qué se necesita cambiar → Christian lo implementa.**

```
src/shared/ui/Button.tsx             ← Se usa en TODO el sitio
src/shared/ui/Badge.tsx              ← Sistema de badges global
src/shared/ui/Input.tsx              ← Inputs del frontend público
src/shared/ui/Navbar.tsx             ← Afecta todas las páginas públicas
src/shared/ui/Footer.tsx             ← Afecta todas las páginas públicas
src/shared/ui/CartPanel.tsx          ← Panel lateral del carrito (tiene lógica)
src/shared/ui/FloatingCartButton.tsx ← Botón flotante del carrito
src/shared/ui/Toast.tsx              ← Notificaciones globales
src/shared/ui/Logo.tsx               ← Identidad de marca
src/shared/ui/BrandLoader.tsx        ← Loader Lottie del sistema
src/shared/config/brand.ts           ← Configuración de logo y marca
src/app/globals.css                  ← Tokens CSS — afecta TODO el sitio
```

---

## 🔴 ZONA ROJA — No tocar nunca

```
src/app/api/                         ← Todas las API Routes
src/features/*/services/             ← Lógica de negocio
src/features/*/schemas.ts            ← Validación de datos
src/features/carrito/store.ts        ← Estado del carrito (Zustand)
src/features/carrito/hooks.ts        ← Hooks del carrito
src/features/checkout/               ← Todo el flujo de pago
src/integrations/                    ← Getnet, Supabase, Drizzle
src/middleware.ts                    ← Autenticación
src/app/admin/                       ← Todo el panel admin
drizzle.config.ts
src/integrations/drizzle/schema/
src/integrations/drizzle/migrations/
.env.local                           ← NUNCA abrir ni modificar
vercel.json
```

---

## El sistema de diseño — reglas que no se rompen

### Paleta de colores

Sistema **beige + gold + moss**. No introducir colores nuevos sin consultar.

```css
--beige        #f5f3e8   /* Fondo principal del sitio */
--beige-warm   #ede9d4   /* Secciones alternadas, hover suave */
--beige-mid    #e0dbb8   /* Bordes y divisores */
--white        #faf9f4   /* Blanco cálido — cards, inputs */
--moss         #736002   /* Textos importantes, botones secundarios */
--gold         #c8a830   /* Acento principal — precios, botones primarios */
--text         #3a3001   /* Texto body */
--text-mid     #6b5a04   /* Texto secundario */
--text-light   #8a7830   /* Texto terciario, placeholders */
```

En Tailwind: `bg-beige`, `bg-gold`, `text-moss`, `text-gold`, `border-border`, etc.

### Tipografía

- **EB Garamond** (`font-serif`) — títulos y headings
- **DM Sans** (`font-sans`) — todo el resto (default del body)

No agregar fuentes nuevas sin consultar.

### Border radius — estado actual del proyecto

```
rounded        = 2px    ← sistema base, casi todo el sitio
rounded-full   = píldora ← SOLO botones primary, moss, add-to-cart y FloatingCartButton
rounded-[16px]           ← solo el hero wrapper
```

**Nunca usar** `rounded-md`, `rounded-lg`, `rounded-xl`.

### Padding horizontal — regla crítica

```tsx
✅ <section className="page-px">          /* siempre */
❌ <section className="px-5 md:px-10">   /* nunca */
```

### Padding vertical de secciones

```tsx
✅ <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
❌ <section className="py-20">   /* Tailwind v4 + Turbopack no lo compila */
```

---

## Componentes disponibles — usar siempre estos, no reimplementar

```tsx
// Botón
import { Button } from "@/shared/ui";
<Button variant="primary">Texto</Button>      // gold, píldora — CTA principal
<Button variant="moss">Texto</Button>         // moss, píldora — acción secundaria
<Button variant="outline">Texto</Button>      // borde moss, fondo transparente
<Button variant="ghost">Texto</Button>        // texto con borde inferior
<Button variant="add-to-cart">Agregar</Button>// gold — solo en ProductCard
<Button loading={true}>                       // spinner + disabled automático
<Button as="a" href="/ruta">                  // renderiza como enlace

// Badge
import { Badge } from "@/shared/ui";
<Badge variant="new">Nuevo</Badge>
<Badge variant="sale">Oferta</Badge>
<Badge variant="success">OK</Badge>
<Badge variant="warning">Atención</Badge>

// Input
import { Input, Textarea } from "@/shared/ui";
<Input label="Nombre" error={errors.nombre?.message} {...register("nombre")} />
<Textarea label="Descripción" rows={4} {...register("descripcion")} />

// Encabezado de sección
import { SectionHeader } from "@/shared/ui";
<SectionHeader eyebrow="Novedades" title="Lo último" titleEm="en tienda" />
<SectionHeader eyebrow="Categorías" title="Explora" align="center" />

// Separador decorativo dorado
import { Separator } from "@/shared/ui";
<Separator />

// Loader del sistema — siempre este, nunca spinners genéricos
import { BrandLoader } from "@/shared/ui/BrandLoader";
<BrandLoader className="h-8 w-8" />
```

### Animación de entrada al viewport

```tsx
import { useScrollReveal } from "@/shared/hooks";

const ref = useScrollReveal<HTMLDivElement>();
<div className="reveal" ref={ref}>
  {/* Aparece con fade suave al entrar al viewport */}
</div>
```

### Eyebrow con línea decorativa (patrón del sitio)

```tsx
<p className="flex items-center gap-[10px] text-[9px] uppercase tracking-[0.3em] text-gold">
  <span className="h-px w-5 bg-gold" />
  <span>Novedades</span>
</p>
```

---

## Íconos — solo SVG inline

El proyecto no usa librerías de íconos. Siempre SVG inline con estas convenciones:

```tsx
<svg
  aria-hidden="true"
  className="size-4"
  fill="none"
  viewBox="0 0 24 24"
>
  <path
    d="..."
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
```

---

## Reglas de código — obligatorias

- **TypeScript strict** — nunca usar `any`
- **Archivos siempre completos** — nunca escribir `// ... existing code`
- **Leer el archivo antes de modificarlo** — siempre
- **Al terminar:** `npx tsc --noEmit` y `npm run lint` sin errores nuevos
- **Solo light mode** — no implementar dark mode
- **No instalar librerías nuevas** sin consultarle a Christian
- **Server Components por defecto** — agregar `"use client"` solo cuando se use `useState`, `useEffect`, `useRouter` o Zustand
- **`console.log` prohibido** — usar `console.warn` o `console.error`
- **`TopBanner` importar directo** — nunca desde el barrel:
  ```tsx
  ✅ import { TopBanner } from "@/shared/ui/TopBanner";
  ❌ import { TopBanner } from "@/shared/ui";
  ```

---

## Checklist antes de marcar una tarea como lista

- [ ] `npx tsc --noEmit` sin errores
- [ ] `npm run lint` sin errores nuevos
- [ ] Revisado visualmente en 375px (móvil) y 1280px (desktop)
- [ ] No se tocó ningún archivo de zona roja
- [ ] Si se tocó un archivo amarillo, se coordinó con Christian primero

---

*Guía del diseñador — Crecer Librería Cristiana — Abril 2026*
