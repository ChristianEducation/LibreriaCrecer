# Tarea 4.1 — Tokens de diseño y componentes base (shared/ui)

## Contexto
Este es el primer paso de la Fase 4 del proyecto Crecer Librería Cristiana. Las Fases 1–3 están completamente implementadas y validadas — el backend está funcional con APIs, auth admin, CRUD, checkout atómico y Getnet. Ahora comenzamos el frontend público.

Esta tarea es la **fundación visual de todo el proyecto**. Sin ella no se puede construir ningún componente ni página. El objetivo es crear el sistema de diseño completo — tokens, estilos globales y componentes atómicos — que todas las demás tareas de la Fase 4 consumirán.

## Decisiones de diseño ya tomadas

El sistema visual fue revisado y aprobado con el diseñador. Los valores que se listan a continuación son definitivos — NO usar los valores originales del HTML del diseñador que difieren de estos.

### Paleta de tokens

```
beige:       #F5F3E8   → fondo base del sitio
beige-warm:  #EDE9D4   → footer, cards secundarias, superficies cálidas
beige-mid:   #E0DBB8   → bordes suaves, separadores
white:       #FAF9F4   → superficie elevada, secciones blancas
moss:        #736002   → botones primarios, íconos, detalles de marca
moss-mid:    #8A7302   → hover de moss
gold:        #C8A830   → acento principal — precios, badges, eyebrows, cruz del logo
gold-light:  #D4B840   → hover de gold
gold-pale:   #E8D060   → fondos dorados muy suaves
text:        #3A3001   → cuerpo principal
text-mid:    #6B5A04   → textos secundarios
text-light:  #8A7830   → labels, hints, placeholders
border:      rgba(115,96,2,0.13)    → borde estándar
border-gold: rgba(200,168,48,0.3)   → borde dorado decorativo
```

Colores de estado (solo se usan en el panel admin):
```
success: #27AE60
error:   #C0392B
info:    #2980B9
warning: #E67E22
```

### Tipografías
- **EB Garamond** — títulos, nombres de marca, precios totales, citas, blockquotes. Pesos: 400 y 500.
- **DM Sans** — todo lo demás: cuerpo, navegación, botones, labels, inputs. Pesos: 300, 400, 500.

### Border radius
- `2px` en absolutamente todo el sistema — inputs, botones, cards, badges, modales.
- Única excepción: el contenedor del hero principal usa `16px`.

---

## Lo que necesito que hagas

### 1. Configurar los tokens en `globals.css` (Tailwind v4)

**IMPORTANTE:** El proyecto usa **Tailwind v4**. No existe `tailwind.config.ts` ni directivas `@tailwind base/components/utilities`. La configuración se hace íntegramente dentro de `src/app/globals.css` usando `@import "tailwindcss"` y el bloque `@theme` de Tailwind v4.

Abrir `src/app/globals.css` (que ya existe con contenido inicial) y **añadir o reemplazar** las secciones necesarias. No eliminar la directiva `@import "tailwindcss"` ni ninguna otra regla de Tailwind v4 que ya exista — solo incorporar los tokens del design system.

El archivo resultante debe contener, en este orden:

