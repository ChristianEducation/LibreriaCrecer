# PROMPT — 4 mejoras UX atómicas (post-auditoría)

Estas 4 tareas son **independientes entre sí**. Hazlas en orden, pero cada una debe quedar
compilando y pasando lint **antes de pasar a la siguiente** — si algo falla, detente ahí y
repórtalo, no sigas con las demás.

Lectura previa obligatoria (una sola vez, antes de la Tarea 1): `CLAUDE.md` (raíz),
`docs/agentes/frontend.md`, `docs/agentes/design-system.md`.

---

## Tarea 1 — Productos relacionados: priorizar mismo autor

**Archivos a leer primero:** el componente de la ficha de producto que renderiza "productos
relacionados" (buscar en `src/features/catalogo/components/`), y el método del service que
trae esos relacionados (`src/features/catalogo/services/product-service.ts`).

**Cambio:** la query/lógica actual trae relacionados solo por categoría. Cambiar el criterio
de prioridad a:
1. Primero, productos del **mismo autor** (si el producto actual tiene `author` no nulo),
   excluyendo el producto actual, `is_active=true`.
2. Si no alcanza el número deseado de relacionados (mantener el mismo límite que ya existe,
   probablemente 4), completar con productos de la **misma categoría** como hace ahora.
3. Si el producto actual no tiene `author` (NULL), usar directamente el criterio de
   categoría sin cambios.

No cambiar el diseño/markup de la sección, solo la lógica de selección.

**Verificación:** `npx tsc --noEmit` y `npm run lint` limpios. Probar manualmente con un
producto que tenga `author` y otros libros del mismo autor en el catálogo (ej. los 5 de
Carlo Acutis, o los de Walter Riso).

---

## Tarea 2 — Mini-carrito: botones +/- inline

**Archivos a leer primero:** el componente del panel/drawer del carrito (buscar
`CartPanel` o equivalente en `src/features/carrito/` o `src/features/cart/`), y el store de
Zustand del carrito (acciones de actualizar cantidad).

**Cambio:** en cada línea de producto dentro del mini-carrito, agregar botones `-` y `+`
junto a la cantidad, que llamen a la acción existente del store para actualizar cantidad
(no crear una acción nueva si ya existe `updateQuantity` o similar). Si la cantidad llega a
0 con el botón `-`, usar la acción existente de eliminar del carrito (no dejar en 0).

Seguir el estilo visual del design system (botones pequeños, mismo radio/tamaño que otros
controles del carrito).

**Verificación:** `npx tsc --noEmit` y `npm run lint` limpios. Probar: agregar producto,
aumentar/disminuir cantidad desde el mini-carrito, verificar que el total se recalcule, y
que al llegar a 0 el producto se quite del carrito.

---

## Tarea 3 — Banner de envío

**Archivos a leer primero:** cómo se usa `TopBanner` actualmente en el proyecto (recordar:
**se importa directo, nunca vía barrel**). Buscar en qué páginas ya aparece (home, catálogo,
checkout).

**Cambio:** agregar un mensaje de envío visible en la página de catálogo (`/productos`) y/o
en el carrito, usando `TopBanner` (importado directo) con un texto genérico que no dependa
de credenciales de Chilexpress aún configuradas, por ejemplo: "Envío a todo Chile con
Chilexpress · Costo calculado en el checkout". Texto exacto a definir — usar algo neutro que
siga siendo cierto cuando Chilexpress esté activo.

No crear un nuevo componente de banner si `TopBanner` ya sirve para esto — reutilizar.

**Verificación:** `npx tsc --noEmit` y `npm run lint` limpios. Confirmar visualmente en
`/productos` (mobile y desktop) que el banner no se sobreponga con otros elementos
(FloatingCartButton, header).

---

## Tarea 4 — Skeletons de carga

**Archivos a leer primero:** estructura de rutas de `/productos` y `/productos/[slug]` (App
Router) para entender dónde van los `loading.tsx`, y el componente `ProductGrid` (o
equivalente) para replicar su estructura visual en el skeleton.

**Cambio:**
1. Crear `loading.tsx` para la ruta de catálogo (`/productos`): grid de tarjetas skeleton
   (mismo número de columnas que el grid real, proporción de imagen + 2-3 líneas de texto
   tipo `line-clamp`), usando colores grises del design system (no inventar nuevos tokens).
2. Crear `loading.tsx` para la ruta de ficha de producto (`/productos/[slug]`): skeleton con
   bloque de imagen (proporción vertical de portada) + bloques de texto para título, autor,
   precio, descripción.
3. Usar animación `pulse` simple (Tailwind `animate-pulse`), sin librerías nuevas.

**Verificación:** `npx tsc --noEmit` y `npm run lint` limpios. Probar con throttling de red
(DevTools → Slow 3G) en `/productos` y en una ficha de producto, confirmar que el skeleton
aparece antes del contenido real y no hay salto brusco de layout (layout shift) al llegar
los datos.

---

## Cierre
Al terminar las 4, reporte breve: qué se modificó en cada tarea (archivos tocados), y
confirmación de que `npx tsc --noEmit` + `npm run lint` pasan limpio para el proyecto
completo (no solo por tarea).
