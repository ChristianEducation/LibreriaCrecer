# Corrección 4B.1b — LibrosMesSection: flechas en portadas y ajustes visuales

## Contexto
Corrección sobre la Tarea 4B.1 ya ejecutada. El componente `LibrosMesSection` necesita los siguientes ajustes visuales para quedar fiel al mockup aprobado.

Leer el archivo `FASE-4B-Planificacion.md` antes de comenzar. **No tocar colores.**

## Archivos a modificar

- `src/features/catalogo/components/LibrosMesSection.tsx`
- `src/app/globals.css` — solo tokens `.libros-mes-*`

## Cambios requeridos

### 1. Título — cambiar "Libros del mes" por "Selección del mes"

En `LibrosMesSection.tsx` cambiar:
```jsx
<h2 ...>
  Libros
  <br />
  del mes
</h2>
```
Por:
```jsx
<h2 ...>
  Selección
  <br />
  del mes
</h2>
```

### 2. Flechas — mover del sidebar al área de portadas

**Estado actual:** Los botones prev/next están debajo del texto del sidebar (columna izquierda).

**Estado deseado:** Las flechas flanquean el área de portadas — flecha izquierda a la izquierda de las portadas, flecha derecha a la derecha. Centradas verticalmente respecto a las portadas. El sidebar queda limpio, sin botones.

La estructura del grid debe cambiar de:
```
[sidebar con texto + botones] | [portadas]
```
A:
```
[sidebar con texto] | [‹] [portadas] [›]
```

Implementación: el área derecha del grid pasa a ser un `div` con `display: flex; align-items: center; gap: 0` que contiene:
- Botón prev (flecha izquierda)
- El track de portadas (overflow hidden, flex)
- Botón next (flecha derecha)

Los botones usan el mismo estilo actual (`libros-mes-btn`) — cuadrados con borde, hover moss.

### 3. Tamaño de portadas — aumentar

Actualizar en `globals.css`:
```css
--lm-card-w: clamp(9rem, 13vw, 13rem);
```

Esto lleva las portadas a ~130px–208px de ancho. Con `aspect-ratio: 2/3` la altura será ~195px–312px — proporción similar al mockup aprobado.

### 4. Altura de la sección — similar al hero

El hero tiene `height: 88vh`. Esta sección debe tener `min-height: 75vh` para ocupar aproximadamente el 85% de esa altura y tener personalidad propia al hacer scroll.

En `LibrosMesSection.tsx` agregar `min-height: [75vh]` a la `<section>` principal y `align-items: center` al grid para que el contenido quede centrado verticalmente:

```jsx
<section className="bg-white" id="libros-mes" style={{ minHeight: '75vh' }}>
```

O usando Tailwind: agregar `min-h-[75vh]` a la className de la section.

### 5. Padding de la sección — aumentar para que respire

Actualizar en `globals.css`:
```css
padding: clamp(3.5rem, 6vw, 5rem) clamp(1.25rem, 4vw, 3.5rem);
```

### 5. Gap entre sidebar y área de portadas

Actualizar en `globals.css`:
```css
--lm-gap: clamp(2rem, 4vw, 5rem);
```

## Resultado esperado

- Título dice "Selección del mes"
- Sidebar limpio: eyebrow + título + descripción, sin botones
- Flechas a izquierda y derecha de las portadas, centradas verticalmente
- Portadas más grandes y con más aire
- La sección se ve con personalidad propia al hacer scroll

## Verificación

```bash
npx tsc --noEmit
npm run lint
```
Ambos deben pasar sin errores.