```css
/* 1. Directiva Tailwind v4 — mantener la que ya existe en el proyecto */
@import "tailwindcss";

/* 2. Importación de fuentes */
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

/* 3. Tokens del design system — bloque @theme de Tailwind v4 */
@theme {
  /* Colores */
  --color-beige:       #F5F3E8;
  --color-beige-warm:  #EDE9D4;
  --color-beige-mid:   #E0DBB8;
  --color-white:       #FAF9F4;
  --color-moss:        #736002;
  --color-moss-mid:    #8A7302;
  --color-gold:        #C8A830;
  --color-gold-light:  #D4B840;
  --color-gold-pale:   #E8D060;
  --color-text:        #3A3001;
  --color-text-mid:    #6B5A04;
  --color-text-light:  #8A7830;

  /* Estados — solo admin */
  --color-success: #27AE60;
  --color-error:   #C0392B;
  --color-info:    #2980B9;
  --color-warning: #E67E22;

  /* Tipografías */
  --font-serif: "EB Garamond", Georgia, serif;
  --font-sans:  "DM Sans", system-ui, sans-serif;

  /* Border radius */
  --radius:      2px;
  --radius-sm:   2px;
  --radius-md:   2px;
  --radius-lg:   2px;
  --radius-xl:   2px;
  --radius-hero: 16px;

  /* Font size eyebrow */
  --text-eyebrow: 9px;
}

/* 4. Variables CSS globales — para uso directo con var() en estilos inline y CSS custom */
:root {
  --beige:       #F5F3E8;
  --beige-warm:  #EDE9D4;
  --beige-mid:   #E0DBB8;
  --white:       #FAF9F4;
  --moss:        #736002;
  --moss-mid:    #8A7302;
  --gold:        #C8A830;
  --gold-light:  #D4B840;
  --gold-pale:   #E8D060;
  --text:        #3A3001;
  --text-mid:    #6B5A04;
  --text-light:  #8A7830;
  --border:      rgba(115,96,2,0.13);
  --border-gold: rgba(200,168,48,0.3);
}

/* 5. Reset y base */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--beige);
  color: var(--text);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* 6. Scrollbar personalizado */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--beige-mid); border-radius: 2px; }

/* 7. Animación de entrada — scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1),
              transform 0.8s cubic-bezier(0.22,1,0.36,1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Notas sobre Tailwind v4 y el bloque `@theme`:**
- Los tokens definidos en `@theme` generan automáticamente clases de utilidad. Por ejemplo, `--color-moss` genera `bg-moss`, `text-moss`, `border-moss`, etc.
- El prefijo `--color-` es el estándar de Tailwind v4 para colores; `--font-` para tipografías; `--radius-` para border-radius.
- Las variables CSS en `:root` (sin prefijo `--color-`) se mantienen **en paralelo** para poder usarlas con `var(--moss)` en estilos inline, propiedades CSS custom y componentes que no usen clases de Tailwind.
- Si el `globals.css` del proyecto ya tiene una sintaxis ligeramente diferente para el `@theme` (por ejemplo, con `inline` o sin él), **respetar la sintaxis existente** y solo agregar los tokens que falten.

---

### 2. Instalar dependencia

Instalar `class-variance-authority` para gestionar las variantes de los componentes. El proyecto no la tiene aún:

```bash
npm install class-variance-authority
```

---

### 3. Crear los componentes atómicos en `src/shared/ui/`

---

#### `Button.tsx`

Componente base de botones con todas las variantes del sistema.

**Variantes requeridas** (basadas en el HTML del diseñador):

- **`primary`** — fondo gold, texto blanco. Para CTAs principales del hero y carrito.
  ```
  background: var(--gold) | hover: var(--gold-light) | hover: translateY(-1px)
  padding: 13px 32px | font-size: 12px | font-weight: 500
  letter-spacing: 0.1em | text-transform: uppercase | border-radius: 2px
  ```

- **`moss`** — fondo moss, texto blanco. Para el botón de checkout y acciones admin.
  ```
  background: var(--moss) | hover: var(--moss-mid) | hover: translateY(-1px)
  Mismas propiedades tipográficas que primary
  ```

- **`outline`** — borde moss, texto moss, fondo transparente. Para acciones secundarias.
  ```
  border: 1px solid var(--moss) | color: var(--moss) | background: transparent
  hover: background var(--moss), color white
  ```

- **`ghost`** — solo texto con borde inferior. Para "Ver todos →" y links de navegación.
  ```
  color: var(--moss) | border-bottom: 1px solid transparent
  hover: border-bottom-color: var(--moss)
  font-size: 12px | font-weight: 500 | letter-spacing: 0.08em | uppercase
  ```

- **`add-to-cart`** — variante del overlay de las cards de producto.
  ```
  background: var(--gold) | color: white | border: none
  padding: 9px 18px | font-size: 10px | font-weight: 500
  hover: background var(--gold-light) | transform: scale(1.03)
  ```

- **`secondary`** — solo para contexto oscuro (dentro del hero). Texto blanco con borde inferior.
  ```
  color: rgba(255,255,255,0.72) | border-bottom: 1px solid rgba(255,255,255,0.25)
  hover: color var(--gold-light), border-color var(--gold-light)
  ```

Props del componente:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'moss' | 'outline' | 'ghost' | 'add-to-cart' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  as?: 'button' | 'a'   // para usar como link
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
}
```

