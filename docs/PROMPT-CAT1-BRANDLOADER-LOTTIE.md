# PROMPT — CAMBIO DE ANIMACIÓN EN BRANDLOADER (Lottie + Logo centrado)
**Proyecto:** Crecer Librería Cristiana  
**Fecha:** 17 Abril 2026  
**Tarea:** Reemplazar animación placeholder en BrandLoader por Lottie con logo centrado

---

## LECTURA OBLIGATORIA ANTES DE EMPEZAR

1. Lee `CLAUDE.md` (raíz del proyecto)
2. Lee `docs/agentes/frontend.md`
3. Lee `docs/agentes/design-system.md`

Confirma con: *"Contexto absorbido. Stack: Next.js 15 + Drizzle + Supabase + Tailwind v4. Esperando instrucción."*

---

## CONTEXTO

`src/shared/ui/BrandLoader.tsx` ya existe y funciona correctamente. Se usa en dos lugares:
1. **Splash screen** al entrar a `/` (vía `LandingWithSplash.tsx`)
2. **Pantalla de espera** en confirmación de pago (`confirmacion/page.tsx`)

El componente tiene actualmente un SVG con paths placeholder y animación CSS. Se reemplaza **únicamente la animación** — el resto del componente, la lógica de splash, y la integración en confirmación de pago **no se tocan**.

Al modificar solo `BrandLoader.tsx`, ambas pantallas quedan actualizadas automáticamente.

---

## PASO 1 — Instalar dependencia

```bash
npm install lottie-react
```

---

## PASO 2 — Confirmar archivo Lottie

Verificar que existe:
```
public/animations/Loader_16.json
```

Si no existe, detener y avisar a Christian para que lo coloque ahí antes de continuar.

---

## PASO 3 — Editar colores del JSON Lottie

El archivo JSON tiene todos los strokes en negro `[0,0,0,1]`. Reemplazarlos por el gold del proyecto (`#C9A84C` = `[0.788, 0.659, 0.298, 1]`).

Ejecutar este script Node.js desde la raíz del proyecto:

```js
const fs = require('fs');
const path = require('path');

const filePath = path.join('public', 'animations', 'Loader_16.json');
const content = fs.readFileSync(filePath, 'utf8');

const updated = content.replaceAll(
  '"k":[0,0,0,1]',
  '"k":[0.788,0.659,0.298,1]'
);

fs.writeFileSync(filePath, updated, 'utf8');
console.log('✅ Colores actualizados en Loader_16.json');
```

Verificar que el script reporta éxito antes de continuar.

---

## PASO 4 — Modificar BrandLoader.tsx

**Archivo:** `src/shared/ui/BrandLoader.tsx`

Reemplazar la sección de animación actual (el SVG con paths y su wrapper div) por la nueva estructura con Lottie y logo superpuesto.

**Estructura visual objetivo:**
```
┌─────────────────────────────────────┐
│                                     │
│       ┌─────────────────────┐       │
│       │  [Lottie girando]   │       │
│       │     [LOGO centro]   │       │  ← logo absoluto, estático
│       └─────────────────────┘       │
│                                     │
└─────────────────────────────────────┘
```

**Implementación:**

```tsx
import Lottie from 'lottie-react';
import loaderAnimation from '../../../public/animations/Loader_16.json';

// Dentro del componente, reemplazar la sección de animación por:
<div style={{ position: 'relative', width: 220, height: 220 }}>
  {/* Animación Lottie girando */}
  <Lottie
    animationData={loaderAnimation}
    loop={true}
    autoplay={true}
    style={{ width: '100%', height: '100%' }}
  />
  {/* Logo centrado sobre la animación */}
  <div style={{
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Logo size="splash" />
  </div>
</div>
```

**Notas:**
- Sin filtros CSS — el color ya viene correcto desde el JSON editado en el paso anterior
- El Logo queda estático; la animación Lottie gira alrededor de él
- Ajustar el tamaño del logo si visualmente queda muy grande dentro del círculo — usar `style={{ height: 70 }}` inline si es necesario

---

## PASO 5 — Limpiar globals.css

Eliminar del final de `src/app/globals.css` el bloque completo marcado con:

```css
/* --- ANIMACIÓN BRAND LOADER --- */
```

Esto incluye todos los `@keyframes` (letterEntry, ropeLeftIn, ropeRightIn, finalLogoReveal) y todas las clases `.anim-*`, `.brand-loader-*`.

---

## CHECKLIST DE VALIDACIÓN

### Animación
- [ ] Splash screen (`/`) muestra animación Lottie girando con logo centrado encima
- [ ] Confirmación de pago muestra la misma animación
- [ ] Color de la animación es dorado (`#C9A84C`), no negro
- [ ] La animación hace loop continuo mientras el loader está visible

### Limpieza
- [ ] No quedan rastros del SVG placeholder en `BrandLoader.tsx`
- [ ] No quedan los keyframes anteriores en `globals.css`

### Calidad de código
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Sin errores de hidratación SSR (`BrandLoader` ya tiene `"use client"`, lottie-react es client-only)
- [ ] Sin `console.log`

---

## NOTAS PARA CHRISTIAN

- Coloca `Loader_16.json` en `public/animations/` **antes** de ejecutar este prompt
- No es necesario tocar `LandingWithSplash.tsx` ni `confirmacion/page.tsx` — ambos ya usan `BrandLoader` y heredan el cambio automáticamente
- El tamaño del logo dentro de la animación puede requerir ajuste visual fino después de ver el resultado en el navegador

---

*Prompt generado: 17 Abril 2026*
