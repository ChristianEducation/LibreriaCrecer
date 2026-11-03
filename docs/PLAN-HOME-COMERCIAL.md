# Plan — Home más comercial + página "Regalos con intención"

> Estado (2026-10-24): **código del home, `/regalos`, admin de ocasiones y suscripción escrito, sin commitear y sin imágenes.** `tsc` y `lint` pasan; 13 tests Playwright (home + regalos) pasan. Falta: aplicar la migración `0018_newsletter_subscribers` (no aplicada), cargar productos de ejemplo en las ocasiones, probar la suscripción de punta a punta y generar las imágenes (se hacen al final, definiendo antes qué sale en cada una).
> Origen: la clienta dice que "la página está bien, pero le faltan entradas que te lleven a algo" (más buscados, regalos con intención, primeras comuniones…). La gente no sabe qué comprar en los productos que no son libros.
> Entrega: se construye y se muestra en **localhost** a la clienta; ella decide antes de subir a producción.

---

## 1. Diagnóstico resumido

**Home actual** (`src/app/(store)/page.tsx`): Hero → Selección del mes → Categorías (puzzle) → Recién llegados → Cita → Instagram.

- Todo el home habla de libros. No hay entrada para quien busca un regalo.
- El catálogo ya tiene productos que no son libros (`regalos` 30, `Artesanía religiosa` 48, `Tarjetas` 1) pero el home no los muestra.
- En `src/` no existe el concepto de regalo ni de ocasión.
- **Las 14 categorías tienen `imageUrl = null`** (verificado en `/api/categorias`). Por eso el home usa una imagen panorámica cortada en piezas (puzzle en `CategoryCard.tsx`). Al quitar el puzzle hay que crear 14 imágenes.
- El fallback de `CategoryCard` es café oscuro (`#4a3c02`). Va contra el pedido de paleta crema.
- Resend **ya está integrado** (`src/integrations/email/`) para confirmación de pedido, aviso de venta y alerta de pago. El CLAUDE.md dice "pendiente"; está desactualizado.
- **Higgsfield verificado (2026-10-24):** acceso operativo, plan Plus, 856 créditos.

**Referencia — Librería El Arca** (libreriaelarca.cl, Bsale): menú por ocasión, hero con CTA, carruseles con "Agregar", categorías mezcladas libros+objetos, bloque de temporada (pesebres), suscripción, Webpay visible. Débil en: no tiene bloque de regalos en el home, errores visuales, identidad genérica.

---

## 2. Reglas de diseño (innegociables)