Implementar con `cva` de `class-variance-authority`. Los estilos de cada variante pueden aplicarse como clases de Tailwind (usando los tokens definidos en `@theme`, por ejemplo `bg-moss`, `text-gold`) o como `style` inline usando `var()`. Usar el método que dé código más limpio — lo importante es que los valores vengan siempre de los tokens y no sean colores hardcodeados.

El componente debe ser un Client Component (`'use client'`) solo si tiene interactividad propia; si no, puede ser un Server Component.

---

#### `Badge.tsx`

Componente para etiquetas de estado sobre las cards de producto y en el admin.

**Variantes:**

- **`new`** — fondo gold, texto blanco. Para productos nuevos.
  ```
  background: var(--gold) | color: white
  font-size: 8px | font-weight: 600 | letter-spacing: 0.1em | uppercase
  padding: 3px 8px | border-radius: 1px
  ```

- **`sale`** — fondo moss, texto blanco. Para productos en oferta.
  ```
  background: var(--moss) | color: white
  Mismas propiedades tipográficas
  ```

- **`success`** — para estados de pedido en admin.
  ```
  background: rgba(39,174,96,0.10) | color: #27AE60
  border: 1px solid rgba(39,174,96,0.25)
  ```

- **`error`** — para estados cancelados.
  ```
  background: rgba(192,57,43,0.08) | color: #C0392B
  border: 1px solid rgba(192,57,43,0.2)
  ```

- **`warning`** — para estados pendientes.
  ```
  background: rgba(230,126,34,0.08) | color: #E67E22
  border: 1px solid rgba(230,126,34,0.2)
  ```

- **`info`** — para estados en preparación.
  ```
  background: rgba(41,128,185,0.08) | color: #2980B9
  border: 1px solid rgba(41,128,185,0.2)
  ```

Props:
```typescript
interface BadgeProps {
  variant: 'new' | 'sale' | 'success' | 'error' | 'warning' | 'info'
  children: React.ReactNode
  className?: string
}
```

---

#### `Input.tsx`

Componente base de inputs para formularios del checkout y admin.

**Especificación visual** (del `checkout.html`):
```
padding: 10px 14px
border: 1px solid var(--border)
border-radius: 2px
font-family: DM Sans | font-size: 14px
color: var(--text) | background: var(--white)
outline: none
transition: border-color 0.22s, box-shadow 0.22s

focus:
  border-color: var(--gold)
  box-shadow: 0 0 0 3px rgba(200,168,48,0.1)

error:
  border-color: var(--error) → #C0392B

placeholder:
  color: var(--text-light)
```

El `label` asociado tiene:
```
font-size: 10px | letter-spacing: 0.18em | text-transform: uppercase
color: var(--text-light)
```

Props:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  wrapperClassName?: string
}
```

Crear también `Textarea.tsx` con los mismos estilos visuales pero para `<textarea>`.

---

#### `SectionHeader.tsx`

Composición de eyebrow + título + descripción opcional. Aparece en todas las secciones del landing.

**Especificación visual** (del `index.html`):
```
/* Eyebrow */
font-family: DM Sans
font-size: 9px | letter-spacing: 0.35em | text-transform: uppercase
color: var(--gold)
display: flex | align-items: center | gap: 12px
::before → width: 24px, height: 1px, background: var(--gold)

