# PROMPT CATEGORÍA 1 — IDENTIDAD & CARGA
**Proyecto:** Crecer Librería Cristiana  
**Fecha:** 15 Abril 2026  
**Tarea:** Logo real + Loader de marca (splash screen + confirmación de pago)

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz del proyecto)
2. Lee `docs/MASTER-PROMPT.md`
3. Lee `docs/agentes/frontend.md`
4. Lee `docs/agentes/design-system.md`

Confirma con: *"Contexto absorbido. Stack: Next.js 15 + Drizzle + Supabase + Tailwind v4. Esperando instrucción."*

---

## CONTEXTO

El proyecto usa actualmente un componente `BrandMark()` hardcodeado (una cruz de oro dibujada en código) como logotipo. Se reemplazará por el logo real de Crecer Librería Cristiana.

Adicionalmente, se creará un **loader de marca** (`BrandLoader`) que reemplaza todos los estados de carga genéricos del sitio. Este loader mostrará el logo animado y se usará en dos lugares:
1. **Splash screen** al entrar al sitio (`/`)
2. **Pantalla de espera** en la página de confirmación de pago (reemplaza el polling visual actual)

La animación CSS del loader **será provista por Christian en un paso posterior**. El componente debe quedar estructuralmente listo con un slot claramente marcado para insertar esa animación.

---

## TAREA 1.1 — LOGO REAL

### Archivo fuente
Christian colocará el archivo en `/public/images/logo.png`.  
Si se requiere versión SVG (por ejemplo para escalar sin pérdida en splash grande), solicitársela a Christian.

### Componente a crear
**Archivo:** `src/shared/ui/Logo.tsx`

```tsx
// Componente Logo reutilizable con variante de tamaño
// Props: size = "navbar" | "admin" | "splash"
// navbar → height: 40px
// admin  → height: 32px
// splash → height: 140px
```

El componente usa `next/image` con las dimensiones correctas por variante. El `width` se calcula automáticamente respetando el aspect ratio (usar `width={0} height={XX} style={{ width: "auto" }}`).

### Reemplazos

Localizar todos los usos de `BrandMark` en el proyecto y reemplazarlos por `<Logo size="navbar" />` o la variante correspondiente:

| Archivo | Variante |
|---|---|
| `src/shared/ui/Navbar.tsx` | `navbar` |
| Cualquier componente admin con BrandMark | `admin` |

### Verificación
- El logo se ve en navbar (desktop y mobile)
- El logo se ve en el sidebar o topbar del admin
- Sin distorsión de aspect ratio
- Sin layout shift (usar `width` y `height` explícitos o `style={{ width: "auto" }}`)

---

## TAREA 1.2 — LOADER DE MARCA (BrandLoader)

### Componente a crear
**Archivo:** `src/shared/ui/BrandLoader.tsx`

Este es un componente Client (`"use client"`) que ocupa la pantalla completa (`fixed inset-0 z-50`) con fondo `var(--color-beige)` (`#f5f3e8`).

**Estructura del componente:**

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         [Logo splash, 140px]        │
│                                     │
│    ┌──────────────────────────┐     │
│    │  SLOT ANIMACIÓN CSS      │     │  ← Aquí va la animación de Christian
│    │  (barra dorada)          │     │
│    └──────────────────────────┘     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

El componente acepta opcionalmente un `className` para ajustes puntuales.

**Estructura de clases:**
- Fondo: `bg-beige` (usa variable CSS, no hardcodear hex)
- Centrado: `flex flex-col items-center justify-center gap-5`
- Logo: `<Logo size="splash" />`
- Slot de animación: `<div className="brand-loader__animation">` — aquí Christian insertará su CSS de animación

**El slot ya tiene el código real de la animación. Insertar lo siguiente:**

JSX en `BrandLoader.tsx`:
```tsx
{/* ANIMACIÓN DE MARCA — logo SVG animado */}
<div className="flex items-center justify-center p-8 bg-zinc-950 rounded-full shadow-2xl brand-loader-container">
  <svg viewBox="0 0 500 500" className="w-72 h-72 brand-logo-svg" xmlns="http://www.w3.org/2000/svg">
    <g className="anim-central-symbol" fill="#bfa370">
      <path d="..." className="rope-left" />
      <path d="..." className="rope-right" />
      <circle cx="..." cy="..." r="..." className="central-dot" />
    </g>
    <g className="anim-text-top" fill="#bfa370">
      <path d="..." className="l-c1" />
      <path d="..." className="l-r1" />
      <path d="..." className="l-e1" />
      <path d="..." className="l-c2" />
      <path d="..." className="l-e2" />
      <path d="..." className="l-r2" />
    </g>
    <g className="anim-text-bottom" fill="#bfa370">
      <path d="..." className="l-inf" />
    </g>
  </svg>
</div>
```