- **Colores:** fondos crema — `--white` (#faf9f4), `--beige` (#f5f3e8), `--beige-warm` (#ede9d4). Dorado solo como acento pequeño.
- **Moss:** solo en texto de títulos. **Nunca como superficie grande.** Sin café oscuro como fondo de tarjetas.
- Overlays sobre fotos: velo crema/blanco claro, no oscuro.
- No inventar colores: solo tokens de `globals.css`.
- CSS-first (ver CLAUDE.md): `.page-px`, padding vertical inline, clases nuevas en `globals.css @layer components`. No confiar en clases Tailwind arbitrarias/responsivas.
- Tipografía y tono reales de `globals.css`. Frases cálidas, sin tono de outlet.

---

## 3. Decisiones confirmadas

### Home (6 bloques + una franja)
1. **Hero**, con una **franja delgada de confianza** debajo (íconos: retiro en Antofagasta · despacho a todo Chile · pago seguro Webpay · WhatsApp). No es una sección.
2. **Regalos con intención:** las 5 tarjetas de ocasión en una fila horizontal, con foto, frase y enlace.
3. **Selección del mes** (sin cambios).
4. **Categorías:** fila horizontal deslizable, una imagen por categoría, las 14.
5. **Más buscados / Recién llegados:** una sola sección con 2 pestañas.
6. **Instagram + suscripción por correo:** un solo bloque a dos columnas.
7. **Cita** al final (opcional; lo primero que se quita si el home se siente largo).

### Entradas de regalos (frases)
| Ocasión | Frase |
|---|---|
| Bautizo | "Para un bautizo" |
| Primera comunión | "Para primera comunión" |
| Confirmación | "Para una confirmación" |
| Matrimonio | "Para un matrimonio" |
| Duelo | "Para quien está de duelo" |
| Navidad (temporal) | "Navidad en Crecer" |

Bajada común: "Un detalle que acompaña".

### Página `/regalos`
- Página con diseño propio y cuidado (si funciona, después se le da el mismo upgrade a `/productos`).
- **Barra lateral** para elegir la ocasión y filtros (precio, tipo de producto, orden, y los demás que aplican).
- **Desde el home, cada tarjeta lleva a `/regalos` ya filtrada** por esa ocasión (parámetro en la URL, p. ej. `?ocasion=bautizo`), de modo que también se puede compartir el link.
- Encabezado con "Un detalle que acompaña", fondo crema.
- **Navidad es una ocasión con interruptor en el admin**: se enciende cada año en temporada y se apaga después; solo aparece (en la página y en el home) mientras está encendida.
- Se agrega "Regalos" al menú superior.

### Admin
- La clienta asigna los productos de cada ocasión desde el panel. Se intentará reutilizar `featured_products` (campo `section`) con una sección por ocasión, sin tabla nueva. **A verificar al empezar** si el admin actual lo soporta tal cual.
- Si una ocasión queda sin productos, no importa: la clienta los va cargando después. Para la demo se cargan productos de ejemplo.

### Suscripción
- Con Resend, tabla `newsletter_subscribers`, endpoint, correo de bienvenida y enlace de baja. Detalle en Fase 6.

---

## 4. Roadmap por fases

### Fase 0 — Preparación ✅ parcial
- [x] Higgsfield verificado: acceso OK, plan Plus, 856 créditos.
- [ ] Proponer los prompts de las imágenes y aprobarlos con la usuaria antes de generar.
- [x] `featured_products.section` verificado: es `text` libre y los servicios (`getCuratedProductsAdmin`, `reorderCuratedProducts` en `landing-admin-service.ts`) ya aceptan cualquier sección distinta de `monthly_selection`. **No hace falta tabla nueva** para asignar productos a cada ocasión. Falta adaptar la pantalla `admin/landing/seleccion` y sus rutas API para elegir sección, y definir dónde vive el interruptor de Navidad (candidato: un registro en `landing_section_copy` o un flag propio).
- [ ] Verificar el dominio de envío en Resend (necesario para la demo de suscripción).

### Fase 1 — Imágenes con Higgsfield
**≈ 21 imágenes:** 14 categorías + 5 ocasiones + 1 encabezado de `/regalos` + 1 Navidad.
- Estilo único: bodegón o escena sobria, luz cálida, fondo crema/marfil, madera clara, tela de lino; sin texto dentro de la imagen; sin fondos café/moss oscuros. Formato horizontal 3:2.
- Cada categoría con una imagen que tenga sentido con su nombre; las que no tengan motivo claro usan un estándar común (libros sobre mesa de lino).
- Contenido religioso con respeto; **sin rostros de santos generados**; objetos y escenas: medallas, rosarios, velas, flores, libros.
- Las imágenes de regalos son ambientales: no deben parecer un producto específico a la venta.
- Revisión con la usuaria **antes** de subir. Subida por el admin de categorías (`uploadCategoryImage`, bucket `categories`).

### Fase 2 — Home: franja, regalos, categorías, pestañas
- `TrustStrip` (franja delgada bajo el hero).
- `GiftOccasions` (5 tarjetas horizontales → `/regalos?ocasion=…`).
- `CategoryCarousel`: fila horizontal con `scroll-snap`, flechas en escritorio, deslizable en móvil; fallback crema, sin café; sin contadores "N títulos".
- Quitar el puzzle (`CategoryCard.tsx`, `getCategoriesPanorama` en `page.tsx` y `landing-service.ts`). La pantalla admin `landing/categorias` queda sin uso; decidir luego si se oculta.
- `Más buscados / Recién llegados` con pestañas. "Más buscados" = ventas reales (suma de `quantity` en pedidos pagados, últimos 90 días) con respaldo en `is_featured` mientras haya pocas ventas.

### Fase 3 — Página `/regalos`
- Ruta `app/(store)/regalos/page.tsx` (Server Component) + componentes en `features/catalogo/` (o `features/regalos/`), reutilizando lo que sirva de `CatalogSidebar`, `FilterBar`, `ProductGrid`, `Pagination`, `MobileFiltersDrawer`.
- Filtros por URL (`ocasion`, precio, tipo, orden, página); en móvil, drawer de filtros.
- Estados: ocasión sin productos (mensaje amable + sugerencia de volver a ver otras ocasiones).
- Enlace "Regalos" en el Navbar.
- Responsive completo con clases en `globals.css`.

### Fase 4 — Admin de ocasiones
- Pantalla para elegir los productos de cada ocasión (buscador + orden), y el interruptor de Navidad.
- Reutiliza el patrón del admin de la selección del mes. Try/catch/finally en todos los fetch del cliente.

### Fase 5 — Navidad temporal
- Ocasión con campo de activación (interruptor). Apagada: no aparece en el home ni en `/regalos`.
- Imagen y frase propias.

### Fase 6 — Suscripción por correo (Resend)
- Dónde: bloque junto a Instagram, al final del home.
- Tabla nueva `newsletter_subscribers` (`id`, `email` único, `is_active`, `unsubscribe_token`, `source`, `created_at`).
- `POST /api/newsletter` con Zod, honeypot y límite de frecuencia; si el correo ya existe, responde igual (no filtrar suscriptores).
- Correo de bienvenida con plantilla nueva en estilo crema (`src/integrations/email/`) y enlace de baja.
- Migración Drizzle: seguir la disciplina del proyecto (ver memoria "Disciplina de migraciones Drizzle"). Es `CREATE TABLE`, riesgo bajo; aplicar migración antes de desplegar.
- Para localhost: `RESEND_API_KEY` en `.env.local` (una variable por línea). Si el dominio de envío no está verificado, Resend solo permite enviar a la cuenta del dueño.
- Consentimiento: texto claro de qué recibirán.
- Vista admin de suscriptores y campañas: **fuera de alcance**.

### Fase 7 — QA y revisión con la clienta
- `npx tsc --noEmit` y `npm run lint` sin errores.
- Playwright: actualizar tests del home y categorías que dependan del puzzle o la grilla; agregar pruebas de `/regalos` y las secciones nuevas (scope a `main`).
- Revisión visual en escritorio y móvil (375 px). El dev server a veces no recompila CSS nuevo; reiniciarlo si pasa.
- Demo en localhost. **No se sube a producción hasta que ella decida.**
- Tras su aprobación: commit, deploy y actualizar CLAUDE.md (Resend ya integrado, home y `/regalos` nuevos).

### Fase 8 — Siguiente (si se aprueba)
- Upgrade de `/productos` (colección) con el mismo diseño de `/regalos`.
- Etiqueta de ocasión por producto (un producto → varias ocasiones).
- Vista admin de suscriptores y envío de campañas.

---

## 5. Orden de trabajo

Fase 0 → 1 (imágenes) → 2 → 3 → 4 → 5 → 6 → 7.
Sin imágenes de categoría no se puede juzgar el home; sin `/regalos` las tarjetas del home no tienen destino.

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| Imágenes generadas con aspecto artificial o religiosamente inapropiadas | Solo objetos y escenas sobrias; revisión previa con la usuaria |
| `featured_products` no soporta bien una sección por ocasión | Verificar en Fase 0; si no, tabla pequeña nueva (`gift_occasions` + relación con productos) |
| Ocasiones sin productos al mostrar la demo | Productos de ejemplo cargados para la demo |
| Resend con dominio sin verificar | Verificar antes de la demo |
| Tests Playwright del home/categorías rotos por el cambio | Actualizarlos en Fase 7 |
| Home largo | La cita se puede quitar |