/* Título */
font-family: EB Garamond
font-size: clamp(28px, 2.8vw, 42px) | font-weight: 400
color: var(--moss) | line-height: 1.15 | letter-spacing: -0.01em

/* Descripción */
font-size: 14px | color: var(--text-light)
line-height: 1.75 | max-width: 400px | font-weight: 300
margin-top: 12px
```

Props:
```typescript
interface SectionHeaderProps {
  eyebrow?: string
  title: string
  titleEm?: string        // texto en <em> para la parte en cursiva del título
  description?: string
  align?: 'left' | 'center'
  className?: string
}
```

---

#### `Separator.tsx`

Línea decorativa que aparece en el footer y secciones con fondo moss.

```
width: 100% | height: 1px
background: linear-gradient(to right, transparent, rgba(200,168,48,0.3), transparent)
```

---

### 4. Crear el hook `useScrollReveal`

Ubicación: `src/shared/hooks/useScrollReveal.ts`

Este hook implementa el patrón de animación de entrada por scroll que el diseñador usa en todos los cards y secciones del landing.

```typescript
// El hook debe:
// 1. Aceptar una ref de elemento HTML
// 2. Usar IntersectionObserver con threshold: 0.07 y rootMargin: '0px 0px -36px 0px'
// 3. Agregar la clase 'visible' cuando el elemento entra en viewport
// 4. Hacer unobserve después de la primera aparición (animación solo ocurre una vez)

// Uso esperado en componentes:
// const ref = useScrollReveal()
// <div ref={ref} className="reveal">...</div>
```

También crear `useScrollRevealMultiple` para aplicarlo a una lista de elementos con delays escalonados automáticos.

---

### 5. Crear archivos de exportación

`src/shared/ui/index.ts` — re-exportar todos los componentes:

```typescript
export { Button } from './Button'
export { Badge } from './Badge'
export { Input, Textarea } from './Input'
export { SectionHeader } from './SectionHeader'
export { Separator } from './Separator'
```

`src/shared/hooks/index.ts` — re-exportar hooks:

```typescript
export { useScrollReveal, useScrollRevealMultiple } from './useScrollReveal'
```

---

## Reglas importantes

- **El proyecto usa Tailwind v4** — no crear ni modificar `tailwind.config.ts`. Todos los tokens van en `globals.css` dentro del bloque `@theme`. No existe ese archivo en el proyecto y no debe crearse.
- **Todos los tokens de color usan los valores definitivos aprobados**, NO los valores originales del HTML del diseñador (que difieren en el gold y el beige).
- **Los componentes de `shared/ui/` no tienen colores hardcodeados**. Usar clases de Tailwind generadas por `@theme` (ej. `bg-moss`, `text-gold`) o variables CSS con `var()`. Nunca valores de color literales dentro del JSX o CSS modules.
- **`border-radius: 2px` en absolutamente todo**. En Tailwind v4, si `--radius` está definido como `2px` en `@theme`, la clase `rounded` aplicará `2px`. Verificar que esto funcione; si no, usar `style={{ borderRadius: '2px' }}` o la clase específica del proyecto.
- **NO crear componentes de Navbar ni Footer** — eso es la Tarea 4.2.
- **NO crear páginas ni layouts** — eso es la Tarea 4.2.
- **NO modificar ningún archivo de las Fases 1–3** — ni schemas de Drizzle, ni API Routes, ni el store de Zustand.
- Los componentes deben funcionar tanto en Server Components como en Client Components, a menos que necesiten estado propio (en ese caso son Client Components con `'use client'`).
- Cada componente debe tener sus tipos TypeScript definidos con `interface`, no `type`.
- Verificar que `tsc --noEmit` pase sin errores al finalizar.
