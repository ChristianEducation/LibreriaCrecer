# Tarea 4B.1 — LibrosMesSection: fidelidad visual al diseñador

## Contexto
Esta tarea es parte de la Fase 4B del proyecto Crecer Librería Cristiana. Leer `FASE-4B-Planificacion.md` antes de comenzar para entender el contexto completo.

El objetivo es corregir la sección "Selección del mes" (`LibrosMesSection`) para que se vea lo más fiel posible al diseño del diseñador en `docs/index.html` (sección `.libros-mes`). Actualmente la sección tiene problemas de proporciones y un wrapper innecesario que la hace ver como una caja dentro de otra caja.

**Leer `docs/index.html` antes de hacer cualquier cambio**, específicamente las clases `.libros-mes`, `.libros-mes-layout`, `.libro-card`, `.libro-img`, `.slider-controls`, `.slider-btn`.

## Archivos a modificar

- `src/features/catalogo/components/LibrosMesSection.tsx` — componente principal
- `src/app/globals.css` — solo los tokens del bloque `.libros-mes-*` dentro de `@layer components`

**NO modificar:**
- Colores en `@theme inline` ni en `:root` — los colores están aprobados y son definitivos
- Ningún otro componente ni servicio
- El tipo `CuratedProduct` en `src/features/catalogo/types.ts`

## Problema 1 — Eliminar el wrapper doble

La estructura actual es:
```jsx
<section className="bg-white p-[14px]">
  <div className="libros-mes-panel ... rounded-[var(--lm-radius)] bg-beige">
    <div className="libros-mes-inner">
      ...
    </div>
  </div>
</section>
```

Esto crea un panel beige redondeado flotando sobre fondo blanco — el diseñador **no tiene esto**. El diseñador tiene la sección directamente sobre `var(--white)` sin panel interior ni border-radius en el contenedor.

La estructura correcta debe ser:
```jsx
<section className="bg-white ..." id="libros-mes">
  <div className="libros-mes-inner ...">
    <div className="libros-mes-grid">
      ...
    </div>
  </div>
</section>
```

Eliminar completamente el `div.libros-mes-panel` y su `bg-beige` / `rounded`. El fondo de la sección es `bg-white` directamente. Eliminar también el token `--lm-radius` de `globals.css` ya que no se usará más.

## Problema 2 — Proporciones y espaciado

El diseñador tiene esta sección con:
- Padding: `80px 56px` en desktop
- Sidebar de texto con ancho fijo `280px`, grid de dos columnas `280px 1fr`
- Portadas de libro con ancho de `160px` (proporción `2/3` → altura ~240px)
- Gap entre cards: `20px`
- La sección se ve amplia, con aire, portadas de tamaño razonable

Los tokens actuales en `globals.css` usan container queries (`cqi`) que dependen del ancho del `.libros-mes-panel` (que se elimina). Al eliminar ese contenedor, los `cqi` quedarán sin referencia correcta.

Reemplazar el sistema de container queries por un sistema con `clamp()` basado en viewport (`vw`) y valores fijos, alineado con los valores del diseñador:

```css
.libros-mes-inner {
  /* padding alineado con el diseñador: 80px vertical, 56px horizontal en desktop */
  padding: clamp(2.5rem, 5vw, 5rem) clamp(1.25rem, 4vw, 3.5rem);
  max-width: 87.5rem;
  margin-inline: auto;
  width: 100%;
}

.libros-mes-grid {
  display: grid;
  gap: clamp(1.5rem, 3vw, 4rem);
}

/* En desktop: sidebar fijo 280px + slider */
@media (min-width: 64rem) {
  .libros-mes-grid {
    grid-template-columns: clamp(12rem, 20vw, 17.5rem) minmax(0, 1fr);
    align-items: start;
  }
}

/* Ancho de tarjeta alineado con el diseñador (~160px), con algo de flexibilidad */
.libros-mes-card {
  flex: 0 0 clamp(8.5rem, 12vw, 11rem);
  width: clamp(8.5rem, 12vw, 11rem);
}
```

Ajustar todos los demás tokens (eyebrow, title, body, btn, icon, brand, libro-title, price, card-gap, card-mb, eyebrow-line) para que sean `clamp()` con `vw` en vez de `cqi`. Mantener las mismas proporciones tipográficas que tenían, solo cambiar la unidad de referencia.

## Problema 3 — Estado vacío (placeholder)

Cuando `items.length === 0`, mostrar un placeholder elegante dentro del área del slider:

```
[ ícono de libro tenue ]
Sin selección este mes
Próximamente una curaduría especial de títulos seleccionados.
```

El placeholder debe:
- Tener `min-height` similar a la que tendría con 5 libros (~`240px`)
- Borde punteado sutil con `border-border`
- Fondo `bg-beige-warm/40`
- Texto centrado, tipografía del sitio (serif para el título, sans para el subtexto)
- Ícono de libro tenue (el mismo SVG de libro que ya usa `BookTile` pero más grande y con `opacity-10`)
- Verse elegante para presentación al cliente

El sidebar de texto (título "Libros del mes", descripción) **siempre visible**, incluso cuando está vacío.
Los botones prev/next se ocultan cuando `items.length === 0`.

## Resultado esperado

- **Con 5+ productos**: se ve igual o muy similar a `docs/index.html` — portadas bien proporcionadas, espaciado generoso, sidebar a la izquierda
- **Con 1 producto**: el único libro se muestra solo a la izquierda del área, sin distorsión
- **Con 0 productos**: placeholder elegante en el área del slider, sidebar visible

## Verificación

```bash
npx tsc --noEmit
npm run lint
```
Ambos deben pasar sin errores.