CSS al final de `src/app/globals.css`:
```css
/* --- ANIMACIÓN BRAND LOADER --- */
@keyframes letterEntry {
  0%   { opacity: 0; transform: translateY(-20px) rotate(-15deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0deg); }
}
@keyframes ropeLeftIn {
  0%   { opacity: 0; transform: translateX(-40px) scale(0.8); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes ropeRightIn {
  0%   { opacity: 0; transform: translateX(40px) scale(0.8); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes finalLogoReveal {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
.anim-central-symbol .rope-left  { animation: ropeLeftIn 1s ease-out forwards; }
.anim-central-symbol .rope-right { animation: ropeRightIn 1s ease-out 0.2s forwards; }
.anim-central-symbol .central-dot { opacity: 0; animation: finalLogoReveal 0.5s ease-out 1.2s forwards; }
.anim-text-top path { opacity: 0; animation: letterEntry 0.6s ease-out forwards; }
.anim-text-top path:nth-child(1) { animation-delay: 1.4s; }
.anim-text-top path:nth-child(2) { animation-delay: 1.5s; }
.anim-text-top path:nth-child(3) { animation-delay: 1.6s; }
.anim-text-top path:nth-child(4) { animation-delay: 1.7s; }
.anim-text-top path:nth-child(5) { animation-delay: 1.8s; }
.anim-text-top path:nth-child(6) { animation-delay: 1.9s; }
.anim-text-bottom { opacity: 0; animation: finalLogoReveal 1s ease-out 2.2s forwards; }
```

**Nota:** Los `d="..."` del SVG son placeholders — reemplazar con los paths reales del logo al tenerlos.

---

## TAREA 1.3 — SPLASH SCREEN en `/`

### Comportamiento
- Se muestra **siempre** al entrar a la ruta `/` (home)
- Dura exactamente **3.5 segundos** antes de mostrar el contenido (para que la animación del logo complete su ciclo)
- Durante esos 3.5 segundos, el contenido del landing está montado pero oculto (`opacity-0` o `visibility: hidden`) — no bloqueado en el DOM
- Al terminar, el loader hace fade out y el contenido aparece

### Implementación

**Archivo a modificar:** `src/app/(store)/page.tsx` (página del landing)

Agregar un wrapper Client Component que maneje el estado del splash:

**Archivo a crear:** `src/features/landing/components/LandingWithSplash.tsx`

```tsx
"use client";
// Muestra BrandLoader durante 2000ms, luego revela el contenido
// Usa useState(true) para isSplashVisible
// useEffect con setTimeout(3500) para setIsSplashVisible(false)
// Retorna: BrandLoader (si isSplashVisible) + children (siempre montados, ocultos si splash activo)
```

La página `(store)/page.tsx` envuelve su contenido con `<LandingWithSplash>`.

### Consideraciones
- El contenido del landing **se monta inmediatamente** (para no retrasar la carga real) pero está visualmente oculto durante el splash
- Usar `aria-hidden` en el contenido mientras el splash está activo
- El BrandLoader tiene `aria-label="Cargando Crecer Librería Cristiana"`

---

## TAREA 1.4 — REEMPLAZAR LOADER EN CONFIRMACIÓN DE PAGO

### Contexto actual
`src/features/checkout/components/ConfirmacionStatus.tsx` es un Client Component que hace polling cada 3 segundos (hasta 30s timeout) para verificar el estado del pago. Actualmente muestra un spinner genérico durante la espera.

### Cambio
Reemplazar el spinner/loader actual por `<BrandLoader />`.

El BrandLoader **ocupa toda la pantalla** mientras el estado es `"polling"`. Cuando el polling resuelve (éxito o timeout), el BrandLoader se desmonta y se muestra el resultado normal.

### Verificación
- Al llegar a `/confirmacion?token=XXX`, se ve el BrandLoader
- Después del polling (máx 30s), el BrandLoader desaparece y aparece el estado de confirmación (éxito/error/timeout)
- No hay doble loader ni layout shift

---

## CHECKLIST DE VALIDACIÓN

Al terminar, verificar punto por punto:

### Logo
- [ ] `src/shared/ui/Logo.tsx` creado con las 3 variantes de tamaño
- [ ] `BrandMark` reemplazado en Navbar (desktop + mobile)
- [ ] `BrandMark` reemplazado en admin
- [ ] Logo visible y sin distorsión en ambos contextos
- [ ] Sin errores de `next/image` en consola

### BrandLoader
- [ ] `src/shared/ui/BrandLoader.tsx` creado
- [ ] Slot de animación claramente marcado con comentario
- [ ] Placeholder visible (barra dorada estática)
- [ ] Fondo usa variable CSS `--color-beige`

### Splash screen
- [ ] `src/features/landing/components/LandingWithSplash.tsx` creado
- [ ] Splash dura exactamente 3.5 segundos
- [ ] Contenido del landing se monta inmediatamente pero oculto
- [ ] Al terminar el splash, el landing aparece correctamente
- [ ] No hay salto/flash de contenido

### Confirmación de pago
- [ ] `ConfirmacionStatus.tsx` usa `BrandLoader` en lugar del spinner anterior
- [ ] El loader desaparece correctamente al resolver el polling
- [ ] No hay regresión en la lógica de polling (3s / 30s timeout)

### Calidad de código
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Sin uso de `any`
- [ ] Sin `console.log`

---

## NOTAS PARA CHRISTIAN

1. **Logo:** Coloca el archivo en `/public/images/logo.png` antes de correr este prompt
2. **Animación CSS:** Una vez que tengas la animación lista de tu plataforma, busca el comentario `{/* SLOT: Christian inserta aquí la animación CSS */}` en `BrandLoader.tsx` y reemplaza el placeholder por tu animación
3. **Barrel export:** Agregar `Logo` y `BrandLoader` al barrel `src/shared/ui/index.ts`. Ambos son componentes de UI puros (sin imports de Drizzle ni Node.js), por lo que el barrel es seguro para ellos.

---

*Prompt generado: 15 Abril 2026 — Categoría 1 de 5*
